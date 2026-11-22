import { cx } from "../ui";

/* Bordes rasgados: cada pieza de cinta tiene sus propios cortes en los extremos */
const TORN = [
  "polygon(0 8%, 3% 0, 97% 4%, 100% 14%, 98% 32%, 100% 55%, 97% 78%, 100% 100%, 4% 96%, 0 82%, 2% 60%, 0 38%, 3% 20%)",
  "polygon(2% 0, 100% 6%, 98% 24%, 100% 47%, 97% 70%, 99% 92%, 96% 100%, 0 94%, 3% 74%, 0 52%, 2% 30%, 0 12%)",
  "polygon(0 0, 96% 3%, 100% 20%, 97% 41%, 100% 63%, 98% 86%, 100% 100%, 3% 97%, 0 78%, 2% 56%, 0 34%, 3% 14%)",
];

/**
 * Trozo de cinta de papel (como la portada de referencia), puesto encima de tarjetas o imágenes.
 * Se ve en ambos temas. `v` elige el corte de los extremos.
 */
export default function Tape({
  className,
  v = 0,
}: {
  className?: string;
  v?: number;
}) {
  return (
    <span
      aria-hidden="true"
      style={{ clipPath: TORN[v % TORN.length] }}
      className={cx(
        "pointer-events-none absolute z-[3] block h-[28px] w-[118px] bg-[linear-gradient(180deg,rgba(247,236,219,.9),rgba(222,201,175,.88))] shadow-[0_1px_2px_rgba(60,40,20,.22),inset_0_-1px_0_rgba(120,90,60,.18)] before:absolute before:inset-0 before:bg-(image:--noise) before:opacity-[.35] before:mix-blend-multiply",
        className,
      )}
    />
  );
}

/** Tiras largas de papel a los lados de una sección (fondo, muy sutiles). */
export function TapeStrips({ className }: { className?: string }) {
  const strips = [
    "left-[2%] top-[-4%] h-[70%] w-[46px] rotate-[1.2deg]",
    "left-[5.5%] top-[18%] h-[90%] w-[30px] -rotate-[.8deg]",
    "right-[3%] top-[-6%] h-[64%] w-[54px] -rotate-[1.4deg]",
    "right-[7%] top-[30%] h-[80%] w-[26px] rotate-[.6deg]",
  ];
  return (
    <div
      aria-hidden="true"
      className={cx(
        "pointer-events-none absolute inset-0 -z-1 hidden overflow-hidden light:block",
        className,
      )}
    >
      {strips.map((s, i) => (
        <span
          key={i}
          style={{
            clipPath: TORN[i % TORN.length].replace(
              /(\d+)% (\d+)%/g,
              (m, a, b) => `${a}% ${b}%`,
            ),
          }}
          className={cx(
            "absolute bg-[linear-gradient(90deg,rgba(255,246,232,.38),rgba(236,220,198,.30))] shadow-[1px_0_0_rgba(80,60,40,.10),-1px_0_0_rgba(255,255,255,.25)]",
            s,
          )}
        />
      ))}
    </div>
  );
}
