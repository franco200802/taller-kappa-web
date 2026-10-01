# Auditoría de recuperación SEO

> Fecha: 1/10/2026. Alcance: por qué el sitio perdió presencia para búsquedas como
> "BKF comprar Buenos Aires" y qué se corrigió. Método: historial de git completo
> (154 commits), reconstrucción de la última versión estática (14/9) y comparación
> con producción en vivo (`curl`, varios user-agents). **No hay datos de Search
> Console**, así que no se puede probar *cuándo* cayó cada URL ni *cuánto* aportó
> cada causa; lo que sigue es evidencia del código y del sitio publicado.

## 1. Línea de tiempo de lo que cambió

| Fecha | Cambio | Efecto sobre Google |
|---|---|---|
| ene-ago 2026 | Sitio estático con URLs `.html` (`/sillon-bkf.html`, `/catalogo.html`…) | Etapa estable: es la URL que Google aprendió |
| 9/8 | Hosting migrado a GitHub Pages; se quitan precios y pago online (jul-ago) | Se pierden señales comerciales ("comprar", precio) |
| 14/9 14:37 | Migración a React. El deploy copia `index.html` a `404.html` | **Toda URL que no era la home respondía HTTP 404** (incluidas las `.html` indexadas) |
| 15/9 09:28 | Deploy "pre-renderiza" copiando el HTML a cada ruta | Por minutos: 9 URLs con el mismo title y canonical a la home |
| 15/9 09:48 | Prerender real; sitemap con URLs **sin barra** | El canonical apunta a una URL que GitHub Pages redirige (301) a la versión con barra |
| 15/9 10:06 | Título de la home pasa de "Sillón BKF Buenos Aires \| Sillas de Hierro y Cuero…" a empezar con la marca; `/sillon-bkf` pierde "Original" | Se pierde la frase exacta que ya posicionaba |
| 15/9 | Se eliminan reviews/aggregateRating inventados (correcto) | Se pierden estrellas en los resultados |
| 29/9 | Rediseño; canonical con barra final; renombre de fotos; stubs de redirección para las `.html` | 15 días de 404 en las URLs viejas; tercer esquema de URL en 15 días; las fotos viejas pasan a 404 |
| 1/10 | Fase 2 de SEO (mía): títulos de `/sillon-bkf/` y catálogo pasan a "Argentina" | **Regresión: se quita "Buenos Aires" del título y H1** de las páginas principales |

## 2. Matriz de causas (A–Q)

| | Causa | Veredicto | Evidencia |
|---|---|---|---|
| A | Desindexación | **Probable** (sin confirmar en GSC) | 8 URLs `.html` dieron 404 del 14/9 al 29/9; el resto de las URLs (excepto la home) dieron 404 hasta el 15/9 |
| B | Cambio de canonical | **Sí** | `.html` → sin barra (que redirigía) → con barra, en 15 días |
| C | Cambio de URL | **Sí** | 8 páginas y 3 imágenes cambiaron de URL |
| D | Duplicación | Parcial | Minutos del 15/9; hoy: `http://` responde 200 (duplica `https://`) |
| E | Canibalización | **Sí, corregida** | El Sillón BKF tenía dos páginas comerciales (landing y ficha), la ficha con más enlaces |
| F | Pérdida de contenido | **Sí, corregida** | La home vieja tenía "Comprar en Taller Kappa es simple y seguro", zonas y un enlace al Sillón BKF que ya no estaban |
| G | Pérdida de enlaces internos | **Sí, corregida** | La primera pantalla de la home no enlazaba al Sillón BKF; los anchors hacia la landing eran casi idénticos |
| H | Renderizado | Descartada hoy | El HTML trae el contenido sin JavaScript (prerender). Fue un problema solo del 14-15/9 |
| I | robots.txt | Descartada | Permite todo salvo `/admin`; Googlebot, Googlebot-Image y Bingbot reciben 200 completo |
| J | Sitemap | Parcial, ya resuelto | Del 14/9 al 29/9 listaba URLs que no eran las canónicas. Hoy: solo canónicas |
| K | Dominio/canonical | Descartada | `www` → apex con 301; mismo dominio. (Aviso: `http://` no redirige a `https://`) |
| L | Estructura | **Sí** | Sitio estático multipágina → SPA prerenderizada + categorías |
| M | Title/H1 | **Sí, corregida** | Ver línea de tiempo; se restauró el patrón "…Buenos Aires" |
| N | Intención | **Sí** | Se quitó la compra online y los precios; la intención "comprar" ya no estaba respondida |
| O | Autoridad | No medible | Los enlaces a las URLs `.html` hoy pasan por una redirección "blanda" (meta refresh) |
| P | SERP | No medible | Sin datos |
| Q | Otro | **Sí, corregida** | Las fotos viejas (`bkf1.jpg`, `bkfapoyapies.jpg`, `mesa.jpeg`), indexadas en Google Imágenes con títulos "…Buenos Aires — Taller Kappa", daban 404 desde el 29/9 |

Descartado además: ningún `noindex`/`X-Robots-Tag` en las páginas indexables;
Cloudflare solo bloquea rastreadores de *entrenamiento* de IA (GPTBot, ClaudeBot,
CCBot…) y deja pasar a los de búsqueda y a todos los de Google.

## 3. Qué se cambió

- **Una sola URL para el Sillón BKF:** `/sillon-bkf/` es ahora la landing comercial
  y *la* página del producto (Product, FAQ, ficha técnica). `/catalogo/sillon-bkf-premium/`
  quedó como redirección (canonical + meta refresh) con el título de la landing, fuera
  del sitemap. Todos los enlaces del catálogo, categoría, home y guía apuntan a la landing.
- **Landing comercial** reescrita con datos reales: qué es, dónde comprarlo, quién lo
  fabrica y dónde, cómo comprar (4 pasos, sin pago online), plazos y retiro por zona
  (San Martín, CABA, GBA, interior), materiales, medidas, colores, terminaciones, uso
  residencial y comercial, garantía, personalización, y 9 preguntas (incluye "¿Quién
  fabrica sillones BKF en Buenos Aires?" y "hierro macizo vs tubo").
- **Títulos/H1 con "Buenos Aires"** donde había que restaurarlos (landing, catálogo,
  categorías, fichas, mobiliario comercial, nosotros, home).
- **Home:** el botón principal ahora lleva al sillón BKF; vuelve la sección "Comprar
  en Taller Kappa: cómo funciona" con zonas de entrega.
- **Enlazado:** anchors variados hacia la landing (ya no repiten "sillón BKF en
  Argentina"); zonas de entrega en el footer; `areaServed` con zonas de GBA.
- **Redirecciones:** las páginas puente muestran el título y la description de la página
  de destino (antes decían "Taller Kappa") y el build falla si un destino no existe.
- **Imágenes:** se restauraron `bkf1.jpg`, `bkfapoyapies.jpg` y `mesa.jpeg` (idénticas
  byte a byte a las originales, MD5 verificado). Nota: `bkf1.png` y `bkfapoyapies.png`
  nunca existieron (error del sitemap viejo corregido el 15/9).
- **Presupuesto (sin compra online):** el pedido llega a WhatsApp ordenado, con nombre
  y zona opcionales.

## 4. Mapa query → URL principal

Una intención = una URL principal. La segunda columna es la *única* que debe disputar esa búsqueda.

| Query | URL principal | Title | H1 | Intención |
|---|---|---|---|---|
| sillón BKF · sillón BKF Buenos Aires · comprar sillón BKF · BKF comprar Buenos Aires · comprar BKF Buenos Aires · sillón BKF cuero · sillón BKF hierro | `/sillon-bkf/` | Sillón BKF Buenos Aires: Comprar Directo de Fábrica | Taller Kappa | Sillón BKF de hierro y cuero, fabricado en Buenos Aires | Comercial / transaccional (por presupuesto) |
| BKF · qué es BKF · silla BKF historia · sillón mariposa | `/bkf/` | Qué es el sillón BKF: historia y características | Sillón BKF: qué es, historia y características | Informativa |
| fábrica BKF Buenos Aires · Taller Kappa | `/` | Fábrica de Sillón BKF y Muebles de Hierro \| Taller Kappa, Buenos Aires | Sillones BKF y muebles de hierro en Buenos Aires | Navegacional / marca |
| muebles de hierro Buenos Aires · muebles de hierro y cuero | `/catalogo/` | Muebles de Hierro y Cuero en Buenos Aires \| Catálogo | Muebles de hierro y cuero en Buenos Aires: … | Comercial (explorar) |
| muebles San Martín Buenos Aires · fábrica de muebles San Martín | `/nosotros/` (+ `/contacto/`) | Fábrica de Muebles de Hierro, San Martín, Buenos Aires | Una fábrica de muebles de hierro en San Martín | Local |
| sillones/bancos BKF (plural) | `/catalogo/asientos/` | Sillones y Bancos BKF en Buenos Aires | Sillones y bancos BKF de hierro y cuero | Comercial (categoría) |
| banco BKF · banqueta BKF | `/catalogo/banco-bkf/` | Banco BKF de Hierro y Cuero en Buenos Aires | Banco BKF | Comercial (producto) |
| base de mesa de hierro | `/catalogo/mesas/`, `/catalogo/base-de-mesa-flat/` | Bases de Mesa de Hierro en Buenos Aires | … | Comercial |
| mobiliario comercial · muebles para comercios/locales | `/mobiliario-comercial/` | Mobiliario Comercial de Hierro en Buenos Aires | Mobiliario comercial de hierro a medida | Comercial B2B |

**Conflictos que persisten, aceptados con razón:** la home y el catálogo comparten
"muebles de hierro" (la home es el hub de la marca; el catálogo es el principal para esa
búsqueda); `/catalogo/asientos/` y `/sillon-bkf/` comparten "sillón BKF" (una es la
categoría para comparar y la otra el producto).

## 5. Qué revisar manualmente en Search Console

1. **Páginas → "No indexadas"**: buscar `/sillon-bkf.html`, `/catalogo.html`… ("No se
   encontró (404)", "Página con redirección"), y `/catalogo/sillon-bkf-premium/`.
2. **Inspección de URL** de `/sillon-bkf/` y de la home: ver la **URL canónica
   seleccionada por Google** (debe ser la misma) y el **título indexado** (hoy Google
   muestra el viejo "Sillón BKF Buenos Aires" en la home). Pedir indexación.
3. **Rendimiento → Páginas**, con comparación de fechas: **antes y después del
   14/9, del 29/9 y del 1/10**. Mirar qué URLs perdieron clics e impresiones y para
   qué consultas.
4. **Rendimiento → Consultas**: filtrar "bkf", "sillón bkf buenos aires", "comprar",
   "muebles de hierro", "san martín". Anotar posición y CTR de cada una *antes* de
   esta publicación.
5. **Informes de Sitemaps**: que `sitemap.xml` figure con 15 URLs descubiertas.
6. **Imágenes**: Rendimiento → tipo de búsqueda "Imágenes": ¿caída desde el 29/9?
7. **Experiencia → Core Web Vitals** (tarda semanas en tener datos de campo).
8. **Acciones manuales y Seguridad**: deben estar vacías.

## 6. Qué monitorear las próximas semanas

- Semana 1-2: que Google tome el nuevo título de la home y de `/sillon-bkf/`; que
  las URLs `.html` pasen a "Página con redirección"; que `/catalogo/sillon-bkf-premium/`
  se consolide en `/sillon-bkf/`.
- Semana 2-6: clics e impresiones de las consultas objetivo; posición de `/sillon-bkf/`
  (una sola URL debería aparecer para "sillón BKF Buenos Aires").
- Evento `whatsapp_click` y `ai_referral` en GA4.

## 7. Riesgos que quedan

- Las redirecciones son páginas con meta refresh, no un 301 real: Google las trata como
  redirección permanente, pero traspasa la autoridad más despacio. La solución es una
  regla de Cloudflare (abajo).
- `http://` responde 200 sin redirigir a `https://`.
- Sin datos de Search Console no se sabe cuánta autoridad se perdió ni cuánto tarda en
  volver; no se promete una posición.
- Sin precio publicado no se compite en consultas de "precio".
- Las fotos de producto son generadas con IA (marca ✦ visible): conviene reemplazarlas.

## 8. Acciones externas (Cloudflare)

1. **Always Use HTTPS** (hoy `http://` responde 200).
2. **Redirecciones 301 reales** (Reglas → Redirect Rules), una por URL antigua:

   | Desde | Hacia |
   |---|---|
   | `/sillon-bkf.html` y `/sillon-bkf` | `/sillon-bkf/` |
   | `/catalogo/sillon-bkf-premium` y `/catalogo/sillon-bkf-premium/` | `/sillon-bkf/` |
   | `/catalogo.html` y `/catalogo` | `/catalogo/` |
   | `/nosotros.html`, `/faq.html`, `/contacto.html`, `/proyectos.html`, `/envios.html`, `/garantia.html` (y sin extensión) | la misma ruta con barra final |

3. Caché de `/assets/*` e `/images/*` con TTL largo (hoy `max-age=600`).
4. Decidir si se quiere bloquear a los rastreadores de entrenamiento de IA (hoy
   GPTBot, ClaudeBot y otros reciben 403; los de búsqueda y asistentes pasan).
5. Desactivar la ofuscación de email.
