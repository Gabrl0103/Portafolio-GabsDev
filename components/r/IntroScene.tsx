"use client";

import { useEffect, useRef, useState } from "react";
import { site } from "@/data/site";
import Clock from "../Clock";
import { cx } from "../ui";
import { btnF, lab } from "./btn";
import GrainOrb from "./GrainOrb";
import GrainText from "./GrainText";
import { scrollToSection } from "./theme";

/** Palabra que aparece desenfocada y sube cuando se abre el sitio (<html class="go">). */
const word =
  "inline-block translate-y-[.4em] opacity-0 blur-[14px] [transition:opacity_.9s_ease,filter_1s_ease,transform_1.1s_cubic-bezier(.16,1,.3,1)] in-[.go]:translate-y-0 in-[.go]:opacity-100 in-[.go]:blur-none";
const fade = "translate-y-3.5 opacity-0 [transition:opacity_.9s_ease,transform_1.1s_cubic-bezier(.16,1,.3,1)] in-[.go]:translate-y-0 in-[.go]:opacity-100";

/** Tarjetas flotantes con esquina redondeada que llevan a una sección (dx: hacia dónde salen al bajar) */
const TAGS = [
  { id: "acerca", label: "Acerca de mí", n: "01", c: "bg-olive text-pill", pos: "right-[5%] top-[25%] max-[900px]:right-[4%] max-[900px]:top-[19%]", r: "-5deg", w: ".9s", d: "7s", dl: "0s", dx: 1, dy: -0.4 },
  { id: "proyectos", label: "Proyectos", n: "02", c: "bg-orange text-white", pos: "right-[3%] top-[51%] max-[900px]:right-[4%] max-[900px]:top-[57%]", r: "4deg", w: "1.1s", d: "8.5s", dl: "-2s", dx: 1, dy: 0.5 },
  { id: "contacto", label: "Contacto", n: "07", c: "bg-cream text-pill", pos: "right-[26%] top-[15%] max-[900px]:right-auto max-[900px]:left-[4%] max-[900px]:top-[58%]", r: "-2deg", w: "1.3s", d: "6.5s", dl: "-4s", dx: 0.3, dy: -1 },
];

const STATEMENT =
  "Soy Gabs, estudiante de Ingeniería de Software en la Universidad Cooperativa de Colombia, en Pasto. Construyo apps de escritorio, Android, Wear OS y web, y llevo el marketing y las redes de Neveo.";


/* Tramos de la escena (0 → 1 a lo largo del scroll) */
const OPEN = 0.36; // la ventana termina de abrirse a pantalla completa
const DOCK = 0.5; // empieza a encogerse hacia Acerca de mí
const DOCKED = 0.78; // ya está en su lugar junto al texto

const clamp = (v: number) => Math.min(1, Math.max(0, v));
const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/** Lo que se ve en la ventana: solo el orbe de grano, recortado y sin fondo. */
function WindowContent() {
  return <GrainOrb className="absolute inset-0 size-full" />;
}

/**
 * Inicio y Acerca de mí en una sola escena fija (inspirada en paulvl.eu):
 * la ventana con el orbe de grano que está en el titular se abre a pantalla completa
 * al bajar y luego se encoge hasta quedar junto al texto de Acerca de mí.
 */
export default function IntroScene() {
  const [still, setStill] = useState(false);
  const scene = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const hero = useRef<HTMLDivElement>(null);
  const line = useRef<HTMLSpanElement>(null);
  const name = useRef<HTMLSpanElement>(null);
  const slot = useRef<HTMLSpanElement>(null);
  const win = useRef<HTMLDivElement>(null);
  const caps = useRef<HTMLDivElement>(null);
  const about = useRef<HTMLDivElement>(null);
  const dock = useRef<HTMLDivElement>(null);
  const stmt = useRef<HTMLParagraphElement>(null);
  const fades = useRef<(HTMLElement | null)[]>([]);
  const tags = useRef<(HTMLAnchorElement | null)[]>([]);
  const words = STATEMENT.split(/\s+/);

  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const t = setTimeout(() => setStill(true), 0);
      return () => clearTimeout(t);
    }
    const spans = Array.from(stmt.current?.querySelectorAll<HTMLSpanElement>("span") ?? []);
    let raf = 0;
    const frame = () => {
      raf = requestAnimationFrame(frame);
      const sc = scene.current;
      const st = stage.current;
      const w = win.current;
      if (!sc || !st || !w || !slot.current || !dock.current) return;
      const total = sc.offsetHeight - innerHeight;
      const top = sc.getBoundingClientRect().top;
      if (top > innerHeight || top < -sc.offsetHeight) return; // fuera de pantalla
      const p = clamp(-top / total);

      // Lecturas (antes de escribir estilos)
      const S = st.getBoundingClientRect();
      const a = slot.current.getBoundingClientRect();
      const d = dock.current.getBoundingClientRect();

      // 1) Se abre el titular hacia los lados
      const e1 = ease(clamp(p / OPEN));
      const vw = S.width / 100;
      if (line.current) line.current.style.transform = `translate3d(${(-e1 * 26 * vw).toFixed(1)}px,0,0)`;
      if (name.current) name.current.style.transform = `translate3d(${(e1 * 18 * vw).toFixed(1)}px,0,0) scale(${(1 + e1 * 0.22).toFixed(3)})`;
      fades.current.forEach((el) => el && (el.style.opacity = (1 - clamp(e1 * 2.2)).toFixed(3)));
      tags.current.forEach((el, i) => {
        if (!el) return;
        el.style.translate = `${(TAGS[i].dx * e1 * 40 * vw).toFixed(1)}px ${(TAGS[i].dy * e1 * 30 * vw).toFixed(1)}px`;
        el.style.opacity = (1 - clamp(e1 * 1.6)).toFixed(3);
      });
      if (hero.current) hero.current.style.opacity = (1 - clamp((p - OPEN * 0.35) / (OPEN * 0.45))).toFixed(3);

      // 2) La ventana: del hueco del titular a pantalla completa y luego a su lugar en Acerca de mí
      let x: number, y: number, ww: number, hh: number, r: number;
      if (p <= OPEN) {
        x = lerp(a.left - S.left, 0, e1);
        y = lerp(a.top - S.top, 0, e1);
        ww = lerp(a.width, S.width, e1);
        hh = lerp(a.height, S.height, e1);
        r = lerp(10, 0, e1);
      } else {
        const e2 = ease(clamp((p - DOCK) / (DOCKED - DOCK)));
        x = lerp(0, d.left - S.left, e2);
        y = lerp(0, d.top - S.top, e2);
        ww = lerp(S.width, d.width, e2);
        hh = lerp(S.height, d.height, e2);
        r = lerp(0, 22, e2);
      }
      w.style.left = `${x.toFixed(1)}px`;
      w.style.top = `${y.toFixed(1)}px`;
      w.style.width = `${ww.toFixed(1)}px`;
      w.style.height = `${hh.toFixed(1)}px`;
      w.style.borderRadius = `${r.toFixed(1)}px`;

      // Leyendas mientras la ventana ocupa toda la pantalla
      if (caps.current) caps.current.style.opacity = clamp(1 - Math.abs(p - (OPEN + DOCK) / 2) / 0.1).toFixed(3);

      // 3) Acerca de mí aparece y se ilumina palabra por palabra
      const e3 = clamp((p - DOCK - 0.04) / 0.14);
      if (about.current) {
        about.current.style.opacity = e3.toFixed(3);
        about.current.style.transform = `translate3d(0,${((1 - e3) * 40).toFixed(1)}px,0)`;
      }
      const lit = clamp((p - (DOCK + 0.1)) / (0.97 - (DOCK + 0.1)));
      const n = spans.length;
      spans.forEach((s, i) => (s.style.opacity = (0.16 + 0.84 * clamp(lit * (n + 4) - i)).toFixed(2)));
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <section ref={scene} id="inicio" className={cx("relative", still ? "h-auto" : "h-[320svh]")}>
      {/* Destino de los enlaces a "Acerca de mí": el punto donde el texto ya está en su lugar */}
      {!still && <div id="acerca" aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-[180svh] h-[40svh]" />}

      <div ref={stage} className={cx(still ? "relative" : "sticky top-0 h-svh overflow-hidden")}>
        {/* Inicio */}
        <div
          ref={hero}
          className={cx(
            "inset-0 flex flex-col justify-between pt-[calc(96px+env(safe-area-inset-top,0px))] pr-[max(20px,env(safe-area-inset-right,0px))] pb-[34px] pl-[max(20px,env(safe-area-inset-left,0px))]",
            still ? "relative h-svh" : "absolute",
          )}
        >
          <div ref={(el) => void (fades.current[0] = el)}>
            <div className={cx("mono flex justify-between text-mut", fade)}>
              <span>Portafolio · {site.year}</span>
              <Clock prefix="Pasto, CO — " />
            </div>
          </div>

          <h1 className="flex flex-col items-start">
            <span ref={line} className="font-disp text-[clamp(34px,6.4vw,100px)] leading-none font-medium tracking-[-.045em] whitespace-nowrap will-change-transform">
              <span className={word} style={{ transitionDelay: ".1s" }}>
                Hola,
              </span>{" "}
              <span className={word} style={{ transitionDelay: ".2s" }}>
                soy
              </span>
              {/* Hueco de la ventana: de aquí sale la foto al bajar */}
              <span ref={slot} aria-hidden="true" className="ml-[.28em] inline-block h-[.74em] w-[1.9em] rounded-[10px] align-[-.04em]" />
            </span>
            <span ref={name} className="-mt-[.03em] -ml-[.02em] origin-left will-change-transform">
              <span className="block opacity-0 blur-[18px] [transition:opacity_1.2s_ease_.5s,filter_1.4s_ease_.5s] in-[.go]:opacity-100 in-[.go]:blur-none">
                <GrainText text={site.name} className="text-[min(33vw,50vh)] text-fg max-[900px]:text-[min(36vw,40vh)]" />
              </span>
            </span>
          </h1>

          <div ref={(el) => void (fades.current[1] = el)} className="flex flex-wrap items-end justify-between gap-x-10 gap-y-7">
            <p className={cx("max-w-[24ch] font-disp text-[clamp(24px,2.7vw,44px)] leading-[1.1] font-medium tracking-[-.035em] text-fg max-[900px]:text-[25px]", fade)} style={{ transitionDelay: ".7s" }}>
              Estudiante de Ingeniería de Software. Construyo <mark className="bg-transparent text-olive">apps de escritorio, Android, Wear OS y web</mark>.
            </p>
            <a href={site.cv} download className={cx(btnF, "mag", fade)} style={{ transitionDelay: ".9s" }}>
              Descargar CV ↓
            </a>
          </div>

          <div className="pointer-events-none absolute inset-0 z-[3]">
            {TAGS.map((t, i) => (
              <a
                key={t.id}
                ref={(el) => void (tags.current[i] = el)}
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

        {/* La ventana que viaja (solo con animación) */}
        {!still && (
          <div
            ref={win}
            aria-hidden="true"
            className="pointer-events-none absolute z-[4] opacity-0 [transition:opacity_.8s_ease_.6s] in-[.go]:opacity-100"
          >
            <WindowContent />
            <div ref={caps} className="mono absolute inset-x-0 bottom-0 flex justify-between p-[max(20px,env(safe-area-inset-left,0px))] pb-[34px] text-fg opacity-0">
              <span>Ing. de Software · Pasto</span>
              <span className="max-[600px]:hidden">Hecho con código, sin video</span>
              <span>Sigue bajando ↓</span>
            </div>
          </div>
        )}

        {/* Acerca de mí */}
        <div
          ref={about}
          id={still ? "acerca" : undefined}
          className={cx("inset-0 z-[2] flex items-center", still ? "relative py-[clamp(90px,11vw,170px)]" : "absolute pt-[88px] pb-6 opacity-0")}
        >
          <div className="wrap w-full">
            <div className="grid grid-cols-[minmax(0,1.35fr)_minmax(0,.8fr)] items-center gap-[clamp(30px,6vw,110px)] max-[900px]:grid-cols-[1fr_40%] max-[900px]:items-start max-[900px]:gap-x-4 max-[900px]:gap-y-6">
              <div className="max-[900px]:col-span-2 max-[900px]:row-start-2">
                <div className={cx(lab, "max-[900px]:hidden")}>
                  <b>(01)</b> Acerca de mí
                </div>
                <p
                  ref={stmt}
                  aria-label={STATEMENT}
                  className="mt-8 font-disp text-[clamp(26px,3.7vw,58px)] leading-[1.08] font-medium tracking-[-.04em] text-pretty max-[900px]:mt-0 max-[900px]:text-[clamp(22px,6.4vw,30px)]"
                >
                  {words.map((w, i) => (
                    <span key={i} aria-hidden="true" className={cx("transition-opacity duration-150", still ? "opacity-100" : "opacity-[.16]")}>
                      {w}{" "}
                    </span>
                  ))}
                </p>
              </div>
              <div className="max-[900px]:contents">
                <div className={cx(lab, "hidden max-[900px]:flex max-[900px]:self-start")}>
                  <b>(01)</b> Acerca de mí
                </div>
                {/* Lugar donde se acomoda la ventana */}
                <div ref={dock} className="relative aspect-[4/5] w-full max-w-[calc((100svh-170px)*.8)] justify-self-end overflow-hidden rounded-[22px] max-[900px]:max-w-none">
                  {still && <WindowContent />}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
