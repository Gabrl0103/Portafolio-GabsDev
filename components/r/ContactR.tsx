"use client";

import { useState } from "react";
import { useContent } from "@/lib/content";
import { useT } from "@/lib/i18n";
import { cx } from "../ui";
import { btn, btnF, lab } from "./btn";
import Calendar from "./Calendar";
import FooterR from "./FooterR";
import MessageForm from "./MessageForm";
import SplitTitle from "./SplitTitle";
import Tape from "./Tape";
import { copyText } from "./theme";



/** Contacto: datos y enlaces a la izquierda; a la derecha, agendar una llamada o escribir un mensaje. */
export default function ContactR() {
  const t = useT();
  const { site, sections } = useContent();
  const info = [
    [t("Ubicación", "Location"), "Pasto, Colombia (UTC−5)"],
    [t("Horario", "Hours"), t("Lun a vie · 9:00 a 17:00", "Mon to Fri · 9:00 to 17:00")],
  ];
  const [copied, setCopied] = useState(false);
  const [tab, setTab] = useState<"call" | "message">("call");

  return (
    <section
      id="contacto"
      className="cuero banda relative isolate overflow-hidden pt-[clamp(90px,11vw,170px)] [--banda-fin:#33281f] [--cuero-fin:#000] [--gc:var(--orange)] [--gx:15%] [--gy:20%]"
    >
      <div className="wrap">
        <div className={cx(lab, "rv")}>
          <b>(06)</b> {sections.find((s) => s.id === "contacto")?.label}
        </div>
        <SplitTitle lines={[t("¿Hablamos?", "Let's talk")]} className="mt-[26px] !text-[clamp(56px,12vw,210px)] !leading-[.88] !tracking-[-.055em]" />

        <div className="mt-[clamp(30px,4vw,60px)] grid grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] items-start gap-[clamp(30px,5vw,90px)] max-[900px]:grid-cols-1">
          <div data-a="left" className="rv">
            <p className="max-w-[20em] font-disp text-[clamp(22px,2.4vw,36px)] leading-[1.15] font-medium tracking-[-.03em]">
              {t("Cuéntame qué necesitas, agenda una llamada de 30 minutos o escríbeme. Respondo en menos de 24 horas.", "Tell me what you need, book a 30-minute call or write to me. I reply within 24 hours.")}
            </p>
            <dl className="mt-[34px] border-t border-line">
              <div className="grid grid-cols-[130px_1fr] items-center gap-3 border-b border-line py-4 max-[900px]:grid-cols-1 max-[900px]:gap-0.5">
                <dt className="mono text-mut">{t("Correo", "Email")}</dt>
                <dd className="m-0">
                  <button
                    type="button"
                    aria-label={t("Copiar correo", "Copy email")}
                    onClick={async () => {
                      if (await copyText(site.email)) {
                        setCopied(true);
                        setTimeout(() => setCopied(false), 1600);
                      }
                    }}
                    className="inline-flex cursor-pointer flex-wrap items-baseline gap-3 border-0 bg-transparent p-0 text-left transition-colors duration-300 hover:text-orange"
                  >
                    <code className="font-disp text-[clamp(18px,1.8vw,22px)] font-medium tracking-[-.02em] break-all">{site.email}</code>
                    <span className="mono" aria-live="polite">
                      {copied ? t("¡Copiado!", "Copied!") : t("Copiar", "Copy")}
                    </span>
                  </button>
                </dd>
              </div>
              {info.map(([k, v]) => (
                <div key={k} className="grid grid-cols-[130px_1fr] items-center gap-3 border-b border-line py-4 max-[900px]:grid-cols-1 max-[900px]:gap-0.5">
                  <dt className="mono text-mut">{k}</dt>
                  <dd className="m-0 font-disp text-lg font-medium">{v}</dd>
                </div>
              ))}
            </dl>
            <div className="mt-[34px] flex flex-wrap gap-2.5">
              <a href={site.github} target="_blank" rel="noopener noreferrer" className={btn}>
                GitHub ↗
              </a>
              <a href={`https://wa.me/${site.whatsapp}`} target="_blank" rel="noopener noreferrer" className={btn}>
                WhatsApp ↗
              </a>
              <a href={site.cv} download="CV-Gabriel-Guerrero.pdf" className={cx(btnF, "mag")}>
                {t("Descargar CV ↓", "Download CV ↓")}
              </a>
            </div>
          </div>

          <div
            data-a="right"
            className="rv cuero-tarjeta relative rounded-3xl border border-line bg-[rgba(var(--bgr),.78)] p-[clamp(18px,2.2vw,30px)] shadow-[0_40px_80px_-50px_rgba(0,0,0,.7)] backdrop-blur-[16px]"
          >
            <Tape v={2} className="-top-3 right-12 rotate-[5deg]" />
            <div role="tablist" aria-label={t("Forma de contacto", "How to contact me")} className="flex gap-1 rounded-full border border-line p-1">
              {(
                [
                  ["call", t("Agenda una llamada", "Book a call"), t("Llamada", "Call")],
                  ["message", t("Escríbeme", "Write to me"), t("Mensaje", "Message")],
                ] as const
              ).map(([id, label, short]) => (
                <button
                  key={id}
                  type="button"
                  role="tab"
                  id={`tab-${id}`}
                  aria-selected={tab === id}
                  aria-controls={`panel-${id}`}
                  onClick={() => setTab(id)}
                  className={cx(
                    "h-10 flex-1 cursor-pointer rounded-full border-0 font-disp text-[15px] font-medium transition-colors duration-300",
                    tab === id ? "bg-fg text-bg" : "bg-transparent text-soft hover:text-fg",
                  )}
                >
                  <span className="max-[420px]:hidden">{label}</span>
                  <span className="hidden max-[420px]:inline">{short}</span>
                </button>
              ))}
            </div>
            <div role="tabpanel" id={`panel-${tab}`} aria-labelledby={`tab-${tab}`}>
              {tab === "call" ? <Calendar /> : <MessageForm />}
            </div>
          </div>
        </div>
      </div>
      <FooterR />
    </section>
  );
}
