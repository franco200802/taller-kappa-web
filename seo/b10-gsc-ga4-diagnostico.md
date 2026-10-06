# B10.1 — Diagnóstico GSC + GA4

Fecha: 2026-10-06 · Base: `main` @ `cd1b01d`. Solo investigación y documentación: no se modificó código, páginas, títulos, metas, schema, sitemap, robots ni enlaces.

> **Regla:** no hay datos inventados. Todo lo que requiere Search Console o GA4 figura como `SIN ACCESO` y se deja la tabla vacía para completar con la exportación. Lo verificable desde el entorno (HTTP público, canonical, sitemap) está marcado como tal.

## 1. Estado de acceso

| Plataforma | Acceso | Evidencia |
|---|---|---|
| Google Search Console | **NO** | Sin credenciales ni `gcloud` en el entorno, sin `.env`, sin tag/archivo de verificación en el repo. Solo el propietario o un usuario autorizado puede entrar |
| GA4 (`G-2FDMN51XDY`) | **NO** | Mismo motivo. Solo se conoce el ID de medición, que no da acceso a los datos |

**Acceso que falta:**
- GSC: propiedad `tallerkappa.com.ar` (preferible tipo **Dominio**, por DNS en Cloudflare), con permiso de lectura para el usuario que vaya a analizar, o los CSV exportados.
- GA4: rol Lector sobre la propiedad, o los informes exportados.

## 2. Estado de indexación

**Inspección de URL de Search Console: SIN ACCESO** (indexación, rastreo, canonical elegido por Google, última fecha de rastreo, mejoras). No es reemplazable por otras fuentes.

Lo que sí se comprobó por HTTP público (2026-10-06):

| URL | HTTP | Canonical declarado | Robots meta | En sitemap |
|---|---|---|---|---|
| `/` | 200 | `https://tallerkappa.com.ar/` | `index, follow` | Sí (`lastmod` 2026-10-06) |
| `/bkf/` | 200 | `https://tallerkappa.com.ar/bkf/` | `index, follow` | Sí |
| `/sillon-bkf/` | 200 | `https://tallerkappa.com.ar/sillon-bkf/` | `index, follow` | Sí |

Los tres son accesibles, autorreferentes y están declarados. **El canonical elegido por Google, la fecha de rastreo y si están en el índice: NO COMPROBABLE.**

Qué hacer para completarlo: en GSC → Inspección de URL, pegar cada una de las 3 URLs y registrar: "La URL está en Google" (sí/no), "Rastreo permitido", "Rastreada por última vez", "Canonical declarado por el usuario" y "Canonical seleccionado por Google", y la sección Mejoras.

## 3. Consultas BKF

`SIN ACCESO A GSC`. Tabla a completar (si una consulta no aparece: `Sin datos en GSC`):

| Consulta | Clics | Impresiones | CTR | Posición | URL |
|---|---:|---:|---:|---:|---|
| bkf buenos aires comprar | | | | | |
| bkf comprar buenos aires | | | | | |
| comprar bkf buenos aires | | | | | |
| sillon bkf buenos aires | | | | | |
| sillón bkf buenos aires | | | | | |
| comprar sillon bkf buenos aires | | | | | |
| comprar sillón bkf buenos aires | | | | | |
| bkf de cuero buenos aires | | | | | |
| bkf premium buenos aires | | | | | |
| fabricante bkf buenos aires | | | | | |
| fábrica bkf buenos aires | | | | | |
| donde comprar bkf | | | | | |
| dónde comprar bkf | | | | | |
| bkf argentina | | | | | |

**Cómo obtenerla:** Rendimiento → Resultados de búsqueda → Búsqueda web → Fecha: últimos 3 meses → Filtro de consulta "coincide con expresión regular":
`bkf|sill[oó]n bkf`
→ pestaña Consultas → exportar. Después, por consulta importante, clic en ella → pestaña Páginas para ver la URL.

**Consultas relacionadas descubiertas (parte 3):** `SIN ACCESO`. Al exportar, clasificar solo las relevantes en: marca (contiene `kappa`), producto (`sillón bkf`, `banco bkf`), comercial (`comprar`, `precio`, `fábrica`, `fabricante`), local (`buenos aires`, `san martín`, `villa lynch`, `zona norte`), informacional (`qué es`, `historia`, `medidas`). Filtros a aplicar por separado: `bkf`, `buenos aires`, `comprar`, `sill[oó]n`, `cuero`.

## 4. URLs posicionadas

`SIN ACCESO A GSC`.

| URL | Clics | Impresiones | CTR | Posición |
|---|---:|---:|---:|---:|
| `/` | | | | |
| `/bkf/` | | | | |
| `/sillon-bkf/` | | | | |
| `/catalogo/` | | | | |
| `/contacto/` | | | | |

Preguntas a responder con el export: qué URL tiene más impresiones BKF, más clics, mejor posición y recibe consultas comerciales; si `/sillon-bkf/` aparece.

**Observación no-GSC ya documentada** (`seo/diagnostico-bkf-buenos-aires-comprar.md`, Bing, puntual): aparecieron la home y `/catalogo/`; `/sillon-bkf/` no apareció en ninguna búsqueda. Eso **no equivale a Google** y no se usa como dato de este diagnóstico.

## 5. Canibalización

**Clasificación: sin evidencia (por falta de datos).** Es un riesgo estructural, no un hecho: la home, `/bkf/` y `/sillon-bkf/` comparten términos BKF. Para decidir hay que cruzar Consulta × Página en GSC.

Criterio a aplicar:
- **Sin evidencia:** una URL concentra las impresiones de la consulta, o solo hay una.
- **Posible:** dos URLs reciben impresiones de la misma consulta, pero una domina.
- **Probable:** dos URLs con impresiones relevantes y posiciones cercanas.
- **Confirmada:** la URL que Google muestra alterna en el tiempo, o ambas aparecen en el top 30 con posiciones que se mueven en conjunto.

## 6. Oportunidades en posiciones 4–10

`SIN ACCESO`. Se completa con: consultas BKF con posición promedio 4–10 y alto número de impresiones. Son las de mayor retorno inmediato.

## 7. Oportunidades en posiciones 10–30

`SIN ACCESO`. Se completa con consultas comerciales BKF en posición 10–30; indican necesidad de relevancia o autoridad, no solo de ajustes de título.

## 8. CTR

`SIN ACCESO`. Para consultas con muchas impresiones y CTR bajo, decidir la causa con este criterio:
- **Posición > 10:** el CTR bajo es esperable; el problema es de posición.
- **Posición ≤ 5 y CTR bajo:** revisar title y meta description.
- **Posición razonable y fragmento atractivo pero CTR bajo:** la competencia en la SERP (anuncios, mapa local, marketplaces) quita clics.

## 9. Evolución temporal

`SIN ACCESO`. Hay que comparar los últimos 3 meses con los 3 anteriores (clics, impresiones, CTR, posición), primero en total y luego para consultas BKF.

Dato del repo que condiciona la lectura: el sitio cambió su esquema de URLs 3 veces en unos 15 días (`CONTEXTO_PROYECTO.md §5e`), y la migración a React es reciente. Es de esperar una **caída o un quiebre en la serie** en ese período. Si GSC no tiene histórico suficiente, registrar la fecha en que empiezan los datos.

## 10. Tráfico orgánico GA4

`SIN ACCESO`. A consultar (Informes → Adquisición → Adquisición de tráfico, con dimensión primaria "Canal predeterminado" = Organic Search):
- Usuarios, sesiones, tiempo de interacción medio y tasa de interacción.
- Por página de destino: `/sillon-bkf/`, `/bkf/`, `/`.

Limitación técnica conocida (código): `gtag.js` se carga en la primera interacción o 3 segundos después de `load`, y el `page_view` es manual. Las visitas que se van antes no se registran, así que GA4 **subestima** las sesiones.

## 11. Eventos comerciales

`SIN ACCESO`. A consultar en Informes → Participación → Eventos:

| Evento | Estado en el código | Nota |
|---|---|---|
| `whatsapp_click` | Activo, con `location`, `page_path`, `item_name` | Estado de "evento clave" en GA4: **PENDIENTE DE VERIFICACIÓN** |
| `whatsapp_checkout` | Activo (`CartDrawer`) | Solo si se usa el presupuesto |
| `phone_click` | **Nuevo desde `850f360` (2026-10-06)** | No tiene histórico: antes no existía |
| `email_click` | Activo | |

Para cada uno: cantidad, página y procedencia (canal) cuando se pueda desglosar.

## 12. Funnel

Recorrido objetivo: Google → Organic Search → `/sillon-bkf/` → `whatsapp_click` → consulta comercial.

| Eslabón | Estado |
|---|---|
| Google → clic | `SIN ACCESO` (GSC) |
| Organic Search en GA4 | `SIN ACCESO` |
| Landing `/sillon-bkf/` | `SIN ACCESO` |
| `whatsapp_click` desde `/sillon-bkf/` | Medido en el código; `SIN ACCESO` a los datos |
| Consulta comercial → venta | **No medible desde la web.** Ocurre en WhatsApp y requiere que el propietario lleve el registro manual |

**Dónde falta información:** los cuatro primeros eslabones por falta de acceso; el último por diseño (la conversión real sucede fuera del sitio). Sugerencia de registro, sin modificar el sitio: anotar semanalmente cuántas consultas por WhatsApp llegaron y cuántas dijeron de dónde.

## 13. Problemas detectados (comprobados sin GSC/GA4)

1. **Sin acceso a GSC ni a GA4:** impide diagnosticar visibilidad y conversión con datos reales. Es el problema principal.
2. **`phone_click` sin histórico:** nace el 2026-10-06; hasta fin de mes no se puede comparar.
3. **Subconteo posible en GA4** por el retardo de carga de `gtag`.
4. **Indexación del dominio:** el diagnóstico previo observó `.html` legacy y `http://` en índices de Bing/DuckDuckGo; sin 301 reales ni HTTPS forzado (Cloudflare).
5. **NAP inconsistente** observado en Bing y directorios (otros teléfonos).
6. **Intención transaccional:** los competidores que aparecen para "comprar" tienen precio y compra online; Taller Kappa cotiza por WhatsApp.

## 14. Datos faltantes

- Todo el rendimiento de GSC (consultas, páginas, CTR, posición, evolución).
- Inspección de URL de las 3 páginas.
- Informe de cobertura/páginas y estado del sitemap en GSC.
- GA4: adquisición, páginas de destino, eventos.
- Registro de consultas por WhatsApp y ventas atribuibles.
- Existencia y estado de Google Business Profile.

## Conclusión — clasificación

| Problema | Estado | Fundamento |
|---|---|---|
| A — Indexación | **No comprobable** | Sin Inspección de URL. Técnicamente las 3 páginas son indexables; el estado real en Google se desconoce |
| B — Relevancia | **No comprobable** | Sin consultas ni posiciones |
| C — Intención comercial | **No comprobable con datos propios** | Indicio fuera de GSC: los competidores que rankean para "comprar" muestran precio y compra online (observación de Bing) |
| D — Canibalización | **No comprobable** | Hay riesgo estructural, sin evidencia por consulta |
| E — Autoridad | **No comprobable** | No hay datos de enlaces entrantes ni de rendimiento |
| F — SEO local | **No comprobable** | Indicio: ficha de Bing con otro teléfono. No hay acceso a GBP |
| G — Conversión | **No comprobable** | Sin datos de GA4 |

## Decisión B10.2 (propuesta, no implementada)

**H. No tocar todavía y recolectar más datos.**

Fundamento: de las 7 hipótesis, ninguna se puede confirmar ni descartar sin GSC y GA4. Cualquier intervención (optimizar, crear una landing, tocar enlaces) sería una apuesta sin evidencia.

**Qué se necesita para pasar a un bloque concreto:**

1. Acceso a GSC (o export de 3 meses de consultas, páginas y Consulta × Página) y a GA4 (o export de adquisición, páginas de destino y eventos).
2. Inspección de URL de `/`, `/bkf/` y `/sillon-bkf/`.

**Regla de decisión una vez que haya datos:**
- `/sillon-bkf/` "no está en Google" → **A / indexación**.
- Impresiones en posición 4–10 con CTR bajo en `/sillon-bkf/` → **A**.
- Las consultas BKF las responde la home o `/bkf/` en vez de `/sillon-bkf/` → **C (canibalización)**.
- Posiciones > 20 en consultas comerciales sin cambios → **D/E (SEO local y autoridad)**.
- Tráfico orgánico a `/sillon-bkf/` sin `whatsapp_click` → **F (CRO)**.
- **G (nueva landing)** solo si el export muestra demanda con impresiones sostenidas y ninguna URL actual responde la intención.
