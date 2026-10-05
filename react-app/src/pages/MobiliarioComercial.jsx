import { Link } from 'react-router-dom';
import Seo from '../components/Seo';
import PageHero from '../components/PageHero';
import ScrollText from '../components/ScrollText';
import ShimmerText from '../components/ShimmerText';
import TypeWriter from '../components/TypeWriter';
import ProductTable from '../components/ProductTable';
import { PRODUCTS } from '../data/products';
import { whatsappUrl } from '../data/contact';
import { BUSINESS } from '../data/business';
import { ORG_ID, faqNode, serviceNode } from '../lib/schema';

/**
 * /mobiliario-comercial/ — página de servicio para empresas y locales.
 *
 * Intención comercial B2B ("mobiliario comercial", "muebles para comercios",
 * "fabricante de muebles"). /proyectos/ queda como portfolio de clientes y
 * acá se explica qué se fabrica, cómo se pide y qué condiciones hay.
 *
 * Todo lo que dice sale de lo que ya publican Proyectos, Envíos, Garantía y
 * la FAQ: medidas y acabados a medida, factura A y B, pedidos mayoristas (3 o
 * más unidades), plazos y garantía. No se agregan promesas nuevas.
 */
const PATH = '/mobiliario-comercial';

const FAQ = [
  { q: '¿Qué es el mobiliario comercial?', a: 'Es el mobiliario de locales abiertos al público —gastronomía, estaciones de servicio, comercios, hoteles u oficinas— que tiene que resistir el uso diario intensivo.' },
  { q: '¿Taller Kappa fabrica mobiliario comercial?', a: 'Sí. Fabrica en su taller de San Martín, Buenos Aires, mobiliario de hierro a medida para locales gastronómicos, estaciones de servicio y comercios: bases de mesa, bancos y sillones BKF, y mobiliario exhibidor.' },
  { q: '¿Se pueden pedir medidas, colores y acabados a medida?', a: 'Sí. Se adaptan medidas, colores y terminaciones al local, sin costo adicional.' },
  { q: '¿Emiten factura A?', a: 'Sí. Taller Kappa emite factura A y B, para empresas y particulares.' },
  { q: '¿Hay condiciones para pedidos mayoristas?', a: 'En pedidos mayoristas (3 o más unidades) y en la primera compra, el envío dentro de GBA es bonificado. Las condiciones se consultan por WhatsApp.' },
  { q: '¿Cuánto tarda un pedido?', a: 'Con unidades en stock, la entrega es en 24-48 horas en San Martín y alrededores y de 2 a 5 días hábiles en el resto de CABA y GBA. Los pedidos a medida se fabrican en 5 a 10 días hábiles. Las zonas están en la página de envíos.' },
  { q: '¿Envían a negocios fuera de Buenos Aires?', a: 'Sí, a todas las provincias por expreso, en 5 a 10 días hábiles, con embalaje bonificado.' },
];

const SECTORS = [
  ['Locales gastronómicos y franquicias', 'Bases de mesa, bancos y sillones para salones de restaurantes, bares y cadenas, con uso diario intensivo.'],
  ['Estaciones de servicio y tiendas', 'Bases de mesa, bancos y sillas para el sector gastronómico de las tiendas de estaciones de servicio.'],
  ['Comercios y locales de indumentaria', 'Mobiliario exhibidor en hierro, como percheros y mesas de exhibición, con acabado cromado, por ejemplo.'],
  ['Hoteles y oficinas', 'Asientos y mesas de hierro y cuero en medidas y colores a pedido.'],
];

// Los rubros que escribe el hero son los de SECTORS: se detallan más abajo, en "Para qué tipo de negocio".
const lcFirst = (t) => t.charAt(0).toLowerCase() + t.slice(1);
const SECTOR_PHRASES = SECTORS.map(([name]) => lcFirst(name));

export default function MobiliarioComercial() {
  const description = 'Taller Kappa fabrica en San Martín, Buenos Aires, mobiliario comercial de hierro a medida: bases de mesa, bancos y sillones BKF para locales y empresas de todo el país.';
  const service = serviceNode({
    path: PATH,
    name: 'Fabricación de mobiliario comercial de hierro a medida',
    serviceType: 'Fabricación de mobiliario comercial y gastronómico',
    description: 'Taller Kappa fabrica mobiliario de hierro y cuero a medida para locales gastronómicos, estaciones de servicio, comercios, hoteles y oficinas.',
    offers: PRODUCTS,
  });

  return (
    <>
      <Seo
        title="Mobiliario Comercial de Hierro en Buenos Aires | Taller Kappa"
        description={description}
        path={PATH}
        about={[ORG_ID]}
        mainEntity={service['@id']}
        breadcrumb={[{ name: 'Inicio', path: '/' }, { name: 'Mobiliario comercial', path: PATH }]}
        jsonLd={[service, faqNode(FAQ, PATH)]}
      />
      <PageHero
        title="Mobiliario comercial de hierro a medida"
        lead={(
          <>
            Taller Kappa fabrica en San Martín, Buenos Aires, mobiliario de hierro y cuero a medida para locales y empresas: bases de mesa, bancos y
            sillones BKF. <ShimmerText>Cotizamos por WhatsApp.</ShimmerText>
            <span className="page-typed">
              Equipamos{' '}
              <TypeWriter sequences={SECTOR_PHRASES} srText={SECTOR_PHRASES.join(', ')} />
            </span>
          </>
        )}
        current="Mobiliario comercial"
      />

      <section className="section-padding about-facts section-fade" aria-labelledby="que-es-mc">
        <div>
          <h2 className="section-title" id="que-es-mc">Qué es el mobiliario comercial</h2>
          <p>
            Mobiliario comercial es el que se usa en locales abiertos al público: restaurantes, bares, tiendas, estaciones de servicio, hoteles u
            oficinas. A diferencia del mobiliario de un hogar, tiene que resistir el uso diario intensivo y mantener su aspecto con el tiempo.
          </p>
          <p>
            Por eso {BUSINESS.legalName} fabrica con hierro macizo de 12 mm y pintura epoxi anticorrosiva, y adapta las medidas y los acabados a cada local.
            Es la misma línea de productos del <Link to="/catalogo/">catálogo</Link>, con la posibilidad de pedirla a medida. Conocé a la empresa en <Link to="/nosotros/">quiénes somos</Link>.
          </p>
        </div>
        <dl className="facts">
          <div><dt>Fabricante</dt><dd>{BUSINESS.legalName}, Villa Chacabuco, San Martín</dd></div>
          <div><dt>A medida</dt><dd>Medidas, colores y acabados, sin costo adicional</dd></div>
          <div><dt>Facturación</dt><dd>Factura A y B</dd></div>
          <div><dt>Pedidos mayoristas</dt><dd>3 o más unidades: envío bonificado dentro de GBA</dd></div>
          <div><dt>Garantía</dt><dd>Estructura de hierro de por vida; pintura epoxi 2 años</dd></div>
          <div><dt>Envíos</dt><dd>Capital Federal, GBA y todo el país</dd></div>
        </dl>
      </section>

      <section className="why-section section-fade">
        <h2 className="section-title">Qué fabricamos para locales y empresas</h2>
        <p className="section-subtitle">
          Tres productos de catálogo pensados para uso intensivo, que se pueden pedir a medida del local.
        </p>
        <ProductTable products={PRODUCTS} />
        <p style={{ marginTop: 24 }}>
          Ver la <Link to="/catalogo/base-de-mesa-flat/">Base de Mesa Flat</Link> para mesas y barras, el <Link to="/catalogo/banco-bkf/">Banco BKF</Link> y el{' '}
          <Link to="/sillon-bkf/">Sillón BKF Premium</Link>. Todo el catálogo está en{' '}
          <Link to="/catalogo/asientos/">sillones y bancos BKF</Link> y <Link to="/catalogo/mesas/">bases de mesa de hierro</Link>.
        </p>
      </section>

      <section className="section-padding section-fade">
        <h2 className="section-title">Para qué tipo de negocio</h2>
        <ScrollText items={SECTORS.map(([title, text]) => ({ title, text }))} />
        <p>
          Estos son algunos de los clientes y trabajos que ya hicimos: <Link to="/proyectos/">proyectos de mobiliario de hierro para YPF, McDonald&apos;s, Burger King, Shell Select y Sandro</Link>.
        </p>
      </section>

      <section className="section-padding section-fade">
        <h2 className="section-title">Cómo pedir mobiliario comercial</h2>
        <p>
          Escribinos por <a href={whatsappUrl('Hola, soy de una empresa y necesito cotización de mobiliario comercial.')} target="_blank" rel="noopener noreferrer">WhatsApp</a> o
          con el <Link to="/contacto/">formulario de contacto</Link> e indicá qué producto necesitás, la cantidad, las medidas o el color si son a medida, y la zona de
          entrega. Te respondemos con el presupuesto. Antes de pedir, mirá las <Link to="/envios/">zonas y tiempos de envío</Link> y las{' '}
          <Link to="/garantia/">condiciones de garantía</Link>.
        </p>
        <h3 className="faq-heading">Preguntas frecuentes sobre mobiliario comercial</h3>
        <div className="bkf-about-inner">
          {FAQ.map(({ q, a }) => (
            <div key={q} className="bkf-faq-item">
              <h3>{q}</h3>
              <p>{a}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="cta-section section-fade">
        <div className="cta-box">
          <h2>¿Querés equipar tu local o empresa?</h2>
          <p>Pedí tu cotización por WhatsApp: trabajamos con franquicias, restaurantes, bares, hoteles y oficinas.</p>
          <div className="cta-btns">
            <a href={whatsappUrl('Hola, soy de una empresa y necesito cotización de mobiliario comercial.')} target="_blank" rel="noopener noreferrer" className="btn-main">Cotizar mobiliario comercial</a>
            <Link to="/proyectos/" className="btn-outline">Ver proyectos y clientes</Link>
          </div>
        </div>
      </section>
    </>
  );
}
