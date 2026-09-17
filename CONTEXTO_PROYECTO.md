# Contexto del proyecto — Taller Kappa (tallerkappa.com.ar)

> Este archivo existe para que cualquier persona (o su Copilot/IA) que se sume
> a trabajar en este repo tenga contexto completo en segundos, sin tener que
> releer todo el historial de conversación. Actualizalo si el proyecto cambia
> de forma importante.

## 1. Qué es este proyecto

Sitio web de **Taller Kappa**, una fábrica de muebles de hierro y cuero
(San Martín, Buenos Aires, Argentina). Producto insignia: el **Sillón BKF**
(silla paleta / butterfly chair). También fabrican bancos BKF y bases de
mesa. Clientes reales: locales de YPF, McDonald's, Burger King, Shell.

El sitio funciona **a cotización por WhatsApp** — no hay precios ni pasarela
de pago online. El "carrito" es en realidad un armador de presupuesto que
termina en un link de WhatsApp con el detalle del pedido.

- **Dominio productivo**: https://tallerkappa.com.ar
- **Hosting**: GitHub Pages (repo público, branch `main`, carpeta `dist/`
  generada por build — ver `CNAME` en la raíz).
- **Owner del repo**: `franco200802`

## 2. Stack técnico

- **React 18.3.1** + **Vite 5.4.x** (SPA con code-splitting por ruta vía
  `React.lazy`).
- **react-router-dom v6** (`BrowserRouter` en cliente, `StaticRouter` en
  build-time para el prerender).
- **react-helmet-async** para meta tags / SEO por página.
- **Firebase** (`firebase/auth` + `firebase/firestore`, SDK modular) — usado
  para: panel Admin (login), catálogo dinámico de productos, testimonios,
  FAQs, y guardar leads del formulario de contacto.
  - ⚠️ **Estado actual: NO configurado con credenciales reales** (ver
    sección "Problemas conocidos" más abajo). El sitio funciona igual
    gracias a datos de fallback hardcodeados en el código.
- **anime.js v4** para animaciones de scroll-reveal (import dinámico, no
  bloquea el render inicial).
- **Google Analytics 4** — integración custom hecha a mano en
  `src/lib/analytics.js` (no es el snippet de gtag.js pegado directo, ni
  Google Tag Manager). Measurement ID real: `G-2FDMN51XDY`.
- **SSG/Prerender propio**: no se usa Next.js ni ningún framework de SSG.
  Hay un pipeline manual (`scripts/prerender.js`) que:
  1. Corre `vite build` (bundle cliente) y `vite build --ssr` (bundle
     servidor de Node, solo para build time).
  2. Renderiza cada ruta pública a un string HTML con
     `renderToString` + `StaticRouter`.
  3. Inyecta los tags que `react-helmet-async` recolectó (title,
     description, canonical, JSON-LD) en el `index.html` que generó Vite.
  4. Escribe `dist/<ruta>/index.html` para cada URL pública real.
  5. Genera `dist/404.html` (fallback de GitHub Pages para rutas no
     prerenderizadas, con `noindex`).
  - Resultado esperado de `npm run build`: **"12 rutas + 404.html"**
    sin errores ni warnings. Si ese número cambia sin que vos hayas
    agregado/quitado una página, algo se rompió.

## 3. Estructura de carpetas relevante

```
taller-kappa-web/                  (raíz del repo)
├── CNAME                          (dominio custom de GitHub Pages)
├── react-app/                     (todo el código fuente vive acá)
│   ├── src/
│   │   ├── main.jsx               (entry point: hydrate o mount según haya HTML)
│   │   ├── App.jsx                (providers: Helmet, Cart, Router)
│   │   ├── AppRoutes.jsx          (árbol de <Routes>, compartido cliente/SSR)
│   │   ├── routes.js              (FUENTE ÚNICA de rutas — ver sección 4)
│   │   ├── entry-server.jsx       (renderToString para el prerender)
│   │   ├── components/
│   │   │   ├── Layout.jsx         (shell: Navbar+Outlet+Footer+CartDrawer+WA flotante)
│   │   │   ├── Navbar.jsx, Footer.jsx, CartDrawer.jsx, Toast.jsx
│   │   │   ├── Picture.jsx        (<picture> con fallback a .webp)
│   │   │   └── Seo.jsx            (meta tags + JSON-LD por página)
│   │   ├── context/
│   │   │   └── CartContext.jsx    (carrito/presupuesto, persiste en sessionStorage)
│   │   ├── pages/                 (una página por ruta, ver routes.js)
│   │   ├── data/
│   │   │   └── products.js        (fuente única de verdad de productos)
│   │   ├── lib/
│   │   │   ├── analytics.js       (GA4 custom, SSR-safe)
│   │   │   ├── firebase.js        (init de Firebase — credenciales placeholder!)
│   │   │   ├── firedb.js          (capa de acceso a Firestore)
│   │   │   ├── useReveal.js       (scroll-reveal con anime.js)
│   │   │   └── useAutoReveal.js   (reveal automático de secciones heredadas del CSS viejo)
│   │   └── styles/
│   │       └── global.css         (TODO el CSS del sitio vive en este único archivo, ~3100 líneas)
│   └── scripts/
│       └── prerender.js           (genera el HTML estático, ver sección 2)
```

## 4. Cómo se agregan/modifican rutas (`routes.js`)

`src/routes.js` es la **fuente única de verdad** de las rutas. La usan 3
consumidores distintos que por eso nunca pueden divergir:

1. `App.jsx` (cliente) → arma rutas con `React.lazy()`.
2. `entry-server.jsx` → resuelve los módulos de forma *eager* (necesario
   porque `renderToString` no puede esperar un `lazy()`).
3. `scripts/prerender.js` → decide qué URLs escribir a disco.

Si necesitás agregar una página nueva:
1. Creá el componente en `src/pages/NombrePagina.jsx`.
2. Agregalo a `PAGE_LOADERS` en `routes.js` (el `import()` dinámico).
3. Agregalo a `ROUTES` con su `path` y `prerender: true` (o `false` si es
   privada/dinámica, como `/admin` o `/catalogo/:slug`).
4. Corré `npm run build` y verificá que aparezca en el conteo final.

Los productos del catálogo tienen URL propia (`/catalogo/:slug`), generada
automáticamente a partir de `PRODUCTS` en `data/products.js` — no hace
falta tocar `routes.js` para agregar un producto nuevo, solo `products.js`.

## 5. Convenciones y patrones establecidos

- **Todo el CSS vive en un solo archivo**: `src/styles/global.css`. Está
  organizado en secciones numeradas con comentarios tipo
  `/* == 15. CARRITO LATERAL == */`. Antes de crear un componente con estilos
  nuevos, buscá si ya existe una sección relacionada.
- **Mobile-first no, pero sí con múltiples breakpoints**: hay reglas
  repetidas en distintos `@media` (`max-width: 480px`, `481-768px`,
  `max-width: 768px`, `769-1024px`, etc.) que a veces se pisan entre sí por
  orden de cascada. **Cuidado**: ya encontramos casos donde una regla en un
  breakpoint posterior sobreescribía sin querer una corrección hecha en un
  breakpoint anterior (ej. `.color-swatch` se achicaba más en mobile que en
  desktop). Si tocás algo responsive, buscá TODAS las apariciones de esa
  clase con grep antes de asumir que solo hay una definición.
- **Analytics (GA4) manual en cada CTA**: cada botón/link de WhatsApp o
  acción de conversión importante llama a `trackEvent(nombre, params)` de
  `lib/analytics.js`. Si agregás un CTA nuevo, seguí el mismo patrón
  (`whatsapp_click`, `add_to_cart`, etc.) con un `location` descriptivo en
  los params.
- **Fallback-first para datos de Firestore**: páginas como `Catalogo.jsx`,
  `Nosotros.jsx` (testimonios) y `FAQ.jsx` arrancan con un array
  `FALLBACK_*` hardcodeado y hacen un `import()` dinámico de `lib/firedb.js`
  que, si trae datos, los reemplaza. Si Firestore falla o no está
  configurado, el fallback queda y el sitio sigue andando. **No asumas que
  el catch silencioso es un bug** — es intencional en varios lugares (pero
  ver el punto de Contacto.jsx en "Problemas conocidos").
- **`Picture` component para imágenes**: envuelve `<img>` en `<picture>`
  con un `<source>` `.webp` si existe. Se usa en vez de `<img>` directo en
  toda página de catálogo/producto. No usar para imágenes de meta tags
  (`og:image`) — esas necesitan ser una URL directa fetcheable por
  crawlers.
- **Validación de cada cambio**: el flujo de trabajo establecido en este
  proyecto es siempre: editar → `get_errors` en los archivos tocados →
  `npm run build` completo (esperar "12 rutas + 404.html" sin warnings) →
  commit descriptivo (explicando el *por qué*, no solo el *qué*) → push.

## 6. Problemas conocidos / pendientes (a la fecha de este archivo)

### 🔴 Crítico — Firebase con credenciales placeholder
`src/lib/firebase.js` todavía tiene valores tipo
`'REEMPLAZAR_CON_TU_API_KEY'` en vez de credenciales reales de un proyecto
Firebase. Esto significa:
- El login del panel `/admin` **no funciona** (Firebase Auth falla contra
  un proyecto inexistente).
- El formulario de contacto (`Contacto.jsx`) intenta guardar el lead en
  Firestore antes de abrir WhatsApp, pero como Firebase no está
  configurado, ese guardado **siempre falla silenciosamente**. Ya se
  agregó un `trackEvent('contacto_save_failed', ...)` para poder ver en
  GA4 cuántos leads no se están persistiendo mientras esto no se arregle.
- **Para arreglarlo**: hay que crear un proyecto real en
  https://console.firebase.google.com, habilitar Authentication (email/
  password) y Firestore, y reemplazar los valores en `firebase.js` por los
  reales del proyecto (`apiKey`, `authDomain`, `projectId`, etc.).

### 🟡 Pendiente — Admin panel incompleto
`src/pages/Admin.jsx` tiene un TODO explícito: faltan migrar las tabs
Pedidos/Clientes/Stats del `admin.html` viejo. Hoy solo muestra el login y
un conteo básico de pedidos.

### 🟡 Pendiente — Search Console / Google Business Profile
No están configurados todavía (requiere acceso del dueño del sitio a esas
cuentas de Google, no es algo que se resuelva solo con código).

### 🟢 Ya resuelto recientemente (por si aparece en el historial de git)
- Bug real: `Layout.jsx` llamaba a `trackEvent(...)` en el botón flotante
  de WhatsApp sin importarlo → `ReferenceError` en cada click. Arreglado.
- Acordeón de FAQ se cortaba en mobile (`max-height: 200px` insuficiente
  para textos largos en columna angosta). Arreglado a `600px`.
- Varios tap-targets táctiles por debajo de 44px recomendados (hamburger,
  botones +/- del carrito, selectores de color). Agrandados.
- Import muerto (`deleteDoc`) en `firedb.js` generaba warning de build.
  Eliminado.

## 7. Comandos útiles

Todo se ejecuta desde `react-app/` (no desde la raíz del repo):

```bash
cd react-app
npm install          # instalar dependencias
npm run dev           # servidor de desarrollo (Vite, hot reload)
npm run build         # build completo: cliente + SSR + prerender
                       #   -> genera react-app/dist/ listo para deployar
npm run preview       # sirve dist/ localmente para probar el build de producción
```

Después de `npm run build`, el contenido de `dist/` es lo que se publica
en GitHub Pages (verificar el flujo de deploy / GitHub Actions del repo
para saber si es automático al pushear a `main` o si requiere un paso
manual).

## 8. Cómo seguir trabajando en este proyecto

1. Antes de tocar algo, buscá si ya existe (grep en `global.css` para
   estilos, en `routes.js` para rutas, en `data/products.js` para
   productos).
2. Cualquier cambio visual o de UI: validar mobile Y desktop (hay muchos
   breakpoints, ver sección 5).
3. Cualquier cambio de código: `get_errors` + `npm run build` completo
   antes de dar por terminado.
4. Los commits en este repo llevan mensajes largos y explicativos
   (qué se rompió, por qué, cómo se arregló, cómo se validó) — mantené
   ese estilo para que el historial de git siga siendo útil como
   documentación.
5. Si tu Copilot no tiene el historial de conversación previo, decile que
   lea este archivo primero (`CONTEXTO_PROYECTO.md`) antes de sugerir
   cambios.
