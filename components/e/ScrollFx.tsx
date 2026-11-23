"use client";

import { useEffect, useState } from "react";
import { useContent } from "@/lib/content";
import { cx } from "../ui";
import { pad } from "./parts";

/**
 * Tres formas de pasar de una sección a otra, para elegir una (se prueban con ?scroll=):
 *   apilar  cada sección se queda quieta y la siguiente sube encima, como una hoja sobre otra
 *   iman    el scroll se detiene al inicio de cada sección y un índice fijo marca la página
 *   telon   cada sección entra como una lámina sobre negro y se abre hasta ocupar la pantalla
 */
export type ScrollMode = "apilar" | "iman" | "telon";
const MODES: ScrollMode[] = ["apilar", "iman", "telon"];

export default function ScrollFx() {
  const [mode, setMode] = useState<ScrollMode | null>(null);

  useEffect(() => {
    const q = new URLSearchParams(location.search).get("scroll");
    let m: string | null = q;
    try {
      if (q) sessionStorage.setItem("scroll", q);
      else m = sessionStorage.getItem("scroll");
    } catch {}
    if (!MODES.includes(m as ScrollMode)) return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    document.documentElement.dataset.scroll = m!;
    const id = setTimeout(() => setMode(m as ScrollMode), 0);
    return () => {
      clearTimeout(id);
      delete document.documentElement.dataset.scroll;
    };
  }, []);

  // apilar y telón: cada sección recibe su avance (--p sale, --e entra)
  useEffect(() => {
    if (mode !== "apilar" && mode !== "telon") return;
    const secs = [...document.querySelectorAll<HTMLElement>("main > section")];
    let raf = 0;
    const layout = () => {
      secs.forEach((s, i) => {
        s.style.zIndex = String(i + 1);
        // se pega cuando su final llega al borde inferior, así se lee entera
        if (mode === "apilar")
          s.style.top = `${Math.min(0, innerHeight - s.offsetHeight)}px`;
      });
      frame();
    };
    const frame = () => {
      raf = 0;
      const h = innerHeight;
      secs.forEach((s, i) => {
        const top = s.getBoundingClientRect().top;
        const e = Math.min(1, Math.max(0, 1 - top / h));
        s.style.setProperty("--e", e.toFixed(3));
        const nx = secs[i + 1];
        const p = nx
          ? Math.min(1, Math.max(0, 1 - nx.getBoundingClientRect().top / h))
          : 0;
        s.style.setProperty("--p", p.toFixed(3));
      });
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
      secs.forEach((s) => {
        s.style.removeProperty("top");
        s.style.removeProperty("z-index");
      });
    };
  }, [mode]);

  return mode === "iman" ? <PageIndex /> : null;
}

/** Índice fijo del modo imán: número de página grande que cambia al pasar de sección */
function PageIndex() {
  const { sections } = useContent();
  const [cur, setCur] = useState(-1);
  const [prog, setProg] = useState(0);

  useEffect(() => {
    const ids = ["inicio", ...sections.map((s) => s.id)];
    const onScroll = () => {
      const y = innerHeight * 0.5;
      let k = 0;
      ids.forEach((id, i) => {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= y) k = i;
      });
      setCur(k - 1);
      const max = document.documentElement.scrollHeight - innerHeight;
      setProg(max > 0 ? scrollY / max : 0);
    };
    onScroll();
    addEventListener("scroll", onScroll, { passive: true });
    return () => removeEventListener("scroll", onScroll);
  }, [sections]);

  return (
    <>
      <div
        aria-hidden="true"
        className="fixed top-0 left-0 z-[55] h-[2px] w-full origin-left bg-white mix-blend-difference"
        style={{ transform: `scaleX(${prog})` }}
      />
      {/* Página actual, vertical en el margen izquierdo para no tapar el contenido */}
      <div
        aria-hidden="true"
        className={cx(
          "label pointer-events-none fixed top-1/2 left-2.5 z-40 -translate-y-1/2 rotate-180 text-white mix-blend-difference transition-opacity duration-500 [writing-mode:vertical-rl] max-[700px]:left-1 max-[700px]:text-[9px]",
          cur < 0 ? "opacity-0" : "opacity-100",
        )}
      >
        <span className="block overflow-hidden whitespace-nowrap">
          <span key={cur} className="rise block font-bold">
            {pad(Math.max(cur, 0) + 1)} / {pad(sections.length)} —{" "}
            {sections[Math.max(cur, 0)]?.label}
          </span>
        </span>
      </div>
    </>
  );
}
