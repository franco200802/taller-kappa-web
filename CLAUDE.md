# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Desarrollo local — sitio + función de checkout en localhost:8888
npm run dev      # alias de: npx netlify dev

# Poblar Firestore con productos/faqs/testimonios (solo primera vez)
# Requiere serviceAccountKey.json en la raíz (NO commitear)
npm run seed     # alias de: node seed-firestore.js

# Deploy: push a main → Netlify redeploya automáticamente
git push
```

No hay tests ni linter configurados.

## Arquitectura

Stack 100% gratuito y sin servidor propio:

```
tallerkappa.com.ar (Netlify)
├── Frontend estático — HTML/CSS/JS vanilla, sin framework ni bundler
├── Firebase Firestore — base de datos accedida directo desde el browser via CDN SDK
├── Firebase Auth     — autenticación del panel admin
└── Netlify Function  — única función serverless: /api/checkout → MercadoPago
```

`server.js` y `models.js` son restos del sistema anterior (Express + MongoDB) y **no se usan**.

## Globals — cómo se comunican los archivos JS

No hay bundler. Cada HTML carga los scripts en orden y se comunican via `window`:

| Global | Archivo | Propósito |
|--------|---------|-----------|
| `db` | `firebase-config.js` | instancia Firestore |
| `auth` | `firebase-config.js` | instancia Firebase Auth |
| `FireDB` | `firebase-db.js` | CRUD de Firestore |
| `FireAuth` | `firebase-auth.js` | register / login / logout |
| `addToCartGlobal` | `partials.js` | agrega producto al carrito |
| `showToastGlobal` | `partials.js` | muestra toast |
| `partialChangeQty` | `partials.js` | cambia cantidad en carrito |
| `partialRemove` | `partials.js` | elimina item del carrito |

**Orden de carga requerido en cada HTML:**
```html
<script src="https://...firebase-app-compat.js"></script>
<script src="https://...firebase-firestore-compat.js"></script>
<script src="https://...firebase-auth-compat.js"></script>
<script src="firebase-config.js"></script>   <!-- inicializa db y auth -->
<script src="firebase-db.js"></script>
<script src="partials.js"></script>          <!-- navbar, cart, footer, toast -->
<script src="script.js"></script>            <!-- lógica específica de la página -->
```

## partials.js — el archivo más transversal

Se inyecta en **todas las páginas** vía `<script>` y es responsable de:
- Navbar + hamburguesa + active-page highlight
- Footer (solo en páginas internas; `index.html` tiene el suyo propio)
- Carrito lateral con estado en `sessionStorage` (key: `kappa-cart`)
- Formulario inline de datos del comprador (nombre/email/teléfono)
- Flujo completo de checkout: valida → `FireDB.createOrder()` → `POST /api/checkout` → redirige a MercadoPago
- Toast de notificaciones, popup de WhatsApp (aparece tras 2 min de inactividad), botón back-to-top
- Botón "Descargar presupuesto" (genera PDF via `window.open`)

El carrito usa `sessionStorage` (se borra al cerrar el tab) intencionalmente para evitar presupuestos desactualizados.

## Flujo de checkout

1. Usuario llena nombre/email/teléfono en el carrito lateral
2. `partials.js` llama `FireDB.createOrder()` → guarda orden en Firestore con `status: 'pending'`
3. `POST /api/checkout` → Netlify Function → crea preferencia en MercadoPago con `orderId` como `external_reference`
4. Usuario paga → MercadoPago redirige a `checkout-result.html?status=...&order=<orderId>`
5. Admin ve la orden en `admin.html` y la confirma manualmente

No hay webhook de MercadoPago; el estado de las órdenes se actualiza manualmente desde el panel.

## Panel admin (admin.html)

- Login con Firebase Auth (email + contraseña)
- El email admin está hardcodeado en `firestore.rules` como `ing.franciscomarotta@gmail.com`
- Para cambiar el email admin: editar `firestore.rules` y republicar las reglas en Firebase Console → Firestore → Reglas
- Lee `FireDB.getOrders()`, `FireDB.getStats()`, `FireDB.getUsers()` directamente desde el browser

## Firebase config

`firebase-config.js` contiene las API keys en texto plano — esto es correcto para el SDK web de Firebase (son claves públicas). La seguridad real está en `firestore.rules`. Para poner en marcha el proyecto, reemplazar los placeholders `REEMPLAZAR_CON_TU_API_KEY` con los valores del proyecto Firebase.

## Variables de entorno (Netlify)

Solo usadas por la función serverless `netlify/functions/checkout.js`:
- `MP_ACCESS_TOKEN` — token de MercadoPago
- `FRONTEND_URL` — `https://tallerkappa.com.ar` (para los `back_urls` del pago)

En local con `netlify dev`, se leen de `.env` en la raíz (no commitear).

## Colecciones Firestore

| Colección | Quién lee | Quién escribe |
|-----------|-----------|---------------|
| `productos` | cualquiera | solo admin |
| `faqs` | cualquiera | solo admin |
| `testimonios` | cualquiera | solo admin |
| `contactos` | solo admin | cualquiera |
| `orders` | el dueño (por email) o admin | usuario auth + admin |
| `users` | el propio user o admin | el propio user |
