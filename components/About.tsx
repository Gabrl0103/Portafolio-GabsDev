"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { chapters, facts } from "@/data/about";
import { site, tools } from "@/data/site";
import Hid, { Koi } from "./fx/Hid";
import TypeTitle from "./fx/TypeTitle";
import { chip, cx } from "./ui";

/** Sobre mí en capítulos: la sección queda fija y cada tramo de scroll muestra un capítulo. */
export default function About() {
  const sec = useRef<HTMLElement>(null);
  const [idx, setIdx] = useState(0);
  const [frac, setFrac] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const n = chapters.length;

  useEffect(() => {
    const update = () => {
      const el = sec.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const total = Math.max(1, el.offsetHeight - innerHeight);
      const p = Math.min(0.9999, Math.max(0, -r.top / total));
      const i = Math.floor(p * n);
      setIdx(i);
      setFrac(p * n - i);
      setScrolled(p > 0.03);
    };
    update();
    addEventListener("scroll", update, { passive: true });
    addEventListener("resize", update);
    return () => {
      removeEventListener("scroll", update);
      removeEventListener("resize", update);
    };
  }, [n]);

  const goTo = (i: number) => {
    const el = sec.current;
    if (!el) return;
    const top = el.getBoundingClientRect().top + scrollY;
    const total = el.offsetHeight - innerHeight;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    scrollTo({ top: top + ((i + 0.5) / n) * total, behavior: reduce ? "auto" : "smooth" });
  };

  return (
    // Sección alta (440vh) con un bloque fijo: cada tramo de scroll muestra un capítulo.
    <section id="sobre-mi" ref={sec} className="relative h-[440vh]" data-sec aria-label="Sobre mí">
      <div className="sticky top-0 flex h-svh items-center overflow-hidden">
        <div className="rv pointer-events-none absolute inset-x-0 top-24 z-[5] flex flex-col items-center gap-1.5 text-center">
          <span className="text-base font-semibold tracking-[-.01em] text-acc">Sobre mí</span>
          <TypeTitle text="Quién está detrás" className="text-[clamp(22px,2.4vw,32px)] font-medium text-mut" />
        </div>

        {chapters.map((c, i) => {
          const on = i === idx;
          return (
            <article
              key={c.n}
              aria-hidden={!on}
              className={cx(
                // El capítulo ocupa el espacio entre el título (arriba) y los indicadores (abajo).
                "absolute inset-0 flex items-center px-[max(24px,6vw)] pt-[176px] pb-[84px]",
                on ? "visible opacity-100 [transition:opacity_.8s_ease]" : "invisible opacity-0 [transition:opacity_.8s_ease,visibility_0s_.8s]",
              )}
            >
              <span
                aria-hidden="true"
                className={cx(
                  "pointer-events-none absolute top-1/2 right-[max(16px,5vw)] -translate-y-1/2 text-[clamp(260px,46vw,640px)] leading-[.8] font-semibold tracking-[-.04em] text-transparent transition-transform duration-[1.2s] ease-out-soft max-[860px]:hidden",
                  on ? "scale-100 [-webkit-text-stroke:1px_var(--acc)]" : "scale-[.92] [-webkit-text-stroke:1px_var(--line2)]",
                )}
              >
                {i === 1 && (
                  <span className="absolute top-[3%] left-[3%] flex gap-[.14em] text-[.1em] leading-none font-light opacity-75 [-webkit-text-stroke-width:.5px] [&_i]:font-light [&_i]:not-italic">
                    <i>2</i>
                    <i>2</i>
                  </span>
                )}
                {i + 1}
              </span>
              <div
                className={cx(
                  "glass relative z-[2] flex max-h-full max-w-[min(580px,46vw)] flex-col gap-[clamp(10px,2vh,20px)] rounded-[34px] p-[clamp(20px,min(3vw,4.5vh),44px)] transition-transform duration-1000 ease-out-soft max-[860px]:max-w-full",
                  on ? "translate-y-0" : "translate-y-[26px]",
                )}
              >
                <div className="flex items-center gap-3">
                  {i === 0 && (
                    <Image
                      src={site.photo}
                      alt={`Foto de ${site.name}`}
                      width={56}
                      height={56}
                      unoptimized={site.photo.endsWith(".svg")}
                      className="size-12 rounded-full object-cover md:size-14"
                    />
                  )}
                  <span className="text-base font-semibold text-acc">{c.n}</span>
                </div>
                <h3 className="text-[clamp(34px,min(7vw,8.5vh),104px)] leading-none tracking-[-.04em]">{c.title}</h3>
                <p className="m-0 max-w-[30ch] text-[clamp(16px,min(1.7vw,2.7vh),24px)] leading-[1.45] text-soft">{c.text}</p>
                {(i === 0 || i === n - 1) && (
                  <ul className="m-0 flex list-none flex-wrap gap-2 p-0" aria-label={i === 0 ? "Datos rápidos" : "Tecnologías"}>
                    {(i === 0 ? facts : tools).map((f) => (
                      <li key={f}>
                        <span className={cx(chip, "max-[860px]:px-2.5 max-[860px]:py-1 max-[860px]:text-xs")}>{f}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </article>
          );
        })}

        <ol className="absolute bottom-[34px] left-[max(24px,6vw)] z-[6] m-0 flex list-none gap-2.5 p-0" aria-label="Capítulos">
          {chapters.map((c, i) => (
            <li key={c.n} className="py-3.5">
              <button
                type="button"
                aria-label={c.title}
                aria-current={i === idx ? "step" : undefined}
                onClick={() => goTo(i)}
                style={{ "--k": i < idx ? 1 : i === idx ? frac.toFixed(3) : 0 } as React.CSSProperties}
                className="relative block h-1 w-[38px] cursor-pointer overflow-hidden rounded-xs border-0 bg-line2 p-0 after:absolute after:inset-0 after:origin-left after:scale-x-(--k) after:bg-acc"
              />
            </li>
          ))}
        </ol>
        <span
          className="absolute right-[max(24px,6vw)] bottom-[88px] z-[6] text-sm/[1.5] text-mut transition-opacity duration-500 max-[860px]:hidden"
          style={{ opacity: scrolled ? 0 : 1 }}
        >
          Sigue bajando ↓
        </span>

        <Hid x="46%" y="14%">222</Hid>
        <Hid x="40%" y="82%">
          <Koi w={60} />
        </Hid>
      </div>
    </section>
  );
}
