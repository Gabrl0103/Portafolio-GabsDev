"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { Project } from "@/types";
import ProjectArt from "./ProjectArt";

const sections: [keyof Project["detail"], string][] = [
  ["problema", "Problema"],
  ["solucion", "Solución"],
  ["rol", "Mi rol"],
  ["resultado", "Resultado"],
];

/** Hoja de vidrio con el detalle de un proyecto. */
export default function ProjectDetail({ project: current, onClose }: { project: Project | null; onClose: () => void }) {
  // Conserva el último proyecto para que el contenido no desaparezca durante el cierre.
  const [project, setProject] = useState(current);
  if (current && current !== project) setProject(current);
  const closeBtn = useRef<HTMLButtonElement>(null);
  const sheet = useRef<HTMLDivElement>(null);
  const open = current !== null;

  useEffect(() => {
    if (!open) return;
    const prev = document.activeElement as HTMLElement | null;
    const root = document.documentElement;
    root.classList.add("lock");
    if (sheet.current) sheet.current.scrollTop = 0;
    const t = setTimeout(() => closeBtn.current?.focus({ preventScroll: true }), 60);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    addEventListener("keydown", onKey);
    return () => {
      clearTimeout(t);
      removeEventListener("keydown", onKey);
      root.classList.remove("lock");
      prev?.focus({ preventScroll: true });
    };
  }, [open, onClose]);

  if (typeof document === "undefined") return null;

  return createPortal(
    <div
      id="pd"
      className={open ? "open" : undefined}
      role="dialog"
      aria-modal="true"
      aria-label={project ? `Detalle de ${project.title}` : "Detalle del proyecto"}
      aria-hidden={!open}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="sheet" ref={sheet}>
        <button ref={closeBtn} className="x" type="button" aria-label="Cerrar" onClick={onClose}>
          <svg viewBox="0 0 16 16">
            <path d="M3 3l10 10M13 3 3 13" />
          </svg>
        </button>
        {project && (
          <div>
            <span className="d-tag">{project.kind}</span>
            <h2>{project.title}</h2>
            <p className="d-lead">{project.description}</p>
            <div className="d-vis relative">
              {project.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={project.image} alt={`Captura de ${project.title}`} className="h-full w-full object-cover" />
              ) : (
                <ProjectArt art={project.art} />
              )}
            </div>
            <div className="d-grid">
              {sections.map(([k, label]) => (
                <div key={k}>
                  <h4>{label}</h4>
                  <p>{project.detail[k]}</p>
                </div>
              ))}
            </div>
            <div className="chips">
              {project.tags.map((t) => (
                <span key={t}>{t}</span>
              ))}
            </div>
            <div className="d-links">
              <a className="btn" href={project.primary.href} target="_blank" rel="noopener noreferrer">
                {project.primary.label} ↗
              </a>
              <a className="btn primary" href={project.secondary.href} target="_blank" rel="noopener noreferrer">
                {project.secondary.label} ↗
              </a>
            </div>
          </div>
        )}
      </div>
    </div>,
    document.body,
  );
}
