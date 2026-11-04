import type { Chapter, SkillGroup } from "@/types";

export const chapters: Chapter[] = [
  {
    n: "01",
    title: "Quién soy",
    text: "Soy Gabs, estudiante de quinto semestre de Ingeniería de Software en la Universidad Cooperativa de Colombia, en Pasto.",
  },
  {
    n: "02",
    title: "Qué construyo",
    text: "Apps web, móvil y de escritorio. Ahora trabajo en Skillmap, Firemap y una app para smartwatch.",
  },
  {
    n: "03",
    title: "Neveo",
    text: "Dirijo Neveo, una marca de helados y açaí pensada para gente joven en Pasto.",
  },
  {
    n: "04",
    title: "Cómo trabajo",
    text: "Next.js, TypeScript y Tailwind CSS en la web, Python y Django en el servidor, y Git con Vercel para publicar.",
  },
];

export const facts = ["Pasto, Colombia", "5.º semestre", "Fundador de Neveo", "Web, móvil y escritorio"];

/** Sección adicional: niveles aproximados de 0 a 100. Ajústalos a tu criterio. */
export const skillGroups: SkillGroup[] = [
  {
    title: "Frontend",
    skills: [
      { name: "Next.js", level: 75 },
      { name: "TypeScript", level: 70 },
      { name: "Tailwind CSS", level: 80 },
      { name: "JavaScript", level: 80 },
    ],
  },
  {
    title: "Backend",
    skills: [
      { name: "Python", level: 75 },
      { name: "Django", level: 65 },
      { name: "Bases de datos", level: 60 },
    ],
  },
  {
    title: "Herramientas",
    skills: [
      { name: "Git y GitHub", level: 75 },
      { name: "Vercel", level: 70 },
      { name: "Figma", level: 60 },
    ],
  },
];

export const languages = [
  { name: "Español", level: "Nativo" },
  { name: "Inglés", level: "[Nivel]" },
];
