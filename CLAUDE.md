# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Desarrollo local — sitio estático en localhost:8888
npm run dev      # alias de: npx netlify dev

# Poblar Firestore con productos/faqs/testimonios (solo primera vez)
# Requiere serviceAccountKey.json en la raíz (NO commitear)
npm run seed     # alias de: node seed-firestore.js

# Deploy: push a main → Netlify redeploya automáticamente
git push
```

No hay tests ni linter configurados.

## Arquitectura

Stack 100% gratuito y sin servidor propio. No hay pago electrónico ni precios visibles en el sitio: todo se cotiza por WhatsApp.

```
tallerkappa.com.ar (Netlify)
├── Frontend estático — HTML/CSS/JS vanilla, sin framework ni bundler
├── Firebase Firestore — base de datos accedida directo desde el browser via CDN SDK
└── Firebase Auth     — autenticación del panel admin
```

No hay funciones serverless (se eliminó `/api/checkout` y la integración con MercadoPago).

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
- Carrito lateral con estado en `sessionStorage` (key: `kappa-cart`), funciona como "presupuesto" sin precios
- Flujo de cotización: arma un link `wa.me` con el detalle del carrito y redirige a WhatsApp
- Toast de notificaciones, popup de WhatsApp (aparece tras 2 min de inactividad), botón back-to-top
- Botón "Descargar presupuesto" (genera PDF via `window.open`, sin precios — dice "A cotizar")

El carrito usa `sessionStorage` (se borra al cerrar el tab) intencionalmente para evitar presupuestos desactualizados.

## Flujo de cotización

1. Usuario arma su lista de productos en el carrito lateral (sin ver precios)
2. Al hacer clic en "Cotizar por WhatsApp", `partials.js` abre `wa.me` con el detalle del pedido
3. Francisco responde manualmente por WhatsApp con precio final y tiempo de entrega

No hay checkout ni pago electrónico en el sitio; `FireDB.createOrder()` (en `firebase-db.js`) y la colección `orders` quedaron sin uso en el frontend tras sacar MercadoPago.

## Panel admin (admin.html)

- Login con Firebase Auth (email + contraseña)
- El email admin está hardcodeado en `firestore.rules` como `ing.franciscomarotta@gmail.com`
- Para cambiar el email admin: editar `firestore.rules` y republicar las reglas en Firebase Console → Firestore → Reglas
- Lee `FireDB.getOrders()`, `FireDB.getStats()`, `FireDB.getUsers()` directamente desde el browser

## Firebase config

`firebase-config.js` contiene las API keys en texto plano — esto es correcto para el SDK web de Firebase (son claves públicas). La seguridad real está en `firestore.rules`. Para poner en marcha el proyecto, reemplazar los placeholders `REEMPLAZAR_CON_TU_API_KEY` con los valores del proyecto Firebase.

## Colecciones Firestore

| Colección | Quién lee | Quién escribe |
|-----------|-----------|---------------|
| `productos` | cualquiera | solo admin |
| `faqs` | cualquiera | solo admin |
| `testimonios` | cualquiera | solo admin |
| `contactos` | solo admin | cualquiera |
| `orders` | el dueño (por email) o admin | usuario auth + admin (sin uso desde el frontend; quedó de cuando existía checkout) |
| `users` | el propio user o admin | el propio user |
