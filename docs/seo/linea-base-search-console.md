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
| Alternativa con canónica adecuada | 1 | Sin detalle revisado |

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
