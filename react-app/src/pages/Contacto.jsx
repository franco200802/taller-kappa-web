import { useState } from 'react';
import { useCart } from '../context/CartContext';
import Seo, { breadcrumbList } from '../components/Seo';

export default function Contacto() {
  const { showToast } = useCart();
  const [form, setForm] = useState({ name: '', interest: '', message: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.message.trim()) {
      showToast('Por favor completá nombre y mensaje.');
      return;
    }
    try {
      const { FireDB } = await import('../lib/firedb');
      await FireDB.createContacto(form);
    } catch { /* igual abrimos WhatsApp */ }

    const interestLine = form.interest ? `\nProducto de interés: ${form.interest}` : '';
    const text = encodeURIComponent(`Hola, soy ${form.name}.${interestLine}\n\n${form.message}`);
    window.open(`https://wa.me/541161242498?text=${text}`, '_blank');
    setForm({ name: '', interest: '', message: '' });
    showToast('¡Mensaje listo! Se abrió WhatsApp.');
  };

  return (
    <section className="section-padding" style={{ paddingTop: 60 }}>
      <Seo
        title="Contacto | Taller Kappa Buenos Aires"
        description="Contactanos por WhatsApp para cotizar sillones BKF, bancos y bases de mesa de hierro y cuero. Fábrica en San Martín, Buenos Aires."
        path="/contacto"
        jsonLd={breadcrumbList([{ name: 'Inicio', path: '/' }, { name: 'Contacto', path: '/contacto' }])}
      />
      <h1>Contactanos</h1>
      <form onSubmit={handleSubmit} className="contact-form" id="contact-form">
        <label>
          Tu nombre
          <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Ej: Juan García" />
        </label>
        <label>
          ¿Qué te interesa?
          <select value={form.interest} onChange={(e) => setForm({ ...form, interest: e.target.value })}>
            <option value="">Seleccioná una opción...</option>
            <option value="Sillón BKF">Sillón BKF</option>
            <option value="Banco BKF">Banco BKF</option>
            <option value="Base de Mesa">Base de Mesa</option>
            <option value="Pedido mayorista">Pedido mayorista</option>
          </select>
        </label>
        <label>
          Tu mensaje
          <textarea value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder="Contanos tu consulta o lo que necesitás..." />
        </label>
        <button type="submit" className="btn-main"><i className="fab fa-whatsapp" /> Enviar por WhatsApp</button>
      </form>
    </section>
  );
}
