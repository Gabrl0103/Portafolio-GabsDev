import Image from "next/image";
import type { Project } from "@/types";
import ProjectArt from "./ProjectArt";
import ProjectLinkButton from "./ProjectLinkButton";
import { chip, cx, wrap } from "./ui";

/**
 * Todos los proyectos en cuadrícula responsive: 1 columna en celular y 2 en escritorio.
 * Cada tarjeta lleva imagen, título, descripción, tecnologías y enlaces a GitHub y a la demo.
 */
export default function ProjectGrid({ projects, onOpen }: { projects: Project[]; onOpen: (p: Project) => void }) {
  return (
    <div className={cx(wrap, "pt-6 pb-28 md:pb-36")}>
      <div className="rv mb-8 flex flex-wrap items-end justify-between gap-3">
        <div>
          <span className="text-sm font-medium text-acc">Todos los proyectos</span>
          <h3 className="mt-1 text-[clamp(26px,3vw,36px)] leading-tight">En detalle</h3>
        </div>
        <p className="m-0 text-sm text-mut">{projects.length} proyectos · código y demo de cada uno</p>
      </div>

      <ul className="m-0 grid list-none grid-cols-1 gap-5 p-0 md:grid-cols-2">
        {projects.map((p, i) => (
          <li key={p.id} className="rv" style={{ "--d": `${(i % 2) * 0.1}s` } as React.CSSProperties}>
            <article className="glass group flex h-full flex-col overflow-hidden rounded-[26px]">
              <button
                type="button"
                onClick={() => onOpen(p)}
                aria-label={`Ver detalle de ${p.title}`}
                className="relative block aspect-[2/1] w-full cursor-pointer overflow-hidden border-0 bg-[radial-gradient(70%_90%_at_60%_50%,color-mix(in_srgb,var(--acc)_20%,transparent),transparent_75%)] p-0"
              >
                {p.image ? (
                  <Image
                    src={p.image}
                    alt={`Captura de ${p.title}`}
                    fill
                    sizes="(max-width: 768px) 100vw, 600px"
                    className="object-cover transition-transform duration-700 ease-out-soft group-hover:scale-[1.04]"
                  />
                ) : (
                  <ProjectArt
                    art={p.art}
                    className="absolute inset-0 m-auto h-[82%] w-auto transition-transform duration-700 ease-out-soft group-hover:scale-[1.05]"
                  />
                )}
                <span className="glass-flat absolute right-3 bottom-3 rounded-full px-3 py-1 text-xs/[1.5] font-medium tracking-normal text-fg opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  Ver detalle
                </span>
              </button>

              <div className="flex flex-1 flex-col gap-3 border-t border-line p-6">
                <span className="text-xs font-medium text-acc">{p.kind}</span>
                <h4 className="m-0 text-2xl font-semibold tracking-[-.03em] text-fg">{p.title}</h4>
                <p className="m-0 line-clamp-3 text-[15px] leading-relaxed text-soft">{p.description}</p>
                <ul className="m-0 flex list-none flex-wrap gap-2 p-0" aria-label="Tecnologías">
                  {p.tags.map((t, k) => (
                    <li key={k}>
                      <span className={chip}>{t}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-auto flex flex-wrap gap-2.5 pt-2">
                  <ProjectLinkButton link={p.primary} />
                  <ProjectLinkButton link={p.secondary} variant="primary" />
                </div>
              </div>
            </article>
          </li>
        ))}
      </ul>
    </div>
  );
}
