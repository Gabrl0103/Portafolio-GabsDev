"use client";

import { useEffect, useRef, useState } from "react";

/** Titular que se escribe como un guion de cine cuando entra en pantalla. */
export default function TypeTitle({ text, className }: { text: string; className?: string }) {
  const ref = useRef<HTMLHeadingElement>(null);
  const [state, setState] = useState<"idle" | "typing" | "done">("idle");
  const [count, setCount] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const t = setTimeout(() => setState("done"), 0);
      return () => clearTimeout(t);
    }
    el.style.minHeight = `${el.offsetHeight}px`;
    const root = document.documentElement;
    let started = false;
    const check = () => {
      if (started || !root.classList.contains("ready")) return;
      const r = el.getBoundingClientRect();
      if (r.top < innerHeight * 0.78 && r.bottom > innerHeight * 0.12) {
        started = true;
        setState("typing");
      }
    };
    const mo = new MutationObserver(check);
    mo.observe(root, { attributes: true, attributeFilter: ["class"] });
    addEventListener("scroll", check, { passive: true });
    const iv = setInterval(check, 700);
    check();
    return () => {
      mo.disconnect();
      removeEventListener("scroll", check);
      clearInterval(iv);
    };
  }, []);

  useEffect(() => {
    if (state !== "typing") return;
    if (count >= text.length) {
      const t = setTimeout(() => setState("done"), 650);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setCount((c) => c + 1), 52);
    return () => clearTimeout(t);
  }, [state, count, text.length]);

  return (
    <h2 ref={ref} className={className} aria-label={text}>
      {state === "done" ? (
        <span className="tw-swap" aria-hidden="true">
          {text}
        </span>
      ) : state === "typing" ? (
        <span className="tw" aria-hidden="true">
          {text.slice(0, count)}
        </span>
      ) : (
        <span className="tw" aria-hidden="true" />
      )}
    </h2>
  );
}
