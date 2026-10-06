# B9 — Hallazgos comerciales pendientes de confirmación del propietario

Fecha: 2026-10-06. Ni B6.1-C ni B9 aportaron evidencia nueva sobre estos puntos, y el propietario no los confirmó. Por la regla "no inventar", **no se modificó ninguno**. Cada punto queda como decisión comercial: confirmar (se deja igual) o corregir (se edita el texto).

| # | Hallazgo | Dónde (verificado en el código) | Estado | Qué debe confirmar el propietario |
|---|---|---|---|---|
| 1 | Retiro "sin cargo" | `Envios.jsx:19` | PENDIENTE | ¿El retiro en taller es gratuito? |
| 2 | Testimonio "Ricardo L. (Particular)" | `Nosotros.jsx:29` | PENDIENTE | Nombre/inicial y permiso de publicación (el propietario confirmó que los testimonios son reales; falta este caso puntual) |
| 3 | `stock: true` → `availability: InStock` en el schema (3 productos) | `data/products.js:88,123,157`, `lib/schema.js:206` | PENDIENTE | ¿Hay stock permanente? El catálogo ya muestra "Consultar disponibilidad", por lo que schema y UI hoy no coinciden. Se resuelve en el BLOQUE 4 solo si hay confirmación |
| 4 | "Cotizamos en el día" | Home, `SillonBKF.jsx` (~115), `Producto.jsx` (~99) | PENDIENTE | ¿Se puede asegurar respuesta en el día? Hay plazos de producción confirmados como "según stock", no de cotización |
| 5 | Envío bonificado (3+ unidades y primera compra, GBA) y embalaje bonificado al interior | `Envios.jsx:14,21`, `MobiliarioComercial.jsx:31,33,99`, `faq.js` | PENDIENTE | ¿La bonificación está vigente y con esas condiciones? |
| 6 | Garantías: estructura de por vida, pintura 2 años, cuero 1 año, cambios/devoluciones en 72 hs | `Garantia.jsx`, `faq.js:33`, `SillonBKF.jsx:28,29,47,219`, `GuiaBKF.jsx:156` | PENDIENTE | ¿Son las garantías reales y vigentes? |
| 7 | "A medida sin cargo adicional" / "sin costo adicional" | `SillonBKF.jsx:122`, `GuiaBKF.jsx:156` | PENDIENTE | ¿Las medidas a medida realmente no tienen recargo? |
| 8 | Proyectos: "Reposición rápida", "diseño a medida del local" y otros claims | `Proyectos.jsx:25` y alrededores | PENDIENTE | ¿Qué parte es demostrable? Los logos de clientes ya fueron confirmados como mantener |

## Criterio al recibir la respuesta
- Confirmado → no se toca el texto; se registra la fecha de confirmación.
- No confirmado → se reemplaza por una formulación neutral ("consultanos las condiciones") en un commit aparte.
- Ítem 3 → solo alinear el schema (`InStock`/`PreOrder`/omitir `availability`) según la respuesta.

## Implicancia para los bloques siguientes
Los bloques 2–7 no deben reforzar ni repetir ninguno de estos claims (por ejemplo, no usar "cotizamos en el día" ni "sin cargo" en textos nuevos).
