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
  const [products, setProducts] = useState(FALLBACK_PRODUCTS);
  const [filter, setFilter] = useState('all');
  const [modalProduct, setModalProduct] = useState(null);

  useEffect(() => {
    let cancelled = false;
    // Import dinámico: el chunk de Firebase (~105kB gzip) solo se descarga
    // cuando esta página realmente lo necesita, no bloquea el render inicial.
    import('../lib/firedb').then(({ FireDB }) => FireDB.getProducts())
      .then((data) => { if (!cancelled && data.length) setProducts(data); })
      .catch(() => { /* se queda con el fallback */ });
    return () => { cancelled = true; };
  }, []);

  const filtered = filter === 'all' ? products : products.filter((p) => p.category === filter);

  return (
    <section className="section-padding" style={{ paddingTop: 40 }}>
      <Seo
        title="Catálogo de Sillas de Hierro y Cuero | Taller Kappa Buenos Aires"
        description="Catálogo de sillones BKF, bancos y bases de mesa de hierro macizo y cuero vacuno. Fabricación propia en San Martín, Buenos Aires."
        path="/catalogo"
        jsonLd={breadcrumbList([{ name: 'Inicio', path: '/' }, { name: 'Catálogo', path: '/catalogo' }])}
      />
      <h1 className="section-title">Sillas de Hierro y Cuero — Buenos Aires</h1>

      <div className="filter-bar">
        {['all', 'asientos', 'mesas'].map((cat) => (
          <button key={cat} className={`filter-btn ${filter === cat ? 'active' : ''}`} onClick={() => setFilter(cat)}>
            {cat === 'all' ? 'Todos' : cat === 'asientos' ? 'Asientos' : 'Mesas'}
          </button>
        ))}
      </div>

      <div className="products-grid">
        {filtered.map((p) => <ProductCard key={p.id} p={p} onOpen={setModalProduct} />)}
      </div>

      {modalProduct && (
        <div className="product-modal active" onClick={(e) => e.target === e.currentTarget && setModalProduct(null)}>
          <div className="modal-content">
            <button className="close-modal" onClick={() => setModalProduct(null)}>×</button>
            <img src={modalProduct.image} alt={modalProduct.name} />
            <h2>{modalProduct.name}</h2>
            <p>{modalProduct.desc}</p>
            <ul className="modal-specs">
              {modalProduct.specs?.map((s) => <li key={s}><i className="fas fa-check" /> {s}</li>)}
            </ul>
          </div>
        </div>
      )}
    </section>
  );
}
