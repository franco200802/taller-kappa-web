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
| `MP_ACCESS_TOKEN` | Tu Access Token de MercadoPago (ver abajo) |
| `FRONTEND_URL` | `https://tallerkappa.com.ar` |

**Dónde encontrar el `MP_ACCESS_TOKEN`:**
1. Entrá a [mercadopago.com.ar/developers/panel](https://www.mercadopago.com.ar/developers/panel)
2. Tu aplicación → **Credenciales de producción**
3. Copiá el valor de **Access Token** (empieza con `APP_USR-...`)

> ⚠️ Nunca pongas el token en el código ni en documentos del repositorio.

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

## 🚀 Deploy — Flujo cotidiano

El deploy es **automático**: cualquier push a `main` redeploya el sitio en Netlify en ~30 segundos.

```bash
# Editás un archivo, por ejemplo styles.css, y luego:
git add styles.css
git commit -m "descripción del cambio"
git push
```

Netlify detecta el push y redeploya solo. Podés ver el estado en [app.netlify.com](https://app.netlify.com).

### Checklist antes de hacer push a producción

- [ ] Actualizar la versión en las URLs de CSS/JS (`?v=YYYYMMDD`) en todos los HTML y en `sw.js`
- [ ] Verificar que no hay tokens ni secrets en el código
- [ ] Probar el flujo completo localmente con `npm run dev`
- [ ] Si cambiaste `firestore.rules`: republicar manualmente en Firebase Console → Firestore → Reglas

### Actualizar reglas de Firestore

Las reglas **no se deployean con el push de git** — hay que subirlas a mano:

1. Firebase Console → **Firestore Database** → **Reglas**
2. Pegás el contenido actualizado de `firestore.rules`
3. Clic en **Publicar**

---

## 🛠️ Desarrollo local

```bash
# Primera vez: crear .env copiando el ejemplo
cp .env.example .env
# Editar .env con el MP_ACCESS_TOKEN real

# Instalar dependencias
npm install

# Instalar Netlify CLI (para probar la función de checkout localmente)
npm install -g netlify-cli

# Levantar el sitio con funciones serverless en http://localhost:8888
npm run dev
```

**Variables necesarias en `.env` para desarrollo:**
- `MP_ACCESS_TOKEN`: podés usar credenciales de prueba de MercadoPago (empiezan con `TEST-`)
- `FRONTEND_URL`: `http://localhost:8888`

> El archivo `.env` está en `.gitignore` y nunca se sube a GitHub.

---

## 📝 Resumen de servicios y links

| Servicio | Link | Para qué |
|----------|------|----------|
| Firebase Console | [console.firebase.google.com](https://console.firebase.google.com) | DB + Auth |
| Netlify | [app.netlify.com](https://app.netlify.com) | Hosting + Functions |
| MercadoPago Developers | [mercadopago.com.ar/developers](https://www.mercadopago.com.ar/developers/panel) | Token de pagos |
| GitHub | [github.com/franco200802/taller-kappa-web](https://github.com/franco200802/taller-kappa-web) | Código fuente |

---

## 🔧 Troubleshooting

| Síntoma | Causa probable | Solución |
|---------|---------------|----------|
| El checkout no redirige a MercadoPago | `MP_ACCESS_TOKEN` no configurado en Netlify | Site settings → Environment variables → agregar el token → Redeploy |
| Firestore "permission denied" en browser | Las reglas de Firestore no están publicadas | Firebase Console → Firestore → Reglas → Publicar |
| Los productos no cargan | `firebase-config.js` tiene placeholders | Reemplazar los valores con los del proyecto Firebase |
| El Service Worker sirve contenido viejo | Cache del SW no se invalidó | Actualizar `CACHE_VERSION` en `sw.js` con la fecha actual |
| `netlify dev` no levanta la función | Falta el `.env` con `MP_ACCESS_TOKEN` | Crear `.env` desde `.env.example` y completarlo |
| Error 404 en páginas internas | No existe `_redirects` o problema con toml | Verificar que `netlify.toml` tiene el redirect `/* → /404.html` con status 404 |

---

## ❌ Ya NO se necesita

- ~~Render.com~~ → reemplazado por Netlify Functions
- ~~MongoDB Atlas~~ → reemplazado por Firebase Firestore
- ~~Express / Node server~~ → reemplazado por Firebase SDK directo

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
