"use client";

import { useEffect, useRef, useState } from "react";
import { grain } from "@/lib/grain";

const SEEN = "intro-vista";
const rnd = (a: number, b: number) => a + Math.random() * (b - a);
const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));

/** Colores de las tarjetas: fondo, tinta del grano y tinta del texto pequeño */
const CARD = ["#F7F6F2", "#121214", "#E6D9C0"];
const GRAIN: [number, number, number][] = [
  [17, 17, 19],
  [236, 226, 206],
  [17, 17, 19],
];
const INK = ["#121214", "#EDE4D3", "#121214"];

/** Abre el sitio: añade .go a <html> (dispara las animaciones del inicio). */
const go = () => document.documentElement.classList.add("go");

/**
 * Intro: una mesa llena de tarjetas con "2" y "Gabs" en tinta con grano que, al empezar,
 * salen disparadas hacia afuera desde el centro. Se ve solo la primera vez de cada visita.
 */
export default function CardIntro() {
  const box = useRef<HTMLDivElement>(null);
  const [done, setDone] = useState(false);
  const skipRef = useRef<() => void>(() => {});

  useEffect(() => {
    const intro = box.current;
    if (!intro) return;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    let seen = false;
    try {
      seen = sessionStorage.getItem(SEEN) === "1";
    } catch {}
    if (reduce || seen) {
      go();
      const t = setTimeout(() => setDone(true), 0);
      return () => clearTimeout(t);
    }

    const timers: ReturnType<typeof setTimeout>[] = [];
    let opened = false;
    const finish = () => {
      try {
        sessionStorage.setItem(SEEN, "1");
      } catch {}
      setDone(true);
    };

    const build = () => {
      const W = innerWidth;
      const H = innerHeight;
      const cw = clamp(W * 0.15, 118, 210);
      const ch = cw * 1.42;
      const sx = cw * 0.74;
      const sy = ch * 0.58;
      const cols = Math.ceil(W / sx) + 2;
      const rows = Math.ceil(H / sy) + 2;
      const two = GRAIN.map((g) => grain("2", 300, g).toDataURL());
      const name = GRAIN.map((g) => grain("Gabs", 120, g).toDataURL());
      const els: { el: HTMLDivElement; r: number; x: number; y: number }[] = [];
      const mono = "position:absolute;font:500 clamp(7px,.72vw,10px)/1.45 var(--font-mono);letter-spacing:.1em;text-transform:uppercase";

      for (let r = 0; r < rows; r++)
        for (let c = 0; c < cols; c++) {
          const x = (c - 1) * sx + (r % 2 ? sx * 0.5 : 0) + rnd(-0.25, 0.25) * cw;
          const y = (r - 1) * sy + rnd(-0.25, 0.25) * ch;
          const rot = Math.random() < 0.18 ? (Math.random() < 0.5 ? 90 : -90) + rnd(-8, 8) : rnd(-48, 48);
          const ci = Math.floor(Math.random() * 3);
          const t = Math.random();
          const el = document.createElement("div");
          el.style.cssText = `position:absolute;overflow:hidden;border-radius:2px;box-shadow:0 1px 0 rgba(0,0,0,.3),0 12px 26px -12px rgba(0,0,0,.6);will-change:transform;width:${cw}px;height:${ch}px;left:${x}px;top:${y}px;background:${CARD[ci]};color:${INK[ci]};transform:rotate(${rot}deg)`;
          el.innerHTML =
            t < 0.45
              ? `<img alt="" src="${two[ci]}" style="position:absolute;left:7%;bottom:6%;height:76%">`
              : t < 0.8
                ? `<img alt="" src="${name[ci]}" style="position:absolute;left:7%;top:6%;width:86%"><div style="${mono};left:7%;top:30%">estudiante<br>ing. de software<br>pasto, colombia</div><div style="${mono};left:7%;right:7%;bottom:6%;display:flex;justify-content:space-between"><span>portafolio</span><span>2026</span></div>`
                : `<div style="${mono};left:7%;right:7%;bottom:6%;display:flex;justify-content:space-between"><span>ing.</span><span>software</span><span>2:22</span></div>`;
          els.push({ el, r: rot, x: x + cw / 2, y: y + ch / 2 });
        }
      els.sort(() => Math.random() - 0.5).forEach((e) => intro.appendChild(e.el));

      const cx = W / 2;
      const cy = H / 2;
      const maxD = Math.hypot(cx, cy);
      const open = () => {
        if (opened) return;
        opened = true;
        intro.style.background = "transparent";
        timers.push(setTimeout(go, 420));
        const far = Math.max(W, H) * 1.25;
        els.forEach((e) => {
          const dx = e.x - cx;
          const dy = e.y - cy;
          const d = Math.hypot(dx, dy) || 1;
          const dist = far + d * 0.5;
          e.el.animate(
            [{ transform: `translate(0,0) rotate(${e.r}deg)` }, { transform: `translate(${(dx / d) * dist}px,${(dy / d) * dist}px) rotate(${e.r + rnd(-70, 70)}deg)` }],
            { duration: 1500, delay: (d / maxD) * 520, easing: "cubic-bezier(.65,0,.25,1)", fill: "forwards" },
          );
        });
        timers.push(setTimeout(finish, 2300));
      };
      skipRef.current = open;
      timers.push(setTimeout(open, 950));
    };

    // Espera la fuente del grano antes de dibujar las tarjetas.
    let started = false;
    const start = () => {
      if (started) return;
      started = true;
      build();
    };
    document.fonts?.ready.then(start, start);
    timers.push(setTimeout(start, 2600));
    const onKey = (e: KeyboardEvent) => ["Enter", "Escape", " "].includes(e.key) && skipRef.current();
    addEventListener("keydown", onKey);
    return () => {
      timers.forEach(clearTimeout);
      removeEventListener("keydown", onKey);
    };
  }, []);

  if (done) return null;
  return (
    <>
      <div ref={box} role="button" aria-label="Entrar al portafolio" onClick={() => skipRef.current()} className="fixed inset-0 z-[500] cursor-pointer overflow-hidden bg-bg" />
      <button
        type="button"
        onClick={() => skipRef.current()}
        className="fixed right-[max(20px,env(safe-area-inset-right,0px))] bottom-[22px] z-[510] cursor-pointer rounded-full border border-white/40 bg-black/35 px-4 py-2.5 font-mono text-xs font-medium tracking-[.14em] text-white uppercase backdrop-blur-md"
      >
        Saltar intro
      </button>
    </>
  );
}
