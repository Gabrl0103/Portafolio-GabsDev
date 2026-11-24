"use client";

import { siGithub, siWhatsapp } from "simple-icons";
import { useContent } from "@/lib/content";
import { useT } from "@/lib/i18n";
import { goTo } from "./parts";

/** Ícono de una red: el trazo de Simple Icons o uno propio */
function Glyph({ path }: { path: string }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d={path} />
    </svg>
  );
}

/** LinkedIn no está en Simple Icons: el "in" dibujado aquí */
const LINKEDIN =
  "M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.34V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13ZM7.12 20.45H3.56V9h3.56v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0Z";
const MAIL =
  "M2 5.5A1.5 1.5 0 0 1 3.5 4h17A1.5 1.5 0 0 1 22 5.5v13a1.5 1.5 0 0 1-1.5 1.5h-17A1.5 1.5 0 0 1 2 18.5v-13Zm2.2.5L12 11.6 19.8 6H4.2ZM20 7.9l-7.4 5.3a1 1 0 0 1-1.2 0L4 7.9V18h16V7.9Z";

/**
 * Pie de página: redes y contactos, enlaces rápidos, el nombre en grande
 * y la línea final con © año, créditos y volver arriba.
 */
export default function Footer() {
  const t = useT();
  const { site, sections } = useContent();
  const links = [
    { label: "GitHub", href: site.github, path: siGithub.path },
    { label: "LinkedIn", href: site.linkedin, path: LINKEDIN },
    {
      label: "WhatsApp",
      href: `https://wa.me/${site.whatsapp}`,
      path: siWhatsapp.path,
    },
    { label: t("Correo", "Email"), href: `mailto:${site.email}`, path: MAIL },
  ].filter((l) => l.href);
  const jump = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    goTo(id);
  };

  return (
    <footer className="mt-14 border-t border-line pt-6 text-[12px]">
      <div className="flex flex-wrap items-center justify-between gap-x-8 gap-y-5">
        <ul
          className="flex gap-2.5"
          aria-label={t("Redes y contacto", "Social and contact")}
        >
          {links.map((l) => (
            <li key={l.label}>
              <a
                href={l.href}
                target={l.href.startsWith("mailto:") ? undefined : "_blank"}
                rel="noopener noreferrer"
                aria-label={l.label}
                title={l.label}
                className="grid size-11 place-items-center rounded-full border border-line transition-colors duration-300 hover:border-fg hover:bg-fg hover:text-bg"
              >
                <Glyph path={l.path} />
              </a>
            </li>
          ))}
        </ul>
        <nav
          aria-label={t("Enlaces rápidos", "Quick links")}
          className="flex flex-wrap gap-x-5 gap-y-2"
        >
          {sections.map((s) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              onClick={jump(s.id)}
              className="hover:underline"
            >
              {s.label}
            </a>
          ))}
        </nav>
      </div>

      {/* El nombre en grande, de lado a lado */}
      <p
        aria-hidden="true"
        className="display mt-10 text-center text-[min(21vw,330px)] leading-[.78] whitespace-nowrap select-none max-[700px]:text-[24vw]"
      >
        Gabriel
        <sup className="relative top-[.32em] ml-[.06em] align-top text-[.16em] font-medium tracking-normal">
          ®
        </sup>
      </p>

      <div className="mt-6 flex flex-wrap items-end justify-between gap-4 border-t border-line pt-4">
        <span className="text-soft">
          ©{new Date().getFullYear()} Gabriel Guerrero ·{" "}
          {t(
            "Hecho con Next.js, TypeScript y Tailwind CSS",
            "Built with Next.js, TypeScript and Tailwind CSS",
          )}
        </span>
        <a href="#inicio" onClick={jump("inicio")} className="hover:underline">
          ↑ {t("Volver arriba", "Back to top")}
        </a>
      </div>
    </footer>
  );
}
