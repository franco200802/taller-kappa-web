# 🔩 Taller Kappa — Web Oficial v2

Sitio web de e-commerce para **Taller Kappa S.R.L.**, fábrica de muebles de hierro y cuero en San Martín, Buenos Aires.

🌐 **Sitio live:** [https://tallerkappa.com.ar](https://tallerkappa.com.ar)

---

## 🏗️ Arquitectura v2 (100% gratuita)

```
tallerkappa.com.ar (GitHub Pages)
│
├── Frontend (HTML/CSS/JS) → se sirve estático desde GitHub Pages
├── Firebase Firestore    → base de datos (directo desde el browser)
└── Firebase Auth         → login del panel admin
```

No hay pago electrónico ni funciones serverless: todo pedido se cotiza por WhatsApp.

| Capa | Tecnología | Plan |
|------|-----------|------|
| Frontend + Hosting | GitHub Pages | **Gratis** |
| Base de datos | Firebase Firestore | **Gratis** (Spark: 50K reads/día) |
| Autenticación | Firebase Auth | **Gratis** (50K users/mes) |

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
├── CNAME                   # Dominio personalizado para GitHub Pages
├── package.json            # Dependencias (solo firebase-admin)
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

### Paso 8: Activar GitHub Pages (2 min)

1. En GitHub → repo `franco200802/taller-kappa-web` → **Settings** → **Pages**
2. **Source:** Deploy from a branch → rama `main`, carpeta `/ (root)`
3. Guardar. GitHub va a publicar el sitio en `https://franco200802.github.io/taller-kappa-web/`
4. El dominio custom ya está seteado por el archivo `CNAME` en la raíz del repo (contiene `tallerkappa.com.ar`)

### Paso 9: Dominio personalizado — DNS (5 min + propagación)

En tu proveedor de DNS (Cloudflare, NIC.ar, etc.), configurar:

| Tipo | Host | Valor |
|------|------|-------|
| A | `@` | `185.199.108.153` |
| A | `@` | `185.199.109.153` |
| A | `@` | `185.199.110.153` |
| A | `@` | `185.199.111.153` |
| CNAME | `www` | `franco200802.github.io` |

> **Si usás Cloudflare:** poné el proxy en "DNS only" (nube gris) mientras GitHub verifica el dominio y emite el certificado SSL; después podés volver a activar el proxy si querés.

Una vez que el DNS propaga (puede tardar de minutos a algunas horas), en GitHub → Settings → Pages vas a ver el dominio verificado y vas a poder tildar **"Enforce HTTPS"**.

---

## 🔐 Login del Panel Admin

Entrá a `tallerkappa.com.ar/admin.html` con:
- **Email:** el que registraste en Firebase Auth (paso 6)
- **Contraseña:** la que elegiste en Firebase Auth

---

## 🚀 Deploy — Flujo cotidiano

El deploy es **automático**: cualquier push a `main` redeploya el sitio en GitHub Pages en menos de un minuto.

```bash
# Editás un archivo, por ejemplo styles.css, y luego:
git add styles.css
git commit -m "descripción del cambio"
git push
```

GitHub Pages detecta el push y redeploya solo. Podés ver el estado en la pestaña **Actions** del repo o en Settings → Pages.

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
# Instalar dependencias
npm install

# Levantar el sitio en http://localhost:8888
npm run dev
```

---

## 📝 Resumen de servicios y links

| Servicio | Link | Para qué |
|----------|------|----------|
| Firebase Console | [console.firebase.google.com](https://console.firebase.google.com) | DB + Auth |
| GitHub | [github.com/franco200802/taller-kappa-web](https://github.com/franco200802/taller-kappa-web) | Código fuente + Hosting (Pages) |

---

## 🔧 Troubleshooting

| Síntoma | Causa probable | Solución |
|---------|---------------|----------|
| Firestore "permission denied" en browser | Las reglas de Firestore no están publicadas | Firebase Console → Firestore → Reglas → Publicar |
| Los productos no cargan | `firebase-config.js` tiene placeholders | Reemplazar los valores con los del proyecto Firebase |
| El Service Worker sirve contenido viejo | Cache del SW no se invalidó | Actualizar `CACHE_VERSION` en `sw.js` con la fecha actual |
| El dominio no verifica en Settings → Pages | El DNS todavía no propagó, o los A records/CNAME no coinciden con los de GitHub Pages | Revisar los registros DNS (ver Paso 9) y esperar propagación |
| Sitio no actualiza tras un push | El workflow de Pages falló | Repo → pestaña **Actions**, ver el log del deploy |

> Nota: GitHub Pages no soporta headers ni redirects custom (a diferencia de Netlify). El único "redirect" que existe es el `404.html` de la raíz, que GitHub sirve automáticamente para rutas inexistentes.

---

## ❌ Ya NO se necesita

- ~~Render.com~~ → reemplazado por Firebase + GitHub Pages
- ~~Netlify~~ → reemplazado por GitHub Pages (ya no hay funciones serverless que justifiquen Netlify)
- ~~MongoDB Atlas~~ → reemplazado por Firebase Firestore
- ~~Express / Node server~~ → reemplazado por Firebase SDK directo
- ~~MercadoPago~~ → reemplazado por cotización directa por WhatsApp

---

## 💰 Límites del plan gratuito

| Servicio | Límite gratis | Tu uso estimado |
|----------|---------------|-----------------|
| GitHub Pages | 100 GB bandwidth/mes, 10 builds/hora | ~1 GB |
| Firestore reads | 50,000/día | ~500 |
| Firestore writes | 20,000/día | ~50 |
| Firebase Auth | 50,000 users/mes | ~10 |

**Conclusión:** No vas a pagar nunca con este nivel de tráfico.
