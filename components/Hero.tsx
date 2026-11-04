import Image from "next/image";
import { site } from "@/data/site";
import Clock from "./Clock";
import Hid, { Koi } from "./fx/Hid";
import { DownloadIcon } from "./Icons";
import { button, cx, wrap } from "./ui";

const lines = [
  <>
    Soy <em>{site.name}.</em>
  </>,
  "Diseño y",
  <>
    construyo <em>apps</em>
  </>,
  "web, móvil y",
  "de escritorio.",
];

const delay = (d: string) => ({ "--d": d }) as React.CSSProperties;

export default function Hero() {
  return (
    <section
      id="inicio"
      data-sec
      className={cx(wrap, "relative flex flex-wrap items-center gap-14 pt-[150px] pb-[100px] max-[860px]:pt-[130px] max-[860px]:pb-[70px]")}
    >
      <div className="flex min-w-0 flex-[1_1_520px] flex-col gap-7">
        <div className="rv flex flex-wrap items-center gap-x-6 gap-y-2 text-[13px] font-medium tracking-normal text-mut">
          {/* Avatar pequeño: la guía pide foto o avatar en el inicio */}
          <span className="flex items-center gap-2.5">
            <Image
              src={site.photo}
              alt={`Foto de ${site.name}`}
              width={28}
              height={28}
              priority
              unoptimized={site.photo.endsWith(".svg")}
              className="size-7 rounded-full object-cover ring-1 ring-acc ring-offset-2 ring-offset-bg"
            />
            <b className="font-medium text-acc">Portafolio {site.year}</b>
          </span>
          <Clock />
          <span>Ingeniería de Software</span>
        </div>

        {/* Cada línea sube desde abajo cuando termina la intro (<html class="ready">). */}
        <h1
          aria-label={`Soy ${site.name}. Diseño y construyo apps web, móvil y de escritorio.`}
          className="m-0 text-[clamp(46px,6.4vw,96px)] leading-[.98] [&_em]:text-acc"
        >
          {lines.map((l, i) => (
            <span className="-mb-[.06em] block overflow-hidden pb-[.06em]" aria-hidden="true" key={i}>
              <span
                style={{ "--d": i } as React.CSSProperties}
                className="block transition-transform delay-[calc(var(--d,0)*.09s_+_.25s)] duration-[1.1s] ease-out-soft in-[.js:not(.ready)]:translate-y-[108%]"
              >
                {l}
              </span>
            </span>
          ))}
        </h1>

        <p className="rv m-0 max-w-[52ch] text-xl leading-normal tracking-[-.011em] text-soft" style={delay(".15s")}>
          Estudiante de quinto semestre de Ingeniería de Software en la {site.university}. También dirijo Neveo, mi
          marca de helados y açaí en Pasto.
        </p>

        <div className="rv flex flex-wrap gap-3.5" style={delay(".25s")}>
          <a className={button({ variant: "primary" })} href={site.cv} download>
            Descargar CV <DownloadIcon />
          </a>
          <a className={button()} href="#proyectos">
            Ver proyectos
          </a>
        </div>
      </div>

      <div className="flex max-w-[500px] min-w-0 flex-[1_1_340px] flex-col gap-[18px]">
        {/* El disco se mueve un poco con el cursor (--px y --py los define Effects.tsx). */}
        <div className="translate-x-[calc(var(--px,0)*14px)] translate-y-[calc(var(--py,0)*14px)] transition-transform duration-600 ease-out-soft">
          <div
            role="img"
            aria-label={`Disco de vinilo girando con la etiqueta ${site.name}, portafolio ${site.year}`}
            className="relative flex aspect-square w-full items-center justify-center rounded-full border border-transparent shadow-[0_50px_90px_-40px_var(--shadow)] after:pointer-events-none after:absolute after:inset-0 after:rounded-full after:bg-[conic-gradient(from_20deg,transparent_0_18%,rgba(255,255,255,.09)_24%,transparent_30%_68%,rgba(255,255,255,.09)_74%,transparent_80%)]"
          >
            <div className="absolute inset-0 animate-spin-slow rounded-full bg-[repeating-radial-gradient(circle_at_center,var(--g1)_0,var(--g1)_2px,var(--g2)_2px,var(--g2)_4px)]" />
            <div className="relative z-[1] flex aspect-square w-[36%] flex-col items-center justify-center gap-1 rounded-full bg-acc text-center text-acc-ink">
              <span className="font-cine text-[clamp(8px,1.1vw,10px)] tracking-[.16em] uppercase">Portafolio</span>
              <strong className="pl-[.1em] text-[clamp(24px,3.4vw,38px)] leading-none font-semibold tracking-[.04em]">GABS</strong>
              <span className="font-cine text-[clamp(8px,1.1vw,10px)] tracking-[.16em] uppercase">{site.year} · Lado A</span>
            </div>
          </div>
        </div>
        <div className="flex justify-between gap-3 text-[13px] font-medium tracking-normal text-mut">
          <span>22 rpm</span>
          <span>Lado A: proyectos</span>
          <span>Pasto, CO</span>
        </div>
      </div>

      <Hid x="50%" y="10%">222</Hid>
      <Hid x="4%" y="88%">2:22</Hid>
      <Hid x="90%" y="92%">
        <Koi w={54} />
      </Hid>
    </section>
  );
}
