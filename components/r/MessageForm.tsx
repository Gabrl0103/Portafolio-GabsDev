"use client";

import { useState } from "react";
import { useT } from "@/lib/i18n";
import { isEmail, sendMessage } from "@/lib/send";
import { cx } from "../ui";
import { btn, btnF } from "./btn";

type Field = "name" | "email" | "message";
type Errors = Partial<Record<Field, string>>;

const input =
  "w-full rounded-xl border border-line bg-[rgba(var(--fgr),.05)] px-4 text-base text-fg placeholder:text-mut focus:outline-2 focus:outline-offset-2 focus:outline-orange aria-[invalid=true]:border-orange";

/** Formulario de contacto: nombre, correo y mensaje, con validación y confirmación. */
export default function MessageForm() {
  const t = useT();
  const [values, setValues] = useState({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState<Errors>({});
  const [stage, setStage] = useState<"idle" | "sending" | "sent">("idle");
  const [failed, setFailed] = useState(false);

  const set = (f: Field) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setValues((v) => ({ ...v, [f]: e.target.value }));
    if (errors[f]) setErrors((x) => ({ ...x, [f]: undefined }));
  };

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const errs: Errors = {};
    if (values.name.trim().length < 2) errs.name = t("Escribe tu nombre.", "Please enter your name.");
    if (!isEmail(values.email)) errs.email = t("Escribe un correo válido.", "Please enter a valid email.");
    if (values.message.trim().length < 10) errs.message = t("Cuéntame un poco más (mínimo 10 caracteres).", "Tell me a bit more (at least 10 characters).");
    setErrors(errs);
    const first = Object.keys(errs)[0];
    if (first) {
      e.currentTarget.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      return;
    }
    setFailed(false);
    setStage("sending");
    try {
      await sendMessage(`Portafolio: mensaje de ${values.name.trim()}`, {
        Nombre: values.name.trim(),
        Correo: values.email.trim(),
        Mensaje: values.message.trim(),
      });
      setStage("sent");
    } catch {
      setFailed(true);
      setStage("idle");
    }
  }

  if (stage === "sent")
    return (
      <div role="status" className="mt-[22px] rounded-[14px] border border-dashed border-line p-5">
        <b className="block font-disp text-[clamp(22px,2vw,28px)] font-medium tracking-[-.03em]">{t("¡Mensaje listo!", "Message sent!")}</b>
        <p className="mt-2 text-soft">{t("Gracias", "Thanks")}, {values.name.trim().split(" ")[0]}. {t("Te respondo a", "I'll reply to")} {values.email.trim()} {t("en menos de 24 horas.", "within 24 hours.")}</p>
        <button
          type="button"
          onClick={() => {
            setValues({ name: "", email: "", message: "" });
            setStage("idle");
          }}
          className={cx(btn, "mt-4 h-10")}
        >
          {t("Escribir otro", "Write another")}
        </button>
      </div>
    );

  const err = (f: Field) =>
    errors[f] && (
      <span id={`mf-${f}-err`} className="mt-1.5 block text-sm text-orange">
        {errors[f]}
      </span>
    );
  const field = (f: Field) => ({
    id: `mf-${f}`,
    name: f,
    value: values[f],
    onChange: set(f),
    required: true,
    "aria-invalid": !!errors[f],
    "aria-describedby": errors[f] ? `mf-${f}-err` : undefined,
  });

  return (
    <form noValidate onSubmit={onSubmit} aria-label={t("Enviar un mensaje", "Send a message")} className="mt-[22px] flex flex-col gap-4">
      <div>
        <label htmlFor="mf-name" className="mono mb-2 block text-mut">
          {t("Nombre", "Name")}
        </label>
        <input {...field("name")} type="text" autoComplete="name" placeholder={t("Nombre y apellido", "Full name")} className={cx(input, "h-[46px]")} />
        {err("name")}
      </div>
      <div>
        <label htmlFor="mf-email" className="mono mb-2 block text-mut">
          {t("Correo", "Email")}
        </label>
        <input {...field("email")} type="email" autoComplete="email" placeholder={t("tu@correo.com", "you@email.com")} className={cx(input, "h-[46px]")} />
        {err("email")}
      </div>
      <div>
        <label htmlFor="mf-message" className="mono mb-2 block text-mut">
          {t("Mensaje", "Message")}
        </label>
        <textarea {...field("message")} rows={5} maxLength={800} placeholder={t("Cuéntame qué necesitas", "Tell me what you need")} className={cx(input, "resize-none py-3")} />
        {err("message")}
      </div>
      {failed && <p className="text-sm text-orange">{t("No se pudo enviar. Inténtalo de nuevo o escríbeme directo al correo.", "It couldn't be sent. Try again or email me directly.")}</p>}
      <button type="submit" disabled={stage === "sending"} className={cx(btnF, "h-[52px] w-full justify-center disabled:opacity-50")}>
        {stage === "sending" ? t("Enviando…", "Sending…") : t("Enviar mensaje", "Send message")}
      </button>
    </form>
  );
}
