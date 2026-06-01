/**
 * TALLER KAPPA — firebase-config.js
 * Configuración de Firebase (Firestore + Auth)
 * 
 * IMPORTANTE: Reemplazá los valores con los de tu proyecto Firebase.
 * Los obtenés desde: Firebase Console → Configuración → General → Tu app web
 */

// Firebase SDKs via CDN (se cargan en el HTML)
// Este archivo solo exporta la config y las instancias

const firebaseConfig = {
    apiKey: "REEMPLAZAR_CON_TU_API_KEY",
    authDomain: "REEMPLAZAR.firebaseapp.com",
    projectId: "REEMPLAZAR",
    storageBucket: "REEMPLAZAR.appspot.com",
    messagingSenderId: "REEMPLAZAR",
    appId: "REEMPLAZAR"
};

// Inicializar Firebase
firebase.initializeApp(firebaseConfig);

// Instancias globales
const db = firebase.firestore();
const auth = firebase.auth();

console.log('🔥 Firebase initialized');
