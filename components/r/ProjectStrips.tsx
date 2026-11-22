"use client";

import Image from "next/image";
import { useState } from "react";
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
/* Franjas: una columna angosta por proyecto; la que tiene el cursor  */
/* se abre y muestra la portada y la información. En celular, filas.   */
/* ------------------------------------------------------------------ */
export default function ProjectStrips({ onOpen }: ViewProps) {
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
              "relative min-w-0 basis-0 overflow-hidden rounded-[22px] bg-bg2 [container-type:size] transition-[flex-grow,height] duration-700 ease-expo max-[900px]:basis-auto",
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
              {/* Nombre en vertical con la letra gruesa del inicio; su tamaño se ajusta para recorrer todo el largo de la franja */}
              <span
                aria-hidden="true"
                style={{ "--n": p.title.length } as React.CSSProperties}
                className={cx(
                  "absolute bottom-5 left-1/2 -translate-x-1/2 rotate-180 font-grain text-[min(calc((100cqh-80px)/(var(--n)*.58)),62cqw)] leading-none font-extrabold tracking-[-.02em] whitespace-nowrap text-[#ece9e2] uppercase transition-opacity duration-300 [writing-mode:vertical-rl]",
                  "max-[900px]:top-1/2 max-[900px]:bottom-auto max-[900px]:left-5 max-[900px]:translate-x-0 max-[900px]:-translate-y-1/2 max-[900px]:rotate-0 max-[900px]:text-[min(34px,8vw)] max-[900px]:[writing-mode:horizontal-tb]",
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
