"use client";

import { useState } from "react";
import { useContent } from "@/lib/content";
import { useT } from "@/lib/i18n";
import { isEmail, sendMessage } from "@/lib/send";
import { cx } from "../ui";
import Calendar from "./Calendar";
import Footer from "./Footer";
import Mark from "./Mark";
import { ArrowOut, PageHead } from "./parts";

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
  const [tab, setTab] = useState<"msg" | "cal">("msg");
  const { site, sections } = useContent();
  const rows: [string, string, string?][] = [
    ["WhatsApp", "+57 310 634 9957", `https://wa.me/${site.whatsapp}`],
    ["GitHub", site.github.replace("https://", ""), site.github],
    ...(site.linkedin
      ? ([
          [
            "LinkedIn",
            site.linkedin.replace(/^https:\/\/(www\.)?/, ""),
            site.linkedin,
          ],
        ] as [string, string, string][])
      : []),
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
      className="tinta relative flex min-h-svh flex-col px-8 pt-[94px] max-[700px]:pt-[94px] pb-10 max-[700px]:px-[18px]"
    >
      <PageHead n={6} label={sections[5].label} />
      <div className="my-auto grid grid-cols-2 gap-14 max-[900px]:grid-cols-1">
        <h2 className="display rv text-[150px] max-[900px]:text-[84px]">
          {t("Hable-", "Let's")}
          <br />
          {t("mos.", "talk.")}
        </h2>
        <div className="rv">
          <p className="label mb-2 text-soft">{t("Correo", "Email")}</p>
          <a
            href={site.emailCompose}
            target="_blank"
            rel="noopener noreferrer"
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
          {/* Mensaje o llamada */}
          <div
            role="tablist"
            aria-label={t("Cómo contactarme", "How to reach me")}
            className="mt-9 mb-6 flex gap-7 border-b border-line"
          >
            {(
              [
                ["msg", t("Escribir mensaje", "Write a message")],
                ["cal", t("Agendar llamada", "Book a call")],
              ] as const
            ).map(([k, label]) => (
              <button
                key={k}
                type="button"
                role="tab"
                id={`tab-${k}`}
                aria-selected={tab === k}
                aria-controls={`panel-${k}`}
                onClick={() => setTab(k)}
                className={cx(
                  "relative -mb-px pb-3 text-[15px] font-bold tracking-[-.02em] transition-colors duration-300",
                  tab === k ? "text-fg" : "text-soft hover:text-fg",
                )}
              >
                {label}
                <span
                  aria-hidden="true"
                  className={cx(
                    "absolute bottom-0 left-0 h-[2px] w-full origin-left bg-fg transition-transform duration-500 ease-expo",
                    tab === k ? "scale-x-100" : "scale-x-0",
                  )}
                />
              </button>
            ))}
          </div>
          <div
            key={tab}
            role="tabpanel"
            id={`panel-${tab}`}
            aria-labelledby={`tab-${tab}`}
            className="rise"
          >
            {tab === "msg" ? (
              <>
                <p className="mb-5 text-sm text-soft">
                  {t("Cuéntame qué necesitas; ", "Tell me what you need; ")}
                  <Mark>
                    {t(
                      "respondo en menos de 24 horas.",
                      "I reply within 24 hours.",
                    )}
                  </Mark>
                </p>
                <Form />
              </>
            ) : (
              <Calendar />
            )}
          </div>
        </div>
      </div>

      <Footer />
    </section>
  );
}
