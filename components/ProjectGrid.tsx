import type { Project } from "@/types";
import ProjectLinkButton from "./ProjectLinkButton";
import ProjectScreen from "./ProjectScreen";
import { chip } from "./ui";

/**
 * Vista en cuadrícula responsive: 1 columna en celular y 2 en escritorio.
 * Cada tarjeta lleva vista previa, título, descripción, tecnologías y enlaces a GitHub y a la demo.
 */
export default function ProjectGrid({ projects, onOpen }: { projects: Project[]; onOpen: (p: Project) => void }) {
  return (
    <ul className="m-0 grid list-none grid-cols-1 gap-5 p-0 md:grid-cols-2">
      {projects.map((p, i) => (
        <li key={p.id} className="animate-pv-up [animation-duration:.7s]" style={{ animationDelay: `${i * 80}ms` }}>
          <article className="glass group flex h-full flex-col overflow-hidden rounded-[26px]">
            <button
              type="button"
              onClick={() => onOpen(p)}
              aria-label={`Ver detalle de ${p.title}`}
              className="relative m-3 mb-0 block aspect-[16/10] cursor-pointer overflow-hidden rounded-[16px] border-0 p-0 shadow-[0_20px_40px_-24px_var(--shadow)]"
            >
              <ProjectScreen project={p} className="transition-transform duration-700 ease-out-soft group-hover:scale-[1.03]" />
            </button>

            <div className="flex flex-1 flex-col gap-3 p-6">
              <span className="text-xs font-medium text-acc">{p.kind}</span>
              <h3 className="m-0 text-2xl font-semibold tracking-[-.03em] text-fg">{p.title}</h3>
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
  );
}
