// Builds the dictionary behind the pop-ups (assets/terms.json): what a tapped Japanese word,
// romaji term, substance, linked name, citation or chapter link should show.
//
// Sources, in order of precedence (later ones fill gaps, never overwrite):
//   1. terms/words.json, terms/substances.json, terms/entities.json  (written by hand or by
//      scripts/terms/fetch-*.py; checked into the repository)
//   2. the pages themselves: vocabulary tables, ```words and ```station blocks, glossaries,
//      and inline "漢字 (*romaji*, meaning)" patterns
//   3. the kana and kanji course data (assets/*-data.js)
//   4. every handbook's sources page, for citations
//
// Run: node scripts/build-terms.mjs [site-dir]   (writes <site-dir>/assets/terms.json; default: the repo)
//      node scripts/build-terms.mjs --report     (lists Japanese text and romaji with no entry)
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';
import { pagesFromApp } from './build-search.mjs';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const read = (f) => readFileSync(ROOT + f, 'utf8');
const json = (f) => (existsSync(ROOT + f) ? JSON.parse(read(f)) : []);

// Same Japanese-run rule as JA_RUN in assets/app.js.
export const JA_RUN = /[々぀-ヿ㐀-䶿一-鿿～〜]+(?:[、。\s]?[々぀-ヿ㐀-䶿一-鿿～〜]+)*/g;
const JA_ONLY = /^[々぀-ヿ㐀-䶿一-鿿～〜、。・\s　（）()…！？]+$/;
// Fenced blocks that are exercises: their text is not explained, so it needs no pop-up.
export const EXERCISE_BLOCKS = /^```(quiz|practice|game|cards|review|reset|map|contrast)[^\n]*\n[\s\S]*?^```[ \t]*$/gm;

// Plain text of a Markdown fragment: links to their text, emphasis and code marks dropped.
export const plain = (s) => s.replace(/!\[[^\]]*\]\([^)]*\)/g, '').replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
  .replace(/<[^>]+>/g, '').replace(/[*_`]/g, '').replace(/\s+/g, ' ').trim();
// Romaji key: lower case, macrons kept (ō ≠ o matters), apostrophes and hyphens kept.
export const roKey = (s) => plain(s).toLowerCase().replace(/[“”"]/g, '').trim();
// Looser key for matching *Onsen* vs onsen, tōji vs toji.
export const roLoose = (s) => roKey(s).normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[-' ]/g, '');
// Does this look like Hepburn romaji (every word made of Japanese syllables)?
export const isRomaji = (s) => plain(s).toLowerCase().split(/[\s-]+/).filter(Boolean).every((w) =>
  /^(?:(?:[kgsztdnhbpmrwfjv]|ch|sh|ts|ky|gy|ny|hy|by|py|my|ry|j)?(?:[aeiouāēīōū])|n'?|[kstpgdbcm](?=[kstpgdbcm]))+$/.test(w.replace(/'/g, '')));
const firstUrl = (s) => (s.match(/\]\((https?:\/\/(?:[^()\s]|\([^()\s]*\))+)\)/) || [])[1];

const entries = [];
const byJa = new Map(), byRo = new Map(), byUrl = new Map();
function add(e, origin) {
  e.ja = e.ja && e.ja.trim(); e.ro = e.ro && e.ro.trim(); e.en = e.en && e.en.trim();
  if (!e.en && e.k !== 'entity' && e.k !== 'substance') return null;
  // Merge into an existing entry for the same Japanese text, or the same romaji with no Japanese.
  let i = e.ja ? byJa.get(e.ja) : undefined;
  if (i === undefined && e.ro && !e.ja) i = byRo.get(roKey(e.ro));
  if (i === undefined && e.url) i = byUrl.get(e.url);
  if (i !== undefined) {
    const old = entries[i];
    for (const k of Object.keys(e)) if (old[k] === undefined || old[k] === '') old[k] = e[k];
  } else {
    i = entries.length; entries.push({ ...e, from: origin });
  }
  const x = entries[i];
  if (x.ja && !byJa.has(x.ja)) byJa.set(x.ja, i);
  if (x.ro) for (const r of [x.ro, ...(x.alt || [])]) { if (!byRo.has(roKey(r))) byRo.set(roKey(r), i); }
  if (x.url && !byUrl.has(x.url)) byUrl.set(x.url, i);
  return i;
}

// 1. Hand-written and fetched data.
for (const e of json('terms/words.json')) add({ k: e.k || 'word', ...e }, 'terms/words.json');
const NOTES = existsSync(ROOT + 'terms/substances-notes.json') ? JSON.parse(read('terms/substances-notes.json')) : {};
for (const e of json('terms/substances.json')) {
  const n = NOTES[e.en] || {};
  // PubChem (ChEBI) abstracts: keep the defining sentence, drop the long list of "roles".
  let abs = n.abstract || (e.abstract || '').split(/(?<=\.)\s+(?=It has a role|It is a|It derives|It is functionally)/)[0];
  add({ k: 'substance', en: e.en, pl: n.pl || e.pl, plUrl: e.plUrl, iupac: e.iupac, formula: e.formula, cid: e.cid,
        abstract: abs || undefined, abstractSrc: n.abstractSrc || e.abstractSrc, url: e.url, alias: e.alias }, 'terms/substances.json');
}

// 2. The pages.
const pages = pagesFromApp();
const glossaryOf = {};
for (const p of pages) if (/glossary/.test(p.id)) glossaryOf[p.group] = p.id;

function tableRows(md) {
  const out = []; let header = null;
  for (const block of md.split(/\n(?!\|)/)) {
    const lines = block.split('\n').filter((l) => /^\|.*\|\s*$/.test(l.trim()));
    if (lines.length < 3 || !/^\|[\s:|-]+\|$/.test(lines[1].trim())) continue;
    const cells = (l) => l.trim().slice(1, -1).split(/(?<!\\)\|/).map((c) => c.trim());
    header = cells(lines[0]).map((h) => plain(h).toLowerCase());
    for (const l of lines.slice(2)) out.push({ header, cells: cells(l) });
  }
  return out;
}

for (const p of pages) {
  if (/sources/.test(p.id)) continue;
  const md = read(p.file);
  const ref = { page: p.id };
  // ```words  kana | romaji | meaning      ```station  kana | romaji | kanji
  for (const [, kind, body] of md.matchAll(/^```(words|station)[^\n]*\n([\s\S]*?)^```/gm)) {
    for (const line of body.split('\n')) {
      const c = line.split('|').map((s) => s.trim());
      if (c.length < 3 || !JA_ONLY.test(c[0])) continue;
      if (kind === 'words') add({ k: 'word', ja: c[0], ro: c[1], en: c[2], ...ref }, p.file);
      else { add({ k: 'place', ja: c[0], ro: c[1], en: c[1] + ' (station)', kanji: c[2], ...ref }, p.file);
        if (c[2] && JA_ONLY.test(c[2])) add({ k: 'place', ja: c[2], ro: c[1], kana: c[0], en: c[1] + ' (station)', ...ref }, p.file); }
    }
  }
  const body = md.replace(EXERCISE_BLOCKS, '');
  // Tables with a Japanese column.
  for (const { header, cells } of tableRows(body)) {
    const isGloss = /glossary/.test(p.id);
    if (isGloss) {
      // | ***romaji*** 漢字 | meaning | chapter |
      const t = cells[0], ja = (plain(t).match(JA_RUN) || [])[0];
      const ro = plain(t.replace(JA_RUN, '')).replace(/[()]/g, '').trim();
      if (!ro || !cells[1]) continue;
      const parts = ro.split(/\s*\/\s*/), jas = ja ? ja.split(/[・、]/) : [];
      parts.forEach((r, n) => add({ k: 'word', ja: jas.length === parts.length ? jas[n] : parts.length === 1 ? ja : undefined,
        ro: r, en: plain(cells[1]), url: firstUrl(t), gl: p.id, ch: plain(cells[2] || ''), ...ref }, p.file));
      continue;
    }
    // | **漢字 · romaji · English** | what it is | … |
    const dot = plain(cells[0]).split(/\s*·\s*/);
    if (dot.length >= 2 && JA_ONLY.test(dot[0]) && isRomaji(dot[1])) {
      add({ k: 'word', ja: dot[0], ro: dot[1], en: dot[2] || plain(cells[1] || ''), ...ref }, p.file);
      continue;
    }
    const jaCol = cells.findIndex((c) => JA_ONLY.test(plain(c)) && plain(c));
    if (jaCol < 0) continue;
    const col = (re) => header.findIndex((h) => re.test(h));
    let roCol = col(/^(reading|romaji|say|pronunciation)/);
    if (roCol < 0) roCol = cells.findIndex((c, n) => n !== jaCol && /^\*{1,3}[^*]+\*{1,3}$/.test(c) && !JA_RUN.test(plain(c)));
    JA_RUN.lastIndex = 0;
    let enCol = col(/^(meaning|english|translation|what it means|means)/);
    if (enCol < 0) enCol = cells.length - 1 > Math.max(jaCol, roCol) ? cells.length - 1 : -1;
    if (enCol < 0 || enCol === jaCol || enCol === roCol) continue;
    const en = plain(cells[enCol]).replace(/\s*\((?:Chapter|chapter) [^)]*\)\s*$/, '');
    add({ k: 'word', ja: plain(cells[jaCol]), ro: roCol >= 0 ? plain(cells[roCol]) : undefined, en, url: firstUrl(cells[jaCol]) || firstUrl(cells[roCol] || ''), ...ref }, p.file);
  }
  // Inline: 漢字 (*romaji*, meaning)  ·  ***romaji*** (漢字, "meaning")  ·  **romaji** (漢字)
  const text = body.replace(/^\|.*$/gm, '');
  const J = '([々぀-ヿ㐀-䶿一-鿿～〜][々぀-ヿ㐀-䶿一-鿿～〜・]*)';
  const R = '\\*{1,3}(?:\\[)?([A-Za-zĀ-ž\' -]{2,40}?)(?:\\]\\([^)]*\\))?\\*{1,3}';
  const G = '(?:,\\s*["“]?([^)"”]{2,80}?)["”]?)?';
  const gloss = (g) => (g ? plain(g) : undefined);
  // **漢字 · romaji** (meaning)  or  **漢字 · romaji · meaning**
  for (const m of body.matchAll(/\*\*([々぀-ヿ㐀-䶿一-鿿～〜][^*·|]*?) · ([^*·|]+?)(?: · ([^*|]+?))?\*\*(?:\s*\(([^)]{2,80})\))?/g))
    if (JA_ONLY.test(m[1]) && isRomaji(m[2])) add({ k: 'word', ja: m[1].trim(), ro: m[2], en: gloss(m[3] || m[4]), ...ref }, p.file);
  // 漢字 *romaji* (meaning)
  for (const m of text.matchAll(new RegExp(J + ' \\*([A-Za-zĀ-ž\' -]{2,40}?)\\*(?: \\(([^)]{2,80})\\))?', 'g')))
    if (isRomaji(m[2])) add({ k: 'word', ja: m[1], ro: m[2], en: gloss(m[3]), ...ref }, p.file);
  for (const m of text.matchAll(new RegExp(J + '\\s*\\(' + R + G + '\\)', 'g')))
    if (isRomaji(m[2])) add({ k: 'word', ja: m[1], ro: m[2], en: gloss(m[3]), ...ref }, p.file);
  // ***romaji*** (漢字, "meaning")  or  **English name** (漢字, *romaji*)
  for (const m of text.matchAll(new RegExp(R + '\\s*\\(' + J + G + '\\)', 'g'))) {
    if (isRomaji(m[1])) add({ k: 'word', ja: m[2], ro: m[1], en: gloss(m[3]), ...ref }, p.file);
    else if (m[3] && isRomaji(plain(m[3]))) add({ k: 'word', ja: m[2], ro: plain(m[3]), en: m[1], ...ref }, p.file);
    else add({ k: 'word', ja: m[2], en: m[1], ...ref }, p.file);
  }
}

// 3. Course data: single kana, kana combinations, the course's kanji.
const sandbox = { window: {} }; sandbox.self = sandbox.window; vm.createContext(sandbox);
for (const f of ['assets/hiragana-data.js', 'assets/katakana-data.js', 'assets/kanji-data.js']) vm.runInContext(read(f), sandbox);
const W = sandbox.window;
for (const [data, label] of [[W.NB_KANA, 'hiragana'], [W.NB_KATA, 'katakana']]) {
  if (!data) continue;
  for (const e of data.list || []) if (e.k && e.r) add({ k: 'kana', ja: e.k, ro: e.r, en: label + ' “' + e.r + '”', note: e.m }, 'assets/' + label + '-data.js');
}
if (W.NB_KANJI) for (const e of W.NB_KANJI.list || []) {
  if (e.k) add({ k: 'kanji', ja: e.k, ro: e.r, kana: e.say, alt: e.alt, en: e.meaning, note: e.m, page: 'kanji-' + e.unit }, 'assets/kanji-data.js');
}

// 4. Entities: Wikipedia links that are not words or substances (terms/entities.json, fetched).
for (const e of json('terms/entities.json')) {
  if (byUrl.has(e.url)) { const x = entries[byUrl.get(e.url)]; if (!x.ja && e.ja && x.k !== 'substance') x.jaName = e.ja; continue; }
  add({ k: 'entity', type: e.type === 'substance' ? 'topic' : e.type, en: e.title, ja: undefined, jaName: e.ja || undefined, url: e.url }, 'terms/entities.json');
}

// Where each substance appears, for "In this handbook" links.
const subs = entries.map((e, i) => [e, i]).filter(([e]) => e.k === 'substance');
const subIndex = {};
for (const [e, i] of subs) for (const a of e.alias || []) subIndex[/^[A-Z]{2,}$/.test(a) ? a : a.toLowerCase()] = i;
for (const p of pages) {
  if (/sources|glossary/.test(p.id)) continue;
  const t = read(p.file);
  for (const [e] of subs) if ((e.alias || []).some((a) => new RegExp('\\b' + a.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\b', /^[A-Z]{2,}$/.test(a) ? '' : 'i').test(t))) (e.pages = e.pages || []).push(p.id);
}

// 5. Citations, per handbook group, from the sources page: "- **Key.** reference … *(Chapters …)*".
const cites = {};
for (const p of pages.filter((x) => /sources$/.test(x.id))) {
  const md = read(p.file), g = {};
  for (const m of md.matchAll(/^- \*\*(.+?)\.\*\* (.+)$/gm)) {
    const ch = (m[2].match(/\*\((?:Chapters?|Start page)[^)]*\)\*\s*$/) || [''])[0];
    g[m[1]] = { ref: m[2].replace(/\s*\*\((?:Chapters?|Start page)[^)]*\)\*\s*$/, ''), ch: plain(ch).replace(/^\(|\)$/g, '') };
  }
  // Numbered chapter lists ("1. **Key.** …") fill sources only listed per chapter.
  for (const q of pages.filter((x) => x.group === p.group && !/sources|glossary/.test(x.id))) {
    for (const m of read(q.file).matchAll(/^\d+\. \*\*(.+?)\.\*\* (.+)$/gm)) {
      if (/^See \[/.test(m[2]) || g[m[1]]) continue;
      g[m[1]] = { ref: m[2], ch: '' };
    }
  }
  cites[p.group] = g;
}

// Output, with long field names shortened.
const out = {
  v: 1,
  e: entries.map(({ from, ...e }) => e),
  ja: Object.fromEntries(byJa), ro: Object.fromEntries(byRo), url: Object.fromEntries(byUrl), sub: subIndex, cites,
};

if (process.argv.includes('--report')) {
  const missJa = new Map(), missRo = new Map();
  for (const p of pages) {
    if (/sources/.test(p.id)) continue;
    const body = read(p.file).replace(EXERCISE_BLOCKS, '').replace(/\]\([^)]*\)/g, ']');
    for (const m of body.matchAll(JA_RUN)) {
      const run = m[0].trim();
      if (byJa.has(run)) continue;
      for (const tok of run.split(/[\s、。・]+/).filter(Boolean)) if (!byJa.has(tok)) missJa.set(tok, missJa.get(tok) || p.id);
    }
    for (const m of body.matchAll(/(?<![*\w])\*{1,3}([a-zāēīōū][a-zāēīōū' -]{1,30})\*{1,3}(?![*\w])/g)) {
      const r = roKey(m[1]);
      if (!byRo.has(r) && /[āēīōū]|^(?:[kgsztdnhbpmyrwfjc]?h?y?[aeiou]|n)+$/.test(r.replace(/[-' ]/g, ''))) missRo.set(r, missRo.get(r) || p.id);
    }
  }
  console.log(`entries ${entries.length} · ja ${byJa.size} · romaji ${byRo.size} · urls ${byUrl.size}`);
  console.log(`missing Japanese ${missJa.size} · missing romaji ${missRo.size}`);
  const f = process.argv[process.argv.indexOf('--report') + 1];
  if (f && !f.startsWith('-')) writeFileSync(f, JSON.stringify({ ja: [...missJa], ro: [...missRo] }, null, 1));
} else {
  const site = process.argv[2] || ROOT;
  writeFileSync(site.replace(/\/?$/, '/') + 'assets/terms.json', JSON.stringify(out));
  console.log(`terms.json: ${entries.length} entries, ${Object.values(cites).reduce((n, g) => n + Object.keys(g).length, 0)} citations`);
}
