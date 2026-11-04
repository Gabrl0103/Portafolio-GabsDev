"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { chapters, facts } from "@/data/about";
import { site, tools } from "@/data/site";
import Hid, { Koi } from "./fx/Hid";
import TypeTitle from "./fx/TypeTitle";

/** Sobre mí en capítulos: la sección queda fija y cada tramo de scroll muestra un capítulo. */
export default function About() {
  const sec = useRef<HTMLElement>(null);
  const [idx, setIdx] = useState(0);
  const [frac, setFrac] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const n = chapters.length;

  useEffect(() => {
    const update = () => {
      const el = sec.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const total = Math.max(1, el.offsetHeight - innerHeight);
      const p = Math.min(0.9999, Math.max(0, -r.top / total));
      const i = Math.floor(p * n);
      setIdx(i);
      setFrac(p * n - i);
      setScrolled(p > 0.03);
    };
    update();
    addEventListener("scroll", update, { passive: true });
    addEventListener("resize", update);
    return () => {
      removeEventListener("scroll", update);
      removeEventListener("resize", update);
    };
  }, [n]);

  const goTo = (i: number) => {
    const el = sec.current;
    if (!el) return;
    const top = el.getBoundingClientRect().top + scrollY;
    const total = el.offsetHeight - innerHeight;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    scrollTo({ top: top + ((i + 0.5) / n) * total, behavior: reduce ? "auto" : "smooth" });
  };

  return (
    <section id="sobre-mi" ref={sec} className="chapters" data-sec aria-label="Sobre mí">
      <div className="chap-sticky">
        <div className="sec-h rv">
          <span className="eyebrow">Sobre mí</span>
          <TypeTitle text="Quién está detrás" />
        </div>

        {chapters.map((c, i) => (
          <article key={c.n} className={`chap${i === idx ? " on" : ""}`} aria-hidden={i !== idx}>
            <span className="chap-n" aria-hidden="true">
              {i === 1 && (
                <span className="art-s">
                  <i>2</i>
                  <i>2</i>
                </span>
              )}
              {i + 1}
            </span>
            <div className="chap-t">
              {i === 0 && (
                <Image
                  src={site.photo}
                  alt={`Foto de ${site.name}`}
                  width={88}
                  height={88}
                  unoptimized={site.photo.endsWith(".svg")}
                  className="size-20 rounded-full object-cover md:size-22"
                />
              )}
              <span className="cn">{c.n}</span>
              <h3>{c.title}</h3>
              <p>{c.text}</p>
              {i === 0 && (
                <ul className="chips m-0 list-none p-0">
                  {facts.map((f) => (
                    <li key={f}>
                      <span className="inline-block">{f}</span>
                    </li>
                  ))}
                </ul>
              )}
              {i === n - 1 && (
                <ul className="chips m-0 list-none p-0" aria-label="Tecnologías">
                  {tools.map((t) => (
                    <li key={t}>
                      <span className="inline-block">{t}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </article>
        ))}

        <ol className="chap-dots" aria-label="Capítulos">
          {chapters.map((c, i) => (
            <li key={c.n}>
              <button
                type="button"
                aria-label={c.title}
                aria-current={i === idx ? "step" : undefined}
                onClick={() => goTo(i)}
                style={{ "--k": i < idx ? 1 : i === idx ? frac.toFixed(3) : 0 } as React.CSSProperties}
              />
            </li>
          ))}
        </ol>
        <span className="chap-hint" style={{ opacity: scrolled ? 0 : 1 }}>
          Sigue bajando ↓
        </span>

        <Hid x="46%" y="14%">222</Hid>
        <Hid x="40%" y="82%">
          <Koi w={60} />
        </Hid>
      </div>
    </section>
  );
}
