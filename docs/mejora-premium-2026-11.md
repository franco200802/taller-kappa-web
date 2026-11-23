# Rediseño premium y conversión, noviembre 2026

> Rama `mejora/experiencia-premium`, creada el 22/11/2026 desde
> `origin/release/codex-fase1` (el PR #32, abierto y sin revisar, que ya toca el
> carrito, el contacto y las variantes de la Base Flat). Sin push, sin merge y
> sin deploy: se publica cuando el dueño lo autorice.

## 1. Diagnóstico inicial

### 1.1 Estado real del proyecto

La copia local estaba en el 17/10/2026: `origin/main` tenía 34 commits más (3D,
inglés, panel, presupuesto para empresas). Todo lo que sigue se midió sobre el
código real de producción (`origin/main`, 19/11/2026) más el PR #32.

- **Stack:** React 18 + Vite 5, prerender propio (15 rutas + 404, valida canonical,
  h1, JSON-LD, enlaces e imágenes en cada build), GitHub Pages detrás de Cloudflare.
- **Funciones a conservar (todas siguen):** catálogo con filtros y vista rápida,
  fichas con variantes (acabado, cuero, altura y columna), visor 3D en la galería
  de cada ficha y showroom 3D con scroll (three.js en un chunk aparte), presupuesto
  que persiste en la sesión, mensaje de WhatsApp, copiar mensaje, "Descargar
  presupuesto" (hoja imprimible / PDF del navegador), modo inglés, formulario de
  contacto, panel `/admin` (Firebase todavía sin credenciales), GA4.
- **Línea base técnica:** build sin problemas; 16/16 pruebas unitarias, 4/4 de
  navegador (conversión) y 31/31 del panel en modo simulado. Las pruebas de reglas
  de Firestore no se pueden correr en esta máquina (el emulador necesita Java).
- **Rendimiento:** ya era bueno (Lighthouse móvil 88-100 según la página en las
  mediciones anteriores). No era el cuello de botella.

### 1.2 Problemas demostrados (medidos con Chrome automatizado sobre el build)

| # | Problema | Evidencia | Impacto |
|---|---|---|---|
| 1 | En las fichas, el botón para pedir quedaba lejos | `/sillon-bkf/`: foto en y = 655 y "Agregar al presupuesto" en y = 1.477 (1440 x 900); en un celular de 390 x 844, en y = 2.174. Banco: y = 1.258; base: y = 1.399 (escritorio) | Alto: es la página que compite por "sillón BKF" |
| 2 | `/mobiliario-comercial/` no tenía ningún botón hasta el final | Primer botón en y = 4.272 (escritorio) y 5.483 (360 x 740) | Alto: es la página para empresas |
| 3 | En el catálogo los productos empezaban debajo de la primera pantalla | Primera foto en y = 807 en 390 x 844, después de título, párrafo, aviso, categorías y filtros | Medio |
| 4 | Desde la tarjeta del catálogo, el sillón y el banco llegaban al presupuesto sin el color del cuero | La tarjeta agregaba `'Negro Mate'`; la ficha y la vista rápida, `'Negro Mate, cuero marrón'` | Medio: el taller tenía que repreguntar |
| 5 | No había dónde escribir medidas a medida en el presupuesto | El sitio vende "a medida, sin costo adicional", pero el presupuesto solo pedía nombre, tipo y zona | Medio |
| 6 | La hoja imprimible del presupuesto no incluía los datos del cliente | Sin nombre, zona ni tipo de cliente | Bajo |
| 7 | En `/contacto/` el botón de envío y los datos quedaban abajo en el celular | Envío en y = 928-951 | Bajo |
| 8 | 3D: si el sistema le quita el contexto WebGL a la página, el lienzo queda en negro | Sin manejo de `webglcontextlost` | Bajo |
| 9 | Identidad visual de plantilla: una sola sans angosta para todo, fondo gris frío, placas negras sobre las fotos | Capturas de la línea base | Alto para la percepción de marca |

**Hipótesis (no demostradas):** que el diseño editorial suba la confianza y el
tiempo en el sitio, y que tener el botón en la primera pantalla suba
`add_to_cart` y `whatsapp_click`. Se miden en GA4 (ver sección 9).

## 2. Cambios implementados, por impacto

1. **Fichas con caja de compra** (`Producto.jsx`, `SillonBKF.jsx`,
   `components/ProductBuy.jsx`): galería a la izquierda (fija en escritorio) y
   título, precio, opciones, botones y datos de confianza a la derecha. El botón
   quedó en y = 829 (`/sillon-bkf/`) y y = 796 (banco) en 1440 x 900. En el
   celular, una **barra de compra fija** con el producto, la variante elegida,
   "Agregar" y WhatsApp aparece cuando los botones de la ficha no se ven (está
   en la primera pantalla desde que carga la página). El h1, el breadcrumb y la
   definición citable siguen igual y en el HTML.
2. **Sistema de diseño editorial** (`global.css`, `index.html`, `public/fonts/`):
   Instrument Serif para títulos y marca, Archivo a ancho normal para texto,
   paleta de papel, lino y hueso, botones en píldora, trazos finos, rótulos
   editoriales, pies de foto como placas de papel, menú del celular a pantalla
   completa, movimiento corto y con `prefers-reduced-motion`. Contraste AA en
   todos los textos y 3:1 en los bordes de los campos.
3. **CTA arriba en mobiliario comercial y contacto**: "Pedir cotización por
   WhatsApp" (con el mensaje para empresas que ya deja escritos los datos) y "Ver
   proyectos y clientes"; en contacto, WhatsApp y llamada. Pasaron de y = 4.272 /
   5.483 a y ≈ 490-520.
4. **Catálogo**: encabezado compacto (primera foto en y = 432 en el celular),
   tarjetas sin placas negras, botón principal primero y **variante completa
   desde la tarjeta** ("Negro Mate, cuero marrón"). La vista rápida enlaza a la
   ficha completa.
5. **Presupuesto**: campo opcional "Comentarios o medidas a medida" (va en el
   WhatsApp, en "Copiar mensaje", en el PDF y, en Firestore, dentro de `detalle`:
   las reglas no cambian); aviso con atajo "Ver presupuesto" y contador que late
   al agregar; productos con enlace a su ficha, cantidad en un solo control,
   datos opcionales en la zona con scroll (el botón de WhatsApp nunca sale de la
   pantalla), estado vacío con los tres productos y PDF con tipografía de la
   marca y los datos del cliente. El mensaje lo arma `quoteMessage()`, con
   pruebas: sin comentarios es idéntico al de antes.
6. **3D**: con contexto WebGL perdido, el showroom pasa a la foto y el visor
   avisa; en equipos de 2 GB o 2 núcleos o menos, el showroom muestra la foto. El
   motor no se reescribió.
7. **Accesibilidad**: el menú del celular se cierra con Escape (el foco vuelve al
   botón) y al cambiar de página, y bloquea el scroll de atrás; filtros con
   `aria-pressed`; la barra fija oculta es `inert`; a 320 px el navbar entra
   entero (con la marca nueva se salía 16 px: se corrigió antes de cerrar).
8. **Inglés**: todos los textos nuevos traducidos y una regla para "N unidades".
9. **Mantenimiento**: reglas CSS sin uso eliminadas y documentación en
   `CONTEXTO_PROYECTO.md` §5n.

## 3. Archivos modificados

- Diseño: `react-app/src/styles/global.css`, `react-app/index.html`,
  `react-app/public/manifest.json`, `react-app/public/fonts/*` (nuevas fuentes y
  licencias OFL; se quitó `archivo-latin.woff2`).
- Componentes: `PageHero.jsx` (exporta `Breadcrumb`, acepta botones),
  `ProductBuy.jsx` (nuevo: `TrustList`, `BuyBar`), `CartDrawer.jsx`,
  `Toast.jsx`, `Navbar.jsx`, `Layout.jsx`, `Showroom3D.jsx`, `Product3D.jsx`.
- Páginas: `Home.jsx`, `Catalogo.jsx`, `Producto.jsx`, `SillonBKF.jsx`,
  `MobiliarioComercial.jsx`, `Contacto.jsx`.
- Lógica: `context/CartContext.jsx`, `lib/leads.js`.
- Inglés: `i18n/en.js`, `i18n/translate.js`.
- Pruebas: `tests/unit/leads.test.mjs`, `tests/e2e/conversion.test.mjs`.
- Documentación: `CONTEXTO_PROYECTO.md`, `docs/tareas-pendientes.md`, este archivo.

## 4. Antes y después

### 4.1 Dónde queda lo importante (Chrome automatizado, build de producción)

| Página | Medida | Antes | Después |
|---|---|---|---|
| `/sillon-bkf/` 1440 x 900 | "Agregar al presupuesto" | y = 1.477 | y = 829 |
| `/sillon-bkf/` 390 x 844 | botón para agregar visible | y = 2.174 | barra en y = 788 (primera pantalla) |
| `/catalogo/banco-bkf/` 1440 x 900 | "Agregar al presupuesto" | y = 1.258 | y = 796 |
| `/catalogo/base-de-mesa-flat/` 1440 x 900 | botón | y = 1.399 | y = 906 (barra visible en y = 842) |
| `/catalogo/` 390 x 844 | primera foto | y = 807 | y = 432 |
| `/mobiliario-comercial/` 360 x 740 | primer botón | y = 5.483 | y = 520 |
| `/contacto/` 390 x 844 | primer botón | y = 928 | y = 359 |
| `/` 390 x 844 | "Ver el sillón BKF" | y = 691 | y = 711 (sigue en la primera pantalla) |

### 4.2 Peso (lo que baja en la primera visita a la home)

| | Antes | Después |
|---|---|---|
| Fuentes (precargadas) | 90,1 kB (Archivo con eje de ancho) | 54,9 kB (Archivo 33,9 + serif 21,0) |
| JS principal (gzip) | 85,8 kB | 87,2 kB |
| CSS (gzip) | 12,6 kB | 14,7 kB |
| HTML de la home (gzip) | 10,6 kB | 11,1 kB |
| **Total** | **199,0 kB** | **167,9 kB (−16 %)** |

### 4.2b Trabajo del navegador al cargar (Chrome con la CPU 4x más lenta, mediana de 5)

Cada fila compara antes y después en la misma tanda de mediciones.

| Página | Primera versión del rediseño | Versión final |
|---|---|---|
| `/sillon-bkf/` | 254 → 377 ms | 242 → 360 ms |
| `/catalogo/` | 164 → 222 ms | 168 → 166 ms |
| `/` | — | 292 → 322 ms |

La primera versión del rediseño usaba la itálica de la serif en la frase animada de
la primera pantalla. Como no se precargaba, llegaba después del primer maquetado y
el navegador rehacía el de todos los títulos. Se quitó la itálica (22 kB menos). También
se probó no precargar Archivo: el layout de `/sillon-bkf/` subió a 579 ms por la
misma razón, así que las dos fuentes de la primera pantalla siguen precargadas. Lo que
queda de más en la ficha es la foto y la frase animada, que ahora están en la primera
pantalla.

### 4.3 Lighthouse 13 (laboratorio, misma máquina, mediana de 3 corridas)

| Dispositivo | Página | Rendimiento | Accesibilidad | Buenas prácticas | SEO | LCP | CLS | TBT |
|---|---|---|---|---|---|---|---|---|
| Celular | `/` | 97 → 97 | 100 → 100 | 100 → 100 | 100 → 100 | 2,61 s → 2,57 s | 0 → 0 | 24 ms → 28 ms |
| Celular | `/sillon-bkf/` | 100 → 94 | 100 → 100 | 100 → 100 | 100 → 100 | 0,77 s → 2,94 s | 0 → 0 | 43 ms → 125 ms |
| Celular | `/catalogo/` | 100 → 97 | 100 → 100 | 100 → 100 | 100 → 100 | 0,77 s → 2,56 s | 0 → 0 | 44 ms → 49 ms |
| Celular | `/catalogo/banco-bkf/` | 97 → 97 | 100 → 100 | 100 → 100 | 100 → 100 | 2,51 s → 2,54 s | 0 → 0 | 71 ms → 101 ms |
| Celular | `/mobiliario-comercial/` | 100 → 99 | 100 → 100 | 100 → 100 | 100 → 100 | 0,76 s → 0,91 s | 0 → 0 | 32 ms → 102 ms |
| Escritorio | `/` | 100 → 100 | 100 → 100 | 100 → 100 | 100 → 100 | 0,57 s → 0,63 s | 0 → 0 | 0 → 0 |
| Escritorio | `/sillon-bkf/` | 100 → 100 | 100 → 100 | 100 → 100 | 100 → 100 | 0,56 s → 0,64 s | 0 → 0 | 0 → 0 |

Celular: mediana de 3 corridas, antes y después intercaladas en la misma tanda.
Escritorio: 1 corrida (en la primera tanda, con 3 corridas, también daba 100 → 100).

Lectura honesta de los números:

- **Accesibilidad, buenas prácticas y SEO quedan en 100** en todas, y el **CLS en 0**.
- **`/sillon-bkf/` baja de 100 a 94 y `/catalogo/` de 100 a 97** en el celular. El
  motivo principal es buscado: la foto del producto ahora está en la primera pantalla
  y pasa a ser el LCP (antes lo era un párrafo, que se pinta enseguida). En la home y
  en el banco, donde la foto ya era el LCP, el LCP no cambia (2,61 → 2,57 s y 2,51 →
  2,54 s).
- La primera versión del rediseño daba 91 en `/sillon-bkf/` (LCP 3,09 s, TBT 172 ms).
  Con los arreglos de la sección 4.2b quedó en 94 (2,94 s, 125 ms).
- El TBT sube en algunas páginas pero queda lejos del límite de 200 ms que Lighthouse
  considera bueno.

Son mediciones de laboratorio con el build servido en local (`vite preview`): no
incluyen Cloudflare ni la red real y no reemplazan los datos de campo. El SEO de
producción da 92 por la línea `Content-Signal` que Cloudflare agrega al
`robots.txt` (ver `CONTEXTO_PROYECTO.md` §5); en local da 100.

## 5. Verificación

- `npm run build`: 15 rutas + 404, sin problemas de la validación de SEO/GEO
  (canonical, un h1, títulos únicos, JSON-LD con todos sus `@id`, enlaces,
  imágenes). URLs, títulos, descripciones, h1 y JSON-LD sin cambios.
- `npm run test:unit`: 20/20 (4 nuevas sobre el mensaje y los comentarios).
- `npm run test:e2e:conversion`: 7/7 (3 nuevas; las tres fallan con el código
  anterior).
- `npm run test:e2e:mock` (panel): 31/31.
- 15 páginas x 7 anchos (320, 360, 390, 768, 1024, 1440, 1920): sin desbordes y
  sin errores de consola. A 320 px la barra se salía 16 px con la marca nueva: se
  corrigió.
- Modo inglés: en las 7 páginas tocadas, el aviso y el presupuesto no queda texto
  visible en español.
- Revisión visual (capturas) de las 15 páginas en celular y escritorio, y de los
  estados nuevos: menú, vista rápida 3D, aviso con atajo, presupuesto con datos y
  vacío.
- **No verificado:** las reglas de Firestore (el emulador necesita Java), el envío
  real de WhatsApp (se verificó hasta el enlace `wa.me`), Safari y Firefox reales
  (se probó con Chrome 157), y nada contra producción.

## 6. Pendientes y riesgos

- **El PR #32 va adentro de esta rama.** Mergear primero #32 y después esta rama
  (o esta sola, que lo incluye).
- **Fotos:** el diseño nuevo deja las fotos más a la vista; siguen siendo fotos
  con fondo editado (avisado en el pie) salvo la del sillón en una casa. Lo que
  más puede subir la percepción de marca es reemplazarlas por fotos reales.
- **Precio:** sigue sin publicarse (decisión comercial, `tareas-pendientes.md` §4).
- **Barra de compra:** es nueva; conviene mirar en GA4 si `add_to_cart` desde las
  fichas sube y si no molesta (se puede quitar sin tocar el resto).
- **LCP de laboratorio en las fichas y el catálogo:** al quedar la foto en la primera
  pantalla, el LCP pasa a ser la foto (antes era un párrafo, que se pinta al
  instante). En la red lenta simulada de Lighthouse eso sube el LCP de
  `/sillon-bkf/` y `/catalogo/` (ver 4.3); en la home y en el banco, donde la foto ya
  era el LCP, no cambia. Es el costo de mostrar el producto arriba; conviene seguirlo
  con los datos de campo (Search Console, Core Web Vitals) cuando haya volumen.

## 7. Rama y commits

`mejora/experiencia-premium`, sobre `d883510` (PR #32), en orden:

- `e61c1f8` feat(design): editorial design system with a display serif and warm palette
- `1f31293` feat(pdp): put the buy box in the first screen and add a sticky buy bar
- `79fb70b` feat(catalog): show products in the first screen and add complete variants
- `8b38beb` feat(quote): comments field, toast shortcut and a clearer quote drawer
- `f4a1757` feat(cro): quote buttons at the top of the B2B and contact pages
- `750a567` fix(3d): fall back gracefully on WebGL context loss and low-power devices
- `a08994e` test(e2e): cover complete variants, quote comments, buy bar and B2B CTA; add English strings
- `ae36038` perf: keep layout work and LCP in check after the redesign
- (último) `docs`: este informe, `CONTEXTO_PROYECTO.md` §5n y `tareas-pendientes.md`.

## 8. Cómo probarlo

```bash
cd react-app
npm ci
npm run build            # 15 rutas + 404.html, sin problemas
npm run preview          # http://localhost:4173 (abrir las rutas con barra final: /catalogo/)
npm run test:unit
CHROME_PATH="C:/Program Files/Google/Chrome/Application/chrome.exe" npm run test:e2e:conversion
```

Recorrido sugerido: home → catálogo → "Agregar al presupuesto" en el sillón →
"Ver presupuesto" en el aviso → completar "Comentarios o medidas" → "Pedir
presupuesto por WhatsApp". En el celular, abrir `/sillon-bkf/` y usar la barra
de abajo. En `/catalogo/base-de-mesa-flat/`, la barra pide elegir las medidas.

## 9. Próximos pasos recomendados

1. Revisar la rama y publicarla (merge a `main`: el deploy es automático).
2. En GA4, comparar 28 días antes y después: `add_to_cart` por `page_path`,
   `whatsapp_click` por `location` (nuevas: `ficha_barra`, `mc_hero`,
   `contacto_hero`) y `whatsapp_checkout` con `has_comment`.
3. Fotos reales del producto y del taller (la mejora de marca más grande que queda).
4. Publicar un precio "desde" con vigencia (el sitio ya lo soporta).
5. Firebase: crear el proyecto (`docs/firebase-puesta-en-marcha.md`) para que el
   panel guarde presupuestos y consultas.
