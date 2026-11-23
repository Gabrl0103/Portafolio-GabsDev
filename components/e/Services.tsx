"use client";

import { useState } from "react";
import TechIcon from "@/components/TechIcon";
import { useContent } from "@/lib/content";
import { useT } from "@/lib/i18n";
import { cx } from "../ui";
import { ArrowDown, PageHead, pad } from "./parts";

/**
 * Servicios a pantalla completa: los nombres en letra grande ocupan la página.
 * Al tocar uno, su fila se vuelve tinta y despliega qué incluye, cómo lo hago y con qué.
 */
export default function Services() {
  const t = useT();
  const { services, sections } = useContent();
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section
      id="servicios"
      className="relative flex min-h-svh flex-col px-8 pt-[74px] max-[700px]:pt-[70px] pb-20 max-[700px]:px-[18px]"
    >
      <PageHead n={3} label={sections[2].label} />

      <div className="rv mb-6 flex flex-wrap items-end justify-between gap-x-10 gap-y-3">
        <h2 className="display text-[clamp(48px,6vw,88px)]">
          {t("Lo que hago", "What I do")}
        </h2>
        <p className="max-w-[30em] text-[13px] text-soft">
          {t(
            "Sitios y apps completas, del formulario al panel de administración, desplegadas y listas para usar. Toca un servicio para ver qué incluye.",
            "Complete websites and apps, from the form to the admin dashboard, deployed and ready to use. Tap a service to see what it includes.",
          )}
        </p>
      </div>

      <ol className="rv my-auto border-t border-fg">
        {services.map((s, i) => {
          const on = open === i;
          const id = `srv-${i}`;
          const tools = s.tools.length ? s.tools.map((x) => x.name) : s.items;
          return (
            <li
              key={s.title}
              className={cx(
                "relative border-b border-line transition-colors duration-500",
                on && "tinta border-transparent",
              )}
            >
              <h3>
                <button
                  type="button"
                  aria-expanded={on}
                  aria-controls={id}
                  onClick={() => setOpen(on ? null : i)}
                  className="group grid w-full grid-cols-[64px_1fr_auto_40px] items-center gap-x-4 py-[clamp(10px,1.6vh,18px)] text-left max-[700px]:grid-cols-[34px_1fr_28px]"
                >
                  <span className="label pl-1 text-soft">{pad(i + 1)}</span>
                  <span
                    className={cx(
                      "display text-[clamp(36px,6.2vh,80px)] leading-[.95] transition-[translate,opacity] duration-500 ease-expo group-hover:translate-x-3 max-[700px]:text-[30px]",
                      open !== null &&
                        !on &&
                        "opacity-35 group-hover:opacity-100",
                      on && "translate-x-3",
                    )}
                  >
                    {s.title}
                  </span>
                  <span className="label text-right text-soft max-[700px]:hidden">
                    {tools.slice(0, 3).join(" · ")}
                  </span>
                  <span
                    aria-hidden="true"
                    className="relative mr-1 size-6 justify-self-end"
                  >
                    <span className="absolute top-1/2 left-0 h-[2px] w-6 -translate-y-1/2 bg-current" />
                    <span
                      className={cx(
                        "absolute top-0 left-1/2 h-6 w-[2px] -translate-x-1/2 bg-current transition-transform duration-500 ease-expo",
                        on && "scale-y-0",
                      )}
                    />
                  </span>
                </button>
              </h3>
              <div
                id={id}
                role="region"
                aria-label={s.title}
                inert={!on}
                className={cx(
                  "grid transition-[grid-template-rows] duration-700 ease-expo",
                  on ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
                )}
              >
                <div className="overflow-hidden">
                  <div
                    className={cx(
                      "grid grid-cols-[64px_1.3fr_1fr_1fr] gap-x-4 gap-y-5 pb-7 transition-[opacity,translate] duration-700 ease-expo max-[900px]:grid-cols-[34px_1fr]",
                      on
                        ? "translate-y-0 opacity-100 delay-200"
                        : "translate-y-3 opacity-0",
                    )}
                  >
                    <p className="col-start-2 max-w-[28em] text-[17px] leading-[1.45] font-medium">
                      {s.text}
                    </p>
                    <div className="max-[900px]:col-start-2">
                      <p className="label mb-2 text-soft">
                        {t("Incluye", "Includes")}
                      </p>
                      <ul className="text-[13px]">
                        {s.items.map((x) => (
                          <li
                            key={x}
                            className="border-b border-line py-1.5 last:border-0"
                          >
                            {x}
                          </li>
                        ))}
                      </ul>
                    </div>
                    {s.tools.length > 0 && (
                      <div className="max-[900px]:col-start-2">
                        <p className="label mb-2.5 text-soft">
                          {t("Con qué lo hago", "What I use")}
                        </p>
                        <ul className="flex flex-wrap gap-2">
                          {s.tools.map((x) => (
                            <li
                              key={x.name}
                              className="label flex items-center gap-2 rounded-full border border-line py-1.5 pr-3 pl-2"
                            >
                              <TechIcon name={x.icon} size={14} />
                              {x.name}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ol>
      <ArrowDown className="absolute right-8 bottom-8 max-[700px]:right-[18px]" />
    </section>
  );
}
