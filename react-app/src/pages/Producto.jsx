import { useParams, Link, Navigate } from 'react-router-dom';
import Icon from '../components/Icon';
import { useCart } from '../context/CartContext';
import Seo from '../components/Seo';
import PageHero from '../components/PageHero';
import Picture from '../components/Picture';
import { SOCIAL_IMAGE_SIZE, formatPrice, getCategory, getProductBySlug, ofName, priceQuestion, productHref, relatedProducts, socialImage, theName } from '../data/products';
import { whatsappUrlFor } from '../data/contact';
import { assetUrl } from '../lib/site';
import { faqNode, productId, productNode } from '../lib/schema';

/**
 * Página individual de producto — URL propia, indexable y prerenderizada
 * en /catalogo/:slug. Reutiliza la misma fuente de datos que Catalogo.jsx
 * para no duplicar contenido.
 */
export default function Producto() {
  const { slug } = useParams();
  const { addToCart } = useCart();
  const product = getProductBySlug(slug);

  // Un producto con URL propia (el Sillón BKF vive en su landing) no tiene ficha acá.
  if (product?.path) return <Navigate to={productHref(product)} replace />;

  if (!product) {
    return (
      <section className="section-padding" style={{ minHeight: '60vh' }}>
        <Seo
          title="Producto no encontrado | Taller Kappa"
          description="El producto que buscás no existe o ya no está disponible."
          path={`/catalogo/${slug ?? ''}`}
          noindex
        />
        <h1>Producto no encontrado</h1>
        <p>El producto que buscás no existe o ya no está disponible.</p>
        <p><Link to="/catalogo/">Ver catálogo completo</Link></p>
      </section>
    );
  }

  const category = getCategory(product.category);
  const path = `/catalogo/${product.slug}`;
  const related = relatedProducts(product);
  const faq = faqNode(product.faq ?? [], path);
  const waPrice = whatsappUrlFor(priceQuestion(product), path);

  return (
    <>
      <Seo
        title={product.seoTitle}
        description={product.seoDescription}
        path={path}
        image={assetUrl(socialImage(product))}
        imageWidth={SOCIAL_IMAGE_SIZE.width}
        imageHeight={SOCIAL_IMAGE_SIZE.height}
        imageAlt={product.alt}
        type="product"
        mainEntity={productId(product.slug)}
        about={[productId(product.slug)]}
        breadcrumb={[
          { name: 'Inicio', path: '/' },
          { name: 'Catálogo', path: '/catalogo' },
          { name: category.name, path: `/catalogo/${category.slug}` },
          { name: product.name, path },
        ]}
        jsonLd={[productNode(product), ...(product.faq?.length ? [faq] : [])]}
      />
      <PageHero
        title={product.heading ?? product.name}
        lead={product.definition}
        current={product.name}
        trail={[{ to: '/catalogo/', label: 'Catálogo' }, { to: `/catalogo/${category.slug}/`, label: category.name }]}
      />

      <article aria-label={`Ficha de ${product.name}`}>
      <section className="bkf-product-section section-padding section-fade">
        <div className="bkf-product-grid">
          <div className="bkf-img-col">
            <Picture
              src={product.image}
              alt={product.alt}
              width={product.imageWidth}
              height={product.imageHeight}
              loading="eager"
              fetchPriority="high"
              sizes="(max-width: 860px) calc(100vw - 32px), 640px"
            />
            {product.badge && (
              <div className="bkf-badges">
                <span className="bkf-badge"><Icon name="check" /> {product.badge}</span>
              </div>
            )}
          </div>
          <div className="bkf-info-col">
            <h2>{product.name}</h2>
            <p className="bkf-tagline">{product.desc}</p>
            <div className="bkf-price-box">
              <span className="bkf-price">{formatPrice(product) ?? 'Precio a consultar'}</span>
              <span className="bkf-price-note">{product.price?.note ?? 'Te lo pasamos por WhatsApp en el día, según acabado, cantidad y zona de entrega'}</span>
            </div>
            {product.specs?.length > 0 && (
              <ul className="bkf-specs">
                {product.specs.map((s) => (
                  <li key={s}><Icon name="check" /> {s}</li>
                ))}
              </ul>
            )}
            <div className="bkf-actions" data-cta="ficha_actions">
              <button className="btn-main" onClick={() => addToCart(product, 'Negro Mate')}>
                <Icon name="plus" /> Agregar al presupuesto
              </button>
              <a href={waPrice} target="_blank" rel="noopener noreferrer" className="btn-outline">
                <Icon name="whatsapp" /> Consultar precio
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="bkf-comparison section-fade">
        <div className="bkf-about-inner">
          <h2>Ficha técnica {ofName(product)}</h2>
          <p className="section-subtitle">Datos del producto tal como los fabrica Taller Kappa en San Martín, Buenos Aires.</p>
          <div className="comparison-table-wrapper">
            <table className="comparison-table">
              <caption className="visually-hidden">Ficha técnica {ofName(product)}</caption>
              <tbody>
                {product.facts.map(([label, value]) => (
                  <tr key={label}>
                    <th scope="row">{label}</th>
                    <td className="our-col"><strong>{label === 'Precio' ? (formatPrice(product) ?? value) : value}</strong></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {product.faq?.length > 0 && (
        <section className="section-padding section-fade">
          <div className="bkf-about-inner">
            <h2>Preguntas sobre {theName(product)}</h2>
            {product.faq.map(({ q, a }) => (
              <div key={q} className="bkf-faq-item">
                <h3>{q}</h3>
                <p>{a}</p>
              </div>
            ))}
            <p>
              Más preguntas en las <Link to="/faq/">preguntas frecuentes de Taller Kappa</Link>
              {product.category === 'asientos' && <>, el <Link to="/sillon-bkf/">Sillón BKF Premium</Link> o la guía <Link to="/bkf/">qué es el sillón BKF: historia y cómo elegir uno</Link></>}.
            </p>
          </div>
        </section>
      )}
      </article>

      <aside className="section-padding section-fade" aria-label="Otros productos de Taller Kappa">
        <div className="bkf-about-inner">
          <h2>Otros productos de Taller Kappa</h2>
          <ul className="related-list">
            {related.map((r) => (
              <li key={r.slug}>
                <Link to={productHref(r)}>{r.name}</Link>
                <span>{r.desc}</span>
              </li>
            ))}
          </ul>
          <p>
            Ver todos los productos de la categoría <Link to={`/catalogo/${category.slug}/`}>{category.heading.charAt(0).toLowerCase() + category.heading.slice(1)}</Link> o
            el <Link to="/catalogo/">catálogo completo de sillones, bancos y bases de mesa</Link>.
          </p>
        </div>
      </aside>

      <section className="cta-section section-fade">
        <div className="cta-box">
          <h2>¿Querés cotizar {theName(product)}?</h2>
          <p>Escribinos por WhatsApp con la cantidad, el color y la zona de entrega, y te enviamos el presupuesto.</p>
          <div className="cta-btns" data-cta="ficha_cta_final">
            <a href={waPrice} target="_blank" rel="noopener noreferrer" className="btn-main">
              <Icon name="whatsapp" /> Consultar precio
            </a>
            <Link to="/envios/" className="btn-outline">
              <Icon name="truck" /> Zonas y tiempos de envío
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
