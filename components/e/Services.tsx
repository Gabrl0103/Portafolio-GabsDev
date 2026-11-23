"use client";

import { useState } from "react";
import TechIcon from "@/components/TechIcon";
import { useContent } from "@/lib/content";
import { useT } from "@/lib/i18n";
import { cx } from "../ui";
import { ArrowDown, PageHead, pad } from "./parts";

/**
 * Servicios: el título a la izquierda y a la derecha solo los nombres.
 * Al tocar uno se despliega qué incluye, cómo lo hago y con qué herramientas.
 */
export default function Services() {
  const t = useT();
  const { services, sections } = useContent();
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section
      id="servicios"
      className="relative px-8 pt-[22px] pb-28 max-[700px]:px-[18px]"
    >
      <PageHead n={3} label={sections[2].label} />
      <div className="grid grid-cols-2 items-start gap-14 max-[900px]:grid-cols-1">
        <div className="rv sticky top-24 max-[900px]:static">
          <h2 className="display text-[118px] max-[900px]:text-[64px]">
            {t("Lo que", "What I")}
            <br />
            {t("hago", "do")}
          </h2>
          <p className="mt-6 max-w-[26em] text-[13px] text-soft">
            {t(
              "Sitios y apps completas, del formulario al panel de administración, desplegadas y listas para usar. Toca un servicio para ver qué incluye.",
              "Complete websites and apps, from the form to the admin dashboard, deployed and ready to use. Tap a service to see what it includes.",
            )}
          </p>
        </div>

        <ol className="border-t border-fg">
          {services.map((s, i) => {
            const on = open === i;
            const id = `srv-${i}`;
            return (
              <li
                key={s.title}
                className="rv border-b border-line"
                style={{ transitionDelay: `${i * 80}ms` }}
              >
                <h3>
                  <button
                    type="button"
                    aria-expanded={on}
                    aria-controls={id}
                    onClick={() => setOpen(on ? null : i)}
                    className="group grid w-full grid-cols-[48px_1fr_auto] items-center py-5 text-left"
                  >
                    <span className="label text-soft">{pad(i + 1)}</span>
                    <span
                      className={cx(
                        "text-[clamp(26px,2.8vw,40px)] font-extrabold tracking-[-.04em] transition-transform duration-500 ease-expo group-hover:translate-x-2",
                        on && "translate-x-2",
                      )}
                    >
                      {s.title}
                    </span>
                    <span
                      aria-hidden="true"
                      className="relative size-5 shrink-0"
                    >
                      <span className="absolute top-1/2 left-0 h-[2px] w-5 -translate-y-1/2 bg-current" />
                      <span
                        className={cx(
                          "absolute top-0 left-1/2 h-5 w-[2px] -translate-x-1/2 bg-current transition-transform duration-500 ease-expo",
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
                        "grid grid-cols-[48px_1fr] pb-7 transition-[opacity,translate] duration-700 ease-expo",
                        on
                          ? "translate-y-0 opacity-100 delay-150"
                          : "translate-y-3 opacity-0",
                      )}
                    >
                      <div className="col-start-2 grid grid-cols-2 gap-8 max-[700px]:grid-cols-1 max-[700px]:gap-5">
                        <p className="text-[15px] leading-[1.5]">{s.text}</p>
                        <div>
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
                          <div className="col-span-full">
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
                </div>
              </li>
            );
          })}
        </ol>
      </div>
      <ArrowDown className="absolute right-8 bottom-8 max-[700px]:right-[18px]" />
    </section>
  );
}
