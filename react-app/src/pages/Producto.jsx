import { useParams, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import Seo, { breadcrumbList } from '../components/Seo';
import { getProductBySlug } from '../data/products';

/**
 * Página individual de producto — URL propia, indexable y prerenderizada
 * en /catalogo/:slug. Reutiliza la misma fuente de datos que Catalogo.jsx
 * para no duplicar contenido.
 */
export default function Producto() {
  const { slug } = useParams();
  const { addToCart } = useCart();
  const product = getProductBySlug(slug);

  if (!product) {
    return (
      <section className="section-padding" style={{ paddingTop: 60, textAlign: 'center' }}>
        <Seo
          title="Producto no encontrado | Taller Kappa"
          description="El producto que buscás no existe o ya no está disponible."
          path={`/catalogo/${slug ?? ''}`}
          noindex
        />
        <h1>Producto no encontrado</h1>
        <p>El producto que buscás no existe o ya no está disponible.</p>
        <p><Link to="/catalogo">Ver catálogo completo</Link></p>
      </section>
    );
  }

  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.desc,
    image: `https://tallerkappa.com.ar${product.image}`,
    category: product.category,
    brand: { '@type': 'Brand', name: 'Taller Kappa' },
    manufacturer: { '@type': 'Organization', name: 'Taller Kappa S.R.L.', url: 'https://tallerkappa.com.ar' },
    url: `https://tallerkappa.com.ar/catalogo/${product.slug}`,
    offers: {
      '@type': 'Offer',
      availability: product.stock ? 'https://schema.org/InStock' : 'https://schema.org/PreOrder',
      seller: { '@type': 'Organization', name: 'Taller Kappa S.R.L.' },
    },
  };

  return (
    <>
      <Seo
        title={`${product.name} | Taller Kappa`}
        description={`${product.desc} Fabricado en hierro y cuero, directo de fábrica en San Martín, Buenos Aires.`}
        path={`/catalogo/${product.slug}`}
        image={`https://tallerkappa.com.ar${product.image}`}
        imageWidth={product.imageWidth}
        imageHeight={product.imageHeight}
        type="product"
        jsonLd={[
          productSchema,
          breadcrumbList([
            { name: 'Inicio', path: '/' },
            { name: 'Catálogo', path: '/catalogo' },
            { name: product.name, path: `/catalogo/${product.slug}` },
          ]),
        ]}
      />
      <div className="page-hero">
        <div className="page-hero-content">
          <h1>{product.name}</h1>
          <p>{product.desc}</p>
          <nav className="breadcrumb" aria-label="Ruta de navegación">
            <Link to="/">Inicio</Link>
            <i className="fas fa-chevron-right" />
            <Link to="/catalogo">Catálogo</Link>
            <i className="fas fa-chevron-right" />
            <span>{product.name}</span>
          </nav>
        </div>
      </div>

      <section className="bkf-product-section section-padding section-fade">
        <div className="bkf-product-grid">
          <div className="bkf-img-col">
            <img
              src={product.image}
              alt={`${product.name} de Taller Kappa`}
              width={product.imageWidth}
              height={product.imageHeight}
              loading="eager"
              fetchpriority="high"
            />
            {product.badge && (
              <div className="bkf-badges">
                <span className="bkf-badge"><i className="fas fa-check" /> {product.badge}</span>
              </div>
            )}
          </div>
          <div className="bkf-info-col">
            <h2>{product.name}</h2>
            <p className="bkf-tagline">{product.desc}</p>
            <div className="bkf-price-box">
              <span className="bkf-price">Cotización personalizada</span>
              <span className="bkf-price-note">Consultanos por WhatsApp para recibir tu presupuesto</span>
            </div>
            {product.specs?.length > 0 && (
              <ul className="bkf-specs">
                {product.specs.map((s) => (
                  <li key={s}><i className="fas fa-check" /> {s}</li>
                ))}
              </ul>
            )}
            <div className="bkf-actions">
              <button className="btn-main" onClick={() => addToCart(product, 'Negro Mate')}>
                <i className="fas fa-plus" /> Agregar al presupuesto
              </button>
              <a
                href={`https://wa.me/541161242498?text=${encodeURIComponent('Hola, quiero cotizar: ' + product.name)}`}
                target="_blank" rel="noopener noreferrer" className="btn-outline"
              >
                <i className="fab fa-whatsapp" /> Cotizar por WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="cta-section section-fade">
        <div className="cta-box">
          <h2>¿Querés más opciones?</h2>
          <p>Mirá el resto de nuestro catálogo o conocé en detalle el Sillón BKF.</p>
          <div className="cta-btns">
            <Link to="/catalogo" className="btn-main">
              <i className="fas fa-th-large" /> Ver todo el catálogo
            </Link>
            <Link to="/sillon-bkf" className="btn-outline">
              <i className="fas fa-chair" /> Sobre el Sillón BKF
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
