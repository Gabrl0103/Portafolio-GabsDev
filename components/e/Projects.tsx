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
  const [prev, setPrev] = useState(0);
  const [open, setOpen] = useState<number | null>(null);
  const hover = (i: number) => {
    if (i === on) return;
    setPrev(on);
    setOn(i);
  };
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
            {/* La captura nueva se descubre de abajo hacia arriba sobre la anterior */}
            <div className="relative aspect-[4/3] overflow-hidden bg-fg/[.06]">
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
                      "bn object-cover",
                      prev === i ? "opacity-100" : "opacity-0",
                    )}
                  />
                ) : null;
              })}
              {cover(cur) && (
                <div
                  key={cur.id}
                  className="unveil absolute inset-0 overflow-hidden"
                >
                  <Image
                    src={cover(cur)!}
                    alt=""
                    fill
                    sizes="50vw"
                    className="bn animate-[zoom-out_1.4s_var(--ease-expo)_both] object-cover"
                  />
                </div>
              )}
              <span className="display absolute right-4 bottom-3 overflow-hidden text-[64px] leading-none text-white mix-blend-difference">
                <span key={cur.id} className="rise block">
                  {pad(on + 1)}
                </span>
              </span>
            </div>
            <div className="label mt-2 flex justify-between overflow-hidden">
              <span key={cur.id} className="rise">
                {cur.title}
              </span>
              <span className="text-soft">{platform(cur.kind)}</span>
            </div>
          </div>
        </div>

        <ol className="border-t border-line">
          {projects.map((p, i) => (
            <li
              key={p.id}
              className="rv relative border-b border-line"
              style={{ transitionDelay: `${i * 70}ms` }}
            >
              {/* Línea que se dibuja bajo el proyecto activo */}
              <span
                aria-hidden="true"
                className={cx(
                  "absolute -bottom-px left-0 h-[2px] w-full origin-left bg-fg transition-transform duration-700 ease-expo",
                  on === i ? "scale-x-100" : "scale-x-0",
                )}
              />
              <div
                role="button"
                tabIndex={0}
                onMouseEnter={() => hover(i)}
                onFocus={() => hover(i)}
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
                      "flex items-center gap-2 text-[26px] font-extrabold tracking-[-.035em] transition-transform duration-500 ease-expo",
                      on === i && "translate-x-2",
                    )}
                  >
                    {p.title}
                    <span
                      aria-hidden="true"
                      className={cx(
                        "text-[18px] transition-[opacity,translate] duration-500 ease-expo",
                        on === i
                          ? "translate-x-0 opacity-100"
                          : "-translate-x-2 opacity-0",
                      )}
                    >
                      ↗
                    </span>
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
      <Detail k={open} onClose={close} onGo={setOpen} />
    </section>
  );
}

/** Detalle del proyecto a pantalla completa, en papel */
function Detail({
  k,
  onClose,
  onGo,
}: {
  k: number | null;
  onClose: () => void;
  onGo: (i: number) => void;
}) {
  const t = useT();
  const { projects } = useContent();
  const [mounted, setMounted] = useState(false);
  const [last, setLast] = useState(0);
  if (k !== null && k !== last) setLast(k);
  const p = projects[k ?? last];
  const isOpen = k !== null;
  // Cuenta cada apertura, así las animaciones de entrada se repiten
  const [seq, setSeq] = useState(0);
  const [wasOpen, setWasOpen] = useState(false);
  if (isOpen !== wasOpen) {
    setWasOpen(isOpen);
    if (isOpen) setSeq((x) => x + 1);
  }
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
    // (también al pasar al siguiente proyecto: ver efecto de abajo)
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

  useEffect(() => {
    if (k !== null && panel.current)
      panel.current.scrollTo({ top: 0, behavior: "smooth" });
  }, [k]);

  if (!mounted) return null;
  const i = k ?? last;
  const next = (i + 1) % projects.length;
  const d = (ms: number) => ({ animationDelay: `${ms}ms` });
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
      <div key={`${seq}-${i}`}>
        <div
          className="label rise flex items-center justify-between border-b border-line pb-3"
          style={d(250)}
        >
          <span>
            {t("Proyecto", "Project")} {pad(i + 1)} / {pad(projects.length)} —{" "}
            {platform(p.kind)}
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
            <h2 className="display text-[clamp(56px,8vw,128px)]">
              {p.title.split(" ").map((w, j) => (
                <span
                  key={j}
                  className="inline-block overflow-hidden pb-[.08em] align-top"
                >
                  <span className="word-in mr-[.18em]" style={d(380 + j * 90)}>
                    {w}
                  </span>
                </span>
              ))}
            </h2>
            <div className="unveil mt-8" style={d(550)}>
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
            <p
              className="rise text-[clamp(18px,1.6vw,23px)] leading-[1.4] font-medium tracking-[-.01em]"
              style={d(600)}
            >
              {p.description}
            </p>
            <p className="label rise mt-5 text-soft" style={d(680)}>
              {p.tags.join(" · ")}
            </p>
            <dl className="mt-8 border-t border-fg">
              {rows.map(([key, es, en], j) => (
                <div
                  key={key}
                  className="rise grid grid-cols-[120px_1fr] gap-4 border-b border-line py-4 max-[700px]:grid-cols-1 max-[700px]:gap-1"
                  style={d(740 + j * 90)}
                >
                  <dt className="label text-soft">{t(es, en)}</dt>
                  <dd className="text-[15px]">{p.detail[key]}</dd>
                </div>
              ))}
            </dl>
            <div
              className="label rise mt-7 flex flex-wrap gap-5"
              style={d(1100)}
            >
              {links(p).map((l) => (
                <LinkTag key={l.label} l={l} />
              ))}
            </div>
          </div>
        </div>

        {/* Pasar al siguiente proyecto */}
        <button
          type="button"
          onClick={() => onGo(next)}
          className="group mt-20 flex w-full items-end justify-between border-t border-fg pt-5 text-left"
        >
          <span>
            <span className="label block text-soft">
              {t("Siguiente proyecto", "Next project")} · {pad(next + 1)}
            </span>
            <span className="display mt-2 block text-[clamp(44px,6vw,96px)] transition-transform duration-700 ease-expo group-hover:translate-x-3">
              {projects[next].title}
            </span>
          </span>
          <ArrowOut
            size={56}
            className="shrink-0 transition-transform duration-700 ease-expo group-hover:translate-x-1 group-hover:-translate-y-1"
          />
        </button>
      </div>
    </div>,
    document.body,
  );
}
