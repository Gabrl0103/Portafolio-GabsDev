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
    <section id="servicios" className="tx pana [--txk:1] light:[--txk:2] py-[clamp(90px,11vw,170px)]">
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
                data-a={wide ? "scale" : i % 2 ? "right" : "left"}
                style={
                  {
                    "--c": COLORS[i % COLORS.length],
                    "--d": `${i * 0.1}s`,
                    // Entrada escalonada (opacidad, desplazamiento y desenfoque) sin retrasar el hover
                    transition: `opacity .9s ease ${i * 0.1}s, transform 1.2s var(--ease-expo) ${i * 0.1}s, filter 1s ease ${i * 0.1}s, border-color .5s, translate .5s var(--ease-expo)`,
                  } as React.CSSProperties
                }
                className={cx(
                  "rv group relative isolate flex flex-col rounded-[24px] border border-line bg-[rgba(30,30,32,.9)] light:bg-bg2 p-[clamp(24px,2.6vw,38px)] blur-[6px] hover:-translate-y-1 hover:border-(--c) [&.vis]:blur-none",
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
                {/* Pana viva dentro de la tarjeta: nubes desenfocadas y rayas finas */}
                <span aria-hidden="true" className="pana-soft" />
                <span aria-hidden="true" className="pana-rayas" />
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
                        {s.tools.map((t, k) => (
                          <li
                            key={t.name}
                            style={{
                              transitionDelay: `calc(var(--d) + ${0.45 + k * 0.06}s)`,
                            }}
                            className="group/tool relative translate-y-3 scale-75 opacity-0 transition-[opacity,translate,scale] duration-700 ease-back in-[.vis]:translate-y-0 in-[.vis]:scale-100 in-[.vis]:opacity-100"
                          >
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
                      {s.items.map((it, k) => (
                        <li
                          key={it}
                          style={{
                            transitionDelay: `calc(var(--d) + ${0.6 + k * 0.07}s)`,
                          }}
                          className="translate-y-2 rounded-full border border-line px-4 py-2 font-disp text-sm font-medium opacity-0 transition-[opacity,translate] duration-600 ease-expo in-[.vis]:translate-y-0 in-[.vis]:opacity-100"
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
                    {s.items.map((it, k) => (
                      <li
                        key={it}
                        style={{
                          transitionDelay: `calc(var(--d) + ${0.6 + k * 0.07}s)`,
                        }}
                        className="translate-y-2 rounded-full border border-line px-4 py-2 font-disp text-sm font-medium opacity-0 transition-[opacity,translate] duration-600 ease-expo in-[.vis]:translate-y-0 in-[.vis]:opacity-100"
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
