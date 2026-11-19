/**
 * Productos de Taller Kappa en 3D (three.js puro, sin React Three Fiber: el sitio usa React 18 y evita librerías extra).
 *
 * Tres modelos, hechos por código y escalados a las medidas de data/products.js:
 *  - 'sillon-bkf-premium': dos varillas de 12 mm cruzadas en X y el cuero colgado de las 4 puntas (77 x 87 x 102 cm).
 *  - 'banco-bkf': la misma construcción en formato banqueta, con las 4 puntas a la misma altura (38 x 38 x 45 cm).
 *  - 'base-de-mesa-flat': disco de chapa de 10 mm, columna central y soporte de la tapa. Cambia de altura (73/105 cm)
 *    y de columna (77/101 mm). El diámetro del disco no se publica: se estimó desde la foto y no se rotula.
 *
 * Dos usos, mismo modelo:
 *  - `createViewer`: la miniatura "3D" de la galería de cada ficha (se gira y se acerca, muestra las cotas).
 *  - `createStage`: el showroom oscuro que cambia con el scroll (un keyframe por capítulo en STAGE_KF).
 *
 * Este módulo pesa lo que pesa three.js: NUNCA se importa de forma estática (ver loadProduct3d.js). No corre en el
 * prerender (no toca `window` al importarse).
 */
import {
  Box3, BoxGeometry, BufferGeometry, CanvasTexture, CatmullRomCurve3, Color, CurvePath, CylinderGeometry, DirectionalLight,
  DoubleSide, Float32BufferAttribute, Group, LineBasicMaterial, LineCurve3, LineSegments, MathUtils, Mesh,
  MeshBasicMaterial, MeshPhysicalMaterial, MeshStandardMaterial, NeutralToneMapping, PerspectiveCamera, PlaneGeometry,
  PMREMGenerator, Points, PointsMaterial, QuadraticBezierCurve3, RepeatWrapping, RingGeometry, Scene, SRGBColorSpace,
  TubeGeometry, Vector3, WebGLRenderer,
} from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

/* ---------- Geometría compartida ---------- */

const V = (x, y, z) => new Vector3(x, y, z);
const ROD = 0.006; // radio de la varilla: 12 mm de diámetro, en metros

/** Polígono cerrado con las esquinas curvadas, como una varilla doblada. */
function roundedLoop(pts, r) {
  const n = pts.length;
  const ins = [];
  const outs = [];
  for (let i = 0; i < n; i++) {
    const p = pts[i];
    const toPrev = pts[(i - 1 + n) % n].clone().sub(p);
    const toNext = pts[(i + 1) % n].clone().sub(p);
    const rr = Math.min(r, toPrev.length() * 0.4, toNext.length() * 0.4);
    ins[i] = p.clone().add(toPrev.normalize().multiplyScalar(rr));
    outs[i] = p.clone().add(toNext.normalize().multiplyScalar(rr));
  }
  const path = new CurvePath();
  for (let i = 0; i < n; i++) {
    path.add(new QuadraticBezierCurve3(ins[i], pts[i], outs[i]));
    path.add(new LineCurve3(outs[i], ins[(i + 1) % n]));
  }
  return path;
}

/** Superficie definida por `point(u, v, out)`: el cuero de los asientos. */
function buildSurface(point, seg = 56) {
  const pos = [];
  const uv = [];
  const idx = [];
  const p = new Vector3();
  for (let j = 0; j <= seg; j++) {
    for (let i = 0; i <= seg; i++) {
      point(i / seg, j / seg, p);
      pos.push(p.x, p.y, p.z);
      uv.push(i / seg, j / seg);
    }
  }
  for (let j = 0; j < seg; j++) {
    for (let i = 0; i < seg; i++) {
      const a = j * (seg + 1) + i;
      const c = a + seg + 1;
      idx.push(a, c, a + 1, a + 1, c, c + 1);
    }
  }
  const g = new BufferGeometry();
  g.setAttribute('position', new Float32BufferAttribute(pos, 3));
  g.setAttribute('uv', new Float32BufferAttribute(uv, 2));
  g.setIndex(idx);
  g.computeVertexNormals();
  return g;
}

/** Costura perimetral de una superficie: le da espesor al borde del cuero. */
function buildHem(point, seg = 40) {
  const pts = [];
  const p = new Vector3();
  for (let i = 0; i < seg; i++) pts.push(point(i / seg, 0, p).clone());
  for (let j = 0; j < seg; j++) pts.push(point(1, j / seg, p).clone());
  for (let i = seg; i > 0; i--) pts.push(point(i / seg, 1, p).clone());
  for (let j = seg; j > 0; j--) pts.push(point(0, j / seg, p).clone());
  return new TubeGeometry(new CatmullRomCurve3(pts, true, 'centripetal'), 320, 0.005, 8, true);
}

/** Escala `group` para que su caja mida exactamente W x H x D, centrado y apoyado en el piso. */
function fitBox(group, W, H, D) {
  const size = new Box3().setFromObject(group).getSize(new Vector3());
  group.scale.set(W / size.x, H / size.y, D / size.z);
  const box = new Box3().setFromObject(group);
  const center = box.getCenter(new Vector3());
  group.position.set(-center.x, -box.min.y, -center.z);
}

/* ---------- Sillón BKF ---------- */

// Puntos en metros (proporciones tomadas de FOTOCONMEDIDAS.png). La escala final la fija fitBox.
const C = {
  BL: V(-0.33, 1.0, -0.42), BR: V(0.33, 1.0, -0.42), // puntas de atrás (las más altas)
  FL: V(-0.38, 0.44, 0.42), FR: V(0.38, 0.44, 0.42), // puntas de adelante (alas del asiento)
  fFL: V(-0.27, ROD, 0.3), fFR: V(0.27, ROD, 0.3), // apoyos delanteros
  fBL: V(-0.24, ROD, -0.25), fBR: V(0.24, ROD, -0.25), // apoyos traseros
};
// Cada varilla es un lazo cerrado: punta de atrás → apoyo trasero opuesto → punta delantera → apoyo delantero opuesto.
const CHAIR_RODS = [
  [C.BL, C.fBR, C.FR, C.fFL],
  [C.BR, C.fBL, C.FL, C.fFR],
];

function chairSlingPoint(U, Vv, out) {
  const a = new Vector3().lerpVectors(C.BL, C.BR, U);
  const b = new Vector3().lerpVectors(C.FL, C.FR, U);
  out.lerpVectors(a, b, Vv);
  const su = Math.sin(Math.PI * U);
  const s = Math.sin(Math.PI * Math.pow(Vv, 1.36)); // la parte más honda queda en el asiento
  const w = 0.5 + 0.5 * su;
  out.y -= 0.34 * s * w;
  out.z -= 0.14 * s * w;
  out.y -= 0.17 * su * Math.pow(1 - Vv, 3); // borde superior en "V"
  out.y -= 0.05 * su * Math.pow(Vv, 4); // borde delantero
  out.x -= Math.sign(out.x) * 0.05 * Math.sin(Math.PI * Vv) * Math.pow(Math.abs(2 * U - 1), 4); // laterales cóncavos
  out.y -= 0.02;
  return out;
}

/* ---------- Banco BKF ---------- */

// Cuatro puntas a la misma altura y cuatro apoyos. Proporciones de la foto del banco; la escala la fija fitBox.
const BA = 0.17; // media diagonal de las puntas
const BF = 0.16; // media diagonal de los apoyos
const BH = 0.45;
const B = {
  TFL: V(-BA, BH, BA), TFR: V(BA, BH, BA), TBL: V(-BA, BH, -BA), TBR: V(BA, BH, -BA),
  fFL: V(-BF, ROD, BF), fFR: V(BF, ROD, BF), fBL: V(-BF, ROD, -BF), fBR: V(BF, ROD, -BF),
};
// Igual que el sillón: cada varilla une dos puntas opuestas pasando por los apoyos de las otras dos esquinas, así cada
// cara del banco muestra una X (como en la foto).
const BENCH_RODS = [
  [B.TFL, B.fFR, B.TBR, B.fBL],
  [B.TFR, B.fFL, B.TBL, B.fBR],
];

function benchSlingPoint(U, Vv, out) {
  const a = new Vector3().lerpVectors(B.TBL, B.TBR, U);
  const b = new Vector3().lerpVectors(B.TFL, B.TFR, U);
  out.lerpVectors(a, b, Vv);
  const su = Math.sin(Math.PI * U);
  const sv = Math.sin(Math.PI * Vv);
  out.y -= 0.05 * (Math.pow(su, 0.8) + Math.pow(sv, 0.8)); // asiento en "silla de montar": las puntas quedan arriba
  out.x -= Math.sign(out.x) * 0.03 * sv * Math.pow(Math.abs(2 * U - 1), 4); // bordes cóncavos
  out.z -= Math.sign(out.z) * 0.03 * su * Math.pow(Math.abs(2 * Vv - 1), 4);
  out.y -= 0.012;
  return out;
}

/* ---------- Texturas generadas (no se descarga nada) ---------- */

/** Ruido para el poro del cuero. */
function grainTexture() {
  const c = document.createElement('canvas');
  c.width = c.height = 256;
  const ctx = c.getContext('2d');
  const img = ctx.createImageData(256, 256);
  for (let i = 0; i < img.data.length; i += 4) {
    const v = 110 + Math.random() * 90;
    img.data[i] = img.data[i + 1] = img.data[i + 2] = v;
    img.data[i + 3] = 255;
  }
  ctx.putImageData(img, 0, 0);
  const t = new CanvasTexture(c);
  t.wrapS = RepeatWrapping;
  t.wrapT = RepeatWrapping;
  t.repeat.set(6, 6);
  return t;
}

/** Degradé radial: sombra bajo el producto y partículas de polvo. */
function radialTexture(inner, outer, size = 128) {
  const c = document.createElement('canvas');
  c.width = c.height = size;
  const ctx = c.getContext('2d');
  const g = ctx.createRadialGradient(size / 2, size / 2, size * 0.03, size / 2, size / 2, size / 2);
  g.addColorStop(0, inner);
  g.addColorStop(1, outer);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);
  return new CanvasTexture(c);
}

/** Sombra suave bajo el producto (más barata que sombras en tiempo real). */
function shadowPlane(w, d, strength) {
  const mesh = new Mesh(
    new PlaneGeometry(w * 1.5, d * 1.5),
    new MeshBasicMaterial({ map: radialTexture(`rgba(0,0,0,${strength})`, 'rgba(0,0,0,0)'), transparent: true, depthWrite: false }),
  );
  mesh.rotation.x = -Math.PI / 2;
  mesh.position.y = 0.001;
  return mesh;
}

/* ---------- Cotas ---------- */

function segments(pairs, color) {
  const g = new BufferGeometry();
  g.setAttribute('position', new Float32BufferAttribute(pairs.flatMap(([a, b]) => [...a, ...b]), 3));
  const lines = new LineSegments(g, new LineBasicMaterial({ color, depthTest: false, transparent: true }));
  lines.renderOrder = 2;
  return lines;
}

/** Ancho, profundidad y alto con sus topes (asientos), y el punto donde va cada etiqueta. */
function boxGuides(W, D, H, color) {
  const off = 0.08 * Math.max(W, D);
  const tick = 0.03 * Math.max(W, D);
  const x = W / 2;
  const z = D / 2;
  const width = segments([
    [[-x, 0, z + off], [x, 0, z + off]], [[-x, -tick, z + off], [-x, tick, z + off]], [[x, -tick, z + off], [x, tick, z + off]],
  ], color);
  const depth = segments([
    [[x + off, 0, -z], [x + off, 0, z]], [[x + off, -tick, -z], [x + off, tick, -z]], [[x + off, -tick, z], [x + off, tick, z]],
  ], color);
  const height = segments([
    [[x + off, 0, -z - off], [x + off, H, -z - off]],
    [[x + off - tick, 0, -z - off], [x + off + tick, 0, -z - off]], [[x + off - tick, H, -z - off], [x + off + tick, H, -z - off]],
  ], color);
  const object = new Group();
  object.add(width, depth, height);
  return {
    object,
    parts: { width, depth, height },
    anchors: { width: V(0, 0, z + off), depth: V(x + off, 0, 0), height: V(x + off, H / 2, -z - off) },
  };
}

/** Muestra cada cota según su cantidad (0 a 1). Las etiquetas las ubica el componente. */
function applyGuides(guides, amounts) {
  for (const [key, part] of Object.entries(guides.parts)) {
    if (!part) continue;
    const a = amounts[key] ?? 0;
    part.visible = a > 0.02;
    part.material.opacity = a;
  }
}

/* ---------- Modelos ---------- */

// Cómo se ve cada acabado de FINISH_COLORS (data/products.js). Las claves son los `name` de esa lista.
const FINISH_LOOK = {
  'Negro Mate': { color: '#1a1a1a', metalness: 0.35, roughness: 0.62 },
  'Blanco Crema': { color: '#f2ece2', metalness: 0.1, roughness: 0.45 },
  Cromado: { color: '#f4f4f4', metalness: 1, roughness: 0.12 },
  'Verde Oliva': { color: '#556b2f', metalness: 0.3, roughness: 0.5 },
  'Rojo Kappa': { color: '#b71c1c', metalness: 0.3, roughness: 0.45 },
};

/**
 * Sillón o banco: estructura de varilla + cuero colgado de las puntas. Opciones: 'finish' (acabado) y 'leather'.
 * `setLayer(a)` disuelve el cuero (0) y lo vuelve a mostrar (1).
 */
function createSeatModel({ rods, slingPoint, roundR, defaultLeather, dimensions, values, guideColor }) {
  const W = dimensions.width / 100;
  const D = dimensions.depth / 100;
  const H = dimensions.height / 100;
  const grain = grainTexture();
  // Cuero con brillo bajo y sin sheen claro: con más, el marrón se veía rosado y no coincidía con la muestra.
  const mats = {
    frame: new MeshStandardMaterial(),
    leather: new MeshPhysicalMaterial({
      side: DoubleSide, roughness: 0.55, sheen: 0.2, sheenRoughness: 0.6, sheenColor: new Color('#7a4a2c'),
      clearcoat: 0.2, clearcoatRoughness: 0.45, bumpMap: grain, bumpScale: 0.3, envMapIntensity: 0.7,
    }),
    hem: new MeshStandardMaterial({ roughness: 0.5 }),
  };
  const group = new Group();
  for (const pts of rods) group.add(new Mesh(new TubeGeometry(roundedLoop(pts, roundR), 360, ROD, 12, true), mats.frame));
  const leatherGroup = new Group();
  leatherGroup.add(new Mesh(buildSurface(slingPoint), mats.leather), new Mesh(buildHem(slingPoint), mats.hem));
  group.add(leatherGroup);
  fitBox(group, W, H, D);

  const target = { frame: new Color(), leather: new Color(defaultLeather), metal: 0, rough: 0 };
  const setFinish = (name) => {
    const look = FINISH_LOOK[name] ?? FINISH_LOOK['Negro Mate'];
    target.frame.set(look.color);
    target.metal = look.metalness;
    target.rough = look.roughness;
  };
  const paint = (k) => {
    mats.frame.color.lerp(target.frame, k);
    mats.frame.metalness += (target.metal - mats.frame.metalness) * k;
    mats.frame.roughness += (target.rough - mats.frame.roughness) * k;
    mats.leather.color.lerp(target.leather, k);
    mats.hem.color.copy(mats.leather.color).multiplyScalar(0.55);
  };
  setFinish(values.finish?.name ?? 'Negro Mate');
  if (values.leather) target.leather.set(values.leather.swatch);
  paint(1);

  return {
    object: group,
    guides: boxGuides(W, D, H, guideColor),
    size: () => ({ W, D, H }),
    setOption(key, item) {
      if (key === 'finish') setFinish(item.name);
      if (key === 'leather') target.leather.set(item.swatch);
    },
    update(dt) { paint(1 - Math.exp(-dt * 6)); },
    setLayer(a) {
      const e = a * a * (3 - 2 * a);
      leatherGroup.visible = a > 0.02;
      leatherGroup.position.y = (1 - e) * 0.15;
      for (const m of [mats.leather, mats.hem]) {
        m.opacity = e;
        const transparent = e < 0.999;
        if (m.transparent !== transparent) {
          m.transparent = transparent;
          m.needsUpdate = true;
        }
      }
      mats.leather.depthWrite = e > 0.5;
    },
    setExplode() {},
    textures: [grain],
  };
}

/**
 * Base de Mesa Flat: disco de chapa, columna y soporte de la tapa. Opciones: 'finish' (acabado), 'height' (cm) y
 * 'column' (mm), que se animan hacia el valor elegido. `setExplode(e)` levanta la columna para dejar ver la chapa.
 */
function createTableBaseModel({ dimensions, values, guideColor }) {
  const DISC_R = 0.18; // diámetro estimado desde la foto (con la columna de 77 mm como regla): no se publica ni se rotula
  const TOP = 0.38; // lado del soporte de la tapa, estimado desde la foto
  const HUB_H = 0.03;
  const TOP_T = 0.006;
  const plate = dimensions.plateMm / 1000;
  const mat = new MeshStandardMaterial();
  // Acabado: los mismos de la estructura de los asientos (FINISH_LOOK), con transición suave al cambiar.
  const paintTarget = { color: new Color(), metal: 0, rough: 0 };
  const setFinish = (name) => {
    const look = FINISH_LOOK[name] ?? FINISH_LOOK['Negro Mate'];
    paintTarget.color.set(look.color);
    paintTarget.metal = look.metalness;
    paintTarget.rough = look.roughness;
  };
  const paint = (k) => {
    mat.color.lerp(paintTarget.color, k);
    mat.metalness += (paintTarget.metal - mat.metalness) * k;
    mat.roughness += (paintTarget.rough - mat.roughness) * k;
  };
  setFinish(values.finish?.name ?? 'Negro Mate');
  paint(1);

  const group = new Group();
  const disc = new Mesh(new CylinderGeometry(DISC_R * 0.99, DISC_R, plate, 96), mat);
  disc.position.y = plate / 2;
  const upper = new Group();
  const column = new Mesh(new CylinderGeometry(1, 1, 1, 48), mat);
  const hub = new Mesh(new CylinderGeometry(0.07, 0.07, HUB_H, 48), mat);
  const top = new Mesh(new BoxGeometry(TOP, TOP_T, TOP), mat);
  upper.add(column, hub, top);
  group.add(disc, upper);

  const gx = DISC_R + 0.09;
  const heightLine = segments([[[gx, 0, 0], [gx, 1, 0]], [[gx - 0.03, 0, 0], [gx + 0.03, 0, 0]], [[gx - 0.03, 1, 0], [gx + 0.03, 1, 0]]], guideColor);
  const guideObject = new Group();
  guideObject.add(heightLine);
  const anchors = { height: V(gx, 0, 0), column: V(0, 0, 0), plate: V(DISC_R, plate / 2, 0) };

  const cur = {
    h: (values.height?.value ?? dimensions.heights[0]) / 100,
    r: (values.column?.value ?? dimensions.columnsMm[0]) / 2000,
    lift: 0,
  };
  const target = { h: cur.h, r: cur.r };
  const apply = () => {
    const len = cur.h - plate - HUB_H - TOP_T;
    column.scale.set(cur.r, len, cur.r);
    column.position.y = plate + len / 2;
    hub.position.y = plate + len + HUB_H / 2;
    top.position.y = cur.h - TOP_T / 2;
    upper.position.y = cur.lift;
    heightLine.scale.y = cur.h; // la línea mide 1 y se estira hasta la altura actual
    anchors.height.y = cur.h / 2;
    anchors.column.set(cur.r, plate + len * 0.62 + cur.lift, 0);
  };
  apply();

  return {
    object: group,
    guides: { object: guideObject, parts: { height: heightLine, column: null, plate: null }, anchors },
    size: () => ({ W: Math.max(TOP, DISC_R * 2), D: Math.max(TOP, DISC_R * 2), H: cur.h }),
    setOption(key, item) {
      if (key === 'finish') setFinish(item.name);
      if (key === 'height') target.h = item.value / 100;
      if (key === 'column') target.r = item.value / 2000;
    },
    update(dt) {
      const k = 1 - Math.exp(-dt * 5);
      cur.h += (target.h - cur.h) * k;
      cur.r += (target.r - cur.r) * k;
      paint(1 - Math.exp(-dt * 6));
      apply();
    },
    setLayer() {},
    setExplode(e) { cur.lift = e * 0.12; },
    textures: [],
  };
}

const MODELS = {
  'sillon-bkf-premium': (o) => createSeatModel({ ...o, rods: CHAIR_RODS, slingPoint: chairSlingPoint, roundR: 0.07, defaultLeather: '#6e3a1f' }),
  'banco-bkf': (o) => createSeatModel({ ...o, rods: BENCH_RODS, slingPoint: benchSlingPoint, roundR: 0.05, defaultLeather: '#b8783e' }),
  'base-de-mesa-flat': createTableBaseModel,
};

function buildModel(key, opts) {
  const make = MODELS[key];
  if (!make) throw new Error(`No hay modelo 3D para "${key}"`);
  return make(opts);
}

/** Cuánto más chico o grande es el modelo que el sillón: las cámaras se pensaron para el sillón (1,02 m). */
const frameScale = ({ W, D, H }) => Math.max(W, D, H) / 1.02;

/* ---------- Infraestructura compartida ---------- */

function makeRenderer(host, { exposure, maxDpr }) {
  const renderer = new WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, maxDpr));
  renderer.outputColorSpace = SRGBColorSpace;
  // Tone mapping "neutral" (Khronos PBR Neutral): pensado para productos, respeta el color de cada muestra.
  renderer.toneMapping = NeutralToneMapping;
  renderer.toneMappingExposure = exposure;
  host.appendChild(renderer.domElement);
  const scene = new Scene();
  const pmrem = new PMREMGenerator(renderer);
  const room = new RoomEnvironment();
  const envRT = pmrem.fromScene(room, 0.04);
  room.dispose?.();
  scene.environment = envRT.texture;
  return { renderer, scene, pmrem, envRT };
}

/**
 * Sigue el tamaño del contenedor. `fov(aspect)` (opcional) elige el ángulo de la cámara según la proporción;
 * `onResize(w, h)` (opcional) avisa el tamaño nuevo para lo que no es la cámara.
 */
function observeSize(host, renderer, camera, { fov, onResize } = {}) {
  const fit = () => {
    const w = host.clientWidth;
    const h = host.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    if (fov) camera.fov = fov(w / h);
    camera.updateProjectionMatrix();
    onResize?.(w, h);
  };
  const ro = new ResizeObserver(fit);
  ro.observe(host);
  fit();
  return ro;
}

/** Bucle de render que corre solo mientras `host` está en pantalla y la pestaña está visible. */
function createLoop(host, frame) {
  let raf = 0;
  let visible = true;
  let last = 0;
  const tick = (now) => {
    raf = requestAnimationFrame(tick);
    const dt = Math.min((now - last) / 1000, 0.05);
    last = now;
    frame(dt, now / 1000);
  };
  const start = () => {
    if (!raf && visible && !document.hidden) {
      last = performance.now();
      raf = requestAnimationFrame(tick);
    }
  };
  const stop = () => {
    cancelAnimationFrame(raf);
    raf = 0;
  };
  // El observer puede entregar varios cambios juntos (p. ej. "fuera" y "dentro" si el primer cuadro tardó): vale el
  // último. Con el primero, la escena quedaba congelada en la base de mesa.
  const io = new IntersectionObserver((entries) => {
    visible = entries[entries.length - 1].isIntersecting;
    if (visible) start();
    else stop();
  });
  io.observe(host);
  const onVis = () => (document.hidden ? stop() : start());
  document.addEventListener('visibilitychange', onVis);
  start();
  return {
    dispose() {
      stop();
      io.disconnect();
      document.removeEventListener('visibilitychange', onVis);
    },
  };
}

/** Posición en pantalla (px dentro de `host`) de cada etiqueta de cota. */
function labelPositions(anchors, camera, host, root) {
  const out = {};
  const v = new Vector3();
  const w = host.clientWidth;
  const h = host.clientHeight;
  for (const [key, p] of Object.entries(anchors)) {
    v.copy(p);
    root.localToWorld(v);
    v.project(camera);
    out[key] = { x: (v.x * 0.5 + 0.5) * w, y: (-v.y * 0.5 + 0.5) * h, visible: v.z < 1 };
  }
  return out;
}

function disposeAll(scene, renderer, pmrem, envRT, textures) {
  scene.traverse((o) => {
    o.geometry?.dispose();
    if (o.material) {
      o.material.map?.dispose();
      o.material.dispose();
    }
  });
  textures.forEach((t) => t.dispose());
  envRT.dispose();
  pmrem.dispose();
  renderer.dispose();
  renderer.domElement.remove();
}

/* ---------- Visor de la galería ---------- */

/**
 * @param {HTMLElement} host
 * @param {{ model: string, dimensions: object, values: Record<string, object>, reducedMotion?: boolean,
 *           onLabels?: (pos: Record<string, {x:number, y:number, visible:boolean}> | null, amounts: object) => void }} opts
 */
export function createViewer(host, opts) {
  const { reducedMotion, onLabels } = opts;
  const { renderer, scene, pmrem, envRT } = makeRenderer(host, { exposure: 1, maxDpr: 2 });
  const model = buildModel(opts.model, { dimensions: opts.dimensions, values: opts.values, guideColor: '#b71c1c' });
  const { W, D, H } = model.size();
  const s = frameScale(model.size());

  const root = new Group();
  root.add(model.object, shadowPlane(W, D, 0.38), model.guides.object);
  scene.add(root);
  const allOn = Object.fromEntries(Object.keys(model.guides.anchors).map((k) => [k, 1]));
  let measures = false;
  applyGuides(model.guides, {});

  const camera = new PerspectiveCamera(30, 1, 0.02, 20 * s);
  // En formatos apaisados (mobile 5:4) falta alto: se abre el ángulo para que entren el producto y las cotas.
  const ro = observeSize(host, renderer, camera, { fov: (aspect) => (aspect > 1.1 ? 37 : 30) });

  // Distancia para que el producto entero (con un margen para las cotas) entre en el cuadro, según la proporción del
  // visor: en la galería es cuadrado, en la vista rápida del catálogo es alto y angosto. Antes la cámara estaba fija
  // para un cuadro cuadrado y en el catálogo el producto quedaba cortado.
  // La esfera se mide desde el punto que mira la cámara (a un 36 % del alto, no al medio): con el centro del producto,
  // la parte de arriba de la base de barra quedaba afuera.
  const fitDistance = () => {
    const sz = model.size();
    const ty = sz.H * 0.36;
    const radius = Math.hypot(sz.W * 0.55, Math.max(ty, sz.H - ty), sz.D * 0.55);
    const half = MathUtils.degToRad(camera.fov / 2);
    const halfH = Math.atan(Math.tan(half) * camera.aspect);
    return radius / Math.sin(Math.min(half, halfH));
  };
  const target = new Vector3(0, H * 0.36, 0);
  camera.position.copy(new Vector3(1.75, 1.2, 2.55).normalize().multiplyScalar(fitDistance()).add(target));
  const controls = new OrbitControls(camera, renderer.domElement);
  // Mirar un poco por debajo del centro sube el producto en el cuadro: la cota de abajo no queda bajo el pie de foto.
  controls.target.copy(target);
  controls.enableDamping = true;
  controls.enablePan = false;
  controls.maxPolarAngle = MathUtils.degToRad(88);
  controls.autoRotate = !reducedMotion;
  controls.autoRotateSpeed = 1.2;
  controls.addEventListener('start', () => { controls.autoRotate = false; });
  controls.update();

  // Si cambia el encuadre necesario (el visor cambia de proporción o la base de altura) la cámara se acomoda sola; el
  // zoom que haga la persona entre medio se respeta.
  let fitted = 0;
  let refitting = false;
  const dir = new Vector3();

  const loop = createLoop(host, (dt) => {
    model.update(dt);
    // La base de mesa cambia de altura: el punto que se mira la acompaña.
    controls.target.y = MathUtils.damp(controls.target.y, model.size().H * 0.36, 4, dt);
    const fit = fitDistance();
    if (Math.abs(fit - fitted) > fitted * 0.01) {
      fitted = fit;
      refitting = true;
      controls.minDistance = fit * 0.45;
      controls.maxDistance = fit * 2.2;
    }
    if (refitting) {
      dir.copy(camera.position).sub(controls.target);
      const dist = MathUtils.damp(dir.length(), fitted, 4, dt);
      camera.position.copy(controls.target).addScaledVector(dir.normalize(), dist);
      if (Math.abs(dist - fitted) < fitted * 0.002) refitting = false;
    }
    controls.update();
    renderer.render(scene, camera);
    if (measures && onLabels) onLabels(labelPositions(model.guides.anchors, camera, host, root), allOn);
  });

  return {
    setOption: (key, item) => model.setOption(key, item),
    setMeasures(on) {
      measures = on;
      applyGuides(model.guides, on ? allOn : {});
      if (!on) onLabels?.(null, {});
    },
    dispose() {
      loop.dispose();
      ro.disconnect();
      controls.dispose();
      disposeAll(scene, renderer, pmrem, envRT, model.textures);
    },
  };
}

/* ---------- Showroom: el producto que cambia con el scroll ---------- */

// Un keyframe por capítulo (p = progreso 0→1 de la sección; capítulos en 0, 1/3, 2/3 y 1). Las distancias están en la
// escala del sillón y se ajustan al tamaño de cada producto (frameScale).
//   off: cámara relativa al punto que mira · gx: corrimiento lateral (el producto va del lado opuesto a la tarjeta)
//   rot: giro · look: a qué altura mira (fracción del alto) · layer: cuero visible · explode: piezas separadas
//   show: cotas visibles en ese capítulo
const STAGE_KF = {
  'sillon-bkf-premium': [
    { p: 0, off: [0, 0.25, 3.3], gx: 0.5, rot: -0.55 }, // diseño de 1938
    { p: 1 / 3, off: [0.3, 0.05, 2.6], gx: -0.45, rot: 0.85, layer: 0 }, // estructura: el cuero se disuelve
    { p: 2 / 3, off: [0, 0.75, 3], gx: 0.45, rot: 2.55 }, // cuero
    { p: 1, off: [0.2, 0.35, 3.4], gx: -0.5, rot: Math.PI * 2 - 0.75, show: ['width', 'depth', 'height'] }, // medidas
  ],
  'banco-bkf': [
    { p: 0, off: [0, 0.9, 3.2], gx: 0.5, rot: -0.6 },
    { p: 1 / 3, off: [0.4, 0.3, 2.6], gx: -0.45, rot: 0.8, layer: 0 },
    { p: 2 / 3, off: [0, 1.6, 2.6], gx: 0.45, rot: 2.4 },
    { p: 1, off: [0.3, 0.9, 3.3], gx: -0.5, rot: Math.PI * 2 - 0.7, show: ['width', 'depth', 'height'] },
  ],
  'base-de-mesa-flat': [
    { p: 0, off: [0, 0.6, 3.2], gx: 0.45, rot: -0.4 }, // la base completa
    { p: 1 / 3, off: [0.5, 0.06, 1.9], gx: -0.35, rot: 0.6, look: 0.12, explode: 1, show: ['plate'] }, // chapa de 10 mm
    { p: 2 / 3, off: [0, 0.3, 2.6], gx: 0.4, rot: 1.8, show: ['column'] }, // columna
    { p: 1, off: [0.2, 0.4, 3.3], gx: -0.45, rot: Math.PI * 2 - 0.5, show: ['height'] }, // alturas
  ],
};

// `show` pasa a Set una sola vez: se consulta en cada cuadro.
for (const kfs of Object.values(STAGE_KF)) for (const kf of kfs) kf.show = new Set(kf.show ?? []);

const smooth = (t) => t * t * (3 - 2 * t);
function sampleStage(kfs, p) {
  p = MathUtils.clamp(p, 0, 1);
  let i = 0;
  while (i < kfs.length - 2 && p > kfs[i + 1].p) i++;
  const a = kfs[i];
  const b = kfs[i + 1];
  // Cada capítulo se queda quieto un rato y la transición ocurre en el medio del tramo.
  const t = smooth(MathUtils.clamp(((p - a.p) / (b.p - a.p) - 0.2) / 0.6, 0, 1));
  const L = MathUtils.lerp;
  const show = {};
  for (const key of new Set([...a.show, ...b.show])) {
    show[key] = L(a.show.has(key) ? 1 : 0, b.show.has(key) ? 1 : 0, t);
  }
  return {
    i,
    t,
    off: [L(a.off[0], b.off[0], t), L(a.off[1], b.off[1], t), L(a.off[2], b.off[2], t)],
    gx: L(a.gx, b.gx, t),
    rot: L(a.rot, b.rot, t),
    look: L(a.look ?? 0.43, b.look ?? 0.43, t),
    layer: L(a.layer ?? 1, b.layer ?? 1, t),
    explode: L(a.explode ?? 0, b.explode ?? 0, t),
    show,
  };
}

/** Polvo flotando en la luz. */
function makeDust(count = 70) {
  const pos = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    pos[i * 3] = (Math.random() - 0.5) * 3.4;
    pos[i * 3 + 1] = Math.random() * 1.9;
    pos[i * 3 + 2] = (Math.random() - 0.5) * 2.2 - 0.3;
  }
  const g = new BufferGeometry();
  g.setAttribute('position', new Float32BufferAttribute(pos, 3));
  const map = radialTexture('rgba(255,236,214,1)', 'rgba(255,236,214,0)', 64);
  return new Points(g, new PointsMaterial({ map, size: 0.03, transparent: true, opacity: 0.55, depthWrite: false }));
}

/**
 * @param {HTMLElement} host  contenedor del canvas (dentro de la parte fija de la sección)
 * @param {{ model: string, dimensions: object, values: Record<string, object>, reducedMotion?: boolean,
 *           onLabels?: (pos: object | null, amounts: object) => void }} opts
 */
export function createStage(host, opts) {
  const { reducedMotion, onLabels } = opts;
  const kfs = STAGE_KF[opts.model];
  // La escena ocupa toda la pantalla: con más de 1.5 de densidad, una notebook con gráficos integrados ya lo sufre.
  const { renderer, scene, pmrem, envRT } = makeRenderer(host, { exposure: 0.9, maxDpr: 1.5 });
  // Luz principal neutra y suave (con más, el marrón se veía naranja y no coincidía con la muestra) y un contraluz
  // rojo que despega la estructura negra del fondo oscuro.
  scene.environmentIntensity = 0.75;
  const key = new DirectionalLight('#fffaf4', 1.2);
  key.position.set(2.5, 4, 2.5);
  const rim = new DirectionalLight('#ff5a45', 1.6);
  rim.position.set(-3, 1.5, -2.5);
  scene.add(key, rim);

  const model = buildModel(opts.model, { dimensions: opts.dimensions, values: opts.values, guideColor: '#e2574f' });
  const { W, D } = model.size();
  const guideKeys = Object.keys(model.guides.anchors);
  const root = new Group();
  // Pedestal: un arco rojo que respira y un aro fino, a la medida del producto.
  const R = 0.72 * Math.max(W, D);
  const ring = new Mesh(
    new RingGeometry(1, 1.02, 128, 1, 0, Math.PI * 1.6),
    new MeshBasicMaterial({ color: '#e0302b', transparent: true, opacity: 0.5, toneMapped: false, side: DoubleSide }),
  );
  const halo = new Mesh(new RingGeometry(1.13, 1.135, 128), new MeshBasicMaterial({ color: '#fafaf8', transparent: true, opacity: 0.12, side: DoubleSide }));
  for (const m of [ring, halo]) {
    m.rotation.x = -Math.PI / 2;
    m.position.y = 0.002;
    m.scale.setScalar(R);
  }
  root.add(model.object, shadowPlane(W, D, 0.6), ring, halo, model.guides.object);
  scene.add(root);
  const dust = reducedMotion ? null : makeDust();
  if (dust) scene.add(dust);

  const camera = new PerspectiveCamera(30, 1, 0.02, 30);
  const TAN_HALF_FOV = Math.tan(MathUtils.degToRad(15));
  const look = new Vector3();
  const camTarget = new Vector3();
  let narrow = false;
  let aspect = 1;
  // Celular: fracción de la pantalla (desde arriba) que deja libre la tarjeta de cada capítulo. La mide el componente
  // con `setFreeSpace`; estos valores son solo el arranque.
  let free = [0.55, 0.55, 0.55, 0.38];
  const ro = observeSize(host, renderer, camera, {
    onResize: (w, h) => {
      narrow = w < 820;
      aspect = w / h;
    },
  });

  // Mouse: inclinación leve con el puntero y arrastre para girar (en touch el scroll queda libre).
  const pointer = { x: 0, y: 0 };
  const drag = { active: false, x: 0, offset: 0, vel: 0 };
  const onMove = (e) => {
    if (e.pointerType !== 'mouse') return;
    pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
    pointer.y = (e.clientY / window.innerHeight) * 2 - 1;
    if (drag.active) {
      drag.vel = (e.clientX - drag.x) * 0.008;
      drag.offset += drag.vel;
      drag.x = e.clientX;
    }
  };
  const onDown = (e) => {
    if (e.pointerType !== 'mouse') return;
    drag.active = true;
    drag.x = e.clientX;
  };
  const onUp = () => { drag.active = false; };
  window.addEventListener('pointermove', onMove, { passive: true });
  renderer.domElement.addEventListener('pointerdown', onDown);
  window.addEventListener('pointerup', onUp);

  let progress = 0;
  let first = true;
  let labelsShown = false;
  const s = { gx: 0, rot: 0, tilt: 0, layer: 1, explode: 0, show: {} };

  const loop = createLoop(host, (dt, t) => {
    const k = sampleStage(kfs, progress);
    const size = model.size();
    const sc = frameScale(size);
    // Con "reducir movimiento" (y en el primer cuadro) todo va directo a su lugar, sin recorrido.
    const snap = reducedMotion || first;
    const damp = (cur, to, lambda) => (snap ? to : MathUtils.damp(cur, to, lambda, dt));
    if (!drag.active) {
      drag.offset += drag.vel;
      drag.vel *= 0.92;
    }
    const sway = reducedMotion ? 0 : Math.sin(t * 0.3) * 0.3;
    s.gx = damp(s.gx, narrow ? 0 : k.gx * sc, 3.5);
    s.rot = damp(s.rot, k.rot + sway + drag.offset + (reducedMotion ? 0 : pointer.x * 0.25), 4);
    s.tilt = damp(s.tilt, reducedMotion ? 0 : -pointer.y * 0.04, 4);
    s.layer = damp(s.layer, k.layer, 5);
    s.explode = damp(s.explode, k.explode, 4);
    for (const g of guideKeys) s.show[g] = damp(s.show[g] ?? 0, k.show[g] ?? 0, 5);
    first = false;

    root.position.x = s.gx;
    root.rotation.set(s.tilt, s.rot, 0);
    model.setLayer(s.layer);
    model.setExplode(s.explode);
    model.update(dt);
    applyGuides(model.guides, s.show);

    camTarget.set(k.off[0], k.off[1], k.off[2]);
    if (narrow) {
      // Celular: la tarjeta ocupa la parte de abajo, así que el producto tiene que entrar entero en la franja libre de
      // arriba (`free`, medida por capítulo). Se calcula la distancia de la cámara y el punto que mira para que el
      // producto, de 0 a su alto, quede justo en esa franja.
      const f = MathUtils.lerp(free[k.i], free[k.i + 1], k.t);
      const top = size.H + 0.08 * sc;
      const bottom = -0.05 * sc;
      // A lo ancho tiene que entrar el producto girado con sus cotas y, si se ven, también las etiquetas (un cuarto
      // más de margen). Sin esto, en el banco la etiqueta "Alto" quedaba cortada en el borde.
      const m = Math.max(size.W, size.D);
      const reach = Math.hypot(size.W / 2 + 0.08 * m, size.D / 2 + 0.08 * m);
      const labels = Math.max(0, ...guideKeys.map((g) => s.show[g] ?? 0));
      const hh = Math.max((top - bottom) / (2 * f - 0.08), reach / (1 - 0.25 * labels) / aspect);
      look.set(0, bottom + (2 * f - 1) * hh, 0);
      camTarget.normalize().multiplyScalar(hh / TAN_HALF_FOV).add(look);
    } else {
      look.set(0, size.H * k.look, 0);
      camTarget.multiplyScalar(sc).add(look);
    }
    if (snap) camera.position.copy(camTarget);
    else {
      camera.position.x = MathUtils.damp(camera.position.x, camTarget.x, 3, dt);
      camera.position.y = MathUtils.damp(camera.position.y, camTarget.y, 3, dt);
      camera.position.z = MathUtils.damp(camera.position.z, camTarget.z, 3, dt);
    }
    camera.lookAt(look);

    if (!reducedMotion) {
      ring.material.opacity = 0.4 + Math.sin(t * 1.6) * 0.15;
      ring.rotation.z = t * 0.2;
    }
    if (dust) {
      dust.rotation.y = t * 0.02;
      dust.position.y = Math.sin(t * 0.4) * 0.03;
    }
    renderer.render(scene, camera);

    if (onLabels) {
      if (guideKeys.some((g) => s.show[g] > 0.02)) {
        onLabels(labelPositions(model.guides.anchors, camera, host, root), s.show);
        labelsShown = true;
      } else if (labelsShown) {
        onLabels(null, {});
        labelsShown = false;
      }
    }
  });

  return {
    setProgress(p) { progress = p; },
    setOption: (k, item) => model.setOption(k, item),
    /** Celular: por capítulo, la fracción de pantalla libre arriba de la tarjeta (0 a 1). */
    setFreeSpace(fractions) {
      if (fractions?.length === kfs.length) free = fractions.map((f) => MathUtils.clamp(f, 0.18, 0.62));
    },
    dispose() {
      loop.dispose();
      ro.disconnect();
      window.removeEventListener('pointermove', onMove);
      renderer.domElement.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointerup', onUp);
      disposeAll(scene, renderer, pmrem, envRT, model.textures);
    },
  };
}
