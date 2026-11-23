"use client";

import { useState } from "react";
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

/**
 * Testimonios, solo tipografía: a la izquierda el índice de quienes opinan (con sus iniciales);
 * a la derecha la cita activa en grande. Se cambia al pasar el cursor, al tocar o con las flechas.
 */
export default function Testimonials() {
  const t = useT();
  const { testimonials, sections } = useContent();
  const [on, setOn] = useState(0);
  const cur = testimonials[on];
  const n = testimonials.length;
  return (
    <section
      id="testimonios"
      className="relative px-8 pt-[22px] pb-28 max-[700px]:px-[18px]"
    >
      <PageHead n={4} label={sections[3].label} />
      <div className="grid grid-cols-[.9fr_1.1fr] gap-14 max-[900px]:grid-cols-1">
        <div className="rv">
          <h2 className="display text-[118px] max-[900px]:text-[64px]">
            {t("Lo que", "What they")}
            <br />
            {t("dicen", "say")}
          </h2>
          <ol
            className="mt-12 border-t border-fg"
            aria-label={t("Quiénes opinan", "Who says it")}
          >
            {testimonials.map((q, i) => (
              <li key={q.name} className="border-b border-line">
                <button
                  type="button"
                  onMouseEnter={() => setOn(i)}
                  onFocus={() => setOn(i)}
                  onClick={() => setOn(i)}
                  aria-pressed={on === i}
                  className={cx(
                    "grid w-full grid-cols-[46px_44px_1fr] items-center gap-3 py-4 text-left transition-opacity",
                    on === i ? "opacity-100" : "opacity-45 hover:opacity-80",
                  )}
                >
                  <span className="label text-soft">
                    {String(i + 1).padStart(3, "0")}
                  </span>
                  <span
                    aria-hidden="true"
                    className="label grid size-10 place-items-center rounded-full border border-fg font-semibold"
                  >
                    {initials(q.name)}
                  </span>
                  <span>
                    <b className="block text-[20px] font-extrabold tracking-[-.03em]">
                      {q.name}
                    </b>
                    <span className="label text-soft">{q.role}</span>
                  </span>
                </button>
              </li>
            ))}
          </ol>
        </div>

        <figure className="rv flex flex-col" aria-live="polite">
          <span
            aria-hidden="true"
            className="display text-[180px] leading-[.6]"
          >
            “
          </span>
          <blockquote
            key={on}
            className="mt-6 text-[clamp(26px,2.6vw,40px)] leading-[1.15] font-semibold tracking-[-.03em] max-[700px]:text-[24px]"
          >
            {cur.quote}
          </blockquote>
          <figcaption className="mt-8 flex items-end justify-between gap-6 border-t border-fg pt-4">
            <span>
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
              >
                ←
              </button>
              {String(on + 1).padStart(2, "0")} / {String(n).padStart(2, "0")}
              <button
                type="button"
                aria-label={t("Siguiente", "Next")}
                onClick={() => setOn((on + 1) % n)}
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
