# Investigación SEO y competencia (24 y 25/11/2026)

> Fuentes: Search Console (propiedad de dominio, leída con la sesión del dueño),
> GA4, sugerencias de búsqueda de Google (autocompletado, región Argentina),
> resultados de Google y sitios públicos de la competencia. **Sin volúmenes de
> búsqueda ni dificultad numérica:** no hay herramienta que los dé con datos
> reales para este nicho, así que no se inventan. La demanda se infiere de
> Search Console (impresiones reales) y del autocompletado (búsquedas que
> existen, sin cantidad).
>
> Los resultados de Google se vieron con la sesión del dueño iniciada: pueden
> estar personalizados a favor de Taller Kappa. Las posiciones "observadas" son
> una referencia; las de Search Console son las que valen.

## 1. Search Console

### 1.1 Totales

| Período | Clics | Impresiones | CTR | Posición media |
|---|---|---|---|---|
| 15/7 al 14/10/2026 (línea base) | 39 | 1,3 mil | 3 % | 6,7 |
| 4/10 al 28/10/2026 (medición del 31/10) | 46 | 1,82 mil | 2,5 % | 6,9 |
| **26/10 al 22/11/2026** | **48** | **1,84 mil** | **2,6 %** | **5,9** |
| 23/8 al 22/11/2026 (90 días) | 95 | 3,65 mil | 2,6 % | 6,4 |

Semanas (lunes a domingo; sin datos del 15/9 al 3/10, cuando el sitio cambió de URLs):

| Semana | Clics | Impresiones |
|---|---|---|
| 5 al 11/10 | 9 | 404 |
| 12 al 18/10 | 15 | 518 |
| 19 al 25/10 | 12 | 630 |
| 26/10 al 1/11 | 20 | 501 |
| 2 al 8/11 | 10 | 533 |
| 9 al 15/11 | 5 | 362 |
| 16 al 22/11 | 13 | 439 |

Dispositivos (28 días): celular 24 clics / 1.235 impresiones (CTR 1,9 %),
computadora 21 / 588 (3,6 %), tablet 3 / 12. País: Argentina 43 clics /
1.680 impresiones.

### 1.2 Lo que no es demanda del taller

Las consultas con "kappa" o "kapa" (kappa, kappa argentina, kapa, kappa locales,
kappa srl, locales kappa…) suman **~498 impresiones y 0 clics** en 28 días.
Por los términos, la mayoría parece ser de la marca de ropa Kappa (inferencia:
Search Console no dice qué buscaba la persona). Restándolas, el CTR del resto
es ~3,6 %. No hay nada que hacer con ellas; solo no leer el CTR total como
problema de títulos.

### 1.3 Páginas (26/10 al 22/11)

| URL | Clics | Impresiones | CTR | Posición |
|---|---|---|---|---|
| `/` | 22 | 702 | 3,1 % | 5,6 |
| `/bkf/` | 7 | 448 | 1,6 % | 6,6 |
| `/mobiliario-comercial/` | 7 | 120 | 5,8 % | 6,1 |
| `/proyectos/` | 4 | 48 | 8,3 % | 6,4 |
| `/nosotros/` | 3 | 167 | 1,8 % | 6,2 |
| `/sillon-bkf/` | 2 | 176 | 1,1 % | 4,2 |
| `/catalogo/asientos/` | 1 | 134 | 0,7 % | 6,9 |
| `/catalogo/mesas/` | 1 | 30 | 3,3 % | 6,1 |
| `/catalogo/` | 1 | 25 | 4 % | 6,7 |
| `/catalogo/banco-bkf/` | 0 | 108 | 0 % | 4,0 |
| `/contacto/` | 0 | 44 | 0 % | 6,3 |
| `/catalogo/base-de-mesa-flat/` | 0 | 29 | 0 % | 4,0 |
| `/faq/`, `/envios/`, `/garantia/` | 0 | 27, 27, 9 | 0 % | 4,2 a 6,7 |

`/catalogo/banco-bkf/` tiene 108 impresiones en posición 4 y ningún clic. La
primera sugerencia de Google para "banco bkf" es "banco bkf hormigón": hay un
banco de plaza de hormigón con ese nombre (aparece en los resultados). Hipótesis:
buena parte de esas impresiones son de gente que busca el de hormigón. No se
cambió nada.

### 1.4 Estado técnico (sin problemas)

- 15 páginas indexadas, que son todas las del sitemap (incluida
  `/catalogo/base-de-mesa-flat/`, que el 31/10 estaba sin indexar). Las 12 "no
  indexadas" son 10 redirecciones de URLs viejas y 2 404 viejos. Esperado.
- Sitemap leído el 18/11, correcto, 15 URLs.
- Rutas de exploración: 12 válidas. Fragmentos de producto y fichas de
  comerciante: 0 válidos y 3 no válidos, todos por falta de precio (decisión
  del dueño, no un error).
- Core Web Vitals: sin datos de campo (poco tráfico).
- **Enlaces externos: 3, desde 2 sitios** (infobel.com 2, guiademantenimiento.com 1).

### 1.5 Las búsquedas sin nombre

En la vista por página, la mayoría de las impresiones no muestra la búsqueda
(Search Console oculta las poco frecuentes). Por ejemplo, del catálogo se ven
33 de 483 impresiones en 90 días. Aparecen búsquedas conversacionales
("podés mostrarme fotos?", "mostrame diseños", "quero foto") que parecen
venir del modo IA de Google: piden fotos, y el sitio no tiene fotos reales
del taller.

## 2. Por qué cayó el BKF

| Búsquedas con "bkf" | Impresiones | Clics | Posición |
|---|---|---|---|
| 5 al 30/10 | 325 | 2 | 9,5 |
| 31/10 al 23/11 | 57 | 0 | 8,2 |

Casi todo pasa por `/bkf/` (320 de 325 en octubre). Impresiones semanales de
`/bkf/` (todas las búsquedas): 257, 299, 303 en octubre; 178, 113, 31 y 92 en
noviembre. Búsquedas de `/bkf/`:

| Búsqueda | 6/10 al 2/11 | 3 al 23/11 |
|---|---|---|
| silla bkf | 79 impresiones, posición 10,3 | 4, posición 3,5 |
| sillon bkf | 65, posición 9,7 | 5, posición 14 |
| bkf | 47, posición 8,3 | 11, posición 2,8 |
| sillones bkf | 12, posición 11,6 | 4, posición 22,2 |

**Lectura.** `/bkf/` estaba en el borde de la primera página (posición 9-10)
para las búsquedas principales. Desde el 7/11 aparece mucho menos: pasó a la
segunda página para la mayoría (cuando sale, sale bien, por eso la posición
media no empeora). `/sillon-bkf/` casi no recibe esas búsquedas (6 impresiones
en noviembre).

**Causa probable.** No hay un error técnico: está indexada, rastreada el 22/11,
con canonical propio. Lo que distingue a los que ganan es autoridad (Mercado
Libre, Wikipedia, Instagram de ProyectoBKF) y oferta con precio. Con 3 enlaces
externos, un cambio menor del algoritmo o de la competencia alcanza para pasar
de la 9 a la 14.

**Qué no hacer.** El título de `/bkf/` cambió el 31/10 y después hubo cuatro
despliegues (7, 15, 19 y 23/11, fechas de merge en GitHub). Cambiarlo otra vez ahora haría imposible saber
qué funcionó. Se mide de nuevo 3-4 semanas después del próximo deploy.

**Qué hacer (fuera del código):** reseñas, enlaces de clientes y proveedores,
directorios con los mismos datos, Instagram con enlace al sitio, fotos reales y
precio "desde". Ver `plan-90-dias.md`.

## 3. Oportunidades priorizadas

Prioridad por intención de compra y por lo que convierte hoy (las páginas para
empresas), no por cantidad de visitas. "Dificultad" es cualitativa: quién ocupa
los primeros resultados.

| # | Búsquedas | Evidencia | Intención | Quién gana hoy | Página | Dificultad | Potencial de venta | Esfuerzo | Estado |
|---|---|---|---|---|---|---|---|---|---|
| 1 | base de mesa de hierro, bases de hierro para mesas | 1ª sugerencia de "base de mesa" y de "bases de hierro para" | Compra (locales, carpinteros, particulares) | Pueblo Muebles, Mercado Libre, Veilot, Siglo 21 | `/catalogo/mesas/` | Media | Alto: las páginas de bases convierten | Bajo | Contenido hecho (B2). Falta: fotos reales, enlaces |
| 2 | base para mesa de bar, base para mesa bar alta, base de metal para mesa de bar | Sugerencias de "base para mesa de bar" | Compra B2B | Mercado Libre, Desillas, Gastromesas, Cintek | `/catalogo/base-de-mesa-flat/` | Media | Alto | Bajo | Hecho (B2): título, preguntas, bloque por cantidad |
| 3 | fábrica / fabricante de bases de hierro para mesas | Search Console: 10 impresiones, posición 2,2, 1 clic (90 días) | Compra B2B | Taller Kappa 1º (observado) | `/catalogo/mesas/` | Baja | Alto | — | Mantener. Se sumó la pregunta de compra por cantidad |
| 4 | mobiliario gastronómico, mobiliario para local gastronómico, muebles para bares y restaurantes | Sugerencias; Search Console: "mobiliario para comercios" posición 12,5, "mueble comercial" 12 | Compra B2B | Distribuidores de equipamiento gastronómico | `/mobiliario-comercial/` | Alta | Alto | Medio | Pendiente: fotos de locales equipados y enlaces. Probar el título con "gastronómico" recién después de 4 semanas del deploy |
| 5 | estructura de hierro para mesa, estructuras de hierro para escritorio | Sugerencias de "estructura de hierro para"; "estructuras metálicas para muebles" no aparece | Compra (carpinteros, mueblerías) | Mercado Libre, Pinterest, sitios chicos | `/mobiliario-comercial/` (sección nueva) | Baja | Medio | Bajo | Hecho (B2). Página propia solo si aparecen impresiones |
| 6 | sillón bkf, silla bkf, bkf | Search Console: cayeron de ~300 a ~60 impresiones en 28 días | Mixta | Mercado Libre, BigBKF, Wikipedia, ProyectoBKF, Calmachicha | `/bkf/` | Alta | Medio | Alto (autoridad) | No tocar la página; trabajar autoridad (§2) |
| 7 | comprar sillón bkf, sillón bkf cuero, sillón bkf precio | Sugerencias ("sillon bkf cuero" es la 1ª) | Compra B2C | Tiendas con precio y cuotas | `/sillon-bkf/` | Alta | Alto si hay precio | Bajo (decisión) | Depende de publicar precio "desde" |
| 8 | fábrica de sillones en San Martín, mueblerías en San Martín, taller de sillones | Search Console: posiciones 10,4, 1 y 12 | Local | Perfil de Empresa y directorios | Perfil + `/nosotros/` | Baja | Medio | Bajo | Completar el Perfil de Empresa y reseñas |
| 9 | sillón bkf lona, bkf exterior, asiento o funda de repuesto para bkf | Sugerencias ("sillon bkf lona"); Calmachicha vende asientos de repuesto | Compra B2C | ProyectoBKF, Calmachicha, El Grito | — | — | Hipótesis | — | Solo si el taller los fabrica (decisión) |

Fuera del foco: "sillón bkf hormigón", "banco bkf hormigón" y "sillon bkf dwg"
(otro producto o archivos para arquitectos), "kappa" (otra marca).

## 4. Competencia (relevada el 25/11/2026)

Datos copiados de los sitios en esa fecha. Los precios cambian seguido:
sirven para ubicarse, no como lista de precios.

### 4.1 Sillón BKF (particulares)

| Competidor | Qué publica (hechos) | Fuente |
|---|---|---|
| ProyectoBKF (Villa Urquiza, CABA) | BKF cuero negro cromado $798.000; cuero tostado o gris $599.000; lona $399.000 a $569.000; versión exterior $399.000; apoyapiés de cuero $359.000; mesa $728.000. 3 cuotas sin interés; 10 % menos con transferencia o efectivo; showroom; envíos y retiro | proyectobkf.com.ar |
| Calmachicha | BKF cuero engrasado $590.000 (varios colores); cuero vaqueta suela $890.000; lona $390.000; asientos de repuesto $225.000 a $260.000; precio menor con transferencia | calmachicha.com/bkf/ |
| El Grito BKF (Tienda Nube) | Cuero $499.990 a $599.990; ecocuero $349.990; lona o cordura $249.990; desarmable de cuero $699.990; hasta 24 cuotas | elgritobkfartesanal.mitiendanube.com |
| Enecueros | 3 cuotas sin interés; 10 % menos en efectivo o transferencia; sección de envíos profesionales y mayoristas. La página de categoría no mostraba precios al relevarla | enecueros.com/bkf/ |
| Mercado Libre, "sillón bkf cuero" | 40 publicaciones: de $137.898 a $1.200.000; mediana $398.998 (incluye modelos desarmables y de distintos cueros) | listado.mercadolibre.com.ar |

### 4.2 Bases de mesa (locales)

| Competidor | Qué publica (hechos) | Fuente |
|---|---|---|
| Pueblo Muebles (Ituzaingó) | Bases de $69.558 (Metal Leg) a $272.224 (Struktur 200 x 80); 6 cuotas sin interés; 15 % menos con transferencia; envío gratis a todo el país; correo para mayoristas; sin showroom | pueblomuebles.com.ar/bases-de-mesas/ |
| Gastromesas | Bases de mesa blancas, cromadas y negras, patas de desayunador; clientes: cadenas gastronómicas, fábricas de muebles, cadenas de bares y particulares; sin precios | gastromesas.com.ar |
| Mercado Libre, "base mesa bar hierro" | 48 publicaciones; bases de pie central para bar o restaurante desde $90.000 (una "por mayor" a $106.500, otra a $260.600); mediana del listado $234.522 | listado.mercadolibre.com.ar |

### 4.3 Lo que hacen ellos y Taller Kappa no (hechos)

- Precio visible y forma de pago (cuotas, descuento por transferencia).
- Variantes de menor precio (lona, ecocuero, exterior) y repuestos (asientos).
- Envío gratis a todo el país (Pueblo Muebles).

### 4.4 Lo que tiene Taller Kappa y ellos no publican (hechos del sitio)

- Garantía de por vida en la estructura de hierro.
- Fábrica propia con showroom (con turno) y retiro.
- Medidas y colores a pedido sin costo adicional; factura A y B.
- Clientes como YPF Full, McDonald's, Burger King, Shell Select y Sandro.
- Base de chapa torneada de 10 mm con columna de 77 o 101 mm, en dos alturas.
- Vista 3D de los tres productos.

### 4.5 Hipótesis (no comprobadas)

- La Base Flat compite mejor contra las bases de Mercado Libre por peso,
  terminación y referencias (YPF Full) que por precio. Para confirmarlo hace
  falta saber el precio propio y preguntar a 3-5 clientes por qué compraron.
- Un precio "desde" del BKF en el rango de las tiendas de cuero ($500.000 a
  $800.000) no ahuyentaría a quien busca calidad, si va junto a la garantía de
  por vida. Se confirma solo publicándolo y midiendo consultas.
- Una versión de lona o asientos de repuesto ampliarían el público del BKF. Solo
  vale si el taller los fabrica.
