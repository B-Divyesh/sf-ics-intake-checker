const CACHE = 'ics-intake-checker-v1.3.0';
const SHELL = ['/', '/index.html', '/demo', '/privacy', '/terms', '/offline.html', '/manifest.webmanifest', '/favicon.svg', '/assets/inspection-landscape.webp'];

async function cacheFresh(cache, urls) {
  await Promise.all(urls.map(async (url) => {
    const response = await fetch(new Request(url, { cache: 'no-store' }));
    if (!response.ok) throw new Error(`Could not cache ${url}`);
    await cache.put(url, response);
  }));
}

self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE);
    await cacheFresh(cache, SHELL);
    const page = await cache.match('/index.html', { ignoreVary: true });
    if (page) {
      const markup = await page.text();
      const appFiles = [...markup.matchAll(/(?:src|href)="(\/assets\/[^"]+)"/g)].map((match) => match[1]);
      await cacheFresh(cache, appFiles);
    }
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', (event) => {
  event.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((key) => key !== CACHE).map((key) => caches.delete(key)))).then(() => self.clients.claim()));
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET' || new URL(event.request.url).origin !== self.location.origin) return;
  const isNavigation = event.request.mode === 'navigate';
  if (isNavigation) {
    event.respondWith(fetch(event.request).then((response) => {
      const copy = response.clone();
      caches.open(CACHE).then((cache) => cache.put(event.request, copy));
      return response;
    }).catch(async () => (await caches.match(event.request, { ignoreVary: true })) || (await caches.match('/index.html', { ignoreVary: true })) || caches.match('/offline.html', { ignoreVary: true })));
    return;
  }
  event.respondWith(caches.match(event.request, { ignoreVary: true }).then((cached) => cached || fetch(event.request).then((response) => {
    if (response.ok) caches.open(CACHE).then((cache) => cache.put(event.request, response.clone()));
    return response;
  })));
});

self.addEventListener('message', (event) => {
  if (event.data === 'SKIP_WAITING') self.skipWaiting();
  if (event.data?.type === 'CACHE_URLS') {
    event.waitUntil(caches.open(CACHE).then((cache) => cacheFresh(cache, event.data.urls)).then(() => event.ports[0]?.postMessage('READY')));
  }
});
