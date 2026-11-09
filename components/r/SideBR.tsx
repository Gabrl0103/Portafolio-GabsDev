import { tracks } from "@/data/sideB";
import { cx } from "../ui";
import { lab } from "./btn";
import RollText from "./RollText";
import SplitTitle from "./SplitTitle";

const COLORS = ["var(--olive)", "var(--cream)", "var(--orange)"];

/** Lado B: lo personal, como la cara B de un vinilo (cada dato es una canción). */
export default function SideBR() {
  return (
    <section id="lado-b" className="overflow-x-clip py-[clamp(90px,11vw,170px)]">
      <div className="wrap">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <div className={cx(lab, "rv")}>
              <b>(07)</b> Lado B
            </div>
            <SplitTitle lines={["Lo que no sale", "en el código"]} className="mt-[22px]" />
          </div>
          <p className="rv max-w-[22em] text-[clamp(17px,1.4vw,20px)] leading-normal text-soft">
            Mi lado B: lo que hago, escucho y pienso cuando no estoy programando.
          </p>
        </div>

        <ol className="mt-[clamp(36px,5vw,70px)] border-t border-line">
          {tracks.map((t, i) => (
            <li
              key={t.title}
              data-a="left"
              style={{ "--c": COLORS[i % 3], "--hc": COLORS[i % 3], transitionDelay: `${i * 0.06}s` } as React.CSSProperties}
              className="trig rv group grid grid-cols-[clamp(40px,6vw,90px)_minmax(0,1fr)_minmax(0,.9fr)_auto] items-baseline gap-x-5 gap-y-2 border-b border-line py-[clamp(22px,2.6vw,36px)] max-[900px]:grid-cols-[40px_1fr_auto]"
            >
              <span className="mono text-mut transition-colors group-hover:text-(--c)">B{i + 1}</span>
              <h3 className="font-disp text-[clamp(28px,4vw,62px)] leading-none font-medium tracking-[-.045em] transition-colors group-hover:text-(--c)">
                <RollText text={t.title} />
              </h3>
              <p className="max-w-[32em] text-[clamp(15px,1.2vw,18px)] leading-normal text-soft max-[900px]:col-span-2 max-[900px]:col-start-2 max-[900px]:row-start-2">
                {t.text}
              </p>
              <span className="mono text-right text-mut max-[900px]:col-start-3 max-[900px]:row-start-1">{t.duration}</span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
