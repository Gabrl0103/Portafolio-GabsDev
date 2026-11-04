import { Fragment } from "react";
import { tools } from "@/data/site";

function Row() {
  return (
    <span className="flex items-center gap-7 pr-7 text-[clamp(30px,4.4vw,56px)] leading-none font-semibold tracking-[-.035em] whitespace-nowrap opacity-90">
      {tools.map((t, i) => (
        <Fragment key={t}>
          {i % 2 ? <b className="text-transparent [-webkit-text-stroke:1px_var(--fg)]">{t}</b> : t}
          <i className="size-2.5 flex-none rounded-full bg-acc" />
        </Fragment>
      ))}
    </span>
  );
}

/** Cinta de herramientas que se desplaza sin fin; se pausa al pasar el cursor. */
export default function Marquee() {
  return (
    <div className="group relative overflow-hidden border-y border-line pt-[30px] pb-[22px]" role="marquee" aria-label={`Herramientas: ${tools.join(", ")}`}>
      <span className="absolute top-[9px] left-[max(16px,env(safe-area-inset-left,0px))] z-[2] text-xs/[1.5] font-medium tracking-normal text-mut">Herramientas</span>
      <div className="flex w-max animate-marquee group-hover:[animation-play-state:paused] motion-reduce:animate-none" aria-hidden="true">
        <Row />
        <Row />
      </div>
    </div>
  );
}
