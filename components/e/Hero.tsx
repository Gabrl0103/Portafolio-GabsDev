"use client";

import Image from "next/image";
import { useContent } from "@/lib/content";
import { useT } from "@/lib/i18n";
import { goTo } from "./parts";

/**
 * Inicio (tinta): datos arriba como cabecera de revista, el nombre de lado a lado,
 * y abajo la foto, la frase y el texto con el CV.
 */
export default function Hero() {
  const t = useT();
  const { site } = useContent();
  return (
    <section id="inicio" className="tinta flex min-h-svh flex-col">
      <div className="label grid grid-cols-4 px-8 pt-[78px] opacity-85 max-[700px]:grid-cols-2 max-[700px]:gap-1.5 max-[700px]:px-[18px]">
        <span>{site.role}</span>
        <span>
          {t("Ingeniería de Software", "Software Engineering")} ·{" "}
          {site.semester}
        </span>
        <span>{site.city}</span>
        <a
          href={`mailto:${site.email}`}
          className="text-right normal-case max-[700px]:text-left"
        >
          {site.email} ↗
        </a>
      </div>

      <h1 className="display mt-[9vh] px-[26px] text-[13.3vw] whitespace-nowrap max-[700px]:mt-[6vh] max-[700px]:px-[14px] max-[700px]:text-[21vw] max-[700px]:whitespace-normal">
        Gabriel Guerrero
        <sup className="relative top-[.35em] ml-[.15em] align-top text-[.2em] font-medium tracking-normal">
          ®
        </sup>
      </h1>

      <div className="mx-8 mt-auto grid grid-cols-[.75fr_1.5fr_1fr] items-end gap-9 border-t border-line pt-8 pb-14 max-[900px]:mx-[18px] max-[900px]:mt-12 max-[900px]:grid-cols-1">
        <figure className="flex items-end gap-4">
          <span className="relative block h-[214px] w-[170px] shrink-0 overflow-hidden">
            <Image
              src={site.portrait}
              alt={t("Foto de Gabriel Guerrero", "Photo of Gabriel Guerrero")}
              fill
              sizes="170px"
              className="bn object-cover object-[50%_18%]"
              priority
            />
          </span>
          <figcaption className="label text-soft">
            {t("Foto", "Photo")}
            <br />
            Pasto, 2026
          </figcaption>
        </figure>
        <p className="claim text-[clamp(30px,3vw,48px)] max-[700px]:text-[30px]">
          {t(
            "Del diseño al código en producción:",
            "From design to code in production:",
          )}{" "}
          <b className="font-extrabold">
            {t(
              "apps de escritorio, Android, Wear OS y web.",
              "desktop, Android, Wear OS and web apps.",
            )}
          </b>
        </p>
        <div>
          <p className="text-[13px] text-soft">
            {t(
              "Estudio Ingeniería de Software en la Universidad Cooperativa de Colombia y busco prácticas y proyectos freelance para seguir creciendo.",
              "I study Software Engineering at Universidad Cooperativa de Colombia and I'm looking for internships and freelance projects to keep growing.",
            )}
          </p>
          <div className="mt-[18px] flex flex-wrap gap-2.5">
            <a
              href={site.cv}
              download="CV-Gabriel-Guerrero.pdf"
              className="pill pill-fill"
            >
              {t("Descargar CV ↓", "Download CV ↓")}
            </a>
            <a
              href="#proyectos"
              onClick={(e) => {
                e.preventDefault();
                goTo("proyectos");
              }}
              className="pill"
            >
              {t("Proyectos ↘", "Projects ↘")}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
