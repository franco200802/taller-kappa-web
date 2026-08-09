/**
 * TALLER KAPPA — fix-image-urls.js
 * Actualiza el campo `image` de los productos que todavía apuntan a los
 * PNG viejos (bkf1.png, bkfapoyapies.png) para que usen los JPEG nuevos.
 *
 * A diferencia de seed-firestore.js, este script NO borra nada: solo
 * hace update() sobre los docs de `productos` cuyo campo `image` matchea
 * uno de los nombres viejos. El resto de los productos, FAQs y
 * testimonios queda intacto.
 *
 * Requisitos:
 *   1. Descargar el Service Account JSON de Firebase Console
 *      (Configuración del proyecto → Cuentas de servicio → Generar nueva clave privada)
 *   2. Guardarlo como "serviceAccountKey.json" en la raíz del proyecto (no se commitea)
 *   3. Ejecutar: node fix-image-urls.js
 */

const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

// Mapa de imagen vieja → imagen nueva
const IMAGE_RENAMES = {
    'images/bkf1.png': 'images/bkf1.jpg',
    'images/bkfapoyapies.png': 'images/bkfapoyapies.jpg',
};

async function run() {
    try {
        console.log('🔥 Conectando a Firestore...');
        const snap = await db.collection('productos').get();

        if (snap.empty) {
            console.log('No hay productos en la colección. Nada para actualizar.');
            process.exit(0);
        }

        let updated = 0;
        for (const doc of snap.docs) {
            const data = doc.data();
            const newImage = IMAGE_RENAMES[data.image];
            if (newImage) {
                await doc.ref.update({ image: newImage });
                console.log(`✅ "${data.name || doc.id}": ${data.image} → ${newImage}`);
                updated++;
            }
        }

        if (updated === 0) {
            console.log('Ningún producto tenía las imágenes viejas. Nada para actualizar.');
        } else {
            console.log(`\n🎉 ${updated} producto(s) actualizado(s). El resto de la colección no se tocó.`);
        }
        process.exit(0);
    } catch (err) {
        console.error('❌ Falló la actualización:', err.message);
        process.exit(1);
    }
}

run();
