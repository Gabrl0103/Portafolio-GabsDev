"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { intro, profile, stats } from "@/data/about";
import { experience } from "@/data/experience";
import { site } from "@/data/site";
import Hid, { Koi } from "./fx/Hid";
import TypeTitle from "./fx/TypeTitle";
import { BriefcaseIcon, CapIcon } from "./Icons";
import { cx } from "./ui";

const CARDS = ["Perfil", "Sobre mí", "En números", "Experiencia"] as const;
const N = CARDS.length;

/** Posiciones de los dos cursores (en % del escenario) para cada tarjeta activa. */
const CURSORS = [
  { a: [30, 74], b: [64, 34] },
  { a: [66, 80], b: [36, 22] },
  { a: [34, 30], b: [66, 72] },
  { a: [68, 26], b: [32, 78] },
];

const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));

/**
 * Sobre mí: cuatro tarjetas en fila que avanzan con el scroll. La del centro queda seleccionada
 * (marco con tiradores) y las de los lados se inclinan en perspectiva.
 */
export default function About() {
  const sec = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const cards = useRef<(HTMLDivElement | null)[]>([]);
  const [active, setActive] = useState(0);
  const [seen, setSeen] = useState<boolean[]>(() => CARDS.map(() => false));
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    let cur = 0;
    let target = 0;
    let raf = 0;
    let last = -1;

    const read = () => {
      const el = sec.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const total = Math.max(1, el.offsetHeight - innerHeight);
      const p = clamp(-r.top / total, 0, 1);
      target = p * (N - 1);
      setProgress(p);
    };

    const paint = () => {
      const st = stage.current;
      const tr = track.current;
      const first = cards.current[0];
      if (!st || !tr || !first) return;
      const cw = first.offsetWidth;
      const gap = parseFloat(getComputedStyle(tr).columnGap) || 0;
      tr.style.transform = `translate3d(${st.clientWidth / 2 - cw / 2 - cur * (cw + gap)}px,0,0)`;
      cards.current.forEach((c, i) => {
        if (!c) return;
        const d = i - cur;
        const ad = Math.min(Math.abs(d), 1.4);
        c.style.transform = `perspective(1400px) rotateY(${clamp(-d * 16, -24, 24)}deg) scale(${1 - ad * 0.07})`;
        c.style.opacity = String(1 - ad * 0.38);
      });
      const idx = Math.round(cur);
      if (idx !== last) {
        last = idx;
        setActive(idx);
        setSeen((s) => (s[idx] ? s : s.map((v, k) => v || k === idx)));
      }
    };

    // Suaviza el movimiento: la posición actual persigue a la del scroll.
    const loop = () => {
      cur = reduce ? target : cur + (target - cur) * 0.12;
      if (Math.abs(target - cur) < 0.0005) cur = target;
      paint();
      raf = requestAnimationFrame(loop);
    };

    const io = new IntersectionObserver(([e]) => {
      cancelAnimationFrame(raf);
      if (e.isIntersecting) raf = requestAnimationFrame(loop);
    });
    if (sec.current) io.observe(sec.current);
    read();
    paint();
    addEventListener("scroll", read, { passive: true });
    addEventListener("resize", read);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
      removeEventListener("scroll", read);
      removeEventListener("resize", read);
    };
  }, []);

  const goTo = (i: number) => {
    const el = sec.current;
    if (!el) return;
    const top = el.getBoundingClientRect().top + scrollY;
    const total = el.offsetHeight - innerHeight;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    scrollTo({ top: top + (i / (N - 1)) * total, behavior: reduce ? "auto" : "smooth" });
  };

  const cursor = CURSORS[active];

  return (
    <section id="sobre-mi" ref={sec} className="relative h-[400vh]" data-sec aria-label="Sobre mí">
      <div className="sticky top-0 h-svh overflow-hidden">
        <div className="rv pointer-events-none absolute inset-x-0 top-24 z-[5] flex flex-col items-center gap-1.5 text-center">
          <span className="text-base font-semibold tracking-[-.01em] text-acc">Sobre mí</span>
          <TypeTitle text="Quién está detrás" className="text-[clamp(22px,2.4vw,32px)] font-medium text-mut" />
        </div>

        {/* Escenario entre el título y los indicadores */}
        <div ref={stage} className="absolute inset-x-0 top-[168px] bottom-[84px]">
          <div
            ref={track}
            className="absolute top-0 left-0 flex h-full items-center gap-[clamp(24px,4vw,64px)] will-change-transform [--cw:min(80vw,340px)] md:[--cw:clamp(300px,30vw,430px)]"
          >
            {CARDS.map((label, i) => {
              const on = i === active;
              return (
                <div
                  key={label}
                  ref={(el) => {
                    cards.current[i] = el;
                  }}
                  className="flex h-[min(480px,100%)] w-(--cw) flex-none flex-col gap-2 will-change-transform"
                >
                  <span className={cx("pl-1 text-sm/[1.5] font-medium tracking-normal transition-colors duration-500", on ? "text-acc" : "text-mut")}>{label}</span>
                  <article aria-label={label} className="relative min-h-0 flex-1">
                    {/* Marco de selección estilo editor de diseño */}
                    <div
                      aria-hidden="true"
                      className={cx(
                        "pointer-events-none absolute -inset-[7px] z-[3] rounded-[30px] border-[1.5px] border-acc transition-[opacity,scale] duration-700 ease-out-soft",
                        on ? "scale-100 opacity-100" : "scale-[1.03] opacity-0",
                      )}
                    >
                      {["-top-[5px] -left-[5px]", "-top-[5px] -right-[5px]", "-bottom-[5px] -left-[5px]", "-right-[5px] -bottom-[5px]"].map((pos) => (
                        <i key={pos} className={cx("absolute size-2.5 border-[1.5px] border-acc bg-bg", pos)} />
                      ))}
                    </div>
                    <div className="glass relative h-full overflow-hidden rounded-[24px]">
                      {i === 0 && <ProfileCard on={on} />}
                      {i === 1 && <IntroCard on={on} />}
                      {i === 2 && <StatsCard play={seen[2]} />}
                      {i === 3 && <ExperienceCard on={on} />}
                    </div>
                  </article>
                </div>
              );
            })}
          </div>

          {/* Cursores de "colaboración": se mueven a otra posición cuando cambia la tarjeta */}
          <FakeCursor label="Cliente" color="acc2" x={cursor.a[0]} y={cursor.a[1]} />
          <FakeCursor label={site.name} color="acc" x={cursor.b[0]} y={cursor.b[1]} delay />
        </div>

        <ol className="absolute bottom-[34px] left-[max(24px,6vw)] z-[6] m-0 flex list-none gap-2.5 p-0" aria-label="Tarjetas de Sobre mí">
          {CARDS.map((label, i) => {
            const k = clamp(progress * (N - 1) - i + 1, 0, 1);
            return (
              <li key={label} className="py-3.5">
                <button
                  type="button"
                  aria-label={label}
                  aria-current={i === active ? "step" : undefined}
                  onClick={() => goTo(i)}
                  style={{ "--k": i === 0 ? 1 : k } as React.CSSProperties}
                  className="relative block h-1 w-[38px] cursor-pointer overflow-hidden rounded-xs border-0 bg-line2 p-0 after:absolute after:inset-0 after:origin-left after:scale-x-(--k) after:bg-acc"
                />
              </li>
            );
          })}
        </ol>
        <span
          className="absolute right-[max(24px,6vw)] bottom-[44px] z-[6] text-sm/[1.5] text-mut transition-opacity duration-500 max-[860px]:hidden"
          style={{ opacity: progress > 0.03 ? 0 : 1 }}
        >
          Sigue bajando ↓
        </span>

        <Hid x="46%" y="14%">222</Hid>
        <Hid x="40%" y="86%">
          <Koi w={60} />
        </Hid>
      </div>
    </section>
  );
}

/* ---------- Piezas ---------- */

function FakeCursor({ label, color, x, y, delay }: { label: string; color: "acc" | "acc2"; x: number; y: number; delay?: boolean }) {
  return (
    <div
      aria-hidden="true"
      style={{ left: `${x}%`, top: `${y}%` }}
      className={cx(
        "pointer-events-none absolute z-[4] [transition:left_1.1s_cubic-bezier(.2,.8,.2,1),top_1.1s_cubic-bezier(.2,.8,.2,1)] max-[860px]:hidden",
        delay && "[transition-delay:.12s]",
      )}
    >
      <div className="animate-float [animation-duration:3.4s]">
        <svg width="14" height="16" viewBox="0 0 14 16" className={color === "acc" ? "text-acc" : "text-acc2"}>
          <path d="M1 1l11 6-5 1.3L5 14 1 1Z" fill="currentColor" stroke="var(--bg)" strokeWidth="1" strokeLinejoin="round" />
        </svg>
        <span
          className={cx(
            "mt-0.5 ml-3 inline-block rounded-md px-2 py-0.5 text-xs/[1.5] font-semibold tracking-normal",
            color === "acc" ? "bg-acc text-acc-ink" : "bg-acc2 text-bg",
          )}
        >
          {label}
        </span>
      </div>
    </div>
  );
}

/** Aparición escalonada para el contenido de la tarjeta activa. */
const stagger = (on: boolean, i: number) => ({
  className: cx("transition-[opacity,translate] duration-700 ease-out-soft", on ? "translate-y-0 opacity-100" : "translate-y-2 opacity-60"),
  style: { transitionDelay: on ? `${120 + i * 70}ms` : "0ms" },
});

function ProfileCard({ on }: { on: boolean }) {
  return (
    <div className="flex h-full flex-col gap-3 p-3">
      <div className="relative min-h-0 flex-1 overflow-hidden rounded-[16px] bg-bg2">
        <Image
          src={site.portrait}
          alt={`Foto de ${site.name}`}
          fill
          sizes="(max-width: 768px) 80vw, 430px"
          unoptimized={site.portrait.endsWith(".svg")}
          className={cx("object-cover grayscale transition-transform duration-[1.4s] ease-out-soft", on ? "scale-100" : "scale-105")}
        />
        {/* Selección sobre el rostro */}
        <div
          aria-hidden="true"
          className={cx(
            "absolute top-[18%] left-1/2 h-[46%] w-[46%] -translate-x-1/2 border border-acc transition-opacity delay-300 duration-700",
            on ? "opacity-100" : "opacity-0",
          )}
        >
          {["-top-1 -left-1", "-top-1 -right-1", "-bottom-1 -left-1", "-right-1 -bottom-1"].map((pos) => (
            <i key={pos} className={cx("absolute size-2 border border-acc bg-bg", pos)} />
          ))}
        </div>
      </div>
      <div className="flex items-end justify-between gap-3 px-2 pb-1">
        <p className="m-0 text-[clamp(20px,2vw,28px)] leading-none font-semibold tracking-[-.03em] text-fg">{profile.greeting}</p>
        <p className="m-0 text-right text-[11px] leading-snug text-mut">
          {profile.role}
          <br />
          {profile.place}
        </p>
      </div>
    </div>
  );
}

function IntroCard({ on }: { on: boolean }) {
  const chips = (title: string, items: string[], from: number) => (
    <div className="flex flex-col gap-1.5">
      <span className="text-[11px] text-mut">{title}</span>
      <ul className="m-0 flex list-none flex-wrap gap-1.5 p-0">
        {items.map((t, k) => {
          const s = stagger(on, from + k);
          return (
            <li key={t} className={s.className} style={s.style}>
              <span className="block rounded-md bg-glass2 px-2 py-1 text-xs/[1.4] font-medium tracking-normal text-soft">{t}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
  return (
    <div className="flex h-full flex-col justify-between gap-4 p-[clamp(20px,2.2vw,28px)]">
      <div className="flex flex-col gap-3">
        <p className="m-0 text-[clamp(19px,1.8vw,26px)] leading-[1.15] font-semibold tracking-[-.03em] text-fg">{intro.headline}</p>
        <p className="m-0 text-[13px] leading-relaxed text-mut [@media(max-height:720px)]:hidden">{intro.text}</p>
      </div>
      <div className="flex flex-col gap-3">
        {chips("Trabajo con", intro.worksWith, 0)}
        {chips("Abierto a", intro.openTo, intro.worksWith.length)}
      </div>
    </div>
  );
}

function StatsCard({ play }: { play: boolean }) {
  return (
    <ul className="m-0 flex h-full list-none flex-col p-0 px-[clamp(20px,2.2vw,28px)]">
      {stats.map((s, i) => (
        <li key={s.label} className={cx("flex flex-1 items-end justify-between gap-3 pb-4", i < stats.length - 1 && "border-b border-line")}>
          <span className="text-[clamp(44px,min(5vw,8vh),76px)] leading-none font-semibold tracking-[-.04em] text-fg tabular-nums">
            {s.prefix}
            <CountUp to={s.value} play={play} delay={i * 120} />
            {s.suffix}
          </span>
          <span className="pb-1.5 text-right text-xs text-mut">{s.label}</span>
        </li>
      ))}
    </ul>
  );
}

/** Cuenta desde 0 la primera vez que la tarjeta queda al centro. */
function CountUp({ to, play, delay }: { to: number; play: boolean; delay: number }) {
  const [n, setN] = useState(to);
  const started = useRef(false);
  useEffect(() => {
    if (!play || started.current || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    started.current = true;
    let raf = 0;
    const t0 = performance.now() + delay;
    const tick = (now: number) => {
      const p = clamp((now - t0) / 900, 0, 1);
      setN(Math.round(to * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [play, to, delay]);
  return <>{n}</>;
}

function ExperienceCard({ on }: { on: boolean }) {
  // Lo actual primero (lo laboral antes que lo académico) y los marcadores [..] al final.
  const rank = (e: (typeof experience)[number]) => (e.title.startsWith("[") ? 4 : 0) + (e.end === "Hoy" ? 0 : 2) + (e.kind === "laboral" ? 0 : 1);
  const items = [...experience].sort((a, b) => rank(a) - rank(b)).slice(0, 4);
  return (
    <ul className="m-0 flex h-full list-none flex-col p-0 px-[clamp(16px,2vw,24px)]">
      {items.map((e, i) => {
        const Icon = e.kind === "laboral" ? BriefcaseIcon : CapIcon;
        const s = stagger(on, i);
        return (
          <li key={i} className={cx("flex flex-1 items-center gap-3 py-2", i < items.length - 1 && "border-b border-line", s.className)} style={s.style}>
            <span className="flex size-10 flex-none items-center justify-center rounded-xl bg-glass2 text-acc">
              <Icon size={18} />
            </span>
            <div className="min-w-0">
              <p className="m-0 truncate text-[15px] leading-tight font-semibold text-fg">{e.title}</p>
              <p className="m-0 truncate text-[11px] text-mut">
                {e.place} · {e.start}–{e.end}
              </p>
              <p className="m-0 mt-0.5 line-clamp-2 text-xs leading-snug text-soft [@media(max-height:720px)]:hidden">{e.description}</p>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
