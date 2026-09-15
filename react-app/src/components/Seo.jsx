import { Helmet } from 'react-helmet-async';

const SITE = 'https://tallerkappa.com.ar';
const DEFAULT_IMAGE = `${SITE}/images/bkf1.jpg`;
// bkf1.jpg mide realmente 1600x1600 (verificado con PIL, no un valor de relleno).
const DEFAULT_IMAGE_W = 1600;
const DEFAULT_IMAGE_H = 1600;

/**
 * Seo — helper para meta tags por ruta (título, descripción, canonical, Open Graph).
 * Reemplaza los <head> estáticos de cada .html del sitio viejo.
 *
 * `jsonLd` acepta un objeto o array de objetos Schema.org (Product, FAQPage,
 * BreadcrumbList, etc.) y los inyecta como <script type="application/ld+json">.
 *
 * `imageWidth`/`imageHeight` son opcionales: si se pasa una `image` distinta
 * a la de default (ej. la foto real de un producto), conviene pasar también
 * sus dimensiones reales para que Facebook/WhatsApp/Twitter puedan renderizar
 * la preview sin tener que descargar la imagen primero para medirla.
 */
export default function Seo({ title, description, path = '/', image = DEFAULT_IMAGE, imageWidth = DEFAULT_IMAGE_W, imageHeight = DEFAULT_IMAGE_H, type = 'website', jsonLd, noindex = false }) {
  const url = `${SITE}${path}`;
  const schemas = jsonLd ? (Array.isArray(jsonLd) ? jsonLd : [jsonLd]) : [];
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
      <meta name="robots" content={noindex ? 'noindex, nofollow' : 'index, follow'} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      {imageWidth && <meta property="og:image:width" content={String(imageWidth)} />}
      {imageHeight && <meta property="og:image:height" content={String(imageHeight)} />}
      <meta property="og:locale" content="es_AR" />
      <meta property="og:site_name" content="Taller Kappa" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      {schemas.map((schema, i) => (
        <script key={i} type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      ))}
    </Helmet>
  );
}

/** Helper para armar un BreadcrumbList a partir de [{ name, path }]. */
export function breadcrumbList(items) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: `${SITE}${item.path}`,
    })),
  };
}
