import { StrictMode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import App from './App.jsx';
import './styles/global.css';

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
