import type { ProjectArt } from "@/types";

/* Trazos de las ilustraciones; --pa es el color de acento de cada proyecto */
const L = "fill-none stroke-fg [stroke-opacity:.4] stroke-[1.5]";
const A = "fill-(--pa)";
const AS = "fill-none stroke-(--pa) stroke-3 [stroke-linecap:round]";
const B = "fill-bg2 stroke-(--pa) stroke-3";
const D = "fill-(--pa) [fill-opacity:.35]";

/** Ilustraciones de los proyectos con el estilo de la referencia (se ven en gris hasta pasar el cursor). */
export default function RefArt({ art, className }: { art: ProjectArt; className?: string }) {
  const svg = (label: string, children: React.ReactNode) => (
    <svg viewBox="0 0 480 300" preserveAspectRatio="xMidYMid slice" role="img" aria-label={label} className={className}>
      {children}
    </svg>
  );
  switch (art) {
    case "skillmap":
      return svg(
        "Ilustración: grafo de habilidades",
        <>
          <path className={L} d="M240 150 120 80M240 150 120 225M240 150 365 72M240 150 372 218M120 80 58 140M120 225 70 272M365 72 430 122M372 218 440 254M120 80 150 30" />
          <circle className={D} cx="240" cy="150" r="46" />
          <circle className={A} cx="240" cy="150" r="30" />
          <g className={B}>
            <circle cx="120" cy="80" r="17" />
            <circle cx="120" cy="225" r="17" />
            <circle cx="365" cy="72" r="17" />
            <circle cx="372" cy="218" r="17" />
          </g>
          <g className={D}>
            <circle cx="58" cy="140" r="10" />
            <circle cx="70" cy="272" r="10" />
            <circle cx="430" cy="122" r="10" />
            <circle cx="440" cy="254" r="10" />
            <circle cx="150" cy="30" r="10" />
          </g>
        </>,
      );
    case "firemap":
      return svg(
        "Ilustración: mapa de calor",
        <>
          <g className={L}>
            <circle cx="240" cy="150" r="40" />
            <circle cx="240" cy="150" r="78" />
            <circle cx="240" cy="150" r="116" />
            <circle cx="240" cy="150" r="154" strokeDasharray="3 7" />
          </g>
          <circle className={D} cx="240" cy="150" r="40" />
          <circle className={A} cx="240" cy="150" r="9" />
          <g className={B}>
            <circle cx="160" cy="96" r="9" />
            <circle cx="332" cy="118" r="9" />
            <circle cx="298" cy="214" r="9" />
          </g>
          <path className={AS} d="M86 150a154 154 0 0 1 80-135" />
        </>,
      );
    case "watch":
      return svg(
        "Ilustración: pantalla de smartwatch",
        <>
          <rect className={L} x="170" y="40" width="140" height="220" rx="38" />
          <rect className={B} x="188" y="62" width="104" height="176" rx="26" />
          <path className={AS} d="M214 122a30 30 0 1 1 52 0" />
          <circle className={A} cx="240" cy="150" r="9" />
          <rect className={D} x="212" y="184" width="56" height="8" rx="4" />
          <rect className={D} x="222" y="204" width="36" height="8" rx="4" />
        </>,
      );
    case "neveo":
      return svg(
        "Ilustración: helado",
        <>
          <path className={L} d="M210 170 240 262 270 170" />
          <circle className={D} cx="240" cy="140" r="52" />
          <circle className={A} cx="240" cy="112" r="36" />
          <g className={B}>
            <circle cx="170" cy="210" r="12" />
            <circle cx="318" cy="198" r="9" />
            <circle cx="352" cy="120" r="14" />
            <circle cx="130" cy="130" r="8" />
          </g>
        </>,
      );
    case "sencia":
      return svg(
        "Ilustración: formulario con barra de progreso",
        <>
          <rect className={L} x="150" y="40" width="180" height="220" rx="18" />
          <rect className={D} x="172" y="64" width="136" height="8" rx="4" />
          <rect className={A} x="172" y="64" width="84" height="8" rx="4" />
          <g className={B}>
            <rect x="172" y="96" width="136" height="26" rx="8" />
            <rect x="172" y="136" width="136" height="26" rx="8" />
          </g>
          <rect className={L} x="172" y="176" width="136" height="26" rx="8" />
          <rect className={A} x="172" y="218" width="70" height="24" rx="12" />
          <path className={AS} d="M360 96l14 14 28-30" />
          <circle className={D} cx="100" cy="200" r="22" />
        </>,
      );
    case "servicios":
      return svg(
        "Ilustración: tarjetas de servicios",
        <>
          <g className={L}>
            <rect x="70" y="70" width="100" height="150" rx="14" />
            <rect x="310" y="70" width="100" height="150" rx="14" />
          </g>
          <rect className={B} x="190" y="50" width="100" height="170" rx="14" />
          <circle className={A} cx="240" cy="96" r="20" />
          <rect className={D} x="210" y="136" width="60" height="8" rx="4" />
          <rect className={D} x="220" y="154" width="40" height="8" rx="4" />
          <path className={AS} d="M212 190h56" />
          <circle className={D} cx="120" cy="110" r="14" />
          <circle className={D} cx="360" cy="110" r="14" />
        </>,
      );
  }
}
