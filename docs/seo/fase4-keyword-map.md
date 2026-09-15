# FASE 4 — Keyword Research + Mapa Keyword → URL

> Estado del roadmap: Fase 1 ✅ · Fase 2 ✅ · Fase 3 ✅ · **Fase 4 (este documento)**.
> Este mapa se construyó a partir del contenido REAL que ya existe en el sitio
> (titles, descriptions, H1 y copy verificados en el código fuente el 15/09/2026).
> No incluye volúmenes de búsqueda ni dificultad de keyword porque esta iteración
> no tuvo acceso a herramientas externas (Search Console / Keyword Planner /
> Ahrefs / Semrush). Esos números deben cargarse en la Fase 11 (Search Console)
> una vez que el sitio esté publicado e indexado, y el CTR/posición real
> reemplace cualquier estimación.

## 1. Inventario de páginas existentes (URL real → contenido real)

| URL | Página | H1 (real) | Title (real) | Palabra(s) principal(es) actual(es) |
|---|---|---|---|---|
| `/` | Home | "Sillones BKF y Sillas de Hierro en Buenos Aires" | Taller Kappa \| Sillones BKF y Muebles de Hierro en Buenos Aires | sillones BKF, muebles de hierro, Buenos Aires |
| `/catalogo` | Catalogo | (listado de productos) | Catálogo de Sillas de Hierro y Cuero \| Taller Kappa Buenos Aires | catálogo, sillas de hierro y cuero |
| `/catalogo/sillon-bkf-premium` | Producto | nombre de producto | `{nombre} \| Taller Kappa` | sillón BKF premium |
| `/catalogo/banco-bkf` | Producto | nombre de producto | `{nombre} \| Taller Kappa` | banco BKF |
| `/catalogo/base-de-mesa-flat` | Producto | nombre de producto | `{nombre} \| Taller Kappa` | base de mesa de hierro |
| `/sillon-bkf` | SillonBKF | (página dedicada al producto insignia) | Sillón BKF de Hierro y Cuero \| Taller Kappa Buenos Aires | sillón BKF, hierro y cuero |
| `/proyectos` | Proyectos | "Clientes que Confían en Taller Kappa" | Proyectos — Clientes que Confían en Taller Kappa | mobiliario gastronómico, proyectos B2B (YPF, McDonald's, Burger King, Shell, Sandro) |
| `/nosotros` | Nosotros | "Nosotros — Fábrica de Muebles de Hierro en San Martín" | Nosotros — Quiénes Somos \| Taller Kappa | muebles de hierro San Martín, historia de marca |
| `/faq` | FAQ | Preguntas frecuentes | Preguntas Frecuentes \| Taller Kappa | precios, envíos, garantía, materiales (informacional) |
| `/contacto` | Contacto | Contacto | Contacto — Taller Kappa \| Muebles de Hierro y Sillones BKF | contacto, cotización |
| `/envios` | Envios | Envíos | Envíos — Zonas y Tiempos de Entrega \| Taller Kappa | envíos, zonas de entrega |
| `/garantia` | Garantia | Garantía | Garantía y Cuidados — Muebles de Hierro y Cuero \| Taller Kappa | garantía, cuidado de cuero/hierro |

Todas estas páginas están prerenderizadas (SSG real, Fase 1) y ya tienen
title/description/H1/canonical propios (Fase 2). No hay canibalización
detectada hoy: cada URL apunta a una keyword principal distinta.

## 2. Mapa Keyword → Intención → URL → Prioridad

Basado en las keywords que el propio negocio identificó como objetivo (marca,
producto, mobiliario, local). Sin acceso a Search Console todavía, la
prioridad se asigna por: (a) cuánta demanda comercial es razonable esperar
para ese término dado el rubro, y (b) si ya existe una página con contenido
real y suficiente para servir esa intención sin canibalizar otra URL.

### Marca

| Keyword | Intención | URL destino | Prioridad | Nota |
|---|---|---|---|---|
| Taller Kappa | Navegacional | `/` | Alta | Ya cubierta en title de Home |
| Taller Kappa San Martín | Navegacional/Local | `/nosotros` | Alta | Nosotros ya menciona San Martín en H1 |
| Taller Kappa Buenos Aires | Navegacional/Local | `/` | Alta | Ya en title de Home |
| Taller Kappa muebles | Navegacional | `/catalogo` | Media | Cubierta indirectamente por title de Catálogo |

### Producto

| Keyword | Intención | URL destino | Prioridad | Nota |
|---|---|---|---|---|
| sillón BKF | Comercial | `/sillon-bkf` | Alta | Página dedicada ya existe, no tocar |
| sillón BKF de hierro y cuero | Comercial | `/sillon-bkf` | Alta | Ya está literal en el title |
| sillón BKF Buenos Aires | Local/comercial | `/sillon-bkf` | Alta | Ya está literal en el title |
| comprar sillón BKF | Transaccional | `/catalogo/sillon-bkf-premium` | Alta | Página de producto es la que tiene CTA de compra/consulta, no `/sillon-bkf` (evita canibalización, ver sección 3) |
| sillón BKF precio | Transaccional | **ninguna URL hoy** | Media | No hay página de precios (el proyecto no publica precios). No crear página falsa; ver sección 4 |
| sillones BKF (plural) | Comercial | `/catalogo` | Media | El catálogo lista más de un producto BKF (sillón + banco) |
| banco BKF | Comercial | `/catalogo/banco-bkf` | Alta | Producto real con URL propia |
| sillas de hierro y cuero | Comercial | `/catalogo` | Alta | Ya está literal en el title de Catálogo |

### Mobiliario

| Keyword | Intención | URL destino | Prioridad | Nota |
|---|---|---|---|---|
| muebles de hierro | Comercial | `/` | Alta | Ya en title de Home |
| muebles de hierro a medida | Comercial | `/` o `/contacto` | Media | "Fabricación a medida" ya aparece en description de Home y Contacto |
| bases de mesa de hierro | Comercial | `/catalogo/base-de-mesa-flat` | Alta | Producto real con URL propia |
| bases para mesas | Comercial | `/catalogo/base-de-mesa-flat` | Media | Variante de la anterior, misma URL (evita canibalización) |
| mobiliario gastronómico | B2B | `/proyectos` | Alta | Ya en description de Proyectos |
| mobiliario comercial | B2B | `/proyectos` | Media | Mismo caso que la anterior |
| equipamiento para locales gastronómicos | B2B | `/proyectos` | Media | Coincide con el copy real de Proyectos (YPF, McDonald's, etc.) |

### Local

| Keyword | Intención | URL destino | Prioridad | Nota |
|---|---|---|---|---|
| muebles de hierro San Martín | Local | `/nosotros` | Alta | Ya literal en H1 de Nosotros |
| sillones BKF Buenos Aires | Local/comercial | `/sillon-bkf` | Alta | Duplicado intencional de la fila de "Producto"; misma URL, no crea conflicto |
| sillones BKF zona norte | Local | **ninguna URL hoy** | Baja | No crear página doorway solo para "zona norte" sin contenido diferencial real (ver Fase 9 del plan) |
| mobiliario gastronómico Buenos Aires | Local/B2B | `/proyectos` | Media | Variante de keyword ya cubierta |
| fábrica de muebles San Martín | Local | `/nosotros` | Alta | Coincide con "Fábrica de Muebles de Hierro en San Martín" (H1 real) |

### Informacionales (para un futuro content hub — Fase 10, NO ahora)

Estas quedan documentadas para no perderlas, pero **no se crea contenido
todavía**: la recomendación del propio roadmap es primero terminar este mapa,
y recién después evaluar qué artículos responden una búsqueda real.

| Keyword | Intención | URL destino sugerida (futura) | Prioridad |
|---|---|---|---|
| qué es un sillón BKF | Informacional | futuro `/blog/que-es-un-sillon-bkf` | Media |
| historia del sillón BKF | Informacional | futuro `/blog/historia-sillon-bkf` | Baja |
| cómo limpiar cuero | Informacional | futuro `/blog/como-limpiar-cuero` (enlazable desde `/garantia`) | Media |
| cómo cuidar muebles de hierro | Informacional | ya parcialmente cubierta por `/garantia` | Media |
| qué base de mesa usar según el tablero | Informacional | futuro `/blog/...` (enlazable desde producto base de mesa) | Baja |

## 3. Anti-canibalización (Fase 5, resuelta acá para no repetir trabajo)

Regla aplicada: **una keyword de "producto específico" (ej. "comprar sillón
BKF") apunta a la página de producto (`/catalogo/:slug`)**, mientras que la
keyword genérica de marca de producto ("sillón BKF", "sillón BKF Buenos
Aires") sigue apuntando a `/sillon-bkf`, que es la página histórica y con más
contenido/autoridad interna. No se creó ni se va a crear una tercera URL
compitiendo por lo mismo (ej. no habrá `/blog/sillon-bkf` mientras no exista
contenido informacional real y distinto).

```
/sillon-bkf                        → intención comercial/marca de producto (existente, no tocar)
/catalogo/sillon-bkf-premium       → intención transaccional de ESE producto puntual
/catalogo (listado)                → intención comercial genérica "sillas de hierro y cuero"
```

## 4. Keywords sin URL asignada hoy (decisión: no inventar página)

- **"sillón BKF precio"**: no hay página de precios en el sitio (decisión de
  negocio, no técnica). No se crea una página con precios inventados ni un
  "desde $X" ficticio. Si en el futuro se publican precios reales, esta
  keyword pasaría a `/catalogo/sillon-bkf-premium`.
- **"sillones BKF zona norte"**: sin una oferta/contenido real específico de
  zona norte (ej. un proyecto real ahí, un local real atendido ahí), crear
  una página para esta keyword sería una página doorway (Fase 9 lo prohíbe
  explícitamente). Se deja pendiente hasta tener ese contenido real.

## 5. Próximo paso recomendado (no ejecutado en esta iteración)

Fase 5 del roadmap general (arquitectura/canibalización) ya quedó resuelta
en la sección 3 de este documento como parte del mismo trabajo. El siguiente
paso ejecutable sería la **Fase 6 (on-page)**: revisar que cada title/H1/
description de la tabla de la sección 1 cumpla los rangos de caracteres
recomendados (50–60 / 140–160) y ajustar solo donde haga falta, sin tocar
contenido que ya es correcto.
