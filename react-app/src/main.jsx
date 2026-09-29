import { StrictMode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import App from './App.jsx';
import './styles/global.css';

// GitHub Pages sirve /index.html y /<ruta>/index.html con 200 (el mismo HTML
// que /<ruta>/), pero el router no tiene esas rutas: sin esto, al hidratar
// se renderizaba <NotFound> encima de la página (error #418) y Helmet le
// ponía noindex. Se limpia la URL antes de que el router lea la ubicación.
{
  const { pathname, search, hash } = window.location;
  if (pathname.endsWith('/index.html')) {
    window.history.replaceState(window.history.state, '', pathname.slice(0, -'index.html'.length) + search + hash);
  }
}

const container = document.getElementById('root');
const app = (
  <StrictMode>
    <App />
  </StrictMode>
);

// Las rutas públicas llegan con HTML ya renderizado por scripts/prerender.js.
// En ese caso hidratamos (conservamos el DOM existente); si el contenedor
// está vacío (404.html o dev server) montamos desde cero.
if (container.hasChildNodes()) {
  hydrateRoot(container, app);
} else {
  createRoot(container).render(app);
}
