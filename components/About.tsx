"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { intro, now, profile, stats } from "@/data/about";
import { site } from "@/data/site";
import Hid, { Koi } from "./fx/Hid";
import RevealTitle from "./fx/RevealTitle";
import { FakeCursor } from "./Frame";
import Clock from "./Clock";
import { PinIcon } from "./Icons";
import { cx, wrap } from "./ui";

const CARDS = ["Perfil", "Sobre mí", "En números", "Ahora mismo"] as const;
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
    <section id="sobre-mi" data-koi="soft" ref={sec} className="relative h-[400vh]" data-sec aria-label="Sobre mí">
      <div className="sticky top-0 h-svh overflow-hidden">
        <div className="rv pointer-events-none absolute inset-x-0 top-24 z-[5]">
          <div className={cx(wrap, "flex flex-col items-start gap-1")}>
            <span className="text-base font-semibold tracking-[-.01em] text-acc">Sobre mí</span>
            <RevealTitle text="Quién está *detrás*" className="text-[clamp(24px,2.6vw,34px)]" />
          </div>
        </div>

        {/* Escenario entre el título y los indicadores */}
        <div ref={stage} className="absolute inset-x-0 top-[168px] bottom-[84px] max-[860px]:bottom-[124px]">
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
                  <span className={cx("pl-1 text-sm/[1.5] font-medium tracking-normal transition-colors duration-500", on ? "text-hi" : "text-mut")}>{label}</span>
                  <article aria-label={label} className="relative min-h-0 flex-1">
                    {/* Marco de selección estilo editor de diseño */}
                    <div
                      aria-hidden="true"
                      className={cx(
                        "pointer-events-none absolute -inset-[7px] z-[3] rounded-[30px] border-[1.5px] border-hi transition-[opacity,scale] duration-700 ease-out-soft",
                        on ? "scale-100 opacity-100" : "scale-[1.03] opacity-0",
                      )}
                    >
                      {["-top-[5px] -left-[5px]", "-top-[5px] -right-[5px]", "-bottom-[5px] -left-[5px]", "-right-[5px] -bottom-[5px]"].map((pos) => (
                        <i key={pos} className={cx("absolute size-2.5 border-[1.5px] border-hi bg-bg", pos)} />
                      ))}
                    </div>
                    <div className="glass relative h-full overflow-hidden rounded-[24px]">
                      {i === 0 && <ProfileCard on={on} />}
                      {i === 1 && <IntroCard on={on} />}
                      {i === 2 && <StatsCard play={seen[2]} />}
                      {i === 3 && <NowCard on={on} />}
                    </div>
                  </article>
                </div>
              );
            })}
          </div>

          {/* Cursores de "colaboración": se mueven a otra posición cuando cambia la tarjeta */}
          <FakeCursor label="Cliente" color="hi" x={cursor.a[0]} y={cursor.a[1]} />
          <FakeCursor label={site.name} color="acc" x={cursor.b[0]} y={cursor.b[1]} delay />
        </div>

        <ol className="absolute bottom-[34px] left-[max(24px,6vw)] z-[6] m-0 flex list-none gap-2.5 p-0 max-[860px]:bottom-[72px]" aria-label="Tarjetas de Sobre mí">
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
            "absolute top-[18%] left-1/2 h-[46%] w-[46%] -translate-x-1/2 border border-hi transition-opacity delay-300 duration-700",
            on ? "opacity-100" : "opacity-0",
          )}
        >
          {["-top-1 -left-1", "-top-1 -right-1", "-bottom-1 -left-1", "-right-1 -bottom-1"].map((pos) => (
            <i key={pos} className={cx("absolute size-2 border border-hi bg-bg", pos)} />
          ))}
        </div>
      </div>
      <div className="flex items-end justify-between gap-3 px-2 pb-1">
        <p className="m-0 font-card text-[clamp(20px,2vw,28px)] leading-none font-bold tracking-[-.03em] text-fg">{profile.greeting}</p>
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
        <p className="m-0 font-card text-[clamp(19px,1.8vw,26px)] leading-[1.15] font-bold tracking-[-.03em] text-fg">{intro.headline}</p>
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
          <span className="font-card text-[clamp(44px,min(5vw,8vh),76px)] leading-none font-bold tracking-[-.04em] text-fg tabular-nums">
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

/** Lo que estás haciendo hoy: en qué trabajas, qué aprendes y tu disponibilidad. */
function NowCard({ on }: { on: boolean }) {
  const rows = [
    {
      label: "Construyendo",
      value: now.building,
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="m8 8-4 4 4 4M16 8l4 4-4 4M13.5 5l-3 14" />
        </svg>
      ),
    },
    {
      label: "Aprendiendo",
      value: now.learning,
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M4 5.5A1.5 1.5 0 0 1 5.5 4H11v15H5.5A1.5 1.5 0 0 0 4 20.5v-15ZM20 5.5A1.5 1.5 0 0 0 18.5 4H13v15h5.5a1.5 1.5 0 0 1 1.5 1.5v-15Z" />
        </svg>
      ),
    },
    {
      label: "Disponibilidad",
      value: now.availability,
      icon: (
        <span className="relative flex size-2.5">
          <span className="absolute inset-0 animate-ping rounded-full bg-acc opacity-60" />
          <span className="relative size-2.5 rounded-full bg-acc" />
        </span>
      ),
    },
    {
      label: "Desde",
      value: (
        <>
          {now.place} · <Clock prefix="" />
        </>
      ),
      icon: <PinIcon size={18} />,
    },
  ];
  return (
    <ul className="m-0 flex h-full list-none flex-col p-0 px-[clamp(16px,2vw,24px)]">
      {rows.map((r, i) => {
        const s = stagger(on, i);
        return (
          <li key={r.label} className={cx("flex flex-1 items-center gap-3 py-2", i < rows.length - 1 && "border-b border-line", s.className)} style={s.style}>
            <span className="flex size-10 flex-none items-center justify-center rounded-xl bg-glass2 text-acc">{r.icon}</span>
            <div className="min-w-0">
              <p className="m-0 text-[11px] text-mut">{r.label}</p>
              <p className="m-0 text-[15px] leading-snug font-medium text-fg">{r.value}</p>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
