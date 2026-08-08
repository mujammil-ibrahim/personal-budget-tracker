/* Service Worker for Offline PWA Phone Access */
const CACHE_NAME = 'money-companion-cache-v1';
const URLS_TO_CACHE = [
  './',
  './index.html',
  './css/styles.css',
  './js/app.js',
  './js/store.js',
  './js/aiEngine.js',
  './js/modules/dashboard.js',
  './js/modules/income.js',
  './js/modules/expenses.js',
  './js/modules/budget.js',
  './js/modules/savings.js',
  './js/modules/goals.js',
  './js/modules/wishlist.js',
  './js/modules/reports.js',
  './js/modules/settings.js',
  './assets/ai_companion_avatar.jpg'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(URLS_TO_CACHE))
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => response || fetch(event.request))
  );
});
