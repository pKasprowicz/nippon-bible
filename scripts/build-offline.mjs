// Prepares a site folder for offline use: lists every file in precache.json and stamps
// sw.js with a hash of the contents, so a changed site gets a new service worker.
// Run: node scripts/build-offline.mjs _site
import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative, sep } from 'node:path';
import { createHash } from 'node:crypto';

const root = process.argv[2];
if (!root) { console.error('usage: node scripts/build-offline.mjs <site-dir>'); process.exit(1); }
const SKIP = new Set(['sw.js', 'precache.json']);
const walk = (dir) => readdirSync(dir).flatMap((name) => {
  const p = join(dir, name);
  return statSync(p).isDirectory() ? walk(p) : [p];
});
const files = walk(root).map((p) => relative(root, p).split(sep).join('/'))
  .filter((f) => !SKIP.has(f) && !f.startsWith('.')).sort();
const hash = createHash('sha256');
for (const f of files) hash.update(f + '\0').update(readFileSync(join(root, f)));
const build = hash.digest('hex').slice(0, 12);
const version = readFileSync(join(root, 'VERSION'), 'utf8').trim();
writeFileSync(join(root, 'precache.json'), JSON.stringify({ version, build, files }, null, 1) + '\n');
const sw = readFileSync(join(root, 'sw.js'), 'utf8');
if (!sw.includes("'__BUILD__'")) { console.error('sw.js has no __BUILD__ placeholder'); process.exit(1); }
writeFileSync(join(root, 'sw.js'), sw.replace("'__BUILD__'", `'${build}'`));
const bytes = files.reduce((n, f) => n + statSync(join(root, f)).size, 0);
console.log(`offline: ${files.length} files, ${(bytes / 1048576).toFixed(1)} MB, build ${build}, version ${version}`);
