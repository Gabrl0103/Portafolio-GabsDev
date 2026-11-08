"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { experience } from "@/data/experience";
import { cx } from "../ui";
import { lab } from "./btn";
import RollText from "./RollText";
import SplitTitle from "./SplitTitle";

const COLORS = ["var(--olive)", "var(--orange)", "var(--cream)"];
const KIND = { academica: "Académica", laboral: "Laboral" } as const;

/** Experiencia: filas que se rellenan al pasar el cursor, sobre la textura de leopardo y los tigres. */
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
        if (q.bottom > 0 && q.top < innerHeight) t.style.translate = `0 ${((q.top + q.height / 2 - innerHeight / 2) * -0.1).toFixed(1)}px`;
      }
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <section id="experiencia" className="tx overflow-x-clip pb-[clamp(90px,11vw,170px)] [--tx:var(--leo)]">
      <div ref={wrap} className="wrap relative isolate">
        <div
          ref={tigers}
          aria-hidden="true"
          className="pointer-events-none absolute top-[12%] -right-[4vw] -z-1 aspect-[900/462] w-[min(60vw,780px)] opacity-[.24] mix-blend-screen grayscale-[.85] [mask-image:radial-gradient(ellipse_62%_66%_at_50%_50%,#000_45%,transparent_100%)] max-[900px]:-right-[20vw] max-[900px]:w-[96vw] max-[900px]:opacity-[.22] light:opacity-[.55] light:mix-blend-multiply light:[filter:grayscale(1)_contrast(1.5)_brightness(.85)]"
        >
          <Image src="/img/tigres.webp" alt="" fill sizes="(max-width: 900px) 96vw, 780px" className="object-cover" />
        </div>

        <div className={cx(lab, "rv")}>
          <b>(06)</b> Experiencia académica y laboral
        </div>
        <SplitTitle lines={["Dónde", "he estado"]} className="mt-[22px]" />

        <ul className="mt-[clamp(36px,5vw,70px)] border-t border-line">
          {experience.map((e, i) => (
            <li
              key={e.title}
              data-a={i % 2 ? "blur" : "scale"}
              style={{ "--pa": COLORS[i % 3] } as React.CSSProperties}
              className="trig rv group relative isolate grid grid-cols-[200px_1fr_auto] items-center gap-x-[30px] gap-y-2.5 border-b border-line py-[30px] [transition:opacity_1s_ease,transform_1.2s_var(--ease-expo),filter_1.2s_ease,padding_.6s_var(--ease-expo),color_.4s] before:absolute before:inset-y-0 before:-right-5 before:-left-5 before:-z-1 before:origin-bottom before:scale-y-0 before:bg-fg before:transition-transform before:duration-550 before:ease-expo hover:pl-6 hover:text-bg hover:before:scale-y-100 max-[900px]:grid-cols-1 max-[900px]:gap-2"
            >
              <span className="mono text-mut group-hover:text-bg">{e.start ? `${e.start} — ${e.end}` : e.end}</span>
              <div>
                <b className="block font-disp text-[clamp(26px,3.6vw,56px)] leading-none font-medium tracking-[-.045em]">
                  <RollText text={e.title} />
                </b>
                <small className="mt-1.5 block text-[15px] opacity-70">{e.place}</small>
                <p className="mt-2.5 max-w-[46em] text-[15px] leading-normal text-soft transition-colors group-hover:text-bg/75">{e.description}</p>
              </div>
              <span className="justify-self-start rounded-full bg-(--pa) px-3 py-1 font-mono text-[11px] font-medium tracking-[.1em] text-pill uppercase">{KIND[e.kind]}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
