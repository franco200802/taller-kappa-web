import { useState } from 'react';
import Icon from '../components/Icon';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import Seo from '../components/Seo';
import PageHero from '../components/PageHero';
import { trackEvent } from '../lib/analytics';
import { loadFireDB } from '../lib/firebaseConfig';
import { whatsappUrl, WHATSAPP_DISPLAY, CONTACT_EMAIL } from '../data/contact';
import { BUSINESS } from '../data/business';
import { ORG_ID } from '../lib/schema';

export default function Contacto() {
  const { showToast } = useCart();
  const [form, setForm] = useState({ name: '', interest: '', message: '' });

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
    const interestLine = form.interest ? `\nProducto de interés: ${form.interest}` : '';
    window.open(whatsappUrl(`Hola, soy ${form.name}.${interestLine}\n\n${form.message}`), '_blank', 'noopener');

    // El guardado del lead corre en segundo plano y nunca bloquea al usuario.
    // Si falla lo registramos para saber cuántos leads no se persisten;
    // `reason` distingue "Firebase sin configurar" de un error real.
    loadFireDB()
      .then((db) => db.createContacto(form))
      .catch((err) => trackEvent('contacto_save_failed', {
        location: 'contacto_form',
        reason: err?.message === 'firebase_sin_configurar' ? 'firebase_sin_configurar' : 'error',
      }));

    setForm({ name: '', interest: '', message: '' });
    showToast('¡Mensaje listo! Se abrió WhatsApp.');
  };

  return (
    <>
      <Seo
        title="Contacto | Taller Kappa, Villa Chacabuco, San Martín"
        description="Cómo contactar a Taller Kappa: WhatsApp 11 6124-2498, email y dirección en Villa Chacabuco, San Martín. Cotizá sillones BKF, bancos y bases de mesa."
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
      />
      <section className="section-padding contact-layout">
        <form onSubmit={handleSubmit} className="contact-form" id="contact-form">
          <div className="form-group">
            <label htmlFor="contact-name">Tu nombre</label>
            <input id="contact-name" name="name" autoComplete="name" maxLength={100} required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Ej: Juan García" />
          </div>
          <div className="form-group">
            <label htmlFor="contact-interest">¿Qué te interesa?</label>
            <select id="contact-interest" value={form.interest} onChange={(e) => setForm({ ...form, interest: e.target.value })}>
              <option value="">Seleccioná una opción…</option>
              <option value="Sillón BKF">Sillón BKF</option>
              <option value="Banco BKF">Banco BKF</option>
              <option value="Base de Mesa">Base de Mesa</option>
              <option value="Pedido mayorista">Pedido mayorista</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="contact-message">Tu mensaje</label>
            <textarea id="contact-message" name="message" maxLength={2000} required value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder="Contanos tu consulta o lo que necesitás…" />
          </div>
          <div className="form-submit">
            <button type="submit" className="btn-main"><Icon name="whatsapp" /> Enviar por WhatsApp</button>
          </div>
        </form>
        <aside className="contact-aside" aria-label="Datos de contacto">
          <h2 className="contact-aside-title">Cómo contactar a {BUSINESS.name}</h2>
          <address className="contact-info">
            <p><Icon name="map-marker-alt" /> Calle&nbsp;28 Nº&nbsp;3779, Villa Chacabuco (San Martín), Buenos Aires.</p>
            <p><Icon name="whatsapp" /> <a href={whatsappUrl()} target="_blank" rel="noopener noreferrer">{WHATSAPP_DISPLAY}</a></p>
            <p><Icon name="envelope" /> <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a></p>
            <p><Icon name="clock" /> Retiro en el taller: {BUSINESS.hours.label}.</p>
            <p><Icon name="map-marker-alt" /> <a href={BUSINESS.directionsUrl} target="_blank" rel="noopener noreferrer">Cómo llegar en Google Maps</a></p>
          </address>
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
