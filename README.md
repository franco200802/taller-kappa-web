# 🔩 Taller Kappa — Web Oficial

Sitio web de e-commerce y portfolio para **Taller Kappa S.R.L.**, fábrica de muebles de hierro y cuero en San Martín, Buenos Aires. Fabricamos el Sillón BKF original con hierro macizo 12mm y cuero vacuno de primera selección.

🌐 **Sitio live:** [https://tallerkappa.com.ar](https://tallerkappa.com.ar)

---

## 🏗️ Arquitectura

```
Frontend (GitHub Pages)  ←→  Backend (Render)  ←→  MongoDB Atlas
tallerkappa.com.ar             Render.com free          Atlas free tier
```

| Capa | Tecnología | Hosting | Plan |
|------|-----------|---------|------|
| Frontend | HTML + CSS + JS vanilla | GitHub Pages | Gratis |
| Backend | Node.js + Express | Render.com | Free tier |
| Base de datos | MongoDB | Atlas | Free (512 MB) |
| Pagos | MercadoPago SDK | — | Producción |
| DNS / CDN | Cloudflare | Cloudflare | Free |

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
├── faq.html            # Preguntas frecuentes (14 preguntas en 4 categorías)
├── envios.html         # Zonas y costos de envío
├── garantia.html       # Política de garantía y cuidados
├── contacto.html       # Formulario de contacto
├── checkout-result.html# Página post-pago de MercadoPago
├── admin.html          # Panel de administración (privado)
├── 404.html            # Página de error
│
├── styles.css          # Estilos globales + dark mode
├── pages.css           # Estilos de páginas internas
│
├── partials.js         # Navbar, footer, carrito, auth modal (inyectados en todas las páginas)
├── script.js           # Lógica del catálogo, modal, FAQ, formularios, PWA
│
├── server.js           # Backend Express (API REST)
├── models.js           # Modelos Mongoose (Product, Order, User, FAQ, etc.)
├── seed.js             # Poblar la base de datos con productos iniciales
│
├── sw.js               # Service Worker (PWA, caché offline)
├── manifest.json       # Web App Manifest (instalable en móvil)
├── sitemap.xml         # Sitemap para Google Search Console
├── robots.txt          # Directivas para crawlers
├── CNAME               # Dominio personalizado para GitHub Pages
│
└── images/             # Imágenes del sitio
```

---

## ⚡ Setup local

### Requisitos
- Node.js 18+
- MongoDB Atlas (cuenta gratuita en [cloud.mongodb.com](https://cloud.mongodb.com))
- Cuenta MercadoPago con token de producción

### 1. Instalar dependencias
```bash
npm install
```

### 2. Configurar variables de entorno
Crear un archivo `.env` en la raíz:
```env
MONGODB_URI=mongodb+srv://<user>:<pass>@cluster0.xxxxx.mongodb.net/tallerkappa
MP_ACCESS_TOKEN=APP_USR-xxxxx
FRONTEND_URL=http://localhost:3000
JWT_SECRET=un-secreto-largo-y-aleatorio
ADMIN_USER=Franco Marotta
ADMIN_PASS=TuContraseña
```

### 3. Poblar la base de datos (primera vez)
```bash
node seed.js
```

### 4. Iniciar el servidor
```bash
node server.js
```

El servidor corre en `http://localhost:3000`

---

## 🔑 Panel de Administración

**URL:** `https://tallerkappa.com.ar/admin.html`

| Campo | Valor |
|-------|-------|
| Usuario | `Franco Marotta` |
| Contraseña | Configurada en Render → Environment Variables |

### Funcionalidades del panel:
- 📊 **Estadísticas** — pedidos totales, pagados, pendientes, facturación
- 📋 **Pedidos** — filtrar por estado, confirmar envíos, rechazar, agregar notas
- 👥 **Clientes** — lista de usuarios registrados con email y teléfono

---

## 🛒 Flujo de compra

```
1. Usuario navega el catálogo
2. Agrega productos al presupuesto (carrito lateral)
3. Clic en "Pagar con MercadoPago"
4. Si no está logueado → modal de Login/Registro
5. Checkout → redirige a MercadoPago
6. MercadoPago paga → webhook actualiza la orden en MongoDB
7. Admin ve la orden como "Pagado" en el panel
8. Admin confirma y coordina el envío
```

---

## 👤 Sistema de usuarios

Los clientes pueden **registrarse e iniciar sesión** directamente desde el sitio.

- Sesión guardada en `localStorage` (persiste entre visitas)
- Al registrarse: nombre, email, teléfono, contraseña (hasheada con bcrypt)
- El nombre del usuario aparece en el navbar cuando está logueado
- Token JWT con expiración de 30 días

---

## 🚀 Deploy

### Frontend (GitHub Pages)
El sitio se publica automáticamente desde la rama `main` del repositorio `franco200802/taller-kappa-web`.

```bash
git add -A && git commit -m "descripción" && git push
```

GitHub Pages publica en ~1 minuto. Cloudflare propaga en segundos.

### Backend (Render)
El servidor está en [Render.com](https://render.com). Se redeploya automáticamente al hacer push a `main`.

**Variables de entorno en Render:**
- `MONGODB_URI`
- `MP_ACCESS_TOKEN`
- `FRONTEND_URL` → `https://tallerkappa.com.ar`
- `JWT_SECRET`
- `ADMIN_USER`
- `ADMIN_PASS`

> ⚠️ **Plan gratuito de Render:** el servidor se apaga tras 15 minutos sin uso. Al entrar al sitio se manda un ping automático para despertarlo antes de que el usuario interactúe.

---

## 🔍 SEO

- Schema.org: `LocalBusiness`, `Product`, `FAQPage`, `BreadcrumbList`, `ItemList`
- `hreflang="es-AR"` en todas las páginas
- Sitemap en `/sitemap.xml`
- Keywords locales: Devoto, CABA, Zona Norte, GBA, San Martín
- Landing dedicada `/sillon-bkf.html` con schema `Product` completo (precio, stock, reseñas)
- Imágenes con `loading="lazy"` y `alt` descriptivos
- FontAwesome cargado de forma no bloqueante (`rel="preload"`)

---

## 📡 API REST (Backend)

| Método | Ruta | Descripción |
|--------|------|-------------|
| `GET` | `/api/productos` | Listar productos (query: `?category=asientos`) |
| `GET` | `/api/productos/:id` | Producto por ID |
| `GET` | `/api/ping` | Wake-up del servidor |
| `POST` | `/api/checkout` | Crear preferencia MercadoPago |
| `GET` | `/api/orders/:id` | Estado de una orden |
| `POST` | `/api/webhooks/mercadopago` | Webhook de pagos |
| `POST` | `/api/users/register` | Registrar usuario |
| `POST` | `/api/users/login` | Iniciar sesión |
| `GET` | `/api/users/me` | Datos del usuario logueado |
| `GET` | `/api/users/my-orders` | Pedidos del usuario |
| `GET` | `/api/admin/orders` | Listar órdenes (admin) |
| `PATCH` | `/api/admin/orders/:id` | Cambiar estado / notas (admin) |
| `GET` | `/api/admin/stats` | Estadísticas (admin) |
| `GET` | `/api/admin/users` | Lista de usuarios (admin) |
| `POST` | `/api/admin/login` | Login del administrador |

---

## 🛠️ Tecnologías usadas

**Frontend:**
- HTML5 semántico
- CSS3 (custom properties, grid, flexbox, dark mode)
- JavaScript ES6+ vanilla (sin frameworks)
- PWA (Service Worker + Web App Manifest)

**Backend:**
- Node.js + Express
- Mongoose + MongoDB Atlas
- MercadoPago SDK v2
- bcryptjs (hashing de contraseñas)
- jsonwebtoken (autenticación)

**Infraestructura:**
- GitHub Pages (hosting frontend)
- Render.com (hosting backend)
- MongoDB Atlas (base de datos)
- Cloudflare (DNS, CDN, HTTPS)

---

## 📞 Contacto

**Taller Kappa S.R.L.**
- 📍 Calle 28 Nº 3779, Villa Chacabuco, San Martín, Buenos Aires
- 📱 WhatsApp: [11 6124-2498](https://wa.me/541161242498)
- 📧 ing.franciscomarotta@gmail.com
- 🌐 [tallerkappa.com.ar](https://tallerkappa.com.ar)

---

*Desarrollado por Franco Marotta — 2026*
