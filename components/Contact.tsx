"use client";

import { useState } from "react";
import { site } from "@/data/site";
import Hid, { Koi } from "./fx/Hid";
import TypeTitle from "./fx/TypeTitle";
import { GithubIcon, LinkedinIcon, MailIcon, WhatsappIcon } from "./Icons";

/** Si defines NEXT_PUBLIC_FORMSPREE_ID el formulario envía por Formspree; si no, abre el correo. */
const FORMSPREE_ID = process.env.NEXT_PUBLIC_FORMSPREE_ID;

type Status = "idle" | "sending" | "sent" | "error";
type Errors = Partial<Record<"name" | "email" | "message", string>>;

function validate(data: FormData): Errors {
  const errors: Errors = {};
  const name = String(data.get("name") ?? "").trim();
  const email = String(data.get("email") ?? "").trim();
  const message = String(data.get("message") ?? "").trim();
  if (name.length < 2) errors.name = "Escribe tu nombre.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = "Escribe un correo válido.";
  if (message.length < 10) errors.message = "El mensaje debe tener al menos 10 caracteres.";
  return errors;
}

export default function Contact() {
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Errors>({});

  const channels = [
    { label: site.email, href: `mailto:${site.email}`, Icon: MailIcon, ext: false },
    { label: "LinkedIn", href: site.linkedin, Icon: LinkedinIcon, ext: true },
    { label: "GitHub", href: site.github, Icon: GithubIcon, ext: true },
    ...(site.whatsapp ? [{ label: "WhatsApp", href: `https://wa.me/${site.whatsapp}`, Icon: WhatsappIcon, ext: true }] : []),
  ];

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const errs = validate(data);
    setErrors(errs);
    if (Object.keys(errs).length) {
      form.querySelector<HTMLElement>(`[name="${Object.keys(errs)[0]}"]`)?.focus();
      return;
    }
    setStatus("sending");
    try {
      if (FORMSPREE_ID) {
        const res = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
          method: "POST",
          body: data,
          headers: { Accept: "application/json" },
        });
        if (!res.ok) throw new Error("Formspree");
      } else {
        const subject = encodeURIComponent(`Portafolio: mensaje de ${data.get("name")}`);
        const body = encodeURIComponent(`${data.get("message")}\n\n${data.get("name")} · ${data.get("email")}`);
        window.location.href = `mailto:${site.email}?subject=${subject}&body=${body}`;
      }
      form.reset();
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  }

  const field = (name: keyof Errors) => ({
    name,
    id: `f-${name}`,
    "aria-invalid": errors[name] ? true : undefined,
    "aria-describedby": errors[name] ? `e-${name}` : undefined,
    onInput: () => errors[name] && setErrors((x) => ({ ...x, [name]: undefined })),
  });
  const err = (name: keyof Errors) =>
    errors[name] && (
      <span id={`e-${name}`} className="text-sm text-[#c96a4a]">
        {errors[name]}
      </span>
    );

  return (
    <section id="contacto" className="wrap contact" data-sec>
      <span className="eyebrow rv">Contacto</span>
      <TypeTitle text="Hablemos." className="rv" />
      <p className="lead rv">Si tienes un proyecto, una práctica o una idea, escríbeme.</p>

      <div className="mt-6 grid w-full max-w-5xl grid-cols-1 gap-4 text-left md:grid-cols-[1fr_1.4fr]">
        <ul className="glass rv m-0 flex list-none flex-col gap-2 rounded-[30px] p-4">
          {channels.map(({ label, href, Icon, ext }) => (
            <li key={href}>
              <a
                href={href}
                {...(ext ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                className="flex min-h-14 items-center gap-4 rounded-[20px] px-4 py-3 text-fg transition-colors hover:bg-glass2"
              >
                <span className="flex size-10 flex-none items-center justify-center rounded-full bg-acc text-acc-ink">
                  <Icon size={18} />
                </span>
                <span className="min-w-0 break-words">{label}</span>
                {ext && <span className="ml-auto text-mut">↗</span>}
              </a>
            </li>
          ))}
          <li className="mt-auto px-4 pt-4 pb-2 text-sm text-mut">📍 {site.city}</li>
        </ul>

        <form noValidate onSubmit={onSubmit} className="glass rv flex flex-col gap-4 rounded-[30px] p-6 md:p-8" aria-label="Formulario de contacto">
          {status === "sent" ? (
            <div role="status" className="flex flex-1 flex-col items-center justify-center gap-4 py-10 text-center">
              <span className="flex size-16 items-center justify-center rounded-full bg-acc text-3xl text-acc-ink">✓</span>
              <p className="m-0 text-2xl font-semibold tracking-tight">¡Mensaje enviado!</p>
              <p className="m-0 max-w-[36ch] text-soft">
                {FORMSPREE_ID ? "Gracias por escribir. Te respondo pronto." : "Se abrió tu app de correo con el mensaje listo para enviar."}
              </p>
              <button type="button" className="btn sm mt-2" onClick={() => setStatus("idle")}>
                Escribir otro
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <label className="flex flex-col gap-2" htmlFor="f-name">
                  <span className="text-sm font-medium text-soft">Nombre</span>
                  <input className="field" type="text" required minLength={2} autoComplete="name" placeholder="Tu nombre" {...field("name")} />
                  {err("name")}
                </label>
                <label className="flex flex-col gap-2" htmlFor="f-email">
                  <span className="text-sm font-medium text-soft">Correo</span>
                  <input className="field" type="email" required autoComplete="email" placeholder="tu@correo.com" {...field("email")} />
                  {err("email")}
                </label>
              </div>
              <label className="flex flex-col gap-2" htmlFor="f-message">
                <span className="text-sm font-medium text-soft">Mensaje</span>
                <textarea className="field min-h-36 resize-y" required minLength={10} placeholder="Cuéntame tu idea…" {...field("message")} />
                {err("message")}
              </label>
              <button type="submit" className="btn primary self-start" disabled={status === "sending"}>
                {status === "sending" ? "Enviando…" : "Enviar mensaje"}
              </button>
              {status === "error" && (
                <p role="alert" className="m-0 text-sm text-[#c96a4a]">
                  No se pudo enviar. Escríbeme directo a {site.email}.
                </p>
              )}
            </>
          )}
        </form>
      </div>

      <Hid x="12%" y="22%">2:22</Hid>
      <Hid x="84%" y="76%">
        <Koi w={58} />
      </Hid>
      <Hid x="70%" y="12%">222</Hid>
    </section>
  );
}
