"use client";

import { useEffect, useRef, useState } from "react";
import { cx } from "../ui";

/**
 * ¿El texto está a la vista? Cuenta también si otra sección lo tapa (las secciones se
 * apilan al bajar), así el resaltado se repite cada vez que se vuelve a la sección.
 * Se enciende cuando el texto está completo en pantalla y se apaga cuando sale o queda tapado.
 */
function useSeen<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [on, setOn] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const id = setTimeout(() => setOn(true), 0);
      return () => clearTimeout(id);
    }
    const sec = el.closest("section, footer") ?? document.body;
    let raf = 0;
    const check = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      if (!r.width && !r.height) return setOn(false);
      const out = r.bottom < 0 || r.top > innerHeight;
      const x = Math.min(Math.max(r.left + r.width / 2, 1), innerWidth - 1);
      const y = Math.min(Math.max(r.top + r.height / 2, 1), innerHeight - 1);
      const hit = document.elementFromPoint(x, y);
      const covered = !hit || !sec.contains(hit);
      if (out || covered) setOn(false);
      else if (r.top >= 0 && r.bottom <= innerHeight) setOn(true);
    };
    const queue = () => {
      if (!raf) raf = requestAnimationFrame(check);
    };
    queue();
    addEventListener("scroll", queue, { passive: true });
    addEventListener("resize", queue);
    // por si algo cambia sin desplazarse (pestañas, citas que rotan, menú)
    const id = setInterval(queue, 500);
    return () => {
      cancelAnimationFrame(raf);
      clearInterval(id);
      removeEventListener("scroll", queue);
      removeEventListener("resize", queue);
    };
  }, []);
  return [ref, on] as const;
}

/**
 * Resaltado como en los subtítulos: cada vez que el texto entra en pantalla, cada palabra
 * se marca una tras otra con un bloque de color (de izquierda a derecha) y el texto pasa
 * a blanco. Al salir de la sección se borra, para volver a marcarse al regresar.
 * El color sale de --mark (styles/colors.css).
 */
export default function Mark({
  children,
  delay = 0,
  step = 110,
  wordClass,
  wordStyle,
}: {
  children: string;
  /** Espera antes de la primera palabra (ms) */
  delay?: number;
  /** Tiempo entre palabras (ms) */
  step?: number;
  /** Para combinar con otras animaciones por palabra (p. ej. las citas) */
  wordClass?: string;
  wordStyle?: (i: number) => React.CSSProperties;
}) {
  const [ref, on] = useSeen<HTMLSpanElement>();
  const words = children.split(" ");
  const last = words.length - 1;
  return (
    <span ref={ref}>
      {words.map((w, i) => (
        <span
          key={i}
          style={{
            ...wordStyle?.(i),
            transitionDelay: on ? `${delay + i * step}ms` : "0ms",
          }}
          className={cx(
            "mark",
            wordClass,
            i === 0 && "mark-first",
            i === last && "mark-last",
            on && "mark-on",
          )}
        >
          {/* el espacio va dentro (sin corte), así el bloque es continuo entre palabras */}
          {i < last ? `${w} ` : w}
        </span>
      ))}
    </span>
  );
}

/** Texto con una frase resaltada dentro (si la frase no aparece, se muestra tal cual) */
export function WithMark({
  text,
  mark,
  delay,
}: {
  text: string;
  mark?: string;
  delay?: number;
}) {
  const i = mark ? text.indexOf(mark) : -1;
  if (!mark || i < 0) return <>{text}</>;
  return (
    <>
      {text.slice(0, i)}
      <Mark delay={delay}>{mark}</Mark>
      {text.slice(i + mark.length)}
    </>
  );
}
