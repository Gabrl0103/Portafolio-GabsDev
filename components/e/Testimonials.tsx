"use client";

import { useEffect, useRef, useState } from "react";
import { useContent } from "@/lib/content";
import { useT } from "@/lib/i18n";
import { cx } from "../ui";
import { ArrowDown, PageHead } from "./parts";

const initials = (name: string) =>
  name
    .split(/[\s,]+/)
    .filter((w) => /^[A-ZÁÉÍÓÚÑ]/.test(w))
    .slice(0, 2)
    .map((w) => w[0])
    .join("");

/** Tiempo que se queda cada cita antes de pasar a la siguiente */
const STAY = 7000;

/**
 * Testimonios, solo tipografía: a la izquierda el índice de quienes opinan (con sus iniciales);
 * a la derecha la cita activa, que entra palabra por palabra. Pasan solas con una barra de
 * progreso; se detienen al pasar el cursor y se cambian al tocar o con las flechas.
 */
export default function Testimonials() {
  const t = useT();
  const { testimonials, sections } = useContent();
  const [on, setOn] = useState(0);
  const [paused, setPaused] = useState(false);
  const [seen, setSeen] = useState(false);
  const box = useRef<HTMLDivElement>(null);
  const cur = testimonials[on];
  const n = testimonials.length;

  // Solo corre mientras la sección está en pantalla
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => setSeen(e.isIntersecting), {
      threshold: 0.35,
    });
    if (box.current) io.observe(box.current);
    return () => io.disconnect();
  }, []);

  const running =
    seen &&
    !paused &&
    typeof window !== "undefined" &&
    !matchMedia("(prefers-reduced-motion: reduce)").matches;

  useEffect(() => {
    if (!running) return;
    const id = setTimeout(() => setOn((x) => (x + 1) % n), STAY);
    return () => clearTimeout(id);
  }, [running, on, n]);

  const words = cur.quote.split(" ");
  return (
    <section
      id="testimonios"
      className="relative flex min-h-svh flex-col px-8 pt-[94px] max-[700px]:pt-[94px] pb-24 max-[700px]:px-[18px]"
    >
      <PageHead n={4} label={sections[3].label} />
      <div
        ref={box}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onFocus={() => setPaused(true)}
        onBlur={() => setPaused(false)}
        className="my-auto grid grid-cols-[.9fr_1.1fr] gap-14 max-[900px]:grid-cols-1"
      >
        <div>
          <h2 className="display rv text-[118px] max-[900px]:text-[64px]">
            {t("Lo que", "What they")}
            <br />
            {t("dicen", "say")}
          </h2>
          <ol
            className="mt-12 border-t border-fg"
            aria-label={t("Quiénes opinan", "Who says it")}
          >
            {testimonials.map((q, i) => (
              <li
                key={q.name}
                className="rv relative border-b border-line"
                style={{ transitionDelay: `${150 + i * 110}ms` }}
              >
                <button
                  type="button"
                  onClick={() => setOn(i)}
                  aria-pressed={on === i}
                  className={cx(
                    "grid w-full grid-cols-[46px_44px_1fr] items-center gap-3 py-4 text-left transition-opacity duration-500",
                    on === i ? "opacity-100" : "opacity-40 hover:opacity-80",
                  )}
                >
                  <span className="label text-soft">
                    {String(i + 1).padStart(3, "0")}
                  </span>
                  <span
                    aria-hidden="true"
                    className={cx(
                      "label grid size-10 place-items-center rounded-full border border-fg font-semibold transition-colors duration-500",
                      on === i && "bg-fg text-bg",
                    )}
                  >
                    {initials(q.name)}
                  </span>
                  <span
                    className={cx(
                      "transition-transform duration-500 ease-expo",
                      on === i && "translate-x-1.5",
                    )}
                  >
                    <b className="block text-[20px] font-extrabold tracking-[-.03em]">
                      {q.name}
                    </b>
                    <span className="label text-soft">{q.role}</span>
                  </span>
                </button>
                {/* Progreso hasta la siguiente cita */}
                {on === i && (
                  <span
                    key={`${on}-${running}`}
                    aria-hidden="true"
                    className="absolute -bottom-px left-0 h-[2px] w-full origin-left bg-fg"
                    style={{
                      animation: `fill-x ${STAY}ms linear both`,
                      animationPlayState: running ? "running" : "paused",
                    }}
                  />
                )}
              </li>
            ))}
          </ol>
        </div>

        <figure className="rv flex flex-col" aria-live="polite">
          <span
            key={`q${on}`}
            aria-hidden="true"
            className="display word-in text-[180px] leading-[.6]"
          >
            “
          </span>
          <blockquote
            key={on}
            className="mt-6 text-[clamp(26px,2.6vw,40px)] leading-[1.15] font-semibold tracking-[-.03em] max-[700px]:text-[24px]"
          >
            {words.map((w, i) => (
              <span
                key={i}
                className="word-in"
                style={{ animationDelay: `${120 + i * 28}ms` }}
              >
                {w}
                {i < words.length - 1 && " "}
              </span>
            ))}
          </blockquote>
          <figcaption className="mt-8 flex items-end justify-between gap-6 border-t border-fg pt-4">
            <span key={`c${on}`} className="rise">
              <b className="block text-lg font-extrabold tracking-[-.02em]">
                {cur.name}
              </b>
              <span className="label text-soft">{cur.role}</span>
            </span>
            <span className="label flex items-center gap-4">
              <button
                type="button"
                aria-label={t("Anterior", "Previous")}
                onClick={() => setOn((on - 1 + n) % n)}
                className="transition-transform hover:-translate-x-1"
              >
                ←
              </button>
              {String(on + 1).padStart(2, "0")} / {String(n).padStart(2, "0")}
              <button
                type="button"
                aria-label={t("Siguiente", "Next")}
                onClick={() => setOn((on + 1) % n)}
                className="transition-transform hover:translate-x-1"
              >
                →
              </button>
            </span>
          </figcaption>
        </figure>
      </div>
      <ArrowDown className="absolute right-8 bottom-8 max-[700px]:right-[18px]" />
    </section>
  );
}
