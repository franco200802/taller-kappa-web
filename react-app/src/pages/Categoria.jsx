import { Link, useLocation } from 'react-router-dom';
import Seo from '../components/Seo';
import PageHero from '../components/PageHero';
import Picture from '../components/Picture';
import ProductTable from '../components/ProductTable';
import { CATEGORIES, SOCIAL_IMAGE_SIZE, getCategoryBySlug, productsInCategory, socialImage } from '../data/products';
import { assetUrl } from '../lib/site';
import { whatsappUrl } from '../data/contact';
import { faqNode, itemListNode } from '../lib/schema';

const lcFirst = (s) => s.charAt(0).toLowerCase() + s.slice(1);

/**
 * Página de categoría del catálogo (/catalogo/asientos, /catalogo/mesas).
 * Se arma toda desde data/products.js: define la categoría, lista sus
 * productos con enlace a cada ficha y los compara en una tabla.
 */
export default function Categoria() {
  const { pathname } = useLocation();
  const category = getCategoryBySlug(pathname.split('/').filter(Boolean).pop());
  if (!category) return null;

  const products = productsInCategory(category.key);
  const path = `/catalogo/${category.slug}`;
  const others = CATEGORIES.filter((c) => c.key !== category.key);
  const list = itemListNode(products, path, category.heading);

  return (
    <>
      <Seo
        title={category.seoTitle}
        description={category.seoDescription}
        path={path}
        image={assetUrl(socialImage(products[0]))}
        imageWidth={SOCIAL_IMAGE_SIZE.width}
        imageHeight={SOCIAL_IMAGE_SIZE.height}
        imageAlt={products[0].alt}
        pageType="CollectionPage"
        mainEntity={list['@id']}
        breadcrumb={[{ name: 'Inicio', path: '/' }, { name: 'Catálogo', path: '/catalogo' }, { name: category.name, path }]}
        jsonLd={[list, ...(category.faq?.length ? [faqNode(category.faq, path)] : [])]}
      />
      <PageHero
        title={category.heading}
        lead={category.definition}
        current={category.name}
        trail={[{ to: '/catalogo/', label: 'Catálogo' }]}
      />

      <section className="section-padding">
        <h2 className="section-title">Modelos de {lcFirst(category.name)}</h2>
        <ul className="home-products">
          {products.map((p) => (
            <li className="home-product" key={p.slug}>
              <Link to={`/catalogo/${p.slug}/`}>
                <div className="home-product-img">
                  <Picture src={p.image} alt={p.alt} width={p.imageWidth} height={p.imageHeight} loading="lazy" sizes="(max-width: 760px) 78vw, (max-width: 1240px) 32vw, 384px" />
                </div>
                <h3>{p.name}</h3>
                <p>{p.desc}</p>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="why-section section-fade">
        <h2 className="section-title">Medidas, materiales y uso</h2>
        <p className="section-subtitle">{category.difference}</p>
        <ProductTable products={products} showCategory={false} />
      </section>

      {category.faq?.length > 0 && (
        <section className="section-padding section-fade">
          <div className="bkf-about-inner">
            <h2>Preguntas frecuentes sobre {lcFirst(category.name)}</h2>
            {category.faq.map(({ q, a }) => (
              <div key={q} className="bkf-faq-item">
                <h3>{q}</h3>
                <p>{a}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="section-padding home-links">
        <div>
          <h2 className="section-title">Cómo consultar</h2>
          <p>
            Taller Kappa vende por cotización: escribinos por <a href={whatsappUrl(`Hola, quiero cotizar: ${category.name.toLowerCase()}.`)} target="_blank" rel="noopener noreferrer">WhatsApp</a> o
            usá el <Link to="/contacto/">formulario de contacto</Link> y te enviamos el presupuesto.
          </p>
          <p>
            {others.map((c) => (
              <span key={c.key}>Ver también <Link to={`/catalogo/${c.slug}/`}>{lcFirst(c.heading)}</Link>. </span>
            ))}
            {category.key === 'asientos' && <>Conocé el <Link to="/sillon-bkf/">sillón BKF fabricado en Argentina</Link> y leé <Link to="/bkf/">qué es el sillón BKF y cómo elegir uno</Link>. </>}
            {category.key === 'mesas' && <>Si es para un local, mirá el <Link to="/mobiliario-comercial/">mobiliario comercial de hierro a medida</Link>. </>}
            Consultá las <Link to="/envios/">zonas y tiempos de envío</Link> y las <Link to="/garantia/">condiciones de garantía</Link>.
          </p>
        </div>
      </section>
    </>
  );
}

