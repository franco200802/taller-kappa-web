# 🔩 Taller Kappa — Web Oficial v2

Sitio web de e-commerce para **Taller Kappa S.R.L.**, fábrica de muebles de hierro y cuero en San Martín, Buenos Aires.

🌐 **Sitio live:** [https://tallerkappa.com.ar](https://tallerkappa.com.ar)

---

## 🏗️ Arquitectura v2 (100% gratuita)

```
tallerkappa.com.ar (Netlify)
│
├── Frontend (HTML/CSS/JS) → se sirve estático desde Netlify
├── Firebase Firestore    → base de datos (directo desde el browser)
├── Firebase Auth         → registro y login de usuarios
└── Netlify Function      → 1 sola función para MercadoPago checkout
```

| Capa | Tecnología | Plan |
|------|-----------|------|
| Frontend + Hosting | Netlify | **Gratis** (100GB/mes) |
| Base de datos | Firebase Firestore | **Gratis** (Spark: 50K reads/día) |
| Autenticación | Firebase Auth | **Gratis** (50K users/mes) |
| Pagos | MercadoPago via Netlify Function | **Gratis** (125K invocaciones/mes) |

**Costo mensual total: $0**

---

## 📁 Estructura del proyecto

```
taller-kappa-web/
├── index.html              # Página principal
├── catalogo.html           # Catálogo con filtros
├── sillon-bkf.html         # Landing SEO Sillón BKF
├── proyectos.html          # Portfolio
├── nosotros.html           # Historia
├── faq.html                # Preguntas frecuentes
├── envios.html             # Info de envíos
├── garantia.html           # Garantía
├── contacto.html           # Formulario
├── checkout-result.html    # Post-pago
├── admin.html              # Panel admin
├── 404.html                # Error
│
├── styles.css              # Estilos globales
├── pages.css               # Estilos páginas internas
├── partials.js             # Navbar, footer, carrito
├── script.js               # Lógica principal
│
├── firebase-config.js      # 🔥 Configuración Firebase (API keys públicas)
├── firebase-db.js          # 🔥 Operaciones Firestore (CRUD)
├── firebase-auth.js        # 🔥 Autenticación
├── firestore.rules         # 🔥 Reglas de seguridad
├── seed-firestore.js       # 🔥 Script para poblar Firestore (se ejecuta 1 vez)
│
├── netlify.toml            # Configuración de Netlify
├── netlify/functions/
│   └── checkout.js         # Función serverless para MercadoPago
│
├── package.json            # Dependencias (solo mercadopago + firebase-admin)
├── sw.js                   # Service Worker (PWA)
├── manifest.json           # Web App Manifest
├── sitemap.xml             # SEO
└── images/                 # Imágenes
```

---

## ⚡ SETUP COMPLETO — Paso a paso

### Paso 1: Crear proyecto en Firebase (5 min)

1. Ir a **[console.firebase.google.com](https://console.firebase.google.com)**
2. Clic en **"Crear un proyecto"**
   - Nombre: `taller-kappa`
   - Google Analytics: podés desactivarlo (no lo necesitás)
3. Esperar a que se cree

### Paso 2: Activar Firestore (2 min)

1. En el menú lateral → **Firestore Database**
2. Clic en **"Crear base de datos"**
3. Seleccionar **"Modo de producción"**
4. Ubicación: `southamerica-east1` (São Paulo, la más cercana)
5. Clic en **"Crear"**

### Paso 3: Activar Authentication (2 min)

1. En el menú lateral → **Authentication**
2. Clic en **"Comenzar"**
3. Pestaña **"Sign-in method"** → Habilitar **"Correo electrónico/contraseña"**
4. Guardar

### Paso 4: Registrar app web en Firebase (2 min)

1. En la pantalla principal del proyecto → clic en el ícono **`</>`** (Web)
2. Nombre: `taller-kappa-web`
3. **NO** marcar Firebase Hosting
4. Clic en **"Registrar app"**
5. Te va a mostrar un bloque así:

```javascript
const firebaseConfig = {
    apiKey: "AIzaSy...",
    authDomain: "taller-kappa.firebaseapp.com",
    projectId: "taller-kappa",
    storageBucket: "taller-kappa.appspot.com",
    messagingSenderId: "123456789",
    appId: "1:123456789:web:abcdef"
};
```

6. **Copiá esos valores** y pegálos en el archivo `firebase-config.js` del proyecto

### Paso 5: Subir reglas de Firestore (2 min)

1. En Firebase Console → **Firestore Database** → pestaña **"Reglas"**
2. Reemplazar todo el contenido con el contenido del archivo `firestore.rules`
3. Clic en **"Publicar"**

> ⚠️ **IMPORTANTE:** En `firestore.rules` está hardcodeado tu email de admin:
> `request.auth.token.email == 'ing.franciscomarotta@gmail.com'`
> Si querés usar otro email, cambialo ahí.

### Paso 6: Crear tu usuario admin en Firebase Auth (1 min)

1. En Firebase Console → **Authentication** → pestaña **"Users"**
2. Clic en **"Agregar usuario"**
3. Email: `ing.franciscomarotta@gmail.com` (el mismo que está en las reglas)
4. Contraseña: la que quieras (la usás para entrar al panel admin)

### Paso 7: Poblar la base de datos (3 min)

1. En Firebase Console → **Configuración del proyecto** (⚙️) → **Cuentas de servicio**
2. Clic en **"Generar nueva clave privada"** → se descarga un JSON
3. Renombrar ese archivo a `serviceAccountKey.json` y moverlo a la raíz del proyecto
4. Ejecutar:

```bash
npm install
node seed-firestore.js
```

5. Verificar en Firebase Console → Firestore que aparecen las colecciones: `productos`, `faqs`, `testimonios`

### Paso 8: Configurar Netlify (5 min)

1. Ir a **[app.netlify.com](https://app.netlify.com)** → Crear cuenta (gratis, con GitHub)
2. Clic en **"Add new site"** → **"Import an existing project"**
3. Seleccionar GitHub → repo `franco200802/taller-kappa-web`
4. Configuración de build:
   - **Build command:** (dejarlo vacío)
   - **Publish directory:** `.`
5. Clic en **"Deploy"**

### Paso 9: Variables de entorno en Netlify (2 min)

1. En Netlify → tu sitio → **Site settings** → **Environment variables**
2. Agregar:

| Key | Value |
|-----|-------|
| `MP_ACCESS_TOKEN` | `APP_USR-1999436599991327-051814-f390e47b2fe438f7090e8baa1b1ac080-1064216624` |
| `FRONTEND_URL` | `https://tallerkappa.com.ar` |

3. Hacer **redeploy** desde Netlify → Deploys → Trigger deploy

### Paso 10: Dominio personalizado en Netlify (5 min)

1. En Netlify → **Domain settings** → **Add custom domain**
2. Agregar `tallerkappa.com.ar`
3. En tu proveedor de DNS (Cloudflare, NIC.ar, etc.) crear:
   - **CNAME** `@` → `tu-sitio-netlify.netlify.app`
   - O los registros que Netlify te indique
4. Esperar propagación DNS (puede tardar 5-30 min)

> **Si usás Cloudflare:** En el registro DNS poné el proxy en "DNS only" (nube gris) para que funcione el SSL de Netlify.

---

## 🔐 Login del Panel Admin

Entrá a `tallerkappa.com.ar/admin.html` con:
- **Email:** el que registraste en Firebase Auth (paso 6)
- **Contraseña:** la que elegiste en Firebase Auth

---

## 🛠️ Desarrollo local

```bash
# Instalar dependencias
npm install

# Instalar Netlify CLI (para probar la función de checkout localmente)
npm install -g netlify-cli

# Levantar el sitio con funciones serverless
netlify dev
```

El sitio se abre en `http://localhost:8888` con la función de checkout funcionando.

---

## 📝 Resumen de servicios y links

| Servicio | Link | Para qué |
|----------|------|----------|
| Firebase Console | [console.firebase.google.com](https://console.firebase.google.com) | DB + Auth |
| Netlify | [app.netlify.com](https://app.netlify.com) | Hosting + Functions |
| MercadoPago Developers | [mercadopago.com.ar/developers](https://www.mercadopago.com.ar/developers/panel) | Token de pagos |
| GitHub | [github.com/franco200802/taller-kappa-web](https://github.com/franco200802/taller-kappa-web) | Código fuente |

---

## ❌ Ya NO se necesita

- ~~Render.com~~ → reemplazado por Netlify Functions
- ~~MongoDB Atlas~~ → reemplazado por Firebase Firestore
- ~~Express / Node server~~ → reemplazado por Firebase SDK directo
- ~~server.js~~ → eliminado
- ~~models.js~~ → eliminado (Firestore no necesita schemas)

---

## 💰 Límites del plan gratuito

| Servicio | Límite gratis | Tu uso estimado |
|----------|---------------|-----------------|
| Netlify hosting | 100 GB bandwidth/mes | ~1 GB |
| Netlify functions | 125,000 invocaciones/mes | ~100 |
| Firestore reads | 50,000/día | ~500 |
| Firestore writes | 20,000/día | ~50 |
| Firebase Auth | 50,000 users/mes | ~10 |

**Conclusión:** No vas a pagar nunca con este nivel de tráfico.
