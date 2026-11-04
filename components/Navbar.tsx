"use client";

import { useEffect, useRef, useState } from "react";
import { navLinks, site } from "@/data/site";
import ThemeToggle from "./ThemeToggle";
import { DownloadIcon } from "./Icons";

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
    <header className="nav">
      <div className="nav-in">
        <a className="logo" href="#inicio" aria-label={`${site.name}, inicio`}>
          GABS
          <span className="stitch" aria-hidden="true">
            <i />
            <i />
            <i />
            <i />
          </span>
        </a>
        <nav className="links" aria-label="Secciones">
          {navLinks.map((l) => (
            <a key={l.href} href={l.href} className={active === l.href ? "on" : undefined} aria-current={active === l.href ? "true" : undefined}>
              {l.label}
            </a>
          ))}
        </nav>
        <div className="nav-r">
          <ThemeToggle />
          <a className="btn primary sm" href={site.cv} download>
            CV <DownloadIcon />
          </a>
          <details className="burger" ref={menu}>
            <summary className="btn icon" aria-label="Abrir menú">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
                <path d="M3 6h12M3 12h12" />
              </svg>
            </summary>
            <div className="menu">
              {navLinks.map((l) => (
                <a key={l.href} href={l.href} onClick={closeMenu}>
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
