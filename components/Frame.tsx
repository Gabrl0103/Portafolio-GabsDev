import { useId } from "react";
import { cx } from "./ui";

/** Marco de selección estilo editor de diseño: borde de oliva metálico que gira despacio y tiradores en las esquinas. */
export function SelectionFrame({
  on = true,
  className,
  handle = "size-2.5",
  thin,
}: {
  on?: boolean;
  className?: string;
  handle?: string;
  /** Borde de 1 px en vez de 1,5 px. */
  thin?: boolean;
}) {
  return (
    <div
      aria-hidden="true"
      className={cx("pointer-events-none absolute z-[3] transition-[opacity,scale] duration-700 ease-out-soft", on ? "scale-100 opacity-100" : "scale-[1.03] opacity-0", className)}
    >
      <span className="metal-ring" style={{ "--ring": thin ? "1px" : "1.5px" } as React.CSSProperties} />
      {["top-0 left-0 -translate-1/2", "top-0 right-0 translate-x-1/2 -translate-y-1/2", "bottom-0 left-0 -translate-x-1/2 translate-y-1/2", "right-0 bottom-0 translate-1/2"].map(
        (pos) => (
          <i key={pos} className={cx("bg-metal absolute rounded-[2px] shadow-[0_0_0_1.5px_var(--bg)]", handle, pos)} />
        ),
      )}
    </div>
  );
}

/** Cursor de "colaboración" con etiqueta, flotando suavemente. */
export function FakeCursor({
  label,
  color,
  x,
  y,
  delay,
  className,
}: {
  label: string;
  /** acc = oliva sólido · metal = oliva metálico */
  color: "acc" | "metal";
  x: number | string;
  y: number | string;
  delay?: boolean;
  className?: string;
}) {
  const id = useId();
  return (
    <div
      aria-hidden="true"
      style={{ left: typeof x === "number" ? `${x}%` : x, top: typeof y === "number" ? `${y}%` : y }}
      className={cx(
        "pointer-events-none absolute z-[4] [transition:left_1.1s_cubic-bezier(.2,.8,.2,1),top_1.1s_cubic-bezier(.2,.8,.2,1)] max-[860px]:hidden",
        delay && "[transition-delay:.12s]",
        className,
      )}
    >
      <div className="animate-float [animation-duration:3.4s]">
        <svg width="14" height="16" viewBox="0 0 14 16" className="text-acc">
          <defs>
            <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="var(--m-hi)" />
              <stop offset=".55" stopColor="var(--m-mid)" />
              <stop offset="1" stopColor="var(--m-dark)" />
            </linearGradient>
          </defs>
          <path d="M1 1l11 6-5 1.3L5 14 1 1Z" fill={color === "metal" ? `url(#${id})` : "currentColor"} stroke="var(--bg)" strokeWidth="1" strokeLinejoin="round" />
        </svg>
        <span
          className={cx(
            "mt-0.5 ml-3 inline-block rounded-md px-2 py-0.5 text-xs/[1.5] font-semibold tracking-normal",
            color === "acc" ? "bg-acc text-acc-ink" : "bg-metal text-acc-ink shadow-[inset_0_1px_0_rgba(255,255,255,.35)]",
          )}
        >
          {label}
        </span>
      </div>
    </div>
  );
}
