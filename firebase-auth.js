/**
 * TALLER KAPPA — firebase-auth.js
 * Autenticación con Firebase Auth (reemplaza el sistema JWT custom)
 */

'use strict';

const FireAuth = {
    /**
     * Registrar usuario nuevo
     */
    async register(name, email, password, phone) {
        const cred = await auth.createUserWithEmailAndPassword(email, password);
        await cred.user.updateProfile({ displayName: name });

        // Guardar datos extra en Firestore
        await db.collection('users').doc(cred.user.uid).set({
            name,
            email: email.toLowerCase(),
            phone: phone || '',
            active: true,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        });

        return {
            user: { id: cred.user.uid, name, email, phone },
            token: await cred.user.getIdToken(),
        };
    },

    /**
     * Login
     */
    async login(email, password) {
        const cred = await auth.signInWithEmailAndPassword(email, password);
        const token = await cred.user.getIdToken();
        return {
            user: {
                id: cred.user.uid,
                name: cred.user.displayName,
                email: cred.user.email,
            },
            token,
        };
    },

    /**
     * Logout
     */
    async logout() {
        await auth.signOut();
    },

    /**
     * Usuario actual
     */
    getCurrentUser() {
        const u = auth.currentUser;
        if (!u) return null;
        return { id: u.uid, name: u.displayName, email: u.email };
    },

    /**
     * Escuchar cambios de auth
     */
    onAuthChange(callback) {
        auth.onAuthStateChanged(callback);
    },
};

window.FireAuth = FireAuth;
