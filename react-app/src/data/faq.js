/**
 * Preguntas frecuentes generales — fuente única de /faq/ (lista visible y
 * FAQPage) y de la sección de preguntas de llms.txt (scripts/prerender.js).
 *
 * Cada respuesta usa datos que ya publica el sitio (ver data/business.js y
 * data/products.js). Van en texto plano porque son también el `text` del
 * FAQPage. Los plazos tienen que coincidir con /envios/ y con la FAQ del
 * Sillón BKF; la garantía, con /garantia/.
 *
 * Si Firestore está configurado, /faq/ reemplaza esta lista por la de la base
 * (ver FAQ.jsx); llms.txt usa siempre esta.
 */
export const FAQS = [
  { id: '1', question: '¿Qué es Taller Kappa?', answer: 'Taller Kappa S.R.L. es una fábrica de muebles de hierro y cuero ubicada en Villa Chacabuco, San Martín, provincia de Buenos Aires, Argentina. Fabrica sillones BKF, bancos BKF y bases de mesa para particulares, empresas y locales gastronómicos.' },
  { id: '2', question: '¿Dónde está Taller Kappa?', answer: 'En Calle 28 Nº 3779, Villa Chacabuco (San Martín), provincia de Buenos Aires. El retiro de pedidos en el taller es de lunes a viernes de 9 a 18 hs.' },
  { id: '3', question: '¿Qué es un sillón BKF?', answer: 'El sillón BKF (también conocido como silla paleta o butterfly chair) es un diseño de 1938 creado por Antonio Bonet, Juan Kurchan y Jorge Ferrari Hardoy. En Taller Kappa lo fabricamos artesanalmente con estructura de hierro y funda de cuero.' },
  { id: '3b', question: '¿Qué significa BKF y quién lo creó?', answer: 'BKF son las iniciales de los apellidos de sus creadores: los arquitectos Antonio Bonet, Juan Kurchan y Jorge Ferrari Hardoy, que lo crearon a fines de 1938 en Buenos Aires. También se lo conoce como silla mariposa o butterfly chair.' },
  { id: '4', question: '¿Dónde comprar un sillón BKF en Buenos Aires?', answer: 'En Taller Kappa, fábrica ubicada en Calle 28 Nº 3779, Villa Chacabuco (San Martín), Buenos Aires. Podés consultar stock y coordinar tu compra por WhatsApp o visitar el showroom.' },
  { id: '5', question: '¿Taller Kappa fabrica sus propios sillones BKF?', answer: 'Sí. Taller Kappa fabrica los sillones BKF en su propio taller de San Martín, con hierro macizo redondo de 12 mm y cuero vacuno, y los vende directo de fábrica.' },
  { id: '6', question: '¿Qué productos fabrica Taller Kappa?', answer: 'El catálogo incluye el Sillón BKF Premium y el Banco BKF (categoría Asientos) y la Base de Mesa Flat (categoría Mesas). Se fabrican en hierro, con colores y terminaciones a pedido.' },
  { id: '7', question: '¿Qué diferencia hay entre el sillón BKF y el banco BKF?', answer: 'Comparten diseño y materiales, y se diferencian por tamaño y uso: el Sillón BKF Premium mide 78 x 70 x 90 cm; el Banco BKF mide 38 x 38 x 45 cm y se usa como pie de cama o asiento auxiliar.' },
  { id: '8', question: '¿Qué tipos de mesas vende Taller Kappa?', answer: 'En el catálogo figura la Base de Mesa Flat: una base de chapa torneada de 10 mm con columna central, en altura de mesa (73 cm) y de barra (105 cm), pensada para uso gastronómico. Para otros modelos o medidas, consultá por WhatsApp.' },
  { id: '9', question: '¿Taller Kappa vende mobiliario comercial?', answer: 'Sí. Fabrica mobiliario de hierro a medida para locales gastronómicos, estaciones de servicio y comercios. Entre sus clientes figuran YPF, McDonald\'s, Burger King, Shell Select y Sandro. Más información en la página de mobiliario comercial.' },
  { id: '10', question: '¿De qué materiales están fabricados los productos?', answer: 'Usamos hierro macizo redondo de 12mm (sin tubos ni rellenos), pintura epoxi y cuero vacuno. Cada pieza se fabrica en nuestro taller de San Martín, Buenos Aires.' },
  { id: '10b', question: '¿Se puede comprar online?', answer: 'No. En el sitio no se compra ni se paga nada: elegís los productos, los agregás al presupuesto y se envía por WhatsApp. Taller Kappa responde con el precio final y el plazo de entrega, y el resto se acuerda directamente con el taller.' },
  { id: '11', question: '¿Cuánto cuesta un sillón BKF? ¿Cómo consulto precios o hago un pedido?', answer: 'Taller Kappa no publica precios de lista: se cotizan según cantidad, color y terminación. Los precios que figuraron en versiones anteriores de este sitio pueden no estar vigentes. Escribinos por WhatsApp o completá el formulario de contacto con el producto, la cantidad y la zona de entrega, y te respondemos con la cotización.' },
  { id: '12', question: '¿Hacen envíos? ¿Cuánto tarda la entrega?', answer: 'Sí. Con unidades en stock, la entrega es en 24-48 horas en San Martín y alrededores; de 2 a 4 días hábiles en Capital Federal (CABA) y Zona Norte; de 2 a 5 en Zona Oeste; de 3 a 5 en Zona Sur; y de 5 a 10 días hábiles al interior del país por expreso. Los pedidos a medida se fabrican en 5 a 10 días hábiles. También se puede retirar sin cargo en el taller. El costo del envío depende de la zona.' },
  { id: '13', question: '¿Los productos tienen garantía?', answer: 'Sí. La estructura de hierro tiene garantía de por vida, la pintura 2 años y el cuero 1 año. Podés ver el detalle completo en la sección de garantía.' },
  { id: '14', question: '¿Fabrican productos a medida?', answer: 'Sí, adaptamos medidas, colores y terminaciones según lo que necesite cada cliente, sin costo adicional.' },
  { id: '14b', question: '¿Venden al por mayor o para empresas?', answer: 'Sí. Taller Kappa fabrica mobiliario de hierro para empresas y locales. En pedidos mayoristas (3 o más unidades) y en la primera compra, el envío dentro de GBA es bonificado; las condiciones se consultan por WhatsApp.' },
  { id: '15', question: '¿Emiten factura?', answer: 'Sí. Taller Kappa emite factura A y B, para personas y empresas.' },
  { id: '16', question: '¿Cómo los contacto?', answer: 'Por WhatsApp al 11 6124-2498, por email a ing.franciscomarotta@gmail.com, o mediante el formulario de la sección de contacto.' },
];
