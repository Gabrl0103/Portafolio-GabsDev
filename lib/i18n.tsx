"use client";

import { createContext, useContext, useEffect } from "react";

/**
 * Idiomas del portafolio. Español en "/" e inglés en "/en".
 * Los textos de la interfaz se escriben en pares: t("Proyectos", "Projects").
 * Los datos (proyectos, servicios…) se traducen en data/en.ts y se leen con useContent().
 */
export type Lang = "es" | "en";

const LangContext = createContext<Lang>("es");

export function LangProvider({
  lang,
  children,
}: {
  lang: Lang;
  children: React.ReactNode;
}) {
  // El <html lang> lo fija el layout en español; en /en se corrige aquí
  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);
  return <LangContext.Provider value={lang}>{children}</LangContext.Provider>;
}

export const useLang = () => useContext(LangContext);

/** Devuelve t(es, en): el texto en el idioma actual. */
export function useT() {
  const lang = useLang();
  return (es: string, en: string) => (lang === "en" ? en : es);
}

/** Dirección de la misma página en el otro idioma. */
export const otherLangHref = (lang: Lang) => (lang === "en" ? "/" : "/en");
