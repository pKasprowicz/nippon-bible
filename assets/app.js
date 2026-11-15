(function () {
  'use strict';

  var LESSONS = [
    { id: '01-pronunciation', title: 'Pronunciation' },
    { id: '02-writing', title: 'Writing & recognition' },
    { id: '03-core-words', title: 'Core words' },
    { id: '04-phrases', title: 'Phrases & patterns' },
    { id: '05-situations', title: 'Situations' },
    { id: '06-subways', title: 'Subways: Tokyo & Osaka' },
    { id: '07-etiquette', title: 'Customs & etiquette' },
    { id: '08-pitfalls', title: 'Tourist pitfalls' },
    { id: '09-food', title: 'Food & dishes' },
    { id: '10-cheat-sheet', title: 'Cheat sheet & self-test' }
  ];
  // Old lesson ids (kept so bookmarks and saved progress keep working)
  var ALIASES = { '06-cheat-sheet': '10-cheat-sheet', '09-cheat-sheet': '10-cheat-sheet' };
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
  function speak(text, node) {
    if (!('speechSynthesis' in window)) { toast('Speech is not supported in this browser.'); return; }
    pickVoice();
    if (!jaVoice) toast('No Japanese voice found. Install one in your system settings for best results.');
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

  /* ---------- navigation ---------- */
  function buildNav() {
    navList.innerHTML = '';
    navList.appendChild(el('li', {}, [el('a', { 'class': 'nav-link', href: '#/', 'data-route': '' }, [
      el('span', { 'class': 'nav-num', 'aria-hidden': 'true', text: '⌂' }), el('span', { text: 'Overview' })
    ])]));
    LESSONS.forEach(function (l, i) {
      navList.appendChild(el('li', {}, [el('a', {
        'class': 'nav-link' + (done[l.id] ? ' done' : ''), href: '#/' + l.id, 'data-route': l.id
      }, [
        el('span', { 'class': 'nav-num', 'aria-hidden': 'true', text: done[l.id] ? '✓' : String(i + 1) }),
        el('span', { text: l.title }),
        done[l.id] ? el('span', { 'class': 'sr-only', style: 'position:absolute;left:-9999px', text: ' (completed)' }) : null
      ])]));
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
  function rewriteLinks(root, pageKey) {
    root.querySelectorAll('a[href]').forEach(function (a) {
      var href = a.getAttribute('href');
      var m = href.match(/(?:^|\/)(\d\d-[a-z-]+)\.md(?:#(.+))?$/);
      if (m) { a.setAttribute('href', '#/' + m[1] + (m[2] ? '/' + m[2] : '')); return; }
      m = href.match(/(?:^|\/)README\.md(?:#(.+))?$/);
      if (m) { a.setAttribute('href', m[1] ? '#/overview/' + m[1] : '#/'); return; }
      if (/^#[^\/]/.test(href)) { a.setAttribute('href', '#/' + pageKey + '/' + href.slice(1)); return; }
      if (/^https?:/.test(href)) { a.target = '_blank'; a.rel = 'noopener'; }
    });
  }
  function wrapTables(root) {
    root.querySelectorAll('table').forEach(function (t) {
      var wrap = el('div', { 'class': 'table-wrap' });
      t.parentNode.insertBefore(wrap, t);
      wrap.appendChild(t);
    });
  }
  function renderMarkdown(md, pageKey) {
    var article = el('article');
    article.innerHTML = marked.parse(md, { gfm: true });
    rewriteLinks(article, pageKey);
    wrapTables(article);
    markSpeakable(article);
    return article;
  }
  function lessonFooter(id) {
    var i = LESSONS.findIndex(function (l) { return l.id === id; });
    var next = LESSONS[i + 1];
    var btn = el('button', { 'class': 'btn' + (done[id] ? ' done' : ''), type: 'button' });
    function label() { btn.textContent = done[id] ? '✓ Completed' : 'Mark lesson as completed'; btn.className = 'btn' + (done[id] ? ' done' : ''); }
    label();
    btn.addEventListener('click', function () {
      done[id] = !done[id]; save('nb-done', done); label(); buildNav(); setCurrent(id);
    });
    return el('div', { 'class': 'lesson-foot' }, [
      btn,
      next ? el('a', { 'class': 'btn primary', href: '#/' + next.id, text: 'Next: ' + next.title + ' →' })
           : el('a', { 'class': 'btn primary', href: '#/drill', text: 'Practise with flashcards →' })
    ]);
  }
  /* ---------- chapter navigation ---------- */
  // Section ids follow GitHub's heading slugs, so README/lesson anchors work on GitHub and here.
  var SECTION_PREFIX = 'sec-';
  var WIDE = window.matchMedia('(min-width: 1280px)');
  var rendered = null;      // page key currently on screen ('overview' or a lesson id)
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
    var path = lesson ? 'lessons/' + lesson.id + '.md' : 'README.md';
    var pageKey = lesson ? lesson.id : 'overview';
    return fetchText(path).then(function (md) {
      var article = renderMarkdown(md, pageKey);
      if (lesson) article.appendChild(lessonFooter(lesson.id));
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
      document.title = (lesson ? (h1 ? h1.textContent.replace(/^Lesson \d+:\s*/, '') + ' · ' : '') : '') + 'Nippon Bible';
    });
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
    if (r === 'overview') r = '';
    if (ALIASES[r]) { location.replace('#/' + ALIASES[r] + (section ? '/' + section : '')); return; }
    if (r && r !== 'drill' && !LESSONS.some(function (l) { return l.id === r; })) { r = ''; section = ''; }
    var key = r === 'drill' ? 'drill' : (r || 'overview');
    if (key !== 'drill' && key === rendered) { scrollToSection(section, true); return; }
    setCurrent(r);
    if ('speechSynthesis' in window) speechSynthesis.cancel();
    if (spyHandler) { window.removeEventListener('scroll', spyHandler); spyHandler = null; }
    rendered = null;
    var p = r === 'drill' ? showDrill() : showPage(r);
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
