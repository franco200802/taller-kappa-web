/**
 * TALLER KAPPA — firebase-db.js
 * Funciones para interactuar con Firestore (reemplaza las llamadas a Express API)
 * Se usa directamente desde el frontend sin necesidad de backend.
 */

'use strict';

const FireDB = {
    /* ================================================================
       PRODUCTOS
       ================================================================ */
    async getProducts(category) {
        let query = db.collection('productos');
        if (category && category !== 'all') {
            query = query.where('category', '==', category);
        }
        const snap = await query.get();
        return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    },

    async getProduct(id) {
        const doc = await db.collection('productos').doc(id).get();
        if (!doc.exists) return null;
        return { id: doc.id, ...doc.data() };
    },

    async createProduct(data) {
        const ref = await db.collection('productos').add({
            ...data,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        });
        return { id: ref.id, ...data };
    },

    async updateProduct(id, data) {
        await db.collection('productos').doc(id).update({
            ...data,
            updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
        });
        return { id, ...data };
    },

    async deleteProduct(id) {
        await db.collection('productos').doc(id).delete();
    },

    /* ================================================================
       FAQs
       ================================================================ */
    async getFAQs() {
        const snap = await db.collection('faqs').orderBy('order').get();
        return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    },

    /* ================================================================
       TESTIMONIOS
       ================================================================ */
    async getTestimonios() {
        const snap = await db.collection('testimonios').get();
        return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    },

    /* ================================================================
       CONTACTOS
       ================================================================ */
    async createContacto(data) {
        const ref = await db.collection('contactos').add({
            ...data,
            leido: false,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        });
        return { id: ref.id, ...data };
    },

    async getContactos() {
        const snap = await db.collection('contactos').orderBy('createdAt', 'desc').get();
        return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    },

    /* ================================================================
       ÓRDENES
       ================================================================ */
    async createOrder(orderData) {
        const ref = await db.collection('orders').add({
            ...orderData,
            status: 'pending',
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        });
        return { id: ref.id, ...orderData };
    },

    async getOrder(id) {
        const doc = await db.collection('orders').doc(id).get();
        if (!doc.exists) return null;
        return { id: doc.id, ...doc.data() };
    },

    async getOrders(status) {
        let query = db.collection('orders').orderBy('createdAt', 'desc');
        if (status) query = query.where('status', '==', status);
        const snap = await query.get();
        return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    },

    async getOrdersByEmail(email) {
        const snap = await db.collection('orders')
            .where('buyer.email', '==', email)
            .orderBy('createdAt', 'desc')
            .get();
        return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    },

    async updateOrder(id, data) {
        await db.collection('orders').doc(id).update({
            ...data,
            updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
        });
    },

    /* ================================================================
       STATS (Admin)
       ================================================================ */
    async getStats() {
        const allSnap = await db.collection('orders').get();
        let total = 0, approved = 0, pending = 0, revenue = 0;
        allSnap.forEach(doc => {
            const d = doc.data();
            total++;
            if (d.status === 'approved') { approved++; revenue += d.total || 0; }
            if (d.status === 'pending') pending++;
        });
        return { total, approved, pending, revenue };
    },

    /* ================================================================
       USUARIOS (admin list)
       ================================================================ */
    async getUsers() {
        const snap = await db.collection('users').orderBy('createdAt', 'desc').get();
        return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    },
};

// Exportar globalmente
window.FireDB = FireDB;
