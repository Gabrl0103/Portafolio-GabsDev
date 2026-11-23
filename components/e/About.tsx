"use client";

import Image from "next/image";
import { Fragment } from "react";
import { useContent } from "@/lib/content";
import { useT } from "@/lib/i18n";
import { ArrowDown, PageHead } from "./parts";
import { openProject } from "./Projects";

/** Sobre mí: título partido en dos columnas, texto en columnas, cifras y la foto grande. */
export default function About() {
  const t = useT();
  const { sections, now, openTo, stats, projects } = useContent();
  return (
    <section
      id="acerca"
      className="relative px-8 pt-[22px] pb-28 max-[700px]:px-[18px]"
    >
      <PageHead n={1} label={sections[0].label} />
      <h2 className="display rv grid grid-cols-2 gap-14 text-[132px] max-[900px]:flex max-[900px]:gap-[.25em] max-[900px]:text-[64px]">
        <span>{t("Sobre", "About")}</span>
        <span>{t("mí.", "me.")}</span>
      </h2>

      <div className="mt-9 grid grid-cols-2 items-end gap-14 max-[900px]:grid-cols-1">
        <div className="rv grid grid-cols-2 gap-7 max-[700px]:grid-cols-1">
          <div>
            <p className="label mb-2.5">{t("Quién soy", "Who I am")}</p>
            <p className="text-[21px] leading-[1.2] font-semibold tracking-[-.02em]">
              {t(
                "Me gusta entender el problema, diseñarlo y dejarlo funcionando para quien lo va a usar.",
                "I like understanding the problem, designing it and leaving it working for the people who will use it.",
              )}
            </p>
          </div>
          <dl className="text-[13px] text-soft">
            {now.map((n) => (
              <div key={n.label} className="mb-3.5">
                <dt className="label mb-1 text-fg">{n.label}</dt>
                <dd>
                  {n.projects
                    ? n.projects.map((id, i) => {
                        const p = projects.find((x) => x.id === id);
                        return (
                          <Fragment key={id}>
                            {i > 0 &&
                              (i === n.projects!.length - 1
                                ? t(" y ", " and ")
                                : ", ")}
                            <button
                              type="button"
                              onClick={() => openProject(id)}
                              className="border-b border-line transition-colors hover:border-fg hover:text-fg"
                            >
                              {p?.title}
                            </button>
                          </Fragment>
                        );
                      })
                    : n.value}
                </dd>
              </div>
            ))}
            <dt className="label mb-1 text-fg">{t("Abierto a", "Open to")}</dt>
            <dd>{openTo.join(" · ")}</dd>
          </dl>
          <ul className="col-span-full mt-5 grid grid-cols-3 border-t border-fg max-[700px]:col-span-1">
            {stats.map((s) => (
              <li key={s.label} className="pt-3">
                <b className="display block text-[70px] max-[700px]:text-[52px]">
                  {s.value}
                </b>
                <span className="label text-soft">{s.label}</span>
              </li>
            ))}
          </ul>
        </div>
        <figure className="rv self-start justify-self-center w-full max-w-[440px] bg-[#f7f5f1] p-[6%] pb-[4%] shadow-[0_30px_60px_-30px_rgba(17,17,17,.45)]">
          <span className="relative block aspect-[4/5] overflow-hidden">
            <Image
              src="/images/gabriel-bn.webp"
              alt=""
              fill
              sizes="(max-width: 900px) 100vw, 440px"
              className="object-cover object-center"
            />
          </span>
          <figcaption className="label mt-[5%] flex justify-between text-[#6d6a65]">
            <span>Gabriel Guerrero</span>
            <span>Pasto, 2026</span>
          </figcaption>
        </figure>
      </div>
      <ArrowDown className="absolute right-8 bottom-8 max-[700px]:right-[18px]" />
    </section>
  );
}
