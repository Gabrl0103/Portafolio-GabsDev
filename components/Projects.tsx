"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { projects } from "@/data/projects";
import type { Project } from "@/types";
import ProjectDetail from "./ProjectDetail";
import ProjectGrid from "./ProjectGrid";
import ProjectLinkButton from "./ProjectLinkButton";
import ProjectScreen from "./ProjectScreen";
import Hid, { Koi } from "./fx/Hid";
import TypeTitle from "./fx/TypeTitle";
import { button, chip, cx, wrap } from "./ui";

const N = projects.length;
const pad = (n: number) => String(n).padStart(2, "0");
type View = "carousel" | "grid";

export default function Projects() {
  const [view, setView] = useState<View>("carousel");
  const [detail, setDetail] = useState<Project | null>(null);
  const [mounted, setMounted] = useState(false);
  const close = useCallback(() => setDetail(null), []);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(t);
  }, []);

  return (
    <section id="proyectos" className="relative py-28 md:py-32" data-sec>
      <div className={cx(wrap, "flex flex-wrap items-end justify-between gap-x-6 gap-y-4")}>
        <div className="rv flex flex-col gap-2">
          <span className="text-base font-semibold tracking-[-.01em] text-acc">Proyectos</span>
          <TypeTitle text="Lo que he construido" />
          <p className="m-0 max-w-[48ch] text-[17px] leading-[1.55] text-soft">Cada proyecto con su código en GitHub y su demo en línea.</p>
        </div>
        <ViewToggle view={view} onChange={setView} />
      </div>

      <div key={view} className="mt-10 animate-pv-up [animation-duration:.7s] md:mt-12">
        {view === "carousel" ? (
          <Carousel onOpen={setDetail} />
        ) : (
          <div className={wrap}>
            <ProjectGrid projects={projects} onOpen={setDetail} />
          </div>
        )}
      </div>

      <Hid x="52%" y="6%">22</Hid>
      <Hid x="8%" y="12%">
        <Koi w={44} />
      </Hid>
      <Hid x="86%" y="94%">2:22</Hid>

      {mounted && <ProjectDetail project={detail} onClose={close} />}
    </section>
  );
}

/* ---------- Cambiar de vista ---------- */

function ViewToggle({ view, onChange }: { view: View; onChange: (v: View) => void }) {
  const opts = [
    {
      v: "carousel" as const,
      label: "Ver en carrusel",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" aria-hidden="true">
          <rect x="6" y="5" width="12" height="14" rx="2" />
          <path d="M2.5 7.5v9M21.5 7.5v9" />
        </svg>
      ),
    },
    {
      v: "grid" as const,
      label: "Ver en cuadrícula",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
          <rect x="4" y="4" width="6.5" height="6.5" rx="1.5" />
          <rect x="13.5" y="4" width="6.5" height="6.5" rx="1.5" />
          <rect x="4" y="13.5" width="6.5" height="6.5" rx="1.5" />
          <rect x="13.5" y="13.5" width="6.5" height="6.5" rx="1.5" />
        </svg>
      ),
    },
  ];
  return (
    <div role="group" aria-label="Vista de proyectos" className="glass-flat relative flex rounded-full p-1">
      {/* Indicador que se desliza bajo la opción activa */}
      <span
        aria-hidden="true"
        className={cx("absolute top-1 left-1 size-9 rounded-full bg-glass2 transition-transform duration-500 ease-out-soft", view === "grid" && "translate-x-9")}
      />
      {opts.map((o) => (
        <button
          key={o.v}
          type="button"
          title={o.label}
          aria-label={o.label}
          aria-pressed={view === o.v}
          onClick={() => onChange(o.v)}
          className={cx(
            "relative flex size-9 cursor-pointer items-center justify-center rounded-full border-0 bg-transparent transition-colors duration-300",
            view === o.v ? "text-fg" : "text-mut hover:text-fg",
          )}
        >
          {o.icon}
        </button>
      ))}
    </div>
  );
}

/* ---------- Carrusel de recuadros grandes ---------- */

function Carousel({ onOpen }: { onOpen: (p: Project) => void }) {
  const [cur, setCur] = useState(0);
  const [m, setM] = useState<{ sw: number; cw: number; gap: number } | null>(null);
  const stage = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const startX = useRef<number | null>(null);
  const show = useCallback((i: number) => setCur(((i % N) + N) % N), []);

  // Mide el escenario y las tarjetas para centrar la actual.
  useEffect(() => {
    const st = stage.current;
    const tr = track.current;
    if (!st || !tr) return;
    const measure = () => {
      const first = tr.firstElementChild as HTMLElement | null;
      if (!first) return;
      setM({ sw: st.clientWidth, cw: first.offsetWidth, gap: parseFloat(getComputedStyle(tr).columnGap) || 0 });
    };
    const ro = new ResizeObserver(measure);
    ro.observe(st);
    measure();
    return () => ro.disconnect();
  }, []);

  const x = m ? m.sw / 2 - m.cw / 2 - cur * (m.cw + m.gap) : 0;
  const p = projects[cur];

  return (
    <div
      role="region"
      aria-roledescription="carrusel"
      aria-label="Proyectos"
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") show(cur + 1);
        else if (e.key === "ArrowLeft") show(cur - 1);
      }}
    >
      <div
        ref={stage}
        className="relative overflow-hidden py-6 [perspective:1600px]"
        onPointerDown={(e) => (startX.current = e.clientX)}
        onPointerUp={(e) => {
          if (startX.current === null) return;
          const dx = e.clientX - startX.current;
          startX.current = null;
          if (Math.abs(dx) > 50) show(cur + (dx < 0 ? 1 : -1));
        }}
      >
        <div
          ref={track}
          className={cx(
            "flex gap-[clamp(20px,4vw,56px)] transition-[transform,opacity] duration-900 ease-out-soft [transform-style:preserve-3d]",
            m ? "opacity-100" : "opacity-0",
          )}
          style={{ transform: `translate3d(${x}px,0,0)` }}
        >
          {projects.map((proj, i) => {
            const d = i - cur;
            const near = Math.abs(d) === 1;
            return (
              <div
                key={proj.id}
                aria-hidden={d !== 0}
                className="w-(--pw) flex-none transition-[transform,opacity,filter] duration-900 ease-out-soft [--pw:min(86vw,560px)] md:[--pw:min(70vw,920px,calc((100svh-220px)*1.6))]"
                style={{
                  transform: d === 0 ? "none" : `rotateY(${d > 0 ? -16 : 16}deg) scale(${near ? 0.86 : 0.78})`,
                  opacity: d === 0 ? 1 : near ? 0.5 : 0,
                  filter: d === 0 ? "none" : "saturate(.7)",
                }}
              >
                <button
                  type="button"
                  tabIndex={d === 0 ? 0 : -1}
                  aria-label={d === 0 ? `Ver detalle de ${proj.title}` : `Ir a ${proj.title}`}
                  onClick={() => (d === 0 ? onOpen(proj) : show(i))}
                  className={cx(
                    "group relative block aspect-[16/10] w-full cursor-pointer overflow-hidden rounded-[18px] border-0 p-0 shadow-[0_50px_90px_-40px_var(--shadow),0_0_0_1px_var(--glass-b)] transition-transform duration-500 ease-out-soft",
                    d === 0 && "hover:-translate-y-1.5",
                  )}
                >
                  <ProjectScreen project={proj} />
                  {d === 0 && (
                    <span className="glass-flat absolute right-4 bottom-4 rounded-full px-3 py-1.5 text-xs/[1.5] font-medium tracking-normal text-fg opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                      Ver detalle
                    </span>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Información del proyecto actual y flechas */}
      <div className={cx(wrap, "mt-6 grid items-start gap-6 md:grid-cols-[1fr_auto] md:gap-10")}>
        <div key={cur} className="flex animate-pv-up flex-col gap-3 [animation-duration:.7s]" aria-live="polite">
          <span className="text-xs font-medium text-acc">{p.kind}</span>
          <h3 className="m-0 text-[clamp(30px,3.6vw,46px)] leading-none tracking-[-.04em] text-fg">{p.title}</h3>
          <p className="m-0 max-w-[60ch] text-[15px] leading-relaxed text-soft">{p.description}</p>
          <ul className="m-0 flex list-none flex-wrap gap-2 p-0" aria-label="Tecnologías">
            {p.tags.map((t, k) => (
              <li key={k}>
                <span className={chip}>{t}</span>
              </li>
            ))}
          </ul>
          <div className="mt-1 flex flex-wrap gap-2.5">
            <button type="button" className={button({ variant: "primary", size: "sm" })} onClick={() => onOpen(p)}>
              Ver detalle
            </button>
            <ProjectLinkButton link={p.primary} />
            <ProjectLinkButton link={p.secondary} />
          </div>
        </div>

        <div className="flex items-center gap-3 max-md:order-first">
          <button className={button({ size: "icon" })} type="button" aria-label="Proyecto anterior" onClick={() => show(cur - 1)}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
              <path d="M14 8H2M7 3 2 8l5 5" />
            </svg>
          </button>
          <span className="min-w-[64px] text-center text-sm/[1.5] font-medium tracking-normal text-mut tabular-nums">
            {pad(cur + 1)} / {pad(N)}
          </span>
          <button className={button({ size: "icon" })} type="button" aria-label="Proyecto siguiente" onClick={() => show(cur + 1)}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
              <path d="M2 8h12M9 3l5 5-5 5" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
