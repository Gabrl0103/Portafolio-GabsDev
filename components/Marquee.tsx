import { Fragment } from "react";
import { tools } from "@/data/site";

function Row() {
  return (
    <span>
      {tools.map((t, i) => (
        <Fragment key={t}>
          {i % 2 ? <b className="o">{t}</b> : t}
          <i className="d" />
        </Fragment>
      ))}
    </span>
  );
}

/** Cinta de herramientas que se desplaza sin fin. */
export default function Marquee() {
  return (
    <div className="marq" role="marquee" aria-label={`Herramientas: ${tools.join(", ")}`}>
      <span className="marq-l">Herramientas</span>
      <div className="marq-t" aria-hidden="true">
        <Row />
        <Row />
      </div>
    </div>
  );
}
