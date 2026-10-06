# B9 — Datos reales SEO, indexación, GA4 y criterios de decisión# B9 — Medición y datos: qué medir y con qué criterio decidir



Fecha: 2026-10-06 · Base: `main` @ `15ae277` (B6.1-B/C ya desplegado en producción).> Solo preparación. No hay datos de Search Console, GA4, GBP ni Cloudflare en este documento: ninguno es accesible desde el repositorio.

Alcance: **solo auditoría**. No se tocó código, URLs, titles, metas, schema, canonical ni sitemap.> Tags: `[V]` verificado en repo · `[E]` requiere datos externos · `[C]` requiere al cliente.

> Pregunta a resolver: ¿`/sillon-bkf/` sigue siendo la landing comercial principal, o conviene crear `/comprar-bkf-buenos-aires/`, `/bkf-cuero/` y/o `/bkf-premium/`?

> **Regla de este documento:** no hay datos inventados. Lo que no se pudo verificar desde el entorno figura como> Contexto: hoy esas tres URLs no existen **por decisión documentada** (anti-canibalización; `CONTEXTO_PROYECTO.md`, `docs/seo/fase-4-ventas.md`). Este documento define con qué evidencia se revisaría esa decisión.

> `NO DISPONIBLE` / `PENDIENTE DE VERIFICACIÓN`. Las observaciones de buscadores (sección 0.3) son **capturas puntuales

> de Bing y DuckDuckGo desde el servidor del entorno**, no son Google ni Search Console y **no sustituyen a GSC**.## 0. Qué existe hoy en el repositorio

| Tema | Estado `[V]` |

---|---|---|

| Integración con Search Console | **No hay** en código. Sin meta `google-site-verification` ni `msvalidate` en `index.html`, `src` o `public`. Verificación posible por DNS/otro medio: `[E]` |

## 0. Fuentes y límites| Documentación | Hay checklists: `docs/seo/seo-google-fase-3.md` §7 (Search Console) y §6b (Perfil de Empresa); `docs/seo/recuperacion-seo.md` §5; `docs/seo/cloudflare-paso-a-paso.md` |

| Estado declarado | `CONTEXTO_PROYECTO.md` (§ "Pendiente — Search Console / Google Business Profile") y `fase-4-ventas.md` los marcan **pendientes (dueño)** |

### 0.1 Qué se pudo verificar| GA4 | ID `G-2FDMN51XDY`, carga diferida (primera interacción o 3 s) |

- Repositorio (código, workflow, docs).

- Producción por `curl` (status, headers, canonical, robots, sitemap, llms.txt).## 1. Google Search Console `[E]`

- Búsquedas manuales en Bing y DuckDuckGo (observación puntual, ubicación y fecha del entorno).Acceso necesario: propiedad de **dominio** (`tallerkappa.com.ar`) o, como mínimo, prefijo `https://tallerkappa.com.ar/`. Si no existe, crearla y esperar la acumulación de datos; solo se ven los últimos 16 meses y desde la verificación.



### 0.2 Qué NO se pudo verificar### 1.1 Exportaciones (Rendimiento → Resultados de búsqueda, Búsqueda web)

Search Console, panel de GA4, Google Business Profile, Bing Webmaster Tools / Bing Places (administración), panel de Cloudflare, búsquedas en Google.Hacer cada exportación para **3 meses** y **6 meses**, con dimensiones y métricas: `QUERY`, `PAGE`, `CLICKS`, `IMPRESSIONS`, `CTR`, `POSITION`. Usar también el cruce Consulta × Página (filtrar por consulta y mirar la pestaña "Páginas").



### 0.3 Observaciones de buscadores (no-GSC, 2026-10-06)Pestañas a exportar: Consultas, Páginas, Países (Argentina) y Dispositivos. Comparar el período anterior para ver la tendencia, **sobre todo desde el 14/9/2026** (migración) y el 1/10/2026 (recuperación): ver `recuperacion-seo.md`.



| Búsqueda | Buscador | Observación verificable |### 1.2 Consultas a filtrar (regex "contiene", sin acentos y con acentos)

|---|---|---|| Grupo | Consultas |

| `"Taller Kappa" BKF Buenos Aires` | Bing | Ficha local "Taller Kappa", categoría "Fabricación y suministros para negocios", Calle 28 – Vélez Sarsfield 3779, Villa Lynch, **teléfono 011 4753-0099** (distinto al del sitio). Después orgánicos: `/` (título "Fábrica de Sillón BKF y Muebles de Hierro \| Taller…"), `/catalogo/`, **`/catalogo.html`**, **`/contacto.html`**, **`/nosotros.html`**, y terceros (OFIX ×2, todosnegocios ×2, guiademantenimiento). ||---|---|

| `"Taller Kappa" BKF Buenos Aires` | DuckDuckGo | `http://tallerkappa.com.ar/` (http, no https) con título viejo "Sillón BKF Buenos Aires \| Sillas de Hierro y Cuero \| Taller Kappa…" y snippet viejo ("Envíos a Capital Federal, Devoto, Zona Norte…"); `/catalogo/`; OFIX, cbinsights, todosnegocios, guiaindustrial, indicadores.ar, argentino.com.ar. || Genéricas | `bkf`, `sillon bkf`, `bkf argentina`, `bkf buenos aires`, `sillon bkf buenos aires` |

| `comprar BKF Buenos Aires` | Bing | Mapa/local: Proyecto BKF, BIG BKF, BKF butterfly. Orgánicos: proyectobkf.com.ar, bigbkf.com, cuerobuenosaires.com, fullconfort, bkfglobal, Mercado Libre; **tallerkappa.com.ar (home) aparece después de esos** y no aparece en el pack local. || Compra | `comprar bkf`, `comprar bkf buenos aires`, `donde comprar bkf`, `precio sillon bkf` |

| `fabricante BKF Buenos Aires` | Bing | **Taller Kappa sí aparece en el pack local** (tras Proyecto BKF). Orgánico: proyectobkf, bigbkf, fullconfort, luego `tallerkappa.com.ar/` y `/catalogo.html`. || Cuero | `bkf cuero`, `sillon bkf cuero`, `bkf de cuero buenos aires` |

| `BKF cuero Buenos Aires` | Bing | Dominan Proyecto BKF (`/bkf-cuero/`, `/productos/bkfcueronegro/`), Big BKF, cuerobuenosaires, Mercado Libre, Instagram. Taller Kappa **solo aparece en imágenes** (`/images/bkfapoyapies.png`); sin resultado web propio visible. || Premium | `bkf premium`, `sillon bkf premium` |

| Fabricante | `fabricante bkf`, `fabrica bkf`, `fabrica sillon bkf` |

**Lectura (sin extrapolar a Google):**| Marca | `taller kappa`, `taller kappa bkf`, `taller kappa san martin` |

1. Bing todavía muestra URLs `.html` legacy y DuckDuckGo la versión `http://`: consistente con la ausencia de 301 reales (ver E).| Competencia | `proyecto bkf`, `big bkf` (para ver cuánta demanda de marca hay y si el sitio aparece) |

2. **Inconsistencia de teléfono (NAP):** el sitio usa 11 6124-2498; Bing/directorios muestran 011 4753-0099 y 011 4755-6250 (esta última con otra dirección, "L S Martin 7901"). Origen desconocido. **PENDIENTE: el propietario debe confirmar cuáles números le pertenecen.**

3. En "BKF cuero" Taller Kappa no compite en web; coherente con que no hay página dedicada (BKF de cuero = BKF Premium), pero un dato de Bing no basta para decidir (ver H).Regex sugerido en GSC (consulta que coincide con regex): `bkf|butterfly|silla mariposa|silla paleta`.

4. Existe ficha de Taller Kappa en Bing (categoría "Fabricación y suministros para negocios"). Quién la administra: desconocido.

5. cbinsights indica "fundada en 1996": dato de tercero **no verificado**, no usar en el sitio.### 1.3 Cortes obligatorios

1. **Páginas con más impresiones** y **con más clics** (top 20).

---2. **Páginas con más consultas BKF** distintas (indicador de cuánto temario cubre cada URL).

3. **Consultas en posición 4–30** (oportunidad de mover con contenido/enlaces).

## A. Estado de accesos4. **Impresiones altas y CTR bajo** (title/description o intención desalineada). Referencia de CTR esperado: ver el propio histórico del sitio; no usar cifras ajenas como verdad.

5. **Páginas que compiten entre sí**: consultas donde aparecen ≥2 URLs del sitio en el tiempo (ver 1.4).

| Plataforma | ¿Disponible? | Datos reales obtenidos | Acción necesaria |6. Consultas donde Google muestra **`/bkf/`, `/`, `/catalogo/` o `/contacto/`** en lugar de `/sillon-bkf/`.

|---|---|---|---|

| Google Search Console | **No** (sin acceso; sin tag/archivo de verificación en el repo; `CONTEXTO_PROYECTO.md` la lista como "Pendiente") | Ninguno. `GSC NO DISPONIBLE DESDE EL ENTORNO ACTUAL` | Verificar propiedad (preferible **Dominio** por DNS en Cloudflare), enviar `sitemap.xml`, exportar datos (ver B) |### 1.4 Cómo detectar canibalización con la exportación

| GA4 (`G-2FDMN51XDY`) | **Solo código** (la propiedad tiene histórico del sitio estático anterior, según el propietario). Sin acceso al panel | Ninguno de tráfico. Se auditó la implementación (F) | Dar acceso de lectura o exportar los informes de F.4 |Para cada consulta del 1.2: filtrar Consulta → pestaña Páginas → anotar URL y posición. Hay canibalización probable si dos URLs reciben impresiones **relevantes** de la misma consulta y alternan en la posición. Ver también "Posición por fecha" por página.

| Google Business Profile | **No** (sin evidencia en repo/docs; no se puede confirmar si existe ni quién la gestiona) | Ninguno | Buscar/reclamar la ficha; ver datos abajo |

| Bing Webmaster Tools / Bing Places | **No** (sin `msvalidate` ni archivo en el repo) | Solo observación pública: ficha local en Bing con teléfono 011 4753-0099 | Verificar sitio (import desde GSC) y reclamar/corregir la ficha |### 1.5 Indexación (Páginas / Indexación)

| Cloudflare | **Parcial**: proxy activo (`server: cloudflare`); sin panel | Headers: `cache-control: max-age=600`, `cf-cache-status: DYNAMIC`; `www`→apex 301; **http no redirige a https** (200); **sin 301** para legacy | Revisar *Always Use HTTPS*, reglas de redirección (`docs/seo/cloudflare-paso-a-paso.md`), DNS |Registrar para las 15 URLs del sitemap: indexada, excluida y motivo. Revisar especialmente:

| GitHub Pages / Actions | **Sí (repo)** | Deploy en push a `main` con cambios en `react-app/**`; Node 20; `fetch-depth: 0`; `npm ci && npm run build`; copia `CNAME` y `.nojekyll`; artifact desde `react-app/dist` | Ninguna; commits solo de `seo/`/`docs/` no despliegan || URL | Qué mirar |

|---|---|

### GBP — datos del sitio que deben coincidir exactamente (fuente: `business.js`)| `/sillon-bkf/` | Indexada; canonical elegido por Google = declarado; última lectura |

Nombre Taller Kappa (razón social Taller Kappa S.R.L.) · Calle 28 (Vélez Sarsfield) 3779, Villa Lynch, San Martín, Buenos Aires, CP 1650 · Tel 11 6124-2498 · Horario lun–vie 9–18 · Web `https://tallerkappa.com.ar/` · Showroom con turno previo · Retiro con coordinación previa · Mapa `https://maps.app.goo.gl/96acmiHnvF2ZA4KM7`.| `/bkf/` | Idem; ¿se la muestra para consultas comerciales? |

Faltan (no inventar): categoría principal elegida por el propietario, fotos **reales** del local/producto (las del sitio están marcadas como generadas), descripción, productos, reseñas reales (hoy no hay publicadas).| `/contacto/` | Idem; ¿recibe impresiones de consultas comerciales? |

| `/catalogo/`, `/catalogo/asientos/`, fichas | Idem |

---| `*.html` legacy (9) y `/index.html` | Si siguen indexadas, "Página alternativa con etiqueta canónica adecuada", "Duplicada: Google eligió otra" |

| `/catalogo/sillon-bkf-premium/` | Idem |

## B. Queries principales| Sitemap | Estado "Correcto", 15 URLs descubiertas, fecha de última lectura |



`GSC NO DISPONIBLE DESDE EL ENTORNO ACTUAL`Categorías de exclusión a contar: *Rastreada, actualmente sin indexar*; *Descubierta, actualmente sin indexar*; *Duplicada sin canonical elegido por el usuario*; *Duplicada: Google eligió otra*; *Página con redirección*; *No encontrada (404)*. Inspeccionar con "Inspección de URLs" el canonical **declarado** vs **elegido por Google**.



| Query | Clicks | Impressions | CTR | Position | Landing | Intención |### 1.6 Experiencia y otros

|---|---|---|---|---|---|---|Core Web Vitals (móvil/escritorio, datos de campo; hoy no hay CrUX según `seo-google-fase-3.md`), acciones manuales, problemas de seguridad, mejoras (FAQ, productos, ruta de navegación): ¿Google reconoce los datos estructurados? (`[E]`)

| — sin datos — | — | — | — | — | — | — |

### 1.7 Matriz de canibalización (conceptual, a completar con GSC)

**Exportaciones manuales necesarias** (Rendimiento → Resultados de búsqueda → Búsqueda web; **últimos 3 meses** y **últimos 6 meses**; comparar contra el período previo; exportar Consultas, Páginas y Consulta+Página):Se completa **solo** con datos reales. Dejar vacío lo que no se pueda medir.

- Columnas: query, clicks, impressions, CTR, position, landing page.

- Filtro regex en consulta:| Query | URL que Google muestra | Impresiones | Posición | URL esperada | ¿Canibalización? |

  `bkf|sill[oó]n bkf|comprar bkf|bkf comprar|bkf buenos aires|comprar bkf buenos aires|bkf cuero|bkf de cuero|bkf premium|fabricante bkf|f[aá]brica bkf|d[oó]nde comprar bkf|donde comprar bkf|bkf argentina`|---|---|---:|---:|---|---|

- Además: consultas con `kappa` (marca), `hierro`, `base(s)? de mesa`, `banco bkf`, `mobiliario (comercial|gastron)`, `mesa(s)? de hierro`.| comprar bkf buenos aires | `[E]` | `[E]` | `[E]` | `/sillon-bkf/` | `[E]` |

- Por separado: Páginas (landing → clicks/impresiones), Países y Dispositivos.| comprar bkf | `[E]` | `[E]` | `[E]` | `/sillon-bkf/` | `[E]` |

- Cobertura: Páginas → "Por qué las páginas no están indexadas" (CSV), Sitemaps, Inspección de URL de las 15 URLs del sitemap + `/catalogo.html` + `/index.html` + `/catalogo/sillon-bkf-premium/`.| donde comprar bkf | `[E]` | `[E]` | `[E]` | `/sillon-bkf/` o `/bkf/` (hay H2 y FAQ "Dónde comprar…") | `[E]` |

| sillon bkf buenos aires | `[E]` | `[E]` | `[E]` | `/sillon-bkf/` | `[E]` |

**Clasificación de intención a aplicar al export:**| bkf buenos aires | `[E]` | `[E]` | `[E]` | `/` o `/bkf/` | `[E]` |

| bkf cuero | `[E]` | `[E]` | `[E]` | `/sillon-bkf/` (el material es cuero) | `[E]` |

| Intención | Patrón || bkf premium | `[E]` | `[E]` | `[E]` | `/sillon-bkf/` (producto "Sillón BKF Premium") | `[E]` |

|---|---|| fabricante bkf | `[E]` | `[E]` | `[E]` | `/nosotros/` o `/sillon-bkf/` | `[E]` |

| Marca | contiene `kappa` || bkf argentina | `[E]` | `[E]` | `[E]` | `/bkf/` | `[E]` |

| Comercial alta | comprar, precio, fábrica/fabricante, dónde comprar, mayorista, a medida || sillon bkf precio | `[E]` | `[E]` | `[E]` | `/sillon-bkf/` / `/faq/` | `[E]` |

| Comercial media | `sillón bkf`, `bkf cuero`, `bkf premium`, `banco bkf`, `base de mesa` |

| Informativa | qué es, historia, origen, medidas, cómo |**Pregunta principal:** ¿Google ya considera `/sillon-bkf/` la página relevante para "comprar BKF Buenos Aires"? → **sin respuesta hasta tener la exportación `[E]`**.

| Local | + `buenos aires`, `san martín`, `villa lynch`, `zona norte` |

## 2. GA4 `[E]` para los datos · `[V]` para lo implementado

---### 2.1 Eventos implementados hoy (`lib/analytics.js` y componentes)

| Evento | Cuándo | Parámetros | ¿Conversión? |

## C. URLs que Google usa para posicionar|---|---|---|---|

| `page_view` | Cada cambio de ruta (envío manual; `send_page_view:false`) | `page_path`, `page_location` | No |

`GSC NO DISPONIBLE DESDE EL ENTORNO ACTUAL` — no se puede saber qué URL elige Google por query.| `whatsapp_click` | Clic en cualquier enlace `wa.me` (listener único) | `location`, `page_path`, `item_name` | **Debe marcarse como evento clave en GA4 (no se puede ver desde el código)** `[E]` |

| `email_click` | Clic en `mailto:` | `location`, `page_path` | No |

Dato estructural: el sitemap declara 15 URLs; la landing comercial prevista es `/sillon-bkf/`; `/` y `/bkf/` también contienen términos BKF. Observación no-GSC: Bing muestra la **home** (no `/sillon-bkf/`) para "comprar/fabricante BKF Buenos Aires".| `select_item` | Clic hacia la página de un producto | `item_name`, `location`, `page_path` | No |

| `ai_referral` | Visita desde ChatGPT, Perplexity, Gemini, Copilot o Claude | `ai_source`, `landing_page` | No |

Export necesario: Páginas con clicks/impresiones y cruce Consulta × Página.| `add_to_cart` | Agregar al presupuesto | `item_name`, `color`, `page_path` | No |

| `whatsapp_checkout` | Enviar el presupuesto | `items`, `qty` | Posible |

---| `contacto_save_failed` | Falla al guardar el formulario | `location`, `reason` | No |

| `404_not_found` | Se llegó a la página 404 | `path` | No |

## D. Canibalización

Valores de `location` en `whatsapp_click` (de `data-cta` y zonas): `float_button`, `home_hero`, `sillon-bkf_actions`, `sillon-bkf_cta_final`, `ficha_actions`, `ficha_cta_final`, `catalogo_card`, `presupuesto`, `contacto_form`, `menu`, `footer`, `modal`, `cta_final`, `contenido`.

Sin GSC no se puede confirmar. Solo **riesgo estructural** (contenido del repo, sin posiciones):

### 2.2 Limitaciones `[V]`

| Query | URL 1 | URL 2 | URL principal esperada | Riesgo |- Visitas que se van en <3 s sin interacción **no envían** `page_view`: las sesiones están subcontadas.

|---|---|---|---|---|- La clave `www.bing.com/chat` de `ai_referral` es una ruta, no un hostname: probablemente no detecta Copilot desde bing.com.

| sillón bkf / bkf buenos aires | `/` | `/sillon-bkf/` | `/sillon-bkf/` | **Posible** (la home incluye BKF en title/hero; Bing hoy muestra la home) |- Los AI Overviews de Google no se distinguen del tráfico orgánico.

| bkf (qué es / historia) | `/bkf/` | `/sillon-bkf/` | `/bkf/` (informativa) | Posible bajo |- GA4 **no ve la consulta de búsqueda**; eso solo lo da Search Console.

| comprar bkf | `/sillon-bkf/` | `/catalogo/` | `/sillon-bkf/` | Posible bajo |- El evento `generate_lead`/conversión no existe en el código: hay que crear el evento clave en el panel.

| sillón bkf premium | `/sillon-bkf/` | `/catalogo/sillon-bkf-premium/` (stub 200, canonical a `/sillon-bkf/`) | `/sillon-bkf/` | Sin problema técnico (canonical correcto); URL vieja aún accesible |

| cualquier query: URL vieja vs nueva | `.html` / `http://` | URL nueva | URL nueva | **Confirmado en Bing/DDG** (muestran `.html` y `http://`); impacto en Google: sin dato |### 2.3 Datos a extraer (últimos 3 y 6 meses)

| Informe | Dimensiones | Métricas |

Método con GSC: exportar Consulta+Página; por cada query BKF con ≥2 URLs con impresiones, "confirmado" si alternan posiciones o ambas están en top 30; "posible" si solo una recibe clicks; "sin problema" si una concentra >90 %.|---|---|---|

| Adquisición de tráfico | Fuente/medio, canal | Usuarios, sesiones, sesiones con interacción |

---| Páginas de destino | Página de destino × Fuente/medio | Sesiones, `whatsapp_click`, tasa de conversión |

| **Embudo clave** | `google / organic` → `/sillon-bkf/` → `whatsapp_click` | Sesiones, clics, tasa |

## E. Indexación (producción por curl, 2026-10-06)| Eventos | `whatsapp_click` por `location`, `page_path`, `item_name` | Recuento |

| Páginas que generan más contactos | Página de destino | `whatsapp_click` / sesiones |

| Elemento | Estado || IA | `ai_referral` por `ai_source` y `landing_page` | Recuento |

|---|---|| 404 | `404_not_found` por `path` | Recuento (URLs viejas con tráfico) |

| Sitemap | `/sitemap.xml` → 200, **15 URLs**: `/`, `/catalogo/`, `/catalogo/asientos/`, `/catalogo/mesas/`, `/sillon-bkf/`, `/bkf/`, `/mobiliario-comercial/`, `/proyectos/`, `/nosotros/`, `/faq/`, `/contacto/`, `/envios/`, `/garantia/`, `/catalogo/banco-bkf/`, `/catalogo/base-de-mesa-flat/` || Dispositivo | Móvil/escritorio | Conversión |

| robots.txt | `User-agent: *`, `Disallow: /admin`, línea `Sitemap:` correcta |

| Canonical / robots meta | `/`, `/sillon-bkf/`, `/bkf/`: canonical autorreferente con barra final; `index, follow, max-image-preview:large…`. `/404.html`: `noindex` |Comprobar además: que los eventos lleguen (DebugView), que `whatsapp_click` esté marcado como evento clave, que GA4 esté **vinculado a Search Console** (Administrar → Vinculación de Search Console) y la retención de datos.

| 404 real | URL inexistente → 404 |Pregunta comercial: ¿cuántos de los `whatsapp_click` terminan en venta? **No se puede medir desde el sitio**; requiere preguntar el origen al cliente en cada consulta `[C]`.

| Legacy `.html` | `/catalogo.html` (y los otros 8 + `/index.html`): **200** con meta-refresh + canonical a la URL nueva + `location.replace`. **No son 301** |

| `/catalogo/sillon-bkf-premium/` | 200 stub con canonical y refresh a `/sillon-bkf/` |## 3. Google Business Profile `[C]` / `[E]`

| `www` → apex | 301 ✔ |No se asume que exista ni que esté verificado.

| `http://` → `https://` | **No redirige** (`http://tallerkappa.com.ar/sillon-bkf/` devuelve 200). DuckDuckGo tiene indexada la versión `http://`. Revisar *Always Use HTTPS* en Cloudflare / "Enforce HTTPS" en Pages |

| URLs candidatas | `/comprar-bkf-buenos-aires/`, `/bkf-cuero/`, `/bkf-premium/` → **404** (no existen, por decisión) || Dato | Qué registrar |

| Cambios de esquema de URL | 3 en ~15 días (`.html` → sin barra → con barra), según `CONTEXTO_PROYECTO.md §5e`; causa probable de pérdida de posiciones ||---|---|

| Indexación en Google | `NO DISPONIBLE` (requiere GSC → Páginas / Inspección de URL) || ¿Existe y está verificado? | Sí/No, estado de verificación |

| `site:` en Google | No ejecutado (Google no se pudo consultar de forma fiable) || URL del perfil | Enlace "g.page" o de Maps |

| Nombre exacto | Debe coincidir con "Taller Kappa" (o "Taller Kappa S.R.L.") del sitio; sin palabras clave añadidas |

---| Categoría principal / secundarias | Registrar tal cual |

| Dirección | Calle 28 Nº 3779, Villa Chacabuco, San Martín, o "oculta"/área de servicio |

## F. GA4| Teléfono | Debe ser +54 11 6124-2498 (el del sitio) |

| Web | `https://tallerkappa.com.ar/` (¿con UTM?) |

### F.1 Implementación (`react-app/src/lib/analytics.js`)| Horarios | Lun–vie 9–18 (sitio) vs perfil |

- ID `G-2FDMN51XDY`, solo en producción; `send_page_view:false`; `page_view` manual por ruta (`page_path`, `page_location`).| Descripción | Texto actual |

- `gtag.js` se carga en la primera interacción (pointerdown/keydown/scroll/touchstart) o 3 s después de `load`. **Limitación:** visitas que salen antes de 3 s sin interactuar no envían `page_view` (subconteo).| Fotos | Cantidad, fecha, quién las subió |

| Productos / Servicios | Cargados o no |

### F.2 Eventos| Reseñas | Cantidad, valoración promedio, **fecha de la última**, ¿respondidas? |

| Rendimiento (3 y 6 meses) | Búsquedas, vistas, llamadas, mensajes, clics a la web, consultas de ruta |

| Evento | Parámetros | Dónde se dispara || Consultas de búsqueda del perfil | Lista de términos |

|---|---|---|| Showroom / retiro | Coherencia con lo que diga el cliente (ver B0 §4) |

| `page_view` | page_path, page_location | `Layout.jsx`, en cada navegación |Bing Places: ídem (existencia, verificación, NAP).

| `whatsapp_click` | location, page_path, item_name | Listener global para links `https://wa.me/`; `location` = `data-cta` más cercano o zona (footer/menu/modal/cta_final/contenido) |

| `whatsapp_click` (form) | location=`contacto_form`, interest | `Contacto.jsx` |## 4. Cloudflare `[E]`

| `whatsapp_checkout` | items, qty | `CartDrawer.jsx` |Acceso necesario: panel del dominio. Verificar y anotar:

| `add_to_cart` | item_name, color, page_path | `CartContext.jsx` || Área | Qué comprobar |

| `select_item` | item_name, location, page_path | Link interno a página de producto ||---|---|

| `email_click` | location, page_path | Link `mailto:` || DNS | Registros A/AAAA/CNAME hacia GitHub Pages; `www`; proxy (nube naranja) activo; registros TXT de verificación (Google, Bing) |

| `contacto_save_failed` | — | `Contacto.jsx` (fallo de guardado Firestore) || SSL/TLS | Modo (Full/Full strict), "Always Use HTTPS" (el 1/10 `http://` daba 200 sin redirigir), HSTS |

| `404_not_found` | path | `NotFound.jsx` || Redirect Rules | ¿Existen? Hoy los `.html` dan 200 (stub), por lo que probablemente **no hay reglas activas** `[V]` |

| `ai_referral` | ai_source, landing_page | Referrer/`utm_source` ∈ chatgpt.com, chat.openai.com, perplexity.ai, www.perplexity.ai, gemini.google.com, copilot.microsoft.com, claude.ai; una vez por carga || Caché | Reglas de Cache; `max-age` de `/assets/*` (4 h el 1/10); Purge tras cada deploy; "Browser Cache TTL" |

| Bots / IA | Reglas de WAF/Bot Fight Mode/"Block AI bots" (GPTBot dio 403 el 1/10, OAI-SearchBot 200): ¿bloquea rastreadores de IA o de Google/Bing? |

**Brechas verificadas en código:**| Otros | Email Obfuscation (`data-cfemail` en `/contacto/`), Rocket Loader/Auto Minify (pueden alterar el HTML hidratado), Pages/Workers (¿existen o intervienen?) |

1. El link `tel:` de Contacto (B6.1-B) **no se mide** (el listener solo captura `wa.me` y `mailto:`).| Canonical | Cloudflare no lo cambia; verificar con `curl` que el HTML servido mantiene el canonical declarado |

2. `ai_referral`: la clave `'www.bing.com/chat'` incluye path y **nunca coincide** con un hostname. Google AI Overviews / AI Mode llegan como orgánico y no se detectan. El evento solo indica que la visita llegó con ese referrer/utm; **no prueba** que una IA "recomendó" a Taller Kappa.

3. No hay evento de clic en mapa ni de envío exitoso de formulario (solo falla).**Pregunta clave:** ¿se pueden crear 301 reales para estos destinos? Plan gratuito = 10 reglas de redirección. Necesarios: 8 `.html` + `/catalogo/sillon-bkf-premium/` = **9**, más `/index.html` = **10** (justo en el límite). `[E]` confirmar el plan y el cupo, y que la regla exacta (sin comodín `*.html`) no rompa `/index.html`.



### F.3 Estado de conversión| Origen | Destino 301 |

- `whatsapp_click` figura en código como "LA conversión del sitio", pero **si está marcado como Evento clave en GA4: PENDIENTE DE VERIFICACIÓN EN GA4** (Admin → Eventos → "Marcar como evento clave").|---|---|

- Datos de tráfico: `NO DISPONIBLES`.| `/catalogo.html` | `/catalogo/` |

| `/sillon-bkf.html` | `/sillon-bkf/` |

### F.4 Consultas manuales a hacer en GA4| `/nosotros.html` | `/nosotros/` |

1. Adquisición de tráfico: sesiones por Organic Search / Direct / Referral / Organic Social / Unassigned (6 meses; comparar antes/después de la migración React).| `/faq.html` | `/faq/` |

2. Páginas y pantallas: `/sillon-bkf/`, `/`, `/catalogo/`, `/contacto/` y las `.html` legacy.| `/contacto.html` | `/contacto/` |

3. Exploración de embudo: Organic Search → landing `/sillon-bkf/` → `select_item`/`add_to_cart` → `whatsapp_click`/`whatsapp_checkout`.| `/proyectos.html` | `/proyectos/` |

4. Eventos: conteo y usuarios de `whatsapp_click` (por `location`, `item_name`, `page_path`), `whatsapp_checkout`, `select_item`, `ai_referral` (por `ai_source`), `404_not_found` (por `path`: revela URLs viejas que reciben tráfico).| `/envios.html` | `/envios/` |

5. Referencias: sesiones desde `chatgpt.com`, `perplexity.ai`, `gemini.google.com`, `copilot.microsoft.com`, `claude.ai`.| `/garantia.html` | `/garantia/` |

| `/catalogo/sillon-bkf-premium/` | `/sillon-bkf/` |

---| `/index.html` (opcional) | `/` |



## G. Oportunidades## 5. GitHub Actions `[E]`

| Qué verificar | Dónde |

Sin GSC no se pueden armar los buckets por posición. **Plantilla a completar con el export:**|---|---|

| Último run de `Deploy React App to GitHub Pages` | Pestaña Actions: estado, commit, fecha, duración |

| Bucket | Criterio | Contenido || Workflow | `.github/workflows/deploy.yml` `[V]`: dispara con push a `main` si cambia `react-app/**` o el workflow; `workflow_dispatch` manual |

|---|---|---|| Rama | `main`; confirmar que ningún otro workflow publica |

| A | Posición 4–10, muchas impresiones, CTR bajo | `SIN DATOS` → candidatos a mejora de title/description || Build | Logs de `npm ci` y `npm run build` (3 pasos: client, SSR, prerender); resumen "15 rutas + 404 · sitemap 15 URLs · 9 redirecciones" |

| B | Posición 11–20 | `SIN DATOS` → reforzar contenido/enlazado interno || Errores | Warnings/avisos; fallos de `fetch-depth: 0` (afectan `lastmod`) |

| C | Posición 21–30 | `SIN DATOS` → evaluar contenido faltante || Pages | Settings → Pages: origen "GitHub Actions", dominio `tallerkappa.com.ar`, "Enforce HTTPS", check de DNS |

| D | Pocas impresiones, intención comercial alta | `SIN DATOS` → nichos (mayorista, a medida) || Deployment | Entorno `github-pages`: URL y fecha del último despliegue; comparar con `last-modified` del HTML publicado (5/10/2026 17:12 GMT visto vía Cloudflare) |

| Aviso | Un commit que solo toque `docs/` o `seo/` **no despliega** `[V]` |

**Oportunidades deducibles sin GSC (verificadas):**

## 6. Matriz de decisión (completar con datos)

| Prioridad | Oportunidad | Evidencia || Señal | Dónde se mide | Umbral | `/sillon-bkf/` OK | Evaluar nueva landing |

|---|---|---||---|---|---|---|---|

| **ALTO** | Verificar GSC (propiedad Dominio) y enviar sitemap | Sin accesos; todas las decisiones dependen de esto || ¿`/sillon-bkf/` recibe impresiones comerciales? | GSC Páginas/Consultas | Impresiones relevantes en consultas de compra/BKF | Sí | No |

| **ALTO** | Marcar/verificar `whatsapp_click` como Evento clave | Estado desconocido || ¿Posición para "comprar bkf buenos aires" y variantes? | GSC | Top 10 estable o mejorando | Sí | Si >30 o inestable |

| **ALTO** | 301 reales (10 reglas: 8 `.html` + `/catalogo/sillon-bkf-premium/` + `/index.html`) y forzar HTTPS | Bing/DDG indexan `.html` y `http://`; solo hay stubs 200 || ¿Google la elige de forma consistente? | GSC Consulta × Página, Inspección de URL | Misma URL en ≥ la mayoría de las consultas | Sí | Si alterna con `/bkf/`, `/`, `/contacto/` |

| **ALTO** | Unificar NAP: confirmar 011 4753-0099 y 011 4755-6250; corregir fuentes externas | Inconsistencia observada || ¿Hay URL competidora propia? | GSC (2+ URLs con la misma consulta) | Ninguna con impresiones relevantes | Sí | Si existe: consolidar antes de crear algo |

| **ALTO** | Reclamar/crear GBP y Bing Places con datos de `business.js` y fotos reales | Existe ficha en Bing; aparece en pack local de "fabricante BKF" pero no de "comprar BKF" || ¿Potencial de mejorar? | Posición 4–30, CTR bajo | Hay consultas en 4–30 con impresiones | Sí (mejorar title/contenido/enlaces) | No |

| MEDIO | Medir `tel:` y envío exitoso de formulario | F.2 || ¿Hay demanda de intención distinta? | GSC consultas "dónde comprar", "fabricante", "cuero", "premium" | Consultas diferenciadas con volumen | — | Sí |

| MEDIO | Corregir detección `ai_referral` de Bing/Copilot | F.2 || ¿Convierte? | GA4 `google/organic` → `/sillon-bkf/` → `whatsapp_click` | Tasa por sesión comparable o mayor que el resto | Sí | Si convierte mal pese a buen tráfico, revisar CRO antes que URL nueva |

| MEDIO | Fotos reales de producto (también requisito GBP) | `CONTEXTO_PROYECTO.md` |

| MEDIO | Coherencia de categoría GBP/Bing (hoy "Fabricación y suministros para negocios") | Observación Bing |## 7. Criterios objetivos para crear o NO crear

| BAJO | Revisar fichas de terceros (OFIX, etc.) | Ya existen |Los umbrales numéricos (impresiones mínimas, % de CTR) **los fija el dueño con los datos reales**: no se inventan acá. Regla general: ante la duda **no crear**, porque cada URL nueva compite con `/sillon-bkf/` y con `/bkf/`.

| BAJO | Latencia de `gtag` (3 s / primera interacción) | F.1 |

### Mantener `/sillon-bkf/` como landing principal si se cumplen (casi) todos:

---- Ya recibe impresiones relevantes.

- Rankea para intención comercial (compra/BKF Buenos Aires).

## H. Decisión sobre nuevas URLs- Google la elige de forma consistente (canonical elegido = declarado).

- No hay otra URL propia compitiendo.

**Veredicto preliminar: ninguna se crea todavía. `/comprar-bkf-buenos-aires/` = ESPERAR DATOS. `/bkf-cuero/` y `/bkf-premium/` = NO CREAR.**- Tiene potencial de mejorar posición/CTR (consultas en 4–30, CTR bajo).

→ Acción: mejorar esa página (title, contenido, enlaces internos, CRO), no crear otra.

| URL candidata | Query objetivo | Impresiones | Posición | URL actual de Google | ¿Canibalización? | ¿Crear? | Evidencia |

|---|---|---|---|---|---|---|---|### Crear `/comprar-bkf-buenos-aires/` solo si:

| `/comprar-bkf-buenos-aires/` | comprar bkf buenos aires | `GSC no disp.` | `GSC no disp.` | desconocida (Bing: home, por debajo de Proyecto BKF/Big BKF/cuerobuenosaires) | Probable con `/sillon-bkf/` y `/` | **ESPERAR DATOS** | Sin GSC; ya existe landing comercial `/sillon-bkf/` |- Hay demanda específica en GSC (consultas "comprar/dónde comprar BKF Buenos Aires" con impresiones).

| `/bkf-cuero/` | bkf cuero / bkf de cuero | `GSC no disp.` | `GSC no disp.` | desconocida (Bing: sin resultado web propio) | Total con `/sillon-bkf/` | **NO CREAR** | Decisión del propietario: BKF de cuero = BKF Premium (mismo producto); FAQ cubre la equivalencia; `alternateName` 'Sillón BKF de cuero' |- `/sillon-bkf/` **no** captura esa intención (no aparece, o aparece otra URL como `/bkf/` o `/contacto/`).

| `/bkf-premium/` | bkf premium | `GSC no disp.` | `GSC no disp.` | desconocida | Total con `/sillon-bkf/` | **NO CREAR** | El producto ya se resuelve en `/sillon-bkf/` |- La intención es realmente distinta de "sillón BKF" (p. ej. informacional-local vs producto).

- GSC muestra una oportunidad clara (posición 4–30 con impresiones) que una URL nueva no canibalizaría.

**Preguntas de decisión:**- Hay contenido propio, no repetido, que aportar (envíos, retiro, cómo comprar, zonas), validado por el cliente `[C]`.

1. ¿Hay demanda con impresiones? → **Sin dato.**

2. ¿Ya aparece para esa query? → Bing: no para "comprar BKF BA" (abajo), no para "BKF cuero"; sí en pack local para "fabricante BKF".### Crear `/bkf-cuero/` solo si:

3. ¿Qué URL usa Google? → **Sin dato.**- Hay consultas diferenciadas de "BKF de cuero" con impresiones.

4. ¿Canibalización probable? → Sí si se crea cualquiera de las tres.- Hay producto/contenido real suficiente y distinto (modelos o cueros reales, no solo reescribir lo del sillón).

5. ¿Contenido distinto al actual? → `/bkf-cuero/` y `/bkf-premium/`: no (mismo producto). `/comprar-bkf-buenos-aires/`: solo si cambia la intención (guía de compra/showroom/zona), no si repite `/sillon-bkf/`.- No canibaliza `/sillon-bkf/` (el cuero ya es el material del producto actual) `[V]`.

6. ¿Evita cambiar la URL de nuevo? → Sí: el sitio ya cambió 3 veces su esquema.- Alternativa más segura: ampliar una sección de `/sillon-bkf/` o `/bkf/`.

7. ¿Evidencia suficiente? → **No.**

### Crear `/bkf-premium/` solo si:

**Condición para pasar `/comprar-bkf-buenos-aires/` a "CREAR"** (todas): impresiones acumuladas relevantes en variantes "comprar / dónde comprar bkf + buenos aires" **y** la URL actual está en posición > 10 **y** la landing actual no responde la intención (Google muestra home o `/catalogo/`) **y** el contenido propuesto aporta información distinta. Si `/sillon-bkf/` ya posiciona ≤ 10: **no crear**, optimizar la existente. El umbral de "relevantes" se define al ver los datos reales; no se estima aquí.- Hay demanda diferenciada de "BKF premium".

- El producto/segmento está definido por el cliente (hoy hay un único modelo llamado "Premium") `[C]`.

---- Hay oferta real distinta (no inventar un modelo).

- Si "Premium" es solo el nombre del sillón actual, **no crear página**.

## I. Acciones por prioridad

### No crear ninguna si:

| # | Prioridad | Acción | Responsable | Depende de |- No hay datos suficientes (propiedad GSC nueva o poca acumulación).

|---|---|---|---|---|- Los datos muestran que `/sillon-bkf/` ya es la elegida.

| 1 | Alta | Verificar GSC (Dominio, DNS en Cloudflare) y enviar `sitemap.xml` | Propietario | — |- El problema es de autoridad externa (reseñas, GBP, menciones) y no de cobertura de URLs.

| 2 | Alta | Exportar datos de B (3 y 6 meses), páginas y cobertura | Propietario → dev | 1 |

| 3 | Alta | Verificar Evento clave `whatsapp_click` y exportar informes F.4 | Propietario | — |## 8. Entregables esperados del cliente/dueño para cerrar B9

| 4 | Alta | Cloudflare: Always Use HTTPS + 10 redirecciones 301 (`docs/seo/cloudflare-paso-a-paso.md`) | Propietario/dev | Panel |1. Acceso (o capturas/exportaciones CSV) de GSC, GA4, GBP, Bing y Cloudflare, con las exportaciones de la sección 1.

| 5 | Alta | Confirmar teléfonos 011 4753-0099 y 011 4755-6250 y ficha de Bing; unificar NAP | Propietario | — |2. Estado del último run de Actions y de Pages.

| 6 | Alta | Crear/reclamar GBP y Bing Places con datos de `business.js` | Propietario | 5, fotos reales |3. Confirmación de plan de Cloudflare y de si hay reglas activas.

| 7 | Media | Decidir las 3 URLs candidatas con datos de (2) (criterio en H) | Dev + propietario | 2 |4. Con eso: completar la matriz 1.7 y la 6, y decidir B3/B4/B5.

| 8 | Media | Medir `tel:`, envío exitoso del form y corregir `ai_referral` de Bing (fase de código aparte) | Dev | aprobación |
| 9 | Media | Reemplazar fotos de producto generadas por fotos reales | Propietario | — |
| 10 | Baja | Revisar fichas de terceros (OFIX, todosnegocios, guiaindustrial, argentino) | Propietario | 5 |

**Fuera de alcance de B9 (no realizado):** B10, cambios de código, nuevas páginas, ajustes de titles/metas/schema.
