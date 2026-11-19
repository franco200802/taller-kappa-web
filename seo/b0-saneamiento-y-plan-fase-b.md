# B0 — Saneamiento y plan de Fase B (solo diagnóstico, sin cambios de código)

Tags: `[V]` verificado en repo/HTTP · `[E]` requiere verificación externa · `[C]` requiere confirmación del cliente.

## 1. Estado de ramas
`main` local actualizado con `git pull --ff-only` → `24603a6` = `origin/main`. `[V]`
`origin/main` contiene `feat/seo-fase-4` (PR #7). Lo publicado coincide con la fase 4. `[V]`

## 2. Los tres 404 (`/comprar-bkf-buenos-aires/`, `/bkf-cuero/`, `/bkf-premium/`)
| Pregunta | Resultado `[V]` |
|---|---|
| ¿En el Router (`routes.js`)? | No. Solo existen las rutas estáticas, `/catalogo/:slug` (sin prerender) y fichas sin `path` |
| ¿En el sitemap? | No (15 URLs, generadas desde las rutas prerenderizadas) |
| ¿Archivos prerender? | No. `dist/404.html` es la respuesta de GitHub Pages |
| ¿Enlazadas internamente? | No (grep en `src`: ninguna coincidencia) |
| ¿Mencionadas en documentación? | Sí, **como decisión de NO crearlas**: `CONTEXTO_PROYECTO.md` (líneas ~298 y ~353) y `docs/seo/fase-4-ventas.md` (~85) |
| ¿Contenido parcial preparado? | No. Solo hay respuestas parciales en `/bkf/` y `/faq/` ("¿Dónde comprar un sillón BKF en Buenos Aires?") |
| ¿Por qué el sitemap tiene 15 URLs sin ellas? | Porque nunca se definieron. El sitemap se genera desde las rutas; no hay nada que excluir |

**Hallazgo:** los 404 son consecuencia de una decisión deliberada anti-canibalización ("una intención = una URL", `/sillon-bkf/` disputa "comprar sillón BKF … Buenos Aires"). La auditoría Fase A los trató como brecha; en realidad es una decisión a **reevaluar con datos** (GSC), no un error. Además `docs/seo/fase4-keyword-map.md` (que dice que el destino de "comprar sillón BKF" es `/catalogo/sillon-bkf-premium`) contradice esa decisión posterior: está obsoleto.

## 3. Legacy `.html`
Todos son stubs de 700–740 B con `title`/`description` del destino, `canonical`, `meta refresh` y `location.replace` que conserva query y hash. Sin `noindex`, fuera del sitemap. `[V]`

| URL antigua | Estado actual (online) | Destino recomendado | Motivo |
|---|---|---|---|
| `/catalogo.html` | 200, stub | `/catalogo/` | Misma página, URL canónica con barra |
| `/sillon-bkf.html` | 200, stub | `/sillon-bkf/` | Idem; es la URL con más valor |
| `/nosotros.html` | 200, stub | `/nosotros/` | Idem |
| `/faq.html` | 200, stub | `/faq/` | Idem |
| `/contacto.html` | 200, stub | `/contacto/` | Idem |
| `/proyectos.html` | 200, stub | `/proyectos/` | Idem |
| `/envios.html` | 200, stub | `/envios/` | Idem |
| `/garantia.html` | 200, stub | `/garantia/` | Idem |
| `/catalogo/sillon-bkf-premium/` | 200, stub | `/sillon-bkf/` | Ficha unificada con la landing |
| `/index.html` | 200 (copia del home de la app) `[V]` | `/` | Evitar duplicado del home; **comprobar canonical** `[E]` |

301 reales: GitHub Pages no los permite. El sitio está detrás de **Cloudflare** (`server: cloudflare`), así que sí se pueden con Redirect Rules (guía en `docs/seo/cloudflare-paso-a-paso.md`). Las pruebas HTTP muestran que los `.html` siguen en 200, o sea **las reglas no están activas** `[V]` (salvo que estén en el panel y no apliquen: `[E]`). El plan gratuito permite 10 reglas; hay 9 destinos + `/index.html`.

## 4. Matriz showroom / retiro — REQUIERE CONFIRMACIÓN DEL CLIENTE `[C]`
| Archivo/página | Texto actual | Posible contradicción |
|---|---|---|
| `lib/schema.js:65` | Comentario "fábrica con showroom donde se retira lo pedido y se cotiza directo" | Afirma showroom; el tipo `FurnitureStore` (tienda) lo refuerza |
| `components/Footer.jsx:69` | "**Fábrica & Showroom**" (visible en todas las páginas) | Showroom público |
| `data/faq.js:18` | "…consultar stock y coordinar tu compra por WhatsApp **o visitar el showroom**" (sale en FAQPage y llms.txt) | Showroom vs retiro por pedido |
| `components/Footer.jsx:71`, `Home.jsx:114`, `Contacto.jsx:91`, `Nosotros.jsx:120`, `SillonBKF.jsx:174`, `data/business.js:40` | "Retiro en el taller: lunes a viernes 9 a 18 hs" | Retiro, no visita comercial |
| `Envios.jsx:18` | "Podés retirar tu pedido sin cargo en nuestro taller: Calle 28 Nº 3779" | Retiro de pedido |
| `SillonBKF.jsx:163`, `GuiaBKF.jsx:163`, `Home.jsx:128` | "Retirás el sillón en el taller" | Retiro |
| `SillonBKF.jsx:155`, `faq.js:15/19/24`, `MobiliarioComercial.jsx:28` | "fabrica en su taller de San Martín" | Fábrica/taller |
| `llms.txt` (generado) | "Retiro en el taller…" y "visitar el showroom" | Ambas, en el mismo archivo |
Preguntas al cliente: ¿se puede visitar sin pedido? ¿hay productos exhibidos? ¿hace falta turno? ¿mismo horario?

## 5. Dependencias externas `[E]` / `[C]`
| Servicio | Qué verificar |
|---|---|
| Google Search Console | Propiedad verificada (dominio o prefijo); sitemap enviado y leído (15 URLs); indexadas vs excluidas; consultas y posiciones de las 10 keywords; páginas `/sillon-bkf/` vs `/bkf/` en las mismas consultas; si Google indexó los `.html` o `/index.html`; cobertura "Página alternativa con etiqueta canónica" |
| Google Business Profile | Existe/verificado; URL exacta; categoría; dirección real; tipo de negocio (¿oculta dirección?); horarios; reseñas (cantidad y promedio); enlace web a `/`; fotos; mensajes/llamadas |
| Bing Webmaster Tools / Bing Places | Sitio verificado, sitemap, perfil local |
| GA4 (`G-2FDMN51XDY`) | Recibe datos; eventos `whatsapp_click`, `select_item`, `ai_referral`, `contacto_save_failed`; marcar conversión; ratio de consultas por canal |
| Cloudflare | Redirect Rules (9–10) activas o no; reglas de bots de IA (el doc mencionaba GPTBot 403); caché de assets 4 h; SSL/HTTPS forzado (el 1/10 `http://` daba 200 sin redirigir); ofuscación de emails |
| GitHub Actions | Último run de `deploy.yml` en verde; Pages con origen "GitHub Actions"; el workflow solo corre si cambia `react-app/**` o el propio workflow, así que un commit solo de `docs/` o `seo/` no despliega |

## 6. Propuesta de Fase B (sin implementar)
Aclaración: B3–B5 están **en conflicto con la decisión documentada** de no crear esas URLs. Se proponen como "decidir con datos primero".

| Etapa | Objetivo | Archivos | Falta | Prioridad | Dependencia | Riesgo | Impacto SEO | Impacto ventas |
|---|---|---|---|---|---|---|---|---|
| **B6 — Local SEO** | GBP verificado y coherente con el sitio | `business.js`, `schema.js` (sin tocar GBP desde el repo) | URL del GBP, reseñas, dirección real, showroom sí/no | 🔥 | Cliente | Bajo | Alto (local pack) | Alto |
| **B9 — Measurement** | Saber qué consultas y canales traen WhatsApp | `analytics.js` (clave `www.bing.com/chat`), panel GA4/GSC | Accesos | 🔥 | Accesos | Bajo | Habilita todo | Alto |
| **B2 — URL/redirect cleanup** | 301 reales de los `.html` y `/index.html` | Cloudflare; `LEGACY_PAGES` queda de respaldo | Acceso a Cloudflare | 🟥 | Cloudflare | Medio (reglas mal escritas rompen URLs) | Medio-Alto | Medio |
| **B1 — Technical SEO** | Limpiar imágenes legacy, `alt` vacío, lastmod, keyword map | `public/images`, `Nosotros.jsx`, `docs/seo/fase4-keyword-map.md` | Nada | 🟨 | — | Bajo | Bajo | Bajo |
| **B7 — Entity/GEO** | Unificar showroom/taller; `sameAs`, `foundingDate`, email de dominio solo con datos reales | `schema.js`, `faq.js`, `Footer.jsx`, `business.js` | Redes, año, showroom, email | 🟥 | Cliente | Bajo | Medio | Medio |
| **B8 — CRO/WhatsApp** | Mensaje con color/zona; evento de lead | `contact.js`, `analytics.js`, páginas de producto | Variantes reales, colores | 🟧 | B9 | Bajo | Nulo | Medio-Alto |
| **B3 — Landing "Comprar BKF Buenos Aires"** | Decidir si hace falta | `routes.js`, nueva página, `prerender` | Datos GSC: ¿hay consultas "comprar/dónde" sin cubrir? | 🟧 | B9 + decisión del dueño | **Alto: canibalizar `/sillon-bkf/`** | Incierto | Incierto |
| **B4 — BKF cuero** | Cubrir "BKF de cuero" | `/sillon-bkf/`, `/bkf/` (sección) o página nueva | Si hay productos de cuero distintos | 🟧 | B3, cliente | Alto (duplicado) | Incierto | Medio |
| **B5 — BKF Premium** | Idem para "premium" | idem | Qué diferencia un "Premium" de otro modelo | 🟨 | B3, B4 | Alto | Incierto | Bajo-Medio |

Orden sugerido: B9 → B6 → B2 → B7 → B8 → B1 → decisión B3/B4/B5. No agregar keywords artificiales ni `sameAs`/`foundingDate` sin datos verificados.
