/* ============================================
   TALLER KAPPA — Service Worker (PWA)
   ============================================ */

const CACHE_NAME = 'taller-kappa-v1';
const ASSETS = [
    '/',
    '/index.html',
    '/styles.css',
    '/script.js',
    '/manifest.json',
    '/images/bkf1.png',
    '/images/bkfapoyapies.png',
    '/images/mesa.jpeg',
    '/images/burguerlogo.png',
    '/images/mcdonaldslogo.png',
    '/images/shelllogo.png',
    '/images/sandrologo.png',
    '/images/logoypf.png',
    '/images/favicon.jpg'
];

// Instalar: guardar assets en caché
self.addEventListener('install', e => {
    e.waitUntil(
        caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
    );
    self.skipWaiting();
});

// Activar: limpiar cachés viejas
self.addEventListener('activate', e => {
    e.waitUntil(
        caches.keys().then(keys =>
            Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
        )
    );
    self.clients.claim();
});

// Fetch: cache-first para assets, network-first para el resto
self.addEventListener('fetch', e => {
    if (e.request.method !== 'GET') return;
    e.respondWith(
        caches.match(e.request).then(cached => {
            if (cached) return cached;
            return fetch(e.request).then(res => {
                if (res && res.status === 200) {
                    const clone = res.clone();
                    caches.open(CACHE_NAME).then(c => c.put(e.request, clone));
                }
                return res;
            }).catch(() => caches.match('/index.html'));
        })
    );
});
