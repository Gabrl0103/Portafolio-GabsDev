"use client";

import { Fragment } from "react";
import { useContent } from "@/lib/content";
import { useT } from "@/lib/i18n";
import { cx } from "../ui";
import { btnF } from "./btn";
import { openProject } from "./theme";

const STAT_COLORS = ["var(--olive)", "var(--fg)", "var(--orange)"];
const CHIP = ["bg-olive text-pill", "bg-cream text-pill", "bg-orange text-white", "bg-fg text-bg"];

/** Nombres de proyectos que abren su detalle al hacer clic. */
function ProjectLinks({ ids }: { ids: string[] }) {
  const t = useT();
  const { projects } = useContent();
  const items = ids.map((id) => projects.find((p) => p.id === id)).filter((p) => !!p);
  return (
    <>
      {items.map((p, i) => (
        <Fragment key={p.id}>
          {i > 0 && (i === items.length - 1 ? t(" y ", " and ") : ", ")}
          <button
            type="button"
            onClick={() => openProject(p.id)}
            aria-label={t(`Ver el proyecto ${p.title}`, `View the ${p.title} project`)}
            className="cursor-pointer border-0 border-b border-line bg-transparent p-0 font-[inherit] text-inherit transition-colors duration-300 hover:border-orange hover:text-orange"
          >
            {p.title}
          </button>
        </Fragment>
      ))}
    </>
  );
}

/** Frase con palabras entre *asteriscos* en serif cursiva (igual que los títulos). */
function Phrase({ text }: { text: string }) {
  return (
    <>
      {text.split(/(\*[^*]+\*)/).map((part, i) =>
        part.startsWith("*") ? (
          <em key={i} className="font-serif font-medium tracking-[-.035em] italic">
            {part.slice(1, -1)}
          </em>
        ) : (
          part
        ),
      )}
    </>
  );
}

/** Encabezado numerado de cada bloque de la ficha (01 · En números…) */
function Head({ n, children }: { n: number; children: React.ReactNode }) {
  return (
    <h3 className="mono text-mut">
      <b className="font-medium text-fg">{String(n).padStart(2, "0")}</b> · {children}
    </h3>
  );
}

/**
 * Acerca de mí (continuación), como ficha: a la izquierda "Quién soy" con el CV, fija al bajar;
 * a la derecha tres bloques numerados: en números, ahora mismo y abierto a.
 * El texto principal y la foto están en IntroScene.
 */
export default function AboutR() {
  const t = useT();
  const { site, now, openTo, stats } = useContent();
  return (
    <section aria-label={t("Más sobre mí", "More about me")} className="glow [--gc:var(--olive)] [--gx:6%] [--gy:30%] pt-[clamp(30px,4vw,60px)] pb-[clamp(90px,11vw,170px)]">
      <div className="wrap grid grid-cols-[minmax(0,.9fr)_minmax(0,1.1fr)] items-start gap-[clamp(30px,6vw,100px)] max-[900px]:grid-cols-1">
        {/* Quién soy */}
        <div data-a="left" className="rv sticky top-[110px] max-[900px]:static">
          <h3 className="mono text-mut">{t("Quién soy", "Who I am")}</h3>
          <p className="mt-[18px] font-disp text-[clamp(30px,3vw,46px)] leading-[1.1] font-medium tracking-[-.035em] text-pretty">
            <Phrase text={t("Me gusta llevar una idea *desde el diseño* hasta el código *en producción*.", "I like taking an idea *from design* all the way to code *in production*.")} />
          </p>
          <p className="mt-[18px] max-w-[30em] text-[17px] leading-normal text-soft">
            {t("Entender el problema, diseñarlo y dejarlo funcionando para quien lo va a usar.", "Understanding the problem, designing it and leaving it working for the people who will use it.")}
          </p>
          <div className="mt-[30px] flex flex-wrap items-center gap-x-6 gap-y-3">
            <a href={site.cv} download="CV-Gabriel-Guerrero.pdf" className={cx(btnF, "mag")}>
              {t("Descargar CV ↓", "Download CV ↓")}
            </a>
            <span className="mono text-mut">{t("Ing. de Software", "Software Eng.")} · Pasto, Colombia</span>
          </div>
        </div>

        {/* Ficha numerada */}
        <ol className="border-t border-line">
          <li data-a="right" className="rv border-b border-line py-[clamp(22px,2.4vw,30px)]">
            <Head n={1}>{t("En números", "In numbers")}</Head>
            <ul className="mt-4 grid grid-cols-3 gap-4" aria-label={t("En números", "In numbers")}>
              {stats.map((s, i) => (
                <li key={s.label}>
                  <b className="block font-disp text-[clamp(40px,5vw,80px)] leading-none font-medium tracking-[-.05em]" style={{ color: STAT_COLORS[i] }}>
                    {s.value}
                  </b>
                  <span className="mono mt-2 block text-mut">{s.label}</span>
                </li>
              ))}
            </ul>
          </li>
          <li data-a="right" className="rv border-b border-line py-[clamp(22px,2.4vw,30px)]">
            <Head n={2}>{t("Ahora mismo", "Right now")}</Head>
            <dl className="mt-2">
              {now.map((n) => (
                <div key={n.label} className="grid grid-cols-[150px_1fr] gap-4 py-3 max-[900px]:grid-cols-1 max-[900px]:gap-1">
                  <dt className="font-disp text-[15px] font-medium text-mut">{n.label}</dt>
                  <dd className="m-0 font-disp text-lg leading-snug font-medium">{n.projects ? <ProjectLinks ids={n.projects} /> : n.value}</dd>
                </div>
              ))}
            </dl>
          </li>
          <li data-a="right" className="rv border-b border-line py-[clamp(22px,2.4vw,30px)]">
            <Head n={3}>{t("Abierto a", "Open to")}</Head>
            <ul className="mt-4 flex flex-wrap gap-2">
              {openTo.map((o, i) => (
                <li key={o} className={cx("rounded-full px-4 py-2 font-disp text-[15px] font-medium", CHIP[i % 4])}>
                  {o}
                </li>
              ))}
            </ul>
          </li>
        </ol>
      </div>
    </section>
  );
}
