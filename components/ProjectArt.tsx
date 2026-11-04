import type { ProjectArt as Art } from "@/types";
import { cx } from "./ui";

/** Onda que crece desde el centro del círculo. */
const ping = "origin-center animate-ping-soft [transform-box:fill-box]";

/** Ilustraciones de ejemplo hasta tener capturas reales de cada proyecto. */
export default function ProjectArt({ art, className }: { art: Art; className?: string }) {
  switch (art) {
    case "skillmap":
      return (
        <svg className={className} viewBox="0 0 480 300" role="img" aria-label="Ilustración de ejemplo: grafo de habilidades">
          <g className="fill-none stroke-line2 stroke-[1.5]">
            <path d="M240 150 120 80M240 150 120 225M240 150 365 72M240 150 372 218M120 80 58 140M120 225 70 272M365 72 430 122M372 218 440 254M120 80 150 30" />
          </g>
          <circle className={cx(ping, "fill-acc")} cx="240" cy="150" r="30" opacity=".5" />
          <circle className="fill-acc" cx="240" cy="150" r="30" />
          <g className="fill-bg stroke-acc stroke-2">
            <circle cx="120" cy="80" r="17" />
            <circle cx="120" cy="225" r="17" />
            <circle cx="365" cy="72" r="17" />
            <circle cx="372" cy="218" r="17" />
          </g>
          <g className="fill-deep">
            <circle cx="58" cy="140" r="10" />
            <circle cx="70" cy="272" r="10" />
            <circle cx="430" cy="122" r="10" />
            <circle cx="440" cy="254" r="10" />
            <circle cx="150" cy="30" r="10" />
          </g>
        </svg>
      );
    case "firemap":
      return (
        <svg className={className} viewBox="0 0 480 300" role="img" aria-label="Ilustración de ejemplo: mapa con puntos de calor">
          <g className="fill-none stroke-line stroke-1">
            <path d="M0 60H480M0 120H480M0 180H480M0 240H480M80 0V300M160 0V300M240 0V300M320 0V300M400 0V300" />
          </g>
          <g className="fill-none stroke-line2 stroke-[1.5]">
            <ellipse cx="250" cy="150" rx="190" ry="110" transform="rotate(-12 250 150)" />
            <ellipse cx="250" cy="150" rx="140" ry="78" transform="rotate(-12 250 150)" />
            <ellipse cx="250" cy="150" rx="88" ry="44" transform="rotate(-12 250 150)" />
          </g>
          <circle className={cx(ping, "fill-acc")} cx="215" cy="140" r="12" opacity=".6" />
          <circle className={cx(ping, "fill-acc [animation-delay:1.3s]")} cx="215" cy="140" r="12" opacity=".6" />
          <circle className="fill-acc" cx="215" cy="140" r="12" />
          <circle className={cx(ping, "fill-acc")} cx="338" cy="92" r="8" opacity=".5" />
          <circle className="fill-acc" cx="338" cy="92" r="8" />
          <circle className="fill-bg stroke-acc stroke-2" cx="120" cy="208" r="8" />
          <circle className="fill-bg stroke-acc stroke-2" cx="372" cy="214" r="8" />
        </svg>
      );
    case "watch":
      return (
        <svg className={className} viewBox="0 0 480 300" role="img" aria-label="Ilustración de ejemplo: reloj inteligente">
          <g className="animate-float">
            <rect x="206" y="6" width="68" height="70" rx="16" className="fill-deep" />
            <rect x="206" y="224" width="68" height="70" rx="16" className="fill-deep" />
            <rect x="160" y="52" width="160" height="196" rx="48" fill="var(--bg)" stroke="var(--line2)" strokeWidth="2" />
            <circle cx="240" cy="150" r="52" className="fill-none stroke-line2 stroke-[1.5]" />
            <circle className="animate-arc [stroke-dasharray:330] [stroke-dashoffset:330]" cx="240" cy="150" r="52" stroke="var(--acc)" fill="none" strokeWidth="7" strokeLinecap="round" transform="rotate(-90 240 150)" />
            <circle cx="240" cy="150" r="36" className="fill-none stroke-line stroke-1" />
            <text x="240" y="158" textAnchor="middle" fontFamily="var(--cine)" fontSize="22" fill="var(--fg)">
              09:41
            </text>
          </g>
        </svg>
      );
    case "neveo":
      return (
        <svg className={className} viewBox="0 0 480 300" role="img" aria-label="Ilustración de ejemplo: helado de dos bolas">
          <g className="animate-float">
            <polygon points="196,170 284,170 240,276" fill="var(--bg)" stroke="var(--line2)" strokeWidth="2" />
            <path d="M212 190 258 190M222 210 262 210M232 232 250 232" className="fill-none stroke-line stroke-1" />
            <circle cx="240" cy="132" r="54" className="fill-acc" />
            <circle cx="196" cy="150" r="38" className="fill-deep" />
            <circle cx="288" cy="150" r="38" fill="var(--bg)" stroke="var(--acc)" strokeWidth="2" />
            <circle cx="228" cy="116" r="6" fill="var(--acc-ink)" opacity=".5" />
          </g>
          <circle className={cx(ping, "fill-acc")} cx="108" cy="80" r="5" />
          <circle className={cx(ping, "fill-acc [animation-delay:1.3s]")} cx="384" cy="210" r="5" />
          <circle className="fill-acc" cx="108" cy="80" r="3" />
          <circle className="fill-acc" cx="384" cy="210" r="3" />
        </svg>
      );
  }
}
