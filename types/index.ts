/** Ilustraciones SVG disponibles mientras no haya capturas reales. */
export type ProjectArt = "skillmap" | "firemap" | "watch" | "neveo" | "sencia" | "servicios" | "asqua";

/** Formato en el que se muestra la vista previa del proyecto. */
export type ProjectFormat = "web" | "desktop" | "mobile" | "watch";

export interface ProjectLink {
  label: string;
  /** Deja "" mientras no exista: se muestra con `note` o como "Pronto". */
  href: string;
  /** Texto cuando no hay enlace, p. ej. "Privado". */
  note?: string;
}

/**
 * Capturas y videos del proyecto (se ven en el detalle).
 * image/video: archivos en /public/proyectos/<id>/ · youtube: solo el id del video.
 */
export type ProjectMedia =
  | { type: "image"; src: string; alt: string }
  | { type: "video"; src: string; alt: string; poster?: string }
  | { type: "youtube"; id: string; alt: string };

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
  /** Galería del detalle. La primera imagen también se usa como portada si no hay `image`. */
  media?: ProjectMedia[];
  /** web = navegador · desktop = ventana de escritorio · mobile = celular · watch = reloj */
  format: ProjectFormat;
  /** Enlace al repositorio (GitHub) o al perfil principal. */
  /** Demo o sitio en vivo (opcional): se muestra primero */
  demo?: ProjectLink;
  primary: ProjectLink;
  /** Enlace a la demo en Vercel o al sitio en vivo. */
  secondary?: ProjectLink;
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



