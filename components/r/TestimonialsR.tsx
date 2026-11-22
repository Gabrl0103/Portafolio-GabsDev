"use client";

import { useContent } from "@/lib/content";
import { useT } from "@/lib/i18n";
import { cx } from "../ui";
import { lab } from "./btn";
import SplitTitle from "./SplitTitle";
import Tape from "./Tape";

const pad = (n: number) => String(n).padStart(2, "0");
/** Las tres tarjetas en color hueso (como el papel del tema claro, un poco más claro para destacar en él) */
const CARD = "bg-[#e9dccb] text-[#1a1512] light:bg-[#f3ebdf]";

/** Testimonios: tarjetas que se apilan al bajar (sticky). */
export default function TestimonialsR() {
  const t = useT();
  const { site, testimonials, sections } = useContent();
  return (
    <section
      id="testimonios"
      className="glow [--gc:var(--cream)] [--gx:50%] [--gy:0%] py-[clamp(90px,11vw,170px)]"
    >
      <div className="wrap">
        <div className={cx(lab, "rv")}>
          <b>(04)</b> {sections.find((s) => s.id === "testimonios")?.label}
        </div>
        <SplitTitle
          lines={[t("Lo que *dicen*", "What people *say*"), t("de trabajar conmigo", "about working with me")]}
          className="mt-[22px]"
        />

        <div className="mt-[clamp(40px,6vw,80px)]">
          {testimonials.map((q, i) => (
            <figure
              key={i}
              style={{ top: `calc(90px + ${i * 26}px)` }}
              className={cx(
                "sticky isolate mb-[12vh] flex min-h-[min(62vh,520px)] flex-col justify-between gap-[30px] overflow-hidden rounded-[26px] p-[clamp(24px,3.4vw,52px)] shadow-[0_30px_70px_-40px_rgba(0,0,0,.6)] before:absolute before:inset-0 before:-z-1 before:bg-(image:--tex) before:bg-[length:360px] before:opacity-[.22] before:mix-blend-multiply light:before:opacity-[.1]",
                CARD,
              )}
            >
              <Tape
                v={i}
                className="top-0 left-1/2 -translate-x-1/2 rotate-[1deg]"
              />
              <div className="mono flex justify-between">
                <span>
                  {pad(i + 1)} / {pad(testimonials.length)}
                </span>
                <span aria-hidden="true">“</span>
              </div>
              <blockquote className="max-w-[20em] font-disp text-[clamp(22px,3vw,46px)] leading-[1.1] font-medium tracking-[-.045em]">
                {q.quote}
              </blockquote>
              <figcaption className="flex items-end justify-between gap-5 font-disp text-[15px] font-medium">
                <span>
                  {q.name}
                  <small className="block font-sans text-sm font-normal opacity-70">
                    {q.role}
                  </small>
                </span>
                <span className="mono whitespace-nowrap">
                  {site.name} · {site.year}
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
