"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useT } from "@/lib/i18n";
import type { ProjectMedia } from "@/types";
import { cx } from "../ui";

/** Una pieza de la galería a tamaño completo. */
function Viewer({ m }: { m: ProjectMedia }) {
  if (m.type === "image")
    return (
      <Image
        src={m.src}
        alt={m.alt}
        fill
        sizes="(max-width: 900px) 100vw, 55vw"
        className="object-cover"
      />
    );
  if (m.type === "video") return <AutoVideo m={m} />;
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

/**
 * Video de la demo: arranca solo, en silencio y en bucle, sin barra.
 * La barra aparece al pasar el cursor (o al tocarlo en celular).
 */
function AutoVideo({ m }: { m: Extract<ProjectMedia, { type: "video" }> }) {
  const [bar, setBar] = useState(false);
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const v = ref.current;
    if (!v || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    v.play().catch(() => {});
  }, []);
  return (
    <video
      ref={ref}
      src={m.src}
      poster={m.poster}
      muted
      loop
      autoPlay
      playsInline
      preload="auto"
      controls={bar}
      aria-label={m.alt}
      onMouseEnter={() => setBar(true)}
      onMouseLeave={() => setBar(false)}
      onFocus={() => setBar(true)}
      onBlur={() => setBar(false)}
      onTouchStart={() => setBar(true)}
      tabIndex={0}
      className="absolute inset-0 h-full w-full object-cover"
    />
  );
}

function thumb(m: ProjectMedia) {
  if (m.type === "image") return m.src;
  if (m.type === "video") return m.poster;
  return `https://i.ytimg.com/vi/${m.id}/hqdefault.jpg`;
}

/**
 * Galería del detalle: visor grande y miniaturas para cambiar entre capturas y videos.
 * El visor toma la forma de cada archivo (horizontal, cuadrado o de celular) para que lo llene entero;
 * los verticales se limitan en alto y quedan centrados.
 */
export default function Gallery({ media }: { media: ProjectMedia[] }) {
  const t = useT();
  const [i, setI] = useState(0);
  const cur = media[Math.min(i, media.length - 1)];
  const ratio = cur.ratio ?? (cur.type === "youtube" ? 16 / 9 : 16 / 10);

  return (
    <div>
      <div
        style={{
          aspectRatio: ratio,
          width: cur.round
            ? "min(100%, 62svh, 520px)"
            : `min(100%, calc(min(78svh, 760px) * ${ratio}))`,
        }}
        className={cx(
          "relative mx-auto overflow-hidden bg-fg/[.06]",
          cur.round
            ? "rounded-full border-[8px] border-[#1d1d1d] shadow-[0_30px_60px_-30px_rgba(0,0,0,.6)]"
            : ratio < 0.7 &&
                "rounded-[30px] border-[7px] border-[#1d1d1d] shadow-[0_30px_60px_-30px_rgba(0,0,0,.6)]",
        )}
      >
        <Viewer key={i} m={cur} />
      </div>
      {media.length > 1 && (
        <ul
          className="mt-3 flex justify-center gap-2 overflow-x-auto pb-1"
          aria-label={t("Capturas y videos", "Screenshots and videos")}
        >
          {media.map((m, k) => {
            const src = thumb(m);
            return (
              <li key={k} className="shrink-0">
                <button
                  type="button"
                  aria-label={t(`Ver: ${m.alt}`, `View: ${m.alt}`)}
                  aria-pressed={k === i}
                  onClick={() => setI(k)}
                  className={cx(
                    "relative block h-[64px] w-[100px] cursor-pointer overflow-hidden border-2 bg-fg/[.06] p-0 transition-[border-color,opacity] duration-300",
                    k === i
                      ? "border-fg"
                      : "border-transparent opacity-60 hover:opacity-100",
                  )}
                >
                  {src ? (
                    <Image
                      src={src}
                      alt=""
                      fill
                      sizes="100px"
                      unoptimized={m.type === "youtube"}
                      className="object-cover"
                    />
                  ) : (
                    <span className="label grid h-full place-items-center text-soft">
                      Video
                    </span>
                  )}
                  {m.type !== "image" && (
                    <span
                      aria-hidden="true"
                      className="absolute inset-0 grid place-items-center text-lg text-white [text-shadow:0_1px_8px_rgba(0,0,0,.6)]"
                    >
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
