# Línea base de Search Console

> Fecha de captura: 17/10/2026. Propiedad de dominio `tallerkappa.com.ar`
> (verificada ese día por registro TXT en DNS; **no borrar ese registro**).
> Período de los datos: 15/7/2026 a 14/10/2026 (3 meses, es lo que muestra
> Search Console). Sirve para comparar dentro de 2 a 6 semanas, que es lo que
> pide `recuperacion-seo.md` §5-6. Todo lo de abajo se copió de la interfaz de
> Search Console; no hay cifras estimadas.

## 1. Totales (tipo de búsqueda: Web)

| Métrica | Valor |
|---|---|
| Clics | 39 |
| Impresiones | 1,3 mil |
| CTR medio | 3 % |
| Posición media | 6,7 |

## 2. Páginas (clics / impresiones, 10 primeras de 20)

| URL | Clics | Impresiones |
|---|---|---|
| `/` | 29 | 773 |
| `/bkf/` | 3 | 375 |
| `/catalogo/mesas/` | 3 | 14 |
| `/catalogo.html` (URL vieja) | 1 | 49 |
| `/nosotros.html` (URL vieja) | 1 | 41 |
| `/catalogo/asientos/` | 1 | 36 |
| `/nosotros/` | 1 | 34 |
| `/contacto/` | 1 | 23 |
| `/faq.html` (URL vieja) | 0 | 38 |
| `/sillon-bkf/` | 0 | 24 |

Lectura: la home concentra casi todos los clics. `/sillon-bkf/`, la página
comercial principal, casi no tiene impresiones todavía. Tres de las diez
primeras son URLs `.html` viejas, que ahora redirigen con 301.

## 3. Consultas (clics / impresiones / CTR / posición, 10 primeras de 47)

| Consulta | Clics | Impresiones | CTR | Posición |
|---|---|---|---|---|
| kappa | 0 | 258 | 0 % | 6,8 |
| kappa argentina | 1 | 100 | 1 % | 4,6 |
| kapa | 0 | 32 | 0 % | 7,2 |
| sillon bkf | 1 | 30 | 3,3 % | 9,2 |
| silla bkf | 0 | 26 | 0 % | 10,7 |
| bkf | 0 | 19 | 0 % | 9,2 |
| bkf silla | 0 | 16 | 0 % | 9,7 |
| sillón bkf | 0 | 10 | 0 % | 9,0 |
| bkf sillon | 0 | 7 | 0 % | 5,0 |
| silla bkf original | 0 | 5 | 0 % | 10,0 |

Lectura: las consultas con más impresiones ("kappa", "kappa argentina", "kapa",
"locales de kappa") parecen búsquedas de otra marca llamada Kappa, no de
clientes del taller. Esto es una inferencia a partir de los textos; Search
Console no lo confirma. Las consultas que sí importan (`sillon bkf`, `silla bkf`,
`bkf`) están entre las posiciones 9 y 11, es decir, en el borde de la primera
página, con muy pocas impresiones.

## 4. Indexación (informe de Páginas)

| Estado | Páginas |
|---|---|
| Indexadas | 13 |
| No indexadas | 12 |

Motivos de las 12 no indexadas:

| Motivo | Páginas | Qué es |
|---|---|---|
| Página con redirección | 9 | URLs `.html` viejas. Esperado |
| No se ha encontrado (404) | 2 | `/cdn-cgi/l/email-protection` (rastreada el 6/10, residuo de la ofuscación de email de Cloudflare, ya apagada) y `http://tallerkappa.com.ar/garantia.html` (rastreada el 23/9, ahora redirige con 301) |
| Alternativa con canónica adecuada | 1 | `http://tallerkappa.com.ar/` (rastreada el 11/10): la versión sin HTTPS. Desde el 17/10 redirige con 301 a `https://`, así que es esperable que desaparezca |

**`/mobiliario-comercial/` sin indexar:** se revisó el 17/10 y está bien
técnicamente: título y descripción propios, canonical a sí misma, `index,
follow`, presente en el sitemap, enlazada desde todas las páginas del sitio
(menú y footer) y con unas 1.000 palabras. Se publicó el 1/10, así que a los 16 días es
normal que Google la tenga "descubierta" sin haberla rastreado todavía. Se pidió
la indexación. Si el 31/10 sigue sin indexar, revisar si Google la considera
demasiado parecida a `/catalogo/`.

## 5. Inspección de URLs (17/10/2026)

| URL | Estado en Google | Nota |
|---|---|---|
| `/` | Indexada, con problemas | Último rastreo 13/10. Fragmentos de producto: 3 elementos no válidos |
| `/sillon-bkf/` | Indexada, con problemas | Último rastreo 4/10. Google la eligió como su propia canónica. Fragmentos de producto: 1 no válido |
| `/bkf/` | Indexada, con problemas | |
| `/catalogo/` | Indexada, con problemas | |
| `/catalogo/asientos/` | Indexada, con problemas | |
| `/catalogo/mesas/` | Indexada, con problemas | |
| `/mobiliario-comercial/` | **No está en Google** | Descubierta, actualmente sin indexar |

"Con problemas" aquí es la mejora de fragmentos de producto (falta `price`),
prevista en `seo-google-fase-3.md` §7 y no es una penalización.

Indexación solicitada el 17/10/2026 para las 7 URLs de la tabla. Sitemap
`https://tallerkappa.com.ar/sitemap.xml` enviado el mismo día: estado Correcto,
15 páginas descubiertas.

## 5b. GA4 (propiedad `G-2FDMN51XDY`, 19/9 a 16/10/2026)

| Evento | Eventos | Usuarios |
|---|---|---|
| `page_view` | 541 | 202 |
| `first_visit` | 198 | 198 |
| `ai_referral` | 26 | 21 |
| `whatsapp_click` | 13 | 10 |
| `select_item` | 10 | 8 |
| `404_not_found` | 2 | 1 |

Total: 203 usuarios. `ai_referral` alcanza ~10 % de los usuarios. 
Hasta el 17/10 `whatsapp_click` (la conversión del sitio) no estaba marcado
como evento clave: los eventos clave eran `close_convert_lead`, `purchase` y
`qualify_lead`, y ninguno recibía datos. **El 17/10 se marcó `whatsapp_click`
como evento clave**; GA4 lo cuenta como conversión desde esa fecha, no hacia
atrás.

## 5c. Lighthouse en producción (17/10/2026, celular emulado 412 px, red 4G lenta simulada)

| Página | Rendimiento | Accesibilidad | Buenas prácticas | SEO | LCP | CLS | TBT |
|---|---|---|---|---|---|---|---|
| `/bkf/` | 95 | 100 | 100 | 100 | 2,6 s | 0 | 40 ms |
| `/sillon-bkf/` | 92 | 100 | 100 | 100 | 2,9 s | 0 | 60 ms |

El LCP es el párrafo de introducción (texto), no una imagen: casi todo es
"render delay" de la simulación. Sin limitar la red, CSS (10 KiB), JS
(80 KiB) y la fuente (89 KiB) terminan de bajar antes de 0,9 s. Lo único que
quedaría es aligerar la fuente, con una ganancia de décimas solo en
laboratorio; no se hizo porque Google usa datos de campo (CrUX), que este
sitio todavía no tiene en volumen. Ningún elemento se sale del ancho en
celular (captura completa de Lighthouse).

## 6. Cambios de infraestructura hechos el mismo día (Cloudflare)

Redirecciones 301 reales, forzado de `http` a `https`, caché larga de
`/assets/`, `/images/` y `/fonts/`, y ofuscación de email apagada (detalle en
`cloudflare-paso-a-paso.md`). Todo lo medido después de esta fecha refleja esos
cambios más los del sitio.

## 7. Qué volver a medir

Repetir las mismas vistas con el mismo período de comparación (28 días contra el
período anterior) y anotar:

1. Que las URLs `.html` pasen de 404/redirección a "Página con redirección" y
   que `/cdn-cgi/l/email-protection` deje de aparecer.
2. Impresiones, clics y posición de `/sillon-bkf/` (hoy 24 impresiones, 0 clics).
3. Posición de `sillon bkf`, `silla bkf` y `bkf` (hoy entre 9,2 y 10,7).
4. Si `/mobiliario-comercial/` pasa a indexada.
5. Que la home deje de mostrar el título viejo en los resultados.
6. Cuántas de las impresiones corresponden a búsquedas de la otra marca Kappa
   frente a búsquedas de muebles, para no leer mal el CTR medio.
