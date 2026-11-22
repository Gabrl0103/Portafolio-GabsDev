import { services } from "@/data/services";
import TechIcon, { brandColor, type TechIconName } from "../TechIcon";
import { cx } from "../ui";
import { lab } from "./btn";
import SplitTitle from "./SplitTitle";
import Tape from "./Tape";

const COLORS = [
  "var(--olive)",
  "var(--cream)",
  "var(--orange)",
  "var(--olive)",
  "var(--cream)",
];

/** Color de marca del logo; los casi negros y los propios usan el color del texto. */
const brand = (n: TechIconName) => {
  const c = brandColor(n);
  return c.startsWith("var(") ? "var(--fg)" : c;
};

/**
 * Servicios: una tarjeta por servicio en cuadrícula de 2 columnas (1 en celular),
 * con los logos de las tecnologías (su nombre aparece al pasar el cursor), descripción y lo que incluye.
 * Si el número de servicios es impar, el último ocupa todo el ancho.
 */
export default function ServicesR() {
  const odd = services.length % 2 === 1;
  return (
    <section id="servicios" className="tx py-[clamp(90px,11vw,170px)]">
      <div className="wrap">
        <div className={cx(lab, "rv")}>
          <b>(03)</b> Servicios
        </div>
        <SplitTitle lines={["Lo que", "puedo hacer"]} className="mt-[22px]" />

        <ul className="mt-[clamp(36px,5vw,64px)] grid grid-cols-2 gap-3 max-[900px]:grid-cols-1">
          {services.map((s, i) => {
            const wide = odd && i === services.length - 1;
            return (
              <li
                key={s.title}
                data-a="blur"
                style={
                  {
                    "--c": COLORS[i % COLORS.length],
                    transitionDelay: `${(i % 2) * 0.08}s`,
                  } as React.CSSProperties
                }
                className={cx(
                  "rv group relative flex flex-col rounded-[24px] border border-line bg-bg2 p-[clamp(24px,2.6vw,38px)] transition-[border-color,translate] duration-500 ease-expo hover:-translate-y-1 hover:border-(--c)",
                  wide ? "col-span-2 max-[900px]:col-span-1" : "min-h-[340px]",
                )}
              >
                {/* Cinta solo en algunas tarjetas, para que se vea casual */}
                {(i === 1 || i === 2 || wide) && (
                  <Tape
                    v={i}
                    className={cx(
                      "-top-3",
                      i === 2
                        ? "left-10 -rotate-[4deg]"
                        : "right-10 rotate-[3deg]",
                    )}
                  />
                )}
                <div
                  className={cx(
                    wide &&
                      "grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)] items-end gap-x-[clamp(30px,5vw,80px)] gap-y-6 max-[900px]:grid-cols-1",
                  )}
                >
                  <div>
                    {s.tools.length > 0 && (
                      <ul
                        className="flex flex-wrap items-center gap-2"
                        aria-label="Con qué lo hago"
                      >
                        {s.tools.map((t) => (
                          <li key={t.name} className="group/tool relative">
                            {/* Al pasar el cursor (o con el teclado) aparece el nombre de la tecnología */}
                            <span
                              tabIndex={0}
                              aria-label={t.name}
                              style={{ color: brand(t.icon) }}
                              className="grid size-10 cursor-default place-items-center rounded-xl border border-line bg-bg/40 outline-offset-2 transition-[border-color,translate] duration-300 group-hover/tool:-translate-y-0.5 group-hover/tool:border-fg/40"
                            >
                              <TechIcon name={t.icon} size={20} />
                            </span>
                            <span
                              role="tooltip"
                              className="pointer-events-none absolute bottom-[calc(100%+8px)] left-1/2 z-10 -translate-x-1/2 translate-y-1 rounded-lg bg-fg px-2.5 py-1 font-disp text-[13px] font-medium whitespace-nowrap text-bg opacity-0 shadow-lg transition-[opacity,translate] duration-200 group-focus-within/tool:translate-y-0 group-focus-within/tool:opacity-100 group-hover/tool:translate-y-0 group-hover/tool:opacity-100"
                            >
                              {t.name}
                            </span>
                          </li>
                        ))}
                      </ul>
                    )}
                    <h3
                      className={cx(
                        "font-disp text-[clamp(32px,3.4vw,48px)] leading-none font-medium tracking-[-.045em] transition-colors duration-300 group-hover:text-(--c)",
                        s.tools.length > 0 && "mt-8",
                      )}
                    >
                      {s.title}
                    </h3>
                    <p className="mt-4 max-w-[30em] text-[17px] leading-normal text-soft">
                      {s.text}
                    </p>
                  </div>
                  {wide && (
                    <ul
                      className="flex flex-wrap gap-2 md:justify-end"
                      aria-label="Incluye"
                    >
                      {s.items.map((it) => (
                        <li
                          key={it}
                          className="rounded-full border border-line px-4 py-2 font-disp text-sm font-medium"
                        >
                          {it}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                {!wide && (
                  <ul
                    className="mt-auto flex flex-wrap gap-2 pt-7"
                    aria-label="Incluye"
                  >
                    {s.items.map((it) => (
                      <li
                        key={it}
                        className="rounded-full border border-line px-4 py-2 font-disp text-sm font-medium"
                      >
                        {it}
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
