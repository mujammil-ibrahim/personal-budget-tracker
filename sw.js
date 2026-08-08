/* Service Worker for Offline PWA Phone Access (Network-First Strategy) */
const CACHE_NAME = 'money-companion-cache-v28';
const URLS_TO_CACHE = [
  './',
  './index.html',
  './css/styles.css?v=28',
  './js/app.js?v=28',
  './js/store.js?v=28',
  './js/aiEngine.js?v=28',
  './js/modules/landing.js?v=28',
  './js/modules/about.js?v=28',
  './js/modules/dashboard.js?v=28',
  './js/modules/income.js?v=28',
  './js/modules/expenses.js?v=28',
  './js/modules/budget.js?v=28',
  './js/modules/savings.js?v=28',
  './js/modules/goals.js?v=28',
  './js/modules/wishlist.js?v=28',
  './js/modules/reports.js?v=28',
  './js/modules/settings.js?v=28',
  './assets/ai_companion_avatar.jpg'
];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(URLS_TO_CACHE))
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Network-First strategy: Always fetch fresh code from Vercel when online!
self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200) {
          const responseClone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, responseClone));
        }
        return networkResponse;
      })
      .catch(() => caches.match(event.request))
  );
});
