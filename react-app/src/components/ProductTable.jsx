import { Link } from 'react-router-dom';
import { CATEGORIES, factOf } from '../data/products';

/**
 * Tabla HTML real de productos comparables (no una imagen): producto,
 * categoría, estructura, medidas y uso, leídos de `facts` en data/products.js.
 * Con `showCategory={false}` se oculta la columna de categoría (en la página
 * de una categoría sería redundante).
 */
export default function ProductTable({ products, showCategory = true, caption }) {
  const categoryName = (key) => CATEGORIES.find((c) => c.key === key)?.name ?? key;
  return (
    <div className="comparison-table-wrapper">
      <table className="comparison-table product-table">
        {caption && <caption>{caption}</caption>}
        <thead>
          <tr>
            <th scope="col">Producto</th>
            {showCategory && <th scope="col">Categoría</th>}
            <th scope="col">Estructura</th>
            <th scope="col">Medidas</th>
            <th scope="col">Uso</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.slug}>
              <th scope="row"><Link to={`/catalogo/${p.slug}/`}>{p.name}</Link></th>
              {showCategory && <td>{categoryName(p.category)}</td>}
              <td>{factOf(p, 'Estructura')}</td>
              <td>{factOf(p, 'Medidas')}</td>
              <td>{factOf(p, 'Uso')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
