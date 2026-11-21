// Records every Japanese phrase the site can speak with Open JTalk, so all devices play the
// same voice, offline, instead of relying on the browser's speech engine.
//
//   node scripts/audio/build-audio.mjs [--pages id,id,…] [--report file]
//
// Needs open_jtalk, its NAIST-JDIC dictionary and ffmpeg (Debian/Ubuntu: apt-get install
// open-jtalk open-jtalk-mecab-naist-jdic ffmpeg). The voice, HTS voice "Takumi" from the
// MMDAgent project (CC BY 3.0), is kept in scripts/audio/voice/ with its licence. Writes assets/audio/<hash>.mp3 and
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
const VOICE = fileURLToPath(new URL('voice/takumi_normal.htsvoice', import.meta.url));
// Open JTalk's postfilter makes the voice clearer, but on some phrases it goes unstable and
// the waveform clips at full scale (heard as distortion). Each clip is re-rendered with a
// gentler setting until its raw output stays well below full scale.
const POSTFILTERS = ['0.4', '0.2', '0.0'];
const TARGET_LUFS = -16;        // every clip gets one gain to this loudness (EBU R128)…
const MAX_PEAK = -1.5;          // …unless that would push its true peak above -1.5 dBTP
const LEAD = 0.15, TAIL = 0.40; // seconds kept before and after the speech: phones and
                                // Bluetooth headsets swallow the first moments of a sound,
                                // and the voice needs its natural fade-out
const RATE = '0.9';            // a little slower than normal speech, for learners
const { marked } = createRequire(import.meta.url)(ROOT + 'assets/vendor/marked.min.js');

const args = process.argv.slice(2);
const opt = (name) => { const i = args.indexOf(name); return i >= 0 ? args[i + 1] : null; };
const onlyPages = opt('--pages') ? opt('--pages').split(',') : null;
const reportFile = opt('--report');

// Romaji → the same flat form as Open JTalk's phonemes, for comparison.
function flatRomaji(r) {
  return r.toLowerCase().normalize('NFC').replace(/’/g, "'")
    .replace(/ā/g, 'aa').replace(/ī/g, 'ii').replace(/ū/g, 'uu').replace(/ē/g, 'ee').replace(/ō/g, 'oo')
    .replace(/\(.*?\)/g, '')
    .replace(/n(?=[\s'-]|$)/g, 'N').replace(/[^a-zN]/g, '')
    .replace(/tch/g, 'qch').replace(/([kstpgzdbcfhjmr])\1/g, 'q$1')
    .replace(/n(?=[^aiueoy]|$)/g, 'N')
    .replace(/^wo$/, 'o');
}
// えい and おう are said as long vowels (ee, oo); spelling differences, not errors.
const sameSound = (a) => a.replace(/ei/g, 'ee').replace(/ou/g, 'oo');
const SYLLABLES = /^(?:[aiueo]|N|q(?=[kstpgzdbcfhjmr])|(?:ch|sh|ts|ky|gy|ny|hy|my|ry|by|py|[kgsztdnhbpmyrwfj])[aiueo])+$/;
function isRomaji(r) { const f = flatRomaji(r); return f.length > 0 && SYLLABLES.test(f); }

// ---------- collect phrases (text exactly as the app passes it to speak()) ----------
const app = readFileSync(ROOT + 'assets/app.js', 'utf8');
const JA_RUN = new RegExp(app.match(/var JA_RUN = \/(.*)\/g;/)[1], 'g');
const JA = '[々぀-ヿ㐀-䶿一-鿿～〜]';
const LAT = "[A-Za-zĀĪŪĒŌāīūēō'’-]";
const clean = (t) => t.replace(/[〜～]/g, '').trim();
const phrases = new Map();   // text → { where }
const hints = new Map();     // text → Set of romaji readings given by the course
function hint(text, romaji) {
  const t = clean(text);
  if (!t || !romaji || !isRomaji(romaji)) return;
  if (!hints.has(t)) hints.set(t, new Set());
  hints.get(t).add(romaji.trim());
}
function add(text, romaji, where) {
  const t = clean(text);
  if (!t || /^[ー・、。]+$/.test(t)) return;
  if (!phrases.has(t)) phrases.set(t, { where });
  hint(t, romaji);
}
const ENT = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ' };
const decode = (s) => s.replace(/&(#x[0-9a-f]+|#\d+|\w+);/gi, (m, e) =>
  e[0] !== '#' ? ENT[e] ?? m : String.fromCodePoint(/^#x/i.test(e) ? parseInt(e.slice(2), 16) : +e.slice(1)));

for (const page of pagesFromApp()) {
  if (onlyPages && !onlyPages.includes(page.id)) continue;
  // Bibliographies (paper titles, authors' names) are not spoken: names in particular have
  // readings no engine can guess.
  if (/-sources\.md$|\/\d+-sources\.md$/.test(page.file) || /sources/.test(page.id)) continue;
  const md = readFileSync(ROOT + page.file, 'utf8').replace(/^#{2,3} Sources\b[\s\S]*?(?=^## |(?![\s\S]))/gm, '');
  // Word and station lists: "kana | romaji | …".
  for (const [, kind, body] of md.matchAll(/^```(\w+)[^\n]*\n([\s\S]*?)^```/gm)) {
    if (kind !== 'words' && kind !== 'station') continue;
    for (const line of body.split('\n')) {
      const cols = line.split('|').map((c) => c.trim());
      if (cols.length >= 2 && !/^\w+:/.test(line) && JA_RUN.test(cols[0])) add(cols[0], cols[1], page.id);
      JA_RUN.lastIndex = 0;
    }
  }
  // Readings given in the text: "**駅** · eki · station", "精算 (seisan)", "| 駅 | eki |".
  // (Japanese words joined only by an explicit separator, so the pattern can't backtrack
  // through every way of splitting a long run.)
  const HINT = new RegExp('(' + JA + '+(?:[、。 ]' + JA + '+)*)[*_]* ?(?:·|\\(|\\|) ?[*_]*(' + LAT + '+(?: ' + LAT + '+)*)(?=[*_·)|,;:. ]|$)', 'gm');
  for (const m of md.matchAll(HINT)) hint(m[1], m[2]);
  const HINT_BEFORE = new RegExp('[*_]+(' + LAT + '+(?: ' + LAT + '+)*)[*_]+ \\(?(' + JA + '+)\\)?', 'g');
  for (const m of md.matchAll(HINT_BEFORE)) hint(m[2], m[1]);
  // Page text: each text node outside links, buttons and code, as markSpeakable() sees it.
  // Image credits (photographers' user names) are not spoken either.
  const html = marked.parse(md.replace(/^```[\s\S]*?^```/gm, ''), { gfm: true }).replace(/<span class="credit">[\s\S]*?<\/span>/g, '');
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
const READINGS = JSON.parse(readFileSync(new URL('readings.json', import.meta.url), 'utf8'));
const SKIP = new Set(READINGS._skip || []);
// A kanji on its own (or a list of single kanji, as in the kanji lessons) is read the way the
// kanji course teaches it; out of context Open JTalk often picks another reading (空 sora
// instead of aki on a toilet door).
const KANJI = sandbox.NB_KANJI.byChar;
function kanjiList(t) {
  const parts = t.split(/[\s・/]+/).filter(Boolean);
  if (!parts.length || !parts.every((c) => [...c].length === 1 && KANJI[c] && KANJI[c].say)) return null;
  // In katakana, so a reading such as はち isn't taken for the particle は ("wachi").
  return parts.map((c) => toKata(KANJI[c].say)).join('、');
}
const SMALL = 'ゃゅょャュョぁぃぅぇぉァィゥェォ';
const toKata = (s) => s.replace(/[ぁ-ゖ]/g, (c) => String.fromCharCode(c.charCodeAt(0) + 0x60));
// One character (or one character + small ゃ/ゅ/ょ) is said in katakana: on its own, Open
// JTalk reads は and へ as the particles "wa" and "e"; ハ and ヘ are always "ha" and "he".
function synthText(t) {
  if (READINGS[t] && t[0] !== '_') return READINGS[t];
  const list = kanjiList(t);
  if (list) return list;
  const chars = [...t];
  const single = chars.length === 1 || (chars.length === 2 && SMALL.includes(chars[1]));
  return single && /^[ぁ-ゖ]+$/.test(t) ? toKata(t) : t;
}
function phonemes(trace) {
  return [...trace.matchAll(/^\d+ \d+ [^\^]+\^([^-]+)-([^+]+)\+/gm)].map((m) => m[2]).filter((p) => p !== 'sil' && p !== 'pau');
}
const flatPhonemes = (ps) => ps.map((p) => (p === 'cl' ? 'q' : p === 'N' ? 'N' : p.toLowerCase())).join('');

// Peak of a 16-bit PCM WAV written by open_jtalk (44-byte header).
function wavPeak(file) {
  const b = readFileSync(file); let peak = 0;
  for (let i = 44; i + 1 < b.length; i += 2) { const v = Math.abs(b.readInt16LE(i)); if (v > peak) peak = v; }
  return peak;
}
let softened = 0;
function synth(text) {
  const tmp = OUT + '.tmp';
  let r;
  for (const pf of POSTFILTERS) {
    r = spawnSync('open_jtalk', ['-x', DIC, '-m', VOICE, '-r', RATE, '-b', pf, '-ow', tmp + '.wav', '-ot', tmp + '.trace'], { input: synthText(text) + '\n' });
    if (r.status !== 0) break;
    if (wavPeak(tmp + '.wav') < 30000) break;                  // stable: no clipping
    if (pf !== POSTFILTERS[POSTFILTERS.length - 1]) softened++;
  }
  // Marks with no sound of their own (゛, ゜, っ, ー alone) can't be synthesised: no clip.
  if (r.status !== 0) { if (/No phoneme|cannot be synthesized/.test(r.stderr)) return { ps: [] }; throw new Error('open_jtalk failed for ' + text + ': ' + r.stderr); }
  const trace = readFileSync(tmp + '.trace', 'utf8');
  const ps = phonemes(trace);
  if (!ps.length) return { ps };  // nothing to say (っ, ー on their own)
  // Keep LEAD before the first and TAIL after the last speech sound (from the phoneme timings),
  // give the whole clip one gain to TARGET_LUFS (capped by MAX_PEAK; no compression), fade the
  // edges, and encode a 48 kbps / 24 kHz mono MP3.
  const file = createHash('sha1').update(text).digest('hex').slice(0, 12) + '.mp3';
  const times = [...trace.matchAll(/^(\d+) (\d+) [^\^]+\^[^-]+-([^+]+)\+/gm)].filter((m) => m[3] !== 'sil' && m[3] !== 'pau');
  const total = Number(spawnSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', tmp + '.wav']).stdout.toString());
  const start = Math.max(0, Number(times[0][1]) / 1e7 - LEAD);
  const end = Math.min(total, Number(times[times.length - 1][2]) / 1e7 + TAIL);
  const m = spawnSync('ffmpeg', ['-hide_banner', '-i', tmp + '.wav', '-af', `atrim=${start}:${end},ebur128=peak=true`, '-f', 'null', '-']).stderr.toString();
  const summary = m.slice(m.lastIndexOf('Summary:'));
  const lufs = Number((summary.match(/I:\s+(-?[\d.]+) LUFS/) || [0, -23])[1]);
  const peak = Number((summary.match(/Peak:\s+(-?[\d.]+) dBFS/) || [0, -6])[1]);
  const gain = Math.min(TARGET_LUFS - lufs, MAX_PEAK - peak);
  const dur = end - start;
  const f = spawnSync('ffmpeg', ['-loglevel', 'error', '-y', '-i', tmp + '.wav', '-af',
    `atrim=${start}:${end},asetpts=PTS-STARTPTS,volume=${gain.toFixed(2)}dB,afade=t=in:d=0.01,afade=t=out:st=${Math.max(0, dur - 0.12).toFixed(3)}:d=0.12`,
    '-ac', '1', '-ar', '24000', '-c:a', 'libmp3lame', '-b:a', '48k', '-compression_level', '0', '-map_metadata', '-1', '-write_xing', '1', OUT + file]);
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
  if (SKIP.has(text)) { report.push(`SKIP  ${text}  (no reliable reading: listed in readings.json _skip)`); continue; }
  const res = synth(text);
  if (!res.file) { report.push(`SKIP  ${text}  (nothing to pronounce)`); continue; }
  if (old[text] === res.file) reused++; else made++;
  clips[text] = res.file;
  const said = flatPhonemes(res.ps);
  const given = hints.get(text);
  if (given) {
    const wants = [...given].map(flatRomaji);
    if (!wants.some((w) => sameSound(w) === sameSound(said))) { mismatches++; report.push(`DIFF  ${text}  course: ${[...given].join(' / ')}  voice: ${said}  [${info.where}]`); }
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
  voice: 'Open JTalk with the HTS voice "Takumi" (MMDAgent project, Nagoya Institute of Technology, CC BY 3.0)',
  clips
}, null, 0) + '\n');
if (reportFile) writeFileSync(reportFile, report.join('\n') + '\n');
console.log(`audio: ${Object.keys(clips).length} clips, ${softened} re-rendered with a gentler postfilter, ${mismatches} differ from the course romaji`);
