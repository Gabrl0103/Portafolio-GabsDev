"use client";

import { sections, site } from "@/data/site";
import GrainText from "./GrainText";
import { scrollToSection } from "./theme";

/** Pie: "Gabs" gigante con grano y, debajo, una franja a todo el ancho con enlaces rápidos, redes y volver arriba. */
export default function FooterR() {
  const go = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    scrollToSection(id);
  };
  const link = "text-soft transition-colors hover:text-fg";

  return (
    <footer className="relative mt-[clamp(50px,8vw,110px)]">
      <div className="wrap">
        {/* El nombre ocupa todo el ancho y se apoya sobre la franja */}
        <GrainText text={site.name} className="-mb-[.33em] block w-full text-[min(33vw,470px)] leading-none text-fg" />
      </div>

      <div className="relative z-[2] border-t border-line bg-bg">
        <div className="wrap grid grid-cols-[minmax(0,1fr)_auto] items-start gap-x-10 gap-y-6 pt-7 pb-[calc(28px+env(safe-area-inset-bottom,0px))] max-[760px]:grid-cols-1">
          <nav aria-label="Enlaces rápidos" className="grid grid-cols-[repeat(4,max-content)] gap-x-8 gap-y-2.5 font-disp text-[15px] font-medium max-[760px]:grid-cols-2 max-[760px]:gap-x-6">
            {sections.map((s) => (
              <a key={s.id} href={`#${s.id}`} onClick={go(s.id)} className={link}>
                {s.label}
              </a>
            ))}
          </nav>

          <div className="flex flex-col items-end gap-2.5 font-disp text-[15px] font-medium max-[760px]:flex-row max-[760px]:flex-wrap max-[760px]:items-center max-[760px]:gap-x-6">
            <a href={site.github} target="_blank" rel="noopener noreferrer" className={link}>
              GitHub ↗
            </a>
            <a href={`https://wa.me/${site.whatsapp}`} target="_blank" rel="noopener noreferrer" className={link}>
              WhatsApp ↗
            </a>
            <a href={`mailto:${site.email}`} className={link}>
              Correo ↗
            </a>
          </div>

          <div className="col-span-full flex flex-wrap items-center justify-between gap-x-8 gap-y-2 border-t border-line pt-5 text-sm text-mut [&_b]:font-medium [&_b]:text-fg">
            <span>
              <b>{site.name}</b> · © {site.year} · Pasto, Colombia
            </span>
            <span>Hecho con Next.js, TypeScript y Tailwind</span>
            <a href="#inicio" onClick={go("inicio")} className="text-fg transition-colors hover:text-orange">
              Volver arriba ↑
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
