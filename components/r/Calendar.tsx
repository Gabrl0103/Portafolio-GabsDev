"use client";

import { useState } from "react";
import { site } from "@/data/site";
import { cx } from "../ui";
import { btn, btnF } from "./btn";
import { copyText } from "./theme";

const MONTHS = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
const TIMES = ["9:00 a. m.", "10:00 a. m.", "11:00 a. m.", "2:00 p. m.", "3:00 p. m.", "4:00 p. m."];
const KINDS = ["Charla de 30 min", "Proyecto web", "Colaboración"];
const KIND_COLORS = ["var(--olive)", "var(--cream)", "var(--orange)"];
const DAYS = ["L", "M", "M", "J", "V", "S", "D"];

export const chip = (on: boolean) =>
  cx(
    "h-[38px] cursor-pointer rounded-full border px-4 font-disp text-sm font-medium transition-all duration-300",
    on ? "border-[var(--c,var(--fg))] bg-[var(--c,var(--fg))] text-pill" : "border-line bg-transparent hover:border-fg",
  );

export function Step({ n, children }: { n: number; children: React.ReactNode }) {
  return (
    <div className="mono mt-[22px] mb-2.5 flex items-center gap-2.5 text-mut">
      <b className="grid size-[22px] place-items-center rounded-full bg-fg text-[11px] font-medium text-bg">{n}</b> {children}
    </div>
  );
}

const fmt = (d: Date) => d.toLocaleDateString("es-CO", { weekday: "long", day: "numeric", month: "long" });

/** Agenda una llamada: tipo, día (hasta 3 meses, sin fines de semana), hora y nombre. Prepara el mensaje para enviarlo por correo. */
export default function Calendar() {
  const [today] = useState(() => {
    const n = new Date();
    return new Date(n.getFullYear(), n.getMonth(), n.getDate());
  });
  const [view, setView] = useState(() => ({ y: today.getFullYear(), m: today.getMonth() }));
  const [kind, setKind] = useState(KINDS[0]);
  const [day, setDay] = useState<Date | null>(null);
  const [time, setTime] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [msg, setMsg] = useState("");
  const [copied, setCopied] = useState(false);

  const offset = (view.y - today.getFullYear()) * 12 + view.m - today.getMonth();
  const first = (new Date(view.y, view.m, 1).getDay() + 6) % 7;
  const dim = new Date(view.y, view.m + 1, 0).getDate();
  const move = (d: number) => setView(({ y, m }) => ({ y: y + Math.floor((m + d) / 12), m: (m + d + 12) % 12 }));

  const prepare = () => {
    if (!day || !time || !name.trim()) return;
    setMsg(`Hola ${site.name}, soy ${name.trim()}. Quisiera agendar una ${kind.toLowerCase()} el ${fmt(day)} a las ${time} (hora de Colombia).`);
    setCopied(false);
  };

  const navBtn = "size-[34px] cursor-pointer rounded-full border border-line bg-transparent enabled:hover:bg-fg enabled:hover:text-bg disabled:cursor-default disabled:opacity-30";

  return (
    <div>
      <Step n={1}>Tipo de llamada</Step>
      <div className="flex flex-wrap gap-2">
        {KINDS.map((k, i) => (
          <button key={k} type="button" aria-pressed={kind === k} onClick={() => setKind(k)} style={{ "--c": KIND_COLORS[i] } as React.CSSProperties} className={chip(kind === k)}>
            {k}
          </button>
        ))}
      </div>

      <Step n={2}>Elige el día</Step>
      <div className="mb-2.5 flex items-center justify-between">
        <button type="button" aria-label="Mes anterior" disabled={offset <= 0} onClick={() => move(-1)} className={navBtn}>
          ←
        </button>
        <b className="font-disp text-lg font-medium tracking-[-.02em] capitalize" aria-live="polite">
          {MONTHS[view.m]} {view.y}
        </b>
        <button type="button" aria-label="Mes siguiente" disabled={offset >= 3} onClick={() => move(1)} className={navBtn}>
          →
        </button>
      </div>
      <div className="grid grid-cols-7 gap-1">
        {DAYS.map((d, i) => (
          <span key={i} className="py-1 text-center font-mono text-[11px] font-medium text-mut">
            {d}
          </span>
        ))}
        {Array.from({ length: first }, (_, i) => (
          <i key={`e${i}`} />
        ))}
        {Array.from({ length: dim }, (_, i) => {
          const d = new Date(view.y, view.m, i + 1);
          const wk = d.getDay();
          const off = d < today || wk === 0 || wk === 6;
          const on = !!day && day.getTime() === d.getTime();
          return (
            <button
              key={i}
              type="button"
              disabled={off}
              aria-pressed={on}
              aria-label={fmt(d)}
              onClick={() => {
                setDay(d);
                setTime(null);
                setMsg("");
              }}
              className={cx(
                "h-[clamp(38px,3.6vw,48px)] cursor-pointer rounded-[10px] border-0 bg-transparent text-sm font-medium transition-[background-color,scale] duration-300 ease-back enabled:hover:scale-[1.08] enabled:hover:bg-[rgba(var(--fgr),.12)] disabled:cursor-default disabled:text-mut disabled:opacity-35",
                d.getTime() === today.getTime() && "shadow-[inset_0_0_0_1px_var(--mut)]",
                on && "!bg-orange text-white",
              )}
            >
              {i + 1}
            </button>
          );
        })}
      </div>

      {day && (
        <>
          <Step n={3}>Hora (Colombia, UTC−5)</Step>
          <div className="flex flex-wrap gap-2">
            {TIMES.map((t) => (
              <button
                key={t}
                type="button"
                aria-pressed={time === t}
                style={{ "--c": "var(--cream)" } as React.CSSProperties}
                onClick={() => {
                  setTime(t);
                  setMsg("");
                }}
                className={chip(time === t)}
              >
                {t}
              </button>
            ))}
          </div>
        </>
      )}

      {day && time && (
        <>
          <Step n={4}>Tu nombre</Step>
          <label htmlFor="cal-name" className="sr-only">
            Nombre y apellido
          </label>
          <input
            id="cal-name"
            type="text"
            required
            placeholder="Nombre y apellido"
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && prepare()}
            className="h-[46px] w-full rounded-xl border border-line bg-[rgba(var(--fgr),.05)] px-4 text-base text-fg focus:outline-2 focus:outline-offset-2 focus:outline-orange"
          />
          <button type="button" disabled={!name.trim()} onClick={prepare} className={cx(btnF, "mt-[18px] h-[52px] w-full justify-center disabled:pointer-events-none disabled:opacity-35")}>
            Preparar solicitud
          </button>
        </>
      )}

      <div aria-live="polite">
        {msg && (
          <div className="mt-[18px] rounded-[14px] border border-dashed border-line p-4 text-[15px] leading-normal text-soft">
            {msg}
            <div className="mt-3 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={async () => {
                  if (await copyText(msg)) setCopied(true);
                }}
                className={cx(btn, "h-10")}
              >
                {copied ? "¡Copiado!" : "Copiar mensaje"}
              </button>
              <a href={`mailto:${site.email}?subject=${encodeURIComponent(`Llamada: ${kind}`)}&body=${encodeURIComponent(msg)}`} className={cx(btnF, "h-10")}>
                Abrir en mi correo
              </a>
            </div>
            <small className="mt-2.5 block text-mut">Esto no envía nada por sí solo: copia el mensaje o ábrelo en tu correo para mandarlo.</small>
          </div>
        )}
      </div>
    </div>
  );
}
