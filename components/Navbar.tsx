"use client";

import { useEffect, useRef, useState } from "react";
import { navLinks, site } from "@/data/site";
import ThemeToggle from "./ThemeToggle";
import SoundToggle from "./SoundToggle";
import { DownloadIcon } from "./Icons";
import { button, cx } from "./ui";

/**
 * Navegación en dos partes:
 * - Arriba (fija): tu nombre con la sección actual a la izquierda; tema, CV y menú ☰ a la derecha.
 * - Abajo (fija): una pastilla pequeña con las 4 secciones principales.
 * Todo aparece cuando termina la intro (<html class="ready">).
 */
export default function Navbar() {
  const [active, setActive] = useState("#inicio");
  const menu = useRef<HTMLDetailsElement>(null);

  // Sección visible
  useEffect(() => {
    const io = new IntersectionObserver((entries) => entries.forEach((e) => e.isIntersecting && setActive(`#${e.target.id}`)), {
      rootMargin: "-40% 0px -55% 0px",
    });
    document.querySelectorAll("[data-sec]").forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, []);

  // Cierra el menú al tocar fuera o con Escape.
  useEffect(() => {
    const onDown = (e: PointerEvent) => {
      if (menu.current?.open && !menu.current.contains(e.target as Node)) menu.current.removeAttribute("open");
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && menu.current?.removeAttribute("open");
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  const closeMenu = () => menu.current?.removeAttribute("open");
  const current = navLinks.find((l) => l.href === active);

  return (
    <>
      {/* Degradado sutil para que el texto de arriba se lea sobre el contenido */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-x-0 top-0 z-40 h-24 bg-linear-to-b from-bg/85 to-transparent opacity-0 transition-opacity duration-700 in-[.ready]:opacity-100"
      />

      {/* Arriba: fijo */}
      <header className="pointer-events-none fixed inset-x-0 top-0 z-50 flex items-center justify-between gap-3 pt-[calc(14px+env(safe-area-inset-top,0px))] pr-[max(16px,env(safe-area-inset-right,0px))] pl-[max(20px,env(safe-area-inset-left,0px))] opacity-0 transition-[opacity,translate] delay-300 duration-900 ease-out-soft -translate-y-3 in-[.ready]:translate-y-0 in-[.ready]:opacity-100 md:pr-[max(24px,env(safe-area-inset-right,0px))] md:pl-[max(28px,env(safe-area-inset-left,0px))]">
        <a href="#inicio" aria-label={`${site.name}, inicio`} className="pointer-events-auto flex min-h-11 items-center gap-2 text-[17px] font-semibold tracking-[-.02em] text-fg">
          GABS
          <span className="flex gap-[3px]" aria-hidden="true">
            {[0, 1, 2, 3].map((i) => (
              <i key={i} className="block h-2.5 w-[1.5px] bg-fg" />
            ))}
          </span>
          {/* Sección actual, como una ruta */}
          {current && current.href !== "#inicio" && (
            <span key={current.href} className="flex animate-pv-up items-center gap-2 font-medium text-mut [animation-duration:.6s] max-[380px]:hidden">
              <span aria-hidden="true" className="text-line2">
                /
              </span>
              {current.label}
            </span>
          )}
        </a>

        <div className="pointer-events-auto flex items-center gap-2">
          <ThemeToggle />
          <a className={button({ variant: "primary", size: "sm" })} href={site.cv} download>
            CV <DownloadIcon />
          </a>
          <details className="group relative" ref={menu}>
            <summary
              className={cx(button({ size: "icon" }), "list-none group-open:bg-none group-open:bg-acc group-open:text-acc-ink [&::-webkit-details-marker]:hidden")}
              aria-label="Todas las secciones"
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
                <path d="M3 6h12M3 12h12" />
              </svg>
            </summary>
            <div className="glass absolute top-[52px] right-0 flex min-w-[220px] flex-col rounded-[22px] border border-transparent p-2 [background:color-mix(in_srgb,var(--bg2)_97%,transparent)]">
              <nav aria-label="Todas las secciones" className="flex flex-col">
                {navLinks.map((l) => (
                  <a
                    key={l.href}
                    href={l.href}
                    onClick={closeMenu}
                    aria-current={active === l.href ? "true" : undefined}
                    className={cx(
                      "rounded-[14px] px-4 py-3.5 text-sm/[1.5] font-medium tracking-normal hover:bg-glass2",
                      active === l.href ? "bg-glass2 text-fg" : "text-soft",
                    )}
                  >
                    {l.label}
                  </a>
                ))}
              </nav>
              <div className="mx-2 my-1 h-px bg-glass-b" />
              <SoundToggle />
            </div>
          </details>
        </div>
      </header>

      {/* Abajo: las 4 secciones principales */}
      <nav
        aria-label="Secciones principales"
        className="glass fixed bottom-[calc(16px+env(safe-area-inset-bottom,0px))] left-1/2 z-50 flex -translate-x-1/2 translate-y-6 items-center gap-0.5 rounded-full p-1 opacity-0 transition-[opacity,translate] delay-500 duration-900 ease-out-soft in-[.ready]:translate-y-0 in-[.ready]:opacity-100"
      >
        {navLinks
          .filter((l) => l.main)
          .map((l) => (
            <a
              key={l.href}
              href={l.href}
              aria-current={active === l.href ? "true" : undefined}
              className={cx(
                "rounded-full px-4 py-2 text-sm/[1.5] font-medium tracking-normal whitespace-nowrap transition-[background,color] duration-300 max-[400px]:px-3 max-[400px]:text-[13px]",
                active === l.href ? "bg-acc text-acc-ink" : "text-soft hover:text-fg",
              )}
            >
              {l.label}
            </a>
          ))}
      </nav>
    </>
  );
}
