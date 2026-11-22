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
export const cover = (p: Project) =>
  p.image ?? p.media?.find((m) => m.type === "image")?.src;

/** Vista del proyecto: captura real si existe; si no, la ilustración. */
export function Visual({
  p,
  className,
  sizes = "(max-width: 900px) 100vw, 50vw",
}: {
  p: Project;
  className?: string;
  sizes?: string;
}) {
  const src = cover(p);
  return src ? (
    <Image
      src={src}
      alt=""
      fill
      sizes={sizes}
      className={cx("object-cover", className)}
    />
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

type Shot = { src: string; ratio: number };

/** Hasta tres imágenes por proyecto: la portada y sus capturas (o la portada del video). */
function shots(p: Project): Shot[] {
  const out: Shot[] = [];
  const c = cover(p);
  if (c) out.push({ src: c, ratio: 4 / 3 });
  for (const m of p.media ?? []) {
    const src =
      m.type === "image" ? m.src : m.type === "video" ? m.poster : undefined;
    if (src && !out.some((s) => s.src === src))
      out.push({ src, ratio: m.ratio ?? 16 / 10 });
  }
  return out.slice(0, 3);
}

/**
 * Dónde flotan las imágenes respecto a la fila activa (sin taparla):
 * x en % del ancho de la lista, y en px desde el centro de la fila, ancho en % y cuánto siguen al cursor.
 */
const SLOTS = [
  { x: -3, y: -330, w: 21, depth: 26, rot: -2 },
  { x: 77, y: -360, w: 23, depth: -18, rot: 2 },
  { x: 58, y: 70, w: 22, depth: 14, rot: -1 },
];
/** En las primeras filas no hay espacio arriba: las imágenes se acomodan debajo */
const SLOTS_BELOW = [
  { x: -3, y: 80, w: 21, depth: 26, rot: -2 },
  { x: 77, y: 60, w: 23, depth: -18, rot: 2 },
  { x: 36, y: 230, w: 20, depth: 14, rot: -1 },
];

/**
 * Proyectos como índice editorial: nombres grandes en serif fina, número a la izquierda y
 * plataforma y tecnologías a la derecha. Al pasar el cursor por un nombre, la fila se enciende
 * y sus capturas aparecen flotando alrededor y se mueven un poco con el cursor.
 * En celular cada fila muestra su portada pequeña.
 */
export default function ProjectList({
  onOpen,
}: {
  onOpen: (k: number) => void;
}) {
  const [on, setOn] = useState<number | null>(null);
  const [rowY, setRowY] = useState(0);

  const pick = (k: number) => (e: React.SyntheticEvent<HTMLButtonElement>) => {
    setOn(k);
    setRowY(e.currentTarget.offsetTop + e.currentTarget.offsetHeight / 2);
  };

  // Parallax: el cursor mueve las imágenes en distinta medida (--mx y --my entre -1 y 1)
  const move = (e: React.PointerEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty(
      "--mx",
      (((e.clientX - r.left) / r.width) * 2 - 1).toFixed(3),
    );
    e.currentTarget.style.setProperty(
      "--my",
      (((e.clientY - r.top) / r.height) * 2 - 1).toFixed(3),
    );
  };

  return (
    <div
      onPointerMove={move}
      onMouseLeave={() => setOn(null)}
      className="relative mt-[clamp(40px,6vw,80px)]"
    >
      <ul className="border-t border-line">
        {projects.map((p, k) => {
          const a = on === k;
          const dim = on !== null && !a;
          return (
            <li
              key={p.id}
              data-a="clip"
              className="rv border-b border-line [&.vis]:[clip-path:none]!"
              style={{ transitionDelay: `${k * 0.07}s` }}
            >
              <button
                type="button"
                onMouseEnter={pick(k)}
                onFocus={pick(k)}
                onClick={() => onOpen(k)}
                aria-label={`Abrir ${p.title}`}
                className="grid w-full cursor-pointer grid-cols-[clamp(90px,9vw,130px)_minmax(0,1fr)_minmax(0,auto)_28px] items-center gap-x-[clamp(16px,2vw,32px)] py-[clamp(10px,1.2vw,18px)] text-left max-[900px]:grid-cols-[minmax(0,1fr)_96px] max-[900px]:gap-y-2 max-[900px]:py-5"
              >
                <span
                  className={cx(
                    "mono transition-colors duration-500 max-[900px]:col-span-full",
                    a ? "text-fg" : "text-mut",
                  )}
                >
                  Proyecto /{pad(k + 1)}
                </span>

                <span
                  className={cx(
                    "block truncate font-serif text-[clamp(34px,5.3vw,92px)] leading-[1.05] font-light tracking-[-.01em] uppercase transition-[color,translate,opacity] duration-700 ease-expo max-[900px]:text-[clamp(30px,9vw,44px)] max-[900px]:whitespace-normal",
                    a
                      ? "translate-x-3 text-fg"
                      : dim
                        ? "text-fg/30"
                        : "text-fg/55 max-[900px]:text-fg",
                  )}
                >
                  {p.title}
                  <span className="text-[.5em]"> .</span>
                </span>

                {/* Portada pequeña solo en celular */}
                <span className="relative row-span-2 hidden aspect-[4/3] overflow-hidden rounded-xl min-[901px]:hidden max-[900px]:block">
                  {cover(p) && (
                    <Image
                      src={cover(p)!}
                      alt=""
                      fill
                      sizes="96px"
                      className="object-cover"
                    />
                  )}
                </span>

                <span
                  className={cx(
                    "mono max-w-[26em] text-right leading-relaxed transition-colors duration-500 max-[900px]:text-left",
                    a ? "text-fg" : "text-mut",
                  )}
                >
                  {platform(p.kind)} — {p.tags.slice(0, 2).join(" — ")}
                </span>

                <span
                  aria-hidden="true"
                  className={cx(
                    "text-2xl transition-[translate,color] duration-500 ease-expo max-[900px]:hidden",
                    a ? "translate-x-1 text-fg" : "text-mut",
                  )}
                >
                  →
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      {/* Capturas flotantes de la fila activa (solo con cursor, en pantallas anchas) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-10 max-[900px]:hidden"
      >
        {projects.map((p, k) =>
          shots(p).map((s, i) => {
            const slot = (rowY < 340 ? SLOTS_BELOW : SLOTS)[i];
            const show = on === k;
            const w = s.ratio < 1 ? slot.w * 0.45 : slot.w;
            return (
              <span
                key={`${p.id}-${i}`}
                style={{
                  left: `${slot.x}%`,
                  top: rowY + slot.y,
                  width: `${w}%`,
                  aspectRatio: String(s.ratio),
                  rotate: `${slot.rot}deg`,
                  translate: `calc(var(--mx,0) * ${slot.depth}px) calc(var(--my,0) * ${slot.depth}px)`,
                  transitionDelay: show ? `${i * 0.08}s` : "0s",
                }}
                className={cx(
                  "absolute overflow-hidden rounded-[14px] shadow-[0_40px_80px_-30px_rgba(0,0,0,.75)] transition-[opacity,scale,translate,top] duration-700 ease-expo",
                  show ? "scale-100 opacity-100" : "scale-90 opacity-0",
                )}
              >
                <Image
                  src={s.src}
                  alt=""
                  fill
                  sizes="(max-width: 1400px) 24vw, 340px"
                  className="object-cover"
                />
              </span>
            );
          }),
        )}
      </div>
    </div>
  );
}
