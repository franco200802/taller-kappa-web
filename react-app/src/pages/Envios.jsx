import { Link } from 'react-router-dom';
import { useStaggerReveal } from '../lib/useReveal';
import Seo, { breadcrumbList } from '../components/Seo';

const ZONES = [
  { icon: 'fa-motorcycle', title: 'San Martín y alrededores', time: '24-48 hs', desc: 'Entrega directa en Villa Chacabuco, San Martín, Tres de Febrero, Caseros, Santos Lugares, Hurlingham y Ciudadela.', badge: 'Envío bonificado', free: true },
  { icon: 'fa-van-shuttle', title: 'Capital Federal (CABA)', time: '2-4 días hábiles', desc: 'Entregamos en todos los barrios: Devoto, Belgrano, Palermo, Caballito, Villa Urquiza, Recoleta, San Telmo, Núñez, Colegiales y más.', badge: 'Costo según zona' },
  { icon: 'fa-truck', title: 'Zona Norte', time: '2-4 días hábiles', desc: 'Vicente López, Olivos, San Isidro, Martínez, Tigre, San Fernando, Pilar, Escobar y Don Torcuato.', badge: 'Costo según zona' },
  { icon: 'fa-truck', title: 'Zona Oeste', time: '2-5 días hábiles', desc: 'Morón, Ituzaingó, Merlo, Moreno, Paso del Rey, Haedo, Ramos Mejía y La Matanza.', badge: 'Costo según zona' },
  { icon: 'fa-truck', title: 'Zona Sur', time: '3-5 días hábiles', desc: 'Avellaneda, Lanús, Quilmes, Lomas de Zamora, Adrogué, Banfield, Temperley y Ezeiza.', badge: 'Costo según zona' },
  { icon: 'fa-plane', title: 'Interior del País', time: '5-10 días hábiles', desc: 'Enviamos a todas las provincias mediante expreso (Andreani, Vía Cargo, transporte de cargas). Embalaje profesional bonificado.', badge: 'Embalaje bonificado', free: true, featured: true },
];

const INFO = [
  { icon: 'fa-box-open', title: 'Embalaje Profesional', desc: 'Cada pieza se embala con protección de espuma, cartón reforzado y film stretch para asegurar que llegue en perfectas condiciones.' },
  { icon: 'fa-store', title: 'Retiro en Taller', desc: 'Podés retirar tu pedido sin cargo en nuestro taller: Calle 28 Nº 3779, Villa Chacabuco (San Martín). Lunes a viernes de 9 a 18 hs.' },
  { icon: 'fa-hand-holding-usd', title: 'Envío Bonificado', desc: 'En pedidos mayoristas (3+ unidades) y primer compra, el envío dentro de GBA es bonificado. Consultanos las condiciones.' },
];

export default function Envios() {
  const gridRef = useStaggerReveal('.shipping-card');

  return (
    <>
      <Seo
        title="Envíos — Zonas y Tiempos de Entrega | Taller Kappa"
        description="Información de envíos de Taller Kappa. Entregamos muebles de hierro y cuero a todo el país: Capital Federal, GBA, Zona Norte, Zona Sur y envíos al interior por expreso."
        path="/envios"
        jsonLd={breadcrumbList([{ name: 'Inicio', path: '/' }, { name: 'Envíos', path: '/envios' }])}
      />
      <div className="page-hero">
        <div className="page-hero-content">
          <h1><i className="fas fa-truck" /> Envíos</h1>
          <p>Llegamos a todo el país con embalaje profesional y envío bonificado.</p>
          <nav className="breadcrumb" aria-label="Ruta de navegación">
            <Link to="/">Inicio</Link>
            <i className="fas fa-chevron-right" />
            <span>Envíos</span>
          </nav>
        </div>
      </div>

      <section className="shipping-section section-padding section-fade">
        <h2 className="section-title">Zonas de Entrega</h2>
        <p className="section-subtitle">Hacemos envíos a domicilio y también podés retirar en nuestro taller.</p>

        <div className="shipping-grid" ref={gridRef}>
          {ZONES.map((z) => (
            <div className={`shipping-card ${z.featured ? 'featured' : ''}`} key={z.title}>
              <div className="shipping-icon"><i className={`fas ${z.icon}`} /></div>
              <h3>{z.title}</h3>
              <p className="shipping-time"><i className="far fa-clock" /> {z.time}</p>
              <p>{z.desc}</p>
              <span className={`shipping-badge ${z.free ? 'free' : ''}`}>{z.badge}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="shipping-info section-fade">
        <div className="info-grid">
          {INFO.map((i) => (
            <div className="info-card" key={i.title}>
              <i className={`fas ${i.icon}`} />
              <h3>{i.title}</h3>
              <p>{i.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="cta-section section-fade">
        <div className="cta-box">
          <h2>¿Querés saber el costo de envío a tu zona?</h2>
          <p>Escribinos por WhatsApp con tu dirección y te cotizamos en el momento.</p>
          <div className="cta-btns">
            <a href="https://wa.me/541161242498?text=Hola%2C+quiero+saber+el+costo+de+envío+a+mi+zona."
              target="_blank" rel="noopener noreferrer" className="btn-main">
              <i className="fab fa-whatsapp" /> Consultar envío
            </a>
            <Link to="/catalogo" className="btn-outline">
              <i className="fas fa-th-large" /> Ver Catálogo
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
