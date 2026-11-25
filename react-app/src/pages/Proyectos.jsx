import { Link } from 'react-router-dom';
import Icon from '../components/Icon';
import Seo from '../components/Seo';
import PageHero from '../components/PageHero';
import { B2B_QUOTE_MESSAGE, projectQuoteMessage, whatsappUrlFor } from '../data/contact';
import { ORG_ID } from '../lib/schema';

const PROJECTS = [
  {
    logo: '/images/logoypf.png', alt: 'Equipamiento YPF Full - muebles de hierro', w: 213, h: 60,
    slug: 'ypf-full', related: { to: '/catalogo/base-de-mesa-flat/', label: 'Ver la Base de Mesa Flat' },
    brand: 'YPF Full', where: 'Estaciones de servicio en múltiples sucursales de Buenos Aires',
    desc: 'Fabricamos y entregamos bases de mesa Flat y bancos de hierro para las tiendas YPF Full. Diseño resistente al uso intensivo 24/7 con acabado en pintura epoxi negra.',
    specs: ['Bases de mesa entregadas', 'Acabado epoxi negro mate', 'Fabricación resistente a uso intensivo'],
  },
  {
    logo: '/images/mcdonaldslogo.png', alt: "Equipamiento McDonald's - mesas de hierro", w: 246, h: 205,
    slug: 'mcdonalds', related: { to: '/mobiliario-comercial/', label: 'Ver estructuras y mobiliario a medida' },
    brand: "McDonald's", where: 'Locales gastronómicos en Capital Federal y GBA',
    desc: 'Proveemos estructuras metálicas para mobiliario de salón. Sillas y mesas que soportan el alto tránsito diario de un salón gastronómico.',
    specs: ['Hierro macizo 12mm', 'Entrega en plazos ajustados', 'Factura A'],
  },
  {
    logo: '/images/burguerlogo.png', alt: 'Equipamiento Burger King - sillas de hierro', w: 215, h: 234,
    slug: 'burger-king', related: { to: '/mobiliario-comercial/', label: 'Ver mobiliario comercial a medida' },
    brand: 'Burger King', where: 'Franquicias en Buenos Aires',
    desc: 'Fabricamos sillas y bancos de hierro para locales Burger King. Diseño moderno, resistente y fácil de mantener para uso gastronómico diario.',
    specs: ['Diseño a medida del local', 'Pintura epoxi anticorrosiva', 'Reposición rápida'],
  },
  {
    logo: '/images/sandrologo.png', alt: 'Equipamiento Sandro Paris - mobiliario comercial', w: 211, h: 63,
    slug: 'sandro', related: { to: '/mobiliario-comercial/', label: 'Ver mobiliario exhibidor a medida' },
    brand: 'Sandro Paris', where: 'Locales de indumentaria en Palermo, Buenos Aires',
    desc: 'Desarrollamos mobiliario exhibidor en hierro para los locales Sandro. Percheros, mesas de exhibición y estructuras decorativas con acabado cromado.',
    specs: ['Acabado cromado premium', 'Diseño exclusivo', 'Medidas personalizadas'],
  },
  {
    logo: '/images/shelllogo.png', alt: 'Equipamiento Shell Select - muebles gastronómicos', w: 245, h: 206,
    slug: 'shell-select', related: { to: '/catalogo/mesas/', label: 'Ver bases de mesa' },
    brand: 'Shell Select', where: 'Tiendas de conveniencia en Zona Norte, Buenos Aires',
    desc: 'Equipamos el sector gastronómico de Shell Select con bases de mesa y sillas de hierro. Producto resistente a uso intensivo con estética industrial moderna.',
    specs: ['Estética industrial', 'Resistente a intemperie', 'Entrega coordinada'],
  },
];

const PATH = '/proyectos';

export default function Proyectos() {
  return (
    <>
      <Seo
        title="Proyectos y Clientes: Mobiliario de Hierro para Locales | Taller Kappa"
        description="Proyectos de Taller Kappa: mobiliario de hierro fabricado para locales de YPF Full, McDonald's, Burger King, Shell Select y Sandro. Qué se entregó a cada cliente."
        path="/proyectos"
        about={[ORG_ID]}
        breadcrumb={[{ name: 'Inicio', path: '/' }, { name: 'Proyectos', path: '/proyectos' }]}
      />
      <PageHero
        title="Proyectos y clientes de Taller Kappa"
        lead="Mobiliario de hierro fabricado a medida para locales y franquicias de YPF Full, McDonald's, Burger King, Shell Select y Sandro."
        current="Proyectos"
      >
        {/* Antes el único botón para cotizar estaba al final de la página. Como en /mobiliario-comercial/, la salida va arriba
            y el mensaje termina con la URL, así el taller sabe de qué página vino la consulta. */}
        <div className="page-hero-actions" data-cta="proyectos_hero">
          <a href={whatsappUrlFor(B2B_QUOTE_MESSAGE, PATH)} target="_blank" rel="noopener noreferrer" className="btn-main btn-wa">
            <Icon name="whatsapp" /> Pedir cotización por WhatsApp
          </a>
          <Link to="/mobiliario-comercial/" className="btn-outline">Ver mobiliario comercial</Link>
        </div>
      </PageHero>

      <section className="projects-section section-padding section-fade">
        <h2 className="section-title">Clientes y proyectos</h2>
        <p style={{ marginBottom: 32 }}>
          Estos son los trabajos que Taller Kappa hizo para locales y franquicias. Si buscás qué fabricamos para empresas y cómo se pide, mirá el{' '}
          <Link to="/mobiliario-comercial/">mobiliario comercial de hierro a medida</Link>; si tenés un proyecto, <Link to="/contacto/">contactanos</Link> y te asesoramos.
        </p>

        <div className="projects-grid">
          {PROJECTS.map((p) => (
            <article className="project-card" key={p.brand}>
              <div className="project-card-img">
                <img src={p.logo} alt={p.alt} width={p.w} height={p.h} loading="lazy" />
              </div>
              <div className="project-card-body">
                <h3>{p.brand}</h3>
                <p className="project-tag"><Icon name="map-marker-alt" /> {p.where}</p>
                <p>{p.desc}</p>
                <ul className="project-specs">
                  {p.specs.map((s) => (
                    <li key={s}><Icon name="check" /> {s}</li>
                  ))}
                </ul>
                <div className="project-actions" data-cta={`proyecto_${p.slug}`}>
                  <a href={whatsappUrlFor(projectQuoteMessage(p.brand), PATH)} target="_blank" rel="noopener noreferrer" className="btn-outline">
                    <Icon name="whatsapp" /> Cotizar algo similar
                  </a>
                  <Link to={p.related.to}>{p.related.label}</Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="cta-section section-fade">
        <div className="cta-box">
          <h2>¿Querés equipar tu local o empresa?</h2>
          <p>Trabajamos con franquicias, restaurantes, bares, hoteles y oficinas. Pedí tu cotización sin compromiso.</p>
          <div className="cta-btns" data-cta="proyectos_cta_final">
            <a href={whatsappUrlFor(B2B_QUOTE_MESSAGE, PATH)}
              target="_blank" rel="noopener noreferrer" className="btn-main">
              <Icon name="whatsapp" /> Cotizar por WhatsApp
            </a>
            <Link to="/mobiliario-comercial/" className="btn-outline">
              <Icon name="th-large" /> Ver mobiliario comercial
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
