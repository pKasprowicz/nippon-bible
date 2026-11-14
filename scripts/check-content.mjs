// Sanity checks for the course content and the website that renders it.
// Run: node scripts/check-content.mjs
import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { dirname, join, normalize } from 'node:path';

const errors = [];
const fail = (msg) => errors.push(msg);

// 1. Every lesson registered in the site exists, and every lesson file is registered.
const app = readFileSync('assets/app.js', 'utf8');
const ids = [...app.matchAll(/\{ id: '(\d\d-[a-z-]+)'/g)].map((m) => m[1]);
const files = readdirSync('lessons').filter((f) => f.endsWith('.md')).map((f) => f.replace(/\.md$/, ''));
for (const id of ids) if (!files.includes(id)) fail(`assets/app.js lists '${id}' but lessons/${id}.md is missing`);
for (const f of files) if (!ids.includes(f)) fail(`lessons/${f}.md is not listed in LESSONS in assets/app.js`);

// 2. Relative Markdown links resolve.
const mdFiles = ['README.md', 'CONTRIBUTING.md', 'CHANGELOG.md', ...files.map((f) => `lessons/${f}.md`)];
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

// 4. VERSION is semver and has a CHANGELOG entry.
const version = readFileSync('VERSION', 'utf8').trim();
if (!/^\d+\.\d+\.\d+$/.test(version)) fail(`VERSION '${version}' is not x.y.z`);
if (!readFileSync('CHANGELOG.md', 'utf8').includes(`## [${version}]`)) fail(`CHANGELOG.md has no section for ${version}`);

if (errors.length) {
  for (const e of errors) console.error(`::error::${e}`);
  process.exit(1);
}
console.log(`OK: ${ids.length} lessons, ${mdFiles.length} Markdown files checked, version ${version}`);
