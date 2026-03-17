/* ============================================
   TALLER KAPPA — Service Worker (PWA)
   Estrategia: Network-first con fallback a caché.
   Cada deploy actualiza CACHE_VERSION para invalidar todo.
   ============================================ */

const CACHE_VERSION = 'taller-kappa-v20260317';
const STATIC_CACHE  = `${CACHE_VERSION}-static`;

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
    '/images/favicon.ico',
    '/images/favicon-32.png',
    '/images/favicon-16.png',
];

/* --- Instalar: pre-cachear assets estáticos --- */
self.addEventListener('install', e => {
    e.waitUntil(
        caches.open(STATIC_CACHE).then(cache => {
            return Promise.allSettled(ASSETS.map(url => cache.add(url)));
        })
    );
    // Activa el nuevo SW inmediatamente sin esperar que cierren las pestañas
    self.skipWaiting();
});

/* --- Activar: eliminar cachés viejas --- */
self.addEventListener('activate', e => {
    e.waitUntil(
        caches.keys().then(keys =>
            Promise.all(
                keys
                    .filter(k => k !== STATIC_CACHE)
                    .map(k => {
                        console.log('[SW] Eliminando caché vieja:', k);
                        return caches.delete(k);
                    })
            )
        )
    );
    // Toma control de todas las pestañas abiertas inmediatamente
    self.clients.claim();
});

/* --- Fetch: Network-first, fallback a caché --- */
self.addEventListener('fetch', e => {
    if (e.request.method !== 'GET') return;

    // Solo manejar requests del mismo origen
    const url = new URL(e.request.url);
    if (url.origin !== location.origin) return;

    e.respondWith(
        fetch(e.request)
            .then(networkResponse => {
                // Si la red respondió bien, actualizar la caché con la versión nueva
                if (networkResponse && networkResponse.status === 200) {
                    const clone = networkResponse.clone();
                    caches.open(STATIC_CACHE).then(cache => cache.put(e.request, clone));
                }
                return networkResponse;
            })
            .catch(() => {
                // Sin red → intentar desde caché
                return caches.match(e.request).then(cached => {
                    return cached || caches.match('/index.html');
                });
            })
    );
});

/* --- Mensaje desde la página para forzar actualización --- */
self.addEventListener('message', e => {
    if (e.data === 'SKIP_WAITING') self.skipWaiting();
});
