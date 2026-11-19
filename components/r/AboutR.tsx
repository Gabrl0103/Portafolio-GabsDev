import { now, openTo, stats } from "@/data/about";
import { site } from "@/data/site";
import { cx } from "../ui";
import { btnF } from "./btn";

const FACTS = [
  ["Estudio", "Ing. de Software"],
  ["Base", "Pasto, Colombia"],
];

/** Acerca de mí (continuación): datos, "Ahora mismo", "Abierto a" y cifras. El texto principal y la foto están en IntroScene. */
export default function AboutR() {
  return (
    <section aria-label="Más sobre mí" className="pt-2 pb-[clamp(90px,11vw,170px)]">
      <div className="wrap">
        <div className="grid grid-cols-[minmax(0,1.35fr)_minmax(0,.8fr)] items-start gap-[clamp(30px,6vw,110px)] max-[900px]:grid-cols-1">
          <div>
            <dl data-a="clip" className="rv grid grid-cols-2 border-t border-line">
              {FACTS.map(([k, v]) => (
                <div key={k} className="border-b border-line py-[18px] pr-4">
                  <dt className="mono mb-1.5 text-mut">{k}</dt>
                  <dd className="m-0 font-disp text-[22px] font-medium tracking-[-.02em]">{v}</dd>
                </div>
              ))}
            </dl>

            <p className="rv mt-[34px] max-w-[36em] text-[clamp(17px,1.4vw,20px)] leading-normal text-soft">
              Me gusta llevar una idea desde el diseño hasta el código en producción: entender el problema, diseñarlo y dejarlo funcionando
              para quien lo va a usar.
            </p>

            <div className="rv mt-[44px]">
              <h3 className="mono text-mut">Ahora mismo</h3>
              <dl className="mt-3 border-t border-line">
                {now.map((n) => (
                  <div key={n.label} className="grid grid-cols-[150px_1fr] items-baseline gap-4 border-b border-line py-4 max-[900px]:grid-cols-1 max-[900px]:gap-1">
                    <dt className="font-disp text-[15px] font-medium text-mut">{n.label}</dt>
                    <dd className="m-0 font-disp text-[clamp(18px,1.5vw,21px)] leading-snug font-medium tracking-[-.02em]">{n.value}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className="rv mt-[34px]">
              <h3 className="mono text-mut">Abierto a</h3>
              <ul className="mt-3 flex flex-wrap gap-2">
                {openTo.map((o, i) => (
                  <li
                    key={o}
                    className={cx(
                      "rounded-full px-4 py-2 font-disp text-[15px] font-medium",
                      ["bg-olive text-pill", "bg-cream text-pill", "bg-orange text-white", "bg-fg text-bg"][i % 4],
                    )}
                  >
                    {o}
                  </li>
                ))}
              </ul>
            </div>

            <a href={site.cv} download="CV-Gabriel-Guerrero.pdf" className={cx(btnF, "mag mt-[40px]")}>
              Descargar CV ↓
            </a>
          </div>

          <ul data-a="clip" className="rv border-t border-line" aria-label="En números">
            {stats.map((st) => (
              <li key={st.label} className="flex items-baseline justify-between gap-4 border-b border-line py-4">
                <b className="font-disp text-[clamp(44px,4.6vw,72px)] leading-none font-medium tracking-[-.05em]">{st.value}</b>
                <span className="mono text-right text-mut">{st.label}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
