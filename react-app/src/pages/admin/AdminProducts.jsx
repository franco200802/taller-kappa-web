import { CATEGORIES, PRODUCTS, factOf, productHref } from '../../data/products';

/**
 * Productos, solo lectura. No se editan desde el panel a propósito: `data/products.js` es la
 * fuente única de la que salen el HTML prerenderizado de cada ficha, el sitemap, `llms.txt`
 * y el JSON-LD de Product. Un producto editado en una base de datos cambiaría lo que ve el
 * visitante sin cambiar lo que leen Google y los asistentes de IA (que es lo que pasaba con
 * la lectura de Firestore que se quitó). Cambiar un producto es editar ese archivo y publicar.
 */
export default function AdminProducts() {
  const categoryName = (key) => CATEGORIES.find((c) => c.key === key)?.name ?? key;
  return (
    <div className="admin-products">
      <p className="admin-notice">
        Los productos se cargan en el código (<code>react-app/src/data/products.js</code>), no acá: de ese archivo salen
        las fichas que indexa Google, el sitemap y los datos estructurados. Para cambiar uno, se edita ese archivo y se publica el sitio.
      </p>
      <div className="comparison-table-wrapper">
        <table className="comparison-table product-table">
          <caption className="visually-hidden">Productos publicados en el sitio</caption>
          <thead>
            <tr><th scope="col">Producto</th><th scope="col">Categoría</th><th scope="col">Medidas</th><th scope="col">Precio publicado</th></tr>
          </thead>
          <tbody>
            {PRODUCTS.map((p) => (
              <tr key={p.slug}>
                <th scope="row"><a href={productHref(p)} target="_blank" rel="noopener noreferrer">{p.name}</a></th>
                <td>{categoryName(p.category)}</td>
                <td>{factOf(p, 'Medidas')}</td>
                <td>{p.price?.amount ? `$ ${p.price.amount}` : 'No (se cotiza por WhatsApp)'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
