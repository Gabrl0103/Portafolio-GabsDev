"use client";

import { useEffect, useRef } from "react";

/* Colores del sitio (olivo, naranja y crema) */
const OLIVE = [169, 188, 91];
const ORANGE = [229, 83, 45];
const CREAM = [241, 230, 211];

/**
 * Orbe de grano: una esfera que cambia de forma sola, dibujada punto a punto con grano
 * (como el "Gabs" del inicio). Se dibuja a media resolución y solo mientras está en pantalla.
 */
export default function GrainOrb({ className }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const cv = ref.current;
    const ctx = cv?.getContext("2d", { alpha: true });
    if (!cv || !ctx) return;
    const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
    let W = 0;
    let H = 0;
    let img: ImageData | null = null;
    let raf = 0;
    let visible = true;
    let last = 0;
    const t0 = performance.now();
    const radii = new Float32Array(256);

    const size = () => {
      const r = cv.getBoundingClientRect();
      // Resolución según el tamaño: nítida en ventanas pequeñas y con tope de ~260 000 puntos en las grandes
      const s = Math.min((devicePixelRatio || 1) * 0.7, Math.sqrt(260000 / Math.max(1, r.width * r.height)));
      cv.style.imageRendering = s < 1 ? "pixelated" : "auto";
      // En pasos de 8 px para no recrear la imagen en cada cuadro mientras la ventana cambia de tamaño
      const w = Math.max(40, Math.round((r.width * s) / 8) * 8);
      const h = Math.max(40, Math.round((r.height * s) / 8) * 8);
      if (w !== W || h !== H) {
        W = cv.width = w;
        H = cv.height = h;
        img = ctx.createImageData(W, H);
      }
    };

    const draw = (now: number) => {
      size();
      if (!img) return;
      const t = (now - t0) / 1000;
      const d = img.data;
      const cx = W / 2 + Math.sin(t * 0.35) * W * 0.03;
      const cy = H / 2 + Math.cos(t * 0.28) * H * 0.03;
      const R = Math.min(W, H) * 0.32;
      // Radio del contorno en 256 direcciones (la forma "respira")
      for (let i = 0; i < 256; i++) {
        const a = (i / 256) * Math.PI * 2;
        radii[i] = R * (1 + 0.11 * Math.sin(3 * a + t * 0.9) + 0.07 * Math.sin(5 * a - t * 1.25) + 0.05 * Math.sin(2 * a + t * 0.55));
      }
      const edge = R * 0.05; // borde difuso con grano
      let k = 0;
      for (let y = 0; y < H; y++) {
        const dy = y - cy;
        for (let x = 0; x < W; x++, k += 4) {
          const dx = x - cx;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const ang = Math.atan2(dy, dx);
          const r = radii[((((ang / (Math.PI * 2)) * 256) | 0) + 256) & 255];
          const out = dist - r;
          // Densidad: llena adentro, se deshace en grano hacia afuera
          let dens = out < -edge ? 1 : out > edge * 3 ? 0 : 1 - (out + edge) / (edge * 4);
          if (dens <= 0 || Math.random() > dens * 0.985) {
            d[k + 3] = 0;
            continue;
          }
          dens = Math.min(1, dens);
          // Volumen: luz desde arriba a la izquierda
          const q = Math.min(1, dist / r);
          const z = Math.sqrt(Math.max(0, 1 - q * q));
          const nx = dx / r;
          const ny = dy / r;
          const light = Math.max(0.08, Math.min(1.15, 0.12 + z * 0.75 - nx * 0.32 - ny * 0.42));
          // Mezcla olivo ↔ naranja que se desplaza con el tiempo
          const m = 0.5 + 0.5 * Math.sin(dx * 0.035 + t * 0.6) * Math.cos(dy * 0.03 - t * 0.45);
          const spec = Math.min(1, Math.max(0, light - 0.82) * 3);
          const n = (Math.random() - 0.5) * 46;
          for (let c = 0; c < 3; c++) {
            const base = OLIVE[c] + (ORANGE[c] - OLIVE[c]) * m;
            d[k + c] = Math.max(0, Math.min(255, (base + (CREAM[c] - base) * spec) * light + n));
          }
          d[k + 3] = (180 + Math.random() * 75) * dens;
        }
      }
      ctx.putImageData(img, 0, 0);
    };

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      if (!visible || document.hidden || now - last < 33) return; // ~30 cuadros por segundo
      last = now;
      draw(now);
    };

    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    io.observe(cv);
    if (still) {
      draw(t0 + 4000);
      const onResize = () => draw(t0 + 4000);
      addEventListener("resize", onResize);
      return () => {
        io.disconnect();
        removeEventListener("resize", onResize);
      };
    }
    raf = requestAnimationFrame(frame);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
    };
  }, []);

  return <canvas ref={ref} aria-hidden="true" className={className} />;
}
