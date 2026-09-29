import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import Seo, { breadcrumbList } from '../components/Seo';
import { trackEvent } from '../lib/analytics';
import { whatsappUrl, WHATSAPP_DISPLAY, CONTACT_EMAIL } from '../data/contact';

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
    // Si falla lo registramos para saber cuántos leads no se persisten
    // (ej. mientras las credenciales de Firebase sean placeholders).
    import('../lib/firedb')
      .then(({ FireDB }) => FireDB.createContacto(form))
      .catch(() => trackEvent('contacto_save_failed', { location: 'contacto_form' }));

    setForm({ name: '', interest: '', message: '' });
    showToast('¡Mensaje listo! Se abrió WhatsApp.');
  };

  return (
    <section className="section-padding" style={{ paddingTop: 60 }}>
      <Seo
        title="Contacto — Taller Kappa | Muebles de Hierro y Sillones BKF"
        description="Contactanos por WhatsApp, email o formulario para cotizar sillones BKF, bancos y bases de mesa de hierro y cuero. Fábrica en San Martín, Buenos Aires."
        path="/contacto"
        jsonLd={breadcrumbList([{ name: 'Inicio', path: '/' }, { name: 'Contacto', path: '/contacto' }])}
      />
      <h1>Contacto — Taller Kappa, Fábrica de Sillones BKF en Buenos Aires</h1>
      <div className="contact-info" style={{ maxWidth: 600, margin: '0 auto 30px' }}>
        <p><i className="fas fa-map-marker-alt" /> Calle 28 Nº 3779, Villa Chacabuco (San Martín), Buenos Aires.</p>
        <p><i className="fab fa-whatsapp" /> <a href={whatsappUrl()} target="_blank" rel="noopener noreferrer">{WHATSAPP_DISPLAY}</a></p>
        <p><i className="far fa-envelope" /> <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a></p>
        <p>
          ¿Buscás un producto en particular? Mirá el <Link to="/catalogo">catálogo completo</Link> o
          todo sobre nuestro <Link to="/sillon-bkf">Sillón BKF</Link>.
        </p>
      </div>
      <form onSubmit={handleSubmit} className="contact-form" id="contact-form">
        <div className="form-group">
          <label htmlFor="contact-name">Tu nombre</label>
          <input id="contact-name" name="name" autoComplete="name" maxLength={100} required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Ej: Juan García" />
        </div>
        <div className="form-group">
          <label htmlFor="contact-interest">¿Qué te interesa?</label>
          <select id="contact-interest" value={form.interest} onChange={(e) => setForm({ ...form, interest: e.target.value })}>
            <option value="">Seleccioná una opción...</option>
            <option value="Sillón BKF">Sillón BKF</option>
            <option value="Banco BKF">Banco BKF</option>
            <option value="Base de Mesa">Base de Mesa</option>
            <option value="Pedido mayorista">Pedido mayorista</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="contact-message">Tu mensaje</label>
          <textarea id="contact-message" name="message" maxLength={2000} required value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder="Contanos tu consulta o lo que necesitás..." />
        </div>
        <div className="form-submit">
          <button type="submit" className="btn-main"><i className="fab fa-whatsapp" /> Enviar por WhatsApp</button>
        </div>
      </form>
    </section>
  );
}
