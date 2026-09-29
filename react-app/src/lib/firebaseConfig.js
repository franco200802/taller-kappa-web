/**
 * Configuración de Firebase + guarda para no cargarlo mientras no exista.
 *
 * Este módulo NO importa el SDK: es liviano a propósito, para que las
 * páginas puedan preguntar si Firebase está configurado sin descargar
 * el chunk de Firebase (~450 kB, ~105 kB gzip).
 */

// TODO: reemplazar con las credenciales reales del proyecto Firebase
// (Firebase Console → Configuración del proyecto → Tus apps → SDK config)
export const firebaseConfig = {
  apiKey: 'REEMPLAZAR_CON_TU_API_KEY',
  authDomain: 'REEMPLAZAR.firebaseapp.com',
  projectId: 'REEMPLAZAR',
  storageBucket: 'REEMPLAZAR.appspot.com',
  messagingSenderId: 'REEMPLAZAR',
  appId: 'REEMPLAZAR',
};

export const isFirebaseConfigured = !firebaseConfig.apiKey.startsWith('REEMPLAZAR');

/**
 * Carga la capa de Firestore bajo demanda. Con credenciales placeholder
 * rechaza sin descargar nada: antes Catálogo, FAQ, Nosotros y Contacto
 * bajaban el SDK en cada visita solo para que sus pedidos fallaran.
 */
export function loadFireDB() {
  if (!isFirebaseConfigured) return Promise.reject(new Error('firebase_sin_configurar'));
  return import('./firedb').then((m) => m.FireDB);
}
