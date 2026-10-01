// El sitio estático anterior (antes de la migración a React, 14/09/2026)
// registraba un service worker en /sw.js con caché de /catalogo.html,
// /index.html, etc. Los visitantes recurrentes todavía lo tienen activo.
// Este archivo lo reemplaza por uno que borra las cachés, se da de baja y
// recarga la pestaña. Se puede eliminar pasados unos meses.
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    await Promise.all((await caches.keys()).map((key) => caches.delete(key)));
    await self.registration.unregister();
    for (const client of await self.clients.matchAll({ type: 'window' })) client.navigate(client.url);
  })());
});
