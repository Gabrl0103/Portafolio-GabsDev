"use client";

import { useEffect, useRef, useState } from "react";
import { languages, skillGroups } from "@/data/about";
import SectionHead from "./SectionHead";

/** Sección adicional: habilidades con medidores que se llenan al entrar en pantalla. */
export default function Skills() {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { threshold: 0.2 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section id="habilidades" className="wrap flex flex-col gap-12 py-28 md:gap-16 md:py-36" data-sec>
      <SectionHead eyebrow="Habilidades" title="Con qué trabajo" sub="Las herramientas que uso a diario y qué tan cómodo me siento con cada una." />

      <div ref={ref} className={`grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4 ${inView ? "in-view" : ""}`}>
        {skillGroups.map((g, gi) => (
          <div key={g.title} className="glass rv flex flex-col gap-6 rounded-[30px] p-7" style={{ "--d": `${gi * 0.1}s` } as React.CSSProperties}>
            <h3 className="text-xl font-semibold tracking-tight text-acc">{g.title}</h3>
            <ul className="m-0 flex list-none flex-col gap-5 p-0">
              {g.skills.map((s, si) => (
                <li key={s.name} className="flex flex-col gap-2">
                  <div className="flex justify-between text-[15px]">
                    <span className="text-fg">{s.name}</span>
                    <span className="font-cine text-mut">{s.level}%</span>
                  </div>
                  <div
                    className="h-1.5 overflow-hidden rounded-full bg-glass2"
                    role="meter"
                    aria-label={s.name}
                    aria-valuenow={s.level}
                    aria-valuemin={0}
                    aria-valuemax={100}
                  >
                    <div
                      className="meter h-full rounded-full bg-acc"
                      style={{ "--v": s.level / 100, transitionDelay: `${gi * 0.12 + si * 0.08}s` } as React.CSSProperties}
                    />
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ))}

        <div className="glass rv flex flex-col gap-6 rounded-[30px] p-7" style={{ "--d": ".3s" } as React.CSSProperties}>
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
            Además: modo claro y oscuro, sonido opcional y algunos detalles escondidos. Prueba a tocar el <span className="font-cine text-acc">2</span> tres veces.
          </p>
        </div>
      </div>
    </section>
  );
}
