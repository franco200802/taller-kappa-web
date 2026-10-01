import { Link } from 'react-router-dom';
import Seo from '../components/Seo';
import { breadcrumbList } from '../lib/site';
import PageHero from '../components/PageHero';
import { whatsappUrl } from '../data/contact';

const PROJECTS = [
  {
    logo: '/images/logoypf.png', alt: 'Equipamiento YPF Full - muebles de hierro', w: 213, h: 60,
    brand: 'YPF Full', where: 'Estaciones de servicio en múltiples sucursales de Buenos Aires',
    desc: 'Fabricamos y entregamos bases de mesa Flat y bancos de hierro para las tiendas YPF Full. Diseño resistente al uso intensivo 24/7 con acabado en pintura epoxi negra.',
    specs: ['Bases de mesa entregadas', 'Acabado epoxi negro mate', 'Fabricación resistente a uso intensivo'],
  },
  {
    logo: '/images/mcdonaldslogo.png', alt: "Equipamiento McDonald's - mesas de hierro", w: 246, h: 205,
    brand: "McDonald's", where: 'Locales gastronómicos en Capital Federal y GBA',
    desc: 'Proveemos estructuras metálicas para mobiliario de salón. Sillas y mesas que soportan el alto tránsito diario de la cadena más grande del mundo.',
    specs: ['Hierro macizo 12mm', 'Entrega en plazos ajustados', 'Factura A'],
  },
  {
    logo: '/images/burguerlogo.png', alt: 'Equipamiento Burger King - sillas de hierro', w: 215, h: 234,
    brand: 'Burger King', where: 'Franquicias en Buenos Aires',
    desc: 'Fabricamos sillas y bancos de hierro para locales Burger King. Diseño moderno, resistente y fácil de mantener para uso gastronómico diario.',
    specs: ['Diseño a medida del local', 'Pintura epoxi anticorrosiva', 'Reposición rápida'],
  },
  {
    logo: '/images/sandrologo.png', alt: 'Equipamiento Sandro Paris - mobiliario comercial', w: 211, h: 63,
    brand: 'Sandro Paris', where: 'Locales de indumentaria en Palermo, Buenos Aires',
    desc: 'Desarrollamos mobiliario exhibidor en hierro para los locales Sandro. Percheros, mesas de exhibición y estructuras decorativas con acabado cromado.',
    specs: ['Acabado cromado premium', 'Diseño exclusivo', 'Medidas personalizadas'],
  },
  {
    logo: '/images/shelllogo.png', alt: 'Equipamiento Shell Select - muebles gastronómicos', w: 245, h: 206,
    brand: 'Shell Select', where: 'Tiendas de conveniencia en Zona Norte, Buenos Aires',
    desc: 'Equipamos el sector gastronómico de Shell Select con bases de mesa y sillas de hierro. Producto resistente a uso intensivo con estética industrial moderna.',
    specs: ['Estética industrial', 'Resistente a intemperie', 'Entrega coordinada'],
  },
];

export default function Proyectos() {
  return (
    <>
      <Seo
        title="Proyectos — Clientes que Confían en Taller Kappa"
        description="Equipamos locales de YPF, McDonald's, Burger King, Shell y Sandro con mobiliario de hierro y cuero fabricado en Buenos Aires."
        path="/proyectos"
        jsonLd={breadcrumbList([{ name: 'Inicio', path: '/' }, { name: 'Proyectos', path: '/proyectos' }])}
      />
      <PageHero
        title="Proyectos de mobiliario de hierro para empresas"
        lead="Equipamiento comercial y gastronómico fabricado a medida para locales y franquicias."
        current="Proyectos"
      />

      <section className="projects-section section-padding section-fade">
        <h2 className="section-title">Nuestros clientes</h2>
        <p className="section-subtitle">Grandes marcas eligen Taller Kappa para su equipamiento comercial.</p>
        <p style={{ marginBottom: 32 }}>
          Fabricamos mobiliario de hierro y cuero a medida para locales gastronómicos, estaciones de servicio
          y comercios. Si tenés un proyecto para tu empresa, <Link to="/contacto/">contactanos</Link> y te asesoramos.
        </p>

        <div className="projects-grid">
          {PROJECTS.map((p) => (
            <article className="project-card" key={p.brand}>
              <div className="project-card-img">
                <img src={p.logo} alt={p.alt} width={p.w} height={p.h} loading="lazy" />
              </div>
              <div className="project-card-body">
                <h3>{p.brand}</h3>
                <p className="project-tag"><i className="fas fa-map-marker-alt" aria-hidden="true" /> {p.where}</p>
                <p>{p.desc}</p>
                <ul className="project-specs">
                  {p.specs.map((s) => (
                    <li key={s}><i className="fas fa-check" /> {s}</li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="cta-section section-fade">
        <div className="cta-box">
          <h2>¿Querés equipar tu local o empresa?</h2>
          <p>Trabajamos con franquicias, restaurantes, bares, hoteles y oficinas. Pedí tu cotización sin compromiso.</p>
          <div className="cta-btns">
            <a href={whatsappUrl('Hola, soy de una empresa y necesito cotización para equipamiento.')}
              target="_blank" rel="noopener noreferrer" className="btn-main">
              <i className="fab fa-whatsapp" /> Cotizar por WhatsApp
            </a>
            <Link to="/catalogo/" className="btn-outline">
              <i className="fas fa-th-large" /> Ver catálogo
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
