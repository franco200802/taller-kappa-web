# Pull Request #34 de `growth/operacion-ventas-nov-2026` (abierto, sin merge)

> **Creado el 25/11/2026 con autorización del dueño:**
> https://github.com/franco200802/taller-kappa-web/pull/34. **El merge todavía
> no está autorizado.** A esa fecha, la rama está al día con `main` (`562d4c3`) y
> GitHub no marca conflictos. Al mergear, GitHub Actions hace `npm ci` + `npm run build` (Node 20), publica en
> Pages y avisa a IndexNow; **no corre las pruebas**, por eso van abajo con su
> resultado.

## 1. Antes del merge (lo que tenés que confirmar)

Afirmaciones comerciales que la rama publica y que conviene confirmar:

| # | Afirmación | Dónde | Estado | Si no se confirma |
|---|---|---|---|---|
| 1 | **"Podés pedir solo la estructura"** / "Se puede pedir solo la estructura" | `/mobiliario-comercial/` (sección y FAQ) | **Confirmada por el dueño el 25/11/2026** | — |
| 2 | Estructuras de hierro por encargo para sillas, sillones, bancos y mesas, para mueblerías, fabricantes y estudios, "con un plano, un boceto o una foto de referencia" | `/mobiliario-comercial/`, FAQ general y `llms.txt` | **Nueva** como oferta a esos segmentos | Ajustar el texto a lo que sí se hace |
| 3 | "Taller Kappa fabricó y entregó bases de mesa Flat para las tiendas YPF Full, con acabado epoxi negro mate" | Ficha de la base, FAQ de la categoría mesas | Ya publicada en `/proyectos/` y confirmada el 1/10/2026; ahora se repite en dos páginas más | Confirmar que se puede seguir nombrando al cliente |
| 4 | Estructuras para el mobiliario de salón de McDonald's y exhibidores cromados para Sandro | `/mobiliario-comercial/` | Ya publicada en `/proyectos/` (1/10/2026) | Ídem |
| 5 | Por cantidad, en la altura y el color elegidos, con factura A o B; 3 o más unidades con envío bonificado en GBA | Ficha de la base, FAQ de la categoría | Ya publicada en `/envios/` y la FAQ | Confirmar que sigue vigente |
| 6 | "Cotizar algo similar" en cada caso de `/proyectos/` | `/proyectos/` | Supone que se pueden hacer trabajos parecidos para otros clientes | — |

Sin cambios de precio, plazo, stock, cuotas, descuentos ni garantía.

## 2. Texto del PR (el publicado en el #34)

**Título:** `Growth B2B: medición limpia en GA4 y cotización por cantidad para empresas`

**Cuerpo:**

```markdown
## Por qué

Datos de los últimos 28 días (Search Console, GA4 y Perfil de Empresa; detalle en `docs/growth/README.md`):
- 12 de los 17 clics a WhatsApp salieron de páginas para empresas (mobiliario comercial 6, Base Flat y su categoría 4, proyectos 2); `/sillon-bkf/` dio 1.
- El 27 % de las páginas vistas de GA4 venía de pruebas en `localhost`, y cada navegación interna contaba dos `page_view`.

## Qué cambia

**Medición**
- GA4 solo se carga en `tallerkappa.com.ar` (antes también en `vite preview`, pruebas y Lighthouse).
- El `page_view` sale cuando la página nueva ya montó y lleva su título (antes, el de la página anterior).

**Empresas (B2B)**
- Base de Mesa Flat: bloque "por cantidad para bares, restaurantes y franquicias" con la entrega a YPF Full y un WhatsApp que pide rubro, cantidad, altura, color y zona; título orientado al uso; dos preguntas (barra, tapa).
- Categoría mesas: pregunta de compra por cantidad; su WhatsApp ahora pide "bases de mesa" (antes "mesas").
- Mobiliario comercial: sección y pregunta para mueblerías, fabricantes y estudios de arquitectura (estructuras por encargo), con su propio WhatsApp.
- Proyectos: botón de cotización arriba y "Cotizar algo similar" en cada caso, con el nombre del cliente en el mensaje y enlace al producto relacionado.
- Los mensajes de empresa de mobiliario comercial y proyectos terminan con la URL de la página.
- FAQ general y `llms.txt`: estructuras por encargo.

**Documentación**: `docs/growth/` (diagnóstico, SEO y competencia, estrategia, plan de 90 días, medición, GA4, Perfil de Empresa), `CONTEXTO_PROYECTO.md` §5o y `docs/tareas-pendientes.md`.

## Cómo se probó

- `npm run build`: 15 rutas + 404.html, sin avisos de la validación SEO/GEO.
- `npm run test:unit`: 22/22.
- `npm run test:e2e:conversion` (Chrome): 13/13. Las nuevas fallan con el código anterior.
- React Doctor (`--scope changed`): 96/100, sin problemas.
- Lighthouse móvil, mediana de 3, `main` contra la rama (medido sobre `235e28b`; lo posterior no agrega recursos): sin regresión (Base Flat 97/96, mobiliario 97/97; accesibilidad y SEO 100; CLS 0).
- 360 y 1440 px sin desborde; sin errores de consola; modo inglés traducido.
- Recorrido con el gtag.js real y los envíos a Google abortados: un `whatsapp_click` por clic, con la página correcta.

## Antes del merge

Confirmar estas afirmaciones (detalle en `docs/growth/pull-request.md` §1); la de que se puede pedir solo la estructura ya está confirmada:
- [ ] Encargos de mueblerías, fabricantes y estudios a partir de plano, boceto o foto.
- [ ] Nombrar a YPF Full, McDonald's y Sandro también en la ficha de la base y en mobiliario comercial.
- [ ] Envío bonificado en GBA para 3 o más unidades, con factura A o B, sigue vigente.

## Ya aplicado en las cuentas (25/11/2026)

- GA4: el parámetro `text` se oculta (los clics a WhatsApp llegan con `text=(redacted)`) y hay 8 dimensiones nuevas (`Boton o zona`, `Producto`, `Tipo de cliente`, `Presupuesto con zona`, `Presupuesto con comentario`, `Asistente IA`, `Interes del formulario`, `Variante`).
- Perfil de Empresa: enlace al sitio con UTM, Instagram y servicios (en revisión de Google).

## Después del merge

- [ ] GA4, el mismo día: apagar "Cambios de página basados en eventos del historial del navegador" (`docs/growth/ga4-configuracion.md` §3 B).
- [ ] GA4 → Tiempo real: el nombre de host es solo `tallerkappa.com.ar`.
- [ ] Mandar a un número propio los WhatsApp de la Base Flat ("Cotizar bases por cantidad"), de mobiliario comercial ("Cotizar estructuras") y de un caso de proyectos.
- [ ] Search Console: inspeccionar `/catalogo/base-de-mesa-flat/` y `/proyectos/` y pedir indexación.

🤖 Generated with [Claude Code](https://claude.com/claude-code)

https://claude.ai/code/session_01P18ZFHe8kYC46jYMdSzAhV
```

## 3. Comandos usados el 25/11/2026

```bash
git push -u origin growth/operacion-ventas-nov-2026
gh pr create --base main --head growth/operacion-ventas-nov-2026 \
  --title "Growth B2B: medición limpia en GA4 y cotización por cantidad para empresas" \
  --body-file <archivo con el cuerpo de arriba>
```

## 4. Riesgos y vuelta atrás

| Riesgo | Mitigación |
|---|---|
| Afirmaciones 2 a 5 de §1 sin confirmar (la 1 ya está confirmada) | Confirmarlas o sacar la frase antes del merge |
| Corte en la serie de GA4 (menos usuarios y páginas vistas desde el deploy) | Esperado: se van las pruebas locales y, con el cambio B, el duplicado. Anotar la fecha |
| Título nuevo de la Base Flat sin "Taller Kappa" | Si en 4 semanas pierde impresiones, se vuelve al anterior (un cambio en `products.js`) |
| Algo se rompe en producción | `git revert` del merge y el deploy vuelve solo al estado anterior |
