/**
 * TALLER KAPPA — seed.js
 * Populates MongoDB with initial data from db.json
 * Run once: node seed.js
 */
require('dotenv').config();
const mongoose = require('mongoose');
const { Product, FAQ, Testimonio } = require('./models');

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
        { icon: 'fas fa-building',      question: '¿Venden a empresas y locales?', answer: 'Sí, trabajamos con locales gastronómicos de primera línea, franquicias (Burger King, McDonald\'s) y marcas de indumentaria como Sandro. Emitimos Factura A.', order: 1 },
        { icon: 'fas fa-truck',          question: '¿Hacen envíos al interior?', answer: 'Sí, realizamos envíos a todo el país mediante expreso. Embalaje bonificado para asegurar que el producto llegue en perfectas condiciones.', order: 2 },
        { icon: 'far fa-clock',          question: '¿Cuál es el tiempo de demora?', answer: 'Los tiempos de entrega dependen del stock disponible y del volumen del pedido. Consultanos para coordinar una fecha exacta.', order: 3 },
        { icon: 'fas fa-paint-roller',   question: '¿Puedo elegir el color de pintura?', answer: 'Absolutamente. Ofrecemos acabados en pintura epoxi (negro mate, blanco, colores a pedido) y cromado.', order: 4 },
    ],
    testimonios: [
        { stars: 5, text: 'Equipamos nuestro local de YPF Full con las Bases Flat de Taller Kappa. Soportan el alto tránsito sin problemas.', author: 'Franquicia YPF Full' },
        { stars: 5, text: 'Necesitábamos reposición rápida para el salón. La calidad del hierro es excelente y cumplieron con los tiempos pactados.', author: 'Local Gastronómico (Shell Select)' },
        { stars: 5, text: 'Excelente atención de Francisco. Me asesoró con las medidas para mi mesa y quedó pintada en el comedor.', author: 'Ricardo L. (Particular)' },
    ],
};

async function seed() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        // Clear existing data
        await Promise.all([Product.deleteMany(), FAQ.deleteMany(), Testimonio.deleteMany()]);
        console.log('🗑️  Cleared old data');

        // Insert
        const products    = await Product.insertMany(SEED_DATA.productos);
        const faqs        = await FAQ.insertMany(SEED_DATA.faqs);
        const testimonios = await Testimonio.insertMany(SEED_DATA.testimonios);

        console.log(`📦 ${products.length} products inserted`);
        console.log(`❓ ${faqs.length} FAQs inserted`);
        console.log(`⭐ ${testimonios.length} testimonials inserted`);
        console.log('\n🎉 Database seeded successfully!');

        process.exit(0);
    } catch (err) {
        console.error('❌ Seed failed:', err.message);
        process.exit(1);
    }
}

seed();
