"use client";

import { useEffect, useState } from "react";
import { useT } from "@/lib/i18n";
import { cx } from "../ui";

type Theme = "light" | "dark";

const current = (): Theme =>
  (document.documentElement.dataset.theme as Theme | undefined) ??
  (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");

/** Botón de modo claro / oscuro. Guarda la elección; sin elección sigue al sistema. */
export default function ThemeToggle({
  className,
  full,
}: {
  className?: string;
  /** Muestra el nombre del modo junto al icono (menú de celular) */
  full?: boolean;
}) {
  const t = useT();
  const [theme, setTheme] = useState<Theme | null>(null);

  useEffect(() => {
    const id = setTimeout(() => setTheme(current()), 0);
    const mq = matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => setTheme(current());
    mq.addEventListener("change", onChange);
    return () => {
      clearTimeout(id);
      mq.removeEventListener("change", onChange);
    };
  }, []);

  const toggle = () => {
    const next: Theme = current() === "dark" ? "light" : "dark";
    const root = document.documentElement;
    root.classList.add("theme-anim");
    root.dataset.theme = next;
    try {
      localStorage.setItem("theme", next);
    } catch {}
    setTheme(next);
    setTimeout(() => root.classList.remove("theme-anim"), 550);
  };

  const dark = theme === "dark";
  const label = dark
    ? t("Cambiar a modo claro", "Switch to light mode")
    : t("Cambiar a modo oscuro", "Switch to dark mode");
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={label}
      title={label}
      className={cx("inline-flex items-center gap-2", className)}
    >
      <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
        <circle
          cx="8"
          cy="8"
          r="6.5"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.4"
        />
        <path
          d="M8 1.5a6.5 6.5 0 0 1 0 13z"
          fill="currentColor"
          className={cx(
            "origin-center transition-transform duration-500",
            dark && "rotate-180",
          )}
        />
      </svg>
      {full &&
        (dark ? t("Modo claro", "Light mode") : t("Modo oscuro", "Dark mode"))}
    </button>
  );
}
