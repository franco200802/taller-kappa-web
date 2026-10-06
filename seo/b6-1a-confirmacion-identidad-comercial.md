# B6.1-A — Confirmación de identidad comercial (CERRADO)

> Cierre documental de la fase. No se modificó código, JSX, CSS, rutas, schema, JSON-LD, sitemap, robots, llms.txt, GA4, Firebase, imágenes ni redirects. No se tocó Google Business Profile ni Bing. No se inventó ningún dato.
> Base: `seo/b6-identidad-comercial-pendiente.md` (B6.0, commit `845a579`), versión previa de este documento (commit `68e5886`) y las respuestas confirmadas por el propietario el 6/10/2026.
> Esta tabla reemplaza a las "contradicciones" y "pendientes" de B6.0 en todo lo que se confirma abajo. Es la fuente de verdad para B6.1-B.

Fuentes de evidencia:
- **[PROPIETARIO 6/10/2026]**: respuesta confirmada del propietario en esta fase.
- **[DUEÑO 1/10/2026]**: nota "Confirmado por el dueño" en `CONTEXTO_PROYECTO.md` (commit `003bf57`).
- **[SITIO]**: figura en el sitio publicado y en `data/business.js`; no hay confirmación expresa adicional.

Estados: `CONFIRMADO` · `PENDIENTE` · `NO DISPONIBLE / NO SE PUBLICARÁ`.

---

## 1. Fuente única de verdad

### 1.1 Identidad y ubicación
| Campo | Valor | Estado | Uso futuro |
|---|---|---|---|
| Nombre | Taller Kappa S.R.L. (nombre comercial en el sitio: "Taller Kappa") | CONFIRMADO [PROPIETARIO] | `name`/`legalName` en NAP, perfiles y schema (B6.1-B) |
| Actividad | Fabricación directa de productos BKF | CONFIRMADO [PROPIETARIO] | Descripción de empresa, perfiles, schema |
| Dirección | Calle 28 Nº 3779 | CONFIRMADO [PROPIETARIO] | NAP único |
| Barrio / localidad | Villa Chacabuco | CONFIRMADO [PROPIETARIO] | NAP, `location` |
| Partido / localidad | San Martín | CONFIRMADO [PROPIETARIO] | NAP (queda resuelto: no es "General San Martín") |
| Provincia | Buenos Aires | CONFIRMADO [PROPIETARIO] | NAP |
| País | Argentina | CONFIRMADO [PROPIETARIO] | NAP |
| Código postal | 1650 | CONFIRMADO [PROPIETARIO] | NAP, `postalCode` (hoy ausente del sitio) |
| Coordenadas | -34.5851938, -58.5281526 (en `business.js`) | PENDIENTE: verificar que correspondan a Calle 28 Nº 3779 | No cambiarlas hasta verificar |

### 1.2 Atención presencial
| Campo | Valor | Estado | Uso futuro |
|---|---|---|---|
| Showroom | Sí. Funciona en la ubicación de Taller Kappa | CONFIRMADO [PROPIETARIO] | Pie de página y FAQ ya lo dicen; schema/perfiles deben coincidir |
| Visitas | Se permiten | CONFIRMADO [PROPIETARIO] | Texto de contacto y perfiles |
| Turno | **Con turno previo** | CONFIRMADO [PROPIETARIO] | Aclarar en texto "visitas con turno" |
| Cómo se pide el turno | No indicado | PENDIENTE (se asume WhatsApp solo si el cliente lo confirma) | Texto de contacto |
| Retiro presencial de productos | Sí, existe | CONFIRMADO [PROPIETARIO] | Texto de envíos y perfiles |
| ¿El retiro requiere coordinación previa? | No indicado (solo las visitas requieren turno) | PENDIENTE | Texto de envíos |
| Horario | Lunes a viernes de 9:00 a 18:00 | CONFIRMADO [PROPIETARIO] | Se trata como horario de atención/showroom/retiro. Ver nota |

**Nota sobre el horario:** `business.js` lo comentaba como "horario de retiro que ya publica /envios/", pero ninguna documentación del repositorio establece un horario distinto de atención. Por indicación del propietario se trata como horario confirmado de atención, showroom y retiro. Las visitas dentro de ese horario son con turno previo.

### 1.3 Contacto
| Campo | Valor | Estado | Uso futuro |
|---|---|---|---|
| Teléfono | 11 6124-2498 (+54 11 6124-2498) | CONFIRMADO [PROPIETARIO] | NAP |
| WhatsApp | 11 6124-2498 | CONFIRMADO [PROPIETARIO] | CTA, NAP |
| Email | `ing.franciscomarotta@gmail.com` (el publicado) | CONFIRMADO: se mantiene [PROPIETARIO] | Contacto público. **No** se inventa un correo corporativo |

Observación técnica (no es una pregunta al cliente): el mismo correo es la cuenta de administración en `firestore.rules`. No afecta esta fase.

### 1.4 Fabricación y producto
| Campo | Valor | Estado | Uso futuro |
|---|---|---|---|
| Fabricante BKF | Taller Kappa fabrica directamente los BKF que comercializa. No es solo revendedor ni distribuidor | CONFIRMADO [PROPIETARIO] | Descripciones, perfiles, `manufacturer` |
| BKF de cuero | Fabricación propia | CONFIRMADO [PROPIETARIO] | Contenido futuro; ver nota |
| BKF Premium | Fabricación propia | CONFIRMADO [PROPIETARIO] | Ídem |
| Banco BKF | Fabricación propia | CONFIRMADO [PROPIETARIO] | Ídem |
| Todos los BKF comercializados | De fabricación propia | CONFIRMADO [PROPIETARIO] | Texto "fábrica propia" |
| Base de Mesa Flat | El sitio dice que se fabrica en el taller; la confirmación del propietario nombró solo productos BKF | PENDIENTE: confirmar fabricación propia si se quiere afirmar | Texto de catálogo |
| Trayectoria | Más de 15 años | CONFIRMADO [PROPIETARIO] y [DUEÑO] | Claim documentado; sin año exacto |
| Plazo de entrega | 5–10 días hábiles | CONFIRMADO [PROPIETARIO] | Claim documentado. En el sitio se aplica a pedidos a medida; los plazos con stock (24–48 hs, 2–5 días, etc.) están en `/envios/` [SITIO] |

**Nota sobre "BKF de cuero" y "BKF Premium":** el catálogo actual (`data/products.js`) tiene solo tres productos: Sillón BKF Premium, Banco BKF y Base de Mesa Flat. No existe un producto "BKF de cuero" aparte (el cuero es el material). La confirmación de fabricación propia vale para ambos, pero **si son modelos distintos o solo nombres** sigue pendiente para la decisión B3–B5 (ver `b9-datos-y-criterios.md`). No se modifica nada.

### 1.5 Presencia externa
| Campo | Valor | Estado | Uso futuro |
|---|---|---|---|
| Google Business Profile | No hay uno confirmado | NO DISPONIBLE (actualmente) | Crearlo/reclamarlo en una fase posterior |
| Bing Places | No hay uno confirmado | NO DISPONIBLE (actualmente) | Idem |
| Redes sociales oficiales | No hay perfiles confirmados | NO DISPONIBLE (actualmente). No se agrega `sameAs` ni URLs | Idem |
| Ficha Cylex "Talleres Kappa S de H" | Corresponde a Taller Kappa | CONFIRMADO [PROPIETARIO] | Evaluar después la consistencia de la denominación externa ("Talleres Kappa S de H" frente a "Taller Kappa S.R.L."); sin acciones ahora |
| CUIT | El propietario no quiere publicarlo | NO SE PUBLICARÁ | No incorporarlo al sitio, schema ni documentación pública |

### 1.6 Prueba social
| Campo | Valor | Estado | Uso futuro |
|---|---|---|---|
| Testimonios (3) | Reales, recibidos por WhatsApp | CONFIRMADO [PROPIETARIO] | Ver sección 2 |
| Clientes / proyectos | Reales (YPF Full, McDonald's, Burger King, Shell Select, Sandro Paris) | CONFIRMADO [PROPIETARIO] | Mantener |
| Logos de clientes | Se mantienen; el propietario quiere seguir usándolos | Logos/clientes actualmente utilizados en el sitio; **autorización formal no documentada en esta fase** | No es bloqueo; no se retiran |

---

## 2. Testimonios
**Confirmado:** los tres testimonios son reales y fueron recibidos por WhatsApp.

| # | Texto | Identificador que muestra hoy el sitio | Estado |
|---|---|---|---|
| 1 | "Equipamos nuestro local de YPF Full con las Bases Flat de Taller Kappa. Soportan el alto tránsito sin problemas." | "— Franquicia YPF Full" | Real, por WhatsApp |
| 2 | "La calidad del hierro es excelente y cumplieron con los tiempos pactados." | "— Local Gastronómico (Shell Select)" | Real, por WhatsApp |
| 3 | "Excelente atención de Francisco. Me asesoró con las medidas para mi mesa." | "— Ricardo L. (Particular)" | Real, por WhatsApp |

Reglas de esta fase:
- No se inventan nombres, apellidos ni identidades. No se atribuyen nombres ficticios.
- No son reseñas de Google ni de otra plataforma: son mensajes de WhatsApp. No se los llama así.
- No existe URL pública asociada.
- La autorización para publicar la **identidad** de cada cliente no está documentada.

**Recomendación para una implementación futura (no se ejecuta):** presentarlos como *testimonios de clientes reales recibidos por WhatsApp*, sin nombre, salvo que el cliente autorice publicar su identidad. En particular, confirmar si "Ricardo L." puede seguir apareciendo con esa inicial. Las 5 estrellas del diseño no corresponden a una calificación registrada: decidir después si se mantienen. No marcar como `Review` en el schema (decisión ya vigente).
**PENDIENTE:** autorización de identidad por testimonio y decisión sobre las estrellas.

## 3. Logos de clientes
| Marca | Aparece en | Estado |
|---|---|---|
| YPF / YPF Full | `Home`, `Proyectos`, `Nosotros`, `SillonBKF`, FAQ | Cliente real [PROPIETARIO]; uso del logo: autorización formal no documentada en esta fase |
| McDonald's | `Home`, `Proyectos`, `Nosotros` | Ídem |
| Burger King | `Home`, `Proyectos`, `Nosotros` | Ídem |
| Shell / Shell Select | `Home`, `Proyectos`, `Nosotros` | Ídem |
| Sandro / Sandro Paris | `Home`, `Proyectos`, `Nosotros` | Ídem |

Acción para las cinco: **mantener**. No es un bloqueo. No se afirma que exista autorización formal. Observación para B6.1-B: la frase "Hoy somos el proveedor de confianza de…" (`Nosotros.jsx`) es más fuerte que "hicimos trabajos para…"; se registra para revisarla con el propietario, sin cambiarla.

## 4. Contradicciones de B6.0 que quedan resueltas
| Contradicción anterior | Resolución |
|---|---|
| Showroom (pie y FAQ) vs. "solo retiro en el taller" | Hay showroom en la ubicación de Taller Kappa, con visitas con turno **y** retiro. Ambos conceptos son verdaderos y coexisten |
| Fabricante vs. revendedor | Fabricación directa y propia de los BKF; no es solo revendedor ni distribuidor |
| Retiro vs. atención | El horario 9:00–18:00 se trata como atención, showroom y retiro |
| Horario de "retiro" usado como horario general | Queda resuelto con la regla de la sección 1.2. Esto afecta cómo se emitirá el horario en schema (B6.1-B); no se toca ahora |
| Código postal inexistente | 1650 |
| "San Martín" vs. "General San Martín" | San Martín |
| Ficha Cylex de otra razón social | Corresponde a Taller Kappa; queda solo la tarea de unificar la denominación |
| Gmail como email público | Se mantiene; no se crea un correo corporativo |

## 5. Pendiente real para B6.1-B
Solo lo que sigue sin confirmación:
1. Cómo se solicita el turno de visita (¿por WhatsApp?) y si el retiro requiere coordinación previa.
2. Verificar las coordenadas del mapa contra la dirección.
3. Categoría comercial que el propietario considera correcta (no se respondió).
4. Si "BKF de cuero" y "BKF Premium" son modelos distintos o nombres de variantes (impacta B3–B5).
5. Confirmar fabricación propia de la Base de Mesa Flat si se quiere afirmar explícitamente.
6. Testimonios: autorización de identidad y decisión sobre las estrellas.
7. Fotos reales (fachada, showroom, taller, productos): disponibilidad. Hay indicios de imágenes con marca de agua de IA en tres archivos (`CONTEXTO_PROYECTO.md`, no verificado visualmente).
8. Condición fiscal: el sitio tiene dos redacciones ("responsables inscriptos" / "contribuyentes responsables"). Elegir una. No se publica el CUIT.
9. Año exacto de fundación: opcional; hoy solo "más de 15 años".
10. Creación de Google Business Profile, Bing Places y redes: **no disponibles hoy**; decisión de hacerlo en una fase posterior.

## 6. Qué cambiaría B6.1-B (no se ejecuta aquí)
Solo como referencia, sin implementar: unificar la dirección en una única fuente con CP 1650; aclarar en el texto que las visitas son con turno; ajustar el horario según 1.2; revisar `FurnitureStore` según la categoría que elija el cliente; mantener el Gmail; no agregar CUIT, `sameAs` ni `foundingDate`.

---
*Documento histórico previo: B6.0 (`b6-identidad-comercial-pendiente.md`) conserva el estado antes de estas confirmaciones. Esta versión de B6.1-A es la vigente.*
