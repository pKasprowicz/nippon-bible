/* Katakana data for the Katakana course: readings, units, memory aids and look-alikes.
   Many memory aids link a katakana to the hiragana you already know, or to the kanji it
   came from. `unit` is the course unit that introduces the character. */
(function (root) {
  'use strict';

  var BASIC = [
    // unit 1: vowels and the k row
    ['ア', 'a', 1, 'An axe: a hooked top bar and a curved handle. Swing it: "Aaa!"', 'マヤ'],
    ['イ', 'i', 1, 'A short slash leaning on a post, like the "person" part of kanji (亻): an individual, "I".', 'トノ'],
    ['ウ', 'u', 1, 'Hiragana う with a roof: a dash on top of a hooked box-lid. Same sound: "u".', 'ワフ'],
    ['エ', 'e', 1, 'An I-beam from a building site: "e"ngineering.', 'コユ'],
    ['オ', 'o', 1, 'Hiragana お without its loop: a cross with a kick. "Oh!"', 'ホナ'],
    ['カ', 'ka', 1, 'Hiragana か without the little dash. Same shape, same sound: "ka".', 'ヤ'],
    ['キ', 'ki', 1, 'Hiragana き with straight lines and no curl at the bottom: a "key" with two teeth.', 'チモサ'],
    ['ク', 'ku', 1, 'A slanted roof with one long leg: a "cook" in a chef\'s hat, seen from the side. No dash inside (that\'s タ).', 'タケワ'],
    ['ケ', 'ke', 1, 'A slash with a T hanging off it, like a leaning "K": "ke".', 'クタ'],
    ['コ', 'ko', 1, 'Two strokes making the "co"rner of a box, open on the left.', 'ユロエ'],
    // unit 2: s, t
    ['サ', 'sa', 2, 'A long bar crossed by two posts, the right one curving down to the left: a "sa"w horse.', 'セヤ'],
    ['シ', 'shi', 2, 'Two dashes stacked on the LEFT and a long stroke sweeping UP from the bottom: "she" smiles up at you.', 'ツンミ'],
    ['ス', 'su', 2, 'A bar that bends into a long sweep, with a leg kicking out: a "su"mo kick.', 'ヌフラ'],
    ['セ', 'se', 2, 'Hiragana せ squared off: a bar with a hook, crossed by a post that curves right.', 'ヤサ'],
    ['ソ', 'so', 2, 'Two strokes falling DOWN from the top, like rain: "so" wet. (ン sweeps up instead.)', 'ンリツ'],
    ['タ', 'ta', 2, 'Like ク with an extra dash inside: ク is "ta"king something in.', 'クケヌ'],
    ['チ', 'chi', 2, 'A slash on top of a T with a bar: a "chee"rleader with a pom-pom.', 'テナキ'],
    ['ツ', 'tsu', 2, 'Three dashes along the TOP, and the long stroke falls DOWN from the right: a "tsu"nami wave crashing down.', 'シソ'],
    ['テ', 'te', 2, 'A short bar above a T: a "te"lephone pole with a crossbar. (チ has a slash on top instead.)', 'チラ'],
    ['ト', 'to', 2, 'A post with one small branch: a "to"tem pole.', 'イ'],
    // unit 3: n, h
    ['ナ', 'na', 3, 'A plus sign with a curved leg, like the start of hiragana な: "na".', 'メチオ'],
    ['ニ', 'ni', 3, 'Two lines, exactly like 二 ("two", read "ni").', 'コミ'],
    ['ヌ', 'nu', 3, 'Like フ with a slash crossing it: something "nu" (new) has been crossed out.', 'スメフ'],
    ['ネ', 'ne', 3, 'A dot, a bar and a T with a small arm: a "ne"ighbour in a hat, waving.', 'ホ'],
    ['ノ', 'no', 3, 'One single slash: "no!", crossing something out.', 'メソ'],
    ['ハ', 'ha', 3, 'Two strokes spreading apart, like a laughing mouth: "ha ha!"', 'ルソ'],
    ['ヒ', 'hi', 3, 'A short bar and a hook, like a backwards L with a hat: "hi!"', 'セ'],
    ['フ', 'fu', 3, 'One stroke: a bar that bends down, like the top of hiragana ふ. Blow out: "fuu".', 'ワヌラヲ'],
    ['ヘ', 'he', 3, 'Exactly the same as hiragana へ: a little hill. "Hey, up here!"', 'ハ'],
    ['ホ', 'ho', 3, 'A cross with two little feet, like the kanji 木 (tree): a "ho"use plant.', 'オネ'],
    // unit 4: m, y
    ['マ', 'ma', 4, 'A bar bending into a point, with a short dash: a "ma"rtini glass tipped over.', 'ムア'],
    ['ミ', 'mi', 4, 'Three slanted lines, like 三 (three). "Mittsu" means three things.', 'シニ'],
    ['ム', 'mu', 4, 'A triangle with a little tail: an arm flexing its "mu"scle.', 'マス'],
    ['メ', 'me', 4, 'Two crossed strokes, like an X: a "me"ss, crossed out.', 'ナヌノ'],
    ['モ', 'mo', 4, 'Hiragana も without the hook: two bars and a post curving right. "Mo"re of the same.', 'キ'],
    ['ヤ', 'ya', 4, 'Like hiragana や: a bar with a hook and a slash through it. "Ya!"', 'セカ'],
    ['ユ', 'yu', 4, 'A U lying on its side, with the bottom bar sticking out: "yu" (you). (コ has no overhang.)', 'コヨ'],
    ['ヨ', 'yo', 4, 'Three bars on a post, like a backwards E: "yo"!', 'ユコヲ'],
    // unit 5: r, w, n
    ['ラ', 'ra', 5, 'A short bar over フ, like hiragana ら without its curl: "ra".', 'フヲテ'],
    ['リ', 'ri', 5, 'Like hiragana り: two strokes, the right one much longer.', 'ソル'],
    ['ル', 'ru', 5, 'Two legs, the right one kicking up: "ru"nning.', 'レハ'],
    ['レ', 're', 5, 'One stroke, like a tick ✓, or the right leg of ル on its own: "re".', 'ル'],
    ['ロ', 'ro', 5, 'A closed box, like 口 (mouth): a "ro"om.', 'コ'],
    ['ワ', 'wa', 5, 'Like ウ without the dash on top: a "wa"ter glass.', 'ウフク'],
    ['ヲ', 'o', 5, 'Like フ with an extra bar. Almost only used as a particle; read "o".', 'フラヨ'],
    ['ン', 'n', 5, 'One dash, and a stroke sweeping UP from the bottom: like シ with only one dash. (ソ falls down instead.)', 'ソシツ']
  ];

  // unit 6: dakuten (゛) and handakuten (゜)
  var VOICED = [
    ['ガ', 'ga', 'カ'], ['ギ', 'gi', 'キ'], ['グ', 'gu', 'ク'], ['ゲ', 'ge', 'ケ'], ['ゴ', 'go', 'コ'],
    ['ザ', 'za', 'サ'], ['ジ', 'ji', 'シ'], ['ズ', 'zu', 'ス'], ['ゼ', 'ze', 'セ'], ['ゾ', 'zo', 'ソ'],
    ['ダ', 'da', 'タ'], ['ヂ', 'ji', 'チ'], ['ヅ', 'zu', 'ツ'], ['デ', 'de', 'テ'], ['ド', 'do', 'ト'],
    ['バ', 'ba', 'ハ'], ['ビ', 'bi', 'ヒ'], ['ブ', 'bu', 'フ'], ['ベ', 'be', 'ヘ'], ['ボ', 'bo', 'ホ'],
    ['パ', 'pa', 'ハ'], ['ピ', 'pi', 'ヒ'], ['プ', 'pu', 'フ'], ['ペ', 'pe', 'ヘ'], ['ポ', 'po', 'ホ']
  ];

  // unit 7: combinations with small ャ ュ ョ
  var YOON_BASE = [['キ', 'ky'], ['シ', 'sh'], ['チ', 'ch'], ['ニ', 'ny'], ['ヒ', 'hy'], ['ミ', 'my'], ['リ', 'ry'],
                   ['ギ', 'gy'], ['ジ', 'j'], ['ビ', 'by'], ['ピ', 'py']];
  var SMALL = [['ャ', 'a'], ['ュ', 'u'], ['ョ', 'o']];

  // unit 7: extra sounds that only exist for foreign words, built with small ァ ィ ゥ ェ ォ
  var EXTENDED = [
    ['ティ', 'ti', 'テ', 'テ (te) + small ィ: "ti", as in パーティー (party).'],
    ['ディ', 'di', 'デ', 'デ (de) + small ィ: "di", as in ディズニー (Disney).'],
    ['ファ', 'fa', 'フ', 'フ (fu) + small ァ: "fa", as in ファミリー (family).'],
    ['フィ', 'fi', 'フ', 'フ (fu) + small ィ: "fi", as in フィルム (film).'],
    ['フェ', 'fe', 'フ', 'フ (fu) + small ェ: "fe", as in カフェ (café).'],
    ['フォ', 'fo', 'フ', 'フ (fu) + small ォ: "fo", as in フォーク (fork).'],
    ['ウィ', 'wi', 'ウ', 'ウ (u) + small ィ: "wi", as in ウィンドウ (window).'],
    ['ウェ', 'we', 'ウ', 'ウ (u) + small ェ: "we", as in ウェブ (web).'],
    ['シェ', 'she', 'シ', 'シ (shi) + small ェ: "she", as in シェフ (chef).'],
    ['ジェ', 'je', 'ジ', 'ジ (ji) + small ェ: "je", as in ジェット (jet).'],
    ['チェ', 'che', 'チ', 'チ (chi) + small ェ: "che", as in チェック (check).']
  ];

  var KANA = [], BY_CHAR = {};
  function add(entry) { KANA.push(entry); BY_CHAR[entry.k] = entry; }

  BASIC.forEach(function (b) { add({ k: b[0], r: b[1], unit: b[2], m: b[3], look: Array.from(b[4] || ''), set: 'basic' }); });
  VOICED.forEach(function (v) {
    var base = BY_CHAR[v[2]];
    var mark = v[0].normalize('NFD').slice(-1) === '゚' ? '゜ (small circle)' : '゛ (two dashes)';
    add({
      k: v[0], r: v[1], unit: 6, set: 'voiced', base: v[2],
      m: v[2] + ' (' + base.r + ') + ' + mark + ' → ' + v[1] + '.' +
        (v[0] === 'ヂ' || v[0] === 'ヅ' ? ' Rare: ジ and ズ are the usual spellings of ji and zu.' : ''),
      look: []
    });
  });
  YOON_BASE.forEach(function (y) {
    SMALL.forEach(function (s) {
      add({ k: y[0] + s[0], r: y[1] + s[1], unit: 7, set: 'yoon', base: y[0],
        m: y[0] + ' + small ' + s[0] + ' merge into one beat: ' + y[1] + s[1] + '.', look: [] });
    });
  });
  EXTENDED.forEach(function (x) { add({ k: x[0], r: x[1], unit: 7, set: 'extended', base: x[2], m: x[3], look: [] }); });

  KANA.forEach(function (e) {
    if (e.set === 'voiced') {
      var sibs = KANA.filter(function (o) { return o.set === 'voiced' && o.base === e.base && o.k !== e.k; }).map(function (o) { return o.k; });
      e.look = [e.base].concat(sibs);
    } else if (e.set === 'yoon') {
      var small = e.k.slice(1);
      e.look = SMALL.map(function (s) { return e.base + s[0]; }).filter(function (k) { return k !== e.k; });
      if (small === 'ョ') e.look.push(e.base + 'ヨ'); // big ヨ: two beats
    } else if (e.set === 'extended') {
      e.look = KANA.filter(function (o) { return o.set === 'extended' && o.base === e.base && o.k !== e.k; }).map(function (o) { return o.k; });
      if (e.k === 'ティ') e.look.push('チ');
      if (e.k === 'ディ') e.look.push('ジ');
    }
  });

  // Characters each unit adds. The long-vowel bar ー is taught in unit 1, small marks in unit 7.
  var UNIT_CHARS = { 1: ['ー'], 7: ['ャ', 'ュ', 'ョ', 'ッ', 'ァ', 'ィ', 'ゥ', 'ェ', 'ォ'] };
  KANA.forEach(function (e) {
    if (e.k.length !== 1) return;
    (UNIT_CHARS[e.unit] = UNIT_CHARS[e.unit] || []).push(e.k);
  });

  root.NB_KATA = {
    name: 'katakana', Name: 'Katakana', list: KANA, byChar: BY_CHAR, unitChars: UNIT_CHARS,
    exclude: ['ヂ', 'ヅ'], // sound the same as ジ/ズ
    gojuon: [['ア', 'イ', 'ウ', 'エ', 'オ'], ['カ', 'キ', 'ク', 'ケ', 'コ'], ['サ', 'シ', 'ス', 'セ', 'ソ'], ['タ', 'チ', 'ツ', 'テ', 'ト'],
      ['ナ', 'ニ', 'ヌ', 'ネ', 'ノ'], ['ハ', 'ヒ', 'フ', 'ヘ', 'ホ'], ['マ', 'ミ', 'ム', 'メ', 'モ'], ['ヤ', '', 'ユ', '', 'ヨ'],
      ['ラ', 'リ', 'ル', 'レ', 'ロ'], ['ワ', '', '', '', 'ヲ'], ['ン', '', '', '', '']],
    sets: [{ set: 'voiced', label: 'With ゛ and ゜' }, { set: 'yoon', label: 'Combinations', wide: true },
      { set: 'extended', label: 'Extra sounds for foreign words', wide: true }]
  };
})(typeof window !== 'undefined' ? window : globalThis);
