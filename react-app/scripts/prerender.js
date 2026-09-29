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
 *   - corta el build si una página rompe una regla básica de SEO
 *     (canonical distinto de su URL, sin h1 o con más de uno, title o
 *     description duplicados)
 *
 * Esto reemplaza el `cp index.html` anterior, que producía 9 páginas con
 * el mismo title y un canonical apuntando todas al home.
 */
import { readFileSync, writeFileSync, mkdirSync, rmSync } from 'node:fs';
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
const { absoluteUrl, withSlash, assetUrl } = await import(pathToFileURL(resolve(root, 'src/lib/site.js')).href);

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
const PAGES_WITH_PRODUCT_DATA = new Set(['Home', 'Catalogo', 'Producto']);
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
  if (h1Count !== 1) problems.push(`${path}: tiene ${h1Count} <h1> (debe tener exactamente 1)`);
  if (!title) problems.push(`${path}: sin <title>`);
  if (!description) problems.push(`${path}: sin meta description`);

  results.push({ path, pageName, canonical, title, description, noindex, images, bytes: Buffer.byteLength(page) });
}

for (const key of ['title', 'description']) {
  const seen = new Map();
  for (const r of results) {
    if (seen.has(r[key])) problems.push(`${key} duplicado en ${seen.get(r[key])} y ${r.path}: "${r[key]}"`);
    else seen.set(r[key], r.path);
  }
}

if (problems.length) {
  console.error('\n  El prerender encontró problemas de SEO:\n');
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
 * 404.html — fallback de GitHub Pages para rutas no prerenderizadas.
 * Usa el template SIN contenido para que el router del cliente resuelva.
 * Lleva noindex para que Google no lo trate como una página real.
 */
const notFound = stripDefaultHead(template).replace(
  '</head>',
  () => '    <title>Página no encontrada | Taller Kappa</title>\n    <meta name="robots" content="noindex">\n  </head>'
);
writeFileSync(resolve(distDir, '404.html'), notFound, 'utf-8');

rmSync(ssrDir, { recursive: true, force: true });

console.log('\n  Prerender completado:\n');
for (const r of results) {
  console.log(`  ${r.path.padEnd(14)} ${String(r.bytes).padStart(7)} B  canonical: ${r.canonical}`);
}
console.log(`\n  ${results.length} rutas + 404.html · sitemap.xml con ${urls.length} URLs\n`);
