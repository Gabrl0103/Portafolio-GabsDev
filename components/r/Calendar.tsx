"use client";

import { useState } from "react";
import { site } from "@/data/site";
import { useLang, useT } from "@/lib/i18n";
import { cx } from "../ui";
import { btn, btnF } from "./btn";
import { copyText } from "./theme";

const TIMES = ["9:00", "10:00", "11:00", "14:00", "15:00", "16:00"];
const KINDS: [string, string][] = [
  ["Charla de 30 min", "30-min chat"],
  ["Proyecto web", "Web project"],
  ["Colaboración", "Collaboration"],
];
const KIND_COLORS = ["var(--olive)", "var(--cream)", "var(--orange)"];

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


/** Agenda una llamada: tipo, día (hasta 3 meses, sin fines de semana), hora y nombre. Prepara el mensaje para enviarlo por correo. */
export default function Calendar() {
  const t = useT();
  const lang = useLang();
  const locale = lang === "en" ? "en-US" : "es-CO";
  const fmt = (d: Date) => d.toLocaleDateString(locale, { weekday: "long", day: "numeric", month: "long" });
  const monthName = (m: number) => new Date(2026, m, 1).toLocaleDateString(locale, { month: "long" });
  // Lunes a domingo, con la inicial del día en el idioma actual
  const days = Array.from({ length: 7 }, (_, i) => new Date(2024, 0, 1 + i).toLocaleDateString(locale, { weekday: "narrow" }).toUpperCase());
  const kinds = KINDS.map(([es, en]) => t(es, en));
  const [today] = useState(() => {
    const n = new Date();
    return new Date(n.getFullYear(), n.getMonth(), n.getDate());
  });
  const [view, setView] = useState(() => ({ y: today.getFullYear(), m: today.getMonth() }));
  const [kindI, setKindI] = useState(0);
  const kind = kinds[kindI];
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
    setMsg(
      t(
        `Hola ${site.name}, soy ${name.trim()}. Quisiera agendar una ${kind.toLowerCase()} el ${fmt(day)} a las ${time} (hora de Colombia).`,
        `Hi ${site.name}, I'm ${name.trim()}. I'd like to book a ${kind.toLowerCase()} on ${fmt(day)} at ${time} (Colombia time).`,
      ),
    );
    setCopied(false);
  };

  const navBtn = "size-[34px] cursor-pointer rounded-full border border-line bg-transparent enabled:hover:bg-fg enabled:hover:text-bg disabled:cursor-default disabled:opacity-30";

  return (
    <div>
      <Step n={1}>{t("Tipo de llamada", "Type of call")}</Step>
      <div className="flex flex-wrap gap-2">
        {kinds.map((k, i) => (
          <button key={k} type="button" aria-pressed={kindI === i} onClick={() => setKindI(i)} style={{ "--c": KIND_COLORS[i] } as React.CSSProperties} className={chip(kindI === i)}>
            {k}
          </button>
        ))}
      </div>

      <Step n={2}>{t("Elige el día", "Pick a day")}</Step>
      <div className="mb-2.5 flex items-center justify-between">
        <button type="button" aria-label={t("Mes anterior", "Previous month")} disabled={offset <= 0} onClick={() => move(-1)} className={navBtn}>
          ←
        </button>
        <b className="font-disp text-lg font-medium tracking-[-.02em] capitalize" aria-live="polite">
          {monthName(view.m)} {view.y}
        </b>
        <button type="button" aria-label={t("Mes siguiente", "Next month")} disabled={offset >= 3} onClick={() => move(1)} className={navBtn}>
          →
        </button>
      </div>
      <div className="grid grid-cols-7 gap-1">
        {days.map((d, i) => (
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
          <Step n={3}>{t("Hora (Colombia, UTC−5)", "Time (Colombia, UTC−5)")}</Step>
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
          <Step n={4}>{t("Tu nombre", "Your name")}</Step>
          <label htmlFor="cal-name" className="sr-only">
            {t("Nombre y apellido", "Full name")}
          </label>
          <input
            id="cal-name"
            type="text"
            required
            placeholder={t("Nombre y apellido", "Full name")}
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && prepare()}
            className="h-[46px] w-full rounded-xl border border-line bg-[rgba(var(--fgr),.05)] px-4 text-base text-fg focus:outline-2 focus:outline-offset-2 focus:outline-orange"
          />
          <button type="button" disabled={!name.trim()} onClick={prepare} className={cx(btnF, "mt-[18px] h-[52px] w-full justify-center disabled:pointer-events-none disabled:opacity-35")}>
            {t("Preparar solicitud", "Prepare request")}
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
                {copied ? t("¡Copiado!", "Copied!") : t("Copiar mensaje", "Copy message")}
              </button>
              <a href={`mailto:${site.email}?subject=${encodeURIComponent(t(`Llamada: ${kind}`, `Call: ${kind}`))}&body=${encodeURIComponent(msg)}`} className={cx(btnF, "h-10")}>
                {t("Abrir en mi correo", "Open in my email")}
              </a>
            </div>
            <small className="mt-2.5 block text-mut">{t("Esto no envía nada por sí solo: copia el mensaje o ábrelo en tu correo para mandarlo.", "This doesn't send anything by itself: copy the message or open it in your email to send it.")}</small>
          </div>
        )}
      </div>
    </div>
  );
}
