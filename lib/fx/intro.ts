/* Intro de cine: un disco de vinilo en 3D (three.js) que cae, gira y la cámara entra hasta la etiqueta. */

const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const easeIO = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const easeO = (t: number) => 1 - Math.pow(1 - t, 3);
/** Contador tipo claqueta que termina en 02:22. */
export const timecode = (p: number) => {
  const s = Math.round(clamp(p, 0, 1) * 142);
  return `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
};

type Three = typeof import("three");

export function makeDisc(T: Three, intro: HTMLElement, host: HTMLElement, cnt: HTMLElement, onDone: () => void) {
  // Un lienzo nuevo en cada repetición para empezar con un contexto WebGL limpio.
  const canvas = document.createElement("canvas");
  canvas.id = "gl";
  host.replaceChildren(canvas);

  const renderer = new T.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.outputColorSpace = T.SRGBColorSpace;
  const scene = new T.Scene();
  const cam = new T.PerspectiveCamera(40, 1, 0.05, 50);
  const tilt = new T.Group();
  const spin = new T.Group();
  tilt.add(spin);
  scene.add(tilt);

  const tex = (c: HTMLCanvasElement) => {
    const t = new T.CanvasTexture(c);
    t.colorSpace = T.SRGBColorSpace;
    t.anisotropy = 8;
    return t;
  };

  // Surcos
  const gc = document.createElement("canvas");
  gc.width = gc.height = 1024;
  const g = gc.getContext("2d")!;
  g.fillStyle = "#0b0c08";
  g.fillRect(0, 0, 1024, 1024);
  for (let r = 170; r < 505; r += 2.2) {
    g.strokeStyle = `rgba(125,134,92,${(0.1 + 0.13 * Math.random()).toFixed(3)})`;
    g.lineWidth = 1;
    g.beginPath();
    g.arc(512, 512, r, 0, Math.PI * 2);
    g.stroke();
  }
  [250, 330, 410].forEach((r) => {
    g.strokeStyle = "rgba(0,0,0,.9)";
    g.lineWidth = 5;
    g.beginPath();
    g.arc(512, 512, r, 0, Math.PI * 2);
    g.stroke();
  });
  g.strokeStyle = "rgba(157,174,90,.4)";
  g.lineWidth = 3;
  g.beginPath();
  g.arc(512, 512, 503, 0, Math.PI * 2);
  g.stroke();
  const grooveTex = tex(gc);

  // Etiqueta
  const lc = document.createElement("canvas");
  lc.width = lc.height = 1024;
  const l = lc.getContext("2d")!;
  const css = getComputedStyle(document.documentElement);
  const disp = css.getPropertyValue("--font-inter").trim() || "Arial";
  const cine = css.getPropertyValue("--font-courier").trim() || "monospace";
  const drawLabel = () => {
    l.fillStyle = "#9DAE5A";
    l.fillRect(0, 0, 1024, 1024);
    l.strokeStyle = "rgba(14,15,11,.35)";
    l.lineWidth = 2;
    l.beginPath();
    l.arc(512, 512, 470, 0, Math.PI * 2);
    l.stroke();
    l.beginPath();
    l.arc(512, 512, 440, 0, Math.PI * 2);
    l.stroke();
    l.fillStyle = "#0E0F0B";
    l.textAlign = "center";
    l.font = `400 54px ${cine}, monospace`;
    l.fillText("PORTAFOLIO", 512, 330);
    l.font = `600 220px ${disp}, Arial, sans-serif`;
    l.fillText("GABS", 512, 720);
    l.font = `400 50px ${cine}, monospace`;
    l.fillText("2026 · LADO A", 512, 830);
    l.beginPath();
    l.arc(512, 512, 26, 0, Math.PI * 2);
    l.fillStyle = "#0E0F0B";
    l.fill();
  };
  drawLabel();
  const labelTex = tex(lc);
  document.fonts?.ready.then(() => {
    drawLabel();
    labelTex.needsUpdate = true;
  });

  const sideMat = new T.MeshStandardMaterial({ color: 0x14160e, roughness: 0.6, metalness: 0.3 });
  const topMat = new T.MeshStandardMaterial({ map: grooveTex, bumpMap: grooveTex, bumpScale: 0.5, roughness: 0.36, metalness: 0.55 });
  const disc = new T.Mesh(new T.CylinderGeometry(1, 1, 0.04, 128, 1), [sideMat, topMat, sideMat]);
  spin.add(disc);
  const label = new T.Mesh(new T.CircleGeometry(0.34, 96), new T.MeshStandardMaterial({ map: labelTex, roughness: 0.5, metalness: 0.1 }));
  label.rotation.x = -Math.PI / 2;
  label.position.y = 0.0215;
  spin.add(label);
  const pin = new T.Mesh(new T.CylinderGeometry(0.016, 0.016, 0.07, 24), new T.MeshStandardMaterial({ color: 0xcfd2c0, roughness: 0.25, metalness: 0.9 }));
  pin.position.y = 0.03;
  spin.add(pin);

  // Brillo del vinilo
  const sc = document.createElement("canvas");
  sc.width = sc.height = 512;
  const s = sc.getContext("2d")!;
  if (s.createConicGradient) {
    const cg = s.createConicGradient(0.35, 256, 256);
    [
      [0, 0],
      [0.08, 0.6],
      [0.16, 0],
      [0.5, 0],
      [0.58, 0.6],
      [0.66, 0],
      [1, 0],
    ].forEach(([o, a]) => cg.addColorStop(o, `rgba(255,255,255,${a})`));
    s.fillStyle = cg;
    s.fillRect(0, 0, 512, 512);
    const sheen = new T.Mesh(
      new T.CircleGeometry(0.99, 96),
      new T.MeshBasicMaterial({ map: new T.CanvasTexture(sc), transparent: true, blending: T.AdditiveBlending, depthWrite: false, opacity: 0.55 }),
    );
    sheen.rotation.x = -Math.PI / 2;
    sheen.position.y = 0.0208;
    tilt.add(sheen);
  }

  // Luces (intensidades físicas equivalentes a las del prototipo)
  scene.add(new T.AmbientLight(0xffffff, 0.6 * Math.PI));
  const key = new T.DirectionalLight(0xfff4e0, 1.25 * Math.PI);
  key.position.set(2, 3, 4);
  scene.add(key);
  const olive = new T.PointLight(0x9dae5a, 1.6 * Math.PI, 12, 0);
  olive.position.set(-2.4, -1.6, 2.2);
  scene.add(olive);

  let D1 = 4.2;
  let DEnd = 0.5;
  const size = () => {
    const w = intro.clientWidth || innerWidth;
    const h = intro.clientHeight || innerHeight;
    renderer.setSize(w, h, false);
    const aspect = w / h;
    cam.aspect = aspect;
    cam.updateProjectionMatrix();
    D1 = aspect < 1 ? 4.2 / Math.max(0.5, aspect * 1.1) : 4.2;
    DEnd = (0.95 * 0.68) / (0.728 * Math.max(1, aspect));
  };
  size();
  addEventListener("resize", size);

  let t0: number | null = null;
  let last = 0;
  let raf = 0;
  let stopped = false;
  let doneCalled = false;
  let dollyOn = false;
  const TB = 1.9;
  const TD = 1.2;
  const TEND = TB + TD + 0.05;

  const frame = (now: number) => {
    if (stopped) return;
    if (t0 === null) {
      t0 = now;
      last = now;
    }
    const t = (now - t0) / 1000;
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    const p1 = easeO(clamp(t / TB, 0, 1));
    const p2 = easeIO(clamp((t - TB) / TD, 0, 1));
    tilt.rotation.x = lerp(0.25, 1.0, p1) + (Math.PI / 2 - 1.0) * p2;
    tilt.rotation.z = Math.sin(t * 0.9) * 0.09 * (1 - p2);
    tilt.position.y = lerp(-0.9, 0, p1);
    const k = lerp(0.5, 1, p1);
    tilt.scale.set(k, k, k);
    spin.rotation.y += dt * (9 * (1 - p1) + 1.4);
    cam.position.set(0, 0, lerp(D1, DEnd, p2));
    cam.lookAt(0, 0, 0);
    olive.position.x = -2.4 + Math.sin(t * 0.7) * 0.8;
    renderer.render(scene, cam);
    cnt.textContent = timecode(clamp(t / (TB + 0.3), 0, 1));
    if (t > TB && !dollyOn) {
      dollyOn = true;
      intro.classList.add("dolly");
      intro.classList.remove("barsin");
    }
    if (t >= TEND && !doneCalled) {
      doneCalled = true;
      onDone();
    }
    raf = requestAnimationFrame(frame);
  };
  raf = requestAnimationFrame(frame);

  return function stop() {
    stopped = true;
    cancelAnimationFrame(raf);
    removeEventListener("resize", size);
    grooveTex.dispose();
    labelTex.dispose();
    renderer.dispose();
    canvas.remove();
  };
}

export { easeO };
