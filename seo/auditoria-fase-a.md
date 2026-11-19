# Auditoría Fase A — Taller Kappa (SEO / GEO / CRO)

> Solo auditoría. No se modificó código. Base: rama `feat/seo-fase-4` (HEAD `730c66a`), `npm run build` ejecutado (exit 0) y análisis del HTML real de `react-app/dist`.
> Etiquetas: `[V]` = VERIFICADO EN REPOSITORIO · `[H]` = HIPÓTESIS · `[E]` = REQUIERE DATOS EXTERNOS.
> Prioridades: 🔥 CRÍTICO · 🟥 MUY ALTO · 🟧 ALTO · 🟨 MEDIO · 🟩 BAJO.
> Nada acá promete ocupar el primer puesto: el ranking depende de factores externos que no se ven desde el repo.

---

## 1. Resumen ejecutivo

> **CORRECCIÓN B0 (6/10/2026):** el hallazgo "`main` no contiene los 24 commits SEO" fue un **falso positivo**: `main` local estaba atrasado; `origin/main` ya contenía `feat/seo-fase-4` (PR #7) y el sitio publicado corresponde a la fase 4.
> **Matiz sobre las páginas "faltantes":** `CONTEXTO_PROYECTO.md` (§ decisiones) y `docs/seo/fase-4-ventas.md` documentan que NO crear `/comprar-bkf-buenos-aires`, `/bkf-cuero`, `/bkf-premium` fue una decisión deliberada (misma intención que `/sillon-bkf/`, evitar canibalización). Los 404 son esperables; lo que queda abierto es si la decisión sigue siendo correcta (`[E]`: requiere datos de Search Console).
- El sitio está técnicamente sano: 15 rutas prerenderizadas, título/description/canonical/H1 únicos, 2 bloques JSON-LD por página, sitemap, robots, llms.txt. `[V]`
- Los límites para competir con Proyecto BKF / BIG BKF están en tres lugares, no en el código base:
  1. ~~**Producción**: `main` no tiene los 24 commits SEO~~ **FALSO POSITIVO (corregido en B0).** El `main` local estaba 25 commits atrasado; `origin/main` (PR #7, `24603a6`) ya contiene `feat/seo-fase-4` y lo publicado coincide con la fase 4 (mismo bundle `index-C0Rkz-oZ.js`, mismo sitemap y llms.txt). `[V]`
  2. **Cobertura**: no hay página comercial para "comprar / dónde comprar BKF Buenos Aires", ni para "BKF de cuero" o "BKF premium" como intención propia. Hay 3 productos. `[V]`
  3. **Entidad y autoridad externa**: sin `sameAs`, sin perfiles verificables, email Gmail personal, sin reseñas, sin Google Business Profile verificable desde el repo. `[V]` / `[E]`
- No se puede saber, desde el repo, dónde rankea hoy ni por qué lo superan los competidores. `[E]`

## 2. Estado actual SEO
| Ítem | Estado |
|---|---|
| Title / description únicos por página | OK en las 15 rutas `[V]` |
| Canonical con barra final, coherente con sitemap | OK `[V]` |
| 1 H1 por página | OK `[V]` |
| Robots por página | `index, follow, max-image-preview:large…` `[V]` |
| `lang` | `es-AR` `[V]` |
| Open Graph / Twitter | Presentes, imagen 16:9 `[V]` |
| Sitemap | 15 URLs, con lastmod e imágenes `[V]` |
| 404 | `noindex`, sin schema (correcto) `[V]` |
| lastmod | Todos `2026-10-05`: sale del último commit, no de cambios reales por página `[V]` (efecto en Google `[H]`) |
| Mapa de keywords `docs/seo/fase4-keyword-map.md` | **Desactualizado**: habla de `/catalogo/sillon-bkf-premium` como destino de compra y de H1 viejos; hoy el sillón vive en `/sillon-bkf` `[V]` |

Palabras aproximadas por página: `/sillon-bkf` 1.672 · `/bkf` 1.316 · `/faq` 981 · `/mobiliario-comercial` 894 · `/` 702 · `/nosotros` 603 · productos 510–530 · `/contacto` 291. `[V]`

## 3. Estado técnico
- Build real OK, sin warnings. Páginas entre 23 y 51 KB de HTML. `[V]`
- JS principal 237 KB; chunk de Firebase 450 KB, cargado solo bajo demanda y bloqueado si Firebase no está configurado. CSS 41 KB. `[V]`
- Fuente propia con `preload`. `[V]` AVIF/WebP/JPG con `<picture>`. `[V]`
- **Redirecciones legacy**: `/faq.html`, `/catalogo.html`, etc. son stubs `meta refresh` + canonical (GitHub Pages no hace 301). No van en el sitemap y llevan title/description del destino. `[V]` Un 301 real requiere Cloudflare (hay guía en `docs/seo/`); si está aplicado: `[E]`.
- `public/sw.js` es un "kill switch" que borra cachés y se desregistra. No afecta SEO. `[V]` Se puede eliminar más adelante. 🟩
- `dist/` está en `.gitignore`. `[V]`
- Imágenes legacy sin referencias en `src`: `bkf1.jpg` (241 KB), `bkfapoyapies.jpg`, `mesa.jpeg` siguen en `public/images` y se copian a producción. `[V]` Peso muerto, no daña el ranking. 🟨
- La imagen del sitemap usa JPG; hay variantes AVIF/WebP en las páginas. `[V]`

## 4. GEO / AI Search
- `llms.txt` generado en build con empresa, dirección, productos, envíos, garantía y FAQ. `[V]` (que algún motor lo use: `[E]`, es un estándar no garantizado)
- `robots.txt` permite todo salvo `/admin`; no bloquea bots de IA. `[V]`
- Respuestas directas "¿Dónde comprar un sillón BKF en Buenos Aires?" en `/bkf` y `/faq`, con FAQPage. `[V]`
- La guía `/bkf` cita fuentes y enlaza a Wikipedia como `sameAs` del concepto "Silla BKF". `[V]`
- Faltan para ser una entidad corroborada: `sameAs` de la empresa, año de fundación, perfiles externos, menciones de terceros. `[V]` `[E]`
- **Inconsistencia**: `llms.txt`, `faq.js` y `schema.js` dicen "showroom"; `business.js` y el resto del texto hablan de "retiro en el taller". Un modelo puede presentar un showroom que quizá no existe. `[V]` (qué es lo real: `[E]`) 🟥
- Detección de referidos IA (`analytics.js`): la clave `www.bing.com/chat` es una ruta, no un hostname, así que no puede coincidir. Es probable que Copilot por bing.com no se detecte. `[V]`/`[H]` Los AI Overviews de Google no se distinguen del tráfico orgánico. `[E]`

## 5. Local SEO
- Schema `LocalBusiness`+`FurnitureStore` con dirección, geo, horario, teléfono, `areaServed`, `hasMap`. `[V]`
- NAP consistente entre footer, contacto, schema y llms.txt (Calle 28 Nº 3779, Villa Chacabuco, San Martín; 11 6124-2498). `[V]`
- Sin `sameAs`, sin `priceRange`, sin `foundingDate`. `[V]`
- Email de contacto: `ing.franciscomarotta@gmail.com`, no un dominio propio. Resta confianza comercial. `[V]` 🟧
- Google Business Profile, Bing Places, reseñas, citaciones (directorios): no verificables. `[E]` 🔥 (probable el factor local más fuerte)
- Página local dedicada ("sillón BKF en San Martín / Zona Norte / CABA"): no existe. `[V]`

## 6. CRO
- WhatsApp flotante con mensaje contextual (pide precio del producto en su página y agrega la URL). `[V]`
- Se oculta cuando hay un CTA a la vista, para no taparlo en mobile. `[V]`
- Formulario de contacto: abre WhatsApp antes de cualquier `await`; el guardado en Firestore corre en segundo plano. `[V]`
- Sin precio publicado en ningún producto ("Cotización por WhatsApp"). `[V]` Esto frena a quien compara con otros sitios (hipótesis `[H]`); decisión comercial, ver sección 14.
- Una sola variante de sillón. No hay selector de color/terminación con mensaje precargado. `[V]`
- Sin prueba social cuantificable (reseñas, fotos de clientes reales, cantidad de piezas vendidas). Hay logos de clientes B2B. `[V]`
- Envíos, garantía y factura A/B están documentados. `[V]`

## 7. Analytics
- GA4 `G-2FDMN51XDY`, carga diferida (primera interacción o 3 s). `[V]`
- Eventos: `page_view`, `whatsapp_click` (con `location`, `page_path`, `item_name`), `email_click`, `select_item`, `ai_referral`, `contacto_save_failed`. `[V]`
- Visitas que salen en menos de 3 s sin interacción no registran pageview: **subcuenta** el tráfico. `[V]`
- No hay `generate_lead` ni evento clave marcado en el código; marcarlo como conversión se hace en el panel GA4. `[V]` / `[E]`
- No hay Search Console / Bing Webmaster verificable desde el repo. `[E]` 🟥 Sin ellos no se sabe qué consultas traen tráfico.
- Los clics a WhatsApp no son ventas: la venta se cierra fuera del sitio. `[V]` Hace falta registrar origen por consulta (preguntar "¿cómo nos encontraste?"). `[E]`

## 8. Problemas críticos 🔥
| # | Problema | Evidencia | Archivo |
|---|---|---|---|
| ~~1~~ | ~~El deploy sale de `main`, que no contiene las fases SEO~~ **FALSO POSITIVO**: comparé contra un `main` local desactualizado (25 commits atrás). `origin/main` ya incluye `feat/seo-fase-4`; el deploy publicado = fase 4 | `git pull --ff-only` → main local = `24603a6`; bundle, sitemap y llms.txt online idénticos al build | `.github/workflows/deploy.yml` |
| 2 | No existe página comercial separada para "comprar / dónde comprar BKF en Buenos Aires" (**decisión documentada**: `/sillon-bkf/` cubre esa intención; reevaluar con GSC) | Rutas: solo `/bkf` (guía) y `/sillon-bkf` (producto) | `src/routes.js` |
| 3 | Sin presencia local verificable (GBP, Bing Places, reseñas) | No visible en el repo | `[E]` |
| 4 | Sin Search Console / Bing Webmaster confirmados: no se mide nada de posicionamiento | No visible en el repo | `[E]` |

## 9. Alto impacto 🟥
- Catálogo de 3 productos: no cubre "BKF de cuero" ni "BKF premium" como intenciones propias; hoy el cuero es solo un material. `[V]`
- Inconsistencia "showroom" vs "retiro en el taller" en schema, FAQ, footer y llms.txt. `[V]`
- Entidad débil: sin `sameAs`, sin año de fundación, email Gmail. `[V]`
- Detección de IA rota para Copilot/Bing. `[V]`
- Mapa de keywords desactualizado frente a las rutas reales. `[V]`
- Firebase con credenciales placeholder: Admin no funciona y los leads del formulario no se guardan (solo llegan por WhatsApp). `[V]`

## 10. Medios 🟨 / 🟧
- 🟧 Autoridad interna baja: `/proyectos` (4 enlaces entrantes contextuales), `/nosotros` (4), `/catalogo/asientos` (6), `/bkf` (6), `/faq` (6). `/bkf` es la guía clave para informacional y debería recibir más. `[V]`
- 🟧 Posible canibalización `/bkf` vs `/sillon-bkf` en "sillón BKF" (ambas contienen "dónde comprar"). `[H]`
- 🟨 lastmod idéntico en todo el sitemap. `[V]`
- 🟨 `<img alt="">` detectada en `/nosotros`: confirmar si es decorativa. `[V]`
- 🟨 Imágenes legacy sin uso (~0,5 MB). `[V]`
- 🟨 Home sin FAQPage/Breadcrumb: normal para home. `[V]`
- 🟨 Stubs de redirección sin 301 real. `[V]`
- 🟩 `sw.js` kill-switch eliminable. `[V]`

## 11. Oportunidades
1. Landing "Comprar sillón BKF en Buenos Aires" (intención transaccional + local).
2. Página/sección "BKF de cuero" y "BKF premium" (qué cuero, qué diferencia, medidas, colores).
3. Contenido de comparación: cómo elegir un BKF, cuidado del cuero, medidas, colores.
4. Páginas de zona (San Martín, Zona Norte, CABA) con envíos reales.
5. Casos de proyectos con fotos reales (YPF, McDonald's, etc.) si el cliente autoriza.
6. Consolidar entidad: `sameAs`, GBP, Bing Places, email de dominio.
7. Medición de leads reales por canal.
8. Corregir mensajes de IA/showroom para que las respuestas generativas sean exactas.
9. Evento de conversión `generate_lead` en GA4.
10. Publicar precio de referencia ("desde") si el cliente lo decide.

## 12. Keywords sin landing adecuada
| Keyword | Intención | Página actual | Página ideal | ¿Existe? |
|---|---|---|---|---|
| comprar BKF Buenos Aires / BKF comprar Buenos Aires | Transaccional-local | `/sillon-bkf` (parcial), `/bkf` (parcial) | Landing comercial dedicada | No |
| dónde comprar BKF / dónde comprar un sillón BKF | Transaccional-informacional | `/bkf` (H2) y `/faq` | Landing comercial dedicada | Parcial |
| sillón BKF Buenos Aires | Comercial-local | `/sillon-bkf` | `/sillon-bkf` | Sí |
| BKF de cuero Buenos Aires | Comercial | `/sillon-bkf` (mención) | Página/sección propia | No |
| BKF premium Buenos Aires | Comercial | `/sillon-bkf` (nombre "Premium") | Página/sección propia | No |
| fabricante BKF / fábrica BKF Buenos Aires | Comercial-confianza | `/nosotros`, `/sillon-bkf` | Página "fabricamos BKF" o sección dedicada | Parcial |
| mejor BKF Buenos Aires | Comparativa | Ninguna | Guía "cómo elegir" | No |
| BKF Argentina | Genérica | `/bkf` | `/bkf` | Sí |
| sillón BKF precio | Transaccional | Ninguna (no hay precio) | Sección de precios/cotización | No |

Volúmenes y dificultad: `[E]`.

## 13. Páginas que deberían recibir más autoridad interna
- `/bkf` (6 enlaces): la guía debe nutrir a `/sillon-bkf` y recibir enlaces desde home, FAQ y productos. 🟧
- `/catalogo/asientos` (6) y `/catalogo/mesas` (7). 🟨
- `/nosotros` (4) y `/proyectos` (4): sostienen la confianza y la entidad. 🟨
- Futura landing comercial: cuando exista, necesita enlaces desde home, navbar, footer, `/bkf` y `/sillon-bkf`.

## 14. Datos que faltan para GEO
Año de fundación, redes y perfiles, reseñas reales, aclaración showroom sí/no, precio o rango, modelos/colores/medidas estándar, tiempos reales de producción, proyectos publicables, certificaciones. Detalle en "Datos que necesito del cliente".

## 15. Páginas nuevas recomendadas (no creadas)
1. `/comprar-bkf-buenos-aires` (🔥)
2. `/bkf-cuero` (🟥)
3. `/bkf-premium` o integrarlo a `/sillon-bkf` según datos (🟧)
4. Guía "cómo elegir un BKF" (🟧)
5. Cuidado del cuero y del hierro (🟨)
6. Zonas de entrega (🟨)

## 16. Contenido recomendado
Respuestas directas al inicio de cada página comercial; tablas de medidas/colores/materiales con datos reales del cliente; fotos propias con `alt` descriptivo; sección "cómo comprar" con pasos; comparativa honesta fabricante vs importado/copia (sin atacar marcas); fuentes citadas. No inventar cifras.

## 17. Schema recomendado
Hoy: `LocalBusiness/FurnitureStore`, `Brand`, `WebSite`, `WebPage`, `BreadcrumbList`, `Article`, `Product`, `FAQPage`, `ItemList`, `Service`, `ContactPage`, `AboutPage`. `[V]`
Agregar solo con dato real: `sameAs`, `foundingDate`, `priceRange`, `Offer.price` (si se publica precio), `sku/mpn`, `aggregateRating/Review` (únicamente con reseñas reales y visibles), `Product` hijo con `ProductGroup` si hay variantes. Corregir "showroom" según la realidad.

## 18. Conversión recomendada
WhatsApp con producto + color + zona precargados; botón de WhatsApp visible en la landing comercial; evento `generate_lead` en cada clic; pregunta de origen en el primer mensaje; mostrar plazos y garantía cerca del CTA; opción de rango de precio.

## 19. Próximos pasos
Ver plan por fases.

---

## Inventario de rutas
| Ruta | Tipo | Prerender | Indexable |
|---|---|---|---|
| `/` | Home | Sí | Sí |
| `/catalogo/` | Colección | Sí | Sí |
| `/catalogo/asientos/` | Categoría | Sí | Sí |
| `/catalogo/mesas/` | Categoría | Sí | Sí |
| `/sillon-bkf/` | Producto principal | Sí | Sí |
| `/bkf/` | Guía | Sí | Sí |
| `/mobiliario-comercial/` | Servicio | Sí | Sí |
| `/proyectos/` | Prueba social | Sí | Sí |
| `/nosotros/` | Institucional | Sí | Sí |
| `/faq/` | FAQ | Sí | Sí |
| `/contacto/` | Contacto | Sí | Sí |
| `/envios/` | Info | Sí | Sí |
| `/garantia/` | Info | Sí | Sí |
| `/catalogo/banco-bkf/` | Producto | Sí | Sí |
| `/catalogo/base-de-mesa-flat/` | Producto | Sí | Sí |
| `/catalogo/:slug`, `/admin` | Dinámica | No | No (`/admin` bloqueada en robots) |
| `*.html` legacy (9) | Stub `meta refresh` | Sí | No van al sitemap |

## Schema por página `[V]`
Home: org+brand+website+webpage · Catálogo: CollectionPage+ItemList · Asientos/Mesas: +FAQPage · Productos: Product+FAQPage+Breadcrumb · `/bkf`: Article+FAQPage+Breadcrumb · `/faq`: FAQPage · `/mobiliario-comercial`: Service+FAQPage · `/contacto`: ContactPage · `/nosotros`: AboutPage · `/envios`, `/garantia`, `/proyectos`: WebPage+Breadcrumb.

## Productos `[V]`
| Producto | Medidas | Material | Precio | SKU |
|---|---|---|---|---|
| Sillón BKF Premium | 78×70×90 cm | Hierro 12 mm + cuero vacuno al vegetal | Cotización | No |
| Banco BKF | 38×38×45 cm | Hierro 12 mm + cuero | Cotización | No |
| Base de Mesa Flat | Alt. 73/105 cm | Chapa torneada 10 mm | Cotización | No |

## Firebase `[V]`
`firebaseConfig.js` con placeholders; guarda `isFirebaseConfigured`; el SDK no se descarga si no está configurado; `contacto_save_failed` registra el motivo. `firestore.rules` existe. Impacto SEO: ninguno. Impacto comercial: los leads no se persisten, solo llegan por WhatsApp. No se tocó.

## Imágenes `[V]`
AVIF/WebP/JPG en 480–1600 px y variantes sociales 16:9 / 4:3. Primera imagen con `fetchpriority`, resto `lazy`. Legacy sin uso: `bkf1.jpg`, `bkfapoyapies.jpg`, `mesa.jpeg`.

## Competencia
Verificado en repo: nada sobre Proyecto BKF ni BIG BKF. Todo lo demás: `[E]`.
Investigar: posiciones para las 10 keywords; títulos/H1 y estructura de sus páginas comerciales; cantidad de modelos y precios publicados; backlinks y menciones; reseñas y GBP; schema; velocidad (CWV); contenido de "dónde comprar"; presencia en marketplaces; presencia en respuestas de ChatGPT/Perplexity/Gemini para las mismas consultas.

## Entity SEO `[V]`
Nombre: "Taller Kappa" / "Taller Kappa S.R.L." / "Taller Kappa SRL" (declarados como `alternateName`). Dirección y teléfono consistentes. Falta: CUIT (declarado desconocido), redes, año de fundación, email de dominio, perfil verificable.

## Matriz de prioridades
| Prioridad | Problema | Evidencia | Impacto SEO | Impacto GEO | Impacto ventas | Solución propuesta |
|---|---|---|---|---|---|---|
| ~~🔥~~ ❎ | ~~`main` sin fases SEO~~ **Falso positivo** (main local desactualizado; `origin/main` ya incluye la fase 4) | `git rev-parse main origin/main` idénticos tras el pull | — | — | — | Sin acción |
| 🔥 | Sin landing "comprar BKF Buenos Aires" | `routes.js` | Alto | Alto | Alto | Crear landing (Fase B) |
| 🔥 | Sin GBP/Bing Places/Search Console verificables | No visible | Alto | Medio | Alto | Cliente verifica o da acceso |
| 🟥 | Catálogo de 3 productos sin "cuero/premium" | `products.js` | Alto | Medio | Alto | Contenido y páginas (Fase C) |
| 🟥 | "Showroom" inconsistente | `schema.js`, `faq.js`, `Footer.jsx`, llms | Bajo | Alto | Medio | Confirmar y unificar |
| 🟥 | Entidad sin `sameAs` | `schema.js` | Medio | Alto | Medio | Agregar con datos reales |
| 🟥 | Leads de formulario no persisten | `firebaseConfig.js` | Nulo | Nulo | Medio | Configurar Firebase o quitarlo |
| 🟧 | Autoridad interna baja a `/bkf` | Conteo prerender | Medio | Medio | Medio | Enlazado interno |
| 🟧 | Email Gmail personal | `contact.js` | Bajo | Medio | Medio | Email de dominio |
| 🟧 | Canibalización `/bkf` vs `/sillon-bkf` | Contenido | Medio | Bajo | Bajo | Revisar con Search Console |
| 🟨 | Detección Copilot rota | `analytics.js` | Nulo | Nulo | Bajo | Corregir clave |
| 🟨 | Visitas <3 s no medidas | `analytics.js` | Nulo | Nulo | Bajo | Evaluar carga más temprana |
| 🟨 | Keyword-map obsoleto | `docs/seo` | Bajo | Bajo | Bajo | Reescribir |
| 🟨 | lastmod uniforme, imágenes legacy, alt vacío | Sitemap, `public/images` | Bajo | Bajo | Bajo | Limpieza |

## Plan por fases
| Fase | Objetivo | Cambios | Archivos | Prioridad | Dependencia | Impacto |
|---|---|---|---|---|---|---|
| B | Landing comercial (**ver nota B0**: `docs/seo` y `CONTEXTO_PROYECTO.md` decidieron NO crear `/comprar-bkf-buenos-aires` por canibalización con `/sillon-bkf/`) | Decidir con datos de Search Console antes de crear | `routes.js`, nueva página | 🟥 | Datos GSC + cliente | Alto |
| C | Cubrir "BKF de cuero" y "premium" | Páginas/secciones y datos de producto | `products.js`, páginas | 🟥 | Datos del cliente | Alto |
| D | Entidad y Local | `sameAs`, email de dominio, aclarar showroom | `business.js`, `schema.js`, `faq.js`, `Footer.jsx` | 🟥 | GBP y redes | Alto |
| E | Autoridad interna | Enlazado hacia `/bkf`, `/proyectos`, `/nosotros` | Páginas y `Navbar/Footer` | 🟧 | B | Medio |
| F | Conversión | Mensajes WhatsApp ampliados, `generate_lead` | `contact.js`, `analytics.js` | 🟧 | B | Alto |
| G | Medición | Search Console, Bing, fix Copilot | Panel + `analytics.js` | 🟥 | Acceso | Medio |
| H | Contenido guía | Cómo elegir, cuidado, zonas | Nuevas páginas | 🟨 | C | Medio |
| I | Limpieza técnica | Imágenes legacy, alt, lastmod, `sw.js`, 301 Cloudflare | Varios | 🟩 | — | Bajo |

---

## RESUMEN EJECUTIVO

### 10 problemas principales
1. ~~`main` (deploy) no contiene las fases SEO~~: **falso positivo** (ver corrección B0).
2. Sin landing "comprar / dónde comprar BKF Buenos Aires".
3. Sin presencia local verificable (GBP, Bing Places, reseñas).
4. Sin Search Console / Bing Webmaster confirmados.
5. Catálogo de 3 productos; sin "BKF de cuero" ni "premium" como intención.
6. "Showroom" inconsistente con "retiro en el taller".
7. Entidad débil: sin `sameAs`, fundación ni email de dominio.
8. Leads del formulario no persisten (Firebase sin configurar).
9. Autoridad interna baja hacia `/bkf`, `/proyectos`, `/nosotros`.
10. Analítica: Copilot no detectado y visitas <3 s sin medir.

### 10 oportunidades
1. Landing comercial local. 2. Página BKF de cuero. 3. BKF premium. 4. Guía "cómo elegir". 5. Cuidado del cuero. 6. Páginas por zona. 7. Casos de clientes con fotos. 8. `sameAs`/perfiles. 9. Evento `generate_lead`. 10. Rango de precio.

### 5 acciones de mayor impacto comercial
1. ~~Publicar en `main` lo ya hecho~~ (ya está publicado). 2. Definir con datos de GSC si una landing de compra local aporta o canibaliza. 3. Verificar GBP y reseñas. 4. WhatsApp con producto/color/zona. 5. Decidir precio "desde".

### 5 acciones SEO
1. Search Console + Bing. 2. Landing comercial. 3. Páginas cuero/premium. 4. Enlazado interno hacia `/bkf`. 5. Reescribir mapa de keywords.

### 5 acciones GEO
1. Unificar showroom/taller. 2. `sameAs` y entidad. 3. Respuestas directas en landing comercial. 4. Mantener `llms.txt` coherente. 5. Medir qué IA cita el sitio con preguntas reales (manual).

## DATOS QUE NECESITO DEL CLIENTE
- Confirmación en Actions de que el último deploy salió en verde (ya verificado que lo publicado coincide con la fase 4).
- Acceso a Google Search Console, Bing Webmaster, GA4, Google Business Profile, Bing Places.
- ¿Existe showroom abierto al público o solo retiro en taller? Horarios y si requiere turno.
- Dirección y teléfono definitivos; email de dominio.
- Redes sociales y otros perfiles (Instagram, Facebook, MercadoLibre, etc.).
- Año de fundación y CUIT si se quiere publicar.
- Precios o rango "desde"; condiciones de pago.
- Modelos reales: ¿hay BKF de cuero distinto del premium? Colores, cueros, terminaciones y medidas estándar.
- Tiempos de producción y entrega reales.
- Fotos reales de productos, taller y entregas.
- Reseñas reales y autorización para publicarlas.
- Clientes y proyectos autorizados a mostrar.
- Qué consultas de Search Console traen tráfico y cuántas consultas por WhatsApp llegan por mes.
