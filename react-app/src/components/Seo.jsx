import { Helmet } from 'react-helmet-async';

const SITE = 'https://tallerkappa.com.ar';
const DEFAULT_IMAGE = `${SITE}/images/bkf1.jpg`;

/**
 * Seo — helper para meta tags por ruta (título, descripción, canonical, Open Graph).
 * Reemplaza los <head> estáticos de cada .html del sitio viejo.
 *
 * `jsonLd` acepta un objeto o array de objetos Schema.org (Product, FAQPage,
 * BreadcrumbList, etc.) y los inyecta como <script type="application/ld+json">.
 */
export default function Seo({ title, description, path = '/', image = DEFAULT_IMAGE, type = 'website', jsonLd }) {
  const url = `${SITE}${path}`;
  const schemas = jsonLd ? (Array.isArray(jsonLd) ? jsonLd : [jsonLd]) : [];
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
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
