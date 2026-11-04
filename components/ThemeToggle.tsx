"use client";

import { useRef } from "react";
import { button } from "./ui";

/** Cambia entre tema claro y oscuro con una transición circular desde el botón. */
export default function ThemeToggle() {
  const ref = useRef<HTMLButtonElement>(null);

  function toggle() {
    const root = document.documentElement;
    const next = root.getAttribute("data-theme") === "light" ? "dark" : "light";
    const apply = () => {
      root.setAttribute("data-theme", next);
      try {
        localStorage.setItem("theme", next);
      } catch {}
    };
    const btn = ref.current;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!btn || reduce) return apply();

    const r = btn.getBoundingClientRect();
    const x = r.left + r.width / 2;
    const y = r.top + r.height / 2;
    const rad = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
    const clip = [`circle(0px at ${x}px ${y}px)`, `circle(${rad}px at ${x}px ${y}px)`];

    if (document.startViewTransition) {
      const vt = document.startViewTransition(apply);
      vt.ready
        .then(() =>
          root.animate(
            { clipPath: clip },
            { duration: 900, easing: "cubic-bezier(.65,0,.35,1)", pseudoElement: "::view-transition-new(root)" },
          ),
        )
        .catch(() => {});
      return;
    }
    const ov = document.createElement("div");
    ov.style.cssText = `position:fixed;inset:0;z-index:90;pointer-events:none;background:${next === "light" ? "#E9E6DA" : "#0E0F0B"}`;
    document.body.appendChild(ov);
    const a = ov.animate({ clipPath: clip }, { duration: 700, easing: "cubic-bezier(.65,0,.35,1)", fill: "forwards" });
    a.onfinish = () => {
      apply();
      ov.animate({ opacity: [1, 0] }, { duration: 350, fill: "forwards" }).onfinish = () => ov.remove();
    };
  }

  return (
    <button ref={ref} className={button({ size: "icon" })} type="button" aria-label="Cambiar tema" onClick={toggle}>
      <svg className="block light:hidden" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true">
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
      </svg>
      <svg className="hidden light:block" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M20 14.5A8.5 8.5 0 0 1 9.5 4 8.5 8.5 0 1 0 20 14.5Z" />
      </svg>
    </button>
  );
}
