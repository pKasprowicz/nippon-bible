(function () {
  'use strict';

  var GROUPS = [
    { id: 'course', title: 'Japan guide' },
    { id: 'hiragana', title: 'Hiragana course' },
    { id: 'katakana', title: 'Katakana course' },
    { id: 'kanji', title: 'Kanji course' },
    { id: 'cuisine', title: 'Cuisine handbook' },
    { id: 'folklore', title: 'Folklore handbook' },
    { id: 'popculture', title: 'Pop culture handbook' },
    { id: 'bathing', title: 'Bathing handbook' },
    { id: 'railways', title: 'Railways handbook' },
    { id: 'festivals', title: 'Festivals handbook' },
    { id: 'signs', title: 'Signs in the wild' }
  ];
  var LESSONS = [
    { id: 'guide', file: 'lessons/00-guide.md', group: 'course', title: 'Overview', label: '★' },
    { id: '01-pronunciation', file: 'lessons/01-pronunciation.md', group: 'course', title: 'Pronunciation' },
    { id: '02-writing', file: 'lessons/02-writing.md', group: 'course', title: 'Writing & recognition' },
    { id: '03-core-words', file: 'lessons/03-core-words.md', group: 'course', title: 'Core words' },
    { id: '04-phrases', file: 'lessons/04-phrases.md', group: 'course', title: 'Phrases & patterns' },
    { id: '05-situations', file: 'lessons/05-situations.md', group: 'course', title: 'Situations' },
    { id: '06-subways', file: 'lessons/06-subways.md', group: 'course', title: 'Subways: Tokyo & Osaka' },
    { id: '07-etiquette', file: 'lessons/07-etiquette.md', group: 'course', title: 'Customs & etiquette' },
    { id: '08-pitfalls', file: 'lessons/08-pitfalls.md', group: 'course', title: 'Tourist pitfalls' },
    { id: '09-food', file: 'lessons/09-food.md', group: 'course', title: 'Food & dishes' },
    { id: '10-cheat-sheet', file: 'lessons/10-cheat-sheet.md', group: 'course', title: 'Cheat sheet & self-test' },
    { id: 'hiragana', file: 'hiragana/00-start.md', group: 'hiragana', title: 'Start here', label: '★' },
    { id: 'hiragana-1', file: 'hiragana/01-vowels.md', group: 'hiragana', title: 'あいうえお vowels' },
    { id: 'hiragana-2', file: 'hiragana/02-k-s.md', group: 'hiragana', title: 'か・さ rows' },
    { id: 'hiragana-3', file: 'hiragana/03-t-n.md', group: 'hiragana', title: 'た・な rows' },
    { id: 'hiragana-4', file: 'hiragana/04-h-m.md', group: 'hiragana', title: 'は・ま rows' },
    { id: 'hiragana-5', file: 'hiragana/05-y-r-w.md', group: 'hiragana', title: 'や・ら・わ rows and ん' },
    { id: 'hiragana-6', file: 'hiragana/06-dakuten.md', group: 'hiragana', title: '゛ and ゜: が, ぱ…' },
    { id: 'hiragana-7', file: 'hiragana/07-combinations.md', group: 'hiragana', title: 'きゃ, っ, long vowels' },
    { id: 'hiragana-8', file: 'hiragana/08-real-world.md', group: 'hiragana', title: 'Real-world reading & final test' },
    { id: 'hiragana-review', file: 'hiragana/09-review.md', group: 'hiragana', title: 'Daily review', label: '↻' },
    { id: 'katakana', file: 'katakana/00-start.md', group: 'katakana', title: 'Start here', label: '★' },
    { id: 'katakana-1', file: 'katakana/01-a-k.md', group: 'katakana', title: 'ア and カ rows' },
    { id: 'katakana-2', file: 'katakana/02-s-t.md', group: 'katakana', title: 'サ・タ rows' },
    { id: 'katakana-3', file: 'katakana/03-n-h.md', group: 'katakana', title: 'ナ・ハ rows' },
    { id: 'katakana-4', file: 'katakana/04-m-y.md', group: 'katakana', title: 'マ・ヤ rows' },
    { id: 'katakana-5', file: 'katakana/05-r-w.md', group: 'katakana', title: 'ラ・ワ rows and ン' },
    { id: 'katakana-6', file: 'katakana/06-dakuten.md', group: 'katakana', title: '゛ and ゜: ガ, パ…' },
    { id: 'katakana-7', file: 'katakana/07-combinations.md', group: 'katakana', title: 'ッ, キャ, ティ, ファ…' },
    { id: 'katakana-8', file: 'katakana/08-real-world.md', group: 'katakana', title: 'Real-world reading & final test' },
    { id: 'katakana-review', file: 'katakana/09-review.md', group: 'katakana', title: 'Daily review', label: '↻' },
    { id: 'kanji', file: 'kanji/00-start.md', group: 'kanji', title: 'Start here', label: '★' },
    { id: 'kanji-1', file: 'kanji/01-numbers.md', group: 'kanji', title: 'Numbers and prices' },
    { id: 'kanji-2', file: 'kanji/02-directions.md', group: 'kanji', title: 'Entrances and directions' },
    { id: 'kanji-3', file: 'kanji/03-trains.md', group: 'kanji', title: 'Stations and trains' },
    { id: 'kanji-4', file: 'kanji/04-food.md', group: 'kanji', title: 'Restaurants and food' },
    { id: 'kanji-5', file: 'kanji/05-shops.md', group: 'kanji', title: 'Shops and money' },
    { id: 'kanji-6', file: 'kanji/06-hours.md', group: 'kanji', title: 'Opening hours and days' },
    { id: 'kanji-7', file: 'kanji/07-toilets-onsen.md', group: 'kanji', title: 'Toilets, onsen and hotels' },
    { id: 'kanji-8', file: 'kanji/08-safety.md', group: 'kanji', title: 'Safety and rules' },
    { id: 'kanji-9', file: 'kanji/09-real-world.md', group: 'kanji', title: 'Real-world signs & final test' },
    { id: 'kanji-review', file: 'kanji/10-review.md', group: 'kanji', title: 'Daily review', label: '↻' },
    { id: 'cuisine', file: 'cuisine/00-start.md', group: 'cuisine', title: 'Start here', label: '★' },
    { id: 'cuisine-1', file: 'cuisine/01-umami.md', group: 'cuisine', title: 'Umami' },
    { id: 'cuisine-2', file: 'cuisine/02-dashi.md', group: 'cuisine', title: 'Dashi' },
    { id: 'cuisine-3', file: 'cuisine/03-koji.md', group: 'cuisine', title: 'Kōji' },
    { id: 'cuisine-4', file: 'cuisine/04-shoyu-miso.md', group: 'cuisine', title: 'Soy sauce and miso' },
    { id: 'cuisine-5', file: 'cuisine/05-mirin-vinegar.md', group: 'cuisine', title: 'Mirin, vinegar and sake' },
    { id: 'cuisine-6', file: 'cuisine/06-raw-fish.md', group: 'cuisine', title: 'Raw fish' },
    { id: 'cuisine-7', file: 'cuisine/07-frying.md', group: 'cuisine', title: 'Frying' },
    { id: 'cuisine-8', file: 'cuisine/08-koji-marinades.md', group: 'cuisine', title: 'Marinating with kōji' },
    { id: 'cuisine-9', file: 'cuisine/09-rice.md', group: 'cuisine', title: 'Rice' },
    { id: 'cuisine-10', file: 'cuisine/10-noodles.md', group: 'cuisine', title: 'Noodles' },
    { id: 'cuisine-11', file: 'cuisine/11-tofu.md', group: 'cuisine', title: 'Tofu' },
    { id: 'cuisine-12', file: 'cuisine/12-an-wagashi.md', group: 'cuisine', title: 'Bean paste, agar and yōkan' },
    { id: 'cuisine-13', file: 'cuisine/13-mochi-starches.md', group: 'cuisine', title: 'Mochi and starch gels' },
    { id: 'cuisine-14', file: 'cuisine/14-texture.md', group: 'cuisine', title: 'The language of texture' },
    { id: 'cuisine-glossary', file: 'cuisine/15-glossary.md', group: 'cuisine', title: 'Glossary', label: 'A–Z', kind: 'Glossary' },
    { id: 'cuisine-sources', file: 'cuisine/16-sources.md', group: 'cuisine', title: 'Sources and image credits', label: '§', kind: 'Sources' },
    { id: 'folklore', file: 'folklore/00-start.md', group: 'folklore', title: 'Start here', label: '★' },
    { id: 'folklore-1', file: 'folklore/01-kami.md', group: 'folklore', title: 'Kami and the word “Shinto”' },
    { id: 'folklore-2', file: 'folklore/02-myths.md', group: 'folklore', title: 'Myths and the Land of Yomi' },
    { id: 'folklore-3', file: 'folklore/03-purity.md', group: 'folklore', title: 'Pollution and purification' },
    { id: 'folklore-4', file: 'folklore/04-kami-buddhas.md', group: 'folklore', title: 'Kami and buddhas together' },
    { id: 'folklore-5', file: 'folklore/05-separation.md', group: 'folklore', title: 'The separation of 1868' },
    { id: 'folklore-6', file: 'folklore/06-ancestors.md', group: 'folklore', title: 'Ancestors, Bon and the afterlife' },
    { id: 'folklore-7', file: 'folklore/07-vengeful.md', group: 'folklore', title: 'Vengeful spirits' },
    { id: 'folklore-8', file: 'folklore/08-yurei.md', group: 'folklore', title: 'How the yūrei took shape' },
    { id: 'folklore-9', file: 'folklore/09-ghost-types.md', group: 'folklore', title: 'A field guide to ghosts' },
    { id: 'folklore-10', file: 'folklore/10-yokai.md', group: 'folklore', title: 'What a yōkai is' },
    { id: 'folklore-11', file: 'folklore/11-night-parade.md', group: 'folklore', title: 'Night parades and tool spirits' },
    { id: 'folklore-12', file: 'folklore/12-bestiary.md', group: 'folklore', title: 'A yōkai bestiary' },
    { id: 'folklore-13', file: 'folklore/13-yokai-today.md', group: 'folklore', title: 'Yōkai in modern Japan' },
    { id: 'folklore-glossary', file: 'folklore/14-glossary.md', group: 'folklore', title: 'Glossary', label: 'A–Z', kind: 'Glossary' },
    { id: 'folklore-sources', file: 'folklore/15-sources.md', group: 'folklore', title: 'Sources and image credits', label: '§', kind: 'Sources' },
    { id: 'popculture', file: 'popculture/00-start.md', group: 'popculture', title: 'Start here', label: '★' },
    { id: 'popculture-1', file: 'popculture/01-edo-roots.md', group: 'popculture', title: 'Before manga: scrolls, books and prints' },
    { id: 'popculture-2', file: 'popculture/02-manga.md', group: 'popculture', title: 'Manga' },
    { id: 'popculture-3', file: 'popculture/03-anime.md', group: 'popculture', title: 'Anime' },
    { id: 'popculture-4', file: 'popculture/04-shorthand.md', group: 'popculture', title: 'Symbols and stock voices' },
    { id: 'popculture-5', file: 'popculture/05-cinema.md', group: 'popculture', title: 'Cinema beyond monsters' },
    { id: 'popculture-6', file: 'popculture/06-kaiju.md', group: 'popculture', title: 'Monsters and special effects' },
    { id: 'popculture-7', file: 'popculture/07-games.md', group: 'popculture', title: 'Video games' },
    { id: 'popculture-8', file: 'popculture/08-music.md', group: 'popculture', title: 'Music' },
    { id: 'popculture-9', file: 'popculture/09-kawaii.md', group: 'popculture', title: 'Kawaii and character culture' },
    { id: 'popculture-10', file: 'popculture/10-otaku.md', group: 'popculture', title: 'Otaku and fandom' },
    { id: 'popculture-11', file: 'popculture/11-sacred.md', group: 'popculture', title: 'Pop culture, religion and folklore' },
    { id: 'popculture-12', file: 'popculture/12-cool-japan.md', group: 'popculture', title: 'Cool Japan' },
    { id: 'popculture-13', file: 'popculture/13-travel.md', group: 'popculture', title: 'A traveller’s guide' },
    { id: 'popculture-14', file: 'popculture/14-language.md', group: 'popculture', title: 'Language for fans' },
    { id: 'popculture-glossary', file: 'popculture/15-glossary.md', group: 'popculture', title: 'Glossary', label: 'A–Z', kind: 'Glossary' },
    { id: 'popculture-sources', file: 'popculture/16-sources.md', group: 'popculture', title: 'Sources and image credits', label: '§', kind: 'Sources' },
    { id: 'bathing', file: 'bathing/00-start.md', group: 'bathing', title: 'Start here', label: '★' },
    { id: 'bathing-1', file: 'bathing/01-definition.md', group: 'bathing', title: 'What counts as an onsen' },
    { id: 'bathing-2', file: 'bathing/02-heat.md', group: 'bathing', title: 'Where the heat comes from' },
    { id: 'bathing-3', file: 'bathing/03-label.md', group: 'bathing', title: 'Reading the label' },
    { id: 'bathing-4', file: 'bathing/04-temples.md', group: 'bathing', title: 'Temple baths' },
    { id: 'bathing-5', file: 'bathing/05-edo.md', group: 'bathing', title: 'The bathhouses of Edo' },
    { id: 'bathing-6', file: 'bathing/06-sento.md', group: 'bathing', title: 'The sentō' },
    { id: 'bathing-7', file: 'bathing/07-towns.md', group: 'bathing', title: 'Onsen towns and tōji' },
    { id: 'bathing-8', file: 'bathing/08-ryokan.md', group: 'bathing', title: 'Staying at a ryokan' },
    { id: 'bathing-9', file: 'bathing/09-etiquette.md', group: 'bathing', title: 'Bath etiquette' },
    { id: 'bathing-10', file: 'bathing/10-tattoos.md', group: 'bathing', title: 'Tattoos' },
    { id: 'bathing-11', file: 'bathing/11-health.md', group: 'bathing', title: 'Bathing safely' },
    { id: 'bathing-12', file: 'bathing/12-language.md', group: 'bathing', title: 'Bath Japanese' },
    { id: 'bathing-glossary', file: 'bathing/13-glossary.md', group: 'bathing', title: 'Glossary', label: 'A–Z', kind: 'Glossary' },
    { id: 'bathing-sources', file: 'bathing/14-sources.md', group: 'bathing', title: 'Sources and image credits', label: '§', kind: 'Sources' },
    { id: 'railways', file: 'railways/00-start.md', group: 'railways', title: 'Start here', label: '★' },
    { id: 'railways-1', file: 'railways/01-first-line.md', group: 'railways', title: 'The first railway' },
    { id: 'railways-2', file: 'railways/02-national.md', group: 'railways', title: 'A national railway' },
    { id: 'railways-3', file: 'railways/03-shinkansen.md', group: 'railways', title: 'The Shinkansen' },
    { id: 'railways-4', file: 'railways/04-jnr-reform.md', group: 'railways', title: 'The break-up of JNR' },
    { id: 'railways-5', file: 'railways/05-private.md', group: 'railways', title: 'Railways that built cities' },
    { id: 'railways-6', file: 'railways/06-subways.md', group: 'railways', title: 'The subways of Tokyo and Osaka' },
    { id: 'railways-7', file: 'railways/07-safety.md', group: 'railways', title: 'Safety and punctuality' },
    { id: 'railways-8', file: 'railways/08-network.md', group: 'railways', title: 'The Shinkansen network today' },
    { id: 'railways-9', file: 'railways/09-tickets.md', group: 'railways', title: 'Fares and tickets' },
    { id: 'railways-10', file: 'railways/10-local-lines.md', group: 'railways', title: 'Local lines in trouble' },
    { id: 'railways-11', file: 'railways/11-freight-night.md', group: 'railways', title: 'Freight and night trains' },
    { id: 'railways-12', file: 'railways/12-ekiben.md', group: 'railways', title: 'Ekiben and station life' },
    { id: 'railways-13', file: 'railways/13-language.md', group: 'railways', title: 'Railway Japanese' },
    { id: 'railways-glossary', file: 'railways/14-glossary.md', group: 'railways', title: 'Glossary', label: 'A–Z', kind: 'Glossary' },
    { id: 'railways-sources', file: 'railways/15-sources.md', group: 'railways', title: 'Sources and image credits', label: '§', kind: 'Sources' },
    { id: 'festivals', file: 'festivals/00-start.md', group: 'festivals', title: 'Start here', label: '★' },
    { id: 'festivals-1', file: 'festivals/01-calendars.md', group: 'festivals', title: 'The old calendar and the switch of 1873' },
    { id: 'festivals-2', file: 'festivals/02-solar-terms.md', group: 'festivals', title: 'Solar terms, lucky days and month names' },
    { id: 'festivals-3', file: 'festivals/03-holidays.md', group: 'festivals', title: 'National holidays and Golden Week' },
    { id: 'festivals-4', file: 'festivals/04-sekku.md', group: 'festivals', title: 'The five seasonal festivals' },
    { id: 'festivals-5', file: 'festivals/05-new-year.md', group: 'festivals', title: 'New Year' },
    { id: 'festivals-6', file: 'festivals/06-spring.md', group: 'festivals', title: 'Setsubun and spring' },
    { id: 'festivals-7', file: 'festivals/07-summer.md', group: 'festivals', title: 'Summer: Bon, dances and fireworks' },
    { id: 'festivals-8', file: 'festivals/08-autumn-winter.md', group: 'festivals', title: 'Autumn and the end of the year' },
    { id: 'festivals-9', file: 'festivals/09-matsuri.md', group: 'festivals', title: 'What a matsuri is' },
    { id: 'festivals-10', file: 'festivals/10-great-festivals.md', group: 'festivals', title: 'The great festivals' },
    { id: 'festivals-11', file: 'festivals/11-visiting.md', group: 'festivals', title: 'Going to a festival' },
    { id: 'festivals-12', file: 'festivals/12-language.md', group: 'festivals', title: 'Festival and season Japanese' },
    { id: 'festivals-glossary', file: 'festivals/13-glossary.md', group: 'festivals', title: 'Glossary', label: 'A–Z', kind: 'Glossary' },
    { id: 'festivals-sources', file: 'festivals/14-sources.md', group: 'festivals', title: 'Sources and image credits', label: '§', kind: 'Sources' },
    { id: 'signs', file: 'signs/00-gallery.md', group: 'signs', title: 'Photo gallery', label: '▦', kind: 'Gallery' }
  ];
  // Number lessons within their group unless they have their own label.
  GROUPS.forEach(function (g) {
    var n = 0;
    LESSONS.forEach(function (l) { if (l.group === g.id && !l.label) l.label = String(++n); });
  });
  var BY_FILE = {};
  LESSONS.forEach(function (l) { BY_FILE[l.file] = l; });
  // Old lesson ids (kept so bookmarks and saved progress keep working)
  var ALIASES = { overview: 'guide', '06-cheat-sheet': '10-cheat-sheet', '09-cheat-sheet': '10-cheat-sheet' };
  var JA_RUN = /[々぀-ヿ㐀-䶿一-鿿～〜]+(?:[、。\s]?[々぀-ヿ㐀-䶿一-鿿～〜]+)*/g;

  var content = document.getElementById('content');
  var navList = document.getElementById('navList');
  var sidebar = document.getElementById('sidebar');
  var scrim = document.getElementById('scrim');
  var menuBtn = document.getElementById('menuBtn');
  var cache = {};

  /* ---------- storage (best effort) ---------- */
  function load(key, fallback) {
    try { var v = localStorage.getItem(key); return v === null ? fallback : JSON.parse(v); } catch (e) { return fallback; }
  }
  function save(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) { /* ignore */ }
  }
  var done = load('nb-done', {});
  Object.keys(ALIASES).forEach(function (old) {
    if (done[old]) { done[ALIASES[old]] = true; delete done[old]; save('nb-done', done); }
  });

  /* ---------- helpers ---------- */
  function el(tag, attrs, children) {
    var node = document.createElement(tag);
    Object.keys(attrs || {}).forEach(function (k) {
      if (k === 'text') node.textContent = attrs[k];
      else if (k === 'html') node.innerHTML = attrs[k];
      else if (k.slice(0, 2) === 'on') node.addEventListener(k.slice(2), attrs[k]);
      else node.setAttribute(k, attrs[k]);
    });
    (children || []).forEach(function (c) { if (c) node.appendChild(typeof c === 'string' ? document.createTextNode(c) : c); });
    return node;
  }
  function fetchText(path) {
    if (cache[path]) return Promise.resolve(cache[path]);
    return fetch(path, { cache: 'no-cache' }).then(function (r) {
      if (!r.ok) throw new Error(path + ': HTTP ' + r.status);
      return r.text();
    }).then(function (t) { cache[path] = t; return t; });
  }
  var toastTimer;
  function toast(msg) {
    var t = document.getElementById('toast');
    t.textContent = msg; t.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { t.hidden = true; }, 3200);
  }

  /* ---------- speech ---------- */
  // Recorded clips (assets/audio, made by scripts/audio/build-audio.mjs with Open JTalk) give
  // every device the same voice, offline. A phrase without a clip uses the browser's own
  // Japanese voice, if it has one.
  var clips = null;
  fetch('assets/audio/index.json').then(function (r) { return r.ok ? r.json() : null; })
    .then(function (j) { clips = j && j.clips; }).catch(function () {});
  var speakingNode = null;
  function clipFor(text) { var k = text.replace(/[〜～]/g, '').trim(); return clips && clips[k] ? 'assets/audio/' + clips[k] : null; }
  function markSpeaking(node) {
    document.querySelectorAll('.ja.speaking').forEach(function (n) { n.classList.remove('speaking'); });
    speakingNode = node || null;
    if (node) node.classList.add('speaking');
  }
  function doneSpeaking() { if (speakingNode) speakingNode.classList.remove('speaking'); speakingNode = null; }

  // Clips play through Web Audio: decoded once and kept (the last 60), so a clip starts at
  // once and the exercises can prepare the next question's sound in advance. Fetching a whole
  // file also avoids audio elements' range requests and the downloads they can leave open.
  var AC = window.AudioContext || window.webkitAudioContext;
  var actx = null, decoded = new Map(), playing = null, pendingPlay = 0, playSeq = 0;
  function audioCtx() { if (!actx && AC) { try { actx = new AC(); } catch (e) { actx = null; } } return actx; }
  function loadClip(src) {
    var c = audioCtx();
    if (!c) return Promise.reject(new Error('no Web Audio'));
    if (decoded.has(src)) { var hit = decoded.get(src); decoded.delete(src); decoded.set(src, hit); return hit; }
    var p = fetch(src).then(function (r) {
      if (!r.ok) throw new Error(src + ': HTTP ' + r.status);
      return r.arrayBuffer();
    }).then(function (buf) {
      return new Promise(function (ok, fail) { c.decodeAudioData(buf, ok, fail); });   // callback form: older Safari
    });
    p.catch(function () { decoded.delete(src); });
    decoded.set(src, p);
    while (decoded.size > 60) decoded.delete(decoded.keys().next().value);
    return p;
  }
  function preloadSpeech(text) { var src = clipFor(text); if (src) loadClip(src).catch(function () {}); }
  function stopClip() {
    playSeq++; pendingPlay = 0;
    if (playing) { var s = playing; playing = null; try { s.stop(); } catch (e) { /* already ended */ } }
  }
  function playClip(src, node) {
    var c = audioCtx(), seq = ++playSeq;
    if (!c) return Promise.reject(new Error('no Web Audio'));
    if (c.state === 'suspended') c.resume();
    pendingPlay = seq;
    return loadClip(src).then(function (buffer) {
      if (seq !== playSeq) return;           // a newer sound (or a stop) came first
      pendingPlay = 0;
      var source = c.createBufferSource();
      source.buffer = buffer;
      source.connect(c.destination);
      source.onended = function () { if (playing === source) { playing = null; doneSpeaking(); } };
      playing = source;
      markSpeaking(node);
      source.start();
    }, function (err) { if (seq === playSeq) pendingPlay = 0; throw err; });
  }
  // iOS (and other browsers) only let a page start sound after a tap: resume the audio
  // context and play a silent instant during the first one.
  function unlockAudio() {
    var c = audioCtx();
    if (!c) return;
    if (c.state === 'suspended') c.resume();
    try { var s = c.createBufferSource(); s.buffer = c.createBuffer(1, 1, 22050); s.connect(c.destination); s.start(0); } catch (e) { /* ignore */ }
    if (c.state === 'running') {
      document.removeEventListener('pointerdown', unlockAudio, true);
      document.removeEventListener('keydown', unlockAudio, true);
    }
  }
  document.addEventListener('pointerdown', unlockAudio, true);
  document.addEventListener('keydown', unlockAudio, true);

  var jaVoice = null;
  function pickVoice() {
    if (!('speechSynthesis' in window)) return;
    var voices = speechSynthesis.getVoices();
    jaVoice = voices.filter(function (v) { return /^ja/i.test(v.lang); })[0] || null;
  }
  if ('speechSynthesis' in window) {
    pickVoice();
    speechSynthesis.addEventListener('voiceschanged', pickVoice);
  }
  function stopSpeech() {
    stopClip(); doneSpeaking();
    if ('speechSynthesis' in window && (speechSynthesis.speaking || speechSynthesis.pending)) speechSynthesis.cancel();
  }
  function speechBusy() {
    return !!playing || !!pendingPlay || ('speechSynthesis' in window && (speechSynthesis.speaking || speechSynthesis.pending));
  }
  function canSay(text) { return !!clipFor(text) || !!jaVoice; }
  // Stop any sound before a new app version takes over.
  function releaseAudio() { stopSpeech(); }
  function activate(worker) { releaseAudio(); worker.postMessage('skipWaiting'); }
  var voiceWarned = false;
  function speak(text, node) {
    var clip = clipFor(text);
    if (clip) {
      stopSpeech();
      playClip(clip, node).catch(function () { doneSpeaking(); speakWithVoice(text, node); });
      return;
    }
    speakWithVoice(text, node);
  }
  function speakWithVoice(text, node) {
    if (!('speechSynthesis' in window)) {
      if (!voiceWarned) toast('Speech is not supported in this browser.');
      voiceWarned = true; return;
    }
    pickVoice();
    if (!jaVoice && !voiceWarned) { toast('No Japanese voice found. Install one in your system settings for best results.'); voiceWarned = true; }
    speechSynthesis.cancel();
    var u = new SpeechSynthesisUtterance(text.replace(/[〜～]/g, ''));
    u.lang = 'ja-JP'; u.rate = 0.85;
    if (jaVoice) u.voice = jaVoice;
    if (node) {
      markSpeaking(node);
      u.onend = u.onerror = function () { node.classList.remove('speaking'); };
    }
    speechSynthesis.speak(u);
  }
  function markSpeakable(root) {
    var walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode: function (n) {
        if (!n.nodeValue.match(JA_RUN)) return NodeFilter.FILTER_REJECT;
        if (n.parentNode.closest('.ja, button, a, summary')) return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      }
    });
    var nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach(function (n) {
      var text = n.nodeValue, frag = document.createDocumentFragment(), last = 0;
      text.replace(JA_RUN, function (m, idx) {
        if (idx > last) frag.appendChild(document.createTextNode(text.slice(last, idx)));
        frag.appendChild(el('span', { 'class': 'ja', lang: 'ja', role: 'button', tabindex: '0', title: 'Listen', text: m }));
        last = idx + m.length;
        return m;
      });
      if (last < text.length) frag.appendChild(document.createTextNode(text.slice(last)));
      n.parentNode.replaceChild(frag, n);
    });
  }
  /* ---------- term pop-ups ---------- */
  // assets/terms.json (built by scripts/build-terms.mjs) says what a tapped word, substance,
  // linked name or citation means. Tapping Japanese text opens its pop-up and plays it; inside
  // exercises (.hw) a tap only plays, so a pop-up never gives an answer away.
  var TERMS = null, termsLoading = null, pop = null, popAnchor = null;
  function loadTerms() {
    if (!termsLoading) termsLoading = fetch('assets/terms.json').then(function (r) { return r.ok ? r.json() : null; })
      .catch(function () { return null; }).then(function (t) { TERMS = t; return t; });
    return termsLoading;
  }
  var roKey = function (s) { return s.replace(/[“”"]/g, '').replace(/\s+/g, ' ').trim().toLowerCase(); };
  function wordsFor(text) {
    if (!TERMS) return [];
    text = text.trim();
    if (TERMS.ja[text] !== undefined) return [TERMS.e[TERMS.ja[text]]];
    var seen = {}, out = [];
    text.split(/[\s、。・]+/).forEach(function (tok) {
      var i = TERMS.ja[tok];
      if (i !== undefined && !seen[i]) { seen[i] = 1; out.push(TERMS.e[i]); }
    });
    // A run of kana with no entry of its own (あいうえお): show its characters.
    if (!out.length && /^[぀-ヿー]{2,8}$/.test(text)) Array.from(text).forEach(function (ch) {
      var i = TERMS.ja[ch];
      if (i !== undefined && !seen[i]) { seen[i] = 1; out.push(TERMS.e[i]); }
    });
    return out;
  }
  function lessonById(id) { return LESSONS.filter(function (l) { return l.id === id; })[0]; }
  function groupTitle(g) { var x = GROUPS.filter(function (y) { return y.id === g; })[0]; return x ? x.title : ''; }
  function pageLink(id, label) {
    var l = lessonById(id);
    return l ? el('a', { href: '#/' + id, text: label || (groupTitle(l.group) + ': ' + l.title), onclick: closePop }) : null;
  }
  function extLink(url, label) { return el('a', { href: url, target: '_blank', rel: 'noopener', 'class': 'pop-ext', text: label }); }
  function wikiLabel(url) {
    var lang = url.match(/^https:\/\/(\w+)\.wikipedia/);
    return 'Wikipedia' + (lang && lang[1] !== 'en' ? ' (' + lang[1].toUpperCase() + ')' : '') + ': ' + decodeURIComponent(url.split('/wiki/')[1] || '').replace(/_/g, ' ');
  }
  function formula(f) {
    var span = el('span', { 'class': 'pop-formula' });
    f.split(/(\d+)/).forEach(function (part, i) { if (part) span.appendChild(i % 2 ? el('sub', { text: part }) : document.createTextNode(part)); });
    return span;
  }
  function playButton(text) {
    return el('button', { type: 'button', 'class': 'pop-play', 'aria-label': 'Play ' + text, title: 'Listen', text: '▶',
      onclick: function (ev) { ev.stopPropagation(); speak(text, ev.currentTarget); } });
  }
  function popTag(text) { return el('p', { 'class': 'pop-tag', text: text }); }
  function linksRow(items) {
    items = items.filter(Boolean);
    return items.length ? el('p', { 'class': 'pop-links' }, items) : null;
  }
  function wordBlock(e, here) {
    var head = el('p', { 'class': 'pop-head' }, [
      e.ja ? el('span', { 'class': 'pop-ja', lang: 'ja', text: e.ja }) : null,
      e.kana && e.kana !== e.ja ? el('span', { 'class': 'pop-kana', lang: 'ja', text: e.kana }) : null,
      e.ro ? el('em', { 'class': 'pop-ro', text: e.ro }) : null,
      e.ja ? playButton(e.ja) : null
    ]);
    var links = [];
    if (e.url) links.push(extLink(e.url, '↗ ' + wikiLabel(e.url)));
    if (e.gl && e.gl !== here) links.push(pageLink(e.gl, 'Glossary'));
    if (e.page && e.page !== here && e.page !== e.gl) links.push(pageLink(e.page, 'Explained in: ' + (lessonById(e.page) || {}).title));
    return el('div', { 'class': 'pop-entry' }, [
      head,
      e.en ? el('p', { 'class': 'pop-en', text: e.en }) : null,
      e.jaName && !e.ja ? el('p', { 'class': 'pop-ja-name' }, ['Japanese: ', el('span', { lang: 'ja', text: e.jaName })]) : null,
      e.alt && e.alt.length ? el('p', { 'class': 'pop-note', text: 'Also read: ' + e.alt.join(', ') }) : null,
      e.note ? el('p', { 'class': 'pop-note', text: e.note }) : null,
      linksRow(links)
    ]);
  }
  function substanceView(e, here) {
    var where = (e.pages || []).filter(function (id) { return id !== here; }).slice(0, 6).map(function (id) { return pageLink(id); });
    return [
      popTag('Substance'),
      el('p', { 'class': 'pop-title', text: e.en }),
      e.pl ? el('p', { 'class': 'pop-pl' }, ['Polish: ', el('strong', { lang: 'pl', text: e.pl })]) : null,
      e.formula || e.iupac ? el('p', { 'class': 'pop-note' }, [e.formula ? formula(e.formula) : null, e.formula && e.iupac ? ' · ' : '', e.iupac ? el('span', { 'class': 'pop-iupac', text: 'IUPAC: ' + e.iupac }) : null]) : null,
      e.abstract ? el('p', { 'class': 'pop-abstract', text: e.abstract }) : null,
      e.abstractSrc ? el('p', { 'class': 'pop-src' }, ['Source: ', e.cid ? extLink('https://pubchem.ncbi.nlm.nih.gov/compound/' + e.cid, e.abstractSrc) : e.abstractSrc]) : null,
      linksRow([e.url ? extLink(e.url, '↗ Wikipedia (EN)') : null, e.plUrl ? extLink(e.plUrl, '↗ Wikipedia (PL)') : null]),
      where.length ? el('div', { 'class': 'pop-where' }, [el('span', { text: 'Also in: ' })].concat(where.map(function (a, i) { return el('span', {}, [i ? ' · ' : '', a]); }))) : null
    ];
  }
  var TYPE_LABEL = { person: 'Person', place: 'Place', work: 'Work', organisation: 'Organisation', event: 'Event', topic: 'Topic' };
  function contextSentence(anchor) {
    var block = anchor.closest('p, li, td, figcaption, blockquote');
    if (!block) return '';
    var text = block.textContent.replace(/\s+/g, ' ').trim(), at = text.indexOf(anchor.textContent);
    var sentences = text.split(/(?<=[.!?])\s+(?=[A-Z"“(*])/), pos = 0;
    for (var i = 0; i < sentences.length; i++) {
      if (at >= pos && at < pos + sentences[i].length + 1) return sentences[i].length > 260 ? sentences[i].slice(0, 257) + '…' : sentences[i];
      pos += sentences[i].length + 1;
    }
    return '';
  }
  function entityView(e, anchor) {
    var ctx = contextSentence(anchor);
    return [
      popTag(TYPE_LABEL[e.type] || 'Topic'),
      el('p', { 'class': 'pop-title', text: e.en }),
      e.jaName ? el('p', { 'class': 'pop-ja-name' }, [el('span', { lang: 'ja', 'class': 'pop-ja', text: e.jaName })]) : null,
      ctx ? el('p', { 'class': 'pop-context' }, [el('span', { 'class': 'pop-src', text: 'On this page: ' }), ctx]) : null,
      linksRow([extLink(e.url, '↗ ' + wikiLabel(e.url) + ' (further reading)')])
    ];
  }
  function citeView(key, c, group) {
    var ref = el('p', { 'class': 'pop-ref' });
    ref.innerHTML = marked.parseInline(c.ref);
    ref.querySelectorAll('a').forEach(function (a) { a.target = '_blank'; a.rel = 'noopener'; });
    return [
      popTag('Source'),
      el('p', { 'class': 'pop-title', text: key }),
      ref,
      c.ch ? el('p', { 'class': 'pop-src', text: 'Cited in: ' + c.ch }) : null,
      linksRow([pageLink(group + '-sources', 'All sources of this handbook')])
    ];
  }
  function chapterView(l, href) {
    var body = el('p', { 'class': 'pop-abstract', text: 'Loading…' });
    fetchText(l.file).then(function (md) {
      var para = md.replace(/^```[\s\S]*?^```/gm, '').split(/\n\s*\n/).map(function (b) { return b.trim(); })
        .filter(function (b) { return b && !/^(#|<|\||>|-|\d+\.|!\[)/.test(b); })[0] || '';
      var tmp = el('div'); tmp.innerHTML = marked.parseInline(para);
      var t = tmp.textContent.replace(/\s+/g, ' ').trim();
      body.textContent = t.length > 320 ? t.slice(0, 317) + '…' : t;
    }).catch(function () { body.textContent = ''; });
    return [
      popTag(groupTitle(l.group) + (l.label && /^\d+$/.test(l.label) ? ' · ' + (l.group === 'course' ? 'Lesson ' : 'Chapter ') + l.label : '')),
      el('p', { 'class': 'pop-title', text: l.title }),
      body,
      el('p', { 'class': 'pop-links' }, [el('a', { 'class': 'btn primary pop-open', href: href, text: 'Open', onclick: closePop })])
    ];
  }
  function closePop() {
    if (pop) { pop.remove(); pop = null; }
    if (popAnchor) { popAnchor.classList.remove('pop-open-anchor'); popAnchor.setAttribute('aria-expanded', 'false'); popAnchor = null; }
  }
  function openPop(anchor, children, label) {
    closePop();
    pop = el('div', { 'class': 'term-pop', role: 'dialog', 'aria-label': label || 'Details', tabindex: '-1' }, [
      el('button', { type: 'button', 'class': 'pop-x', 'aria-label': 'Close', text: '×', onclick: closePop })
    ].concat(children.filter(Boolean)));
    document.body.appendChild(pop);
    popAnchor = anchor; anchor.classList.add('pop-open-anchor'); anchor.setAttribute('aria-expanded', 'true');
    if (window.matchMedia('(max-width: 640px)').matches) pop.classList.add('sheet');
    else {
      var r = anchor.getBoundingClientRect(), w = pop.offsetWidth, h = pop.offsetHeight;
      var left = Math.min(Math.max(8, r.left), window.innerWidth - w - 8);
      var top = r.bottom + 8 + h > window.innerHeight && r.top - 8 - h > 0 ? r.top - 8 - h : r.bottom + 8;
      pop.style.left = (left + window.scrollX) + 'px'; pop.style.top = (top + window.scrollY) + 'px';
    }
    pop.focus({ preventScroll: true });
  }
  function popupsOff(node) { return !!node.closest('.hw, .search-page, .home, .term-pop, nav, .sidebar'); }
  function openTermFor(t) {
    var here = rendered;
    if (t.classList.contains('ja')) {
      speak(t.textContent, t);
      if (popupsOff(t)) return;
      loadTerms().then(function () {
        var found = wordsFor(t.textContent);
        if (found.length) openPop(t, found.map(function (e) { return wordBlock(e, here); }), t.textContent);
      });
      return;
    }
    if (t.dataset.term !== undefined) {
      var e = TERMS.e[+t.dataset.term];
      openPop(t, e.k === 'substance' ? substanceView(e, here) : e.k === 'entity' ? entityView(e, t) : [wordBlock(e, here)], t.textContent);
      return;
    }
    if (t.dataset.cite) {
      var l = lessonById(here), c = TERMS.cites[l.group][t.dataset.cite];
      if (c) openPop(t, citeView(t.dataset.cite, c, l.group), 'Source: ' + t.dataset.cite);
      return;
    }
    if (t.classList.contains('xref')) {
      var id = t.getAttribute('href').slice(2).split('/')[0], cl = lessonById(id);
      if (cl) openPop(t, chapterView(cl, t.getAttribute('href')), cl.title);
    }
  }
  document.addEventListener('click', function (e) {
    var t = e.target.closest('.ja, [data-term], [data-cite], a.xref');
    if (!t) { if (pop && !e.target.closest('.term-pop')) closePop(); return; }
    if (t.closest('.term-pop')) { if (t.classList.contains('ja')) speak(t.textContent, t); return; }
    if (t.tagName === 'A' && (e.ctrlKey || e.metaKey || e.shiftKey)) return;
    e.preventDefault();
    if (popAnchor === t) { closePop(); return; }
    openTermFor(t);
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && pop) { var a = popAnchor; closePop(); if (a) a.focus(); return; }
    var t = e.target.closest && e.target.closest('.ja, [data-term], [data-cite]');
    if (t && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); openTermFor(t); }
  });
  window.addEventListener('hashchange', closePop);
  window.addEventListener('resize', function () { if (pop && !pop.classList.contains('sheet')) closePop(); });

  // Mark what on a rendered page has a pop-up.
  var SKIP_DECOR = 'a, code, pre, .ja, .hw, h1, .pop, [data-term], [data-cite], figure.diagram';
  function textNodes(root, test) {
    var walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode: function (n) { return n.parentNode.closest(SKIP_DECOR) || !test(n.nodeValue) ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT; }
    });
    var out = []; while (walker.nextNode()) out.push(walker.currentNode); return out;
  }
  function wrapMatches(node, re, make) {
    var text = node.nodeValue, frag = document.createDocumentFragment(), last = 0, any = false;
    text.replace(re, function () {
      var m = arguments[0], idx = arguments[arguments.length - 2], span = make.apply(null, arguments);
      if (!span) return m;
      if (idx > last) frag.appendChild(document.createTextNode(text.slice(last, idx)));
      frag.appendChild(span); last = idx + m.length; any = true; return m;
    });
    if (!any) return;
    if (last < text.length) frag.appendChild(document.createTextNode(text.slice(last)));
    node.parentNode.replaceChild(frag, node);
  }
  function termSpan(text, i, cls) { return el('span', { 'class': cls || 'term', 'data-term': String(i), role: 'button', tabindex: '0', 'aria-haspopup': 'dialog', text: text }); }
  var subRe = null;
  function decorateTerms(article, pageKey) {
    var lesson = lessonById(pageKey);
    if (!lesson || lesson.kind === 'Sources') return;
    loadTerms().then(function (T) {
      if (!T || !article.isConnected && !article.parentNode) return;
      // Romaji and glossary terms in italics or bold.
      article.querySelectorAll('em, strong').forEach(function (n) {
        if (n.closest(SKIP_DECOR) || n.querySelector('.ja, a, em, strong')) return;
        var i = T.ro[roKey(n.textContent)];
        if (i !== undefined) { n.classList.add('term'); n.dataset.term = i; n.setAttribute('role', 'button'); n.tabIndex = 0; n.setAttribute('aria-haspopup', 'dialog'); }
      });
      // Encyclopedia links: a pop-up first, with the link inside it.
      article.querySelectorAll('a.ref-link').forEach(function (a) {
        var i = T.url[a.getAttribute('href')];
        if (i !== undefined) { a.dataset.term = i; a.classList.add('term-link'); a.setAttribute('aria-haspopup', 'dialog'); a.removeAttribute('title'); }
      });
      // Chapter links inside the text (not the "Next" line).
      article.querySelectorAll('a[href^="#/"]').forEach(function (a) {
        var id = a.getAttribute('href').slice(2).split('/')[0], p = a.closest('p, li, td');
        if (!lessonById(id) || id === pageKey || a.closest('.pager, .lesson-footer, nav, .hw') || (p && /^\s*➡/.test(p.textContent))) return;
        a.classList.add('xref'); a.setAttribute('aria-haspopup', 'dialog');
      });
      // Substances named in plain text.
      if (!subRe) {
        var lower = Object.keys(T.sub).filter(function (k) { return !/^[A-Z]{2,}$/.test(k); }).sort(function (a, b) { return b.length - a.length; });
        var caps = Object.keys(T.sub).filter(function (k) { return /^[A-Z]{2,}$/.test(k); });
        var esc = function (k) { return k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); };
        subRe = [new RegExp('\\b(' + lower.map(esc).join('|') + ')\\b', 'gi'), new RegExp('\\b(' + caps.map(esc).join('|') + ')\\b', 'g')];
      }
      subRe.forEach(function (re) {
        textNodes(article, function (v) { re.lastIndex = 0; return re.test(v); }).forEach(function (n) {
          wrapMatches(n, re, function (m) { var i = T.sub[/^[A-Z]{2,}$/.test(m) ? m : m.toLowerCase()]; return i === undefined ? null : termSpan(m, i, 'term term-sub'); });
        });
      });
      // Citations: "(Author 2019; Other 2020a)".
      var cites = T.cites[lesson.group];
      if (cites) {
        textNodes(article, function (v) { return /\([^()]*(\d{4}[a-z]?|n\.d\.)/.test(v); }).forEach(function (n) {
          wrapMatches(n, /\(([^()]*?(?:\d{4}[a-z]?|n\.d\.[^();]*)[^()]*)\)/g, function (m, inner) {
            var parts = inner.split(/;\s*/), author = '', any = false, span = el('span', { 'class': 'cite-group' }, ['(']);
            parts.forEach(function (part, k) {
              var key = part.trim();
              if (/^(\d{4}[a-z]?|n\.d\.(-\w)?)$/.test(key) && author) key = author + ' ' + key;
              var a = key.match(/^(.*?)(?:,)? (?:\d{4}[a-z]?|n\.d\.)/); if (a) author = a[1];
              if (k) span.appendChild(document.createTextNode('; '));
              if (cites[key]) { any = true; span.appendChild(el('span', { 'class': 'cite', 'data-cite': key, role: 'button', tabindex: '0', 'aria-haspopup': 'dialog', text: part.trim() })); }
              else span.appendChild(document.createTextNode(part));
            });
            span.appendChild(document.createTextNode(')'));
            return any ? span : null;
          });
        });
      }
    });
  }

  /* ---------- hiragana course hooks ---------- */
  if (window.NBKana) {
    window.NBKana.init({
      speak: function (text) { speak(text); },
      preload: preloadSpeech,
      canSay: canSay,
      busy: speechBusy,
      stop: stopSpeech,
      toast: toast,
      markDone: function (id) {
        if (done[id]) return;
        done[id] = true; save('nb-done', done); buildNav(); setCurrent(id);
        var b = document.querySelector('.lesson-foot .btn:not(.primary)');
        if (b) { b.textContent = '✓ Completed'; b.className = 'btn done'; }
      }
    });
  }

  /* ---------- navigation ---------- */
  // Each course and handbook is a collapsible group. Opening a page expands its own group
  // and collapses the rest; the reader can open or close any group in between.
  var navOpen = {}, navRoute = null;
  var CHEVRON = '<svg viewBox="0 0 24 24" width="16" height="16"><path d="M6 9l6 6 6-6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>';
  function showNavGroup(id, open) {
    navOpen[id] = open;
    var btn = navList.querySelector('.nav-group[data-group="' + id + '"]');
    if (!btn) return;
    btn.setAttribute('aria-expanded', String(open));
    document.getElementById(btn.getAttribute('aria-controls')).hidden = !open;
  }
  function buildNav() {
    navList.innerHTML = '';
    navList.appendChild(el('li', {}, [el('a', { 'class': 'nav-link', href: '#/', 'data-route': '' }, [
      el('span', { 'class': 'nav-num', 'aria-hidden': 'true', text: '⌂' }), el('span', { text: 'Home' })
    ])]));
    GROUPS.forEach(function (g) {
      var sub = el('ol', { 'class': 'nav-sub', id: 'nav-' + g.id }, LESSONS.filter(function (l) { return l.group === g.id; }).map(function (l) {
        return el('li', {}, [el('a', {
          'class': 'nav-link' + (done[l.id] ? ' done' : '') + (l.group === 'hiragana' ? ' nav-hira' : ''), href: '#/' + l.id, 'data-route': l.id
        }, [
          el('span', { 'class': 'nav-num', 'aria-hidden': 'true', text: done[l.id] ? '✓' : l.label }),
          el('span', { text: l.title }),
          done[l.id] ? el('span', { 'class': 'sr-only', style: 'position:absolute;left:-9999px', text: ' (completed)' }) : null
        ])]);
      }));
      sub.hidden = !navOpen[g.id];
      var btn = el('button', {
        type: 'button', 'class': 'nav-group', 'data-group': g.id, 'aria-controls': sub.id, 'aria-expanded': String(!!navOpen[g.id]),
        onclick: function () { showNavGroup(g.id, !navOpen[g.id]); }
      }, [el('span', { text: g.title }), el('span', { 'class': 'nav-chevron', 'aria-hidden': 'true', html: CHEVRON })]);
      navList.appendChild(el('li', { 'class': 'nav-section' }, [btn, sub]));
    });
  }
  function setCurrent(route) {
    if (route !== navRoute) {
      navRoute = route;
      var here = LESSONS.filter(function (l) { return l.id === route; })[0];
      GROUPS.forEach(function (g) { showNavGroup(g.id, !!here && here.group === g.id); });
    }
    document.querySelectorAll('.nav-link').forEach(function (a) {
      if (a.getAttribute('data-route') === route) a.setAttribute('aria-current', 'page');
      else a.removeAttribute('aria-current');
    });
  }
  function openMenu(open) {
    sidebar.classList.toggle('open', open);
    scrim.hidden = !open;
    menuBtn.setAttribute('aria-expanded', String(open));
  }
  menuBtn.addEventListener('click', function () { openMenu(!sidebar.classList.contains('open')); });
  scrim.addEventListener('click', function () { openMenu(false); });
  sidebar.addEventListener('click', function (e) { if (e.target.closest('a')) openMenu(false); });

  document.getElementById('themeBtn').addEventListener('click', function () {
    var root = document.documentElement;
    var dark = root.dataset.theme ? root.dataset.theme === 'dark' : matchMedia('(prefers-color-scheme: dark)').matches;
    root.dataset.theme = dark ? 'light' : 'dark';
    try { localStorage.setItem('nb-theme', root.dataset.theme); } catch (e) { /* ignore */ }
  });

  /* ---------- markdown pages ---------- */
  function resolvePath(fromFile, href) {
    var stack = fromFile.split('/').slice(0, -1);
    href.split('/').forEach(function (seg) {
      if (seg === '..') stack.pop();
      else if (seg && seg !== '.') stack.push(seg);
    });
    return stack.join('/');
  }
  function rewriteLinks(root, pageKey, file) {
    root.querySelectorAll('a[href]').forEach(function (a) {
      var href = a.getAttribute('href');
      var m = href.match(/^([^:#]+\.md)(?:#(.+))?$/);
      if (m) {
        var target = resolvePath(file, m[1]);
        var lesson = BY_FILE[target];
        if (lesson) { a.setAttribute('href', '#/' + lesson.id + (m[2] ? '/' + m[2] : '')); return; }
        if (target === 'README.md') { a.setAttribute('href', '#/'); return; }
        a.setAttribute('href', 'https://github.com/pKasprowicz/nippon-bible/blob/main/' + target);
        a.target = '_blank'; a.rel = 'noopener';
        return;
      }
      if (/^#[^\/]/.test(href)) { a.setAttribute('href', '#/' + pageKey + '/' + href.slice(1)); return; }
      if (/^https?:/.test(href)) {
        a.target = '_blank'; a.rel = 'noopener';
        // Encyclopedia links in the cuisine handbook are further reading, not sources: style them apart.
        var ref = href.match(/^https:\/\/(en\.wikipedia\.org\/wiki\/|pubchem\.ncbi\.nlm\.nih\.gov\/compound\/)/);
        if (ref && !a.closest('figcaption')) {
          a.className = 'ref-link';
          a.title = (/wikipedia/.test(ref[1]) ? 'Wikipedia: ' + decodeURIComponent(href.split('/wiki/')[1]).replace(/_/g, ' ') : 'PubChem') + ' (opens in a new tab)';
        }
      }
    });
  }
  // Images in Markdown are written relative to the .md file; the page itself lives at the site root.
  function rewriteImages(root, file) {
    root.querySelectorAll('img[src]').forEach(function (img) {
      var src = img.getAttribute('src');
      if (!/^(https?:|data:|\/)/.test(src)) img.setAttribute('src', resolvePath(file, src));
      img.loading = 'lazy'; img.decoding = 'async';
      // Molecule diagrams are wide and detailed: on a phone, a tap opens them full size.
      var fig = img.parentNode;
      if (fig && fig.classList && fig.classList.contains('diagram')) {
        var link = el('a', { href: img.getAttribute('src'), target: '_blank', rel: 'noopener', title: 'Open the diagram full size' });
        fig.insertBefore(link, img); link.appendChild(img);
      }
    });
  }
  function wrapTables(root) {
    root.querySelectorAll('table').forEach(function (t) {
      var wrap = el('div', { 'class': 'table-wrap' });
      t.parentNode.insertBefore(wrap, t);
      wrap.appendChild(t);
    });
  }
  function renderMarkdown(md, pageKey, file) {
    var article = el('article');
    article.innerHTML = marked.parse(md, { gfm: true });
    rewriteLinks(article, pageKey, file);
    rewriteImages(article, file);
    wrapTables(article);
    markSpeakable(article);
    decorateTerms(article, pageKey);
    mountGalleries(article);
    var lesson = LESSONS.filter(function (l) { return l.id === pageKey; })[0];
    var script = lesson && (lesson.group === 'katakana' || lesson.group === 'kanji') ? lesson.group : 'hiragana';
    if (window.NBKana) window.NBKana.mount(article, pageKey, script);
    return article;
  }
  /* ---------- photo gallery (```gallery blocks) ---------- */
  // Renders assets/signs/photos.json as a filterable grid; a photo opens full size in a
  // dialog with its caption and credit. Every photo is public domain or CC0.
  var GALLERY_DIR = 'assets/signs/';
  function mountGalleries(article) {
    article.querySelectorAll('pre > code.language-gallery').forEach(function (code) {
      var box = el('div', { 'class': 'gallery' }, [el('p', { 'class': 'loading', text: 'Loading photos…' })]);
      code.parentNode.replaceWith(box);
      fetchText(GALLERY_DIR + 'photos.json').then(function (t) { buildGallery(box, JSON.parse(t)); }).catch(function (err) {
        box.replaceChildren(el('p', { 'class': 'hw-error', text: 'The photos could not be loaded (' + (err.message || err) + ').' }));
      });
    });
  }
  function buildGallery(box, data) {
    var photos = data.photos, kind = '', shown = photos;
    var chips = el('div', { 'class': 'search-filters gallery-filters', role: 'group', 'aria-label': 'Show photos of' });
    var grid = el('ul', { 'class': 'gallery-grid' });
    function renderChips() {
      var counts = {};
      photos.forEach(function (p) { counts[p.kind] = (counts[p.kind] || 0) + 1; });
      function chip(id, label, n) {
        return el('button', { type: 'button', 'class': 'search-chip', 'aria-pressed': String(kind === id),
          onclick: function () { kind = id; renderChips(); renderGrid(); } }, [label + ' ', el('span', { 'class': 'search-count', text: String(n) })]);
      }
      chips.replaceChildren.apply(chips, [chip('', 'All', photos.length)].concat(data.kinds.filter(function (k) { return counts[k.id]; }).map(function (k) {
        return chip(k.id, k.title, counts[k.id]);
      })));
    }
    function renderGrid() {
      shown = photos.filter(function (p) { return !kind || p.kind === kind; });
      grid.replaceChildren.apply(grid, shown.map(function (p, i) {
        return el('li', {}, [el('button', { type: 'button', 'class': 'gallery-item', onclick: function () { open(i); } }, [
          el('img', { src: GALLERY_DIR + 'thumbs/' + p.file, alt: p.title, loading: 'lazy', width: '400', height: '300' }),
          el('span', { 'class': 'gallery-title', text: p.title })
        ])]);
      }));
    }
    // The bar is built once so keyboard focus survives moving between photos; only the
    // position, picture and caption change.
    var at = 0, pos = el('span', { 'class': 'lightbox-pos' }), figure = el('figure');
    var dialog = el('dialog', { 'class': 'lightbox', 'aria-label': 'Photo' }, [
      el('div', { 'class': 'lightbox-bar' }, [
        pos,
        el('button', { type: 'button', 'class': 'icon-btn', 'aria-label': 'Previous photo', text: '‹', onclick: function () { show(at - 1); } }),
        el('button', { type: 'button', 'class': 'icon-btn', 'aria-label': 'Next photo', text: '›', onclick: function () { show(at + 1); } }),
        el('button', { type: 'button', 'class': 'icon-btn lightbox-close', 'aria-label': 'Close', text: '✕', onclick: function () { dialog.close(); } })
      ]),
      figure
    ]);
    function show(i) {
      at = (i + shown.length) % shown.length;
      var p = shown[at];
      pos.textContent = (at + 1) + ' / ' + shown.length;
      figure.replaceChildren(
        el('img', { src: GALLERY_DIR + p.file, alt: p.title, width: String(p.w), height: String(p.h) }),
        el('figcaption', {}, [
          el('strong', { text: p.title }),
          p.ja ? el('span', { 'class': 'lightbox-ja' }, [el('span', { 'class': 'ja', lang: 'ja', tabindex: '0', text: p.ja })]) : null,
          p.note ? el('span', { text: p.note }) : null,
          el('span', { 'class': 'lightbox-credit' }, [
            [p.place, p.date].filter(Boolean).join(', ') + (p.kind === 'adverts' ? '. Published by ' : '. Photo: ') + p.author + ', ' + p.license + ' (',
            el('a', { href: p.source, target: '_blank', rel: 'noopener', text: 'Wikimedia Commons' }), ').'
          ])
        ])
      );
    }
    function open(i) { show(i); dialog.showModal(); }
    dialog.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft') { e.preventDefault(); show(at - 1); }
      else if (e.key === 'ArrowRight') { e.preventDefault(); show(at + 1); }
    });
    // A click on the backdrop (outside the photo and caption) closes the dialog.
    dialog.addEventListener('click', function (e) { if (e.target === dialog) dialog.close(); });
    renderChips(); renderGrid();
    box.replaceChildren(chips, grid, dialog);
  }

  function lessonFooter(id) {
    var i = LESSONS.findIndex(function (l) { return l.id === id; });
    var next = LESSONS[i + 1] && LESSONS[i + 1].group === LESSONS[i].group ? LESSONS[i + 1] : null;
    var btn = el('button', { 'class': 'btn' + (done[id] ? ' done' : ''), type: 'button' });
    var reading = id.indexOf('cuisine') === 0 || id.indexOf('folklore') === 0 || id.indexOf('popculture') === 0 || id.indexOf('bathing') === 0 || id.indexOf('railways') === 0 || id.indexOf('festivals') === 0;
    function label() {
      btn.textContent = done[id] ? (reading ? '✓ Read' : '✓ Completed') : (reading ? 'Mark chapter as read' : 'Mark lesson as completed');
      btn.className = 'btn' + (done[id] ? ' done' : '');
    }
    label();
    btn.addEventListener('click', function () {
      done[id] = !done[id]; save('nb-done', done); label(); buildNav(); setCurrent(id);
    });
    // A gallery has nothing to complete: it only gets the pager.
    return el('div', {}, [LESSONS[i].kind === 'Gallery' ? null : el('div', { 'class': 'lesson-foot' }, [btn]), pager(id)]);
  }

  /* ---------- previous / next in content order (guide → hiragana → katakana → kanji → cuisine → folklore → pop culture) ---------- */
  function groupTitle(g) { return (GROUPS.filter(function (x) { return x.id === g; })[0] || {}).title || ''; }
  function pageKind(l) {
    if (l.kind) return l.kind;
    if (l.label === '★') return l.group === 'course' ? 'Overview' : 'Start here';
    if (l.label === '↻') return 'Daily review';
    return (l.group === 'course' ? 'Lesson ' : (l.group === 'cuisine' || l.group === 'folklore' || l.group === 'popculture' || l.group === 'bathing' || l.group === 'railways' || l.group === 'festivals') ? 'Chapter ' : 'Unit ') + l.label;
  }
  function neighbours(id) {
    var i = LESSONS.findIndex(function (l) { return l.id === id; });
    return { i: i, prev: LESSONS[i - 1] || null, next: LESSONS[i + 1] || null };
  }
  function pagerCard(target, dir, from) {
    if (!target) {
      return el('a', { 'class': 'pager-card ' + dir + ' home', href: '#/', rel: dir }, [
        el('span', { 'class': 'pager-dir', text: dir === 'prev' ? '← Previous' : 'Next →' }),
        el('span', { 'class': 'pager-title', text: 'Home' }),
        el('span', { 'class': 'pager-meta', text: dir === 'prev' ? 'All seven sections' : 'You\'ve reached the end. Back to all seven sections' })
      ]);
    }
    var crossing = target.group !== from.group;
    return el('a', { 'class': 'pager-card ' + dir + (crossing ? ' crossing' : ''), href: '#/' + target.id, rel: dir }, [
      el('span', { 'class': 'pager-dir', text: dir === 'prev' ? '← Previous' : 'Next →' }),
      el('span', { 'class': 'pager-title', text: crossing ? groupTitle(target.group) : target.title }),
      el('span', { 'class': 'pager-meta', text: crossing
        ? (dir === 'prev' ? 'Previous section · ' : 'Next section · ') + (pageKind(target) === target.title ? target.title : pageKind(target) + ': ' + target.title)
        : groupTitle(target.group) + ' · ' + pageKind(target) })
    ]);
  }
  function pager(id) {
    var n = neighbours(id), here = LESSONS[n.i];
    return el('nav', { 'class': 'pager', 'aria-label': 'Previous and next page' }, [pagerCard(n.prev, 'prev', here), pagerCard(n.next, 'next', here)]);
  }
  function topPager(id) {
    var n = neighbours(id), here = LESSONS[n.i];
    var inGroup = LESSONS.filter(function (l) { return l.group === here.group; });
    var pos = inGroup.indexOf(here) + 1;
    function link(target, dir) {
      var label = dir === 'prev' ? '‹ Previous' : 'Next ›';
      return el('a', { 'class': 'pager-mini', rel: dir, href: target ? '#/' + target.id : '#/',
        title: target ? (dir === 'prev' ? 'Previous: ' : 'Next: ') + target.title + ' (' + groupTitle(target.group) + ')' : 'Home',
        'aria-label': target ? (dir === 'prev' ? 'Previous page: ' : 'Next page: ') + target.title : 'Home' }, [label]);
    }
    return el('nav', { 'class': 'pager-top', 'aria-label': 'Page position' }, [
      el('span', { 'class': 'pager-pos' }, [el('a', { href: '#/' + LESSONS.filter(function (l) { return l.group === here.group; })[0].id, text: groupTitle(here.group) }), ' · ' + pageKind(here) + ' · ' + pos + ' of ' + inGroup.length]),
      el('span', { 'class': 'pager-links' }, [link(n.prev, 'prev'), link(n.next, 'next')])
    ]);
  }
  /* ---------- chapter navigation ---------- */
  // Section ids follow GitHub's heading slugs, so README/lesson anchors work on GitHub and here.
  var SECTION_PREFIX = 'sec-';
  var WIDE = window.matchMedia('(min-width: 1280px)');
  var rendered = null;      // page key currently on screen ('home' or a lesson id)
  var spyHandler = null;
  var closeBarPanel = null;   // closes the mobile contents panel on outside clicks
  document.addEventListener('click', function (e) { if (closeBarPanel) closeBarPanel(e.target); });

  function slugify(text) {
    return text.trim().toLowerCase().replace(/[^\p{L}\p{M}\p{N}\p{Pc} -]/gu, '').replace(/ /g, '-');
  }
  function stripNumber(slug) { return slug.replace(/^\d+-/, ''); }
  function sectionHref(pageKey, slug) { return '#/' + pageKey + '/' + slug; }

  function addHeadingIds(article, pageKey) {
    var seen = {};
    return [].slice.call(article.querySelectorAll('h2, h3')).map(function (h) {
      var base = slugify(h.textContent) || 'section';
      var slug = base;
      if (seen[base] !== undefined) { seen[base] += 1; slug = base + '-' + seen[base]; } else { seen[base] = 0; }
      h.id = SECTION_PREFIX + slug;
      h.setAttribute('tabindex', '-1');
      h.appendChild(el('a', { 'class': 'heading-anchor', href: sectionHref(pageKey, slug), 'aria-label': 'Link to this section', text: '#' }));
      return { el: h, slug: slug, level: h.tagName === 'H2' ? 2 : 3, text: h.textContent.replace(/#$/, '').trim() };
    });
  }

  function tocList(sections, pageKey, className) {
    var root = el('ol', { 'class': className }), current = null;
    sections.forEach(function (s) {
      var link = el('a', { 'class': 'toc-link', href: sectionHref(pageKey, s.slug), 'data-slug': s.slug, text: s.text });
      if (s.level === 2 || !current) {
        current = el('li', { 'class': 'toc-item' }, [link]);
        root.appendChild(current);
      } else {
        var sub = current.querySelector('ol') || current.appendChild(el('ol', { 'class': 'toc-sub' }));
        sub.appendChild(el('li', {}, [link]));
      }
    });
    return root;
  }

  function buildChapterNav(sections, pageKey) {
    var rail = el('nav', { 'class': 'toc-rail', 'aria-label': 'On this page' }, [
      el('p', { 'class': 'toc-title', text: 'On this page' }),
      tocList(sections, pageKey, 'toc-list'),
      el('a', { 'class': 'toc-top', href: '#/' + pageKey + '/', 'data-slug': '', text: '↑ Back to top' })
    ]);
    var panel = el('div', { 'class': 'toc-panel', id: 'tocPanel', hidden: '' }, [
      el('a', { 'class': 'toc-link toc-top-link', href: '#/' + pageKey + '/', 'data-slug': '', text: '↑ Top of page' }),
      tocList(sections, pageKey, 'toc-list')
    ]);
    var current = el('span', { 'class': 'bar-current', text: 'Contents' });
    var toggle = el('button', { 'class': 'bar-toggle', type: 'button', 'aria-expanded': 'false', 'aria-controls': 'tocPanel' }, [
      el('span', { 'class': 'bar-label', text: 'On this page' }), current,
      el('span', { 'class': 'bar-chevron', 'aria-hidden': 'true',
        html: '<svg viewBox="0 0 24 24" width="18" height="18"><path d="M6 9l6 6 6-6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>' })
    ]);
    var bar = el('div', { 'class': 'section-bar' }, [toggle, panel]);
    function setOpen(open) {
      panel.hidden = !open;
      toggle.setAttribute('aria-expanded', String(open));
      bar.classList.toggle('open', open);
      var active = open && panel.querySelector('.toc-link.active');
      if (active) panel.scrollTop = active.offsetTop - panel.clientHeight / 3;
    }
    toggle.addEventListener('click', function () { setOpen(panel.hidden); });
    panel.addEventListener('click', function (e) { if (e.target.closest('a')) setOpen(false); });
    closeBarPanel = function (target) { if (!bar.contains(target)) setOpen(false); };
    bar.addEventListener('keydown', function (e) { if (e.key === 'Escape') { setOpen(false); toggle.focus(); } });
    return { rail: rail, bar: bar, current: current };
  }

  function startScrollSpy(sections, nav) {
    if (spyHandler) window.removeEventListener('scroll', spyHandler);
    var links = [].slice.call(document.querySelectorAll('.toc-rail .toc-link, .toc-panel .toc-link[data-slug]:not([data-slug=""])'));
    var ticking = false, last;
    function update() {
      ticking = false;
      var offset = WIDE.matches ? 96 : 136, active = null, activeH2 = null;
      for (var i = 0; i < sections.length; i++) {
        if (sections[i].el.getBoundingClientRect().top - offset > 0) break;
        active = sections[i];
        if (active.level === 2) activeH2 = active;
      }
      if (active && !activeH2) activeH2 = active;
      var key = active ? active.slug : '';
      if (key === last) return;
      last = key;
      links.forEach(function (a) {
        var on = !!active && a.getAttribute('data-slug') === active.slug;
        a.classList.toggle('active', on);
        if (on) a.setAttribute('aria-current', 'location'); else a.removeAttribute('aria-current');
      });
      document.querySelectorAll('.toc-rail .toc-item').forEach(function (li) {
        li.classList.toggle('open', !!activeH2 && li.firstChild.getAttribute('data-slug') === activeH2.slug);
      });
      nav.current.textContent = activeH2 ? activeH2.text : 'Contents';
      var railActive = nav.rail.querySelector('.toc-link.active');
      if (railActive) {
        var r = railActive.getBoundingClientRect(), box = nav.rail.getBoundingClientRect();
        if (r.top < box.top || r.bottom > box.bottom) nav.rail.scrollTop += r.top - box.top - box.height / 3;
      }
    }
    spyHandler = function () { if (!ticking) { ticking = true; requestAnimationFrame(update); } };
    window.addEventListener('scroll', spyHandler, { passive: true });
    update();
  }

  function scrollToSection(slug, smooth) {
    var behavior = smooth && !matchMedia('(prefers-reduced-motion: reduce)').matches ? 'smooth' : 'auto';
    if (!slug) { window.scrollTo({ top: 0, behavior: behavior }); return; }
    var target = document.getElementById(SECTION_PREFIX + slug);
    if (!target) {
      // Tolerate renumbered sections: "3-ramen" still finds "4-ramen".
      var want = stripNumber(slug);
      target = [].slice.call(content.querySelectorAll('h2[id], h3[id]')).filter(function (h) {
        return stripNumber(h.id.slice(SECTION_PREFIX.length)) === want;
      })[0];
    }
    if (!target) { window.scrollTo(0, 0); return; }
    target.scrollIntoView({ behavior: behavior, block: 'start' });
    target.focus({ preventScroll: true });
  }

  // On a fresh page, fonts and Japanese glyphs load after the first layout and push
  // headings down. Keep the target aligned while the page settles, unless the reader
  // starts scrolling.
  function jumpWhenSettled(slug) {
    var page = content.firstElementChild, stopped = false, ro = null;
    function stop() {
      if (stopped) return;
      stopped = true;
      if (ro) ro.disconnect();
      ['wheel', 'touchstart', 'keydown', 'mousedown'].forEach(function (t) { window.removeEventListener(t, stop, true); });
    }
    ['wheel', 'touchstart', 'keydown', 'mousedown'].forEach(function (t) { window.addEventListener(t, stop, true); });
    function align() { if (!stopped) scrollToSection(slug, false); }
    requestAnimationFrame(function () { requestAnimationFrame(align); });
    if (window.ResizeObserver && page) { ro = new ResizeObserver(align); ro.observe(page); }
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(align);
    setTimeout(stop, 2500);
  }

  // Re-clicking the link of the section you're already on doesn't fire hashchange.
  document.addEventListener('click', function (e) {
    var a = e.target.closest('a[href^="#/"]');
    if (a && a.getAttribute('href') === location.hash) {
      e.preventDefault();
      scrollToSection(location.hash.split('/').slice(2).join('/'), true);
    }
  });

  function showPage(route) {
    var lesson = LESSONS.filter(function (l) { return l.id === route; })[0];
    var path = lesson.file;
    var pageKey = lesson.id;
    return fetchText(path).then(function (md) {
      var article = renderMarkdown(md, pageKey, path);
      article.insertBefore(topPager(lesson.id), article.firstChild);
      article.appendChild(lessonFooter(lesson.id));
      var sections = addHeadingIds(article, pageKey);
      if (sections.length >= 3) {
        var nav = buildChapterNav(sections, pageKey);
        content.replaceChildren(el('div', { 'class': 'page has-toc' }, [nav.bar, article, nav.rail]));
        startScrollSpy(sections, nav);
      } else {
        content.replaceChildren(el('div', { 'class': 'page' }, [article]));
      }
      rendered = pageKey;
      var h1 = article.querySelector('h1');
      document.title = (h1 ? h1.textContent.replace(/^(Lesson|Hiragana|Katakana) \d+:\s*/, '').replace(/#$/, '') + ' · ' : '') + 'Nippon Bible';
    });
  }

  /* ---------- home: eight tiles ---------- */
  function groupProgress(group) {
    var pages = LESSONS.filter(function (l) { return l.group === group && l.label !== '★' && l.label !== '↻' && !l.kind; });
    var doneCount = pages.filter(function (l) { return done[l.id]; }).length;
    var next = pages.filter(function (l) { return !done[l.id]; })[0];
    return { total: pages.length, done: doneCount, next: next };
  }
  function tile(opts) {
    var pct = opts.total ? Math.round(100 * opts.value / opts.total) : 0;
    return el('a', { 'class': 'home-tile tile-' + opts.id, href: opts.href }, [
      el('span', { 'class': 'home-glyph', lang: 'ja', 'aria-hidden': 'true', text: opts.glyph }),
      el('span', { 'class': 'home-kicker', text: opts.kicker }),
      el('span', { 'class': 'home-title', text: opts.title }),
      el('span', { 'class': 'home-desc', text: opts.desc }),
      el('span', { 'class': 'home-examples', lang: 'ja', text: opts.examples }),
      opts.progressLabel ? el('span', { 'class': 'home-progress' }, [
        el('span', { 'class': 'home-bar', role: 'img', 'aria-label': opts.progressLabel }, [el('span', { style: 'width:' + pct + '%' })]),
        el('span', { 'class': 'home-progress-text', text: opts.progressLabel })
      ]) : null,
      el('span', { 'class': 'home-cta', text: opts.cta + ' →' })
    ]);
  }
  function kanaTile(id, glyph, title, desc, examples) {
    var g = groupProgress(id), sum = window.NBKana ? window.NBKana.summary(id) : null;
    var label = sum && sum.learned
      ? sum.learned + ' of ' + sum.total + (id === 'kanji' ? ' kanji' : ' characters') + ' learned · ' + sum.mastered + ' mastered' + (sum.due ? ' · ' + sum.due + ' review' + (sum.due > 1 ? 's' : '') + ' due' : '')
      : g.done + ' of ' + g.total + ' units completed';
    var started = (sum && sum.learned) || g.done;
    return tile({
      id: id, glyph: glyph, kicker: 'Interactive course', title: title, desc: desc, examples: examples,
      href: started && g.next ? '#/' + g.next.id : '#/' + id,
      value: sum && sum.learned ? sum.learned : g.done, total: sum && sum.learned ? sum.total : g.total, progressLabel: label,
      cta: !started ? 'Start learning' : g.next ? 'Continue: unit ' + g.next.label : 'Review and play'
    });
  }
  function cuisineTile() {
    var g = groupProgress('cuisine');
    return tile({
      id: 'cuisine', glyph: '食', kicker: 'Technique handbook', title: 'Japanese cuisine',
      desc: 'How Japanese food gets its taste and texture: umami and dashi, kōji and fermented seasonings, raw fish, frying, rice, noodles, tofu, wagashi and mochi. Long-form chapters built only on cited research and official sources.',
      examples: '出汁 · 麹 · 味噌 · 豆腐',
      href: !g.done ? '#/cuisine' : g.next ? '#/' + g.next.id : '#/cuisine-glossary',
      value: g.done, total: g.total, progressLabel: g.done + ' of ' + g.total + ' chapters read',
      cta: !g.done ? 'Open the handbook' : g.next ? 'Continue: chapter ' + g.next.label : 'Browse the glossary'
    });
  }
  function folkloreTile() {
    var g = groupProgress('folklore');
    return tile({
      id: 'folklore', glyph: '妖', kicker: 'Folklore handbook', title: 'Kami, ghosts and yōkai',
      desc: 'Shinto and its kami, how they merged with the buddhas and were torn apart in 1868, the dead and the ancestors, the many kinds of Japanese ghost and where they come from, and a separate part on yōkai. Long-form chapters built on cited scholarship and old texts, illustrated with woodblock prints, painted scrolls and diagrams.',
      examples: '神 · 幽霊 · 妖怪 · 河童',
      href: !g.done ? '#/folklore' : g.next ? '#/' + g.next.id : '#/folklore-glossary',
      value: g.done, total: g.total, progressLabel: g.done + ' of ' + g.total + ' chapters read',
      cta: !g.done ? 'Open the handbook' : g.next ? 'Continue: chapter ' + g.next.label : 'Browse the glossary'
    });
  }
  function popcultureTile() {
    var g = groupProgress('popculture');
    return tile({
      id: 'popculture', glyph: '漫', kicker: 'Pop culture handbook', title: 'Manga, anime and beyond',
      desc: 'From twelfth-century picture scrolls to manga and anime, the golden age of Japanese cinema, Godzilla, video games, enka and idols, kawaii, fandom and Cool Japan, with a traveller’s guide and the Japanese of fiction. Long-form chapters built on cited scholarship and official data, illustrated with public-domain prints, photographs and diagrams.',
      examples: '漫画 · アニメ · 怪獣 · かわいい',
      href: !g.done ? '#/popculture' : g.next ? '#/' + g.next.id : '#/popculture-glossary',
      value: g.done, total: g.total, progressLabel: g.done + ' of ' + g.total + ' chapters read',
      cta: !g.done ? 'Open the handbook' : g.next ? 'Continue: chapter ' + g.next.label : 'Browse the glossary'
    });
  }
  function bathingTile() {
    var g = groupProgress('bathing');
    return tile({
      id: 'bathing', glyph: '湯', kicker: 'Bathing handbook', title: 'Hot springs and bathhouses',
      desc: 'What the law counts as an onsen and where the heat comes from, how to read the spring label, temple baths, the bathhouses of Edo and the neighbourhood sentō, onsen towns, ryokan stays, etiquette, tattoos, official health advice and the Japanese at the door. Cited from laws, official data and scholarship.',
      examples: '温泉 · 銭湯 · 男湯 · 女湯',
      href: !g.done ? '#/bathing' : g.next ? '#/' + g.next.id : '#/bathing-glossary',
      value: g.done, total: g.total, progressLabel: g.done + ' of ' + g.total + ' chapters read',
      cta: !g.done ? 'Open the handbook' : g.next ? 'Continue: chapter ' + g.next.label : 'Browse the glossary'
    });
  }
  function railwaysTile() {
    var g = groupProgress('railways');
    return tile({
      id: 'railways', glyph: '鉄', kicker: 'Railways handbook', title: 'Trains and stations',
      desc: 'From the first line of 1872 to the Shinkansen, the break-up of JNR, the private railways that built suburbs and the subways of Tokyo and Osaka; how safety, fares, IC cards and the Japan Rail Pass work; local lines, freight, night trains, ekiben and the Japanese of the station. Cited from official and company sources, with dated prices.',
      examples: '新幹線 · 駅弁 · 特急 · 改札',
      href: !g.done ? '#/railways' : g.next ? '#/' + g.next.id : '#/railways-glossary',
      value: g.done, total: g.total, progressLabel: g.done + ' of ' + g.total + ' chapters read',
      cta: !g.done ? 'Open the handbook' : g.next ? 'Continue: chapter ' + g.next.label : 'Browse the glossary'
    });
  }
  function festivalsTile() {
    var g = groupProgress('festivals');
    return tile({
      id: 'festivals', glyph: '祭', kicker: 'Festivals handbook', title: 'The Japanese year',
      desc: 'The old calendar and the switch of 1873, solar terms and lucky days, national holidays and Golden Week, the five seasonal festivals; New Year, setsubun, cherry blossom, Bon, the harvest moon and red leaves; what a matsuri is, the great festivals from Kyoto to Sapporo, and how to join in safely. Cited from official sources, with dated festival and bloom dates.',
      examples: '祭り · 花見 · 神輿 · 正月',
      href: !g.done ? '#/festivals' : g.next ? '#/' + g.next.id : '#/festivals-glossary',
      value: g.done, total: g.total, progressLabel: g.done + ' of ' + g.total + ' chapters read',
      cta: !g.done ? 'Open the handbook' : g.next ? 'Continue: chapter ' + g.next.label : 'Browse the glossary'
    });
  }
  function signsTile() {
    return tile({
      id: 'signs', glyph: '看', kicker: 'Photo gallery', title: 'Signs in the wild',
      desc: 'Real Japanese text in public space: station boards, warnings and notices, shop signs and noren, posters and road signs. Public-domain photos to practise reading on.',
      examples: '出口 · 注意 · 営業中 · 止まれ', href: '#/signs', cta: 'Open the gallery'
    });
  }
  function homeOffline() {
    var line = el('p', { 'class': 'home-foot home-offline' });
    function refresh() {
      line.replaceChildren(
        el('span', { 'class': offline.ready ? 'ok' : '', text: offlineStatusText() }), ' · ',
        offline.installEvent && !isStandalone()
          ? el('button', { 'class': 'link-btn', type: 'button', text: 'Install the app', onclick: installApp })
          : el('a', { href: '#/offline', text: isStandalone() ? 'About the app' : 'Install the app and use it offline' })
      );
    }
    refresh(); onOfflineChange(refresh);
    return line;
  }
  function showHome() {
    var guide = groupProgress('course');
    var article = el('article', { 'class': 'home' }, [
      el('header', { 'class': 'home-hero' }, [
        el('p', { 'class': 'home-hero-kicker' }, [el('span', { lang: 'ja', text: '日本へようこそ' }), ' · welcome to Japan']),
        el('h1', { text: 'Japanese for your trip' }),
        el('p', { 'class': 'home-lead', text: 'Eleven ways in. Get the practical know-how for travelling in Japan, learn to read the scripts on every sign, menu and station board, then go deeper into how Japanese food is made, into the kami, ghosts and yōkai of Japanese belief, into manga, anime, film and the rest of Japanese pop culture, into hot springs and bathhouses, into Japan’s railways, and into the festivals and seasons of the Japanese year. Then try your reading on photos of real signs.' })
      ]),
      el('div', { 'class': 'home-tiles' }, [
        tile({
          id: 'guide', glyph: '日本', kicker: 'Travel know-how', title: 'Japan guide',
          desc: 'Pronunciation, survival words and phrases, trains and subways, etiquette, food and tourist pitfalls.',
          examples: 'すみません · 駅 · いただきます', href: guide.done && guide.next ? '#/' + guide.next.id : '#/guide',
          value: guide.done, total: guide.total, progressLabel: guide.done + ' of ' + guide.total + ' lessons completed',
          cta: !guide.done ? 'Open the guide' : guide.next ? 'Continue: lesson ' + guide.next.label : 'Revise the cheat sheet'
        }),
        kanaTile('hiragana', 'あ', 'Hiragana course', 'The native script: grammar, food words, station names and the ゆ on onsen curtains.', 'えき · すし · ありがとう'),
        kanaTile('katakana', 'ア', 'Katakana course', 'The script for foreign words. Menus, shops and signs are full of them, and you already know most of the words.', 'ホテル · コーヒー · タクシー'),
        kanaTile('kanji', '漢', 'Kanji course', 'The 95 kanji on signs in stations, restaurants, shops, toilets and onsen: what they mean and how to read them.', '出口 · 駅 · 禁煙'),
        cuisineTile(),
        folkloreTile(),
        popcultureTile(),
        bathingTile(),
        railwaysTile(),
        festivalsTile(),
        signsTile()
      ]),
      el('p', { 'class': 'home-foot' }, [
        'Tip: tap any Japanese text to hear it. Quick practice: ',
        el('a', { href: '#/drill', text: 'flashcard drill' }), ' · ',
        el('a', { href: '#/hiragana-review', text: 'hiragana review' }), ' · ',
        el('a', { href: '#/katakana-review', text: 'katakana review' }), ' · ',
        el('a', { href: '#/kanji-review', text: 'kanji review' }),
        '. Using two devices? ', el('a', { href: '#/progress', text: 'Sync your progress' }), '.'
      ]),
      homeOffline()
    ]);
    markSpeakable(article.querySelector('.home-hero'));
    content.replaceChildren(el('div', { 'class': 'page' }, [article]));
    rendered = 'home';
    document.title = 'Nippon Bible: Japanese for your trip';
    return Promise.resolve();
  }

  /* ---------- flashcard drill ---------- */
  var drill = { deck: 'hiragana', queue: [], card: null, revealed: false, right: 0, again: 0 };
  var decks = null;

  function parseDecks(md) {
    var hira = [], kata = [], signs = [];
    var chart = md.split('## 2. The kana chart')[1].split('### Modifier')[0];
    chart.split('\n').forEach(function (line) {
      if (!/^\| [a-z–] \|/.test(line)) return;
      line.split('|').slice(2).forEach(function (cell) {
        var m = cell.trim().match(/^(\S) (\S) \**([a-z()]+)\**$/);
        if (m) {
          var r = m[3].replace('(w)o', 'o (wo)');
          hira.push({ front: m[1], reading: r });
          kata.push({ front: m[2], reading: r });
        }
      });
    });
    var signsPart = md.split('## 4. Survival kanji')[1].split('## 5.')[0];
    var inSignTable = false;
    signsPart.split('\n').forEach(function (line) {
      if (/^\| Sign \| Reading \| Meaning \|/.test(line)) { inSignTable = true; return; }
      if (!line.startsWith('|')) { inSignTable = false; return; }
      if (!inSignTable || /^\|-/.test(line)) return;
      var c = line.split('|').slice(1, -1).map(function (s) { return s.trim().replace(/\*\*/g, ''); });
      if (c.length === 3) signs.push({ front: c[0], reading: c[1], meaning: c[2] });
    });
    return { hiragana: hira, katakana: kata, kana: hira.concat(kata), signs: signs };
  }
  function shuffle(a) {
    a = a.slice();
    for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; }
    return a;
  }
  function startDeck(name) {
    drill.deck = name; drill.queue = shuffle(decks[name]); drill.right = 0; drill.again = 0;
    save('nb-deck', name);
    nextCard();
  }
  function nextCard() { drill.card = drill.queue.shift() || null; drill.revealed = false; renderDrill(); }
  function grade(knew) {
    if (!drill.card) return;
    if (knew) drill.right++;
    else { drill.again++; drill.queue.splice(Math.min(drill.queue.length, 3 + Math.floor(Math.random() * 4)), 0, drill.card); }
    nextCard();
  }
  function reveal() { if (drill.card && !drill.revealed) { drill.revealed = true; renderDrill(); } }

  function renderDrill() {
    var root = content.querySelector('#drill');
    if (!root) return;
    var labels = { hiragana: 'Hiragana', katakana: 'Katakana', kana: 'Both kana', signs: 'Sign kanji' };
    var controls = el('div', { 'class': 'drill-controls', role: 'group', 'aria-label': 'Choose deck' },
      Object.keys(labels).map(function (k) {
        return el('button', { 'class': 'chip', type: 'button', 'aria-pressed': String(drill.deck === k),
          text: labels[k] + ' (' + decks[k].length + ')', onclick: function () { startDeck(k); } });
      }));
    var card, actions;
    if (!drill.card) {
      card = el('div', { 'class': 'card' }, [el('div', {}, [
        el('div', { 'class': 'card-front long', text: 'お疲れ様!' }),
        el('p', { 'class': 'meaning', text: 'Deck finished. Otsukaresama: well done!' })
      ])]);
      actions = el('div', { 'class': 'drill-actions' }, [
        el('button', { 'class': 'btn primary', type: 'button', text: 'Start again', onclick: function () { startDeck(drill.deck); } })
      ]);
    } else {
      var c = drill.card;
      var back = drill.revealed
        ? el('div', {}, [el('div', { 'class': 'reading', text: c.reading }), c.meaning ? el('div', { 'class': 'meaning', text: c.meaning }) : null])
        : el('div', { 'class': 'placeholder', text: 'How do you read it?' });
      card = el('div', { 'class': 'card' }, [el('div', {}, [
        el('div', { 'class': 'card-front' + (c.front.length > 2 ? ' long' : ''), lang: 'ja', text: c.front }),
        el('div', { 'class': 'card-back', 'aria-live': 'polite' }, [back])
      ])]);
      var listen = el('button', { 'class': 'btn', type: 'button', text: '🔊 Listen', onclick: function () { speak(c.front.split(/\s*[\/·]\s*/)[0]); } });
      actions = drill.revealed
        ? el('div', { 'class': 'drill-actions' }, [
            el('button', { 'class': 'btn', type: 'button', text: 'Again', onclick: function () { grade(false); } }),
            listen,
            el('button', { 'class': 'btn primary', type: 'button', text: 'Got it', onclick: function () { grade(true); } })
          ])
        : el('div', { 'class': 'drill-actions' }, [
            listen,
            el('button', { 'class': 'btn primary', type: 'button', text: 'Show answer', onclick: reveal })
          ]);
    }
    var stats = el('div', { 'class': 'drill-stats' }, [
      el('span', { html: 'Left: <b>' + (drill.queue.length + (drill.card ? 1 : 0)) + '</b>' }),
      el('span', { html: 'Got it: <b>' + drill.right + '</b>' }),
      el('span', { html: 'Again: <b>' + drill.again + '</b>' })
    ]);
    var hint = el('p', { 'class': 'kbd-hint', html: 'Keyboard: <kbd>Space</kbd> show · <kbd>1</kbd> again · <kbd>2</kbd> got it · <kbd>L</kbd> listen' });
    root.replaceChildren(controls, card, actions, stats, hint);
  }
  document.addEventListener('keydown', function (e) {
    if (!content.querySelector('#drill') || e.target.closest('input, textarea') || e.metaKey || e.ctrlKey) return;
    if (e.key === ' ' && e.target === document.body) { e.preventDefault(); reveal(); }
    else if (e.key === '1' && drill.revealed) grade(false);
    else if (e.key === '2' && drill.revealed) grade(true);
    else if ((e.key === 'l' || e.key === 'L') && drill.card) speak(drill.card.front.split(/\s*[\/·]\s*/)[0]);
  });
  /* ---------- progress transfer between devices ---------- */
  function syncSummaryList(desc) {
    var completed = desc.done.filter(function (id) { return LESSONS.some(function (l) { return l.id === id; }); }).length;
    function n(x, word) { return x + ' ' + word + (x === 1 ? '' : 's'); }
    function kana(name, k) {
      return name + ': ' + (k.chars ? n(k.chars, 'character') + (k.mastered ? ' (' + k.mastered + ' mastered)' : '') + (k.words ? ', ' + n(k.words, 'word') : '') : 'not started');
    }
    return el('ul', { 'class': 'sync-list' }, [
      el('li', { text: completed + ' of ' + LESSONS.length + ' pages completed' }),
      el('li', { text: kana('Hiragana', desc.hira) }),
      el('li', { text: kana('Katakana', desc.kata) }),
      el('li', { text: kana('Kanji', desc.kanji).replace(' characters', ' kanji').replace(' character', ' kanji') })
    ]);
  }
  function showProgress(importCode) {
    var P = window.NBProgress;
    var article = el('article', { 'class': 'sync' });
    content.replaceChildren(el('div', { 'class': 'page' }, [article]));
    rendered = null;
    document.title = 'Sync progress · Nippon Bible';
    if (!P) { article.appendChild(el('p', { text: 'Progress transfer isn\'t available in this browser.' })); return Promise.resolve(); }

    var here = P.describe(P.current());
    var linkBox = el('textarea', { 'class': 'sync-code', readonly: true, rows: '3', 'aria-label': 'Transfer link', hidden: true });
    var sendStatus = el('p', { 'class': 'sync-status', 'aria-live': 'polite' });
    var preview = el('div', { 'class': 'sync-preview', 'aria-live': 'polite' });
    var pasteBox = el('textarea', { 'class': 'sync-code', rows: '3', placeholder: 'Paste a transfer link here', 'aria-label': 'Paste a transfer link or code' });
    var fileInput = el('input', { type: 'file', accept: '.json,application/json,text/plain', 'class': 'sync-file', 'aria-label': 'Open a progress file' });

    function makeLink() {
      return P.encode(P.collect()).then(function (code) { return location.href.split('#')[0] + '#/import/' + code; });
    }
    function showLink(link) { linkBox.value = link; linkBox.hidden = false; }
    var copyBtn = el('button', { 'class': 'btn primary', type: 'button', text: 'Copy transfer link', onclick: function () {
      makeLink().then(function (link) {
        showLink(link);
        var done = function () { sendStatus.textContent = 'Link copied (' + link.length.toLocaleString() + ' characters). Paste it into a message or note to yourself, then open it on your other device.'; };
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(link).then(done, function () { linkBox.select(); sendStatus.textContent = 'Copy the link below by hand (your browser blocked automatic copying).'; });
        } else { linkBox.select(); sendStatus.textContent = 'Copy the link below by hand.'; }
      }).catch(function (e) { sendStatus.textContent = 'Couldn\'t create the link: ' + e.message; });
    } });
    var shareBtn = navigator.share ? el('button', { 'class': 'btn', type: 'button', text: 'Share…', onclick: function () {
      makeLink().then(function (link) {
        showLink(link);
        return navigator.share({ title: 'My Nippon Bible progress', text: 'Open this link on your other device to continue where you left off.', url: link });
      }).then(function () { sendStatus.textContent = 'Shared. Open the link on your other device.'; }, function (e) { if (e && e.name !== 'AbortError') sendStatus.textContent = 'Sharing didn\'t work. Use "Copy transfer link" instead.'; });
    } }) : null;
    var fileBtn = el('button', { 'class': 'btn', type: 'button', text: 'Download progress file', onclick: function () {
      var blob = new Blob([JSON.stringify(P.collect())], { type: 'application/json' });
      var a = el('a', { href: URL.createObjectURL(blob), download: 'nippon-bible-progress-' + new Date().toISOString().slice(0, 10) + '.json' });
      document.body.appendChild(a); a.click(); a.remove();
      setTimeout(function () { URL.revokeObjectURL(a.href); }, 2000);
      sendStatus.textContent = 'File downloaded. Move it to your other device (email, cloud drive, AirDrop…) and open it below.';
    } });

    function showPreview(promise) {
      preview.replaceChildren(el('p', { 'class': 'sync-status', text: 'Reading…' }));
      promise.then(function (data) {
        var d = P.describe(data);
        var mergeBtn = el('button', { 'class': 'btn primary', type: 'button', text: 'Merge into this device', onclick: function () {
          try {
            var r = P.apply(data);
            done = load('nb-done', {}); buildNav(); setCurrent('progress');
            var changes = r.lessons + r.hira.added + r.hira.updated + r.kata.added + r.kata.updated;
            preview.replaceChildren(el('div', { 'class': 'sync-result' }, [
              el('p', { 'class': 'hw-win', text: changes ? '✓ Progress merged.' : '✓ Nothing new: this device was already up to date.' }),
              el('ul', { 'class': 'sync-list' }, [
                el('li', { text: r.lessons + ' page' + (r.lessons === 1 ? '' : 's') + ' newly marked complete' }),
                el('li', { text: 'Hiragana: ' + r.hira.added + ' added, ' + r.hira.updated + ' updated, ' + r.hira.kept + ' kept (newer here)' }),
                el('li', { text: 'Katakana: ' + r.kata.added + ' added, ' + r.kata.updated + ' updated, ' + r.kata.kept + ' kept (newer here)' }),
                el('li', { text: 'Kanji: ' + r.kanji.added + ' added, ' + r.kanji.updated + ' updated, ' + r.kanji.kept + ' kept (newer here)' })
              ]),
              el('a', { 'class': 'btn', href: '#/', text: 'Go to the home page →' })
            ]));
            summaryBox.replaceChildren(syncSummaryList(P.describe(P.current())));
          } catch (e) { preview.replaceChildren(el('p', { 'class': 'sync-error', text: e.message })); }
        } });
        preview.replaceChildren(el('div', { 'class': 'sync-incoming' }, [
          el('p', {}, [el('strong', { text: 'Progress from ' + (d.at ? new Date(d.at).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' }) : 'another device') + ':' })]),
          syncSummaryList(d),
          el('p', { 'class': 'hw-note', text: 'Merging keeps the best of both devices. Nothing on this device is lost.' }),
          el('div', { 'class': 'hw-actions' }, [mergeBtn, el('button', { 'class': 'btn', type: 'button', text: 'Cancel', onclick: function () { preview.replaceChildren(); } })])
        ]));
        preview.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      }).catch(function (e) { preview.replaceChildren(el('p', { 'class': 'sync-error', text: e.message })); });
    }
    fileInput.addEventListener('change', function () {
      var f = fileInput.files && fileInput.files[0];
      if (!f) return;
      if (f.size > 2e6) { preview.replaceChildren(el('p', { 'class': 'sync-error', text: 'That file is too large to be a progress file.' })); return; }
      showPreview(f.text().then(P.parseFile));
      fileInput.value = '';
    });
    var summaryBox = el('div', {}, [syncSummaryList(here)]);

    article.append(
      el('h1', { text: 'Sync progress' }),
      el('p', { 'class': 'home-lead', text: 'Your progress is saved in this browser only. To continue on another device, move it with a transfer link or a file. Nothing is uploaded: the progress travels inside the link itself.' }),
      el('section', { 'class': 'sync-box' }, [el('h2', { text: 'On this device' }), summaryBox]),
      el('section', { 'class': 'sync-box' }, [
        el('h2', { text: 'Send to another device' }),
        el('div', { 'class': 'hw-actions' }, [copyBtn, shareBtn, fileBtn]),
        sendStatus, linkBox,
        el('p', { 'class': 'hw-note', text: 'Send the link to yourself by email, a notes app or a messenger. It holds no personal data, just your learning progress, but anyone who opens it can see that progress.' })
      ]),
      el('section', { 'class': 'sync-box' }, [
        el('h2', { text: 'Receive from another device' }),
        el('p', { text: 'Open the transfer link on this device, or paste it here:' }),
        pasteBox,
        el('div', { 'class': 'hw-actions' }, [
          el('button', { 'class': 'btn primary', type: 'button', text: 'Preview', onclick: function () { showPreview(P.decode(pasteBox.value)); } }),
          el('label', { 'class': 'btn sync-file-label' }, ['Open a progress file', fileInput])
        ]),
        preview
      ]),
      el('section', { 'class': 'sync-box' }, [
        el('h2', { text: 'How merging works' }),
        el('ul', { 'class': 'sync-list' }, [
          el('li', { text: 'A lesson or unit completed on either device counts as completed.' }),
          el('li', { text: 'For each review item, the copy you practised most recently wins, so your review schedule stays right.' }),
          el('li', { text: 'Game proficiency keeps the record with more answers; best scores keep the higher one; streak days are combined.' }),
          el('li', { text: 'Your theme and flashcard deck choices stay per device.' })
        ])
      ])
    );
    if (importCode) {
      // Keep the code out of the address bar and history once it's been read.
      try { history.replaceState(null, '', '#/progress'); } catch (e) { /* ignore */ }
      setCurrent('progress');
      showPreview(P.decode('#/import/' + importCode));
    }
    return Promise.resolve();
  }

  /* ---------- offline app: service worker, install, updates ---------- */
  var offline = { supported: 'serviceWorker' in navigator && location.protocol !== 'file:', ready: false, installEvent: null, listeners: [] };
  function offlineChanged() { offline.listeners.forEach(function (fn) { fn(); }); }
  function onOfflineChange(fn) { offline.listeners.push(fn); }
  function isStandalone() {
    return (window.matchMedia && matchMedia('(display-mode: standalone)').matches) || navigator.standalone === true;
  }
  function showUpdate(worker) {
    if (document.getElementById('updateBar')) return;
    var bar = el('div', { 'class': 'update-bar', id: 'updateBar', role: 'status' }, [
      el('span', { text: 'A new version of Nippon Bible is ready.' }),
      // Ask whichever version is waiting now: the one this bar was made for may have been
      // replaced by a later download, and a discarded worker ignores the message.
      el('button', { 'class': 'btn primary', type: 'button', text: 'Reload', onclick: function () {
        navigator.serviceWorker.getRegistration().then(function (reg) {
          var w = (reg && reg.waiting) || worker;
          if (w) activate(w); else location.reload();
        });
      } }),
      el('button', { 'class': 'icon-btn', type: 'button', 'aria-label': 'Later', text: '×', onclick: function () { bar.remove(); } })
    ]);
    document.body.appendChild(bar);
  }
  // Updates: the version this device runs (from the saved copy) and the newest one on the
  // server (asked for with ?fresh=, which the service worker sends to the network).
  var running = { version: null };
  // The version this device runs, read from the saved copy; the Updates panel waits for it.
  running.ready = fetchText('VERSION').then(function (v) { running.version = v.trim(); });
  function latestVersion() {
    return fetch('VERSION?fresh=' + Date.now(), { cache: 'no-store' }).then(function (r) {
      if (!r.ok) throw new Error('HTTP ' + r.status);
      return r.text();
    }).then(function (t) { return t.trim(); });
  }
  function newer(a, b) {   // is version a newer than b?
    var x = a.split('.').map(Number), y = b.split('.').map(Number);
    for (var i = 0; i < 3; i++) if ((x[i] || 0) !== (y[i] || 0)) return (x[i] || 0) > (y[i] || 0);
    return false;
  }
  // Ask the service worker to fetch the new release and switch to it. If the browser doesn't
  // manage within 60 s (some keep the old copy), fall back to resetting the saved copy.
  function updateNow(say) {
    say = say || function () {};
    if (!offline.supported) { location.reload(); return; }
    navigator.serviceWorker.getRegistration().then(function (reg) {
      if (!reg) { location.replace('./?fresh=' + Date.now()); return; }
      if (reg.waiting) { activate(reg.waiting); return; }
      say('Downloading the new version…');
      var gaveUp = setTimeout(function () { say('The browser didn\'t update; resetting the saved copy…'); location.href = 'reset.html'; }, 60000);
      function follow(w) {
        if (!w) return;
        w.addEventListener('statechange', function () {
          if (w.state === 'installed') { clearTimeout(gaveUp); activate(w); }
          if (w.state === 'redundant') { clearTimeout(gaveUp); say('The download failed; resetting the saved copy…'); location.href = 'reset.html'; }
        });
      }
      reg.addEventListener('updatefound', function () { follow(reg.installing); });
      follow(reg.installing);
      reg.update().catch(function () { clearTimeout(gaveUp); say('Could not reach the server. Check your connection and try again.'); });
    });
  }
  function showNewerBar(version) {
    if (document.getElementById('updateBar')) return;
    var msg = el('span', { text: 'Version ' + version + ' is available.' });
    var bar = el('div', { 'class': 'update-bar', id: 'updateBar', role: 'status' }, [
      msg,
      el('button', { 'class': 'btn primary', type: 'button', text: 'Update', onclick: function () { updateNow(function (t) { msg.textContent = t; }); } }),
      el('button', { 'class': 'icon-btn', type: 'button', 'aria-label': 'Later', text: '×', onclick: function () { bar.remove(); } })
    ]);
    document.body.appendChild(bar);
  }
  if (offline.supported) {
    var hadController = !!navigator.serviceWorker.controller;
    navigator.serviceWorker.addEventListener('controllerchange', function () {
      if (hadController) location.reload();
      hadController = true;
    });
    navigator.serviceWorker.register('sw.js').then(function (reg) {
      function watch(w) {
        if (!w) return;
        w.addEventListener('statechange', function () { if (w.state === 'installed' && navigator.serviceWorker.controller) showUpdate(w); });
      }
      // An update downloaded during an earlier visit is applied straight away at start-up,
      // before the reader is in the middle of anything; one that arrives later asks first.
      if (reg.waiting && navigator.serviceWorker.controller) {
        if (performance.now() < 15000) activate(reg.waiting); else showUpdate(reg.waiting);
      }
      watch(reg.installing);
      reg.addEventListener('updatefound', function () { watch(reg.installing); });
      // Look for a new release whenever the app comes back to the foreground, and every
      // 30 minutes while it stays open.
      function check() { if (!document.hidden) reg.update().catch(function () {}); }
      document.addEventListener('visibilitychange', check);
      setInterval(check, 30 * 60 * 1000);
    }).catch(function () { /* offline support unavailable; the site still works online */ });
    navigator.serviceWorker.ready.then(function () { offline.ready = true; offlineChanged(); });
  }
  window.addEventListener('beforeinstallprompt', function (e) { e.preventDefault(); offline.installEvent = e; offlineChanged(); });
  window.addEventListener('appinstalled', function () {
    offline.installEvent = null; offlineChanged();
    toast('Installed. Open Nippon Bible from your home screen or app drawer.');
  });
  function installApp() {
    var e = offline.installEvent;
    if (!e) return;
    e.prompt();
    (e.userChoice || Promise.resolve()).then(function () { offline.installEvent = null; offlineChanged(); });
  }
  function offlineStatusText() {
    if (!offline.supported) return 'This browser can\'t save the course for offline use.';
    return offline.ready ? '✓ Saved on this device: works offline' : 'Saving the course for offline use…';
  }

  function updatesBox() {
    var line = el('p', { 'class': 'sync-status', text: 'This device: ' + (running.version ? 'v' + running.version : '…') + ' · checking the latest version…' });
    var note = el('p', { 'class': 'sync-status' });
    function check() {
      line.textContent = 'This device: ' + (running.version ? 'v' + running.version : '…') + ' · checking the latest version…';
      Promise.all([latestVersion(), running.ready]).then(function (r) {
        var latest = r[0];
        var behind = running.version && newer(latest, running.version);
        line.textContent = 'This device: v' + running.version + ' · latest: v' + latest + (behind ? ' · an update is available' : ' · up to date');
      }).catch(function () { line.textContent = 'This device: v' + running.version + ' · can\'t reach the server to check (offline?)'; });
    }
    check();
    return el('section', { 'class': 'sync-box' }, [
      el('h2', { text: 'Updates' }),
      line,
      el('div', { 'class': 'hw-actions' }, [
        el('button', { 'class': 'btn primary', type: 'button', text: 'Check for updates', onclick: function () {
          note.textContent = 'Checking…';
          Promise.all([latestVersion(), running.ready]).then(function (r) {
            var latest = r[0];
            check();
            if (running.version && newer(latest, running.version)) updateNow(function (t) { note.textContent = t; });
            else note.textContent = 'You have the latest version.';
          }).catch(function () { note.textContent = 'Could not reach the server. Check your connection and try again.'; });
        } }),
        el('a', { 'class': 'btn', href: 'reset.html', text: 'Reset and reload' })
      ]),
      note,
      el('p', { 'class': 'sync-status', text: '"Reset and reload" deletes the saved copy of the site and downloads the newest one again. Your progress stays. If an old version ever gets stuck, you can also open pkasprowicz.github.io/nippon-bible/reset.html directly.' })
    ]);
  }
  function showOffline() {
    var article = el('article', { 'class': 'sync offline' });
    content.replaceChildren(el('div', { 'class': 'page' }, [article]));
    rendered = null;
    document.title = 'Install & offline · Nippon Bible';
    var status = el('p', { 'class': 'offline-status' });
    var details = el('p', { 'class': 'sync-status' });
    var installBox = el('div', { 'class': 'offline-install' });
    function refresh() {
      status.textContent = offlineStatusText();
      status.classList.toggle('ok', offline.ready);
      installBox.replaceChildren();
      if (isStandalone()) installBox.appendChild(el('p', { text: '✓ You\'re using the installed app.' }));
      else if (offline.installEvent) installBox.appendChild(el('button', { 'class': 'btn primary', type: 'button', text: 'Install the app', onclick: installApp }));
      else installBox.appendChild(el('p', { text: 'In Chrome, open the ⋮ menu and choose "Install app" or "Add to Home screen".' }));
    }
    refresh(); onOfflineChange(refresh);
    if (offline.supported) {
      navigator.serviceWorker.ready.then(function () { return fetch('precache.json').then(function (r) { return r.json(); }); }).then(function (m) {
        details.textContent = m.files.length + ' files saved, version ' + m.version + '. Updates download automatically when you\'re online.';
      }).catch(function () {});
    }
    article.append(
      el('h1', { text: 'Install & use offline' }),
      el('p', { text: 'The whole site (every lesson, course, game, quiz and handbook, with their pictures and recorded audio) is saved on your device the first time you open it. After that it works with no connection: on the plane, on the subway, or with no roaming data.' }),
      el('section', { 'class': 'sync-box' }, [el('h2', { text: 'On this device' }), status, details]),
      updatesBox(),
      el('section', { 'class': 'sync-box' }, [
        el('h2', { text: 'Android' }),
        el('p', { text: 'Install it as an app: it gets its own icon in your launcher and app drawer and opens full screen, like any other app.' }),
        installBox,
        el('p', {}, ['Your progress stays with the app on this phone. To bring progress from another device, use ', el('a', { href: '#/progress', text: 'Sync progress' }), '.'])
      ]),
      el('section', { 'class': 'sync-box' }, [
        el('h2', { text: 'iPhone and iPad' }),
        el('p', { text: 'In Safari, tap Share, then "Add to Home Screen". Open the course from that icon: Safari can clear saved websites that you don\'t visit for a week, but home-screen apps keep their data.' }),
        el('p', {}, ['The home-screen app keeps its own progress, separate from Safari. Move your progress across with ', el('a', { href: '#/progress', text: 'Sync progress' }), '.'])
      ]),
      el('section', { 'class': 'sync-box' }, [
        el('h2', { text: 'Audio without a connection' }),
        el('p', { text: 'The Japanese you can tap to hear is recorded and saved with the rest of the site, so it plays the same on every device, also offline. Anything without a recording uses your phone\'s own text-to-speech, which needs a Japanese voice installed:' }),
        el('ul', { 'class': 'sync-list' }, [
          el('li', { text: 'Android: Settings › Accessibility › Text-to-speech output › the engine\'s settings › Install voice data › Japanese. Menu names vary by phone.' }),
          el('li', { text: 'iPhone: Settings › Accessibility › Spoken Content › Voices › Japanese.' })
        ]),
        el('p', { 'class': 'sync-status' }, ['Recordings made with ', el('a', { href: 'https://open-jtalk.sourceforge.net/', text: 'Open JTalk' }),
          ' and the HTS voice "Takumi" from the MMDAgent project, © 2017–2018 Nagoya Institute of Technology, licensed under ',
          el('a', { href: 'https://creativecommons.org/licenses/by/3.0/', text: 'CC BY 3.0' }), '.'])
      ])
    );
    return Promise.resolve();
  }

  function showDrill() {
    return fetchText('lessons/02-writing.md').then(function (md) {
      decks = decks || parseDecks(md);
      var article = el('article', {}, [
        el('h1', { text: 'Flashcard drill' }),
        el('p', { text: 'Cards come from Lesson 2. Pick a deck, say the reading out loud, then check. Cards you miss come back a few cards later.' }),
        el('div', { id: 'drill' })
      ]);
      content.replaceChildren(article);
      document.title = 'Flashcard drill · Nippon Bible';
      var saved = load('nb-deck', 'hiragana');
      startDeck(decks[saved] ? saved : 'hiragana');
    });
  }

  /* ---------- router ---------- */
  /* ---------- full-text search ---------- */
  // A plain substring scan over search-index.json, which the deploy builds with
  // scripts/build-search.mjs. Substrings need no word splitting, so English, rōmaji,
  // kana and kanji all work the same way.
  var SEARCH_MAX = 60;
  var searchData = null;
  // Lower case without Latin accents (rāmen → ramen), keeping kana voicing marks (が ≠ か).
  function fold(s) { return s.normalize('NFKD').replace(/[̀-ͯ]/g, '').normalize('NFC').toLowerCase(); }
  function loadSearch() {
    if (searchData) return Promise.resolve(searchData);
    return fetch('search-index.json', { cache: 'no-cache' }).then(function (r) {
      if (!r.ok) throw new Error('HTTP ' + r.status);
      return r.json();
    }).then(function (json) {
      var byId = {};
      LESSONS.forEach(function (l) { byId[l.id] = l; });
      searchData = json.sections.filter(function (s) { return byId[s[0]]; }).map(function (s) {
        var l = byId[s[0]];
        return { lesson: l, slug: s[1], heading: s[2], text: s[3], h: fold(s[2]), t: fold(s[3]), p: fold(l.title) };
      });
      return searchData;
    });
  }
  function searchTerms(query) {
    return fold(query).trim().split(/\s+/).filter(function (w, i, all) { return w && all.indexOf(w) === i; });
  }
  function countIn(hay, needle) {
    var n = 0, i = hay.indexOf(needle);
    while (i !== -1 && n < 10) { n++; i = hay.indexOf(needle, i + needle.length); }
    return n;
  }
  // Every term must appear. Headings weigh most, then the page title, then how often
  // the body mentions a term; the bibliographies sink to the bottom.
  function runSearch(data, query) {
    var terms = searchTerms(query), phrase = terms.join(' ');
    if (!terms.length) return [];
    var hits = [];
    data.forEach(function (d) {
      var score = 0;
      for (var i = 0; i < terms.length; i++) {
        var w = terms[i], inHeading = d.h.indexOf(w) !== -1, inPage = d.p.indexOf(w) !== -1, n = countIn(d.t, w);
        if (!inHeading && !inPage && !n) return;
        score += (inHeading ? 20 : 0) + (inPage ? 6 : 0) + n;
      }
      if (terms.length > 1 && (d.h.indexOf(phrase) !== -1 || d.t.indexOf(phrase) !== -1)) score += 15;
      if (/-sources$/.test(d.lesson.id)) score /= 5;
      hits.push({ d: d, score: score });
    });
    return hits.sort(function (a, b) { return b.score - a.score; });
  }
  // Text with the matched terms wrapped in <mark>; with `room`, only a window of about
  // that many characters around the first match, cut at spaces.
  function highlighted(text, terms, room) {
    var folded = '', from = [];   // from[i]: index in `text` of folded character i
    for (var i = 0; i < text.length;) {
      var ch = String.fromCodePoint(text.codePointAt(i));
      var f = ch.charCodeAt(0) < 128 ? ch.toLowerCase() : fold(ch);
      for (var k = 0; k < f.length; k++) { folded += f[k]; from.push(i); }
      i += ch.length;
    }
    from.push(text.length);
    var ranges = [];
    terms.forEach(function (w) {
      for (var p = folded.indexOf(w); p !== -1; p = folded.indexOf(w, p + w.length)) ranges.push([from[p], from[p + w.length]]);
    });
    ranges.sort(function (a, b) { return a[0] - b[0]; });
    var start = 0, end = text.length;
    if (room && text.length > room) {
      start = ranges.length ? Math.max(0, ranges[0][0] - Math.round(room / 4)) : 0;
      end = Math.min(text.length, start + room);
      if (start > 0) { var sp = text.indexOf(' ', start); if (sp !== -1 && sp < start + 15) start = sp + 1; }
      if (end < text.length) { var ep = text.lastIndexOf(' ', end); if (ep > end - 15) end = ep; }
    }
    var nodes = [start > 0 ? '…' : ''], at = start;
    ranges.forEach(function (r) {
      var a = Math.max(r[0], at), b = Math.min(r[1], end);
      if (b <= a) return;
      nodes.push(text.slice(at, a), el('mark', { text: text.slice(a, b) }));
      at = b;
    });
    nodes.push(text.slice(at, end), end < text.length ? '…' : '');
    return nodes.filter(function (n) { return n !== ''; });
  }
  function showSearch(query) {
    document.title = 'Search · Nippon Bible';
    var input = el('input', {
      type: 'search', 'class': 'search-input', id: 'searchInput', placeholder: 'English, rōmaji, kana or kanji',
      'aria-label': 'Search the whole guide', autocomplete: 'off', autocapitalize: 'off', spellcheck: 'false', enterkeyhint: 'search'
    });
    input.value = query;
    var filters = el('div', { 'class': 'search-filters', role: 'group', 'aria-label': 'Show results from' });
    var status = el('p', { 'class': 'search-status', role: 'status' });
    var list = el('ol', { 'class': 'search-results' });
    var article = el('article', { 'class': 'search' }, [
      el('h1', { text: 'Search' }),
      el('form', { 'class': 'search-form', role: 'search', onsubmit: function (e) { e.preventDefault(); input.blur(); } }, [
        input
      ]),
      filters, status, list
    ]);
    content.replaceChildren(el('div', { 'class': 'page' }, [article]));
    window.scrollTo(0, 0);
    if (!query) input.focus();
    status.textContent = 'Loading the search index…';

    var group = '', hits = [], timer;
    function example(q) {
      return el('button', { type: 'button', 'class': 'search-example', text: q, onclick: function () { input.value = q; update(); input.focus(); } });
    }
    function renderHits() {
      var terms = searchTerms(input.value);
      var shown = hits.filter(function (h) { return !group || h.d.lesson.group === group; });
      list.replaceChildren.apply(list, shown.slice(0, SEARCH_MAX).map(function (h) {
        var l = h.d.lesson;
        return el('li', {}, [el('a', { 'class': 'search-hit', href: '#/' + l.id + (h.d.slug ? '/' + h.d.slug : '') }, [
          el('span', { 'class': 'search-where', text: groupTitle(l.group) + ' · ' + pageKind(l) + ' · ' + l.title }),
          el('span', { 'class': 'search-heading' }, highlighted(h.d.heading, terms)),
          h.d.text ? el('span', { 'class': 'search-snippet' }, highlighted(h.d.text, terms, 200)) : null
        ])]);
      }));
      status.textContent = !shown.length ? '' : shown.length > SEARCH_MAX
        ? 'The best ' + SEARCH_MAX + ' of ' + shown.length + ' sections.'
        : shown.length + (shown.length === 1 ? ' section.' : ' sections.');
    }
    function renderFilters() {
      var counts = {};
      hits.forEach(function (h) { counts[h.d.lesson.group] = (counts[h.d.lesson.group] || 0) + 1; });
      var groups = GROUPS.filter(function (g) { return counts[g.id]; });
      if (!counts[group]) group = '';
      if (groups.length < 2) { filters.replaceChildren(); return; }
      function chip(id, label, n) {
        return el('button', { type: 'button', 'class': 'search-chip', 'aria-pressed': String(group === id),
          onclick: function () { group = id; renderFilters(); renderHits(); } }, [label + ' ', el('span', { 'class': 'search-count', text: String(n) })]);
      }
      filters.replaceChildren.apply(filters, [chip('', 'All', hits.length)].concat(groups.map(function (g) { return chip(g.id, g.title, counts[g.id]); })));
    }
    function update() {
      var q = input.value.trim();
      history.replaceState(null, '', '#/search' + (q ? '/' + encodeURIComponent(q) : ''));
      hits = q ? runSearch(searchData, q) : [];
      renderFilters(); renderHits();
      if (!q) status.replaceChildren('Search every lesson, course and handbook. Try: ', example('ramen'), ' ', example('駅'), ' ', example('kitsune'), ' ', example('onsen tattoo'));
      else if (!hits.length) status.textContent = 'Nothing found for “' + q + '”. Check the spelling, or try fewer words.';
    }
    input.addEventListener('input', function () { clearTimeout(timer); timer = setTimeout(update, 120); });
    // Arrow keys move between the box and the results.
    article.addEventListener('keydown', function (e) {
      if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return;
      var links = [].slice.call(list.querySelectorAll('a'));
      var i = links.indexOf(document.activeElement);
      if (e.target === input && e.key === 'ArrowDown' && links.length) { e.preventDefault(); links[0].focus(); }
      else if (i !== -1) { e.preventDefault(); (e.key === 'ArrowDown' ? links[i + 1] || links[i] : links[i - 1] || input).focus(); }
    });
    return loadSearch().then(update, function (err) {
      status.textContent = 'The search index could not be loaded (' + (err.message || err) + '). Try again when you\'re online.';
    });
  }
  document.getElementById('searchBtn').addEventListener('click', function () {
    var box = document.getElementById('searchInput');
    if (box) box.focus(); else location.hash = '#/search';
  });
  // "/" opens search from anywhere except a text field.
  document.addEventListener('keydown', function (e) {
    if (e.key !== '/' || e.ctrlKey || e.metaKey || e.altKey || e.target.closest('input, textarea, select, [contenteditable]')) return;
    e.preventDefault();
    document.getElementById('searchBtn').click();
  });

  function route() {
    var parts = location.hash.replace(/^#\/?/, '').split('/');
    var r = parts[0], section = '';
    try { section = decodeURIComponent(parts.slice(1).join('/')); } catch (e) { section = ''; }
    if (ALIASES[r]) { location.replace('#/' + ALIASES[r] + (section ? '/' + section : '')); return; }
    var special = r === 'drill' || r === 'progress' || r === 'import' || r === 'offline' || r === 'search';
    if (r && !special && !LESSONS.some(function (l) { return l.id === r; })) { r = ''; section = ''; }
    var key = special ? r : (r || 'home');
    if (!special && key !== 'home' && key === rendered) { scrollToSection(section, true); return; }
    setCurrent(r);
    stopSpeech();
    if (spyHandler) { window.removeEventListener('scroll', spyHandler); spyHandler = null; }
    rendered = null;
    var p = r === 'search' ? showSearch(section) : r === 'drill' ? showDrill() : r === 'progress' ? showProgress() : r === 'offline' ? showOffline()
      : r === 'import' ? showProgress(parts.slice(1).join('/')) : r ? showPage(r) : showHome();
    p.then(function () {
      if (r === 'search') return;   // showSearch handles focus and scrolling
      if (section) jumpWhenSettled(section);
      else window.scrollTo(0, 0);
      if (!section) content.focus({ preventScroll: true });
    })
     .catch(function (err) {
       content.replaceChildren(el('article', {}, [el('h1', { text: 'Could not load this page' }), el('p', { text: String(err.message || err) })]));
     });
  }

  buildNav();
  window.addEventListener('hashchange', route);
  route();
  running.ready.then(function () {
    document.getElementById('version').textContent = 'v' + running.version;
    // A newer release on the server that this browser hasn't picked up (some, such as Samsung
    // Internet, are slow to): offer it. Waits a little so a normal background update can win.
    if (navigator.onLine) setTimeout(function () {
      latestVersion().then(function (latest) { if (newer(latest, running.version)) showNewerBar(latest); }).catch(function () {});
    }, 8000);
  }).catch(function () {});
})();
