import { cx } from "../ui";

/** Parte una línea en texto normal y palabras entre *asteriscos* (van en serif cursiva). */
function Line({ text }: { text: string }) {
  return (
    <>
      {text.split(/(\*[^*]+\*)/).map((part, i) =>
        part.startsWith("*") ? (
          <em key={i} className="font-serif font-medium tracking-[-.035em] italic">
            {part.slice(1, -1)}
          </em>
        ) : (
          part
        ),
      )}
    </>
  );
}

/**
 * Título grande cuyas líneas suben y se enderezan al aparecer (RevealObserver añade .vis).
 * Una palabra entre *asteriscos* se escribe en la serif cursiva, la segunda voz del sitio.
 */
export default function SplitTitle({ lines, className, style }: { lines: string[]; className?: string; style?: React.CSSProperties }) {
  return (
    <h2 className={cx("big sp", className)} style={style} aria-label={lines.join(" ").replaceAll("*", "")}>
      {lines.map((l, i) => (
        <span key={i} aria-hidden="true" className="-mb-[.12em] block overflow-hidden pb-[.12em]">
          <span className="li" style={{ "--i": i } as React.CSSProperties}>
            <Line text={l} />
          </span>
        </span>
      ))}
    </h2>
  );
}
