import { lazy, useMemo } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { CartProvider } from './context/CartContext';
import AppRoutes from './AppRoutes';
import { PAGE_LOADERS } from './routes';

// Code-splitting: cada página sigue siendo un chunk aparte en el cliente.
// Los loaders vienen de routes.js para no duplicar la lista de páginas.
// El <Suspense> que las espera está en Layout.jsx (ver el comentario ahí).
const lazyComponents = Object.fromEntries(
  Object.entries(PAGE_LOADERS).map(([name, loader]) => [name, lazy(loader)])
);

export default function App() {
  const components = useMemo(() => lazyComponents, []);

  return (
    <HelmetProvider>
      <CartProvider>
        {/* v7_startTransition: al navegar a una página cuyo chunk todavía no
            se descargó, se sigue mostrando la página actual en vez del
            fallback vacío del Suspense. Además adelanta el comportamiento
            de react-router v7 y silencia sus avisos en consola. */}
        <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <AppRoutes components={components} />
        </BrowserRouter>
      </CartProvider>
    </HelmetProvider>
  );
}
