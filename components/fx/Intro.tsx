"use client";

import { useEffect, useRef } from "react";
import { easeO, makeDisc, timecode } from "@/lib/fx/intro";

/** Intro con barras de cine y disco 3D. Al terminar añade la clase `ready` a <html>. */
const SEEN = "intro-vista";

export default function Intro() {
  const introRef = useRef<HTMLDivElement>(null);
  const glRef = useRef<HTMLDivElement>(null);
  const cntRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const intro = introRef.current!;
    const cnt = cntRef.current!;
    const root = document.documentElement;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    let finished = false;
    let stopGL: (() => void) | null = null;
    let cancelled = false;
    const timers: ReturnType<typeof setTimeout>[] = [];

    const finish = () => {
      if (finished) return;
      finished = true;
      try {
        sessionStorage.setItem(SEEN, "1");
      } catch {}
      cnt.textContent = "02:22";
      intro.classList.add("out");
      intro.classList.remove("barsin");
      timers.push(setTimeout(() => root.classList.add("ready"), 420));
      timers.push(
        setTimeout(() => {
          intro.classList.add("gone");
          stopGL?.();
          stopGL = null;
        }, 1100),
      );
    };

    const run = async () => {
      finished = false;
      intro.classList.remove("out", "gone", "dolly", "gl", "barsin");
      root.classList.remove("ready");
      cnt.textContent = "00:00";
      requestAnimationFrame(() => intro.classList.add("barsin"));
      if (reduce) return finish();
      try {
        const T = await import("three");
        if (cancelled || finished) return;
        stopGL = makeDisc(T, intro, glRef.current!, cnt, finish);
        intro.classList.add("gl");
      } catch {
        // Sin WebGL: solo el contador.
        const t0 = performance.now();
        const tick = (now: number) => {
          if (finished) return;
          const p = Math.min(1, (now - t0) / 1700);
          cnt.textContent = timecode(easeO(p));
          if (p < 1) requestAnimationFrame(tick);
          else timers.push(setTimeout(finish, 250));
        };
        requestAnimationFrame(tick);
      }
    };

    const replay = () => {
      stopGL?.();
      stopGL = null;
      scrollTo({ top: 0, behavior: "auto" });
      intro.style.animation = "none";
      run();
    };

    intro.addEventListener("click", finish);
    addEventListener("intro:replay", replay);

    // La intro se ve solo la primera vez de cada visita; "Ver intro de nuevo" la repite.
    let seen = false;
    try {
      seen = sessionStorage.getItem(SEEN) === "1";
    } catch {}
    if (seen) {
      finished = true;
      intro.classList.add("gone");
      root.classList.add("ready");
    } else run();

    return () => {
      cancelled = true;
      intro.removeEventListener("click", finish);
      removeEventListener("intro:replay", replay);
      timers.forEach(clearTimeout);
      stopGL?.();
    };
  }, []);

  return (
    <div id="intro" ref={introRef} aria-hidden="true">
      <div ref={glRef} className="contents" />
      <div className="in-disc">
        <div className="grooves" />
        <div className="lbl" />
      </div>
      <div className="bar t" />
      <div className="bar b" />
      <div className="in-top">
        <span>Un portafolio de Gabs</span>
        <span>Toca para saltar</span>
      </div>
      <div className="in-count">
        <span id="cnt" ref={cntRef}>
          00:00
        </span>
        <span>Portafolio 2026</span>
      </div>
    </div>
  );
}
