# Plan de 90 días (desde la publicación de la rama)

> Ordenado por impacto en consultas reales y por dependencias. "Claude" = trabajo
> en el sitio o en las cuentas con autorización del dueño. Nada de esto promete
> posiciones ni ventas: cada acción dice cómo se va a saber si funcionó.
> Medición y línea base: `medicion.md`.

## Días 1 a 30: más oportunidades de contacto y primeros datos limpios

| # | Acción | Objetivo | Quién | Recursos | Cómo se mide | Depende de | Falta confirmar |
|---|---|---|---|---|---|---|---|
| 1 | Revisar y publicar `growth/operacion-ventas-nov-2026` | Medición sin pruebas locales; base y mobiliario comercial con salida por cantidad | Dueño (merge) | 30 min | Deploy en Actions; en GA4, sin `localhost` desde ese día | — | Las afirmaciones de `pull-request.md` §1 (la estructura sola ya está confirmada) |
| 2 | Registrar 7 dimensiones en GA4 y vincular Search Console | Saber qué botón y qué producto generan consultas | Dueño, o Claude con permiso | 15 min | Las dimensiones muestran datos a las 48 h | Acceso a GA4 | — |
| 3 | Corregir el Perfil de Empresa: teléfono, horario, enlace con UTM, servicios y productos | Que quienes ven el perfil (211 pedidos de cómo llegar en 6 meses) puedan llamar o escribir al número correcto | Dueño, o Claude con permiso | 1 h | Llamadas y clics al sitio del perfil (mensual); sesiones con `utm_campaign=perfil-empresa` | Fotos para los productos | Teléfono y horario reales |
| 4 | Empezar el registro de consultas | Medir conversaciones, presupuestos y ventas | Dueño | 2 min por consulta | Filas por semana en la planilla | — | — |
| 5 | Pedir reseña a los clientes de los últimos 6 meses y a cada cliente nuevo | Más confianza en Maps y en la búsqueda | Dueño | Mensaje de WhatsApp con `/resena/` | Reseñas nuevas por mes (hoy 2) | — | — |
| 6 | Sesión de fotos (2 h): frente, taller trabajando, cada producto, detalles | Reemplazar las fotos de fondo editado; perfil completo | Dueño | Celular, luz de día | Fotos en el perfil y en el sitio | — | Permiso si aparecen clientes o locales |
| 7 | 10 contactos directos por semana, primero gastronomía | Consultas B2B sin depender de Google | Dueño | 1 h por semana; mensajes de `estrategia-comercial.md` §3 y §4 | Respuestas, presupuestos y ventas con canal `contacto-directo` | — | Precio por cantidad |
| 8 | Decidir precio "desde" y medios de pago | Que quien compara el BKF vea un número | Dueño | Decisión | Si se publica: consultas desde `/sillon-bkf/` y CTR de búsquedas "comprar" | — | Precio, vigencia, descuentos |
| 9 | Bing Places (importar desde Google), Bing Webmaster (importar desde Search Console) y Cylex | Más citas con los mismos datos; Bing alimenta a Copilot y ChatGPT | Dueño | 1 h; datos en `docs/seo/fichas-directorios.md` | Fichas publicadas | Paso 3 | Teléfono |

## Días 31 a 60: ampliar lo que genera consultas

| # | Acción | Objetivo | Quién | Recursos | Cómo se mide | Depende de | Falta confirmar |
|---|---|---|---|---|---|---|---|
| 1 | Primera lectura: 4 semanas contra las 4 anteriores | Decidir dónde poner las horas | Claude y dueño | 1 h | Informe corto en `docs/growth/` | Pasos 1, 2 y 4 | — |
| 2 | Publicar las fotos reales en el sitio y en `/proyectos/` | Confianza en fichas y en la página de empresas | Claude | Scripts de imágenes del repo | `whatsapp_click` por página antes y después | Fotos (paso 6) | Permisos |
| 3 | Pedir enlaces a clientes, proveedores y cámaras del rubro; enlazar el sitio desde Instagram | Subir la autoridad (hoy 3 enlaces) | Dueño | Mensajes uno a uno | Search Console → Enlaces | — | — |
| 4 | Ficha técnica en PDF por producto | Material para estudios y mueblerías | Claude | Datos de `products.js` y fotos | Consultas de estudios y mueblerías en el registro | Fotos y precios aprobados | Qué datos comerciales van |
| 5 | Ofrecer reventa a mueblerías de la zona | Canal mayorista para el BKF | Dueño | Lista de precios mayorista | Presupuestos y ventas a `muebleria` | Condiciones | Precio y mínimo |
| 6 | Un video corto por semana en Instagram (proceso, entregas) | Tráfico y confianza | Dueño | Celular | Sesiones con `utm_source=instagram` | — | — |

## Días 61 a 90: ajustar el proceso comercial y decidir expansiones

| # | Acción | Objetivo | Quién | Recursos | Cómo se mide | Depende de | Falta confirmar |
|---|---|---|---|---|---|---|---|
| 1 | Comparar 8 semanas por canal y segmento: consultas reales, presupuestos, ventas, monto | Quedarse con los canales rentables | Dueño y Claude | Registro y GA4 | Tasa de cierre y ticket por canal | Registro al día | — |
| 2 | Seguimiento de presupuestos a las 48 h y a los 7 días | Cerrar más de lo que ya se cotiza | Dueño | Plantilla de mensaje | Ventas / presupuestos | Registro | — |
| 3 | Página propia de estructuras de hierro por encargo, solo si Search Console muestra impresiones para esas búsquedas y hay fotos | Captar fabricantes y estudios | Claude | Contenido, fotos | Impresiones y consultas `estructura` | Evidencia y fotos | — |
| 4 | Volver a evaluar `/bkf/` y `/sillon-bkf/` con 8 semanas de datos limpios; si no se recuperan, un cambio por vez | Recuperar las búsquedas del BKF | Claude | — | Impresiones con "bkf" | Autoridad (pasos 31-60 #3) | — |
| 5 | Prueba acotada de anuncios de búsqueda para bases de mesa ("base de mesa para bar") | Ver si comprar clics para B2B rinde | Dueño decide el monto | Presupuesto chico, 4 semanas; el Perfil de Empresa ofrece un crédito para anunciantes nuevos | Costo por consulta real (registro), no por clic | Precio publicado o claro; dimensiones de GA4 | Presupuesto |
| 6 | Variantes nuevas (BKF de lona, asientos de repuesto) solo si el taller las fabrica | Público de menor presupuesto | Dueño decide | — | Consultas por variante | Decisión | Si se fabrican y a qué precio |

## Lo que no se hace en estos 90 días (y por qué)

- **Páginas por barrio o ciudad:** sin locales ni contenido propio en cada zona
  serían páginas repetidas.
- **Nuevas URLs para "comprar BKF", "BKF de cuero", etc.:** competirían con
  `/sillon-bkf/` (`docs/seo/recuperacion-seo.md`).
- **Rediseño:** el diseño es de esta semana; los cuellos de botella son
  autoridad, fotos, precio y seguimiento.
