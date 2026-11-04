import type { ProjectLink } from "@/types";
import { button, cx } from "./ui";

/**
 * Enlace de proyecto que abre en otra pestaña. Si aún no hay dirección (href vacío),
 * se muestra desactivado como "Próximamente" para no llevar a sitios que no son tuyos.
 */
export default function ProjectLinkButton({
  link,
  variant = "glass",
  size = "sm",
  className,
}: {
  link: ProjectLink;
  variant?: "glass" | "primary";
  size?: "sm" | "md";
  className?: string;
}) {
  if (!link.href) {
    return (
      <span
        aria-disabled="true"
        title={`${link.label}: próximamente`}
        className={cx(button({ variant: "glass", size }), "pointer-events-none opacity-55", className)}
      >
        {link.label}
        <span className="rounded-full bg-glass2 px-1.5 py-px text-[10px] font-semibold tracking-wide uppercase">Pronto</span>
      </span>
    );
  }
  return (
    <a className={cx(button({ variant, size }), className)} href={link.href} target="_blank" rel="noopener noreferrer">
      {link.label} ↗
    </a>
  );
}
