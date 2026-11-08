import type { Experience } from "@/types";

/** Ordena de lo más reciente a lo más antiguo. Si no hay fecha de inicio, deja start: "". */
export const experience: Experience[] = [
  {
    kind: "laboral",
    title: "Marketing y redes sociales",
    place: "Neveo, heladería y açaí · Pasto",
    start: "Jul 2025",
    end: "Hoy",
    description:
      "Manejo el marketing y las redes de la marca en Instagram y TikTok. Ayudé a introducir el açaí en Pasto y a construir una clientela que prefiere el producto. También desarrollé su sistema de punto de venta y contabilidad.",
  },
  {
    kind: "laboral",
    title: "Desarrollador web freelance",
    place: "Sencia, estudio de diseño interior",
    start: "[Año]",
    end: "[Año]",
    description: "Diseñé, desarrollé y desplegué una aplicación de briefings con formularios, panel privado, exportación a PDF y CSV y avisos por correo, en planes gratuitos.",
  },
  {
    kind: "academica",
    title: "Ingeniería de Software",
    place: "Universidad Cooperativa de Colombia · Pasto",
    start: "Ene 2023",
    end: "Hoy",
    description: "Cursando quinto semestre. Proyectos académicos como Rumbo (Wear OS), Firemap (Android) y ServiciosYa (web, en equipo).",
  },
  {
    kind: "academica",
    title: "Bachiller",
    place: "Colegio Sagrado Corazón de Jesús Bethlemitas · Pasto",
    start: "",
    end: "2023",
    description: "Educación secundaria.",
  },
];
