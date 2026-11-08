"use client";

import { useEffect, useRef } from "react";
import { skillGroups } from "@/data/about";
import TechIcon, { brandColor, type TechIconName } from "../TechIcon";
import { cx } from "../ui";
import { lab } from "./btn";
import SplitTitle from "./SplitTitle";

const pad = (n: number) => String(n).padStart(2, "0");
const COLORS = ["var(--olive)", "var(--cream)", "var(--orange)", "var(--cream)", "var(--olive)", "var(--orange)", "var(--cream)", "var(--olive)"];
const ANIM = ["scale", "blur", "left", "right"];
/** Color del logo al pasar el cursor; los casi negros y los propios usan el color de la tinta. */
const hover = (n: TechIconName) => {
  const c = brandColor(n);
  return c.startsWith("var(") ? "var(--pill)" : c;
};
const tools = skillGroups.flatMap((g) => g.skills.map((s) => ({ ...s, group: g.title })));

/** Herramientas: baldosas de color con el logo en gris que toma color y gira al pasar el cursor. */
export default function ToolsR() {
  const tiles = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    const frame = () => {
      const vh = innerHeight;
      tiles.current.forEach((t, i) => {
        if (!t) return;
        const q = t.getBoundingClientRect();
        if (q.bottom > -100 && q.top < vh + 100) t.style.setProperty("--py", `${((i % 2 ? 1 : -0.6) * (q.top + q.height / 2 - vh / 2) * -0.05).toFixed(1)}px`);
      });
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <section id="herramientas" className="overflow-x-clip py-[clamp(90px,11vw,170px)]">
      <div className="wrap">
        <div className={cx(lab, "rv")}>
          <b>(04)</b> Herramientas
        </div>
        <SplitTitle lines={["Con qué", "construyo"]} className="mt-[22px]" />

        <div className="mt-[clamp(40px,6vw,90px)] grid grid-cols-4 items-start gap-[clamp(10px,1.4vw,20px)] max-[900px]:grid-cols-2">
          {tools.map((t, i) => (
            <div
              key={t.name}
              ref={(el) => {
                tiles.current[i] = el;
              }}
              tabIndex={0}
              role="img"
              aria-label={`${t.name}: ${t.use}`}
              title={t.use}
              data-a={ANIM[i % 4]}
              onPointerMove={(e) => {
                const r = e.currentTarget.getBoundingClientRect();
                e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
                e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
              }}
              style={{ "--c": COLORS[i % 8], transitionDelay: `${(i % 4) * 0.08}s` } as React.CSSProperties}
              className={cx(
                "group rv relative isolate flex aspect-[1/1.08] min-w-0 cursor-pointer items-end justify-between overflow-hidden rounded-br-[clamp(36px,4.4vw,72px)] bg-(--c) p-[clamp(12px,1.3vw,20px)] font-disp text-[clamp(15px,1.3vw,19px)] font-medium text-pill outline-0 translate-y-(--py) [&.vis]:hover:-translate-y-3 [&.vis]:hover:-rotate-[1.2deg] [&.vis]:focus-visible:-translate-y-3",
                i % 4 % 2 === 1 && "mt-[clamp(20px,4vw,64px)]",
                "max-[900px]:mt-0 max-[900px]:even:mt-[clamp(20px,8vw,40px)]",
              )}
            >
              <span className="mono absolute top-[clamp(12px,1.3vw,20px)] left-[clamp(12px,1.3vw,20px)] z-[1] !text-[10px] opacity-60">{t.group}</span>
              <span
                style={{ "--bc": hover(t.icon) } as React.CSSProperties}
                className="absolute top-[44%] left-1/2 z-[1] w-[42%] -translate-x-1/2 -translate-y-1/2 transition-colors duration-500 group-hover:text-(--bc) group-focus-visible:text-(--bc)"
              >
                <TechIcon
                  name={t.icon}
                  size={128}
                  className="h-auto w-full drop-shadow-[0_10px_14px_rgba(0,0,0,.18)] transition-[scale,rotate] duration-800 ease-back group-hover:scale-[1.16] group-hover:-rotate-[7deg] group-focus-visible:scale-[1.16] group-focus-visible:-rotate-[7deg]"
                />
              </span>
              <i className="tex-hover z-0 bg-[length:220px] mix-blend-multiply group-hover:opacity-85 group-focus-visible:opacity-85" />
              <span className="relative z-[1] min-w-0 leading-tight">{t.name}</span>
              <span className="mono relative z-[1] pr-[clamp(6px,1.2vw,18px)] opacity-70">{pad(i + 1)}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
