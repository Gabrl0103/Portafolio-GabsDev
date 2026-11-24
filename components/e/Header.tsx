"use client";

import { useEffect, useRef, useState } from "react";
import { useContent } from "@/lib/content";
import { otherLangHref, useLang, useT } from "@/lib/i18n";
import { cx } from "../ui";
import { goTo, pad } from "./parts";
import ThemeToggle from "./ThemeToggle";

/**
 * Barra fija arriba: nombre, enlaces numerados a todas las secciones, idioma y CV.
 * Se mezcla por diferencia, así se lee igual sobre el papel y sobre la tinta.
 * En celular los enlaces van en un menú de pantalla completa.
 */
export default function Header() {
  const t = useT();
  const lang = useLang();
  const { site, sections } = useContent();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    addEventListener("keydown", onKey);
    return () => removeEventListener("keydown", onKey);
  }, [open]);

  // Franja detrás de la barra con el color de la sección que pasa por debajo:
  // así el texto que sube nunca se cruza con los enlaces de la barra.
  const bar = useRef<HTMLElement>(null);
  const band = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let raf = 0;
    const paint = () => {
      raf = 0;
      const h = bar.current?.offsetHeight ?? 64;
      if (band.current) band.current.style.height = `${h + 14}px`;
      const el = document
        .elementsFromPoint(innerWidth / 2, h + 2)
        .find((e) => !e.closest("header") && e !== band.current);
      const sec = el?.closest<HTMLElement>("section, footer, [role=dialog]");
      if (!band.current) return;
      // sin fondo propio (p. ej. con "reducir movimiento"), el del cuerpo
      let c = sec ? getComputedStyle(sec).backgroundColor : "";
      if (!c || c === "transparent" || c === "rgba(0, 0, 0, 0)")
        c = getComputedStyle(document.body).backgroundColor;
      band.current.style.backgroundColor = c;
    };
    const on = () => {
      if (!raf) raf = requestAnimationFrame(paint);
    };
    paint();
    addEventListener("scroll", on, { passive: true });
    addEventListener("resize", on);
    const mo = new MutationObserver(on);
    mo.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme", "class"],
    });
    return () => {
      cancelAnimationFrame(raf);
      removeEventListener("scroll", on);
      removeEventListener("resize", on);
      mo.disconnect();
    };
  }, []);

  const link = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    setOpen(false);
    goTo(id);
  };

  return (
    <>
      <div
        ref={band}
        aria-hidden="true"
        className="pointer-events-none fixed inset-x-0 top-0 z-[49] h-[78px] bg-bg transition-[background-color] duration-300 [mask-image:linear-gradient(#000_calc(100%-14px),transparent)]"
      />
      <header
        ref={bar}
        className="fixed inset-x-0 top-0 z-50 flex items-center justify-between px-8 py-5 text-[12px] text-white mix-blend-difference max-[700px]:px-[18px]"
      >
        <a
          href="#inicio"
          onClick={link("inicio")}
          className="text-base font-extrabold tracking-[-.04em]"
        >
          Gabriel®
        </a>
        <nav
          aria-label={t("Secciones", "Sections")}
          className="flex gap-6 max-[1000px]:hidden"
        >
          {sections.map((s, i) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              onClick={link(s.id)}
              className="transition-opacity hover:opacity-60"
            >
              <b className="mr-1.5 font-medium opacity-50">{pad(i + 1)}</b>
              {s.label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <a
            href={otherLangHref(lang)}
            hrefLang={lang === "en" ? "es" : "en"}
            aria-label={t("Ver en inglés", "View in Spanish")}
          >
            {lang === "en" ? "ES" : "EN"}
          </a>
          <a
            href={site.cv}
            download="CV-Gabriel-Guerrero.pdf"
            className="pill px-3.5! py-2! max-[700px]:hidden"
          >
            CV ↓
          </a>
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-expanded={open}
            aria-controls="menu"
            className="pill px-3.5! py-2! min-[1001px]:hidden"
          >
            {t("Menú", "Menu")}
          </button>
        </div>
      </header>

      {/* Menú de celular */}
      <div
        id="menu"
        role="dialog"
        aria-modal="true"
        aria-label={t("Menú", "Menu")}
        inert={!open}
        className={cx(
          "tinta fixed inset-0 z-[60] flex flex-col px-[18px] pt-5 pb-8 transition-[clip-path] duration-700 ease-expo",
          open ? "[clip-path:inset(0)]" : "[clip-path:inset(0_0_100%_0)]",
        )}
      >
        <div className="flex items-center justify-between text-[12px]">
          <span className="text-base font-extrabold tracking-[-.04em]">
            Gabriel®
          </span>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="pill px-3.5! py-2!"
          >
            {t("Cerrar", "Close")} ✕
          </button>
        </div>
        <ol className="mt-12 border-t border-line">
          {sections.map((s, i) => (
            <li key={s.id} className="border-b border-line">
              <a
                href={`#${s.id}`}
                onClick={link(s.id)}
                className="flex items-baseline gap-4 py-4"
              >
                <span className="label text-soft">{pad(i + 1)}</span>
                <span className="display text-[44px]">{s.label}</span>
              </a>
            </li>
          ))}
        </ol>
        <ThemeToggle full className="label mt-6 self-start" />
        <div className="mt-auto flex gap-3">
          <a
            href={site.cv}
            download="CV-Gabriel-Guerrero.pdf"
            className="pill pill-fill"
          >
            {t("Descargar CV ↓", "Download CV ↓")}
          </a>
          <a href={otherLangHref(lang)} className="pill">
            {lang === "en" ? "Español" : "English"}
          </a>
        </div>
      </div>
    </>
  );
}
