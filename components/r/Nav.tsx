"use client";

import { useEffect, useRef, useState } from "react";
import { skillGroups } from "@/data/about";
import { experience } from "@/data/experience";
import { projects } from "@/data/projects";
import { services } from "@/data/services";
import { sections, site } from "@/data/site";
import { testimonials } from "@/data/testimonials";
import Clock from "../Clock";
import { cx } from "../ui";
import GrainText from "./GrainText";
import RollText from "./RollText";
import { copyText, scrollToSection, toggleTheme } from "./theme";

const pad = (n: number) => String(n).padStart(2, "0");
const COLORS = ["var(--olive)", "var(--cream)", "var(--orange)"];
const toolCount = skillGroups.reduce((n, g) => n + g.skills.length, 0);
const SUP: Record<string, string> = {
  acerca: "+",
  proyectos: `(${pad(projects.length)})`,
  servicios: `(${pad(services.length)})`,
  herramientas: `(${pad(toolCount)})`,
  testimonios: `(${pad(testimonials.length)})`,
  experiencia: `(${pad(experience.length)})`,
  contacto: "↗",
};

function ThemeIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-[15px] fill-none stroke-current stroke-[1.8]" aria-hidden="true">
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 3.5v17a8.5 8.5 0 0 0 0-17z" className="fill-current" />
    </svg>
  );
}

/**
 * Barra superior (se mezcla por diferencia con lo que hay debajo y se esconde al bajar)
 * y menú de pantalla completa que se abre como una cortina.
 */
export default function Nav() {
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [active, setActive] = useState("");
  const [copied, setCopied] = useState(false);
  const openRef = useRef(open);
  useEffect(() => {
    openRef.current = open;
  }, [open]);

  // Se esconde al bajar y vuelve al subir.
  useEffect(() => {
    let last = scrollY;
    const onScroll = () => {
      const y = scrollY;
      const v = y - last;
      last = y;
      if (openRef.current) return;
      if (y > 260 && v > 3) setHidden(true);
      else if (v < -3 || y < 260) setHidden(false);
    };
    addEventListener("scroll", onScroll, { passive: true });
    return () => removeEventListener("scroll", onScroll);
  }, []);

  // Sección visible
  useEffect(() => {
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => e.isIntersecting && setActive(e.target.id === "herramientas" ? "servicios" : e.target.id)),
      { rootMargin: "-45% 0px -50% 0px" },
    );
    sections.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, []);

  // Bloquea el scroll con el menú abierto y lo cierra con Escape.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    addEventListener("keydown", onKey);
    return () => removeEventListener("keydown", onKey);
  }, [open]);

  const goTo = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    const was = openRef.current;
    if (was) setOpen(false);
    setTimeout(() => scrollToSection(id), was ? 500 : 0);
  };

  return (
    <>
      <header
        className={cx(
          "fixed inset-x-0 top-0 z-[100] flex items-center justify-between gap-6 pt-[calc(20px+env(safe-area-inset-top,0px))] pr-[max(20px,env(safe-area-inset-right,0px))] pb-5 pl-[max(20px,env(safe-area-inset-left,0px))] text-white mix-blend-difference transition-transform duration-600 ease-expo",
          hidden && "-translate-y-[120%]",
        )}
      >
        <a href="#inicio" onClick={goTo("inicio")} className="font-disp text-[22px] leading-none font-semibold tracking-[-.04em]">
          {site.name}
        </a>

        <nav aria-label="Secciones" className="flex items-center gap-[clamp(14px,1.8vw,28px)] font-disp text-sm font-medium tracking-[-.01em] max-[1180px]:hidden">
          {sections
            .filter((s) => s.top)
            .map((s) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                onClick={goTo(s.id)}
                aria-current={active === s.id ? "true" : undefined}
                className={cx(
                  "trig relative py-1 after:absolute after:inset-x-0 after:bottom-0 after:h-px after:bg-current after:transition-transform after:duration-500 after:ease-expo",
                  active === s.id ? "after:origin-left after:scale-x-100" : "after:origin-right after:scale-x-0 hover:after:origin-left hover:after:scale-x-100",
                )}
              >
                <RollText text={s.label} />
              </a>
            ))}
          <a href={site.cv} download className="rounded-full border border-current px-4 py-2">
            CV ↓
          </a>
        </nav>

        <div className="flex items-center gap-3">
          <button type="button" onClick={toggleTheme} aria-label="Cambiar tema claro u oscuro" className="grid size-[38px] cursor-pointer place-items-center rounded-full border border-current bg-transparent">
            <ThemeIcon />
          </button>
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-controls="menu"
            className="flex h-[38px] cursor-pointer items-center gap-2.5 rounded-full border border-current bg-transparent pr-4 pl-[18px]"
          >
            <span className="mono">{open ? "Cerrar" : "Menú"}</span>
            <svg viewBox="0 0 20 20" aria-hidden="true" className={cx("size-4 fill-none stroke-current stroke-[1.8] transition-transform duration-500 ease-quint", open && "rotate-90")}>
              <path d="M3 7h14M3 13h14" />
            </svg>
          </button>
        </div>
      </header>

      {/* Menú de pantalla completa */}
      <div
        id="menu"
        role="dialog"
        aria-modal="true"
        aria-label="Menú de navegación"
        inert={!open}
        className={cx(
          "fixed inset-0 z-[99] bg-bg [transition:clip-path_.85s_cubic-bezier(.76,0,.24,1),visibility_0s_.85s] before:pointer-events-none before:absolute before:inset-0 before:bg-(image:--leo) before:bg-[length:480px] before:opacity-10 before:mix-blend-(--txb)",
          open ? "visible [clip-path:inset(0)] [transition:clip-path_.85s_cubic-bezier(.76,0,.24,1)]" : "invisible [clip-path:inset(0_0_100%_0)]",
        )}
      >
        <ol className="group/list absolute top-[calc(92px+env(safe-area-inset-top,0px))] left-[max(20px,env(safe-area-inset-left,0px))] flex flex-col max-[760px]:top-[calc(84px+env(safe-area-inset-top,0px))]">
          {sections.map((s, i) => (
            <li key={s.id} className="overflow-hidden">
              <a
                href={`#${s.id}`}
                onClick={goTo(s.id)}
                style={{ "--c": COLORS[i % 3], "--hc": COLORS[i % 3], transitionDelay: open ? `${i * 60 + 250}ms, 0s` : "0s" } as React.CSSProperties}
                className={cx(
                  "trig group/item grid grid-cols-[clamp(34px,5vw,64px)_auto_auto] items-start text-fg [transition:transform_.6s_cubic-bezier(.16,1,.3,1),opacity_.4s] group-hover/list:opacity-[.22] hover:!translate-x-3.5 hover:!opacity-100 hover:![transition-delay:0s]",
                  open ? "translate-y-0" : "translate-y-[105%]",
                )}
              >
                <span className="mono pt-[.9em] text-mut">{pad(i + 1)}</span>
                <span className="font-disp text-[clamp(38px,min(8.4vw,9.2vh),128px)] leading-[.98] font-semibold tracking-[-.05em] uppercase group-hover/item:text-(--c)">
                  <RollText text={s.label} />
                </span>
                <sup className="mt-[.9em] ml-3.5 align-top font-mono text-[11px] font-medium tracking-[.1em] text-soft">{SUP[s.id]}</sup>
              </a>
            </li>
          ))}
        </ol>

        <div
          className={cx(
            "absolute right-[max(20px,env(safe-area-inset-right,0px))] bottom-[calc(86px+env(safe-area-inset-bottom,0px))] grid w-[min(400px,calc(100vw-40px))] grid-cols-2 gap-1.5 transition-[opacity,translate] delay-500 duration-800 ease-expo max-[760px]:hidden",
            open ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0",
          )}
        >
          <div className="col-span-2 grid h-[120px] place-items-center overflow-hidden rounded-md border border-line">
            <GrainText text={site.name} className="text-[84px] text-fg" />
          </div>
          <button
            type="button"
            onClick={async () => {
              if (await copyText(site.email)) {
                setCopied(true);
                setTimeout(() => setCopied(false), 1600);
              }
            }}
            className="mono flex h-[46px] cursor-pointer items-center justify-center rounded-md border border-fg bg-fg text-bg transition-colors hover:border-orange hover:bg-orange hover:text-white"
          >
            {copied ? "¡Copiado!" : "Copiar correo"}
          </button>
          <a
            href={site.github}
            target="_blank"
            rel="noopener noreferrer"
            className="mono flex h-[46px] items-center justify-center rounded-md border border-fg bg-fg text-bg transition-colors hover:border-orange hover:bg-orange hover:text-white"
          >
            GitHub ↗
          </a>
        </div>

        <div className="mono absolute right-[max(20px,env(safe-area-inset-right,0px))] bottom-[calc(22px+env(safe-area-inset-bottom,0px))] left-[max(20px,env(safe-area-inset-left,0px))] flex items-center justify-between border-t border-line pt-4 text-soft">
          <Clock prefix="Pasto · " />
          <button type="button" onClick={toggleTheme} className="flex cursor-pointer items-center gap-2 border-0 bg-transparent">
            ◐ Tema
          </button>
        </div>
      </div>
    </>
  );
}
