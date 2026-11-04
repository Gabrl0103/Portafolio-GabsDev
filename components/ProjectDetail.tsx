"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { Project } from "@/types";
import ProjectScreen from "./ProjectScreen";
import ProjectLinkButton from "./ProjectLinkButton";
import { chip, cx } from "./ui";

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
      role="dialog"
      aria-modal="true"
      aria-label={project ? `Detalle de ${project.title}` : "Detalle del proyecto"}
      aria-hidden={!open}
      onClick={(e) => e.target === e.currentTarget && onClose()}
      className={cx(
        "fixed inset-0 z-[140] flex items-center justify-center bg-[rgba(10,12,6,.28)] p-[max(14px,3vw)] backdrop-blur-[34px] backdrop-saturate-[1.6]",
        open ? "visible opacity-100 [transition:opacity_.5s_ease]" : "invisible opacity-0 [transition:opacity_.5s_ease,visibility_0s_.5s]",
      )}
    >
      <div
        ref={sheet}
        className={cx(
          "glass relative max-h-full w-[min(1100px,100%)] overflow-auto overscroll-contain rounded-[38px] p-[clamp(24px,4vw,56px)] [transition:transform_.8s_cubic-bezier(.2,.8,.2,1),opacity_.5s]",
          open ? "translate-y-0 scale-100 opacity-100" : "translate-y-[46px] scale-[.95] opacity-0",
        )}
      >
        <button
          ref={closeBtn}
          type="button"
          aria-label="Cerrar"
          onClick={onClose}
          className="sticky top-0 z-[3] float-right flex size-[42px] cursor-pointer items-center justify-center rounded-full border-0 bg-glass2 text-fg shadow-[inset_0_1px_0_var(--gl-hi)] backdrop-blur-[20px]"
        >
          <svg viewBox="0 0 16 16" className="size-4 fill-none stroke-current stroke-2 [stroke-linecap:round]">
            <path d="M3 3l10 10M13 3 3 13" />
          </svg>
        </button>
        {project && (
          <div>
            <span className="text-[15px] font-semibold text-acc">{project.kind}</span>
            <h2 className="mt-1.5 mb-3.5 text-[clamp(40px,6vw,84px)] leading-none tracking-[-.04em]">{project.title}</h2>
            <p className="m-0 max-w-[52ch] text-[clamp(17px,1.6vw,21px)] leading-normal text-soft">{project.description}</p>
            <div className="relative my-[30px] aspect-[16/10] overflow-hidden rounded-[22px] shadow-[0_30px_60px_-30px_var(--shadow),0_0_0_1px_var(--glass-b)]">
              <ProjectScreen project={project} />
            </div>
            <div className="grid grid-cols-2 gap-x-10 gap-y-[26px] max-[860px]:grid-cols-1">
              {sections.map(([k, label]) => (
                <div key={k}>
                  <h4 className="m-0 mb-1.5 text-sm/[1.5] font-semibold text-acc">{label}</h4>
                  <p className="m-0 text-base leading-[1.55] text-soft">{project.detail[k]}</p>
                </div>
              ))}
            </div>
            <div className="mt-7 flex flex-wrap gap-2">
              {project.tags.map((t) => (
                <span key={t} className={chip}>
                  {t}
                </span>
              ))}
            </div>
            <div className="mt-[30px] flex flex-wrap gap-2.5">
              <ProjectLinkButton link={project.primary} size="md" />
              <ProjectLinkButton link={project.secondary} size="md" variant="primary" />
            </div>
          </div>
        )}
      </div>
    </div>,
    document.body,
  );
}
