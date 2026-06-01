/**
 * TALLER KAPPA — Netlify Function: checkout
 * Esta es la ÚNICA función serverless del proyecto.
 * Crea una preferencia de pago en MercadoPago.
 * 
 * Se llama desde el frontend: POST /.netlify/functions/checkout
 */

const { MercadoPagoConfig, Preference } = require('mercadopago');

exports.handler = async (event) => {
    // CORS headers
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Content-Type': 'application/json',
    };

    // Preflight
    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 200, headers, body: '' };
    }

    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };
    }

    try {
        const { items, buyer, orderId } = JSON.parse(event.body);

        if (!items || !items.length) {
            return { statusCode: 400, headers, body: JSON.stringify({ error: 'Carrito vacío' }) };
        }

        // Inicializar MercadoPago
        const mpClient = new MercadoPagoConfig({
            accessToken: process.env.MP_ACCESS_TOKEN,
        });

        const FRONT = process.env.FRONTEND_URL || 'https://tallerkappa.com.ar';

        // Crear preferencia
        const preference = new Preference(mpClient);
        const mpPref = await preference.create({ body: {
            items: items.map(i => ({
                title: `${i.name} (${i.color})`,
                quantity: i.qty,
                unit_price: i.unitPrice,
                currency_id: 'ARS',
            })),
            payer: buyer && buyer.email ? { email: buyer.email } : { email: 'comprador@tallerkappa.com.ar' },
            back_urls: {
                success: `${FRONT}/checkout-result.html?status=approved&order=${orderId || 'direct'}`,
                failure: `${FRONT}/checkout-result.html?status=rejected&order=${orderId || 'direct'}`,
                pending: `${FRONT}/checkout-result.html?status=pending&order=${orderId || 'direct'}`,
            },
            auto_return: 'approved',
            external_reference: orderId || 'direct-purchase',
        }});

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                preferenceId: mpPref.id,
                initPoint: mpPref.init_point,
                sandboxInitPoint: mpPref.sandbox_init_point,
            }),
        };

    } catch (err) {
        console.error('Checkout error:', err);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: err.message || 'Error interno' }),
        };
    }
};
