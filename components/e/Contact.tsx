"use client";

import { useState } from "react";
import { useContent } from "@/lib/content";
import { useT } from "@/lib/i18n";
import { isEmail, sendMessage } from "@/lib/send";
import { ArrowOut, PageHead, goTo } from "./parts";

const field =
  "w-full border-0 border-b border-line bg-transparent pt-1 pb-2.5 text-[16px] text-fg outline-none placeholder:text-soft focus:border-fg aria-[invalid=true]:border-fg";

/** Formulario: nombre, correo y mensaje, con validación */
function Form() {
  const t = useT();
  const [v, setV] = useState({ name: "", email: "", message: "" });
  const [err, setErr] = useState<Partial<Record<keyof typeof v, string>>>({});
  const [stage, setStage] = useState<"idle" | "sending" | "sent" | "failed">(
    "idle",
  );
  const set =
    (k: keyof typeof v) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setV((x) => ({ ...x, [k]: e.target.value }));

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const er: typeof err = {};
    if (v.name.trim().length < 2)
      er.name = t("Escribe tu nombre.", "Please enter your name.");
    if (!isEmail(v.email))
      er.email = t("Escribe un correo válido.", "Please enter a valid email.");
    if (v.message.trim().length < 10)
      er.message = t("Cuéntame un poco más.", "Tell me a bit more.");
    setErr(er);
    if (Object.keys(er).length) return;
    setStage("sending");
    try {
      await sendMessage(`Portafolio: ${v.name.trim()}`, {
        Nombre: v.name.trim(),
        Correo: v.email.trim(),
        Mensaje: v.message.trim(),
      });
      setStage("sent");
    } catch {
      setStage("failed");
    }
  }

  if (stage === "sent")
    return (
      <p
        role="status"
        className="border-t border-line pt-5 text-lg font-semibold"
      >
        {t(
          "¡Gracias! Te respondo en menos de 24 horas.",
          "Thanks! I'll reply within 24 hours.",
        )}
      </p>
    );

  const msg = (k: keyof typeof v) =>
    err[k] && <span className="label mt-1 block">{err[k]}</span>;
  return (
    <form
      noValidate
      onSubmit={submit}
      aria-label={t("Enviar un mensaje", "Send a message")}
      className="grid grid-cols-2 gap-x-6 gap-y-6 max-[700px]:grid-cols-1"
    >
      <label className="block">
        <span className="label text-soft">{t("Nombre", "Name")}</span>
        <input
          name="name"
          type="text"
          required
          autoComplete="name"
          value={v.name}
          onChange={set("name")}
          aria-invalid={!!err.name}
          className={field}
        />
        {msg("name")}
      </label>
      <label className="block">
        <span className="label text-soft">{t("Correo", "Email")}</span>
        <input
          name="email"
          type="email"
          required
          autoComplete="email"
          value={v.email}
          onChange={set("email")}
          aria-invalid={!!err.email}
          className={field}
        />
        {msg("email")}
      </label>
      <label className="col-span-full block max-[700px]:col-span-1">
        <span className="label text-soft">{t("Mensaje", "Message")}</span>
        <textarea
          name="message"
          required
          rows={3}
          maxLength={800}
          value={v.message}
          onChange={set("message")}
          aria-invalid={!!err.message}
          className={`${field} resize-none`}
        />
        {msg("message")}
      </label>
      <div className="col-span-full flex items-center gap-4 max-[700px]:col-span-1">
        <button
          type="submit"
          disabled={stage === "sending"}
          className="pill pill-fill disabled:opacity-50"
        >
          {stage === "sending"
            ? t("Enviando…", "Sending…")
            : t("Enviar mensaje ↗", "Send message ↗")}
        </button>
        {stage === "failed" && (
          <span className="label">
            {t(
              "No se pudo enviar. Escríbeme al correo.",
              "It couldn't be sent. Email me instead.",
            )}
          </span>
        )}
      </div>
    </form>
  );
}

/** Contacto (tinta): "Hablemos." en grande, los datos, el formulario y el pie. */
export default function Contact() {
  const t = useT();
  const { site, sections } = useContent();
  const rows: [string, string, string?][] = [
    ["WhatsApp", "+57 310 634 9957", `https://wa.me/${site.whatsapp}`],
    ["GitHub", site.github.replace("https://", ""), site.github],
    [
      t("Horario", "Hours"),
      t(
        "Lun a vie · 9:00 a 17:00 (UTC−5)",
        "Mon to Fri · 9:00 to 17:00 (UTC−5)",
      ),
    ],
  ];
  return (
    <section
      id="contacto"
      className="tinta relative px-8 pt-[22px] pb-10 max-[700px]:px-[18px]"
    >
      <PageHead n={6} label={sections[5].label} />
      <div className="grid grid-cols-2 gap-14 max-[900px]:grid-cols-1">
        <h2 className="display rv text-[150px] max-[900px]:text-[84px]">
          {t("Hable-", "Let's")}
          <br />
          {t("mos.", "talk.")}
        </h2>
        <div className="rv">
          <p className="label mb-2 text-soft">{t("Correo", "Email")}</p>
          <a
            href={`mailto:${site.email}`}
            className="flex items-center justify-between gap-4 border-b border-line pb-4 text-[clamp(22px,2.3vw,32px)] font-bold tracking-[-.025em] break-all"
          >
            {site.email}
            <ArrowOut size={32} className="shrink-0" />
          </a>
          {rows.map(([k, val, href]) => (
            <div
              key={k}
              className="grid grid-cols-[140px_1fr] border-b border-line py-3"
            >
              <span className="label text-soft">{k}</span>
              {href ? (
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm"
                >
                  {val} ↗
                </a>
              ) : (
                <span className="text-sm">{val}</span>
              )}
            </div>
          ))}
          <p className="mt-9 mb-5 text-sm text-soft">
            {t(
              "O déjame un mensaje; respondo en menos de 24 horas.",
              "Or leave me a message; I reply within 24 hours.",
            )}
          </p>
          <Form />
        </div>
      </div>

      <footer className="mt-24 flex flex-wrap items-end justify-between gap-4 border-t border-line pt-4 text-[12px]">
        <span className="text-soft">
          ©{site.year} Gabriel Guerrero ·{" "}
          {t(
            "Hecho con Next.js, TypeScript y Tailwind",
            "Built with Next.js, TypeScript and Tailwind",
          )}
        </span>
        <nav
          aria-label={t("Enlaces rápidos", "Quick links")}
          className="flex flex-wrap gap-x-5 gap-y-2"
        >
          {sections.map((s) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              onClick={(e) => {
                e.preventDefault();
                goTo(s.id);
              }}
            >
              {s.label}
            </a>
          ))}
          <a
            href="#inicio"
            onClick={(e) => {
              e.preventDefault();
              goTo("inicio");
            }}
          >
            ↑ {t("Arriba", "Top")}
          </a>
        </nav>
      </footer>
    </section>
  );
}
