# B6 — Diagnóstico de Local SEO y Entity

> Solo diagnóstico. No se modificó código, schema ni páginas; no hay commits.
> Tags: `[V]` verificado en repositorio · `[E]` requiere verificación externa · `[C]` requiere confirmación o dato real del cliente.
> Fuente de la identidad: `react-app/src/data/business.js` (única fuente; la consumen schema, footer, contacto, FAQ y llms.txt) `[V]`.

## 1. Matriz NAP y datos de empresa
| Dato | Valor actual | Archivo | Consistente | Problema |
|---|---|---|---|---|
| Nombre comercial | Taller Kappa | `business.js`, `Footer.jsx` | Sí | — |
| Razón social | Taller Kappa S.R.L. (alternativa: "Taller Kappa SRL") | `business.js`, schema `legalName`/`alternateName`, `Footer.jsx` (©) | Sí en el sitio | **Fuera del sitio**: `seo-google-fase-3.md` §1 reporta una ficha en Cylex como "Talleres Kappa S de H" (otra razón social) `[E]` |
| Dirección | Calle 28 Nº 3779, Villa Chacabuco, San Martín, Buenos Aires | `business.js`, `Footer.jsx`, `Contacto.jsx`, `Envios.jsx`, `FAQ`, `llms.txt` | Sí | Se escribe a mano en 3 componentes (no desde `business.js`); riesgo de divergencia futura. Falta código postal `[C]` |
| Schema `streetAddress` | "Calle 28 Nº 3779, Villa Chacabuco" (el barrio va dentro de la calle) | `schema.js` | Parcial | El barrio no es parte de la calle; sin `postalCode` `[C]` |
| Localidad / provincia / país | San Martín / Buenos Aires / AR | `business.js`, schema | Sí | "San Martín" es partido y localidad; Villa Chacabuco es barrio. El texto usa "San Martín" y "Villa Chacabuco" según la página (coherente) |
| Coordenadas | -34.5851938, -58.5281526 | `business.js`, schema `geo`, iframe del mapa | Sí entre sí | **No verificado** que apunten exactamente a Calle 28 Nº 3779: confirmar abriendo el mapa `[E]` |
| Google Maps | `maps.google.com/?q=<coords>` (hasMap), ruta `maps/dir/?api=1&destination=<coords>`, iframe `maps.google.com/maps?q=<coords>&output=embed` | `business.js`, `Footer.jsx` | Sí | Usa **coordenadas**, no el perfil de empresa ni un Place ID: el mapa no enlaza al perfil (no hay `cid`/Place ID) `[V]` |
| Teléfono | +541161242498 (11 6124-2498) | `contact.js`, `business.js`, schema | Sí | Es el mismo número de WhatsApp: **no se sabe si recibe llamadas** `[C]` |
| WhatsApp | 541161242498 | `contact.js` | Sí | — |
| Email | `ing.franciscomarotta@gmail.com` | `contact.js`, `Footer.jsx`, `Contacto.jsx`, schema, `llms.txt` | Sí | Gmail personal con nombre de una persona; sin email de dominio `[C]` |
| Dominio | `https://tallerkappa.com.ar` | `lib/site.js`, `CNAME` | Sí | — |
| Redes sociales | **Ninguna** | — | — | Sin `sameAs`; `seo-google-fase-3.md` §1: "no existen perfiles oficiales en la búsqueda" `[E]` |
| Horarios | Lun–vie 09:00–18:00 | `business.js`, schema `openingHoursSpecification` | Sí | El sitio los llama "retiro en el taller", el schema los expresa como horario de apertura (`openingHoursSpecification`) `[C]` |
| Descripción | "Taller Kappa S.R.L. es una fábrica de muebles de hierro y cuero ubicada en Villa Chacabuco, San Martín…" | `business.js` (`summary`), schema, `llms.txt`, `Nosotros` | Sí | — |
| Año de fundación | **No aparece** | — | — | `[C]` |
| CUIT | **No aparece** | — | — | `[C]` |
| Logo | `/images/logo-taller-kappa.jpg` 1024×1024 | `business.js`, schema | Sí | — |
| Metadata / robots / sitemap | Sin datos de NAP (el sitemap solo lista URLs; robots solo reglas) | — | n/a | — |

## 2. Entity SEO
Cadena: **Taller Kappa → fabricante/vendedor → BKF → San Martín → Buenos Aires → Argentina**

| Eslabón | ¿Se comunica? | Evidencia |
|---|---|---|
| Taller Kappa = empresa | Sí | `Organization`+`LocalBusiness`+`FurnitureStore` con `@id` único (`#organization`), `WebSite` con `alternateName` |
| = fabricante | Sí en texto y Product | `Product.manufacturer` y `brand` apuntan a la organización; el texto dice "fábrica", "directo de fábrica" |
| = vendedor | Parcial | `Offer.seller` sí, pero **sin precio** (por cotización) |
| → BKF | Sí | `knowsAbout`, páginas `/bkf/` y `/sillon-bkf/`, `Product` con `additionalProperty` |
| → San Martín / Buenos Aires / Argentina | Sí | `address`, `location` (Place encadenado Villa Chacabuco → San Martín → Provincia de Buenos Aires → Argentina) |

| Propiedad | Estado `[V]` | Observación |
|---|---|---|
| Organization / LocalBusiness | Presente (`['LocalBusiness','FurnitureStore']`) | `FurnitureStore` sugiere una tienda; ver contradicción showroom (§5) |
| Product | Presente en `/sillon-bkf/` y fichas | Sin precio, SKU, GTIN: `REQUIERE DATO REAL DEL CLIENTE` |
| Brand | Presente | `Brand` = Taller Kappa, mismo nombre que la empresa |
| manufacturer | Presente en Product | — |
| areaServed | Presente (CABA, GBA, Norte/Oeste/Sur, país) | Coincide con `/envios/`. Incluye "toda Argentina" |
| location | Presente (cadena de Place) | — |
| address | Presente | Sin `postalCode`: `REQUIERE DATO REAL DEL CLIENTE` |
| geo | Presente | Verificar coordenadas `[E]` |
| contactPoint | Presente (`sales`, tel, email, `es`) | — |
| telephone / email / url | Presentes | Email Gmail personal |
| **sameAs** | **Ausente** | `REQUIERE DATO REAL DEL CLIENTE` (redes y perfiles) |
| foundingDate | Ausente | `REQUIERE DATO REAL DEL CLIENTE` |
| taxID / vatID | Ausente | `REQUIERE DATO REAL DEL CLIENTE` |
| priceRange | Ausente | `REQUIERE DATO REAL DEL CLIENTE` |
| aggregateRating / review | Ausentes (intencional) | Sin reseñas verificables |
| `hasMap` | Coordenadas, no perfil de Google | Cuando exista perfil: `REQUIERE DATO REAL DEL CLIENTE` (URL) |
| Corroboración externa | `[E]` | Ficha Cylex con otra razón social; sin perfiles oficiales encontrados |

## 3. Google Business Profile
- **Evidencia en el repo de que existe o esté verificado: ninguna.** `docs/seo/seo-geo-fase-2-competencia.md` (§198) y `fase-4-ventas.md` (§113) lo dan por **pendiente (dueño)**. `REQUIERE VERIFICACIÓN EXTERNA`.
- El repo contiene solo un checklist/borrador de datos (`seo-google-fase-3.md` §6b), no un perfil real.
- No hay enlace al perfil, ni Place ID, ni `?utm_source=gbp` en ningún lado `[V]`.
- Hay una **advertencia relevante** en ese checklist: las imágenes de producto actuales "están generadas con IA y no son adecuadas para el perfil" (según el documento, `[V]` en docs; no verificable desde el código) → en el perfil hacen falta fotos reales.

A confirmar `[E]`/`[C]`: URL del perfil · nombre exacto · categoría principal · categorías secundarias · dirección (¿visible u oculta?) · teléfono · web · horarios · fotos · productos · servicios · reseñas · valoración · descripción · publicaciones.

## 4. Bing
- Bing Places: **sin evidencia** en el repo. `REQUIERE VERIFICACIÓN EXTERNA`.
- Bing Webmaster Tools: **sin evidencia** (no hay meta `msvalidate.01`). La única mención es que `robots.txt` da 200 a Bingbot (`recuperacion-seo.md`).
- Perfiles sociales como entidad: **ninguno** documentado como oficial. Los documentos recomiendan crear Instagram/Facebook/LinkedIn y recién entonces agregarlos a `sameAs` `[V]`.

## 5. Consistencia local — REQUIERE CONFIRMACIÓN DEL CLIENTE
| Tema | Dónde | Texto | Contradicción posible |
|---|---|---|---|
| Showroom | `Footer.jsx` (todas las páginas) | "Fábrica & Showroom" | Dice que hay showroom |
| Showroom | `faq.js` (FAQ y llms.txt) | "…o visitar el showroom" | Dice que se puede visitar |
| Showroom | `schema.js` (comentario) | "fábrica con showroom donde se retira lo pedido y se cotiza directo" | Interno, pero el `@type` `FurnitureStore` lo refuerza |
| Retiro | Footer, Contacto, Home, Nosotros, `SillonBKF`, `Envios`, `business.js` | "Retiro en el taller: lunes a viernes de 9 a 18 hs" | Solo retiro de pedidos |
| Atención al público | Ninguna página lo afirma ni lo niega | — | No se dice si se atiende sin turno ni si hay productos exhibidos |
| Taller / fábrica | Home, SillonBKF, GuiaBKF, MobiliarioComercial, FAQ | "nuestro taller de San Martín" | Coherente con retiro |
| Dirección | Contacto, Footer, Envíos | Misma dirección | Coherente (escrita a mano en 3 sitios) |
| Horario | `schema.js` `openingHoursSpecification` | Horario de apertura | Si es solo retiro con turno, el schema dice "abierto" |
| Cylex | Fuera del repo `[E]` | "Talleres Kappa S de H, General San Martín" | Razón social y posible dirección distintas |
| "Fábrica" vs `FurnitureStore` | `schema.js` | Tipo "tienda de muebles" | Una fábrica sin local de venta no es una tienda `[C]` |
No se decide cuál es correcto.

## 6. Reseñas / autoridad local
| | Evidencia |
|---|---|
| **VERIFICADO EN REPOSITORIO** | `Nosotros.jsx` muestra una sección "Lo que dicen quienes nos eligen" con 3 testimonios **escritos en el código** (`FALLBACK_TESTIMONIOS`): "— Franquicia YPF Full", "— Local Gastronómico (Shell Select)", "— Ricardo L. (Particular)", cada uno con **5 estrellas** visibles (`aria-label="5 estrellas"`). Se reemplazan por Firestore (`testimonios`) solo si Firebase está configurado; hoy no lo está, así que **siempre se ven los tres fijos** |
| | Logos de clientes en `/proyectos/` y `/nosotros/` (YPF Full, McDonald's, Burger King, Shell Select, Sandro) con descripción de lo entregado |
| | Sin `Review`/`aggregateRating` en el schema (decisión explícita: "sin precio, SKU, GTIN, reviews ni rating") |
| | Sin enlaces a reseñas externas |
| **REQUIERE DATOS EXTERNOS** | Reseñas en Google/Facebook; quién escribió los 3 testimonios y si tiene autorización; autorización para publicar los logos de marcas (YPF, McDonald's, Burger King, Shell, Sandro) y que los trabajos sean verídicos y entregados directamente por Taller Kappa; fecha de cada trabajo |

**Riesgo:** estrellas y testimonios sin fuente verificable en el repo pueden contar como reseñas no comprobables (confianza, normas de publicidad y de reseñas de Google si se marcaran con schema). `[C]` confirmar origen. No se tocó nada.

## 7. Datos que necesitamos del cliente (lista mínima)
1. URL de Google Business Profile.
2. Nombre exacto publicado.
3. Dirección exacta que debe publicarse (con código postal) y confirmación de las coordenadas.
4. Teléfono (¿recibe llamadas o solo WhatsApp?).
5. Horarios (¿atención o solo retiro?).
6. ¿Showroom sí/no?
7. ¿Se puede retirar en el taller sí/no?
8. ¿Se puede visitar físicamente sí/no (con o sin turno)?
9. Redes sociales oficiales y perfiles (Facebook, Instagram, LinkedIn, Bing Places, Cylex).
10. Categoría real del negocio.
11. Reseñas actuales (enlace o capturas) y origen de los 3 testimonios del sitio.
12. Fotos reales disponibles (taller, proceso, productos, entregas).
Extras opcionales: año de fundación, email de dominio, razón social exacta frente a "Talleres Kappa S de H", autorización de uso de logos de clientes.

## 8. Plan de acción (sin implementar)
| Etapa | Qué | Prioridad | Dependencia | SEO local | GEO/IA | Comercial |
|---|---|---|---|---|---|---|
| B6.1 NAP | Unificar fuente (los 3 componentes con dirección hardcodeada → `business.js`), resolver showroom/retiro/horario y contradicciones; revisar `streetAddress`; preparar decisión sobre los testimonios | 🔥 | Respuestas del cliente (§7 pts 3–8, 11) | Alto | Alto (evita respuestas erróneas) | Medio |
| B6.2 GBP | Crear/reclamar y completar el perfil con los datos de §7 | 🔥 | B6.1 + cliente | Muy alto (mapa) | Alto | Muy alto |
| B6.3 Bing Places | Importar desde GBP y verificar | 🟧 | B6.2 | Medio | Medio (Copilot) | Medio |
| B6.4 Entity/schema | `sameAs`, `foundingDate`, `postalCode`, `hasMap` al perfil, `openingHours` correcto, revisar `FurnitureStore` — solo con datos reales | 🟥 | B6.1, B6.2, redes del cliente | Medio | Alto | Bajo |
| B6.5 Reviews | Pedir reseñas reales por enlace directo; decidir qué hacer con los testimonios fijos; recién después evaluar schema `Review` | 🟥 | B6.2 | Alto | Alto | Alto |
| B6.6 Fotos | Fotos reales del taller/proceso/productos para GBP, Bing y sitio (hoy las de producto serían generadas con IA según docs) | 🟥 | Cliente | Alto | Medio | Alto |
| B6.7 Citaciones | Reclamar Cylex ("Talleres Kappa S de H"), directorios locales, prensa de diseño, con NAP idéntico | 🟧 | B6.1, B6.2 | Alto | Alto | Medio |

## 9. Resumen
**Principales inconsistencias**
1. Showroom (Footer, FAQ, comentario de schema) vs retiro en el taller (resto del sitio).
2. Horario de retiro publicado como horario de apertura en schema; tipo `FurnitureStore` (tienda) para una fábrica.
3. Ficha de Cylex con otra razón social ("Talleres Kappa S de H") fuera del sitio `[E]`.
4. Dirección escrita a mano en Footer, Contacto y Envíos en lugar de `business.js`.
5. Email Gmail personal en un negocio con dominio propio.

**Datos faltantes:** URL y estado del perfil de Google, Bing Places, redes/`sameAs`, código postal, año de fundación, CUIT, categoría real, reseñas, fotos reales, aclaración de teléfono, verificación de coordenadas.

**Riesgos**
- Testimonios con 5 estrellas fijos en el código, sin fuente verificable; logos de grandes marcas sin autorización confirmada.
- Tres testimonios siempre visibles porque Firebase no está configurado.
- Una IA o un buscador pueden presentar un "showroom" que quizás no existe.
- NAP divergente entre sitio y directorios debilita la entidad.
- Fotos de producto reportadas como generadas con IA no sirven para GBP.

**Oportunidades:** GBP verificado con reseñas reales (el factor local con más peso según los propios docs), `sameAs` con perfiles oficiales, reclamar y unificar Cylex, prensa de diseño, fotos reales, enlazar el mapa al perfil.

**Qué pedirle al cliente:** la lista de la sección 7.
