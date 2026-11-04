"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { projects } from "@/data/projects";
import type { Project } from "@/types";
import ProjectArt from "./ProjectArt";
import ProjectDetail from "./ProjectDetail";
import Hid, { Koi } from "./fx/Hid";
import TypeTitle from "./fx/TypeTitle";

const N = projects.length;
const pad = (n: number) => String(n).padStart(2, "0");

/** Posición relativa de cada tarjeta respecto a la actual: 0, 1, -1 o lejos. */
function posOf(j: number, cur: number) {
  const o = ((j - cur + N + N / 2) % N) - N / 2;
  return o === 0 ? "0" : o === 1 ? "1" : o === -1 ? "-1" : "far";
}

export default function Projects() {
  const [cur, setCur] = useState(0);
  const [detail, setDetail] = useState<Project | null>(null);
  const [mounted, setMounted] = useState(false);
  const stage = useRef<HTMLDivElement>(null);
  const startX = useRef<number | null>(null);

  const show = useCallback((i: number) => setCur(((i % N) + N) % N), []);
  const close = useCallback(() => setDetail(null), []);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 0);
    // Deslizar con el dedo o el mouse para cambiar de proyecto.
    const onUp = (e: PointerEvent) => {
      if (startX.current === null) return;
      const dx = e.clientX - startX.current;
      startX.current = null;
      if (Math.abs(dx) > 60) setCur((c) => (((c + (dx < 0 ? 1 : -1)) % N) + N) % N);
    };
    addEventListener("pointerup", onUp);
    return () => {
      clearTimeout(t);
      removeEventListener("pointerup", onUp);
    };
  }, []);

  // Inclinación 3D y brillo que siguen al cursor.
  function onMove(e: React.PointerEvent) {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const on = stage.current?.querySelector<HTMLElement>('.pv[data-pos="0"]');
    const t = on?.querySelector<HTMLElement>(".tilt");
    const sh = on?.querySelector<HTMLElement>(".shot");
    if (!on || !t || !sh) return;
    const r = on.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    const c = (v: number) => Math.max(-0.6, Math.min(0.6, v));
    t.style.setProperty("--ry", `${(c(x) * 16).toFixed(2)}deg`);
    t.style.setProperty("--rx", `${(c(-y) * 11).toFixed(2)}deg`);
    t.style.setProperty("--ix", `${(-x * 16).toFixed(1)}px`);
    t.style.setProperty("--iy", `${(-y * 10).toFixed(1)}px`);
    sh.style.setProperty("--lx", `${((x + 0.5) * 100).toFixed(1)}%`);
    sh.style.setProperty("--ly", `${((y + 0.5) * 100).toFixed(1)}%`);
  }
  function onLeave() {
    stage.current?.querySelectorAll<HTMLElement>(".tilt").forEach((t) => {
      t.style.setProperty("--rx", "0deg");
      t.style.setProperty("--ry", "0deg");
    });
  }

  return (
    <section id="proyectos" className="wrap sec" data-sec>
      <div className="sec-h rv">
        <span className="eyebrow">Proyectos</span>
        <TypeTitle text="Lo que he construido" />
        <p className="sub">Cada proyecto con su código en GitHub y su demo en línea.</p>
      </div>

      <div
        className="pj focus"
        role="region"
        aria-roledescription="carrusel"
        aria-label="Proyectos"
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") show(cur + 1);
          else if (e.key === "ArrowLeft") show(cur - 1);
        }}
      >
        <div className="clip">
          <div
            className="stage"
            ref={stage}
            onPointerDown={(e) => (startX.current = e.clientX)}
            onPointerMove={onMove}
            onPointerLeave={onLeave}
          >
            {projects.map((p, j) => {
              const pos = posOf(j, cur);
              const isCur = pos === "0";
              return (
                <article
                  key={p.id}
                  className="pv"
                  data-pos={pos}
                  inert={!isCur}
                  aria-roledescription="diapositiva"
                  aria-label={`${j + 1} de ${N}: ${p.title}`}
                  onClick={() => !isCur && show(j)}
                >
                  <div className="tilt" onClick={(e) => isCur && !(e.target as HTMLElement).closest("a,button") && setDetail(p)}>
                    <div className="shot">
                      {p.image ? (
                        <Image src={p.image} alt={`Captura de ${p.title}`} fill sizes="(max-width: 860px) 100vw, 1080px" className="object-cover" />
                      ) : (
                        <>
                          <span className="tag">Vista de ejemplo</span>
                          <ProjectArt art={p.art} />
                        </>
                      )}
                    </div>
                    <div className="info">
                      <div>
                        <h3>{p.title}</h3>
                        <p>{p.description}</p>
                        <div className="chips">
                          <span>{p.kind}</span>
                          {p.tags.map((t, k) => (
                            <span key={k}>{t}</span>
                          ))}
                        </div>
                      </div>
                      <div className="links2">
                        <button type="button" className="btn primary sm" onClick={() => setDetail(p)}>
                          Ver proyecto
                        </button>
                        <a className="btn sm" href={p.primary.href} target="_blank" rel="noopener noreferrer">
                          {p.primary.label} ↗
                        </a>
                        <a className="btn sm" href={p.secondary.href} target="_blank" rel="noopener noreferrer">
                          {p.secondary.label} ↗
                        </a>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>

        <div className="ctrl">
          <button className="btn icon" type="button" aria-label="Proyecto anterior" onClick={() => show(cur - 1)}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
              <path d="M14 8H2M7 3 2 8l5 5" />
            </svg>
          </button>
          <div className="tabs">
            {projects.map((p, j) => (
              <button key={p.id} className={`tab${j === cur ? " on" : ""}`} type="button" aria-pressed={j === cur} onClick={() => show(j)}>
                {p.short}
              </button>
            ))}
          </div>
          <button className="btn icon" type="button" aria-label="Proyecto siguiente" onClick={() => show(cur + 1)}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
              <path d="M2 8h12M9 3l5 5-5 5" />
            </svg>
          </button>
          <span className="count" aria-live="polite">
            {pad(cur + 1)} / {pad(N)}
          </span>
        </div>
      </div>

      <Hid x="52%" y="19%">22</Hid>
      <Hid x="8%" y="18%">
        <Koi w={44} />
      </Hid>
      <Hid x="86%" y="84%">2:22</Hid>

      {mounted && <ProjectDetail project={detail} onClose={close} />}
    </section>
  );
}
