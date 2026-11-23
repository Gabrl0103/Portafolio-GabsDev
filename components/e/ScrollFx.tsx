"use client";

import { useEffect } from "react";

/**
 * Paso entre secciones, como hojas de revista: cada sección se queda quieta cuando
 * termina y la siguiente sube encima como una lámina que se abre (estilos en globals.css).
 * Aquí solo se calcula dónde se pega cada sección y su avance (--e entra, --p la tapan).
 * Con "reducir movimiento" el sitio se desplaza normal.
 */
export default function ScrollFx() {
  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const root = document.documentElement;
    const secs = [...document.querySelectorAll<HTMLElement>("main > section")];
    root.dataset.scroll = "";
    let raf = 0;

    const frame = () => {
      raf = 0;
      const h = innerHeight;
      const tops = secs.map((s) => s.getBoundingClientRect().top);
      secs.forEach((s, i) => {
        const e = Math.min(1, Math.max(0, 1 - tops[i] / h));
        const p =
          i + 1 < secs.length
            ? Math.min(1, Math.max(0, 1 - tops[i + 1] / h))
            : 0;
        s.style.setProperty("--e", e.toFixed(3));
        s.style.setProperty("--p", p.toFixed(3));
      });
    };
    const layout = () => {
      secs.forEach((s, i) => {
        s.style.zIndex = String(i + 1);
        // se pega cuando su final llega al borde inferior, así se lee entera
        s.style.top = `${Math.min(0, innerHeight - s.offsetHeight)}px`;
      });
      frame();
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(frame);
    };

    layout();
    addEventListener("scroll", onScroll, { passive: true });
    addEventListener("resize", layout);
    const ro = new ResizeObserver(layout);
    secs.forEach((s) => ro.observe(s));
    return () => {
      cancelAnimationFrame(raf);
      removeEventListener("scroll", onScroll);
      removeEventListener("resize", layout);
      ro.disconnect();
      delete root.dataset.scroll;
      secs.forEach((s) =>
        ["top", "z-index", "--e", "--p"].forEach((k) =>
          s.style.removeProperty(k),
        ),
      );
    };
  }, []);

  return null;
}
