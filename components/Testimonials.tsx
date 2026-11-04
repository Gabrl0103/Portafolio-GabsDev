import Image from "next/image";
import { testimonials } from "@/data/testimonials";
import SectionHead from "./SectionHead";

const initials = (name: string) =>
  name
    .replace(/[[\]]/g, "")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("");

export default function Testimonials() {
  return (
    <section id="testimonios" className="wrap flex flex-col gap-12 py-28 md:gap-16 md:py-36" data-sec>
      <SectionHead eyebrow="Testimonios" title="Lo que dicen" sub="Profesores, compañeros y clientes que han trabajado conmigo." />

      <ul className="m-0 grid list-none grid-cols-1 gap-4 p-0 md:grid-cols-2 lg:grid-cols-3">
        {testimonials.map((t, i) => (
          <li
            key={i}
            className="glass rv relative flex flex-col gap-6 overflow-hidden rounded-[30px] p-7 md:p-8"
            style={{ "--d": `${i * 0.1}s` } as React.CSSProperties}
          >
            <span aria-hidden="true" className="pointer-events-none absolute top-2 right-6 font-cine text-[120px] leading-none text-acc opacity-25">
              &rdquo;
            </span>
            {t.rating && (
              <span className="text-sm tracking-[.2em] text-acc" aria-label={`${t.rating} de 5 estrellas`}>
                {"★".repeat(t.rating)}
                <span className="text-line2">{"★".repeat(5 - t.rating)}</span>
              </span>
            )}
            <blockquote className="m-0 flex-1 text-lg leading-relaxed text-soft">“{t.quote}”</blockquote>
            <div className="flex items-center gap-3">
              {t.photo ? (
                <Image src={t.photo} alt="" width={48} height={48} className="size-12 rounded-full object-cover" />
              ) : (
                <span aria-hidden="true" className="flex size-12 flex-none items-center justify-center rounded-full bg-acc font-semibold text-acc-ink">
                  {initials(t.name) || "?"}
                </span>
              )}
              <div className="min-w-0">
                <p className="m-0 font-semibold text-fg">{t.name}</p>
                <p className="m-0 text-sm text-mut">{t.role}</p>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
