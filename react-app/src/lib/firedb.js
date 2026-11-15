/**
 * FireDB — capa de acceso a Firestore (equivalente al firebase-db.js viejo,
 * pero usando el SDK modular: import solo de las funciones que usás)
 */
import {
  collection, getDocs, doc, addDoc, updateDoc,
  query, where, orderBy, serverTimestamp,
} from 'firebase/firestore';
import { db } from './firebase';

const col = (name) => collection(db, name);

export const FireDB = {
  async getProducts(category) {
    let q = col('productos');
    if (category && category !== 'all') q = query(q, where('category', '==', category));
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  },

  async getFAQs() {
    const snap = await getDocs(query(col('faqs'), orderBy('order')));
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  },

  async getTestimonios() {
    const snap = await getDocs(col('testimonios'));
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  },

  // Solo los campos que aceptan las reglas (firestore.rules), recortados a su largo máximo:
  // un campo de más o un texto más largo haría que Firestore rechace el documento entero.
  async createContacto({ name = '', interest = '', zone = '', message = '' }) {
    const clip = (v, max) => String(v).trim().slice(0, max);
    return addDoc(col('contactos'), {
      name: clip(name, 100), interest: clip(interest, 100), zone: clip(zone, 100), message: clip(message, 2000),
      leido: false, createdAt: serverTimestamp(),
    });
  },

  async getContactos() {
    const snap = await getDocs(query(col('contactos'), orderBy('createdAt', 'desc')));
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  },

  async markContactoLeido(id) {
    return updateDoc(doc(db, 'contactos', id), { leido: true });
  },
};
