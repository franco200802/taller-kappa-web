import { useEffect, useState, useCallback } from 'react';
import { useCart } from '../context/CartContext';
import Seo, { breadcrumbList } from '../components/Seo';

const FALLBACK_PRODUCTS = [
  {
    id: '1', category: 'asientos', name: 'Sillón BKF Premium', image: '/images/bkf1.jpg',
    badge: 'Más vendido', stock: true,
    desc: 'Icono del diseño argentino. Estructura maciza indeformable de 12mm. Incluye funda de cuero vacuno seleccionado.',
    specs: ['Hierro redondo macizo 12mm', 'Cuero Vacuno de 1ra', 'Pintura Epoxi o Cromado', 'Medidas: 78x70x90 cm'],
  },
  {
    id: '2', category: 'asientos', name: 'Banco BKF', image: '/images/bkfapoyapies.jpg',
    badge: 'Ideal para regalo', stock: true,
    desc: 'El complemento ideal de diseño. Versatilidad y resistencia en tamaño compacto, siguiendo la línea BKF.',
    specs: ['Hierro macizo 12mm', 'Altura 45cm', 'Ideal pie de cama o auxiliar', 'Medidas: 38x38x45 cm'],
  },
  {
    id: '3', category: 'mesas', name: 'Base de Mesa Flat', image: '/images/mesa.jpeg',
    badge: 'Uso gastronómico', stock: true,
    desc: 'Estabilidad garantizada para uso gastronómico intenso. Base de chapa torneada pesada que evita el balanceo.',
    specs: ['Base chapa torneada 10mm', 'Columna central 77/101mm', 'Alturas: 73cm (Mesa) / 105cm (Barra)', 'Apta tapas grandes'],
  },
];

const COLORS = [
  { name: 'Negro Mate', swatch: '#1a1a1a' },
  { name: 'Blanco Crema', swatch: '#f5f0e8' },
  { name: 'Cromado', swatch: 'linear-gradient(135deg,#ccc,#fff,#aaa)' },
  { name: 'Verde Oliva', swatch: '#556b2f' },
  { name: 'Rojo Kappa', swatch: '#b71c1c' },
];

const MATERIALS = [
  { color: '#555', title: 'Hierro Macizo', desc: 'Varilla redonda de 12mm, sin costuras ni rellenos. Indeformable ante el uso intensivo.', pct: 95, label: 'Resistencia: 95%' },
  { color: '#8B4513', title: 'Cuero Vacuno', desc: 'Cuero de primera selección, curtido al vegetal. Natural, durable y de aspecto premium.', pct: 90, label: 'Calidad: Premium' },
  { color: '#b71c1c', title: 'Pintura Epoxi', desc: 'Tratamiento anticorrosivo de doble capa. Resistente a humedad, ralladuras y UV.', pct: 88, label: 'Durabilidad: Alta' },
  { color: '#aaa', title: 'Cromado Industrial', desc: 'Acabado espejado de nivel industrial. Resistente a la corrosión, fácil de limpiar.', pct: 85, label: 'Acabado: Brillante' },
];

function ProductCard({ p, onOpen }) {
  const { addToCart } = useCart();
  return (
    <article className="product-card" data-category={p.category}>
      {p.badge && <div className="product-badge">{p.badge}</div>}
      <div className={`stock-indicator ${p.stock ? 'in-stock' : 'no-stock'}`}>
        <span className="stock-dot-small" /> {p.stock ? 'En stock' : 'Consultar'}
      </div>
      <div className="card-img-wrapper" role="button" tabIndex={0} onClick={() => onOpen(p)}
        onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onOpen(p)}>
        <img src={p.image} alt={p.name} loading="lazy" />
        <div className="card-overlay"><i className="fas fa-search-plus" /> Ver detalle</div>
      </div>
      <div className="card-info">
        <h3>{p.name}</h3>
        <p className="card-specs-preview">{p.specs?.[0] || ''}</p>
        <a className="card-consult" target="_blank" rel="noopener noreferrer"
          href={`https://wa.me/541161242498?text=${encodeURIComponent('Hola! Quisiera consultar el precio de: ' + p.name)}`}>
          <i className="fab fa-whatsapp" /> Consultar precio
        </a>
        <div className="card-actions">
          <button className="btn-detail" onClick={() => onOpen(p)}><i className="fas fa-info-circle" /> Ver detalles</button>
          <button className="btn-add-cart" onClick={() => addToCart(p, 'Negro Mate')}><i className="fas fa-plus" /> Presupuestar</button>
        </div>
      </div>
    </article>
  );
}

export default function Catalogo() {
  const { addToCart } = useCart();
  const [products, setProducts] = useState(FALLBACK_PRODUCTS);
  const [filter, setFilter] = useState('all');
  const [modalProduct, setModalProduct] = useState(null);
  const [modalColor, setModalColor] = useState('Negro Mate');

  useEffect(() => {
    let cancelled = false;
    // Import dinámico: el chunk de Firebase (~105kB gzip) solo se descarga
    // cuando esta página realmente lo necesita, no bloquea el render inicial.
    import('../lib/firedb').then(({ FireDB }) => FireDB.getProducts())
      .then((data) => { if (!cancelled && data.length) setProducts(data); })
      .catch(() => { /* se queda con el fallback */ });
    return () => { cancelled = true; };
  }, []);

  const openModal = (p) => {
    setModalColor('Negro Mate');
    setModalProduct(p);
    document.body.style.overflow = 'hidden';
  };
  const closeModal = () => {
    setModalProduct(null);
    document.body.style.overflow = '';
  };

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') closeModal(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const filtered = filter === 'all' ? products : products.filter((p) => p.category === filter);
  const FILTERS = [
    { key: 'all', label: 'Todos', icon: 'fa-border-all' },
    { key: 'asientos', label: 'Asientos', icon: 'fa-chair' },
    { key: 'mesas', label: 'Mesas', icon: 'fa-table' },
  ];

  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: products.map((p, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      item: {
        '@type': 'Product',
        name: p.name,
        description: p.desc,
        image: `https://tallerkappa.com.ar${p.image}`,
        category: p.category,
        brand: { '@type': 'Brand', name: 'Taller Kappa' },
        offers: {
          '@type': 'Offer',
          availability: p.stock ? 'https://schema.org/InStock' : 'https://schema.org/PreOrder',
          seller: { '@type': 'Organization', name: 'Taller Kappa S.R.L.' },
        },
      },
    })),
  };

  return (
    <>
      <Seo
        title="Catálogo de Sillas de Hierro y Cuero | Taller Kappa Buenos Aires"
        description="Catálogo de sillones BKF, bancos y bases de mesa de hierro macizo y cuero vacuno. Fabricación propia en San Martín, Buenos Aires."
        path="/catalogo"
        jsonLd={[itemListSchema, breadcrumbList([{ name: 'Inicio', path: '/' }, { name: 'Catálogo', path: '/catalogo' }])]}
      />
      <main id="catalogo" className="section-padding">
        <h1 className="section-title">Sillas de Hierro y Cuero — Buenos Aires</h1>

        <div className="filters" role="group" aria-label="Filtrar productos">
          {FILTERS.map((f) => (
            <button key={f.key} className={`filter-btn ${filter === f.key ? 'active' : ''}`} onClick={() => setFilter(f.key)}>
              <i className={`fas ${f.icon}`} /> {f.label}
            </button>
          ))}
        </div>

        <div className="products-grid" aria-live="polite">
          {filtered.map((p) => <ProductCard key={p.id} p={p} onOpen={openModal} />)}
        </div>
      </main>

      <section className="materials-section section-fade" aria-label="Nuestros materiales">
        <h2 className="section-title">Calidad que se ve y se toca</h2>
        <p className="section-subtitle">Cada pieza fabricada con los mejores materiales del mercado.</p>
        <div className="materials-grid">
          {MATERIALS.map((m) => (
            <div className="material-card" key={m.title}>
              <div className="material-icon"><i className="fas fa-circle" style={{ color: m.color }} /></div>
              <h3>{m.title}</h3>
              <p>{m.desc}</p>
              <div className="material-bar"><div className="material-fill" style={{ width: `${m.pct}%` }} /></div>
              <span className="material-label">{m.label}</span>
            </div>
          ))}
        </div>
      </section>

      <div className={`modal ${modalProduct ? 'active' : ''}`} role="dialog" aria-modal="true"
        onClick={(e) => e.target === e.currentTarget && closeModal()}>
        {modalProduct && (
          <div className="modal-content">
            <button className="close-modal" onClick={closeModal} aria-label="Cerrar modal">×</button>
            <div className="modal-img">
              <img src={modalProduct.image} alt={modalProduct.name} loading="lazy" />
            </div>
            <div className="modal-info">
              <div className="modal-badge-row">
                {modalProduct.badge && <span className="modal-badge">{modalProduct.badge}</span>}
              </div>
              <h2>{modalProduct.name}</h2>
              <div className="modal-stock"><span className="stock-dot" /> En stock — Entrega coordinada</div>
              <p>{modalProduct.desc}</p>
              <ul className="modal-specs">
                {modalProduct.specs?.map((s) => <li key={s}><i className="fas fa-check" /> {s}</li>)}
              </ul>
              <div className="color-selector">
                <p className="color-label">Acabado: <strong>{modalColor}</strong></p>
                <div className="color-options">
                  {COLORS.map((c) => (
                    <button key={c.name} className={`color-swatch ${modalColor === c.name ? 'active' : ''}`}
                      style={{ background: c.swatch }} aria-label={c.name} title={c.name}
                      onClick={() => setModalColor(c.name)} />
                  ))}
                </div>
              </div>
              <button className="btn-main" onClick={() => { addToCart(modalProduct, modalColor); closeModal(); }}>
                <i className="fas fa-plus" style={{ marginRight: 8 }} /> Agregar al Presupuesto
              </button>
              <p className="modal-hint"><i className="fab fa-whatsapp" /> Recibís el precio en minutos por WhatsApp</p>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
