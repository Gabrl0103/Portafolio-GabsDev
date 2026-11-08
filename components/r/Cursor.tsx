"use client";

import { useEffect, useRef } from "react";

/**
 * Cursor propio: un punto que invierte los colores de lo que tiene debajo y crece sobre
 * enlaces y botones. Los elementos con la clase `mag` se acercan al cursor (magnéticos).
 */
export default function Cursor() {
  const dot = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!matchMedia("(hover:hover) and (pointer:fine)").matches) return;
    const el = dot.current!;
    document.body.classList.add("fine");
    let mx = 0;
    let my = 0;
    let cx = 0;
    let cy = 0;
    let raf = 0;
    const move = (e: PointerEvent) => {
      mx = e.clientX;
      my = e.clientY;
      const t = e.target as HTMLElement;
      el.classList.toggle("big", !!t.closest?.("a,button,[data-cursor]"));
      const m = t.closest?.<HTMLElement>(".mag");
      document.querySelectorAll<HTMLElement>(".mag").forEach((b) => {
        if (b !== m) b.style.translate = "";
      });
      if (m) {
        const r = m.getBoundingClientRect();
        m.style.translate = `${((mx - r.left - r.width / 2) * 0.22).toFixed(1)}px ${((my - r.top - r.height / 2) * 0.3).toFixed(1)}px`;
      }
    };
    const loop = () => {
      cx += (mx - cx) * 0.22;
      cy += (my - cy) * 0.22;
      el.style.transform = `translate(${cx.toFixed(1)}px,${cy.toFixed(1)}px)`;
      raf = requestAnimationFrame(loop);
    };
    addEventListener("pointermove", move);
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      removeEventListener("pointermove", move);
      document.body.classList.remove("fine");
    };
  }, []);

  return (
    <div
      ref={dot}
      aria-hidden="true"
      className="pointer-events-none fixed top-0 left-0 z-[600] -m-[7px] size-3.5 rounded-full bg-white opacity-0 mix-blend-difference transition-[width,height,margin,opacity] duration-300 in-[.fine]:opacity-100 [&.big]:-m-7 [&.big]:size-14"
    />
  );
}
