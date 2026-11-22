"use client";

import { useEffect, useRef } from "react";

/* Colores del sitio (olivo, naranja y crema) */
const OLIVE = [169, 188, 91];
const ORANGE = [229, 83, 45];
const CREAM = [241, 230, 211];

/**
 * Estrella de brújula de Cenit (4 puntas; la de arriba, el norte, es la más larga).
 * Mismo trazo que el logo de Cenit Skillmap: viewBox 24×24 con centro en (12,13).
 */
const STAR_PATH =
  "M12 1Q14.2 10.8 20 13Q14.2 15.2 12 23Q9.8 15.2 4 13Q9.8 10.8 12 1Z";

/** Luna creciente del diseño "Atardecer" (mismo viewBox 24×24, centro en (12,13)). */
const MOON_PATH = "M14.6 2.6A10.4 10.4 0 1 0 21.4 18.2A8.4 8.4 0 1 1 14.6 2.6Z";
const GOLD = [255, 214, 150];
const AMBER = [231, 169, 76];
const MOONLIGHT = [255, 246, 226];

export type GrainSymbol = "star" | "moon";

/**
 * Estrella de grano: la estrella de Cenit dibujada punto a punto con grano (como el "Gabs" del inicio).
 * Oscila como una aguja de brújula, respira y su brillo recorre el olivo, el naranja y el crema.
 * Se dibuja solo mientras está en pantalla y con la resolución ajustada a su tamaño.
 */
export default function GrainStar({
  className,
  symbol = "star",
}: {
  className?: string;
  symbol?: GrainSymbol;
}) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const cv = ref.current;
    const ctx = cv?.getContext("2d");
    const mask = document.createElement("canvas");
    const mctx = mask.getContext("2d", { willReadFrequently: true });
    if (!cv || !ctx || !mctx) return;
    const moon = symbol === "moon";
    const STAR = new Path2D(moon ? MOON_PATH : STAR_PATH);
    const [A, B, HI] = moon ? [GOLD, AMBER, MOONLIGHT] : [OLIVE, ORANGE, CREAM];
    const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
    let W = 0;
    let H = 0;
    let img: ImageData | null = null;
    let raf = 0;
    let visible = true;
    let last = 0;
    const t0 = performance.now();

    const size = () => {
      const r = cv.getBoundingClientRect();
      // Nítida en tamaños pequeños; con tope de ~260 000 puntos en pantalla completa
      const s = Math.min(
        (devicePixelRatio || 1) * 0.7,
        Math.sqrt(260000 / Math.max(1, r.width * r.height)),
      );
      cv.style.imageRendering = s < 1 ? "pixelated" : "auto";
      // En pasos de 8 px para no recrear la imagen en cada cuadro mientras la ventana cambia de tamaño
      const w = Math.max(40, Math.round((r.width * s) / 8) * 8);
      const h = Math.max(40, Math.round((r.height * s) / 8) * 8);
      if (w !== W || h !== H) {
        W = cv.width = mask.width = w;
        H = cv.height = mask.height = h;
        img = ctx.createImageData(W, H);
      }
    };

    const draw = (now: number) => {
      size();
      if (!img) return;
      const t = (now - t0) / 1000;
      const S = (Math.min(W, H) * 0.86) / 22; // la estrella mide 22 de alto en su viewBox
      const breathe = 1 + 0.025 * Math.sin(t * 1.3);
      // Aguja: se balancea alrededor del norte y de vez en cuando gira un poco más
      const ang =
        ((Math.sin(t * 0.7) * 9 + Math.sin(t * 0.23) * 5) * Math.PI) / 180;

      // Silueta con borde suave en una capa aparte (el desenfoque da el borde que se deshace en grano)
      mctx.setTransform(1, 0, 0, 1, 0, 0);
      mctx.clearRect(0, 0, W, H);
      mctx.filter = `blur(${Math.max(1, S * 0.18).toFixed(1)}px)`;
      mctx.setTransform(1, 0, 0, 1, W / 2, H / 2);
      mctx.rotate(ang);
      mctx.scale(S * breathe, S * breathe);
      mctx.translate(-12, -13);
      mctx.fillStyle = "#fff";
      mctx.fill(STAR);
      const a = mctx.getImageData(0, 0, W, H).data;

      const d = img.data;
      const cx = W / 2;
      const cy = H / 2;
      const R = 11 * S;
      const ca = Math.cos(-ang);
      const sa = Math.sin(-ang);
      for (let k = 0, y = 0; y < H; y++) {
        for (let x = 0; x < W; x++, k += 4) {
          const dens = a[k + 3] / 255;
          if (dens < 0.02 || Math.random() > Math.min(1, dens * 1.15)) {
            d[k + 3] = 0;
            continue;
          }
          // Coordenadas en el marco de la estrella (para que la luz gire con ella)
          const dx = x - cx;
          const dy = y - cy;
          const u = (dx * ca - dy * sa) / R;
          const v = (dx * sa + dy * ca) / R;
          // Facetas: cada punta tiene un lado claro y uno oscuro, como una estrella tallada
          // Estrella: facetas como una piedra tallada. Luna: luz que baja de arriba.
          const facet = moon ? 0.85 - v * 0.25 : u > 0 !== v > 0 ? 1 : 0.62;
          const core = Math.max(0, 1 - Math.hypot(u, v) * 1.6);
          const light = Math.min(1.15, 0.45 + facet * 0.45 + core * 0.5);
          // Color: olivo → naranja a lo largo de la diagonal, con un brillo que la recorre
          const m = Math.min(
            1,
            Math.max(
              0,
              0.5 +
                0.5 * (moon ? v * 1.4 : (u - v) * 0.9) +
                0.25 * Math.sin(t * 0.8 + v * 3),
            ),
          );
          const spec = Math.min(1, Math.max(0, core * 1.4 - 0.25));
          const n = (Math.random() - 0.5) * 50;
          for (let c = 0; c < 3; c++) {
            const base = A[c] + (B[c] - A[c]) * m;
            d[k + c] = Math.max(
              0,
              Math.min(255, (base + (HI[c] - base) * spec) * light + n),
            );
          }
          d[k + 3] = (190 + Math.random() * 65) * Math.min(1, dens * 1.3);
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
      const once = () => draw(t0);
      once();
      addEventListener("resize", once);
      return () => {
        io.disconnect();
        removeEventListener("resize", once);
      };
    }
    raf = requestAnimationFrame(frame);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
    };
  }, [symbol]);

  return <canvas ref={ref} aria-hidden="true" className={className} />;
}
