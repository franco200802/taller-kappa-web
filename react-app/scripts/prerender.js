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
 *
 * Esto reemplaza el `cp index.html` anterior, que producía 9 páginas con
 * el mismo title y un canonical apuntando todas al home.
 */
import { readFileSync, writeFileSync, mkdirSync, rmSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');
const distDir = resolve(root, 'dist');
const ssrDir = resolve(root, '.ssr-build');

const template = readFileSync(resolve(distDir, 'index.html'), 'utf-8');
const { render } = await import(pathToFileURL(resolve(ssrDir, 'entry-server.js')).href);
// PRERENDER_PATHS se lee del source: son constantes planas y así no
// dependemos de cómo Vite haya agrupado los chunks del bundle de SSR.
const { PRERENDER_PATHS } = await import(pathToFileURL(resolve(root, 'src/routes.js')).href);

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

const results = [];

for (const path of PRERENDER_PATHS) {
  const { html, helmet } = await render(path);

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

  const canonical = page.match(/rel="canonical" href="([^"]+)"/)?.[1] ?? '(sin canonical)';
  const title = page.match(/<title[^>]*>([^<]+)<\/title>/)?.[1] ?? '(sin title)';
  results.push({ path, canonical, title, bytes: Buffer.byteLength(page) });
}

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
console.log(`\n  ${results.length} rutas + 404.html\n`);
