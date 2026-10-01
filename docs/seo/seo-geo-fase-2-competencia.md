# SEO + GEO — Fase 2: competencia real, content gap y arquitectura

> **Actualización (auditoría de recuperación, 1/10/2026):** la ficha
> `/catalogo/sillon-bkf-premium/` se unió a la landing `/sillon-bkf/`, que ahora es la única
> página del Sillón BKF; la ficha quedó como redirección y el sitemap tiene 15 URLs. Las
> menciones de abajo a la ficha y a las 16 URLs son del estado de la fase 2. Ver
> `recuperacion-seo.md`.

> Fecha de la investigación: 1/10/2026. Las SERPs se consultaron con una
> herramienta de búsqueda web (resultados con sesgo de EE.UU., en español) y el
> HTML de los competidores se descargó y se analizó con `curl`. **No hay datos de
> Search Console ni volúmenes de búsqueda**: nada de esto estima tráfico ni
> posiciones. Lo medido es lo que está escrito abajo, con su método.

## 1. Qué muestran las SERPs (evidencia)

| Búsqueda | Qué rankea | Señales que tienen y nosotros no (antes) |
|---|---|---|
| `sillón BKF Argentina comprar` | Mercado Libre + tiendas (Pradero Cueros, Decodesign, DeSillas, Habitable Home, Kikely, Gavia, Enecueros) | Todas las fichas con `Product` + **`offers.price` visible**, cuotas y envío; Enecueros además tiene una página corta `/bkf/` con título exacto "Sillón BKF en Argentina" (520 palabras: historia + dónde comprar) |
| `sillón BKF precio fabricante` | Tiendas con precio; fabricantes que se declaran tales (Bernardo Lahitte, Big BKF) | Precio en HTML y en schema; "Somos fabricantes" en la descripción |
| `BKF` / `qué es BKF` / `silla BKF historia` | Wikipedia, La Nación, PuroDiseño, Divani (2.191 palabras), Urbipedia | Intención **informativa**: historia, significado de la sigla, creadores, materiales. Divani estructura la nota en 7 H2 ("¿Qué significa el nombre BKF?", "Los creadores"…) |
| `mesa BKF` | Ruido (BKF Engineers, licuadoras BKF) y `proyectobkf.com.ar/mesas` | **No hay intención de producto**: BKF es un diseño de sillón. Quien la vende es una marca que llama "BKF" a su línea |
| `mesa ratona de hierro` | Mercado Libre + tiendas de living | Catálogos de living con cientos de modelos |
| `base de mesa de hierro para bar` | Mercado Libre, fabricantes chicos, Facebook | Competencia de baja autoridad: espacio real para una ficha bien resuelta |
| `mobiliario comercial` / `muebles para comercios` | Fabricantes con home comercial (FG Equipamientos, CEDICOH, Fábrica de Clásicos, Donner, Alcomobi, IMA, FADECOM) | H1/título "Fabricantes de muebles para restaurantes/hoteles…", categorías por tipo de mueble, años de trayectoria, `Organization` |
| `fábrica de muebles San Martín` | Directorios (argentino.com.ar), páginas de Facebook, sitios locales con dirección y "showroom" | Dirección visible, "coordine su visita"; **Taller Kappa ya aparece** en `fábrica de muebles San Martín hierro` |

Conclusiones que guiaron el trabajo:

1. **La intención comercial de BKF se gana con precio.** Todas las fichas que
   rankean lo muestran. Taller Kappa cotiza por WhatsApp y no publica precios:
   queda fuera de resultados enriquecidos de producto y de `precio`. No se
   inventó ninguno (ver §8).
2. **"BKF" a secas es una consulta informativa**, que el sitio no respondía.
   Faltaba una guía propia, distinta de la página de venta.
3. **Mobiliario comercial lo rankean páginas de servicio**, no portfolios. El
   sitio tenía `/proyectos/` (portfolio) pero ninguna página que explique qué
   se fabrica para empresas y cómo se pide.
4. **Lo que no se puede ganar sin catálogo nuevo**: `mesa ratona`, `mesa de
   diseño`, `muebles para living`, `muebles` (genérico). Taller Kappa no fabrica
   esos productos; crear páginas para ellas sería exactamente el relleno que se
   quiere evitar.

## 2. Content gap

| Keyword | Intención | Página que debe rankear | Teníamos | Faltaba | Qué se hizo |
|---|---|---|---|---|---|
| BKF · qué es BKF · qué significa BKF | Informativa | **`/bkf/`** (nueva) | Un párrafo en `/sillon-bkf/` | Guía: definición, sigla, historia verificable, materiales, cómo elegir, FAQ, fuentes | Guía con `Article`, tabla de datos, FAQ y fuentes citadas (Wikipedia, La Nación) |
| silla BKF · sillón mariposa · butterfly chair | Informativa | `/bkf/` y `/sillon-bkf/` | `alternateName` en el schema | Los sinónimos en el texto visible | Definición con todos los nombres en ambas páginas |
| sillón BKF · sillón BKF Argentina · BKF Argentina | Comercial | `/sillon-bkf/` | Landing con título sin "Argentina" | Origen/fabricación nacional y cómo se compra en el título, H1 y cuerpo | Título "Sillón BKF en Argentina…", H1 "…fabricado en Argentina", sección de origen y envíos |
| comprar sillón BKF | Transaccional | `/sillon-bkf/` + `/catalogo/sillon-bkf-premium/` | Ficha y CTA | Precio publicado | Mecanismo de precio listo (§8). Falta el dato |
| sillón BKF precio | Transaccional | `/sillon-bkf/` (FAQ) | Respuesta genérica | Precio de lista | La FAQ ahora dice explícitamente que no hay precio de lista y cómo cotizar |
| banco BKF · banqueta BKF | Comercial | `/catalogo/banco-bkf/` | Ficha | Sinónimo "banqueta" | Agregado como alias y en la definición |
| base de mesa de hierro · base para mesa de bar | Comercial | `/catalogo/mesas/` + ficha | Ficha y categoría | "bares y restaurantes" en título/definición | Título y definición ajustados |
| mobiliario comercial · muebles para comercios · muebles para locales · mobiliario comercial Argentina | Comercial B2B | **`/mobiliario-comercial/`** (nueva) | `/proyectos/` | Qué se fabrica, para qué negocio, cómo se pide, condiciones, FAQ | Página de servicio con `Service` + FAQ; `/proyectos/` queda como portfolio |
| fabricante/fábrica de muebles · muebles San Martín · muebles Buenos Aires | Local | `/`, `/nosotros/`, `/contacto/` | `LocalBusiness`, dirección | Zonas de servicio explícitas, enlaces desde el contenido a Nosotros | `areaServed` con CABA/GBA/Argentina; enlaces contextuales a Nosotros (0 → 3) |
| mesa BKF · mesa ratona · mesa de diseño · muebles para living · muebles · muebles de diseño | — | **ninguna** | — | Productos que el taller no fabrica | **No se crearon páginas.** Ver §7 |

## 3. Clusters

| Cluster | Keywords | Hub | Soporte |
|---|---|---|---|
| 1. BKF (informativo) | BKF, qué es BKF, silla BKF, sillón mariposa, butterfly chair, historia | `/bkf/` | `/sillon-bkf/`, `/faq/` |
| 2. BKF (comercial) | sillón BKF, sillón BKF Argentina, comprar/precio | `/sillon-bkf/` | `/catalogo/sillon-bkf-premium/`, `/catalogo/asientos/` |
| 3. Banco/banqueta | banco BKF, banqueta BKF | `/catalogo/banco-bkf/` | `/catalogo/asientos/` |
| 4. Mesas gastronómicas | base de mesa de hierro, mesa de bar, base para barra | `/catalogo/mesas/` | `/catalogo/base-de-mesa-flat/` |
| 5. Mobiliario comercial | mobiliario comercial, muebles para comercios/locales | `/mobiliario-comercial/` | `/proyectos/`, productos, `/envios/` |
| 6. Local y marca | fábrica de muebles San Martín, Taller Kappa | `/`, `/nosotros/` | `/contacto/`, `LocalBusiness` |
| 7. Servicio | envíos de muebles, garantía, cuidado del cuero | `/envios/`, `/garantia/` | `/faq/` |

## 4. Arquitectura de autoridad temática

```
HOME
├─ /sillon-bkf/            ← página comercial (en el menú)
│    ├─ /catalogo/sillon-bkf-premium/   (ficha: tabla técnica, FAQ, relacionados)
│    └─ /bkf/                           (guía informativa: historia, cómo elegir)
├─ /catalogo/
│    ├─ /catalogo/asientos/  → sillón BKF Premium · banco BKF
│    └─ /catalogo/mesas/     → base de mesa Flat
├─ /mobiliario-comercial/  ← página de servicio B2B (en el menú)
│    └─ /proyectos/          (portfolio de clientes)
└─ /nosotros/ · /contacto/ · /faq/ · /envios/ · /garantia/
```

El menú pasó a destacar las dos páginas con valor comercial (`Sillón BKF` y
`Mobiliario comercial`); `Proyectos` y la guía van en el footer y dentro del
contenido. `scripts/prerender.js` imprime en cada build los **enlaces
contextuales entrantes** (solo desde el `<main>`, sin menú ni footer): hoy las
páginas comerciales reciben 7 a 10; `/proyectos/` y `/nosotros/`, 3 cada una.

## 5. Indexación

**Deben indexarse (16):** `/`, `/catalogo/`, `/catalogo/asientos/`,
`/catalogo/mesas/`, `/catalogo/sillon-bkf-premium/`, `/catalogo/banco-bkf/`,
`/catalogo/base-de-mesa-flat/`, `/sillon-bkf/`, `/bkf/`,
`/mobiliario-comercial/`, `/proyectos/`, `/nosotros/`, `/faq/`, `/contacto/`,
`/envios/`, `/garantia/`. Todas con canonical a su URL con barra final y en el
`sitemap.xml` (con `lastmod` desde git).

**No deben indexarse:** `/admin` (404 + SPA con `noindex`; `Disallow` en
robots.txt), `404.html` (`noindex`), `/index.html` y las URLs `*.html`
heredadas (páginas puente con canonical y redirección; fuera del sitemap).

**Verificado en producción el 1/10/2026 (curl):**

| Caso | Resultado | Estado |
|---|---|---|
| `https://www…` → `https://tallerkappa.com.ar/` | 301 | ✔ |
| `http://www…` → `http://tallerkappa.com.ar/` | 301 (queda en http) | ✔ pero ver siguiente |
| `http://tallerkappa.com.ar/` | **200, sin redirección a https** | ✖ externo (§9) |
| `/catalogo` (sin barra) | 200: sirve la página puente `catalogo.html` (canonical a `/catalogo/` + refresh) en vez de un 301 | tolerable; el canonical resuelve |
| `/xyz` | 404 con `noindex` | ✔ |
| Email en HTML | Cloudflare lo ofusca como `[email protected]` para quien no ejecuta JS | ✖ externo; el JSON-LD y `llms.txt` lo conservan en claro |

## 6. Datos estructurados (auditoría y decisiones)

- Todas las páginas emiten **un solo `@graph`** con `LocalBusiness`, `Brand`,
  `WebSite` (globales) y el nodo de página + `BreadcrumbList` (+ `Product`,
  `FAQPage`, `ItemList`, `Article` o `Service` según corresponda).
- El Sillón BKF es **una sola entidad** (mismo `@id` en `/sillon-bkf/` y en la
  ficha). El build **corta** si algún `@id` referenciado no se define en la misma
  página, si hay JSON-LD inválido o si falta el nodo de la página.
- Se verificó que **no hay preguntas de FAQ repetidas** entre páginas.
- `Product.offers` no lleva precio porque no existe. Es lo correcto, pero
  implica que Google no mostrará resultado enriquecido de producto.
- `Article` (guía): autor y publicador son la empresa, `datePublished` real
  (1/10/2026), sin `dateModified` (no se simula frescura); `about` enlazado a
  Wikipedia; fuentes en `citation`.
- `Service` pasó de `/proyectos/` a `/mobiliario-comercial/`, que es donde se
  describe el servicio.
- No se agregaron `Review`, `AggregateRating`, SKU, GTIN ni `sameAs` de redes:
  no hay datos.

## 7. Qué no se hizo, a propósito

- **No hay páginas** para `mesa BKF`, `mesa ratona`, `mesa de diseño`, `muebles
  para living` ni `muebles`: el taller no fabrica esos productos y la SERP de
  `mesa BKF` ni siquiera tiene intención de producto. Competir por ellas exige
  **ampliar el catálogo**, no más texto.
- No hay páginas por localidad ("muebles en Caseros", etc.): serían puertas de
  entrada sin contenido propio.
- No se tocaron las URLs existentes (ninguna necesitó un 301).

## 8. Precio (decisión pendiente del dueño)

Es la mayor brecha frente a quienes rankean `comprar` y `precio`. El código
está listo: agregando a un producto en `src/data/products.js`
`price: { amount: 123456, currency: 'ARS', validUntil: '2026-12-31', note: 'IVA incluido' }`
la ficha y `/sillon-bkf/` muestran el precio y el JSON-LD emite
`price`/`priceCurrency`/`priceValidUntil`. Puede ser un "desde" de referencia.
Mientras no se cargue, el sitio sigue diciendo que se cotiza por WhatsApp.

## 9. Acciones externas

**Cloudflare (el dominio pasa por Cloudflare):**
1. *Always Use HTTPS* (hoy `http://` responde 200).
2. Desactivar *Email Address Obfuscation* (Scrape Shield) o aceptar que el email
   visible no es legible para rastreadores sin JS.
3. Regla de caché para `/assets/*` y `/images/*` con TTL largo (los archivos
   tienen hash/nombre estable; hoy `max-age=600`).
4. Opcional: regla 301 de `/<ruta>` a `/<ruta>/`.

**Google:**
5. Search Console: propiedad de dominio, enviar `sitemap.xml`, pedir indexación
   de `/bkf/` y `/mobiliario-comercial/`, y mirar el informe de Datos
   estructurados.
6. **Perfil de Empresa de Google** (el factor local más relevante para `muebles
   San Martín`): mismos nombre, dirección y teléfono que `business.js`, categoría
   de fábrica de muebles, fotos reales y reseñas reales de clientes.

**Autoridad legítima:**
7. Perfiles oficiales (Instagram/Facebook/LinkedIn) y después agregarlos a
   `sameAs`. En la SERP local pesan mucho las páginas de Facebook.
8. Directorios con ficha de empresa para San Martín (la SERP mostró
   argentino.com.ar) y listados de fabricantes de mobiliario.
9. Cámaras industriales/empresariales de la zona y asociaciones de diseño
   (Fundación IDA publicó una nota sobre el BKF, citada por Wikipedia).
10. Prensa de diseño que ya escribe sobre el BKF (La Nación, PuroDiseño): ofrecer
    el taller como fabricante nacional para notas y listados.
11. Con permiso, que clientes de proyectos (YPF, Burger King, etc.) mencionen
    o enlacen el caso. No se pueden inventar.
12. Fotos reales de producto (hoy hay marca de agua de Gemini) y, si se decide,
    publicar en Mercado Libre, que es donde está la demanda comercial del BKF.

## 10. Matriz técnica (estado a 1/10/2026)

| Área | Estado | Problema | Impacto potencial | Acción |
|---|---|---|---|---|
| Indexación | Sana en sitio; 2 fallas en el borde (Cloudflare) | `http://` sin redirección; sin 301 en rutas sin barra | Duplicación por protocolo | Reglas de Cloudflare (§9) |
| Arquitectura | Mejorada | Faltaban guía y página B2B | Cobertura de intención informativa y B2B | `/bkf/`, `/mobiliario-comercial/` |
| Contenido | Mejorado | Fichas y landing sin respuesta directa a "precio" | Snippets y citabilidad | Respuesta explícita en FAQ; guía con definición y tabla |
| Keywords | Cubiertas las alcanzables | Genéricas sin catálogo | — | Documentado en §7 |
| Internal linking | Mejorado | `/nosotros/` con 0 enlaces contextuales | Reparto de autoridad | 0 → 3; páginas comerciales 7-10 |
| Schema | Consistente | Sin precio | Sin resultado de producto | §8 |
| Performance | Mejorada | Fuentes y mapa de terceros bloqueaban | LCP/FCP | Ver §11 |
| Imágenes | Aceptable | Marca de agua de Gemini; 3 fotos | Confianza y diferenciación | Fotos reales (externo) |
| SEO local | Base sólida | Sin Perfil de Empresa verificado | Mapa local | §9 |
| GEO | Mejorado | Email ofuscado en el HTML visible | Contacto no legible para IA sin JS | §9 punto 2 |
| UX | Corregido | 3 fallas de accesibilidad en tarjetas; desborde a 360 px | Usabilidad | Corregidas y verificadas |
| URLs | Correctas | — | — | Sin cambios |

## 11. Performance — antes y después

Lighthouse mobile (4 corridas contra producción, 1/10/2026): la home
oscilaba entre **95 y 58**, con FCP de 2,2 a 5,6 s. En las corridas lentas el LCP
(imagen del hero) se descargaba en 32 ms pero esperaba **2.118 ms** para pintarse
por la hoja de Google Fonts (tercero que bloquea el render). Además cada página
cargaba ~360 kB de JS de Google Maps, ~250 kB de Font Awesome y 174 kB de
gtag.js: **45 requests / 1.203 kB**.

Cambios: fuente autoalojada con preload, íconos SVG en línea, mapa montado al
llegar al footer, GA4 diferido (cola inmediata). Resultado local (mismo equipo,
mobile simulado, 2 corridas): **17 requests / 273 kB** en la home, TBT 10 ms,
FCP 1,4 s, LCP ~2,0-2,2 s, CLS 0, **Performance 99 en las 16 páginas**,
Accesibilidad 100 y SEO 100. Los números de producción se deben volver a
medir después del deploy.
