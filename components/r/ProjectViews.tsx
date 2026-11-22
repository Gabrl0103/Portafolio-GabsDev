"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { projects } from "@/data/projects";
import type { Project } from "@/types";
import { cx } from "../ui";
import RefArt from "./RefArt";

export const pad = (n: number) => String(n).padStart(2, "0");
export const COLORS = ["var(--olive)", "var(--orange)", "var(--cream)"];

/** Portada: `image`, o la primera imagen de la galería. */
export const cover = (p: Project) => p.image ?? p.media?.find((m) => m.type === "image")?.src;

/** Vista del proyecto: captura real si existe; si no, la ilustración. */
export function Visual({ p, className, sizes = "(max-width: 900px) 100vw, 50vw" }: { p: Project; className?: string; sizes?: string }) {
  const src = cover(p);
  return src ? (
    <Image src={src} alt="" fill sizes={sizes} className={cx("object-cover", className)} />
  ) : (
    <RefArt art={p.art} className={cx("block h-full w-full", className)} />
  );
}

/** "Proyecto académico · Wear OS · En equipo" → "Wear OS" */
const platform = (kind: string) =>
  kind
    .split(" · ")
    .filter((x) => !x.startsWith("Proyecto") && x !== "En equipo")
    .join(" · ");

/** Primera oración de la descripción */
const lead = (p: Project) => p.description.split(". ")[0].replace(/\.$/, "") + ".";

type ViewProps = { onOpen: (k: number) => void };

/* ------------------------------------------------------------------ */
/* Capítulos: una tarjeta ancha por proyecto y un índice fijo que marca */
/* en cuál vas. Al cambiar de proyecto la tarjeta se abre desde el      */
/* centro, la portada se acerca y el número del índice sube.            */
/* ------------------------------------------------------------------ */
export function ProjectChapters({ onOpen }: ViewProps) {
  const [active, setActive] = useState(0);
  const items = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    // El proyecto activo es el que cruza la línea media de la pantalla
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => e.isIntersecting && setActive(Number((e.target as HTMLElement).dataset.k))),
      { rootMargin: "-50% 0px -50% 0px" },
    );
    items.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, []);

  const go = (k: number) => items.current[k]?.scrollIntoView({ block: "center" });

  return (
    <div className="mt-[clamp(40px,6vw,80px)] grid grid-cols-[clamp(160px,15vw,220px)_minmax(0,1fr)] gap-[clamp(24px,3vw,48px)] max-[900px]:grid-cols-1">
      <nav aria-label="Índice de proyectos" className="sticky top-[110px] self-start max-[900px]:hidden">
        <ol className="flex flex-col gap-1">
          {projects.map((p, k) => (
            <li key={p.id}>
              <button
                type="button"
                onClick={() => go(k)}
                aria-current={active === k ? "true" : undefined}
                style={{ "--pa": COLORS[k % 3] } as React.CSSProperties}
                className={cx(
                  "flex w-full cursor-pointer items-center gap-2.5 py-1 text-left text-[15px] transition-colors duration-500",
                  active === k ? "text-fg" : "text-mut hover:text-soft",
                )}
              >
                <span aria-hidden="true" className={cx("h-px bg-(--pa) transition-[width] duration-700 ease-expo", active === k ? "w-6" : "w-0")} />
                <b className="font-mono text-[11px] font-medium">{pad(k + 1)}</b>
                {p.title}
              </button>
            </li>
          ))}
        </ol>
        {/* Contador grande: el número nuevo sube desde abajo */}
        <div className="mt-8 flex items-end gap-2 font-disp leading-none font-medium tracking-[-.05em]" aria-hidden="true">
          <span className="block overflow-hidden text-[clamp(54px,5vw,76px)]">
            <span key={active} className="block animate-[subir_.8s_var(--ease-expo)]">
              {pad(active + 1)}
            </span>
          </span>
          <span className="mb-2 text-lg text-mut">/ {pad(projects.length)}</span>
        </div>
      </nav>

      <div className="flex flex-col gap-[clamp(18px,2vw,28px)]">
        {projects.map((p, k) => {
          const on = active === k;
          return (
            <article
              key={p.id}
              ref={(el) => {
                items.current[k] = el;
              }}
              data-k={k}
              data-a="chap"
              className="rv"
            >
              <button
                type="button"
                onClick={() => onOpen(k)}
                aria-label={`Abrir ${p.title}`}
                style={{ "--pa": COLORS[k % 3] } as React.CSSProperties}
                className={cx(
                  "group/c relative isolate block h-[clamp(420px,38vw,560px)] w-full cursor-pointer overflow-hidden rounded-[26px] bg-[#151318] text-left text-[#f1ece4] transition-[opacity,scale] duration-700 ease-expo max-[900px]:h-auto",
                  on ? "opacity-100" : "scale-[.97] opacity-45 max-[900px]:scale-100 max-[900px]:opacity-100",
                )}
              >
                {/* Fondo: la misma portada, muy desenfocada */}
                <span aria-hidden="true" className="absolute -inset-10 -z-1">
                  <Visual p={p} sizes="40vw" className="scale-125 blur-[40px] brightness-[.45] saturate-[1.1]" />
                </span>
                {/* Portada a la derecha, fundida con el fondo */}
                <span className="absolute inset-y-0 right-0 block w-[62%] overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_22%)] max-[900px]:relative max-[900px]:aspect-[4/3] max-[900px]:w-full max-[900px]:[mask-image:linear-gradient(180deg,#000_70%,transparent)]">
                  <Visual
                    p={p}
                    sizes="(max-width: 900px) 100vw, 60vw"
                    className="scale-[1.18] transition-transform duration-[1600ms] ease-expo in-[.vis]:scale-100 group-hover/c:scale-[1.04]!"
                  />
                </span>
                {/* Texto: entra un poco después de que la tarjeta se abre */}
                <span className="absolute inset-y-0 left-0 flex w-[42%] flex-col justify-between p-[clamp(22px,2.6vw,38px)] max-[900px]:relative max-[900px]:w-full max-[900px]:gap-6 max-[900px]:pt-0">
                  <span className="block translate-y-6 opacity-0 transition-[opacity,translate] delay-300 duration-1000 ease-expo in-[.vis]:translate-y-0 in-[.vis]:opacity-100">
                    <span className="mono block text-[#cfcac1]">
                      {pad(k + 1)} · {platform(p.kind)}
                    </span>
                    <b className="mt-3.5 block font-disp text-[clamp(44px,5.2vw,88px)] leading-[.9] font-medium tracking-[-.05em]">{p.title}</b>
                    <span className="mt-4 line-clamp-4 block max-w-[26em] text-[15px] leading-normal text-[#d2cec6]">{p.description}</span>
                  </span>
                  <span className="inline-flex w-fit translate-y-6 items-center gap-2 rounded-full bg-(--pa) px-4 py-2 font-mono text-[11px] font-medium tracking-[.1em] text-pill uppercase opacity-0 transition-[opacity,translate] delay-500 duration-1000 ease-expo in-[.vis]:translate-y-0 in-[.vis]:opacity-100">
                    Ver proyecto ↗
                  </span>
                </span>
              </button>
            </article>
          );
        })}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Franjas: siete columnas angostas; la que tiene el cursor se abre y   */
/* muestra la portada y la información. En celular son filas.          */
/* ------------------------------------------------------------------ */
export function ProjectStrips({ onOpen }: ViewProps) {
  const [on, setOn] = useState(0);
  return (
    <ul data-a="blur" className="rv mt-[clamp(40px,6vw,80px)] flex h-[clamp(440px,42vw,600px)] gap-2.5 max-[900px]:h-auto max-[900px]:flex-col">
      {projects.map((p, k) => {
        const a = on === k;
        return (
          <li
            key={p.id}
            onMouseEnter={() => setOn(k)}
            style={{ "--pa": COLORS[k % 3], flexGrow: a ? 6 : 1 } as React.CSSProperties}
            className={cx(
              "relative min-w-0 basis-0 overflow-hidden rounded-[22px] bg-bg2 transition-[flex-grow,height] duration-700 ease-expo max-[900px]:basis-auto",
              a ? "max-[900px]:h-[clamp(340px,90vw,440px)]" : "max-[900px]:h-[72px]",
            )}
          >
            <button
              type="button"
              onClick={() => (a ? onOpen(k) : setOn(k))}
              onFocus={() => setOn(k)}
              aria-expanded={a}
              aria-label={a ? `Abrir ${p.title}` : `Ver ${p.title}`}
              className="absolute inset-0 block w-full cursor-pointer text-left"
            >
              <Visual
                p={p}
                sizes="(max-width: 900px) 100vw, 60vw"
                className={cx("transition-[filter,scale] duration-700 ease-expo", !a && "scale-[1.6] blur-[18px] brightness-50 saturate-[.8]")}
              />
              {/* Cerrada: número arriba y nombre en vertical */}
              <span aria-hidden="true" className={cx("mono absolute inset-x-0 top-4 text-center text-[#ece9e2]/70 transition-opacity duration-300 max-[900px]:hidden", a && "opacity-0")}>
                {pad(k + 1)}
              </span>
              <span
                aria-hidden="true"
                className={cx(
                  "absolute bottom-6 left-1/2 -translate-x-1/2 rotate-180 font-disp text-[clamp(20px,2vw,30px)] font-medium tracking-[-.03em] whitespace-nowrap text-[#ece9e2] transition-opacity duration-300 [writing-mode:vertical-rl]",
                  "max-[900px]:top-1/2 max-[900px]:bottom-auto max-[900px]:left-5 max-[900px]:translate-x-0 max-[900px]:-translate-y-1/2 max-[900px]:rotate-0 max-[900px]:[writing-mode:horizontal-tb]",
                  a && "opacity-0",
                )}
              >
                {p.title}
              </span>
              {/* Abierta: información sobre la portada */}
              <span
                className={cx(
                  "absolute inset-x-[18px] bottom-[18px] flex items-end justify-between gap-5 rounded-2xl bg-[rgba(15,13,18,.72)] p-5 text-[#ece9e2] backdrop-blur-md transition-[opacity,translate] duration-500 max-[900px]:flex-col max-[900px]:items-start max-[900px]:gap-3",
                  a ? "translate-y-0 opacity-100 delay-300" : "pointer-events-none translate-y-4 opacity-0",
                )}
              >
                <span className="min-w-0">
                  <span className="mono block text-[#9a9a9c]">
                    {pad(k + 1)} · {platform(p.kind)}
                  </span>
                  <b className="mt-1.5 block font-disp text-[clamp(28px,3vw,42px)] leading-none font-medium tracking-[-.04em]">{p.title}</b>
                  <span className="mt-2.5 line-clamp-2 block max-w-[32em] text-sm leading-normal text-[#b4b3ad]">{lead(p)}</span>
                </span>
                <span className="shrink-0 rounded-full bg-(--pa) px-4 py-2 font-mono text-[11px] font-medium tracking-[.1em] whitespace-nowrap text-pill uppercase">Ver proyecto ↗</span>
              </span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}

/* ------------------------------------------------------------------ */
/* Póster: los nombres en letras gigantes y apagadas; el del cursor se  */
/* pinta con su color y la portada aparece flotando a su lado.          */
/* ------------------------------------------------------------------ */
const POSTER = ["var(--olive)", "var(--orange)", "var(--fg)"];

export function ProjectPoster({ onOpen }: ViewProps) {
  const [on, setOn] = useState<number | null>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const float = useRef<HTMLDivElement>(null);
  // La portada se coloca justo después del nombre, sin pisar la columna de la derecha
  const pick = (k: number) => (e: React.SyntheticEvent<HTMLButtonElement>) => {
    const b = e.currentTarget;
    const name = b.firstElementChild as HTMLElement;
    const meta = b.lastElementChild as HTMLElement;
    const fw = float.current?.offsetWidth ?? 0;
    const fh = float.current?.offsetHeight ?? 0;
    const max = meta.offsetLeft - fw - 24;
    const x = name.offsetLeft + name.scrollWidth + 36;
    setOn(k);
    // Si el nombre es tan largo que no cabe al lado, la portada se apoya encima de la fila
    setPos(x <= max ? { x, y: b.offsetTop + b.offsetHeight / 2 } : { x: Math.max(0, max), y: b.offsetTop - fh / 2 + 12 });
  };

  return (
    <div className="relative mt-[clamp(40px,6vw,80px)]" onMouseLeave={() => setOn(null)}>
      <ul className="border-t border-line">
        {projects.map((p, k) => {
          const a = on === k;
          return (
            <li key={p.id} data-a="clip" className="rv border-b border-line" style={{ transitionDelay: `${k * 0.06}s` }}>
              <button
                type="button"
                onMouseEnter={pick(k)}
                onFocus={pick(k)}
                onClick={() => onOpen(k)}
                aria-label={`Abrir ${p.title}`}
                style={{ "--pa": POSTER[k % 3] } as React.CSSProperties}
                className="grid w-full cursor-pointer grid-cols-[minmax(0,1fr)_minmax(0,280px)] items-center gap-8 py-[clamp(4px,.6vw,10px)] text-left max-[900px]:grid-cols-1 max-[900px]:gap-1.5 max-[900px]:py-4"
              >
                <span
                  className={cx(
                    "block w-fit max-w-full font-grain text-[clamp(36px,6.2vw,112px)] font-extrabold leading-[.95] tracking-[-.04em] uppercase transition-[color,translate] duration-500 ease-expo",
                    a ? "translate-x-3 text-(--pa)" : "text-fg/12 max-[900px]:text-fg/80",
                  )}
                >
                  {p.title}
                </span>
                <span className="text-right max-[900px]:text-left">
                  <span className={cx("mono block transition-colors", a ? "text-fg" : "text-mut")}>
                    {pad(k + 1)} · {platform(p.kind)}
                  </span>
                  <span className={cx("mt-2 block text-sm leading-normal text-soft transition-opacity duration-500", a ? "opacity-100" : "opacity-0 max-[900px]:opacity-100")}>{lead(p)}</span>
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      {/* Portada flotante: sigue a la fila activa y cambia con un fundido */}
      <div
        ref={float}
        aria-hidden="true"
        style={{ translate: `${pos.x}px calc(${pos.y}px - 50%)`, rotate: `${(on ?? 0) % 2 ? 4 : -4}deg` }}
        className={cx(
          "pointer-events-none absolute top-0 left-0 z-10 aspect-[4/3] w-[clamp(200px,19vw,290px)] overflow-hidden rounded-2xl shadow-[0_40px_80px_-30px_rgba(0,0,0,.8)] transition-[translate,rotate,opacity,scale] duration-700 ease-expo max-[900px]:hidden",
          on === null ? "scale-90 opacity-0" : "scale-100 opacity-100",
        )}
      >
        {projects.map((p, k) => (
          <span key={p.id} className={cx("absolute inset-0 transition-opacity duration-500", on === k ? "opacity-100" : "opacity-0")}>
            <Visual p={p} sizes="300px" />
          </span>
        ))}
      </div>
    </div>
  );
}
