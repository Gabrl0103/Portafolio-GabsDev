"use client";

import { useEffect, useRef, useState } from "react";
import { services, timelines } from "@/data/contact";
import { site } from "@/data/site";
import { isEmail, sendMessage } from "@/lib/send";
import { SelectionFrame } from "../Frame";
import { CheckIcon } from "../Icons";
import { button, cx } from "../ui";

const MAX = 500;
type Field = "name" | "email" | "needs" | "when" | "message";
type Stage = "idle" | "sending" | "sent";
type Errors = Partial<Record<Field, string>>;

/** Enviar un mensaje: formulario a la izquierda y una nota que se escribe sola a la derecha. */
export default function MessageTab() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [needs, setNeeds] = useState<string[]>([]);
  const [when, setWhen] = useState("");
  const [message, setMessage] = useState("");
  const [focus, setFocus] = useState<Field | null>(null);
  const [writing, setWriting] = useState(false);
  const [stage, setStage] = useState<Stage>("idle");
  const [errors, setErrors] = useState<Errors>({});
  const [failed, setFailed] = useState(false);
  const writingTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  // La pluma "escribe" un momento después de cada tecla.
  const scribble = () => {
    setWriting(true);
    clearTimeout(writingTimer.current);
    writingTimer.current = setTimeout(() => setWriting(false), 450);
  };
  useEffect(() => () => clearTimeout(writingTimer.current), []);

  const clearErr = (f: Field) => errors[f] && setErrors((x) => ({ ...x, [f]: undefined }));

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const errs: Errors = {};
    if (name.trim().length < 2) errs.name = "Escribe tu nombre.";
    if (!isEmail(email)) errs.email = "Escribe un correo válido.";
    if (!needs.length) errs.needs = "Elige al menos una opción.";
    if (!when) errs.when = "Elige un plazo.";
    if (message.trim().length < 10) errs.message = "Cuéntame un poco más (mínimo 10 caracteres).";
    setErrors(errs);
    const first = Object.keys(errs)[0];
    if (first) {
      e.currentTarget.querySelector<HTMLElement>(`[data-field="${first}"]`)?.focus();
      return;
    }
    setFailed(false);
    setFocus(null);
    setStage("sending");
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    try {
      await Promise.all([
        sendMessage(`Portafolio: nuevo proyecto de ${name.trim()}`, {
          Nombre: name.trim(),
          Correo: email.trim(),
          Necesita: needs.join(", "),
          Plazo: when,
          Mensaje: message.trim(),
        }),
        new Promise((r) => setTimeout(r, reduce ? 0 : 1500)), // deja terminar la animación del sobre
      ]);
      setStage("sent");
    } catch {
      setFailed(true);
      setStage("idle");
    }
  }

  const reset = () => {
    setName("");
    setEmail("");
    setNeeds([]);
    setWhen("");
    setMessage("");
    setStage("idle");
  };

  const label = "flex items-center gap-1 text-xs font-medium text-soft";
  const err = (f: Field) => errors[f] && <span className="text-xs text-[#c96a4a]">{errors[f]}</span>;
  const pill = (on: boolean) =>
    cx(
      "cursor-pointer rounded-lg border px-3 py-1.5 text-[13px] font-medium transition-[background,border-color,color,transform] duration-300 active:scale-95",
      on ? "border-acc bg-acc text-acc-ink" : "border-line2 bg-transparent text-fg hover:border-acc",
    );

  return (
    <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,400px)_1fr] lg:gap-16">
      {/* Formulario */}
      <div className="overflow-hidden rounded-[22px] border border-line bg-glass">
        <div className="flex items-center justify-between border-b border-line px-5 py-3.5">
          <p className="m-0 text-sm font-semibold text-fg">Nuevo proyecto</p>
          <p className="m-0 text-xs text-mut">Respuesta por correo</p>
        </div>

        {stage === "sent" ? (
          <div role="status" className="flex min-h-[460px] animate-pv-up flex-col items-center justify-center gap-3 p-6 text-center">
            <span className="flex size-14 items-center justify-center rounded-full bg-acc text-acc-ink">
              <CheckIcon size={24} />
            </span>
            <p className="m-0 font-card text-xl font-bold tracking-tight">¡Nota enviada!</p>
            <p className="m-0 max-w-[30ch] text-sm text-soft">Gracias, {name.split(" ")[0]}. Te respondo a {email} lo antes posible.</p>
            <button type="button" className={cx(button({ size: "sm" }), "mt-2")} onClick={reset}>
              Escribir otra
            </button>
          </div>
        ) : (
          <form noValidate onSubmit={onSubmit} className="flex flex-col gap-4 p-5" aria-label="Enviar un mensaje">
            <label className="flex flex-col gap-1.5">
              <span className={label}>
                Tu nombre <b className="text-acc">*</b>
              </span>
              <input
                data-field="name"
                name="name"
                type="text"
                required
                minLength={2}
                className="field min-h-11 py-2.5"
                autoComplete="name"
                value={name}
                aria-invalid={errors.name ? true : undefined}
                onFocus={() => setFocus("name")}
                onBlur={() => setFocus(null)}
                onChange={(e) => {
                  setName(e.target.value.slice(0, 60));
                  scribble();
                  clearErr("name");
                }}
              />
              {err("name")}
            </label>
            <label className="flex flex-col gap-1.5">
              <span className={label}>
                Tu correo <b className="text-acc">*</b>
              </span>
              <input
                data-field="email"
                name="email"
                type="email"
                required
                className="field min-h-11 py-2.5"
                autoComplete="email"
                value={email}
                aria-invalid={errors.email ? true : undefined}
                onFocus={() => setFocus("email")}
                onBlur={() => setFocus(null)}
                onChange={(e) => {
                  setEmail(e.target.value.slice(0, 80));
                  scribble();
                  clearErr("email");
                }}
              />
              {err("email")}
            </label>
            <fieldset className="m-0 flex flex-col gap-2 border-0 p-0" onFocus={() => setFocus("needs")} onBlur={() => setFocus(null)}>
              <legend className={cx(label, "mb-2")}>
                ¿Qué necesitas? <b className="text-acc">*</b>
              </legend>
              <div className="flex flex-wrap gap-2">
                {services.map((s, i) => (
                  <button
                    key={s}
                    type="button"
                    data-field={i === 0 ? "needs" : undefined}
                    aria-pressed={needs.includes(s)}
                    className={pill(needs.includes(s))}
                    onClick={() => {
                      setNeeds((n) => (n.includes(s) ? n.filter((x) => x !== s) : [...n, s]));
                      scribble();
                      clearErr("needs");
                    }}
                  >
                    {s}
                  </button>
                ))}
              </div>
              {err("needs")}
            </fieldset>
            <fieldset className="m-0 flex flex-col gap-2 border-0 p-0" onFocus={() => setFocus("when")} onBlur={() => setFocus(null)}>
              <legend className={cx(label, "mb-2")}>
                ¿Para cuándo? <b className="text-acc">*</b>
              </legend>
              <div className="flex flex-wrap gap-2" role="radiogroup">
                {timelines.map((t, i) => (
                  <button
                    key={t}
                    type="button"
                    role="radio"
                    data-field={i === 0 ? "when" : undefined}
                    aria-checked={when === t}
                    className={pill(when === t)}
                    onClick={() => {
                      setWhen(t);
                      scribble();
                      clearErr("when");
                    }}
                  >
                    {t}
                  </button>
                ))}
              </div>
              {err("when")}
            </fieldset>
            <label className="flex flex-col gap-1.5">
              <span className={label}>
                Mensaje <b className="text-acc">*</b>
              </span>
              <textarea
                data-field="message"
                name="message"
                required
                minLength={10}
                maxLength={MAX}
                className="field min-h-24 resize-none py-2.5"
                placeholder="En pocas líneas: qué es, qué necesitas y para cuándo."
                value={message}
                aria-invalid={errors.message ? true : undefined}
                onFocus={() => setFocus("message")}
                onBlur={() => setFocus(null)}
                onChange={(e) => {
                  setMessage(e.target.value.slice(0, MAX));
                  scribble();
                  clearErr("message");
                }}
              />
              {err("message")}
            </label>
            <div className="flex items-center justify-between gap-3">
              <span className="text-xs text-mut tabular-nums">
                {message.length} / {MAX}
              </span>
              <button type="submit" disabled={stage === "sending"} className={cx(button({ variant: "primary", size: "sm" }), "disabled:opacity-60")}>
                {stage === "sending" ? "Enviando…" : "Enviar mensaje"}
              </button>
            </div>
            {failed && <p className="m-0 text-xs text-[#c96a4a]">No se pudo enviar. Escríbeme directo a {site.email}.</p>}
          </form>
        )}
      </div>

      {/* Nota animada */}
      <NotePreview name={name} email={email} needs={needs} when={when} message={message} focus={focus} writing={writing} stage={stage} />
    </div>
  );
}

/* ---------- Nota, pluma y sobre ---------- */

const PAPER = "#f6f4ec";
const ROW_Y = { name: 25, email: 34, needs: 43, when: 52, message: 63 } as const;

function NotePreview({
  name,
  email,
  needs,
  when,
  message,
  focus,
  writing,
  stage,
}: {
  name: string;
  email: string;
  needs: string[];
  when: string;
  message: string;
  focus: Field | null;
  writing: boolean;
  stage: Stage;
}) {
  const note = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState("");
  const [date, setDate] = useState("");

  useEffect(() => {
    const t = setTimeout(() => setDate(new Date().toLocaleDateString("es-CO", { day: "numeric", month: "short", year: "numeric" })), 0);
    const el = note.current;
    if (!el) return () => clearTimeout(t);
    const ro = new ResizeObserver(() => setSize(`${Math.round(el.offsetWidth)} × ${Math.round(el.offsetHeight)}`));
    ro.observe(el);
    return () => {
      clearTimeout(t);
      ro.disconnect();
    };
  }, []);

  const sending = stage !== "idle";
  // Dónde está la punta de la pluma (en % de la nota).
  const values = { name, email, needs: needs.join(", "), when, message: message.split("\n").pop() ?? "" };
  const lines = Math.min(5, Math.floor(message.length / 34));
  const pen =
    focus && !sending
      ? {
          x: Math.min(88, 32 + Math.min(values[focus].length % 34, 34) * 1.6),
          y: focus === "message" ? ROW_Y.message + lines * 5.2 : ROW_Y[focus],
        }
      : { x: 96, y: 8 };

  const rows: [string, string][] = [
    ["De", name],
    ["Responder a", email],
    ["Necesita", needs.join(", ")],
    ["Plazo", when],
  ];

  return (
    <div className="relative mx-auto aspect-[380/600] w-full max-w-[380px] max-lg:hidden" aria-hidden="true">
      {/* Sobre: fondo y solapa abierta */}
      <svg viewBox="0 0 380 230" className="absolute inset-x-0 bottom-0 w-full overflow-visible drop-shadow-[0_30px_40px_rgba(0,0,0,.25)]">
        <path d="M0 0 L190 -110 L380 0 Z" fill="#d9d5c6" className={cx("transition-opacity duration-300", sending ? "opacity-0" : "opacity-100")} />
        <rect width="380" height="230" rx="10" fill="#dcd8ca" />
      </svg>

      {/* Nota (recortada abajo para que "entre" al sobre) */}
      <div className="absolute -inset-x-6 -top-8 bottom-[1%] overflow-hidden">
        <div
          className={cx(
            "absolute top-8 aspect-[320/420] [transition:translate_.9s_cubic-bezier(.65,0,.35,1),scale_.9s_cubic-bezier(.65,0,.35,1)]",
            sending ? "translate-y-[92%] scale-[.92]" : "translate-y-0 scale-100",
          )}
          // Misma posición que en el diseño (7,9 % y 84,2 % del ancho), descontando el margen del recorte.
          style={{ left: "calc(24px + (100% - 48px) * .079)", width: "calc((100% - 48px) * .842)" }}
        >
          <span className={cx("absolute -top-6 left-0 text-xs font-medium text-hi transition-opacity duration-300", sending && "opacity-0")}>Nota</span>
          <SelectionFrame on={!sending} className="-inset-[6px]" handle="size-2" />
          <div
            ref={note}
            className="relative flex h-full flex-col rounded-[6px] px-[8%] pt-[7%] text-[#2b2d24] shadow-[0_18px_40px_-18px_rgba(0,0,0,.45)]"
            style={{ background: PAPER }}
          >
            <div className="flex justify-between text-[10px] text-[#9a988a]">
              <span>Nota para {site.name}</span>
              <span>{date}</span>
            </div>
            <dl className="m-0 mt-[9%] flex flex-col">
              {rows.map(([k, v]) => (
                <div key={k} className="flex h-[38px] items-end gap-3 border-b border-[#dcd8c8] pb-1">
                  <dt className="w-[78px] flex-none text-[10px] text-[#9a988a]">{k}</dt>
                  <dd className="m-0 min-w-0 truncate font-cine text-[13px]">{v}</dd>
                </div>
              ))}
            </dl>
            <p
              className="m-0 mt-2 line-clamp-6 font-cine text-[13px] leading-[26px] break-words whitespace-pre-wrap"
              style={{ backgroundImage: "repeating-linear-gradient(transparent 0 25px, #dcd8c8 25px 26px)", minHeight: 156 }}
            >
              {message}
            </p>
          </div>
          <span
            className={cx(
              "absolute -bottom-8 left-1/2 -translate-x-1/2 rounded-md bg-hi px-2 py-0.5 text-[11px] font-semibold text-hi-ink tabular-nums transition-opacity duration-300",
              sending && "opacity-0",
            )}
          >
            {size}
          </span>
        </div>
      </div>

      {/* Sobre: bolsillo delantero y solapa que se cierra */}
      <svg viewBox="0 0 380 230" className="pointer-events-none absolute inset-x-0 bottom-0 w-full overflow-visible">
        <path d="M0 40 L190 140 L380 40 V220 Q380 230 370 230 H10 Q0 230 0 220 Z" fill="#ebe8dd" />
        <path d="M0 40 L190 140 L380 40" fill="none" stroke="#cfcab9" strokeWidth="1" />
        <path
          d="M0 0 L190 120 L380 0 Z"
          fill="#e3dfd2"
          stroke="#cfcab9"
          strokeWidth="1"
          className={cx("origin-top transition-transform delay-700 duration-500 ease-out-soft [transform-box:fill-box]", sending ? "scale-y-100" : "scale-y-0")}
        />
      </svg>

      {/* Sello al terminar */}
      <span
        className={cx(
          "absolute bottom-[12%] left-1/2 flex size-14 -translate-x-1/2 items-center justify-center rounded-full bg-acc text-acc-ink shadow-lg transition-[opacity,scale] delay-[1.2s] duration-500 ease-spring",
          stage === "sent" || stage === "sending" ? "scale-100 opacity-100" : "scale-50 opacity-0",
        )}
      >
        <CheckIcon size={24} />
      </span>

      {/* Pluma: va a la línea que estás escribiendo */}
      <div
        className="absolute z-[5] [transition:left_.55s_cubic-bezier(.2,.8,.2,1),top_.55s_cubic-bezier(.2,.8,.2,1),opacity_.4s]"
        style={{ left: `${pen.x * 0.842 + 7.9}%`, top: `${pen.y * 0.7}%`, opacity: sending ? 0 : 1 }}
      >
        <div className={cx("origin-bottom-left", writing ? "animate-scribble" : focus ? "" : "animate-float [animation-duration:4s]")}>
          <Pen />
        </div>
      </div>
    </div>
  );
}

/** Pluma estilográfica; la punta está en la esquina inferior izquierda del dibujo. */
function Pen() {
  return (
    <svg width="120" height="150" viewBox="0 0 120 150" className="-translate-y-full drop-shadow-[8px_14px_10px_rgba(0,0,0,.28)]">
      <g transform="rotate(38 4 146)">
        <path d="M4 146 L-2 130 L10 130 Z" fill="#c9c4b3" />
        <path d="M4 146 L4 133" stroke="#6b6857" strokeWidth=".8" />
        <rect x="-4" y="104" width="16" height="27" rx="3" fill="#1a1b17" />
        <rect x="-5" y="100" width="18" height="5" rx="1.5" fill="#b8b29e" />
        <rect x="-5" y="18" width="18" height="83" rx="6" fill="#121310" />
        <rect x="-5" y="44" width="18" height="3" fill="#b8b29e" />
        <rect x="9" y="22" width="2.5" height="40" rx="1.2" fill="#b8b29e" />
        <rect x="-3" y="22" width="3" height="74" rx="1.5" fill="#ffffff" opacity=".12" />
      </g>
    </svg>
  );
}
