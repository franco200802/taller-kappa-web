# Fase 4 — De la búsqueda a la venta (5/10/2026)

> Objetivo: **Google / IA → visita → confianza → producto → consulta → WhatsApp → venta**.
> Método: auditoría del HTML que genera el build (`dist/`), de producción con `curl`,
> navegador headless sobre `vite preview` (eventos, hidratación, 360 px) y SERPs y
> fichas de competidores consultadas el 5/10/2026. **Sin datos de Search Console ni
> volúmenes de búsqueda**: nada de esto estima tráfico ni posiciones.
>
> Fases anteriores (no se repiten acá): `seo-geo-fase-2-competencia.md`,
> `seo-google-fase-3.md`, `recuperacion-seo.md`, `cloudflare-paso-a-paso.md`.

## 1. Diagnóstico

### Lo que ya estaba bien (verificado, no se tocó)

- **SPA sin problema de rastreo:** las 15 rutas se prerenderizan a HTML completo
  (título, description, canonical, H1 único, JSON-LD, contenido). Google y los
  asistentes leen todo sin ejecutar JS. El build corta si falta algo de eso.
- **Indexación:** robots.txt sin bloqueos (GPTBot, OAI-SearchBot, PerplexityBot y
  Googlebot reciben 200), sitemap con `lastmod` real desde git e imágenes, 404 con
  `noindex`, redirecciones de las URLs heredadas.
- **Schema:** un solo grafo por página enlazado por `@id` (LocalBusiness +
  FurnitureStore, Brand, WebSite, WebPage, BreadcrumbList, Product, FAQPage,
  Article, Service, ItemList). Sin precios, reviews ni ratings inventados.
- **Arquitectura:** una intención = una URL (`/sillon-bkf/` comercial, `/bkf/`
  informativa, `/mobiliario-comercial/` B2B). Sin huérfanas; enlazado contextual
  medido en cada build.
- **Performance:** Lighthouse mobile 99 en fase 2 (fuente autoalojada, SVG en
  línea, GA y mapa diferidos, WebP). Esta fase no agrega JS de terceros.

### Lo que se encontró

| # | Hallazgo | Evidencia |
|---|---|---|
| A | **17 de los 22 enlaces a WhatsApp no enviaban ningún evento.** Las fichas del Banco BKF y la Base de Mesa, el catálogo, mobiliario comercial (B2B), la guía, el footer y la home no medían nada. `add_to_cart` solo se medía en `/sillon-bkf/`. | `grep whatsappUrl` vs `trackEvent` |
| B | **El WhatsApp flotante y el del footer abrían un chat vacío**: el taller no sabía qué producto miraba la persona. | `whatsappUrl()` sin texto en `Layout.jsx` |
| C | **Los buscadores con IA citan datos viejos:** el resumen de búsqueda sobre Taller Kappa dice "Sillón BKF Premium $280.000 (mayo 2026)", "30-50% menos que el retail" y "comprar online". Nada de eso está hoy en el sitio: viene de versiones anteriores (commits previos a la migración a React). | WebSearch del 5/10 + `curl` a producción + `git log -S` |
| D | **La home no tenía CTA de precio para particulares:** el único WhatsApp visible al llegar era "Cotizar para empresas" (el flotante se oculta mientras se ven los botones del hero). | `Home.jsx`, `WA_HIDE_TARGETS` |
| E | Error de texto visible en la ficha de la base: "Ficha técnica **del** Base de Mesa Flat" (dos H2) y "cotizar **el** Base de Mesa Flat". | HTML generado |
| F | Banco BKF: el título dice "Hierro y Cuero", pero la ficha técnica y el schema no tenían el cuero ni su garantía. H1 de las fichas sin "Buenos Aires" (regla de `recuperacion-seo.md`). | `products.js` |
| G | Garantía y envíos sin respuesta directa: bajadas genéricas ("Respaldamos cada pieza…"), description sin los plazos ni la garantía concretos, títulos con raya. FAQ con título de 35 caracteres. "¿Hacen envíos?" sin plazos. | Auditoría on-page |
| H | Búsquedas reales sin respuesta: **"BKF para exterior"** y el cuidado del cuero (los datos estaban en `/garantia/` pero no en la página del producto). | Mapa de keywords |
| I | `llms.txt` sin cómo se compra, sin garantía por producto y sin las preguntas frecuentes. | `dist/llms.txt` |
| J | **Cloudflare sigue sin configurar:** `http://` responde 200 y las URLs viejas siguen siendo meta refresh, no 301. | `curl` a producción, 5/10 |

### Competencia (fichas consultadas el 5/10/2026)

| | Taller Kappa | Enecueros | ProyectoBKF | El Grito BKF |
|---|---|---|---|---|
| Precio publicado | **No** | $686.000 (10% off transferencia) | $798.000 | $499.990–$599.990 en cuero; desde $249.990 en lona |
| Cuotas | — | 3 sin interés | 3 sin interés | hasta 24 |
| Estructura | Hierro macizo 12 mm | Hierro macizo | Varilla maciza 12 mm | — |
| Garantía | **Estructura de por vida**, epoxi 2 años, cuero 1 año | 1 año | No especificada | — |
| Entrega | 24-48 hs a 5-10 días hábiles según zona | 1-7 días hábiles | — | — |
| Variantes | 5 acabados de estructura, cuero negro/marrón/natural | 6 colores de cuero | Cuero engrasado 2 mm, versión "para armar" con envío gratis | 11 modelos (lona, ecocuero, cuero con pelo, mini, desarmable) |
| Otros | Fábrica propia, factura A/B, a medida sin costo, clientes corporativos | Carrito | Capacidad "+150 kg", "no apto exterior" | Tienda Nube |

**Qué hacen ellos y nosotros no:** precio visible, cuotas o descuento por
transferencia, varias fotos por producto, variantes con página o selector propio y
datos de compra explícitos (capacidad, si llega armado).
**Qué podemos hacer mejor:** nadie más ofrece garantía de por vida en la estructura,
factura A/B, medidas a pedido sin costo, retiro en fábrica y clientes como YPF o
McDonald's. Todo eso ya está en el sitio, pero sin precio la comparación se corta
antes de llegar a esos argumentos.

## 2. Mapa keyword → intención → URL → contenido → CTA

| Búsqueda | Intención | URL | Contenido que responde | CTA |
|---|---|---|---|---|
| comprar sillón BKF · BKF comprar Buenos Aires · dónde comprar BKF · sillón BKF Buenos Aires | Transaccional local | `/sillon-bkf/` | Cómo comprar (4 pasos), retiro y plazos por zona, ficha técnica | Consultar precio / Agregar al presupuesto |
| fabricante de BKF · fábrica de BKF · BKF Argentina | Comercial | `/sillon-bkf/` | "Fabricante: Taller Kappa S.R.L.", dónde se fabrica, fábrica propia | Consultar precio |
| BKF de cuero · BKF cuero · BKF premium | Comercial | `/sillon-bkf/` | Cuero vacuno curtido al vegetal, colores de cuero, FAQ de cuidado | Consultar precio |
| BKF precio · sillón BKF precio | Transaccional | `/sillon-bkf/` (FAQ) | Cómo se cotiza; aclara que los precios viejos pueden no estar vigentes | Consultar precio — **brecha: falta el precio** |
| BKF para exterior · BKF para interior | Informativa con compra | `/sillon-bkf/` (FAQ nueva) | Uso interior/bajo techo, por qué (garantía y cuidados) | Consultar precio |
| BKF original · qué es BKF · historia · significado | Informativa | `/bkf/` | Creadores, 1938, MoMA, cómo elegir | Enlace a `/sillon-bkf/` |
| banco BKF · banqueta BKF | Comercial | `/catalogo/banco-bkf/` | Medidas, cuero, garantía, usos | Consultar precio |
| base de mesa de hierro · base para mesa de bar | Comercial B2B | `/catalogo/mesas/` + ficha | Chapa 10 mm, alturas 73/105 cm | Consultar precio |
| mobiliario comercial · muebles para locales gastronómicos | B2B | `/mobiliario-comercial/` | Rubros, clientes, cómo se pide | Cotizar mobiliario comercial |
| fábrica de muebles de hierro San Martín | Local | `/`, `/nosotros/`, `/contacto/` | NAP, mapa, horario | WhatsApp / cómo llegar |
| envío de muebles CABA / GBA | Servicio | `/envios/` | Plazos por zona en la bajada y la description | Consultar envío |
| garantía / cuidado del cuero | Servicio | `/garantia/` | Garantía por material en la bajada; cuidados | Contactar soporte |

## 3. Páginas nuevas y programmatic SEO: decisión

**No se creó ninguna URL nueva.** `/bkf-cuero`, `/bkf-premium`,
`/comprar-bkf-buenos-aires` y `/fabricante-bkf` responden la misma intención que
`/sillon-bkf/` sobre **un solo producto** (el Sillón BKF Premium ya es de cuero):
serían páginas puerta que competirían con la landing, algo que
`recuperacion-seo.md` identificó como causa de pérdida de posiciones. Lo que sí
justificaría páginas nuevas, cuando exista:

- **Variantes reales** con foto, especificaciones y precio propios (por ejemplo, otra
  funda, un BKF desarmable o un mini BKF, si el taller los fabrica): una ficha por variante.
- **"Cómo fabricamos un BKF"** con fotos reales del taller y del proceso: la señal de
  experiencia (E-E-A-T) más fuerte que el sitio puede dar y que ningún revendedor puede copiar.
- **Proyectos con fotos reales** de los locales equipados (con permiso), una página por caso.

## 4. Priorización

| Prioridad | Problema | Solución | SEO | Ventas | Dificultad | Estado |
|---|---|---|---|---|---|---|
| 🔥 | Sin precio publicado (C y competencia) | Publicar precio vigente o "desde", con fecha (`price` en `products.js`; el schema y la página lo toman solos) | Muy alto | Muy alto | Decisión del dueño | **Pendiente (dueño)** |
| 🔥 | Fotos de producto generadas con IA, una por producto | Fotos reales: varias por producto, cuero de cerca, taller, entregas | Alto | Muy alto | Sesión de fotos | **Pendiente (dueño)** |
| 🔥 | Conversiones sin medir (A) | Listener único en `analytics.js` + `data-cta`/`data-item` | — | Muy alto | Baja | ✅ Hecho |
| 🟥 | WhatsApp sin producto ni página (B) | `whatsappUrlFor()`: mensaje con el producto + URL; flotante según la página | — | Alto | Baja | ✅ Hecho |
| 🟥 | IA cita precios y "compra online" viejos (C) | FAQ y `llms.txt` aclaran que no hay precio de lista y que los precios viejos pueden no estar vigentes | Alto (GEO) | Alto | Baja | ✅ Hecho (se corrige del todo publicando precio) |
| 🟥 | Home sin CTA de precio para particulares (D) | "Consultar precio" en el hero + enlace B2B debajo | — | Alto | Baja | ✅ Hecho |
| 🟥 | Cloudflare (J) | `cloudflare-paso-a-paso.md` | Alto | Medio | Baja (panel) | **Pendiente (dueño)** |
| 🟧 | Fichas con error de texto y sin cuero/"Buenos Aires" (E, F) | `article`, `heading`, ficha técnica del banco | Medio | Medio | Baja | ✅ Hecho |
| 🟧 | Garantía/envíos/FAQ sin respuesta directa (G, H) | Bajadas y descriptions con los datos; FAQ de exterior y cuidado del cuero | Alto | Medio | Baja | ✅ Hecho |
| 🟧 | `llms.txt` incompleto (I) | Material y garantía por producto, cómo se compra, FAQ completas | Medio (GEO) | Bajo | Baja | ✅ Hecho |
| 🟧 | Search Console y GA4 sin configurar como conversión | §6 | Alto | Alto | Baja (cuentas) | **Pendiente (dueño)** |
| 🟧 | Perfil de Empresa de Google y reseñas | `seo-google-fase-3.md` §6b | Muy alto (local) | Alto | Media | **Pendiente (dueño)** |
| 🟨 | Formas de pago, cuotas, si llega armado, capacidad | Agregar a la ficha y la FAQ cuando el dueño lo confirme | Medio | Alto | Baja | **Pendiente (dato)** |
| 🟩 | WhatsApp del footer sin texto | Mismo helper que el flotante | — | Bajo | Baja | Medido; mensaje pendiente |

## 5. Qué se implementó

- **Medición (`lib/analytics.js` → `trackClicks`, `CartContext`):** un solo listener mide
  todo enlace a `wa.me` (`whatsapp_click`), `mailto:` (`email_click`) y los clics hacia
  la página de un producto (`select_item`). Cada evento lleva `location` (`data-cta` o
  zona: menú, footer, modal, cierre), `page_path` e `item_name`. `add_to_cart` se mide
  en el carrito y cuenta igual desde cualquier botón. Se quitaron los `trackEvent` a
  mano que habrían duplicado eventos. Los nombres de evento y de `location` anteriores
  se conservan, así no se corta la serie histórica.
- **WhatsApp (`data/contact.js` → `whatsappUrlFor`):** los mensajes de fichas, landing,
  catálogo, categorías, home y flotante dicen qué producto se consulta y terminan con
  la URL (WhatsApp muestra la foto). El flotante pide el precio del producto de la página.
- **CTAs:** "Consultar precio" en fichas, landing y home; precio "a consultar" con la
  promesa ya publicada en la home ("te lo pasamos por WhatsApp en el día").
- **Producto:** artículo gramatical (`article`), H1 con "Buenos Aires" (`heading`),
  Banco BKF con cuero y garantía del cuero en la ficha técnica, schema y description.
- **Contenido citable:** bajadas de `/garantia/` y `/envios/` con los datos; títulos y
  descriptions con garantía y plazos; FAQ de envíos con plazos por zona; dos preguntas
  nuevas en `/sillon-bkf/` (exterior, cuidado del cuero) con datos de `/garantia/`.
- **FAQ general** pasó a `data/faq.js`: la usan `/faq/` y `llms.txt` (y el `lastmod`).
- **`llms.txt`:** material y garantía por producto, "Cómo se compra" (con la aclaración de
  precios) y las 20 preguntas frecuentes completas.

**Verificación:** `npm run build` sin errores ni avisos (15 rutas + 404); navegador
headless sobre `vite preview`: eventos correctos en landing, catálogo, ficha y home,
sin errores de hidratación; sin desborde horizontal a 360 px en 7 páginas;
react-doctor 76 → 76, sin diagnósticos en los archivos tocados. Lighthouse no se
volvió a medir: el cambio no agrega recursos ni JS de terceros.

## 6. Analytics: qué se puede responder y qué falta configurar

En **GA4** (requiere acceso del dueño):

1. *Administrar → Eventos*: marcar **`whatsapp_click`** como **evento clave** (conversión).
   No marcar también `whatsapp_checkout`, porque contaría dos veces el mismo clic.
2. *Definiciones personalizadas*: dimensiones de evento `location`, `page_path`,
   `item_name` y `ai_source`.
3. Vincular **Search Console** con GA4.

Con eso:

| Pregunta | Dónde |
|---|---|
| ¿Qué página genera consultas? | `whatsapp_click` por `page_path` |
| ¿Qué producto convierte mejor? | `whatsapp_click` y `add_to_cart` por `item_name`; `select_item` para el interés |
| ¿Qué CTA funciona mejor? | `whatsapp_click` por `location` |
| ¿Qué búsqueda genera la consulta? | Search Console (consulta → página de destino) cruzado con `whatsapp_click` por página de destino. GA4 no ve la consulta exacta |
| ¿Qué trae la IA? | `ai_referral` por `ai_source` |
| **¿Qué consulta terminó en venta?** | Fuera del sitio: cada mensaje llega con la URL de la página. Anotar en una planilla (fecha, URL del primer mensaje, vendió sí/no, monto) da la tasa de cierre por página y producto |

## 7. Pendientes (fuera del código)

1. **Precio** publicado o "desde", con fecha de vigencia (es lo que corrige los $280.000 viejos).
2. **Fotos reales**: 4 a 6 por producto, cuero de cerca, taller, proceso y locales equipados.
3. **Formas de pago** (efectivo, transferencia, tarjeta, cuotas, descuentos), si el sillón
   llega armado, capacidad de peso y la lista exacta de colores de cuero: con esos datos se
   amplían la ficha y la FAQ.
4. **Cloudflare**: `http`→`https` y 301 reales (siguen pendientes al 5/10).
5. **GA4** (§6) y **Search Console** (`seo-google-fase-3.md` §7).
6. **Perfil de Empresa de Google** y **reseñas reales**; corregir la ficha de Cylex.
7. Perfiles oficiales en redes → agregarlos a `sameAs` en `lib/schema.js`.

## 8. Próximos 12 meses

- **Mes 1:** precio + fotos reales + GA4/Search Console + Cloudflare + Perfil de Empresa.
  Es lo que más mueve las ventas y no requiere código nuevo.
- **Meses 2-3:** con 4 a 6 semanas de datos de `whatsapp_click`, ajustar las páginas
  con visitas pero sin consultas. Pedir reseñas a cada cliente que compra.
- **Meses 3-6:** "Cómo fabricamos un BKF" con fotos reales del taller; casos de
  proyectos con fotos; fichas de variantes si se fabrican.
- **Meses 6-12:** autoridad externa (`seo-google-fase-3.md` §9): prensa de diseño,
  directorios con NAP idéntico y enlaces de clientes. Repetir la comparación de
  competencia cada trimestre.

Fuentes de la competencia: [Enecueros](https://enecueros.com/productos/sillon-bkf),
[ProyectoBKF](https://www.proyectobkf.com.ar/productos/bkfcuerotostadocromado/),
[El Grito BKF](https://elgritobkfartesanal.mitiendanube.com/sillones-bkf/),
[Mercado Libre](https://listado.mercadolibre.com.ar/sillon-bkf-cuero).
