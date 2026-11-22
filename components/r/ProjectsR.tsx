"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { projects } from "@/data/projects";
import type { Project, ProjectLink } from "@/types";
import { cx } from "../ui";
import { btn, btnF, lab } from "./btn";
import { chip } from "./Calendar";
import Gallery from "./Gallery";
import { COLORS, pad, ProjectChapters, ProjectPoster, ProjectStrips, Visual } from "./ProjectViews";
import SplitTitle from "./SplitTitle";

const detailRows: [keyof Project["detail"], string][] = [
  ["problema", "Problema"],
  ["solucion", "Solución"],
  ["rol", "Mi rol"],
  ["resultado", "Resultado"],
];

/** Enlaces del proyecto en orden: demo, principal y secundario. */
const links = (p: Project) => [p.demo, p.primary, p.secondary].filter((l): l is ProjectLink => !!l);

/** Tres formas de presentar los proyectos, para compararlas en el sitio (después se deja una). */
const VIEWS = [
  { id: "capitulos", label: "Capítulos" },
  { id: "franjas", label: "Franjas" },
  { id: "poster", label: "Póster" },
] as const;
type View = (typeof VIEWS)[number]["id"];

/** Proyectos: tres vistas a elegir y el detalle a pantalla completa. */
export default function ProjectsR() {
  const [open, setOpen] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);
  const [view, setView] = useState<View>("capitulos");

  useEffect(() => {
    const t = setTimeout(() => {
      setMounted(true);
      try {
        const v = localStorage.getItem("vista-proyectos");
        if (VIEWS.some((x) => x.id === v)) setView(v as View);
      } catch {}
    }, 0);
    return () => clearTimeout(t);
  }, []);

  const choose = (v: View) => {
    setView(v);
    try {
      localStorage.setItem("vista-proyectos", v);
    } catch {}
  };

  const close = useCallback(() => setOpen(null), []);

  // Otras secciones abren un proyecto con openProject(id) (evento "open-project").
  useEffect(() => {
    const onOpen = (e: Event) => {
      const k = projects.findIndex((p) => p.id === (e as CustomEvent<string>).detail);
      if (k >= 0) setOpen(k);
    };
    addEventListener("open-project", onOpen);
    return () => removeEventListener("open-project", onOpen);
  }, []);

  return (
    <section id="proyectos" className="glow [--gc:var(--cream)] [--gx:92%] [--gy:4%] light:[--gc:var(--orange)] pt-[clamp(40px,6vw,90px)] pb-[clamp(90px,11vw,170px)]">
      <div className="wrap">
        <div className="mt-7 flex items-end justify-between gap-5">
          <div>
            <div className={cx(lab, "rv")}>
              <b>(02)</b> Proyectos
            </div>
            <SplitTitle lines={["Trabajo", "seleccionado"]} className="mt-[22px]" />
          </div>
          <span className="mono rv text-mut">({pad(projects.length)})</span>
        </div>

        {/* Selector temporal de vista */}
        <div role="group" aria-label="Vista de proyectos" className="mt-8 flex flex-wrap items-center gap-2">
          <span className="mono mr-1 text-mut">Vista</span>
          {VIEWS.map((v) => (
            <button key={v.id} type="button" aria-pressed={view === v.id} onClick={() => choose(v.id)} style={{ "--c": "var(--cream)" } as React.CSSProperties} className={chip(view === v.id)}>
              {v.label}
            </button>
          ))}
        </div>

        {view === "capitulos" && <ProjectChapters onOpen={setOpen} />}
        {view === "franjas" && <ProjectStrips onOpen={setOpen} />}
        {view === "poster" && <ProjectPoster onOpen={setOpen} />}
      </div>

      {mounted && <Detail k={open} onClose={close} />}
    </section>
  );
}

/** Detalle del proyecto: sube desde abajo y ocupa toda la pantalla. */
function Detail({ k, onClose }: { k: number | null; onClose: () => void }) {
  const [last, setLast] = useState(0);
  if (k !== null && k !== last) setLast(k);
  const p = projects[k ?? last];
  const isOpen = k !== null;
  const panel = useRef<HTMLDivElement>(null);
  const closeBtn = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const prev = document.activeElement as HTMLElement | null;
    document.body.style.overflow = "hidden";
    if (panel.current) panel.current.scrollTop = 0;
    const t = setTimeout(() => closeBtn.current?.focus({ preventScroll: true }), 500);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    addEventListener("keydown", onKey);
    return () => {
      clearTimeout(t);
      removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      prev?.focus({ preventScroll: true });
    };
  }, [isOpen, onClose]);

  const color = COLORS[(k ?? last) % 3];
  return createPortal(
    <div
      ref={panel}
      role="dialog"
      aria-modal="true"
      aria-label={`Detalle de ${p.title}`}
      inert={!isOpen}
      style={{ "--pa": color } as React.CSSProperties}
      className={cx(
        "fixed inset-0 z-[300] overflow-auto bg-bg pt-[calc(26px+env(safe-area-inset-top,0px))] pr-[max(20px,env(safe-area-inset-right,0px))] pb-[60px] pl-[max(20px,env(safe-area-inset-left,0px))] transition-transform duration-900 ease-quint",
        isOpen ? "translate-y-0" : "translate-y-full",
      )}
    >
      <div className="flex items-center justify-between">
        <span className="mono">
          {pad((k ?? last) + 1)} / {pad(projects.length)}
        </span>
        <button ref={closeBtn} type="button" onClick={onClose} className={btn}>
          Cerrar ✕
        </button>
      </div>
      <div className="mx-auto mt-10 grid max-w-[1360px] grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] gap-[clamp(24px,5vw,90px)] max-[900px]:grid-cols-1">
        <div>
          <span className="inline-block rounded-full bg-(--pa) px-3 py-1 font-mono text-[11px] font-medium tracking-[.1em] text-pill uppercase">{p.kind}</span>
          <h2 className="mt-[18px] font-disp text-[clamp(54px,9vw,150px)] leading-[.9] font-medium tracking-[-.05em]">{p.title}</h2>
          <div className="mt-[30px]">
            {p.media?.length ? (
              <Gallery key={p.id} media={p.media} />
            ) : (
              <div className="relative aspect-[16/10] overflow-hidden rounded-[20px] bg-[color-mix(in_srgb,var(--pa)_16%,var(--bg2))]">
                <Visual p={p} />
              </div>
            )}
          </div>
        </div>
        <div>
          <p className="max-w-[32em] text-[clamp(18px,1.7vw,24px)] leading-[1.4] text-soft">{p.description}</p>
          <p className="mono mt-[18px] text-mut">{p.tags.join(" · ")}</p>
          <dl className="mt-[30px] border-t border-line">
            {detailRows.map(([key, label]) => (
              <div key={key} className="grid grid-cols-[120px_1fr] gap-4 border-b border-line py-4 max-[900px]:grid-cols-1 max-[900px]:gap-1">
                <dt className="mono text-mut">{label}</dt>
                <dd className="m-0 text-soft">{p.detail[key]}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-7 flex flex-wrap gap-2.5">
            {links(p).map((l, i) =>
              l.href ? (
                <a key={i} href={l.href} target="_blank" rel="noopener noreferrer" className={i === 0 ? btnF : btn}>
                  {l.label} ↗
                </a>
              ) : (
                <span key={i} className={cx(btn, "pointer-events-none opacity-50")}>
                  {l.label} · {l.note ?? "Pronto"}
                </span>
              ),
            )}
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
