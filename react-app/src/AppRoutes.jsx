import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import { ROUTES } from './routes';

/**
 * AppRoutes — árbol de rutas compartido entre cliente y servidor.
 *
 * Recibe un mapa `components` con los componentes de página ya resueltos.
 * El cliente le pasa componentes envueltos en React.lazy(); el prerender
 * le pasa los módulos ya cargados (eager), porque renderToString() no
 * puede esperar a que un lazy() se resuelva.
 *
 * Al compartir este archivo, la estructura de rutas no puede divergir
 * entre el HTML estático y la app hidratada.
 */
export default function AppRoutes({ components }) {
  const NotFound = components.NotFound;

  return (
    <Routes>
      <Route element={<Layout />}>
        {ROUTES.map(({ path, page }) => {
          const Page = components[page];
          if (!Page) return null;
          return path === '/'
            ? <Route index key={path} element={<Page />} />
            : <Route key={path} path={path.slice(1)} element={<Page />} />;
        })}
        {NotFound && <Route path="*" element={<NotFound />} />}
      </Route>
    </Routes>
  );
}
