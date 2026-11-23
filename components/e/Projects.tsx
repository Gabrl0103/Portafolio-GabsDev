"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useContent } from "@/lib/content";
import { useT } from "@/lib/i18n";
import type { Project, ProjectLink } from "@/types";
import { cx } from "../ui";
import Gallery from "./Gallery";
import { ArrowDown, ArrowOut, PageHead, pad } from "./parts";

/** Abre el detalle de un proyecto desde cualquier parte del sitio */
export const openProject = (id: string) =>
  dispatchEvent(new CustomEvent("open-project", { detail: id }));

/** "Proyecto académico · Wear OS · En equipo" → "Wear OS" (también en inglés) */
const platform = (kind: string) =>
  kind
    .split(" · ")
    .filter(
      (x) =>
        !/^(Proyecto|Project|University|Academic|Client|Business)\b/.test(x) &&
        x !== "En equipo" &&
        x !== "Team",
    )
    .join(" · ");
const lead = (p: Project) =>
  p.description.split(". ")[0].replace(/\.$/, "") + ".";
const cover = (p: Project) =>
  p.image ?? p.media?.find((m) => m.type === "image")?.src;
const links = (p: Project) =>
  [p.demo, p.primary, p.secondary].filter((l): l is ProjectLink => !!l);

/** Enlace del proyecto: sin dirección se muestra apagado con su nota ("Privado", "Pronto"…) */
function LinkTag({ l }: { l: ProjectLink }) {
  const t = useT();
  if (!l.href)
    return (
      <span className="border-b border-dashed border-line pb-px text-soft">
        {l.label} · {l.note ?? t("Pronto", "Soon")}
      </span>
    );
  return (
    <a
      href={l.href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={(e) => e.stopPropagation()}
      className="border-b-[1.5px] border-fg pb-px font-bold"
    >
      {l.label} ↗
    </a>
  );
}

/**
 * Proyectos: a la izquierda el título y la captura del proyecto activo (cambia con el cursor);
 * a la derecha la lista con plataforma, descripción, tecnologías y enlaces. Cada fila abre su detalle.
 */
export default function Projects() {
  const t = useT();
  const { projects, sections, site } = useContent();
  const [on, setOn] = useState(0);
  const [open, setOpen] = useState<number | null>(null);
  const close = useCallback(() => setOpen(null), []);

  useEffect(() => {
    const onOpen = (e: Event) => {
      const k = projects.findIndex(
        (p) => p.id === (e as CustomEvent<string>).detail,
      );
      if (k >= 0) setOpen(k);
    };
    addEventListener("open-project", onOpen);
    return () => removeEventListener("open-project", onOpen);
  }, [projects]);

  const cur = projects[on];
  return (
    <section
      id="proyectos"
      className="relative px-8 pt-[22px] pb-28 max-[700px]:px-[18px]"
    >
      <PageHead n={2} label={sections[1].label} />
      <div className="grid grid-cols-2 gap-14 max-[900px]:grid-cols-1">
        <div>
          <h2 className="display rv text-[118px] max-[900px]:text-[64px]">
            {t("Proyec-", "Pro-")}
            <br />
            {t("tos", "jects")}
          </h2>
          {/* Captura del proyecto activo */}
          <div className="sticky top-20 mt-9 max-[900px]:hidden">
            <div className="relative aspect-[4/3] overflow-hidden bg-[rgba(17,17,17,.06)]">
              {projects.map((p, i) => {
                const src = cover(p);
                return src ? (
                  <Image
                    key={p.id}
                    src={src}
                    alt=""
                    fill
                    sizes="50vw"
                    className={cx(
                      "bn object-cover transition-opacity duration-500",
                      on === i ? "opacity-100" : "opacity-0",
                    )}
                  />
                ) : null;
              })}
            </div>
            <div className="label mt-2 flex justify-between">
              <span>
                {pad(on + 1)} — {cur.title}
              </span>
              <span className="text-soft">{platform(cur.kind)}</span>
            </div>
          </div>
        </div>

        <ol className="border-t border-line">
          {projects.map((p, i) => (
            <li key={p.id} className="border-b border-line">
              <div
                role="button"
                tabIndex={0}
                onMouseEnter={() => setOn(i)}
                onFocus={() => setOn(i)}
                onClick={() => setOpen(i)}
                onKeyDown={(e) =>
                  (e.key === "Enter" || e.key === " ") &&
                  (e.preventDefault(), setOpen(i))
                }
                aria-label={t(`Ver ${p.title}`, `View ${p.title}`)}
                className="grid cursor-pointer grid-cols-2 items-end gap-x-5 gap-y-1 py-[18px] max-[700px]:grid-cols-1"
              >
                <div>
                  <p className="label mb-1.5 text-soft">
                    <b className="mr-2 text-fg">{pad(i + 1)}</b>
                    {platform(p.kind)}
                  </p>
                  <h3
                    className={cx(
                      "text-[26px] font-extrabold tracking-[-.035em] decoration-2 underline-offset-[5px]",
                      on === i && "underline",
                    )}
                  >
                    {p.title}
                  </h3>
                </div>
                <p className="text-right text-[13px] leading-[1.45] text-soft max-[700px]:text-left">
                  {lead(p)}
                </p>
                <div className="label col-span-full mt-1 flex flex-wrap items-center justify-between gap-x-4 gap-y-2 text-soft">
                  <span>{p.tags.slice(0, 3).join(" · ")}</span>
                  <span className="flex gap-3 text-fg">
                    {links(p).map((l) => (
                      <LinkTag key={l.label} l={l} />
                    ))}
                  </span>
                </div>
              </div>
            </li>
          ))}
          <li>
            <a
              href={site.github}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between border-b border-line py-4"
            >
              <span>
                <small className="block text-[11px] text-soft">
                  {t("Más en", "More on")}
                </small>
                <b className="text-2xl font-extrabold tracking-[-.035em]">
                  GitHub
                </b>
              </span>
              <ArrowOut />
            </a>
          </li>
        </ol>
      </div>
      <ArrowDown className="absolute right-8 bottom-8 max-[700px]:right-[18px]" />
      <Detail k={open} onClose={close} />
    </section>
  );
}

/** Detalle del proyecto a pantalla completa, en papel */
function Detail({ k, onClose }: { k: number | null; onClose: () => void }) {
  const t = useT();
  const { projects } = useContent();
  const [mounted, setMounted] = useState(false);
  const [last, setLast] = useState(0);
  if (k !== null && k !== last) setLast(k);
  const p = projects[k ?? last];
  const isOpen = k !== null;
  const panel = useRef<HTMLDivElement>(null);
  const closeBtn = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const id = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(id);
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const prev = document.activeElement as HTMLElement | null;
    document.body.style.overflow = "hidden";
    if (panel.current) panel.current.scrollTop = 0;
    const id = setTimeout(
      () => closeBtn.current?.focus({ preventScroll: true }),
      400,
    );
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    addEventListener("keydown", onKey);
    return () => {
      clearTimeout(id);
      removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      prev?.focus({ preventScroll: true });
    };
  }, [isOpen, onClose]);

  if (!mounted) return null;
  const rows: [keyof Project["detail"], string, string][] = [
    ["problema", "Problema", "Problem"],
    ["solucion", "Solución", "Solution"],
    ["rol", "Mi rol", "My role"],
    ["resultado", "Resultado", "Outcome"],
  ];
  return createPortal(
    <div
      ref={panel}
      role="dialog"
      aria-modal="true"
      aria-label={p.title}
      inert={!isOpen}
      className={cx(
        "fixed inset-0 z-[70] overflow-auto bg-bg px-8 pt-6 pb-16 text-fg transition-[transform,visibility] duration-700 ease-expo max-[700px]:px-[18px]",
        isOpen ? "visible translate-y-0" : "invisible translate-y-full",
      )}
    >
      <div className="label flex items-center justify-between border-b border-line pb-3">
        <span>
          {t("Proyecto", "Project")} {pad((k ?? last) + 1)} /{" "}
          {pad(projects.length)} — {platform(p.kind)}
        </span>
        <button
          ref={closeBtn}
          type="button"
          onClick={onClose}
          className="pill px-3.5! py-2!"
        >
          {t("Cerrar", "Close")} ✕
        </button>
      </div>
      <div className="mt-10 grid grid-cols-[1.1fr_1fr] gap-14 max-[900px]:grid-cols-1">
        <div>
          <h2 className="display text-[clamp(56px,8vw,128px)]">{p.title}</h2>
          <div className="mt-8">
            {p.media?.length ? (
              <Gallery key={p.id} media={p.media} />
            ) : cover(p) ? (
              <div className="relative aspect-[4/3]">
                <Image
                  src={cover(p)!}
                  alt=""
                  fill
                  sizes="55vw"
                  className="object-cover"
                />
              </div>
            ) : null}
          </div>
        </div>
        <div>
          <p className="text-[clamp(18px,1.6vw,23px)] leading-[1.4] font-medium tracking-[-.01em]">
            {p.description}
          </p>
          <p className="label mt-5 text-soft">{p.tags.join(" · ")}</p>
          <dl className="mt-8 border-t border-fg">
            {rows.map(([key, es, en]) => (
              <div
                key={key}
                className="grid grid-cols-[120px_1fr] gap-4 border-b border-line py-4 max-[700px]:grid-cols-1 max-[700px]:gap-1"
              >
                <dt className="label text-soft">{t(es, en)}</dt>
                <dd className="text-[15px]">{p.detail[key]}</dd>
              </div>
            ))}
          </dl>
          <div className="label mt-7 flex flex-wrap gap-5">
            {links(p).map((l) => (
              <LinkTag key={l.label} l={l} />
            ))}
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
