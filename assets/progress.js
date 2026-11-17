/* Progress transfer between devices, without any server.
   Progress is packed into a compact code: JSON → deflate (when the browser supports it) →
   base64url. The code travels in a link's #fragment, which browsers never send to a server,
   or in a downloaded file. Importing merges with what's already on the device:
   - completed lessons: done on either device counts as done
   - review items: the copy reviewed most recently wins (then more reviews, then later due)
   - game stats per character: the record with more answers wins
   - best scores: the higher one; streak days: the union */
(function () {
  'use strict';

  var KEYS = { done: 'nb-done', hira: 'nb-hira', kata: 'nb-kata', kanji: 'nb-kanji' };
  var FORMAT = 2;

  function read(key, fallback) {
    try { var v = localStorage.getItem(key); return v === null ? fallback : JSON.parse(v); } catch (e) { return fallback; }
  }
  function write(key, value) { localStorage.setItem(key, JSON.stringify(value)); }
  function kanaData(script) { return script === 'kata' ? window.NB_KATA : script === 'kanji' ? window.NB_KANJI : window.NB_KANA; }

  /* ---------- compact form: drops fields that can be rebuilt from the course data ---------- */
  function slimStore(st) {
    if (!st) return null;
    var out = { s: {}, b: st.best || {}, d: st.days || [], g: {} };
    Object.keys(st.srs || {}).forEach(function (id) {
      var it = st.srs[id], row = [it.box, it.due, it.n, it.lapses, it.last || 0];
      if (id.slice(0, 2) === 'w:') row.push(it.r || '', it.m || ''); // word readings and meanings live only in the lessons
      out.s[id] = row;
    });
    Object.keys(st.game || {}).forEach(function (k) { var g = st.game[k]; out.g[k] = [g.n, g.ok, g.ema, g.ms, g.last || 0]; });
    return out;
  }
  function fullStore(slim, script) {
    if (!slim) return null;
    var D = kanaData(script), st = { v: FORMAT, srs: {}, best: slim.b || {}, days: slim.d || [], game: {} };
    Object.keys(slim.s || {}).forEach(function (id) {
      var r = slim.s[id], kind = id.slice(0, 2), k = id.slice(2);
      var base = kind === 'w:' ? { t: 'w', k: k, r: r[5] || '', m: r[6] || '' }
        : { t: 'k', k: k, r: D && D.byChar[k] ? D.byChar[k].r : '', m: '' };
      base.box = r[0]; base.due = r[1]; base.n = r[2]; base.lapses = r[3]; base.last = r[4] || 0;
      st.srs[id] = base;
    });
    Object.keys(slim.g || {}).forEach(function (k) { var g = slim.g[k]; st.game[k] = { n: g[0], ok: g[1], ema: g[2], ms: g[3], last: g[4] || 0 }; });
    return st;
  }

  function collect() {
    var done = read(KEYS.done, {});
    return {
      app: 'nippon-bible', v: FORMAT, at: Date.now(),
      done: Object.keys(done).filter(function (k) { return done[k]; }),
      h: slimStore(read(KEYS.hira, null)), k: slimStore(read(KEYS.kata, null)), c: slimStore(read(KEYS.kanji, null))
    };
  }

  /* ---------- encoding ---------- */
  function toB64url(bytes) {
    var bin = '';
    for (var i = 0; i < bytes.length; i += 0x8000) bin += String.fromCharCode.apply(null, bytes.subarray(i, i + 0x8000));
    return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  }
  function fromB64url(s) {
    s = s.replace(/-/g, '+').replace(/_/g, '/');
    while (s.length % 4) s += '=';
    var bin = atob(s), out = new Uint8Array(bin.length);
    for (var i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
    return out;
  }
  function pipe(bytes, stream) {
    return new Response(new Blob([bytes]).stream().pipeThrough(stream)).arrayBuffer().then(function (b) { return new Uint8Array(b); });
  }
  // "z." = deflate-raw compressed, "j." = plain (for browsers without CompressionStream)
  function encode(obj) {
    var bytes = new TextEncoder().encode(JSON.stringify(obj));
    if (window.CompressionStream) {
      return pipe(bytes, new CompressionStream('deflate-raw')).then(function (z) { return 'z.' + toB64url(z); });
    }
    return Promise.resolve('j.' + toB64url(bytes));
  }
  function decode(code) {
    return Promise.resolve().then(function () {
      code = extractCode(code);
      if (!code) { var e = new Error('No transfer link found. Paste the whole link, starting with https://.'); e.friendly = true; throw e; }
      var kind = code.slice(0, 2), bytes = fromB64url(code.slice(2));
      if (kind === 'j.') return bytes;
      if (!window.DecompressionStream) { var old = new Error('This browser is too old to open transfer links. Send a progress file instead.'); old.friendly = true; throw old; }
      return pipe(bytes, new DecompressionStream('deflate-raw'));
    }).then(function (bytes) {
      var obj;
      try { obj = JSON.parse(new TextDecoder().decode(bytes)); } catch (e) { throw damaged(); }
      return validate(obj);
    }, function (e) {
      // Base64 or decompression failures mean the link was cut off or altered in transit.
      throw e && e.friendly ? e : damaged();
    });
  }
  function damaged() {
    var e = new Error('This link is damaged or incomplete. Messaging apps sometimes cut long links: copy the whole link, or send a progress file instead.');
    e.friendly = true;
    return e;
  }
  // Accepts a full link, a bare code, or a downloaded file's text.
  function extractCode(text) {
    text = String(text || '').trim();
    var m = text.match(/#\/import\/([A-Za-z0-9._-]+)/);
    if (m) return m[1];
    if (/^[zj]\.[A-Za-z0-9_-]+$/.test(text)) return text;
    return '';
  }
  function friendly(msg) { var e = new Error(msg); e.friendly = true; return e; }
  function validate(obj) {
    if (!obj || obj.app !== 'nippon-bible' || typeof obj.v !== 'number') throw friendly('This isn\'t a Nippon Bible progress link or file.');
    if (obj.v > FORMAT) throw friendly('This progress comes from a newer version of the site. Reload this page and try again.');
    return { at: obj.at || 0, done: Array.isArray(obj.done) ? obj.done : [], hira: fullStore(obj.h, 'hira'), kata: fullStore(obj.k, 'kata'), kanji: fullStore(obj.c, 'kanji') };
  }
  // Files hold readable JSON in the same compact shape.
  function parseFile(text) {
    return Promise.resolve().then(function () {
      var t = String(text || '').trim();
      if (t.charAt(0) === '{') { var obj; try { obj = JSON.parse(t); } catch (e) { throw friendly('This file isn\'t a Nippon Bible progress file.'); } return validate(obj); }
      return decode(t);
    });
  }

  /* ---------- merging ---------- */
  function newer(a, b) { // true when review item b should replace a
    if ((b.last || 0) !== (a.last || 0)) return (b.last || 0) > (a.last || 0);
    if ((b.n || 0) !== (a.n || 0)) return (b.n || 0) > (a.n || 0);
    return (b.due || 0) > (a.due || 0);
  }
  function mergeStore(local, incoming, report) {
    if (!incoming) return local;
    var out = local ? JSON.parse(JSON.stringify(local)) : { srs: {}, best: {}, days: [], game: {} };
    out.srs = out.srs || {}; out.best = out.best || {}; out.days = out.days || []; out.game = out.game || {};
    Object.keys(incoming.srs).forEach(function (id) {
      var a = out.srs[id], b = incoming.srs[id];
      if (!a) { out.srs[id] = b; report.added++; }
      else if (newer(a, b)) { out.srs[id] = b; report.updated++; }
      else report.kept++;
    });
    Object.keys(incoming.game).forEach(function (k) {
      var a = out.game[k], b = incoming.game[k];
      if (!a || b.n > a.n || (b.n === a.n && (b.last || 0) > (a.last || 0))) out.game[k] = b;
    });
    Object.keys(incoming.best).forEach(function (k) { if (!(out.best[k] >= incoming.best[k])) out.best[k] = incoming.best[k]; });
    var days = {};
    out.days.concat(incoming.days).forEach(function (d) { days[d] = 1; });
    // Days are stored as "2026-11-7" (no zero padding), so sort numerically, not as dates or text.
    var num = function (d) { var p = d.split('-').map(Number); return p[0] * 10000 + p[1] * 100 + p[2]; };
    out.days = Object.keys(days).sort(function (x, y) { return num(x) - num(y); }).slice(-400);
    out.v = FORMAT;
    return out;
  }
  function apply(data) {
    var report = { lessons: 0, hira: { added: 0, updated: 0, kept: 0 }, kata: { added: 0, updated: 0, kept: 0 }, kanji: { added: 0, updated: 0, kept: 0 } };
    var done = read(KEYS.done, {});
    data.done.forEach(function (id) { if (!done[id]) { done[id] = true; report.lessons++; } });
    var hira = mergeStore(read(KEYS.hira, null), data.hira, report.hira);
    var kata = mergeStore(read(KEYS.kata, null), data.kata, report.kata);
    var kanji = mergeStore(read(KEYS.kanji, null), data.kanji, report.kanji);
    // Write everything or nothing: storage can be full or blocked.
    var backup = { done: localStorage.getItem(KEYS.done), hira: localStorage.getItem(KEYS.hira), kata: localStorage.getItem(KEYS.kata), kanji: localStorage.getItem(KEYS.kanji) };
    try {
      write(KEYS.done, done);
      if (hira) write(KEYS.hira, hira);
      if (kata) write(KEYS.kata, kata);
      if (kanji) write(KEYS.kanji, kanji);
    } catch (e) {
      Object.keys(backup).forEach(function (k) {
        try { if (backup[k] === null) localStorage.removeItem(KEYS[k]); else localStorage.setItem(KEYS[k], backup[k]); } catch (ignore) { /* nothing more to do */ }
      });
      throw new Error('This browser didn\'t allow saving the progress (storage is full or blocked).');
    }
    document.dispatchEvent(new CustomEvent('nb-hira-changed'));
    return report;
  }

  /* ---------- summaries ---------- */
  function describe(data) {
    function kana(st) {
      if (!st) return { chars: 0, words: 0, mastered: 0 };
      var ids = Object.keys(st.srs);
      return {
        chars: ids.filter(function (id) { return id.slice(0, 2) === 'k:'; }).length,
        words: ids.filter(function (id) { return id.slice(0, 2) === 'w:'; }).length,
        mastered: ids.filter(function (id) { return id.slice(0, 2) === 'k:' && st.srs[id].box >= 5; }).length
      };
    }
    return { at: data.at, done: data.done, hira: kana(data.hira), kata: kana(data.kata), kanji: kana(data.kanji) };
  }
  function current() { return validate(collect()); }

  window.NBProgress = {
    collect: collect, encode: encode, decode: decode, parseFile: parseFile, apply: apply,
    describe: describe, current: current, extractCode: extractCode,
    _test: { mergeStore: mergeStore, slimStore: slimStore, fullStore: fullStore }
  };
})();
