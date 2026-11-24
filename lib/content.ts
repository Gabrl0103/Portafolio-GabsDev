"use client";

import { useMemo } from "react";
import { now, openTo, stats } from "@/data/about";
import {
  aboutEn,
  experienceEn,
  monthsEn,
  projectsEn,
  sectionsEn,
  servicesEn,
  siteEn,
  testimonialsEn,
} from "@/data/en";
import { experience } from "@/data/experience";
import { projects } from "@/data/projects";
import { services } from "@/data/services";
import { sections, site } from "@/data/site";
import { testimonials } from "@/data/testimonials";
import type { Experience, Project, Testimonial } from "@/types";
import { useLang } from "./i18n";

const date = (d: string) =>
  d.replace(/^(Ene|Abr|Ago|Dic|Hoy)\b/, (m) => monthsEn[m] ?? m);

/** Proyectos con sus textos en inglés (lo que no esté traducido queda en español). */
function projectsInEnglish(): Project[] {
  return projects.map((p) => {
    const t = projectsEn[p.id];
    if (!t) return p;
    let alt = 0;
    return {
      ...p,
      description: t.description,
      summary: t.summary ?? p.summary,
      summaryMark: t.summaryMark ?? p.summaryMark,
      kind: t.kind,
      tags: t.tags ?? p.tags,
      detail: t.detail,
      media: p.media?.map((m) => ({ ...m, alt: t.alts?.[alt++] ?? m.alt })),
      demo: p.demo && { ...p.demo, ...t.demo },
      primary: p.primary && { ...p.primary, ...t.primary },
      secondary: p.secondary && { ...p.secondary, ...t.secondary },
    };
  });
}

/** Todos los datos del portafolio en el idioma actual. */
export function useContent() {
  const lang = useLang();
  return useMemo(() => {
    if (lang === "es")
      return {
        site,
        sections,
        projects,
        services,
        testimonials,
        experience,
        now,
        openTo,
        stats,
      };
    return {
      site: { ...site, ...siteEn },
      sections: sections.map((s) => ({
        ...s,
        label: sectionsEn[s.id] ?? s.label,
      })),
      projects: projectsInEnglish(),
      services: services.map((s, i) => {
        const t = servicesEn[i];
        if (!t) return s;
        const toolNames = servicesEn[0].tools ?? {};
        return {
          ...s,
          title: t.title,
          text: t.text,
          items: t.items,
          tools: s.tools.map((x) => ({
            ...x,
            name: toolNames[x.name] ?? x.name,
          })),
        };
      }),
      testimonials: testimonials.map(
        (x, i): Testimonial => ({ ...x, ...testimonialsEn[i] }),
      ),
      experience: experience.map(
        (x, i): Experience => ({
          ...x,
          ...experienceEn[i],
          start: date(x.start),
          end: date(x.end),
        }),
      ),
      now: now.map((n, i) => ({ ...n, ...aboutEn.now[i] })),
      openTo: aboutEn.openTo,
      stats: aboutEn.stats,
    };
  }, [lang]);
}
