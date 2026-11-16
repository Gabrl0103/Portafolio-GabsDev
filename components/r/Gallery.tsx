"use client";

import Image from "next/image";
import { useState } from "react";
import type { ProjectMedia } from "@/types";
import { cx } from "../ui";

/** Una pieza de la galería a tamaño completo. */
function Viewer({ m }: { m: ProjectMedia }) {
  if (m.type === "image") return <Image src={m.src} alt={m.alt} fill sizes="(max-width: 900px) 100vw, 55vw" className="object-contain" />;
  if (m.type === "video")
    return (
      <video src={m.src} poster={m.poster} controls playsInline preload="metadata" aria-label={m.alt} className="absolute inset-0 h-full w-full bg-black object-contain" />
    );
  return (
    <iframe
      src={`https://www.youtube-nocookie.com/embed/${m.id}`}
      title={m.alt}
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
      className="absolute inset-0 h-full w-full border-0"
    />
  );
}

function thumb(m: ProjectMedia) {
  if (m.type === "image") return m.src;
  if (m.type === "video") return m.poster;
  return `https://i.ytimg.com/vi/${m.id}/hqdefault.jpg`;
}

/** Galería del detalle: visor grande y miniaturas para cambiar entre capturas y videos. */
export default function Gallery({ media }: { media: ProjectMedia[] }) {
  const [i, setI] = useState(0);
  const cur = media[Math.min(i, media.length - 1)];

  return (
    <div>
      <div className="relative aspect-[16/10] overflow-hidden rounded-[20px] bg-[color-mix(in_srgb,var(--pa)_16%,var(--bg2))]">
        <Viewer key={i} m={cur} />
      </div>
      {media.length > 1 && (
        <ul className="mt-3 flex gap-2 overflow-x-auto pb-1" aria-label="Capturas y videos">
          {media.map((m, k) => {
            const src = thumb(m);
            return (
              <li key={k} className="shrink-0">
                <button
                  type="button"
                  aria-label={`Ver: ${m.alt}`}
                  aria-pressed={k === i}
                  onClick={() => setI(k)}
                  className={cx(
                    "relative block h-[64px] w-[100px] cursor-pointer overflow-hidden rounded-[10px] border-2 bg-bg2 p-0 transition-[border-color,opacity] duration-300",
                    k === i ? "border-(--pa)" : "border-transparent opacity-60 hover:opacity-100",
                  )}
                >
                  {src ? (
                    <Image src={src} alt="" fill sizes="100px" unoptimized={m.type === "youtube"} className="object-cover" />
                  ) : (
                    <span className="mono grid h-full place-items-center text-mut">Video</span>
                  )}
                  {m.type !== "image" && (
                    <span aria-hidden="true" className="absolute inset-0 grid place-items-center text-lg text-white [text-shadow:0_1px_8px_rgba(0,0,0,.6)]">
                      ▶
                    </span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
