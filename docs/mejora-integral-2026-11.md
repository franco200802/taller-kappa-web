# Mejora integral, noviembre 2026

> Rama `mejora/integral-nov-2026`, creada desde `seo/auditoria-integral-cls`
> (commit `25b06fd`). No se hizo push ni se tocó `main`. Fecha: 15/11/2026.

## 1. Estado inicial (línea base medida)

Medido sobre el build del commit `25b06fd`, servido en local con `vite preview`.
Lighthouse 13, emulación móvil, mediana de 3 corridas. Son mediciones de
laboratorio en una máquina local: no equivalen a los datos de campo de Search
Console ni a una corrida contra producción (que suma Cloudflare y la red real).

| Página | Rendimiento | Accesibilidad | Buenas prácticas | SEO | LCP | CLS |
|---|---|---|---|---|---|---|
| `/` | 98 | 100 | 100 | 100 | 2,46 s | 0 |
| `/sillon-bkf/` | 100 | 100 | 100 | 100 | 0,77 s | 0 |
| `/catalogo/` | 100 | 100 | 100 | 100 | 0,78 s | 0 |
| `/mobiliario-comercial/` | 100 | 100 | 100 | 100 | 0,77 s | 0 |
| `/contacto/` | 100 | 100 | 100 | 100 | 0,77 s | 0 |

- Build: 15 rutas + 404.html, validación de SEO/GEO del prerender sin problemas.
- 13 páginas × 4 anchos (320, 360, 768, 1440): sin desbordes horizontales y sin
  errores de consola.
- React Doctor: 74/100, 4 avisos.
- `npm audit`: 13 avisos en la cadena de `firebase@10`.

Conclusión: el sitio ya estaba en muy buen estado técnico (rendimiento, SEO,
accesibilidad, hidratación). El margen estaba en **presentación, recorrido de
compra y panel/Firebase**, no en velocidad ni en SEO técnico. Por eso no se tocó
el prerender, las URLs, los títulos, el JSON-LD ni el sitemap.

## 2. Matriz priorizada

| # | Prio | Problema u oportunidad | Evidencia | Riesgo | Estado |
|---|---|---|---|---|---|
| 1 | P0 | `/admin` mostraba un login que siempre respondía "Usuario o contraseña incorrectos" contra un proyecto de Firebase que no existe | `Admin.jsx` importaba el SDK con credenciales `REEMPLAZAR…` | Bajo | Hecho |
| 2 | P0 | Reglas: `isAdmin()` no exigía email verificado; `orders` y `users` dejaban crear documentos sin validar a cualquier usuario con sesión | `firestore.rules` | Bajo (las reglas no están publicadas) | Hecho en el archivo; falta publicarlas |
| 3 | P1 | En el catálogo el rótulo del producto tapaba "Consultar disponibilidad" | Rótulo en [120..227, 627..661] sobre el texto [120..499, 627..649] a 1440 px | Bajo | Hecho |
| 4 | P1 | La home abría con dos bloques de texto institucional antes de los productos y no tenía cierre con llamada a la acción | Capturas a 390 y 1440 px | Medio (orden del contenido) | Hecho, sin quitar textos ni enlaces |
| 5 | P1 | Todo el sitio usaba solo fotos con fondo editado | `docs/tareas-pendientes.md` §2 | Bajo | Parcial: una foto sin editar, en la home y en la landing |
| 6 | P1 | La landing del sillón medía 14.468 px de alto a 320 px: 14 preguntas abiertas | Medición con Chrome automatizado | Bajo | Hecho: 12.187 px, acordeón nativo |
| 7 | P1 | Los presupuestos llegaban sin saber si eran de un particular o una empresa | `CartContext.jsx` | Bajo | Hecho |
| 8 | P1 | El formulario de contacto no pedía zona ni tenía opción para empresas | `Contacto.jsx` | Bajo | Hecho |
| 9 | P1 | El mensaje de WhatsApp de empresas no pedía ningún dato | `MobiliarioComercial.jsx`, `Proyectos.jsx` | Bajo | Hecho |
| 10 | P2 | El ícono de la bolsa no decía que era el presupuesto | `Navbar.jsx` | Bajo | Hecho (desktop) |
| 11 | P2 | Si el diccionario en inglés no bajaba, el botón quedaba en inglés con la página en español | React Doctor, `LangContext.jsx` | Bajo | Hecho |
| 12 | P2 | Lista de acabados copiada en dos páginas; cuatro funciones de Firestore sin uso | `Catalogo.jsx`, `SillonBKF.jsx`, `firedb.js` | Bajo | Hecho |
| 13 | P2 | 13 avisos de `npm audit` en `firebase@10` | `npm audit --omit=dev` | Medio (cambio de versión mayor sin poder probar) | Pendiente, ver `firebase-puesta-en-marcha.md` |
| 14 | P2 | Aviso de Rollup por el chunk de Firebase (517 kB) | Salida del build | Nulo: solo se descarga en `/admin` con credenciales | Sin cambios |
| 15 | P3 | Fotos reales del banco, la base de mesa, el taller y el equipo | `docs/tareas-pendientes.md` §2 | — | Depende del dueño |
| 16 | P3 | Precio publicado | `docs/tareas-pendientes.md` §4 | — | Decisión comercial |

## 3. Qué se implementó

**Home** (`Home.jsx`): productos justo después de la franja de clientes, con
rótulo y "Ver ficha"; sección con la foto real del sillón y cuatro filas de su
ficha (salen de `data/products.js`); pasos de compra en tres columnas
numeradas; "Para elegir y pedir" en tres columnas; cierre con CTA a WhatsApp;
cuatro datos cortos bajo los botones del hero. Los textos y los enlaces internos
son los que ya había: se reordenaron.

**Landing del sillón** (`SillonBKF.jsx`): galería de dos fotos con pie que dice
cuál tiene el fondo editado y cuál no; la foto queda fija al scrollear en
desktop; preguntas en `<details>` (la respuesta sigue en el HTML, así que el
`FAQPage` no cambia).

**Presupuesto** (`CartContext.jsx`, `CartDrawer.jsx`): campo "¿Para quién es?"
que agrega "Es para: Particular / Local o empresa" al mensaje. El evento
`whatsapp_checkout` suma `customer_type` y `has_zone`.

**Contacto** (`Contacto.jsx`): zona de entrega y opciones "Mobiliario para un
local o empresa" y "Visitar el showroom".

**Empresas** (`data/contact.js` → `B2B_QUOTE_MESSAGE`): el mensaje deja escritos
rubro, productos y cantidades, medidas o color y zona.

**Panel y Firebase** (`Admin.jsx`, `firedb.js`, `firestore.rules`): estado "sin
configurar" explícito, SDK por import dinámico, errores de login distinguidos,
lista de consultas con "marcar como leída", reglas más estrictas.

**Catálogo, barra, idioma**: ver filas 3, 10 y 11 de la matriz.

**Estilos**: sección 21 de `global.css`, con los tokens existentes. El CSS pasó
de 41,9 kB a 48,4 kB sin comprimir; el JavaScript principal, de 244,8 kB a
245,8 kB.

## 4. Resultados después

| Página | Rendimiento | Accesibilidad | Buenas prácticas | SEO | LCP | CLS |
|---|---|---|---|---|---|---|
| `/` | 98 | 100 | 100 | 100 | 2,46 s | 0 |
| `/sillon-bkf/` | 100 | 100 | 100 | 100 | 0,78 s | 0 |
| `/catalogo/` | 100 | 100 | 100 | 100 | 0,77 s | 0 |
| `/mobiliario-comercial/` | 100 | 100 | 100 | 100 | 0,78 s | 0 |
| `/contacto/` | 100 | 100 | 100 | 100 | 0,78 s | 0 |

Sin regresiones. Las mejoras de esta rama no son de velocidad: los números de
Lighthouse no podían subir y no subieron.

- Build: 15 rutas + 404.html, sin problemas de validación.
- 15 páginas × 9 anchos (320, 360, 375, 390, 430, 768, 1024, 1440, 1920): 135
  combinaciones, 0 desbordes, 0 errores de consola.
- React Doctor: 77/100 (antes 74).
- Recorridos con Chrome automatizado, todos correctos: catálogo → agregar →
  presupuesto → enlace `wa.me` con producto, cantidad, acabado, nombre, tipo de
  cliente y zona; el presupuesto persiste al recargar; vista rápida abre y
  cierra con Escape; el formulario de contacto abre WhatsApp con el mensaje
  armado y se limpia; menú móvil; galería; acordeón; cambio a inglés en la home
  y en la landing (lo único que queda en español son direcciones); `/admin` sin
  credenciales avisa y no descarga el SDK.

**No verificado:** nada de Firebase contra un proyecto real (login, lectura y
escritura de `contactos`, reglas). WhatsApp se verificó hasta el enlace
`wa.me`, no el envío. No se midió contra producción.

## 5. Pendiente del dueño

1. **Medidas del sillón.** `FOTOCONMEDIDAS.png` dice 77 cm de ancho, 102 cm de
   alto y 87 cm; el sitio publica 78 × 70 × 90 cm (20 apariciones en `react-app/src`:
   ficha, FAQ, categorías, diccionario en inglés; de ahí salen `llms.txt` y el
   JSON-LD). No se publicó la imagen: hay que confirmar
   cuáles son las medidas reales y corregir el lado que esté mal.
2. **La foto real** (`FOTOLINDABKF.jpeg`): confirmar que es un sillón de Taller
   Kappa y que se puede publicar la foto de esa casa. El sitio la presenta como
   "Foto sin editar, en una casa".
3. Firebase: `docs/firebase-puesta-en-marcha.md`.
4. Lo que ya estaba en `docs/tareas-pendientes.md`: verificación del Perfil de
   Empresa, más fotos reales, precio, directorios y reseñas.
5. Revisar la rama y decidir el merge. El deploy sale solo al llegar a `main`.

## 6. Mediano plazo

- Fotos reales del banco y de la base de mesa, y del taller trabajando: es lo
  que más cambia la percepción de marca y lo exige el Perfil de Empresa.
- Publicar un precio "desde" con vigencia (el código ya lo soporta).
- Con Firebase activo: subir `firebase` de versión mayor y cargar el catálogo
  desde el panel solo si el dueño lo va a mantener; hoy `data/products.js` es
  la fuente de verdad del prerender y del JSON-LD, y conviene que siga siéndolo.
- En GA4, registrar `customer_type` y `has_zone` como dimensiones
  personalizadas para ver qué proporción de presupuestos llega completa.
- Volver a medir con Search Console el 28/11/2026, como estaba previsto.

## 7. Impacto comercial esperado

**Medido:** nada todavía; la rama no está publicada.

**Hipótesis** (a comprobar en GA4 comparando `whatsapp_click` y
`whatsapp_checkout` por `location` contra los 28 días anteriores):

- Más clics a WhatsApp desde la home, por mostrar los productos antes y sumar
  dos llamadas a la acción (`home_feature`, `home_cta_final`).
- Menos idas y vueltas por consulta: el taller recibe tipo de cliente y zona.
- Más confianza en la landing del sillón por la foto sin editar.

Ninguna de las tres está demostrada.

## 8. Puntuación orientativa (0 a 100)

Son apreciaciones, no mediciones. Criterio: qué tan cerca está cada área de lo
que haría falta para no tener pendientes conocidos.

| Área | Antes | Después | Por qué no es más alto |
|---|---|---|---|
| Diseño | 72 | 82 | Tres de cuatro fotos de producto siguen con fondo editado; no hay fotos del taller |
| UX y conversión | 74 | 84 | Sin precio publicado; el presupuesto no se puede probar hasta el envío real |
| Frontend | 86 | 88 | Un solo archivo CSS de 1.100 líneas; sin tests automatizados en el repo |
| Backend y admin | 30 | 45 | Firebase sigue sin credenciales; nada se pudo probar contra un servicio real |
| SEO técnico | 92 | 92 | No se tocó; lo que falta está fuera del código (perfil de Google, reseñas, precio) |
| Rendimiento | 97 | 97 | Medido en laboratorio local, no en producción |
| Seguridad | 70 | 80 | Reglas mejoradas pero sin publicar; avisos de `npm audit` abiertos |
| Mantenibilidad | 82 | 84 | Las pruebas de recorrido de esta rama no quedaron en el repo |
