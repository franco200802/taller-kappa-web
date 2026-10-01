import { Link } from 'react-router-dom';
import Icon from '../components/Icon';
import { useCart } from '../context/CartContext';
import Seo from '../components/Seo';
import PageHero from '../components/PageHero';
import Picture from '../components/Picture';
import ScrollText from '../components/ScrollText';
import ShimmerText from '../components/ShimmerText';
import TypeWriter from '../components/TypeWriter';
import { trackEvent } from '../lib/analytics';
import { whatsappUrl } from '../data/contact';
import { SOCIAL_IMAGE_SIZE, formatPrice, getProductBySlug, productHref, relatedProducts, socialImage } from '../data/products';
import { BUSINESS } from '../data/business';
import { faqNode, productId, productNode } from '../lib/schema';
import { assetUrl, pageId } from '../lib/site';

// Las respuestas tienen que coincidir con /envios/ y /garantia/ (misma fuente de verdad) y con la ficha
// de data/products.js (acá viven las preguntas que antes estaban en la ficha del producto).
const FAQ_ITEMS = [
  { q: '¿Quién fabrica sillones BKF en Buenos Aires y cómo se compran?', a: 'Taller Kappa S.R.L. fabrica sillones BKF en su taller de Villa Chacabuco, San Martín, provincia de Buenos Aires, y los vende directo de fábrica. No se compran por la web: se pide el presupuesto por WhatsApp, se confirma el precio final y el plazo, y se retira en el taller o se recibe por envío.' },
  { q: '¿Cuánto cuesta el sillón BKF?', a: 'El sillón BKF Premium de Taller Kappa se cotiza según acabado, cantidad y destino de entrega, y el sitio no publica un precio de lista. Escribinos por WhatsApp al 11 6124-2498 con el color, la cantidad y la zona de entrega y te enviamos el presupuesto actualizado.' },
  { q: '¿Qué diferencia hay entre un sillón BKF de hierro macizo y uno de tubo?', a: 'El hierro macizo es una varilla sólida y el tubo es hueco. A igual diámetro, la varilla maciza resiste más la flexión y pesa más que un tubo de pared fina. El diseño original usa varilla maciza de alrededor de 12 mm. El sillón de Taller Kappa es de hierro redondo macizo de 12 mm, sin tubos ni rellenos.' },
  { q: '¿Qué medidas tiene el Sillón BKF Premium?', a: 'Mide 78 x 70 x 90 cm en su versión estándar. También se fabrica a medida, sin costo adicional.' },
  { q: '¿De qué está hecho el Sillón BKF Premium?', a: 'Tiene estructura de hierro redondo macizo de 12 mm, funda de cuero vacuno de primera selección curtido al vegetal y pintura epoxi anticorrosiva de doble capa, o cromado.' },
  { q: '¿El sillón BKF de Taller Kappa sigue el diseño original?', a: 'Sí. Fabricamos artesanalmente en Argentina con hierro macizo de 12mm y cuero vacuno de primera selección, siguiendo el diseño creado en 1938 por Antonio Bonet, Juan Kurchan y Jorge Ferrari Hardoy.' },
  { q: '¿Cuánto tarda en fabricarse y entregarse un sillón BKF?', a: 'Si hay unidades en stock, la entrega es en 24-48 horas en San Martín y alrededores; en CABA, de 2 a 4 días hábiles; en el resto del Gran Buenos Aires, de 2 a 5 días hábiles según la zona; y en el interior del país, de 5 a 10 días hábiles. Para pedidos a medida, el plazo de fabricación es de 5 a 10 días hábiles. Consultá disponibilidad por WhatsApp.' },
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

// Los acabados que se escriben junto a las muestras de color (la primera es la que ve quien no ejecuta JavaScript).
const FINISHES = ['negro mate', 'blanco crema', 'cromado', 'verde oliva', 'rojo Kappa', 'el color que necesites'];

// De qué está hecho: los mismos datos de la ficha técnica y la garantía, uno por renglón.
const MADE_OF = [
  { title: 'Hierro macizo de 12 mm', text: 'Estructura de hierro redondo macizo, sin tubos ni rellenos. Tiene garantía de por vida contra deformaciones.' },
  { title: 'Cuero vacuno curtido al vegetal', text: 'Cuero de primera selección que toma color con el uso. Garantía de 1 año contra defectos de fabricación.' },
  { title: 'Epoxi anticorrosiva o cromado', text: 'Pintura epoxi de doble capa, con 2 años de garantía, o terminación cromada. Negro mate, blanco o el color que necesites.' },
  { title: 'A medida, sin costo adicional', text: '78 x 70 x 90 cm en la versión estándar. Las medidas, los colores y los acabados se adaptan a tu espacio.' },
];

const PRODUCT = getProductBySlug('sillon-bkf-premium');

export default function SillonBKF() {
  const { addToCart } = useCart();
  const related = relatedProducts(PRODUCT);

  const handleAdd = (color) => {
    // Mismo objeto (y mismo id) que usa el catálogo: si no, el sillón aparecía en dos líneas del presupuesto.
    addToCart(PRODUCT, color);
    trackEvent('add_to_cart', { item: PRODUCT.name, color, location: 'sillon-bkf' });
  };

  return (
    <>
      <Seo
        title="Sillón BKF Buenos Aires: Comprar Directo de Fábrica | Taller Kappa"
        description="Comprá el sillón BKF directo de fábrica en Buenos Aires: hierro macizo de 12 mm y cuero vacuno, hecho en San Martín. Presupuesto por WhatsApp y envíos a todo el país."
        path="/sillon-bkf"
        image={assetUrl(socialImage(PRODUCT))}
        imageWidth={SOCIAL_IMAGE_SIZE.width}
        imageHeight={SOCIAL_IMAGE_SIZE.height}
        imageAlt={PRODUCT.alt}
        type="product"
        about={[productId(PRODUCT.slug)]}
        mainEntity={productId(PRODUCT.slug)}
        breadcrumb={[
          { name: 'Inicio', path: '/' },
          { name: 'Catálogo', path: '/catalogo' },
          { name: 'Asientos', path: '/catalogo/asientos' },
          { name: 'Sillón BKF', path: '/sillon-bkf' },
        ]}
        jsonLd={[
          // Es LA página del producto (ya no hay ficha aparte): el @id y la url del Product son esta URL.
          productNode(PRODUCT, { color: 'Negro mate' }),
          faqNode(FAQ_ITEMS, '/sillon-bkf'),
        ]}
      />
      <PageHero
        title="Sillón BKF de hierro y cuero, fabricado en Buenos Aires"
        lead={(
          <>
            Taller Kappa fabrica y vende el sillón BKF directo de fábrica en Buenos Aires: hierro macizo de 12 mm y cuero vacuno, hechos en San Martín.{' '}
            <ShimmerText>Pedís el presupuesto por WhatsApp</ShimmerText> y lo retirás en el taller o lo recibís en CABA, GBA y todo el país.
          </>
        )}
        current="Sillón BKF" trail={[{ to: '/catalogo/', label: 'Catálogo' }, { to: '/catalogo/asientos/', label: 'Asientos' }]}
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
              <li><Icon name="check" /> <strong>Medidas:</strong> 78 x 70 x 90 cm (estándar) o a medida sin cargo adicional</li>
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
              <p className="bkf-typed">
                Se pide en{' '}
                <TypeWriter sequences={FINISHES} srText="negro mate, blanco crema, cromado, verde oliva, rojo Kappa o el color que necesites" />
              </p>
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

      <section className="section-padding about-facts section-fade" aria-labelledby="como-comprar">
        <div>
          <h2 className="section-title" id="como-comprar">Cómo comprar un sillón BKF en Buenos Aires</h2>
          <p>
            {BUSINESS.legalName} fabrica el sillón BKF en su taller de {BUSINESS.address.street}, {BUSINESS.address.neighborhood}, {BUSINESS.address.locality} (provincia
            de Buenos Aires) y lo vende directo de fábrica a particulares y empresas. En el sitio no se compra ni se paga nada: se pide un presupuesto y el pedido se
            acuerda con el taller.
          </p>
          <ol className="buy-steps">
            <li><strong>Elegí el color y las medidas</strong> (estándar o a medida) y agregá el sillón al presupuesto.</li>
            <li><strong>Enviá el presupuesto por WhatsApp</strong>; podés sumar tu nombre y la zona de entrega.</li>
            <li><strong>Te respondemos con el precio final</strong> y el plazo de entrega.</li>
            <li><strong>Retirás el sillón en el taller</strong> o lo recibís por envío.</li>
          </ol>
          <p>
            Si es para un local o una empresa, mirá el <Link to="/mobiliario-comercial/">mobiliario comercial de hierro a medida</Link>. También podés
            escribirnos por el <Link to="/contacto/">formulario de contacto</Link> o conocer a la empresa en <Link to="/nosotros/">quiénes somos</Link>.
          </p>
        </div>
        <dl className="facts">
          <div><dt>Fabricante</dt><dd>{BUSINESS.legalName}</dd></div>
          <div><dt>Dónde se fabrica</dt><dd>{BUSINESS.address.neighborhood}, {BUSINESS.address.locality}, Buenos Aires</dd></div>
          <div><dt>Cómo se compra</dt><dd>Presupuesto por WhatsApp, sin pago online</dd></div>
          <div><dt>Retiro en el taller</dt><dd>{BUSINESS.hours.label}</dd></div>
          <div><dt>San Martín y alrededores</dt><dd>24 a 48 hs con stock</dd></div>
          <div><dt>CABA</dt><dd>2 a 4 días hábiles</dd></div>
          <div><dt>Gran Buenos Aires</dt><dd>2 a 5 días hábiles según la zona</dd></div>
          <div><dt>Interior del país</dt><dd>5 a 10 días hábiles por expreso</dd></div>
          <div><dt>Facturación</dt><dd>Factura A y B</dd></div>
        </dl>
      </section>

      <section className="bkf-about section-fade">
        <div className="bkf-about-inner">
          <h2>Sillón BKF de hierro y cuero hecho en San Martín</h2>
          <p>
            El <strong>sillón BKF</strong> (también llamado silla BKF, silla paleta, sillón mariposa o <em>butterfly chair</em>) es un diseño argentino de 1938:
            una estructura de hierro y un asiento de cuero tensado. El de Taller Kappa se fabrica artesanalmente en San Martín, Buenos Aires, siguiendo ese diseño.
          </p>
          <p>
            Sirve para interiores residenciales, como un living, y para locales gastronómicos con uso intensivo. Nuestros sillones equipan locales de
            YPF, McDonald&apos;s, Burger King y Shell: mirá el <Link to="/mobiliario-comercial/">mobiliario comercial de hierro a medida</Link> y los{' '}
            <Link to="/proyectos/">proyectos que hicimos</Link>.
          </p>
          <p>
            Para conocer el origen del diseño y cómo elegir uno, leé <Link to="/bkf/">qué es el sillón BKF: historia y características</Link>. Los cuidados y las
            condiciones están en <Link to="/garantia/">garantía y cuidados</Link>.
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

      <section className="why-section section-fade" aria-labelledby="de-que-esta-hecho">
        <h2 className="section-title" id="de-que-esta-hecho">De qué está hecho el sillón BKF</h2>
        <ScrollText items={MADE_OF} />
      </section>

      <section className="bkf-comparison section-fade">
        <div className="bkf-about-inner">
          <h2>Ficha técnica del Sillón BKF Premium</h2>
          <p className="section-subtitle">Materiales, medidas y condiciones con los que Taller Kappa fabrica cada unidad.</p>
          <div className="comparison-table-wrapper">
            <table className="comparison-table">
              <caption className="visually-hidden">Ficha técnica del Sillón BKF Premium</caption>
              <tbody>
                {PRODUCT.facts.map(([label, value]) => (
                  <tr key={label}>
                    <th scope="row">{label}</th>
                    <td className="our-col"><strong>{label === 'Precio' ? (formatPrice(PRODUCT) ?? value) : value}</strong></td>
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
            Del mismo diseño fabricamos el <Link to="/catalogo/banco-bkf/">Banco BKF</Link> (38 x 38 x 45 cm) y, para locales gastronómicos, la{' '}
            <Link to="/catalogo/base-de-mesa-flat/">Base de Mesa Flat</Link>. Todo el catálogo está en{' '}
            <Link to="/catalogo/asientos/">sillones y bancos BKF</Link> y <Link to="/catalogo/mesas/">bases de mesa de hierro</Link>.
          </p>
          <ul className="related-list">
            {related.map((r) => (
              <li key={r.slug}>
                <Link to={productHref(r)}>{r.name}</Link>
                <span>{r.desc}</span>
              </li>
            ))}
          </ul>
        </div>
      </aside>

      <section className="cta-section section-fade">
        <div className="cta-box">
          <h2>¿Querés un sillón BKF?</h2>
          <p>Escribinos por WhatsApp y te respondemos con el presupuesto. Precios de fábrica, envíos a todo el país.</p>
          <div className="cta-btns">
            <a href={whatsappUrl('Hola, quiero pedir un presupuesto del Sillón BKF.')}
              target="_blank" rel="noopener noreferrer" className="btn-main"
              onClick={() => trackEvent('whatsapp_click', { location: 'sillon-bkf_cta_final' })}>
              <Icon name="whatsapp" /> Pedir presupuesto por WhatsApp
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
