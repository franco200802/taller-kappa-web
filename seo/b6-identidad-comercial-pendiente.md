# B6.0 — Identidad comercial pendiente (fuente única de verdad)

> **Documento histórico.** Varios puntos "pendientes" y "contradicciones" de este informe (showroom vs retiro, fabricante vs revendedor, CP, horario, Cylex, email) quedaron resueltos con las respuestas del propietario del 6/10/2026. La versión vigente es `seo/b6-1a-confirmacion-identidad-comercial.md`.
>
> Auditoría y documentación. No se modificó código, schema, páginas, rutas ni componentes.
> Fecha: 6/10/2026 · Rama `main` (`24603a6`, igual a `origin/main`).
> Etiquetas: `[V]` verificado en repositorio · `[DUEÑO]` afirmación que `CONTEXTO_PROYECTO.md` registra como confirmada por el dueño el 1/10/2026 (nota escrita por un asistente: no es un documento firmado ni verificable de forma independiente) · `REQUIERE CONFIRMACIÓN DEL CLIENTE` · `NO ENCONTRADO`.
> Búsqueda hecha sobre `react-app/src`, `react-app/scripts`, `react-app/public`, `react-app/index.html`, `firestore.rules`, `docs/`, `CONTEXTO_PROYECTO.md` y `.github/`. No existe `README.md`.

## 0. Corrección sobre el informe B6 anterior
`seo/b6-local-seo-entity.md` (sin versionar) dijo que los testimonios y los logos no tenían "fuente verificable en el repo". Esa afirmación era incompleta: `CONTEXTO_PROYECTO.md` (§ "Confirmado por el dueño", 1/10/2026, commit `003bf57`) registra que **el dueño confirmó como ciertos** los testimonios de `Nosotros.jsx`, los clientes y el detalle de `Proyectos.jsx`, "más de 15 años", "1938/MoMA", plazos de 5 a 10 días hábiles y el asiento de cuero del Banco BKF. Lo que **sigue sin documentarse** es: quién escribió cada testimonio, de qué canal salió, y la autorización de uso de los logos de marca. Esa distinción se aplica abajo.

## 1. Estado de git antes de empezar
- `git status --short`: solo `?? seo/` (documentos de auditoría previos, sin versionar). Sin cambios en archivos rastreados.
- Rama: `main`. Últimos commits: `24603a6` (merge PR #7), `730c66a`, `49002b9`, `2921ada`, `a136ab9`.
- Esta tarea agrega **un solo archivo**: este documento. Los otros archivos de `seo/` no forman parte de este commit.

## 2. Datos encontrados
| Dato | Valor encontrado | Archivo / ubicación | Confianza | Contradicciones |
|---|---|---|---|---|
| Nombre comercial | Taller Kappa | `data/business.js` (`name`); `Footer.jsx`; `manifest.json`; títulos de todas las páginas | Alta `[V]` | Ninguna dentro del sitio. Variante externa: "Talleres Kappa S de H" (ver §9) |
| Razón social | Taller Kappa S.R.L. (variante `alternateName`: "Taller Kappa SRL") | `business.js` (`legalName`); `Footer.jsx` (©); `CartDrawer.jsx:33` (presupuesto imprimible); `Nosotros`, `MobiliarioComercial`, `SillonBKF` | Alta en el sitio; **no hay documento societario en el repo** | Ficha externa con otra forma legal (S de H) |
| Dirección | Calle 28 Nº 3779, Villa Chacabuco, San Martín, Buenos Aires, Argentina | `business.js` (`address`); `Footer.jsx:70`; `Contacto.jsx:88`; `Envios.jsx:18`; `faq.js:15,18`; `CartDrawer.jsx:33` | Alta `[V]` | Escrita **a mano en 5 sitios** además de `business.js`. En `CartDrawer.jsx` aparece sin barrio ("Calle 28 Nº 3779 · San Martín"). En `schema.js` el barrio va dentro de `streetAddress` |
| Código postal | `NO ENCONTRADO` | — | — | — |
| Localidad | San Martín (barrio: Villa Chacabuco) | `business.js`; schema `addressLocality` | Alta | La ficha externa dice "General San Martín" (nombre completo del partido) |
| Provincia | Buenos Aires ("provincia de Buenos Aires") | `business.js` (`region`); schema (`Provincia de Buenos Aires` en `location`) | Alta | — |
| País | Argentina (`AR`) | `business.js`; schema | Alta | — |
| Teléfono | +541161242498 (11 6124-2498) | `business.js` (`phone`); `contact.js`; `Contacto.jsx:49` y `SillonBKF.jsx:20` (meta/FAQ); `faq.js:32` | Alta | **Es el mismo número que el de WhatsApp**; no hay evidencia de que reciba llamadas `REQUIERE CONFIRMACIÓN DEL CLIENTE` |
| WhatsApp | 541161242498 | `data/contact.js` (`WHATSAPP_NUMBER`) | Alta | Ídem |
| Email | `ing.franciscomarotta@gmail.com` | `contact.js`; `Footer.jsx`; `Contacto.jsx`; `faq.js:32`; schema; llms.txt; **y como administrador de Firestore** en `firestore.rules:59` | Alta (consistente) | Gmail con nombre y cargo de una persona; no es un email de dominio. Se usa a la vez como contacto público y como cuenta de administración |
| Dominio | `tallerkappa.com.ar` | `lib/site.js`, `CNAME` | Alta | — |
| Horarios | Lunes a viernes, 09:00–18:00 | `business.js` (`hours`); ver §4 | Alta como texto | Se publica como "**Retiro** en el taller", pero el schema lo emite como `openingHoursSpecification` (apertura) |
| Coordenadas | -34.5851938, -58.5281526 | `business.js` (`geo`, `mapUrl`, `directionsUrl`); iframe de `Footer.jsx` | Media: coherentes entre sí | **No hay evidencia en el repo de que apunten a Calle 28 Nº 3779** `REQUIERE CONFIRMACIÓN DEL CLIENTE` |
| Showroom | Sí: "Fábrica & Showroom"; "visitar el showroom" | `Footer.jsx:69`; `faq.js:18`; comentario en `schema.js:65` | — | Ver §3 |
| Retiro | Sí: "Retiro en el taller: lunes a viernes de 9 a 18 hs"; "Podés retirar tu pedido sin cargo" | `Footer.jsx:71`; `Contacto.jsx:91`; `Home.jsx:114,128`; `Nosotros.jsx:120`; `SillonBKF.jsx:163,174`; `GuiaBKF.jsx:163`; `Envios.jsx:18,39`; `faq.js:15`; `business.js:40` | Alta como texto | Ver §3 |
| Visita al taller | Solo "visitar el showroom" en `faq.js:18`. Ninguna página dice si se atiende sin turno | `faq.js:18` | Baja | `NO ENCONTRADO` en cualquier otra parte |
| Categoría | `['LocalBusiness', 'FurnitureStore']`; `Service` ("Fabricación de mobiliario comercial y gastronómico"); `Product` | `lib/schema.js:66`; `MobiliarioComercial.jsx:51-52` | Alta como código | `FurnitureStore` ("tienda de muebles") frente a "fábrica" en el texto |
| Descripción | "…fábrica de muebles de hierro y cuero ubicada en Villa Chacabuco, San Martín… Fabrica sillones BKF, bancos BKF y bases de mesa para particulares, empresas y locales gastronómicos." | `business.js` (`summary`); `faq.js:14`; `Nosotros.jsx:68`; llms.txt; schema | Alta | — |
| Relación con BKF | "Fabrica" su propio sillón BKF; "fabrica su propia versión de ese diseño" | Ver §5 | Alta como texto del sitio | Ver §5 |
| Año de fundación | "nació hace más de 15 años"; contador "15+ años de experiencia" | `Nosotros.jsx:85,22`; `[DUEÑO]` | Media (confirmado por el dueño, sin año) | No hay `foundingDate`; año exacto `NO ENCONTRADO` |
| CUIT / CBU / IVA | CUIT `NO ENCONTRADO`. Condición fiscal: "responsables inscriptos" (`Home.jsx:17`) y "contribuyentes responsables" (`Nosotros.jsx:18`). "Emitimos factura A y B" | `Home.jsx`, `Nosotros.jsx`, `faq.js:31` | Media | Dos redacciones distintas del mismo dato; sin CUIT |
| Redes sociales | `NO ENCONTRADO EN REPOSITORIO` | — | — | — |

## 3. Showroom vs retiro vs visita vs horarios (sin decidir)
| Concepto | Dónde aparece | Texto | Estado |
|---|---|---|---|
| **Showroom** | `Footer.jsx:69` (en todas las páginas) | "Fábrica & Showroom" | `REQUIERE CONFIRMACIÓN DEL CLIENTE` |
| | `faq.js:18` (FAQ, `FAQPage`, llms.txt) | "…consultar stock y coordinar tu compra por WhatsApp **o visitar el showroom**" | `REQUIERE CONFIRMACIÓN DEL CLIENTE` |
| | `schema.js:65` (comentario de código, no sale en el HTML) | "fábrica con showroom donde se retira lo pedido y se cotiza directo" | Interno; refuerza `FurnitureStore` |
| **Retiro** | `Footer.jsx:71`, `Contacto.jsx:91`, `Home.jsx:114/128`, `Nosotros.jsx:120`, `SillonBKF.jsx:163/174`, `GuiaBKF.jsx:163`, `Envios.jsx:18/39`, `faq.js:15`, `business.js:40` | "Retiro en el taller: lunes a viernes de 9 a 18 hs"; "Podés retirar tu pedido sin cargo en nuestro taller" | Consistente en el sitio |
| **Visita** | Solo `faq.js:18` ("visitar el showroom") | — | Único punto; sin horario ni turno |
| **Horario comercial** | `NO ENCONTRADO` como concepto separado | — | — |
| **Horario de atención** | `NO ENCONTRADO` como concepto separado (WhatsApp sin horario) | — | — |
| **Horario de retiro** | `business.js:40-41` ("Horario de retiro en el taller que ya publica /envios/") | lunes a viernes 9–18 | Es el único horario del sitio |
| **Horario de visita** | `NO ENCONTRADO` | — | — |
| Horario en schema | `schema.js:108-113` | `openingHoursSpecification` L–V 09:00–18:00 | Comunica "apertura" a partir de un dato de "retiro" |

El repositorio **no permite determinar** si hay showroom, si se puede visitar sin pedido ni si el horario de retiro es también de atención. Los cuatro conceptos están mezclados. `REQUIERE CONFIRMACIÓN DEL CLIENTE`.

## 4. Nombre comercial: variantes encontradas
| Variante | Dónde |
|---|---|
| Taller Kappa | Todo el sitio, títulos, `manifest.json`, llms.txt |
| Taller Kappa S.R.L. | `business.js`, schema `legalName`, `Footer.jsx` (©), `CartDrawer.jsx` (presupuesto), `Nosotros`, `faq.js` |
| Taller Kappa SRL | `business.js` (`alternateName`), schema, `WebSite.alternateName` |
| tallerkappa.com.ar | `CartDrawer.jsx` (presupuesto), dominio |
| Talleres Kappa S de H, General San Martín | **Solo fuera del sitio**: ficha en Cylex, citada en `docs/seo/seo-google-fase-3.md:15`. No aparece en el código |
| Otras variantes ("Kappa Taller", etc.) | `NO ENCONTRADO` |

## 5. Relación con BKF: qué afirma realmente el sitio
No se infiere nada fuera de lo que dice el texto. `NO ENCONTRADO` en todo el código: "distribuidor", "revendedor", "importa", "comercializa".

| Afirmación | Ubicación | Evidencia | Nivel de certeza |
|---|---|---|---|
| Fábrica de muebles de hierro y cuero que "fabrica sillones BKF" | `business.js` (`summary`); `faq.js:14`; `Nosotros.jsx:68`; schema `description` | Texto del sitio | Alta como afirmación del sitio |
| "Fábrica propia" (insignia) | `SillonBKF.jsx:104` | Texto | Alta como afirmación |
| Fabricante: Taller Kappa S.R.L. | `SillonBKF.jsx:171`; `MobiliarioComercial.jsx:96`; schema `Product.manufacturer` | Texto + dato estructurado | Alta como afirmación |
| "Fabrica sillones BKF en su taller de Villa Chacabuco" | `SillonBKF.jsx:19,155`; `GuiaBKF.jsx:37,162` | Texto | Alta |
| "100% fabricado en Argentina, en nuestro taller de San Martín" | `SillonBKF.jsx:214`; contador "100% Fabricación nacional" `Nosotros.jsx:23` | Texto | Alta |
| "Fabricamos artesanalmente" | `SillonBKF.jsx:24,188` | Texto | Alta |
| "Directo de fábrica… comprás al productor" | `Home.jsx:14`; `Nosotros.jsx:15` | Texto | Alta |
| Vendedor (se vende por cotización) | `business.js` (`salesModel`); `Offer.seller` en schema | Texto + dato estructurado | Alta |
| "Taller Kappa fabrica **su propia versión** de ese diseño" (no el original de 1938) | `GuiaBKF.jsx:35` | Texto; la guía explica que "hoy lo fabrican muchos talleres" y que hay versiones oficiales y no oficiales | Alta; **coherente con la narrativa y no afirma ser el original** |
| "Taller" | Home, SillonBKF, MobiliarioComercial, `Envios.jsx:18` ("nuestro taller") | Texto | Alta |

**Lo que el repo NO prueba:** que la fabricación sea 100% propia (en el propio taller, sin tercerizar partes), que exista una licencia o relación con los creadores, ni cuántas unidades produce. `CONTEXTO_PROYECTO.md` no lista "fabricación propia" entre lo confirmado por el dueño (sí lista testimonios, clientes, 15 años, 1938/MoMA, plazos, Banco BKF con cuero). → `REQUIERE CONFIRMACIÓN DEL CLIENTE` (relación exacta con BKF y el alcance de "fabricante").

## 6. Testimonios
Origen en el código: `FALLBACK_TESTIMONIOS` en `Nosotros.jsx:28-32` (datos fijos). Se reemplazan por la colección `testimonios` de Firestore (`firedb.js:31`, regla `firestore.rules:18`: lectura pública, escritura solo admin) **si** hay datos y Firebase está configurado; como `firebaseConfig.js` tiene valores de relleno, **hoy solo se ven los tres fijos** `[V]`. Las estrellas están **dentro del marcado** (5 íconos y `aria-label="5 estrellas"`), no vienen de ningún campo de calificación: se muestran 5 para cualquier testimonio, incluidos los que vinieran de Firestore.

| Testimonio | Nombre | Estrellas | Fuente | Evidencia | Estado |
|---|---|---:|---|---|---|
| "Equipamos nuestro local de YPF Full con las Bases Flat de Taller Kappa. Soportan el alto tránsito sin problemas." | "— Franquicia YPF Full" (sin persona ni empresa) | 5 (fijo en el marcado) | Dato estático en el código; no se indica canal | `[DUEÑO]` confirmó que "los testimonios de `Nosotros.jsx`" son ciertos (1/10/2026). Sin captura, enlace ni fecha | `REQUIERE CONFIRMACIÓN DEL CLIENTE` (canal y autorización de uso) |
| "La calidad del hierro es excelente y cumplieron con los tiempos pactados." | "— Local Gastronómico (Shell Select)" | 5 | Ídem | Ídem | `REQUIERE CONFIRMACIÓN DEL CLIENTE` |
| "Excelente atención de Francisco. Me asesoró con las medidas para mi mesa." | "— Ricardo L. (Particular)" | 5 | Ídem | Ídem | `REQUIERE CONFIRMACIÓN DEL CLIENTE` |

- ¿Provienen de Google? **NO.** Nada en el repo lo indica. No se afirma que lo sean.
- ¿De WhatsApp u otra fuente? `NO VERIFICABLE`.
- ¿En Firebase? Hoy no (sin configurar).
- Clasificación del conjunto: **`NO VERIFICABLE`** de forma independiente, con **confirmación del dueño registrada** en `CONTEXTO_PROYECTO.md` (no se marcan como `Review` en el schema, por decisión explícita).
- No se eliminó ni modificó nada.

## 7. Logos de clientes
| Marca | Dónde aparece (logo o texto) | Qué transmite | Evidencia de autorización | Clasificación |
|---|---|---|---|---|
| YPF / YPF Full | `Home.jsx:24`; `Proyectos.jsx:10-12`; `Nosotros.jsx:159,87`; `SillonBKF.jsx:192`; `faq.js:23`; llms.txt; testimonio nº 1 | Cliente; "Fabricamos y entregamos bases de mesa Flat y bancos… para las tiendas YPF Full… en múltiples sucursales de Buenos Aires" | Ninguna en el repo (solo `[DUEÑO]` confirma que lo afirmado es cierto) | `SIN EVIDENCIA` de autorización; `REQUIERE CONFIRMACIÓN` |
| McDonald's | `Home.jsx:25`; `Proyectos.jsx:16-17`; `Nosotros.jsx:160,87` | Cliente; "Locales gastronómicos en Capital Federal y GBA" | Ídem | `SIN EVIDENCIA`; `REQUIERE CONFIRMACIÓN` |
| Burger King | `Home.jsx:26`; `Proyectos.jsx:22-24`; `Nosotros.jsx:161,87` | Cliente; "Franquicias en Buenos Aires" | Ídem | `SIN EVIDENCIA`; `REQUIERE CONFIRMACIÓN` |
| Shell / Shell Select | `Home.jsx:27`; `Proyectos.jsx:34-36`; `Nosotros.jsx:162,87`; testimonio nº 2 | Cliente; "Tiendas de conveniencia en Zona Norte" | Ídem | `SIN EVIDENCIA`; `REQUIERE CONFIRMACIÓN` |
| Sandro / Sandro Paris | `Home.jsx:28`; `Proyectos.jsx:28-30`; `Nosotros.jsx:158,87` | Cliente; "Locales de indumentaria en Palermo" | Ídem | `SIN EVIDENCIA`; `REQUIERE CONFIRMACIÓN` |

- Redacción más fuerte: `Nosotros.jsx:87` "**Hoy somos el proveedor de confianza de** YPF, McDonald's, Burger King, Shell Select y Sandro". Distinto de "hicimos trabajos para": implica una relación de proveeduría actual.
- `docs/seo/` menciona que hay que pedir permiso a los clientes para publicaciones y enlaces (`seo-google-fase-3.md:168,192`; `fase-4-ventas.md:96`): confirma que **la autorización no está documentada**.
- Los archivos están en `react-app/public/images` (`logoypf.png`, `mcdonaldslogo.png`, `burguerlogo.png`, `sandrologo.png`, `shelllogo.png`). Nada se tocó.

## 8. Redes sociales y entidades externas
| Plataforma | Evidencia en el repo |
|---|---|
| Instagram, Facebook, TikTok, LinkedIn, YouTube | `NO ENCONTRADO EN REPOSITORIO` (ninguna URL ni enlace en `src`, `index.html`, `public` ni `scripts`) |
| `sameAs` de la empresa | `NO ENCONTRADO EN REPOSITORIO`. Solo hay un `sameAs` de **concepto** (Wikipedia, "Silla BKF") en `GuiaBKF.jsx` |
| Google Business Profile | `NO ENCONTRADO EN REPOSITORIO`. Solo checklist/borrador en `docs/seo/seo-google-fase-3.md` §6b; `CONTEXTO_PROYECTO.md` lo marca "🟡 Pendiente" |
| Google Maps | Hay iframe, enlace de "Cómo llegar" y `hasMap`, todos por **coordenadas**, no por ficha de empresa ni Place ID |
| Bing Places / Bing Webmaster | `NO ENCONTRADO EN REPOSITORIO` (sin `msvalidate.01`) |
| Google Search Console | `NO ENCONTRADO EN REPOSITORIO` (sin `google-site-verification`) |
| GA4 | `G-2FDMN51XDY` en `lib/analytics.js` |
| Cylex y otros directorios | Solo referencias en documentación (§9) |

## 9. Referencia externa ya detectada: "Talleres Kappa S de H"
Fuente: `docs/seo/seo-google-fase-3.md:15` (fase 3, 1/10/2026) y recomendaciones en `fase-4-ventas.md:176`.
| Campo | Valor documentado |
|---|---|
| Nombre usado | "Talleres Kappa S de H, General San Martín" |
| Plataforma | Cylex (`cylex.com.ar`), visto en un resultado de búsqueda |
| Dirección | `NO DOCUMENTADO` (la página devolvió 403 y no pudo leerse) |
| Teléfono | `NO DOCUMENTADO` |
| Otras diferencias con el sitio | Nombre en plural ("Talleres"); forma legal "S de H" (sociedad de hecho) frente a "S.R.L."; localidad "General San Martín" frente a "San Martín" |
| Estado | No se sabe si corresponde al mismo negocio, a una razón social anterior o a otra empresa `REQUIERE CONFIRMACIÓN DEL CLIENTE`. No se intentó corregir |

Otras referencias externas del proyecto (sin datos de contacto): `argentino.com.ar`, `fullconfort.com.ar` y páginas de Facebook como actores del SERP local; son resultados de búsqueda, no perfiles de la empresa.

## 10. Otras observaciones útiles
- `Home.jsx:17` dice "Somos **responsables inscriptos**" y `Nosotros.jsx:18` "Somos **contribuyentes responsables**": dos formulaciones del mismo dato fiscal. `REQUIERE CONFIRMACIÓN DEL CLIENTE` (condición fiscal exacta).
- El mismo Gmail aparece como contacto público y como cuenta administradora en `firestore.rules:59`.
- Los textos con "San Martín" y con "Villa Chacabuco" alternan según la página; no se contradicen.
- `CONTEXTO_PROYECTO.md` indica que las imágenes `bkf1.jpg`, `bkfapoyapies.jpg` y `mesa.jpeg` tienen marca de agua de Gemini y que conviene reemplazarlas por fotos reales: indica que hay imágenes generadas con IA. No se verificó visualmente. Relevante para el punto "fotos".
- Sin código postal, sin año exacto de fundación, sin CUIT, sin redes, sin perfil de Google/Bing.

# Fuente única de verdad pendiente
| Campo | Valor confirmado | Valor pendiente | Fuente | Uso futuro |
|---|---|---|---|---|
| Nombre comercial | "Taller Kappa" (consistente en el sitio; **no** confirmado como exacto) | PENDIENTE: nombre exacto a publicar | `business.js` | NAP, GBP, Bing, schema `name` |
| Razón social | "Taller Kappa S.R.L." (solo en el sitio) | PENDIENTE: confirmar S.R.L. y la ficha "Talleres Kappa S de H" | `business.js` | `legalName`, citaciones |
| Dirección | "Calle 28 Nº 3779, Villa Chacabuco, San Martín, Buenos Aires" (solo en el sitio) | PENDIENTE: confirmación y forma exacta | `business.js` + 5 textos fijos | NAP único, GBP |
| CP | — | PENDIENTE | NO ENCONTRADO | `postalCode` |
| Localidad | San Martín (barrio: Villa Chacabuco) | PENDIENTE: confirmar "San Martín" vs "General San Martín" | `business.js` | NAP, schema |
| Provincia | Buenos Aires | — | `business.js` | NAP |
| País | Argentina | — | `business.js` | NAP |
| Teléfono | +54 11 6124-2498 (solo en el sitio) | PENDIENTE: ¿recibe llamadas? | `business.js` | NAP, GBP |
| WhatsApp | 541161242498 | PENDIENTE: ¿es el comercial? | `contact.js` | CTA, GBP |
| Email comercial | PENDIENTE (hoy `ing.franciscomarotta@gmail.com`) | PENDIENTE: email del negocio | `contact.js` | Contacto, schema |
| Horario | "lunes a viernes de 9 a 18 hs" (como **retiro**) | PENDIENTE: ¿atención, retiro o ambos? | `business.js` | GBP, schema |
| Showroom | PENDIENTE | PENDIENTE: sí/no | `Footer.jsx`, `faq.js` | Texto, schema, GBP |
| Visita | PENDIENTE | PENDIENTE: sí/no, con o sin turno | `faq.js` | Texto, GBP |
| Retiro en taller | Declarado en el sitio (sin confirmación expresa del dueño en docs) | PENDIENTE: sí/no y horario | `Envios.jsx` y otros | Texto, GBP |
| Categoría | `LocalBusiness` + `FurnitureStore` (decisión técnica del código) | PENDIENTE: categoría real | `schema.js` | Schema, GBP |
| Relación con BKF | El sitio dice "fabrica su propia versión" en su "fábrica propia" | PENDIENTE: alcance de "fabricante", licencias | `SillonBKF.jsx`, `GuiaBKF.jsx` | Texto, schema `manufacturer` |
| Redes sociales | — | PENDIENTE | NO ENCONTRADO | `sameAs` |
| Google Business Profile | — | PENDIENTE: URL y estado | NO ENCONTRADO | `hasMap`, enlaces |
| Bing | — | PENDIENTE | NO ENCONTRADO | Bing Places/Webmaster |
| Testimonios | Tres textos fijos; `[DUEÑO]` los dio por ciertos (1/10/2026) | PENDIENTE: autor, canal, autorización, fecha | `Nosotros.jsx` | Prueba social |
| Logos | Cinco marcas; `[DUEÑO]` dio por ciertos los trabajos | PENDIENTE: autorización de uso | `Home`, `Nosotros`, `Proyectos` | Prueba social |
| Fotos | Hay fotos de producto; indicios de imágenes generadas con IA | PENDIENTE: fotos reales (taller, producto, entrega) | `CONTEXTO_PROYECTO.md` | GBP, sitio |
| Coordenadas | -34.5851938, -58.5281526 (coherentes entre sí) | PENDIENTE: verificar que sean las del taller | `business.js` | `geo`, mapa |
| Año de fundación | "más de 15 años" `[DUEÑO]` | PENDIENTE: ¿se comunica el año? | `Nosotros.jsx` | `foundingDate` |

# Información que debemos confirmar con el cliente
1. ¿Cuál es el nombre comercial exacto que debe utilizarse?
2. ¿Cuál es la razón social exacta (S.R.L. o "S de H"), y qué es la ficha "Talleres Kappa S de H, General San Martín"?
3. ¿Cuál es la dirección completa?
4. ¿Cuál es el código postal?
5. ¿La localidad es "San Martín" o "General San Martín"?
6. ¿Cuál es el teléfono comercial, y recibe llamadas?
7. ¿Cuál es el WhatsApp comercial?
8. ¿Cuál es el email comercial (hay uno con dominio propio)?
9. ¿Cuál es el horario de atención?
10. ¿Existe showroom?
11. ¿Los clientes pueden visitar el taller (con o sin turno)?
12. ¿Existe retiro de productos en el taller?
13. ¿Qué horario tiene el retiro?
14. ¿Cuál es exactamente la relación de Taller Kappa con BKF (fabricación propia, tercerización, licencia)?
15. ¿Cuál es la categoría comercial que consideran correcta (fábrica, tienda, ambas)?
16. ¿Cuál es la URL del Google Business Profile?
17. ¿Cuál es la URL de Instagram?
18. ¿Cuál es la URL de Facebook?
19. ¿De dónde provienen los testimonios actuales (canal, persona, fecha)?
20. ¿Los testimonios pueden utilizarse públicamente?
21. ¿Existe autorización para mostrar los logos de clientes y para decir "proveedor de confianza de…"?
22. ¿Qué fotos reales del taller, productos y ubicación están disponibles?
23. ¿Quieren comunicar año de fundación?
24. ¿Existen otros perfiles empresariales externos que debamos conocer (Cylex, MercadoLibre, otros)?
Adicionales mínimos: ¿cuál es la condición fiscal exacta (responsable inscripto) y quieren publicar el CUIT?

Este documento no avanza a B6.1. No se hicieron cambios de NAP, schema, JSON-LD, `sameAs`, GBP, Bing, backlinks, citas ni páginas nuevas.
