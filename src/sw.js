/* ============================================================================
   Service Worker — Mohanad Ibrahim · Executive Finance Portfolio (PWA)
   Strategy:
     • Navigations  → network-first, fall back to cached index.html (offline launch).
     • Static assets → cache-first with runtime caching (fonts, images, videos, etc.).
   Cache name is versioned; bump SW_VERSION to ship a fresh app shell.
   Scope is the directory this file is served from (register with a relative URL).
   ========================================================================== */
'use strict';

const SW_VERSION = 'mi-portfolio-v1';
const APP_SHELL = `${SW_VERSION}-shell`;
const RUNTIME   = `${SW_VERSION}-runtime`;

/* Core app shell — precached on install. Content-hashed asset names never change,
   so cache-first is always correct. Paths are relative to this worker's scope. */
const PRECACHE_URLS = [
  './',
  './index.html',
  './manifest.webmanifest',
  './assets/media/img/img_e0db44789aca.png',
  './assets/media/img/img_f47fa94f53f3.jpg',
  './assets/favicon/android-chrome-192x192.png',
  './assets/favicon/android-chrome-512x512.png',
  './assets/favicon/apple-touch-icon.png',
  './assets/favicon/favicon-32x32.png',
  './assets/media/fonts/fon_01a8c6f87d73.woff2',
  './assets/media/fonts/fon_0ea4f6708679.woff2',
  './assets/media/fonts/fon_12e435113f35.woff2',
  './assets/media/fonts/fon_4412bd3f3fbb.woff2',
  './assets/media/fonts/fon_4826175b7bbb.woff2',
  './assets/media/fonts/fon_4af7b4baf961.woff2',
  './assets/media/fonts/fon_58c4d0a02dfb.woff2',
  './assets/media/fonts/fon_5a0fdd6f9aa4.woff2',
  './assets/media/fonts/fon_6b916a381dab.woff2',
  './assets/media/fonts/fon_78d35344a680.woff2',
  './assets/media/fonts/fon_ab73656158a5.woff2',
  './assets/media/fonts/fon_b0d094d0c0a3.woff2',
  './assets/media/fonts/fon_f5478d534e4a.woff2'
];

self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(APP_SHELL);
    // Add individually so one missing asset can't abort the whole install.
    await Promise.all(PRECACHE_URLS.map((url) =>
      cache.add(new Request(url, { cache: 'reload' })).catch(() => {})
    ));
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(
      keys.filter((k) => k !== APP_SHELL && k !== RUNTIME).map((k) => caches.delete(k))
    );
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return; // let cross-origin pass through

  // Navigations: network-first so the app updates when online, offline-capable otherwise.
  if (req.mode === 'navigate') {
    event.respondWith((async () => {
      try {
        const fresh = await fetch(req);
        const cache = await caches.open(APP_SHELL);
        cache.put('./index.html', fresh.clone()).catch(() => {});
        return fresh;
      } catch (e) {
        return (await caches.match('./index.html')) ||
               (await caches.match(req)) ||
               Response.error();
      }
    })());
    return;
  }

  // Static assets: cache-first, then runtime-cache the network response.
  event.respondWith((async () => {
    const cached = await caches.match(req);
    if (cached) return cached;
    try {
      const resp = await fetch(req);
      // Only cache successful, basic (same-origin) responses.
      if (resp && (resp.ok || resp.type === 'opaque')) {
        const cache = await caches.open(RUNTIME);
        cache.put(req, resp.clone()).catch(() => {});
      }
      return resp;
    } catch (e) {
      return cached || Response.error();
    }
  })());
});
