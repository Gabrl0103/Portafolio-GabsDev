"use client";

import { useEffect } from "react";
import { useT } from "@/lib/i18n";

export const pad = (n: number) => String(n).padStart(2, "0");

/** Flecha diagonal hacia arriba (enlaces que salen) */
export function ArrowOut({
  size = 44,
  className,
}: {
  size?: number;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      aria-hidden="true"
      className={className}
    >
      <path
        d="M7 33 L33 7 M12 7 H33 V28"
        stroke="currentColor"
        strokeWidth="3.4"
        fill="none"
      />
    </svg>
  );
}

/** Flecha diagonal hacia abajo: cierra cada "página" e invita a seguir */
export function ArrowDown({
  size = 46,
  className,
}: {
  size?: number;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      aria-hidden="true"
      className={className}
    >
      <path
        d="M7 7 L33 33 M33 12 V33 H12"
        stroke="currentColor"
        strokeWidth="4.6"
        fill="none"
        strokeLinecap="square"
      />
    </svg>
  );
}

/** Cabecera de cada sección, como la de una página de revista */
export function PageHead({ n, label }: { n: number; label: string }) {
  const t = useT();
  return (
    <div className="label mb-12 grid grid-cols-[1.2fr_1fr_1fr_1fr_auto] gap-4 border-b border-line pb-3 max-[700px]:grid-cols-[1fr_auto]">
      <span className="max-[700px]:hidden">Gabriel Guerrero®</span>
      <span className="max-[700px]:hidden">
        {t("Portafolio", "Portfolio")} 2026
      </span>
      <span>
        {pad(n)} — {label}
      </span>
      <span className="max-[700px]:hidden">Pasto, CO</span>
      <span className="text-right">P. {pad(n)}</span>
    </div>
  );
}

/** Añade .vis a los elementos .rv cuando entran en pantalla */
export function Reveal() {
  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>(".rv");
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      els.forEach((e) => e.classList.add("vis"));
      return;
    }
    const io = new IntersectionObserver(
      (es) =>
        es.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("vis");
            io.unobserve(e.target);
          }
        }),
      { threshold: 0.12 },
    );
    els.forEach((e) => io.observe(e));
    return () => io.disconnect();
  }, []);
  return null;
}

/** Lleva a una sección con desplazamiento suave */
export function goTo(id: string) {
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (id === "inicio")
    return scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
  document
    .getElementById(id)
    ?.scrollIntoView({ behavior: reduce ? "auto" : "smooth" });
}
