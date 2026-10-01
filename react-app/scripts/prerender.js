/**
 * prerender.js — genera HTML estático real para cada ruta pública.
 *
 * Se ejecuta DESPUÉS de los dos builds de Vite:
 *   1. `vite build`        → dist/            (bundle del navegador)
 *   2. `vite build --ssr`  → .ssr-build/      (entry-server para Node)
 *
 * Para cada ruta:
 *   - la renderiza con react-dom/server
 *   - recoge los tags de react-helmet-async (title, description, canonical, JSON-LD)
 *   - los inyecta en el index.html que generó Vite (que ya tiene los <script>
 *     y <link> con hash correctos)
 *   - escribe dist/<ruta>/index.html
 *   - genera dist/sitemap.xml con las URLs canónicas indexables (se
 *     actualiza solo: agregar un producto en data/products.js alcanza)
 *   - genera dist/llms.txt (resumen de la empresa y enlaces a las páginas
 *     reales; se arma desde data/business.js y data/products.js)
 *   - corta el build si una página rompe una regla básica de SEO/GEO:
 *     canonical distinto de su URL, sin h1 o con más de uno, title o
 *     description duplicados, JSON-LD inválido o con @id sin resolver,
 *     links internos rotos, páginas huérfanas, imágenes sin alt o que
 *     no existen
 *
 * Esto reemplaza el `cp index.html` anterior, que producía 9 páginas con
 * el mismo title y un canonical apuntando todas al home.
 */
import { readFileSync, writeFileSync, mkdirSync, rmSync, existsSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { resolve, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');
const distDir = resolve(root, 'dist');
const ssrDir = resolve(root, '.ssr-build');

const template = readFileSync(resolve(distDir, 'index.html'), 'utf-8');
const { render } = await import(pathToFileURL(resolve(ssrDir, 'entry-server.js')).href);
// PRERENDER_PAGES se lee del source: son constantes planas y así no
// dependemos de cómo Vite haya agrupado los chunks del bundle de SSR.
const { PRERENDER_PAGES } = await import(pathToFileURL(resolve(root, 'src/routes.js')).href);
const { absoluteUrl, withSlash, assetUrl, pageId } = await import(pathToFileURL(resolve(root, 'src/lib/site.js')).href);
const { BUSINESS, addressLine } = await import(pathToFileURL(resolve(root, 'src/data/business.js')).href);
const { PRODUCTS, CATEGORIES, factOf } = await import(pathToFileURL(resolve(root, 'src/data/products.js')).href);

/**
 * El template de Vite trae meta tags por defecto (los del Home) que deben
 * ser reemplazados por los de cada ruta. Si no se quitan, quedarían
 * duplicados junto a los que inyecta Helmet — y el canonical del home
 * terminaría en todas las páginas.
 */
function stripDefaultHead(html) {
  const remove = [
    /<title>[\s\S]*?<\/title>\s*/i,
    /<meta\s+name="description"[^>]*>\s*/i,
    /<link\s+rel="canonical"[^>]*>\s*/i,
    /<meta\s+name="robots"[^>]*>\s*/i,
    /<meta\s+property="og:(?:type|title|description|image|url|site_name|locale)"[^>]*>\s*/gi,
    /<meta\s+name="twitter:(?:card|title|description|image)"[^>]*>\s*/gi,
  ];
  return remove.reduce((acc, re) => acc.replace(re, ''), html);
}

/**
 * Fecha del último commit que tocó los archivos de los que sale el
 * contenido de una página (su componente y, si corresponde, los datos de
 * productos). Es el <lastmod> del sitemap: Google solo lo tiene en cuenta
 * si es verificablemente preciso, así que no se usa la fecha del build.
 * Sin git (o sin historial) devuelve null y el <lastmod> se omite.
 */
const PAGES_WITH_PRODUCT_DATA = new Set(['Home', 'Catalogo', 'Categoria', 'Producto', 'SillonBKF', 'FAQ', 'Nosotros', 'Proyectos']);
function lastModified(page) {
  const files = [`src/pages/${page}.jsx`];
  if (PAGES_WITH_PRODUCT_DATA.has(page)) files.push('src/data/products.js');
  try {
    const out = execFileSync('git', ['log', '-1', '--format=%cs', '--', ...files], { cwd: root, encoding: 'utf-8' }).trim();
    return /^\d{4}-\d{2}-\d{2}$/.test(out) ? out : null;
  } catch {
    return null;
  }
}

const decode = (s) => s.replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#x27;|&#39;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>');
const xmlEscape = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const results = [];
const problems = [];

const prerenderedPaths = new Set(PRERENDER_PAGES.map((r) => withSlash(r.path)));

/** Recorre un JSON-LD y separa los @id definidos (nodo con @type) de las referencias puras ({ "@id": … }). */
function collectIds(node, defined, refs) {
  if (Array.isArray(node)) return node.forEach((n) => collectIds(n, defined, refs));
  if (!node || typeof node !== 'object') return;
  const keys = Object.keys(node);
  if ('@id' in node) (keys.length === 1 ? refs : defined).add(node['@id']);
  keys.forEach((k) => collectIds(node[k], defined, refs));
}

/** Archivo local al que apunta una URL de la página (/images/x.jpg), o null si es externa. */
const localFile = (url) => (url.startsWith('/') && !url.startsWith('//') ? resolve(distDir, url.split(/[?#]/)[0].slice(1)) : null);

for (const { path, page: pageName } of PRERENDER_PAGES) {
  // Se renderiza con la barra final, que es la URL real que sirve GitHub
  // Pages (y la que ve el router del cliente al hidratar).
  const { html, helmet } = await render(withSlash(path));

  const head = [
    helmet?.title?.toString(),
    helmet?.meta?.toString(),
    helmet?.link?.toString(),
    helmet?.script?.toString(),
  ].filter(Boolean).join('\n    ');

  // Ojo: se usan funciones como reemplazo a propósito. Con un string,
  // JS interpreta `$$`, `$&`, `$1`… como patrones de sustitución y
  // corrompería el contenido (ej. priceRange "$$" quedaba como "$").
  const page = stripDefaultHead(template)
    .replace('</head>', () => `    ${head}\n  </head>`)
    .replace('<div id="root"></div>', () => `<div id="root">${html}</div>`);

  const outDir = path === '/' ? distDir : resolve(distDir, path.slice(1));
  mkdirSync(outDir, { recursive: true });
  writeFileSync(resolve(outDir, 'index.html'), page, 'utf-8');

  const canonical = page.match(/rel="canonical" href="([^"]+)"/)?.[1] ?? null;
  const title = decode(page.match(/<title[^>]*>([^<]+)<\/title>/)?.[1] ?? '');
  const description = decode(page.match(/<meta[^>]*name="description"[^>]*content="([^"]*)"/)?.[1] ?? '');
  const noindex = /<meta[^>]*name="robots"[^>]*content="[^"]*noindex/.test(page);
  const h1Count = (html.match(/<h1[\s>]/g) || []).length;
  // Fotos de la página (jpg/jpeg: los logos de clientes son png y no se
  // listan) para la extensión de imágenes del sitemap.
  const images = [...new Set([...html.matchAll(/<img[^>]*\ssrc="(\/images\/[^"]+\.jpe?g)"/g)].map((m) => m[1]))];

  if (!noindex && canonical !== absoluteUrl(path)) problems.push(`${path}: canonical ${canonical} ≠ ${absoluteUrl(path)}`);
  // Todo link interno debe llevar la barra final (o sería un 301 en GitHub Pages).
  const sinBarra = [...new Set([...html.matchAll(/href="(\/[^"#?]*)"/g)].map((m) => m[1]))]
    .filter((h) => !h.endsWith('/') && !/\.[a-z0-9]+$/i.test(h));
  if (sinBarra.length) problems.push(`${path}: links internos sin barra final → ${sinBarra.join(', ')}`);
  if (h1Count !== 1) problems.push(`${path}: tiene ${h1Count} <h1> (debe tener exactamente 1)`);
  if (!title) problems.push(`${path}: sin <title>`);
  if (!description) problems.push(`${path}: sin meta description`);

  // --- JSON-LD: parsea, resuelve @id y exige el nodo de la página (y su breadcrumb) ---
  const blocks = [...head.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)].map((m) => m[1]);
  const defined = new Set();
  const refs = new Set();
  const nodes = [];
  for (const block of blocks) {
    try {
      const data = JSON.parse(block);
      nodes.push(...(data['@graph'] ?? [data]));
      collectIds(data, defined, refs);
    } catch (e) {
      problems.push(`${path}: JSON-LD inválido (${e.message})`);
    }
  }
  const unresolved = [...refs].filter((id) => !defined.has(id));
  if (unresolved.length) problems.push(`${path}: @id sin definir en la página → ${unresolved.join(', ')}`);
  if (!noindex) {
    const webpage = nodes.find((n) => n['@id'] === pageId(path));
    if (!webpage) problems.push(`${path}: falta el nodo WebPage ${pageId(path)} en el JSON-LD`);
    else if (path !== '/' && !webpage.breadcrumb) problems.push(`${path}: el WebPage no enlaza su BreadcrumbList`);
    if (!nodes.some((n) => n['@type'] === 'LocalBusiness')) problems.push(`${path}: falta la entidad LocalBusiness en el JSON-LD`);
  }

  // --- enlaces e imágenes locales ---
  const internalLinks = new Set();
  for (const [, href] of html.matchAll(/href="(\/[^"#?]*)"/g)) {
    if (/\.[a-z0-9]+$/i.test(href)) {
      if (!existsSync(localFile(href))) problems.push(`${path}: enlace a archivo inexistente ${href}`);
    } else {
      internalLinks.add(href);
      if (!prerenderedPaths.has(href)) problems.push(`${path}: link interno roto → ${href}`);
    }
  }
  const imgUrls = new Set();
  for (const m of html.matchAll(/<img\b[^>]*>/g)) {
    const tag = m[0];
    if (!/\salt="/.test(tag)) problems.push(`${path}: <img> sin alt → ${tag.slice(0, 90)}`);
  }
  for (const m of html.matchAll(/\s(?:src|srcset)="([^"]+)"/gi)) {
    m[1].split(',').map((c) => c.trim().split(/\s+/)[0]).filter((u) => u.startsWith('/images/')).forEach((u) => imgUrls.add(u));
  }
  for (const u of imgUrls) if (!existsSync(localFile(u))) problems.push(`${path}: imagen inexistente ${u}`);

  results.push({ path, pageName, canonical, title, description, noindex, images, links: internalLinks, bytes: Buffer.byteLength(page) });
}

for (const key of ['title', 'description']) {
  const seen = new Map();
  for (const r of results) {
    if (seen.has(r[key])) problems.push(`${key} duplicado en ${seen.get(r[key])} y ${r.path}: "${r[key]}"`);
    else seen.set(r[key], r.path);
  }
}

// Páginas huérfanas: toda página indexable tiene que recibir al menos un link de otra página.
for (const r of results) {
  if (r.noindex || r.path === '/') continue;
  const target = withSlash(r.path);
  if (!results.some((o) => o.path !== r.path && o.links.has(target))) problems.push(`${r.path}: página huérfana (ninguna otra página enlaza a ${target})`);
}

if (problems.length) {
  console.error('\n  El prerender encontró problemas de SEO/GEO:\n');
  for (const p of problems) console.error(`  ✗ ${p}`);
  process.exit(1);
}

/**
 * sitemap.xml — solo URLs canónicas e indexables (las noindex, /admin y
 * el 404 quedan afuera). Sin <changefreq> ni <priority>: Google los ignora.
 */
const urls = results.filter((r) => !r.noindex).map((r) => {
  const lastmod = lastModified(r.pageName);
  const imgs = r.images.map((src) => `\n    <image:image><image:loc>${xmlEscape(assetUrl(src))}</image:loc></image:image>`).join('');
  return `  <url>\n    <loc>${xmlEscape(r.canonical)}</loc>${lastmod ? `\n    <lastmod>${lastmod}</lastmod>` : ''}${imgs}\n  </url>`;
});
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${urls.join('\n')}
</urlset>
`;
writeFileSync(resolve(distDir, 'sitemap.xml'), sitemap, 'utf-8');

/**
 * llms.txt — resumen en texto plano de la empresa y mapa de las páginas reales,
 * pensado para que un asistente de IA que lo consulte entienda qué es Taller
 * Kappa sin recorrer todo el sitio. Se arma desde las mismas fuentes que el
 * HTML (data/business.js y data/products.js, y el meta description de cada
 * página), así no puede quedar desactualizado respecto del sitio.
 *
 * Es una convención propuesta, no un estándar que los buscadores respeten
 * ni una garantía de indexación o citación: no reemplaza al sitemap ni al
 * contenido de las páginas.
 */
const descOf = (path) => results.find((r) => r.path === path)?.description ?? '';
const bullet = (label, path) => `- [${label}](${absoluteUrl(path)}): ${descOf(path)}`;
const llms = [
  `# ${BUSINESS.name}`,
  '',
  `> ${BUSINESS.summary} ${BUSINESS.salesModel}`,
  '',
  '## Datos de la empresa',
  `- Razón social: ${BUSINESS.legalName}`,
  `- Sitio oficial: ${BUSINESS.url}/`,
  `- Dirección: ${addressLine()}, ${BUSINESS.address.country}`,
  `- Retiro en el taller: ${BUSINESS.hours.label}`,
  `- WhatsApp: ${BUSINESS.phoneDisplay}`,
  `- Email: ${BUSINESS.email}`,
  '',
  '## Productos',
  ...PRODUCTS.map((p) => `- [${p.name}](${absoluteUrl(`/catalogo/${p.slug}`)}): ${factOf(p, 'Categoría')}. ${factOf(p, 'Estructura')}. Medidas: ${factOf(p, 'Medidas')}.`),
  '',
  '## Categorías',
  ...CATEGORIES.map((c) => `- [${c.heading}](${absoluteUrl(`/catalogo/${c.slug}`)}): ${c.definition}`),
  '',
  '## Información para clientes',
  bullet('Catálogo', '/catalogo'),
  bullet('Preguntas frecuentes', '/faq'),
  bullet('Envíos', '/envios'),
  bullet('Garantía', '/garantia'),
  bullet('Contacto', '/contacto'),
  '',
  '## Sobre la empresa',
  bullet('Nosotros', '/nosotros'),
  bullet('Mobiliario comercial y proyectos', '/proyectos'),
  bullet('Guía del Sillón BKF', '/sillon-bkf'),
  '',
].join('\n');
writeFileSync(resolve(distDir, 'llms.txt'), llms, 'utf-8');

/**
 * 404.html — fallback de GitHub Pages para rutas no prerenderizadas.
 * Usa el template SIN contenido para que el router del cliente resuelva.
 * Lleva noindex para que Google no lo trate como una página real.
 */
const notFound = stripDefaultHead(template).replace(
  '</head>',
  () => '    <title>Página no encontrada | Taller Kappa</title>\n    <meta name="robots" content="noindex">\n  </head>'
);
writeFileSync(resolve(distDir, '404.html'), notFound, 'utf-8');

/**
 * URLs del sitio estático anterior (antes de la migración a React, 14/09/2026).
 * Estaban en su sitemap como /catalogo.html, /nosotros.html, etc. y hoy dan
 * 404. GitHub Pages no permite 301 del lado del servidor: lo más fuerte que
 * se puede publicar es una página con canonical a la URL nueva y un meta
 * refresh inmediato, que Google trata como redirección permanente. No llevan
 * noindex (contradiría la redirección) ni van al sitemap.
 */
const LEGACY_HTML = {
  'catalogo.html': '/catalogo/',
  'sillon-bkf.html': '/sillon-bkf/',
  'nosotros.html': '/nosotros/',
  'faq.html': '/faq/',
  'contacto.html': '/contacto/',
  'proyectos.html': '/proyectos/',
  'envios.html': '/envios/',
  'garantia.html': '/garantia/',
};
for (const [file, to] of Object.entries(LEGACY_HTML)) {
  const target = absoluteUrl(to);
  writeFileSync(resolve(distDir, file), `<!DOCTYPE html>
<html lang="es-AR">
<head>
<meta charset="UTF-8">
<title>Taller Kappa</title>
<link rel="canonical" href="${target}">
<meta http-equiv="refresh" content="0; url=${to}">
<script>location.replace(${JSON.stringify(to)} + location.search + location.hash)</script>
</head>
<body><p>Esta página se mudó a <a href="${target}">${target}</a>.</p></body>
</html>
`, 'utf-8');
}

rmSync(ssrDir, { recursive: true, force: true });

console.log('\n  Prerender completado:\n');
for (const r of results) {
  console.log(`  ${r.path.padEnd(14)} ${String(r.bytes).padStart(7)} B  canonical: ${r.canonical}`);
}
console.log(`\n  ${results.length} rutas + 404.html · sitemap.xml con ${urls.length} URLs · llms.txt · ${Object.keys(LEGACY_HTML).length} redirecciones de URLs .html heredadas\n`);
