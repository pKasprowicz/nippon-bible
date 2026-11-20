// Sanity checks for the course content and the website that renders it.
// Run: node scripts/check-content.mjs
import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { dirname, join, normalize } from 'node:path';
import vm from 'node:vm';
import { buildSearchIndex } from './build-search.mjs';

const errors = [];
const fail = (msg) => errors.push(msg);

// 1. Every page registered in the site exists, and every Markdown page is registered.
const app = readFileSync('assets/app.js', 'utf8');
const entries = [...app.matchAll(/\{ id: '([^']+)', file: '([^']+)'/g)].map((m) => ({ id: m[1], file: m[2] }));
const registered = entries.map((e) => e.file);
const pageFiles = ['lessons', 'hiragana', 'katakana', 'kanji', 'cuisine', 'folklore', 'popculture', 'signs'].flatMap((dir) =>
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

// 4. Kana course exercises are well-formed, and each unit only uses characters taught so far.
const COURSES = { hiragana: ['assets/hiragana-data.js', 'NB_KANA'], katakana: ['assets/katakana-data.js', 'NB_KATA'], kanji: ['assets/kanji-data.js', 'NB_KANJI'] };
const WIDGETS = ['cards', 'practice', 'words', 'quiz', 'contrast', 'station', 'map', 'review', 'reset', 'game'];
// Blocks checked for "taught so far": these are what the learner must read.
const STRICT = new Set(['cards', 'practice', 'words', 'station']);
const SMALL = 'ゃゅょャュョァィゥェォ';
const isKana = (c) => /[ぁ-ゟァ-ヺー]/.test(c); // hiragana, katakana and ー (not the ・ dot)
const isKanji = (c) => /[\u3400-\u9fff\u3005]/.test(c);
const units = (str) => [...str.replace(/\s/g, '')].filter((c) => !SMALL.includes(c)).length;
let blocks = 0;
for (const [course, [dataFile, global]] of Object.entries(COURSES)) {
  const sandbox = { window: {} };
  vm.runInNewContext(readFileSync(dataFile, 'utf8'), sandbox);
  const DATA = sandbox.window[global];
  const unitOf = {};
  for (const [unit, chars] of Object.entries(DATA.unitChars)) for (const c of chars) unitOf[c] = Number(unit);
  for (const file of pageFiles.filter((f) => f.startsWith(course + '/'))) {
    const unit = Number((file.match(/\/0(\d)-/) || [])[1]);
    const lastUnit = Math.max(...Object.keys(DATA.unitChars).map(Number)) + 1; // the real-world unit adds no new characters
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
      if (type === 'words' && cfg.mode && !['read', 'listen', 'meaning'].includes(cfg.mode)) fail(`${where}: unknown mode "${cfg.mode}"`);
      if (type === 'words' && cfg.mode === 'meaning' && rows.length < 4) fail(`${where}: meaning mode needs at least 4 words`);
      if (type === 'station' && rows.some((r) => r.length < 3)) fail(`${where}: rows need "kana | romaji | kanji [| prev | next]"`);
      if (type === 'contrast' && rows.some((r) => units(r[0]) !== 2)) fail(`${where}: rows need two characters, e.g. "き さ | cue"`);
      if (type === 'contrast') for (const r of rows) for (const k of r[0].split(/\s+/)) if (!DATA.byChar[k]) fail(`${where}: '${k}' is not in the ${course} course data`);
      if (type === 'quiz') {
        const qs = body.split('\n').filter((l) => l.trim().startsWith('?')).length;
        const right = body.split('\n').filter((l) => /^\s*-.*\*\s*$/.test(l)).length;
        if (!qs || qs !== right) fail(`${where}: each "?" question needs exactly one option marked with *`);
      }
      if (type === 'game') {
        if (!(cfg.pool === 'learned' || (Number(cfg.unit) >= 1 && Number(cfg.unit) <= lastUnit))) fail(`${where}: needs "unit: 1–${lastUnit}" or "pool: learned"`);
        if (unit >= 1 && unit <= lastUnit && Number(cfg.unit) > unit) fail(`${where}: unit ${cfg.unit} game in unit ${unit} uses characters not taught yet`);
      }
      if ((type === 'practice' || type === 'game') && cfg.modes && cfg.modes.split(',').some((m) => !['see', 'pick', 'listen', 'type', 'meaning', 'find'].includes(m.trim()))) fail(`${where}: unknown mode in "${cfg.modes}"`);
      // Every character used must exist in this course's data…
      const texts = [cfg.kana || '', cfg.mix || '', ...rows.map((r) => (type === 'station' ? [r[0], r[3] || '', r[4] || ''] : [r[0]]).join(''))].join('');
      for (const c of texts) {
        // The kanji course checks kanji only (its sign words may contain any kana).
        if (course === 'kanji' ? !isKanji(c) : !isKana(c)) continue;
        if (!unitOf[c]) fail(`${where}: '${c}' is not in the ${course} course data`);
        // …and in units 1–8 it must have been taught already.
        else if (unit >= 1 && unit <= lastUnit && STRICT.has(type) && unitOf[c] > unit) fail(`${where}: '${c}' is taught in unit ${unitOf[c]}, after unit ${unit}`);
      }
    }
  }
}

// 4. Handbooks (cuisine, folklore, pop culture): cited chapters, well-formed quizzes, every image present and credited.
const HANDBOOKS = [
  { dir: 'cuisine', sources: 'cuisine/16-sources.md', chapter: /\/(0[1-9]|1[0-4])-/ },
  { dir: 'folklore', sources: 'folklore/15-sources.md', chapter: /\/(0[1-9]|1[0-3])-/ },
  { dir: 'popculture', sources: 'popculture/16-sources.md', chapter: /\/(0[1-9]|1[0-4])-/ },
];
for (const hb of HANDBOOKS) {
  const credits = readFileSync(hb.sources, 'utf8');
  const usedImages = new Set();
  for (const file of pageFiles.filter((f) => f.startsWith(hb.dir + '/'))) {
    const text = readFileSync(file, 'utf8');
    const chapter = hb.chapter.test(file);
    if (chapter && !text.includes('## Sources for this chapter')) fail(`${file}: missing "## Sources for this chapter"`);
    if (chapter && !text.includes('```quiz')) fail(`${file}: missing the self-check quiz`);
    if (text.includes('<!-- figure') || text.includes('{{fig:')) fail(`${file}: figure placeholder left in the text`);
    for (const [, body] of text.matchAll(/```quiz\n([\s\S]*?)```/g)) {
      blocks++;
      for (const q of body.split(/^\? /m).slice(1)) {
        const correct = q.split('\n').filter((l) => /^- .*\*\s*$/.test(l)).length;
        if (correct !== 1) fail(`${file}: quiz question "${q.split('\n')[0].slice(0, 50)}" needs exactly one answer marked *`);
      }
    }
    for (const [, src] of text.matchAll(/<img[^>]*\ssrc="([^"]+)"/g)) {
      const target = normalize(join(dirname(file), src));
      usedImages.add(target);
      if (!existsSync(target)) fail(`${file}: image '${src}' is missing`);
      if (!credits.includes(src.split('/').pop())) fail(`${file}: image '${src}' has no entry in ${hb.sources}`);
    }
    for (const m of text.matchAll(/<img(?![^>]*\salt="[^"]+")[^>]*>/g)) fail(`${file}: image without alt text: ${m[0].slice(0, 60)}`);
    // Wikipedia is further reading only: never in a source list.
    const sourcesAt = text.indexOf('## Sources for this chapter');
    if (sourcesAt >= 0 && /wikipedia\.org/.test(text.slice(sourcesAt))) fail(`${file}: Wikipedia link in the chapter's source list`);
    for (const [, url] of text.matchAll(/\]\((https:\/\/en\.wikipedia\.org\/[^)\s]*)\)/g)) {
      if (!/^https:\/\/en\.wikipedia\.org\/wiki\/[^#\s]+$/.test(url)) fail(`${file}: malformed Wikipedia link ${url}`);
    }
  }
  if (existsSync(`${hb.dir}/img`)) {
    for (const f of readdirSync(`${hb.dir}/img`)) if (!usedImages.has(`${hb.dir}/img/${f}`)) fail(`${hb.dir}/img/${f} is not used by any page`);
  }
}

// 4b. Installable offline app: manifest icons exist; the service worker can be stamped at deploy.
const manifest = JSON.parse(readFileSync('manifest.webmanifest', 'utf8'));
for (const icon of manifest.icons || []) if (!existsSync(icon.src)) fail(`manifest.webmanifest: icon ${icon.src} is missing`);
if (!(manifest.icons || []).some((i) => /maskable/.test(i.purpose || ''))) fail('manifest.webmanifest: needs a maskable icon for Android');
if (!readFileSync('sw.js', 'utf8').includes("'__BUILD__'")) fail("sw.js: the BUILD = '__BUILD__' placeholder is missing (the deploy stamps it)");
if (!readFileSync('index.html', 'utf8').includes('rel="manifest"')) fail('index.html: the manifest link is missing');

// 5. The search index builds, covers every page, and links each section to a unique heading.
const searchSections = buildSearchIndex();
for (const e of entries) if (!searchSections.some(([page]) => page === e.id)) fail(`search index: no text found for '${e.id}'`);
const sectionKeys = searchSections.map(([page, slug]) => page + '/' + slug);
for (const k of sectionKeys) if (sectionKeys.indexOf(k) !== sectionKeys.lastIndexOf(k)) fail(`search index: two sections share the link #/${k}`);
for (const [page, slug, heading] of searchSections) if (slug && !heading.trim()) fail(`search index: empty heading at #/${page}/${slug}`);

// 5b. Photo gallery: every photo is public domain or CC0, credited, and present in both sizes.
{
  const dir = 'assets/signs/';
  const { kinds, photos } = JSON.parse(readFileSync(dir + 'photos.json', 'utf8'));
  const kindIds = kinds.map((k) => k.id);
  for (const p of photos) {
    const where = `${dir}photos.json: ${p.file}`;
    for (const f of ['file', 'title', 'kind', 'author', 'license', 'source', 'w', 'h']) if (!p[f]) fail(`${where}: missing '${f}'`);
    if (!['CC0', 'Public domain'].includes(p.license)) fail(`${where}: license '${p.license}' is not public domain or CC0`);
    if (!kindIds.includes(p.kind)) fail(`${where}: unknown kind '${p.kind}'`);
    if (!/^https:\/\/commons\.wikimedia\.org\/wiki\/File:/.test(p.source || '')) fail(`${where}: source must be a Wikimedia Commons file page`);
    if (!existsSync(dir + p.file)) fail(`${where}: the photo is missing`);
    if (!existsSync(dir + 'thumbs/' + p.file)) fail(`${where}: the thumbnail is missing`);
  }
  const listed = new Set(photos.map((p) => p.file));
  if (listed.size !== photos.length) fail(`${dir}photos.json: a photo is listed twice`);
  for (const f of readdirSync(dir).filter((f) => f.endsWith('.jpg'))) if (!listed.has(f)) fail(`${dir}${f} is not listed in photos.json`);
  for (const f of readdirSync(dir + 'thumbs')) if (!listed.has(f)) fail(`${dir}thumbs/${f} is not listed in photos.json`);
}

// 6. VERSION is semver and has a CHANGELOG entry.
const version = readFileSync('VERSION', 'utf8').trim();
if (!/^\d+\.\d+\.\d+$/.test(version)) fail(`VERSION '${version}' is not x.y.z`);
if (!readFileSync('CHANGELOG.md', 'utf8').includes(`## [${version}]`)) fail(`CHANGELOG.md has no section for ${version}`);

if (errors.length) {
  for (const e of errors) console.error(`::error::${e}`);
  process.exit(1);
}
console.log(`OK: ${entries.length} pages, ${mdFiles.length} Markdown files, ${blocks} exercises checked, version ${version}`);
