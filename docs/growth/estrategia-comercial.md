# Estrategia comercial B2B y B2C (25/11/2026)

> Basada en los datos de `README.md` (A) y `investigacion-seo-y-competencia.md`.
> Ningún mensaje de esta guía se envió: los contactos los hace el dueño, uno por
> uno. Lo marcado **[falta]** necesita un dato del dueño antes de usarse.

## 1. Qué dicen los datos

- **Las consultas vienen de empresas.** 12 de los 17 clics a WhatsApp de los
  últimos 28 días salieron de páginas para locales; 1 de `/sillon-bkf/`.
- **Lo que mejor convierte es la base de mesa y el mobiliario comercial**, y
  ahí la competencia online es más débil que en el BKF (para "fábrica de bases de
  hierro para mesas" el sitio ya está arriba, con posición media 2,2).
- **El BKF trae visitas e interés** (97 vistas de `/sillon-bkf/`; 88 aperturas del 3D en todo el sitio, de 12 personas)
  pero casi no trae consultas. Contra tiendas con precio y cuotas, sin precio la
  persona no avanza.

Conclusión: en los próximos 90 días, **el B2B es la apuesta principal** (bases y
mobiliario para locales, después estructuras para mueblerías y fabricantes) y el
BKF se trabaja con confianza (reseñas, fotos, precio "desde"), no con más páginas.

## 2. B2B: qué ofrecer a cada segmento

| Segmento | Qué ofrecer | Prueba que ya existe | Mensaje central | Canal | [falta] |
|---|---|---|---|---|---|
| Bares, restaurantes, cafeterías y franquicias | Base de Mesa Flat (73 o 105 cm), Banco BKF, Sillón BKF para el salón | Bases Flat entregadas a las tiendas YPF Full; bases y sillas para Shell Select; mobiliario para McDonald's y Burger King | Bases pesadas que no se balancean, por cantidad, con factura A y garantía de por vida en el hierro | Búsqueda (bases), Perfil de Empresa, contacto directo a locales que abren o renuevan | Precio por cantidad (10, 20, 50 bases) y plazo para cada volumen |
| Mueblerías y tiendas de decoración (reventa) | Sillón BKF y Banco BKF | Fábrica propia, factura A, garantía, diseño reconocido | Producto de diseño con fábrica detrás: reposición directa y a medida | Visita o WhatsApp del dueño, Instagram | Precio mayorista, mínimo de compra, si se deja en exhibición |
| Fabricantes de muebles y carpinterías | Bases de mesa sueltas y estructuras de hierro por encargo | Estructuras para el mobiliario de McDonald's | La parte de hierro la hace el taller, con sus medidas; ellos ponen la madera o el tapizado | Búsqueda ("base de hierro para mesa de madera" es una sugerencia de Google), contacto directo | Plazos y mínimos (la estructura sola sí se vende: confirmado el 25/11/2026) |
| Estudios de arquitectura e interioristas | BKF (diseño de 1938 de tres arquitectos) y mobiliario a medida para locales | Proyectos corporativos; 3D con medidas reales en el sitio | Especificar un BKF con fábrica y garantía, o hacer a medida la parte de hierro de un proyecto | Contacto directo, Instagram, ficha técnica en PDF (cuando haya fotos) | Fotos reales; si hay descuento para profesionales |
| Comercios e indumentaria | Mobiliario exhibidor de hierro (percheros, mesas de exhibición) | Locales de Sandro (acabado cromado) | Exhibidores a medida del local | Contacto directo | Fotos de los exhibidores de Sandro, con permiso |

En el sitio, cada segmento ya tiene su salida: la ficha de la base (cotizar por
cantidad), `/mobiliario-comercial/` (cotización de locales y estructuras por
encargo) y `/proyectos/`.

## 3. Primeros clientes: 14 días

Del contacto más cálido al más frío. Cada acción se anota en
`registro-consultas.csv` y, si lleva enlace, usa las UTM de `medicion.md` §4.

| Días | Acción | Con quién | Cómo se sabe si funcionó |
|---|---|---|---|
| 1-2 | Releer los chats de WhatsApp de las últimas 4 semanas (hubo 17 clics a WhatsApp de 15 personas) y responder o hacer seguimiento de los que no recibieron presupuesto | Quienes ya escribieron | Presupuestos enviados y respondidos |
| 1-3 | Escribir a los clientes de empresa actuales: si abren o renuevan locales, y si conocen a alguien que esté equipando uno | YPF Full, Shell Select, franquiciados de McDonald's y Burger King, Sandro (los contactos los tiene el dueño) | Pedidos nuevos o recomendaciones |
| 1 | Publicar la rama (ficha de la base por cantidad, proyectos con "Cotizar algo similar", estructuras por encargo) | — | `whatsapp_click` con `location` `ficha_empresas`, `proyecto_*`, `mc_estructuras` |
| 1-2 | Perfil de Empresa: enlace con UTM, Instagram, logo y servicios (con tu OK) | Quienes buscan en Maps (211 pedidos de cómo llegar en 6 meses) | Clics al sitio con `utm_campaign=perfil-empresa`; llamadas |
| 3-14 | 10 contactos directos por semana a locales gastronómicos de la zona (primero los recién abiertos) | Ver "Dónde encontrar a quién escribir" | Respuestas, presupuestos y ventas con canal `contacto-directo` |
| 3-14 | 5 contactos por semana a carpinterías y fabricantes que necesiten bases o estructuras | Ídem | Ídem |
| 7 | Publicar en Instagram un caso real (fotos de una entrega, con permiso) con el enlace a `/proyectos/` | Seguidores y clientes | Sesiones `utm_source=instagram` |
| 14 | Revisar el registro: qué canal dio conversaciones reales y presupuestos | — | Decidir las semanas 3 y 4 |

Mensaje para clientes actuales:

```
Hola [nombre], ¿cómo va? Soy [nombre] de Taller Kappa. Les hicimos [las bases de mesa / los bancos] para [local]. ¿Tienen alguna apertura o renovación prevista? Y si conocés a alguien que esté equipando un local, te agradezco si nos recomendás: https://tallerkappa.com.ar/proyectos/?utm_source=whatsapp&utm_medium=contacto-directo&utm_campaign=b2b-clientes
```

## 4. Captación activa (la hace el dueño)

**Ritmo sugerido:** 10 contactos por semana, anotados en `registro-consultas.csv`
con canal `contacto directo`. Sin envíos masivos ni listas compradas: cada
mensaje a una persona o empresa concreta, y si dicen que no, no se insiste.

**Dónde encontrar a quién escribir:**
- Google Maps: "restaurante", "cafetería", "bar" en la zona de entrega propia
  (San Martín, Tres de Febrero, Caseros, Santos Lugares, Hurlingham, Ciudadela),
  sobre todo locales con pocas reseñas (recién abiertos).
- Google Maps e Instagram: "mueblería", "deco", "carpintería" en la misma zona.
- Estudios de arquitectura e interiorismo que publiquen proyectos gastronómicos.
- Clientes anteriores: preguntar si abren otro local o si conocen a alguien.

**Mensajes modelo** (cambiar el nombre y el dato concreto; enlaces con UTM para
saber cuántos entran):

Para un local gastronómico:

```
Hola, ¿cómo estás? Soy [nombre], de Taller Kappa, una fábrica de muebles de hierro en San Martín. Vi que tienen [local] en [zona]. Fabricamos bases de mesa de hierro para bares y restaurantes (las hicimos para las tiendas YPF Full), en 73 o 105 cm, por cantidad y con factura A. Si en algún momento necesitan bases o renovar el salón, te paso el detalle: https://tallerkappa.com.ar/catalogo/base-de-mesa-flat/?utm_source=whatsapp&utm_medium=contacto-directo&utm_campaign=b2b-gastronomia
```

Para una mueblería:

```
Hola, ¿cómo estás? Soy [nombre], de Taller Kappa. Fabricamos el sillón BKF y el banco BKF en nuestro taller de San Martín, con hierro macizo de 12 mm y garantía de por vida en la estructura. Estamos buscando mueblerías que quieran tenerlos. ¿Te puedo pasar condiciones para revendedores? https://tallerkappa.com.ar/sillon-bkf/?utm_source=whatsapp&utm_medium=contacto-directo&utm_campaign=b2b-mueblerias
```
[falta: condiciones para revendedores antes de mandar este]

Para un fabricante o estudio:

```
Hola, soy [nombre], de Taller Kappa (San Martín). Hacemos por encargo la parte de hierro de muebles: estructuras para sillas, mesas y bancos, y bases de mesa, con las medidas y el acabado del proyecto. Podés pedir solo la estructura. Si tenés un plano o una referencia, te cotizamos: https://tallerkappa.com.ar/mobiliario-comercial/?utm_source=whatsapp&utm_medium=contacto-directo&utm_campaign=b2b-estructuras
```

**Seguimiento:** si no hay respuesta, un solo recordatorio a los 7 días. Si
piden presupuesto, responder en el día con precio, plazo, forma de pago y
enlace a la ficha.

## 5. Perfil de Empresa de Google

La revisión campo por campo (25/11/2026), los cambios listos para autorizar, los
que necesitan un dato tuyo y las fotos que faltan están en
[`perfil-google.md`](perfil-google.md). Resumen: verificado; teléfono viejo y otro
horario (sin cambios hasta que confirmes); sin UTM, sin redes, sin logo, sin
fotos propias, sin productos ni servicios; 2 reseñas, una de ellas escrita desde
la cuenta que administra el perfil.

## 6. B2C: vender el sillón BKF

### 5.1 Lo que el comprador necesita saber

| Dato | Estado en el sitio |
|---|---|
| Materiales | Publicado: hierro macizo de 12 mm, cuero vacuno curtido al vegetal, epoxi o cromado |
| Medidas | Publicado: 77 x 87 x 102 cm; a medida sin costo |
| Acabados | Publicado: 5 colores de estructura; cuero negro, marrón o natural |
| Fotos | **Pendiente:** dos con fondo editado y una real |
| Precio | **Pendiente:** decisión del dueño |
| Disponibilidad | **Pendiente:** el sitio no dice si hay stock |
| Plazo de entrega | **Pendiente de unificar:** el sitio dice "depende del stock"; la documentación vieja, 5 a 10 días hábiles |
| Medios de pago | **Pendiente:** la FAQ dice que no hay cuotas; falta decir qué se acepta (efectivo, transferencia, tarjeta) y si hay descuento |
| Diferencia frente a otros | Publicado: garantía de por vida en la estructura, fábrica con showroom, a medida, factura A y B |

### 5.2 Posicionamiento

Comprarle el BKF a la fábrica: se ve en el showroom, se elige el cuero y el
acabado, se puede pedir a medida y la estructura tiene garantía de por vida.
Eso se sostiene sin bajar el precio; lo que falta es que quien compara vea un
número. Recomendación: publicar un **"desde $X"** con fecha de vigencia (el
sitio y el JSON-LD lo toman solos), junto a la garantía.

### 5.3 Acciones

1. **Precio "desde"** del sillón y el banco (decisión).
2. **Fotos reales** del sillón en el taller y en casas de clientes (con permiso).
3. **Reseñas:** pedirle a cada comprador la reseña de Google al entregar.
4. **Respuesta en WhatsApp:** contestar en el día con precio, plazo, forma de
   pago y enlace a la ficha; preguntar "¿cómo nos conociste?" y anotarlo.
5. **Instagram:** un video corto del proceso por semana (soldadura, costura del
   cuero, embalaje), con el enlace de la bio con UTM (`medicion.md` §4).

## 7. Material descargable

Una ficha técnica en PDF por producto (foto, medidas, materiales, acabados,
garantía, contacto) para estudios y mueblerías. El sitio ya genera un PDF del
presupuesto con la tipografía de la marca, así que es poco trabajo. **Se hace
cuando haya fotos reales y precio aprobados**: con fotos de fondo editado no
conviene mandarla a profesionales.
