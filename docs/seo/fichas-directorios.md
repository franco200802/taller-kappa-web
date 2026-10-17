# Datos para fichas de directorios (Cylex y otros)

> Texto listo para copiar y pegar al reclamar o crear cada ficha. Sale de
> `react-app/src/data/business.js` y del Perfil de Empresa de Google
> (reclamado el 17/10/2026). **Todas las fichas tienen que decir exactamente
> lo mismo**: Google compara nombre, dirección y teléfono (NAP) entre el sitio,
> el perfil y los directorios.

## Datos base (NAP)

| Campo | Valor exacto |
|---|---|
| Nombre comercial | `Taller Kappa` |
| Razón social (si el formulario la pide aparte) | `Taller Kappa S.R.L.` |
| Calle y número | `Vélez Sársfield 3779` |
| Nombre alternativo de la calle | `Calle 28` (si hay un campo de referencias o línea 2) |
| Barrio | `Villa Chacabuco` ⚠️ ver "Dato pendiente" abajo |
| Ciudad / partido | `San Martín` |
| Provincia | `Buenos Aires` |
| Código postal | `1650` |
| País | `Argentina` |
| Teléfono | `11 6124-2498` (formato internacional: `+54 11 6124-2498`) |
| WhatsApp | `11 6124-2498` |
| Sitio web | `https://tallerkappa.com.ar/` |
| Horario | Lunes a viernes de 9:00 a 18:00 (showroom y retiro con turno previo) |
| Mapa | `https://maps.app.goo.gl/96acmiHnvF2ZA4KM7` |

**No usar** el teléfono `011 4753-0099`: es el que tenía la ficha vieja de
Google y la de Bing. Si un directorio lo muestra, reemplazarlo.

### Dato pendiente: el barrio

El sitio dice **Villa Chacabuco**, pero la ficha de Bing dice **Villa Lynch**
y el código postal que tenía Google (B1672) corresponde a Villa Lynch. Confirmar
cuál es el barrio correcto antes de cargar fichas nuevas. Si es Villa Lynch, hay
que cambiar `neighborhood` en `business.js` (y el CP si corresponde) para que
todo coincida.

## Categorías

Elegir, en este orden, las que existan en cada directorio:

1. Fábrica de muebles / Fabricante de muebles
2. Muebles de hierro
3. Mueblería / Tienda de muebles
4. Mobiliario comercial / Equipamiento gastronómico

## Descripción corta (hasta ~160 caracteres)

```
Fábrica de muebles de hierro y cuero en San Martín, Buenos Aires. Sillones BKF, bancos BKF y bases de mesa a medida. Envíos a todo el país.
```

## Descripción larga (~420 caracteres)

```
Taller Kappa S.R.L. es una fábrica de muebles de hierro y cuero en San Martín, provincia de Buenos Aires. Fabricamos sillones BKF, bancos BKF y bases de mesa para particulares, empresas y locales gastronómicos, con medidas y colores a pedido. Vendemos directo de fábrica y enviamos a todo el país. Showroom y retiro en el taller con turno previo, de lunes a viernes de 9 a 18 hs. Cotización por WhatsApp.
```

## Productos / servicios (si el directorio tiene lista)

- Sillón BKF de hierro y cuero: `https://tallerkappa.com.ar/sillon-bkf/`
- Banco BKF: `https://tallerkappa.com.ar/catalogo/banco-bkf/`
- Base de mesa de hierro Flat: `https://tallerkappa.com.ar/catalogo/base-de-mesa-flat/`
- Mobiliario comercial a medida: `https://tallerkappa.com.ar/mobiliario-comercial/`
- Envíos a todo el país y retiro en el taller

## Dónde cargarlo

| Directorio | Estado conocido | Qué hacer |
|---|---|---|
| Google (Perfil de Empresa) | Reclamado 17/10/2026, falta verificar con video | Ver `docs/tareas-pendientes.md` |
| Bing Places | Ficha existente con teléfono viejo y "Villa Lynch" | Reclamar (se puede importar desde Google una vez verificado el perfil) |
| Cylex | Ficha "Talleres Kappa S de H, General San Martín" (otro nombre) | Reclamar y unificar con los datos de arriba |
| argentino.com.ar, fullconfort.com.ar | Aparecen en las búsquedas locales | Crear ficha con los datos de arriba |
| Apple Maps (Apple Business Connect) | Desconocido | Revisar si existe y reclamar |

Lo que **no** hay que hacer: comprar reseñas o enlaces, inventar perfiles ni
cargar datos distintos a los de esta página.
