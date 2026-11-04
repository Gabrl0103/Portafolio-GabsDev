import type { SkillGroup, Stat } from "@/types";

/* ---------- Sobre mí: cuatro tarjetas ---------- */

/** Tarjeta "Perfil" */
export const profile = {
  greeting: "Hola, soy Gabs.",
  role: "Estudiante de Ingeniería de Software",
  place: "Pasto, Colombia",
};

/** Tarjeta "Sobre mí" */
export const intro = {
  headline: "Diseño y construyo apps web, móvil y de escritorio que se sienten claras y rápidas.",
  text: "Estudio quinto semestre de Ingeniería de Software en la Universidad Cooperativa de Colombia y dirijo Neveo, mi marca de helados y açaí. Me gusta llevar una idea desde el diseño hasta el código en producción.",
  worksWith: ["Next.js", "TypeScript", "Tailwind CSS", "Python", "Django", "IA"],
  openTo: ["Prácticas", "Freelance", "Proyectos", "Colaboraciones"],
};

/** Tarjeta "En números" (datos reales; actualízalos cuando cambien) */
export const stats: Stat[] = [
  { value: 5, suffix: ".º", label: "semestre de Ingeniería" },
  { value: 4, label: "proyectos en curso" },
  { value: 1, label: "marca propia: Neveo" },
];

/* ---------- Habilidades (sección adicional) ---------- */

/** Sin barras ni porcentajes: cada herramienta dice para qué la uso. */
export const skillGroups: SkillGroup[] = [
  {
    title: "Frontend",
    skills: [
      { name: "Next.js", icon: "nextjs", use: "Sitios y apps con App Router" },
      { name: "TypeScript", icon: "typescript", use: "Tipos para datos y componentes" },
      { name: "Tailwind CSS", icon: "tailwind", use: "Estilos y diseño responsive" },
      { name: "JavaScript", icon: "javascript", use: "Interacción y animaciones" },
    ],
  },
  {
    title: "Backend",
    skills: [
      { name: "Python", icon: "python", use: "Lógica, scripts y datos" },
      { name: "Django", icon: "django", use: "APIs y paneles de administración" },
      { name: "Bases de datos", icon: "database", use: "Modelado y consultas SQL" },
    ],
  },
  {
    title: "Herramientas",
    skills: [
      { name: "Git y GitHub", icon: "git", use: "Control de versiones en equipo" },
      { name: "Vercel", icon: "vercel", use: "Despliegue y dominios" },
      { name: "Figma", icon: "figma", use: "Prototipos antes de programar" },
    ],
  },
  {
    title: "Inteligencia artificial",
    skills: [
      { name: "Claude y Claude Code", icon: "claude", use: "Programar, revisar y documentar código" },
      { name: "Cursor", icon: "cursor", use: "Editor de código con IA integrada" },
      { name: "IA en mis apps", icon: "ai", use: "Integro modelos de IA por API" },
    ],
  },
];

export const languages = [
  { name: "Español", level: "Nativo" },
  { name: "Inglés", level: "[Nivel]" },
];
