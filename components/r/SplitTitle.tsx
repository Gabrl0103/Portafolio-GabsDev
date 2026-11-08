import { cx } from "../ui";

/** Título grande cuyas líneas suben y se enderezan al aparecer (RevealObserver añade .vis). */
export default function SplitTitle({ lines, className, style }: { lines: string[]; className?: string; style?: React.CSSProperties }) {
  return (
    <h2 className={cx("big sp", className)} style={style} aria-label={lines.join(" ")}>
      {lines.map((l, i) => (
        <span key={i} aria-hidden="true" className="-mb-[.12em] block overflow-hidden pb-[.12em]">
          <span className="li" style={{ "--i": i } as React.CSSProperties}>
            {l}
          </span>
        </span>
      ))}
    </h2>
  );
}
