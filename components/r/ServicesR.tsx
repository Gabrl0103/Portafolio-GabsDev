"use client";

import { useState } from "react";
import { useContent } from "@/lib/content";
import { useT } from "@/lib/i18n";
import type { Service } from "@/data/services";
import TechIcon, { brandColor, type TechIconName } from "../TechIcon";
import { cx } from "../ui";
import { lab } from "./btn";
import SplitTitle from "./SplitTitle";
import Tape from "./Tape";

const COLORS = ["var(--olive)", "var(--orange)", "var(--cream)", "var(--olive)", "var(--orange)"];
const pad = (n: number) => String(n).padStart(2, "0");

/** Color de marca del logo; los casi negros y los propios usan el color del texto. */
const brand = (n: TechIconName) => {
  const c = brandColor(n);
  return c.startsWith("var(") ? "var(--fg)" : c;
};

/** Logos de las tecnologías; el nombre aparece al pasar el cursor o con el teclado. */
function Tools({ s, label }: { s: Service; label: string }) {
  if (!s.tools.length) return null;
  return (
    <ul className="flex flex-wrap items-center gap-2" aria-label={label}>
      {s.tools.map((tool) => (
        <li key={tool.name} className="group/tool relative">
          <span
            tabIndex={0}
            aria-label={tool.name}
            style={{ color: brand(tool.icon) }}
            className="grid size-10 cursor-default place-items-center rounded-xl border border-line bg-bg/40 outline-offset-2 transition-[border-color,translate] duration-300 group-hover/tool:-translate-y-0.5 group-hover/tool:border-fg/40"
          >
            <TechIcon name={tool.icon} size={20} />
          </span>
          <span
            role="tooltip"
            className="pointer-events-none absolute bottom-[calc(100%+8px)] left-1/2 z-10 -translate-x-1/2 translate-y-1 rounded-lg bg-fg px-2.5 py-1 font-disp text-[13px] font-medium whitespace-nowrap text-bg opacity-0 shadow-lg transition-[opacity,translate] duration-200 group-focus-within/tool:translate-y-0 group-focus-within/tool:opacity-100 group-hover/tool:translate-y-0 group-hover/tool:opacity-100"
          >
            {tool.name}
          </span>
        </li>
      ))}
    </ul>
  );
}

/** Lo que incluye el servicio, en píldoras. */
function Items({ s, label }: { s: Service; label: string }) {
  return (
    <ul className="flex flex-wrap gap-2" aria-label={label}>
      {s.items.map((it) => (
        <li key={it} className="rounded-full border border-line px-4 py-2 font-disp text-sm font-medium">
          {it}
        </li>
      ))}
    </ul>
  );
}

/**
 * Servicios: los nombres en lista a la izquierda y, a la derecha, un panel con el detalle del servicio
 * activo (descripción, tecnologías y lo que incluye). Cambia al pasar el cursor, al enfocar con el
 * teclado o al tocar. En celular la lista se vuelve un acordeón con el detalle debajo de cada nombre.
 */
export default function ServicesR() {
  const t = useT();
  const { services, sections } = useContent();
  const [on, setOn] = useState(0);
  const tools = t("Con qué lo hago", "What I use");
  const incl = t("Incluye", "Includes");

  return (
    <section id="servicios" className="lienzo banda [--gc:var(--olive)] [--gx:82%] [--gy:30%] py-[clamp(90px,11vw,170px)]">
      <div className="wrap">
        <div className={cx(lab, "rv")}>
          <b>(03)</b> {sections.find((s) => s.id === "servicios")?.label}
        </div>
        <SplitTitle lines={[t("Lo que", "What I"), t("puedo *hacer*", "can *do*")]} className="mt-[22px]" />

        <div className="mt-[clamp(40px,6vw,80px)] grid grid-cols-[minmax(0,.9fr)_minmax(0,1.1fr)] items-start gap-[clamp(30px,5vw,80px)] max-[900px]:grid-cols-1">
          {/* Lista de servicios */}
          <ol data-a="clip" className="rv border-t border-line [&.vis]:[clip-path:none]!">
            {services.map((s, i) => {
              const a = on === i;
              return (
                <li key={s.title} className="border-b border-line" style={{ "--c": COLORS[i % COLORS.length] } as React.CSSProperties}>
                  <button
                    type="button"
                    onMouseEnter={() => setOn(i)}
                    onFocus={() => setOn(i)}
                    onClick={() => setOn(i)}
                    aria-expanded={a}
                    aria-controls="servicio-detalle"
                    className="flex w-full cursor-pointer items-center justify-between gap-5 py-[clamp(16px,1.6vw,22px)] text-left"
                  >
                    <span className="flex items-baseline gap-[18px]">
                      <span className={cx("mono transition-colors duration-500", a ? "text-(--c)" : "text-mut")}>{pad(i + 1)}</span>
                      <b
                        className={cx(
                          "font-disp text-[clamp(24px,2.4vw,36px)] leading-[1.05] font-medium tracking-[-.035em] transition-[color,translate] duration-500 ease-expo",
                          a ? "translate-x-1.5 text-fg" : "text-fg/40 hover:text-fg/70 max-[900px]:text-fg/80",
                        )}
                      >
                        {s.title}
                      </b>
                    </span>
                    <span aria-hidden="true" className={cx("text-[22px] transition-[opacity,translate] duration-500 ease-expo", a ? "translate-x-0 text-(--c) opacity-100" : "-translate-x-2 opacity-0")}>
                      →
                    </span>
                  </button>

                  {/* Celular: el detalle se abre debajo del nombre */}
                  <div className={cx("grid transition-[grid-template-rows] duration-500 ease-expo min-[901px]:hidden", a ? "grid-rows-[1fr]" : "grid-rows-[0fr]")}>
                    <div className="overflow-hidden">
                      <div className="flex flex-col gap-4 pb-6">
                        <p className="text-[16px] leading-normal text-soft">{s.text}</p>
                        <Tools s={s} label={tools} />
                        <Items s={s} label={incl} />
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ol>

          {/* Panel con el detalle del servicio activo (pantallas anchas) */}
          <div
            id="servicio-detalle"
            data-a="right"
            aria-live="polite"
            className="rv lienzo-tarjeta relative grid min-h-[clamp(380px,32vw,460px)] rounded-3xl border border-line bg-[rgba(var(--fgr),.04)] p-[clamp(26px,3vw,44px)] shadow-[0_40px_80px_-50px_rgba(0,0,0,.7)] max-[900px]:hidden"
          >
            <Tape v={1} className="-top-3 right-12 rotate-[4deg]" />
            {services.map((s, i) => {
              const a = on === i;
              return (
                <div
                  key={s.title}
                  aria-hidden={!a}
                  style={{ "--c": COLORS[i % COLORS.length] } as React.CSSProperties}
                  className={cx(
                    "col-start-1 row-start-1 flex flex-col gap-5 transition-[opacity,translate] duration-500 ease-expo",
                    a ? "translate-y-0 opacity-100" : "pointer-events-none invisible translate-y-3 opacity-0",
                  )}
                >
                  <span className="mono text-(--c)">
                    {t("Servicio", "Service")} {pad(i + 1)} / {pad(services.length)}
                  </span>
                  <h3 className="font-disp text-[clamp(38px,4.2vw,62px)] leading-[.95] font-medium tracking-[-.045em]">{s.title}</h3>
                  <p className="max-w-[30em] text-[17px] leading-normal text-soft">{s.text}</p>
                  <Tools s={s} label={tools} />
                  <div className="mt-auto pt-2">
                    <Items s={s} label={incl} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
