# SEO Google + Local + IA — Fase 3

> Complementa `seo-geo-fase-2-competencia.md` (SERPs, content gap, clusters,
> indexación). No repite lo que ya está resuelto: acá solo figura lo nuevo.
> Fecha: 1/10/2026. No hay datos de Search Console ni volúmenes de búsqueda; la
> herramienta de búsqueda usada tiene sesgo de EE.UU. y **no muestra el mapa
> local de Google ni las funciones de IA**, así que esas partes se trabajan con
> datos del sitio y buenas prácticas, no con SERPs observadas.

## 1. Hallazgos nuevos de la investigación

| Hallazgo | Evidencia | Qué implica |
|---|---|---|
| El dominio **ya está indexado**, pero Google muestra el título viejo "Sillón BKF Buenos Aires" | SERP de `Taller Kappa San Martín BKF` | Cuando se publiquen estos cambios hay que pedir reindexación (§7) para que tome los títulos nuevos |
| Existe una ficha en **Cylex** como "Talleres Kappa S de H, General San Martín" (otra razón social) | SERP; la página bloquea acceso automatizado (403) y no pude verla | Posible inconsistencia de nombre/datos (NAP). Reclamarla y unificarla con `Taller Kappa S.R.L.` (§9) |
| La Nación publicó (16/3/2026) una nota sobre el taller de un competidor que fabrica BKF | `lanacion.com.ar/revista-living/…nid16032026` | Hay prensa de diseño que cubre fabricantes de BKF: oportunidad de autoridad legítima |
| Los directorios dominan lo local | `argentino.com.ar`, `fullconfort.com.ar`, `cylex.com.ar`, páginas de Facebook | Las fichas en directorios y redes pesan en `muebles San Martín` |
| No existen perfiles oficiales de Taller Kappa en la búsqueda (Instagram/Facebook) | Búsqueda de `Taller Kappa` + redes: solo cuentas ajenas | **No hay `sameAs` que agregar**: no se inventan |
| La API pública de PageSpeed devolvió cuota agotada | HTTP 429 | No hay datos de campo (CrUX) para citar; se miden en Search Console (§7) |

**Velocidad de los competidores** (Lighthouse mobile, misma máquina y método
que el sitio; cada una es una sola corrida):

| Página | Perf. | LCP | TBT | SEO |
|---|---|---|---|---|
| enecueros.com/bkf/ | 67 | 3,3 s | 950 ms | 92 |
| kikely.com.ar (sillón BKF) | 46 | 7,2 s | 1.370 ms | 92 |
| bernardolahitte.com.ar (BKF) | 62 | 6,3 s | 350 ms | 92 |
| fgequipamientos.com.ar | 61 | 3,7 s | 980 ms | 92 |
| divani.com.ar (guía BKF) | 32 | 10,5 s | 150 ms | 100 |
| cedicoh.com | 65 | 7,4 s | 50 ms | 100 |
| **tallerkappa.com.ar (build local)** | **99** | **2,0-2,2 s** | **10 ms** | **100** |

Caveat: los competidores se midieron por red y el sitio contra un servidor
local sin compresión; la comparación es orientativa. Lo que sí es comparable es
el tamaño: sus páginas pesan 0,8 a 5,7 MB y la nuestra, 0,27 MB.

## 2. Keyword → intención → URL

| Keyword (y variantes) | Intención | URL | Contenido que la respalda | Productos | Enlaces entrantes clave |
|---|---|---|---|---|---|
| Taller Kappa · Taller Kappa SRL · Taller Kappa San Martín | Navegacional | `/` | Datos de la empresa en HTML, `LocalBusiness`, `WebSite` con nombres alternativos | — | Menú, footer |
| BKF · qué es BKF · qué significa BKF · BKF historia | Informativa | `/bkf/` | Definición, sigla, historia con fuentes, materiales | Banco/Sillón | `/sillon-bkf/`, fichas, FAQ, categoría |
| silla BKF · sillón mariposa · butterfly chair | Informativa | `/bkf/`, `/sillon-bkf/` | Sinónimos en el texto | — | idem |
| BKF original · BKF réplica · sillón BKF original | Informativa (**nueva**) | `/bkf/` (FAQ) | Origen 1938, imposibilidad de patentar, qué preguntar al comparar | — | Guía |
| medidas sillón BKF (**nueva**) | Informativa/comercial | `/sillon-bkf/`, `/bkf/` (FAQ), ficha | 78 x 70 x 90 cm visible en tabla, lista y FAQ | Sillón | Landing, ficha |
| cómo cuidar/limpiar sillón BKF de cuero (**nueva**) | Informativa | `/bkf/` (FAQ), `/garantia/` | Cuidados del cuero y la estructura | Sillón | Guía → garantía |
| sillón BKF · sillón BKF Argentina · BKF Argentina | Comercial | `/sillon-bkf/` | Título/H1 con Argentina, origen, envíos, tabla, FAQ | Sillón Premium | Menú, home, guía |
| comprar sillón BKF · sillón BKF comprar | Transaccional | `/sillon-bkf/` (única página del producto desde la recuperación SEO) | CTA WhatsApp, cómo se cotiza, envíos | Sillón Premium | Menú |
| sillón BKF precio | Transaccional | `/sillon-bkf/` (FAQ) | Dice que no hay precio de lista y cómo cotizar | — | **Requiere precio publicado** (§5) |
| mejor sillón BKF · cuál elegir | Investigación comercial | `/bkf/` ("Cómo elegir") | Criterios verificables, sin afirmar "el mejor" | Sillón | Landing → guía |
| banco BKF · banqueta BKF | Comercial | `/catalogo/banco-bkf/` | Definición con el alias, medidas | Banco | Categoría asientos |
| sillón BKF Buenos Aires · BKF San Martín | Local/comercial | `/sillon-bkf/`, `/nosotros/`, `/contacto/` | Dirección, retiro en taller, cómo llegar | Sillón | Contacto, footer |
| muebles de hierro y cuero · muebles de hierro (**nueva**) | Comercial | `/catalogo/` | Título y H1 "Muebles de hierro y cuero…", tabla comparativa | Los 3 | Menú, home |
| base de mesa de hierro · base para mesa de bar | Comercial | `/catalogo/mesas/`, ficha | Alturas 73/105 cm, bares y restaurantes, FAQ | Base Flat | Categoría |
| mesa BKF | Informativa/ambigua | `/catalogo/mesas/` (FAQ) | Aclara que BKF es un sillón y que no se vende "mesa BKF" | — | Categoría |
| mobiliario gastronómico · muebles para restaurantes/bares (**nueva**) | Comercial B2B | `/mobiliario-comercial/` | Sectores, productos, condiciones, FAQ | Los 3 | Menú, categoría mesas |
| mobiliario comercial · … Argentina · muebles para comercios/locales | Comercial B2B | `/mobiliario-comercial/` | idem; título con "en Argentina" | Los 3 | Menú, home |
| fábrica/fabricante de muebles · muebles San Martín · muebles Buenos Aires | Local | `/`, `/nosotros/`, `/contacto/` | `LocalBusiness`+`FurnitureStore`, `areaServed`, dirección | — | Footer |

**Sin página, a propósito:** `mesa ratona`, `mesa de diseño`, `muebles para
living`, `muebles` (genérico), `muebles de diseño`. El taller no fabrica esos
productos; la SERP de living es de tiendas con catálogos amplios. Cubrirlas
exige ampliar el catálogo.

## 3. Decisiones técnicas (y por qué)

| Tema | Decisión | Motivo |
|---|---|---|
| `ProductGroup` (variantes) | **No se implementa** | Google lo pide para variantes con oferta/URL/SKU propios. Los colores del Sillón BKF son opciones de cotización sin precio ni SKU: agregarlas sería ruido. Los colores van en `additionalProperty` |
| Tipo de negocio | `LocalBusiness` + `FurnitureStore` | Es una fábrica con showroom donde se retira y se compra directo; Google recomienda el subtipo más específico |
| `Product.offers` sin precio | Se mantiene (solo disponibilidad) | No existe precio; ver §5 |
| `FAQPage` | Se mantiene en páginas con preguntas visibles | Google ya no muestra resultado enriquecido de FAQ para la mayoría de sitios; sigue sirviendo a otros motores y a la lectura de la página. 51 preguntas, ninguna repetida |
| `llms.txt` | Se mantiene | No ayuda ni perjudica en Google; es una convención útil para otros sistemas y se genera solo |
| `sameAs` | No se agrega | No hay perfiles oficiales verificados |
| Renombrar imágenes | No | Los nombres ya son descriptivos y renombrar rompe URLs de imagen ya indexadas |
| Marca ✦ de Gemini en las fotos | **No se recorta** | Quitar una marca de contenido generado por IA para que parezca una foto real sería engañoso. Reemplazar por fotos reales |

## 4. Cambios para Google (esta fase)

- `robots`: `max-image-preview:large, max-snippet:-1, max-video-preview:-1`
  (previews grandes en Search, Imágenes y Discover, sin límite de extracto).
- Imágenes: cada producto ahora publica **1:1, 4:3 y 16:9** (las tres
  proporciones que Google pide) como `ImageObject` con URL, dimensiones reales
  y descripción. `og:image`/`twitter:image` pasan a 1200x675 en lugar del
  cuadrado de 1600 px (se recortaba en WhatsApp y redes). Se generan con
  `scripts/build-social-images.sh`, mostrando el producto entero sobre un fondo
  desenfocado de la misma foto.
- `WebSite.alternateName` (`Taller Kappa S.R.L.`, `Taller Kappa SRL`) para el
  nombre del sitio en los resultados. Favicon de 48 px (múltiplo exigido).
- Local: "Cómo llegar" con ruta de Google Maps en Contacto y footer (mismas
  coordenadas del mapa); horario de retiro en el footer.
- Contenido por intención: FAQ de la guía con medidas, "BKF original" y cuidado
  del cuero; medidas estándar visibles en la landing; FAQ por categoría (incluye
  "¿existe una mesa BKF?"); catálogo y mobiliario comercial con títulos que
  nombran lo que son.

## 5. Precio

Sigue siendo la mayor brecha frente a quienes rankean `comprar` y `precio`
(todas las tiendas lo muestran en HTML y en `offers`). El mecanismo está listo
(`price` en `data/products.js`, ver fase 2 §8). Hace falta la decisión del
dueño: publicar un precio de lista o un "desde", con fecha de vigencia.

## 6. IA: qué se hizo y qué se puede medir

- **Google (AI Overviews / AI Mode):** no hay una marca "para IA": se rige por el
  mismo SEO (contenido útil, indexado, con datos claros). Todo lo anterior aplica.
  Sus clics e impresiones se cuentan dentro de la búsqueda web en Search Console;
  no hay un reporte aparte garantizado, por lo que conviene segmentar las
  consultas largas/conversacionales.
- **ChatGPT, Perplexity, Gemini, Copilot, Claude:** el mismo contenido
  citable (definiciones, tablas, FAQ, fuentes) y `llms.txt`. Para medirlo, el
  sitio ahora envía a GA4 el evento **`ai_referral`** (con `ai_source` y
  `landing_page`) cuando la visita llega con referrer o `utm_source` de esos
  asistentes (ChatGPT agrega `utm_source=chatgpt.com`). En GA4: Exploraciones →
  evento `ai_referral`; opcional, un grupo de canales con esos dominios.
- No se bloquea ningún rastreador en `robots.txt`.

## 7. Checklist de Search Console

1. Agregar la propiedad **de dominio** `tallerkappa.com.ar` (verificación por DNS).
2. Enviar `https://tallerkappa.com.ar/sitemap.xml` (15 URLs).
3. Inspeccionar y **solicitar indexación** de `/`, `/sillon-bkf/`, `/bkf/`,
   `/mobiliario-comercial/`, `/catalogo/`, `/catalogo/asientos/`, `/catalogo/mesas/`
   (el título viejo de la home se actualiza al reindexar).
4. Informe de **Páginas**: que las 16 estén "Indexadas" y que `/admin`, `404.html`
   y las `*.html` heredadas figuren como excluidas por `noindex`/redirección.
5. **Rendimiento**: filtrar por consultas con "BKF", "sillón", "mobiliario
   comercial", "San Martín"; mirar CTR y posición por página. Para IA, comparar
   consultas largas/conversacionales.
6. **Core Web Vitals** (datos de campo, tardan semanas en aparecer): mobile.
7. **Mejoras**: revisar Migas de pan, Logotipos, FAQ y Productos. Es esperable que
   Productos marque "Falta price" mientras no haya precio (no es una penalización).
8. **Acciones manuales** y **Seguridad**: deben estar vacías.
9. Después del deploy, medir de nuevo Lighthouse/PageSpeed sobre producción.

## 6b. Checklist de Perfil de Empresa de Google (no se modificó nada externo)

Usar **exactamente** los datos de `src/data/business.js`:

- **Nombre:** `Taller Kappa` (sin palabras clave agregadas: Google puede suspender
  perfiles con nombres inflados).
- **Categoría principal:** la más cercana a *fabricante de muebles* de la lista de
  Google; **secundarias:** las que correspondan a *mueblería/tienda de muebles* y
  a *proveedor de mobiliario comercial* si existen en la lista (las define Google).
- **Dirección:** Calle 28 Nº 3779, Villa Chacabuco, San Martín, Buenos Aires. Si
  atienden visitas, marcar la ubicación como visible; las entregas a domicilio se
  configuran como área de servicio (CABA, GBA y el interior).
- **Horario:** lunes a viernes de 9 a 18 hs. **Confirmar** si es horario de
  atención o solo de retiro, y cargarlo como corresponda.
- **Teléfono:** confirmar si 11 6124-2498 recibe llamadas además de WhatsApp.
- **Sitio web:** `https://tallerkappa.com.ar/` (idealmente con `?utm_source=gbp`
  para medir).
- **Descripción (borrador, ~420 caracteres):** "Taller Kappa S.R.L. es una fábrica
  de muebles de hierro y cuero en Villa Chacabuco, San Martín. Fabricamos sillones
  BKF, bancos BKF y bases de mesa para particulares, empresas y locales
  gastronómicos, con medidas y colores a pedido. Vendemos directo de fábrica y
  enviamos a todo el país. Retiro en el taller de lunes a viernes de 9 a 18 hs.
  Cotización por WhatsApp."
- **Productos:** Sillón BKF Premium, Banco BKF y Base de Mesa Flat, con la
  descripción, medidas y enlace de cada ficha.
- **Servicios:** fabricación a medida; mobiliario comercial; envíos a todo el
  país; retiro en el taller.
- **Fotos:** **reales** del frente, el taller, el proceso y los productos. Las
  imágenes actuales de producto están generadas con IA y no son adecuadas para
  el perfil.
- **Publicaciones:** novedades de producto, trabajos entregados (con permiso del
  cliente) y plazos; con enlace a la ficha.
- **Preguntas y respuestas:** cargar las 5 más frecuentes (qué fabrican, dónde,
  medidas, envíos, garantía) con las respuestas de la FAQ del sitio.
- **Reseñas:** solo reales. Pedirlas a clientes reales con el enlace directo, sin
  incentivos ni filtrar cuáles se piden, y responder todas. **Nunca** comprar ni
  generar reseñas.
- **Coherencia (NAP):** el nombre, la dirección y el teléfono deben ser idénticos
  en el perfil, el sitio y los directorios (ver Cylex, §9).

## 9. Autoridad externa (todo legítimo y verificable)

1. **Unificar fichas:** reclamar la ficha de **Cylex** ("Talleres Kappa S de H")
   y corregir nombre, dirección, teléfono y sitio; revisar si hay otras fichas
   con datos distintos.
2. **Directorios con ficha de empresa** para San Martín y fabricantes de muebles
   (la SERP mostró argentino.com.ar y fullconfort.com.ar), con datos idénticos
   a los del sitio.
3. **Perfiles oficiales** (Instagram, Facebook, LinkedIn) y, cuando existan,
   agregarlos a `sameAs` en `lib/schema.js`.
4. **Prensa de diseño y decoración** que ya cubre el BKF (La Nación Living,
   PuroDiseño): ofrecer el taller como fabricante nacional para notas o listados.
5. **Asociaciones de diseño y cámaras** empresariales o industriales de la zona
   (Fundación IDA publicó una nota sobre el BKF).
6. **Clientes:** con permiso, que YPF/Burger King/etc. mencionen o enlacen el
   proyecto en su sitio o prensa.
7. **Proveedores y partners** (curtiembres, pinturerías industriales): páginas de
   "quiénes nos eligen" con enlace.
8. **Reseñas reales** en Google y, si se vende por marketplaces, ahí también.
9. No: compra de enlaces, intercambios masivos, reseñas o perfiles falsos.

## 10. Pendientes

- Precio publicado (§5), fotos reales, confirmar horario/teléfono (§6b).
- Cloudflare (fase 2 §9): `http`→`https`, ofuscación de email, caché.
- Reclamar Cylex y demás fichas (§9).
- Medir producción después del deploy y volver a medir Search Console a las
  semanas; **no hay datos reales todavía**.
