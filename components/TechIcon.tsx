import {
  siCapacitor,
  siFastapi,
  siFigma,
  siGit,
  siGooglegemini,
  siIonic,
  siJavascript,
  siKotlin,
  siNextdotjs,
  siNodedotjs,
  siOpenjdk,
  siPostgresql,
  siRender,
  siTailwindcss,
  siTypescript,
  siVercel,
  siWearos,
} from "simple-icons";

/** Logos de tecnologías (Simple Icons, licencia CC0). */
const ICONS = {
  nextjs: siNextdotjs,
  typescript: siTypescript,
  tailwind: siTailwindcss,
  javascript: siJavascript,
  nodejs: siNodedotjs,
  fastapi: siFastapi,
  java: siOpenjdk,
  postgresql: siPostgresql,
  kotlin: siKotlin,
  wearos: siWearos,
  ionic: siIonic,
  capacitor: siCapacitor,
  git: siGit,
  render: siRender,
  vercel: siVercel,
  figma: siFigma,
  gemini: siGooglegemini,
} as const;

export type TechIconName = keyof typeof ICONS | "database" | "ai" | "automation";

/** Color de marca, salvo los casi negros, que usan el color del texto para verse en el tema oscuro. */
export function brandColor(name: TechIconName) {
  if (name === "database" || name === "ai" || name === "automation") return "var(--fg)";
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
  if (name === "automation") {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={className}>
        <path d="M13 2 4.5 13.5H12L11 22l8.5-11.5H12L13 2Z" />
      </svg>
    );
  }
  if (name === "ai") {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" aria-hidden="true" className={className}>
        <path d="M10 3.5c.6 3.9 2.6 5.9 6.5 6.5-3.9.6-5.9 2.6-6.5 6.5-.6-3.9-2.6-5.9-6.5-6.5 3.9-.6 5.9-2.6 6.5-6.5Z" />
        <path d="M18 14.5c.3 1.9 1.1 2.7 3 3-1.9.3-2.7 1.1-3 3-.3-1.9-1.1-2.7-3-3 1.9-.3 2.7-1.1 3-3Z" />
      </svg>
    );
  }
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d={ICONS[name].path} />
    </svg>
  );
}
