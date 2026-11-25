# Operación growth, noviembre 2026: informe principal

> Rama `growth/operacion-ventas-nov-2026`, creada el 24/11/2026 desde `origin/main`
> (`562d4c3`, que ya incluye el rediseño premium del PR #33). Commits locales, sin
> push ni merge. Datos tomados el 24 y 25/11/2026 de Search Console, GA4 y el
> Perfil de Empresa (con la sesión del dueño en Chrome, solo lectura) y de
> búsquedas y sitios públicos. Nada de lo que sigue es una estimación salvo
> donde dice "hipótesis".

Documentos de esta carpeta:

| Archivo | Qué tiene |
|---|---|
| Este | A. Diagnóstico · B. Mejoras implementadas · F. Validación · G. Pendientes del dueño · skills usadas |
| [`investigacion-seo-y-competencia.md`](investigacion-seo-y-competencia.md) | C. Datos de Search Console, búsquedas priorizadas con evidencia y competencia relevada el 25/11 |
| [`estrategia-comercial.md`](estrategia-comercial.md) | D. Qué ofrecer a cada segmento B2B y cómo vender el sillón BKF |
| [`plan-90-dias.md`](plan-90-dias.md) | E. Plan 30/60/90 con responsable, recursos, medición y dependencias |
| [`medicion.md`](medicion.md) | Qué se puede medir hoy, qué falta, UTM y tablero semanal |
| [`registro-consultas.csv`](registro-consultas.csv) | Planilla para anotar cada consulta de WhatsApp hasta la venta |

Los cinco documentos que pedía revisar el encargo (`plan-comercial-claude-2026.md`,
`plan-conversion-codex-2026.md`, `estrategia-whatsapp-ventas-2026.md`,
`captacion-clientes-30-dias.md`, `primera-campana-b2b.md`) **no existen** en
ninguna rama local ni remota ni en las copias del proyecto de la máquina
(búsqueda con `git log --all` y en disco). Se trabajó con lo que sí hay:
`CONTEXTO_PROYECTO.md`, `docs/` y `seo/`.

---

## A. Diagnóstico ejecutivo: los cinco puntos que más pesan en las ventas

El embudo de los últimos 28 días, con fuentes separadas (no se mezclan unidades):

| Eslabón | Dato | Fuente y período |
|---|---|---|
| Impresiones en Google | 1.840, de las cuales ~500 son búsquedas de otra marca "Kappa" (0 clics) | Search Console, 26/10 al 22/11 |
| Clics desde Google | 48 (CTR 2,6 %, posición media 5,9) | Search Console, 26/10 al 22/11 |
| Sesiones reales en el sitio | 225 (174 usuarios), de ellas 82 orgánicas y 26 desde asistentes de IA | GA4, 28/10 al 24/11, solo `tallerkappa.com.ar` |
| Interés en producto | 47 `select_item` (25 personas), 9 `add_to_cart` (4 personas) | GA4, ídem |
| Clic en WhatsApp | 17 `whatsapp_click` (15 personas); 0 presupuestos enviados desde el carrito | GA4, ídem |
| Perfil de Empresa | 211 pedidos de "cómo llegar", 20 clics al sitio, 3 llamadas | Perfil de Empresa, jun a nov 2026 |
| Conversación real, presupuesto, venta | **No se mide en ningún lado** | — |

1. **La búsqueda del BKF se cayó y el sitio no tiene autoridad para sostenerla.**
   Las impresiones de búsquedas con "bkf" pasaron de 325 (5 al 30/10) a 57
   (31/10 al 23/11). `/bkf/`, la página que Google usa para esas búsquedas, bajó
   del borde de la primera página a la segunda: "silla bkf" de 79 a 4
   impresiones, "sillon bkf" de 65 a 5 (posición 14). El sitio tiene **3 enlaces
   externos desde 2 sitios** (infobel y una guía de mantenimiento) y 2 reseñas,
   contra Mercado Libre, Wikipedia y tiendas con precio. Con todo indexado y
   Lighthouse en 96-100, el freno es de autoridad y confianza, no técnico. No se
   tocó `/bkf/`: su título cambió el 31/10 y hubo cuatro despliegues después;
   cambiarlo otra vez impediría saber qué funcionó (ver C §3).
2. **Las consultas salen de las páginas para empresas, no del BKF.** De los 17
   clics a WhatsApp, 12 salieron de páginas para locales: `/mobiliario-comercial/`
   (6, con 81 vistas), la Base de Mesa Flat y su categoría (4) y `/proyectos/` (2).
   `/sillon-bkf/` generó 1 con 97 vistas. Además, para "fábrica de bases de hierro
   para mesas" el sitio ya está arriba (posición media 2,2). El canal B2B es el que hoy
   convierte, y las búsquedas de bases ("base de mesa de hierro", "base para mesa
   de bar") tienen demanda y no las ganamos. → Se implementó (B2).
3. **La medición estaba contaminada y no responde "qué página vende".** El 27 %
   de las páginas vistas de GA4 (234 de 880) venían de `localhost` y `127.0.0.1`:
   pruebas automáticas y Lighthouse de sesiones anteriores. Inflaban "Directo"
   (16,6 % de interacción, 5 s por sesión) y bajaban la tasa de conversión real:
   en orgánico hubo 9 clics a WhatsApp en 82 sesiones. Tampoco hay dimensiones
   personalizadas registradas: GA4 recibe `location` e `item_name` pero no los
   muestra. → Se corrigió el código (B1); registrar las dimensiones requiere tu
   permiso (G).
4. **El Perfil de Empresa está verificado pero incompleto, y es el canal local
   más usado.** Hubo 211 pedidos de "cómo llegar" desde el perfil, pero figura el
   teléfono viejo (011 4753-0099: 3 llamadas en 6 meses), el horario abre a las 8
   (el sitio dice 9), el enlace al sitio no tiene UTM (sus visitas se confunden
   con el orgánico) y tiene 2 reseñas. No se pudo verificar cuántas fotos propias
   tiene; el sitio no tiene ninguna del taller. Todo eso se arregla en una hora y
   sin código.
5. **Para quien compra un BKF, la comparación se corta en el precio.** Las cinco
   fuentes de BKF relevadas (ProyectoBKF, Calmachicha, El Grito, Enecueros y
   Mercado Libre) publican precio, cuotas o descuento por transferencia
   (ProyectoBKF $599.000 a $798.000 en cuero; Mercado Libre, mediana de $398.998
   en "sillón bkf cuero"). Taller Kappa publica garantía de por vida en la
   estructura, fábrica con showroom y medidas a pedido, que nadie más ofrece,
   pero quien busca "comprar" no llega a leerlo. Publicar un "desde $X" con fecha
   es decisión tuya (G); el sitio ya lo soporta.

## B. Mejoras implementadas

| # | Commit | Qué cambia | Archivos | Para qué |
|---|---|---|---|---|
| B1 | `78fc62d` | GA4 solo se carga en `tallerkappa.com.ar` (y `www.`). Antes también en el build servido en local | `src/lib/analytics.js`, `tests/unit/analytics.test.mjs`, `tests/e2e/analytics.test.mjs`, `package.json` | Que usuarios, sesiones y tasa de conversión sean reales. Desde el deploy, "Directo" deja de sumar pruebas |
| B2 | `235e28b` | **Base de Mesa Flat:** bloque "por cantidad para bares, restaurantes y franquicias" con la entrega a YPF Full, las condiciones mayoristas ya publicadas y un WhatsApp que pide rubro, cantidad y altura, color y zona (`location: ficha_empresas`); título orientado al uso ("Base de Mesa de Hierro para Bar y Restaurante"); dos preguntas (mesa alta o barra, si trae tapa) | `src/data/products.js`, `src/pages/Producto.jsx`, `src/components/ProductBuy.jsx` | Que la página B2B que mejor convierte muestre la prueba y facilite pedir varias. Entrar en "base de mesa de hierro" y "base para mesa de bar" |
| B2 | `235e28b` | **Categoría mesas:** pregunta sobre bases por cantidad para locales; su WhatsApp pedía precios de "mesas" (no se venden) y ahora dice "bases de mesa" | `src/data/products.js` (`quoteLabel`), `src/pages/Categoria.jsx` | Consultas más claras y respuesta para la búsqueda B2B donde ya salimos primeros |
| B2 | `235e28b` | **Mobiliario comercial:** sección y pregunta para mueblerías, fabricantes y estudios de arquitectura (estructuras de hierro por encargo, se puede pedir solo la estructura), con WhatsApp propio (`location: mc_estructuras`) | `src/pages/MobiliarioComercial.jsx`, `src/data/contact.js`, `src/data/business.js` | Nombrar a tres segmentos B2B que el sitio no mencionaba, en la página que más convierte, sin crear una URL nueva |
| B3 | `e289046` | FAQ general "¿Venden al por mayor?": menciona las estructuras por encargo | `src/data/faq.js` | Esa respuesta también va a `llms.txt`, que leen los asistentes de IA (26 sesiones y 3 de los 17 WhatsApp del período) |
| — | — | Traducciones al inglés de todos los textos nuevos | `src/i18n/en.js` | El modo EN no muestra restos en español |
| — | (docs) | Este informe, la planilla de consultas, `CONTEXTO_PROYECTO.md` §5o y `docs/tareas-pendientes.md` | `docs/` | — |

Qué **no** se hizo y por qué:

- **Ninguna página nueva.** "Estructuras metálicas para muebles" no aparece en las
  sugerencias de Google (lo que se busca es "estructuras metálicas para techos",
  "galpones"…), así que una URL propia no tiene evidencia de demanda. Quedó como
  sección de `/mobiliario-comercial/`. Si en 6-8 semanas Search Console muestra
  impresiones para esas búsquedas y hay fotos de estructuras, se evalúa (plan, día 60).
- **No se tocaron `/bkf/`, `/sillon-bkf/` ni la home** (títulos, textos, orden):
  sin evidencia de que el problema sea on-page (A1).
- **No se publicó precio, plazo, stock, cuotas ni descuentos.**
- **No se tocó GA4 ni el Perfil de Empresa:** son configuraciones de cuenta y
  requieren tu autorización (G).

**Beneficio esperado (hipótesis, se mide en GA4 desde el deploy):** más
`whatsapp_click` desde la ficha de la base y desde mobiliario comercial
(`location` `ficha_empresas` y `mc_estructuras`), mensajes que llegan con cantidad
y medidas, e impresiones nuevas para "base de mesa de hierro" y "base para mesa
de bar" en 4-6 semanas. Ninguna está demostrada todavía.

## F. Validación técnica

| Prueba | Resultado |
|---|---|
| `npm run build` | 15 rutas + 404.html, sitemap con 15 URLs, `llms.txt`, sin avisos de la validación SEO/GEO (canonical, un h1, títulos y descripciones únicos y de largo correcto, JSON-LD con todos sus `@id`, enlaces rotos, páginas huérfanas, imágenes) |
| JSON-LD | `Product` (base), `FAQPage` (base 4 preguntas, categoría 3, mobiliario 8) y `Service` parsean y llevan los textos nuevos |
| `npm run test:unit` | 22/22 (2 nuevas: `isProductionHost`) |
| `npm run test:e2e:conversion` (Chrome 157) | 11/11. Nuevas: GA4 no se carga en `127.0.0.1` y sí en el dominio (mapeado a local, sin enviar nada a Google); mensajes de WhatsApp de la base por cantidad, de estructuras y de la categoría; la barra fija se esconde junto al bloque para locales |
| Las pruebas nuevas detectan el problema | Con el `analytics.js` de `main` falla la prueba de `127.0.0.1`; sin el cambio en `ProductBuy.jsx`, falla la de la barra fija |
| React Doctor (`--scope changed`) | 96/100, sin problemas |
| Lighthouse 12 móvil, local, mediana de 3 (`main` → rama, misma tanda) | Base Flat: rendimiento 97 → 96, accesibilidad 100 → 100, SEO 100 → 100, CLS 0 → 0. Mobiliario comercial: 97 → 97, 100 → 100, 100 → 100, CLS 0 → 0. Las corridas se superponen (TBT de 9 a 129 ms en ambas versiones): sin regresión medible |
| Visual | Capturas de los bloques nuevos a 360 y 1440 px; 0 px de desborde horizontal en 7 páginas; 0 errores de consola |
| Modo inglés | Sin textos en español en los bloques nuevos de las 3 páginas tocadas |

**No verificado:** el envío real de los WhatsApp (se verificó hasta el enlace
`wa.me`), Safari y Firefox, las pruebas de reglas de Firestore y del panel con
emulador (necesitan Java; no se tocaron reglas ni panel) y nada contra
producción, porque la rama no está publicada.

**Riesgos:**
- El título nuevo de la base saca "Taller Kappa" para no pasar de 70 caracteres
  (Google muestra el nombre del sitio aparte) y deja "Buenos Aires" al final; el
  h1 sigue igual. Si en 4 semanas la página pierde impresiones, se vuelve atrás.
- "Se puede pedir solo la estructura" sale de tu descripción del Perfil de
  Empresa y del encargo. Confirmalo antes de publicar (G).
- Desde el deploy, Lighthouse en local ya no incluye el costo de GA4: las
  mediciones locales pueden dar un poco mejor que producción.

## G. Pendientes del propietario

Solo lo que requiere información o autorización tuya. El detalle y el orden
están en [`docs/tareas-pendientes.md`](../tareas-pendientes.md), sección del 25/11.

1. **Revisar y publicar la rama** (merge a `main`; el deploy es automático).
2. **Autorizar (o hacer) dos configuraciones de cuenta:** registrar 7
   dimensiones personalizadas en GA4 (lista en [`medicion.md`](medicion.md) §3) y
   corregir el Perfil de Empresa (teléfono, horario, enlace con UTM, productos,
   fotos; detalle en [`estrategia-comercial.md`](estrategia-comercial.md) §4).
3. **Confirmar datos:** qué teléfono va en Google (11 6124-2498 o el
   011 4753-0099), horario real (¿8 o 9?), si se vende la estructura sola, y una
   sola frase de plazo de entrega (el sitio dice "depende del stock"; la
   documentación vieja dice "5 a 10 días hábiles").
4. **Decidir precio "desde"** del sillón, el banco y la base, con fecha de
   vigencia, y qué medios de pago o descuentos se pueden publicar.
5. **Fotos reales:** producto, taller trabajando y locales equipados (con permiso).
6. **Anotar cada consulta** en [`registro-consultas.csv`](registro-consultas.csv)
   (2 minutos por consulta): sin eso no hay forma de saber qué vende.
7. **Pedir reseña a todos los clientes** que reciben un mueble
   (`https://tallerkappa.com.ar/resena/`).
8. **Condiciones para revendedores** (mueblerías): si hay precio por volumen o
   mínimo de compra.

## Skills usadas

Se revisó la lista de skills instaladas del entorno y `skills-lock.json`. Todas
las candidatas que importaban ya estaban instaladas, así que no hizo falta
buscar ni instalar nada nuevo con `find-skills`.

| Skill | Para qué sirvió |
|---|---|
| `chrome-browser` | Leer Search Console, GA4 y el Perfil de Empresa con la sesión del dueño (solo lectura), relevar SERPs, sugerencias de Google y sitios de la competencia |
| `analytics` | Criterio de calidad de datos (que llevó a detectar el tráfico de `localhost`), tasas con la misma ventana, UTM en minúsculas y con guiones, sin datos personales |
| `cro` | Orden de análisis por página; llevó a mostrar la prueba (YPF Full) y la salida por cantidad junto a la base, y a no competir con el CTA principal de la ficha |
| `copywriting` | Edición puntual respetando la voz del sitio; solo afirmaciones ya publicadas y sin muletillas de IA |
| `seo-audit` (+ `local-seo`, `rankings-push`) | Separar autoridad de problemas on-page; no reescribir páginas que ya rankean sin causa identificable; cambios de ficha del Perfil de Empresa campo por campo |
| `react-doctor` | Control de regresión del código cambiado: 96/100, sin problemas |

Disponibles y no usadas: `seo` y `schema` (el SEO técnico y el JSON-LD ya
validan en cada build), `web-perf` y `core-web-vitals` (Lighthouse 96-100, sin
datos de campo de Core Web Vitals por bajo tráfico), `frontend-design`,
`web-design-guidelines` y `ui-ux-pro-max` (no hubo rediseño),
`vercel-react-best-practices` (los cambios de React fueron un componente
presentacional sin datos ni efectos; React Doctor cubrió la revisión), `ai-seo`
(`llms.txt` y el canal de IA ya existían; solo se amplió la FAQ).
No hay skills llamadas `technical-seo`, `local-seo`, `content-seo` ni
`marketing`: lo local y lo técnico están dentro de `seo-audit`.
