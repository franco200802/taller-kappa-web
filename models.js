const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name:     { type: String, required: true },
    category: { type: String, required: true, enum: ['asientos', 'mesas'] },
    image:    { type: String, required: true },
    badge:    { type: String, default: '' },
    stock:    { type: Boolean, default: true },
    price:    { type: Number, required: true },          // Precio real en ARS
    priceFrom:{ type: String },                           // Texto visible "Desde $X"
    desc:     { type: String, required: true },
    specs:    [String],
    colors:   { type: [String], default: ['Negro Mate', 'Blanco Crema', 'Cromado'] },
}, { timestamps: true });

const faqSchema = new mongoose.Schema({
    icon:     { type: String, default: 'fas fa-question-circle' },
    question: { type: String, required: true },
    answer:   { type: String, required: true },
    order:    { type: Number, default: 0 },
});

const testimonioSchema = new mongoose.Schema({
    stars:  { type: Number, default: 5, min: 1, max: 5 },
    text:   { type: String, required: true },
    author: { type: String, required: true },
});

const contactoSchema = new mongoose.Schema({
    name:     { type: String, required: true },
    interest: { type: String, default: 'Consulta general' },
    message:  { type: String, required: true },
    leido:    { type: Boolean, default: false },
}, { timestamps: true });

const orderItemSchema = new mongoose.Schema({
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    name:      String,
    color:     String,
    qty:       { type: Number, min: 1 },
    unitPrice: Number,
}, { _id: false });

const orderSchema = new mongoose.Schema({
    items:         [orderItemSchema],
    total:         { type: Number, required: true },
    status:        { type: String, enum: ['pending', 'approved', 'rejected', 'in_process'], default: 'pending' },
    mpPaymentId:   String,                                // MercadoPago payment ID
    mpPreferenceId:String,                                // MercadoPago preference ID
    buyer: {
        name:  String,
        email: String,
        phone: String,
    },
}, { timestamps: true });

module.exports = {
    Product:    mongoose.model('Product', productSchema),
    FAQ:        mongoose.model('FAQ', faqSchema),
    Testimonio: mongoose.model('Testimonio', testimonioSchema),
    Contacto:   mongoose.model('Contacto', contactoSchema),
    Order:      mongoose.model('Order', orderSchema),
};
