/**
 * Firebase modular SDK — mucho más liviano que los -compat.js
 * (tree-shaking real: solo se empaqueta lo que importás)
 *
 * Las credenciales viven en firebaseConfig.js (junto con la guarda
 * isFirebaseConfigured, que las páginas consultan sin cargar este módulo).
 */
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { firebaseConfig } from './firebaseConfig';

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
