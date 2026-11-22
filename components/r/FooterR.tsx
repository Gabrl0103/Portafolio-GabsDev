"use client";

import { useContent } from "@/lib/content";
import { useT } from "@/lib/i18n";
import GrainText from "./GrainText";
import { scrollToSection } from "./theme";

/** Pie: "Gabriel" gigante con grano, centrado, y debajo una franja a todo el ancho con enlaces rápidos, redes y volver arriba. */
export default function FooterR() {
  const t = useT();
  const { site, sections } = useContent();
  const go = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    scrollToSection(id);
  };
  const link = "text-soft transition-colors hover:text-fg";

  return (
    <footer className="relative mt-[clamp(50px,8vw,110px)]">
      <div className="wrap flex justify-center pb-[clamp(18px,2.4vw,40px)]">
        {/* El nombre, centrado y completo, justo encima de la franja */}
        <GrainText text={site.name} center className="text-[min(19.5vw,280px)] leading-none text-fg" />
      </div>

      <div className="relative z-[2] border-t border-line bg-bg">
        <div className="wrap grid grid-cols-[minmax(0,1fr)_auto] items-start gap-x-10 gap-y-6 pt-7 pb-[calc(28px+env(safe-area-inset-bottom,0px))] max-[760px]:grid-cols-1">
          <nav aria-label={t("Enlaces rápidos", "Quick links")} className="grid grid-cols-[repeat(4,max-content)] gap-x-8 gap-y-2.5 font-disp text-[15px] font-medium max-[760px]:grid-cols-2 max-[760px]:gap-x-6">
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
              {t("Correo", "Email")} ↗
            </a>
          </div>

          <div className="col-span-full flex flex-wrap items-center justify-between gap-x-8 gap-y-2 border-t border-line pt-5 text-sm text-mut [&_b]:font-medium [&_b]:text-fg">
            <span>
              <b>{site.name}</b> · © {site.year} · Pasto, Colombia
            </span>
            <span>{t("Hecho con Next.js, TypeScript y Tailwind", "Built with Next.js, TypeScript and Tailwind")}</span>
            <a href="#inicio" onClick={go("inicio")} className="text-fg transition-colors hover:text-orange">
              {t("Volver arriba", "Back to top")} ↑
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
