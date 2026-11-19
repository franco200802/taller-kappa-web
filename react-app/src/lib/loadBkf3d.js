/**
 * Descarga el módulo del sillón 3D (three.js, ~144 kB gzip) en su propio chunk. Vive aparte de los componentes
 * para que estos solo exporten componentes (Fast Refresh) y para que la galería pueda adelantar la descarga al
 * pasar el mouse por la miniatura. El navegador lo descarga una sola vez aunque se llame varias.
 */
export const loadBkf3d = () => import('./bkf3d');
