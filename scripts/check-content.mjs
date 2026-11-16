// Sanity checks for the course content and the website that renders it.
// Run: node scripts/check-content.mjs
import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { dirname, join, normalize } from 'node:path';
import vm from 'node:vm';

const errors = [];
const fail = (msg) => errors.push(msg);

// 1. Every page registered in the site exists, and every Markdown page is registered.
const app = readFileSync('assets/app.js', 'utf8');
const entries = [...app.matchAll(/\{ id: '([^']+)', file: '([^']+)'/g)].map((m) => ({ id: m[1], file: m[2] }));
const registered = entries.map((e) => e.file);
const pageFiles = ['lessons', 'hiragana'].flatMap((dir) =>
  readdirSync(dir).filter((f) => f.endsWith('.md')).map((f) => `${dir}/${f}`));
for (const e of entries) if (!existsSync(e.file)) fail(`assets/app.js lists '${e.id}' but ${e.file} is missing`);
for (const f of pageFiles) if (!registered.includes(f)) fail(`${f} is not listed in LESSONS in assets/app.js`);
const ids = entries.map((e) => e.id);
for (const id of ids) if (ids.indexOf(id) !== ids.lastIndexOf(id)) fail(`duplicate page id '${id}' in assets/app.js`);

// 2. Relative Markdown links resolve.
const mdFiles = ['README.md', 'CONTRIBUTING.md', 'CHANGELOG.md', ...pageFiles];
for (const file of mdFiles) {
  const text = readFileSync(file, 'utf8');
  for (const [, href] of text.matchAll(/\]\(([^)\s]+)\)/g)) {
    if (/^(https?:|mailto:|#)/.test(href)) continue;
    const target = normalize(join(dirname(file), href.split('#')[0]));
    if (!existsSync(target)) fail(`${file}: broken link '${href}'`);
  }
}

// 3. The flashcard drill can parse its decks from Lesson 2.
const writing = readFileSync('lessons/02-writing.md', 'utf8');
if (!writing.includes('## 2. The kana chart') || !writing.includes('### Modifier')) fail('lessons/02-writing.md: kana chart markers missing (drill depends on them)');
if (!writing.includes('## 4. Survival kanji') || !/\| Sign \| Reading \| Meaning \|/.test(writing)) fail('lessons/02-writing.md: sign-kanji tables missing (drill depends on them)');

// 4. Hiragana course exercises are well-formed, and each unit only uses characters taught so far.
const sandbox = { window: {} };
vm.runInNewContext(readFileSync('assets/hiragana-data.js', 'utf8'), sandbox);
const KANA = sandbox.window.NB_KANA;
const unitOf = {};
for (const [unit, chars] of Object.entries(KANA.unitChars)) for (const c of chars) unitOf[c] = Number(unit);
const isKana = (c) => /[ぁ-ゟ]/.test(c);
const WIDGETS = ['cards', 'practice', 'words', 'quiz', 'contrast', 'station', 'map', 'review', 'reset', 'game'];
// Blocks checked for "taught so far": these are what the learner must read.
const STRICT = new Set(['cards', 'practice', 'words', 'station']);
let blocks = 0;
for (const file of pageFiles.filter((f) => f.startsWith('hiragana/'))) {
  const unit = Number((file.match(/hiragana\/0(\d)-/) || [])[1]);
  const text = readFileSync(file, 'utf8');
  for (const [, type, body] of text.matchAll(/```([a-z]+)\n([\s\S]*?)```/g)) {
    if (!WIDGETS.includes(type)) continue;
    blocks++;
    const where = `${file} (${type} block)`;
    const lines = body.split('\n').map((l) => l.trim()).filter(Boolean);
    const cfg = Object.fromEntries(lines.filter((l) => /^[a-z]+:/.test(l) && !l.includes('|')).map((l) => [l.split(':')[0], l.slice(l.indexOf(':') + 1).trim()]));
    const rows = lines.filter((l) => l.includes('|')).map((l) => l.split('|').map((s) => s.trim()));
    if ((type === 'practice' || type === 'cards') && !cfg.kana) fail(`${where}: missing "kana:"`);
    if (type === 'words' && (rows.length < 2 || rows.some((r) => r.length < 3 || !r[1]))) fail(`${where}: rows need "kana | romaji | meaning"`);
    if (type === 'station' && rows.some((r) => r.length < 3)) fail(`${where}: rows need "kana | romaji | kanji [| prev | next]"`);
    if (type === 'contrast' && rows.some((r) => [...r[0].replace(/\s/g, '')].length !== 2)) fail(`${where}: rows need two characters, e.g. "き さ | cue"`);
    if (type === 'quiz') {
      const qs = body.split('\n').filter((l) => l.trim().startsWith('?')).length;
      const right = body.split('\n').filter((l) => /^\s*-.*\*\s*$/.test(l)).length;
      if (!qs || qs !== right) fail(`${where}: each "?" question needs exactly one option marked with *`);
    }
    if (type === 'game') {
      if (!(cfg.pool === 'learned' || (Number(cfg.unit) >= 1 && Number(cfg.unit) <= 8))) fail(`${where}: needs "unit: 1–8" or "pool: learned"`);
      if (unit >= 1 && unit <= 8 && Number(cfg.unit) > unit) fail(`${where}: unit ${cfg.unit} game in unit ${unit} uses characters not taught yet`);
    }
    if ((type === 'practice' || type === 'game') && cfg.modes && cfg.modes.split(',').some((m) => !['see', 'pick', 'listen', 'type'].includes(m.trim()))) fail(`${where}: unknown mode in "${cfg.modes}"`);
    // Every character used must exist in the data…
    const texts = [cfg.kana || '', cfg.mix || '', ...rows.map((r) => (type === 'station' ? [r[0], r[3] || '', r[4] || ''] : [r[0]]).join(''))].join('');
    for (const c of texts) {
      if (!isKana(c)) continue;
      if (!unitOf[c]) fail(`${where}: unknown character '${c}'`);
      // …and in units 1–8 it must have been taught already.
      else if (unit >= 1 && unit <= 8 && STRICT.has(type) && unitOf[c] > unit) fail(`${where}: '${c}' is taught in unit ${unitOf[c]}, after unit ${unit}`);
    }
  }
}

// 5. VERSION is semver and has a CHANGELOG entry.
const version = readFileSync('VERSION', 'utf8').trim();
if (!/^\d+\.\d+\.\d+$/.test(version)) fail(`VERSION '${version}' is not x.y.z`);
if (!readFileSync('CHANGELOG.md', 'utf8').includes(`## [${version}]`)) fail(`CHANGELOG.md has no section for ${version}`);

if (errors.length) {
  for (const e of errors) console.error(`::error::${e}`);
  process.exit(1);
}
console.log(`OK: ${entries.length} pages, ${mdFiles.length} Markdown files, ${blocks} exercises checked, version ${version}`);
