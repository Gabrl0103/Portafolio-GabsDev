"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { experience } from "@/data/experience";
import { cx } from "../ui";
import { lab } from "./btn";
import RollText from "./RollText";
import SplitTitle from "./SplitTitle";

const GROUPS = [
  { kind: "laboral", title: "Experiencia laboral", c: "var(--orange)" },
  { kind: "academica", title: "Experiencia académica", c: "var(--olive)" },
] as const;

/** Experiencia: línea de tiempo vertical en dos partes (laboral y académica), sobre la textura de leopardo y los tigres. */
export default function ExperienceR() {
  const wrap = useRef<HTMLDivElement>(null);
  const tigers = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    const frame = () => {
      const w = wrap.current;
      const t = tigers.current;
      if (w && t) {
        const q = w.getBoundingClientRect();
        if (q.bottom > 0 && q.top < innerHeight)
          t.style.translate = `0 ${((q.top + q.height / 2 - innerHeight / 2) * -0.1).toFixed(1)}px`;
      }
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <section
      id="experiencia"
      className="tx overflow-x-clip pb-[clamp(90px,11vw,170px)] [--tx:var(--leo)]"
    >
      <div ref={wrap} className="wrap relative isolate">
        <div
          ref={tigers}
          aria-hidden="true"
          className="pointer-events-none absolute top-[12%] -right-[4vw] -z-1 aspect-[900/462] w-[min(60vw,780px)] opacity-[.24] mix-blend-screen grayscale-[.85] [mask-image:radial-gradient(ellipse_62%_66%_at_50%_50%,#000_45%,transparent_100%)] max-[900px]:-right-[20vw] max-[900px]:w-[96vw] max-[900px]:opacity-[.22] light:opacity-[.55] light:mix-blend-multiply light:[filter:grayscale(1)_contrast(1.5)_brightness(.85)]"
        >
          <Image
            src="/img/tigres.webp"
            alt=""
            fill
            sizes="(max-width: 900px) 96vw, 780px"
            className="object-cover"
          />
        </div>

        <div className={cx(lab, "rv")}>
          <b>(05)</b> Experiencia académica y laboral
        </div>
        <SplitTitle lines={["Dónde", "he estado"]} className="mt-[22px]" />

        {/* Línea de tiempo en dos partes: académica y laboral, de lo más reciente a lo más antiguo */}
        <div className="mt-[clamp(40px,6vw,80px)] grid grid-cols-2 gap-x-[clamp(30px,5vw,90px)] gap-y-14 max-[900px]:grid-cols-1">
          {GROUPS.map((g) => (
            <div key={g.kind}>
              <h3 className="mono flex items-center gap-3 text-mut">
                <span
                  aria-hidden="true"
                  className="size-2.5 rounded-full"
                  style={{ background: g.c }}
                />
                {g.title}
              </h3>
              <ol className="relative mt-6 border-l-2 border-line pl-[clamp(24px,2.6vw,38px)]">
                {experience
                  .filter((e) => e.kind === g.kind)
                  .map((e, i) => (
                    <li
                      key={e.title}
                      data-a="left"
                      style={
                        {
                          "--pa": g.c,
                          transitionDelay: `${i * 0.08}s`,
                        } as React.CSSProperties
                      }
                      className="trig rv group relative pb-[clamp(30px,4vw,52px)] last:pb-0 [&.vis]:[clip-path:none]!"
                    >
                      {/* Punto sobre la línea; el actual late */}
                      <span
                        aria-hidden="true"
                        className={cx(
                          "absolute top-[.45em] -left-[calc(clamp(24px,2.6vw,38px)+7px)] size-3 rounded-full border-2 border-bg bg-(--pa) transition-transform duration-500 ease-back group-hover:scale-150",
                          e.end === "Hoy" &&
                            "after:absolute after:-inset-1 after:animate-ping after:rounded-full after:bg-(--pa) after:opacity-40",
                        )}
                      />
                      <span className="mono text-mut">
                        {e.start ? `${e.start} — ${e.end}` : e.end}
                      </span>
                      <b className="mt-2 block font-disp text-[clamp(24px,2.6vw,40px)] leading-[1.05] font-medium tracking-[-.04em] transition-colors group-hover:text-(--pa)">
                        <RollText text={e.title} />
                      </b>
                      <small className="mt-1.5 block text-[15px] text-soft">
                        {e.place}
                      </small>
                      <p className="mt-2.5 max-w-[34em] text-[15px] leading-normal text-soft">
                        {e.description}
                      </p>
                    </li>
                  ))}
              </ol>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
