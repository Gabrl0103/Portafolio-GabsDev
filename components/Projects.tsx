"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { projects } from "@/data/projects";
import type { Project } from "@/types";
import ProjectArt from "./ProjectArt";
import ProjectDetail from "./ProjectDetail";
import ProjectGrid from "./ProjectGrid";
import ProjectLinkButton from "./ProjectLinkButton";
import Hid, { Koi } from "./fx/Hid";
import TypeTitle from "./fx/TypeTitle";
import { button, chip, cx } from "./ui";

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
    const on = stage.current?.querySelector<HTMLElement>('[data-pos="0"]');
    const t = on?.querySelector<HTMLElement>("[data-tilt]");
    const sh = on?.querySelector<HTMLElement>("[data-shot]");
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
    stage.current?.querySelectorAll<HTMLElement>("[data-tilt]").forEach((t) => {
      t.style.setProperty("--rx", "0deg");
      t.style.setProperty("--ry", "0deg");
    });
  }

  return (
    <section id="proyectos" className="relative" data-sec>
      {/* Escaparate: un proyecto a la vez */}
      <div className="relative h-svh min-h-[600px] overflow-hidden">
        <div className="rv pointer-events-none absolute inset-x-0 top-24 z-[6] flex flex-col items-center gap-1.5 text-center max-[860px]:top-[84px]">
          <span className="text-base font-semibold tracking-[-.01em] text-acc">Proyectos</span>
          <TypeTitle text="Lo que he construido" className="text-[clamp(22px,2.4vw,32px)] font-medium text-mut" />
        </div>

        <div
          className="absolute inset-0"
          role="region"
          aria-roledescription="carrusel"
          aria-label="Proyectos"
          onKeyDown={(e) => {
            if (e.key === "ArrowRight") show(cur + 1);
            else if (e.key === "ArrowLeft") show(cur - 1);
          }}
        >
          <div
            className="absolute inset-0 overflow-hidden"
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
                  data-pos={pos}
                  inert={!isCur}
                  aria-roledescription="diapositiva"
                  aria-label={`${j + 1} de ${N}: ${p.title}`}
                  className="group pointer-events-none absolute inset-0 w-full opacity-0 transition-opacity duration-900 ease-[ease] data-[pos=0]:pointer-events-auto data-[pos=0]:opacity-100"
                >
                  {/* Recuadro de vidrio: al tocarlo se abre el detalle. */}
                  <div
                    data-tilt
                    onClick={(e) => isCur && !(e.target as HTMLElement).closest("a,button") && setDetail(p)}
                    className="glass absolute inset-x-0 top-[70px] bottom-0 m-auto block h-[min(520px,58vh)] w-[min(1080px,90vw)] cursor-pointer overflow-hidden rounded-[38px] hover:shadow-[inset_0_1px_0_var(--gl-hi),inset_0_0_0_1px_var(--gl-edge),0_40px_80px_-30px_var(--shadow)] max-[860px]:top-[150px] max-[860px]:bottom-auto max-[860px]:mx-auto max-[860px]:my-0 max-[860px]:h-[calc(100%-296px)] max-[860px]:w-[calc(100%-28px)]"
                  >
                    <div
                      data-shot
                      className="absolute inset-0 overflow-hidden rounded-[inherit] bg-[radial-gradient(60%_80%_at_74%_50%,color-mix(in_srgb,var(--acc)_22%,transparent),transparent_72%)] after:pointer-events-none after:absolute after:inset-0 after:z-[2] after:bg-[radial-gradient(520px_circle_at_var(--lx,70%)_var(--ly,40%),rgba(255,255,255,.1),transparent_62%)] after:opacity-90 after:mix-blend-soft-light"
                    >
                      {p.image ? (
                        <Image src={p.image} alt={`Captura de ${p.title}`} fill sizes="(max-width: 860px) 100vw, 1080px" className="object-cover" />
                      ) : (
                        <>
                          <span className="glass-flat absolute top-5 right-[22px] z-[3] rounded-full px-2.5 py-1.5 text-xs/[1.5] font-medium tracking-normal text-soft max-[860px]:hidden">
                            Vista de ejemplo
                          </span>
                          <ProjectArt
                            art={p.art}
                            className="absolute top-1/2 right-[4%] aspect-[480/300] h-auto w-[52%] transition-transform duration-500 ease-out-soft [transform:translateY(-48%)_perspective(1100px)_rotateX(var(--rx,0deg))_rotateY(var(--ry,0deg))] group-data-[pos=0]:animate-pv-in max-[860px]:top-[6%] max-[860px]:right-[5%] max-[860px]:w-[90%] max-[860px]:[transform:none] max-[860px]:group-data-[pos=0]:animate-pv-in-m"
                          />
                        </>
                      )}
                    </div>

                    <div className="absolute bottom-[clamp(24px,3.4vw,44px)] left-[clamp(24px,3.4vw,48px)] z-[3] flex w-[min(44%,430px)] flex-col justify-between gap-[22px] transition-transform duration-600 ease-out-soft [transform:translate(var(--ix,0px),var(--iy,0px))] max-[860px]:right-5 max-[860px]:bottom-5 max-[860px]:left-5 max-[860px]:w-auto max-[860px]:gap-3">
                      <div className="flex flex-col gap-3.5 group-data-[pos=0]:animate-pv-up">
                        <h3 className="text-[clamp(34px,4.6vw,66px)] leading-none tracking-[-.04em] max-[860px]:text-[clamp(30px,9vw,44px)]">{p.title}</h3>
                        <p className="m-0 line-clamp-3 max-w-[34ch] text-[clamp(15px,1.3vw,18px)] leading-[1.45] text-soft max-[860px]:hidden [@media(max-height:620px)]:hidden">
                          {p.description}
                        </p>
                        <div className="flex flex-wrap gap-2 max-[860px]:[&>span:not(:first-child)]:hidden">
                          <span className={chip}>{p.kind}</span>
                          {p.tags.map((t, k) => (
                            <span key={k} className={chip}>
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="relative z-[4] flex flex-wrap gap-2.5 self-start group-data-[pos=0]:animate-pv-up group-data-[pos=0]:[animation-delay:.12s]">
                        <button type="button" className={cx(button({ variant: "primary", size: "sm" }), "max-[860px]:hidden")} onClick={() => setDetail(p)}>
                          Ver proyecto
                        </button>
                        <ProjectLinkButton link={p.primary} />
                        <ProjectLinkButton link={p.secondary} />
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          <div className="absolute inset-x-0 bottom-9 z-[6] flex flex-wrap items-center justify-center gap-3.5 max-[860px]:bottom-4 max-[860px]:gap-x-3 max-[860px]:gap-y-2 max-[860px]:px-3">
            <button className={button({ size: "icon" })} type="button" aria-label="Proyecto anterior" onClick={() => show(cur - 1)}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                <path d="M14 8H2M7 3 2 8l5 5" />
              </svg>
            </button>
            <div className="glass flex flex-wrap justify-center gap-1 rounded-full border border-transparent p-[5px] max-[860px]:order-first max-[860px]:w-full max-[860px]:flex-nowrap max-[860px]:justify-start max-[860px]:overflow-x-auto max-[860px]:[scrollbar-width:none]">
              {projects.map((p, j) => (
                <button
                  key={p.id}
                  type="button"
                  aria-pressed={j === cur}
                  onClick={() => show(j)}
                  className={cx(
                    // `tab` es el gancho del sonido y del cursor (Effects.tsx).
                    "tab min-h-11 cursor-pointer rounded-full border-0 px-5 text-sm/[1.5] font-medium tracking-normal [transition:background_.35s,color_.35s,transform_.4s_cubic-bezier(.34,1.56,.64,1)] active:scale-95 max-[860px]:flex-auto max-[860px]:px-2.5 max-[860px]:text-[13px]",
                    j === cur ? "bg-acc text-acc-ink shadow-[0_8px_20px_-10px_var(--acc)]" : "bg-transparent text-mut hover:text-fg",
                  )}
                >
                  {p.short}
                </button>
              ))}
            </div>
            <button className={button({ size: "icon" })} type="button" aria-label="Proyecto siguiente" onClick={() => show(cur + 1)}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                <path d="M2 8h12M9 3l5 5-5 5" />
              </svg>
            </button>
            <span className="min-w-[130px] text-center text-sm/[1.5] font-medium tracking-normal text-mut tabular-nums" aria-live="polite">
              {pad(cur + 1)} / {pad(N)}
            </span>
          </div>
        </div>

        <Hid x="52%" y="19%">
          22
        </Hid>
        <Hid x="8%" y="18%">
          <Koi w={44} />
        </Hid>
        <Hid x="86%" y="84%">
          2:22
        </Hid>
      </div>

      {/* Todos los proyectos en cuadrícula */}
      <ProjectGrid projects={projects} onOpen={setDetail} />

      {mounted && <ProjectDetail project={detail} onClose={close} />}
    </section>
  );
}
