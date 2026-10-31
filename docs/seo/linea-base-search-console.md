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

## 8. Primera medición: 31/10/2026

Últimos 28 días que muestra Search Console (4/10 a 28/10/2026) contra los 28
días anteriores. Copiado de la interfaz, sin estimaciones.

| Métrica | 28 días anteriores | Últimos 28 días |
|---|---|---|
| Clics | 8 | **46** |
| Impresiones | 112 | **1,82 mil** |
| CTR medio | 7,1 % | 2,5 % |
| Posición media | 6,4 | 6,9 |

El CTR y la posición bajan porque las impresiones se multiplicaron por 16 con
búsquedas nuevas (casi todas de "bkf"), no porque las de antes empeoraran.

**Páginas (28 días):**

| URL | Clics | Impresiones | CTR | Posición |
|---|---|---|---|---|
| `/` | 15 | 498 | 3 % | 6,3 |
| `/bkf/` | 12 | 944 | 1,3 % | 7,3 |
| `/mobiliario-comercial/` | 5 | 37 | 13,5 % | 7,6 |
| `/catalogo/mesas/` | 3 | 35 | 8,6 % | 8,3 |
| `/sillon-bkf/` | 2 | 90 | 2,2 % | 6,5 |
| `/catalogo/asientos/` | 2 | 88 | 2,3 % | 5,3 |
| `/contacto/` | 2 | 78 | 2,6 % | 5,7 |
| `/proyectos/` | 2 | 59 | 3,4 % | 5,8 |
| `/catalogo/` | 2 | 35 | 5,7 % | 9,9 |
| `/nosotros/` | 1 | 124 | 0,8 % | 6,1 |

**Consultas BKF (28 días):** `sillon bkf` 1 clic / 63 imp. / pos. 9,7;
`silla bkf` 0 / 73 / 10,1; `bkf` 0 / 48 / 8,4; `bkf silla` 0 / 31 / 8,8;
`bkf sillon` 0 / 22 / 5,6; `sillón bkf` 0 / 16 / 8,9; `sillones bkf` 0 / 11 / 13,2.
Las posiciones siguen en el borde de la primera página, igual que el 17/10.

**Respuestas a §7:**

1. Las URLs `.html` siguen como "Página con redirección" (ahora 10). Los dos 404
   (`/cdn-cgi/l/email-protection` y `http://…/garantia.html`) siguen listados
   porque Google no los volvió a rastrear desde el 6/10 y el 23/9; no hace falta
   hacer nada.
2. `/sillon-bkf/`: 90 impresiones y 2 clics (antes 24 y 0), pero casi ninguna
   de las búsquedas BKF.
3. Ver tabla de consultas: sin cambio real de posición.
4. `/mobiliario-comercial/` **ya está indexada** y es la página con mejor CTR
   (13,5 %). La que quedó "Descubierta, sin indexar" desde el 20/10 es
   `/catalogo/base-de-mesa-flat/` (está en el sitemap, Google no la rastreó).
   Se pidió su indexación el 31/10 ("Se ha solicitado la indexación").
5. Sin verificar en esta medición.
6. Las consultas de la otra marca Kappa (`kappa`, `kappa argentina`, `kapa`,
   `locales kappa`, etc.) suman unas 350 impresiones y ningún clic.

Indexación: 14 páginas indexadas (antes 13) y 13 sin indexar (10 redirecciones,
2 404, 1 descubierta). Compras: 38 fragmentos de producto y 2 fichas de
comerciante no válidos, por falta de `price` (decisión del dueño, ver
`tareas-pendientes.md`).

**Hallazgo principal:** Google trata a `/bkf/` como la página del BKF para
todas las búsquedas, incluidas las de compra (944 impresiones contra 90 de
`/sillon-bkf/`). El título "Qué es el sillón BKF: historia y características"
no le habla a quien quiere comprar y el CTR queda en 1,3 %. Cambio aplicado el
31/10: el título pasa a "Sillón BKF: qué es, historia y dónde comprarlo" y la
descripción menciona que Taller Kappa lo fabrica y lo envía. **Próxima medición
(~28/11):** CTR de `/bkf/` en las consultas BKF y clics en el bloque de compra
(`data-cta="guia_bkf_top"` en GA4).
