# Diagnóstico — "bkf buenos aires comprar"

Fecha: 2026-10-06 · Base: `main` @ `75a362d`. Solo diagnóstico: no se modificó código, contenido, schema, sitemap, robots ni URLs.

> Las búsquedas son **observaciones puntuales en Bing** (con `setlang=es-AR&cc=AR`, desde el servidor del entorno, sin sesión ni personalización). **No son Google**, no son posiciones permanentes y no sustituyen a Search Console. Las posiciones son aproximadas: se cuentan los resultados orgánicos visibles en el orden devuelto, y el "Se han quitado algunos resultados" de Bing indica que la lista está recortada.

## 1. Consulta
`bkf buenos aires comprar` (más variantes).

## 2. Resultado manual (Bing, 2026-10-06)

| Consulta | ¿Aparece Taller Kappa? | URL | Posición orgánica aprox. | Quién está por encima |
|---|---|---|---|---|
| `bkf buenos aires comprar` | **No** en los resultados visibles | — | — | proyectobkf.com.ar (home y `/catalogo/`), bigbkf.com, Mercado Libre ×2, Newton, furniture1000 (Big BKF), cuerobuenosaires.com |
| `bkf comprar buenos aires` | Sí | **Home** `https://tallerkappa.com.ar/` | ~9.º–10.º, después de ~8 resultados (Proyecto BKF ×3 incl. `/de-bkf/`, Big BKF ×2, bkfglobal, Magazzino…); hay ficha local de Proyecto BKF arriba | Ver columna siguiente |
| `comprar bkf buenos aires` (corrida previa en B9) | Sí | Home | Debajo de proyectobkf, bigbkf, cuerobuenosaires, fullconfort, bkfglobal, Mercado Libre; sin pack local | — |
| `sillon bkf buenos aires` | Sí | **`http://tallerkappa.com.ar/`** (versión http de la home) | ~9.º–10.º | Proyecto BKF (local + web), La Carpintería, Mercado Libre, Gavia, Kālon Design, Big BKF |
| `comprar sillon bkf buenos aires` | **No** en web (solo una imagen de `/images/bkfapoyapies.png`) | — | — | Local: Proyecto BKF, D Perci, "Sillón & complementos" (Villa Lynch). Web: Kālon Design, La Carpintería, ProyectoBKF, Mercado Libre, Pradero Cueros, tiendas Tiendanube |
| `bkf de cuero buenos aires` | Sí | **`/catalogo/`** (título "Muebles de Hierro y Cuero en Buenos Aires…") y `/catalogo.html` (legacy) | ~6.º–7.º y ~11.º | Proyecto BKF (`/productos/bkfcueronegro/`, `/bkf-cuero/`), Mercado Libre, cuerobuenosaires, Pradero Cueros |
| `sillón bkf buenos aires` (con tilde) | No ejecutada por separado | — | — | Bing suele tratarla igual que sin tilde; no hay dato propio |
| `fabricante bkf buenos aires` (B9) | Sí, en pack local | Ficha local + home | Tras Proyecto BKF en local | — |

**Lectura:**
1. **`/sillon-bkf/` no apareció en ninguna de las 7+ búsquedas.** Las URLs que Bing muestra son la home, `/catalogo/` y las legacy `.html`.
2. Taller Kappa sí está en el índice de Bing y se muestra con títulos/snippets **actuales** de la home ("Fábrica de Sillón BKF y Muebles de Hierro…", "Para elegir y pedir Sillón BKF…"), lo que indica recrawl reciente de la home.
3. En "bkf buenos aires comprar" no aparece, pero en la variante "bkf comprar buenos aires" sí (home, ~9.º–10.º): estamos en el borde de la visibilidad, no ausentes.

## 3. Search Console

**GSC NO DISPONIBLE DESDE EL ENTORNO ACTUAL.** No hay acceso, ni tag/archivo de verificación en el repo. No hay datos de clicks, impresiones, CTR, posición ni landing para ninguna consulta.

Exportación manual necesaria (Search Console → Rendimiento → Resultados de búsqueda → Búsqueda web):
1. Período: últimos **3 meses** y **6 meses**, con *Comparar con el período anterior*.
2. Filtro de consulta (regex, personalizado):
   `bkf buenos aires comprar|comprar bkf buenos aires|bkf comprar buenos aires|bkf buenos aires|comprar bkf|s[ií]ll[oó]n bkf buenos aires|sill[oó]n bkf`
3. Pestaña **Consultas**: query, clicks, impresiones, CTR, posición → CSV.
4. Para cada una de esas consultas, pestaña **Páginas** (filtro por consulta) para ver qué URL recibe impresiones (`/`, `/sillon-bkf/`, `/bkf/`, `/catalogo/`, `.html` legacy).
5. **Inspección de URL** de `https://tallerkappa.com.ar/sillon-bkf/` (¿"La URL está en Google"?, canonical elegida por Google, fecha de último rastreo) y de `/bkf/`.
6. Páginas → "Por qué las páginas no están indexadas" y Sitemaps (¿enviado y leído?).
7. Compartir los CSV o dar acceso de lectura.

## 4. URL de Taller Kappa que posiciona
- Con GSC: **sin dato**.
- Con la observación de Bing: la **home** (y `/catalogo/` para "bkf de cuero"). `/sillon-bkf/` no se vio en Bing para ninguna consulta. No hay evidencia sobre qué URL prefiere Google.

## 5. Indexación de `/sillon-bkf/` (verificada técnicamente)

| Comprobación | Resultado |
|---|---|
| Accesible | 200 en `https://tallerkappa.com.ar/sillon-bkf/` |
| Prerenderizada | Sí: el HTML sin JavaScript trae el H1 y ~2.800 palabras de texto |
| Canonical | Autorreferente `https://tallerkappa.com.ar/sillon-bkf/` |
| Robots meta | `index, follow, max-image-preview:large…` |
| Sitemap | Incluida (1 entrada) |
| Enlazada internamente | Sí, desde 14 páginas (home 7 enlaces, catálogo 6, `/bkf/` 6, asientos 5, …) |
| Indexada en Google/Bing | **No verificable**: `site:tallerkappa.com.ar` en Bing no devolvió resultados parseables (inconcluso); para Google se requiere Inspección de URL |

Conclusión: **no hay ningún bloqueo técnico visible**. Si no está indexada o rankea bajo, el motivo no es técnico en la página.

Problemas de indexación del dominio (no de esta URL) ya detectados: URLs `.html` legacy y `http://` aún circulando en índices; sin 301 reales; sin `Always Use HTTPS`.

## 6. Comparación de contenido

| Aspecto | `/sillon-bkf/` | Quienes aparecen |
|---|---|---|
| Intención | Ficha de producto + guía (FAQ de 13 preguntas); no se compra online | Tienda con carrito (Tiendanube, Mercado Libre, Shopify de Big BKF) o catálogo con "cómo comprar online" (Proyecto BKF) |
| Title | "Sillón BKF de Cuero en Buenos Aires \| Fábrica Taller Kappa" | Muchos usan "Sillón BKF – Comprar en {marca}" (Kālon, Pradero, La Carpintería, Enecueros): patrón transaccional explícito |
| H1 | "Sillón BKF de hierro y cuero, fabricado en Buenos Aires" | Nombre de producto o marca |
| Precio | **No publicado** ("Precio a consultar") | Ecommerce con precio y cuotas ("hasta 3 cuotas sin interés", "envío gratis") |
| Compra | Presupuesto por WhatsApp, sin pago online | Carrito/checkout; Mercado Libre con envío y cuotas |
| Señales locales | Dirección, CP, showroom con turno, mapa, geo | Proyecto BKF: ficha local en Maps/Bing con dirección en CABA; Taller Kappa tiene ficha Bing pero con **otro teléfono** y categoría genérica |
| Fabricante | Explícito (fábrica propia, San Martín) | Proyecto BKF, Big BKF: "Fabricamos / hecho a mano en Buenos Aires" |
| Confianza | Sin reseñas, sin fotos reales del taller (fotos del producto marcadas como generadas) | Reseñas, políticas de arrepentimiento, medios de pago, redes sociales (Instagram/Facebook) |
| Autoridad | Dominio con historial inestable (3 cambios de URL en ~15 días) | Dominios antiguos (Proyecto BKF, Big BKF, Mercado Libre) |

No se copió contenido de competidores; solo se compararon patrones.

## 7. Competencia por tipo
- **Fabricantes con marca BKF en el nombre:** Proyecto BKF, Big BKF (los más fuertes, también en el pack local y con perfiles sociales).
- **Marketplace:** Mercado Libre (varios listados).
- **Tiendas Tiendanube/Shopify de cuero y mobiliario:** Kālon Design, La Carpintería, Pradero Cueros, Enecueros, Newton, Gavia, Madera Maciza.
- **Directorios/agregadores:** furniture1000.
- **Fichas locales:** Proyecto BKF, BIG BKF, otros talleres de la zona.

**Señales que tienen y Taller Kappa no (o no verificadas):**
1. Intención transaccional visible en el title ("Comprar") y producto con **precio** y compra online.
2. Ficha local con categoría y teléfono consistentes (Taller Kappa tiene ficha en Bing con tel. 011 4753-0099 ≠ sitio).
3. Perfiles sociales y reseñas.
4. Antigüedad/estabilidad de URLs y enlaces entrantes (**no medidos**; no se asume que sea el único factor).
5. Fotos reales.

## 8. Problema probable (clasificación)

| Categoría | Evaluación |
|---|---|
| Indexación | **Posible, no confirmada.** Sin bloqueo técnico en la página, pero `/sillon-bkf/` no aparece en Bing y el dominio aún expone `.html` y `http://`. Requiere GSC |
| Relevancia / contenido | Moderada: la página responde bien al tema, pero su title no incluye "comprar" y no tiene precio ni compra online (intención transaccional más débil que los competidores) |
| Intención de búsqueda | **Probable factor principal.** "Comprar" se resuelve hoy con tiendas con precio y carrito; Taller Kappa ofrece cotización por WhatsApp |
| SEO local | **Probable factor relevante.** Ficha Bing con teléfono distinto, categoría genérica, sin GBP verificada, sin reseñas |
| Autoridad | Probable (dominio con cambios de URL recientes y sin perfiles externos), **sin medición** |
| CTR | **No evaluable** sin GSC |
| Otro | Home rankea en lugar de `/sillon-bkf/` (posible canibalización estructural, sin confirmar) |

## 9. Recomendación

**F. Necesitamos datos de GSC antes de decidir** — con prioridad inmediata de **D (resolver indexación: comprobar con Inspección de URL)** y **E (mejorar local SEO/autoridad)**, que no dependen de crear contenido.

Fundamento:
- **No C:** no hay evidencia de que una nueva landing resuelva el problema. El tema ya lo cubre `/sillon-bkf/`, una página extra compartiría contenido y competiría con ella; además la causa más probable (intención, local, autoridad) no se arregla con otra URL.
- **No A/B todavía:** el contenido ya se mejoró en el BLOQUE 2; no hay datos para seguir ajustando.
- **Primer paso:** Inspección de URL de `/sillon-bkf/` en GSC. Si dice "no está en Google": es un tema de indexación/descubrimiento (solicitar indexación, 301 y HTTPS). Si está indexada pero sin impresiones para estas consultas: es relevancia/autoridad/local.
- **En paralelo (sin código):** unificar teléfono y datos en la ficha de Bing/GBP, reclamar GBP y Bing Places, fotos reales, perfiles sociales verificados.

Decisiones comerciales abiertas que influyen en la intención transaccional (no se tocaron): publicar precio de lista, ofrecer compra online o mantener "cotizar por WhatsApp". Son del propietario.
