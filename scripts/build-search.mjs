// Builds the full-text search index: every page split at its h2/h3 headings, so a result
// can open the exact section. Uses the site's own Markdown parser and heading slugs, so
// the links match the ids the app gives the headings.
// Run: node scripts/build-search.mjs <site-dir>   (writes <site-dir>/search-index.json)
import { readFileSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const { marked } = createRequire(import.meta.url)(ROOT + 'assets/vendor/marked.min.js');

// Fenced blocks whose lines are vocabulary worth finding; every other block (quizzes,
// drills, games) is left out of the index.
const KEEP_BLOCKS = new Set(['words', 'station', 'contrast']);

// Same rule as slugify() in assets/app.js.
const slugify = (t) => t.trim().toLowerCase().replace(/[^\p{L}\p{M}\p{N}\p{Pc} -]/gu, '').replace(/ /g, '-');
const ENTITIES = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ' };
const decode = (s) => s.replace(/&(#x[0-9a-f]+|#\d+|\w+);/gi, (m, e) =>
  e[0] !== '#' ? ENTITIES[e] ?? m : String.fromCodePoint(e[1] === 'x' || e[1] === 'X' ? parseInt(e.slice(2), 16) : +e.slice(1)));
// textContent of an HTML fragment (for heading slugs) ...
const textContent = (html) => decode(html.replace(/<[^>]+>/g, ''));
// ... and readable body text, where table cells and paragraphs stay apart.
const bodyText = (html) => decode(html.replace(/<(script|style)[\s\S]*?<\/\1>/gi, ' ').replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ').trim();

export function pagesFromApp() {
  const app = readFileSync(ROOT + 'assets/app.js', 'utf8');
  return [...app.matchAll(/\{ id: '([^']+)', file: '([^']+)', group: '([^']+)', title: '((?:[^'\\]|\\.)*)'/g)]
    .map((m) => ({ id: m[1], file: m[2], group: m[3], title: m[4].replace(/\\(.)/g, '$1') }));
}

export function buildSearchIndex() {
  const sections = [];
  for (const page of pagesFromApp()) {
    const md = readFileSync(ROOT + page.file, 'utf8').replace(/^```(\w*)[^\n]*\n([\s\S]*?)^```[ \t]*$/gm, (m, kind, body) =>
      KEEP_BLOCKS.has(kind) ? '\n' + body.split('\n').map((l) => l.replace(/\s*\|\s*/g, ' · ')).join('\n\n') + '\n' : '\n');
    const seen = {};
    for (const part of marked.parse(md, { gfm: true }).split(/(?=<h[23][\s>])/)) {
      const m = part.match(/^<h([23])[^>]*>([\s\S]*?)<\/h\1>/);
      let slug = '', heading = page.title, body = part;
      if (m) {
        heading = textContent(m[2]).trim();
        const base = slugify(textContent(m[2])) || 'section';
        if (seen[base] !== undefined) { seen[base] += 1; slug = base + '-' + seen[base]; } else { seen[base] = 0; slug = base; }
        body = part.slice(m[0].length);
      }
      const text = bodyText(body);
      if (slug || text) sections.push([page.id, slug, heading, text]);
    }
  }
  return sections;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const out = process.argv[2];
  if (!out) { console.error('usage: node scripts/build-search.mjs <site-dir>'); process.exit(1); }
  const sections = buildSearchIndex();
  const json = JSON.stringify({ format: 1, sections });
  writeFileSync(out.replace(/\/$/, '') + '/search-index.json', json);
  console.log(`search: ${sections.length} sections, ${(Buffer.byteLength(json) / 1024).toFixed(0)} KB`);
}
