const CACHE_NAME = 'travel-map-v1';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './destinations.json',
  './config.json',
  './manifest.json',
  // All 17 destination JSONs
  './destinations/japan.json',
  './destinations/italy.json',
  './destinations/greece.json',
  './destinations/uk.json',
  './destinations/spain.json',
  './destinations/thailand.json',
  './destinations/korea.json',
  './destinations/vietnam.json',
  './destinations/portugal.json',
  './destinations/china.json',
  './destinations/taiwan.json',
  './destinations/europe-ski.json',
  './destinations/france.json',
  './destinations/belgium.json',
  './destinations/mexico.json',
  './destinations/singapore.json',
  './destinations/usa.json',
  // CDN assets
  'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css'
];

// Install: cache all static assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(ASSETS_TO_CACHE))
      .then(() => self.skipWaiting())
  );
});

// Activate: clean old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
      )
    ).then(() => self.clients.claim())
  );
});

// Fetch: network-first for our files (ensures updates propagate), cache-first for CDN
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  // Skip non-GET requests (API calls, etc.)
  if (event.request.method !== 'GET') return;

  // Skip Anthropic API calls and Google Places API calls
  if (url.hostname === 'api.anthropic.com' || url.hostname.includes('googleapis.com')) return;

  if (url.origin === location.origin) {
    // Network-first for our own files (ensures updates propagate quickly)
    event.respondWith(
      fetch(event.request)
        .then(response => {
          // Only cache successful responses
          if (response.ok) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
          }
          return response;
        })
        .catch(() => caches.match(event.request))
    );
  } else {
    // Cache-first for CDN assets (they're versioned and don't change)
    event.respondWith(
      caches.match(event.request)
        .then(cached => {
          if (cached) return cached;
          return fetch(event.request).then(response => {
            if (response.ok) {
              const clone = response.clone();
              caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
            }
            return response;
          });
        })
    );
  }
});
