"use client";

import { useEffect, useState } from "react";
import { setSound, startCrackle, stopCrackle, tick } from "@/lib/fx/sound";
import { startWater } from "@/lib/fx/water";

const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));

/**
 * Efectos globales del prototipo: agua con koi, barra de progreso, paralaje, aparición al hacer scroll,
 * atmósfera según la hora de Pasto, cursor propio con linterna y sonido opcional.
 */
export default function Effects() {
  const [sound, setSoundOn] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isFine = matchMedia("(hover:hover) and (pointer:fine)").matches;
    const cleanups: (() => void)[] = [];
    const on = <K extends keyof WindowEventMap>(type: K, fn: (e: WindowEventMap[K]) => void, opts?: AddEventListenerOptions) => {
      addEventListener(type, fn, opts);
      cleanups.push(() => removeEventListener(type, fn));
    };

    // Agua con koi
    const water = document.getElementById("water") as HTMLCanvasElement | null;
    if (water && !reduce) cleanups.push(startWater(water));

    // Brillo de los botones que sigue al cursor
    on("pointermove", (e) => {
      const b = (e.target as HTMLElement)?.closest?.<HTMLElement>(".btn");
      if (!b) return;
      const r = b.getBoundingClientRect();
      b.style.setProperty("--mx", `${e.clientX - r.left}px`);
      b.style.setProperty("--my", `${e.clientY - r.top}px`);
    });

    // Paralaje
    let px = 0;
    let py = 0;
    let pTick = false;
    on("pointermove", (e) => {
      px = (e.clientX / innerWidth - 0.5) * 2;
      py = (e.clientY / innerHeight - 0.5) * 2;
      if (pTick) return;
      pTick = true;
      requestAnimationFrame(() => {
        root.style.setProperty("--px", px.toFixed(3));
        root.style.setProperty("--py", py.toFixed(3));
        pTick = false;
      });
    });

    // Barra de progreso y enfoque por sección
    const prog = document.getElementById("prog");
    const focusEls = Array.from(document.querySelectorAll<HTMLElement>(".focus"));
    let sTick = false;
    const onScroll = () => {
      const h = root.scrollHeight - innerHeight;
      if (prog) prog.style.transform = `scaleX(${h > 0 ? Math.min(1, scrollY / h) : 0})`;
      focusEls.forEach((el) => {
        const r = el.getBoundingClientRect();
        const d = Math.abs(r.top + r.height / 2 - innerHeight / 2) / (innerHeight * 0.8);
        el.style.setProperty("--f", clamp(1 - (d - 0.2) / 0.8, 0, 1).toFixed(3));
      });
      sTick = false;
    };
    on(
      "scroll",
      () => {
        if (sTick) return;
        sTick = true;
        requestAnimationFrame(onScroll);
      },
      { passive: true },
    );
    on("resize", onScroll);
    onScroll();

    // Aparición al entrar en pantalla
    const io = new IntersectionObserver(
      (es) =>
        es.forEach((en) => {
          if (!en.isIntersecting) return;
          en.target.classList.remove("pre");
          io.unobserve(en.target);
        }),
      { threshold: 0.12 },
    );
    document.querySelectorAll<HTMLElement>(".rv").forEach((el) => {
      if (el.getBoundingClientRect().top > innerHeight * 0.95) {
        el.classList.add("pre");
        io.observe(el);
      }
    });
    cleanups.push(() => io.disconnect());

    // Atmósfera según la hora de Pasto
    const tod = () => {
      let h: number;
      try {
        h = parseInt(new Date().toLocaleString("en-US", { timeZone: "America/Bogota", hour: "numeric", hour12: false }), 10);
      } catch {
        h = new Date().getHours();
      }
      if (h === 24) h = 0;
      root.setAttribute("data-tod", h >= 5 && h < 8 ? "dawn" : h >= 8 && h < 17 ? "day" : h >= 17 && h < 19 ? "dusk" : "night");
    };
    tod();
    const todId = setInterval(tod, 60000);
    cleanups.push(() => clearInterval(todId));

    // Cursor propio, linterna y detalles ocultos
    if (isFine) {
      root.classList.add("has-cur");
      const dot = document.createElement("div");
      const ring = document.createElement("div");
      const spot = document.createElement("div");
      dot.className = "cur-dot";
      ring.className = "cur-ring";
      spot.className = "spot";
      [dot, ring, spot].forEach((e) => {
        e.setAttribute("aria-hidden", "true");
        document.body.appendChild(e);
      });
      let mx = innerWidth / 2;
      let my = innerHeight / 2;
      let rx = mx;
      let ry = my;
      let sx = mx;
      let sy = my;
      const reveal = () => {
        document.querySelectorAll<HTMLElement>(".hid").forEach((h) => {
          const r = h.getBoundingClientRect();
          if (r.bottom < -200 || r.top > innerHeight + 200) return;
          const d = Math.hypot(r.left + r.width / 2 - mx, r.top + r.height / 2 - my);
          const o = clamp(1 - d / 190, 0, 1);
          h.style.opacity = (o * o).toFixed(3);
          h.style.transform = `scale(${(0.9 + 0.1 * o).toFixed(3)})`;
        });
      };
      on("pointermove", (e) => {
        mx = e.clientX;
        my = e.clientY;
        root.classList.add("cur-on");
        const target = (e.target as HTMLElement)?.closest?.(
          'a,button,summary,input,textarea,[data-pos="0"] [data-tilt]',
        );
        ring.classList.toggle("hov", !!target);
        reveal();
      });
      on("scroll", reveal, { passive: true });
      const leave = () => root.classList.remove("cur-on");
      document.addEventListener("mouseleave", leave);
      on("pointerdown", () => ring.classList.add("dn"));
      on("pointerup", () => ring.classList.remove("dn"));
      let raf = 0;
      const loop = () => {
        rx += (mx - rx) * 0.2;
        ry += (my - ry) * 0.2;
        sx += (mx - sx) * 0.12;
        sy += (my - sy) * 0.12;
        dot.style.transform = `translate3d(${mx}px,${my}px,0)`;
        ring.style.transform = `translate3d(${rx.toFixed(1)}px,${ry.toFixed(1)}px,0)`;
        spot.style.setProperty("--sx", `${sx.toFixed(0)}px`);
        spot.style.setProperty("--sy", `${sy.toFixed(0)}px`);
        raf = requestAnimationFrame(loop);
      };
      raf = requestAnimationFrame(loop);
      cleanups.push(() => {
        cancelAnimationFrame(raf);
        document.removeEventListener("mouseleave", leave);
        root.classList.remove("has-cur", "cur-on");
        [dot, ring, spot].forEach((e) => e.remove());
      });
    }

    // Sonidos de interfaz
    const onDown = (e: PointerEvent) => {
      if ((e.target as HTMLElement)?.closest?.("a,button,.tab")) tick(1500, 0.06, 0.05);
    };
    let lastH = 0;
    const onOver = (e: PointerEvent) => {
      const t = (e.target as HTMLElement)?.closest?.(".btn,.tab,nav a");
      if (t && performance.now() - lastH > 90) {
        lastH = performance.now();
        tick(2400, 0.03, 0.012);
      }
    };
    document.addEventListener("pointerdown", onDown, true);
    document.addEventListener("pointerover", onOver);
    const intro = document.getElementById("intro");
    const mo = new MutationObserver(() => intro && /out|gone/.test(intro.className) && stopCrackle());
    if (intro) mo.observe(intro, { attributes: true, attributeFilter: ["class"] });
    const onReplay = () => setTimeout(startCrackle, 150);
    on("intro:replay" as keyof WindowEventMap, onReplay);
    cleanups.push(() => {
      document.removeEventListener("pointerdown", onDown, true);
      document.removeEventListener("pointerover", onOver);
      mo.disconnect();
      setSound(false);
    });

    return () => cleanups.forEach((c) => c());
  }, []);

  const toggleSound = () => {
    const next = !sound;
    setSoundOn(next);
    setSound(next);
    if (next) {
      tick(880, 0.12, 0.07);
      const intro = document.getElementById("intro");
      if (intro && !/out|gone/.test(intro.className)) startCrackle();
    }
  };

  return (
    <button id="snd" type="button" aria-pressed={sound} onClick={toggleSound}>
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M4 9v6h4l5 4V5L8 9H4z" />
        <path className="w" d="M16.5 8.5a5 5 0 0 1 0 7M19 6a8.5 8.5 0 0 1 0 12" />
      </svg>
      <span>Sonido</span>
    </button>
  );
}
