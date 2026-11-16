import { skillGroups } from "@/data/about";
import TechIcon, { brandColor, type TechIconName } from "../TechIcon";
import { cx } from "../ui";
import { lab } from "./btn";
import RollText from "./RollText";
import SplitTitle from "./SplitTitle";

const pad = (n: number) => String(n).padStart(2, "0");
const COLORS = ["var(--olive)", "var(--cream)", "var(--orange)", "var(--olive)", "var(--cream)"];
const groups = skillGroups.map((g, i) => ({ ...g, c: COLORS[i % COLORS.length] }));
const all = skillGroups.flatMap((g) => g.skills);

/** Color de marca del logo; los casi negros y los propios usan el color del texto. */
const brand = (n: TechIconName) => {
  const c = brandColor(n);
  return c.startsWith("var(") ? "var(--fg)" : c;
};

/** Cinta inclinada con los logos que pasan sin parar (se duplica para que el bucle no se note). */
function Band({ className, reverse, items }: { className: string; reverse?: boolean; items: typeof all }) {
  const row = (hidden?: boolean) => (
    <ul aria-hidden={hidden || undefined} className="flex shrink-0 items-center">
      {items.map((s) => (
        <li key={s.name} className="flex items-center gap-3 px-[clamp(14px,1.6vw,26px)] font-disp text-[clamp(20px,2.2vw,32px)] font-medium tracking-[-.03em] whitespace-nowrap">
          <TechIcon name={s.icon} size={28} className="shrink-0" />
          {s.name}
          <span aria-hidden="true" className="pl-[clamp(14px,1.6vw,26px)] opacity-50">
            ✦
          </span>
        </li>
      ))}
    </ul>
  );
  return (
    <div className={cx("relative left-1/2 w-[110vw] -translate-x-1/2 overflow-hidden py-3.5 text-pill shadow-[0_20px_40px_-24px_rgba(0,0,0,.6)]", className)}>
      <div className={cx("flex w-max animate-marquee", reverse && "[animation-direction:reverse]")}>
        {row()}
        {row(true)}
      </div>
    </div>
  );
}

/**
 * Herramientas: dos cintas de logos cruzadas y una fila por categoría.
 * Al pasar el cursor, la fila se llena con el color de su categoría.
 */
export default function ToolsR() {
  return (
    <section id="herramientas" className="overflow-x-clip py-[clamp(90px,11vw,170px)]">
      <div className="wrap">
        <div className={cx(lab, "rv")}>
          <b>(04)</b> Herramientas
        </div>
        <SplitTitle lines={["Con qué", "construyo"]} className="mt-[22px]" />
      </div>

      <div className="relative my-[clamp(50px,7vw,100px)]" aria-label="Tecnologías con las que trabajo">
        <Band items={all} className="z-[1] -rotate-[2.5deg] bg-olive [--d:46s]" />
        <Band items={[...all].reverse()} reverse className="-mt-2 rotate-[1.8deg] bg-orange text-white [--d:52s]" />
      </div>

      <div className="wrap">
        <div className="border-t border-line">
          {groups.map((g, gi) => (
            <div
              key={g.title}
              data-a="left"
              style={{ "--c": g.c, "--hc": "var(--pill)", transitionDelay: `${gi * 0.06}s` } as React.CSSProperties}
              className="trig rv group relative isolate grid grid-cols-[minmax(0,.34fr)_minmax(0,1fr)] gap-x-8 gap-y-4 border-b border-line py-[clamp(22px,2.6vw,36px)] [transition:opacity_1s_ease,transform_1.2s_var(--ease-expo),color_.4s] before:absolute before:inset-y-0 before:-right-5 before:-left-5 before:-z-1 before:origin-bottom before:scale-y-0 before:rounded-[18px] before:bg-(--c) before:transition-transform before:duration-600 before:ease-expo hover:text-pill hover:before:scale-y-100 max-[900px]:grid-cols-1"
            >
              <div className="flex items-start gap-3">
                <span className="mono pt-1.5 text-mut transition-colors group-hover:text-pill">{pad(gi + 1)}</span>
                <div>
                  <h3 className="font-disp text-[clamp(26px,2.8vw,40px)] leading-none font-medium tracking-[-.045em]">
                    <RollText text={g.title} />
                  </h3>
                  <span className="mono mt-2.5 flex items-center gap-2 text-mut transition-colors group-hover:text-pill">
                    <span aria-hidden="true" className="size-2 rounded-full bg-(--c) transition-colors group-hover:bg-pill" />
                    {g.skills.length} herramientas
                  </span>
                </div>
              </div>
              <ul className="grid grid-cols-[repeat(auto-fill,minmax(230px,1fr))] gap-2.5 max-[900px]:grid-cols-2 max-[900px]:gap-2">
                {g.skills.map((s, si) => (
                  <li
                    key={s.name}
                    style={{ "--bc": brand(s.icon), transitionDelay: `${si * 30}ms` } as React.CSSProperties}
                    className="flex items-center gap-3.5 rounded-2xl border border-line bg-bg/40 px-4 py-3 backdrop-blur-sm transition-[border-color,background-color,translate,rotate] duration-500 ease-back group-hover:border-pill/15 group-hover:bg-pill/[.06] hover:!-translate-y-1 hover:!-rotate-1 max-[900px]:flex-col max-[900px]:items-start max-[900px]:gap-2 max-[900px]:px-3"
                  >
                    <span className="shrink-0 text-(--bc) transition-colors duration-300 group-hover:text-pill">
                      <TechIcon name={s.icon} size={28} />
                    </span>
                    <span className="min-w-0">
                      <b className="block font-disp text-base leading-tight font-medium">{s.name}</b>
                      <span className="mt-0.5 block text-[13px] leading-snug text-mut transition-colors group-hover:text-pill/70 max-[900px]:text-xs">{s.use}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
