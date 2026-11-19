/**
 * Sillón BKF en 3D (three.js puro, sin React Three Fiber: el sitio usa React 18 y evita librerías extra).
 *
 * Dos usos, mismo modelo:
 *  - `createBkfViewer`: el visor de la galería de /sillon-bkf/ (se gira y se acerca, muestra las cotas).
 *  - `createBkfStage`: la escena del showroom de la home, manejada por el scroll (capítulos).
 *
 * Este módulo pesa lo que pesa three.js, así que NUNCA se importa de forma estática: los componentes lo piden con
 * `import()` recién cuando hace falta. No corre en el prerender (no toca `window` al importarse).
 *
 * La silla se modela por código siguiendo la estructura real: dos varillas cerradas de hierro de 12 mm que se
 * cruzan en X adelante y atrás, con el cuero colgado de las cuatro puntas. Después se escala para que su caja mida
 * EXACTAMENTE las medidas de `product.dimensions` (77 x 87 x 102 cm).
 */
import {
  Box3, BufferGeometry, CanvasTexture, CatmullRomCurve3, Color, CurvePath, DirectionalLight, DoubleSide,
  Float32BufferAttribute, Group, LineBasicMaterial, LineCurve3, LineSegments, MathUtils, Mesh, MeshBasicMaterial,
  MeshPhysicalMaterial, MeshStandardMaterial, PerspectiveCamera, PlaneGeometry, PMREMGenerator, Points, PointsMaterial,
  NeutralToneMapping, QuadraticBezierCurve3, RepeatWrapping, RingGeometry, Scene, SRGBColorSpace, TubeGeometry, Vector3, WebGLRenderer,
} from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

/* ---------- Geometría de la silla ---------- */

const V = (x, y, z) => new Vector3(x, y, z);
const ROD = 0.006; // radio de la varilla: 12 mm de diámetro, en metros

// Puntos de la estructura en metros (proporciones tomadas de FOTOCONMEDIDAS.png). La escala final la fija buildChair.
const P = {
  BL: V(-0.33, 1.0, -0.42), BR: V(0.33, 1.0, -0.42), // puntas de atrás (las más altas)
  FL: V(-0.38, 0.44, 0.42), FR: V(0.38, 0.44, 0.42), // puntas de adelante (alas del asiento)
  fFL: V(-0.27, ROD, 0.3), fFR: V(0.27, ROD, 0.3), // apoyos delanteros
  fBL: V(-0.24, ROD, -0.25), fBR: V(0.24, ROD, -0.25), // apoyos traseros
};
// Cada varilla es un lazo cerrado: punta de atrás → apoyo trasero opuesto → punta delantera → apoyo delantero opuesto.
const RODS = [
  [P.BL, P.fBR, P.FR, P.fFL],
  [P.BR, P.fBL, P.FL, P.fFR],
];

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

/** Punto (u, v) del cuero: interpolado entre las 4 puntas, con la caída del asiento y los bordes de "mariposa". */
function slingPoint(U, Vv, out) {
  const a = new Vector3().lerpVectors(P.BL, P.BR, U);
  const b = new Vector3().lerpVectors(P.FL, P.FR, U);
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

function buildSling(seg = 56) {
  const pos = [];
  const uv = [];
  const idx = [];
  const p = new Vector3();
  for (let j = 0; j <= seg; j++) {
    for (let i = 0; i <= seg; i++) {
      slingPoint(i / seg, j / seg, p);
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

/** Costura perimetral del cuero: le da espesor al borde. */
function buildHem(seg = 40) {
  const pts = [];
  const p = new Vector3();
  for (let i = 0; i < seg; i++) pts.push(slingPoint(i / seg, 0, p).clone());
  for (let j = 0; j < seg; j++) pts.push(slingPoint(1, j / seg, p).clone());
  for (let i = seg; i > 0; i--) pts.push(slingPoint(i / seg, 1, p).clone());
  for (let j = seg; j > 0; j--) pts.push(slingPoint(0, j / seg, p).clone());
  return new TubeGeometry(new CatmullRomCurve3(pts, true, 'centripetal'), 320, 0.005, 8, true);
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

/** Degradé radial: sombra bajo la silla y partículas de polvo. */
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

/** Sombra suave bajo la silla (más barata que sombras en tiempo real). */
function shadowPlane(w, d, strength) {
  const mesh = new Mesh(
    new PlaneGeometry(w * 1.5, d * 1.5),
    new MeshBasicMaterial({ map: radialTexture(`rgba(0,0,0,${strength})`, 'rgba(0,0,0,0)'), transparent: true, depthWrite: false }),
  );
  mesh.rotation.x = -Math.PI / 2;
  mesh.position.y = 0.001;
  return mesh;
}

/* ---------- Silla completa, a escala exacta ---------- */

// Cómo se ve cada acabado de FINISH_COLORS (data/products.js). Las claves son los `name` de esa lista.
const FINISH_LOOK = {
  'Negro Mate': { color: '#1a1a1a', metalness: 0.35, roughness: 0.62 },
  'Blanco Crema': { color: '#f2ece2', metalness: 0.1, roughness: 0.45 },
  Cromado: { color: '#f4f4f4', metalness: 1, roughness: 0.12 },
  'Verde Oliva': { color: '#556b2f', metalness: 0.3, roughness: 0.5 },
  'Rojo Kappa': { color: '#b71c1c', metalness: 0.3, roughness: 0.45 },
};

/**
 * Arma la silla y la escala para que su caja (estructura + cuero) mida exactamente `dimensions` y apoye en el piso.
 * Devuelve el grupo, el subgrupo del cuero (para hacerlo desaparecer) y `paint`, que cambia los colores con transición.
 */
function buildChair({ dimensions, finish, leather }) {
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
  for (const pts of RODS) group.add(new Mesh(new TubeGeometry(roundedLoop(pts, 0.07), 360, ROD, 12, true), mats.frame));
  const leatherGroup = new Group();
  leatherGroup.add(new Mesh(buildSling(), mats.leather), new Mesh(buildHem(), mats.hem));
  group.add(leatherGroup);

  const size = new Box3().setFromObject(group).getSize(new Vector3());
  group.scale.set(W / size.x, H / size.y, D / size.z);
  const box = new Box3().setFromObject(group);
  const center = box.getCenter(new Vector3());
  group.position.set(-center.x, -box.min.y, -center.z);

  const target = { frame: new Color(), leather: new Color(), metal: 0, rough: 0 };
  const paint = {
    setFinish(name) {
      const look = FINISH_LOOK[name] ?? FINISH_LOOK['Negro Mate'];
      target.frame.set(look.color);
      target.metal = look.metalness;
      target.rough = look.roughness;
    },
    setLeather(hex) {
      target.leather.set(hex);
    },
    /** k = cuánto acercarse al color pedido en este cuadro (1 = de golpe). */
    update(k) {
      mats.frame.color.lerp(target.frame, k);
      mats.frame.metalness += (target.metal - mats.frame.metalness) * k;
      mats.frame.roughness += (target.rough - mats.frame.roughness) * k;
      mats.leather.color.lerp(target.leather, k);
      mats.hem.color.copy(mats.leather.color).multiplyScalar(0.55);
    },
  };
  paint.setFinish(finish);
  paint.setLeather(leather);
  paint.update(1);
  return { group, leatherGroup, mats, paint, textures: [grain], W, D, H };
}

/** Cuero visible (1) o disuelto (0): se desvanece y "flota" hacia arriba, y queda la estructura. */
function setLeatherAmount(chair, a) {
  const e = a * a * (3 - 2 * a);
  chair.leatherGroup.visible = a > 0.02;
  chair.leatherGroup.position.y = (1 - e) * 0.15;
  for (const m of [chair.mats.leather, chair.mats.hem]) {
    m.opacity = e;
    const transparent = e < 0.999;
    if (m.transparent !== transparent) {
      m.transparent = transparent;
      m.needsUpdate = true;
    }
  }
  chair.mats.leather.depthWrite = e > 0.5;
}

/** Líneas de cota (ancho, profundidad, alto) con sus topes, y el punto donde va cada etiqueta. */
function dimensionLines(w, d, h, color) {
  const off = 0.07;
  const tick = 0.025;
  const x = w / 2;
  const z = d / 2;
  const seg = [];
  const line = (a, b) => seg.push(...a, ...b);
  // Ancho: adelante, a ras del piso.
  line([-x, 0, z + off], [x, 0, z + off]);
  line([-x, -tick, z + off], [-x, tick, z + off]);
  line([x, -tick, z + off], [x, tick, z + off]);
  // Profundidad: a la derecha, a ras del piso.
  line([x + off, 0, -z], [x + off, 0, z]);
  line([x + off, -tick, -z], [x + off, tick, -z]);
  line([x + off, -tick, z], [x + off, tick, z]);
  // Alto: vertical, atrás a la derecha.
  line([x + off, 0, -z - off], [x + off, h, -z - off]);
  line([x + off - tick, 0, -z - off], [x + off + tick, 0, -z - off]);
  line([x + off - tick, h, -z - off], [x + off + tick, h, -z - off]);
  const g = new BufferGeometry();
  g.setAttribute('position', new Float32BufferAttribute(seg, 3));
  const lines = new LineSegments(g, new LineBasicMaterial({ color, depthTest: false, transparent: true }));
  lines.renderOrder = 2;
  const anchors = { width: V(0, 0, z + off), depth: V(x + off, 0, 0), height: V(x + off, h / 2, -z - off) };
  return { lines, anchors };
}

/** Posición en pantalla (px dentro de `host`) de cada etiqueta de cota. */
function labelPositions(anchors, camera, host, root) {
  const out = {};
  const v = new Vector3();
  const w = host.clientWidth;
  const h = host.clientHeight;
  for (const [key, p] of Object.entries(anchors)) {
    v.copy(p);
    root?.localToWorld(v);
    v.project(camera);
    out[key] = { x: (v.x * 0.5 + 0.5) * w, y: (-v.y * 0.5 + 0.5) * h, visible: v.z < 1 };
  }
  return out;
}

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
  const io = new IntersectionObserver(([e]) => {
    visible = e.isIntersecting;
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

/* ---------- Visor de la galería (/sillon-bkf/) ---------- */

/**
 * @param {HTMLElement} host
 * @param {{ dimensions: {width:number, depth:number, height:number}, finish: string, leather: string,
 *           reducedMotion?: boolean, onLabels?: (pos: Record<string, {x:number, y:number, visible:boolean}> | null) => void }} opts
 */
export function createBkfViewer(host, opts) {
  const { reducedMotion, onLabels } = opts;
  const { renderer, scene, pmrem, envRT } = makeRenderer(host, { exposure: 1, maxDpr: 2 });
  const chair = buildChair(opts);
  const { W, D, H } = chair;

  const root = new Group();
  const dims = dimensionLines(W, D, H, '#b71c1c');
  dims.lines.visible = false;
  root.add(chair.group, shadowPlane(W, D, 0.38), dims.lines);
  scene.add(root);

  const camera = new PerspectiveCamera(30, 1, 0.05, 20);
  camera.position.set(1.75, 1.2, 2.55);
  const controls = new OrbitControls(camera, renderer.domElement);
  // Mirar un poco por debajo del centro sube la silla en el cuadro: la cota del ancho no queda bajo el pie de foto.
  controls.target.set(0, H * 0.36, 0);
  controls.enableDamping = true;
  controls.enablePan = false;
  controls.minDistance = 1.4;
  controls.maxDistance = 5;
  controls.maxPolarAngle = MathUtils.degToRad(88);
  controls.autoRotate = !reducedMotion;
  controls.autoRotateSpeed = 1.2;
  controls.addEventListener('start', () => { controls.autoRotate = false; });
  controls.update();

  // En formatos apaisados (mobile 5:4) falta alto: se abre el ángulo para que entren la silla y las cotas.
  const ro = observeSize(host, renderer, camera, { fov: (aspect) => (aspect > 1.1 ? 37 : 30) });

  const loop = createLoop(host, (dt) => {
    chair.paint.update(1 - Math.exp(-dt * 6));
    controls.update();
    renderer.render(scene, camera);
    if (dims.lines.visible && onLabels) onLabels(labelPositions(dims.anchors, camera, host));
  });

  return {
    setFinish: chair.paint.setFinish,
    setLeather: chair.paint.setLeather,
    setMeasures(on) {
      dims.lines.visible = on;
      if (!on) onLabels?.(null);
    },
    dispose() {
      loop.dispose();
      ro.disconnect();
      controls.dispose();
      disposeAll(scene, renderer, pmrem, envRT, chair.textures);
    },
  };
}

/* ---------- Showroom de la home: la silla que se mueve con el scroll ---------- */

// Un keyframe por capítulo. p = progreso 0→1 de la sección; los capítulos están en 0, 1/3, 2/3 y 1.
//   off: cámara relativa al punto que mira · gx: corrimiento lateral (la silla va del lado opuesto al texto)
//   rot: giro · leather: cuero visible · dims: cotas visibles
const STAGE_KF = [
  { p: 0, off: [0, 0.25, 3.3], gx: 0.5, rot: -0.55, leather: 1, dims: 0 }, // diseño de 1938
  { p: 1 / 3, off: [0.3, 0.05, 2.6], gx: -0.45, rot: 0.85, leather: 0, dims: 0 }, // estructura: el cuero se disuelve
  { p: 2 / 3, off: [0, 0.75, 3], gx: 0.45, rot: 2.55, leather: 1, dims: 0 }, // cuero
  { p: 1, off: [0.2, 0.35, 3.4], gx: -0.5, rot: Math.PI * 2 - 0.75, leather: 1, dims: 1 }, // medidas y acabados
];

const smooth = (t) => t * t * (3 - 2 * t);
function sampleStage(p) {
  p = MathUtils.clamp(p, 0, 1);
  let i = 0;
  while (i < STAGE_KF.length - 2 && p > STAGE_KF[i + 1].p) i++;
  const a = STAGE_KF[i];
  const b = STAGE_KF[i + 1];
  // Cada capítulo se queda quieto un rato y la transición ocurre en el medio del tramo.
  const t = smooth(MathUtils.clamp(((p - a.p) / (b.p - a.p) - 0.2) / 0.6, 0, 1));
  const L = MathUtils.lerp;
  return {
    i,
    t,
    off: [L(a.off[0], b.off[0], t), L(a.off[1], b.off[1], t), L(a.off[2], b.off[2], t)],
    gx: L(a.gx, b.gx, t),
    rot: L(a.rot, b.rot, t),
    leather: L(a.leather, b.leather, t),
    dims: L(a.dims, b.dims, t),
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
 * @param {{ dimensions: object, finish: string, leather: string, reducedMotion?: boolean,
 *           onLabels?: (pos: object | null, amount: number) => void }} opts
 */
export function createBkfStage(host, opts) {
  const { reducedMotion, onLabels } = opts;
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

  const chair = buildChair(opts);
  const { W, D, H } = chair;
  const root = new Group();
  const dims = dimensionLines(W, D, H, '#e2574f');
  dims.lines.visible = false;
  // Pedestal: un arco rojo que respira y un aro fino.
  const ring = new Mesh(
    new RingGeometry(0.62, 0.632, 128, 1, 0, Math.PI * 1.6),
    new MeshBasicMaterial({ color: '#e0302b', transparent: true, opacity: 0.5, toneMapped: false, side: DoubleSide }),
  );
  const halo = new Mesh(new RingGeometry(0.7, 0.703, 128), new MeshBasicMaterial({ color: '#fafaf8', transparent: true, opacity: 0.12, side: DoubleSide }));
  for (const m of [ring, halo]) {
    m.rotation.x = -Math.PI / 2;
    m.position.y = 0.002;
  }
  root.add(chair.group, shadowPlane(W, D, 0.6), ring, halo, dims.lines);
  scene.add(root);
  const dust = reducedMotion ? null : makeDust();
  if (dust) scene.add(dust);

  const camera = new PerspectiveCamera(30, 1, 0.05, 30);
  const TAN_HALF_FOV = Math.tan(MathUtils.degToRad(15));
  const look = new Vector3();
  const camTarget = new Vector3();
  let narrow = false;
  let aspect = 1;
  // Celular: fracción de la pantalla (desde arriba) que deja libre la tarjeta de cada capítulo. La mide el
  // componente con `setFreeSpace`; estos valores son solo el arranque.
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
  const s = { gx: 0, rot: 0, tilt: 0, leather: 1, dims: 0 };

  const loop = createLoop(host, (dt, t) => {
    const k = sampleStage(progress);
    // Con "reducir movimiento" (y en el primer cuadro) todo va directo a su lugar, sin recorrido.
    const snap = reducedMotion || first;
    const damp = (cur, to, lambda) => (snap ? to : MathUtils.damp(cur, to, lambda, dt));
    if (!drag.active) {
      drag.offset += drag.vel;
      drag.vel *= 0.92;
    }
    const sway = reducedMotion ? 0 : Math.sin(t * 0.3) * 0.3;
    s.gx = damp(s.gx, narrow ? 0 : k.gx, 3.5);
    s.rot = damp(s.rot, k.rot + sway + drag.offset + (reducedMotion ? 0 : pointer.x * 0.25), 4);
    s.tilt = damp(s.tilt, reducedMotion ? 0 : -pointer.y * 0.04, 4);
    s.leather = damp(s.leather, k.leather, 5);
    s.dims = damp(s.dims, k.dims, 5);
    first = false;

    root.position.x = s.gx;
    root.rotation.set(s.tilt, s.rot, 0);
    setLeatherAmount(chair, s.leather);
    dims.lines.visible = s.dims > 0.02;
    dims.lines.material.opacity = s.dims;

    camTarget.set(k.off[0], k.off[1], k.off[2]);
    if (narrow) {
      // Celular: la tarjeta ocupa la parte de abajo, así que la silla tiene que entrar entera en la franja libre de
      // arriba (`free`, medida por capítulo). Se calcula la distancia de la cámara y el punto que mira para que la
      // silla, de 0 a H, quede justo en esa franja.
      const f = MathUtils.lerp(free[k.i], free[k.i + 1], k.t);
      const top = H + 0.08;
      const bottom = -0.05;
      const hh = Math.max((top - bottom) / (2 * f - 0.08), 0.62 / aspect);
      look.set(0, bottom + (2 * f - 1) * hh, 0);
      camTarget.normalize().multiplyScalar(hh / TAN_HALF_FOV).add(look);
    } else {
      look.set(0, H * 0.43, 0);
      camTarget.add(look);
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
    chair.paint.update(1 - Math.exp(-dt * 5));
    renderer.render(scene, camera);

    if (onLabels) {
      if (dims.lines.visible) {
        onLabels(labelPositions(dims.anchors, camera, host, root), s.dims);
        labelsShown = true;
      } else if (labelsShown) {
        onLabels(null, 0);
        labelsShown = false;
      }
    }
  });

  return {
    setProgress(p) { progress = p; },
    /** Celular: por capítulo, la fracción de pantalla libre arriba de la tarjeta (0 a 1). */
    setFreeSpace(fractions) {
      if (fractions?.length === STAGE_KF.length) free = fractions.map((f) => MathUtils.clamp(f, 0.22, 0.62));
    },
    setFinish: chair.paint.setFinish,
    setLeather: chair.paint.setLeather,
    dispose() {
      loop.dispose();
      ro.disconnect();
      window.removeEventListener('pointermove', onMove);
      renderer.domElement.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointerup', onUp);
      disposeAll(scene, renderer, pmrem, envRT, chair.textures);
    },
  };
}
