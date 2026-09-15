import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { animateHeroTitle, useStaggerReveal } from '../lib/useReveal';
import { useCart } from '../context/CartContext';
import Seo, { breadcrumbList } from '../components/Seo';
import Picture from '../components/Picture';

const PRODUCT_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'Product',
  name: 'Sillón BKF Premium',
  alternateName: ['Sillón BKF', 'BKF', 'Silla Paleta', 'Silla BKF'],
  description: 'Sillón BKF fabricado en hierro macizo redondo de 12mm, cuero vacuno de primera selección curtido al vegetal y pintura epoxi anticorrosiva. El icono del diseño argentino con resistencia industrial.',
  image: [
    'https://tallerkappa.com.ar/images/bkf1.jpg',
    'https://tallerkappa.com.ar/images/bkfapoyapies.jpg',
  ],
  brand: { '@type': 'Brand', name: 'Taller Kappa' },
  manufacturer: {
    '@type': 'Organization',
    name: 'Taller Kappa S.R.L.',
    url: 'https://tallerkappa.com.ar',
    telephone: '+541161242498',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Calle 28 Nº 3779',
      addressLocality: 'San Martín',
      addressRegion: 'Buenos Aires',
      addressCountry: 'AR',
    },
  },
  material: 'Hierro macizo 12mm, Cuero vacuno curtido al vegetal',
  color: 'Negro Mate',
  category: 'Muebles / Sillas / Sillones',
  countryOfOrigin: 'AR',
  offers: {
    '@type': 'Offer',
    availability: 'https://schema.org/InStock',
    itemCondition: 'https://schema.org/NewCondition',
    seller: { '@type': 'Organization', name: 'Taller Kappa S.R.L.', url: 'https://tallerkappa.com.ar' },
  },
};

const FAQ_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    { '@type': 'Question', name: '¿Cuánto cuesta el sillón BKF?', acceptedAnswer: { '@type': 'Answer', text: 'El sillón BKF Premium de Taller Kappa se cotiza según acabado, cantidad y destino de entrega. Consultá por WhatsApp al 11 6124-2498 para recibir presupuesto actualizado.' } },
    { '@type': 'Question', name: '¿El sillón BKF de Taller Kappa sigue el diseño original?', acceptedAnswer: { '@type': 'Answer', text: 'Sí. Fabricamos artesanalmente en Argentina con hierro macizo de 12mm y cuero vacuno de primera selección, siguiendo el diseño creado en 1938 por Antonio Bonet, Juan Kurchan y Jorge Ferrari Hardoy.' } },
    { '@type': 'Question', name: '¿Cuánto tarda en fabricarse un sillón BKF?', acceptedAnswer: { '@type': 'Answer', text: 'El tiempo de fabricación depende del stock disponible. Si hay unidades en stock, la entrega puede ser en 24-48 horas en GBA. Para pedidos a medida, el plazo es de 5 a 10 días hábiles. Consultá disponibilidad por WhatsApp.' } },
    { '@type': 'Question', name: '¿El sillón BKF tiene garantía?', acceptedAnswer: { '@type': 'Answer', text: 'Sí. La estructura de hierro tiene garantía de por vida contra deformaciones. La pintura epoxi tiene garantía de 2 años. El cuero vacuno tiene garantía de 1 año contra defectos de fabricación.' } },
    { '@type': 'Question', name: '¿Puedo elegir el color del sillón BKF?', acceptedAnswer: { '@type': 'Answer', text: 'Sí. Ofrecemos el sillón BKF en negro mate, blanco, colores a pedido y cromado. También podés elegir el color del cuero: negro, marrón, o cuero natural.' } },
  ],
};

const COLORS = [
  { name: 'Negro Mate', swatch: '#1a1a1a' },
  { name: 'Blanco Crema', swatch: '#f5f0e8' },
  { name: 'Cromado', swatch: 'linear-gradient(135deg,#ccc,#fff,#aaa)' },
  { name: 'Verde Oliva', swatch: '#556b2f' },
  { name: 'Rojo Kappa', swatch: '#b71c1c' },
];

export default function SillonBKF() {
  const { addToCart } = useCart();
  const historyRef = useStaggerReveal('.bkf-history-card');

  useEffect(() => { animateHeroTitle('.bkf-hero-h1'); }, []);

  const handleAdd = (color) => {
    addToCart({
      _id: 'bkf-landing',
      id: 'bkf-landing',
      name: 'Sillón BKF Premium',
      image: '/images/bkf1.jpg',
      specs: ['Hierro macizo 12mm', 'Cuero vacuno de 1ra'],
    }, color);
  };

  return (
    <>
      <Seo
        title="Sillón BKF de Hierro y Cuero | Taller Kappa Buenos Aires"
        description="Sillón BKF fabricado en hierro macizo 12mm y cuero vacuno. Directo de fábrica en San Martín, Buenos Aires. Fabricación a medida y envíos."
        path="/sillon-bkf"
        image="https://tallerkappa.com.ar/images/bkf1.jpg"
        type="product"
        jsonLd={[
          PRODUCT_SCHEMA,
          FAQ_SCHEMA,
          breadcrumbList([
            { name: 'Inicio', path: '/' },
            { name: 'Catálogo', path: '/catalogo' },
            { name: 'Sillón BKF', path: '/sillon-bkf' },
          ]),
        ]}
      />
      <div className="page-hero">
        <div className="page-hero-content">
          <h1 className="bkf-hero-h1" data-split><i className="fas fa-chair" /> Sillón BKF</h1>
          <p>El icono del diseño argentino. Hierro macizo y cuero vacuno. Directo de fábrica.</p>
          <nav className="breadcrumb" aria-label="Ruta de navegación">
            <Link to="/">Inicio</Link>
            <i className="fas fa-chevron-right" />
            <Link to="/catalogo">Catálogo</Link>
            <i className="fas fa-chevron-right" />
            <span>Sillón BKF</span>
          </nav>
        </div>
      </div>

      <section className="bkf-product-section section-padding section-fade">
        <div className="bkf-product-grid">
          <div className="bkf-img-col">
            <Picture src="/images/bkf1.jpg" alt="Sillón BKF de hierro macizo y cuero vacuno - Taller Kappa Buenos Aires" width={1600} height={1600} loading="eager" fetchPriority="high" />
            <div className="bkf-badges">
              <span className="bkf-badge"><i className="fas fa-star" /> Diseño icónico</span>
              <span className="bkf-badge"><i className="fas fa-industry" /> Fábrica propia</span>
              <span className="bkf-badge"><i className="fas fa-truck" /> Envío a todo el país</span>
            </div>
          </div>
          <div className="bkf-info-col">
            <h2>Sillón BKF Premium</h2>
            <p className="bkf-tagline">El diseño argentino más icónico, fabricado con los mejores materiales.</p>
            <div className="bkf-price-box">
              <span className="bkf-price">Cotización personalizada</span>
              <span className="bkf-price-note">Consultanos por WhatsApp para recibir tu presupuesto</span>
            </div>
            <ul className="bkf-specs">
              <li><i className="fas fa-check" /> <strong>Estructura:</strong> Hierro macizo redondo 12mm</li>
              <li><i className="fas fa-check" /> <strong>Tapizado:</strong> Cuero vacuno de primera selección curtido al vegetal</li>
              <li><i className="fas fa-check" /> <strong>Pintura:</strong> Epoxi anticorrosiva doble capa</li>
              <li><i className="fas fa-check" /> <strong>Colores:</strong> Negro mate, blanco, colores a pedido, cromado</li>
              <li><i className="fas fa-check" /> <strong>Medidas:</strong> Standard o a medida sin cargo adicional</li>
              <li><i className="fas fa-check" /> <strong>Uso:</strong> Residencial e intensivo gastronómico</li>
              <li><i className="fas fa-check" /> <strong>Garantía:</strong> Estructura de por vida · Pintura 2 años · Cuero 1 año</li>
              <li><i className="fas fa-check" /> <strong>Factura:</strong> A y B</li>
            </ul>
            <div className="bkf-actions">
              <button className="btn-main" onClick={() => handleAdd('Negro Mate')}>
                <i className="fas fa-plus" /> Agregar al presupuesto
              </button>
              <a href="https://wa.me/541161242498?text=Hola%2C+quiero+cotizar+el+Sillón+BKF+Premium."
                target="_blank" rel="noopener noreferrer" className="btn-outline">
                <i className="fab fa-whatsapp" /> Cotizar por WhatsApp
              </a>
            </div>
            <div style={{ marginTop: 16 }}>
              <p style={{ fontSize: '.85rem', color: '#999', marginBottom: 8 }}>
                Acabado: <strong>Negro Mate</strong>
              </p>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                {COLORS.map((c) => (
                  <button key={c.name} title={c.name} onClick={() => handleAdd(c.name)}
                    style={{ width: 32, height: 32, borderRadius: '50%', background: c.swatch, border: '3px solid transparent', cursor: 'pointer' }} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bkf-about section-fade">
        <div className="bkf-about-inner">
          <h2>¿Qué es el Sillón BKF?</h2>
          <p>El <strong>sillón BKF</strong> (también conocido como <em>silla paleta</em> o <em>butterfly chair</em>) es uno de los diseños de mobiliario más reconocidos de Argentina y del mundo. Fue creado en 1938 por los arquitectos argentinos <strong>Antonio Bonet, Juan Kurchan y Jorge Ferrari Hardoy</strong> en Buenos Aires, de ahí las iniciales BKF.</p>
          <p>Su estructura de <strong>hierro forjado</strong> en forma de mariposa sostiene una funda de cuero tensada, generando una silueta inconfundible. Es elegido tanto para interiores modernos y minimalistas como para locales gastronómicos, bares y restaurantes por su <strong>resistencia excepcional</strong> y su diseño atemporal.</p>
          <p>En Taller Kappa fabricamos el sillón BKF con <strong>hierro macizo redondo de 12mm</strong> (sin tubos, sin rellenos) y <strong>cuero vacuno de primera selección</strong>, pensado para uso residencial e intensivo. Nuestros sillones equipan locales de <strong>YPF, McDonald's, Burger King y Shell</strong>.</p>

          <div className="bkf-history-grid" ref={historyRef}>
            <div className="bkf-history-card">
              <i className="fas fa-calendar-alt" />
              <h3>1938</h3>
              <p>Año de creación por Bonet, Kurchan y Ferrari Hardoy en Buenos Aires</p>
            </div>
            <div className="bkf-history-card">
              <i className="fas fa-globe-americas" />
              <h3>Mundial</h3>
              <p>Incluido en la colección permanente del MoMA de Nueva York</p>
            </div>
            <div className="bkf-history-card">
              <i className="fas fa-industry" />
              <h3>Fábrica AR</h3>
              <p>100% fabricado en Argentina, en nuestro taller de San Martín, Bs. As.</p>
            </div>
            <div className="bkf-history-card">
              <i className="fas fa-shield-alt" />
              <h3>Garantía</h3>
              <p>Estructura con garantía de por vida contra deformaciones</p>
            </div>
          </div>
        </div>
      </section>

      <section className="bkf-comparison section-fade">
        <div className="bkf-about-inner">
          <h2>Especificaciones del Sillón BKF Taller Kappa</h2>
          <p className="section-subtitle">Estos son los materiales y estándares con los que fabricamos cada unidad:</p>
          <div className="comparison-table-wrapper">
            <table className="comparison-table">
              <thead>
                <tr>
                  <th>Característica</th>
                  <th className="our-col"><i className="fas fa-star" /> Taller Kappa</th>
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
          <h2>Preguntas Frecuentes sobre el Sillón BKF</h2>
          {FAQ_SCHEMA.mainEntity.map((q) => (
            <div key={q.name} style={{ marginBottom: 20 }}>
              <h3 style={{ marginBottom: 6 }}>{q.name}</h3>
              <p>{q.acceptedAnswer.text}</p>
            </div>
          ))}
          <p>
            Ver todas las <Link to="/faq">preguntas frecuentes</Link>, conocé nuestras{' '}
            <Link to="/garantia">condiciones de garantía</Link> o las{' '}
            <Link to="/envios">zonas y tiempos de envío</Link>.
          </p>
        </div>
      </section>

      <section className="cta-section section-fade">
        <div className="cta-box">
          <h2>¿Querés tu Sillón BKF?</h2>
          <p>Escribinos hoy y te respondemos en minutos. Precios de fábrica, entrega en todo el país.</p>
          <div className="cta-btns">
            <a href="https://wa.me/541161242498?text=Hola%2C+quiero+cotizar+el+Sillón+BKF."
              target="_blank" rel="noopener noreferrer" className="btn-main">
              <i className="fab fa-whatsapp" /> Pedir cotización ahora
            </a>
            <Link to="/catalogo" className="btn-outline">
              <i className="fas fa-th-large" /> Ver todos los productos
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
