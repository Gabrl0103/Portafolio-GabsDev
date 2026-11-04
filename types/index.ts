import type { TechIconName } from "@/components/TechIcon";

/** Ilustraciones SVG disponibles mientras no haya capturas reales. */
export type ProjectArt = "skillmap" | "firemap" | "watch" | "neveo" | "sencia" | "servicios";

/** Formato en el que se muestra la vista previa del proyecto. */
export type ProjectFormat = "web" | "desktop" | "mobile" | "watch";

export interface ProjectLink {
  label: string;
  /** Deja "" mientras no exista: se muestra como "Próximamente". */
  href: string;
}

export interface Project {
  id: string;
  title: string;
  /** Nombre corto para la pestaña del carrusel. */
  short: string;
  description: string;
  /** Etiqueta superior: "Proyecto universitario", "Marca propia"… */
  kind: string;
  tags: string[];
  /** Captura real en /public/images. Si no existe se usa la ilustración. */
  image?: string;
  art: ProjectArt;
  /** web = navegador · desktop = ventana de escritorio · mobile = celular · watch = reloj */
  format: ProjectFormat;
  /** Enlace al repositorio (GitHub) o al perfil principal. */
  primary: ProjectLink;
  /** Enlace a la demo en Vercel o al sitio en vivo. */
  secondary: ProjectLink;
  detail: {
    problema: string;
    solucion: string;
    rol: string;
    resultado: string;
  };
}

export interface Testimonial {
  name: string;
  role: string;
  quote: string;
  /** Foto en /public/images. Si no existe se muestran las iniciales. */
  photo?: string;
  rating?: 1 | 2 | 3 | 4 | 5;
}

export type ExperienceKind = "academica" | "laboral";

export interface Experience {
  kind: ExperienceKind;
  title: string;
  place: string;
  start: string;
  end: string;
  description: string;
}

export interface Skill {
  name: string;
  /** Logo de la tecnología (ver components/TechIcon.tsx). */
  icon: TechIconName;
  /** Para qué la uso (sin medir niveles). */
  use: string;
}

export interface SkillGroup {
  title: string;
  skills: Skill[];
}

export interface Stat {
  value: number;
  /** Texto antes o después del número: "5.º", "+"… */
  prefix?: string;
  suffix?: string;
  label: string;
}
