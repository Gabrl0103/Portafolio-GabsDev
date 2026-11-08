"use client";

import { useState } from "react";
import { isEmail, sendMessage } from "@/lib/send";
import { cx } from "../ui";
import { btn, btnF } from "./btn";

type Field = "name" | "email" | "message";
type Errors = Partial<Record<Field, string>>;

const input =
  "w-full rounded-xl border border-line bg-[rgba(var(--fgr),.05)] px-4 text-base text-fg placeholder:text-mut focus:outline-2 focus:outline-offset-2 focus:outline-orange aria-[invalid=true]:border-orange";

/** Formulario de contacto: nombre, correo y mensaje, con validación y confirmación. */
export default function MessageForm() {
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
    if (values.name.trim().length < 2) errs.name = "Escribe tu nombre.";
    if (!isEmail(values.email)) errs.email = "Escribe un correo válido.";
    if (values.message.trim().length < 10) errs.message = "Cuéntame un poco más (mínimo 10 caracteres).";
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
        <b className="block font-disp text-[clamp(22px,2vw,28px)] font-medium tracking-[-.03em]">¡Mensaje listo!</b>
        <p className="mt-2 text-soft">Gracias, {values.name.trim().split(" ")[0]}. Te respondo a {values.email.trim()} en menos de 24 horas.</p>
        <button
          type="button"
          onClick={() => {
            setValues({ name: "", email: "", message: "" });
            setStage("idle");
          }}
          className={cx(btn, "mt-4 h-10")}
        >
          Escribir otro
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
    <form noValidate onSubmit={onSubmit} aria-label="Enviar un mensaje" className="mt-[22px] flex flex-col gap-4">
      <div>
        <label htmlFor="mf-name" className="mono mb-2 block text-mut">
          Nombre
        </label>
        <input {...field("name")} type="text" autoComplete="name" placeholder="Nombre y apellido" className={cx(input, "h-[46px]")} />
        {err("name")}
      </div>
      <div>
        <label htmlFor="mf-email" className="mono mb-2 block text-mut">
          Correo
        </label>
        <input {...field("email")} type="email" autoComplete="email" placeholder="tu@correo.com" className={cx(input, "h-[46px]")} />
        {err("email")}
      </div>
      <div>
        <label htmlFor="mf-message" className="mono mb-2 block text-mut">
          Mensaje
        </label>
        <textarea {...field("message")} rows={5} maxLength={800} placeholder="Cuéntame qué necesitas" className={cx(input, "resize-none py-3")} />
        {err("message")}
      </div>
      {failed && <p className="text-sm text-orange">No se pudo enviar. Inténtalo de nuevo o escríbeme directo al correo.</p>}
      <button type="submit" disabled={stage === "sending"} className={cx(btnF, "h-[52px] w-full justify-center disabled:opacity-50")}>
        {stage === "sending" ? "Enviando…" : "Enviar mensaje"}
      </button>
    </form>
  );
}
