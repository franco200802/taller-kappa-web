/**
 * Firebase modular SDK — mucho más liviano que los -compat.js
 * (tree-shaking real: solo se empaqueta lo que importás)
 */
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// TODO: reemplazar con las credenciales reales del proyecto Firebase
// (Firebase Console → Configuración del proyecto → Tus apps → SDK config)
const firebaseConfig = {
  apiKey: 'REEMPLAZAR_CON_TU_API_KEY',
  authDomain: 'REEMPLAZAR.firebaseapp.com',
  projectId: 'REEMPLAZAR',
  storageBucket: 'REEMPLAZAR.appspot.com',
  messagingSenderId: 'REEMPLAZAR',
  appId: 'REEMPLAZAR',
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
