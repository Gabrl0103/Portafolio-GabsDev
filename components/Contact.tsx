"use client";

import { useState } from "react";
import { contact } from "@/data/contact";
import { site } from "@/data/site";
import BookCall from "./contact/BookCall";
import MessageTab from "./contact/MessageTab";
import { FakeCursor, SelectionFrame } from "./Frame";
import Hid, { Koi } from "./fx/Hid";
import { GithubIcon, InstagramIcon, LinkedinIcon, MailIcon, PinIcon, WhatsappIcon } from "./Icons";
import { button, cx, wrap } from "./ui";

const TABS = [
  { id: "llamada", label: "Agendar llamada" },
  { id: "mensaje", label: "Enviar mensaje" },
] as const;
type Tab = (typeof TABS)[number]["id"];

export default function Contact() {
  const [tab, setTab] = useState<Tab>("mensaje");

  const socials = [
    { label: `Correo: ${site.email}`, href: `mailto:${site.email}`, Icon: MailIcon },
    ...(site.whatsapp ? [{ label: "WhatsApp", href: `https://wa.me/${site.whatsapp}`, Icon: WhatsappIcon }] : []),
    { label: "GitHub", href: site.github, Icon: GithubIcon },
    { label: "LinkedIn", href: site.linkedin, Icon: LinkedinIcon },
    { label: "Instagram", href: site.instagram, Icon: InstagramIcon },
  ].filter((s) => s.href);

  return (
    <section id="contacto" data-koi="calm" className={cx(wrap, "relative py-28 md:py-36")} data-sec>
      <span className="rv mb-2 block pl-1 text-sm font-medium text-acc">Contacto</span>

      <div className="rv relative">
        <SelectionFrame className="-inset-[7px] rounded-[34px] max-sm:hidden" />
        <div className="glass relative overflow-hidden rounded-[28px]">
          {/* Encabezado */}
          <header className="flex flex-wrap items-start justify-between gap-5 border-b border-line px-6 py-6 sm:px-8">
            <div className="flex flex-col gap-1.5">
              <h2 className="text-[clamp(26px,3.2vw,40px)] leading-tight">{contact.title}</h2>
              <p key={tab} className="m-0 animate-pv-up text-sm text-mut [animation-duration:.6s]">
                {tab === "llamada" ? contact.subtitleCall : contact.subtitleMessage}
              </p>
              <p className="m-0 mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-soft">
                <a href={`mailto:${site.email}`} className="underline decoration-line2 underline-offset-4 transition-colors hover:text-fg hover:decoration-acc">
                  {site.email}
                </a>
                <span className="flex items-center gap-1.5 text-mut">
                  <PinIcon size={14} /> {site.city}
                </span>
              </p>
            </div>
            <ul className="m-0 flex list-none gap-2 p-0" aria-label="Redes y contacto">
              {socials.map(({ label, href, Icon }) => (
                <li key={label}>
                  <a
                    href={href}
                    aria-label={label}
                    className={button({ size: "icon" })}
                    {...(href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  >
                    <Icon size={17} />
                  </a>
                </li>
              ))}
            </ul>
          </header>

          {/* Pestañas */}
          <div className="border-b border-line px-6 py-3.5 sm:px-8">
            <div role="tablist" aria-label="Forma de contacto" className="inline-flex rounded-xl bg-glass2 p-1">
              {TABS.map((t) => (
                <button
                  key={t.id}
                  id={`tab-${t.id}`}
                  role="tab"
                  type="button"
                  aria-selected={tab === t.id}
                  aria-controls={`panel-${t.id}`}
                  onClick={() => setTab(t.id)}
                  className={cx(
                    "cursor-pointer rounded-lg px-4 py-2 text-sm font-medium tracking-normal transition-[background,color,box-shadow] duration-300",
                    tab === t.id ? "bg-bg text-fg shadow-[0_2px_10px_-4px_var(--shadow)]" : "text-mut hover:text-fg",
                  )}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Contenido */}
          <div
            key={tab}
            id={`panel-${tab}`}
            role="tabpanel"
            aria-labelledby={`tab-${tab}`}
            className="animate-pv-up px-4 py-8 [animation-duration:.7s] sm:px-8 sm:py-10 lg:px-12"
          >
            {tab === "llamada" ? <BookCall /> : <MessageTab />}
          </div>
        </div>

        <FakeCursor label="Cliente" color="acc2" x="-3%" y="62%" />
        <FakeCursor label={site.name} color="acc" x="100.5%" y="101%" delay />
      </div>

      <Hid x="12%" y="8%">2:22</Hid>
      <Hid x="84%" y="96%">
        <Koi w={58} />
      </Hid>
    </section>
  );
}
