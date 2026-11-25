# Medición: del clic a la venta (25/11/2026)

> GA4 `G-2FDMN51XDY`. Código en `react-app/src/lib/analytics.js`. Desde el
> commit `78fc62d`, GA4 solo recibe datos de `tallerkappa.com.ar`: las pruebas
> y Lighthouse en local ya no cuentan (antes eran el 27 % de las páginas vistas).
> Para comparar períodos, filtrar por nombre de host `tallerkappa.com.ar` en los
> datos anteriores al deploy de la rama.

## 1. Qué se mide hoy

| Pregunta | Evento o informe | Estado |
|---|---|---|
| ¿Qué páginas y productos se visitan? | `page_view` (informe Páginas), `select_item` (clic hacia una ficha) | Funciona |
| ¿Quién usa el presupuesto? | `add_to_cart` (con `item_name`, `color`) | Funciona |
| ¿Quién manda el presupuesto? | `whatsapp_checkout` (con `items`, `qty`, `customer_type`, `has_zone`, `has_comment`) | Funciona (0 en 28 días) |
| ¿Quién inicia contacto? | `whatsapp_click` (**evento clave**), `phone_click`, `email_click`; el formulario manda `whatsapp_click` con `location: contacto_form` | Funciona |
| ¿Desde qué botón? | `location` en cada clic (`ficha_actions`, `ficha_barra`, `ficha_empresas`, `mc_hero`, `mc_estructuras`, `footer`…) | Llega pero **no se ve**: falta registrar la dimensión (§3) |
| ¿Qué producto consultan más? | `item_name` en `whatsapp_click`, `add_to_cart`, `select_item` | Llega pero **no se ve** (§3) |
| ¿De dónde vienen? | Canal y fuente/medio de la sesión; `ai_referral` para asistentes de IA | Funciona; el Perfil de Empresa se mezcla con el orgánico hasta poner la UTM (§4) |
| Campañas | UTM (GA4 las toma solas) | Funciona; convenciones en §4 |
| ¿Fue una consulta real? ¿Se presupuestó? ¿Se vendió? | — | **No se puede medir en la web**: pasa en WhatsApp. Se anota en `registro-consultas.csv` (§2) |

Reglas para no duplicar: el único evento clave es `whatsapp_click`. No marcar
también `whatsapp_checkout` ni `add_to_cart` (contarían dos veces el mismo
pedido). No agregar `trackEvent('whatsapp_click')` a mano en botones: lo hace
`trackClicks()` con `data-cta` (`CONTEXTO_PROYECTO.md` §5).

Datos personales: ningún evento manda nombre, teléfono, email ni zona escrita
(del presupuesto solo va `has_zone: si/no`). Mantenerlo así.

## 2. Lo que pasa en WhatsApp: el registro de consultas

Un clic en WhatsApp no es una conversación, una conversación no es un
presupuesto y un presupuesto no es una venta. Para medir esos pasos, anotar
cada consulta en [`registro-consultas.csv`](registro-consultas.csv) (se abre con
Excel o Google Sheets; separador `;`).

**Importante: el repositorio es público.** La planilla del repo queda vacía,
como modelo. La copia con datos va en Google Drive o en la computadora del taller,
y sin nombres ni teléfonos de clientes (no hacen falta para medir).

| Columna | Qué anotar |
|---|---|
| `fecha` | Día del primer mensaje |
| `canal` | `web`, `perfil-google`, `instagram`, `mercado-libre`, `recomendacion`, `contacto-directo`, `otro` |
| `pagina_del_mensaje` | La URL con la que termina el mensaje (el sitio la agrega sola); vacío si no vino de la web |
| `segmento` | `particular`, `gastronomia`, `muebleria`, `fabricante`, `estudio`, `comercio`, `otro` |
| `producto` | `sillon-bkf`, `banco-bkf`, `base-flat`, `estructura`, `otro` |
| `cantidad` | Unidades pedidas |
| `consulta_real` | `si` si había intención de compra (no spam, no proveedores) |
| `presupuesto_enviado` | `si` / `no` |
| `monto_presupuesto_ars` | Total presupuestado |
| `venta` | `si` / `no` / `pendiente` |
| `monto_venta_ars` | Total vendido |
| `motivo_si_no` | Precio, plazo, envío, no respondió, compró en otro lado… |

Con 4 semanas de registro se puede calcular: consultas reales por canal, tasa
de presupuesto y de cierre por segmento, y ticket promedio B2B frente a B2C.

## 3. Dimensiones a registrar en GA4 (requiere autorización)

Administrar → Definiciones personalizadas → Crear dimensión personalizada,
alcance **Evento**. Sin esto, GA4 recibe los parámetros pero no los muestra en
informes. Solo cuentan desde el día en que se crean (no hacia atrás).

| Nombre de la dimensión | Parámetro | Para responder |
|---|---|---|
| Ubicación del botón | `location` | ¿Qué botón genera consultas? |
| Producto | `item_name` | ¿Qué producto se consulta más? |
| Tipo de cliente | `customer_type` | ¿Los presupuestos son de particulares o empresas? |
| Presupuesto con zona | `has_zone` | ¿Llegan completos? |
| Presupuesto con comentario | `has_comment` | ¿Usan el campo de medidas a medida? |
| Asistente de IA | `ai_source` | ¿Qué asistente trae visitas? |
| Interés (formulario) | `interest` | ¿Qué piden por el formulario de contacto? |

Si GA4 rechaza `item_name` por ser un nombre reservado de comercio electrónico,
avisar: se renombra el parámetro en el código (`product_name`) y se registra ese.

También conviene vincular Search Console con GA4 (Administrar → Vinculaciones
de productos): muestra las búsquedas de Google junto a las páginas de destino.

## 4. UTM: convenciones y enlaces listos

Todo en minúsculas, palabras separadas con guiones, sin datos personales.

| Dónde va el enlace | Enlace |
|---|---|
| Perfil de Empresa: sitio web | `https://tallerkappa.com.ar/?utm_source=google&utm_medium=organic&utm_campaign=perfil-empresa` |
| Perfil de Empresa: un producto | `https://tallerkappa.com.ar/catalogo/base-de-mesa-flat/?utm_source=google&utm_medium=organic&utm_campaign=perfil-empresa&utm_content=producto-base-flat` |
| Bio de Instagram | `https://tallerkappa.com.ar/?utm_source=instagram&utm_medium=social&utm_campaign=bio` |
| Historias o posteos de Instagram | `…?utm_source=instagram&utm_medium=social&utm_campaign=historias` |
| Mensajes uno a uno a empresas | `…?utm_source=whatsapp&utm_medium=contacto-directo&utm_campaign=b2b-gastronomia` (o `b2b-mueblerias`, `b2b-estructuras`) |
| Firma de email | `https://tallerkappa.com.ar/?utm_source=email&utm_medium=firma` |
| Directorios (Cylex, Bing, etc.) | `https://tallerkappa.com.ar/?utm_source=cylex&utm_medium=referral&utm_campaign=directorios` (cambiar `cylex`) |

Los medios `contacto-directo` y `firma` aparecen en GA4 como "Sin asignar" en el
agrupamiento de canales por defecto: se leen en el informe por fuente/medio. La
canonical de cada página no cambia con la UTM, así que no afecta al SEO.

## 5. Tablero semanal (15 minutos, los lunes)

Una fila por semana en una planilla. Comparar siempre semanas completas y, para
conclusiones, bloques de 4 semanas contra las 4 anteriores.

| Bloque | Métrica | Dónde |
|---|---|---|
| Visibilidad | Clics e impresiones **sin "kappa"** | Search Console → Rendimiento → filtro de consulta "no contiene" `kappa` |
| Visibilidad | Impresiones de búsquedas con `bkf` | Filtro "contiene" `bkf` |
| Visibilidad | Impresiones de búsquedas de bases | Filtro "contiene" `base` |
| Visibilidad | Clics a `/mobiliario-comercial/` y a las dos páginas de bases | Pestaña Páginas |
| Tráfico | Sesiones por canal (orgánico, IA, directo, social) | GA4 → Adquisición de tráfico |
| Interés | `add_to_cart` y `select_item` | GA4 → Eventos |
| Contacto | `whatsapp_click` total y por página (B2B frente a BKF) | GA4 → Páginas y pantallas, columna eventos clave |
| Local (mensual) | Llamadas, cómo llegar, clics al sitio | Perfil de Empresa → Rendimiento |
| Negocio | Consultas reales, presupuestos, ventas y monto, por segmento | `registro-consultas.csv` |

Tasas a mirar (cada una con numerador y denominador de la misma ventana):
`whatsapp_click` / sesiones; consultas reales / `whatsapp_click`; presupuestos /
consultas reales; ventas / presupuestos.

**Línea base para comparar** (últimos 28 días antes de esta rama):
48 clics y 1.840 impresiones en Search Console (26/10 al 22/11); 225 sesiones,
17 `whatsapp_click`, 9 `add_to_cart` y 0 `whatsapp_checkout` en GA4 (28/10 al
24/11, solo el dominio); 57 impresiones de búsquedas con "bkf" (31/10 al 23/11).
Primera lectura: 4 semanas después del deploy.
