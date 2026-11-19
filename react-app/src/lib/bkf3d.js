/**
 * Visor 3D del Sillón BKF (three.js puro, sin React Three Fiber: el sitio usa React 18 y evita librerías extra).
 *
 * Este módulo pesa lo que pesa three.js, así que NUNCA se importa de forma estática: `Bkf3D.jsx` lo pide con
 * `import()` recién cuando alguien toca "Ver en 3D". No corre en el prerender (no toca `window` al importarse).
 *
 * La silla se modela por código siguiendo la estructura real: dos varillas cerradas de hierro de 12 mm que se
 * cruzan en X adelante y atrás (como en la foto del esqueleto), con el cuero colgado de las cuatro puntas.
 * Después se escala para que su caja mida EXACTAMENTE las medidas de `product.dimensions` (77 x 87 x 102 cm).
 */
import {
  ACESFilmicToneMapping, BufferGeometry, CanvasTexture, CatmullRomCurve3, Color, CurvePath, DoubleSide, Float32BufferAttribute,
  Group, LineBasicMaterial, LineCurve3, LineSegments, Mesh, MeshBasicMaterial, MeshPhysicalMaterial, MeshStandardMaterial,
  PerspectiveCamera, PlaneGeometry, PMREMGenerator, QuadraticBezierCurve3, RepeatWrapping, Scene, SRGBColorSpace, TubeGeometry,
  Vector3, WebGLRenderer, Box3, MathUtils,
} from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

const V = (x, y, z) => new Vector3(x, y, z);
const ROD = 0.006; // radio de la varilla: 12 mm de diámetro, en metros

// Puntos de la estructura en metros (proporciones tomadas de FOTOCONMEDIDAS.png). La escala final la fija `fitTo`.
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

/** Textura de ruido para el poro del cuero (se genera en el navegador, no se descarga). */
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
  t.wrapS = t.wrapT = RepeatWrapping;
  t.repeat.set(6, 6);
  return t;
}

/** Sombra suave bajo la silla: un degradé radial en un plano (más barato que sombras en tiempo real). */
function shadowPlane(w, d) {
  const c = document.createElement('canvas');
  c.width = c.height = 128;
  const ctx = c.getContext('2d');
  const g = ctx.createRadialGradient(64, 64, 4, 64, 64, 64);
  g.addColorStop(0, 'rgba(0,0,0,0.38)');
  g.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 128, 128);
  const mesh = new Mesh(new PlaneGeometry(w * 1.5, d * 1.5), new MeshBasicMaterial({ map: new CanvasTexture(c), transparent: true, depthWrite: false }));
  mesh.rotation.x = -Math.PI / 2;
  mesh.position.y = 0.001;
  return mesh;
}

// Cómo se ve cada acabado de FINISH_COLORS (data/products.js). Las claves son los `name` de esa lista.
const FINISH_LOOK = {
  'Negro Mate': { color: '#1a1a1a', metalness: 0.35, roughness: 0.62 },
  'Blanco Crema': { color: '#f2ece2', metalness: 0.1, roughness: 0.45 },
  Cromado: { color: '#f4f4f4', metalness: 1, roughness: 0.12 },
  'Verde Oliva': { color: '#556b2f', metalness: 0.3, roughness: 0.5 },
  'Rojo Kappa': { color: '#b71c1c', metalness: 0.3, roughness: 0.45 },
};

/** Líneas de cota (ancho, profundidad, alto) con sus topes, en el sistema de la silla ya escalada. */
function dimensionLines(w, d, h) {
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
  const lines = new LineSegments(g, new LineBasicMaterial({ color: '#b71c1c', depthTest: false, transparent: true }));
  lines.renderOrder = 2;
  // Dónde va cada etiqueta (el componente las ubica en pantalla).
  const anchors = {
    width: V(0, 0, z + off),
    depth: V(x + off, 0, 0),
    height: V(x + off, h / 2, -z - off),
  };
  return { lines, anchors };
}

/**
 * Monta el visor en `host` (un <div>). Devuelve los controles del visor.
 * @param {HTMLElement} host
 * @param {{ dimensions: {width:number, depth:number, height:number}, finish: string, leather: string,
 *           reducedMotion?: boolean, onLabels?: (pos: Record<string, {x:number, y:number, visible:boolean}>) => void }} opts
 */
export function createBkfViewer(host, opts) {
  const { dimensions, reducedMotion, onLabels } = opts;
  const W = dimensions.width / 100;
  const D = dimensions.depth / 100;
  const H = dimensions.height / 100;

  const renderer = new WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.outputColorSpace = SRGBColorSpace;
  renderer.toneMapping = ACESFilmicToneMapping;
  renderer.toneMappingExposure = 0.95;
  host.appendChild(renderer.domElement);

  const scene = new Scene();
  const pmrem = new PMREMGenerator(renderer);
  const envRT = pmrem.fromScene(new RoomEnvironment(), 0.04);
  scene.environment = envRT.texture;

  // Materiales
  const grain = grainTexture();
  const frameMat = new MeshStandardMaterial();
  // Brillo bajo y sin sheen claro: con más, el marrón se veía rosado y no coincidía con la muestra de color.
  const leatherMat = new MeshPhysicalMaterial({
    side: DoubleSide, roughness: 0.55, sheen: 0.2, sheenRoughness: 0.6, sheenColor: new Color('#7a4a2c'),
    clearcoat: 0.2, clearcoatRoughness: 0.45, bumpMap: grain, bumpScale: 0.3, envMapIntensity: 0.7,
  });
  const hemMat = new MeshStandardMaterial({ roughness: 0.5 });

  // Silla
  const chair = new Group();
  for (const pts of RODS) chair.add(new Mesh(new TubeGeometry(roundedLoop(pts, 0.07), 360, ROD, 12, true), frameMat));
  chair.add(new Mesh(buildSling(), leatherMat));
  chair.add(new Mesh(buildHem(), hemMat));

  // Escala exacta: la caja de la silla (estructura + cuero) pasa a medir W x H x D y apoya en el piso.
  const box = new Box3().setFromObject(chair);
  const size = box.getSize(new Vector3());
  chair.scale.set(W / size.x, H / size.y, D / size.z);
  const scaled = new Box3().setFromObject(chair);
  const center = scaled.getCenter(new Vector3());
  chair.position.set(-center.x, -scaled.min.y, -center.z);

  const root = new Group();
  root.add(chair);
  root.add(shadowPlane(W, D));
  const dims = dimensionLines(W, D, H);
  dims.lines.visible = false;
  root.add(dims.lines);
  scene.add(root);

  // Luces de apoyo (el ambiente lo da RoomEnvironment).
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

  // Colores: transición suave al cambiar de acabado.
  const target = { frame: new Color(), leather: new Color(), metal: 0, rough: 0 };
  function setFinish(name) {
    const look = FINISH_LOOK[name] ?? FINISH_LOOK['Negro Mate'];
    target.frame.set(look.color);
    target.metal = look.metalness;
    target.rough = look.roughness;
  }
  function setLeather(hex) {
    target.leather.set(hex);
  }
  setFinish(opts.finish);
  setLeather(opts.leather);
  frameMat.color.copy(target.frame);
  frameMat.metalness = target.metal;
  frameMat.roughness = target.rough;
  leatherMat.color.copy(target.leather);
  hemMat.color.copy(target.leather).multiplyScalar(0.55);

  // Tamaño: sigue al contenedor.
  function resize() {
    const { clientWidth: w, clientHeight: h } = host;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    // En formatos apaisados (mobile 5:4) falta alto: se abre el ángulo para que entren la silla y las cotas.
    camera.fov = w / h > 1.1 ? 37 : 30;
    camera.updateProjectionMatrix();
  }
  const ro = new ResizeObserver(resize);
  ro.observe(host);
  resize();

  // Bucle: corre solo mientras el visor está en pantalla y la pestaña visible.
  let raf = 0;
  let visible = true;
  let last = performance.now();
  const tmp = new Vector3();
  function frame(now) {
    raf = requestAnimationFrame(frame);
    const dt = Math.min((now - last) / 1000, 0.05);
    last = now;
    const k = 1 - Math.exp(-dt * 6);
    frameMat.color.lerp(target.frame, k);
    frameMat.metalness += (target.metal - frameMat.metalness) * k;
    frameMat.roughness += (target.rough - frameMat.roughness) * k;
    leatherMat.color.lerp(target.leather, k);
    hemMat.color.copy(leatherMat.color).multiplyScalar(0.55);
    controls.update();
    renderer.render(scene, camera);

    if (dims.lines.visible && onLabels) {
      const out = {};
      const { clientWidth: w, clientHeight: h } = host;
      for (const [key, p] of Object.entries(dims.anchors)) {
        tmp.copy(p).project(camera);
        out[key] = { x: (tmp.x * 0.5 + 0.5) * w, y: (-tmp.y * 0.5 + 0.5) * h, visible: tmp.z < 1 };
      }
      onLabels(out);
    }
  }
  function start() {
    if (!raf && visible && !document.hidden) {
      last = performance.now();
      raf = requestAnimationFrame(frame);
    }
  }
  function stop() {
    cancelAnimationFrame(raf);
    raf = 0;
  }
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
    setFinish,
    setLeather,
    setMeasures(on) {
      dims.lines.visible = on;
      if (!on) onLabels?.(null);
    },
    dispose() {
      stop();
      io.disconnect();
      ro.disconnect();
      document.removeEventListener('visibilitychange', onVis);
      controls.dispose();
      scene.traverse((o) => {
        o.geometry?.dispose();
        if (o.material) {
          o.material.map?.dispose();
          o.material.dispose();
        }
      });
      grain.dispose();
      envRT.dispose();
      pmrem.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    },
  };
}
