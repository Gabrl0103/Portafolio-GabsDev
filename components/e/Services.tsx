"use client";

import { useContent } from "@/lib/content";
import { useT } from "@/lib/i18n";
import { ArrowDown, PageHead, pad } from "./parts";

/** Servicios: el título a la izquierda y la lista numerada, cada uno con sus herramientas. */
export default function Services() {
  const t = useT();
  const { services, sections } = useContent();
  return (
    <section
      id="servicios"
      className="relative px-8 pt-[22px] pb-28 max-[700px]:px-[18px]"
    >
      <PageHead n={3} label={sections[2].label} />
      <div className="grid grid-cols-2 items-start gap-14 max-[900px]:grid-cols-1">
        <div className="rv">
          <h2 className="display text-[118px] max-[900px]:text-[64px]">
            {t("Lo que", "What I")}
            <br />
            {t("hago", "do")}
          </h2>
          <p className="mt-6 max-w-[26em] text-[13px] text-soft">
            {t(
              "Sitios y apps completas, del formulario al panel de administración, desplegadas y listas para usar.",
              "Complete websites and apps, from the form to the admin dashboard, deployed and ready to use.",
            )}
          </p>
        </div>
        <ol className="rv border-t border-fg">
          {services.map((s, i) => (
            <li
              key={s.title}
              className="grid grid-cols-[48px_1fr] gap-y-1 border-b border-line py-4"
            >
              <span className="label pt-2 text-soft">{pad(i + 1)}</span>
              <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
                <b className="text-[26px] font-extrabold tracking-[-.035em] max-[700px]:text-[22px]">
                  {s.title}
                </b>
                <span className="label text-soft">
                  {(s.tools.length ? s.tools.map((x) => x.name) : s.items)
                    .slice(0, 3)
                    .join(" · ")}
                </span>
              </div>
              <p className="col-start-2 max-w-[34em] text-[13px] text-soft">
                {s.text}
              </p>
            </li>
          ))}
        </ol>
      </div>
      <ArrowDown className="absolute right-8 bottom-8 max-[700px]:right-[18px]" />
    </section>
  );
}
