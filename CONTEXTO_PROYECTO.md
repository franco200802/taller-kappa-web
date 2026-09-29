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
    gracias a datos de fallback hardcodeados en el código, y mientras las
    credenciales sean placeholders el SDK ni siquiera se descarga (ver
    `loadFireDB()` en `lib/firebaseConfig.js`).
- **Sin librería de animación**: anime.js se quitó en el rediseño de
  sept. 2026. El único movimiento no pedido del sitio es la entrada de la
  foto del hero de la home, en CSS puro (`@keyframes hero-reveal`).
- **Tipografía**: Archivo (Omnibus-Type, Buenos Aires) desde Google Fonts,
  una sola familia variable (ejes de ancho y peso). Íconos: Font Awesome 6
  por CDN.
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
│   │   │   ├── Layout.jsx         (shell: Navbar + <main> con el <Suspense> de las páginas + Footer + CartDrawer + WA flotante)
│   │   │   ├── Navbar.jsx, Footer.jsx, CartDrawer.jsx, Toast.jsx
│   │   │   ├── PageHero.jsx       (breadcrumb + h1 + bajada de las páginas internas)
│   │   │   ├── Modal.jsx          (<dialog> nativo con showModal(): carrito, detalle de producto, lightbox)
│   │   │   ├── Picture.jsx        (<picture> con .webp SOLO para los archivos listados en WEBP_AVAILABLE)
│   │   │   └── Seo.jsx            (meta tags + JSON-LD por página)
│   │   ├── context/
│   │   │   └── CartContext.jsx    (carrito/presupuesto, persiste en sessionStorage)
│   │   ├── pages/                 (una página por ruta, ver routes.js)
│   │   ├── data/
│   │   │   ├── products.js        (fuente única de verdad de productos)
│   │   │   └── contact.js         (número de WhatsApp, email y whatsappUrl() — fuente única)
│   │   ├── lib/
│   │   │   ├── analytics.js       (GA4 custom, SSR-safe)
│   │   │   ├── firebaseConfig.js  (credenciales — placeholder! — + isFirebaseConfigured + loadFireDB())
│   │   │   ├── firebase.js        (init del SDK; solo lo carga firedb.js o Admin)
│   │   │   └── firedb.js          (capa de acceso a Firestore)
│   │   └── styles/
│   │       └── global.css         (TODO el CSS del sitio, ~730 líneas, secciones numeradas)
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

- **Todo el CSS vive en un solo archivo**: `src/styles/global.css`
  (reescrito desde cero en el rediseño de sept. 2026). Está organizado en
  secciones numeradas (`/* ---------- 10. Carrito / presupuesto ---------- */`).
  Antes de crear estilos nuevos, buscá si ya existe una sección relacionada.
- **Tokens de diseño** en `:root` (sección 1): colores `--cal` (fondo),
  `--blanco`, `--hierro` (texto y botón principal), `--grafito`, `--linea`,
  `--kappa` (rojo de marca: logo, estado activo, foco) y `--wa` (verde
  WhatsApp oscurecido para contraste AA). Escala tipográfica `--t-*`.
  Usá los tokens; no agregues hex sueltos.
- **Alineación a la columna**: toda sección de ancho completo usa
  `padding-inline: var(--pad-x)`, que alinea su contenido a la columna de
  `--max` (1200px). **No** uses `max-width + margin: auto` en los hijos de
  una sección: eso hacía que los `<p>` perdieran su límite de 68ch y que
  formularios con `margin-left: 0` quedaran pegados al borde.
- **Breakpoints**: pocos y por componente, todos `max-width` (960 nav,
  860 grillas de 2 columnas, 760/640/560 ajustes finos). Cada regla
  responsive vive junto al componente que ajusta, no en un bloque aparte.
- **Estilo de textos**: títulos en mayúscula inicial (castellano, no
  "Title Case"), sin mayúsculas forzadas ni el patrón "Palabra — fragmento".
  Botones con verbos que dicen qué pasa ("Agregar al presupuesto").
- **Analytics (GA4) manual en cada CTA**: cada botón/link de WhatsApp o
  acción de conversión importante llama a `trackEvent(nombre, params)` de
  `lib/analytics.js`. Si agregás un CTA nuevo, seguí el mismo patrón
  (`whatsapp_click`, `add_to_cart`, etc.) con un `location` descriptivo en
  los params.
- **Fallback-first para datos de Firestore**: páginas como `Catalogo.jsx`,
  `Nosotros.jsx` (testimonios) y `FAQ.jsx` arrancan con un array
  `FALLBACK_*` hardcodeado y llaman a `loadFireDB()` (de
  `lib/firebaseConfig.js`), que descarga `lib/firedb.js` solo si hay
  credenciales reales. Si Firestore falla o no está configurado, el
  fallback queda y el sitio sigue andando. **No asumas que el catch
  silencioso es un bug** — es intencional. No hagas `import('../lib/firedb')`
  directo: saltearías la guarda.
- **`Picture` component para imágenes**: envuelve `<img>` en `<picture>`
  con un `<source>` `.webp` **solo** si el archivo está en
  `WEBP_AVAILABLE` (Picture.jsx). Si agregás un .webp nuevo a
  `public/images`, sumalo a esa lista. Ojo: si el navegador elige un
  `<source>` que da 404, NO vuelve al `<img>` — muestra la imagen rota.
  No usar para imágenes de meta tags (`og:image`).
- **Hidratación (importante)**: el HTML prerenderizado y el primer render
  del cliente tienen que ser idénticos, o React descarta el HTML y
  re-renderiza todo. Reglas: (1) el `<Suspense>` de las páginas lazy vive
  en `Layout.jsx` porque Layout se renderiza igual en ambos lados — no lo
  muevas a `App.jsx`; (2) nada de leer `sessionStorage`/`window` en el
  estado inicial (ver cómo `CartContext` carga el carrito en un effect);
  (3) nada que dependa de JS para el layout inicial (el espacio bajo el
  navbar fijo es CSS: `#contenido { padding-top }`). Para verificar:
  `vite preview` y abrir las rutas **con barra final** (`/contacto/`):
  sin barra, el preview de Vite sirve el HTML de la home y aparecen
  errores #418 falsos.
- **Validación de cada cambio**: el flujo de trabajo establecido en este
  proyecto es siempre: editar → `get_errors` en los archivos tocados →
  `npm run build` completo (esperar "12 rutas + 404.html" sin warnings) →
  `npx react-doctor@latest --verbose --scope changed` (el puntaje no debe
  bajar) → commit descriptivo (explicando el *por qué*, no solo el *qué*) → push.

## 6. Problemas conocidos / pendientes (a la fecha de este archivo)

### 🔴 Crítico — Firebase con credenciales placeholder
`src/lib/firebaseConfig.js` todavía tiene valores tipo
`'REEMPLAZAR_CON_TU_API_KEY'` en vez de credenciales reales de un proyecto
Firebase. Esto significa:
- El login del panel `/admin` **no funciona** (Firebase Auth falla contra
  un proyecto inexistente).
- El formulario de contacto (`Contacto.jsx`) abre WhatsApp y después
  intenta guardar el lead en Firestore en segundo plano; mientras Firebase
  no esté configurado **no se guarda**. Cada lead no guardado se registra
  en GA4 como `contacto_save_failed` con `reason: 'firebase_sin_configurar'`.
- **Para arreglarlo**: hay que crear un proyecto real en
  https://console.firebase.google.com, habilitar Authentication (email/
  password) y Firestore, reemplazar los valores en `firebaseConfig.js` por
  los reales del proyecto (`apiKey`, `authDomain`, `projectId`, etc.) y
  **publicar `firestore.rules`** (el deploy de GitHub Pages no las sube).

### 🟡 Pendiente — Admin panel incompleto
`src/pages/Admin.jsx` tiene un TODO explícito: faltan migrar las tabs
Pedidos/Clientes/Stats del `admin.html` viejo. Hoy solo muestra el login y
un conteo básico de pedidos.

### 🟡 Pendiente — Fotos de producto generadas con IA
`bkf1.jpg`, `bkfapoyapies.jpg` y `mesa.jpeg` muestran la marca de agua ✦ de
Gemini en la esquina inferior derecha. Conviene reemplazarlas por fotos
reales de los productos del taller (mismo nombre de archivo, y regenerar
el `.webp` de cada una).

### 🟡 Pendiente — Search Console / Google Business Profile
No están configurados todavía (requiere acceso del dueño del sitio a esas
cuentas de Google, no es algo que se resuelva solo con código).

### 🟢 Ya resuelto recientemente (por si aparece en el historial de git)
- Modales migrados a `<dialog>` nativo (`components/Modal.jsx`): carrito,
  detalle de producto y lightbox. Foco atrapado, fondo inerte, el foco
  vuelve al botón que abrió el modal, y el scroll de la página se bloquea
  en CSS (`html:has(dialog[open])`). El `display` de cada modal va en
  `[open]`, nunca en la clase base (ver sección 9 de `global.css`). El
  toast es un `popover` para quedar encima de los modales (top layer).
- Rediseño completo (sept. 2026): paleta clara basada en las fotos,
  tipografía Archivo, `global.css` reescrito, sin animaciones de scroll.
- La hidratación fallaba en TODAS las páginas (errores React #418/#423):
  el `<Suspense>` estaba solo en el cliente, así que React descartaba el
  HTML prerenderizado y re-renderizaba todo. Movido a `Layout.jsx`.
- El contenido de las páginas internas saltaba 68px al cargar JS (CLS):
  el espacio bajo el navbar dependía de una clase en `<body>` puesta por JS.
- Nosotros mostraba "0+ años" en el HTML prerenderizado (contador animado
  que arrancaba en 0): ahora los números son fijos.
- Catálogo, FAQ, Nosotros y Contacto descargaban el SDK de Firebase
  (~105 kB gzip) en cada visita para pedidos que fallaban siempre.
- Contacto abría WhatsApp después de un `await` a Firestore (Safari/iOS
  bloqueaba la ventana y con Firestore colgado el botón no hacía nada).
- `firestore.rules`: `/contactos` aceptaba cualquier documento; ahora valida
  campos y largo.
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
