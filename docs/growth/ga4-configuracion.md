# GA4: configuración propuesta (25/11/2026)

> Propiedad `Taller Kappa` (a387757710, p528575123), flujo web `TallerKappa`
> (13914609544, `G-2FDMN51XDY`). **Nada de esto se aplicó**: son cambios de
> cuenta y esperan tu autorización. Todo lo de "estado actual" se leyó hoy en
> la cuenta, sin modificar nada.
>
> Objetivo: saber **qué producto, qué página y qué botón** generan las consultas
> comerciales, sin datos personales y sin contar dos veces.

## 1. Estado actual de la cuenta

| Qué | Hoy |
|---|---|
| Dimensiones personalizadas | **Ninguna** (0 de 50) |
| Eventos clave | `whatsapp_click` (recibe datos). `close_convert_lead`, `purchase` y `qualify_lead` son los predeterminados de GA4 y nunca recibieron datos |
| Medición mejorada | Vistas de página (incluye "cambios de página basados en el historial"), desplazamientos, **clics de salida** y 4 más |
| Ocultar datos | Correo electrónico: activo. **Parámetros de consulta de URL: inactivo** |

## 2. Qué se verificó y cómo

**Código:** todos los `trackEvent` y `trackClicks()` (`react-app/src`). **Navegador:**
el build servido como `tallerkappa.com.ar`, con el `gtag.js` real y **todos los
envíos a Google abortados** (nada llegó a la propiedad), en un recorrido:
home → mobiliario comercial → WhatsApp → Base Flat → WhatsApp "por cantidad" →
presupuesto con nombre, zona y comentario → formulario de contacto. Se
inspeccionó cada evento que habría salido.

| Verificación | Resultado |
|---|---|
| ¿El código envía los parámetros? | Sí. Ver la tabla del §3: cada parámetro apareció en el recorrido, salvo `ai_source`, que solo sale cuando la visita viene de un asistente de IA (el código lo envía desde `lib/analytics.js:118`; GA4 recibió 24 en 28 días) |
| ¿Se duplica el evento clave? | **No.** Un `whatsapp_click` por clic. El presupuesto manda `whatsapp_click` + `whatsapp_checkout`, pero solo el primero es clave |
| ¿La página de cada consulta es la correcta? | **Sí.** Cada `whatsapp_click` lleva la URL de la página donde se hizo clic, también después de navegar dentro del sitio. Por eso la página sale de la dimensión estándar "Ruta de la página" y **no hace falta registrar `page_path`** |
| ¿Nuestros eventos mandan datos personales? | **No.** Ningún parámetro propio lleva nombre, teléfono, email ni texto libre: `has_zone` es `si`/`no`, `interest` sale de una lista fija |
| ¿Algún evento manda datos personales? | **Sí: el `click` automático de "Clics de salida".** Manda `link_url` con el enlace de WhatsApp completo. En el presupuesto, ese enlace incluye "Nombre: …", "Zona de entrega: …" y el comentario. Lo confirmó el recorrido: el nombre de prueba aparecía en lo que se habría enviado |
| ¿Hay eventos duplicados? | **Sí: `page_view`.** Cada navegación interna manda dos: el nuestro y el automático de "cambios de página por historial". Las páginas vistas por navegación interna están duplicadas (las consultas no) |
| ¿El `page_view` lleva el título correcto? | Llevaba el de la página anterior. **Corregido en el código** (`4016e6d`), con prueba |

Riesgo histórico: desde el 1/9/2026 hubo **1** `whatsapp_checkout`, así que a lo
sumo una consulta real pudo mandar un nombre en `link_url`. Para verlo hay que
crear una Exploración con la dimensión "URL del enlace" (no está en los informes
estándar); crearla también es un cambio en la cuenta.

## 3. Cambios propuestos, en orden

### A. Ocultar el mensaje de WhatsApp (datos personales): **necesario**

Administrar → Flujos de datos → TallerKappa → **Ocultar datos** → activar
"Parámetros de consulta de URL" y agregar la clave **`text`**. Dejar el correo
activo.

- Qué resuelve: el `link_url` de los clics a WhatsApp sale con `text` oculto
  (GA4 oculta los parámetros elegidos en `link_url`, `page_location` y otros, en
  el navegador, antes de enviar: [documentación de GA4](https://support.google.com/analytics/answer/13544947)).
- Se mantienen los clics de salida a Instagram, Maps y la reseña.
- Verificación después de aplicarlo: la pantalla tiene una prueba con URL de
  ejemplo, y se repite el recorrido del §2 (el nombre ya no debe aparecer).
- Si la prueba falla: desactivar "Clics de salida" en la medición mejorada. Los
  clics que importan (WhatsApp, email, teléfono, reseñas) ya los mide el sitio.

### B. Un solo `page_view` por página: **necesario**

Administrar → Flujos de datos → TallerKappa → Medición mejorada (engranaje) →
Vistas de página → Mostrar configuración avanzada → **desmarcar "Cambios de
página basados en eventos del historial del navegador"**.

- Se queda el `page_view` del sitio porque gtag.js se descarga tarde: la primera
  navegación puede ocurrir antes de que la medición automática esté escuchando, y
  la del sitio queda en cola.
- Aplicarlo **el mismo día del deploy** de la rama, para que desde ese momento el
  `page_view` del sitio ya tenga el título correcto.
- Corte en la serie: desde ese día las páginas vistas bajan (deja de contarse el
  duplicado). Anotarlo para no leerlo como caída de tráfico.

### C. Registrar las dimensiones: **necesario para saber qué vende**

Administrar → Definiciones personalizadas → Crear dimensión personalizada. Todas
con **alcance Evento**. Nombres sin tildes por si GA4 no las acepta (si las
acepta, se pueden poner).

| # | Nombre de la dimensión | Parámetro | Descripción para GA4 | La envían | Valores que toma | Verificado en |
|---|---|---|---|---|---|---|
| 1 | `Boton o zona` | `location` | Botón o zona del enlace (data-cta) | `whatsapp_click`, `select_item`, `view_3d`, `phone_click`, `email_click`, `review_click` | `mc_hero`, `mc_estructuras`, `ficha_empresas`, `ficha_actions`, `ficha_barra`, `presupuesto`, `proyectos_hero`, `proyecto_ypf-full`, `contacto_form`, `home_hero`, `float_button`, `footer`, `menu`, `contenido`… | `lib/analytics.js:152-189`; recorrido ✔ |
| 2 | `Producto` | `item_name` | Producto consultado o visto | `whatsapp_click` (en fichas o con `data-item`), `select_item`, `add_to_cart`, `view_3d` | `Sillón BKF Premium`, `Banco BKF`, `Base de Mesa Flat` | `lib/analytics.js:188`, `CartContext.jsx:84`; recorrido ✔ |
| 3 | `Tipo de cliente` | `customer_type` | Particular o empresa, en el presupuesto | `whatsapp_checkout` | `particular`, `empresa`, `(sin especificar)` | `CartDrawer.jsx:192`; recorrido ✔ |
| 4 | `Presupuesto con zona` | `has_zone` | Si el presupuesto dice la zona | `whatsapp_checkout` | `si`, `no` | `CartDrawer.jsx:192`; recorrido ✔ |
| 5 | `Presupuesto con comentario` | `has_comment` | Si usó "Comentarios o medidas" | `whatsapp_checkout` | `si`, `no` | `CartDrawer.jsx:192`; recorrido ✔ |
| 6 | `Asistente IA` | `ai_source` | Asistente de IA que trajo la visita | `ai_referral` | `chatgpt`, `perplexity`, `gemini`, `copilot`, `claude` | `lib/analytics.js:118` (24 eventos en GA4) |
| 7 | `Interes del formulario` | `interest` | Qué elige en el formulario de contacto | `whatsapp_click` del formulario | `Sillón BKF`, `Banco BKF`, `Base de Mesa`, `Pedido mayorista`, `Mobiliario para un local o empresa`, `Visitar el showroom`, `(sin especificar)` | `Contacto.jsx:33`; recorrido ✔ |
| 8 (opcional) | `Variante` | `color` | Acabado y medidas elegidas al agregar | `add_to_cart` | `Negro Mate, Barra (105 cm), columna de 101 mm`… | `CartContext.jsx:84`; recorrido ✔ |

La 8 no estaba entre las siete, pero dice qué altura de base piden los locales
(mesa o barra). Usa 1 de las 50 dimensiones disponibles.

No se registran: `page_path` (la ruta estándar ya es correcta), `landing_page`
(existe "Página de destino"), `language`, `reason` y `path` (diagnóstico interno).

Si GA4 rechaza `item_name` por ser un nombre reservado de comercio electrónico,
se renombra el parámetro en el código a `product_name` y se registra ese.

Las dimensiones no son retroactivas: cuentan desde el día en que se crean.

### D. Opcional: borrar lo que ya pudo llegar

Si una Exploración muestra enlaces con "Nombre:" en `link_url`: Administrar →
Solicitudes de eliminación de datos → parámetro `link_url`, desde el 1/10/2026
(cuando el presupuesto empezó a pedir el nombre) hasta el día del cambio A.

### E. Opcional: un informe listo

Una Exploración libre "Consultas por página, botón y producto": filas `Ruta de
la página`, `Boton o zona` y `Producto`; valor `Número de eventos`; filtro
`Nombre del evento = whatsapp_click`. Se puede crear después de C, con tu OK.

## 4. Cómo se responde la pregunta, una vez aplicado

| Pregunta | Dónde |
|---|---|
| ¿Qué página trae consultas? | Informes → Páginas y pantallas → columna "Eventos clave" (`whatsapp_click`) |
| ¿Qué botón? | Informes → Eventos → `whatsapp_click` → dimensión secundaria `Boton o zona` |
| ¿Qué producto? | Ídem con `Producto` |
| ¿Empresas o particulares en el presupuesto? | `whatsapp_checkout` por `Tipo de cliente` |
| ¿Qué terminó en venta? | Fuera de GA4: `registro-consultas.csv` (`medicion.md` §2) |

## 5. Autorización

| Cambio | Riesgo | Reversible |
|---|---|---|
| A. Ocultar `text` | Ninguno para los informes | Sí, se desactiva |
| B. Sin cambios de página por historial | Corte en la serie de páginas vistas (esperado) | Sí, se vuelve a marcar |
| C. 8 dimensiones | Ninguno | Se pueden archivar |
| D. Borrar `link_url` | Borra ese parámetro del período (no los eventos) | **No** |
| E. Exploración | Ninguno | Sí, se borra |

Con tu OK, los aplico desde tu Chrome en este orden: C y A ya; B el día del
deploy; D y E solo si los pedís.
