import { languages, skillGroups } from "@/data/about";
import SectionHead from "./SectionHead";
import TechIcon, { brandColor } from "./TechIcon";

/** Sección adicional: herramientas agrupadas y para qué uso cada una (sin barras ni porcentajes). */
export default function Skills() {
  return (
    <section id="habilidades" data-koi="calm" className="wrap flex flex-col gap-12 py-28 md:gap-16 md:py-36" data-sec>
      <SectionHead eyebrow="Habilidades" title="Con qué trabajo" sub="Las herramientas que uso a diario, incluida la IA, y para qué me sirve cada una." />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {skillGroups.map((g, gi) => (
          <div key={g.title} className="glass rv flex flex-col gap-5 rounded-[30px] p-7" style={{ "--d": `${gi * 0.1}s` } as React.CSSProperties}>
            <h3 className="text-xl font-semibold tracking-tight text-acc">{g.title}</h3>
            <ul className="m-0 flex list-none flex-col gap-1 p-0">
              {g.skills.map((s) => (
                <li
                  key={s.name}
                  style={{ "--brand": brandColor(s.icon) } as React.CSSProperties}
                  className="group -mx-3 flex items-center gap-3.5 rounded-2xl px-3 py-2.5 transition-colors duration-300 hover:bg-glass2"
                >
                  {/* Logo en el color del texto; al pasar el cursor toma su color de marca. */}
                  <span
                    aria-hidden="true"
                    className="flex size-11 flex-none items-center justify-center rounded-xl border border-line2 bg-glass text-fg transition-[transform,border-color,color] duration-500 ease-spring group-hover:-rotate-6 group-hover:border-(--brand) group-hover:text-(--brand)"
                  >
                    <TechIcon name={s.icon} size={22} />
                  </span>
                  <span className="flex min-w-0 flex-col">
                    <span className="text-[15px] font-medium text-fg">{s.name}</span>
                    <span className="text-[13px] leading-snug text-mut">{s.use}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ))}

        <div className="glass rv flex flex-col gap-5 rounded-[30px] p-7 md:col-span-2" style={{ "--d": ".3s" } as React.CSSProperties}>
          <h3 className="text-xl font-semibold tracking-tight text-acc">Idiomas</h3>
          <ul className="m-0 flex list-none flex-col gap-4 p-0">
            {languages.map((l) => (
              <li key={l.name} className="flex items-center justify-between gap-3 border-b border-glass-b pb-4 last:border-0">
                <span className="text-fg">{l.name}</span>
                <span className="rounded-full bg-glass2 px-3 py-1 text-sm text-soft">{l.level}</span>
              </li>
            ))}
          </ul>
          <p className="m-0 mt-auto text-sm leading-relaxed text-mut">
            Además: modo claro y oscuro, sonido opcional desde el menú y algunos detalles escondidos. Prueba a presionar la tecla{" "}
            <span className="font-cine text-acc">2</span> tres veces.
          </p>
        </div>
      </div>
    </section>
  );
}
