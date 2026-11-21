// Offline support: saves the whole site on first visit and serves it from the cache.
// The deploy stamps BUILD with a hash of every file (scripts/build-offline.mjs), so each
// release installs a fresh cache in the background; the page then switches to it.
// precache.json lists every file with a hash of its contents: an update copies unchanged
// files from the previous cache and downloads only the files that changed.
const BUILD = '__BUILD__';
const CACHE = 'nb-site-' + BUILD;
const FONTS = 'nb-fonts';
const FONT_HOSTS = ['fonts.googleapis.com', 'fonts.gstatic.com'];

// The most recent complete earlier cache (a complete install ends by storing precache.json).
async function previousRelease() {
  for (const key of (await caches.keys()).reverse()) {
    if (!key.startsWith('nb-site-') || key === CACHE) continue;
    const cache = await caches.open(key);
    const manifest = await cache.match('precache.json');
    if (!manifest) continue;
    try { return { cache, hashes: (await manifest.json()).hashes || {} }; } catch (e) { /* unreadable: skip */ }
  }
  return null;
}

self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    // A unique address gets past GitHub Pages' CDN, which caches files for up to 10 minutes.
    const res = await fetch('precache.json?build=' + BUILD + '&t=' + Date.now(), { cache: 'no-store' });
    if (!res.ok) throw new Error('precache.json: HTTP ' + res.status);
    const list = await res.clone().json();
    const hashes = list.hashes || {};
    const cache = await caches.open(CACHE);
    const prev = await previousRelease();
    await Promise.all(list.files.map(async (f) => {
      const h = hashes[f];
      if (prev && h && prev.hashes[f] === h) {
        const old = await prev.cache.match(f);
        if (old) { await cache.put(f, old); return; }
      }
      // Changed or new: ask for this exact version, past both the browser and CDN caches.
      const fresh = await fetch(new Request(h ? f + '?v=' + h : f, { cache: 'reload' }));
      if (!fresh.ok) throw new Error(f + ': HTTP ' + fresh.status);
      await cache.put(f, fresh);
    }));
    await cache.put('precache.json', res);
    // The very first install takes over at once; later ones wait for the page's go-ahead.
    if (!self.registration.active) await self.skipWaiting();
  })());
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    for (const key of await caches.keys()) if (key.startsWith('nb-site-') && key !== CACHE) await caches.delete(key);
    await self.clients.claim();
  })());
});

self.addEventListener('message', (event) => {
  if (event.data === 'skipWaiting') self.skipWaiting();
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);

  // Web fonts: serve the saved copy, refresh it in the background. Without a saved copy
  // offline, the browser falls back to the system font.
  if (FONT_HOSTS.includes(url.hostname)) {
    event.respondWith((async () => {
      const cache = await caches.open(FONTS);
      const hit = await cache.match(req);
      const net = fetch(req).then((res) => { if (res.ok || res.type === 'opaque') cache.put(req, res.clone()); return res; });
      if (hit) { event.waitUntil(net.catch(() => {})); return hit; }
      return net;
    })());
    return;
  }

  if (url.origin !== self.location.origin) return;
  // "?fresh=…" asks the server, not the saved copy: the page uses it to see whether a newer
  // release exists. reset.html always comes from the server, so it can repair a stuck copy.
  if (url.searchParams.has('fresh') || /\/reset\.html$/.test(url.pathname)) {
    event.respondWith(fetch(new Request(req, { cache: 'no-store' })));
    return;
  }

  event.respondWith((async () => {
    const cache = await caches.open(CACHE);
    // The site routes by #hash, so every page load is index.html,
    // except a file opened directly, such as a diagram opened full size.
    const isFile = /\.[a-z0-9]+$/i.test(url.pathname) && !/\/index\.html$/.test(url.pathname);
    if (req.mode === 'navigate' && !isFile) {
      return (await cache.match('index.html', { ignoreVary: true })) || fetch(req);
    }
    // ignoreVary: GitHub Pages sends "Vary: Accept-Encoding", and audio elements send a
    // different Accept-Encoding from the fetch that stored the file, so without it their
    // requests never match the cache and fail offline.
    const hit = await cache.match(req, { ignoreSearch: true, ignoreVary: true });
    // Audio and video ask for byte ranges; Chrome refuses a whole-file answer from the cache
    // ("source not supported"), so cut the requested range out of the cached file.
    if (hit && req.headers.has('range')) return rangeOf(hit, req.headers.get('range'));
    return hit || fetch(req);
  })());
});

async function rangeOf(res, header) {
  const buf = await res.arrayBuffer();
  const m = /^bytes=(\d*)-(\d*)$/.exec(header.trim());
  const size = buf.byteLength;
  let start = m && m[1] !== '' ? Number(m[1]) : NaN, end = m && m[2] !== '' ? Number(m[2]) : size - 1;
  if (m && m[1] === '' && m[2] !== '') { start = Math.max(0, size - Number(m[2])); end = size - 1; } // bytes=-500
  if (!m || Number.isNaN(start) || start >= size || end < start) {
    return new Response(null, { status: 416, statusText: 'Range Not Satisfiable', headers: { 'Content-Range': `bytes */${size}` } });
  }
  end = Math.min(end, size - 1);
  const body = buf.slice(start, end + 1);
  const headers = new Headers(res.headers);
  headers.set('Content-Range', `bytes ${start}-${end}/${size}`);
  headers.set('Content-Length', String(body.byteLength));
  headers.set('Accept-Ranges', 'bytes');
  return new Response(body, { status: 206, statusText: 'Partial Content', headers });
}
