# Auditoría integral SEO / AEO / GEO / AIO / SXO (6/11/2026)

Alcance: revisión del repo completo, de la documentación SEO previa (fases 2 a 4, B6 a B10) y de producción
(`curl`, Lighthouse 12 móvil). Se priorizó **no repetir** lo ya hecho. Todo lo medido figura con su método;
lo demás es potencial y está marcado como tal.

## 1. Ya implementado (verificado en código o en producción, no se tocó)

| Área | Evidencia |
|---|---|
| SEO técnico | canonical con barra final, sitemap con `lastmod` real por git, robots, 301 reales de http→https y `.html` (Cloudflare), 404 con noindex, build que corta ante h1/title/description duplicados, links rotos, huérfanas, `<img>` sin alt |
| Schema | grafo único por `@id` (LocalBusiness+FurnitureStore, Brand, WebSite, WebPage, Product sin precio inventado, FAQPage solo con FAQ visible, BreadcrumbList) |
| AEO | definición citable al inicio de cada ficha, tablas de ficha técnica, FAQ visibles (`data/faq.js`) |
| GEO/AIO | `llms.txt` generado en cada build, `sameAs` (Google Maps, Instagram), evento `ai_referral` en GA4, bots de búsqueda/asistentes de IA permitidos (OAI-SearchBot, ChatGPT-User, PerplexityBot, Claude-SearchBot, bingbot, Googlebot responden 200) |
| SXO | WhatsApp con mensaje prellenado + URL, flotante que se oculta junto a otros CTA, medición `whatsapp_click`/`phone_click`/`email_click`/`review_click`/`select_item`, GA4 diferido |
| Rendimiento | fuente autoalojada con preload, íconos SVG en línea, mapa diferido, imágenes avif/webp |

## 2. Hallazgos y estado

| # | Hallazgo | Prioridad | Estado |
|---|---|---|---|
| 1 | **CLS 0,32 en `/sillon-bkf/`** (Lighthouse móvil, producción): el párrafo del hero salta al cargar la fuente Archivo. Umbral "bueno" de Core Web Vitals: 0,1 | Alta | **Corregido** (ver §3) |
| 2 | La FOTOCONMEDIDAS.png (sin trackear en la raíz) muestra medidas **77 x 77 x 102 cm** (y 87, 73); el sitio publica **78 x 70 x 90 cm** | Alta | **Requiere decisión del dueño**: no se tocó ninguna medida |
| 3 | `max-age=600` en archivos estáticos (Lighthouse `uses-long-cache-ttl`, 2 a 10 recursos por página) | Media | Fuera del código: regla de caché de Cloudflare (`docs/seo/cloudflare-paso-a-paso.md` paso 4) |
| 4 | SEO 92 en Lighthouse por `Content-Signal` del bloque gestionado de Cloudflare | Baja | Decisión del dueño ya documentada; Google la ignora |
| 5 | Home: TBT 240 ms, JS sin usar ~91 KiB, LCP 2,6 s (producción, móvil simulado) | Media | Pendiente; sin medir causa raíz en esta pasada |
| 6 | Precio no publicado: sin resultados enriquecidos de producto | Media | Decisión del dueño (`docs/tareas-pendientes.md` §4) |
| 7 | Perfil de Empresa sin verificar, pocas reseñas, sin fotos reales | Alta | Del dueño (`docs/tareas-pendientes.md` §1, §2, §6) |

## 3. Cambio implementado: respaldo de fuente con métricas de Archivo

`react-app/src/styles/global.css`: nuevo `@font-face 'Archivo Fallback'` sobre Arial con `size-adjust: 97.58%`,
`ascent-override: 89.98%`, `descent-override: 21.52%`, `line-gap-override: 0%` (calculados con fontTools sobre
`archivo-latin.woff2`, instancia peso 400 / ancho 100%) y agregado a `--font`. No cambia el diseño con la fuente cargada.

**Medido** (Lighthouse 12, móvil, `/sillon-bkf/`, build local con red simulada 600 ms / 1,6 Mbps / CPU x4, 2 corridas cada una):

| | CLS |
|---|---|
| Antes | 0,32 / 0,32 |
| Después | 0,06 / 0,06 |

Notas de honestidad: sin throttling real el problema no se reproduce en local (CLS 0 antes y después); la
reproducción fiel de 0,32 se logró recién con la red simulada. El 0,06 restante es de otro desplazamiento menor
del mismo párrafo. **No está verificado en producción**: hay que medirlo después del deploy.
En dispositivos sin Arial/Helvetica (p. ej. Android) el respaldo no aplica y el comportamiento es el de antes.

## 4. Tests ejecutados

- `npm run build` completo: 15 rutas + 404.html, sin errores ni avisos (incluye las validaciones SEO/GEO del prerender).
- Lighthouse 12 móvil contra producción (antes del cambio): home 91/100/100/92, `/sillon-bkf/` 79/100/100/92,
  `/catalogo/` 93/100/100/92, `/contacto/` 96/100/100/92 (rendimiento/accesibilidad/prácticas/SEO).
- PageSpeed Insights API: **no se pudo usar** (cuota anónima agotada). No hay datos de campo (CrUX) en esta auditoría.
- No se ejecutó el validador de datos enriquecidos de Google ni Bing Webmaster Tools (requieren sesión del dueño).

## 5. Pendientes y recomendaciones

1. Decidir qué medidas son las correctas del sillón (hallazgo 2) antes de usar esa foto; si la foto es una composición
   generada, el aviso del pie de "fotos ilustrativas" debe cubrirla. `FOTOLINDABKF.jpeg` (sillón en un living real) podría
   servir como foto de uso, **solo con permiso de quien la sacó y de la persona dueña del espacio**.
2. Después del deploy: repetir Lighthouse en producción y mirar CLS en Search Console > Experiencia > Core Web Vitals (datos de campo, tardan semanas).
3. Revisar el JS sin usar de la home (hallazgo 5) con el analizador de bundle.
4. Probar mobile a 360 px en las páginas con cambios visuales.
5. Lo externo (perfil verificado, reseñas, directorios, Bing Webmaster): `docs/tareas-pendientes.md`.

Nada de esto promete posiciones ni apariciones en respuestas de IA: son condiciones técnicas y de contenido, no garantías.
