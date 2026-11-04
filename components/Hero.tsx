import Image from "next/image";
import { site } from "@/data/site";
import Clock from "./Clock";
import Hid, { Koi } from "./fx/Hid";
import { DownloadIcon } from "./Icons";

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

export default function Hero() {
  return (
    <section id="inicio" className="wrap hero" data-sec>
      <div className="hero-l">
        <div className="meta rv">
          <b>Portafolio {site.year}</b>
          <Clock />
          <span>Ingeniería de Software</span>
        </div>

        <div className="rv flex items-center gap-4">
          <Image
            src={site.photo}
            alt={`Foto de ${site.name}`}
            width={64}
            height={64}
            priority
            unoptimized={site.photo.endsWith(".svg")}
            className="size-16 rounded-full object-cover shadow-[0_0_0_3px_var(--bg),0_0_0_4px_var(--acc)]"
          />
          <div className="leading-tight">
            <p className="m-0 text-lg font-semibold text-fg">{site.name}</p>
            <p className="m-0 text-sm text-mut">{site.role}</p>
          </div>
        </div>

        <h1 aria-label={`Soy ${site.name}. Diseño y construyo apps web, móvil y de escritorio.`}>
          {lines.map((l, i) => (
            <span className="ln" aria-hidden="true" key={i}>
              <span style={{ "--d": i } as React.CSSProperties}>{l}</span>
            </span>
          ))}
        </h1>

        <p className="lead rv" style={{ "--d": ".15s" } as React.CSSProperties}>
          Estudiante de quinto semestre de Ingeniería de Software en la {site.university}. También dirijo Neveo, mi
          marca de helados y açaí en Pasto.
        </p>

        <div className="cta rv" style={{ "--d": ".25s" } as React.CSSProperties}>
          <a className="btn primary" href={site.cv} download>
            Descargar CV <DownloadIcon />
          </a>
          <a className="btn" href="#proyectos">
            Ver proyectos
          </a>
        </div>
      </div>

      <div className="hero-r">
        <div className="disc-wrap">
          <div className="disc" role="img" aria-label={`Disco de vinilo girando con la etiqueta ${site.name}, portafolio ${site.year}`}>
            <div className="grooves" />
            <div className="label">
              <span>Portafolio</span>
              <strong>GABS</strong>
              <span>{site.year} · Lado A</span>
            </div>
          </div>
        </div>
        <div className="disc-cap">
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
