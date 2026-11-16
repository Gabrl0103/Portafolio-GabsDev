"use client";

import { useState } from "react";
import { site } from "@/data/site";
import { cx } from "../ui";
import { btn, btnF, lab } from "./btn";
import Calendar from "./Calendar";
import FooterR from "./FooterR";
import MessageForm from "./MessageForm";
import SplitTitle from "./SplitTitle";
import { copyText } from "./theme";

const INFO = [
  ["Ubicación", "Pasto, Colombia (UTC−5)"],
  ["Horario", "Lun a vie · 9:00 a 17:00"],
];

/** Contacto: datos y enlaces a la izquierda; a la derecha, agendar una llamada o escribir un mensaje. */
export default function ContactR() {
  const [copied, setCopied] = useState(false);
  const [tab, setTab] = useState<"call" | "message">("call");

  return (
    <section
      id="contacto"
      className="relative isolate overflow-hidden pt-[clamp(90px,11vw,170px)] before:absolute before:inset-0 before:-z-1 before:bg-(image:--tex) before:bg-[length:420px] before:opacity-[.32] before:mix-blend-soft-light after:absolute after:inset-0 after:-z-1 after:bg-[linear-gradient(180deg,var(--bg)_0,transparent_30%,transparent_70%,rgba(var(--bgr),.6))]"
    >
      <div className="wrap">
        <div className={cx(lab, "rv")}>
          <b>(07)</b> Contacto
        </div>
        <SplitTitle lines={["¿Hablamos?"]} className="mt-[26px] !text-[clamp(56px,12vw,210px)] !leading-[.88] !tracking-[-.055em]" />

        <div className="mt-[clamp(30px,4vw,60px)] grid grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] items-start gap-[clamp(30px,5vw,90px)] max-[900px]:grid-cols-1">
          <div data-a="left" className="rv">
            <p className="max-w-[20em] font-disp text-[clamp(22px,2.4vw,36px)] leading-[1.15] font-medium tracking-[-.03em]">
              Cuéntame qué necesitas, agenda una llamada de 30 minutos o escríbeme. Respondo en menos de 24 horas.
            </p>
            <dl className="mt-[34px] border-t border-line">
              <div className="grid grid-cols-[130px_1fr] items-center gap-3 border-b border-line py-4 max-[900px]:grid-cols-1 max-[900px]:gap-0.5">
                <dt className="mono text-mut">Correo</dt>
                <dd className="m-0">
                  <button
                    type="button"
                    aria-label="Copiar correo"
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
                      {copied ? "¡Copiado!" : "Copiar"}
                    </span>
                  </button>
                </dd>
              </div>
              {INFO.map(([k, v]) => (
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
              <a href={site.cv} download className={cx(btnF, "mag")}>
                Descargar CV ↓
              </a>
            </div>
          </div>

          <div
            data-a="right"
            className="rv rounded-3xl border border-line bg-[rgba(var(--bgr),.78)] p-[clamp(18px,2.2vw,30px)] shadow-[0_40px_80px_-50px_rgba(0,0,0,.7)] backdrop-blur-[16px]"
          >
            <div role="tablist" aria-label="Forma de contacto" className="flex gap-1 rounded-full border border-line p-1">
              {(
                [
                  ["call", "Agenda una llamada"],
                  ["message", "Escríbeme"],
                ] as const
              ).map(([id, label]) => (
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
                  {label}
                </button>
              ))}
            </div>
            <div role="tabpanel" id={`panel-${tab}`} aria-labelledby={`tab-${tab}`}>
              {tab === "call" ? <Calendar /> : <MessageForm />}
            </div>
          </div>
        </div>

        <FooterR />
      </div>
    </section>
  );
}
