// Offline support: saves the whole site on first visit and serves it from the cache.
// The deploy stamps BUILD with a hash of every file (scripts/build-offline.mjs), so each
// release installs a fresh cache in the background; the page then offers a reload.
const BUILD = '__BUILD__';
const CACHE = 'nb-site-' + BUILD;
const FONTS = 'nb-fonts';
const FONT_HOSTS = ['fonts.googleapis.com', 'fonts.gstatic.com'];

self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    const res = await fetch('precache.json', { cache: 'no-store' });
    const list = await res.clone().json();
    const cache = await caches.open(CACHE);
    // Fetch past the HTTP cache so a new release never stores a stale copy.
    await cache.addAll(list.files.map((f) => new Request(f, { cache: 'reload' })));
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

  event.respondWith((async () => {
    const cache = await caches.open(CACHE);
    // The site routes by #hash, so every page load is index.html,
    // except a file opened directly, such as a diagram opened full size.
    const isFile = /\.[a-z0-9]+$/i.test(url.pathname) && !/\/index\.html$/.test(url.pathname);
    if (req.mode === 'navigate' && !isFile) {
      return (await cache.match('index.html')) || fetch(req);
    }
    const hit = await cache.match(req, { ignoreSearch: true });
    return hit || fetch(req);
  })());
});
