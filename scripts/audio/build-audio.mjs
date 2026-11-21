// Records every Japanese phrase the site can speak with Open JTalk, so all devices play the
// same voice, offline, instead of relying on the browser's speech engine.
//
//   node scripts/audio/build-audio.mjs [--pages id,id,…] [--report file]
//
// Needs open_jtalk, its NAIST-JDIC dictionary, the NIT ATR503 M001 voice and ffmpeg
// (Debian/Ubuntu: apt-get install open-jtalk open-jtalk-mecab-naist-jdic
// hts-voice-nitech-jp-atr503-m001 ffmpeg). Writes assets/audio/<hash>.mp3 and
// assets/audio/index.json ({ text → file }), and reuses clips whose text is unchanged.
// The app looks a phrase up in the index and falls back to the browser's voice without it.
//
// Phrases come from the same places the app speaks: tap-to-listen Japanese in every page
// (the JA_RUN pattern of assets/app.js), the kana/kanji course data, and the word and
// station lists in exercise blocks. Where the course gives a romaji reading, the clip's
// pronunciation (Open JTalk's phonemes) is compared with it and differences are reported.
import { readFileSync, writeFileSync, existsSync, mkdirSync, readdirSync, unlinkSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';
import { pagesFromApp } from '../build-search.mjs';

const ROOT = fileURLToPath(new URL('../..', import.meta.url));
const OUT = ROOT + 'assets/audio/';
const DIC = '/var/lib/mecab/dic/open-jtalk/naist-jdic';
const VOICE = '/usr/share/hts-voice/nitech-jp-atr503-m001/nitech_jp_atr503_m001.htsvoice';
const RATE = '0.9';            // a little slower than normal speech, for learners
const { marked } = createRequire(import.meta.url)(ROOT + 'assets/vendor/marked.min.js');

const args = process.argv.slice(2);
const opt = (name) => { const i = args.indexOf(name); return i >= 0 ? args[i + 1] : null; };
const onlyPages = opt('--pages') ? opt('--pages').split(',') : null;
const reportFile = opt('--report');

// ---------- collect phrases (text exactly as the app passes it to speak()) ----------
const app = readFileSync(ROOT + 'assets/app.js', 'utf8');
const JA_RUN = new RegExp(app.match(/var JA_RUN = \/(.*)\/g;/)[1], 'g');
const clean = (t) => t.replace(/[〜～]/g, '').trim();
const phrases = new Map();   // text → { romaji?, where }
function add(text, romaji, where) {
  const t = clean(text);
  if (!t || /^[ー・、。]+$/.test(t)) return;
  const cur = phrases.get(t);
  if (!cur) phrases.set(t, { romaji: romaji || null, where });
  else if (!cur.romaji && romaji) cur.romaji = romaji;
}
const ENT = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ' };
const decode = (s) => s.replace(/&(#x[0-9a-f]+|#\d+|\w+);/gi, (m, e) =>
  e[0] !== '#' ? ENT[e] ?? m : String.fromCodePoint(/^#x/i.test(e) ? parseInt(e.slice(2), 16) : +e.slice(1)));

for (const page of pagesFromApp()) {
  if (onlyPages && !onlyPages.includes(page.id)) continue;
  const md = readFileSync(ROOT + page.file, 'utf8');
  // Word and station lists: "kana | romaji | …".
  for (const [, kind, body] of md.matchAll(/^```(\w+)[^\n]*\n([\s\S]*?)^```/gm)) {
    if (kind !== 'words' && kind !== 'station') continue;
    for (const line of body.split('\n')) {
      const cols = line.split('|').map((c) => c.trim());
      if (cols.length >= 2 && !/^\w+:/.test(line) && JA_RUN.test(cols[0])) add(cols[0], cols[1], page.id);
      JA_RUN.lastIndex = 0;
    }
  }
  // Page text: each text node outside links, buttons and code, as markSpeakable() sees it.
  const html = marked.parse(md.replace(/^```[\s\S]*?^```/gm, ''), { gfm: true });
  let skip = 0;
  for (const part of html.split(/(<[^>]+>)/)) {
    if (part.startsWith('<')) {
      if (/^<(a|button|summary|code)[\s>]/i.test(part)) skip++;
      else if (/^<\/(a|button|summary|code)>/i.test(part)) skip = Math.max(0, skip - 1);
      continue;
    }
    if (skip) continue;
    for (const m of decode(part).matchAll(JA_RUN)) add(m[0], null, page.id);
  }
}
// Course data: every character, spoken from its kana reading (kanji: `say`).
const sandbox = {}; vm.createContext(sandbox);
for (const f of ['hiragana-data.js', 'katakana-data.js', 'kanji-data.js']) vm.runInContext(readFileSync(ROOT + 'assets/' + f, 'utf8'), sandbox);
const courses = { hiragana: sandbox.NB_KANA, katakana: sandbox.NB_KATA, kanji: sandbox.NB_KANJI };
for (const [name, data] of Object.entries(courses)) {
  if (onlyPages && !onlyPages.some((p) => p.startsWith(name))) continue;
  for (const e of data.list) add(e.say || e.k, data === sandbox.NB_KANJI ? null : e.r, name + ' data');
}

// ---------- synthesis ----------
const SMALL = 'ゃゅょャュョぁぃぅぇぉァィゥェォ';
const toKata = (s) => s.replace(/[ぁ-ゖ]/g, (c) => String.fromCharCode(c.charCodeAt(0) + 0x60));
// One character (or one character + small ゃ/ゅ/ょ) is said in katakana: on its own, Open
// JTalk reads は and へ as the particles "wa" and "e"; ハ and ヘ are always "ha" and "he".
function synthText(t) {
  const chars = [...t];
  const single = chars.length === 1 || (chars.length === 2 && SMALL.includes(chars[1]));
  return single && /^[ぁ-ゖ]+$/.test(t) ? toKata(t) : t;
}
function phonemes(trace) {
  return [...trace.matchAll(/^\d+ \d+ [^\^]+\^([^-]+)-([^+]+)\+/gm)].map((m) => m[2]).filter((p) => p !== 'sil' && p !== 'pau');
}
// Romaji → the same flat form as Open JTalk's phonemes, for comparison.
function flatRomaji(r) {
  return r.toLowerCase().normalize('NFC')
    .replace(/ā/g, 'aa').replace(/ī/g, 'ii').replace(/ū/g, 'uu').replace(/ē/g, 'ee').replace(/ō/g, 'oo')
    .replace(/\(.*?\)/g, '').replace(/[^a-z']/g, '')
    .replace(/tch/g, 'qch').replace(/([kstpgzdbcfhjmr])\1/g, 'q$1')
    .replace(/n'/g, 'N').replace(/n(?=[^aiueoy]|$)/g, 'N').replace(/'/g, '')
    .replace(/^wo$/, 'o');
}
const flatPhonemes = (ps) => ps.map((p) => (p === 'cl' ? 'q' : p === 'N' ? 'N' : p.toLowerCase())).join('');

function synth(text) {
  const tmp = OUT + '.tmp';
  const r = spawnSync('open_jtalk', ['-x', DIC, '-m', VOICE, '-r', RATE, '-ow', tmp + '.wav', '-ot', tmp + '.trace'], { input: synthText(text) + '\n' });
  // Marks with no sound of their own (゛, ゜, っ, ー alone) can't be synthesised: no clip.
  if (r.status !== 0) { if (/No phoneme|cannot be synthesized/.test(r.stderr)) return { ps: [] }; throw new Error('open_jtalk failed for ' + text + ': ' + r.stderr); }
  const trace = readFileSync(tmp + '.trace', 'utf8');
  const ps = phonemes(trace);
  if (!ps.length) return { ps };  // nothing to say (っ, ー on their own)
  // Trim the silence Open JTalk adds, keep 60 ms either side, and encode a small mono MP3.
  const file = createHash('sha1').update(text).digest('hex').slice(0, 12) + '.mp3';
  const f = spawnSync('ffmpeg', ['-loglevel', 'error', '-y', '-i', tmp + '.wav', '-af',
    'silenceremove=start_periods=1:start_threshold=-55dB,areverse,silenceremove=start_periods=1:start_threshold=-55dB,areverse,adelay=60,apad=pad_dur=0.06,loudnorm=I=-18:TP=-2',
    '-ac', '1', '-ar', '22050', '-c:a', 'libmp3lame', '-b:a', '40k', OUT + file]);
  if (f.status !== 0) throw new Error('ffmpeg failed for ' + text + ': ' + f.stderr);
  return { file, ps, reading: (trace.match(/^[^,\n]+,[^\n]*$/gm) || []).map((l) => l.split(',')[9] || l.split(',')[0]).join('') };
}

mkdirSync(OUT, { recursive: true });
const indexFile = OUT + 'index.json';
const old = existsSync(indexFile) ? JSON.parse(readFileSync(indexFile, 'utf8')).clips : {};
const clips = onlyPages ? { ...old } : {};
const report = [];
let made = 0, reused = 0, mismatches = 0;
for (const [text, info] of [...phrases].sort((a, b) => a[0].localeCompare(b[0], 'ja'))) {
  const res = synth(text);
  if (!res.file) { report.push(`SKIP  ${text}  (nothing to pronounce)`); continue; }
  if (old[text] === res.file) reused++; else made++;
  clips[text] = res.file;
  const said = flatPhonemes(res.ps);
  if (info.romaji) {
    const want = flatRomaji(info.romaji);
    if (want !== said) { mismatches++; report.push(`DIFF  ${text}  course: ${info.romaji} (${want})  voice: ${said}  [${info.where}]`); }
  } else if (/[㐀-鿿々]/.test(text)) {
    report.push(`KANJI ${text}  voice: ${said}  [${info.where}]`);
  }
}
for (const f of ['.tmp.wav', '.tmp.trace']) if (existsSync(OUT + f)) unlinkSync(OUT + f);
// Remove clips no longer referenced (only on a full build).
if (!onlyPages) {
  const used = new Set(Object.values(clips));
  for (const f of readdirSync(OUT)) if (f.endsWith('.mp3') && !used.has(f)) unlinkSync(OUT + f);
}
writeFileSync(indexFile, JSON.stringify({
  voice: 'Open JTalk with the HTS voice NIT ATR503 M001 (Nagoya Institute of Technology, CC BY 3.0)',
  clips
}, null, 0) + '\n');
if (reportFile) writeFileSync(reportFile, report.join('\n') + '\n');
console.log(`audio: ${Object.keys(clips).length} clips (${made} new or changed, ${reused} unchanged), ${mismatches} differ from the course romaji`);
