"use client";

import { useEffect, useRef, useState } from "react";
import { sideB, tracks } from "@/data/sideB";
import { site } from "@/data/site";
import { startCrackle, stopCrackle } from "@/lib/fx/sound";
import SectionHead from "./SectionHead";
import { cx, wrap } from "./ui";

const toSec = (d: string) => {
  const [m, s] = d.split(":").map(Number);
  return m * 60 + s;
};
const fmt = (t: number) => `${Math.floor(t / 60)}:${String(Math.floor(t % 60)).padStart(2, "0")}`;

/**
 * Sección adicional "Lado B": lo personal como la lista de canciones de un vinilo.
 * Al elegir una canción, el brazo del tocadiscos baja, el disco gira y se muestra el texto.
 */
export default function SideB() {
  const [cur, setCur] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const timer = useRef<ReturnType<typeof setInterval>>(undefined);
  const track = tracks[cur];
  const total = toSec(track.duration);

  // Avanza el contador mientras suena; al terminar pasa a la siguiente canción.
  useEffect(() => {
    clearInterval(timer.current);
    if (!playing) return;
    timer.current = setInterval(() => {
      setElapsed((e) => {
        if (e + 1 >= total) {
          setCur((c) => (c + 1) % tracks.length);
          return 0;
        }
        return e + 1;
      });
    }, 1000);
    return () => clearInterval(timer.current);
  }, [playing, total]);

  // Crujido de vinilo si el sonido está activado en el menú.
  useEffect(() => {
    if (playing) startCrackle();
    else stopCrackle();
    return () => stopCrackle();
  }, [playing]);

  const pick = (i: number) => {
    setCur(i);
    setElapsed(0);
    setPlaying(true);
  };

  return (
    <section id="lado-b" data-sec data-koi="soft" className={cx(wrap, "flex flex-col gap-12 py-28 md:gap-16 md:py-36")}>
      <SectionHead eyebrow="Lado B" title={sideB.title} sub={sideB.sub} />

      <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-16">
        {/* Tocadiscos */}
        <div className="rv glass relative mx-auto aspect-square w-full max-w-[520px] rounded-[34px] p-[7%]">
          {/* Plato */}
          <div className="relative size-full rounded-full bg-bg2 p-[3%] shadow-[inset_0_2px_12px_rgba(0,0,0,.35)]">
            <div
              className={cx(
                "relative flex size-full animate-spin-slow items-center justify-center rounded-full shadow-[0_30px_60px_-30px_var(--shadow)] [animation-duration:3.2s]",
                !playing && "[animation-play-state:paused]",
              )}
            >
              <div className="absolute inset-0 rounded-full bg-[repeating-radial-gradient(circle_at_center,var(--g1)_0,var(--g1)_2px,var(--g2)_2px,var(--g2)_4px)]" />
              <div className="pointer-events-none absolute inset-0 rounded-full bg-[conic-gradient(from_20deg,transparent_0_18%,rgba(255,255,255,.08)_24%,transparent_30%_68%,rgba(255,255,255,.08)_74%,transparent_80%)]" />
              <div className="relative z-[1] flex aspect-square w-[34%] flex-col items-center justify-center gap-0.5 rounded-full bg-acc text-center text-acc-ink">
                <span className="font-cine text-[clamp(7px,1vw,10px)] tracking-[.16em] uppercase">{site.name}</span>
                <strong className="font-display text-[clamp(22px,3vw,34px)] leading-none font-normal italic">Lado B</strong>
                <span key={track.n} className="animate-pv-up font-cine text-[clamp(7px,1vw,10px)] tracking-[.16em] [animation-duration:.5s]">
                  {track.n}
                </span>
              </div>
            </div>
          </div>

          {/* Brazo: descansa afuera y baja sobre el disco al sonar */}
          <div
            aria-hidden="true"
            className={cx(
              "absolute top-[7%] right-[7%] h-[62%] w-[14%] origin-[50%_9%] transition-transform duration-[1.1s] ease-out-soft",
              playing ? "rotate-[26deg]" : "rotate-[4deg]",
            )}
          >
            <span className="absolute top-0 left-1/2 size-[46%] -translate-x-1/2 rounded-full bg-metal shadow-[0_6px_14px_rgba(0,0,0,.35)]" />
            <span className="absolute top-[9%] left-1/2 h-[82%] w-[9%] -translate-x-1/2 rounded-full bg-metal" />
            <span className="absolute bottom-0 left-1/2 h-[14%] w-[42%] -translate-x-1/2 rotate-[18deg] rounded-[4px] bg-[#1d1e19] shadow-[0_4px_10px_rgba(0,0,0,.4)]" />
          </div>

          {/* Controles */}
          <div className="absolute inset-x-[7%] bottom-[5%] flex items-center gap-3">
            <button
              type="button"
              onClick={() => setPlaying((p) => !p)}
              aria-label={playing ? "Pausar" : "Reproducir"}
              className="flex size-11 flex-none cursor-pointer items-center justify-center rounded-full border-0 bg-acc text-acc-ink shadow-[0_10px_24px_-10px_var(--acc)] transition-transform duration-300 active:scale-95"
            >
              {playing ? (
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
                  <rect x="3.5" y="3" width="3" height="10" rx="1" />
                  <rect x="9.5" y="3" width="3" height="10" rx="1" />
                </svg>
              ) : (
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
                  <path d="M5 3.2v9.6c0 .5.6.8 1 .5l7.2-4.8a.6.6 0 0 0 0-1L6 2.7c-.4-.3-1 0-1 .5Z" />
                </svg>
              )}
            </button>
            <div className="glass-flat flex min-w-0 flex-1 flex-col gap-1.5 rounded-2xl px-4 py-2.5">
              <div className="flex items-center justify-between gap-3 text-xs">
                <span className="truncate font-medium text-fg">
                  {track.n} · {track.title}
                </span>
                <span className="flex-none font-cine text-mut tabular-nums">
                  {fmt(elapsed)} / {track.duration}
                </span>
              </div>
              <div className="h-1 overflow-hidden rounded-full bg-glass2">
                <div className="bg-metal h-full rounded-full transition-[width] duration-1000 ease-linear" style={{ width: `${(elapsed / total) * 100}%` }} />
              </div>
            </div>
          </div>
        </div>

        {/* Lista de canciones (contraportada) */}
        <div className="rv flex flex-col gap-6">
          <div className="flex items-end justify-between gap-4 border-b border-line pb-4">
            <p className="m-0 font-cine text-xs tracking-[.2em] text-mut uppercase">Lado B · {tracks.length} canciones</p>
            <p className="m-0 font-cine text-xs tracking-[.2em] text-mut uppercase">33⅓ rpm</p>
          </div>
          <ol className="m-0 flex list-none flex-col p-0" aria-label="Canciones del lado B">
            {tracks.map((t, i) => {
              const on = i === cur;
              return (
                <li key={t.n} className="border-b border-line">
                  <button
                    type="button"
                    onClick={() => (on ? setPlaying((p) => !p) : pick(i))}
                    aria-expanded={on}
                    className="group flex w-full cursor-pointer items-baseline gap-4 border-0 bg-transparent px-1 py-4 text-left"
                  >
                    <span className={cx("w-7 flex-none font-cine text-sm transition-colors duration-300", on ? "text-acc" : "text-mut")}>
                      {on && playing ? (
                        <span className="inline-flex h-3 items-end gap-[2px]" aria-label="Sonando">
                          {[0, 1, 2].map((k) => (
                            <i key={k} className="block w-[3px] animate-pulse rounded-sm bg-acc" style={{ height: `${50 + k * 25}%`, animationDelay: `${k * 150}ms` }} />
                          ))}
                        </span>
                      ) : (
                        t.n
                      )}
                    </span>
                    <span
                      className={cx(
                        "flex-1 font-display text-[clamp(22px,2.2vw,30px)] leading-tight transition-colors duration-300",
                        on ? "text-fg" : "text-soft group-hover:text-fg",
                      )}
                    >
                      {t.title}
                    </span>
                    <span className="flex-none font-cine text-sm text-mut tabular-nums">{t.duration}</span>
                  </button>
                  {/* El texto se despliega con una transición de altura */}
                  <div className={cx("grid transition-[grid-template-rows,opacity] duration-700 ease-out-soft", on ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0")}>
                    <p className="m-0 overflow-hidden pr-2 pl-12 text-[15px] leading-relaxed text-soft">
                      <span className="block pb-5">{t.text}</span>
                    </p>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
