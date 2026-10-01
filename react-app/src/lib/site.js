/**
 * URLs del sitio — fuente única para canonical, og:url, JSON-LD y sitemap.
 *
 * Barra final: GitHub Pages sirve cada página prerenderizada desde
 * dist/<ruta>/index.html y responde a /<ruta> con un 301 hacia /<ruta>/.
 * Por eso la URL canónica de toda página interna es la que termina en "/":
 * si el canonical, el sitemap o un link interno apuntan a la versión sin
 * barra, Google recibe una URL que redirige (señales contradictorias y
 * rastreo desperdiciado). Verificado con curl sobre el sitio publicado.
 */
export const SITE = 'https://tallerkappa.com.ar';

/** '/catalogo' → '/catalogo/'. La home queda '/'. Respeta ?query y #hash. */
export function withSlash(path = '/') {
  const match = path.match(/^([^?#]*)(.*)$/);
  const pathname = match[1] || '/';
  const suffix = match[2];
  return (pathname.endsWith('/') ? pathname : `${pathname}/`) + suffix;
}

/** URL absoluta y canónica de una página: absoluteUrl('/faq') → 'https://tallerkappa.com.ar/faq/'. */
export function absoluteUrl(path = '/') {
  return `${SITE}${withSlash(path)}`;
}

/** URL absoluta de un archivo estático (imágenes): sin barra final. */
export function assetUrl(src) {
  return `${SITE}${src}`;
}

/** JSON-LD BreadcrumbList a partir de [{ name, path }]. */
export function breadcrumbList(items) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}
