"use client";

import { useEffect, useRef } from "react";
import { site } from "@/data/site";
import Clock from "../Clock";
import { cx } from "../ui";
import { btnF } from "./btn";
import GrainText from "./GrainText";
import { scrollToSection } from "./theme";

/** Palabra que aparece desenfocada y sube cuando se abre el sitio (<html class="go">). */
const word =
  "inline-block translate-y-[.4em] opacity-0 blur-[14px] [transition:opacity_.9s_ease,filter_1s_ease,transform_1.1s_cubic-bezier(.16,1,.3,1)] in-[.go]:translate-y-0 in-[.go]:opacity-100 in-[.go]:blur-none";
const fade = "translate-y-3.5 opacity-0 [transition:opacity_.9s_ease,transform_1.1s_cubic-bezier(.16,1,.3,1)] in-[.go]:translate-y-0 in-[.go]:opacity-100";

/** Tarjetas flotantes con esquina redondeada que llevan a una sección */
const TAGS = [
  { id: "acerca", label: "Acerca de mí", n: "01", c: "bg-olive text-pill", pos: "right-[5%] top-[25%] max-[900px]:right-[4%] max-[900px]:top-[19%]", r: "-5deg", w: ".9s", d: "7s", dl: "0s" },
  { id: "proyectos", label: "Proyectos", n: "02", c: "bg-orange text-white", pos: "right-[3%] top-[51%] max-[900px]:right-[4%] max-[900px]:top-[57%]", r: "4deg", w: "1.1s", d: "8.5s", dl: "-2s" },
  { id: "contacto", label: "Contacto", n: "08", c: "bg-cream text-pill", pos: "right-[26%] top-[15%] max-[900px]:right-auto max-[900px]:left-[4%] max-[900px]:top-[58%]", r: "-2deg", w: "1.3s", d: "6.5s", dl: "-4s" },
];

/** Inicio: se queda fijo mientras la página sube encima como una hoja. */
export default function Hero() {
  const inner = useRef<HTMLDivElement>(null);

  // Al bajar, el contenido se aleja y se desvanece.
  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    const frame = () => {
      const el = inner.current;
      if (el) {
        const p = Math.min(1, Math.max(0, scrollY / innerHeight));
        el.style.transform = `translate3d(0,${(-p * 70).toFixed(1)}px,0) scale(${(1 - p * 0.06).toFixed(4)})`;
        el.style.opacity = (1 - p * 1.15).toFixed(3);
      }
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <section id="inicio" className="sticky top-0 z-0 h-svh min-h-[620px] overflow-hidden">
      <div
        ref={inner}
        className="absolute inset-0 flex flex-col justify-between pt-[calc(96px+env(safe-area-inset-top,0px))] pr-[max(20px,env(safe-area-inset-right,0px))] pb-[34px] pl-[max(20px,env(safe-area-inset-left,0px))] will-change-[transform,opacity]"
      >
        <div className={cx("mono flex justify-between text-mut", fade)}>
          <span>Portafolio · {site.year}</span>
          <Clock prefix="Pasto, CO — " />
        </div>

        <h1 className="flex flex-col items-start">
          <span className="font-disp text-[clamp(34px,6.4vw,100px)] leading-none font-medium tracking-[-.045em]">
            <span className={word} style={{ transitionDelay: ".1s" }}>
              Hola,
            </span>{" "}
            <span className={word} style={{ transitionDelay: ".2s" }}>
              soy
            </span>
          </span>
          <span className="-mt-[.03em] -ml-[.02em] opacity-0 blur-[18px] [transition:opacity_1.2s_ease_.5s,filter_1.4s_ease_.5s] in-[.go]:opacity-100 in-[.go]:blur-none">
            <GrainText text={site.name} className="text-[min(33vw,50vh)] text-fg max-[900px]:text-[min(36vw,40vh)]" />
          </span>
        </h1>

        <div className="flex flex-wrap items-end justify-between gap-x-10 gap-y-7">
          <p className={cx("max-w-[24ch] font-disp text-[clamp(24px,2.7vw,44px)] leading-[1.1] font-medium tracking-[-.035em] text-fg max-[900px]:text-[25px]", fade)} style={{ transitionDelay: ".7s" }}>
            Estudiante de Ingeniería de Software. Construyo <mark className="bg-transparent text-olive">apps de escritorio, Android, Wear OS y web</mark>.
          </p>
          <a href={site.cv} download className={cx(btnF, "mag", fade)} style={{ transitionDelay: ".9s" }}>
            Descargar CV ↓
          </a>
        </div>

        <div className="pointer-events-none absolute inset-0 z-[3]">
          {TAGS.map((t) => (
            <a
              key={t.id}
              href={`#${t.id}`}
              onClick={(e) => {
                e.preventDefault();
                scrollToSection(t.id);
              }}
              style={{ rotate: t.r, "--d": t.d, animationDelay: t.dl, transitionDelay: t.w } as React.CSSProperties}
              className={cx(
                "pointer-events-auto absolute flex aspect-[1.55/1] w-[clamp(150px,15.5vw,236px)] animate-bob items-end justify-between rounded-[0_0_clamp(34px,3.8vw,62px)_0] px-[clamp(14px,1.4vw,22px)] py-[clamp(12px,1.2vw,18px)] font-disp text-[clamp(14px,1.15vw,17px)] font-medium opacity-0 [transform:scale(.6)] [transition:opacity_.7s,transform_1s_cubic-bezier(.3,1.6,.5,1)] in-[.go]:opacity-100 in-[.go]:[transform:none] hover:[transform:translateY(-8px)_rotate(-3deg)] max-[900px]:w-[150px]",
                t.c,
                t.pos,
              )}
            >
              <span>{t.label}</span>
              <span>{t.n}</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
