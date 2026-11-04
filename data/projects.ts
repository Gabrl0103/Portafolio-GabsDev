import type { Project } from "@/types";
import { site } from "./site";

/**
 * Agregar un proyecto = agregar un objeto a este arreglo.
 * Los enlaces con href "" aparecen como "Próximamente" hasta que pongas la dirección real.
 */
export const projects: Project[] = [
  {
    id: "skillmap",
    title: "Skillmap",
    short: "Skillmap",
    description: "[Descripción: qué hace, para quién es y qué problema resuelve.]",
    kind: "Proyecto universitario",
    tags: ["[Tecnología]", "[Tecnología]"],
    art: "skillmap",
    format: "web",
    primary: { label: "GitHub", href: "" },
    secondary: { label: "Ver demo", href: "" },
    detail: {
      problema: "[Qué problema resuelve y para quién.]",
      solucion: "[Cómo lo resuelve y qué decisiones de diseño tomaste.]",
      rol: "[Tu parte en el proyecto: diseño, desarrollo, pruebas.]",
      resultado: "[Qué lograste y qué aprendiste.]",
    },
  },
  {
    id: "firemap",
    title: "Firemap",
    short: "Firemap",
    description: "[Descripción: qué hace, para quién es y qué problema resuelve.]",
    kind: "Proyecto universitario",
    tags: ["[Tecnología]", "[Tecnología]"],
    art: "firemap",
    format: "web",
    primary: { label: "GitHub", href: "" },
    secondary: { label: "Ver demo", href: "" },
    detail: {
      problema: "[Qué problema resuelve y para quién.]",
      solucion: "[Cómo lo resuelve y qué decisiones de diseño tomaste.]",
      rol: "[Tu parte en el proyecto: diseño, desarrollo, pruebas.]",
      resultado: "[Qué lograste y qué aprendiste.]",
    },
  },
  {
    id: "smartwatch",
    title: "App smartwatch",
    short: "Smartwatch",
    description: "[Descripción: qué hace, para quién es y qué problema resuelve.]",
    kind: "Proyecto universitario",
    tags: ["[Tecnología]", "[Tecnología]"],
    art: "watch",
    format: "watch",
    primary: { label: "GitHub", href: "" },
    secondary: { label: "Ver demo", href: "" },
    detail: {
      problema: "[Qué problema resuelve y para quién.]",
      solucion: "[Cómo lo resuelve y qué decisiones de diseño tomaste.]",
      rol: "[Tu parte en el proyecto: diseño, desarrollo, pruebas.]",
      resultado: "[Qué lograste y qué aprendiste.]",
    },
  },
  {
    id: "neveo",
    title: "Neveo",
    short: "Neveo",
    description: "Marca de helados y açaí pensada para gente joven en Pasto. [Añadir: qué has construido para la marca.]",
    kind: "Marca propia",
    tags: ["Pasto, CO", "[Tecnología]"],
    art: "neveo",
    format: "web",
    primary: { label: "Instagram", href: site.instagram },
    secondary: { label: "Ver sitio", href: "" },
    detail: {
      problema: "[Qué necesidad vio la marca y para quién.]",
      solucion: "[Qué construiste: sitio, menú, pedidos, identidad visual.]",
      rol: "[Fundador: dirección, diseño, desarrollo.]",
      resultado: "[Qué lograste y qué aprendiste.]",
    },
  },
];
