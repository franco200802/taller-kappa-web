/**
 * TALLER KAPPA — server.js
 * Backend simple con Express + base de datos en db.json
 * Ejecutar: node server.js
 * API disponible en: http://localhost:3000/api/...
 */

const express  = require('express');
const cors     = require('cors');
const fs       = require('fs');
const path     = require('path');

const app  = express();
const PORT = process.env.PORT || 3000;
const DB   = path.join(__dirname, 'db.json');

/* ---- Middleware ---- */
app.use(cors());
app.use(express.json());

// Servir archivos estáticos (HTML, CSS, JS, imágenes) desde la raíz del proyecto
app.use(express.static(__dirname));

/* ---- Helpers ---- */
function readDB() {
    return JSON.parse(fs.readFileSync(DB, 'utf8'));
}

function writeDB(data) {
    fs.writeFileSync(DB, JSON.stringify(data, null, 2), 'utf8');
}

/* ================================================================
   PRODUCTOS
   ================================================================ */

// GET /api/productos          → todos los productos
// GET /api/productos?category=asientos  → filtrados por categoría
app.get('/api/productos', (req, res) => {
    const { category } = req.query;
    let { productos } = readDB();

    if (category && category !== 'all') {
        productos = productos.filter(p => p.category === category);
    }

    res.json(productos);
});

// GET /api/productos/:id      → un producto específico
app.get('/api/productos/:id', (req, res) => {
    const { productos } = readDB();
    const product = productos.find(p => p.id === parseInt(req.params.id));

    if (!product) return res.status(404).json({ error: 'Producto no encontrado' });
    res.json(product);
});

// POST /api/productos         → crear nuevo producto (admin)
app.post('/api/productos', (req, res) => {
    const db = readDB();
    const newProduct = {
        id: Date.now(),
        ...req.body
    };
    db.productos.push(newProduct);
    writeDB(db);
    res.status(201).json(newProduct);
});

// PUT /api/productos/:id      → actualizar producto
app.put('/api/productos/:id', (req, res) => {
    const db = readDB();
    const idx = db.productos.findIndex(p => p.id === parseInt(req.params.id));

    if (idx === -1) return res.status(404).json({ error: 'Producto no encontrado' });

    db.productos[idx] = { ...db.productos[idx], ...req.body };
    writeDB(db);
    res.json(db.productos[idx]);
});

// DELETE /api/productos/:id   → eliminar producto
app.delete('/api/productos/:id', (req, res) => {
    const db = readDB();
    const idx = db.productos.findIndex(p => p.id === parseInt(req.params.id));

    if (idx === -1) return res.status(404).json({ error: 'Producto no encontrado' });

    const deleted = db.productos.splice(idx, 1)[0];
    writeDB(db);
    res.json({ message: 'Producto eliminado', producto: deleted });
});

/* ================================================================
   FAQs
   ================================================================ */

// GET /api/faqs
app.get('/api/faqs', (req, res) => {
    const { faqs } = readDB();
    res.json(faqs);
});

// POST /api/faqs
app.post('/api/faqs', (req, res) => {
    const db = readDB();
    const newFaq = { id: Date.now(), ...req.body };
    db.faqs.push(newFaq);
    writeDB(db);
    res.status(201).json(newFaq);
});

// PUT /api/faqs/:id
app.put('/api/faqs/:id', (req, res) => {
    const db = readDB();
    const idx = db.faqs.findIndex(f => f.id === parseInt(req.params.id));
    if (idx === -1) return res.status(404).json({ error: 'FAQ no encontrada' });
    db.faqs[idx] = { ...db.faqs[idx], ...req.body };
    writeDB(db);
    res.json(db.faqs[idx]);
});

// DELETE /api/faqs/:id
app.delete('/api/faqs/:id', (req, res) => {
    const db = readDB();
    const idx = db.faqs.findIndex(f => f.id === parseInt(req.params.id));
    if (idx === -1) return res.status(404).json({ error: 'FAQ no encontrada' });
    const deleted = db.faqs.splice(idx, 1)[0];
    writeDB(db);
    res.json({ message: 'FAQ eliminada', faq: deleted });
});

/* ================================================================
   TESTIMONIOS
   ================================================================ */

// GET /api/testimonios
app.get('/api/testimonios', (req, res) => {
    const { testimonios } = readDB();
    res.json(testimonios);
});

/* ================================================================
   CONTACTOS (formulario de la web)
   ================================================================ */

// GET /api/contactos          → ver todos los mensajes recibidos
app.get('/api/contactos', (req, res) => {
    const { contactos } = readDB();
    res.json(contactos);
});

// POST /api/contactos         → guardar nuevo mensaje del formulario
app.post('/api/contactos', (req, res) => {
    const { name, interest, message } = req.body;

    if (!name || !message) {
        return res.status(400).json({ error: 'Nombre y mensaje son obligatorios' });
    }

    const db = readDB();
    const newContact = {
        id: Date.now(),
        name,
        interest: interest || 'Consulta general',
        message,
        fecha: new Date().toLocaleString('es-AR', { timeZone: 'America/Argentina/Buenos_Aires' }),
        leido: false
    };

    db.contactos.push(newContact);
    writeDB(db);

    res.status(201).json({ message: 'Mensaje guardado correctamente', contacto: newContact });
});

// PATCH /api/contactos/:id/leido  → marcar como leído
app.patch('/api/contactos/:id/leido', (req, res) => {
    const db = readDB();
    const contacto = db.contactos.find(c => c.id === parseInt(req.params.id));
    if (!contacto) return res.status(404).json({ error: 'Contacto no encontrado' });
    contacto.leido = true;
    writeDB(db);
    res.json(contacto);
});

// DELETE /api/contactos/:id   → eliminar mensaje
app.delete('/api/contactos/:id', (req, res) => {
    const db = readDB();
    const idx = db.contactos.findIndex(c => c.id === parseInt(req.params.id));
    if (idx === -1) return res.status(404).json({ error: 'Contacto no encontrado' });
    db.contactos.splice(idx, 1);
    writeDB(db);
    res.json({ message: 'Contacto eliminado' });
});

/* ================================================================
   INICIO
   ================================================================ */
app.listen(PORT, () => {
    console.log('');
    console.log('  ╔══════════════════════════════════════╗');
    console.log('  ║   🔩  TALLER KAPPA — Backend        ║');
    console.log(`  ║   Servidor corriendo en              ║`);
    console.log(`  ║   http://localhost:${PORT}             ║`);
    console.log('  ╠══════════════════════════════════════╣');
    console.log('  ║   ENDPOINTS DISPONIBLES:             ║');
    console.log(`  ║   GET  /api/productos                ║`);
    console.log(`  ║   GET  /api/faqs                     ║`);
    console.log(`  ║   GET  /api/testimonios              ║`);
    console.log(`  ║   POST /api/contactos                ║`);
    console.log('  ╚══════════════════════════════════════╝');
    console.log('');
});
