"use client";

import { useState } from "react";
import { services } from "@/data/services";
import { cx } from "../ui";
import { lab } from "./btn";
import RollText from "./RollText";
import SplitTitle from "./SplitTitle";

const pad = (n: number) => String(n).padStart(2, "0");
const COLORS = ["var(--olive)", "var(--cream)", "var(--orange)"];

/** Servicios: acordeón de filas grandes; solo una abierta a la vez. */
export default function ServicesR() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section id="servicios" className="tx py-[clamp(90px,11vw,170px)]">
      <div className="wrap">
        <div className={cx(lab, "rv")}>
          <b>(03)</b> Servicios
        </div>
        <SplitTitle lines={["Lo que", "puedo hacer"]} className="mt-[22px]" />

        <ul className="mt-[clamp(36px,5vw,70px)] border-t border-line">
          {services.map((s, i) => {
            const isOpen = open === i;
            return (
              <li
                key={s.title}
                data-a="left"
                style={{ "--c": COLORS[i % 3], "--hc": COLORS[i % 3], transitionDelay: `${i * 0.06}s` } as React.CSSProperties}
                className="trig rv group relative border-b border-line"
              >
                <button
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={`sv-${i}`}
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="grid w-full cursor-pointer grid-cols-[clamp(40px,6vw,90px)_1fr_auto_44px] items-center gap-x-5 gap-y-2.5 border-0 bg-transparent py-[clamp(22px,2.6vw,38px)] text-left text-fg max-[900px]:grid-cols-[34px_1fr_44px]"
                >
                  <span className="mono text-mut">{pad(i + 1)}</span>
                  <span className="font-disp text-[clamp(34px,6.4vw,104px)] leading-none font-medium tracking-[-.05em] transition-colors group-hover:text-(--c)">
                    <RollText text={s.title} />
                  </span>
                  <span className="mono text-right text-mut max-[900px]:hidden">{s.sub}</span>
                  <span
                    className={cx(
                      "grid size-11 place-items-center rounded-full border border-line transition-[background-color,border-color,rotate] duration-600 ease-quint group-hover:border-(--c) group-hover:bg-(--c) group-hover:text-pill",
                      isOpen && "rotate-45 border-(--c) bg-(--c) text-pill",
                    )}
                  >
                    <svg viewBox="0 0 16 16" aria-hidden="true" className="size-4 fill-none stroke-current stroke-[1.8]">
                      <path d="M8 2v12M2 8h12" />
                    </svg>
                  </span>
                </button>
                <div
                  id={`sv-${i}`}
                  inert={!isOpen}
                  className={cx("grid transition-[grid-template-rows] duration-800 ease-quint", isOpen ? "grid-rows-[1fr]" : "invisible grid-rows-[0fr] [transition:grid-template-rows_.8s_cubic-bezier(.76,0,.24,1),visibility_0s_.8s]")}
                >
                  <div className="overflow-hidden">
                    <div className="grid grid-cols-[clamp(40px,6vw,90px)_minmax(0,1fr)_minmax(0,1fr)] gap-x-5 gap-y-2.5 pb-[clamp(24px,3vw,40px)] max-[900px]:grid-cols-[34px_1fr]">
                      <p className="col-start-2 max-w-[30em] text-[clamp(18px,1.6vw,22px)] leading-[1.45] text-soft">{s.text}</p>
                      <ul className="col-start-3 flex flex-wrap content-start gap-2 max-[900px]:col-start-2">
                        {s.items.map((it) => (
                          <li key={it} className="rounded-full border border-line px-4 py-2 font-disp text-sm font-medium">
                            {it}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
