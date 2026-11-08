import { site } from "@/data/site";
import { testimonials } from "@/data/testimonials";
import { cx } from "../ui";
import { lab } from "./btn";
import SplitTitle from "./SplitTitle";

const pad = (n: number) => String(n).padStart(2, "0");
const CARDS = ["bg-olive text-pill", "bg-cream text-pill", "bg-orange text-white"];

/** Testimonios: tarjetas que se apilan al bajar (sticky). */
export default function TestimonialsR() {
  return (
    <section id="testimonios" className="py-[clamp(90px,11vw,170px)]">
      <div className="wrap">
        <div className={cx(lab, "rv")}>
          <b>(05)</b> Testimonios
        </div>
        <SplitTitle lines={["Lo que dicen", "de trabajar conmigo"]} className="mt-[22px]" />

        <div className="mt-[clamp(40px,6vw,80px)]">
          {testimonials.map((t, i) => (
            <figure
              key={i}
              style={{ top: `calc(90px + ${i * 26}px)` }}
              className={cx(
                "sticky isolate mb-[12vh] flex min-h-[min(62vh,520px)] flex-col justify-between gap-[30px] overflow-hidden rounded-[26px] p-[clamp(24px,3.4vw,52px)] shadow-[0_30px_70px_-40px_rgba(0,0,0,.6)] before:absolute before:inset-0 before:-z-1 before:bg-(image:--tex) before:bg-[length:360px] before:opacity-[.22] before:mix-blend-multiply",
                CARDS[i % 3],
              )}
            >
              <div className="mono flex justify-between">
                <span>
                  {pad(i + 1)} / {pad(testimonials.length)}
                </span>
                <span aria-hidden="true">“</span>
              </div>
              <blockquote className="max-w-[20em] font-disp text-[clamp(28px,4.4vw,70px)] leading-[1.04] font-medium tracking-[-.045em]">{t.quote}</blockquote>
              <figcaption className="flex items-end justify-between gap-5 font-disp text-[15px] font-medium">
                <span>
                  {t.name}
                  <small className="block font-sans text-sm font-normal opacity-70">{t.role}</small>
                </span>
                <span className="mono">
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
