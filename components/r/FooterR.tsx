"use client";

import { sections, site } from "@/data/site";
import GrainText from "./GrainText";
import { scrollToSection } from "./theme";

/** Pie: "Gabs" gigante con grano, enlaces rápidos, redes y volver arriba. */
export default function FooterR() {
  const go = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    scrollToSection(id);
  };

  return (
    <footer className="relative mt-[clamp(50px,8vw,110px)]">
      <GrainText text={site.name} className="-mb-[.2em] -ml-[.03em] block text-[min(36vw,520px)] text-fg opacity-[.97] max-[900px]:text-[30vw]" />
      <nav aria-label="Enlaces rápidos" className="relative z-[2] flex flex-wrap gap-x-6 gap-y-2 border-t border-line bg-bg pt-5 font-disp text-sm font-medium">
        {sections.map((s) => (
          <a key={s.id} href={`#${s.id}`} onClick={go(s.id)} className="text-soft transition-colors hover:text-fg">
            {s.label}
          </a>
        ))}
        <a href={site.github} target="_blank" rel="noopener noreferrer" className="text-soft transition-colors hover:text-fg">
          GitHub ↗
        </a>
        <a href={`https://wa.me/${site.whatsapp}`} target="_blank" rel="noopener noreferrer" className="text-soft transition-colors hover:text-fg">
          WhatsApp ↗
        </a>
      </nav>
      <div className="relative z-[2] flex flex-wrap justify-between gap-x-[30px] gap-y-2.5 bg-bg pt-4 pb-[calc(26px+env(safe-area-inset-bottom,0px))] text-sm text-mut [&_b]:font-medium [&_b]:text-fg">
        <span>
          <b>{site.name}</b> · © {site.year} · Pasto, Colombia
        </span>
        <span>Hecho con Next.js, TypeScript y Tailwind</span>
        <a href="#inicio" onClick={go("inicio")} className="transition-colors hover:text-fg">
          Volver arriba ↑
        </a>
      </div>
    </footer>
  );
}
