"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { projects } from "@/data/projects";
import type { Project, ProjectLink } from "@/types";
import { cx } from "../ui";
import { btn, btnF, lab } from "./btn";
import RefArt from "./RefArt";
import RollText from "./RollText";
import SplitTitle from "./SplitTitle";

const pad = (n: number) => String(n).padStart(2, "0");
const COLORS = ["var(--olive)", "var(--orange)", "var(--cream)"];
const detailRows: [keyof Project["detail"], string][] = [
  ["problema", "Problema"],
  ["solucion", "Solución"],
  ["rol", "Mi rol"],
  ["resultado", "Resultado"],
];

/** Vista del proyecto: captura real si existe; si no, la ilustración. */
function Visual({ p, className }: { p: Project; className?: string }) {
  return p.image ? (
    <Image src={p.image} alt={`Captura de ${p.title}`} fill sizes="(max-width: 900px) 100vw, 50vw" className={cx("object-cover", className)} />
  ) : (
    <RefArt art={p.art} className={cx("block h-full w-full", className)} />
  );
}

/** Enlace subrayado; sin dirección se muestra como "Pronto". */
function TextLink({ link }: { link: ProjectLink }) {
  if (!link.href) return <span className="border-b border-line pb-0.5 text-mut">{link.label} · Pronto</span>;
  return (
    <a href={link.href} target="_blank" rel="noopener noreferrer" className="border-b border-line pb-0.5 transition-colors duration-300 hover:border-orange hover:text-orange">
      {link.label} ↗
    </a>
  );
}

/** Proyectos: cuadrícula de 2 columnas (1 en celular) con desplazamiento escalonado y detalle a pantalla completa. */
export default function ProjectsR() {
  const [open, setOpen] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);
  const cards = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 0);
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return () => clearTimeout(t);
    // Parallax suave: las columnas se mueven a distinta velocidad.
    let raf = 0;
    const frame = () => {
      const vh = innerHeight;
      cards.current.forEach((a, i) => {
        if (!a) return;
        const q = a.getBoundingClientRect();
        if (q.bottom > -100 && q.top < vh + 100) a.style.setProperty("--py", `${((i % 2 ? 1 : -0.5) * (q.top + q.height / 2 - vh / 2) * -0.07).toFixed(1)}px`);
      });
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => {
      clearTimeout(t);
      cancelAnimationFrame(raf);
    };
  }, []);

  const close = useCallback(() => setOpen(null), []);

  return (
    <section id="proyectos" className="pt-[clamp(40px,6vw,90px)] pb-[clamp(90px,11vw,170px)]">
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

        <div className="mt-[clamp(40px,6vw,90px)] grid grid-cols-2 items-start gap-x-[clamp(24px,4vw,64px)] gap-y-[clamp(30px,5vw,90px)] max-[900px]:grid-cols-1">
          {projects.map((p, k) => (
            <article
              key={p.id}
              ref={(el) => {
                cards.current[k] = el;
              }}
              data-a={k % 2 ? "blur" : "clip"}
              style={{ "--pa": COLORS[k % 3], "--hc": COLORS[k % 3] } as React.CSSProperties}
              className={cx("trig rv group min-w-0 translate-y-(--py)", k % 2 === 1 && "mt-[clamp(50px,10vw,170px)] max-[900px]:mt-0")}
            >
              <button
                type="button"
                aria-label={`Abrir ${p.title}`}
                onClick={() => setOpen(k)}
                onPointerMove={(e) => {
                  const r = e.currentTarget.getBoundingClientRect();
                  e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
                  e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
                }}
                className="group/card relative isolate block aspect-[4/3] w-full cursor-pointer overflow-hidden rounded-[20px] border-0 bg-bg2 p-0 text-left transition-[transform,box-shadow] duration-700 ease-expo hover:-translate-y-[18px] hover:shadow-[0_40px_70px_-30px_rgba(0,0,0,.65)] focus-visible:-translate-y-[18px]"
              >
                <div className="absolute inset-0 bg-[color-mix(in_srgb,var(--pa)_16%,var(--bg2))] transition-transform duration-1100 ease-expo group-hover/card:scale-[1.07]">
                  <Visual p={p} className="grayscale-[1] contrast-[.95] transition-[filter] duration-700 group-hover/card:grayscale-0 group-hover/card:contrast-100" />
                </div>
                <div className="tex-hover z-[1] group-hover/card:opacity-100" />
                <div className="absolute inset-x-3.5 bottom-3.5 z-[2] flex translate-y-[130%] items-center justify-between rounded-[14px] bg-[rgba(var(--bgr),.72)] px-4 py-3 backdrop-blur-[14px] transition-transform duration-700 ease-expo group-hover/card:translate-y-0 group-focus-visible/card:translate-y-0">
                  <span className="mono">Ver proyecto</span>
                  <span>↗</span>
                </div>
              </button>
              <div className="mt-[18px] flex flex-wrap items-baseline justify-between gap-3.5">
                <h3 className="font-disp text-[clamp(26px,3vw,40px)] leading-none font-medium tracking-[-.04em] transition-colors group-hover:text-(--pa)">
                  <RollText text={p.title} />
                </h3>
                <span className="inline-block rounded-full bg-(--pa) px-3 py-1 font-mono text-[11px] font-medium tracking-[.1em] text-pill uppercase">{p.kind}</span>
              </div>
              <div className="mt-2.5 flex flex-wrap gap-[18px] font-disp text-sm font-medium">
                <TextLink link={p.primary} />
                <TextLink link={p.secondary} />
              </div>
            </article>
          ))}
        </div>
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
          <div className="relative mt-[30px] aspect-[16/10] overflow-hidden rounded-[20px] bg-[color-mix(in_srgb,var(--pa)_16%,var(--bg2))]">
            <Visual p={p} />
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
            {[p.primary, p.secondary].map((l, i) =>
              l.href ? (
                <a key={i} href={l.href} target="_blank" rel="noopener noreferrer" className={i ? btnF : btn}>
                  {l.label} ↗
                </a>
              ) : (
                <span key={i} className={cx(btn, "pointer-events-none opacity-50")}>
                  {l.label} · Pronto
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
