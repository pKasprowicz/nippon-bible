/* Kana test: assessment of hiragana and katakana together (```kanatest blocks).
   Tests only, no teaching. Each block is one test:
     kind:  read · listen · twins · lookalike · words · exam
     level: basic · voiced · combo · all       (which characters: both scripts each time)
     count: number of questions (for twins: number of boards)
     mode:  choose · type · mix                (read and words: pick or type the reading)
   Word rows, "word | romaji | meaning", follow the settings for words and exam tests.
   After a test, a report shows every character tested, coloured by result, and the weakest
   ones with a link to the course unit that teaches them. Nothing is saved. */
(function () {
  'use strict';
  var ctx = { speak: function () {}, canSay: function () { return false; } };
  var H, K, ALL, BY = {};
  function data() {
    if (ALL) return true;
    if (!window.NB_KANA || !window.NB_KATA) return false;
    var skip = { 'ぢ': 1, 'づ': 1, 'ヂ': 1, 'ヅ': 1 };
    H = window.NB_KANA.list.filter(function (e) { return !skip[e.k]; }).map(function (e) { return { k: e.k, r: e.r, unit: e.unit, set: e.set, s: 'h', look: e.look || [] }; });
    K = window.NB_KATA.list.filter(function (e) { return !skip[e.k]; }).map(function (e) { return { k: e.k, r: e.r, unit: e.unit, set: e.set, s: 'k', look: e.look || [] }; });
    ALL = H.concat(K);
    ALL.forEach(function (e) { BY[e.k] = e; });
    return true;
  }
  var SCRIPT = { h: 'hiragana', k: 'katakana' };
  // Hiragana and katakana sit 0x60 apart in Unicode: あ (3042) ↔ ア (30A2).
  function twin(ch) {
    return Array.from(ch).map(function (c) {
      var n = c.charCodeAt(0);
      return String.fromCharCode(n >= 0x3041 && n <= 0x3096 ? n + 0x60 : n >= 0x30a1 && n <= 0x30f6 ? n - 0x60 : n);
    }).join('');
  }
  function pool(level) {
    var sets = { basic: ['basic'], voiced: ['voiced'], combo: ['yoon', 'extended'], all: ['basic', 'voiced', 'yoon', 'extended'] }[level] || ['basic'];
    return ALL.filter(function (e) { return sets.indexOf(e.set) >= 0; });
  }
  // Pairs of characters that are easy to confuse, within a script and across the two.
  var LOOKALIKE = ['ぬめ', 'われね', 'さち', 'きさ', 'るろ', 'はほ', 'いり', 'あお', 'まも', 'こに', 'くへ', 'うら',
    'シツ', 'ソン', 'クケタ', 'ウワフ', 'スヌ', 'コユ', 'チテ', 'ラヲ', 'マム', 'アマ', 'ノメ', 'セヤ',
    'りリ', 'かカ', 'きキ', 'やヤ', 'せセ', 'もモ', 'にニ', 'ろロ', 'こコ'];

  // ---------- small helpers ----------
  function el(tag, attrs, kids) {
    var n = document.createElement(tag);
    Object.keys(attrs || {}).forEach(function (k) {
      if (k === 'text') n.textContent = attrs[k];
      else if (k.slice(0, 2) === 'on') n.addEventListener(k.slice(2), attrs[k]);
      else n.setAttribute(k, attrs[k]);
    });
    (kids || []).forEach(function (c) { if (c) n.appendChild(typeof c === 'string' ? document.createTextNode(c) : c); });
    return n;
  }
  function shuffle(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)), t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function pick(a, n) { return shuffle(a).slice(0, n); }
  function norm(s, loose) {
    var eng = window.NBKana && window.NBKana.engine('hiragana');
    if (eng && eng._test) return eng._test.norm(s, loose);
    return String(s || '').toLowerCase().replace(/[^a-z]/g, '');
  }
  function sameReading(a, b) { return norm(a, true) === norm(b, true); }
  // Distractor readings: the character's own look-alikes first, then others of its script and set.
  function readingOptions(e, n) {
    var out = [e.r], cands = e.look.map(function (k) { return BY[k]; }).filter(Boolean)
      .concat(shuffle(ALL.filter(function (o) { return o.s === e.s && o.set === e.set; })));
    cands.forEach(function (o) { if (out.length < n && !out.some(function (r) { return sameReading(r, o.r); })) out.push(o.r); });
    return shuffle(out);
  }
  // Sounds close to this one: same consonant or same vowel, same script and set.
  function soundOptions(e, n) {
    var cons = e.r.replace(/[aiueo]+$/, ''), vow = e.r.slice(-1);
    var near = ALL.filter(function (o) { return o.s === e.s && o.k !== e.k && o.set === e.set && !sameReading(o.r, e.r) && (o.r.replace(/[aiueo]+$/, '') === cons || o.r.slice(-1) === vow); });
    var out = [e];
    shuffle(near).concat(shuffle(ALL.filter(function (o) { return o.s === e.s && o.set === e.set; }))).forEach(function (o) {
      if (out.length < n && !out.some(function (x) { return x.k === o.k || sameReading(x.r, o.r); })) out.push(o);
    });
    return shuffle(out);
  }

  // ---------- question builders: each returns { prompt(), options | type, answer, chars, word } ----------
  function qRead(e, mode) {
    var typed = mode === 'type' || (mode === 'mix' && Math.random() < 0.5);
    return { chars: [e.k], label: e.k + ' · ' + e.r,
      prompt: function () { return [el('p', { 'class': 'hw-ask', text: typed ? 'Type the reading.' : 'What is the reading?' }), el('div', { 'class': 'hw-big', lang: 'ja', text: e.k })]; },
      type: typed, check: function (v) { return sameReading(v, e.r); }, answer: e.r,
      options: typed ? null : readingOptions(e, 4).map(function (r) { return { label: r, value: r }; }), correct: e.r, audio: e.k };
  }
  function qListen(e) {
    return { chars: [e.k], label: e.k + ' · ' + e.r, autoplay: e.k,
      prompt: function () { return [el('p', { 'class': 'hw-ask', text: 'Listen. Which ' + SCRIPT[e.s] + ' do you hear?' }), listenBtn(e.k)]; },
      options: soundOptions(e, 4).map(function (o) { return { label: o.k, value: o.k, ja: true }; }), correct: e.k, audio: e.k };
  }
  function qLook(group) {
    var members = Array.from(group).map(function (c) { return BY[c]; }).filter(Boolean), e = members[Math.floor(Math.random() * members.length)];
    var cross = members.some(function (o) { return o.s !== e.s; });
    if (cross || Math.random() < 0.5) {
      return { chars: [e.k], label: e.k + ' · ' + e.r,
        prompt: function () { return [el('p', { 'class': 'hw-ask', text: 'Tap the ' + SCRIPT[e.s] + ' for “' + e.r + '”.' })]; },
        options: shuffle(members).map(function (o) { return { label: o.k, value: o.k, ja: true }; }), correct: e.k, audio: e.k };
    }
    var opts = [];
    members.forEach(function (o) { if (!opts.some(function (r) { return sameReading(r, o.r); })) opts.push(o.r); });
    if (opts.length < 2) return null;
    return { chars: [e.k], label: e.k + ' · ' + e.r,
      prompt: function () { return [el('p', { 'class': 'hw-ask', text: 'What is the reading?' }), el('div', { 'class': 'hw-big', lang: 'ja', text: e.k })]; },
      options: shuffle(opts).map(function (r) { return { label: r, value: r }; }), correct: e.r, audio: e.k };
  }
  function wordChars(w) { return Array.from(w).filter(function (c) { return BY[c]; }); }
  function qWord(w, words, mode) {
    var listen = mode === 'listen' && ctx.canSay(w.k);
    if (listen) {
      var others = words.filter(function (o) { return o.k !== w.k; }).sort(function (a, b) { return Math.abs(a.k.length - w.k.length) - Math.abs(b.k.length - w.k.length); });
      var opts = [w].concat(pick(others.slice(0, 8), 3));
      return { chars: wordChars(w.k), word: w, label: w.k + ' · ' + w.r + ' · ' + w.m, autoplay: w.k,
        prompt: function () { return [el('p', { 'class': 'hw-ask', text: 'Listen. Which word do you hear?' }), listenBtn(w.k)]; },
        options: shuffle(opts).map(function (o) { return { label: o.k, value: o.k, ja: true }; }), correct: w.k, audio: w.k };
    }
    return { chars: wordChars(w.k), word: w, label: w.k + ' · ' + w.r + ' · ' + w.m,
      prompt: function () { return [el('p', { 'class': 'hw-ask', text: 'Read it, then type the reading.' }), el('div', { 'class': 'hw-big hw-word', lang: 'ja', text: w.k })]; },
      type: true, check: function (v) { return sameReading(v, w.r); }, answer: w.r, audio: w.k };
  }
  function listenBtn(text) {
    return el('button', { type: 'button', 'class': 'btn kt-listen', text: '▶ Listen again', onclick: function () { ctx.speak(text); } });
  }

  // ---------- one test ----------
  function build(cfg, rows) {
    if (!data()) return el('p', { 'class': 'hw-error', text: 'The kana data could not be loaded.' });
    var kind = cfg.kind || 'read', level = cfg.level || 'basic', count = +cfg.count || 20, mode = cfg.mode || 'choose';
    var words = rows.filter(function (r) { return r.length >= 3; }).map(function (r) { return { k: r[0], r: r[1], m: r[2] }; });
    var root = el('section', { 'class': 'hw kt' });
    root.appendChild(el('div', { 'class': 'hw-head' }, [el('p', { 'class': 'hw-kicker', text: cfg.title || 'Test' }), cfg.desc ? el('p', { 'class': 'hw-desc', text: cfg.desc }) : null]));
    var body = el('div', { 'class': 'kt-body' });
    root.appendChild(body);
    function start() {
      if (kind === 'twins') return runTwins();
      var qs = makeQuestions();
      if (!qs.length) { body.replaceChildren(el('p', { 'class': 'hw-note', text: 'This test needs sound, and no recording or Japanese voice is available on this device.' })); return; }
      runQuiz(qs);
    }
    function makeQuestions() {
      var p = pool(level), qs = [];
      if (kind === 'read') qs = pick(p, count).map(function (e) { return qRead(e, mode); });
      else if (kind === 'listen') qs = pick(p.filter(function (e) { return ctx.canSay(e.k); }), count).map(qListen);
      else if (kind === 'lookalike') { for (var i = 0; qs.length < count && i < count * 4; i++) { var q = qLook(LOOKALIKE[i % LOOKALIKE.length]); if (q) qs.push(q); } qs = shuffle(qs); }
      else if (kind === 'words') qs = pick(words, count).map(function (w) { return qWord(w, words, mode === 'listen' ? 'listen' : mode === 'mix' && Math.random() < 0.4 ? 'listen' : 'type'); });
      else if (kind === 'exam') {
        var all = pool('all'), n = count;
        var nw = words.length ? Math.round(n * 0.25) : 0, nlook = Math.round(n * 0.15), nlisten = Math.round(n * 0.15);
        qs = pick(all, n - nw - nlook - nlisten).map(function (e) { return qRead(e, 'mix'); })
          .concat(pick(all.filter(function (e) { return ctx.canSay(e.k); }), nlisten).map(qListen))
          .concat(pick(LOOKALIKE, nlook).map(qLook).filter(Boolean))
          .concat(pick(words, nw).map(function (w) { return qWord(w, words, Math.random() < 0.3 ? 'listen' : 'type'); }));
        qs = shuffle(qs);
      }
      return qs;
    }
    // ---- multiple choice and typed questions ----
    function runQuiz(qs) {
      var pos = 0, results = [];
      var bar = el('span'), status = el('p', { 'class': 'hw-status' }), stage = el('div', { 'class': 'hw-stage' }), fb = el('div', { 'class': 'hw-feedback', 'aria-live': 'polite' });
      body.replaceChildren(el('div', { 'class': 'hw-progress' }, [bar]), status, stage, fb);
      function show() {
        if (pos >= qs.length) return report(results);
        var q = qs[pos];
        bar.style.width = (100 * pos / qs.length) + '%';
        status.textContent = 'Question ' + (pos + 1) + ' of ' + qs.length;
        fb.className = 'hw-feedback'; fb.replaceChildren();
        var nodes = q.prompt(), answered = false;
        function done(ok, given) {
          if (answered) return; answered = true;
          results.push({ q: q, ok: ok });
          fb.className = 'hw-feedback ' + (ok ? 'ok' : 'bad');
          fb.replaceChildren(el('p', { 'class': 'hw-fb-head' }, [ok ? '✓ Right: ' : '✗ ' + (given ? 'Not ' + given + '. ' : '') + 'It is ', el('span', { lang: 'ja', text: q.label })]),
            el('div', { 'class': 'hw-actions' }, [el('button', { type: 'button', 'class': 'btn primary', text: pos + 1 < qs.length ? 'Next' : 'See results', onclick: next })]));
          if (q.audio && !q.autoplay) ctx.speak(q.audio);
          if (ok) setTimeout(function () { if (cur === pos) next(); }, 900);
          var nb = fb.querySelector('.btn'); if (nb && !ok) nb.focus();
        }
        var cur = pos;
        function next() { if (cur !== pos) return; pos++; show(); }
        if (q.type) {
          var input = el('input', { type: 'text', 'class': 'hw-input', autocomplete: 'off', autocapitalize: 'off', spellcheck: 'false', placeholder: 'type the reading…', 'aria-label': 'Reading in romaji' });
          var form = el('form', { 'class': 'hw-typeform', onsubmit: function (ev) { ev.preventDefault(); if (!input.value.trim()) return; input.disabled = true; done(q.check(input.value), input.value.trim()); } },
            [input, el('button', { type: 'submit', 'class': 'btn primary', text: 'Check' })]);
          nodes.push(form, el('p', { 'class': 'hw-note' }, [el('button', { type: 'button', 'class': 'link-btn', text: 'I don’t know', onclick: function () { input.disabled = true; done(false); } })]));
          stage.replaceChildren.apply(stage, nodes);
          input.focus({ preventScroll: true });
        } else {
          var opts = el('div', { 'class': 'hw-options' }, q.options.map(function (o) {
            var b = el('button', { type: 'button', 'class': 'hw-opt', lang: o.ja ? 'ja' : null, text: o.label });
            if (!o.ja) b.removeAttribute('lang');
            b.addEventListener('click', function () {
              if (answered) return;
              var ok = o.value === q.correct;
              opts.querySelectorAll('.hw-opt').forEach(function (x) { x.disabled = true; if (x.textContent === (q.options.filter(function (y) { return y.value === q.correct; })[0] || {}).label) x.classList.add('is-right'); });
              if (!ok) b.classList.add('is-wrong');
              done(ok, o.label);
            });
            return b;
          }));
          nodes.push(opts);
          stage.replaceChildren.apply(stage, nodes);
        }
        if (q.autoplay) ctx.speak(q.autoplay);
      }
      show();
    }
    // ---- twin pairs: match each hiragana with its katakana ----
    function runTwins() {
      var boards = +cfg.count || 4, size = +cfg.size || 6, board = 0, results = [];
      var p = pool(level).filter(function (e) { return e.s === 'h' && BY[twin(e.k)]; });
      var status = el('p', { 'class': 'hw-status' }), grid = el('div', { 'class': 'kt-twins' }), fb = el('p', { 'class': 'hw-note kt-twin-note', 'aria-live': 'polite' });
      body.replaceChildren(el('p', { 'class': 'hw-ask', text: 'Tap a hiragana, then the katakana with the same sound.' }), status, grid, fb);
      var used = {};
      function next() {
        if (board >= boards) return report(results);
        var fresh = p.filter(function (e) { return !used[e.k]; }); if (fresh.length < size) { used = {}; fresh = p; }
        var set = pick(fresh, size); set.forEach(function (e) { used[e.k] = 1; });
        status.textContent = 'Board ' + (board + 1) + ' of ' + boards;
        var left = shuffle(set), right = shuffle(set), sel = null, left2 = size, miss = {};
        function tile(e, side) {
          var ch = side === 'h' ? e.k : twin(e.k);
          var b = el('button', { type: 'button', 'class': 'kt-tile', lang: 'ja', text: ch, 'data-k': e.k });
          b.addEventListener('click', function () {
            if (b.classList.contains('done')) return;
            if (side === 'h') { grid.querySelectorAll('.kt-tile.sel').forEach(function (x) { x.classList.remove('sel'); }); sel = e; b.classList.add('sel'); return; }
            if (!sel) { fb.textContent = 'First tap a hiragana on the left.'; return; }
            var hb = grid.querySelector('.kt-col-h .sel');
            if (sel.k === e.k) {
              [hb, b].forEach(function (x) { x.classList.remove('sel'); x.classList.add('done'); x.disabled = true; });
              results.push({ q: { chars: [e.k, twin(e.k)], label: e.k + ' ' + twin(e.k) + ' · ' + e.r }, ok: !miss[e.k] });
              fb.textContent = '✓ ' + e.k + ' = ' + twin(e.k) + ' (' + e.r + ')';
              ctx.speak(e.k);
              sel = null;
              if (--left2 === 0) { board++; setTimeout(next, 700); }
            } else {
              miss[sel.k] = 1; miss[e.k] = 1;
              b.classList.add('wrong'); setTimeout(function () { b.classList.remove('wrong'); }, 500);
              fb.textContent = '✗ ' + twin(e.k) + ' is ' + e.r + ', not ' + sel.r + '.';
            }
          });
          return b;
        }
        grid.replaceChildren(el('div', { 'class': 'kt-col kt-col-h' }, left.map(function (e) { return tile(e, 'h'); })), el('div', { 'class': 'kt-col kt-col-k' }, right.map(function (e) { return tile(e, 'k'); })));
        fb.textContent = '';
      }
      next();
    }
    // ---- results ----
    function report(results) {
      var right = results.filter(function (r) { return r.ok; }).length, total = results.length, stats = {};
      results.forEach(function (r) {
        r.q.chars.forEach(function (c) { var s = stats[c] = stats[c] || { n: 0, ok: 0 }; s.n++; if (r.ok) s.ok++; });
      });
      var pct = total ? Math.round(100 * right / total) : 0;
      var tested = Object.keys(stats).filter(function (c) { return BY[c]; });
      function cell(c) {
        var s = stats[c], cls = !s ? 'none' : s.ok === s.n ? 'good' : s.ok === 0 ? 'bad' : 'mid';
        return el('span', { 'class': 'kt-cell ' + cls, lang: 'ja', title: (BY[c] ? BY[c].r : '') + (s ? ' · ' + s.ok + '/' + s.n : ' · not tested'), text: c });
      }
      var hGrid = el('div', { 'class': 'kt-grid' }, tested.filter(function (c) { return BY[c].s === 'h'; }).sort(order).map(cell));
      var kGrid = el('div', { 'class': 'kt-grid' }, tested.filter(function (c) { return BY[c].s === 'k'; }).sort(order).map(cell));
      var weak = tested.filter(function (c) { return stats[c].ok < stats[c].n; }).sort(function (a, b) { return stats[a].ok / stats[a].n - stats[b].ok / stats[b].n; });
      var missedWords = results.filter(function (r) { return !r.ok && r.q.word; }).map(function (r) { return r.q.word; });
      var nodes = [
        el('p', { 'class': 'hw-win', text: right + ' of ' + total + ' right (' + pct + '%)' + (pct === 100 ? ' 🎉' : '') }),
        el('div', { 'class': 'kt-report' }, [
          hGrid.childNodes.length ? el('div', {}, [el('p', { 'class': 'kt-grid-head', text: 'Hiragana' }), hGrid]) : null,
          kGrid.childNodes.length ? el('div', {}, [el('p', { 'class': 'kt-grid-head', text: 'Katakana' }), kGrid]) : null]),
        el('p', { 'class': 'hw-legend kt-legend' }, [el('span', { 'class': 'kt-cell good', text: '' }), ' all right ', el('span', { 'class': 'kt-cell mid', text: '' }), ' some wrong ', el('span', { 'class': 'kt-cell bad', text: '' }), ' all wrong'])
      ];
      if (weak.length) {
        nodes.push(el('p', { 'class': 'kt-weak-head', text: 'Weakest characters, and where to revise them:' }));
        nodes.push(el('ul', { 'class': 'kt-weak' }, weak.slice(0, 12).map(function (c) {
          var e = BY[c], unit = (e.s === 'h' ? 'hiragana-' : 'katakana-') + e.unit;
          return el('li', {}, [el('span', { 'class': 'kt-weak-k', lang: 'ja', text: c }), ' ' + e.r + ' · ' + stats[c].ok + '/' + stats[c].n + ' · ',
            el('a', { href: '#/' + unit, text: SCRIPT[e.s].replace(/^./, function (x) { return x.toUpperCase(); }) + ' unit ' + e.unit })]);
        })));
      } else if (total) nodes.push(el('p', { 'class': 'hw-note', text: 'No weak characters in this test.' }));
      if (missedWords.length) nodes.push(el('p', { 'class': 'hw-note' }, ['Words to read again: ', el('span', { lang: 'ja', text: missedWords.map(function (w) { return w.k + ' (' + w.r + ')'; }).join('、') })]));
      nodes.push(el('div', { 'class': 'hw-actions' }, [el('button', { type: 'button', 'class': 'btn primary', text: 'Take the test again', onclick: start })]));
      body.replaceChildren.apply(body, nodes);
    }
    function order(a, b) { return ALL.indexOf(BY[a]) - ALL.indexOf(BY[b]); }
    body.appendChild(el('div', { 'class': 'hw-actions' }, [el('button', { type: 'button', 'class': 'btn primary', text: 'Start the test', onclick: start })]));
    return root;
  }

  function parse(text) {
    var cfg = {}, rows = [];
    text.split('\n').forEach(function (line) {
      line = line.trim();
      if (!line || line.charAt(0) === '#') return;
      var m = line.match(/^([a-z]+):\s*(.*)$/);
      if (m && line.indexOf('|') < 0) cfg[m[1]] = m[2];
      else rows.push(line.split('|').map(function (s) { return s.trim(); }));
    });
    return { cfg: cfg, rows: rows };
  }
  window.NBKanaTest = {
    init: function (api) { Object.keys(api).forEach(function (k) { ctx[k] = api[k]; }); },
    mount: function (article) {
      article.querySelectorAll('pre > code.language-kanatest').forEach(function (code) {
        var node;
        try { var p = parse(code.textContent); node = build(p.cfg, p.rows); }
        catch (err) { node = el('p', { 'class': 'hw-error', text: 'This test could not be loaded (' + err.message + ').' }); }
        code.parentNode.replaceWith(node);
      });
    },
    _test: { twin: twin, pool: function (l) { data(); return pool(l); }, LOOKALIKE: LOOKALIKE }
  };
})();
