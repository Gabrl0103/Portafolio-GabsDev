import { siDjango, siFigma, siGit, siJavascript, siNextdotjs, siPython, siTailwindcss, siTypescript, siVercel } from "simple-icons";

/** Logos de tecnologías (Simple Icons, licencia CC0). */
const ICONS = {
  nextjs: siNextdotjs,
  typescript: siTypescript,
  tailwind: siTailwindcss,
  javascript: siJavascript,
  python: siPython,
  django: siDjango,
  git: siGit,
  vercel: siVercel,
  figma: siFigma,
} as const;

export type TechIconName = keyof typeof ICONS | "database";

/** Color de marca, salvo los casi negros, que usan el color del texto para verse en el tema oscuro. */
export function brandColor(name: TechIconName) {
  if (name === "database") return "var(--acc)";
  const hex = ICONS[name].hex;
  const n = parseInt(hex, 16);
  const lum = 0.2126 * (n >> 16) + 0.7152 * ((n >> 8) & 255) + 0.0722 * (n & 255);
  return lum < 60 ? "var(--fg)" : `#${hex}`;
}

export default function TechIcon({ name, size = 22, className }: { name: TechIconName; size?: number; className?: string }) {
  if (name === "database") {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true" className={className}>
        <ellipse cx="12" cy="5.5" rx="8" ry="3" />
        <path d="M4 5.5v6c0 1.7 3.6 3 8 3s8-1.3 8-3v-6M4 11.5v6c0 1.7 3.6 3 8 3s8-1.3 8-3v-6" />
      </svg>
    );
  }
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d={ICONS[name].path} />
    </svg>
  );
}
