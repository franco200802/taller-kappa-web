import { Link } from 'react-router-dom';
import Icon from '../components/Icon';
import Seo from '../components/Seo';
import PageHero from '../components/PageHero';
import { whatsappUrl } from '../data/contact';
import { BUSINESS, addressLine } from '../data/business';

const ZONES = [
  { icon: 'fa-motorcycle', title: 'San Martín y alrededores', desc: 'Entrega directa en Villa Chacabuco, San Martín, Tres de Febrero, Caseros, Santos Lugares, Hurlingham y Ciudadela.', badge: 'Envío bonificado', free: true },
  { icon: 'fa-van-shuttle', title: 'Capital Federal (CABA)', desc: 'Entregamos en todos los barrios: Devoto, Belgrano, Palermo, Caballito, Villa Urquiza, Recoleta, San Telmo, Núñez, Colegiales y más.', badge: 'Costo según zona' },
  { icon: 'fa-truck', title: 'Zona Norte', desc: 'Vicente López, Olivos, San Isidro, Martínez, Tigre, San Fernando, Pilar, Escobar y Don Torcuato.', badge: 'Costo según zona' },
  { icon: 'fa-truck', title: 'Zona Oeste', desc: 'Morón, Ituzaingó, Merlo, Moreno, Paso del Rey, Haedo, Ramos Mejía y La Matanza.', badge: 'Costo según zona' },
  { icon: 'fa-truck', title: 'Zona Sur', desc: 'Avellaneda, Lanús, Quilmes, Lomas de Zamora, Adrogué, Banfield, Temperley y Ezeiza.', badge: 'Costo según zona' },
  { icon: 'fa-plane', title: 'Interior del país', desc: 'Enviamos a todas las provincias mediante expreso (Andreani, Vía Cargo, transporte de cargas). Embalaje profesional bonificado.', badge: 'Embalaje bonificado', free: true, featured: true },
];

const INFO = [
  { icon: 'fa-box-open', title: 'Embalaje profesional', desc: 'Cada pieza se embala con protección de espuma, cartón reforzado y film stretch para asegurar que llegue en perfectas condiciones.' },
  { icon: 'fa-store', title: 'Retiro en el taller', desc: `Retiro presencial sin cargo, con coordinación previa por WhatsApp o teléfono: ${addressLine()}. ${BUSINESS.hours.label.charAt(0).toUpperCase()}${BUSINESS.hours.label.slice(1)}.` },
  { icon: 'fa-clock', title: 'Plazo de entrega', desc: BUSINESS.deliveryNote },
  { icon: 'fa-hand-holding-usd', title: 'Envío bonificado', desc: 'En pedidos mayoristas (3+ unidades) y primer compra, el envío dentro de GBA es bonificado. Consultanos las condiciones.' },
];

export default function Envios() {
  return (
    <>
      <Seo
        title="Envíos de Muebles de Hierro: Zonas de Entrega y Retiro | Taller Kappa"
        description="Zonas de entrega de Taller Kappa: San Martín, CABA, GBA e interior por expreso. El plazo depende del stock: consultá por WhatsApp. Retiro con coordinación previa."
        path="/envios"
        breadcrumb={[{ name: 'Inicio', path: '/' }, { name: 'Envíos', path: '/envios' }]}
      />
      <PageHero
        title="Envíos de muebles de hierro en Buenos Aires"
        lead="Entregamos en San Martín y alrededores, Capital Federal, Gran Buenos Aires y el interior del país por expreso. El plazo de entrega depende de la disponibilidad de stock: consultanos por WhatsApp. También podés retirar en el taller, con coordinación previa."
        current="Envíos"
      />

      <section className="shipping-section section-padding section-fade">
        <h2 className="section-title">Zonas de entrega</h2>
        <p className="section-subtitle">Hacemos envíos a domicilio y también podés retirar en nuestro taller.</p>

        <div className="shipping-grid">
          {ZONES.map((z) => (
            <div className={`shipping-card ${z.featured ? 'featured' : ''}`} key={z.title}>
              <div className="shipping-icon"><Icon name={z.icon} /></div>
              <h3>{z.title}</h3>
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
            <a href={whatsappUrl('Hola, quiero saber el costo de envío a mi zona.')}
              target="_blank" rel="noopener noreferrer" className="btn-main">
              <Icon name="whatsapp" /> Consultar envío
            </a>
            <Link to="/catalogo/" className="btn-outline">
              <Icon name="th-large" /> Ver catálogo
            </Link>
          </div>
          <p className="cta-links">
            Conocé también nuestras <Link to="/garantia/">condiciones de garantía</Link>,
            el <Link to="/sillon-bkf/">sillón BKF</Link> o el <Link to="/mobiliario-comercial/">mobiliario comercial a medida</Link>.
          </p>
        </div>
      </section>
    </>
  );
}
