"use client";

import { Fragment, useEffect, useRef, useState } from "react";
import { cx } from "../ui";

/**
 * Titular que aparece palabra por palabra, subiendo desde abajo, cuando entra en pantalla
 * (la misma animación que el titular del inicio). Las palabras entre *asteriscos* van en
 * cursiva y en el color de acento: "Lo que he *construido*".
 */
export default function RevealTitle({ text, className }: { text: string; className?: string }) {
  const ref = useRef<HTMLHeadingElement>(null);
  const [on, setOn] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const root = document.documentElement;
    let visible = false;
    const check = () => {
      if (visible && root.classList.contains("ready")) {
        setOn(true);
        cleanup();
      }
    };
    const io = new IntersectionObserver(
      ([e]) => {
        visible = e.isIntersecting;
        check();
      },
      { threshold: 0.4 },
    );
    const mo = new MutationObserver(check);
    const cleanup = () => {
      io.disconnect();
      mo.disconnect();
    };
    io.observe(el);
    mo.observe(root, { attributes: true, attributeFilter: ["class"] });
    return cleanup;
  }, []);

  const words = text.split(" ");
  return (
    <h2 ref={ref} className={className} aria-label={text.replaceAll("*", "")}>
      {words.map((w, i) => (
        <Fragment key={i}>
          <span aria-hidden="true" className="-mb-[.1em] inline-block overflow-hidden pb-[.1em] align-bottom">
            <span
              className={cx(
                "inline-block transition-[translate,opacity] duration-[1s] ease-out-soft",
                on ? "translate-y-0 opacity-100" : "translate-y-[105%] opacity-0",
              )}
              style={{ transitionDelay: on ? `${i * 70}ms` : "0ms" }}
            >
              {/^\*.+\*[.,]?$/.test(w) ? (
                <>
                  <em className="text-metal">{w.replace(/\*/g, "").replace(/[.,]$/, "")}</em>
                  {w.match(/[.,]$/)?.[0]}
                </>
              ) : (
                w
              )}
            </span>
          </span>
          {/* El espacio va fuera del bloque recortado para que no se pierda */}
          {i < words.length - 1 && " "}
        </Fragment>
      ))}
    </h2>
  );
}
