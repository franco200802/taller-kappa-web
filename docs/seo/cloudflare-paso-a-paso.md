# Cloudflare: paso a paso para cerrar los problemas de indexación

> Qué resuelve: (1) `http://` responde 200 sin pasar a `https://`; (2) las URLs viejas
> (`/sillon-bkf.html`, etc.) no tienen un 301 real, solo una página con meta refresh;
> (3) los archivos estáticos se cachean pocas horas; (4) el email visible sale
> ofuscado para quien no ejecuta JavaScript.
>
> El dominio pasa por Cloudflare delante de GitHub Pages (por eso Cloudflare puede hacer
> lo que GitHub Pages no: 301 reales). **Los nombres de los menús cambian de vez en
> cuando**; si no encontrás uno, usá el buscador del panel con el nombre en inglés que
> aparece entre paréntesis. Tiempo estimado: 30 minutos.

## Estado de partida (medido con `curl` el 1/10/2026)

| Prueba | Hoy |
|---|---|
| `http://tallerkappa.com.ar/` | 200, **sin** redirigir a https |
| `https://www.tallerkappa.com.ar/` | 301 → `https://tallerkappa.com.ar/` (bien) |
| `/sillon-bkf.html`, `/catalogo/sillon-bkf-premium/` | 200 (página con meta refresh, no 301) |
| Caché de `/assets/*.js` | `max-age=14400` (4 horas) |
| Email en el HTML de `/contacto/` | ofuscado (`data-cfemail`) |
| GPTBot / OAI-SearchBot | 403 / 200 |

Guardá esta tabla: al final repetís las pruebas y comparás.

## Antes de empezar

1. **Mergeá el PR** `fix/recuperacion-seo` y esperá a que termine el deploy (pestaña
   *Actions* del repo en GitHub). Los destinos de las redirecciones ya existen hoy, pero
   así dejás todo consistente.
2. Tené a mano el acceso a Cloudflare con el dominio `tallerkappa.com.ar`.
3. Hacé los pasos **de a uno** y probá después de cada uno. Si algo sale mal, cada paso
   tiene su marcha atrás.

---

## Paso 1 — Verificar el modo SSL (obligatorio antes del paso 2)

**Dónde:** *SSL/TLS → Overview* (Encryption mode).

- Tiene que estar en **Full** (o *Full (strict)* si funciona).
- **No** dejes *Flexible*: combinado con "Enforce HTTPS" de GitHub Pages provoca un
  bucle de redirecciones ("demasiadas redirecciones") y el sitio deja de abrir.

**Revisión en GitHub:** repo → *Settings → Pages* → debe figurar el dominio
`tallerkappa.com.ar` y *Enforce HTTPS* tildado.

**Prueba:** abrí `https://tallerkappa.com.ar/` en una ventana privada: tiene que cargar.
**Si no carga:** volvé el modo al valor anterior.

## Paso 2 — Forzar HTTPS (Always Use HTTPS)

**Dónde:** *SSL/TLS → Edge Certificates* → **Always Use HTTPS** → *On*.
Además, activá **Automatic HTTPS Rewrites**.

**Prueba:**

```bash
curl -sI http://tallerkappa.com.ar/ | head -3
# esperado: HTTP/1.1 301 ... y  Location: https://tallerkappa.com.ar/
```

**Marcha atrás:** apagar el interruptor.
**No actives HSTS todavía**: es difícil de deshacer; dejalo para cuando todo lleve
semanas funcionando.

## Paso 3 — Redirecciones 301 reales (Redirect Rules)

**Dónde:** *Rules → Redirect Rules → Create rule* (en el panel nuevo puede decir
*Rules → Overview → Create rule → Redirect Rule*). El plan gratuito permite 10 reglas:
alcanza justo con las de abajo.

Cada regla se configura igual:

- **Rule name:** el de la tabla.
- **When incoming requests match… → Custom filter expression** → *Edit expression* y
  pegar la expresión de la tabla.
- **Then → Type:** *Static*. **URL:** la de destino. **Status code:** *301*.
- Tildar **Preserve query string**.
- *Deploy*.

| # | Nombre | Expresión (pegar tal cual) | URL de destino |
|---|---|---|---|
| 1 | `sillon-bkf html` | `(http.host eq "tallerkappa.com.ar" and http.request.uri.path eq "/sillon-bkf.html")` | `https://tallerkappa.com.ar/sillon-bkf/` |
| 2 | `ficha sillon a landing` | `(http.host eq "tallerkappa.com.ar" and http.request.uri.path in {"/catalogo/sillon-bkf-premium" "/catalogo/sillon-bkf-premium/"})` | `https://tallerkappa.com.ar/sillon-bkf/` |
| 3 | `catalogo html` | `(http.host eq "tallerkappa.com.ar" and http.request.uri.path eq "/catalogo.html")` | `https://tallerkappa.com.ar/catalogo/` |
| 4 | `nosotros html` | `(http.host eq "tallerkappa.com.ar" and http.request.uri.path eq "/nosotros.html")` | `https://tallerkappa.com.ar/nosotros/` |
| 5 | `faq html` | `(http.host eq "tallerkappa.com.ar" and http.request.uri.path eq "/faq.html")` | `https://tallerkappa.com.ar/faq/` |
| 6 | `contacto html` | `(http.host eq "tallerkappa.com.ar" and http.request.uri.path eq "/contacto.html")` | `https://tallerkappa.com.ar/contacto/` |
| 7 | `proyectos html` | `(http.host eq "tallerkappa.com.ar" and http.request.uri.path eq "/proyectos.html")` | `https://tallerkappa.com.ar/proyectos/` |
| 8 | `envios html` | `(http.host eq "tallerkappa.com.ar" and http.request.uri.path eq "/envios.html")` | `https://tallerkappa.com.ar/envios/` |
| 9 | `garantia html` | `(http.host eq "tallerkappa.com.ar" and http.request.uri.path eq "/garantia.html")` | `https://tallerkappa.com.ar/garantia/` |
| 10 | `index html a home` | `(http.host eq "tallerkappa.com.ar" and http.request.uri.path eq "/index.html")` | `https://tallerkappa.com.ar/` |

**Importante:**
- **No uses una regla comodín `*.html`**: mandaría `/index.html` a `/index/` (que no
  existe) y `/404.html` a `/404/`. Por eso van una por una.
- Estas reglas se ejecutan **antes** de GitHub Pages, así que reemplazan a las páginas
  puente. Las páginas puente del sitio se dejan como respaldo: no estorban.
- Las versiones sin barra (`/catalogo`, `/sillon-bkf`…) siguen resolviéndose con la página
  puente (que ya trae el título y el canonical correctos). Si querés un 301 también ahí,
  usá *Bulk Redirects* (más abajo, opcional).

**Prueba (una por una):**

```bash
curl -sI https://tallerkappa.com.ar/sillon-bkf.html | head -3
# esperado: 301 y  location: https://tallerkappa.com.ar/sillon-bkf/
curl -sI https://tallerkappa.com.ar/catalogo/sillon-bkf-premium/ | head -3
# esperado: 301 y  location: https://tallerkappa.com.ar/sillon-bkf/
curl -sI https://tallerkappa.com.ar/index.html | head -3
# esperado: 301 y  location: https://tallerkappa.com.ar/
```

**Marcha atrás:** desactivar o borrar la regla desde la lista.

### Opcional: sin barra final con *Bulk Redirects*

*Rules → Bulk Redirects → crear una lista* con estas entradas (Status 301, "Preserve
query string" y "Subpath matching" apagado) y asociarla a una regla:

`/catalogo` → `/catalogo/` · `/sillon-bkf` → `/sillon-bkf/` · `/nosotros` → `/nosotros/` ·
`/faq` → `/faq/` · `/contacto` → `/contacto/` · `/proyectos` → `/proyectos/` ·
`/envios` → `/envios/` · `/garantia` → `/garantia/` (todas sobre `https://tallerkappa.com.ar`).

## Paso 4 — Caché de archivos estáticos (Cache Rules)

**Dónde:** *Caching → Cache Rules → Create rule*. Hoy `/assets/*` se guarda 4 horas y el
resto, 10 minutos. Los archivos de `/assets/` llevan un hash en el nombre (cambian de nombre
cuando cambian), así que se pueden guardar mucho tiempo.

| Regla | Cuando la URL empieza con | Eligibilidad | Edge TTL | Browser TTL |
|---|---|---|---|---|
| `assets largos` | `/assets/` | *Eligible for cache* | 1 mes | **1 año** |
| `imagenes y fuentes` | `/images/` o `/fonts/` | *Eligible for cache* | 1 mes | **1 mes** |

En cada una: *Edge TTL → Ignore cache-control header and use this TTL*; *Browser TTL →
Override origin and use this TTL*.

**Por qué las imágenes solo 1 mes:** sus nombres no cambian (por ejemplo
`sillon-bkf-hierro-cuero.jpg`); si reemplazás una foto, el navegador podría seguir
mostrando la vieja hasta que venza. Después de cambiar fotos: *Caching → Configuration →
Purge Cache → Custom Purge*.

**No cachees el HTML** con reglas propias: tiene que reflejar cada deploy.

**Prueba:**

```bash
A=$(curl -s https://tallerkappa.com.ar/ | grep -o '/assets/index-[A-Za-z0-9_-]*\.js' | head -1)
curl -sI "https://tallerkappa.com.ar$A" | grep -iE "cache-control|cf-cache-status"
# esperado: cache-control con max-age=31536000 (1 año); la 2ª vez, cf-cache-status: HIT
```

## Paso 5 — Email visible sin ofuscar

**Dónde:** *Scrape Shield → Email Address Obfuscation* → *Off*. (En el panel nuevo puede
estar en *Security → Settings*.)

- **Por qué:** hoy el HTML dice `[email protected]` para quien no ejecuta JavaScript
  (rastreadores, asistentes de IA). El JSON-LD y `llms.txt` ya lo muestran en claro, pero
  conviene que el texto visible también.
- **Costo:** los robots que juntan emails para spam podrán leerlo. Es una decisión tuya:
  si preferís protegerlo, dejá la opción *On*; la información de contacto igual llega a
  los buscadores por el JSON-LD.

**Prueba:**

```bash
curl -s https://tallerkappa.com.ar/contacto/ | grep -c 'data-cfemail'
# esperado: 0
```

## Paso 6 — Bots de IA (decisión, no arreglo)

**Dónde:** *Security → Bots* (sección *AI Scrapers and Crawlers* / *Block AI bots*).

Hoy Cloudflare bloquea con 403 a los rastreadores de **entrenamiento** (GPTBot, ClaudeBot,
CCBot, Amazonbot, Bytespider, anthropic-ai, cohere-ai) y deja pasar a los de **búsqueda y
asistentes** (OAI-SearchBot, ChatGPT-User, Claude-SearchBot, Claude-User, PerplexityBot,
Applebot) y a **todos los de Google**. Mi recomendación: **dejarlo como está**, que
protege el contenido sin afectar la visibilidad en buscadores ni en asistentes. Si algún día
querés que también entren los de entrenamiento, apagá la opción.

## Paso 7 — Qué NO tocar

- *Rocket Loader*, *Auto Minify* y *Mirage*: no los actives; pueden romper la
  hidratación de React.
- *Always Online*: no hace falta.
- No agregues reglas de redirección de `www`: ya funciona (301 al dominio sin www).

---

## Prueba final (repetí la tabla de partida)

```bash
curl -sI http://tallerkappa.com.ar/ | head -3                               # 301 -> https
curl -sI https://www.tallerkappa.com.ar/ | head -3                          # 301 -> sin www
curl -sI https://tallerkappa.com.ar/sillon-bkf.html | head -3               # 301 -> /sillon-bkf/
curl -sI https://tallerkappa.com.ar/catalogo/sillon-bkf-premium/ | head -3  # 301 -> /sillon-bkf/
curl -s  https://tallerkappa.com.ar/contacto/ | grep -c data-cfemail        # 0
curl -s -o /dev/null -w "%{http_code}\n" -A "Googlebot/2.1" https://tallerkappa.com.ar/   # 200
```

Y el navegador: abrí `https://tallerkappa.com.ar/sillon-bkf.html`; tiene que llevarte a
`/sillon-bkf/` sin mostrar la página puente.

## Después, en Search Console

1. *Inspección de URLs* de `https://tallerkappa.com.ar/` y `/sillon-bkf/` → *Solicitar
   indexación*.
2. En *Páginas*, las URLs `.html` y `/catalogo/sillon-bkf-premium/` deberían pasar a
   "Página con redirección" en las semanas siguientes. Es lo esperado, no un error.
3. Anotá la fecha del cambio para comparar el Rendimiento antes y después.

## Si algo sale mal

| Síntoma | Causa probable | Qué hacer |
|---|---|---|
| "Demasiadas redirecciones" al abrir el sitio | Modo SSL en *Flexible* + *Enforce HTTPS* en GitHub | Paso 1: poner *Full* |
| Una regla manda a una página en blanco o 404 | URL de destino mal escrita | Revisar la URL (con `https://` y barra final) |
| Una foto cambió pero se ve la anterior | Caché de imágenes | *Purge Cache → Custom Purge* de esa URL |
| El sitio no refleja un deploy reciente | Caché del navegador (10 min para HTML) | Recarga forzada; esperar unos minutos |
