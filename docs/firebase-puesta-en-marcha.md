# Firebase: cómo ponerlo en marcha

> Estado al 15/11/2026: **sin configurar**. `react-app/src/lib/firebaseConfig.js`
> tiene valores de ejemplo (`REEMPLAZAR…`). El sitio público funciona igual: los
> productos, las preguntas y los testimonios salen del código, y las consultas
> llegan por WhatsApp. Lo único que no ocurre es guardar una copia de cada
> mensaje del formulario de contacto. `/admin` lo dice en pantalla y no descarga
> el SDK.

Nada de esto se pudo probar contra un proyecto real: no hay credenciales. Cuando
existan, hay que seguir la lista de verificación del final.

## Qué usa el sitio de Firebase

| Servicio | Para qué | Dónde |
|---|---|---|
| Firestore `contactos` | Copia de cada mensaje del formulario de contacto (nombre, interés, zona, mensaje) | `Contacto.jsx` → `firedb.createContacto` |
| Firestore `productos`, `faqs`, `testimonios` | Opcional: reemplazan a los datos del código si la colección tiene documentos | `Catalogo.jsx`, `FAQ.jsx`, `Nosotros.jsx` |
| Authentication (email y contraseña) | Entrar a `/admin` | `Admin.jsx` |

`orders` y `users` son colecciones del sitio viejo. El sitio actual no las lee
ni las escribe; las reglas solo se las dejan al administrador.

## Pasos

1. **Crear el proyecto** en <https://console.firebase.google.com> (plan Spark,
   gratuito). Sin Google Analytics: el sitio ya tiene GA4 propio.
2. **Firestore Database** → Crear base de datos → modo producción → región
   `southamerica-east1` (San Pablo).
3. **Authentication** → Sign-in method → habilitar **Correo electrónico/contraseña**.
4. **Crear la cuenta administradora**: Authentication → Users → Add user, con
   `ing.franciscomarotta@gmail.com` (es el email que figura en
   `firestore.rules`; si se usa otro, cambiarlo ahí).
5. **Verificar ese email.** Las reglas exigen `email_verified`. La consola no
   tiene un botón para verificar: hay que enviar el mail de verificación (por
   ejemplo con la opción "Restablecer contraseña" de la consola, que al
   completarse deja el email verificado) o marcarlo con el Admin SDK.
6. **Cerrar el registro de cuentas nuevas**: Authentication → Settings → User
   actions → desmarcar "Enable create (sign-up)". Así nadie puede crear cuentas
   desde la API pública.
7. **Publicar las reglas**: Firestore → Reglas → pegar el contenido de
   `firestore.rules` → Publicar. El deploy de GitHub Pages **no** las sube.
8. **Registrar la app web**: Configuración del proyecto → Tus apps → Web → copiar
   el objeto `firebaseConfig` y reemplazar los valores en
   `react-app/src/lib/firebaseConfig.js`.
9. **Restringir la clave**: en Google Cloud Console → Credenciales → la clave de
   API del proyecto → Restricciones de sitios web → `https://tallerkappa.com.ar/*`
   (y `http://localhost:*` para desarrollo).
10. **Dominios autorizados**: Authentication → Settings → Authorized domains →
    agregar `tallerkappa.com.ar`.

### Sobre la clave en el repositorio

La `apiKey` de Firebase para web **no es un secreto**: viaja en el JavaScript
que descarga cualquier visitante y solo identifica al proyecto. Lo que protege
los datos son las reglas (paso 7), la restricción por dominio (paso 9) y el
registro cerrado (paso 6). Por eso se puede commitear en este repositorio
público. Lo que **nunca** va al repositorio es una clave de cuenta de servicio
(el JSON del Admin SDK).

## Lista de verificación (cuando haya credenciales)

- [ ] `npm run build` sigue dando "15 rutas + 404.html".
- [ ] `/contacto/`: enviar el formulario abre WhatsApp y aparece un documento en
      `contactos` con `name`, `interest`, `zone`, `message`, `leido: false`.
- [ ] En GA4 deja de aparecer `contacto_save_failed` con
      `reason: firebase_sin_configurar`.
- [ ] `/admin`: con una contraseña mal escrita dice "Usuario o contraseña
      incorrectos"; con la correcta lista las consultas.
- [ ] "Marcar como leída" cambia `leido` a `true` en Firestore.
- [ ] Con otra cuenta (si existiera) el panel dice que no tiene permiso.
- [ ] Desde la consola del navegador, sin sesión, no se puede leer `contactos`
      ni escribir en `productos`.
- [ ] Con las colecciones `productos`/`faqs`/`testimonios` vacías, el catálogo,
      las preguntas y los testimonios siguen mostrando los datos del código.

## Dependencias

`npm audit` informa 13 avisos (8 moderados, 5 altos) en la cadena de
`firebase@10` (`undici`, que el SDK usa solo en Node). El sitio no ejecuta ese
código en el navegador y hoy ni siquiera descarga el SDK. La corrección es subir
a la versión mayor vigente de `firebase`, que cambia la API: conviene hacerlo
junto con la puesta en marcha, cuando se pueda probar el login y Firestore.
