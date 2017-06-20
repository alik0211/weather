const dataCacheName = 'weatherData-v1';
const cacheName = 'weather-v12';
const filesToCache = [
  '/',
  '/index.html',
  '/js/common.js',
  '/css/main.css',
  '/images/edit.svg',
  '/images/github.svg',
  '/images/01d.svg', '/images/01n.svg',
  '/images/02d.svg', '/images/02n.svg',
  '/images/03d.svg', '/images/03n.svg',
  '/images/04d.svg', '/images/04n.svg',
  '/images/09d.svg', '/images/09n.svg',
  '/images/10d.svg', '/images/10n.svg',
  '/images/11d.svg', '/images/11n.svg',
  '/images/13d.svg', '/images/13n.svg',
  '/images/50d.svg', '/images/50n.svg'
];

self.addEventListener('install', function(e) {
  console.log('[ServiceWorker] Install');
  e.waitUntil(
    caches.open(cacheName).then(function(cache) {
      console.log('[ServiceWorker] Caching app shell');
      return cache.addAll(filesToCache);
    })
  );
});

self.addEventListener('activate', function(e) {
  console.log('[ServiceWorker] Activate');
  e.waitUntil(
    caches.keys().then(function(keyList) {
      return Promise.all(keyList.map(function(key) {
        if (key !== cacheName && key !== dataCacheName) {
          console.log('[ServiceWorker] Removing old cache', key);
          return caches.delete(key);
        }
      }));
    })
  );

  return self.clients.claim();
});

self.addEventListener('fetch', function(e) {
  console.log('[Service Worker] Fetch', e.request.url);
  const dataUrl = 'https://alik0211.tk/weather0211/data.php';
  if (e.request.url.indexOf(dataUrl) > -1) {
    e.respondWith(
      caches.open(dataCacheName).then(function(cache) {
        return fetch(e.request).then(function(response) {
          cache.put(e.request.url, response.clone());
          return response;
        });
      })
    );
  } else {
    e.respondWith(
      caches.match(e.request).then(function(response) {
        return response || fetch(e.request);
      })
    );
  }
});
