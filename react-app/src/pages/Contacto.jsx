import { useState } from 'react';
import Icon from '../components/Icon';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import Seo from '../components/Seo';
import PageHero from '../components/PageHero';
import { trackEvent } from '../lib/analytics';
import { isFirebaseConfigured, loadFireDB } from '../lib/firebaseConfig';
import { whatsappUrl, WHATSAPP_DISPLAY, CONTACT_EMAIL } from '../data/contact';
import { BUSINESS, addressLine, googleProfileUrl, googleReviewUrl } from '../data/business';
import { ORG_ID } from '../lib/schema';

export default function Contacto() {
  const { showToast } = useCart();
  const [form, setForm] = useState({ name: '', interest: '', zone: '', message: '' });
  const [retryLink, setRetryLink] = useState('');

  const updateField = (field, value) => {
    setForm((previous) => ({ ...previous, [field]: value }));
    setRetryLink('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.message.trim()) {
      showToast('Por favor completá nombre y mensaje.');
      return;
    }
    // WhatsApp se abre ANTES de cualquier await: Safari/iOS bloquea
    // window.open si no ocurre dentro del mismo gesto del usuario, y con
    // Firestore sin configurar (o sin red) el await podía colgarse y el
    // botón "no hacía nada".
    trackEvent('whatsapp_click', { location: 'contacto_form', interest: form.interest || '(sin especificar)' });
    const interestLine = form.interest ? `\nMe interesa: ${form.interest}` : '';
    const zoneLine = form.zone.trim() ? `\nZona de entrega: ${form.zone.trim()}` : '';
    const link = whatsappUrl(`Hola, soy ${form.name.trim()}.${interestLine}${zoneLine}\n\n${form.message.trim()}`);
    setRetryLink(link);
    window.open(link, '_blank', 'noopener,noreferrer');

    // Se registra el intento. El envío del mensaje se hace dentro de WhatsApp.
    // El guardado del lead corre en segundo plano y nunca bloquea al usuario.
    // Si falla lo registramos para saber cuántos leads no se persisten;
    // `reason` distingue "Firebase sin configurar" de un error real.
    loadFireDB()
      .then((db) => db.createContacto(form))
      .catch((err) => trackEvent('contacto_save_failed', {
        location: 'contacto_form',
        reason: err?.message === 'firebase_sin_configurar' ? 'firebase_sin_configurar' : 'error',
      }));
  };

  return (
    <>
      <Seo
        title="Contacto y Dirección en San Martín, Buenos Aires | Taller Kappa"
        description={`Cómo contactar a Taller Kappa: WhatsApp ${WHATSAPP_DISPLAY}, email y dirección en Villa Chacabuco, San Martín. Cotizá sillones BKF, bancos y bases de mesa.`}
        path="/contacto"
        pageType="ContactPage"
        about={[ORG_ID]}
        mainEntity={ORG_ID}
        breadcrumb={[{ name: 'Inicio', path: '/' }, { name: 'Contacto', path: '/contacto' }]}
      />
      <PageHero
        title="Contacto"
        lead="Para cotizar o consultar por un producto, escribí a Taller Kappa por WhatsApp o con el formulario: te respondemos con el presupuesto."
        current="Contacto"
      >
        {/* Atajos arriba: en el celular el formulario terminaba abajo de la primera pantalla y los datos de contacto,
            después del formulario. */}
        <div className="page-hero-actions" data-cta="contacto_hero">
          <a href={whatsappUrl('Hola, quiero hacer una consulta.')} target="_blank" rel="noopener noreferrer" className="btn-main btn-wa">
            <Icon name="whatsapp" /> Escribir por WhatsApp
          </a>
          <a href={`tel:${BUSINESS.phone}`} className="btn-outline">Llamar al {WHATSAPP_DISPLAY}</a>
        </div>
      </PageHero>
      <section className="section-padding contact-layout">
        <form onSubmit={handleSubmit} className="contact-form" id="contact-form">
          <div className="form-group">
            <label htmlFor="contact-name">Tu nombre</label>
            <input id="contact-name" name="name" autoComplete="name" maxLength={100} required value={form.name} onChange={(e) => updateField('name', e.target.value)} placeholder="Ej: Juan García" />
          </div>
          <div className="form-group">
            <label htmlFor="contact-interest">¿Qué te interesa?</label>
            <select id="contact-interest" value={form.interest} onChange={(e) => updateField('interest', e.target.value)}>
              <option value="">Seleccioná una opción…</option>
              <option value="Sillón BKF">Sillón BKF</option>
              <option value="Banco BKF">Banco BKF</option>
              <option value="Base de Mesa">Base de Mesa</option>
              <option value="Pedido mayorista">Pedido mayorista</option>
              <option value="Mobiliario para un local o empresa">Mobiliario para un local o empresa</option>
              <option value="Visitar el showroom">Visitar el showroom</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="contact-zone">Zona de entrega (opcional)</label>
            <input id="contact-zone" name="zone" autoComplete="address-level2" maxLength={100} value={form.zone} onChange={(e) => updateField('zone', e.target.value)} placeholder="Barrio o localidad" />
            <small className="form-hint">Con la zona podemos incluir el envío en el presupuesto.</small>
          </div>
          <div className="form-group">
            <label htmlFor="contact-message">Tu mensaje</label>
            <textarea id="contact-message" name="message" maxLength={2000} required value={form.message} onChange={(e) => updateField('message', e.target.value)} placeholder="Contanos qué necesitás: producto, cantidad y color." />
          </div>
          <div className="form-submit">
            <button type="submit" className="btn-main" aria-describedby="contact-whatsapp-next"><Icon name="whatsapp" /> Abrir WhatsApp</button>
            {retryLink && (
              <a className="btn-outline" href={retryLink} target="_blank" rel="noopener noreferrer" data-cta="contacto_form_enlace">
                Usar el enlace directo de WhatsApp
              </a>
            )}
            <p className="form-hint" id="contact-whatsapp-next">Revisá el texto y tocá Enviar en WhatsApp para hacer la consulta.</p>
            {isFirebaseConfigured && <small className="form-hint">Al tocar Abrir WhatsApp se intenta guardar una copia del mensaje.</small>}
          </div>
        </form>
        <aside className="contact-aside" aria-label="Datos de contacto">
          <h2 className="contact-aside-title">Cómo contactar a {BUSINESS.name}</h2>
          <address className="contact-info">
            <p><Icon name="map-marker-alt" /> {addressLine()}</p>
            <p><Icon name="whatsapp" /> <a href={whatsappUrl()} target="_blank" rel="noopener noreferrer">{WHATSAPP_DISPLAY}</a></p>
            <p><Icon name="envelope" /> <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a></p>
            <p><Icon name="clock" /> Atención: {BUSINESS.hours.label}.</p>
            <p><Icon name="map-marker-alt" /> <a href={BUSINESS.mapUrl} target="_blank" rel="noopener noreferrer">Cómo llegar en Google Maps</a></p>
            <p><Icon name="star" /> <a href={googleProfileUrl()} target="_blank" rel="noopener noreferrer">Opiniones de clientes en Google</a></p>
            <p><Icon name="star" /> <a href={googleReviewUrl()} target="_blank" rel="noopener noreferrer" data-cta="contacto_review">Dejar una reseña en Google</a></p>
          </address>
          <h3>Showroom y retiro</h3>
          <p>{BUSINESS.showroom.text}</p>
          <p>
            <a href={whatsappUrl('Hola, quiero pedir un turno para visitar el showroom.')} target="_blank" rel="noopener noreferrer">
              Pedir turno por WhatsApp
            </a>{' '}
            o por teléfono al <a href={`tel:${BUSINESS.phone}`}>{WHATSAPP_DISPLAY}</a>.
          </p>
          <p>{BUSINESS.pickup.text}</p>
          <p>
            Taller Kappa vende por cotización: indicá el producto, la cantidad, el color y la zona de entrega. Antes de escribir,
            podés ver las <Link to="/envios/">zonas y tiempos de envío</Link> y la <Link to="/garantia/">garantía</Link>, o conocer a la empresa en <Link to="/nosotros/">quiénes somos</Link>.
          </p>
          <p>
            ¿Buscás un producto en particular? Mirá el <Link to="/catalogo/">catálogo de sillones, bancos y bases de mesa</Link> o
            todo sobre el <Link to="/sillon-bkf/">sillón BKF</Link>. Si es para un negocio, mirá el <Link to="/mobiliario-comercial/">mobiliario comercial a medida</Link>.
          </p>
        </aside>
      </section>
    </>
  );
}
