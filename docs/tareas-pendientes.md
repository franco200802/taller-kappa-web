# Tareas pendientes (las que tiene que hacer el dueño)

> Actualizado: 25/11/2026 (secciones nuevas arriba; el resto, del 17/10/2026). Esto es lo que **no se puede hacer desde el código
> ni automatizar**: hace falta estar en el taller, decidir algo o iniciar
> sesión con una cuenta propia. Está ordenado por impacto. Cuando completes
> algo, avisá y se hace la parte técnica que sigue (indicada en cada punto).

## Lo que ya quedó hecho (para tener contexto)

- **Cloudflare:** HTTPS forzado, 10 redirecciones 301, caché de archivos estáticos
  y ofuscación de email apagada (`docs/seo/cloudflare-paso-a-paso.md`).
- **Search Console:** propiedad de dominio verificada con
  `ingfranciscomarotta@gmail.com` (registro TXT en Cloudflare: **no borrarlo**),
  sitemap enviado y 7 páginas con indexación solicitada. Línea base en
  `docs/seo/linea-base-search-console.md`.
- **Perfil de Empresa de Google:** reclamado con la misma cuenta, categoría
  "Fábrica de muebles" y dirección corregida. **Falta verificarlo** (punto 1).
- **Sitio:** la dirección ahora dice "Vélez Sársfield 3779 (Calle 28)", igual
  que el perfil de Google.
- **GA4:** los eventos `whatsapp_click` y `ai_referral` llegan bien (13 y 26
  en los últimos 28 días), y `whatsapp_click` quedó marcado como evento clave
  (conversión) desde el 17/10.

---

## Nuevo (25/11/2026): operación growth (más consultas y ventas)

Informe, datos y plan en `docs/growth/` (empezar por `README.md`). Rama
`growth/operacion-ventas-nov-2026`, sin push ni merge. En orden:

1. **Revisar y publicar la rama.** GA4 deja de contar las pruebas locales (eran
   el 27 % de las páginas vistas) y la Base de Mesa Flat y mobiliario comercial
   tienen salida para pedir por cantidad y para mueblerías, fabricantes y estudios.
2. **Confirmar antes de publicar:** que se puede vender **solo la estructura** de
   hierro (el sitio nuevo lo dice, tomado de tu descripción del Perfil de Empresa).
   Si no es así, avisá y se saca.
3. **Autorizar o hacer dos cambios de cuenta:**
   - GA4: registrar 7 dimensiones personalizadas (`docs/growth/medicion.md` §3).
   - Perfil de Empresa: teléfono, horario, enlace con UTM, productos y servicios
     (`docs/growth/estrategia-comercial.md` §4).
4. **Datos:** qué teléfono va en Google (hoy figura el 011 4753-0099: 3 llamadas en
   6 meses), horario real (Google dice que abre a las 8; el sitio, a las 9) y una
   sola frase de plazo de entrega.
5. **Decisiones:** precio "desde" con vigencia (sillón, banco, base), medios de
   pago que se pueden publicar, y condiciones para revendedores.
6. **Rutina:** anotar cada consulta en `docs/growth/registro-consultas.csv` (la
   copia con datos, fuera del repo: es público), pedir reseña a cada cliente y 10
   contactos directos por semana a locales (mensajes listos en
   `estrategia-comercial.md` §3).

## Nuevo (22/11/2026): revisar el rediseño premium

**Publicado el 23/11/2026 (PR #33).** Detalle, capturas medidas y comparativa en
`docs/mejora-premium-2026-11.md`.

1. **Mirar el sitio con el diseño nuevo** en tu computadora o celular (pasos en
   el documento, sección "Cómo probarlo") y decidir si se publica. Incluye el
   PR #32, que sigue abierto: conviene mergear primero #32 y después esta rama.
2. **Probar un presupuesto real de punta a punta**: agregar un producto, completar
   "Comentarios o medidas a medida" y enviar el WhatsApp a tu propio número para
   ver cómo llega el mensaje. El navegador no puede probar el envío.
3. **Fotos reales** (punto 2 de esta lista): con el diseño nuevo las fotos son
   todavía más protagonistas. Es lo que más va a subir la percepción de marca.

## Nuevo (15/11/2026): tres confirmaciones de la mejora integral

Detalle en `docs/mejora-integral-2026-11.md`.

1. ~~**Medidas del sillón.**~~ **Resuelto el 19/11/2026:** son las de
   `FOTOCONMEDIDAS.png`, 77 x 87 x 102 cm (ancho x profundidad x alto). El sitio
   ya las publica en todas las páginas (ver `CONTEXTO_PROYECTO.md` §5j).
2. **Foto del sillón en una casa** (`FOTOLINDABKF.jpeg`): confirmar que es un
   sillón de Taller Kappa y que el dueño de la casa está de acuerdo con que se
   publique. Ya está en la rama, en la home y en `/sillon-bkf/`.
3. **Firebase**: crear el proyecto y cargar las credenciales siguiendo
   `docs/firebase-puesta-en-marcha.md` (unos 20 minutos). Sin eso, el panel
   `/admin` no funciona y no se guarda copia de los mensajes del formulario.

## 0. Mergear el PR #9 (2 minutos)

**Hecho:** mergeado el 17/10/2026.

<https://github.com/franco200802/taller-kappa-web/pull/9> → **Merge pull
request**. Publica en el sitio la dirección "Vélez Sársfield 3779 (Calle 28)",
igual a la del perfil de Google. El deploy corre solo (pestaña *Actions*,
unos minutos). Conviene hacerlo antes de que Google revise el video del
punto 1, así el sitio y el perfil ya coinciden.

## 1. Verificar el Perfil de Empresa de Google

**Hecho:** el 24/11/2026 el administrador de perfiles lo muestra "Verificado".
Falta la parte de "Después de la verificación" (al final de este punto), que
ahora está detallada campo por campo en `docs/growth/estrategia-comercial.md` §4.

Google solo ofrecía verificación **por video**. Se hace desde el celular, en el
taller, con la cuenta `ingfranciscomarotta@gmail.com`:

1. Entrá a <https://business.google.com/> con esa cuenta → "Taller Kappa" →
   **Verificar**.
2. Grabá **un solo video continuo**, sin cortes (Google rechaza videos editados), de
   30 segundos a 2 minutos, que muestre:
   - **Dónde está:** la calle, el frente y algo que la identifique (el número
     3779, un cartel, la esquina o los comercios vecinos).
   - **Qué hace:** el taller por dentro, con herramientas, soldadoras, estructuras
     de hierro y sillones en proceso.
   - **Que lo administrás vos:** abrir la puerta o el portón con llave, mostrar
     una factura o un documento a nombre de Taller Kappa, o entrar a una zona
     privada del taller.
3. Subilo. Google lo revisa en unos días y avisa por mail.

**Después de la verificación** se cargan en el perfil (se puede hacer con Claude):
teléfono **11 6124-2498** (hoy figura el viejo 011 4753-0099), horario lunes a
viernes de 9 a 18, descripción, productos, servicios y el enlace al sitio con
`?utm_source=gbp` para medir las visitas que trae. El texto ya está en
`docs/seo/seo-google-fase-3.md` §6b.

## 2. Fotos reales

Hoy las fotos de producto del sitio están **generadas con IA** (se ve la
marca ✦). Google pide que las fotos del perfil muestren el negocio real, así
que estas no sirven ahí, y en el sitio restan confianza: es lo primero que
conviene cambiar.

### Qué fotos sacar

| Para | Fotos | Cómo |
|---|---|---|
| Perfil de Google | Frente del taller (1-2) | De día, de frente, que se vea el número o el cartel |
| Perfil de Google | Interior / taller trabajando (3-5) | Gente soldando, cortando cuero, armando estructuras |
| Perfil de Google y sitio | Cada producto terminado | Sillón BKF, banco BKF y base de mesa Flat, cada uno por separado |
| Sitio y Google | Producto en uso (opcional) | En un living, local o restaurante de un cliente, **con su permiso** |
| Perfil de Google | Equipo (opcional) | Las personas del taller |

### Cómo sacar las fotos de producto

- **Fondo liso y claro** (pared blanca o gris), con luz de día y sin sol directo.
- El producto **entero**, centrado y con aire alrededor (después se recorta en
  cuadrado 1:1, 4:3 y 16:9, así que no lo pegues a los bordes).
- Celular en horizontal, a la altura del asiento, sin zoom digital.
- Una foto de frente, una de tres cuartos (en diagonal) y una de detalle: la
  costura del cuero o la soldadura.
- Mínimo **1600 px** de ancho; las fotos de cualquier celular actual alcanzan.
- **Sin** filtros, textos ni marcas de agua.

### Cómo pasarlas

Mandalas sin comprimir (por Google Drive o como **archivo** de WhatsApp, no como
foto, porque WhatsApp las comprime). Se reemplazan en
`react-app/assets-src/fotos/` con el mismo nombre:

- `sillon-bkf-hierro-cuero.jpg`
- `banco-bkf-hierro-cuero.jpg`
- `base-mesa-flat-hierro.jpg`

Después se corre `scripts/build-images.sh` y `scripts/build-social-images.sh`
(eso lo hace Claude o quien mantenga el sitio).

## 3. Confirmar datos del negocio

| Dato | Por qué | Qué hace falta |
|---|---|---|
| **Barrio**: ¿Villa Chacabuco o Villa Lynch? | El sitio dice Villa Chacabuco; Bing dice Villa Lynch y el CP viejo de Google (B1672) es de Villa Lynch | Confirmarlo. Si es Villa Lynch, se cambia en el sitio |
| **CPA completo** (formato B1650XXX) | Google Business no acepta "1650" solo; hoy el campo quedó vacío | Buscarlo en una factura o en el buscador de CPA de Correo Argentino (correoargentino.com.ar) y cargarlo en el perfil |
| ¿El 011 4753-0099 sigue siendo del taller? | Figura en Google y Bing | Si no es del taller, se borra de todos lados; si lo es, se puede agregar como teléfono secundario |

## 4. Precio

Es la mayor desventaja frente a la competencia en búsquedas de "comprar" y
"precio", y Search Console marca "falta price" en los productos (no es una
penalización, pero sin precio no hay resultados enriquecidos de producto).

**Decisión:** publicar un precio de lista o un "desde $X", con fecha de vigencia.
El sitio ya está preparado (`price` en `react-app/src/data/products.js`); hace
falta el número.

## 5. Directorios

Con los datos de `docs/seo/fichas-directorios.md` (todo listo para copiar y pegar):

1. **Cylex:** reclamar la ficha "Talleres Kappa S de H" y corregir nombre,
   dirección y teléfono.
2. **Bing Places** (<https://www.bingplaces.com/>): reclamar la ficha; una vez
   verificado el perfil de Google, se puede importar desde ahí.
3. **Bing Webmaster Tools** (<https://www.bing.com/webmasters>): entrar con la
   cuenta de Google e **importar la propiedad desde Search Console** (2 clics).
   Bing alimenta a Copilot y a ChatGPT Search.
4. argentino.com.ar y fullconfort.com.ar: crear la ficha.

Requieren crear cuentas o iniciar sesión, por eso quedan de tu lado.

## 6. Reseñas

El perfil tiene 2 reseñas (5,0) y es lo que más pesa en las búsquedas locales.
El sitio tiene un enlace corto que abre directo el formulario de reseña de
Google: **<https://tallerkappa.com.ar/resena/>**. Funciona aunque el perfil
todavía no esté verificado.

Mandáselo a **todos** los clientes cuando reciben el mueble (no solo a los que
quedaron contentos: Google prohíbe pedir reseñas de forma selectiva). Mensaje
para WhatsApp:

```
¡Hola! Gracias por elegir Taller Kappa. Si tenés un minuto, nos ayudaría mucho que dejes tu opinión en Google: https://tallerkappa.com.ar/resena/
```

Sin ofrecer nada a cambio (descuentos, regalos). Responder todas las reseñas,
también las malas. **Nunca** comprar reseñas ni escribirlas.

## 7. Perfiles en redes (opcional)

Instagram: **hecho** (1/11/2026). La cuenta `@tallerkappa` está en el footer, en
`sameAs` y en `llms.txt`, y su bio enlaza al sitio.

No hay Facebook oficial del taller. Si se crea, avisá y se agrega
al sitio (`sameAs` en `react-app/src/lib/schema.js`) para que Google los
asocie con la empresa.

## 8. Volver a medir

| Fecha | Qué mirar |
|---|---|
| 31/10/2026 | Search Console → Páginas: que las `.html` pasen a "Página con redirección" y `/mobiliario-comercial/` a indexada |
| 14/11/2026 | Rendimiento: impresiones y posición de `/sillon-bkf/` y de "sillon bkf", "silla bkf", "bkf" contra la línea base |
| 28/11/2026 | Lo mismo, más los clics de WhatsApp en GA4 |

La comparación se hace contra `docs/seo/linea-base-search-console.md`.
