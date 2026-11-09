"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { now, openTo, stats } from "@/data/about";
import { site } from "@/data/site";
import { cx } from "../ui";
import { btnF, lab } from "./btn";

const STATEMENT =
  "Soy Gabs, estudiante de Ingeniería de Software en la Universidad Cooperativa de Colombia, en Pasto. Construyo apps de escritorio, Android, Wear OS y web, y llevo el marketing y las redes de Neveo.";

const FACTS = [
  ["Estudio", "Ing. de Software"],
  ["Base", "Pasto, Colombia"],
];

/** La foto real se usa cuando `site.portrait` deja de ser el marcador .svg */
const hasPhoto = !!site.portrait && !site.portrait.endsWith(".svg");

/** Acerca de mí: el texto se ilumina palabra por palabra al bajar y la foto se revela de abajo hacia arriba. */
export default function AboutR() {
  const stmt = useRef<HTMLParagraphElement>(null);
  const photo = useRef<HTMLDivElement>(null);
  const words = STATEMENT.split(/\s+/);

  useEffect(() => {
    const p = stmt.current;
    const ph = photo.current;
    if (!p || !ph) return;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const spans = Array.from(p.querySelectorAll<HTMLSpanElement>("span"));
    if (reduce) {
      spans.forEach((s) => (s.style.opacity = "1"));
      ph.classList.add("vis");
      return;
    }
    let raf = 0;
    const frame = () => {
      const vh = innerHeight;
      const r = p.getBoundingClientRect();
      if (r.bottom > -50 && r.top < vh) {
        const pr = Math.min(
          1,
          Math.max(0, (vh * 0.88 - r.top) / (vh * 0.88 - vh * 0.42 + r.height)),
        );
        const n = spans.length;
        spans.forEach(
          (w, i) =>
            (w.style.opacity = (
              0.16 +
              0.84 * Math.min(1, Math.max(0, pr * (n + 4) - i))
            ).toFixed(2)),
        );
      }
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          ph.classList.add("vis");
          io.disconnect();
        }
      },
      { threshold: 0.15 },
    );
    io.observe(ph);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
    };
  }, []);

  return (
    <section id="acerca" className="py-[clamp(90px,11vw,170px)]">
      <div className="wrap">
        <div className={cx(lab, "rv")}>
          <b>(01)</b> Acerca de mí
        </div>
        <div className="mt-11 grid grid-cols-[minmax(0,1.35fr)_minmax(0,.8fr)] items-start gap-[clamp(30px,6vw,110px)] max-[900px]:grid-cols-1">
          <div>
            <p
              ref={stmt}
              aria-label={STATEMENT}
              className="font-disp text-[clamp(28px,3.9vw,60px)] leading-[1.08] font-medium tracking-[-.04em] text-pretty"
            >
              {words.map((w, i) => (
                <span
                  key={i}
                  aria-hidden="true"
                  className="opacity-[.16] transition-opacity duration-150"
                >
                  {w}{" "}
                </span>
              ))}
            </p>
            <dl
              data-a="clip"
              className="rv mt-[54px] grid grid-cols-2 border-t border-line"
            >
              {FACTS.map(([k, v]) => (
                <div key={k} className="border-b border-line py-[18px] pr-4">
                  <dt className="mono mb-1.5 text-mut">{k}</dt>
                  <dd className="m-0 font-disp text-[22px] font-medium tracking-[-.02em]">
                    {v}
                  </dd>
                </div>
              ))}
            </dl>
            <p className="rv mt-[34px] max-w-[36em] text-[clamp(17px,1.4vw,20px)] leading-normal text-soft">
              Me gusta llevar una idea desde el diseño hasta el código en producción: entender el problema, diseñarlo y
              dejarlo funcionando para quien lo va a usar.
            </p>

            <div className="rv mt-[44px]">
              <h3 className="mono text-mut">Ahora mismo</h3>
              <dl className="mt-3 border-t border-line">
                {now.map((n) => (
                  <div key={n.label} className="grid grid-cols-[150px_1fr] items-baseline gap-4 border-b border-line py-4 max-[900px]:grid-cols-1 max-[900px]:gap-1">
                    <dt className="font-disp text-[15px] font-medium text-mut">{n.label}</dt>
                    <dd className="m-0 font-disp text-[clamp(18px,1.5vw,21px)] leading-snug font-medium tracking-[-.02em]">{n.value}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className="rv mt-[34px]">
              <h3 className="mono text-mut">Abierto a</h3>
              <ul className="mt-3 flex flex-wrap gap-2">
                {openTo.map((o, i) => (
                  <li
                    key={o}
                    className={cx(
                      "rounded-full px-4 py-2 font-disp text-[15px] font-medium",
                      ["bg-olive text-pill", "bg-cream text-pill", "bg-orange text-white", "bg-fg text-bg"][i % 4],
                    )}
                  >
                    {o}
                  </li>
                ))}
              </ul>
            </div>

            <a href={site.cv} download className={cx(btnF, "mag mt-[40px]")}>
              Descargar CV ↓
            </a>
          </div>

          <figure className="relative mt-2.5">
            {/* Se observa el contenedor; el recorte va en la capa interior para que el observador lo detecte */}
            <div
              ref={photo}
              className="relative aspect-[4/5] max-[900px]:aspect-[5/4]"
            >
              <div className="absolute inset-0 overflow-hidden rounded-[22px] bg-bg2 [clip-path:inset(100%_0_0_0_round_22px)] [transition:clip-path_1.5s_cubic-bezier(.76,0,.24,1)] in-[.vis]:[clip-path:inset(0_0_0_0_round_22px)]">
                {hasPhoto ? (
                  <Image
                    src={site.portrait}
                    alt={`Foto de ${site.name}`}
                    fill
                    sizes="(max-width: 900px) 100vw, 40vw"
                    className="object-cover grayscale transition-[filter] duration-800 hover:grayscale-0"
                  />
                ) : (
                  <div className="absolute inset-0 grid place-content-center gap-2.5 bg-(image:--leo) bg-[length:340px] text-center text-soft bg-blend-(--txb)">
                    <b className="font-disp text-[clamp(30px,3.4vw,50px)] font-medium tracking-[-.04em] text-fg [text-shadow:0_2px_24px_rgba(0,0,0,.7)]">
                      Tu foto aquí
                    </b>
                    <span className="mono">4:5 · retrato</span>
                  </div>
                )}
              </div>
            </div>
            <figcaption className="mono mt-3 flex justify-between text-mut">
              <span>{site.name} · Pasto</span>
              <span>{site.year}</span>
            </figcaption>
            <ul data-a="clip" className="rv mt-[34px] border-t border-line" aria-label="En números">
              {stats.map((st) => (
                <li key={st.label} className="flex items-baseline justify-between gap-4 border-b border-line py-4">
                  <b className="font-disp text-[clamp(44px,4.6vw,72px)] leading-none font-medium tracking-[-.05em]">{st.value}</b>
                  <span className="mono text-right text-mut">{st.label}</span>
                </li>
              ))}
            </ul>
          </figure>
        </div>
      </div>
    </section>
  );
}
