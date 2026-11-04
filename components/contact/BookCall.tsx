"use client";

import { useEffect, useMemo, useState } from "react";
import { availability } from "@/data/contact";
import { site } from "@/data/site";
import { isEmail, sendMessage } from "@/lib/send";
import { CheckIcon } from "../Icons";
import { button, cx } from "../ui";

const WEEK = ["DOM", "LUN", "MAR", "MIÉ", "JUE", "VIE", "SÁB"];
const MONTHS = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
const DAYS = ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"];

type Ymd = { y: number; m: number; d: number };

/** Fecha y hora actuales en Colombia, sin importar la zona del visitante. */
function nowInBogota() {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat("en-CA", { timeZone: "America/Bogota", year: "numeric", month: "numeric", day: "numeric", hour: "numeric", minute: "numeric", hour12: false })
      .formatToParts(new Date())
      .map((p) => [p.type, p.value]),
  );
  return { y: +parts.year, m: +parts.month - 1, d: +parts.day, min: (+parts.hour % 24) * 60 + +parts.minute };
}

const toMin = (hhmm: string) => {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
};
const SLOTS = (() => {
  const out: number[] = [];
  for (let t = toMin(availability.start); t < toMin(availability.end); t += availability.stepMinutes) out.push(t);
  return out;
})();

const fmt = (min: number, h24: boolean) => {
  const h = Math.floor(min / 60);
  const m = String(min % 60).padStart(2, "0");
  if (h24) return `${String(h).padStart(2, "0")}:${m}`;
  return `${((h + 11) % 12) + 1}:${m} ${h < 12 ? "a. m." : "p. m."}`;
};
const same = (a: Ymd, b: Ymd) => a.y === b.y && a.m === b.m && a.d === b.d;
const weekday = (v: Ymd) => new Date(v.y, v.m, v.d).getDay();

/** Agendar una llamada: calendario, horas disponibles y confirmación. */
export default function BookCall() {
  const [now, setNow] = useState<ReturnType<typeof nowInBogota> | null>(null);
  const [view, setView] = useState({ y: 0, m: 0 });
  const [day, setDay] = useState<Ymd | null>(null);
  const [slot, setSlot] = useState<number | null>(null);
  const [h24, setH24] = useState(false);
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [errors, setErrors] = useState<{ name?: string; email?: string }>({});

  const slotsFor = (v: Ymd, n: NonNullable<typeof now>) => {
    if (!availability.days.includes(weekday(v))) return [];
    const today = same(v, n);
    if (!today && new Date(v.y, v.m, v.d) < new Date(n.y, n.m, n.d)) return [];
    return SLOTS.filter((t) => !today || t >= n.min + availability.minNoticeHours * 60);
  };

  // El calendario depende de la fecha actual: se arma en el navegador.
  useEffect(() => {
    const n = nowInBogota();
    const t = setTimeout(() => {
      setNow(n);
      setView({ y: n.y, m: n.m });
      for (let i = 0; i < 60; i++) {
        const dt = new Date(n.y, n.m, n.d + i);
        const v = { y: dt.getFullYear(), m: dt.getMonth(), d: dt.getDate() };
        if (slotsFor(v, n).length) return setDay(v);
      }
    }, 0);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const cells = useMemo(() => {
    const first = new Date(view.y, view.m, 1).getDay();
    const count = new Date(view.y, view.m + 1, 0).getDate();
    return [...Array(first).fill(null), ...Array.from({ length: count }, (_, i) => i + 1)] as (number | null)[];
  }, [view]);

  if (!now) return <div className="min-h-[420px] animate-pulse rounded-[24px] bg-glass" aria-hidden="true" />;

  const monthIndex = (v: { y: number; m: number }) => v.y * 12 + v.m;
  const canPrev = monthIndex(view) > monthIndex(now);
  const canNext = monthIndex(view) < monthIndex(now) + availability.monthsAhead;
  const shift = (k: number) => {
    const dt = new Date(view.y, view.m + k, 1);
    setView({ y: dt.getFullYear(), m: dt.getMonth() });
  };
  const slots = day ? slotsFor(day, now) : [];
  const dayLabel = day ? `${DAYS[weekday(day)]} ${day.d} de ${MONTHS[day.m]}` : "";

  async function confirm(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const name = String(data.get("name") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const errs = { name: name.length < 2 ? "Escribe tu nombre." : undefined, email: isEmail(email) ? undefined : "Escribe un correo válido." };
    setErrors(errs);
    if (errs.name || errs.email) return;
    setStatus("sending");
    try {
      await sendMessage(`Portafolio: llamada el ${dayLabel} a las ${fmt(slot!, false)}`, {
        Nombre: name,
        Correo: email,
        Fecha: `${dayLabel} de ${day!.y}`,
        Hora: `${fmt(slot!, false)} (hora de Colombia)`,
        Tema: String(data.get("topic") ?? ""),
      });
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  }

  return (
    <div className="grid overflow-hidden rounded-[24px] border border-line bg-glass lg:grid-cols-[1fr_320px]">
      {/* Calendario */}
      <div className="p-5 sm:p-7">
        <div className="mb-5 flex items-center justify-between">
          <p className="m-0 text-lg font-semibold tracking-tight text-fg capitalize">
            {MONTHS[view.m]} <span className="font-normal text-mut">{view.y}</span>
          </p>
          <div className="flex gap-1">
            {[
              { k: -1, ok: canPrev, label: "Mes anterior", d: "M10 3 5 8l5 5" },
              { k: 1, ok: canNext, label: "Mes siguiente", d: "m6 3 5 5-5 5" },
            ].map((b) => (
              <button
                key={b.k}
                type="button"
                aria-label={b.label}
                disabled={!b.ok}
                onClick={() => shift(b.k)}
                className="flex size-9 cursor-pointer items-center justify-center rounded-full text-soft transition-colors hover:bg-glass2 disabled:cursor-default disabled:opacity-30 disabled:hover:bg-transparent"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                  <path d={b.d} />
                </svg>
              </button>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-7 gap-1.5 text-center" role="grid" aria-label={`${MONTHS[view.m]} ${view.y}`}>
          {WEEK.map((w) => (
            <span key={w} className="pb-2 text-[11px] font-semibold tracking-[.12em] text-mut">
              {w}
            </span>
          ))}
          {cells.map((d, i) => {
            if (!d) return <span key={`e${i}`} />;
            const v = { y: view.y, m: view.m, d };
            const open = slotsFor(v, now).length > 0;
            const sel = day && same(v, day);
            const today = same(v, now);
            return (
              <button
                key={d}
                type="button"
                disabled={!open}
                aria-pressed={!!sel}
                aria-label={`${DAYS[weekday(v)]} ${d}${open ? "" : ", sin horarios"}`}
                onClick={() => {
                  setDay(v);
                  setSlot(null);
                  setStatus("idle");
                }}
                className={cx(
                  "relative flex h-11 items-center justify-center rounded-xl text-sm font-medium sm:h-12 transition-[background,color,transform] duration-300 ease-out-soft max-sm:rounded-lg",
                  sel ? "scale-[1.04] bg-acc text-acc-ink" : open ? "cursor-pointer bg-glass2 text-fg hover:bg-glass-b active:scale-95" : "cursor-default text-mut/60",
                )}
              >
                {d}
                {today && <i className={cx("absolute bottom-1.5 size-1 rounded-full", sel ? "bg-acc-ink" : "bg-fg")} />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Horarios o confirmación */}
      <div className="flex min-h-[380px] flex-col border-line p-5 max-lg:border-t sm:p-7 lg:border-l">
        {status === "sent" ? (
          <div role="status" className="flex flex-1 animate-pv-up flex-col items-center justify-center gap-3 text-center">
            <span className="flex size-14 items-center justify-center rounded-full bg-acc text-acc-ink">
              <CheckIcon size={24} />
            </span>
            <p className="m-0 text-xl font-semibold tracking-tight">Solicitud lista</p>
            <p className="m-0 text-sm text-soft first-letter:uppercase">
              {dayLabel}, {fmt(slot!, h24)} (hora de Colombia). Te confirmo por correo.
            </p>
            <button
              type="button"
              className={cx(button({ size: "sm" }), "mt-2")}
              onClick={() => {
                setSlot(null);
                setStatus("idle");
              }}
            >
              Elegir otra hora
            </button>
          </div>
        ) : slot === null ? (
          <>
            <div className="mb-4 flex items-center justify-between gap-3">
              <p className="m-0 font-semibold text-fg first-letter:uppercase">
                {day ? (
                  <>
                    {DAYS[weekday(day)]} <span className="font-normal text-mut">{day.d}</span>
                  </>
                ) : (
                  "Elige un día"
                )}
              </p>
              <div className="flex rounded-lg bg-glass2 p-0.5 text-xs font-medium" role="group" aria-label="Formato de hora">
                {[false, true].map((v) => (
                  <button
                    key={String(v)}
                    type="button"
                    aria-pressed={h24 === v}
                    onClick={() => setH24(v)}
                    className={cx("cursor-pointer rounded-md px-2 py-1 transition-colors", h24 === v ? "bg-bg text-fg shadow-sm" : "text-mut")}
                  >
                    {v ? "24h" : "12h"}
                  </button>
                ))}
              </div>
            </div>
            <ul key={day ? `${day.m}-${day.d}` : "none"} className="m-0 flex max-h-[340px] list-none flex-col gap-2 overflow-y-auto p-0 pr-1">
              {slots.map((t, i) => (
                <li key={t} className="animate-pv-up [animation-duration:.6s]" style={{ animationDelay: `${i * 35}ms` }}>
                  <button
                    type="button"
                    onClick={() => setSlot(t)}
                    className="w-full cursor-pointer rounded-xl border border-line2 bg-transparent py-2.5 text-sm font-medium text-fg tabular-nums transition-[border-color,background,transform] duration-300 hover:border-acc hover:bg-glass2 active:scale-[.98]"
                  >
                    {fmt(t, h24)}
                  </button>
                </li>
              ))}
            </ul>
            <p className="m-0 mt-auto pt-4 text-xs text-mut">Hora de Colombia · llamadas de {availability.stepMinutes} min</p>
          </>
        ) : (
          <form noValidate onSubmit={confirm} className="flex flex-1 animate-pv-up flex-col gap-3" aria-label="Confirmar llamada">
            <button type="button" onClick={() => setSlot(null)} className="flex cursor-pointer items-center gap-1.5 self-start text-sm text-mut hover:text-fg">
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                <path d="M10 3 5 8l5 5" />
              </svg>
              Cambiar hora
            </button>
            <div className="rounded-xl bg-glass2 p-3">
              <p className="m-0 text-sm font-semibold text-fg first-letter:uppercase">{dayLabel}</p>
              <p className="m-0 text-sm text-soft">
                {fmt(slot, h24)} · {availability.stepMinutes} min con {site.name}
              </p>
            </div>
            {(["name", "email"] as const).map((f) => (
              <label key={f} className="flex flex-col gap-1.5">
                <span className="text-xs font-medium text-soft">{f === "name" ? "Tu nombre *" : "Tu correo *"}</span>
                <input
                  name={f}
                  type={f === "email" ? "email" : "text"}
                  autoComplete={f}
                  required
                  className="field min-h-11 py-2.5"
                  aria-invalid={errors[f] ? true : undefined}
                  onInput={() => errors[f] && setErrors((x) => ({ ...x, [f]: undefined }))}
                />
                {errors[f] && <span className="text-xs text-[#c96a4a]">{errors[f]}</span>}
              </label>
            ))}
            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-medium text-soft">Tema (opcional)</span>
              <input name="topic" type="text" className="field min-h-11 py-2.5" placeholder="Ej: landing para mi negocio" />
            </label>
            <button type="submit" disabled={status === "sending"} className={cx(button({ variant: "primary" }), "mt-auto disabled:opacity-60")}>
              {status === "sending" ? "Enviando…" : "Confirmar llamada"}
            </button>
            {status === "error" && <p className="m-0 text-xs text-[#c96a4a]">No se pudo enviar. Escríbeme a {site.email}.</p>}
          </form>
        )}
      </div>
    </div>
  );
}
