import { experience } from "@/data/experience";
import type { ExperienceKind } from "@/types";
import SectionHead from "./SectionHead";
import { BriefcaseIcon, CapIcon } from "./Icons";

const groups: { kind: ExperienceKind; title: string; Icon: typeof CapIcon }[] = [
  { kind: "academica", title: "Académica", Icon: CapIcon },
  { kind: "laboral", title: "Laboral", Icon: BriefcaseIcon },
];

export default function Experience() {
  return (
    <section id="experiencia" data-koi="calm" className="wrap flex flex-col gap-12 py-28 md:gap-16 md:py-36" data-sec>
      <SectionHead eyebrow="Experiencia" title="Mi *recorrido*" sub="Lo que he estudiado y dónde he trabajado, de lo más reciente a lo más antiguo." />

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-10">
        {groups.map((g) => (
          <div key={g.kind} className="flex flex-col gap-8">
            <h3 className="rv flex items-center gap-3 text-3xl md:text-4xl">
              <span aria-hidden="true" className="flex size-11 flex-none items-center justify-center rounded-full bg-glass2 text-acc">
                <g.Icon size={20} />
              </span>
              Experiencia {g.title.toLowerCase()}
            </h3>
            <ol className="relative m-0 ml-5 flex list-none flex-col gap-6 border-l-2 border-line2 p-0">
              {experience
                .filter((e) => e.kind === g.kind)
                .map((e, i) => (
                  <li key={i} className="rv relative pl-8" style={{ "--d": `${i * 0.1}s` } as React.CSSProperties}>
                    <span aria-hidden="true" className="absolute top-6 -left-[9px] size-4 rounded-full border-[3px] border-bg bg-acc" />
                    <div className="glass flex flex-col gap-2 rounded-[24px] p-6">
                      <span className="font-cine text-sm text-acc">
                        {e.start ? `${e.start} – ${e.end}` : e.end}
                      </span>
                      <h4 className="m-0 font-card text-xl font-semibold tracking-[-.02em] text-fg">{e.title}</h4>
                      <p className="m-0 text-sm text-mut">{e.place}</p>
                      <p className="m-0 mt-1 leading-relaxed text-soft">{e.description}</p>
                    </div>
                  </li>
                ))}
            </ol>
          </div>
        ))}
      </div>
    </section>
  );
}
