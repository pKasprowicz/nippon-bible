/* Hiragana data for the Hiragana course: readings, units, memory aids and look-alikes.
   `unit` is the course unit that introduces the character. `look` lists characters that
   learners confuse it with (used for distractors and contrast feedback). */
(function (root) {
  'use strict';

  var BASIC = [
    // unit 1: vowels
    ['あ', 'a', 1, 'A cross with a big loop: a traveller stretching wide after a long flight, sighing "Aaah".', 'おめぬ'],
    ['い', 'i', 1, 'Two short strokes side by side, like two lowercase i\'s without their dots: "ii".', 'りこ'],
    ['う', 'u', 1, 'A small dash over a hook: someone bowing deeply after too much ramen, groaning "uuu".', 'らつ'],
    ['え', 'e', 1, 'A dash, a zig-zag and a kick at the end: an energetic dance move, "eh!"', 'ん'],
    ['お', 'o', 1, 'Like あ plus a little dot flying off to the right: "Oh! I dropped something."', 'あを'],
    // unit 2: k, s
    ['か', 'ka', 2, 'A karate fighter (the hooked stroke) with a drop of sweat flying off: "ka!"', 'や'],
    ['き', 'ki', 2, 'A kite with two crossbars, its string hooked to the ground: "ki(te)". Two bars, unlike さ.', 'さちま'],
    ['く', 'ku', 2, 'One "<" like an open bird beak calling "ku, ku".', 'へ'],
    ['け', 'ke', 2, 'A post on the left and a crossed stroke on the right, like a cursive "k": "ke".', 'はほ'],
    ['こ', 'ko', 2, 'Two short lines like two coins lying on a table: "ko(ins)".', 'いに'],
    ['さ', 'sa', 2, 'A sword (one crossbar) above a curved saddle: a "sa"murai on horseback.', 'きちら'],
    ['し', 'shi', 2, 'A fish hook: "she" catches fish with it.', 'もつ'],
    ['す', 'su', 2, 'A ladle with a loop, stirring "su"(p).', 'む'],
    ['せ', 'se', 2, 'A tall chair with a crossbar: take a "se"at.', 'さ'],
    ['そ', 'so', 2, 'A zig-zag like a lightning bolt, then a curl: "so" fast!', 'ろて'],
    // unit 3: t, n
    ['た', 'ta', 3, 'A cross like a "t" next to two small strokes like こ: t + a = "ta".', 'なに'],
    ['ち', 'chi', 3, 'A cross on top of a round belly that bulges to the right, like the number 5: someone full of "chee"se.', 'さら'],
    ['つ', 'tsu', 3, 'One big rolling wave: "tsu"nami.', 'うし'],
    ['て', 'te', 3, 'A "T" with a curved leg hanging down: "te".', 'そ'],
    ['と', 'to', 3, 'A small thorn stuck in a curve, like a splinter in your "to"e.', 'ど'],
    ['な', 'na', 3, 'A cross, a dot and a knot: a walking stick with a bundle tied on. Time for a "na"p.', 'たは'],
    ['に', 'ni', 3, 'A post and two lines. The two lines look like 二, the kanji for "two", read "ni".', 'こた'],
    ['ぬ', 'nu', 3, 'Like め, but the last stroke ends in an extra loop: something "nu" (new) was added.', 'めあね'],
    ['ね', 'ne', 3, 'A post and a body that curls into a loop at the end, like a cat\'s tail. Neko (cat) starts with "ne".', 'れわぬ'],
    ['の', 'no', 3, 'A single swirl like a "no entry" circle: "no!"', 'め'],
    // unit 4: h, m
    ['は', 'ha', 4, 'A post plus a cross with a loop, like an "H" next to an "a": "ha".', 'ほけ'],
    ['ひ', 'hi', 4, 'A wide grin: "hee-hee".', 'い'],
    ['ふ', 'fu', 4, 'Two puffed cheeks (the side strokes) around the lips, blowing out air: "fuu".', 'ぶ'],
    ['へ', 'he', 4, 'A single little hill: "hey, up here!"', 'く'],
    ['ほ', 'ho', 4, 'は with an extra roof bar on top: the "ho"use version of は.', 'はま'],
    ['ま', 'ma', 4, 'Two belts and a loop: "ma"ma\'s belly after a big dinner.', 'ほもよ'],
    ['み', 'mi', 4, 'A loopy, scribbled "21": "Me? I\'m 21!"', 'む'],
    ['む', 'mu', 4, 'A loop, a long tail and a dot, like a squiggle of "mu"sic.', 'すみ'],
    ['め', 'me', 4, 'A crossed loop that looks like an eye. 目 (me) means "eye".', 'ぬあの'],
    ['も', 'mo', 4, 'A fish hook (like し) with two crossbars through it: "mo"re lines.', 'しま'],
    // unit 5: y, r, w, n
    ['や', 'ya', 5, 'A slingshot with a stone flying off: "ya!"', 'か'],
    ['ゆ', 'yu', 5, 'Printed on hot-spring curtains: ゆ means hot water. A U-shape with a line through it: "yu" (you) in the bath.', 'よ'],
    ['よ', 'yo', 5, 'A crossbar and a looped foot: someone doing "yo"ga, arm out, leg tucked.', 'まゆ'],
    ['ら', 'ra', 5, 'A small tick on top and a curled body: a "ra"bbit with one ear.', 'ちうさ'],
    ['り', 'ri', 5, 'Two lines like い, but the right one is long: reeds by a "ri"ver.', 'い'],
    ['る', 'ru', 5, 'A loop at the end, like a "ru"by ring. (ろ has no loop.)', 'ろ'],
    ['れ', 're', 5, 'Like ね, but the tail kicks out instead of looping: "re"leased.', 'ねわ'],
    ['ろ', 'ro', 5, 'A winding "ro"ad shaped like a 3, with no loop at the end.', 'るそ'],
    ['わ', 'wa', 5, 'Like ね and れ, but the tail curls back inside: a "wa"ve rolling in.', 'ねれ'],
    ['を', 'o', 5, 'A figure leaning on a cross. Only used as a grammar particle, and read "o" (sometimes written "wo").', 'お'],
    ['ん', 'n', 5, 'Like a quickly written lowercase "n".', 'え']
  ];

  // unit 6: dakuten (゛) and handakuten (゜)
  var VOICED = [
    ['が', 'ga', 'か'], ['ぎ', 'gi', 'き'], ['ぐ', 'gu', 'く'], ['げ', 'ge', 'け'], ['ご', 'go', 'こ'],
    ['ざ', 'za', 'さ'], ['じ', 'ji', 'し'], ['ず', 'zu', 'す'], ['ぜ', 'ze', 'せ'], ['ぞ', 'zo', 'そ'],
    ['だ', 'da', 'た'], ['ぢ', 'ji', 'ち'], ['づ', 'zu', 'つ'], ['で', 'de', 'て'], ['ど', 'do', 'と'],
    ['ば', 'ba', 'は'], ['び', 'bi', 'ひ'], ['ぶ', 'bu', 'ふ'], ['べ', 'be', 'へ'], ['ぼ', 'bo', 'ほ'],
    ['ぱ', 'pa', 'は'], ['ぴ', 'pi', 'ひ'], ['ぷ', 'pu', 'ふ'], ['ぺ', 'pe', 'へ'], ['ぽ', 'po', 'ほ']
  ];

  // unit 7: combinations with small ゃ ゅ ょ
  var YOON_BASE = [['き', 'ky'], ['し', 'sh'], ['ち', 'ch'], ['に', 'ny'], ['ひ', 'hy'], ['み', 'my'], ['り', 'ry'],
                   ['ぎ', 'gy'], ['じ', 'j'], ['び', 'by'], ['ぴ', 'py']];
  var SMALL = [['ゃ', 'a'], ['ゅ', 'u'], ['ょ', 'o']];

  var KANA = [], BY_CHAR = {};
  function add(entry) { KANA.push(entry); BY_CHAR[entry.k] = entry; }

  BASIC.forEach(function (b) { add({ k: b[0], r: b[1], unit: b[2], m: b[3], look: Array.from(b[4] || ''), set: 'basic' }); });
  VOICED.forEach(function (v) {
    var base = BY_CHAR[v[2]];
    var mark = v[0].normalize('NFD').slice(-1) === '゚' ? '゜ (small circle)' : '゛ (two dashes)';
    add({
      k: v[0], r: v[1], unit: 6, set: 'voiced', base: v[2],
      m: v[2] + ' (' + base.r + ') + ' + mark + ' → ' + v[1] + '.' +
        (v[0] === 'ぢ' || v[0] === 'づ' ? ' Rare: じ and ず are the usual spellings of ji and zu.' : ''),
      look: []
    });
  });
  YOON_BASE.forEach(function (y) {
    SMALL.forEach(function (s) {
      var k = y[0] + s[0];
      add({ k: k, r: y[1] + s[1], unit: 7, set: 'yoon', base: y[0],
        m: y[0] + ' + small ' + s[0] + ' merge into one beat: ' + y[1] + s[1] + '.', look: [] });
    });
  });
  // Voiced look-alikes: the plain and voiced versions, and the ゛/゜ pair.
  KANA.forEach(function (e) {
    if (e.set !== 'voiced') return;
    var sibs = KANA.filter(function (o) { return o.set === 'voiced' && o.base === e.base && o.k !== e.k; }).map(function (o) { return o.k; });
    e.look = [e.base].concat(sibs);
  });
  KANA.forEach(function (e) {
    if (e.set !== 'yoon') return;
    var small = e.k.slice(1);
    e.look = SMALL.map(function (s) { return e.base + s[0]; }).filter(function (k) { return k !== e.k; })
      .concat([e.base + (small === 'ょ' ? 'よ' : small === 'ゅ' ? 'ゆ' : 'や')]);
  });

  // Characters each unit adds, including marks that are not stand-alone cards.
  var UNIT_CHARS = { 7: ['ゃ', 'ゅ', 'ょ', 'っ'] };
  KANA.forEach(function (e) {
    if (e.k.length !== 1) return;
    (UNIT_CHARS[e.unit] = UNIT_CHARS[e.unit] || []).push(e.k);
  });

  root.NB_KANA = { list: KANA, byChar: BY_CHAR, unitChars: UNIT_CHARS };
})(typeof window !== 'undefined' ? window : globalThis);
