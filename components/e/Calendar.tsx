"use client";

import { useState } from "react";
import { useLang, useT } from "@/lib/i18n";
import { isEmail, sendMessage } from "@/lib/send";
import { cx } from "../ui";

const TIMES = ["9:00", "10:00", "11:00", "14:00", "15:00", "16:00"];
const KINDS: [string, string][] = [
  ["Charla de 30 min", "30-min chat"],
  ["Proyecto web", "Web project"],
  ["Colaboración", "Collaboration"],
];

const field =
  "w-full border-0 border-b border-line bg-transparent pt-1 pb-2.5 text-[16px] text-fg outline-none focus:border-fg aria-[invalid=true]:border-fg";

/** Paso numerado del calendario */
function Step({ n, children }: { n: number; children: React.ReactNode }) {
  return (
    <p className="label mt-7 mb-3 flex items-center gap-3 text-soft first:mt-0">
      <b className="font-semibold text-fg">0{n}</b>
      {children}
    </p>
  );
}

/**
 * Agenda una llamada: tipo, día (hasta 3 meses, sin fines de semana), hora y datos.
 * Se envía igual que el formulario (Formspree o el correo).
 */
export default function Calendar() {
  const t = useT();
  const lang = useLang();
  const locale = lang === "en" ? "en-US" : "es-CO";
  const fmt = (d: Date) =>
    d.toLocaleDateString(locale, {
      weekday: "long",
      day: "numeric",
      month: "long",
    });
  const days = Array.from({ length: 7 }, (_, i) =>
    new Date(2024, 0, 1 + i).toLocaleDateString(locale, { weekday: "narrow" }),
  );
  const [today] = useState(() => {
    const n = new Date();
    return new Date(n.getFullYear(), n.getMonth(), n.getDate());
  });
  const [view, setView] = useState(() => ({
    y: today.getFullYear(),
    m: today.getMonth(),
  }));
  const [dir, setDir] = useState(1);
  const [kind, setKind] = useState(0);
  const [day, setDay] = useState<Date | null>(null);
  const [time, setTime] = useState<string | null>(null);
  const [v, setV] = useState({ name: "", email: "" });
  const [err, setErr] = useState<{ name?: string; email?: string }>({});
  const [stage, setStage] = useState<"idle" | "sending" | "sent" | "failed">(
    "idle",
  );

  const offset =
    (view.y - today.getFullYear()) * 12 + view.m - today.getMonth();
  const first = (new Date(view.y, view.m, 1).getDay() + 6) % 7;
  const dim = new Date(view.y, view.m + 1, 0).getDate();
  const move = (d: number) => {
    setDir(d);
    setView(({ y, m }) => ({
      y: y + Math.floor((m + d) / 12),
      m: (m + d + 12) % 12,
    }));
  };
  const month = new Date(view.y, view.m, 1).toLocaleDateString(locale, {
    month: "long",
    year: "numeric",
  });

  async function book(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!day || !time) return;
    const er: typeof err = {};
    if (v.name.trim().length < 2)
      er.name = t("Escribe tu nombre.", "Please enter your name.");
    if (!isEmail(v.email))
      er.email = t("Escribe un correo válido.", "Please enter a valid email.");
    setErr(er);
    if (Object.keys(er).length) return;
    setStage("sending");
    try {
      await sendMessage(`Llamada: ${KINDS[kind][0]} · ${v.name.trim()}`, {
        Tipo: KINDS[kind][0],
        Día: day.toLocaleDateString("es-CO", {
          weekday: "long",
          day: "numeric",
          month: "long",
          year: "numeric",
        }),
        Hora: `${time} (hora de Colombia)`,
        Nombre: v.name.trim(),
        Correo: v.email.trim(),
      });
      setStage("sent");
    } catch {
      setStage("failed");
    }
  }

  if (stage === "sent")
    return (
      <div role="status" className="rise border-t border-line pt-5">
        <p className="text-lg font-semibold">
          {t(
            "¡Listo! Te confirmo la llamada por correo.",
            "Done! I'll confirm the call by email.",
          )}
        </p>
        <p className="label mt-2 text-soft">
          {KINDS[kind][lang === "en" ? 1 : 0]} · {day && fmt(day)} · {time}
        </p>
      </div>
    );

  return (
    <form
      noValidate
      onSubmit={book}
      aria-label={t("Agendar una llamada", "Book a call")}
    >
      <Step n={1}>{t("Tipo de llamada", "Type of call")}</Step>
      <div className="flex flex-wrap gap-2">
        {KINDS.map(([es, en], i) => (
          <button
            key={es}
            type="button"
            aria-pressed={kind === i}
            onClick={() => setKind(i)}
            className={cx("pill px-4! py-2!", kind === i && "pill-fill")}
          >
            {t(es, en)}
          </button>
        ))}
      </div>

      <Step n={2}>{t("Elige el día", "Pick a day")}</Step>
      <div className="mb-2 flex items-center justify-between border-b border-fg pb-2">
        <b
          key={month}
          aria-live="polite"
          className="rise block text-[22px] font-extrabold tracking-[-.03em] first-letter:uppercase"
        >
          {month}
        </b>
        <span className="label flex gap-4">
          <button
            type="button"
            aria-label={t("Mes anterior", "Previous month")}
            disabled={offset <= 0}
            onClick={() => move(-1)}
            className="transition-transform enabled:hover:-translate-x-1 disabled:opacity-25"
          >
            ←
          </button>
          <button
            type="button"
            aria-label={t("Mes siguiente", "Next month")}
            disabled={offset >= 3}
            onClick={() => move(1)}
            className="transition-transform enabled:hover:translate-x-1 disabled:opacity-25"
          >
            →
          </button>
        </span>
      </div>
      <div
        key={`${view.y}-${view.m}`}
        className="grid grid-cols-7"
        style={{
          animation: `${dir > 0 ? "cal-next" : "cal-prev"} .6s var(--ease-expo) both`,
        }}
      >
        {days.map((d, i) => (
          <span key={i} className="label py-2 text-center text-soft">
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
          const isToday = d.getTime() === today.getTime();
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
              }}
              className={cx(
                "relative grid h-11 place-items-center text-[15px] font-semibold tabular-nums transition-colors duration-300 max-[700px]:h-10",
                "enabled:hover:bg-fg/10 disabled:font-normal disabled:text-soft disabled:opacity-40",
                on && "bg-fg! text-bg",
              )}
            >
              {i + 1}
              {isToday && (
                <span
                  aria-hidden="true"
                  className="absolute bottom-1.5 size-1 rounded-full bg-current"
                />
              )}
            </button>
          );
        })}
      </div>

      <div
        className={cx(
          "grid transition-[grid-template-rows] duration-700 ease-expo",
          day ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
        )}
      >
        <div className="overflow-hidden" inert={!day}>
          <Step n={3}>
            {t("Hora (Colombia, UTC−5)", "Time (Colombia, UTC−5)")}
          </Step>
          <div className="grid grid-cols-6 border-t border-l border-line max-[700px]:grid-cols-3">
            {TIMES.map((h) => (
              <button
                key={h}
                type="button"
                aria-pressed={time === h}
                onClick={() => setTime(h)}
                className={cx(
                  "border-r border-b border-line py-3 text-sm font-semibold tabular-nums transition-colors duration-300 hover:bg-fg/10",
                  time === h && "bg-fg! text-bg",
                )}
              >
                {h}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div
        className={cx(
          "grid transition-[grid-template-rows] duration-700 ease-expo",
          day && time ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
        )}
      >
        <div className="overflow-hidden" inert={!(day && time)}>
          <Step n={4}>{t("Tus datos", "Your details")}</Step>
          <div className="grid grid-cols-2 gap-6 max-[700px]:grid-cols-1">
            <label className="block">
              <span className="label text-soft">{t("Nombre", "Name")}</span>
              <input
                type="text"
                required
                autoComplete="name"
                value={v.name}
                onChange={(e) => setV((x) => ({ ...x, name: e.target.value }))}
                aria-invalid={!!err.name}
                className={field}
              />
              {err.name && <span className="label mt-1 block">{err.name}</span>}
            </label>
            <label className="block">
              <span className="label text-soft">{t("Correo", "Email")}</span>
              <input
                type="email"
                required
                autoComplete="email"
                value={v.email}
                onChange={(e) => setV((x) => ({ ...x, email: e.target.value }))}
                aria-invalid={!!err.email}
                className={field}
              />
              {err.email && (
                <span className="label mt-1 block">{err.email}</span>
              )}
            </label>
          </div>
          <div className="mt-6 flex flex-wrap items-center gap-4 pb-1">
            <button
              type="submit"
              disabled={stage === "sending"}
              className="pill pill-fill disabled:opacity-50"
            >
              {stage === "sending"
                ? t("Enviando…", "Sending…")
                : t("Agendar llamada ↗", "Book call ↗")}
            </button>
            {day && time && (
              <span className="label text-soft">
                {fmt(day)} · {time}
              </span>
            )}
            {stage === "failed" && (
              <span className="label">
                {t(
                  "No se pudo enviar. Escríbeme al correo.",
                  "It couldn't be sent. Email me instead.",
                )}
              </span>
            )}
          </div>
        </div>
      </div>
    </form>
  );
}
