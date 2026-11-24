"use client";

import { useEffect, useRef, useState } from "react";
import { cx } from "../ui";

/**
 * Resaltado como en los subtítulos: al entrar en pantalla, cada palabra se marca
 * una tras otra con un bloque de color (de izquierda a derecha) y el texto pasa a blanco.
 * El color sale de --mark (styles/colors.css).
 */
export default function Mark({
  children,
  delay = 0,
  step = 110,
}: {
  children: string;
  /** Espera antes de la primera palabra (ms) */
  delay?: number;
  /** Tiempo entre palabras (ms) */
  step?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [on, setOn] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const id = setTimeout(() => setOn(true), 0);
      return () => clearTimeout(id);
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setOn(true);
          io.disconnect();
        }
      },
      { threshold: 0.6 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  const words = children.split(" ");
  const last = words.length - 1;
  return (
    <span ref={ref}>
      {words.map((w, i) => (
        <span
          key={i}
          style={{ transitionDelay: on ? `${delay + i * step}ms` : "0ms" }}
          className={cx(
            "mark",
            i === 0 && "mark-first",
            i === last && "mark-last",
            on && "mark-on",
          )}
        >
          {/* el espacio va dentro, así el bloque es continuo entre palabras */}
          {i < last ? `${w} ` : w}
        </span>
      ))}
    </span>
  );
}
