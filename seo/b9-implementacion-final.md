# B9 — Implementación final

Fecha: 2026-10-06. Base: `15ae277` → HEAD al cerrar este documento.
Criterio: implementar solo lo respaldado por B9, el repo o decisiones confirmadas. No se inventaron datos.

## Implementado

| Bloque | Cambio | Commit |
|---|---|---|
| 1 Correcciones comerciales | Ninguna corrección: los 8 pendientes no tienen evidencia ni confirmación. Quedaron documentados con archivo y línea en `seo/b9-pendientes-propietario.md` | `5165a5d` |
| 2 SEO on-page | `/sillon-bkf/`: title nuevo ("Sillón BKF de Cuero en Buenos Aires \| Fábrica Taller Kappa"), meta nueva (fabricación, cuero, disponibilidad por WhatsApp, showroom con turno) y lead que explica qué es el BKF, quién lo fabrica y cómo consultar. Sin stock, plazos ni claims nuevos | `75a362d` |
| 4 Schema | `Offer.availability` eliminado: declaraba `InStock` para 3 productos mientras el sitio dice "Consultar disponibilidad" y el stock no está confirmado | `850f360` |
| 7 Medición | Nuevo evento `phone_click` para enlaces `tel:` (antes las llamadas no se medían). Se quitó la clave muerta `www.bing.com/chat` de `ai_referral` (nunca coincidía con un hostname) | `850f360` |
| Diagnóstico | `seo/diagnostico-bkf-buenos-aires-comprar.md` (recomendación F: datos de GSC antes de decidir) | `b139d8e` |

## No implementado (y por qué)

| Bloque | Motivo |
|---|---|
| 3 Enlazado interno | Verificado: las 15 páginas enlazan a `/sillon-bkf/`, `/bkf/`, `/contacto/`, `/envios/` y `/faq/`. Agregar más sería llenar de enlaces |
| 5 Indexación | Requiere Cloudflare: 10 redirecciones 301 y Always Use HTTPS (panel del propietario). Desde el código los stubs `.html` ya tienen canonical y refresh correctos. No se creó ninguna URL |
| 6 GEO | `llms.txt` ya se genera desde `business.js` y está sincronizado (CP 1650, showroom, retiro, horario). Sin cambios que B9 justifique |
| 7 Conversión | Sin datos de GA4 que muestren fricción; no se tocaron CTA ni eventos existentes |
| 8 Performance | Imágenes más pesadas ~240 KB, Firebase no se precarga en páginas públicas. Nada que optimizar con evidencia |
| Pendientes comerciales | Retiro "sin cargo", "Ricardo L.", `InStock`, "cotizamos en el día", bonificaciones, garantías/72 hs, "a medida sin cargo", claims de Proyectos |

## Decisiones SEO
- `/sillon-bkf/`: sigue siendo la única landing comercial del BKF. No cambió su URL.
- `/comprar-bkf-buenos-aires/`: **no se crea**. Esperar datos de GSC. El diagnóstico indica que el problema probable es intención de búsqueda, SEO local y autoridad, y una página nueva compartiría contenido con `/sillon-bkf/`.
- `/bkf-cuero/` y `/bkf-premium/`: **no se crean**. BKF de cuero = BKF Premium (confirmado por el propietario).

## Riesgos
- **Canibalización estructural** entre `/` y `/sillon-bkf/`: Bing muestra la home, no `/sillon-bkf/`. Sin confirmar en Google.
- **Indexación del dominio:** el índice de Bing/DuckDuckGo todavía muestra `.html` legacy y `http://`. Sin 301 reales ni HTTPS forzado.
- **NAP inconsistente:** Bing y directorios muestran 011 4753-0099 y 011 4755-6250; el sitio usa 11 6124-2498.
- **Sin datos:** no hay Search Console, GA4 ni Google Business Profile accesibles.
- **Schema sin `availability`:** los productos pierden esa señal hasta que el stock se confirme. Sin precio publicado, las ofertas ya no eran elegibles para resultados enriquecidos de producto.
- **Datos comerciales sin confirmar** siguen visibles en `/sillon-bkf/`, `/garantia/` y `/envios/`.

## Validación
- Build: OK. 15 rutas + 404, sitemap con 15 URLs, `llms.txt`, 9 redirecciones de URLs que cambiaron de lugar.
- `git diff --check`: OK en cada commit.
- Sin URLs nuevas: el sitemap sigue en 15 y las 3 candidatas dan 404.
- Schema: sin `availability` en `/sillon-bkf/`; sin Review/AggregateRating/precio/foundingDate/CUIT/sameAs nuevos. JSON-LD parseable.
- Canonical y robots: sin cambios (`index, follow`, canonical autorreferente, `Disallow: /admin`).
- GA4: `whatsapp_click` y demás eventos sin cambios; solo se agregó `phone_click`.

## Commits
`5165a5d`, `75a362d`, `b139d8e`, `850f360` (más el commit de este documento).

## Push
Todos los commits enviados a `origin/main`.

## Qué puede hacer el propietario para subir el valor del sitio
1. Verificar Search Console (dominio) y enviar el sitemap; marcar `whatsapp_click` como evento clave en GA4 y guardar capturas mensuales.
2. Cloudflare: Always Use HTTPS y 10 redirecciones 301 (`docs/seo/cloudflare-paso-a-paso.md`).
3. Crear o reclamar Google Business Profile y Bing Places con el mismo teléfono; fotos reales; reseñas reales.
4. Confirmar los 8 pendientes comerciales y decidir si se publica precio de lista.
5. Redes sociales activas y menciones o enlaces externos reales.
