# Auditoría SEO — landing `/sillon-bkf/`

Fecha: 2026-10-17 · Base: `main` @ `e86707c` · Sitio en vivo: `https://tallerkappa.com.ar/sillon-bkf/` (último deploy 2026-10-06).
Marco: skills `seo-audit`, `schema`, `ai-seo` y `core-web-vitals`. Los arreglos de código de bajo riesgo (O2, O4, O8) se aplicaron en el mismo branch y están marcados con ✅; lo demás depende del panel de Cloudflare o de decisiones del propietario.

> **Regla de los diagnósticos anteriores, mantenida:** no hay datos inventados. Sigue sin haber acceso a GSC ni a GA4.
> Todo lo que figura acá se comprobó contra el sitio en vivo (HTTP, HTML prerenderizado, JSON-LD) o con Lighthouse.
> **Lighthouse es laboratorio:** una corrida, móvil simulado. No equivale a datos de campo (CrUX / informe CWV de GSC).
> Complementa `seo/diagnostico-bkf-buenos-aires-comprar.md` y `seo/b10-gsc-ga4-diagnostico.md`: lo que ya está ahí no se repite, solo se referencia.

## Resumen ejecutivo

**La página está bien construida.** No tiene bloqueos de indexación. Lighthouse le da 100 en SEO y 100 en accesibilidad. Tiene un H1 único, canonical autorreferente, ~1.600 palabras útiles, un schema completo y conectado por `@id`, FAQ y `llms.txt`. El techo de la página no está en lo técnico on-page.

Los 5 problemas que más pesan:

1. **HTTP sin redirección a HTTPS (sigue pendiente).** `http://tallerkappa.com.ar/sillon-bkf/` responde **200** con la página completa. Bing ya mostró la versión `http://` de la home en resultados. El paso a paso está escrito en `docs/seo/cloudflare-paso-a-paso.md`, pero no se aplicó.
2. **Cloudflare bloquea con 403 a GPTBot, ClaudeBot, CCBot y Bytespider**, en todo el sitio, incluso en `/llms.txt`. Eso contradice al `robots.txt`, que dice que ningún bot queda bloqueado. Los bots de búsqueda y de usuario (OAI-SearchBot, ChatGPT-User, Claude-SearchBot, Claude-User, PerplexityBot, Googlebot, Bingbot) sí pasan.
3. **Señales de experiencia y confianza débiles.** La página tiene una sola foto, generada con IA (`CONTEXTO_PROYECTO.md`). No hay fotos del taller ni de entregas reales, ni reseñas. Los clientes (YPF, McDonald's…) se nombran sin evidencia visual.
4. **Intención transaccional sin respuesta concreta.** No hay precio ni rango, y el plazo de entrega dice "depende del stock". Es lo mismo que marcó el diagnóstico anterior. Además afecta a GEO: ante "¿cuánto cuesta un BKF?", los asistentes van a citar a competidores que sí publican precio.
5. **Riesgo de canibalización con la home.** El title de la home empieza con "Fábrica de Sillón BKF…" y su H1 es "Sillones BKF y muebles de hierro en Buenos Aires". Bing posiciona la home y no `/sillon-bkf/`. Sin GSC sigue siendo **hipótesis**.

Arreglos rápidos sin código (panel de Cloudflare): forzar HTTPS, configurar redirecciones 301 y decidir sobre los bots de IA.

## Hallazgos técnicos

| # | Problema | Impacto | Evidencia | Solución | Prioridad |
|---|---|---|---|---|---|
| T1 | HTTP no redirige a HTTPS | **Alto** | `curl http://tallerkappa.com.ar/sillon-bkf/` → 200 con la página entera (52 KB). El canonical lo mitiga, pero Bing ya indexó `http://` | Cloudflare → *SSL/TLS → Edge Certificates → Always Use HTTPS* (Paso 2 de `docs/seo/cloudflare-paso-a-paso.md`) | **1** |
| T2 | URLs legacy y sin barra final sirven 200 con meta refresh, no 301 | Medio | `/sillon-bkf.html` y `/sillon-bkf` → 200 (733 B, `meta refresh` + `location.replace` + canonical correcto) | Redirect Rules 301 (Paso 3 del mismo doc). El canonical ya apunta bien, así que esto acelera la consolidación pero no es urgente | 2 |
| T3 | Bots de entrenamiento de IA bloqueados en el borde | Medio | User-agent GPTBot, ClaudeBot, CCBot y Bytespider → **403** en `/`, `/sillon-bkf/`, `/bkf/` y `/llms.txt`. OAI-SearchBot, ChatGPT-User, Claude-SearchBot, Claude-User, PerplexityBot, Perplexity-User, Applebot-Extended, meta-externalagent, Googlebot y Bingbot → 200 | **Decisión del propietario.** Para que los modelos "conozcan" a Taller Kappa: Cloudflare → *Security → Bots* (o *AI Crawl Control*) → desactivar "Block AI bots". Si se prefiere bloquear el entrenamiento, corregir el comentario del `robots.txt`, que hoy dice lo contrario | 2 |
| T4 | Assets con hash cacheados solo 4 h | Bajo | Lighthouse `uses-long-cache-ttl`: `/assets/*.js`, `.css`, `/fonts/*.woff2` e imágenes con TTL de 14.400.000 ms (4 h) | Cache Rule en Cloudflare: `/assets/*` y `/fonts/*` → Browser TTL 1 año (los nombres llevan hash, no hay riesgo de servir versiones viejas) | 3 |
| T5 | Rendimiento móvil en el límite | Bajo-medio | Lighthouse móvil (lab): **Perf 80**, LCP 3,6 s, FCP 2,7 s, CLS 0, TBT 180 ms, TTFB 200 ms, 432 KB totales. El LCP es el `<p>` del hero (no depende de JS: `PageHero.jsx`), con ~3 s de *render delay* | Primero mirar el informe CWV de GSC (datos de campo). Si confirma LCP > 2,5 s: probar a subsetear o achicar la fuente variable (89 KB, ejes de peso y ancho) y hacer inline del CSS crítico (10 KB bloqueantes, ~350 ms) | 3 |
| T6 | Email ofuscado por Cloudflare | Bajo | El footer muestra `[email protected]` a todo cliente sin JS (Scrape Shield). El mismo email está en claro en el JSON-LD y en `llms.txt`, así que la ofuscación no protege nada y solo resta en el HTML | Desactivar *Scrape Shield → Email Address Obfuscation*, o aceptarlo | 4 |

Sin problemas: `robots.txt` (solo `Disallow: /admin`, con referencia al sitemap), sitemap con `/sillon-bkf/` y su imagen, `www` → 301 al dominio sin www, `robots` meta `index, follow, max-image-preview:large`, viewport, `lang`, imagen LCP en AVIF/WebP con `srcset` y `fetchpriority="high"`, sin CLS.

## Hallazgos on-page

| # | Elemento | Estado | Observación / recomendación | Prioridad |
|---|---|---|---|---|
| O1 | Title: "Sillón BKF de Cuero en Buenos Aires \| Fábrica Taller Kappa" (58 car.) | Bien | Keyword al principio, largo correcto, alineado con el H1. **No incluye un modificador transaccional** (comprar / venta / directo de fábrica), que sí usa la competencia. Variante para probar *después* de tener línea base en GSC: `Comprar Sillón BKF de Cuero en Buenos Aires \| Taller Kappa` (58 car.). Cambiarlo sin datos es apostar | 3 |
| O2 | Meta description (164 car.) | Mejorable | Se cortaba en algunas SERP y no mencionaba los diferenciales más fuertes. **Aplicado** (150 car.): *"Sillón BKF de hierro macizo y cuero, directo de fábrica en San Martín, Buenos Aires. A medida sin costo, garantía de por vida y envíos a todo el país."* | ✅ |
| O3 | H1 | Bien | "Sillón BKF de hierro y cuero, fabricado en Buenos Aires": único, con keyword y ubicación | — |
| O4 | Jerarquía de encabezados | Bien, con detalles | Los H3 "1938" y "Mundial" no describían nada fuera de contexto → **aplicado:** "Diseño de 1938" y "En el MoMA". El H2 "Tu presupuesto" del `CartDrawer` está dentro de un `<dialog>` nativo cerrado (`Modal.jsx`): es el patrón accesible correcto y no se toca | ✅ |
| O5 | Primeras 100 palabras | Bien | Responden quién, qué, dónde, cómo se compra y envíos. Formato ideal para fragmentos y para IA | — |
| O6 | Imágenes | **Débil** | **Una sola imagen** en la landing de producto, generada con IA. Para un mueble, Google Imágenes y la galería son tráfico y conversión. Faltan detalles (costura, cuero, soldadura), producto en ambiente, variantes de color, el taller y entregas a locales | **2** |
| O7 | Enlazado interno | Bien | 14 páginas enlazan a `/sillon-bkf/` (home 7, catálogo 6, `/bkf/` 6, asientos 5). Las anclas son descriptivas y no hay enlaces rotos | — |
| O8 | Coherencia de colores | Inconsistente | La ficha decía "negro mate, blanco, colores a pedido, cromado" y las muestras/TypeWriter "blanco crema, verde oliva, rojo Kappa". **Aplicado:** ficha (`data/products.js`, que alimenta la ficha técnica visible y el `additionalProperty` del schema; `llms.txt` no lista colores por producto, así que no cambia), lista de la landing, FAQ y FAQ de categoría dicen "negro mate, blanco crema, cromado y colores a pedido (como verde oliva o rojo Kappa)" | ✅ |

## Contenido y E-E-A-T

| # | Problema | Impacto | Recomendación | Prioridad |
|---|---|---|---|---|
| C1 | Sin fotos reales (pendiente en `CONTEXTO_PROYECTO.md`) | **Alto** (confianza y conversión, también imágenes) | Sesión de fotos en el taller: producto en 3–4 colores, detalle de materiales, proceso, entregas a locales. Con eso se suma una galería y `image` en el schema | **1 (sin código)** |
| C2 | Clientes nombrados sin evidencia | Medio | Una foto por proyecto en `/proyectos/` y una miniatura en la landing. Si no hay fotos, bajar el tono ("trabajamos para…") | 2 |
| C3 | Sin reseñas ni testimonios en la página | Medio | Pedir reseñas en Google Business Profile, que es donde suman al pack local. Mostrar 2–3 testimonios reales. **No** agregar `aggregateRating` hasta tener reseñas propias verificables | 2 |
| C4 | Precio y plazo sin respuesta | Medio-alto | **Decisión comercial.** Opciones de menor a mayor compromiso: (a) plazo en días hábiles ("fabricación 10–15 días hábiles"), (b) precio "desde $X", (c) precio de lista. Aunque sea solo (a), la FAQ "¿Cuánto tarda…?" pasa a ser una respuesta citable | 2 |
| C5 | Frase "Los precios que figuraron en versiones anteriores de este sitio pueden no estar vigentes" | — | **Es intencional, se mantiene.** La agregó `730c66a` porque los buscadores con IA seguían citando "$280.000 (mayo 2026)" de versiones viejas del sitio (`docs/seo/fase-4-ventas.md`). Se puede sacar cuando se publique un precio vigente o cuando los asistentes dejen de citar el viejo | — |
| C6 | Profundidad del contenido | Bien | ~1.600 palabras, ficha técnica, comparación macizo vs. tubo, cuidados, garantía. Es mejor que la mayoría de los competidores relevados | — |

## Schema (JSON-LD)

Hay dos bloques `@graph`: `LocalBusiness+FurnitureStore`, `Brand` y `WebSite` (global), más `WebPage`, `BreadcrumbList`, `Product` y `FAQPage` (página). Todos los `@id` se resuelven, y el `prerender.js` lo valida.

| # | Observación | Efecto | Recomendación | Prioridad |
|---|---|---|---|---|
| S1 | `Product.offers` sin `price` ni `priceSpecification` | El producto **no es elegible** para fragmentos de producto ni fichas de comerciante. Cuando haya GSC, el informe "Fragmentos de productos" va a marcar el ítem como no válido. **No penaliza el ranking** | Si se publica "desde $X": agregar `priceSpecification` (`minPrice`, `priceCurrency: ARS`). Si no, aceptar la advertencia: el `Product` sigue sirviendo para entidad y GEO | 3 |
| S2 | `FAQPage` | Google ya no muestra FAQ enriquecidas para sitios comerciales (desde 2023), pero el marcado se mantiene útil para buscadores con IA | Mantener | — |
| S3 | Sin `sameAs` en la organización | La entidad no queda vinculada a perfiles externos (GBP, Instagram, Facebook, LinkedIn) | Cuando existan los perfiles (pendiente en `seo/b6-*`), agregarlos a `sameAs` en el nodo de la organización (`react-app/src/lib/schema.js`) | 2 (depende de C3/local) |
| S4 | `email` personal (`@gmail.com`) en schema, `llms.txt` y contacto | Señal de confianza más débil que un dominio propio | `ventas@tallerkappa.com.ar` (Cloudflare Email Routing es gratis y lo reenvía al gmail) | 4 |

## GEO / búsqueda con IA

**A favor:** respuestas al principio del texto, datos concretos y citables (12 mm, 78×70×90 cm, garantías), FAQ de 13 preguntas, `llms.txt` completo, `robots.txt` abierto, contenido 100 % en el HTML sin JavaScript.

**En contra:**
- **T3:** los bots de entrenamiento reciben 403. Los motores que buscan en vivo (ChatGPT search, Claude, Perplexity) sí pueden leer el sitio, pero el conocimiento propio de los modelos no se va a alimentar de él.
- **C4:** sin precio ni plazo, las preguntas más frecuentes sobre el BKF ("cuánto cuesta", "cuánto tarda") se responden con datos de la competencia.
- **Autoridad externa:** no hay menciones de terceros (prensa, directorios, Mercado Libre, marketplaces de diseño). Los asistentes citan más a marcas que aparecen en varias fuentes. Las acciones están en `seo/b6-*` y en el diagnóstico anterior (perfiles, GBP, NAP).

## SEO local

Ya documentado en `seo/diagnostico-bkf-buenos-aires-comprar.md` §6–8 y en `seo/b6-*`: NAP inconsistente en Bing (otro teléfono), GBP sin verificar y sin reseñas. Esta auditoría no encontró nada nuevo, y en el sitio el NAP es coherente (página, footer, JSON-LD y `llms.txt` coinciden). **Sigue siendo, junto con la autoridad, la palanca más probable para "comprar sillón BKF Buenos Aires"**, donde arriba aparece el pack local.

## Plan de acción priorizado

**1. Crítico (esta semana, sin código, en el panel de Cloudflare)**
- [ ] T1: Always Use HTTPS. Verificar: `curl -I http://tallerkappa.com.ar/sillon-bkf/` → 301.
- [ ] T2: Redirect Rules 301 para `.html` y sin barra final (`docs/seo/cloudflare-paso-a-paso.md` Paso 3).
- [ ] T3: decidir sobre los bots de entrenamiento de IA y dejar `robots.txt` coherente con esa decisión.

**2. Alto impacto (dependen del propietario)**
- [ ] C1: fotos reales del producto, el taller y las entregas → galería en la landing.
- [ ] Local: verificar GBP, unificar el teléfono en Bing Places y empezar a pedir reseñas.
- [ ] C4: publicar al menos el plazo de fabricación en días; evaluar "precio desde".
- [ ] Acceso a GSC y GA4 (pendiente desde B10): sin eso no se puede medir nada de lo anterior.

**3. Arreglos rápidos (código, bajo riesgo)**
- [x] O2: nueva meta description (150 car.).
- [x] O8: unificar la lista de colores.
- [x] O4: H3 "1938" y "Mundial" → "Diseño de 1938" y "En el MoMA".
- [ ] T4: Cache Rule de 1 año para `/assets/*` y `/fonts/*` (panel de Cloudflare).

**4. Con datos de GSC (no antes)**
- [ ] O1: probar el title con "Comprar" si `/sillon-bkf/` tiene impresiones en posición 4–15 con CTR bajo.
- [ ] Canibalización con la home: si GSC confirma que la home recibe las consultas "sillón BKF…", reorientar el title de la home hacia la marca y "muebles de hierro" y dejar "sillón BKF" a esta página.
- [ ] T5: optimizar LCP solo si el informe CWV de campo lo marca.
- [ ] S1/S3: `priceSpecification` y `sameAs` cuando existan precio y perfiles.

## Cómo se comprobó (reproducible)

```bash
curl -sI http://tallerkappa.com.ar/sillon-bkf/                    # T1: 200, debería ser 301
curl -s -o /dev/null -w '%{http_code}' https://tallerkappa.com.ar/sillon-bkf.html   # T2
curl -s -o /dev/null -w '%{http_code}' -A 'GPTBot/1.1' https://tallerkappa.com.ar/  # T3: 403
npx lighthouse https://tallerkappa.com.ar/sillon-bkf/ --only-categories=performance,seo,accessibility   # T4/T5
```
