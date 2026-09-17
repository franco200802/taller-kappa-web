/**
 * FireDB — capa de acceso a Firestore (equivalente al firebase-db.js viejo,
 * pero usando el SDK modular: import solo de las funciones que usás)
 */
import {
  collection, getDocs, getDoc, doc, addDoc, updateDoc,
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

  async getProduct(id) {
    const snap = await getDoc(doc(db, 'productos', id));
    return snap.exists() ? { id: snap.id, ...snap.data() } : null;
  },

  async getFAQs() {
    const snap = await getDocs(query(col('faqs'), orderBy('order')));
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  },

  async getTestimonios() {
    const snap = await getDocs(col('testimonios'));
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  },

  async createContacto(data) {
    return addDoc(col('contactos'), { ...data, leido: false, createdAt: serverTimestamp() });
  },

  async getContactos() {
    const snap = await getDocs(query(col('contactos'), orderBy('createdAt', 'desc')));
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  },

  async getOrders() {
    const snap = await getDocs(query(col('orders'), orderBy('createdAt', 'desc')));
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  },

  async updateOrder(id, data) {
    return updateDoc(doc(db, 'orders', id), { ...data, updatedAt: serverTimestamp() });
  },

  async getUsers() {
    const snap = await getDocs(col('users'));
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  },
};
