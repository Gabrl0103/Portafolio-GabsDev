"use client";

import { useEffect, useRef } from "react";
import { grain, rgbOf } from "@/lib/grain";

/**
 * Texto con grano dibujado en un canvas. El tamaño y el color salen de las clases
 * (text-[…], text-fg) y se vuelve a dibujar al cambiar el tema o el tamaño de la ventana.
 */
export default function GrainText({ text, className }: { text: string; className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const cv = ref.current;
    if (!cv) return;
    const draw = () => {
      const cs = getComputedStyle(cv);
      const dpr = Math.min(devicePixelRatio || 1, 2);
      const fs = parseFloat(cs.fontSize) * dpr;
      if (!fs) return;
      const src = grain(text, fs, rgbOf(cs.color));
      cv.width = src.width;
      cv.height = src.height;
      cv.getContext("2d")!.drawImage(src, 0, 0);
      cv.style.width = `${src.width / dpr}px`;
      cv.style.height = `${src.height / dpr}px`;
      const p = Math.ceil(fs * 0.16) / dpr;
      cv.style.marginLeft = `${-p}px`;
      cv.style.marginTop = `${-p - (fs * 0.08) / dpr}px`;
      cv.style.marginBottom = `${-p - (fs * 0.08) / dpr}px`;
    };
    let t: ReturnType<typeof setTimeout>;
    const later = () => {
      clearTimeout(t);
      t = setTimeout(draw, 60);
    };
    document.fonts?.ready.then(draw);
    draw();
    addEventListener("resize", later);
    const mo = new MutationObserver(later);
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    return () => {
      clearTimeout(t);
      removeEventListener("resize", later);
      mo.disconnect();
    };
  }, [text]);

  return <canvas ref={ref} role="img" aria-label={text} className={`block max-w-none ${className ?? ""}`} />;
}
