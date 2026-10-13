/* =========================================================
   مدرسه‌ی من — Service Worker
   کش هسته + کش ران‌تایم برای کار آفلاین پس از نصب
   ========================================================= */
const CACHE = 'madrese-man-v1';

const CORE = [
  './',
  'index.html',
  'styles.css',
  'app.js',
  'data.js',
  'manifest.json',
  'images/icons/icon-192.png',
  'images/icons/icon-512.png',
  'images/icons/icon-maskable-512.png',
  'images/icons/apple-touch-icon.png',
  'images/karensoft/mark.png',
  'images/karensoft/wordmark-fa.png',
  'images/karensoft/wordmark-en.png',
  'videos/majara-horof-poster.jpg'
];

self.addEventListener('install', (ev) => {
  ev.waitUntil(
    caches.open(CACHE)
      .then((c) => c.addAll(CORE))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (ev) => {
  ev.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (ev) => {
  const req = ev.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  if (req.mode === 'navigate') {
    ev.respondWith(
      fetch(req)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(req, copy)).catch(() => {});
          return res;
        })
        .catch(() => caches.match(req).then((m) => m || caches.match('index.html')))
    );
    return;
  }

  ev.respondWith(
    caches.match(req).then((m) => m || fetch(req).then((res) => {
      const copy = res.clone();
      caches.open(CACHE).then((c) => c.put(req, copy)).catch(() => {});
      return res;
    }))
  );
});
