import { Link } from 'react-router-dom';
import Icon from '../components/Icon';
import { useCart } from '../context/CartContext';
import Seo from '../components/Seo';
import PageHero from '../components/PageHero';
import Picture from '../components/Picture';
import { trackEvent } from '../lib/analytics';
import { whatsappUrl } from '../data/contact';
import { formatPrice, getProductBySlug, relatedProducts } from '../data/products';
import { faqNode, productId, productNode } from '../lib/schema';
import { assetUrl, pageId } from '../lib/site';

// Las respuestas tienen que coincidir con /envios/ y /garantia/ (misma fuente de verdad).
const FAQ_ITEMS = [
  { q: '¿Cuánto cuesta el sillón BKF?', a: 'El sillón BKF Premium de Taller Kappa se cotiza según acabado, cantidad y destino de entrega, y el sitio no publica un precio de lista. Escribinos por WhatsApp al 11 6124-2498 con el color, la cantidad y la zona de entrega y te enviamos el presupuesto actualizado.' },
  { q: '¿El sillón BKF de Taller Kappa sigue el diseño original?', a: 'Sí. Fabricamos artesanalmente en Argentina con hierro macizo de 12mm y cuero vacuno de primera selección, siguiendo el diseño creado en 1938 por Antonio Bonet, Juan Kurchan y Jorge Ferrari Hardoy.' },
  { q: '¿Cuánto tarda en fabricarse y entregarse un sillón BKF?', a: 'Si hay unidades en stock, la entrega es en 24-48 horas en San Martín y alrededores; en el resto de CABA y GBA, de 2 a 5 días hábiles. Para pedidos a medida, el plazo de fabricación es de 5 a 10 días hábiles. Consultá disponibilidad por WhatsApp.' },
  { q: '¿El sillón BKF tiene garantía?', a: 'Sí. La estructura de hierro tiene garantía de por vida contra deformaciones. La pintura epoxi tiene garantía de 2 años. El cuero vacuno tiene garantía de 1 año contra defectos de fabricación.' },
  { q: '¿Puedo elegir el color del sillón BKF?', a: 'Sí. Ofrecemos el sillón BKF en negro mate, blanco, colores a pedido y cromado. También podés elegir el color del cuero: negro, marrón, o cuero natural.' },
];

const COLORS = [
  { name: 'Negro Mate', swatch: '#1a1a1a' },
  { name: 'Blanco Crema', swatch: '#f5f0e8' },
  { name: 'Cromado', swatch: 'linear-gradient(135deg,#ccc,#fff,#aaa)' },
  { name: 'Verde Oliva', swatch: '#556b2f' },
  { name: 'Rojo Kappa', swatch: '#b71c1c' },
];

const PRODUCT = getProductBySlug('sillon-bkf-premium');

export default function SillonBKF() {
  const { addToCart } = useCart();
  const related = relatedProducts(PRODUCT);

  const handleAdd = (color) => {
    addToCart({
      _id: 'bkf-landing',
      id: 'bkf-landing',
      name: 'Sillón BKF Premium',
      image: '/images/sillon-bkf-hierro-cuero.jpg',
      specs: ['Hierro macizo 12mm', 'Cuero vacuno de 1ra'],
    }, color);
    trackEvent('add_to_cart', { item: 'Sillón BKF Premium', color, location: 'sillon-bkf' });
  };

  return (
    <>
      <Seo
        title="Sillón BKF en Argentina: hierro y cuero | Taller Kappa"
        description="Sillón BKF fabricado en Argentina: hierro macizo de 12 mm y cuero vacuno curtido al vegetal. Medidas, garantía y envíos a todo el país. Cotizá por WhatsApp."
        path="/sillon-bkf"
        image={assetUrl(PRODUCT.image)}
        imageAlt={PRODUCT.alt}
        type="product"
        about={[productId(PRODUCT.slug)]}
        mainEntity={productId(PRODUCT.slug)}
        breadcrumb={[
          { name: 'Inicio', path: '/' },
          { name: 'Catálogo', path: '/catalogo' },
          { name: 'Sillón BKF', path: '/sillon-bkf' },
        ]}
        jsonLd={[
          // Mismo @id que la ficha /catalogo/sillon-bkf-premium/: es UNA entidad.
          productNode(PRODUCT, {
            image: [assetUrl(PRODUCT.image), assetUrl('/images/banco-bkf-hierro-cuero.jpg')],
            color: 'Negro mate',
            mainEntityOfPage: { '@id': pageId('/sillon-bkf') },
          }),
          faqNode(FAQ_ITEMS, '/sillon-bkf'),
        ]}
      />
      <PageHero
        title="Sillón BKF fabricado en Argentina"
        lead="El sillón BKF es un sillón de hierro y cuero diseñado en Buenos Aires en 1938. Taller Kappa lo fabrica en Argentina, en San Martín, con hierro macizo de 12 mm y cuero vacuno, directo de fábrica."
        current="Sillón BKF" trail={[{ to: '/catalogo/', label: 'Catálogo' }]}
      />

      <section className="bkf-product-section section-padding section-fade">
        <div className="bkf-product-grid">
          <div className="bkf-img-col">
            <Picture src="/images/sillon-bkf-hierro-cuero.jpg" alt={PRODUCT.alt} width={1600} height={1600} loading="eager" fetchPriority="high" sizes="(max-width: 860px) calc(100vw - 32px), 640px" />
            <div className="bkf-badges">
              <span className="bkf-badge"><Icon name="star" /> Diseño icónico</span>
              <span className="bkf-badge"><Icon name="industry" /> Fábrica propia</span>
              <span className="bkf-badge"><Icon name="truck" /> Envío a todo el país</span>
            </div>
          </div>
          <div className="bkf-info-col">
            <h2>Sillón BKF Premium</h2>
            <p className="bkf-tagline">Diseño argentino de 1938, fabricado con hierro macizo de 12 mm y cuero vacuno curtido al vegetal.</p>
            <div className="bkf-price-box">
              <span className="bkf-price">{formatPrice(PRODUCT) ?? 'Cotización personalizada'}</span>
              <span className="bkf-price-note">{PRODUCT.price?.note ?? 'Consultanos por WhatsApp para recibir tu presupuesto'}</span>
            </div>
            <ul className="bkf-specs">
              <li><Icon name="check" /> <strong>Estructura:</strong> Hierro macizo redondo 12mm</li>
              <li><Icon name="check" /> <strong>Tapizado:</strong> Cuero vacuno de primera selección curtido al vegetal</li>
              <li><Icon name="check" /> <strong>Pintura:</strong> Epoxi anticorrosiva doble capa</li>
              <li><Icon name="check" /> <strong>Colores:</strong> Negro mate, blanco, colores a pedido, cromado</li>
              <li><Icon name="check" /> <strong>Medidas:</strong> Standard o a medida sin cargo adicional</li>
              <li><Icon name="check" /> <strong>Uso:</strong> Residencial e intensivo gastronómico</li>
              <li><Icon name="check" /> <strong>Garantía:</strong> Estructura de por vida · Pintura 2 años · Cuero 1 año</li>
              <li><Icon name="check" /> <strong>Factura:</strong> A y B</li>
            </ul>
            <div className="bkf-actions">
              <button className="btn-main" onClick={() => handleAdd('Negro Mate')}>
                <Icon name="plus" /> Agregar al presupuesto
              </button>
              <a href={whatsappUrl('Hola, quiero cotizar el Sillón BKF Premium.')}
                target="_blank" rel="noopener noreferrer" className="btn-outline"
                onClick={() => trackEvent('whatsapp_click', { location: 'sillon-bkf_actions' })}>
                <Icon name="whatsapp" /> Cotizar por WhatsApp
              </a>
            </div>
            <div>
              <p className="color-label">Agregar en otro acabado:</p>
              <div className="bkf-color-swatches">
                {COLORS.map((c) => (
                  <button key={c.name} title={c.name} aria-label={`Agregar en ${c.name}`} onClick={() => handleAdd(c.name)}
                    className="bkf-color-swatch" style={{ background: c.swatch }} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bkf-about section-fade">
        <div className="bkf-about-inner">
          <h2>Sillón BKF fabricado en Argentina</h2>
          <p>
            El <strong>sillón BKF</strong> (también llamado silla BKF, silla paleta, sillón mariposa o <em>butterfly chair</em>) es un diseño argentino de 1938:
            una estructura de hierro y un asiento de cuero tensado. Taller Kappa lo fabrica en Argentina, en su taller de Villa Chacabuco, San Martín,
            y lo vende directo de fábrica.
          </p>
          <p>
            Sirve tanto para interiores residenciales, como un living, como para locales gastronómicos: la estructura es de <strong>hierro macizo redondo
            de 12 mm</strong> (sin tubos ni rellenos) y el asiento, de <strong>cuero vacuno de primera selección</strong>. Nuestros sillones equipan locales de
            YPF, McDonald&apos;s, Burger King y Shell: mirá el <Link to="/mobiliario-comercial/">mobiliario comercial de hierro a medida</Link>.
          </p>
          <p>
            Podés retirarlo en el taller o recibirlo en todo el país (<Link to="/envios/">zonas y tiempos de envío</Link>). Para conocer el origen del
            diseño y cómo elegir uno, leé la guía <Link to="/bkf/">qué es el sillón BKF: historia y características</Link>.
          </p>

          <div className="bkf-history-grid">
            <div className="bkf-history-card">
              <Icon name="calendar-alt" />
              <h3>1938</h3>
              <p>Año de creación por Bonet, Kurchan y Ferrari Hardoy en Buenos Aires</p>
            </div>
            <div className="bkf-history-card">
              <Icon name="globe-americas" />
              <h3>Mundial</h3>
              <p>Incluido en la colección permanente del MoMA de Nueva York</p>
            </div>
            <div className="bkf-history-card">
              <Icon name="industry" />
              <h3>Fábrica AR</h3>
              <p>100% fabricado en Argentina, en nuestro taller de San Martín, Bs. As.</p>
            </div>
            <div className="bkf-history-card">
              <Icon name="shield-alt" />
              <h3>Garantía</h3>
              <p>Estructura con garantía de por vida contra deformaciones</p>
            </div>
          </div>
        </div>
      </section>

      <section className="bkf-comparison section-fade">
        <div className="bkf-about-inner">
          <h2>Especificaciones del Sillón BKF de Taller Kappa</h2>
          <p className="section-subtitle">Estos son los materiales y estándares con los que fabricamos cada unidad:</p>
          <div className="comparison-table-wrapper">
            <table className="comparison-table">
              <thead>
                <tr>
                  <th>Característica</th>
                  <th className="our-col"><Icon name="star" /> Taller Kappa</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['Hierro', 'Macizo redondo 12mm'],
                  ['Cuero', 'Vacuno de primera selección'],
                  ['Pintura', 'Epoxi anticorrosiva doble capa'],
                  ['Garantía estructura', 'De por vida'],
                  ['Fabricante', 'Directo de fábrica en San Martín, Buenos Aires'],
                  ['Uso', 'Residencial e intensivo gastronómico'],
                  ['Medidas a pedido', 'Sin costo adicional'],
                ].map(([label, ours]) => (
                  <tr key={label}>
                    <td>{label}</td>
                    <td className="our-col"><strong>{ours}</strong></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="section-padding section-fade">
        <div className="bkf-about-inner">
          <h2>Preguntas frecuentes sobre el Sillón BKF</h2>
          {FAQ_ITEMS.map((f) => (
            <div key={f.q} className="bkf-faq-item">
              <h3>{f.q}</h3>
              <p>{f.a}</p>
            </div>
          ))}
          <p>
            Ver todas las <Link to="/faq/">preguntas frecuentes de Taller Kappa</Link>, conocé nuestras{' '}
            <Link to="/garantia/">condiciones de garantía</Link> o las{' '}
            <Link to="/envios/">zonas y tiempos de envío</Link>.
          </p>
        </div>
      </section>

      <aside className="section-padding section-fade" aria-label="Otros productos de Taller Kappa">
        <div className="bkf-about-inner">
          <h2>Más productos BKF y bases de mesa</h2>
          <p>
            Ficha técnica completa, con medidas y garantía, del <Link to="/catalogo/sillon-bkf-premium/">Sillón BKF Premium</Link>. Del mismo diseño
            fabricamos el <Link to="/catalogo/banco-bkf/">Banco BKF</Link> (38 x 38 x 45 cm), y para locales gastronómicos
            la <Link to="/catalogo/base-de-mesa-flat/">Base de Mesa Flat</Link>. Todo el catálogo está en{' '}
            <Link to="/catalogo/asientos/">sillones y bancos BKF</Link> y <Link to="/catalogo/mesas/">bases de mesa de hierro</Link>.
          </p>
          <ul className="related-list">
            {related.map((r) => (
              <li key={r.slug}>
                <Link to={`/catalogo/${r.slug}/`}>{r.name}</Link>
                <span>{r.desc}</span>
              </li>
            ))}
          </ul>
        </div>
      </aside>

      <section className="cta-section section-fade">
        <div className="cta-box">
          <h2>¿Querés tu Sillón BKF?</h2>
          <p>Escribinos por WhatsApp y te respondemos con la cotización. Precios de fábrica, envíos a todo el país.</p>
          <div className="cta-btns">
            <a href={whatsappUrl('Hola, quiero cotizar el Sillón BKF.')}
              target="_blank" rel="noopener noreferrer" className="btn-main"
              onClick={() => trackEvent('whatsapp_click', { location: 'sillon-bkf_cta_final' })}>
              <Icon name="whatsapp" /> Pedir cotización ahora
            </a>
            <Link to="/catalogo/" className="btn-outline">
              <Icon name="th-large" /> Ver todos los productos
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
