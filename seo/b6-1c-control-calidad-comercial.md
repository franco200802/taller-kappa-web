# B6.1-C — Control de calidad comercial, contenido y visual

> Fecha: 6/10/2026 · Base: `main` @ `2580a80` (B6.1-B). Auditoría de lo implementado en B6.1-B. Rutas relativas a `react-app/`.
> Se corrigieron 6 errores objetivos que no requerían datos del propietario (sección B). Nada más se tocó: sitemap, robots, GA4, Firebase, redirects, rutas, schema y deploy intactos.

## A. Resumen

B6.1-B quedó **consistente** en identidad, showroom, retiro, plazos y schema. La búsqueda exhaustiva no encontró plazos fijos, "sin turno", CUIT, ratings, `sameAs` de la empresa ni claims retirados. Se encontraron y corrigieron: un cartel "En stock" que prometía disponibilidad, tres textos de retiro sin mención de coordinación y dos teléfonos hardcodeados. Quedan **pendientes comerciales** que solo puede resolver el propietario (retiro "sin cargo", `stock`, "en el día", nombre "Ricardo L.", "Reposición rápida"); ninguno bloquea B9 porque ya estaban publicados antes de B6.1-B o son de bajo riesgo.

## B. Problemas encontrados

| Problema | Archivo | Severidad | Acción |
|---|---|---|---|
| Cartel "En stock" en tarjetas y modal ("En stock, entrega coordinada") promete disponibilidad; contradice la regla "el plazo depende del stock" | `pages/Catalogo.jsx` | ALTO | **CORREGIDO**: ahora "Consultar disponibilidad" / "Consultar disponibilidad por WhatsApp" |
| Retiro sin indicar coordinación previa | `pages/SillonBKF.jsx` (hero), `pages/GuiaBKF.jsx` ("Dónde comprar"), `pages/Envios.jsx` (subtítulo de zonas) | ALTO | **CORREGIDO**: "con coordinación previa" |
| Teléfono 11 6124-2498 hardcodeado en FAQ del Sillón y en la descripción SEO de Contacto | `pages/SillonBKF.jsx:20`, `pages/Contacto.jsx:49` | MEDIO | **CORREGIDO**: usan `BUSINESS.phoneDisplay` / `WHATSAPP_DISPLAY` |
| "Retiro presencial **sin cargo**" | `pages/Envios.jsx:19` (tarjeta "Retiro en el taller") | PENDIENTE | No se cambia. PENDIENTE DE CONFIRMACIÓN DEL PROPIETARIO |
| `stock: true` en los 3 productos genera `availability: InStock` en el schema (3 ocurrencias) y alimenta el estado del catálogo | `data/products.js:88,123,157`, `lib/schema.js:206` | PENDIENTE | No se toca el schema. PENDIENTE: ¿hay stock permanente? Si no, pasar a `PreOrder`/omitir `availability` en una fase futura |
| "Cotizamos por WhatsApp en el día" y "Te lo pasamos por WhatsApp en el día…" (promesa de tiempo de respuesta, no de entrega) | `pages/Home.jsx:53`, `pages/SillonBKF.jsx:115`, `pages/Producto.jsx:99` | PENDIENTE | PENDIENTE DE CONFIRMACIÓN: ¿se cumple siempre? |
| Testimonio "Ricardo L. (Particular)" | `pages/Nosotros.jsx:29` | PENDIENTE | Ver sección C.2 |
| "Reposición rápida" (YPF Full) | `pages/Proyectos.jsx:25` | BAJO | Promesa de plazo implícita; PENDIENTE de confirmación |
| `directionsUrl` (ruta a Maps) quedó definido en `business.js` y sin uso | `data/business.js` | BAJO | Código muerto inocuo; limpiar en una fase futura |
| Envío "bonificado" (San Martín, mayoristas 3+, primera compra GBA, embalaje interior) y "costo según zona" | `pages/Envios.jsx`, FAQ 12/14b, `MobiliarioComercial.jsx` | PENDIENTE | Condiciones comerciales ya publicadas antes de B6.1-B; no reconfirmadas |
| Control visual con capturas no realizable en este entorno (Chromium headless se colgó en varias páginas y no escribe imágenes) | — | MEDIO | Ver sección E: se validó DOM/estructura; **revisión visual humana recomendada** en `/envios/` y `/contacto/` |

Sin hallazgos CRÍTICOS.

## C. Revisión por punto solicitado

### C.1 "Sin cargo" / gratis / bonificado
- **Retiro**: aparece **una vez**: `Envios.jsx:19` "Retiro presencial sin cargo…" → PENDIENTE DE CONFIRMACIÓN DEL PROPIETARIO. El resto de las menciones de retiro (Home, Footer, Contacto, Nosotros, SillonBKF, GuiaBKF, FAQ 4c/12, `llms.txt`) **no** dicen que sea gratuito.
- Otros "sin cargo/costo" **no relacionados con retiro**: medidas/colores a medida ("sin costo adicional": Home, Nosotros, SillonBKF, GuiaBKF, MobiliarioComercial, `products.js`, FAQ 14); devoluciones por defecto "sin costo de envío" (`Garantia.jsx`, 72 hs); envío/embalaje "bonificado" (Envios, FAQ, MobiliarioComercial). Son condiciones previas a B6.1-B; no se reconfirmaron.

### C.2 "Ricardo L."
- **Única aparición** en código: `pages/Nosotros.jsx:29`, `FALLBACK_TESTIMONIOS`, id 3: *"Excelente atención de Francisco. Me asesoró con las medidas para mi mesa." — Ricardo L. (Particular)*.
- Es un **testimonio** (autor/cliente particular); "Francisco" es quien lo atendió. Además figura en `seo/b6-1a…` como testimonio real recibido por WhatsApp. No hay otra aparición en `src/`, `docs/` ni `CONTEXTO_PROYECTO.md`.
- No se puede determinar desde el repo si "Ricardo L." es el nombre real, abreviado o una anonimización, ni si autorizó su uso. **PENDIENTE DE CONFIRMACIÓN**. No se eliminó.

### C.3 Stock / disponibilidad
- **Promesas de stock real que quedaban**: tarjeta "En stock" y modal "En stock, entrega coordinada" (`Catalogo.jsx`) → corregidas.
- **Aún presente (interno/schema)**: `stock: true` ×3 → `InStock` ×3 en JSON-LD (pendiente arriba).
- Texto correcto y consistente: "El plazo de entrega depende de la disponibilidad de stock. Consultanos por WhatsApp." (Envíos, FAQ 12, Sillón, Mobiliario, Home, `llms.txt`). FAQ 4 dice "Podés consultar stock…", sin prometerlo. "Fabricamos a medida" (Home) y "a pedido" (productos) son descripciones de fabricación bajo pedido sin plazo.

### C.4 Plazos
- Búsqueda en `src/`, `scripts/` y `dist/` (HTML, `llms.txt`, sitemap): **cero** apariciones de 24–48 h, 2–4/2–5/3–5 días, 5–10 días, "entrega inmediata".
- Únicos números de tiempo que quedan, **legítimos y ajenos a la entrega**: devolución por defecto dentro de **72 hs de recibido** (`Garantia.jsx`) y garantías de 1 y 2 años / de por vida (producto, no plazo de entrega).
- Respuesta "en el día" (cotización): ver pendiente.

### C.5 Showroom
- Nunca se dice "sin turno", "visita libre", "vení cuando quieras" ni "acercate" (búsqueda exhaustiva). Todas las menciones (Footer, Home, Nosotros, Contacto, SillonBKF + su FAQ, FAQ 2/4/4b, `llms.txt`, schema comentarios) dicen **visitas con turno previo por WhatsApp o teléfono**, tomadas de `business.showroom`. Contacto tiene un botón "Pedir turno por WhatsApp" (mensaje prearmado) y el número en `tel:`.

### C.6 Retiro
- Todas las menciones indican **coordinación previa**, ahora también las tres corregidas en B6.1-C. Excepción residual: ninguna. Horario 9–18 consistente en 100% de las apariciones (sale de `business.hours`).

### C.7 `business.js` como fuente única
- Fuera de `business.js`/`contact.js` **no quedan** calle/número, CP, teléfono ni horario hardcodeados (verificado con grep; los dos teléfonos hardcodeados se corrigieron).
- **Duplicaciones justificadas** (prosa SEO escrita a mano, "Villa Chacabuco, San Martín" sin número): `faq.js` id 1, `SillonBKF.jsx` FAQ, `GuiaBKF.jsx` FAQ, `MobiliarioComercial.jsx:96`, `Nosotros.jsx` description/lead, `Envios.jsx` zona "San Martín y alrededores". No incluyen dato que cambie sin cambiar el barrio; riesgo bajo. `Contacto.jsx:49` description sigue nombrando la localidad en prosa.
- Fuente única efectiva de: nombre, razón social, dirección+CP, teléfono, WhatsApp, email, horario, showroom, retiro, plazo, mapa.

### C.8 Schema (30 bloques)
| Verificación | Resultado |
|---|---|
| JSON-LD válidos | **30/30**, 0 inválidos |
| `PostalAddress` | `streetAddress` "Calle 28 Nº 3779", San Martín, Buenos Aires, **postalCode 1650**, AR |
| Teléfono | `+541161242498` |
| Horario | `OpeningHoursSpecification` lunes–viernes 09:00–18:00 |
| Tipo | `LocalBusiness` + `FurnitureStore` |
| `hasMap` | `https://maps.app.goo.gl/96acmiHnvF2ZA4KM7` |
| `geo` | -34.5851938, -58.5281526; el enlace de Maps del propietario resuelve a "Taller Kappa" en esas mismas coordenadas |
| `aggregateRating` / `Review` | **ninguno** |
| `taxID`/`vatID`/CUIT | ninguno |
| `foundingDate` / `priceRange` | ninguno |
| `sameAs` | solo 1, en `/bkf/`, sobre el concepto "Silla BKF" (Wikipedia). **No** es de la empresa; preexistente |
| `availability` | `InStock` ×3 (pendiente por `stock`) |

No se modificó el schema.

### C.9 Testimonios
- 3 testimonios hardcodeados en `Nosotros.jsx` (fallback; Firebase no configurado). Leyenda visible "Testimonios de clientes recibidos por WhatsApp". Estrellas: 5 iconos `aria-hidden` (solo visuales). Sin `Review`/`AggregateRating` en ningún JSON-LD, sin puntuación numérica ni cantidad de reseñas, sin "reseñas de Google". Autores: "Franquicia YPF Full", "Local Gastronómico (Shell Select)", "Ricardo L. (Particular)": no se inventaron nombres. Que los textos sean reales y de WhatsApp se basa en la confirmación del propietario (B6.1-A); el repo no lo prueba.

### C.10 `llms.txt`
Generado por `scripts/prerender.js` desde `business.js`. Contiene: nombre, razón social, **dirección con CP 1650**, horario, **showroom con turno previo (WhatsApp/teléfono)**, **retiro con coordinación previa**, WhatsApp, email, los 3 productos con "fabrica", nota de plazo por stock y preguntas frecuentes. No agrega datos no confirmados.

## D. Claims

| Claim | Archivo | Estado | Evidencia | Acción |
|---|---|---|---|---|
| "100% fabricación nacional" / "Fábrica AR" / "5 grandes marcas" / "proveedor de confianza" | — | RETIRADOS en B6.1-B | No aparecen en `src/` ni `dist/` | Ninguna |
| "Más de 15 años" | `Nosotros.jsx` (texto + contador 15+) | CONFIRMADO | B6.1-A (propietario) | Mantener; sin año de fundación |
| Clientes: YPF, McDonald's, Burger King, Shell Select, Sandro | Home, Proyectos, Nosotros, FAQ 9 | CONFIRMADO por propietario; sin autorización formal documentada | B6.1-A | Mantener (decisión del propietario) |
| Garantía: estructura de por vida, pintura 2 años, cuero 1 año | Garantía, FAQ 13, Sillón, Producto, `llms.txt`, schema (`additionalProperty`) | PUBLICADO previo; no reconfirmado | `CONTEXTO_PROYECTO.md` lo lista como publicado | PENDIENTE: reconfirmar términos y plazo de 72 hs de reclamos |
| "Diseño argentino de 1938"; "incluido en la colección del MoMA"; "Fabricamos artesanalmente" | Sillón, FAQ 3, Guía BKF | Hecho histórico/descripción; MoMA/1938 registrados como confirmados en `CONTEXTO_PROYECTO.md` | B6.0 (003bf57) | Mantener |
| "Hierro macizo 12 mm", "cuero vacuno de primera selección, curtido al vegetal", "indeformable" | productos, Catálogo, Sillón, Nosotros | Datos técnicos de producto previos | `data/products.js` | Mantener; "indeformable" es superlativo técnico (bajo riesgo); "primera calidad/primera selección" es calificación subjetiva |
| "Factura A y B" | Home, Nosotros, FAQ 15, Mobiliario, Sillón | UNIFICADA en B6.1-B | Texto publicado previo | PENDIENTE: confirmar condición fiscal si se vuelve a hablar de "responsable inscripto" |
| "Directo de fábrica / sin intermediarios" | Home, Nosotros, Sillón | Respaldado por fabricación directa (B6.1-A) | B6.1-A | Mantener |
| "Diseño exclusivo", "acabado cromado premium" | `Proyectos.jsx:31` | Adjetivos comerciales sin evidencia | — | PENDIENTE (BAJO): evaluar suavizar |
| "Uso intensivo 24/7" | `Proyectos.jsx:12` | Descripción de uso gastronómico | — | BAJO; mantener |
| "Reposición rápida" | `Proyectos.jsx:25` | Promesa implícita de plazo | — | PENDIENTE (BAJO) |
| "Cotizamos por WhatsApp en el día" | Home, SillonBKF, Producto | Promesa de tiempo de respuesta | — | PENDIENTE |
| Superlativos "líder", "número 1", "el mejor" | — | **No aparecen** | grep exhaustivo | Ninguna |
| "Retiro sin cargo" | `Envios.jsx:19` | Sin confirmar | — | PENDIENTE DE CONFIRMACIÓN |

## E. Validación técnica

- **Build**: `npm run build` OK, 15 rutas + 404, sitemap **15 URLs** (sin cambios), `llms.txt`, 9 redirecciones legacy, **sin avisos**.
- **Rutas**: ninguna página nueva; `dist/` contiene exactamente las rutas previas (sin `/comprar-bkf-buenos-aires/`, `/bkf-cuero/`, `/bkf-premium/`).
- **Páginas revisadas en HTML prerenderizado (15)**: un único número de WhatsApp (`541161242498`), enlace de Maps correcto, sin IDs duplicados, sin `undefined`/`NaN`, un H1 por página.
- **Control visual**: **parcial**. Chromium headless del entorno se colgó en varias páginas y no genera capturas, por lo que no se pudieron medir overflow ni responsive en píxeles. Se revisó estructura/texto del DOM y el CSS asociado (`.info-grid` pasa a 1 columna ≤ 860 px; `.contact-aside` en grid). Cambio visible a revisar a mano: `/envios/` (se quitaron los tiempos por zona y se agregó una tarjeta "Plazo de entrega" en la grilla de 3 columnas) y `/contacto/` (nueva sección "Showroom y retiro" con un `<h3>` dentro del aside). **Revisión visual humana recomendada** antes de dar por cerrado el aspecto.
- **`git diff --check`**: OK (ver informe final).
- **Schema**: 30/30 válidos (sección C.8).

## F. Pendientes del propietario (solo lo que requiere respuesta)

1. ¿El retiro es **sin cargo**? (`Envios.jsx:19`.)
2. ¿Existe **stock permanente** de los 3 productos? Define `availability` en el schema y el cartel del catálogo.
3. ¿Se cumple siempre "te respondemos/cotizamos **en el día**"?
4. "Ricardo L.": ¿autoriza que figure su nombre abreviado? (o pasar a anónimo).
5. Reconfirmar condiciones de **envío bonificado**, garantías y plazo de **72 hs** de reclamos si se desean mantener tal cual.
6. "Reposición rápida", "diseño exclusivo", "premium" en Proyectos: ¿mantener?

## G. Recomendación

**B6.1-C APROBADA PARA PASAR A B9.**

Motivo: no hay hallazgos críticos; los errores objetivos introducidos o heredados por B6.1-B (cartel de stock, retiro sin coordinación, teléfonos duplicados) se corrigieron; schema, `llms.txt` y contenido coinciden; no hay plazos fijos ni claims retirados. Los pendientes son comerciales y de bajo/medio riesgo, no condicionan la medición de B9. Salvedad: la revisión visual en píxeles no pudo hacerse en este entorno y conviene una pasada manual de `/envios/` y `/contacto/`.
