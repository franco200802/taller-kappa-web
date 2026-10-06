# B6.1-A — Confirmación de identidad comercial

> Relevamiento y preparación. No se modificó código, schema, JSON-LD, páginas, rutas, llms.txt, sitemap ni robots. No se tocó Google Business Profile ni Bing. No se inventó ningún dato.
> Base: `seo/b6-identidad-comercial-pendiente.md` (commit `845a579`) y `CONTEXTO_PROYECTO.md`.
> Estados: `CONFIRMADO` · `PENDIENTE DE CONFIRMACIÓN` · `NO EXISTE` / `NO DISPONIBLE` · `REQUIERE CONFIRMACIÓN`.
> Que un dato "esté confirmado" significa que hay evidencia suficiente en el repositorio. **No** lo convierte en dato definitivo para schema, perfiles o citas.

## A. Datos ya confirmados (según la evidencia disponible)

Hay dos niveles de evidencia:
- **[DUEÑO]**: `CONTEXTO_PROYECTO.md` ("Confirmado por el dueño", 1/10/2026, commit `003bf57`) registra la confirmación. Es una nota del proyecto, no un documento firmado.
- **[SITIO]**: el dato figura en el sitio publicado por el cliente y se usa de forma consistente (`data/business.js`, cuyo comentario dice que no se agregó ningún dato nuevo respecto de lo que ya figuraba). No hay confirmación expresa del dueño sobre cada uno.

| Dato | Valor | Evidencia | Observación |
|---|---|---|---|
| Razón social | Taller Kappa S.R.L. | [SITIO] `business.js`, footer, presupuesto | Sin documento societario en el repo |
| Nombre comercial | Taller Kappa | [SITIO] en todo el sitio | Sin variantes internas |
| Dirección | Calle 28 Nº 3779, Villa Chacabuco, San Martín, provincia de Buenos Aires, Argentina | [SITIO] `business.js` y 5 textos | Falta código postal; ver tabla B |
| Teléfono / WhatsApp | 11 6124-2498 (+54 11 6124-2498) | [SITIO] `business.js`, `contact.js` | Es un solo número; no se sabe si recibe llamadas |
| Horario | Lunes a viernes, 9 a 18 hs | [SITIO] `business.js` | Publicado como horario de **retiro**; su alcance no está aclarado |
| Testimonios (3) | "Franquicia YPF Full", "Local Gastronómico (Shell Select)", "Ricardo L. (Particular)" | [DUEÑO] confirmó que son ciertos | Ver sección C |
| Clientes y proyectos | YPF Full, McDonald's, Burger King, Shell Select, Sandro Paris (detalle de `Proyectos.jsx`) | [DUEÑO] confirmó que lo afirmado es cierto | La autorización de uso de logos **no** está documentada (sección D) |
| Antigüedad | "más de 15 años" | [DUEÑO] | Sin año exacto |
| Plazos de fabricación | 5 a 10 días hábiles (a medida) | [DUEÑO] | — |
| Banco BKF con asiento de cuero | Sí | [DUEÑO] | — |
| Diseño BKF de 1938 / MoMA | Afirmación histórica del sitio | [DUEÑO] (la guía cita fuentes externas) | No describe a Taller Kappa |
| Dominio | tallerkappa.com.ar | `CNAME`, `lib/site.js` | — |

## B. Datos que necesitan confirmación del cliente

| Tema | Situación actual | Decisión necesaria | Prioridad |
|---|---|---|---|
| **Nombre comercial exacto** | "Taller Kappa" en todo el sitio | Confirmar que ese es el nombre exacto a usar en todos los perfiles (sin agregados) | 🔥 |
| **Razón social exacta** | "Taller Kappa S.R.L." en el sitio. Una ficha externa en Cylex figura como "Talleres Kappa S de H, General San Martín" (`seo-google-fase-3.md`) | Confirmar la razón social exacta y qué relación hay con la denominación "Talleres Kappa S de H" (¿mismo negocio, anterior, otro?) | 🔥 |
| **Dirección pública** | Calle 28 Nº 3779, Villa Chacabuco, San Martín, provincia de Buenos Aires | ¿Es la dirección comercial pública para todos los perfiles? ¿Se muestra en el mapa o se oculta? Confirmar localidad ("San Martín" o "General San Martín") | 🔥 |
| **Código postal** | NO ENCONTRADO | Indicar el CP | 🟥 |
| **Showroom** | "Fábrica & Showroom" (pie) y "visitar el showroom" (FAQ) | ¿Existe showroom? | 🔥 |
| **Visita** | Solo mencionada en esa frase de la FAQ | ¿El cliente puede visitar el lugar? ¿Con turno o sin turno? | 🔥 |
| **Solo taller** | El resto del sitio dice "nuestro taller" y "retiro en el taller" | ¿Es solamente un taller de fabricación? | 🔥 |
| **Retiro de productos** | "Podés retirar tu pedido sin cargo en nuestro taller" | ¿Existe retiro? ¿Requiere coordinación previa? | 🟥 |
| **Alcance del horario 9–18** | Publicado como horario de retiro | ¿Es horario de atención comercial, solo de retiro, o ambos? | 🟥 |
| **Teléfono** | 11 6124-2498 | ¿Es el teléfono comercial? ¿Recibe llamadas? | 🟥 |
| **WhatsApp** | Mismo número | ¿Es el WhatsApp comercial definitivo? | 🟧 |
| **Email comercial** | `ing.franciscomarotta@gmail.com` (también cuenta de administración del panel) | `CONFIRMAR SI DEBE SER EL EMAIL COMERCIAL PÚBLICO` | 🟥 |
| **Relación con BKF** | El sitio dice "fábrica propia", "fabrica su propia versión de ese diseño", "directo de fábrica, comprás al productor". Nunca dice distribuidor ni revendedor | Ver pregunta crítica abajo | 🔥 |
| **Categoría comercial** | El sitio se describe como "fábrica de muebles de hierro y cuero" | Que el cliente indique con qué categoría se identifica. No se impone ninguna | 🟥 |
| **Condición fiscal** | Dos redacciones: "responsables inscriptos" y "contribuyentes responsables" | Confirmar la condición exacta y si se publica el CUIT | 🟨 |
| **Redes sociales** | NO ENCONTRADO en el repo | Instagram, Facebook, TikTok, LinkedIn u otros; si no existen: `NO DISPONIBLE` | 🟥 |
| **Google Business Profile** | NO ENCONTRADO en el repo | ¿Existe? URL, nombre exacto con el que figura, ¿está verificado? | 🔥 |
| **Bing Places / Webmaster** | NO ENCONTRADO en el repo | ¿Existe Bing Places? ¿Bing Webmaster? ¿Algún otro perfil empresarial? | 🟧 |
| **Año de fundación** | "más de 15 años" | ¿Quieren comunicar el año? | 🟩 |
| **Fotos reales** | Hay indicios de imágenes generadas con IA (`CONTEXTO_PROYECTO.md`: marca de agua de Gemini en tres archivos) | Qué fotos reales existen (sección F) | 🟥 |

**Pregunta crítica sobre BKF (no se modifica ninguna afirmación del sitio):**
¿Taller Kappa fabrica directamente los BKF que comercializa, o existe otra relación o productor que deba describirse de otra manera? Opciones a elegir por el cliente: fabricante de BKF · fabricante de muebles · fábrica propia · vendedor de BKF · otro (a describir). Aclarar también si parte de la producción se terceriza.

## C. Testimonios

**Confirmado:** el dueño confirmó que los tres testimonios actuales son ciertos ([DUEÑO], 1/10/2026). No se los reclasifica como dudosos.

| # | Texto | Identificador mostrado | Estrellas en el sitio |
|---|---|---|---|
| 1 | "Equipamos nuestro local de YPF Full con las Bases Flat de Taller Kappa. Soportan el alto tránsito sin problemas." | "— Franquicia YPF Full" | 5 (fijas en el marcado) |
| 2 | "La calidad del hierro es excelente y cumplieron con los tiempos pactados." | "— Local Gastronómico (Shell Select)" | 5 (fijas) |
| 3 | "Excelente atención de Francisco. Me asesoró con las medidas para mi mesa." | "— Ricardo L. (Particular)" | 5 (fijas) |

**Lo que falta confirmar (el repo no lo dice):**
- Nombre completo o identificador que debe mostrarse (hoy: una franquicia, un local, un nombre abreviado).
- Autorización de cada persona o empresa para publicarlo.
- Origen: ¿mensaje de WhatsApp, cliente directo, otro canal?
- ¿Existe una URL pública asociada? (`NO ENCONTRADO` en el repo).
- Si pueden usarse como testimonios en el sitio con ese formato.
- Cómo presentarlos: las 5 estrellas son un elemento del diseño, no una calificación registrada. `PENDIENTE DE CONFIRMACIÓN`: si el cliente tiene una calificación real, o si debe mostrarse sin estrellas.

**No se afirma** que sean reseñas de Google ni de ninguna plataforma: no hay evidencia. No se inventan estrellas ni plataforma. Tampoco se marcan como `Review` en el schema (decisión ya registrada en el proyecto).

## D. Logos de clientes

| Marca | Aparece en | Autorización confirmada | Acción (no ejecutar) |
|---|---|---|---|
| YPF / YPF Full | `Home`, `Proyectos`, `Nosotros`, `SillonBKF`, FAQ, testimonio nº 1 | No (trabajo confirmado, autorización no documentada) | Confirmar |
| McDonald's | `Home`, `Proyectos`, `Nosotros` | No documentada | Confirmar |
| Burger King | `Home`, `Proyectos`, `Nosotros` | No documentada | Confirmar |
| Shell / Shell Select | `Home`, `Proyectos`, `Nosotros`, testimonio nº 2 | No documentada | Confirmar |
| Sandro / Sandro Paris | `Home`, `Proyectos`, `Nosotros` | No documentada | Confirmar |

Hasta tener respuesta, la acción propuesta para las cinco es **confirmar**. Si alguna no cuenta con autorización, la decisión posterior sería **retirar** esa marca. No se ejecuta nada ahora. Nota: `Nosotros.jsx` dice "Hoy somos el proveedor de confianza de…", una formulación más fuerte que "hicimos trabajos para…": preguntar si corresponde.

## E. Qué evidencia ya existe y qué no
- Existe: confirmación del dueño sobre testimonios, clientes, antigüedad, plazos y Banco BKF.
- No existe en el repo: código postal, CUIT, redes, perfil de Google, Bing, URL de testimonios, autorización de logos, fotos reales del taller.

## F. Fotos y evidencia visual útiles para Local SEO / Entity SEO
Solo se lista qué convendría obtener. No se genera ni modifica ninguna imagen.

| Foto | Para qué sirve | Disponible |
|---|---|---|
| Fachada del local/taller (con número visible) | Confirma la dirección; perfil de Google | PENDIENTE DE CONFIRMACIÓN |
| Acceso / entrada | Que el cliente reconozca el lugar | PENDIENTE |
| Interior del taller | Muestra que fabrica | PENDIENTE |
| Showroom (solo si existe) | Evidencia de exhibición | PENDIENTE (depende de la respuesta sobre showroom) |
| Productos BKF reales (sillón, banco), con cuero y estructura en detalle | Fichas, perfiles, entidad | PENDIENTE (las actuales tendrían marca de agua de IA según `CONTEXTO_PROYECTO.md`; no verificado visualmente) |
| Base de mesa Flat real | Ídem | PENDIENTE |
| Proceso de fabricación (soldadura, pintura, tapizado) | Prueba de fabricación propia | PENDIENTE |
| Equipo / personas (si el cliente quiere mostrarse) | Confianza | PENDIENTE |
| Ubicación en la calle / entorno | Ayuda a encontrarlo | PENDIENTE |
| Entregas o instalaciones reales (con permiso del cliente final) | Prueba social | PENDIENTE |
Conviene que sean fotos propias, con fecha reciente, sin marcas de agua y con permiso de las personas que aparezcan.

## G. Fuente única de verdad — borrador (base para B6.1-B)

| Campo | Estado | Valor actual | Confirmación necesaria |
|---|---|---|---|
| Nombre comercial | REQUIERE CONFIRMACIÓN | Taller Kappa | Confirmar nombre exacto |
| Razón social | REQUIERE CONFIRMACIÓN | Taller Kappa S.R.L. | Confirmar y aclarar "Talleres Kappa S de H" |
| Calle y número | CONFIRMADO (según sitio) | Calle 28 Nº 3779 | Confirmar que es la dirección pública |
| Barrio | CONFIRMADO (según sitio) | Villa Chacabuco | — |
| Localidad | REQUIERE CONFIRMACIÓN | San Martín | "San Martín" o "General San Martín" |
| Provincia | CONFIRMADO (según sitio) | Buenos Aires | — |
| País | CONFIRMADO | Argentina | — |
| Código postal | PENDIENTE | NO ENCONTRADO | Indicar CP |
| Teléfono | CONFIRMADO (según sitio) | 11 6124-2498 | ¿Recibe llamadas? |
| WhatsApp | CONFIRMADO (según sitio) | 11 6124-2498 | ¿Es el comercial definitivo? |
| Email comercial | REQUIERE CONFIRMACIÓN | ing.franciscomarotta@gmail.com | `CONFIRMAR SI DEBE SER EL EMAIL COMERCIAL PÚBLICO` |
| Horario | REQUIERE CONFIRMACIÓN | Lun–vie 9–18 (como retiro) | ¿Atención, retiro o ambos? |
| Showroom | REQUIERE CONFIRMACIÓN | Sitio dice "showroom" y "retiro" | Sí / no |
| Visita al lugar | REQUIERE CONFIRMACIÓN | Solo una mención en FAQ | Sí / no; con o sin turno |
| Retiro en taller | REQUIERE CONFIRMACIÓN | Publicado en el sitio | Sí / no; ¿previa coordinación? |
| Categoría comercial | PENDIENTE | Sin categoría declarada por el cliente | La que elija el cliente |
| Relación con BKF | REQUIERE CONFIRMACIÓN | "Fábrica propia / fabrica su propia versión" | Respuesta a la pregunta crítica |
| Redes sociales | NO EXISTE en el repo | NO ENCONTRADO | Instagram, Facebook, TikTok, LinkedIn (o `NO DISPONIBLE`) |
| Google Business Profile | PENDIENTE | NO ENCONTRADO | Existencia, URL, nombre, verificación |
| Bing Places / Webmaster | PENDIENTE | NO ENCONTRADO | Existencia |
| Testimonios | CONFIRMADO (como reales, por el dueño) | 3 textos | Identificador, autorización, origen, presentación |
| Logos de clientes | REQUIERE CONFIRMACIÓN | 5 marcas | Autorización de uso |
| Fotos reales | PENDIENTE | Hay indicios de imágenes de IA | Qué fotos existen |
| Coordenadas | REQUIERE CONFIRMACIÓN | -34.5851938, -58.5281526 | Verificar que son las del lugar |
| Año de fundación | PENDIENTE | "más de 15 años" | ¿Se comunica el año? |
| CUIT / condición fiscal | PENDIENTE | NO ENCONTRADO / dos redacciones | Condición exacta y si se publica |

# Cuestionario de confirmación
*Para enviar al cliente. Contestar con "sí", "no" o el dato. Si algo no existe, escribir "no tenemos".*

### Identidad
1. ¿El nombre con el que quieren que los encuentren es exactamente "Taller Kappa"?
2. ¿Cuál es la razón social completa? ¿"Taller Kappa S.R.L." es correcta?
3. En Internet figura una ficha como "Talleres Kappa S de H, General San Martín". ¿Es de ustedes, de una etapa anterior o de otra empresa?

### Dirección
4. ¿La dirección que debe aparecer públicamente es Calle 28 Nº 3779, Villa Chacabuco, San Martín, provincia de Buenos Aires?
5. ¿Cuál es el código postal?
6. ¿Se escribe "San Martín" o "General San Martín"?

### Atención / showroom / retiro
7. ¿Tienen showroom (un lugar para ver los productos)?
8. ¿Un cliente puede ir a verlos, aunque no haya hecho un pedido? ¿Hace falta turno?
9. ¿El lugar es solo un taller de fabricación?
10. ¿Se pueden retirar los pedidos en el taller? ¿Hay que avisar antes?
11. El horario "lunes a viernes de 9 a 18": ¿es para atender al público, para retirar pedidos, o para las dos cosas?

### Contacto
12. ¿El 11 6124-2498 es el teléfono comercial? ¿Atienden llamadas o solo WhatsApp?
13. ¿Es también el WhatsApp comercial definitivo?
14. ¿Quieren que el email público sea `ing.franciscomarotta@gmail.com`, o prefieren otro (por ejemplo uno con el nombre de la empresa)?

### BKF
15. ¿Taller Kappa fabrica directamente los BKF que vende, o existe otro productor o relación que haya que describir de otra manera?
16. ¿Cómo prefieren presentarse: fabricante de BKF, fabricante de muebles, fábrica propia, vendedor de BKF u otra forma?
17. ¿Qué categoría describe mejor al negocio?

### Redes
18. ¿Tienen Instagram, Facebook, TikTok, LinkedIn u otro perfil oficial? Pasar los enlaces. Si no, escribir "no tenemos".

### Google / Bing
19. ¿Tienen ficha en Google (Google Maps / Perfil de Empresa)? ¿Cuál es el enlace y con qué nombre figura? ¿Está verificada?
20. ¿Tienen ficha en Bing (Bing Places) o algún otro directorio o perfil de empresa?

### Testimonios
21. De los tres testimonios del sitio: ¿de dónde vienen (WhatsApp, mensaje directo, otro)?
22. ¿Cómo prefieren que se muestre cada uno (nombre completo, nombre abreviado, nombre de la empresa)?
23. ¿Esas personas o empresas aceptaron que se publique su comentario?
24. ¿Tienen el enlace o una captura del mensaje original?

### Logos
25. ¿Tienen autorización de YPF, McDonald's, Burger King, Shell y Sandro para mostrar sus logos y nombrarlos como clientes?
26. ¿Están de acuerdo con la frase "proveedor de confianza de…"?

### Fotos
27. ¿Tienen fotos propias de: fachada, entrada, interior del taller, productos terminados, proceso de fabricación, equipo y entregas? Enviar las que haya (sin marca de agua).
28. ¿Quieren que se publique el año de fundación? ¿Cuál es?

---
*Este documento no avanza a B6.1-B. No se hicieron cambios de NAP, schema, JSON-LD, `sameAs`, `foundingDate`, `areaServed`, perfiles ni páginas.*
