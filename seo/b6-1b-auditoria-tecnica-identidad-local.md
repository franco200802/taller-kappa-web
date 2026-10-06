# B6.1-B — Auditoría técnica previa: identidad comercial y Local SEO

> Fecha: 6/10/2026 · Base: `main` @ `11ae80b` · Fase **solo documental**: no se modificó código, schema, rutas, imágenes ni configuración.
> Fuente de verdad: `seo/b6-1a-confirmacion-identidad-comercial.md` (respuestas del propietario, 6/10/2026).
> Convención: **CONFIRMADO** (fuente de verdad) · **PENDIENTE DE CONFIRMACIÓN** · **NO PUBLICAR**. Rutas relativas a `react-app/`.

## 1. Resumen ejecutivo

La identidad base ya es consistente: nombre, razón social, calle/número, barrio, localidad, teléfono, email y horario salen de **una sola fuente** (`src/data/business.js` + `src/data/contact.js`) y la consumen schema, llms.txt, FAQ y la mayoría de las páginas. No hay contradicciones de dato duro (teléfono, calle, horario). Lo que falta o difiere de lo confirmado:

1. **Código postal 1650 no existe en ningún lado** (ni visible ni `postalCode` en schema).
2. **Showroom**: aparece en solo 3 lugares (Footer "Fábrica & Showroom", FAQ id 4 "visitar el showroom", comentario de `schema.js`). No se comunica que las visitas son **con turno**, y **no hay ningún mecanismo de turno**.
3. **El horario 9–18 se rotula siempre como "Retiro en el taller"**; nunca como horario de atención/showroom. El schema lo emite como `openingHoursSpecification` genérico del negocio (se lee como horario comercial).
4. **Dirección escrita a mano en 6 lugares** (Footer, Contacto, Envios, faq.js x2, CartDrawer) en vez de usar `addressLine()`; el CP habría que agregarlo en todos.
5. **Schema**: sin `postalCode`, `priceRange`, `sameAs`, `foundingDate`; `streetAddress` mezcla calle + barrio; `FurnitureStore` es razonable pero hay matices (sección 9). Sin Review/AggregateRating: **correcto, mantener**.
6. **Testimonios**: 3 hardcodeados con **5 estrellas fijas decorativas**; el aria-label "5 estrellas" afirma una puntuación que no está respaldada. Sin Schema (correcto).
7. **Afirmaciones sin confirmar** presentes en el sitio: "100% Fabricación nacional", "5 Grandes marcas equipadas", entrega "24–48 hs" con stock, "Fábrica AR", "proveedor de confianza de…", fabricación propia de la Base de Mesa Flat, "retiro sin cargo", "factura A y B".
8. **"BKF de cuero" no existe como producto ni como término** en el repo: el único sillón es "Sillón BKF Premium" (hierro + cuero). No se sabe si son modelos distintos → **PENDIENTE DE CONFIRMACIÓN DEL PROPIETARIO**.
9. **Cylex "Talleres Kappa S de H"**: no aparece en el código ni en el schema (solo en los docs `seo/`). Sin enlace desde el sitio.
10. **Imágenes**: 3 fotos de producto reales (según el repo) + logo; **no hay fotos de showroom, taller, proceso ni personas**.

## 2. Fuente de verdad utilizada

Datos CONFIRMADOS (B6.1-A): Taller Kappa S.R.L.; fabricación propia de BKF de cuero, BKF Premium y Banco BKF; Calle 28 Nº 3779, Villa Chacabuco, San Martín, Buenos Aires, Argentina, **CP 1650**; showroom en la misma dirección; visitas **con turno**; retiro presencial; lunes a viernes 9:00–18:00; WhatsApp/teléfono 11 6124-2498; se mantiene el Gmail actual; +15 años; entrega 5–10 días hábiles; Cylex = Taller Kappa; GBP, Bing Places y redes **no disponibles**; **CUIT no se publica**; testimonios reales de WhatsApp (sin inventar nombres); logos de clientes se mantienen.

Pendientes ya listados en B6.1-A que condicionan esta auditoría: cómo se solicita el turno; si el retiro requiere coordinación; categoría preferida; relación "BKF de cuero" ↔ "BKF Premium"; fabricación propia de Base de Mesa Flat; coordenadas verificadas; autorización de nombres en testimonios; redacción fiscal; año de fundación.

## 3. Auditoría de identidad (apariciones)

| # | Dato | Archivo / sección | Valor encontrado | ¿Coincide? | ¿Corregir? | Riesgo si queda inconsistente |
|---|---|---|---|---|---|---|
| 1 | Nombre / razón social | `data/business.js` (`name`, `legalName`, `alternateName: ['Taller Kappa SRL']`) | Taller Kappa / Taller Kappa S.R.L. | Sí | No | — |
| 2 | Dirección (fuente) | `data/business.js` `address` + `addressLine()` | Calle 28 Nº 3779, Villa Chacabuco, San Martín, Buenos Aires, AR | Sí, **sin CP** | Agregar `postalCode: '1650'` | NAP incompleto en Google/Bing |
| 3 | Dirección hardcodeada | `components/Footer.jsx:70` | "Calle 28 Nº 3779, Villa Chacabuco (San Martín), Buenos Aires." | Sí, sin CP | Sí (usar fuente única + CP) | Divergencia futura entre copias |
| 4 | idem | `pages/Contacto.jsx:88` | igual que Footer | Sí, sin CP | Sí | idem |
| 5 | idem | `pages/Envios.jsx:18` | "Calle 28 Nº 3779, Villa Chacabuco (San Martín). Lunes a viernes de 9 a 18 hs." | Sí, sin CP | Sí | idem |
| 6 | idem | `data/faq.js:15` (id 2) y `:18` (id 4) | texto con dirección | Sí, sin CP | Sí | Se indexa también en `FAQPage` y llms |
| 7 | idem | `components/CartDrawer.jsx:33` | "Calle 28 Nº 3779 · San Martín · {WhatsApp}" | Sí, sin barrio/CP | Opcional | Menor |
| 8 | Dirección en schema | `lib/schema.js:78-84` | `streetAddress: "Calle 28 Nº 3779, Villa Chacabuco"`, locality San Martín, region Buenos Aires, country AR | Parcial | Sí: separar calle y barrio, agregar `postalCode` | Parseo ambiguo del NAP |
| 9 | Teléfono | `data/business.js:42` `+541161242498`; `contact.js` `541161242498` / `11 6124-2498`; FAQ id 16; `Contacto.jsx:49` | 11 6124-2498 | Sí | No | — |
| 10 | Email | `contact.js` `ing.franciscomarotta@gmail.com`; FAQ id 16; schema `email` y `contactPoint.email` | Gmail actual | Sí (se mantiene) | No | Percepción informal; **no inventar** correo corporativo |
| 11 | Descripción corta | `business.js` `summary` (usada en schema `description`, WebSite, llms) | "fábrica de muebles de hierro y cuero ubicada en Villa Chacabuco, San Martín… Fabrica sillones BKF, bancos BKF y bases de mesa…" | Sí | Revisar al sumar showroom/turno/trayectoria | Oportunidad |
| 12 | "Taller" vs "fábrica" vs "showroom" | Footer "Fábrica & Showroom"; Home "taller de San Martín"; Envios "Retiro en el taller"; SillonBKF "Fábrica propia"/"Fábrica AR"; FAQ "fábrica" | Mezcla de términos para el mismo lugar | Coherente (mismo lugar) | Definir vocabulario único | Confusión menor de entidad |
| 13 | Años | `Nosotros.jsx:85` "hace más de 15 años"; contador `NUMBERS` `15+` | +15 años | Sí | No (año de fundación NO se publica) | — |
| 14 | Plazo | `faq.js` id 12: "Los pedidos a medida se fabrican en 5 a 10 días hábiles"; también "24-48 horas" con stock, "2 a 4/5 días" en CABA/GBA | 5–10 confirmado; 24–48 h / 2–5 d **no confirmados** | Parcial | **PENDIENTE DE CONFIRMACIÓN** de los plazos con stock/zona | Promesa pública no respaldada |
| 15 | Fiscal | `Home.jsx:17` "responsables inscriptos"; `Nosotros.jsx:18` "contribuyentes responsables"; FAQ 15 "factura A y B" | Dos redacciones | n/a | Unificar; **PENDIENTE DE CONFIRMACIÓN** | Inconsistencia de entidad |
| 16 | "100% Fabricación nacional", "5 Grandes marcas equipadas" | `Nosotros.jsx:20-21` | Contadores | **No está en la fuente de verdad** | **PENDIENTE DE CONFIRMACIÓN** | Afirmación sin respaldo |
| 17 | Clientes / logos | `Home.jsx:24-28`, `Proyectos.jsx:10-34`, `Nosotros.jsx:158-162`, FAQ id 9 | YPF, McDonald's, Burger King, Shell, Sandro | Sí (se mantienen) | No bloquear; ver §6 sobre el matiz "proveedor de confianza" | Riesgo de marca de terceros (aceptado por el propietario) |
| 18 | Cylex | — | sin apariciones en `src/`, `scripts/`, `public/` | n/a | No | Ver §11 |
| 19 | Productos "BKF de cuero", "BKF Premium" | ver §5 | — | — | — | — |

Grep exhaustivo hecho sobre `src/`, `scripts/`, `index.html`, `public/`. Las páginas legacy `.html` son stubs generados por `prerender.js` (`LEGACY_PAGES`); no tienen contenido propio.

## 4. Showroom / visitas / retiro / horario

**Showroom**
- Se menciona en: `Footer.jsx:69` ("Fábrica & Showroom", sitio completo), `faq.js` id 4 ("visitar el showroom"; también va a `FAQPage` y a llms.txt vía FAQ), comentario interno de `lib/schema.js:65` (no visible). **No** figura en Home, Contacto, Nosotros, Envios ni en `llms.txt` ni en el `description` del schema.
- Misma dirección: sí, el Footer lo pone junto a la dirección; coincide con la fuente de verdad.
- ¿Se comunica bien? **Insuficiente**: una palabra en el footer y una frase en una FAQ. No hay sección "Visitá el showroom".

**Visitas**
- ¿Se indica turno? **No** en ninguna parte. La FAQ id 4 dice "visitar el showroom" sin condición → **contradice** "visitas con turno" (riesgo CRÍTICO de fricción: alguien llega sin aviso).
- Mecanismo para pedir turno: **no existe**. Hay WhatsApp y formulario de contacto (`Contacto.jsx`, Firebase sin configurar, con fallback), pero ninguno está presentado como pedido de turno. Cómo se solicita realmente → **PENDIENTE DE CONFIRMACIÓN** (¿WhatsApp?).

**Retiro**
- Se comunica en `Envios.jsx:18` ("Retiro en el taller", sin cargo), `Footer.jsx:71`, `Contacto.jsx:91`, Home `:114`, SillonBKF `:174`, Nosotros `:120`, FAQ id 2 y 12, llms.txt `:264,293`, Home `:128` ("coordinamos el envío o el retiro").
- ¿Requiere coordinación? El sitio es ambiguo: Home dice "coordinamos el… retiro", Envios/Footer lo muestran como libre en horario. **PENDIENTE DE CONFIRMACIÓN** (no asumir turno ni lo contrario). Tampoco está confirmado "sin cargo" de manera independiente salvo el texto actual del sitio.

**Horario 9–18**
- Consistente en valor en las 9 apariciones (`business.js:41` fuente → Footer, Contacto, Envios, Home, SillonBKF, Nosotros, FAQ id 2, llms.txt, schema).
- **Uso semántico**: todas lo rotulan "Retiro en el taller" (`hours.label` + comentario "Horario de retiro"). En schema es `openingHoursSpecification` a nivel `LocalBusiness`, o sea lo leen como "horario de apertura" del negocio. El propietario lo confirmó como atención/showroom/retiro. Inconsistencia: texto = solo retiro; schema = horario comercial; showroom = con turno (¿el turno es dentro de 9–18?, **PENDIENTE**).

## 5. Productos BKF

| Producto | ¿Existe como página? | Fabricación propia | Afirmaciones comerciales presentes | Estado |
|---|---|---|---|---|
| Sillón BKF Premium | Sí: `/sillon-bkf/` (landing comercial; `data/products.js` id 1; legacy `/catalogo/sillon-bkf-premium/` redirige) | CONFIRMADO (BKF Premium) | Hierro redondo macizo 12 mm, cuero vacuno curtido al vegetal, 78×70×90 cm, epoxi o cromado, garantía hierro de por vida / pintura 2 años / cuero 1 año, "Fábrica propia", "artesanalmente", "a medida sin costo adicional", stock sí | Materiales/garantías/medidas: ya figuraban y el propietario confirmó fabricación; **no hay re-confirmación específica de garantía ni de "stock: true"** → PENDIENTE |
| Banco BKF | Sí: `/catalogo/banco-bkf/` (id 2) | CONFIRMADO | Hierro macizo 12 mm, asiento de cuero, 38×38×45 cm, pie de cama/asiento auxiliar | OK, mismo pendiente de garantía/stock |
| BKF de cuero | **No existe** como página, nombre ni alternateName | CONFIRMADO como fabricación propia | Solo aparece como frase descriptiva ("cómo se cuida un sillón BKF de cuero", GuiaBKF) | **PENDIENTE DE CONFIRMACIÓN DEL PROPIETARIO**: ¿es el mismo producto que el Sillón BKF Premium, otra variante o una línea aparte? El repo no permite determinarlo |
| Base de Mesa Flat | Sí: `/catalogo/base-de-mesa-flat/` (id 3) | **No confirmable**: el código dice "Taller Kappa fabrica" (products.js, FAQ, Proyectos) pero B6.1-A solo confirmó los 3 BKF | Chapa torneada 10 mm, columna 77/101 mm, alturas 73/105 cm, uso gastronómico | **PENDIENTE DE CONFIRMACIÓN** |

- **Diferencia BKF / Premium / cuero**: el repo no define ninguna. Solo existe la diferencia sillón vs. banco (tamaño y uso, `products.js:52`, FAQ id 7). **No inventar.**
- El sitio declara explícitamente que "BKF" es un diseño (Bonet, Kurchan, Ferrari Hardoy, 1938) y que no vende "mesa BKF". Es posicionamiento correcto y debe preservarse.
- Solo hay 3 productos reales; cualquier referencia a catálogo mayor sería inventar.
- Nota: el título del Sillón dice "Comprar Directo de Fábrica", pero el sitio aclara que no hay compra online (cotización por WhatsApp). Coherente, no corregir.

## 6. Schema.org actual

Fuente: `src/lib/schema.js` (+ `lib/site.js` breadcrumbs, `pages/GuiaBKF.jsx:74`, `pages/MobiliarioComercial.jsx`, `scripts/prerender.js:167` valida que exista LocalBusiness). Se emite en cada página un `@graph` con `siteNodes()` (Organization/LocalBusiness + Brand + WebSite) más nodos por página.

| Tipo | Dónde | Propiedades usadas | Observaciones |
|---|---|---|---|
| `LocalBusiness` + `FurnitureStore` (`@id` ORG_ID) | `organizationNode()` | name, legalName, alternateName, description, url, logo (ImageObject 1024×1024), image[2], brand, telephone, email, address (PostalAddress), geo, hasMap, location (Place anidado), areaServed[6], openingHoursSpecification, contactPoint (sales), knowsAbout, hasOfferCatalog | Completo y bien enlazado. Ver incompletos abajo |
| `Brand` | `brandNode()` | name, url, logo | Correcto |
| `WebSite` | `websiteNode()` | name, alternateName (legalName+alt), description, inLanguage es-AR, publisher | Correcto |
| `Product` | `productNode()`/`productStub()` | name, alternateName, description, image[], category, material, brand, **manufacturer (ORG_ID)**, countryOfOrigin, additionalProperty, isRelatedTo, offers | Sin price/SKU/GTIN/rating (correcto). `manufacturer` ya expresa fabricación propia: **para Base de Mesa Flat queda PENDIENTE de confirmación** |
| `Offer` | `offerNode()` | url, availability (InStock si `stock`), itemCondition, seller | Sin precio. `availability: InStock` depende de `stock: true`: **PENDIENTE de confirmación** |
| `OfferCatalog` | Org y Service | categorías → productStub | Correcto |
| `Service` | `MobiliarioComercial.jsx` | serviceType, description, audience, hasOfferCatalog | Correcto |
| `Article` | guías | author/publisher = empresa, citation | Correcto |
| `FAQPage` | FAQ y landings | Question/Answer | **Hereda el defecto "visitar el showroom" sin turno** y direcciones sin CP |
| `ItemList`/`ListItem` | catálogo | — | OK |
| `BreadcrumbList` | `lib/site.js` | — | OK |
| `WebPage`/`CollectionPage` etc. | `pageType` línea ~292 | — | OK |
| `AggregateRating`, `Review`, `sameAs` (de la organización) | **no existen** | — | Correcto. (`sameAs` solo en la guía BKF apuntando a un concepto, no a la empresa) |

**Propiedades solicitadas, una por una**

| Propiedad | Estado actual | Propuesta |
|---|---|---|
| name | Taller Kappa | Mantener |
| address | Sin `postalCode`; `streetAddress` incluye el barrio | `streetAddress: "Calle 28 Nº 3779"`, `addressLocality: San Martín`, `addressRegion: Buenos Aires`, `postalCode: "1650"`, `addressCountry: AR`; Villa Chacabuco queda en `location` |
| postalCode | Falta | Agregar `1650` (CONFIRMADO) |
| telephone | `+541161242498` | OK |
| openingHours | `openingHoursSpecification` Lun–Vie 09:00–18:00 | Mantener los valores; rotular semántica (atención/showroom/retiro). Evaluar `hoursAvailable` en un `Place` de showroom solo si se separa la entidad (PENDIENTE) |
| geo | Presente (-34.5851938, -58.5281526); mismo par en iframe, `hasMap`, direcciones | **PENDIENTE DE CONFIRMACIÓN**: verificar que las coordenadas correspondan a Calle 28 Nº 3779 (B6.1-A lo dejó abierto). No cambiar sin verificación |
| url | `https://tallerkappa.com.ar/` | OK |
| logo | `logo-taller-kappa.jpg` 1024×1024 | OK |
| image | logo + imagen social del sillón | Falta una foto del lugar (no existe en el repo); oportunidad |
| description | `summary` | Ampliar con showroom/visitas con turno/trayectoria solo con datos confirmados |
| priceRange | Falta | **No incorporar**: sin precios publicados ni rango confirmado |
| areaServed | CABA, GBA, zonas, Argentina | Coherente con `/envios/`; los plazos por zona publicados son PENDIENTE |
| sameAs | Falta | **No incorporar** (sin GBP, Bing, redes). No usar Cylex salvo decisión explícita futura |
| foundingDate | Falta | **No incorporar** (solo "+15 años"; año exacto no confirmado) |
| brand | Referencia a `Brand` | OK |
| manufacturer | En Product → Org | OK para 3 BKF; Base Flat PENDIENTE |
| makesOffer | Falta | Opcional; `hasOfferCatalog` ya cubre. No necesario |
| hasOfferCatalog | Presente | OK |

**Datos contradictorios en schema**: `description` dice "fábrica" y no menciona showroom; `openingHoursSpecification` sin contexto de "con turno"; FAQ id 4 (showroom sin turno).
**No incorporar**: taxID/vatID (CUIT), priceRange, sameAs, foundingDate, aggregateRating, review, email corporativo inventado, cualquier perfil inexistente.

**Arquitectura propuesta (no implementada)**
1. Mantener **un solo nodo** `LocalBusiness`+`FurnitureStore` (`@id` ORG_ID) como entidad principal, referenciado por Brand, WebSite, Product (`manufacturer`, `seller`).
2. Dirección corregida con `postalCode`; `streetAddress` solo calle y número.
3. Showroom: no crear una entidad `Place` separada mientras comparta dirección y horario; expresarlo en `description` y en el texto visible. Reconsiderar solo si el propietario confirma horarios distintos de showroom y retiro.
4. `openingHoursSpecification` se mantiene; el rótulo "con turno" va en contenido visible/FAQ (schema.org no tiene un campo estándar fiable para "con turno").
5. `contactPoint` sales: mantener; opcionalmente añadir `hoursAvailable` coherente.
6. Sin `sameAs`, `foundingDate`, `priceRange`, `aggregateRating`, `review`.
7. Product: sin cambios hasta resolver "BKF de cuero" y Base Flat.

## 7. Testimonios y estrellas

- **Dónde**: solo `pages/Nosotros.jsx:28-31` (`FALLBACK_TESTIMONIOS`), render `:166-176`. Hay un intento de lectura desde Firestore (`getTestimonios`) pero Firebase está sin configurar → siempre se ven los 3 hardcodeados.
- **Cuántos**: 3. Textos: Bases Flat en YPF Full; "calidad del hierro… cumplieron con los tiempos"; "Excelente atención de Francisco… medidas para mi mesa".
- **Nombre**: "Franquicia YPF Full", "Local Gastronómico (Shell Select)", "Ricardo L. (Particular)". Solo el tercero tiene nombre parcial; su autorización → PENDIENTE.
- **Estrellas**: 5 íconos **fijos para todos** (`aria-label="5 estrellas"`): **decorativas**, no respaldadas por una puntuación real ni por la fuente (WhatsApp no tiene puntuación).
- **Schema**: ninguno (`schema.js:15` declara "sin reviews ni rating"). No hay puntuación numérica, ni cantidad de reseñas, ni fuente externa.
- **Problemas posibles**: marcar con `Review`/`AggregateRating` reseñas escritas y administradas por el propio sitio sobre la propia empresa incumple las directrices de Google para reseñas de la propia entidad y puede dar acción manual o pérdida de elegibilidad; además se tendría que inventar `ratingValue`/`reviewCount`.

| Opción | Evaluación |
|---|---|
| A. Testimonios visibles sin Schema | **Recomendada** |
| B. `Review` individual | No: autoría ambigua, no hay `reviewRating` real, riesgo de self-serving review |
| C. `AggregateRating` | **No**: exigiría inventar puntuación y cantidad |
| D. Otra | Complementaria: cuando exista GBP/Bing se enlazan reseñas reales externas |

**Recomendación**: A, más (en la implementación) quitar o neutralizar las estrellas fijas (o rotular como "Testimonio de cliente recibido por WhatsApp") y dejar los nombres genéricos salvo autorización. Decisión sobre las estrellas → confirmación del propietario/criterio SEO. El matiz "proveedor de confianza de… YPF, McDonald's…" (`Nosotros.jsx:87`) es una afirmación comercial amplia; el propietario confirmó proyectos reales, pero no el alcance "proveedor" → riesgo medio, PENDIENTE de redacción.

## 8. Imágenes

Todas en `public/images/` (el directorio raíz `images/` es legado de la web anterior).

| Grupo | Rutas | Formato / tamaño | Uso actual | Oportunidad |
|---|---|---|---|---|
| Sillón BKF Premium | `sillon-bkf-hierro-cuero*.jpg/.webp/.avif` (480–1600 px, 4x3, 16x9) | JPG 228 KB original; AVIF 10–35 KB | Home, `/sillon-bkf/`, Nosotros, schema | Correcta; falta foto en contexto/ambiente |
| Banco BKF | `banco-bkf-hierro-cuero*` | JPG 119 KB; AVIF 11–25 KB | Catálogo, ficha | Ídem |
| Base de Mesa Flat | `base-mesa-flat-hierro*` | JPG 103 KB | Catálogo, Proyectos | Ídem |
| Logo | `logo-taller-kappa.jpg` 1024×1024, 48 KB | JPG | schema logo, header | Un PNG/WebP con fondo transparente es opcional |
| Logos de clientes | `logoypf.png`, `mcdonaldslogo.png`, `burguerlogo.png/.webp`, `shelllogo.png`, `sandrologo.png` | PNG 1–81 KB | Home, Proyectos, Nosotros | Mantener (decisión del propietario) |
| Sin uso en `src/` | `bkf1.jpg` (242 KB), `bkfapoyapies.jpg` (125 KB), `mesa.jpeg` (102 KB) | JPG | **No referenciadas** (no encontradas en `src/`/`scripts`) | Posibles fotos reales aprovechables; origen y marca de agua IA **no verificados** (B6.1-A mencionaba 3 imágenes con posible marca de agua) |
| Showroom / taller / proceso / personas | **No existen en el repo** | — | — | **Mayor oportunidad Local/entity**: fotos reales de fachada, showroom, taller y proceso (para la web y para GBP/Bing futuros). Requiere que el propietario las aporte |
| Íconos/favicons | `favicon-*`, `icon-192/512`, `apple-touch-icon` | PNG/ICO | manifest, head | OK |

No se generó ni reemplazó ninguna imagen.

## 9. Geolocalización

- **Existe**: `business.js:36` lat/long; `schema.js` `GeoCoordinates`; `hasMap` (`mapUrl`); iframe de Google Maps en `Footer.jsx:51` (carga diferida); enlace "Cómo llegar en Google Maps" en Footer y Contacto (`directionsUrl`). Todo usa el mismo par de coordenadas.
- **Falta / pendiente**: verificación de que el punto sea realmente Calle 28 Nº 3779 (el propio comentario dice "mismas coordenadas del mapa embebido", no que se hayan verificado contra la dirección). El mapa/enlaces usan coordenadas, no la dirección escrita: si la coordenada difiere unos metros, los usuarios llegan al lugar equivocado. **Dato que falta**: confirmación del propietario (abrir el punto en Maps o enviar el pin real del local). No inventar ni "corregir" coordenadas.
- Una vez creados GBP/Bing, el `hasMap` debería apuntar a la ficha (hoy NO DISPONIBLE).

## 10. Categoría comercial

| | |
|---|---|
| Actual | `['LocalBusiness','FurnitureStore']` |
| Realidad confirmada | Fabricante directo de muebles de hierro y cuero, con showroom con turno, retiro presencial, venta por cotización |
| Alternativas | (a) mantener `FurnitureStore`; (b) `LocalBusiness` + `Organization` sin subtipo; (c) `HomeAndConstructionBusiness`/`Store`; (d) añadir un tipo de manufacturador (schema.org no tiene un subtipo de LocalBusiness específico de fábrica de muebles) |
| Recomendación | **Mantener `FurnitureStore`** (descriptivo y estándar para Google/Bing); la identidad de "fabricante" se refuerza con `description`, `knowsAbout`, `Product.manufacturer` y texto visible, no con un tipo ficticio |
| Motivo | Es el subtipo más cercano; "fabricante" no es un tipo LocalBusiness; en Maps la categoría real se elegirá en GBP (futuro: "Fabricante de muebles"/"Tienda de muebles", **decisión del propietario**, categoría preferida PENDIENTE) |
| Riesgos de cambiar | Pérdida de coherencia entre schema y la futura categoría GBP; ningún beneficio de ranking demostrado |

`FurnitureStore` sugiere "tienda" y puede interpretarse como venta online/en local libre; mitigación: aclarar "visitas con turno" y "cotización por WhatsApp" en contenido.

## 11. Cylex

- "Talleres Kappa S de H": **0 apariciones** en `src/`, `scripts/`, `public/`, `index.html` y schema. El sitio **no enlaza** a Cylex ni lo usa en `sameAs`. (La búsqueda de "S de H" en `dist/` dio falsos positivos por texto español común.)
- Confirmado por el propietario que es Taller Kappa; la razón social actual es S.R.L. → la ficha usa una denominación distinta (S de H) y puede debilitar la consistencia NAP de la entidad en directorios.
- Acción futura: unificar el nombre en Cylex (acción externa del propietario). No tocar el sitio ni agregar Cylex a `sameAs` hasta decidirlo.

## 12. NO PUBLICAR / NO INVENTAR

- **CUIT** y cualquier dato fiscal no confirmado (`taxID`, `vatID`, condición IVA exacta).
- **Google Business Profile** y **Bing Places** (no existen): no incluir URLs ni `hasMap` a fichas inexistentes.
- **Redes sociales**: no `sameAs`, no íconos/enlaces.
- **Nombres de clientes** en testimonios (inventar o completar apellidos); "Ricardo L." solo con autorización.
- **Puntuaciones** (`ratingValue`, "5 estrellas" como dato) y **cantidad de reseñas** (`reviewCount`).
- **Coordenadas** no verificadas; no sustituirlas.
- **Año de fundación** (`foundingDate`) y fecha exacta; solo "más de 15 años".
- **`priceRange`**, precios.
- **Email corporativo** inventado.
- "Showroom con horario propio", "stock exacto", "plazos por zona" y "100% nacional" si el propietario no lo confirma.
- **Cylex** como perfil oficial (`sameAs`) sin decisión.

## 13. Relación con Google / Bing / IA (sin promesas de ranking)

| Dato confirmado | Google Search | Google Maps/Local | Bing | Buscadores IA / GEO |
|---|---|---|---|---|
| Fabricante directo, productos fabricados | Texto y `manufacturer`; entidad más clara | Categoría y descripción de GBP (futuro) | Idem | Frase citable "fabrica y vende directo": ya en FAQ/summary |
| Showroom + visitas con turno | Contenido de intención local | Atributo "con cita previa" en GBP | Bing Places | Respuesta a "¿se puede ver el producto?" |
| Dirección + CP 1650 | Señal NAP, rich results de negocio | Verificación de ubicación | NAP | Citación de dirección completa |
| Retiro presencial | Contenido/FAQ | Atributo de servicio | Idem | Respuesta lista |
| Teléfono/WhatsApp, horario | `telephone`, `openingHours` | Core de la ficha | Idem | Datos de contacto directos |
| Trayectoria +15 años | Confianza (E-E-A-T) en texto | Descripción | Idem | Evidencia de experiencia, sin año exacto |
| Plazo 5–10 días hábiles | FAQ | — | — | Respuesta puntual citable |

Hoy la mayor limitación **no es técnica del sitio sino de presencia externa**: sin GBP ni Bing Places, el showroom y el NAP no tienen ancla en Maps (tarea del propietario, fuera de esta fase).

## 14. Riesgos encontrados

1. **Visitas sin turno en FAQ id 4** (CRÍTICO): contradice lo confirmado y se propaga a `FAQPage` y llms.txt.
2. **Sin CP** en visible y schema; NAP incompleto.
3. **Estrellas fijas** y aria-label "5 estrellas": afirmación sin respaldo.
4. **Afirmaciones no confirmadas**: "100% Fabricación nacional", "5 grandes marcas", plazos 24–48 h / 2–5 días, "proveedor de confianza", "Fábrica AR", fiscal, fabricación de Base Flat.
5. **Coordenadas sin verificar**.
6. Dirección duplicada en 6 lugares: deriva futura.
7. Horario rotulado solo "retiro" vs schema comercial.
8. "BKF de cuero" inexistente en el catálogo/contenido; intención de búsqueda sin cubrir y sin saber si es el mismo producto.
9. Ausencia de fotos reales de showroom/taller/proceso.
10. Presencia externa nula (GBP, Bing, redes) y Cylex con otra denominación.
11. Gmail personal como contacto único (aceptado).
12. Firebase sin configurar: el formulario de contacto y testimonios dinámicos dependen del fallback; no se puede asumir que los envíos del formulario se guarden (fuera de alcance, mencionado por contexto).

## 15. Tabla de hallazgos

| Hallazgo | Archivo | Situación actual | Acción recomendada | Confirmación requerida | Prioridad |
|---|---|---|---|---|---|
| FAQ id 4 invita a "visitar el showroom" sin turno | `data/faq.js:18` | Sin condición de turno; propaga a FAQPage/llms | Reescribir: showroom con turno previo | Cómo se pide el turno | CRÍTICA |
| CP 1650 ausente | `data/business.js`, `lib/schema.js` | Sin `postalCode` | Agregar `postalCode: '1650'` y mostrarlo | No (confirmado) | CRÍTICA |
| Showroom casi invisible | `Footer.jsx:69`, `Contacto.jsx`, `Nosotros.jsx`, `Home.jsx` | Solo Footer + 1 FAQ | Sección visible de showroom/visitas con turno en Contacto y mención en Nosotros/Home | Cómo solicitar turno; horario del turno | ALTA |
| Mecanismo de turno inexistente | `Contacto.jsx` | Solo contacto genérico | Botón/texto "Pedí tu turno por WhatsApp" con mensaje pre-armado (si el propietario lo confirma) | Canal de turno | ALTA |
| Dirección hardcodeada ×6 | Footer, Contacto, Envios, faq, CartDrawer | Duplicada | Usar `addressLine()` (+ CP) en todas | No | ALTA |
| `streetAddress` mezcla calle y barrio | `lib/schema.js:78-84` | "Calle 28 Nº 3779, Villa Chacabuco" | Separar; barrio solo en `location` | No | ALTA |
| Horario rotulado solo "retiro" | `business.js:41`, Footer, Contacto, Envios, Home, SillonBKF, Nosotros, llms | "Retiro en el taller" | Rotular como atención/showroom/retiro; coherencia con schema | ¿Turno dentro de 9–18? ¿retiro con coordinación? | ALTA |
| Retiro: coordinación no definida | Home `:128` vs Envios `:18` | Ambiguo | Redactar solo tras confirmar | Retiro con/sin coordinación | ALTA |
| Estrellas fijas "5 estrellas" | `Nosotros.jsx:171` | Decorativas, aria-label afirma puntuación | Eliminar/neutralizar; mantener testimonios sin Schema | Autorización del criterio y de nombres | ALTA |
| Afirmaciones "100% nacional" y "5 marcas" | `Nosotros.jsx:20-21` | Sin respaldo en B6.1-A | Confirmar o retirar | Propietario | ALTA |
| "BKF de cuero" ≠ "BKF Premium" sin definir | `data/products.js`, páginas | Inexistente como producto | Definir relación antes de B3–B5 | Diferencia real entre variantes | ALTA |
| Base de Mesa Flat: fabricación propia sin confirmar | `products.js` id 3, FAQ, Proyectos, `manufacturer` | Se afirma "fabrica" | Confirmar; ajustar `manufacturer` si no | Fabricación propia | ALTA |
| Plazos 24–48 h/2–5 d y "stock" | `faq.js` id 12, SillonBKF FAQ, `products.js stock:true` | No confirmados | Confirmar y alinear con 5–10 días hábiles | Plazos reales y stock | ALTA |
| Coordenadas sin verificar | `business.js:36-39`, Footer iframe | Mismas en todos lados | Verificar pin real | Pin/ubicación real | ALTA |
| Texto fiscal inconsistente | `Home.jsx:17`, `Nosotros.jsx:18` | Dos redacciones | Unificar | Condición fiscal exacta | MEDIA |
| `description`/`summary` sin showroom ni trayectoria | `business.js:20` | Solo "fábrica" | Ampliar con datos confirmados | No | MEDIA |
| Vocabulario fábrica/taller/showroom | varios | Mezcla | Guía única de términos | No | MEDIA |
| "Proveedor de confianza de…" | `Nosotros.jsx:87` | Alcance no confirmado | Suavizar a "hemos equipado" si no hay relación de proveeduría continuada | Alcance del vínculo | MEDIA |
| Sin `sameAs`/GBP/Bing/redes | `lib/schema.js` | Correcto (no existen) | No agregar; planificar alta futura de GBP/Bing | Decisión de crear perfiles | MEDIA |
| Cylex con otra denominación | externo | Sin referencias en repo | Unificar nombre en el directorio | Propietario | MEDIA |
| Fotos de showroom/taller/proceso inexistentes | `public/images` | Solo 3 productos + logo | Pedir fotos reales | Propietario las aporta | MEDIA |
| 3 imágenes sin uso (`bkf1`, `bkfapoyapies`, `mesa`) | `public/images` | Sin referenciar; posible marca de agua IA | Revisar origen antes de usar | Origen/derechos | BAJA |
| Categoría `FurnitureStore` | `lib/schema.js:66` | Razonable | Mantener | Categoría preferida (para GBP) | BAJA |
| `CartDrawer` dirección abreviada | `CartDrawer.jsx:33` | Sin barrio/CP | Alinear | No | BAJA |
| Gmail personal | `contact.js` | Se mantiene | Sin acción | No | BAJA |

## 16. Cambios recomendados vs. cambios que requieren confirmación

**Se pueden implementar sin nueva confirmación (datos ya confirmados)**
- CP 1650 en datos, schema y textos.
- Dirección única vía `addressLine()`; `streetAddress` solo calle.
- Mencionar "showroom en la misma dirección" y "visitas con turno" en Footer, Contacto, FAQ id 4, Nosotros (sin inventar el mecanismo).
- Reescritura de la FAQ de showroom para decir turno previo.
- Mantener sin Review/AggregateRating; sin sameAs/foundingDate/priceRange/CUIT.
- Ampliar `summary` con showroom y trayectoria (+15 años).

**Requieren confirmación del propietario**
1. Cómo se solicita el turno (WhatsApp, formulario, teléfono) y si el turno cae en 9–18.
2. Si el retiro requiere coordinación previa.
3. Relación "BKF de cuero" / "BKF Premium" / Sillón (¿una línea o tres?).
4. Fabricación propia de Base de Mesa Flat.
5. Plazos 24–48 h/2–5 días, stock, "100% nacional", "5 grandes marcas", garantías.
6. Pin real de Maps.
7. Estrellas: ¿se retiran? Autorización de "Ricardo L.".
8. Redacción fiscal única.
9. Categoría preferida (para futuro GBP).
10. Alcance de "proveedor de confianza".
11. Fotos reales y origen de las tres imágenes sin uso.

## 17. Plan exacto para la futura implementación B6.1-B (no ejecutado)

**Paso 1 — Datos (`data/business.js`)**: agregar `postalCode: '1650'` a `address`; ampliar `addressLine()` con CP; renombrar `hours.label` semántica (atención/showroom/retiro) tras confirmación; ampliar `summary`; añadir objeto `showroom` (`appointmentRequired: true`, texto de turno). No tocar geo.
**Paso 2 — Schema (`lib/schema.js`)**: `streetAddress` solo calle; agregar `postalCode`; mantener tipos; dejar sin sameAs/foundingDate/priceRange/rating/review; actualizar el comentario.
**Paso 3 — Texto visible**: sustituir direcciones duplicadas (Footer, Contacto, Envios, faq, CartDrawer) por la fuente única; agregar bloque "Visitá el showroom (con turno)" en Contacto; ajustar Footer y Nosotros; unificar vocabulario.
**Paso 4 — FAQ**: reescribir id 2 y 4 (turno, CP); revisar id 12 tras confirmar plazos; añadir pregunta "¿Se puede visitar el showroom?" y "¿Hay retiro presencial?" (retiro solo con la respuesta confirmada).
**Paso 5 — Testimonios**: neutralizar estrellas fijas; mantener sin Schema; texto "recibido por WhatsApp" opcional.
**Paso 6 — Productos**: aplicar lo que confirme el propietario sobre BKF de cuero/Premium/Base Flat y ajustar `manufacturer`/stock.
**Paso 7 — llms.txt (generado por `prerender.js`)**: se actualiza solo al cambiar los datos; verificar showroom/CP/turno.
**Paso 8 — Verificación**: `npm run build`; inspeccionar `dist/` (JSON-LD, llms.txt, sitemap sin cambios); grep de "1650"; validar Rich Results/Schema.org; comprobar que no apareció `aggregateRating`/`sameAs`; revisar mobile; commit atómico y deploy.
Todo es un cambio de código (deploy por GitHub Actions); nada de esto se hizo.

## 18. Orden recomendado de implementación

1. Confirmaciones del propietario (turno, retiro, Base Flat, BKF de cuero, plazos, pin).
2. B6.1-B-1: CP + dirección única + schema address (sin dependencias).
3. B6.1-B-2: showroom/visitas con turno (FAQ id 4, Contacto, Footer, Nosotros).
4. B6.1-B-3: horario/retiro (tras confirmar coordinación).
5. B6.1-B-4: testimonios/estrellas y afirmaciones sin respaldo.
6. B6.1-B-5: productos (BKF de cuero/Base Flat) y schema Product.
7. Externo en paralelo: fotos reales, pin de Maps, alta de GBP/Bing Places y unificación de Cylex.
8. Recién después de GBP/Bing: evaluar `sameAs` y `hasMap` hacia la ficha.
