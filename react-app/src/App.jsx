import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { CartProvider } from './context/CartContext';
import Layout from './components/Layout';

const Home = lazy(() => import('./pages/Home'));
const Catalogo = lazy(() => import('./pages/Catalogo'));
const SillonBKF = lazy(() => import('./pages/SillonBKF'));
const Proyectos = lazy(() => import('./pages/Proyectos'));
const Nosotros = lazy(() => import('./pages/Nosotros'));
const FAQ = lazy(() => import('./pages/FAQ'));
const Contacto = lazy(() => import('./pages/Contacto'));
const Envios = lazy(() => import('./pages/Envios'));
const Garantia = lazy(() => import('./pages/Garantia'));
const Admin = lazy(() => import('./pages/Admin'));
const NotFound = lazy(() => import('./pages/NotFound'));

export default function App() {
  return (
    <HelmetProvider>
      <CartProvider>
        <BrowserRouter>
          <Suspense fallback={<div style={{ minHeight: '60vh' }} />}>
            <Routes>
              <Route element={<Layout />}>
                <Route index element={<Home />} />
                <Route path="catalogo" element={<Catalogo />} />
                <Route path="sillon-bkf" element={<SillonBKF />} />
                <Route path="proyectos" element={<Proyectos />} />
                <Route path="nosotros" element={<Nosotros />} />
                <Route path="faq" element={<FAQ />} />
                <Route path="contacto" element={<Contacto />} />
                <Route path="envios" element={<Envios />} />
                <Route path="garantia" element={<Garantia />} />
                <Route path="admin" element={<Admin />} />
                <Route path="*" element={<NotFound />} />
              </Route>
            </Routes>
          </Suspense>
        </BrowserRouter>
      </CartProvider>
    </HelmetProvider>
  );
}
