"use client";

import { useEffect, useRef, useState } from "react";
import { navLinks, site } from "@/data/site";
import ThemeToggle from "./ThemeToggle";
import { DownloadIcon } from "./Icons";
import { button, cx } from "./ui";

export default function Navbar() {
  const [active, setActive] = useState("#inicio");
  const menu = useRef<HTMLDetailsElement>(null);

  // Resalta el enlace de la sección visible.
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(`#${e.target.id}`)),
      { rootMargin: "-40% 0px -55% 0px" },
    );
    document.querySelectorAll("[data-sec]").forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, []);

  const closeMenu = () => menu.current?.removeAttribute("open");

  return (
    // Baja desde arriba cuando termina la intro (<html class="ready">).
    <header className="pointer-events-none fixed inset-x-0 top-0 z-50 -translate-y-[120%] pt-[calc(12px+env(safe-area-inset-top,0px))] pr-[max(16px,env(safe-area-inset-right,0px))] pl-[max(16px,env(safe-area-inset-left,0px))] transition-transform delay-300 duration-900 ease-out-soft in-[.ready]:translate-y-0">
      <div className="glass pointer-events-auto mx-auto flex max-w-[1080px] items-center justify-between gap-3 rounded-full border border-transparent py-2 pr-2 pl-[22px] max-[480px]:pl-4">
        <a className="flex min-h-11 items-center gap-3 text-[22px] font-semibold tracking-[-.02em]" href="#inicio" aria-label={`${site.name}, inicio`}>
          GABS
          <span className="flex gap-1" aria-hidden="true">
            {[0, 1, 2, 3].map((i) => (
              <i key={i} className="block h-3 w-0.5 bg-fg" />
            ))}
          </span>
        </a>

        <nav className="flex items-center gap-0.5 max-[1100px]:hidden" aria-label="Secciones">
          {navLinks.map((l) => (
            <a
              key={l.href}
              href={l.href}
              aria-current={active === l.href ? "true" : undefined}
              className={cx(
                "rounded-full px-[15px] py-2.5 text-sm/[1.5] font-medium tracking-normal transition-[background,color] duration-300 hover:text-fg",
                active === l.href ? "bg-glass2 text-fg" : "text-mut",
              )}
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <a className={button({ variant: "primary", size: "sm" })} href={site.cv} download>
            CV <DownloadIcon />
          </a>
          <details className="group relative hidden max-[1100px]:block" ref={menu}>
            <summary
              className={cx(button({ size: "icon" }), "list-none group-open:bg-none group-open:bg-acc group-open:text-acc-ink [&::-webkit-details-marker]:hidden")}
              aria-label="Abrir menú"
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
                <path d="M3 6h12M3 12h12" />
              </svg>
            </summary>
            <div className="glass absolute top-[52px] right-0 flex min-w-[210px] flex-col rounded-[22px] border border-transparent p-2">
              {navLinks.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  onClick={closeMenu}
                  className="rounded-[14px] px-4 py-3.5 text-sm/[1.5] font-medium tracking-normal text-soft hover:bg-glass2"
                >
                  {l.label}
                </a>
              ))}
            </div>
          </details>
        </div>
      </div>
    </header>
  );
}
