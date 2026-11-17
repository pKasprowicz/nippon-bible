/* Interactive exercises for the kana courses (hiragana and katakana).
   Lessons embed exercises as fenced code blocks (```practice, ```words, ```quiz, …);
   NBKana.mount() turns them into widgets after the Markdown is rendered.
   One engine instance runs per script, each with its own data and saved progress. */
(function () {
  'use strict';
  var DAY = 86400000;
  var INTERVAL_DAYS = [0, 1, 2, 4, 8, 16, 32]; // Leitner box → days until the next review
  var MASTERED_BOX = 5;
  var ctx = { speak: function () {}, toast: function () {}, markDone: function () {} };

  // D: the script's data (window.NB_KANA or window.NB_KATA); STORE: its localStorage key.
  function createEngine(D, STORE) {

    /* ---------- state (best effort; the course works without storage) ---------- */
    function loadState() {
      var s;
      try { s = JSON.parse(localStorage.getItem(STORE) || 'null'); } catch (e) { s = null; }
      s = s || {};
      s.srs = s.srs || {}; s.best = s.best || {}; s.days = s.days || [];
      return s;
    }
    function saveState(s) { s.v = 2; try { localStorage.setItem(STORE, JSON.stringify(s)); } catch (e) { /* ignore */ } }
    function today() { var d = new Date(); return d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate(); }
    function markPractised(s) { if (s.days.indexOf(today()) < 0) { s.days.push(today()); s.days = s.days.slice(-400); } }
    function streak(s) {
      var n = 0, d = new Date();
      if (s.days.indexOf(today()) < 0) d.setDate(d.getDate() - 1); // today not done yet: count up to yesterday
      for (;;) {
        var key = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
        if (s.days.indexOf(key) < 0) return n;
        n++; d.setDate(d.getDate() - 1);
      }
    }

    /* ---------- small helpers ---------- */
    function el(tag, attrs, children) {
      var node = document.createElement(tag);
      Object.keys(attrs || {}).forEach(function (k) {
        var v = attrs[k];
        if (v === null || v === undefined || v === false) return;
        if (k === 'text') node.textContent = v;
        else if (k === 'html') node.innerHTML = v;
        else if (k.slice(0, 2) === 'on') node.addEventListener(k.slice(2), v);
        else node.setAttribute(k, v === true ? '' : v);
      });
      (children || []).forEach(function (c) { if (c) node.appendChild(typeof c === 'string' ? document.createTextNode(c) : c); });
      return node;
    }
    function shuffle(a) {
      a = a.slice();
      for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; }
      return a;
    }
    function pick(a) { return a[Math.floor(Math.random() * a.length)]; }
    function uniq(a) { return a.filter(function (x, i) { return a.indexOf(x) === i; }); }

    // Small characters that merge with the one before: きょ, ショ, ティ, ファ…
    var SMALL_Y = 'ゃゅょャュョァィゥェォ';
    function isPause(u) { return u === 'っ' || u === 'ッ'; }
    // Split a string of kana into reading units: きょ / ティ stay together, spaces are ignored.
    function splitKana(str) {
      var chars = Array.from((str || '').replace(/[\s,、・]/g, '')), out = [];
      chars.forEach(function (c) {
        if (SMALL_Y.indexOf(c) >= 0 && out.length) out[out.length - 1] += c;
        else out.push(c);
      });
      return out;
    }
    function info(k) { return D.byChar[k]; }

    // Kana → reading parts, for hints ("こ ko · ん n · に ni …").
    function parts(word) {
      var units = splitKana(word), res = [];
      units.forEach(function (u, i) {
        if (isPause(u)) { res.push({ k: u, r: '(pause)' }); return; }
        if (u === 'ー') { res.push({ k: u, r: '(long)' }); return; }
        var e = info(u);
        res.push({ k: u, r: e ? e.r : '?' });
        if (i > 0 && isPause(units[i - 1]) && e) res[res.length - 2].r = '(pause: ' + (e.r[0] === 'c' ? 't' : e.r[0]) + ')';
      });
      return res;
    }
    function literalRomaji(word) {
      var units = splitKana(word), out = '';
      units.forEach(function (u, i) {
        if (isPause(u)) return;
        if (u === 'ー') { var v = out.match(/[aiueo]$/); out += v ? v[0] : ''; return; }
        var e = info(u);
        var r = e ? e.r : '';
        if (i > 0 && isPause(units[i - 1])) r = (r[0] === 'c' ? 't' : r[0]) + r;
        out += r;
      });
      return out;
    }

    // Normalise romaji so that Hepburn, Kunrei and IME-style spellings compare equal.
    // Loose mode also forgives long vowels (tokyo = toukyou = tōkyō).
    function norm(s, loose) {
      s = String(s || '').toLowerCase();
      s = s.replace(/[āâ]/g, 'aa').replace(/[īî]/g, 'ii').replace(/[ūû]/g, 'uu').replace(/[ēê]/g, 'ee').replace(/[ōô]/g, 'ou');
      s = s.replace(/[^a-z]/g, '');
      s = s.replace(/sy([auo])/g, 'sh$1').replace(/[tc]y([auo])/g, 'ch$1').replace(/[zjd]y([auo])/g, 'j$1')
        .replace(/si/g, 'shi').replace(/ti/g, 'chi').replace(/tu/g, 'tsu').replace(/(^|[^cs])hu/g, '$1fu')
        .replace(/zi|di/g, 'ji').replace(/du/g, 'zu').replace(/wo/g, 'o').replace(/cch/g, 'tch')
        .replace(/m(?=[bpm])/g, 'n');
      if (loose) s = s.replace(/ou/g, 'o').replace(/([aiueo])\1+/g, '$1');
      return s;
    }
    function hasJaVoice() {
      if (!('speechSynthesis' in window)) return false;
      return speechSynthesis.getVoices().some(function (v) { return /^ja/i.test(v.lang); });
    }

    /* ---------- spaced repetition ---------- */
    function enroll(items) {
      var s = loadState(), added = 0;
      items.forEach(function (it) {
        if (s.srs[it.id]) return;
        // last: when this item last changed. Progress transfer uses it to keep the newer copy.
        s.srs[it.id] = { t: it.t, k: it.k, r: it.r, m: it.m || '', box: 1, due: Date.now() + DAY, n: 0, lapses: 0, last: Date.now() };
        added++;
      });
      markPractised(s);
      saveState(s);
      return added;
    }
    function grade(id, ok, lapsedThisSession) {
      var s = loadState(), it = s.srs[id];
      if (!it) return;
      it.n++;
      it.last = Date.now();
      if (!ok) { it.box = 1; it.lapses++; it.due = Date.now(); }
      else if (lapsedThisSession) { it.due = Date.now() + DAY; }
      else { it.box = Math.min(INTERVAL_DAYS.length - 1, it.box + 1); it.due = Date.now() + INTERVAL_DAYS[it.box] * DAY; }
      saveState(s);
    }
    function kanaItem(k) { var e = info(k); return { id: 'k:' + k, t: 'k', k: k, r: e.r }; }

    /* ---------- the session runner shared by every exercise ---------- */
    // A question: { id, prompt(): Node, options: [{label, value, lang}], check(input) → {ok, note},
    //   answerLabel, explain: Node|string, audio: text to play when shown, audioOnCorrect }
    function runSession(root, opts) {
      var queue = opts.questions.slice(), pos = 0, firstTry = {}, missed = [], lapsed = {};
      var asked = 0, right = 0, timerEnd = opts.timer ? Date.now() + opts.timer * 1000 : 0, timerId = null;
      var stage = el('div', { 'class': 'hw-stage', tabindex: '-1' });
      var bar = el('div', { 'class': 'hw-progress', role: 'progressbar', 'aria-valuemin': '0' }, [el('span')]);
      var status = el('div', { 'class': 'hw-status' });
      root.replaceChildren(bar, status, stage);
      var current = null, answered = false, onKey = null, stopped = false, shownAt = 0;
      if (opts.endless) bar.hidden = true;
      // Characters in the last few queued questions, so new picks don't repeat them back to back.
      function tail() { return queue.slice(Math.max(pos, queue.length - 3)).map(function (q) { return q.k; }); }

      function updateStatus() {
        if (opts.endless) { status.textContent = opts.statusText ? opts.statusText() : ''; return; }
        var total = opts.timer ? null : queue.length;
        var label = opts.timer
          ? Math.max(0, Math.ceil((timerEnd - Date.now()) / 1000)) + ' s left · ' + right + ' correct'
          : 'Question ' + Math.min(pos + 1, total) + ' of ' + total + ' · ' + right + ' correct';
        status.textContent = label;
        var pct = opts.timer ? 100 * (1 - (timerEnd - Date.now()) / (opts.timer * 1000)) : 100 * pos / total;
        bar.firstChild.style.width = Math.max(0, Math.min(100, pct)) + '%';
        bar.setAttribute('aria-valuenow', String(Math.round(pct)));
        bar.setAttribute('aria-valuemax', '100');
      }
      function finish() {
        if (stopped) return;
        stopped = true;
        if (timerId) clearInterval(timerId);
        stage.removeEventListener('keydown', onKey);
        var uniqueAsked = Object.keys(firstTry);
        var firstOk = uniqueAsked.filter(function (id) { return firstTry[id]; }).length;
        opts.onDone({ asked: asked, right: right, unique: uniqueAsked.length, firstOk: firstOk,
          score: uniqueAsked.length ? firstOk / uniqueAsked.length : 0, missed: uniq(missed), lapsed: lapsed });
      }
      function next() {
        if (stopped) return;
        if (opts.timer && Date.now() >= timerEnd) { finish(); return; }
        if (opts.timer && pos >= queue.length) queue.push(opts.more());
        // Endless mode keeps a few questions queued so a missed item can come back 3–4 questions later.
        while (opts.endless && queue.length < pos + 4) queue.push(opts.more(tail()));
        if (pos >= queue.length) { finish(); return; }
        current = queue[pos]; answered = false;
        render(current);
        updateStatus();
      }
      function respond(input, chosenLabel) {
        if (answered) return;
        answered = true; asked++;
        var res = current.check(input);
        if (firstTry[current.id] === undefined) firstTry[current.id] = res.ok;
        if (res.ok) right++;
        else { missed.push(current); lapsed[current.id] = true; }
        if (opts.onAnswer) opts.onAnswer(current, res.ok, !!lapsed[current.id], performance.now() - shownAt);
        if (!res.ok && !opts.timer) {
          // Re-ask a missed item a few questions later (in-session spacing).
          var again = Object.assign({}, current, { retry: true });
          var at = Math.min(queue.length, pos + 3 + Math.floor(Math.random() * 2));
          var same = function (q) { return q && q.k && q.k === current.k; };
          if (opts.endless) while (queue.length < at + 2) queue.push(opts.more(tail()));
          while (at < queue.length && (same(queue[at - 1]) || same(queue[at]))) at++;
          if (at === queue.length && same(queue[at - 1]) && opts.endless) queue.push(opts.more(tail()));
          queue.splice(Math.min(at, queue.length), 0, again);
        }
        showFeedback(res, chosenLabel);
        updateStatus();
      }
      function showFeedback(res, chosenLabel) {
        var fb = stage.querySelector('.hw-feedback');
        stage.querySelectorAll('.hw-opt').forEach(function (b) {
          b.disabled = true;
          if (b.getAttribute('data-value') === String(current.answerValue)) b.classList.add('is-right');
          else if (b.getAttribute('data-chosen')) b.classList.add('is-wrong');
        });
        var input = stage.querySelector('.hw-input');
        if (input) { input.disabled = true; input.classList.add(res.ok ? 'is-right' : 'is-wrong'); }
        fb.className = 'hw-feedback ' + (res.ok ? 'ok' : 'bad');
        var head = el('p', { 'class': 'hw-fb-head' }, [
          el('strong', { text: res.ok ? (res.note ? '✓ Correct, with a note' : '✓ Correct') : '✗ Not quite' }), ' ',
          el('span', { 'class': 'hw-answer', html: current.answerLabel })
        ]);
        fb.replaceChildren(head);
        if (res.note) fb.appendChild(el('p', { 'class': 'hw-note', text: res.note }));
        if (!res.ok && chosenLabel) fb.appendChild(el('p', { 'class': 'hw-note', html: 'You chose ' + chosenLabel + '.' }));
        if (current.explain && (!res.ok || current.explainAlways)) {
          var ex = typeof current.explain === 'function' ? current.explain(res) : current.explain;
          fb.appendChild(typeof ex === 'string' ? el('p', { 'class': 'hw-explain', text: ex }) : ex);
        }
        if (current.audioOnCorrect !== false && current.audio) ctx.speak(current.audio);
        if (res.ok && !opts.timer && !current.pauseOnCorrect) {
          setTimeout(function () { if (answered && queue[pos] === current) { pos++; next(); } }, opts.advanceMs || (opts.fast ? 450 : 1100));
        } else if (opts.timer) {
          setTimeout(function () { pos++; next(); }, res.ok ? 250 : 900);
        } else {
          var cont = el('button', { 'class': 'btn primary hw-continue', type: 'button', text: 'Continue →', onclick: function () { pos++; next(); } });
          fb.appendChild(el('div', { 'class': 'hw-actions' }, [cont]));
          cont.focus({ preventScroll: true });
        }
      }
      function render(q) {
        var promptBox = el('div', { 'class': 'hw-prompt' }, [q.prompt()]);
        var answerBox;
        if (q.options) {
          answerBox = el('div', { 'class': 'hw-options' + (q.options.length > 4 ? ' many' : '') }, q.options.map(function (o, i) {
            var b = el('button', { 'class': 'hw-opt', type: 'button', 'data-value': String(o.value), lang: o.lang || null }, [
              el('span', { 'class': 'hw-key', 'aria-hidden': 'true', text: String(i + 1) }), el('span', { 'class': 'hw-opt-label', text: o.label })
            ]);
            b.addEventListener('click', function () { b.setAttribute('data-chosen', '1'); respond(o.value, o.chosenLabel || o.label); });
            return b;
          }));
        } else {
          var input = el('input', { 'class': 'hw-input', type: 'text', autocomplete: 'off', autocapitalize: 'off', spellcheck: 'false',
            inputmode: 'latin', 'aria-label': 'Type the reading in Latin letters', placeholder: q.placeholder || 'type the reading…' });
          var form = el('form', { 'class': 'hw-typeform' }, [input, el('button', { 'class': 'btn primary', type: 'submit', text: 'Check' })]);
          form.addEventListener('submit', function (e) { e.preventDefault(); if (input.value.trim()) respond(input.value); });
          var extra = el('div', { 'class': 'hw-typeextra' });
          if (q.hint) extra.appendChild(el('button', { 'class': 'hw-link', type: 'button', text: 'Hint', onclick: function (e) {
            q.usedHint = true; e.target.replaceWith(el('span', { 'class': 'hw-hint', html: q.hint() })); input.focus({ preventScroll: true });
          } }));
          extra.appendChild(el('button', { 'class': 'hw-link', type: 'button', text: 'I don\'t know', onclick: function () { respond('\u0000'); } }));
          answerBox = el('div', {}, [form, extra]);
        }
        stage.replaceChildren(promptBox, answerBox, el('div', { 'class': 'hw-feedback', 'aria-live': 'polite' }));
        shownAt = performance.now();
        if (q.audio && q.autoplay) setTimeout(function () { ctx.speak(q.audio); }, 150);
        var focusTarget = stage.querySelector('.hw-input') || stage;
        focusTarget.focus({ preventScroll: true });
      }
      onKey = function (e) {
        if (e.target.classList && e.target.classList.contains('hw-input') && !answered) return;
        if (!answered && current && current.options && /^[1-9]$/.test(e.key)) {
          var b = stage.querySelectorAll('.hw-opt')[Number(e.key) - 1];
          if (b) { e.preventDefault(); b.click(); }
        } else if (!answered && current && current.audio && (e.key === 'r' || e.key === 'R')) {
          ctx.speak(current.audio);
        } else if (answered && e.key === 'Enter') {
          var c = stage.querySelector('.hw-continue');
          if (c) { e.preventDefault(); c.click(); }
        }
      };
      stage.addEventListener('keydown', onKey);
      var box = root.closest('.hw') || root;
      var r = box.getBoundingClientRect();
      if (r.top < 120 || r.top > window.innerHeight * 0.45) {
        box.scrollIntoView({ block: 'start', behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
      }
      if (opts.timer) timerId = setInterval(function () { updateStatus(); if (Date.now() >= timerEnd && !answered) finish(); }, 250);
      next();
      return { stop: finish };
    }

    /* ---------- question builders ---------- */
    function kanaOptions(entry, pool, field) {
      // Look-alikes first (that's where reading errors come from), then other characters in play.
      // Only use look-alikes the learner has already met in this exercise's units.
      var maxUnit = Math.max.apply(null, pool.map(function (k) { var e = info(k); return e ? e.unit : 1; }));
      var cands = shuffle(entry.look.filter(function (k) { return info(k) && info(k).unit <= maxUnit; })).slice(0, 2)
        .concat(shuffle(pool.filter(function (k) { return k !== entry.k; })));
      var chosen = [entry], seen = {};
      seen[entry.r] = true; seen[entry.k] = true;
      cands.forEach(function (k) {
        var e = info(k);
        // Never offer two options with the same reading (お/を are both "o", じ/ぢ both "ji").
        if (!e || chosen.length >= 4 || seen[e.k] || seen[e.r]) return;
        seen[e.k] = true; seen[e.r] = true; chosen.push(e);
      });
      return shuffle(chosen).map(function (e) {
        return field === 'r'
          ? { label: e.r, value: e.k, chosenLabel: e.r + ' (' + e.k + ')' }
          : { label: e.k, value: e.k, lang: 'ja', chosenLabel: e.k + ' (' + e.r + ')' };
      });
    }
    function mnemonicNode(k, chosen) {
      var e = info(k), box = el('div', { 'class': 'hw-explain' });
      box.appendChild(el('p', {}, [el('span', { 'class': 'hw-mini-kana', lang: 'ja', text: e.k }), ' ', el('strong', { text: e.r }), ' · ' + e.m]));
      var c = chosen && info(chosen);
      if (c && c.k !== e.k) box.appendChild(el('p', {}, [el('span', { 'class': 'hw-mini-kana', lang: 'ja', text: c.k }), ' ', el('strong', { text: c.r }), ' · ' + c.m]));
      return box;
    }
    function bigKana(k) { return el('div', { 'class': 'hw-big', lang: 'ja', text: k }); }
    function listenButton(text, label) {
      return el('button', { 'class': 'hw-listen', type: 'button', 'aria-label': 'Play the sound again', onclick: function () { ctx.speak(text); } },
        [el('span', { 'aria-hidden': 'true', text: '🔊' }), ' ', label || 'Play again (R)']);
    }
    function kanaQuestion(k, mode, pool) {
      var e = info(k);
      if (mode === 'listen' && !hasJaVoice()) mode = 'pick';
      var q = { id: 'k:' + k, k: k, answerValue: k, audio: k, answerLabel: '<span lang="ja">' + k + '</span> = ' + e.r };
      q.explain = function () { return mnemonicNode(k, q.lastChoice); };
      if (mode === 'see') {
        q.prompt = function () { return el('div', {}, [el('p', { 'class': 'hw-ask', text: 'How do you read this?' }), bigKana(k)]); };
        q.options = kanaOptions(e, pool, 'r');
      } else if (mode === 'pick') {
        q.prompt = function () { return el('div', {}, [el('p', { 'class': 'hw-ask', text: 'Which character is this?' }), el('div', { 'class': 'hw-big hw-roman', text: e.r })]); };
        q.options = kanaOptions(e, pool, 'k');
        q.audioOnCorrect = true;
      } else if (mode === 'listen') {
        q.prompt = function () { return el('div', {}, [el('p', { 'class': 'hw-ask', text: 'Listen. Which character do you hear?' }), listenButton(k)]); };
        q.options = kanaOptions(e, pool, 'k');
        q.autoplay = true;
      } else { // type
        q.prompt = function () { return el('div', {}, [el('p', { 'class': 'hw-ask', text: 'Type the reading.' }), bigKana(k)]); };
        q.placeholder = 'e.g. ka';
      }
      q.check = function (v) {
        if (q.options) { q.lastChoice = v; return { ok: v === k }; }
        var plain = String(v).toLowerCase().replace(/[^a-z]/g, '');
        // Extra katakana sounds (ティ ti, ファ fa…) must be typed exactly: "chi" is チ, not ティ.
        var ok = e.set === 'extended' ? plain === e.r
          : norm(v) === norm(e.r) || ((k === 'ん' || k === 'ン') && /^n+$/.test(plain));
        return { ok: ok };
      };
      return q;
    }
    function wordQuestion(w, mode, all) {
      var q = { id: 'w:' + w.k, answerValue: w.k, audio: w.k, pauseOnCorrect: true,
        answerLabel: '<span lang="ja">' + w.k + '</span> = <strong>' + w.r + '</strong> · ' + w.m, explainAlways: false };
      if (mode === 'meaning') {
        // Loanwords: sound the word out, then recognise the meaning.
        q.prompt = function () {
          return el('div', {}, [el('p', { 'class': 'hw-ask', text: 'Sound it out. What does it mean?' }), el('div', { 'class': 'hw-big hw-word', lang: 'ja', text: w.k })]);
        };
        var pool = shuffle(all.filter(function (o) { return o.k !== w.k && o.m !== w.m; }));
        q.options = shuffle([w].concat(pool.slice(0, 3))).map(function (o) { return { label: o.m, value: o.k, chosenLabel: o.m + ' (' + o.k + ')' }; });
        q.check = function (v) { return { ok: v === w.k }; };
        q.answerLabel = '<span lang="ja">' + w.k + '</span> · <strong>' + w.r + '</strong> = ' + w.m;
        q.explain = function () { return el('p', { 'class': 'hw-explain', html: 'Character by character: ' + parts(w.k).map(function (p) { return '<span lang="ja">' + p.k + '</span>&nbsp;' + p.r; }).join(' · ') }); };
        q.pauseOnCorrect = false;
        return q;
      }
      if (mode === 'listen' && hasJaVoice()) {
        q.prompt = function () { return el('div', {}, [el('p', { 'class': 'hw-ask', text: 'Listen. Which word do you hear?' }), listenButton(w.k)]); };
        var others = shuffle(all.filter(function (o) { return o.k !== w.k; }));
        // Prefer words of similar length: those are the hard, useful contrasts.
        others.sort(function (a, b) { return Math.abs(splitKana(a.k).length - splitKana(w.k).length) - Math.abs(splitKana(b.k).length - splitKana(w.k).length); });
        q.options = shuffle([w].concat(others.slice(0, 3))).map(function (o) { return { label: o.k, value: o.k, lang: 'ja', chosenLabel: o.k + ' (' + o.r + ')' }; });
        q.autoplay = true;
        q.check = function (v) { return { ok: v === w.k }; };
        q.pauseOnCorrect = false;
        return q;
      }
      q.prompt = function () {
        return el('div', {}, [
          el('p', { 'class': 'hw-ask', text: (w.context ? w.context + ' · ' : '') + 'Read it, then type what you read.' }),
          el('div', { 'class': 'hw-big hw-word', lang: 'ja', text: w.k })
        ]);
      };
      q.placeholder = 'type the reading…';
      q.hint = function () {
        return parts(w.k).map(function (p) { return '<span lang="ja">' + p.k + '</span>&nbsp;' + p.r; }).join(' · ');
      };
      q.check = function (v) {
        if (v === '\u0000') return { ok: false };
        if (norm(v, true) === norm(w.r, true)) {
          var strict = norm(v) === norm(w.r);
          return { ok: true, note: strict ? null : 'Mind the long vowel or the double letter: ' + w.r + '.' };
        }
        if (norm(v, true) === norm(literalRomaji(w.k), true)) {
          return { ok: true, note: 'You read every character right. In this word it is pronounced ' + w.r + '.' };
        }
        return { ok: false };
      };
      q.explain = function () {
        return el('p', { 'class': 'hw-explain', html: 'Character by character: ' + q.hint() });
      };
      return q;
    }

    /* ---------- block parsing ---------- */
    function parseBlock(text) {
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

    function shell(title, desc, extraClass) {
      var root = el('section', { 'class': 'hw ' + (extraClass || '') });
      root.appendChild(el('div', { 'class': 'hw-head' }, [
        el('p', { 'class': 'hw-kicker', text: title }),
        desc ? el('p', { 'class': 'hw-desc', text: desc }) : null
      ]));
      var body = el('div', { 'class': 'hw-body' });
      root.appendChild(body);
      return { root: root, body: body };
    }
    function startScreen(body, label, onStart, extra) {
      var btn = el('button', { 'class': 'btn primary', type: 'button', text: label, onclick: onStart });
      body.replaceChildren(el('div', { 'class': 'hw-start' }, [btn].concat(extra || [])));
    }
    function scoreLine(res) {
      var pct = Math.round(res.score * 100);
      return el('p', { 'class': 'hw-score' }, [el('strong', { text: pct + '%' }), ' right first time (' + res.firstOk + ' of ' + res.unique + ' questions)']);
    }
    function missedList(res) {
      var ks = uniq(res.missed.map(function (q) { return q.k || q.answerValue; }));
      if (!ks.length) return null;
      return el('div', { 'class': 'hw-missed' }, [el('p', { text: 'To look at again:' })].concat(ks.map(function (k) {
        var e = info(k);
        return el('p', {}, [el('span', { 'class': 'hw-mini-kana', lang: 'ja', text: k }), ' ', el('strong', { text: e ? e.r : '' }), e ? ' · ' + e.m : '']);
      })));
    }

    /* ---------- widgets ---------- */
    var WIDGETS = {};

    // Character cards with memory aids: ```cards\nkana: かきくけこ
    WIDGETS.cards = function (block) {
      var ks = splitKana(block.cfg.kana);
      var root = el('div', { 'class': 'hw-cards' }, ks.map(function (k) {
        var e = info(k);
        return el('button', { 'class': 'hw-card', type: 'button', title: 'Listen', onclick: function () { ctx.speak(k); } }, [
          el('span', { 'class': 'hw-card-kana', lang: 'ja', text: k }),
          el('span', { 'class': 'hw-card-r', text: e.r }),
          el('span', { 'class': 'hw-card-m', text: e.m }),
          el('span', { 'class': 'hw-card-play', 'aria-hidden': 'true', text: '🔊' })
        ]);
      }));
      return root;
    };

    // Kana practice: ```practice\nkana: …\nmix: …\nmodes: see,pick,listen,type\ncount: 15\ntimer: 60\ncheckpoint: yes
    WIDGETS.practice = function (block, env) {
      var c = block.cfg;
      var targets = splitKana(c.kana), mix = splitKana(c.mix);
      var modes = (c.modes || 'see,pick,listen,type').split(',').map(function (s) { return s.trim(); });
      var timer = c.timer ? Number(c.timer) : 0;
      var count = Number(c.count) || Math.max(10, Math.min(24, targets.length * 2 + Math.ceil(mix.length / 2)));
      var pool = targets.concat(mix);
      var labels = { see: 'read', pick: 'find', listen: 'listen', type: 'type' };
      var title = c.title || (c.checkpoint ? 'Checkpoint' : timer ? 'Speed round' : 'Practice');
      var desc = c.checkpoint
        ? count + ' mixed questions, no hints. Score 90% or more to master this unit.'
        : timer ? 'As many as you can in ' + timer + ' seconds. Speed comes after accuracy: aim to beat your best.'
        : count + ' questions · ' + modes.map(function (m) { return labels[m] || m; }).join(' → ');
      var sh = shell(title, desc, c.checkpoint ? 'hw-checkpoint' : '');
      var bestKey = env.key;

      function build() {
        var seq = [];
        targets.forEach(function (k) { seq.push(k); });
        if (count >= targets.length * 2) targets.forEach(function (k) { seq.push(k); });
        var restPool = mix.length ? mix.concat(targets) : targets;
        while (seq.length < count) seq.push(pick(restPool));
        seq = shuffle(seq.slice(0, Math.max(count, targets.length)));
        for (var i = 1; i < seq.length; i++) if (seq[i] === seq[i - 1]) { var j = (i + 2) % seq.length; var t = seq[i]; seq[i] = seq[j]; seq[j] = t; }
        // Difficulty rises through the session: recognition first, recall last.
        return seq.map(function (k, i) {
          var q = kanaQuestion(k, modes[Math.floor(i * modes.length / seq.length)], pool);
          q.id = q.id + '#' + i; // score every question, not just every character
          return q;
        });
      }
      function begin() {
        runSession(sh.body, {
          questions: timer ? [] : build(), timer: timer, fast: !!timer,
          more: function () { return kanaQuestion(pick(pool), pick(modes), pool); },
          onDone: function (res) {
            var s = loadState(), best = s.best[bestKey] || 0, value = timer ? res.right : res.score, isBest = value > best;
            if (isBest) s.best[bestKey] = value;
            markPractised(s); saveState(s);
            var added = enroll(targets.map(kanaItem));
            var out = [];
            if (timer) {
              out.push(el('p', { 'class': 'hw-score' }, [el('strong', { text: res.right + ' correct' }), ' in ' + timer + ' seconds' + (isBest ? ' (new best!)' : ' · best: ' + best)]));
            } else {
              out.push(scoreLine(res));
              if (c.checkpoint) {
                if (res.score >= 0.9) { out.push(el('p', { 'class': 'hw-win', text: '🎉 Unit mastered. Sleep on it, and do your daily review tomorrow.' })); ctx.markDone(env.pageKey); }
                else out.push(el('p', { 'class': 'hw-note', text: 'Not yet 90%. Re-read the memory aids of the characters below, wait a few minutes, then try again.' }));
              }
            }
            var m = missedList(res); if (m) out.push(m);
            if (added) out.push(el('p', { 'class': 'hw-note', text: added + ' character' + (added > 1 ? 's' : '') + ' added to your daily review.' }));
            out.push(el('div', { 'class': 'hw-actions' }, [el('button', { 'class': 'btn', type: 'button', text: 'Practise again', onclick: begin })]));
            sh.body.replaceChildren(el('div', { 'class': 'hw-result' }, out));
          }
        });
      }
      var s0 = loadState(), b0 = s0.best[bestKey];
      startScreen(sh.body, timer ? 'Start the clock' : 'Start', begin,
        b0 ? [el('span', { 'class': 'hw-best', text: 'Your best: ' + (timer ? b0 + ' correct' : Math.round(b0 * 100) + '%') })] : []);
      return sh.root;
    };

    // Word reading: ```words\ntitle: …\nmode: read|listen\nえき | eki | station | optional context
    WIDGETS.words = function (block, env) {
      var c = block.cfg, mode = c.mode || 'read';
      var words = block.rows.map(function (r) { return { k: r[0], r: r[1], m: r[2] || '', context: r[3] || '' }; });
      var sh = shell(c.title || (mode === 'listen' ? 'Listen and choose' : mode === 'meaning' ? 'Guess the word' : 'Read real words'),
        mode === 'listen' ? words.length + ' words. Listen and pick the spelling you hear.'
          : mode === 'meaning' ? words.length + ' words borrowed from other languages. Read each one aloud and pick its meaning.'
          : words.length + ' words. Read them aloud first, then type what you read.');
      function begin() {
        var qs = shuffle(words).map(function (w) { return wordQuestion(w, mode, words); });
        runSession(sh.body, {
          questions: qs,
          onDone: function (res) {
            var added = enroll(words.map(function (w) { return { id: 'w:' + w.k, t: 'w', k: w.k, r: w.r, m: w.m }; }));
            var out = [scoreLine(res)];
            if (res.missed.length) {
              out.push(el('div', { 'class': 'hw-missed' }, [el('p', { text: 'To look at again:' })].concat(uniq(res.missed.map(function (q) { return q.answerValue; })).map(function (k) {
                var w = words.filter(function (x) { return x.k === k; })[0];
                return el('p', {}, [el('span', { 'class': 'hw-mini-kana', lang: 'ja', text: w.k }), ' ', el('strong', { text: w.r }), ' · ' + w.m]);
              }))));
            }
            if (added) out.push(el('p', { 'class': 'hw-note', text: added + ' word' + (added > 1 ? 's' : '') + ' added to your daily review.' }));
            out.push(el('div', { 'class': 'hw-actions' }, [el('button', { 'class': 'btn', type: 'button', text: 'Again', onclick: begin })]));
            sh.body.replaceChildren(el('div', { 'class': 'hw-result' }, out));
          }
        });
      }
      var preview = el('p', { 'class': 'hw-preview', lang: 'ja', text: words.map(function (w) { return w.k; }).join('　') });
      startScreen(sh.body, 'Start', begin, mode === 'read' ? [preview] : []);
      return sh.root;
    };

    // Multiple-choice questions:
    // ```quiz
    // ? Question text
    // - wrong option
    // - right option *
    // > explanation
    WIDGETS.quiz = function (block, env, raw) {
      var qs = [], cur = null;
      raw.split('\n').forEach(function (line) {
        var t = line.trim();
        if (!t) return;
        if (/^title:/.test(t)) return;
        if (t[0] === '?') { cur = { q: t.slice(1).trim(), opts: [], ex: '' }; qs.push(cur); }
        else if (t[0] === '-' && cur) { var right = /\*\s*$/.test(t); cur.opts.push({ text: t.slice(1).replace(/\*\s*$/, '').trim(), right: right }); }
        else if (t[0] === '>' && cur) cur.ex += (cur.ex ? ' ' : '') + t.slice(1).trim();
      });
      var title = (raw.match(/^\s*title:\s*(.+)$/m) || [])[1] || 'Quick quiz';
      var sh = shell(title, qs.length + ' question' + (qs.length > 1 ? 's' : '') + '. Commit to an answer before you look.');
      var answered = 0, correct = 0;
      var score = el('p', { 'class': 'hw-score', hidden: true });
      sh.body.replaceChildren.apply(sh.body, qs.map(function (q, qi) {
        var fb = el('div', { 'class': 'hw-feedback', 'aria-live': 'polite' });
        var opts = el('div', { 'class': 'hw-options' + (q.opts.length > 4 ? ' many' : '') }, shuffle(q.opts).map(function (o) {
          var b = el('button', { 'class': 'hw-opt', type: 'button' }, [el('span', { 'class': 'hw-opt-label', text: o.text })]);
          b.addEventListener('click', function () {
            opts.querySelectorAll('button').forEach(function (x) { x.disabled = true; });
            b.classList.add(o.right ? 'is-right' : 'is-wrong');
            if (!o.right) opts.querySelectorAll('button').forEach(function (x, i) { if (shuffledRight(x)) x.classList.add('is-right'); });
            answered++; if (o.right) correct++;
            fb.className = 'hw-feedback ' + (o.right ? 'ok' : 'bad');
            fb.replaceChildren(el('p', { 'class': 'hw-fb-head' }, [el('strong', { text: o.right ? '✓ Correct' : '✗ Not quite' })]),
              q.ex ? el('p', { 'class': 'hw-explain', text: q.ex }) : null);
            if (answered === qs.length) { score.hidden = false; score.textContent = correct + ' of ' + qs.length + ' correct.'; }
          });
          b._right = o.right;
          return b;
        }));
        function shuffledRight(x) { return x._right; }
        return el('div', { 'class': 'hw-quiz-q' }, [el('p', { 'class': 'hw-ask', text: (qs.length > 1 ? (qi + 1) + '. ' : '') + q.q }), opts, fb]);
      }).concat([score]));
      return sh.root;
    };

    // Look-alike discrimination: ```contrast\nき さ | cue …
    WIDGETS.contrast = function (block) {
      var pairs = block.rows.map(function (r) { var ks = splitKana(r[0]); return { a: ks[0], b: ks[1], cue: r[1] || '' }; });
      var sh = shell(block.cfg.title || 'Tell them apart', 'Look-alikes side by side. Hear a sound, pick the right one of the two. Small differences, big payoff.');
      function begin() {
        var qs = [];
        pairs.forEach(function (p) { [p.a, p.b, pick([p.a, p.b])].forEach(function (k) { qs.push({ p: p, k: k }); }); });
        qs = shuffle(qs).map(function (x, i) {
          var e = info(x.k);
          return {
            id: 'c' + i + x.k, k: x.k, answerValue: x.k, audio: x.k, answerLabel: '<span lang="ja">' + x.k + '</span> = ' + e.r,
            prompt: function () { return el('div', {}, [el('p', { 'class': 'hw-ask', text: 'Which one is…' }), el('div', { 'class': 'hw-big hw-roman', text: e.r })]); },
            options: shuffle([x.p.a, x.p.b]).map(function (k) { return { label: k, value: k, lang: 'ja', chosenLabel: k + ' (' + info(k).r + ')' }; }),
            check: function (v) { return { ok: v === x.k }; },
            explain: x.p.cue ? el('p', { 'class': 'hw-explain', text: x.p.cue }) : mnemonicNode(x.k)
          };
        });
        runSession(sh.body, { questions: qs, fast: true, onDone: function (res) {
          sh.body.replaceChildren(el('div', { 'class': 'hw-result' }, [scoreLine(res), missedList(res),
            el('div', { 'class': 'hw-actions' }, [el('button', { 'class': 'btn', type: 'button', text: 'Again', onclick: begin })])]));
        } });
      }
      var preview = el('div', { 'class': 'hw-pairs' }, pairs.map(function (p) {
        return el('span', { 'class': 'hw-pair', lang: 'ja', text: p.a + ' ' + p.b });
      }));
      startScreen(sh.body, 'Start', begin, [preview]);
      return sh.root;
    };

    // Station signs: ```station\ncolor: #80c241\nしぶや | Shibuya | 渋谷 | えびす | はらじゅく
    WIDGETS.station = function (block) {
      var color = block.cfg.color || '#2f7d4f';
      var stations = block.rows.map(function (r) { return { k: r[0], r: r[1], kanji: r[2] || '', prev: r[3] || '', next: r[4] || '' }; });
      var sh = shell(block.cfg.title || 'Read the station sign', 'You\'re on the platform. Read the big ' + D.name + ' and type the station name.');
      function sign(s, revealed) {
        return el('div', { 'class': 'hw-sign', style: '--line:' + color }, [
          el('div', { 'class': 'hw-sign-kanji', lang: 'ja', text: revealed ? s.kanji : '' }),
          el('div', { 'class': 'hw-sign-kana', lang: 'ja', text: s.k }),
          el('div', { 'class': 'hw-sign-roman', text: revealed ? s.r : '· · ·' }),
          el('div', { 'class': 'hw-sign-band' }, [
            el('span', { 'class': 'hw-sign-prev', lang: 'ja', text: s.prev ? '← ' + s.prev : '' }),
            el('span', { 'class': 'hw-sign-next', lang: 'ja', text: s.next ? s.next + ' →' : '' })
          ])
        ]);
      }
      function begin() {
        var qs = stations.map(function (s) {
          var q = wordQuestion({ k: s.k, r: s.r, m: s.kanji ? s.kanji + ' station' : 'station' }, 'read', []);
          q.prompt = function () { return sign(s, false); };
          q.explain = function () { return el('div', {}, [sign(s, true), el('p', { 'class': 'hw-explain', html: 'Character by character: ' + q.hint() })]); };
          q.explainAlways = true;
          return q;
        });
        runSession(sh.body, { questions: qs, onDone: function (res) {
          enroll(stations.map(function (s) { return { id: 'w:' + s.k, t: 'w', k: s.k, r: s.r, m: (s.kanji ? s.kanji + ' ' : '') + 'station' }; }));
          sh.body.replaceChildren(el('div', { 'class': 'hw-result' }, [scoreLine(res),
            el('div', { 'class': 'hw-actions' }, [el('button', { 'class': 'btn', type: 'button', text: 'Ride again', onclick: begin })])]));
        } });
      }
      startScreen(sh.body, 'Board the train', begin);
      return sh.root;
    };

    /* ---------- endless game ---------- */
    // Proficiency per character: an exponential moving average of answer quality
    // (1 = right and fast, 0.8 = right but slow, 0 = wrong), starting from 0.5.
    var GAME_ALPHA = 0.3, FAST_MS = { type: 5000, choice: 3500 };
    var LEVELS = [
      { cls: 'g0', label: 'new (under 3 answers)' }, { cls: 'g1', label: 'weak (under 60%)' }, { cls: 'g2', label: 'learning (60–84%)' },
      { cls: 'g3', label: 'strong (85%+)' }, { cls: 'g4', label: 'mastered (95%+, 8+ answers)' }
    ];
    function gameLevel(g) {
      if (!g || g.n < 3) return LEVELS[0];
      if (g.ema >= 0.95 && g.n >= 8) return LEVELS[4];
      if (g.ema >= 0.85) return LEVELS[3];
      if (g.ema >= 0.6) return LEVELS[2];
      return LEVELS[1];
    }
    function gamePool(cfg) {
      var exclude = {}; // characters that sound like another one (ぢ = じ): unfair in a listening game
      (D.exclude || []).forEach(function (k) { exclude[k] = 1; });
      if (cfg.pool === 'learned') {
        var s = loadState();
        return D.list.filter(function (e) { return s.srs['k:' + e.k] && !exclude[e.k]; }).map(function (e) { return e.k; });
      }
      var unit = Number(cfg.unit) || 8;
      return D.list.filter(function (e) { return e.unit <= unit && !exclude[e.k]; }).map(function (e) { return e.k; });
    }
    function recordGame(k, ok, ms, isChoice) {
      var s = loadState();
      s.game = s.game || {};
      var g = s.game[k] || { n: 0, ok: 0, ema: 0.5, ms: 0 };
      var score = ok ? (ms < (isChoice ? FAST_MS.choice : FAST_MS.type) ? 1 : 0.8) : 0;
      g.n++; if (ok) g.ok++;
      g.ema = Math.round((g.ema + GAME_ALPHA * (score - g.ema)) * 1000) / 1000;
      if (ok) g.ms = g.ms ? Math.round(g.ms * 0.7 + ms * 0.3) : Math.round(ms);
      g.last = Date.now();
      s.game[k] = g;
      markPractised(s);
      saveState(s);
      return g;
    }
    // Adaptive selection: weak, slow and unseen characters come up more often;
    // the unit's new characters get a boost; the last few are held back.
    function chooseNext(pool, focus, recent) {
      var stats = loadState().game || {};
      var weights = pool.map(function (k) {
        if (recent.indexOf(k) >= 0) return 0;
        var g = stats[k], w;
        if (!g || !g.n) w = 2.5;
        else {
          w = 0.2 + Math.pow(1 - g.ema, 1.5) * 4;
          if (g.ms > 4000) w += 0.4;
          if (g.n < 3) w += 0.8;
        }
        return focus.indexOf(k) >= 0 ? w * 1.6 : w;
      });
      var total = weights.reduce(function (a, b) { return a + b; }, 0), r = Math.random() * total;
      for (var i = 0; i < pool.length; i++) { r -= weights[i]; if (r <= 0 && weights[i] > 0) return pool[i]; }
      return pick(pool);
    }
    function pct(x) { return Math.round(x * 100) + '%'; }
    function secs(ms) { return ms ? (ms / 1000).toFixed(1) + ' s' : '–'; }

    // ```game\nunit: 3\nmodes: type,listen,type   (or  pool: learned)
    WIDGETS.game = function (block, env) {
      var c = block.cfg;
      var modes = (c.modes || 'type,listen,type').split(',').map(function (x) { return x.trim(); });
      var focus = c.unit ? D.list.filter(function (e) { return e.unit === Number(c.unit); }).map(function (e) { return e.k; }) : [];
      var bestKey = 'game:' + (c.pool || 'unit' + (c.unit || 8));
      var sh = shell(c.title || 'Endless game',
        'Checkpoint-style questions that never run out. The game picks the characters you know least, and the panel updates after every answer.', 'hw-game');
      var play = el('div', { 'class': 'hw-game-play' });
      var panel = el('aside', { 'class': 'hw-game-panel', 'aria-label': 'Live statistics' });
      sh.body.replaceChildren(el('div', { 'class': 'hw-game-layout' }, [play, panel]));
      var pool = [], session = null, runner = null, before = {}, gridOpen = null;

      function renderPanel(lastK, lastOk) {
        var stats = loadState().game || {};
        pool = gamePool(c);
        var played = pool.filter(function (k) { return stats[k] && stats[k].n; });
        var avg = pool.length ? pool.reduce(function (a, k) { return a + (stats[k] && stats[k].n ? stats[k].ema : 0); }, 0) / pool.length : 0;
        var mastered = pool.filter(function (k) { return gameLevel(stats[k]) === LEVELS[4]; }).length;
        var weakest = played.filter(function (k) { return stats[k].n >= 3 && stats[k].ema < 0.85; })
          .sort(function (a, b) { return stats[a].ema - stats[b].ema; }).slice(0, 5);
        var nodes = [];
        if (session) {
          var acc = session.answered ? session.correct / session.answered : 0;
          nodes.push(el('div', { 'class': 'hw-gtiles' }, [
            tile(session.answered, 'answered'), tile(session.answered ? pct(acc) : '–', 'accuracy'),
            tile('🔥 ' + session.streak, 'streak · best ' + Math.max(session.best, loadState().best[bestKey] || 0)),
            tile(secs(session.correct ? session.ms / session.correct : 0), 'avg. time')
          ]));
        }
        nodes.push(el('div', { 'class': 'hw-gprof' }, [
          el('div', { 'class': 'hw-gprof-head' }, [el('strong', { text: 'Proficiency ' + pct(avg) }), el('span', { text: mastered + ' of ' + pool.length + ' mastered' })]),
          el('div', { 'class': 'hw-gprof-bar', role: 'img', 'aria-label': 'Overall proficiency ' + pct(avg) }, [el('span', { style: 'width:' + pct(avg) })])
        ]));
        nodes.push(el('p', { 'class': 'hw-gfocus' }, weakest.length
          ? [el('span', { text: 'Focus: ' })].concat(weakest.map(function (k) { return el('span', { 'class': 'hw-gfocus-k', lang: 'ja', text: k + ' ' + pct(stats[k].ema) }); }))
          : [el('span', { text: played.some(function (k) { return stats[k].n >= 3; }) ? 'No weak characters right now. Keep the streak going!' : 'Play a few rounds to see which characters need work.' })]));
        var grid = el('div', { 'class': 'hw-ggrid' }, pool.map(function (k) {
          var g = stats[k], lv = gameLevel(g), e = info(k);
          var cell = el('div', { 'class': 'hw-gcell ' + lv.cls + (k === lastK ? (lastOk ? ' flash-ok' : ' flash-bad') : ''),
            title: e.r + ' · ' + (g && g.n ? pct(g.ema) + ' · ' + g.ok + '/' + g.n + ' right · ' + secs(g.ms) : 'not played yet') }, [
            el('span', { 'class': 'hw-gcell-k', lang: 'ja', text: k }),
            el('span', { 'class': 'hw-gcell-p', text: g && g.n ? pct(g.ema) : '·' })
          ]);
          return cell;
        }));
        var legend = el('div', { 'class': 'hw-legend' }, LEVELS.map(function (l) { return el('span', {}, [el('i', { 'class': 'hw-swatch ' + l.cls }), l.label]); }));
        // Big sets and small screens: the grid folds away (remembering the reader's choice).
        if (gridOpen === null) gridOpen = pool.length <= 30 && window.matchMedia('(min-width: 1000px)').matches;
        var details = el('details', { 'class': 'hw-gdetails', open: gridOpen }, [
          el('summary', { text: 'All characters (' + pool.length + ')' }), grid, legend
        ]);
        details.addEventListener('toggle', function () { gridOpen = details.open; });
        nodes.push(details);
        panel.replaceChildren.apply(panel, nodes);
      }
      function tile(v, label) { return el('div', { 'class': 'hw-gtile' }, [el('strong', { text: String(v) }), el('span', { text: label })]); }

      function makeQuestion(queuedTail) {
        var k = chooseNext(pool, focus, session.recent.concat(queuedTail || []));
        session.recent.push(k);
        session.recent = session.recent.slice(-Math.min(4, Math.max(0, pool.length - 2)));
        var q = kanaQuestion(k, pick(modes), pool);
        q.id = 'g' + (session.count++) + ':' + k;
        return q;
      }
      function start() {
        pool = gamePool(c);
        if (pool.length < 4) {
          play.replaceChildren(el('p', { 'class': 'hw-note', text: 'Practise at least one unit first: the game needs a few characters you\'ve studied.' }));
          return;
        }
        var st = loadState().game || {};
        before = {};
        pool.forEach(function (k) { before[k] = st[k] ? st[k].ema : null; });
        session = { answered: 0, correct: 0, streak: 0, best: 0, ms: 0, count: 0, recent: [], mastered: [] };
        var sessionBox = el('div', { 'class': 'hw-game-session' });
        var stopBtn = el('button', { 'class': 'btn hw-game-stop', type: 'button', text: 'End game', onclick: function () { if (runner) runner.stop(); } });
        play.replaceChildren(sessionBox, el('div', { 'class': 'hw-actions' }, [stopBtn]));
        enroll(pool.map(kanaItem));
        runner = runSession(sessionBox, {
          questions: [], endless: true, advanceMs: 750,
          more: makeQuestion,
          statusText: function () {
            return session.answered + ' answered · ' + (session.answered ? pct(session.correct / session.answered) : '–') + ' right · streak ' + session.streak + (session.streak >= 5 ? ' 🔥' : '');
          },
          onAnswer: function (q, ok, lapsedNow, ms) {
            var wasMastered = gameLevel((loadState().game || {})[q.k]) === LEVELS[4];
            var g = recordGame(q.k, ok, ms, !!q.options);
            session.answered++;
            if (ok) { session.correct++; session.streak++; session.ms += ms; } else session.streak = 0;
            if (session.streak > session.best) session.best = session.streak;
            if (!wasMastered && gameLevel(g) === LEVELS[4]) { session.mastered.push(q.k); ctx.toast(q.k + ' (' + info(q.k).r + ') mastered! 🎉'); }
            var s = loadState();
            if (session.best > (s.best[bestKey] || 0)) { s.best[bestKey] = session.best; saveState(s); }
            renderPanel(q.k, ok);
          },
          onDone: function () { runner = null; summary(); }
        });
        renderPanel();
      }
      function summary() {
        var st = loadState().game || {};
        var changes = pool.filter(function (k) { return st[k] && before[k] !== (st[k] && st[k].ema); }).map(function (k) {
          return { k: k, from: before[k] === null ? 0.5 : before[k], to: st[k].ema };
        }).sort(function (a, b) { return (b.to - b.from) - (a.to - a.from); });
        var up = changes.filter(function (x) { return x.to > x.from; }).slice(0, 6);
        var down = changes.filter(function (x) { return x.to < x.from; }).sort(function (a, b) { return (a.to - a.from) - (b.to - b.from); }).slice(0, 4);
        var out = [el('p', { 'class': 'hw-win', text: 'Game over: ' + session.answered + ' answered, ' + (session.answered ? pct(session.correct / session.answered) : '0%') + ' right, best streak ' + session.best + '.' })];
        if (session.mastered.length) out.push(el('p', {}, [el('strong', { text: 'Newly mastered: ' }), el('span', { lang: 'ja', text: session.mastered.join(' ') })]));
        if (up.length) out.push(el('p', {}, [el('strong', { text: 'Improved: ' })].concat(up.map(function (x) { return el('span', { 'class': 'hw-delta up', lang: 'ja', text: x.k + ' ' + pct(x.from) + '→' + pct(x.to) }); }))));
        if (down.length) out.push(el('p', {}, [el('strong', { text: 'Needs work: ' })].concat(down.map(function (x) { return el('span', { 'class': 'hw-delta down', lang: 'ja', text: x.k + ' ' + pct(x.from) + '→' + pct(x.to) }); }))));
        out.push(el('div', { 'class': 'hw-actions' }, [el('button', { 'class': 'btn primary', type: 'button', text: 'Play again', onclick: start })]));
        play.replaceChildren(el('div', { 'class': 'hw-result' }, out));
        session = null;
        renderPanel();
      }
      function intro() {
        var best = loadState().best[bestKey];
        play.replaceChildren(el('div', { 'class': 'hw-start' }, [
          el('button', { 'class': 'btn primary', type: 'button', text: 'Start the game', onclick: start }),
          best ? el('span', { 'class': 'hw-best', text: 'Best streak: ' + best }) : null,
          el('p', { 'class': 'hw-note', text: 'Play as long as you like and end whenever you want. Every answer updates your proficiency, which is saved for each character.' })
        ]));
      }
      intro();
      renderPanel();
      document.addEventListener('nb-hira-changed', function () { if (!session) renderPanel(); });
      return sh.root;
    };

    // Mastery map: every character, coloured by how well your memory holds it.
    function strengthClass(item) {
      if (!item) return 'm0';
      if (item.box >= MASTERED_BOX) return 'm3';
      if (item.box >= 3) return 'm2';
      return 'm1';
    }
    var GOJUON = D.gojuon;
    WIDGETS.map = function () {
      var root = el('section', { 'class': 'hw hw-map-wrap' });
      var detail = el('p', { 'class': 'hw-map-detail', 'aria-live': 'polite', text: 'Tap a character to hear it and see its memory aid.' });
      function cell(k, s) {
        if (!k) return el('span', { 'class': 'hw-cell empty', 'aria-hidden': 'true' });
        var item = s.srs['k:' + k], e = info(k);
        return el('button', { 'class': 'hw-cell ' + strengthClass(item), type: 'button', lang: 'ja', title: e.r, onclick: function () {
          ctx.speak(k);
          var when = item ? (item.due <= Date.now() ? 'review due now' : 'next review in ' + Math.max(1, Math.round((item.due - Date.now()) / DAY)) + ' day(s)') : 'not learned yet';
          detail.replaceChildren(el('span', { 'class': 'hw-mini-kana', lang: 'ja', text: k }), ' ', el('strong', { text: e.r }), ' · ' + e.m + ' (' + when + ')');
        } }, [k]);
      }
      function render() {
        var s = loadState();
        var all = D.list.map(function (e) { return e.k; });
        var extraSets = (D.sets || []).map(function (st) {
          return { label: st.label, wide: st.wide, ks: D.list.filter(function (e) { return e.set === st.set; }).map(function (e) { return e.k; }) };
        });
        var counts = { m1: 0, m2: 0, m3: 0 };
        all.forEach(function (k) { var c = strengthClass(s.srs['k:' + k]); if (counts[c] !== undefined) counts[c]++; });
        var nodes = [
          el('div', { 'class': 'hw-head' }, [el('p', { 'class': 'hw-kicker', text: 'Your ' + D.name + ' map' }),
            el('p', { 'class': 'hw-desc', text: counts.m3 + ' mastered · ' + counts.m2 + ' getting solid · ' + counts.m1 + ' learning · ' + (all.length - counts.m1 - counts.m2 - counts.m3) + ' not started' })]),
          el('div', { 'class': 'hw-map-grid' }, GOJUON.map(function (row) { return el('div', { 'class': 'hw-map-row' }, row.map(function (k) { return cell(k, s); })); }))
        ];
        extraSets.forEach(function (st) {
          nodes.push(el('p', { 'class': 'hw-map-label', text: st.label }),
            el('div', { 'class': 'hw-map-flow' + (st.wide ? ' wide' : '') }, st.ks.map(function (k) { return cell(k, s); })));
        });
        nodes.push(el('div', { 'class': 'hw-legend' }, [['m0', 'not started'], ['m1', 'learning'], ['m2', 'getting solid'], ['m3', 'mastered (reviewed over 2+ weeks)']].map(function (l) {
          return el('span', {}, [el('i', { 'class': 'hw-swatch ' + l[0] }), l[1]]);
        })), detail);
        root.replaceChildren.apply(root, nodes);
      }
      render();
      root.addEventListener('nb-hira-updated', render);
      document.addEventListener('nb-hira-changed', render);
      return root;
    };

    // Daily review (spaced repetition)
    WIDGETS.review = function () {
      var sh = shell('Daily review', '');
      function due(s) { return Object.keys(s.srs).filter(function (id) { return s.srs[id].due <= Date.now(); }); }
      function question(id, item) {
        if (item.t === 'w') {
          var q = wordQuestion({ k: item.k, r: item.r, m: item.m }, 'read', []);
          q.id = id; return q;
        }
        var e = info(item.k);
        if (!e) return null;
        // Weak items are recognised; strong items must be recalled (harder = more durable).
        var mode = item.box <= 1 ? pick(['see', 'listen']) : item.box <= 2 ? pick(['see', 'listen', 'type']) : pick(['type', 'type', 'listen']);
        var pool = D.list.filter(function (o) { return o.unit === e.unit; }).map(function (o) { return o.k; });
        var kq = kanaQuestion(item.k, mode, pool);
        kq.id = id; return kq;
      }
      function run(ids, label) {
        var s = loadState();
        var qs = shuffle(ids).map(function (id) { return question(id, s.srs[id]); }).filter(Boolean);
        runSession(sh.body, {
          questions: qs,
          // Extra practice doesn't move items between boxes; only due reviews do.
          onAnswer: function (q, ok) { if (label !== 'due') return; if (!q.retry) grade(q.id, ok, false); else if (ok) grade(q.id, true, true); },
          onDone: function (res) {
            var st = loadState(); markPractised(st); saveState(st);
            document.dispatchEvent(new CustomEvent('nb-hira-changed'));
            sh.body.replaceChildren(el('div', { 'class': 'hw-result' }, [
              el('p', { 'class': 'hw-win', text: label === 'due' ? '✓ Review done for today.' : '✓ Extra practice done.' }),
              scoreLine(res), missedList(res),
              el('p', { 'class': 'hw-note', text: (label === 'due' ? 'Missed items come back tomorrow; the rest move to a longer interval. ' : 'Your schedule is unchanged. ') + 'Streak: ' + streak(st) + ' day(s).' }),
              el('div', { 'class': 'hw-actions' }, [el('button', { 'class': 'btn', type: 'button', text: 'Back to overview', onclick: overview })])
            ]));
          }
        });
      }
      function overview() {
        var s = loadState(), ids = Object.keys(s.srs), d = due(s);
        var mastered = ids.filter(function (id) { return s.srs[id].box >= MASTERED_BOX; }).length;
        var nextDue = ids.map(function (id) { return s.srs[id].due; }).filter(function (t) { return t > Date.now(); }).sort()[0];
        var stats = el('div', { 'class': 'hw-stats' }, [
          stat(d.length, 'due now'), stat(ids.length, 'in your deck'), stat(mastered, 'mastered'), stat(streak(s), 'day streak')
        ]);
        var actions = [];
        if (!ids.length) {
          actions.push(el('p', { 'class': 'hw-note', text: 'Your deck is empty. Finish a practice in Unit 1 and its characters will appear here.' }));
        } else if (d.length) {
          actions.push(el('button', { 'class': 'btn primary', type: 'button', text: 'Start review (' + Math.min(d.length, 40) + ')', onclick: function () {
            run(d.sort(function (a, b) { return s.srs[a].due - s.srs[b].due; }).slice(0, 40), 'due');
          } }));
        } else {
          actions.push(el('p', { 'class': 'hw-note', text: 'Nothing due. ' + (nextDue ? 'Next review: ' + new Date(nextDue).toLocaleString([], { weekday: 'short', hour: '2-digit', minute: '2-digit' }) + '.' : '') + ' Rest is part of learning.' }));
        }
        if (ids.length) actions.push(el('button', { 'class': 'btn', type: 'button', text: 'Extra practice: weakest 15', onclick: function () {
          run(ids.slice().sort(function (a, b) { return (s.srs[a].box - s.srs[b].box) || (s.srs[b].lapses - s.srs[a].lapses); }).slice(0, 15), 'extra');
        } }));
        sh.body.replaceChildren(stats, el('div', { 'class': 'hw-start' }, actions));
      }
      function stat(n, label) { return el('div', { 'class': 'hw-stat' }, [el('strong', { text: String(n) }), el('span', { text: label })]); }
      overview();
      return sh.root;
    };

    // Reset button: ```reset
    WIDGETS.reset = function () {
      return el('div', { 'class': 'hw-reset' }, [el('button', { 'class': 'btn', type: 'button', text: 'Reset ' + D.name + ' progress', onclick: function () {
        if (!window.confirm('Delete your ' + D.name + ' review deck, game stats, best scores and streak on this device?')) return;
        try { localStorage.removeItem(STORE); } catch (e) { /* ignore */ }
        document.dispatchEvent(new CustomEvent('nb-hira-changed'));
        ctx.toast(D.Name + ' progress reset.');
      } })]);
    };

    return {
      WIDGETS: WIDGETS, parseBlock: parseBlock, el: el,
      summary: function () {
        var s = loadState(), ids = Object.keys(s.srs).filter(function (id) { return id.slice(0, 2) === 'k:'; });
        return {
          learned: ids.length,
          mastered: ids.filter(function (id) { return s.srs[id].box >= MASTERED_BOX; }).length,
          due: Object.keys(s.srs).filter(function (id) { return s.srs[id].due <= Date.now(); }).length,
          total: D.list.length
        };
      },
      _test: { norm: norm, splitKana: splitKana, literalRomaji: literalRomaji, parts: parts }
    };
  }

  /* ---------- public API ---------- */
  var engines = {};
  function engine(script) {
    if (!engines[script]) {
      var data = script === 'katakana' ? window.NB_KATA : window.NB_KANA;
      if (!data) return null;
      engines[script] = createEngine(data, script === 'katakana' ? 'nb-kata' : 'nb-hira');
    }
    return engines[script];
  }
  window.NBKana = {
    init: function (api) { Object.keys(api).forEach(function (k) { ctx[k] = api[k]; }); },
    engine: engine,
    summary: function (script) { var e = engine(script); return e ? e.summary() : null; },
    mount: function (article, pageKey, script) {
      var eng = engine(script || 'hiragana'), n = 0;
      if (!eng) return;
      article.querySelectorAll('pre > code[class^="language-"]').forEach(function (code) {
        var type = code.className.replace(/^language-/, '');
        if (!eng.WIDGETS[type]) return;
        var raw = code.textContent;
        var node;
        try { node = eng.WIDGETS[type](eng.parseBlock(raw), { pageKey: pageKey, key: pageKey + '#' + (n++) }, raw); }
        catch (err) { node = eng.el('p', { 'class': 'hw-error', text: 'This exercise could not be loaded (' + err.message + ').' }); }
        code.parentNode.replaceWith(node);
      });
    }
  };
})();
