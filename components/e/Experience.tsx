"use client";

import { useContent } from "@/lib/content";
import { useT } from "@/lib/i18n";
import { ArrowDown, PageHead } from "./parts";

/**
 * Experiencia como página de CV: "CV" gigante, la hoja del CV dibujada para descargarla
 * y tres columnas: experiencia laboral, educación y herramientas.
 */
export default function Experience() {
  const t = useT();
  const { experience, services, sections, site } = useContent();
  const work = experience.filter((e) => e.kind === "laboral");
  const study = experience.filter((e) => e.kind === "academica");
  const tools = services.filter((s) => s.tools.length);
  const date = (s: string, e: string) => (s ? `${s} — ${e}` : e);

  return (
    <section
      id="experiencia"
      className="relative flex min-h-svh flex-col px-8 pt-[94px] max-[700px]:pt-[94px] pb-24 max-[700px]:px-[18px]"
    >
      <PageHead n={5} label={sections[4].label} />
      <div className="mt-auto grid grid-cols-2 items-end gap-14 max-[900px]:grid-cols-1">
        <h2 className="display rv text-[200px] max-[900px]:text-[110px]">CV</h2>

        {/* La hoja del CV, dibujada (sin foto) */}
        <a
          href={site.cv}
          download="CV-Gabriel-Guerrero.pdf"
          className="rv group flex items-end justify-end gap-6 max-[900px]:justify-start"
        >
          <span
            aria-hidden="true"
            className="relative block h-[210px] w-[160px] rotate-[-3deg] bg-white p-4 shadow-[0_24px_40px_-24px_rgba(0,0,0,.45)] transition-transform duration-500 ease-expo group-hover:rotate-0 group-hover:-translate-y-1.5"
          >
            <span className="block text-[13px] leading-none font-extrabold tracking-[-.03em] text-[#111]">
              Gabriel Guerrero
            </span>
            <span className="mt-1 block text-[6px] tracking-[.08em] text-[#6d6a65] uppercase">
              {site.role}
            </span>
            {[90, 70, 84, 60, 0, 88, 76, 66, 0, 80, 58, 72].map((w, i) => (
              <span
                key={i}
                className="mt-[7px] block h-[3px] bg-[#111]/15"
                style={{ width: `${w}%`, opacity: w ? 1 : 0 }}
              />
            ))}
            <span className="label absolute right-3 bottom-2 text-[8px] text-[#6d6a65]">
              PDF
            </span>
          </span>
          <span>
            <span className="label block text-soft">
              {t("Hoja de vida · PDF", "Résumé · PDF")}
            </span>
            <span className="pill pill-fill mt-3">
              {t("Descargar CV ↓", "Download CV ↓")}
            </span>
          </span>
        </a>
      </div>

      <div className="rv mt-14 mb-auto grid grid-cols-3 gap-8 max-[900px]:grid-cols-1">
        {[
          [t("Experiencia", "Experience"), work],
          [t("Educación", "Education"), study],
        ].map(([title, list]) => (
          <div key={title as string}>
            <p className="label mb-3.5 border-b border-fg pb-2">
              {title as string}
            </p>
            {(list as typeof experience).map((e) => (
              <div key={e.title} className="mb-5">
                <p className="label text-soft">{date(e.start, e.end)}</p>
                <b className="mt-1 mb-0.5 block text-[17px] font-bold tracking-[-.02em]">
                  {e.title}
                </b>
                <p className="text-[13px] text-soft">{e.place}</p>
                <p className="mt-1.5 text-[13px] leading-[1.45]">
                  {e.description}
                </p>
              </div>
            ))}
          </div>
        ))}
        <div>
          <p className="label mb-3.5 border-b border-fg pb-2">
            {t("Herramientas", "Tools")}
          </p>
          {tools.map((s) => (
            <div key={s.title} className="mb-4">
              <p className="label text-soft">{s.title}</p>
              <p className="mt-1 text-[15px] font-semibold tracking-[-.01em]">
                {s.tools.map((x) => x.name).join(" · ")}
              </p>
            </div>
          ))}
        </div>
      </div>
      <ArrowDown className="absolute right-8 bottom-8 max-[700px]:right-[18px]" />
    </section>
  );
}
