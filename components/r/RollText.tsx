/** Texto cuyas letras ruedan hacia arriba al pasar el cursor por un ancestro con la clase `trig`. */
export default function RollText({ text }: { text: string }) {
  let i = 0;
  return (
    <span aria-label={text}>
      {text.split(" ").map((w, wi, arr) => (
        <span key={wi}>
          <span className="roll" aria-hidden="true">
            {Array.from(w).map((c) => {
              const k = i++;
              return (
                <span key={k} className="l" data-c={c} style={{ "--i": k } as React.CSSProperties}>
                  {c}
                </span>
              );
            })}
          </span>
          {wi < arr.length - 1 && " "}
        </span>
      ))}
    </span>
  );
}
