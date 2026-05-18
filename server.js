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

require('dotenv').config();
const express  = require('express');
const cors     = require('cors');
const mongoose = require('mongoose');
const { MercadoPagoConfig, Preference, Payment } = require('mercadopago');
const { Product, FAQ, Testimonio, Contacto, Order } = require('./models');

const app  = express();
const PORT = process.env.PORT || 3000;

/* ---- Middleware ---- */
app.use(cors({ origin: process.env.FRONTEND_URL || '*' }));
app.use(express.json());
app.use(express.static(__dirname));

/* ---- MongoDB ---- */
mongoose.connect(process.env.MONGODB_URI)
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
   START
   ================================================================ */
app.listen(PORT, () => {
    console.log(`\n  🔩 TALLER KAPPA v2 — http://localhost:${PORT}`);
    console.log('  MongoDB + MercadoPago\n');
});
