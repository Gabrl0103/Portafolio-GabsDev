"use client";

import { useEffect } from "react";

/** Añade .vis a los elementos .rv y .sp cuando entran en pantalla (también a los que aparecen después). */
export default function RevealObserver() {
  useEffect(() => {
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const show = (es: IntersectionObserverEntry[], io: IntersectionObserver) =>
      es.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("vis");
          io.unobserve(e.target);
        }
      });
    const io: IntersectionObserver = new IntersectionObserver((es) => show(es, io), { threshold: 0.1, rootMargin: "0px 0px -4% 0px" });
    const io0: IntersectionObserver = new IntersectionObserver((es) => show(es, io0), { threshold: 0, rootMargin: "0px 0px -12% 0px" });
    const seen = new WeakSet<Element>();
    const scan = () =>
      document.querySelectorAll<HTMLElement>(".rv, .sp").forEach((el) => {
        if (seen.has(el)) return;
        seen.add(el);
        if (reduce) el.classList.add("vis");
        else (el.dataset.a === "clip" ? io0 : io).observe(el);
      });
    scan();
    const mo = new MutationObserver(scan);
    mo.observe(document.body, { childList: true, subtree: true });
    return () => {
      io.disconnect();
      io0.disconnect();
      mo.disconnect();
    };
  }, []);
  return null;
}
