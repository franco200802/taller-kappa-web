# Auditoría y optimización integral — noviembre 2026

Fecha: 2026-11-16 · Rama: `feat/auditoria-integral` (creada desde `main` @ `e86707c`) · Sin push ni deploy.

Criterio: cambiar solo lo que tiene un defecto comprobado o una mejora verificable. El sitio ya
venía muy trabajado (rediseño de sept. 2026, fases SEO 2 a 4, B6 a B10), así que la mayor parte de
la auditoría termina en "está bien, no se toca". No se inventó ningún dato comercial ni se reforzó
ninguno de los 8 claims que siguen pendientes de confirmación (`seo/b9-pendientes-propietario.md`).

## 1. Estado inicial

- **Stack:** React 18 + Vite 5, react-router 6, react-helmet-async, prerender propio a HTML
  estático (`scripts/prerender.js`), GitHub Pages detrás de Cloudflare. Sin servidor: el "backend"
  es Firebase (Auth + Firestore), que **sigue con credenciales de ejemplo**, por lo que hoy no
  funciona ni el login del panel ni el guardado de consultas. La venta es por cotización: todo
  termina en WhatsApp (`541161242498`).
- **Build:** 15 rutas + 404, sitemap con 15 URLs, `llms.txt`, 9 redirecciones. Sin warnings.
- **Lighthouse mobile (local, build de producción), antes de tocar nada:**

  | Página | Perf. | Accesib. | Buenas prácticas | SEO | LCP | CLS | TBT |
  |---|---:|---:|---:|---:|---:|---:|---:|
  | `/` | 99 | 100 | 100 | 100 | 2,2 s | 0 | 10 ms |
  | `/catalogo/` | 99 | 100 | 100 | 100 | 2,1 s | 0 | 10 ms |
  | `/sillon-bkf/` | 99 | 100 | 100 | 100 | 2,0 s | 0 | 10 ms |
  | `/contacto/` | 99 | 100 | 100 | 100 | 2,0 s | 0 | 10 ms |

- **Navegador (13 páginas, 1366 px y 360 px):** sin desborde horizontal y sin errores de
  hidratación.
- **No existen** tests automáticos, linter ni chequeo de tipos en el proyecto (JavaScript sin
  TypeScript, sin scripts `test`/`lint`). La red de seguridad real es el prerender, que corta el
  build si hay canonical faltante, más de un `<h1>`, JSON-LD inválido, enlaces internos rotos,
  páginas huérfanas, imágenes sin `alt` o inexistentes.

## 2. Problemas encontrados

Ordenados por impacto. "Hecho" = corregido en esta rama.

| # | Problema | Evidencia | Impacto | Estado |
|---|---|---|---|---|
| 1 | En las tarjetas del catálogo, "Consultar disponibilidad" quedaba **tapado por la etiqueta de la foto** (se leía "…ibilidad") | Captura a 1366 y 360 px | Visual / confianza | Hecho |
| 2 | Galería de `/nosotros/`: la Base de Mesa Flat aparecía **dos veces**, recortada en franjas donde solo se veía el piso | Captura | Visual | Hecho |
| 3 | Tabla comparativa de productos en celular: 5 columnas en 330 px, una o dos palabras por renglón y scroll lateral | Captura a 360 px | UX móvil | Hecho |
| 4 | En celular, la bajada de las páginas internas ocupaba toda la primera pantalla (12 renglones en `/sillon-bkf/`); la foto y los botones quedaban debajo | Captura a 360 px | Conversión móvil | Hecho |
| 5 | Panel `/admin`: con Firebase sin configurar, cualquier intento mostraba "Usuario o contraseña incorrectos" (falso) y descargaba el SDK (~105 kB gzip) para nada. Sin estado de carga ni distinción de errores. Con sesión, solo mostraba un conteo de pedidos (colección que el sitio no escribe) y nada de las consultas que el formulario sí guarda | Código + navegador | Robustez / uso real | Hecho |
| 6 | Menú móvil: el botón decía siempre "Abrir menú", no se cerraba con Escape y no declaraba qué controla. El globo del presupuesto anunciaba "0" a lectores de pantalla | Código | Accesibilidad | Hecho |
| 7 | El botón "Descargar presupuesto" no descarga: abre el diálogo de impresión | Código | Claridad | Hecho (rótulo) |
| 8 | Fotos de producto generadas con IA, con la marca ✦ visible en la esquina | Ya documentado | **Confianza comercial (alto)** | Pendiente: requiere fotos reales |
| 9 | Email de contacto público es una casilla personal de Gmail | `data/contact.js` | Imagen profesional | Pendiente: decisión del dueño |
| 10 | `firestore.rules`: el admin se reconoce solo por el email del token, sin exigir email verificado; `orders` acepta cualquier documento de un usuario logueado; `users` deja al usuario escribir campos arbitrarios | `firestore.rules` | Seguridad (ver §7) | Pendiente: requiere aprobación |
| 11 | Firebase sin credenciales: las consultas del formulario no se guardan | Ya documentado | Leads perdidos si el cliente no envía el WhatsApp | Pendiente: requiere cuenta |
| 12 | Cloudflare: `http://` no redirige a `https://` y faltan los 301 | Ya documentado | SEO / seguridad | Pendiente: requiere acceso a la zona |
| 13 | El iframe de Google Maps del footer registra un error de consola propio de Google por el `sandbox` sin `allow-same-origin` | Consola en `/faq/` y `/contacto/` | Nulo para el usuario (el mapa funciona) | Sin cambios: quitar la restricción sería bajar la seguridad |

### Lo que se revisó y se dejó como está

- **SEO:** títulos, descripciones, canonical, robots, sitemap, Open Graph, JSON-LD enlazado por
  `@id`, enlazado interno y `llms.txt`. Correctos y recientes; cambiarlos sería ruido y riesgo (el
  sitio ya perdió posiciones por cambios de URL). Ninguna URL cambió.
- **Rendimiento:** fuente autoalojada y precargada, imágenes AVIF/WebP con `srcset`, mapa y GA4
  diferidos, Firebase fuera de las páginas públicas. Nada que optimizar con evidencia.
- **Identidad visual:** paleta, tipografía Archivo, botones, header y footer son coherentes y con
  carácter propio. No se rediseñó nada que funcionara.
- **Presupuesto, modales, formulario de contacto, analítica:** funcionan; los 54 enlaces a WhatsApp
  de las 13 páginas apuntan al número configurado.

## 3. Mejoras implementadas

1. **Catálogo:** el rótulo de disponibilidad pasa a estar debajo del nombre del producto, visible.
2. **Galería de Nosotros:** una foto por producto, todas en 4:5 (se ve cada pieza entera); en
   celular, la primera a lo ancho. El lightbox sigue funcionando.
3. **Tabla de productos en celular (≤ 640 px):** cada producto se apila como una ficha con sus
   rótulos (Categoría, Estructura, Medidas, Uso). En escritorio la tabla no cambia. Sigue siendo una
   `<table>` real (mismo HTML para buscadores y lectores de pantalla). Aplica a `/catalogo/`,
   categorías y `/mobiliario-comercial/`.
4. **Encabezado de páginas internas en celular (≤ 560 px):** bajada a tamaño de cuerpo y menos
   padding. En `/sillon-bkf/` la foto del producto entra en la primera pantalla.
5. **Panel de administración:**
   - Sin credenciales muestra un aviso claro y **no descarga Firebase** (el panel real es un chunk
     aparte, `AdminPanel.jsx`).
   - Estado "Comprobando la sesión…", botón deshabilitado mientras ingresa, mensajes según el error
     real (clave incorrecta, demasiados intentos, sin conexión), campos con `<label>`.
   - Con sesión: **bandeja de consultas del formulario de contacto** (nombre, interés, mensaje,
     fecha), contador de no leídas, "Marcar como leída / no leída", botón Actualizar, y aviso
     "sin permisos de administrador" si la cuenta no es admin según las reglas. Se conserva el
     conteo de pedidos.
6. **Accesibilidad del menú:** rótulo "Abrir/Cerrar menú", `aria-controls`, Escape cierra; el botón
   del presupuesto anuncia la cantidad y el globo queda como adorno visual.
7. **Presupuesto:** el botón ahora dice "Imprimir o guardar en PDF".

## 4. Archivos modificados

| Archivo | Cambio |
|---|---|
| `react-app/src/pages/Catalogo.jsx` | Rótulo de disponibilidad dentro de la información de la tarjeta |
| `react-app/src/pages/Nosotros.jsx` | Galería derivada de `PRODUCTS`, sin duplicado ni recortes |
| `react-app/src/components/ProductTable.jsx` | `data-label` por celda para la vista apilada |
| `react-app/src/components/Navbar.jsx` | Accesibilidad del menú y del botón del presupuesto |
| `react-app/src/components/CartDrawer.jsx` | Rótulo del botón de impresión |
| `react-app/src/pages/Admin.jsx` | Envoltorio liviano: aviso si falta Firebase, carga diferida del panel |
| `react-app/src/pages/AdminPanel.jsx` (nuevo) | Login, sesión y bandeja de consultas |
| `react-app/src/lib/firedb.js` | `setContactoLeido()` |
| `react-app/src/styles/global.css` | Galería, tabla móvil, encabezado móvil, estilos del panel |
| `CONTEXTO_PROYECTO.md` | Panel admin y referencia a este informe |
| `docs/auditoria-integral-2026-11.md` (nuevo) | Este informe |

Sin dependencias nuevas. Sin cambios en `firestore.rules`, `firebaseConfig.js`, rutas, URLs, SEO,
analítica ni workflow de deploy.

## 5. Justificación

Cada cambio responde a un defecto visible en capturas o a una falla comprobada en el código (tabla
de §2). Se priorizó impacto alto con riesgo bajo: todos son cambios de presentación o del panel
interno; ninguno toca el contenido indexable, el flujo de presupuesto ni los datos comerciales.

El panel muestra las consultas porque es el único dato que el sitio realmente escribe en Firestore
(`contactos`, desde `/contacto/`): sin esa vista, guardar los leads no servía para nada. No se
agregaron altas/bajas de productos ni estadísticas: no hay una necesidad comercial que lo pida hoy.

## 6. Resultados de las pruebas

- **Build de producción:** OK. 15 rutas + 404, sitemap con 15 URLs, `llms.txt`, 9 redirecciones,
  sin warnings. Las validaciones del prerender pasan (canonical, un `<h1>`, JSON-LD, enlaces
  internos, imágenes).
- **Lighthouse mobile después** (`/sillon-bkf/` medido 3 veces):

  | Página | Perf. | Accesib. | Buenas prácticas | SEO | LCP | CLS | TBT |
  |---|---:|---:|---:|---:|---:|---:|---:|
  | `/` | 99 | 100 | 100 | 100 | 2,2 s | 0 | 10 ms |
  | `/catalogo/` | 99 | 100 | 100 | 100 | 2,1 s | 0 | 10 ms |
  | `/sillon-bkf/` | 99 | 100 | 100 | 100 | 2,0 s | 0 | 10 ms |
  | `/contacto/` | 99 | 100 | 100 | 100 | 2,0 s | 0 | 10 ms |

  Sin regresiones. En `/sillon-bkf/` el elemento LCP pasó de ser el párrafo de la bajada a ser la
  foto del producto (ahora visible en la primera pantalla), con el mismo tiempo.
- **Navegador (Chromium, 13 páginas × 2 anchos):** sin desborde horizontal ni errores de
  hidratación. Único error de consola: el del iframe de Google Maps (§2, n.º 13), preexistente.
- **Pruebas funcionales (13 de 13 OK):** menú móvil (abre, rótulo, Escape), disponibilidad visible,
  agregar al presupuesto y globo, enlace del presupuesto a `wa.me/541161242498` con el producto,
  filtro del catálogo, tabla móvil sin scroll lateral, 54 enlaces de WhatsApp correctos, lightbox,
  y `/admin` sin configurar (muestra el aviso y no descarga Firebase).
- **react-doctor** (`--scope changed`): 100/100, sin hallazgos.
- **`git diff --check`:** OK.
- **Tamaño:** JS principal 237,4 → 237,6 kB; CSS 41,1 → 43,1 kB (sin gzip). El panel son 5,6 kB
  que solo baja quien entra a `/admin`.

**No se pudo ejecutar:**
- Tests, lint y type checking: el proyecto no los tiene.
- **El panel con sesión iniciada** (login real, lectura de consultas, marcar como leída): no hay
  proyecto de Firebase con credenciales. El código compila y sigue las reglas publicadas en
  `firestore.rules`, pero **no está probado contra un Firestore real**. Hay que probarlo al
  configurar Firebase, antes de darlo por bueno.
- Core Web Vitals de campo (CrUX / Search Console): sin acceso. Las cifras son de laboratorio.

## 7. Riesgos pendientes y cambios que requieren aprobación

1. **Reglas de Firestore (seguridad).** Antes de publicar las reglas conviene:
   - Crear primero la cuenta del administrador y **desactivar el registro público** en Firebase
     Authentication. Si no, mientras esa cuenta no exista, cualquiera podría registrarse con ese
     email y pasar por admin. Alternativa más sólida: exigir `email_verified` o usar un *custom
     claim* en vez del email.
   - Decidir si las colecciones `orders` y `users` siguen existiendo: el sitio actual no las usa
     y sus reglas aceptan documentos sin validar. Lo más seguro es cerrarlas.
   No se tocaron porque cambian quién puede entrar, y eso lo decide el dueño.
2. **Panel sin probar con datos reales** (§6).
3. **Fotos generadas con IA.** Es el punto que más confianza resta en un sitio que vende calidad de
   fabricación. Ningún cambio de código lo compensa.
4. **Claims comerciales sin confirmar** (los 8 de `seo/b9-pendientes-propietario.md`): siguen
   visibles; no se modificaron ni se repitieron en textos nuevos.
5. **Cloudflare** (HTTPS forzado y 301) y **Firebase** (credenciales): siguen pendientes de acceso.
6. **GitHub Pages no permite cabeceras de seguridad** (CSP, HSTS, X-Frame-Options). Se pueden
   agregar desde Cloudflare cuando haya acceso a la zona.

## 8. Recomendaciones futuras

Por orden de retorno comercial:

1. **Fotos reales** del taller, del proceso y de cada producto (también de obras entregadas para
   `/proyectos/`). Mismos nombres de archivo y regenerar variantes con los dos scripts de imágenes.
2. **Configurar Firebase** con el punto 1 de §7 resuelto, y probar el panel.
3. **Email con dominio propio** (por ejemplo `ventas@tallerkappa.com.ar`, con Cloudflare Email
   Routing es gratuito) en lugar de la casilla personal.
4. **Cloudflare:** Always Use HTTPS, los 301 y cabeceras de seguridad
   (`docs/seo/cloudflare-paso-a-paso.md`).
5. **Search Console y GA4:** dar acceso de lectura para medir de verdad qué páginas y qué botones
   traen consultas, y recién ahí decidir cambios de CTA.
6. **Confirmar los 8 claims comerciales** y definir el stock, para recuperar `availability` en el
   schema.
7. **Red de seguridad de código:** un linter (ESLint) y dos o tres pruebas de humo en CI (build +
   las pruebas de navegador de esta auditoría) cuando el proyecto tenga más de un colaborador.
8. **Foco al navegar:** hoy, al cambiar de página, el foco del teclado queda donde estaba. Moverlo
   al contenido mejoraría el uso con lector de pantalla; hay que probarlo con cuidado porque afecta
   a todas las páginas.
