/**
 * TALLER KAPPA — seed-firestore.js
 * Script para poblar Firestore con los datos iniciales.
 * Se ejecuta UNA sola vez: node seed-firestore.js
 * 
 * Requisitos:
 *   1. Descargar el Service Account JSON de Firebase Console
 *   2. Guardarlo como "serviceAccountKey.json" en la raíz del proyecto
 *   3. Ejecutar: node seed-firestore.js
 */

const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

const SEED_DATA = {
    productos: [
        {
            name: 'Sillón BKF Premium',
            category: 'asientos',
            image: 'images/bkf1.png',
            badge: 'Más vendido',
            stock: true,
            price: 280000,
            priceFrom: 'Desde $280.000',
            desc: 'Icono del diseño argentino. Estructura maciza indeformable de 12mm. Incluye funda de cuero vacuno seleccionado.',
            specs: ['Hierro redondo macizo 12mm', 'Cuero Vacuno de 1ra', 'Pintura Epoxi o Cromado', 'Medidas: 78x70x90 cm'],
            colors: ['Negro Mate', 'Blanco Crema', 'Cromado', 'Verde Oliva', 'Rojo Kappa'],
        },
        {
            name: 'Banco BKF',
            category: 'asientos',
            image: 'images/bkfapoyapies.png',
            badge: 'Ideal para regalo',
            stock: true,
            price: 140000,
            priceFrom: 'Desde $140.000',
            desc: 'El complemento ideal de diseño. Versatilidad y resistencia en tamaño compacto, siguiendo la línea BKF.',
            specs: ['Hierro macizo 12mm', 'Altura 45cm', 'Ideal pie de cama o auxiliar', 'Medidas: 38x38x45 cm'],
            colors: ['Negro Mate', 'Blanco Crema', 'Cromado'],
        },
        {
            name: 'Base de Mesa Flat',
            category: 'mesas',
            image: 'images/mesa.jpeg',
            badge: 'Uso gastronómico',
            stock: true,
            price: 95000,
            priceFrom: 'Desde $95.000',
            desc: 'Estabilidad garantizada para uso gastronómico intenso. Base de chapa torneada pesada que evita el balanceo.',
            specs: ['Base chapa torneada 10mm', 'Columna central 77/101mm', 'Alturas: 73cm (Mesa) / 105cm (Barra)', 'Apta tapas grandes'],
            colors: ['Negro Mate', 'Blanco Crema', 'Cromado'],
        },
    ],
    faqs: [
        { icon: 'fas fa-building', question: '¿Venden a empresas y locales?', answer: 'Sí, trabajamos con locales gastronómicos de primera línea, franquicias (Burger King, McDonald\'s) y marcas de indumentaria como Sandro. Emitimos Factura A.', order: 1 },
        { icon: 'fas fa-truck', question: '¿Hacen envíos al interior?', answer: 'Sí, realizamos envíos a todo el país mediante expreso. Embalaje bonificado para asegurar que el producto llegue en perfectas condiciones.', order: 2 },
        { icon: 'far fa-clock', question: '¿Cuál es el tiempo de demora?', answer: 'Los tiempos de entrega dependen del stock disponible y del volumen del pedido. Consultanos para coordinar una fecha exacta.', order: 3 },
        { icon: 'fas fa-paint-roller', question: '¿Puedo elegir el color de pintura?', answer: 'Absolutamente. Ofrecemos acabados en pintura epoxi (negro mate, blanco, colores a pedido) y cromado.', order: 4 },
    ],
    testimonios: [
        { stars: 5, text: 'Equipamos nuestro local de YPF Full con las Bases Flat de Taller Kappa. Soportan el alto tránsito sin problemas.', author: 'Franquicia YPF Full' },
        { stars: 5, text: 'Necesitábamos reposición rápida para el salón. La calidad del hierro es excelente y cumplieron con los tiempos pactados.', author: 'Local Gastronómico (Shell Select)' },
        { stars: 5, text: 'Excelente atención de Francisco. Me asesoró con las medidas para mi mesa y quedó pintada en el comedor.', author: 'Ricardo L. (Particular)' },
    ],
};

async function seed() {
    try {
        console.log('🔥 Conectando a Firestore...');

        // Limpiar colecciones existentes
        for (const col of ['productos', 'faqs', 'testimonios']) {
            const snap = await db.collection(col).get();
            const batch = db.batch();
            snap.docs.forEach(doc => batch.delete(doc.ref));
            await batch.commit();
        }
        console.log('🗑️  Colecciones limpiadas');

        // Insertar productos
        for (const prod of SEED_DATA.productos) {
            await db.collection('productos').add(prod);
        }
        console.log(`📦 ${SEED_DATA.productos.length} productos insertados`);

        // Insertar FAQs
        for (const faq of SEED_DATA.faqs) {
            await db.collection('faqs').add(faq);
        }
        console.log(`❓ ${SEED_DATA.faqs.length} FAQs insertadas`);

        // Insertar testimonios
        for (const test of SEED_DATA.testimonios) {
            await db.collection('testimonios').add(test);
        }
        console.log(`⭐ ${SEED_DATA.testimonios.length} testimonios insertados`);

        console.log('\n🎉 Firestore seeded successfully!');
        process.exit(0);
    } catch (err) {
        console.error('❌ Seed failed:', err.message);
        process.exit(1);
    }
}

seed();
