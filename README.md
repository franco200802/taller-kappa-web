# 🔩 Taller Kappa — Web Oficial

Sitio web y portfolio para **Taller Kappa S.R.L.**, fábrica de muebles de hierro y cuero en San Martín, Buenos Aires. Fabricamos el Sillón BKF original con hierro macizo 12mm y cuero vacuno de primera selección.

No es un e-commerce: no se muestran precios ni hay pago online. Los pedidos se arman como un "presupuesto" en el carrito y se cotizan por WhatsApp.

🌐 **Sitio live:** [https://tallerkappa.com.ar](https://tallerkappa.com.ar)

---

## 🏗️ Arquitectura

Stack 100% gratuito, sin servidor propio:

```
tallerkappa.com.ar (GitHub Pages)
├── Frontend estático — HTML/CSS/JS vanilla, sin framework ni bundler
├── Firebase Firestore — base de datos, accedida directo desde el browser via CDN SDK
└── Firebase Auth      — solo para el login del panel admin
```

| Capa | Tecnología | Plan |
|------|-----------|------|
| Frontend + Hosting | GitHub Pages | Gratis |
| Base de datos | Firebase Firestore | Gratis (Spark) |
| Autenticación (admin) | Firebase Auth | Gratis |

No hay funciones serverless ni pasarela de pago: todo pedido se coordina por WhatsApp.

`server.js`, `models.js`, `seed.js` y `db.json` son restos del sistema anterior (Express + MongoDB) y **no se usan**.

---

## 📁 Estructura del proyecto

```
taller-kappa-web/
│
├── index.html          # Página principal (hero, catálogo, FAQ, testimonios)
├── catalogo.html       # Catálogo completo con filtros
├── sillon-bkf.html     # Landing SEO del Sillón BKF (keyword principal)
├── proyectos.html      # Portfolio: YPF, McDonald's, Burger King, Sandro, Shell
├── nosotros.html       # Historia y equipo
├── faq.html            # Preguntas frecuentes
├── envios.html         # Zonas y costos de envío
├── garantia.html       # Política de garantía y cuidados
├── contacto.html       # Formulario de contacto
├── admin.html          # Panel de administración (privado)
├── 404.html            # Página de error
│
├── styles.css          # Estilos globales + dark mode
├── pages.css           # Estilos de páginas internas
│
├── partials.js         # Navbar, footer, carrito/presupuesto (inyectados en todas las páginas)
├── script.js           # Lógica del catálogo, modal, FAQ, PWA
│
├── firebase-config.js  # Configuración Firebase (API keys públicas del SDK web)
├── firebase-db.js      # Operaciones CRUD sobre Firestore
├── firebase-auth.js    # Login del panel admin
├── firestore.rules     # Reglas de seguridad de Firestore
├── seed-firestore.js   # Script para poblar Firestore (solo primera vez)
│
├── CNAME               # Dominio personalizado para GitHub Pages
├── package.json         # Dependencias (solo firebase-admin, para el seed)
│
├── sw.js               # Service Worker (PWA, caché offline)
├── manifest.json       # Web App Manifest (instalable en móvil)
├── sitemap.xml         # Sitemap para Google Search Console
├── robots.txt          # Directivas para crawlers
│
└── images/             # Imágenes del sitio
```

---

## ⚡ Setup local

Ver [SETUP.md](./SETUP.md) para la guía completa paso a paso (crear proyecto Firebase, poblar Firestore, activar GitHub Pages, etc.).

Resumen rápido:

```bash
# Instalar dependencias
npm install

# Levantar el sitio en http://localhost:8888
npm run dev
```

No hace falta ningún archivo `.env` ni variable de entorno: no hay funciones serverless.

---

## 🔑 Panel de Administración

**URL:** `https://tallerkappa.com.ar/admin.html`

Login con Firebase Auth (email + contraseña). El email admin está hardcodeado en `firestore.rules`; para cambiarlo hay que editar ese archivo y republicar las reglas en Firebase Console.

### Funcionalidades del panel:
- Gestión de productos, FAQs y testimonios (colecciones `productos`, `faqs`, `testimonios`)
- Lectura de mensajes de contacto (`contactos`)
- Lectura de usuarios (`users`)

---

## 🛒 Flujo de cotización

```
1. Usuario navega el catálogo (sin ver precios)
2. Agrega productos al presupuesto (carrito lateral, guardado en sessionStorage)
3. Clic en "Cotizar por WhatsApp" → se abre WhatsApp con el detalle del pedido
4. Francisco responde manualmente con precio final y tiempo de entrega
```

También puede descargar un PDF del presupuesto (sin precios, dice "A cotizar") desde el carrito.

---

## 🚀 Deploy

El deploy es automático: cualquier push a `main` redeploya el sitio en GitHub Pages.

```bash
git add -A && git commit -m "descripción" && git push
```

---

## 🔍 SEO

- Schema.org: `LocalBusiness`, `Product`, `FAQPage`, `BreadcrumbList`
- `hreflang="es-AR"` en todas las páginas
- Sitemap en `/sitemap.xml`
- Keywords locales: Devoto, CABA, Zona Norte, GBA, San Martín
- Landing dedicada `/sillon-bkf.html` con schema `Product` completo (stock, reseñas)
- Imágenes con `loading="lazy"` y `alt` descriptivos
- FontAwesome cargado de forma no bloqueante (`rel="preload"`)

---

## 🛠️ Tecnologías usadas

**Frontend:**
- HTML5 semántico
- CSS3 (custom properties, grid, flexbox, dark mode)
- JavaScript ES6+ vanilla (sin frameworks ni bundler)
- PWA (Service Worker + Web App Manifest)

**Backend / datos:**
- Firebase Firestore (base de datos)
- Firebase Auth (login del panel admin)

**Infraestructura:**
- GitHub Pages (hosting + deploy automático)

---

## 📞 Contacto

**Taller Kappa S.R.L.**
- 📍 Calle 28 Nº 3779, Villa Chacabuco, San Martín, Buenos Aires
- 📱 WhatsApp: [11 6124-2498](https://wa.me/541161242498)
- 📧 ing.franciscomarotta@gmail.com
- 🌐 [tallerkappa.com.ar](https://tallerkappa.com.ar)

---

*Desarrollado por Franco Marotta — 2026*
