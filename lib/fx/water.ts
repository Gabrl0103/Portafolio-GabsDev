/* Agua: muchos koi pequeños hechos de puntos, ondas al mover el cursor y el detalle de las 2:22. */

type RGB = [number, number, number];
type Pt = { x: number; y: number };
type BodyDot = { u: number; v: number; s: number; hi: boolean };
type HeadDot = { x: number; y: number; s: number; hi: boolean };
type TailDot = { s: number; th: number; sz: number; hi: boolean };
type FinDot = { f: number; g: number; s: number; hi: boolean };
type Goal = { x: number; y: number; until: number; r: number; dir: number };
type Env = {
  mouse: { x: number; y: number; on: boolean; last: number };
  scroll: number;
  form: boolean;
  cx: number;
  cy: number;
  R: number;
  phase: number;
  w: number;
};

const TAU = Math.PI * 2;
const N = 14;
const BASE = 0.4;
const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));
const rnd = (a: number, b: number) => a + Math.random() * (b - a);
const rgba = (c: RGB, a: number) => `rgba(${c[0]},${c[1]},${c[2]},${a})`;
function angDiff(a: number, b: number) {
  let d = a - b;
  while (d > Math.PI) d -= TAU;
  while (d < -Math.PI) d += TAU;
  return d;
}
function hexRGB(h: string): RGB | null {
  h = (h || "").trim();
  if (h.charAt(0) !== "#") return null;
  if (h.length === 4) h = "#" + h[1] + h[1] + h[2] + h[2] + h[3] + h[3];
  const n = parseInt(h.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

/* Puntos que forman el pez: se reparten una sola vez y luego siguen al cuerpo */
const wprof = (u: number) => Math.pow(Math.sin(Math.PI * Math.pow(u, 0.65)), 0.8) * (1 - 0.25 * u);
function mkBody(count: number) {
  const a: BodyDot[] = [];
  while (a.length < count) {
    const u = Math.random();
    if (Math.random() > wprof(u) + 0.05) continue;
    const edge = Math.random() < 0.4;
    const v = edge ? (Math.random() < 0.5 ? -1 : 1) * (0.9 + Math.random() * 0.12) : rnd(-1, 1);
    a.push({ u, v, s: rnd(0.7, 1.8), hi: rnd(0.4, 1) > 0.72 });
  }
  return a;
}
function mkHead(count: number) {
  const a: HeadDot[] = [];
  while (a.length < count) {
    let x = rnd(-1, 1);
    let y = rnd(-1, 1);
    const d = x * x + y * y;
    if (d > 1) continue;
    if (Math.random() < 0.4) {
      const m = Math.sqrt(d) || 1;
      x /= m;
      y /= m;
    }
    a.push({ x, y, s: rnd(0.7, 1.7), hi: Math.random() > 0.35 });
  }
  return a;
}
function mkTail(count: number) {
  const a: TailDot[] = [];
  for (let i = 0; i < count; i++) {
    const s = Math.random() < 0.3 ? rnd(0.9, 1) : Math.sqrt(Math.random());
    a.push({ s, th: rnd(-1, 1), sz: rnd(0.7, 1.6), hi: Math.random() > 0.4 });
  }
  return a;
}
function mkFin(count: number) {
  const a: FinDot[] = [];
  for (let i = 0; i < count; i++) a.push({ f: Math.random(), g: rnd(-1, 1), s: rnd(0.7, 1.5), hi: Math.random() > 0.45 });
  return a;
}
function pt(g: CanvasRenderingContext2D, x: number, y: number, r: number) {
  x += (Math.random() - 0.5) * 0.7;
  y += (Math.random() - 0.5) * 0.7;
  g.moveTo(x + r, y);
  g.arc(x, y, r, 0, TAU);
}

export function startWater(cv: HTMLCanvasElement) {
  const root = document.documentElement;
  const ctx = cv.getContext("2d");
  if (!ctx) return () => {};
  let W = 0;
  let H = 0;
  let sc = 1;
  const resize = () => {
    W = innerWidth;
    H = innerHeight;
    cv.width = W;
    cv.height = H;
    sc = clamp(Math.min(W, H) / 700, 0.65, 1.4);
  };
  resize();

  let fg: RGB = [233, 230, 218];
  let acc: RGB = [157, 174, 90];
  const readColors = () => {
    const cs = getComputedStyle(root);
    fg = hexRGB(cs.getPropertyValue("--fg")) || fg;
    acc = hexRGB(cs.getPropertyValue("--acc")) || acc;
  };
  readColors();

  class Koi {
    ks = rnd(0.32, 0.6);
    seed = Math.random() * 10;
    base = rnd(30, 56);
    speed: number;
    boost = 0;
    ph = Math.random() * 6;
    seg = 11;
    idx = 0;
    goal: Goal | null = null;
    home: { x: number; y: number; until: number } | null = null;
    pts: Pt[] = [];
    body: BodyDot[];
    head: HeadDot[];
    tail: TailDot[];
    fins: FinDot[][];
    constructor(
      x: number,
      y: number,
      public a: number,
    ) {
      this.speed = this.base;
      for (let i = 0; i < N; i++) this.pts.push({ x: x - Math.cos(a) * i * this.seg * sc * this.ks, y: y - Math.sin(a) * i * this.seg * sc * this.ks });
      const k = this.ks;
      this.body = mkBody(Math.round(110 * k + 34));
      this.head = mkHead(12);
      this.tail = mkTail(Math.round(46 * k + 16));
      this.fins = [mkFin(10), mkFin(10), mkFin(7), mkFin(7)];
    }
    update(dt: number, t: number, all: Koi[], env: Env) {
      const h = this.pts[0];
      const k = sc * this.ks;
      const sg = this.seg * k;
      let vx = Math.cos(this.a);
      let vy = Math.sin(this.a);
      let target = this.base * sc;
      if (this.goal && t > this.goal.until) this.goal = null;
      if (env.form) {
        const sgn = this.idx % 2 ? -1 : 1;
        const Ri = env.R * (this.idx % 2 ? 0.62 : 1);
        const lead = env.phase * sgn + (this.idx * TAU) / all.length * 2 + 0.55 * sgn;
        const tx = env.cx + Math.cos(lead) * Ri;
        const ty = env.cy + Math.sin(lead) * Ri;
        const dx = tx - h.x;
        const dy = ty - h.y;
        const d = Math.hypot(dx, dy) || 1;
        vx = (dx / d) * 3;
        vy = (dy / d) * 3;
        target = Math.max(60, Ri * env.w * 1.05);
      } else if (this.goal) {
        const gx = this.goal.x - h.x;
        const gy = this.goal.y - h.y;
        const gd = Math.hypot(gx, gy) || 1;
        const orb = this.goal.r * sc;
        const dr = this.goal.dir;
        if (gd > orb * 1.7) {
          vx = (gx / gd) * 3;
          vy = (gy / gd) * 3;
          target = this.base * sc * 2.6;
        } else {
          const rad = gd > orb ? 1 : -1;
          vx = (-gy / gd) * dr * 2.2 + (gx / gd) * rad * 0.8;
          vy = (gx / gd) * dr * 2.2 + (gy / gd) * rad * 0.8;
          target = this.base * sc * 1.3;
        }
      } else {
        const w = Math.sin(t * 0.37 + this.seed * 5) * 0.5 + Math.sin(t * 0.91 + this.seed * 2.3) * 0.4;
        vx += -Math.sin(this.a) * w * 0.9;
        vy += Math.cos(this.a) * w * 0.9;
        const ox = Math.abs(h.x - W / 2) - (W / 2 + 140 * sc);
        const oy = Math.abs(h.y - H / 2) - (H / 2 + 140 * sc);
        const out = Math.max(ox, oy);
        if (out > 0) {
          const cx0 = W / 2 - h.x;
          const cy0 = H / 2 - h.y;
          const cd = Math.hypot(cx0, cy0) || 1;
          const kk = Math.min(1, out / 100) * 4;
          vx += (cx0 / cd) * kk;
          vy += (cy0 / cd) * kk;
        }
        if (!this.home || t > this.home.until) this.home = { x: rnd(0, W), y: rnd(0, H), until: t + rnd(10, 22) };
        const hx = this.home.x - h.x;
        const hy = this.home.y - h.y;
        const hd = Math.hypot(hx, hy) || 1;
        if (hd > 140 * sc) {
          vx += (hx / hd) * 0.6;
          vy += (hy / hd) * 0.6;
        }
        let sx = 0;
        let sy = 0;
        const R2 = 130 * sc;
        for (const o of all) {
          if (o === this) continue;
          const ex = o.pts[0].x - h.x;
          const ey = o.pts[0].y - h.y;
          const ed = Math.hypot(ex, ey) || 1;
          if (ed < R2) {
            const f = 1 - ed / R2;
            sx -= (ex / ed) * f;
            sy -= (ey / ed) * f;
          }
        }
        vx += sx * 2;
        vy += sy * 2;
        if (env.mouse.on) {
          const mx = h.x - env.mouse.x;
          const my = h.y - env.mouse.y;
          const md = Math.hypot(mx, my) || 1;
          const R = 170 * sc;
          if (md < R) {
            const k3 = (1 - md / R) * 5;
            vx += (mx / md) * k3;
            vy += (my / md) * k3;
            this.boost = Math.max(this.boost, (1 - md / R) * 80);
          }
        }
        vy += env.scroll * 1.4;
      }
      const ta = Math.atan2(vy, vx);
      this.a += angDiff(ta, this.a) * Math.min(1, dt * (env.form ? 3.2 : 2.2));
      this.a += Math.sin(this.ph) * 0.8 * dt * clamp(this.speed / 45, 0.4, 2.2);
      this.boost *= Math.max(0, 1 - dt * 1.6);
      this.speed += ((target + this.boost) * (1 + Math.abs(env.scroll) * 0.6) - this.speed) * Math.min(1, dt * 2);
      this.ph += dt * (2.8 + this.speed / 16);
      const surge = 1 + 0.28 * Math.sin(this.ph * 2 - 0.6);
      h.x += Math.cos(this.a) * this.speed * surge * dt;
      h.y += Math.sin(this.a) * this.speed * surge * dt;
      for (let i = 1; i < N; i++) {
        const p = this.pts[i];
        const q = this.pts[i - 1];
        const ex2 = p.x - q.x;
        const ey2 = p.y - q.y;
        const ed2 = Math.hypot(ex2, ey2) || 1;
        p.x = q.x + (ex2 / ed2) * sg;
        p.y = q.y + (ey2 / ed2) * sg;
      }
    }
    draw(g: CanvasRenderingContext2D, A: number) {
      const n = N;
      const k = sc * this.ks;
      const sg = this.seg * k;
      const mw = 15 * k;
      const ph = this.ph;
      const amp = (6 + this.speed / 18) * k;
      const P: { x: number; y: number; nx: number; ny: number; w: number; tx: number; ty: number }[] = [];
      for (let i = 0; i < n; i++) {
        const a = this.pts[Math.max(0, i - 1)];
        const b = this.pts[Math.min(n - 1, i + 1)];
        const dx = b.x - a.x;
        const dy = b.y - a.y;
        const d = Math.hypot(dx, dy) || 1;
        const nx = -dy / d;
        const ny = dx / d;
        const u = i / (n - 1);
        const o = Math.sin(ph - i * 0.55) * amp * Math.pow(u, 1.1);
        P.push({ x: this.pts[i].x + nx * o, y: this.pts[i].y + ny * o, nx, ny, w: mw * wprof(u) + 0.8 * k, tx: dx / d, ty: dy / d });
      }
      const hp = P[0];
      const fx = Math.cos(this.a);
      const fy = Math.sin(this.a);
      const tl = P[n - 1];
      const ta2 = Math.atan2(tl.ty, tl.tx);
      const sw = Math.sin(ph - n * 0.55 + 0.8) * 0.45;
      const L = sg * 4.6;
      const flap = Math.sin(ph * 0.9) * 0.25;
      const finDef = [
        { p: P[3], q: P[4], side: 1, size: k, flap },
        { p: P[3], q: P[4], side: -1, size: k, flap: -flap },
        { p: P[8], q: P[9], side: 1, size: k * 0.6, flap: -flap },
        { p: P[8], q: P[9], side: -1, size: k * 0.6, flap },
      ];
      const rs = 0.5 + 0.5 * this.ks;
      for (let pass = 0; pass < 2; pass++) {
        const wantHi = pass === 0;
        g.globalAlpha = A * (wantHi ? 1 : 0.5);
        g.beginPath();
        for (const d of this.body) {
          if (d.hi !== wantHi) continue;
          const u2 = d.u * (n - 1);
          const fi = Math.min(n - 2, Math.floor(u2));
          const fr = u2 - fi;
          const p0 = P[fi];
          const p1 = P[fi + 1];
          const bx = p0.x + (p1.x - p0.x) * fr;
          const by = p0.y + (p1.y - p0.y) * fr;
          const bnx = p0.nx + (p1.nx - p0.nx) * fr;
          const bny = p0.ny + (p1.ny - p0.ny) * fr;
          const bw = p0.w + (p1.w - p0.w) * fr;
          pt(g, bx + bnx * d.v * bw, by + bny * d.v * bw, d.s * rs);
        }
        for (const d of this.head) {
          if (d.hi !== wantHi) continue;
          const x = hp.x + fx * (d.x * mw * 0.55 + mw * 0.1) - fy * d.y * mw * 0.5;
          const y = hp.y + fy * (d.x * mw * 0.55 + mw * 0.1) + fx * d.y * mw * 0.5;
          pt(g, x, y, d.s * rs);
        }
        for (const d of this.tail) {
          if (d.hi !== wantHi) continue;
          const ang = ta2 + sw + d.th * 0.62;
          const len = L * d.s * (0.62 + 0.38 * Math.pow(Math.abs(d.th), 0.8));
          pt(g, tl.x + Math.cos(ang) * len, tl.y + Math.sin(ang) * len, d.sz * rs);
        }
        for (let f = 0; f < 4; f++) {
          const fd = finDef[f];
          const p = fd.p;
          const q = fd.q;
          let bkx = q.x - p.x;
          let bky = q.y - p.y;
          const bd = Math.hypot(bkx, bky) || 1;
          bkx /= bd;
          bky /= bd;
          const ox = p.nx * fd.side;
          const oy = p.ny * fd.side;
          const base0 = p.w * 0.75;
          const outv = (p.w + 16 * fd.size) * (1 + fd.flap);
          const back = 24 * fd.size;
          for (const d of this.fins[f]) {
            if (d.hi !== wantHi) continue;
            const off = base0 + d.f * (outv - base0);
            const bk = d.f * back + d.g * (1 - d.f * 0.8) * back * 0.45;
            pt(g, p.x + ox * off + bkx * bk, p.y + oy * off + bky * bk, d.s * rs);
          }
        }
        g.fill();
      }
      g.globalAlpha = 1;
    }
  }

  const count = clamp(Math.round((W * H) / 34000), 28, 46);
  const koi: Koi[] = [];
  for (let i = 0; i < count; i++) {
    const k = new Koi(rnd(0, W), rnd(0, H), rnd(0, TAU));
    k.idx = i;
    koi.push(k);
  }
  const env: Env = { mouse: { x: 0, y: 0, on: false, last: 0 }, scroll: 0, form: false, cx: 0, cy: 0, R: 150, phase: 0, w: 0.7 };
  const ripples: { x: number; y: number; r: number; max: number; a: number; v: number }[] = [];
  const lastRip = { x: -999, y: -999 };
  const ripple = (x: number, y: number, big: boolean, delay = 0) => {
    if (ripples.length > 45) return;
    ripples.push({ x, y, r: -delay * 60, max: (big ? 160 : 70) * sc, a: big ? 0.34 : 0.2, v: big ? 120 : 60 });
  };

  let t = 0;
  let formEnd = 0;
  let fa = 1;
  const egg = document.createElement("div");
  egg.className = "egg";
  egg.setAttribute("aria-hidden", "true");
  egg.textContent = "2:22";
  document.body.appendChild(egg);
  const timers: ReturnType<typeof setTimeout>[] = [];

  /** Los koi forman dos anillos y aparece "2:22". */
  const trigger222 = () => {
    if (env.form) return;
    env.form = true;
    env.cx = W / 2;
    env.cy = H / 2;
    env.R = clamp(Math.min(W, H) * 0.3, 120 * sc, 300);
    formEnd = t + 13;
    egg.classList.add("on");
    ripple(W / 2, H / 2, true, 0);
    ripple(W / 2, H / 2, true, 0.5);
    ripple(W / 2, H / 2, true, 1);
    timers.push(setTimeout(() => egg.classList.remove("on"), 11500));
  };

  const onMove = (e: PointerEvent) => {
    env.mouse.x = e.clientX;
    env.mouse.y = e.clientY;
    env.mouse.on = true;
    env.mouse.last = performance.now();
    if (Math.hypot(e.clientX - lastRip.x, e.clientY - lastRip.y) > 70) {
      lastRip.x = e.clientX;
      lastRip.y = e.clientY;
      ripple(e.clientX, e.clientY, false);
    }
  };
  const onDown = (e: PointerEvent) => {
    ripple(e.clientX, e.clientY, true, 0);
    ripple(e.clientX, e.clientY, true, 0.35);
    // Unos cuantos koi vienen al clic y dan vueltas un rato.
    const dist = (k: Koi) => Math.hypot(k.pts[0].x - e.clientX, k.pts[0].y - e.clientY);
    koi
      .filter((k) => !k.goal)
      .sort((a, b) => dist(a) - dist(b))
      .slice(0, 5 + Math.floor(Math.random() * 3))
      .forEach((k) => {
        k.goal = { x: e.clientX, y: e.clientY, until: t + rnd(4, 6.5), r: rnd(34, 90), dir: Math.random() < 0.5 ? 1 : -1 };
        k.boost = Math.max(k.boost, 60);
      });
  };
  let lastY = scrollY;
  const onScroll = () => {
    const dy = scrollY - lastY;
    lastY = scrollY;
    env.scroll = clamp(env.scroll + dy / 260, -1, 1);
  };
  let kt: number[] = [];
  const onKey = (e: KeyboardEvent) => {
    if (e.key !== "2") return;
    const tag = (e.target as HTMLElement | null)?.tagName;
    if (tag === "INPUT" || tag === "TEXTAREA") return;
    const now = performance.now();
    kt.push(now);
    kt = kt.filter((x) => now - x < 1500);
    if (kt.length >= 3) {
      kt = [];
      trigger222();
    }
  };
  const chkHash = () => {
    if (location.hash === "#222") timers.push(setTimeout(trigger222, root.classList.contains("ready") ? 300 : 4800));
  };

  addEventListener("resize", resize);
  addEventListener("pointermove", onMove);
  addEventListener("pointerdown", onDown);
  addEventListener("scroll", onScroll, { passive: true });
  addEventListener("keydown", onKey);
  addEventListener("hashchange", chkHash);
  chkHash();

  let last = 0;
  let fc = 0;
  let raf = 0;
  const frame = (now: number) => {
    if (!last) last = now;
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    t += dt;
    if (++fc % 40 === 0) readColors();
    if (env.mouse.on && performance.now() - env.mouse.last > 3000) env.mouse.on = false;
    env.scroll *= Math.max(0, 1 - dt * 3);
    if (env.form) {
      env.phase += dt * env.w;
      if (t > formEnd) env.form = false;
    }
    for (const k of koi) k.update(dt, t, koi, env);
    fa += ((env.form ? 1.6 : 1) - fa) * Math.min(1, dt * 1.5);
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = rgba(fg, 1);
    for (const k of koi) k.draw(ctx, BASE * fa);
    ctx.lineWidth = 1.2;
    for (let i = ripples.length - 1; i >= 0; i--) {
      const r = ripples[i];
      r.r += r.v * dt;
      if (r.r > r.max) {
        ripples.splice(i, 1);
        continue;
      }
      if (r.r <= 0) continue;
      ctx.strokeStyle = rgba(acc, r.a * (1 - r.r / r.max));
      ctx.beginPath();
      ctx.arc(r.x, r.y, r.r, 0, TAU);
      ctx.stroke();
    }
    raf = requestAnimationFrame(frame);
  };
  raf = requestAnimationFrame(frame);

  // A las 2:22 (y 14:22) los koi hacen su figura solos.
  let firedKey = "";
  const clock = setInterval(() => {
    const d = new Date();
    if (d.getMinutes() === 22 && d.getHours() % 12 === 2) {
      const key = d.toDateString() + d.getHours();
      if (key !== firedKey) {
        firedKey = key;
        trigger222();
      }
    }
  }, 1000);

  return () => {
    cancelAnimationFrame(raf);
    clearInterval(clock);
    timers.forEach(clearTimeout);
    removeEventListener("resize", resize);
    removeEventListener("pointermove", onMove);
    removeEventListener("pointerdown", onDown);
    removeEventListener("scroll", onScroll);
    removeEventListener("keydown", onKey);
    removeEventListener("hashchange", chkHash);
    egg.remove();
  };
}
