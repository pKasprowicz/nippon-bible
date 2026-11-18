(function () {
  'use strict';

  var GROUPS = [
    { id: 'course', title: 'Japan guide' },
    { id: 'hiragana', title: 'Hiragana course' },
    { id: 'katakana', title: 'Katakana course' },
    { id: 'kanji', title: 'Kanji course' },
    { id: 'cuisine', title: 'Cuisine handbook' },
    { id: 'folklore', title: 'Folklore handbook' }
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
    { id: 'folklore-sources', file: 'folklore/15-sources.md', group: 'folklore', title: 'Sources and image credits', label: '§', kind: 'Sources' }
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
  var voiceWarned = false;
  function speak(text, node) {
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
      document.querySelectorAll('.ja.speaking').forEach(function (n) { n.classList.remove('speaking'); });
      node.classList.add('speaking');
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
  document.addEventListener('click', function (e) {
    var t = e.target.closest('.ja');
    if (t) speak(t.textContent, t);
  });
  document.addEventListener('keydown', function (e) {
    var t = e.target.closest && e.target.closest('.ja');
    if (t && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); speak(t.textContent, t); }
  });

  /* ---------- hiragana course hooks ---------- */
  if (window.NBKana) {
    window.NBKana.init({
      speak: function (text) { speak(text); },
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
  function buildNav() {
    navList.innerHTML = '';
    navList.appendChild(el('li', {}, [el('a', { 'class': 'nav-link', href: '#/', 'data-route': '' }, [
      el('span', { 'class': 'nav-num', 'aria-hidden': 'true', text: '⌂' }), el('span', { text: 'Home' })
    ])]));
    GROUPS.forEach(function (g) {
      navList.appendChild(el('li', { 'class': 'nav-group', role: 'presentation', text: g.title }));
      LESSONS.filter(function (l) { return l.group === g.id; }).forEach(function (l) {
        navList.appendChild(el('li', {}, [el('a', {
          'class': 'nav-link' + (done[l.id] ? ' done' : '') + (l.group === 'hiragana' ? ' nav-hira' : ''), href: '#/' + l.id, 'data-route': l.id
        }, [
          el('span', { 'class': 'nav-num', 'aria-hidden': 'true', text: done[l.id] ? '✓' : l.label }),
          el('span', { text: l.title }),
          done[l.id] ? el('span', { 'class': 'sr-only', style: 'position:absolute;left:-9999px', text: ' (completed)' }) : null
        ])]));
      });
    });
  }
  function setCurrent(route) {
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
    var lesson = LESSONS.filter(function (l) { return l.id === pageKey; })[0];
    var script = lesson && (lesson.group === 'katakana' || lesson.group === 'kanji') ? lesson.group : 'hiragana';
    if (window.NBKana) window.NBKana.mount(article, pageKey, script);
    return article;
  }
  function lessonFooter(id) {
    var i = LESSONS.findIndex(function (l) { return l.id === id; });
    var next = LESSONS[i + 1] && LESSONS[i + 1].group === LESSONS[i].group ? LESSONS[i + 1] : null;
    var btn = el('button', { 'class': 'btn' + (done[id] ? ' done' : ''), type: 'button' });
    var reading = id.indexOf('cuisine') === 0 || id.indexOf('folklore') === 0;
    function label() {
      btn.textContent = done[id] ? (reading ? '✓ Read' : '✓ Completed') : (reading ? 'Mark chapter as read' : 'Mark lesson as completed');
      btn.className = 'btn' + (done[id] ? ' done' : '');
    }
    label();
    btn.addEventListener('click', function () {
      done[id] = !done[id]; save('nb-done', done); label(); buildNav(); setCurrent(id);
    });
    return el('div', {}, [el('div', { 'class': 'lesson-foot' }, [btn]), pager(id)]);
  }

  /* ---------- previous / next in content order (guide → hiragana → katakana → kanji → cuisine → folklore) ---------- */
  function groupTitle(g) { return (GROUPS.filter(function (x) { return x.id === g; })[0] || {}).title || ''; }
  function pageKind(l) {
    if (l.kind) return l.kind;
    if (l.label === '★') return l.group === 'course' ? 'Overview' : 'Start here';
    if (l.label === '↻') return 'Daily review';
    return (l.group === 'course' ? 'Lesson ' : (l.group === 'cuisine' || l.group === 'folklore') ? 'Chapter ' : 'Unit ') + l.label;
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
        el('span', { 'class': 'pager-meta', text: dir === 'prev' ? 'All six sections' : 'You\'ve reached the end. Back to all six sections' })
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

  /* ---------- home: six tiles ---------- */
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
      el('span', { 'class': 'home-progress' }, [
        el('span', { 'class': 'home-bar', role: 'img', 'aria-label': opts.progressLabel }, [el('span', { style: 'width:' + pct + '%' })]),
        el('span', { 'class': 'home-progress-text', text: opts.progressLabel })
      ]),
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
        el('p', { 'class': 'home-lead', text: 'Six ways in. Get the practical know-how for travelling in Japan, learn to read the scripts on every sign, menu and station board, then go deeper into how Japanese food is made and into the kami, ghosts and yōkai of Japanese belief.' })
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
        folkloreTile()
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
      el('button', { 'class': 'btn primary', type: 'button', text: 'Reload', onclick: function () { worker.postMessage('skipWaiting'); } }),
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
      if (reg.waiting && navigator.serviceWorker.controller) showUpdate(reg.waiting);
      watch(reg.installing);
      reg.addEventListener('updatefound', function () { watch(reg.installing); });
      // Look for a new release whenever the app comes back to the foreground.
      document.addEventListener('visibilitychange', function () { if (!document.hidden) reg.update().catch(function () {}); });
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
      el('p', { text: 'The whole site (every lesson, course, game, quiz and both handbooks with their pictures) is saved on your device the first time you open it. After that it works with no connection: on the plane, on the subway, or with no roaming data.' }),
      el('section', { 'class': 'sync-box' }, [el('h2', { text: 'On this device' }), status, details]),
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
        el('p', { text: 'Tap-to-listen uses your phone\'s own text-to-speech, so it can work offline if a Japanese voice is installed.' }),
        el('ul', { 'class': 'sync-list' }, [
          el('li', { text: 'Android: Settings › Accessibility › Text-to-speech output › the engine\'s settings › Install voice data › Japanese. Menu names vary by phone.' }),
          el('li', { text: 'iPhone: Settings › Accessibility › Spoken Content › Voices › Japanese.' })
        ]),
        el('p', { text: 'Test it before you travel: switch on airplane mode and tap any Japanese text.' })
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
  function route() {
    var parts = location.hash.replace(/^#\/?/, '').split('/');
    var r = parts[0], section = '';
    try { section = decodeURIComponent(parts.slice(1).join('/')); } catch (e) { section = ''; }
    if (ALIASES[r]) { location.replace('#/' + ALIASES[r] + (section ? '/' + section : '')); return; }
    var special = r === 'drill' || r === 'progress' || r === 'import' || r === 'offline';
    if (r && !special && !LESSONS.some(function (l) { return l.id === r; })) { r = ''; section = ''; }
    var key = special ? r : (r || 'home');
    if (!special && key !== 'home' && key === rendered) { scrollToSection(section, true); return; }
    setCurrent(r);
    if ('speechSynthesis' in window) speechSynthesis.cancel();
    if (spyHandler) { window.removeEventListener('scroll', spyHandler); spyHandler = null; }
    rendered = null;
    var p = r === 'drill' ? showDrill() : r === 'progress' ? showProgress() : r === 'offline' ? showOffline()
      : r === 'import' ? showProgress(parts.slice(1).join('/')) : r ? showPage(r) : showHome();
    p.then(function () {
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
  fetchText('VERSION').then(function (v) { document.getElementById('version').textContent = 'v' + v.trim(); }).catch(function () {});
})();
