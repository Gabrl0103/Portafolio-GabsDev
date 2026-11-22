"use client";

import { Fragment } from "react";
import { now, openTo, stats } from "@/data/about";
import { projects } from "@/data/projects";
import { site } from "@/data/site";
import { cx } from "../ui";
import { btnF } from "./btn";
import { openProject } from "./theme";

const PARA =
  "Me gusta llevar una idea desde el diseño hasta el código en producción: entender el problema, diseñarlo y dejarlo funcionando para quien lo va a usar.";
const FACTS = [
  ["Estudio", "Ing. de Software"],
  ["Base", "Pasto, Colombia"],
];
const STAT_COLORS = ["var(--olive)", "var(--fg)", "var(--orange)"];
const CHIP = ["bg-olive text-pill", "bg-cream text-pill", "bg-orange text-white", "bg-fg text-bg"];

/** Nombres de proyectos que abren su detalle al hacer clic. */
function ProjectLinks({ ids }: { ids: string[] }) {
  const items = ids.map((id) => projects.find((p) => p.id === id)).filter((p) => !!p);
  return (
    <>
      {items.map((p, i) => (
        <Fragment key={p.id}>
          {i > 0 && (i === items.length - 1 ? " y " : ", ")}
          <button
            type="button"
            onClick={() => openProject(p.id)}
            aria-label={`Ver el proyecto ${p.title}`}
            className="cursor-pointer border-0 border-b border-line bg-transparent p-0 font-[inherit] text-inherit transition-colors duration-300 hover:border-orange hover:text-orange"
          >
            {p.title}
          </button>
        </Fragment>
      ))}
    </>
  );
}

/**
 * Acerca de mí (continuación): cifras grandes arriba y, debajo, dos columnas:
 * "Quién soy" y "Ahora mismo" con "Abierto a". El texto principal y la foto están en IntroScene.
 */
export default function AboutR() {
  return (
    <section aria-label="Más sobre mí" className="pt-2 pb-[clamp(90px,11vw,170px)]">
      <div className="wrap">
        <ul data-a="clip" className="rv grid grid-cols-3 border-y border-line max-[700px]:grid-cols-1" aria-label="En números">
          {stats.map((s, i) => (
            <li
              key={s.label}
              className="border-line px-[clamp(16px,2.4vw,36px)] py-[clamp(24px,3vw,40px)] not-first:border-l max-[700px]:px-0 max-[700px]:not-first:border-t max-[700px]:not-first:border-l-0"
            >
              <b className="block font-disp text-[clamp(56px,7vw,110px)] leading-none font-medium tracking-[-.05em]" style={{ color: STAT_COLORS[i] }}>
                {s.value}
              </b>
              <span className="mono mt-3 block text-mut">{s.label}</span>
            </li>
          ))}
        </ul>

        <div className="mt-[clamp(40px,5vw,70px)] grid grid-cols-2 gap-[clamp(30px,6vw,100px)] max-[900px]:grid-cols-1">
          <div className="rv">
            <h3 className="mono text-mut">Quién soy</h3>
            <p className="mt-4 max-w-[30em] font-disp text-[clamp(22px,2vw,30px)] leading-[1.2] font-medium tracking-[-.03em]">{PARA}</p>
            <dl className="mt-6 grid grid-cols-2 border-t border-line">
              {FACTS.map(([k, v]) => (
                <div key={k} className="border-b border-line py-4">
                  <dt className="mono text-mut">{k}</dt>
                  <dd className="m-0 mt-1 font-disp text-xl font-medium">{v}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="rv">
            <h3 className="mono text-mut">Ahora mismo</h3>
            <dl className="mt-4 border-t border-line">
              {now.map((n) => (
                <div key={n.label} className="grid grid-cols-[150px_1fr] gap-4 border-b border-line py-4 max-[900px]:grid-cols-1 max-[900px]:gap-1">
                  <dt className="font-disp text-[15px] font-medium text-mut">{n.label}</dt>
                  <dd className="m-0 font-disp text-lg leading-snug font-medium">{n.projects ? <ProjectLinks ids={n.projects} /> : n.value}</dd>
                </div>
              ))}
            </dl>
            <h3 className="mono mt-8 text-mut">Abierto a</h3>
            <ul className="mt-4 flex flex-wrap gap-2">
              {openTo.map((o, i) => (
                <li key={o} className={cx("rounded-full px-4 py-2 font-disp text-[15px] font-medium", CHIP[i % 4])}>
                  {o}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="rv mt-[clamp(40px,5vw,64px)] flex justify-center">
          <a href={site.cv} download="CV-Gabriel-Guerrero.pdf" className={cx(btnF, "mag")}>
            Descargar CV ↓
          </a>
        </div>
      </div>
    </section>
  );
}
