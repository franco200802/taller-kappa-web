import { lazy, Suspense, useMemo } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { CartProvider } from './context/CartContext';
import AppRoutes from './AppRoutes';
import { PAGE_LOADERS } from './routes';

// Code-splitting: cada página sigue siendo un chunk aparte en el cliente.
// Los loaders vienen de routes.js para no duplicar la lista de páginas.
const lazyComponents = Object.fromEntries(
  Object.entries(PAGE_LOADERS).map(([name, loader]) => [name, lazy(loader)])
);

export default function App() {
  const components = useMemo(() => lazyComponents, []);

  return (
    <HelmetProvider>
      <CartProvider>
        <BrowserRouter>
          <Suspense fallback={<div style={{ minHeight: '60vh' }} />}>
            <AppRoutes components={components} />
          </Suspense>
        </BrowserRouter>
      </CartProvider>
    </HelmetProvider>
  );
}
