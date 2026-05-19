/**
 * TALLER KAPPA — server.js v2
 * Express + MongoDB + MercadoPago
 *
 * Setup:
 *   1. Create free MongoDB Atlas cluster → get connection string
 *   2. Create MercadoPago app → get access token
 *   3. Copy .env.example → .env, fill in values
 *   4. npm install
 *   5. node seed.js  (once, to populate DB)
 *   6. node server.js
 */

// Only load .env file in local development (Render injects env vars directly)
const path = require('path');
const fs = require('fs');
if (fs.existsSync(path.join(__dirname, '.env'))) {
    require('dotenv').config();
}
const express  = require('express');
const cors     = require('cors');
const mongoose = require('mongoose');
const { MercadoPagoConfig, Preference, Payment } = require('mercadopago');
const bcrypt = require('bcryptjs');
const { Product, FAQ, Testimonio, Contacto, Order, User } = require('./models');

const app  = express();
const PORT = process.env.PORT || 3000;

/* ---- Middleware ---- */
app.use(cors({ origin: process.env.FRONTEND_URL || '*' }));
app.use(express.json());
app.use(express.static(__dirname));

/* ---- MongoDB ---- */
const MONGO_URI = process.env.MONGODB_URI;
console.log('🔗 MongoDB URI:', MONGO_URI ? MONGO_URI.substring(0, 30) + '...' : '❌ NOT SET');
mongoose.connect(MONGO_URI)
    .then(() => console.log('✅ MongoDB connected'))
    .catch(err => console.error('❌ MongoDB failed:', err.message));

/* ---- MercadoPago ---- */
const mpClient = new MercadoPagoConfig({
    accessToken: process.env.MP_ACCESS_TOKEN || '',
});

/* ================================================================
   PRODUCTS
   ================================================================ */
app.get('/api/productos', async (req, res) => {
    try {
        const filter = req.query.category && req.query.category !== 'all'
            ? { category: req.query.category } : {};
        const productos = await Product.find(filter).lean();
        res.json(productos.map(p => ({ ...p, id: p._id })));
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/productos/:id', async (req, res) => {
    try {
        const p = await Product.findById(req.params.id).lean();
        if (!p) return res.status(404).json({ error: 'No encontrado' });
        res.json({ ...p, id: p._id });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/productos', async (req, res) => {
    try {
        const p = await Product.create(req.body);
        res.status(201).json({ ...p.toObject(), id: p._id });
    } catch (err) { res.status(400).json({ error: err.message }); }
});

app.put('/api/productos/:id', async (req, res) => {
    try {
        const p = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true }).lean();
        if (!p) return res.status(404).json({ error: 'No encontrado' });
        res.json({ ...p, id: p._id });
    } catch (err) { res.status(400).json({ error: err.message }); }
});

app.delete('/api/productos/:id', async (req, res) => {
    try {
        const p = await Product.findByIdAndDelete(req.params.id);
        if (!p) return res.status(404).json({ error: 'No encontrado' });
        res.json({ message: 'Eliminado' });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

/* ================================================================
   FAQs + TESTIMONIOS
   ================================================================ */
app.get('/api/faqs', async (req, res) => {
    try { res.json(await FAQ.find().sort('order').lean()); }
    catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/testimonios', async (req, res) => {
    try { res.json(await Testimonio.find().lean()); }
    catch (err) { res.status(500).json({ error: err.message }); }
});

/* ================================================================
   CONTACTOS
   ================================================================ */
app.post('/api/contactos', async (req, res) => {
    try { res.status(201).json(await Contacto.create(req.body)); }
    catch (err) { res.status(400).json({ error: err.message }); }
});

app.get('/api/contactos', async (req, res) => {
    try { res.json(await Contacto.find().sort('-createdAt').lean()); }
    catch (err) { res.status(500).json({ error: err.message }); }
});

/* ================================================================
   CHECKOUT — MercadoPago
   ================================================================ */
app.post('/api/checkout', async (req, res) => {
    try {
        const { items, buyer } = req.body;
        if (!items?.length) return res.status(400).json({ error: 'Carrito vacío' });

        // Validate products & build order
        const validatedItems = [];
        let total = 0;
        for (const item of items) {
            const product = await Product.findById(item.productId);
            if (!product) return res.status(400).json({ error: `Producto no encontrado: ${item.name}` });
            validatedItems.push({
                productId: product._id,
                name: product.name,
                color: item.color || 'Negro Mate',
                qty: item.qty,
                unitPrice: product.price,
            });
            total += product.price * item.qty;
        }

        // Save order
        const order = await Order.create({ items: validatedItems, total, buyer: buyer || {}, status: 'pending' });

        // Create MP preference
        const FRONT = process.env.FRONTEND_URL || `http://localhost:${PORT}`;
        const preference = new Preference(mpClient);
        const mpPref = await preference.create({ body: {
            items: validatedItems.map(i => ({
                title: `${i.name} (${i.color})`,
                quantity: i.qty,
                unit_price: i.unitPrice,
                currency_id: 'ARS',
            })),
            payer: buyer && buyer.email ? { email: buyer.email } : { email: 'comprador@tallerkappa.com.ar' },
            back_urls: {
                success: `${FRONT}/checkout-result.html?status=approved&order=${order._id}`,
                failure: `${FRONT}/checkout-result.html?status=rejected&order=${order._id}`,
                pending: `${FRONT}/checkout-result.html?status=pending&order=${order._id}`,
            },
            auto_return: 'approved',
            external_reference: order._id.toString(),
        }});

        order.mpPreferenceId = mpPref.id;
        await order.save();

        res.json({
            preferenceId: mpPref.id,
            initPoint: mpPref.init_point,
            sandboxInitPoint: mpPref.sandbox_init_point,
            orderId: order._id,
        });
    } catch (err) {
        console.error('Checkout error:', err);
        res.status(500).json({ error: err.message });
    }
});

/* Order status */
app.get('/api/orders/:id', async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).lean();
        if (!order) return res.status(404).json({ error: 'Orden no encontrada' });
        res.json(order);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

/* MercadoPago webhook */
app.post('/api/webhooks/mercadopago', async (req, res) => {
    try {
        if (req.body.type === 'payment') {
            const payment = new Payment(mpClient);
            const pd = await payment.get({ id: req.body.data.id });
            const order = await Order.findById(pd.external_reference);
            if (order) {
                order.status = pd.status;
                order.mpPaymentId = pd.id.toString();
                await order.save();
                console.log(`💰 Order ${order._id} → ${order.status}`);
            }
        }
        res.sendStatus(200);
    } catch (err) {
        console.error('Webhook error:', err.message);
        res.sendStatus(200);
    }
});

/* ================================================================
   USUARIOS — Registro, Login, Perfil
   ================================================================ */
app.post('/api/users/register', async (req, res) => {
    try {
        const { name, email, password, phone } = req.body;
        if (!name || !email || !password) return res.status(400).json({ error: 'Nombre, email y contraseña son obligatorios' });
        if (password.length < 6) return res.status(400).json({ error: 'La contraseña debe tener al menos 6 caracteres' });
        const existing = await User.findOne({ email: email.toLowerCase() });
        if (existing) return res.status(409).json({ error: 'Ya existe una cuenta con ese email' });
        const hash = await bcrypt.hash(password, 10);
        const user = await User.create({ name, email, password: hash, phone: phone || '' });
        const token = require('jsonwebtoken').sign({ userId: user._id, email: user.email }, JWT_SECRET, { expiresIn: '30d' });
        res.status(201).json({ token, user: { id: user._id, name: user.name, email: user.email, phone: user.phone } });
    } catch (err) { res.status(400).json({ error: err.message }); }
});

app.post('/api/users/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) return res.status(400).json({ error: 'Email y contraseña requeridos' });
        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user || !user.active) return res.status(401).json({ error: 'Email o contraseña incorrectos' });
        const ok = await bcrypt.compare(password, user.password);
        if (!ok) return res.status(401).json({ error: 'Email o contraseña incorrectos' });
        const token = require('jsonwebtoken').sign({ userId: user._id, email: user.email }, JWT_SECRET, { expiresIn: '30d' });
        res.json({ token, user: { id: user._id, name: user.name, email: user.email, phone: user.phone } });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/users/me', async (req, res) => {
    try {
        const token = req.headers.authorization?.replace('Bearer ', '');
        if (!token) return res.status(401).json({ error: 'No autorizado' });
        const { userId } = require('jsonwebtoken').verify(token, JWT_SECRET);
        const user = await User.findById(userId).select('-password').lean();
        if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });
        res.json({ id: user._id, name: user.name, email: user.email, phone: user.phone });
    } catch { res.status(401).json({ error: 'Token inválido' }); }
});

app.get('/api/users/my-orders', async (req, res) => {
    try {
        const token = req.headers.authorization?.replace('Bearer ', '');
        if (!token) return res.status(401).json({ error: 'No autorizado' });
        const { userId } = require('jsonwebtoken').verify(token, JWT_SECRET);
        const user = await User.findById(userId).lean();
        if (!user) return res.status(401).json({ error: 'Usuario no encontrado' });
        const orders = await Order.find({ 'buyer.email': user.email }).sort('-createdAt').lean();
        res.json(orders);
    } catch { res.status(401).json({ error: 'Token inválido' }); }
});

/* ================================================================
   ADMIN — Lista de usuarios registrados
   ================================================================ */
app.get('/api/admin/users', authMiddleware, async (req, res) => {
    try {
        const users = await User.find().select('-password').sort('-createdAt').lean();
        res.json(users);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

/* ================================================================
   ADMIN AUTH & ORDERS
   ================================================================ */
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'tallerkappa-admin-secret-2026';
const ADMIN_USER = process.env.ADMIN_USER || 'admin';
const ADMIN_PASS = process.env.ADMIN_PASS || 'kappa2026';

function authMiddleware(req, res, next) {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) return res.status(401).json({ error: 'No autorizado' });
    try {
        req.admin = jwt.verify(token, JWT_SECRET);
        next();
    } catch { return res.status(401).json({ error: 'Token inválido' }); }
}

app.post('/api/admin/login', (req, res) => {
    const { username, password } = req.body;
    if (username === ADMIN_USER && password === ADMIN_PASS) {
        const token = jwt.sign({ user: ADMIN_USER }, JWT_SECRET, { expiresIn: '8h' });
        res.json({ token, user: ADMIN_USER });
    } else {
        res.status(401).json({ error: 'Credenciales incorrectas' });
    }
});

app.get('/api/admin/orders', authMiddleware, async (req, res) => {
    try {
        const filter = req.query.status ? { status: req.query.status } : {};
        const orders = await Order.find(filter).sort('-createdAt').lean();
        res.json(orders);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.patch('/api/admin/orders/:id', authMiddleware, async (req, res) => {
    try {
        const { status, notes } = req.body;
        const update = {};
        if (status) update.status = status;
        if (notes) update.adminNotes = notes;
        const order = await Order.findByIdAndUpdate(req.params.id, update, { new: true }).lean();
        if (!order) return res.status(404).json({ error: 'Orden no encontrada' });
        res.json(order);
    } catch (err) { res.status(400).json({ error: err.message }); }
});

app.get('/api/admin/stats', authMiddleware, async (req, res) => {
    try {
        const total = await Order.countDocuments();
        const approved = await Order.countDocuments({ status: 'approved' });
        const pending = await Order.countDocuments({ status: 'pending' });
        const revenue = await Order.aggregate([
            { $match: { status: 'approved' } },
            { $group: { _id: null, total: { $sum: '$total' } } }
        ]);
        res.json({ total, approved, pending, revenue: revenue[0]?.total || 0 });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

/* ================================================================
   START
   ================================================================ */
app.listen(PORT, () => {
    console.log(`\n  🔩 TALLER KAPPA v2 — http://localhost:${PORT}`);
    console.log('  MongoDB + MercadoPago\n');
});
