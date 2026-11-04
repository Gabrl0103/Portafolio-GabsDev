import type { Experience } from "@/types";

/** Ordena de lo más reciente a lo más antiguo. */
export const experience: Experience[] = [
  {
    kind: "academica",
    title: "Ingeniería de Software",
    place: "Universidad Cooperativa de Colombia · Pasto",
    start: "[Año]",
    end: "Hoy",
    description: "Cursando quinto semestre. [Materias, proyectos o logros destacados.]",
  },
  {
    kind: "academica",
    title: "[Curso o certificación]",
    place: "[Institución o plataforma]",
    start: "[Año]",
    end: "[Año]",
    description: "[Qué aprendiste.]",
  },
  {
    kind: "academica",
    title: "Bachiller",
    place: "[Colegio]",
    start: "[Año]",
    end: "[Año]",
    description: "[Énfasis o logro destacado, opcional.]",
  },
  {
    kind: "laboral",
    title: "Fundador",
    place: "Neveo · Pasto",
    start: "[Año]",
    end: "Hoy",
    description: "Dirijo una marca de helados y açaí pensada para gente joven. [Logros: ventas, sitio, redes.]",
  },
  {
    kind: "laboral",
    title: "[Cargo, práctica o freelance]",
    place: "[Empresa o cliente]",
    start: "[Año]",
    end: "[Año]",
    description: "[Qué hiciste y qué lograste.]",
  },
];
