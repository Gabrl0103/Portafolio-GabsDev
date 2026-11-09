/**
 * Datos personales. Cambia aquí tu información y se actualiza en todo el sitio.
 * Lo que está entre [corchetes] es un marcador pendiente.
 */
export const site = {
  name: "Gabs",
  role: "Estudiante de Ingeniería de Software",
  city: "Pasto, Colombia",
  university: "Universidad Cooperativa de Colombia",
  semester: "5.º semestre",
  /** Personal: no caduca como el institucional (gabriel.guerrerom@campusucc.edu.co). */
  email: "gabrielgum2006@gmail.com",
  /** Con indicativo y sin "+" ni espacios. */
  whatsapp: "573106349957",
  github: "https://github.com/Gabrl0103",
  /** Instagram de Neveo: se muestra en el proyecto Neveo POS, no en tus redes personales. */
  instagram: "https://instagram.com/neveo_",
  cv: "/cv.pdf",
  /** Foto de la sección Sobre mí (vertical 4:5). Cambia por tu foto, p. ej. "/images/gabs.jpg". */
  portrait: "/images/retrato.svg",
  year: 2026,
} as const;

/** Secciones del rediseño, en orden. `top` = visibles en la barra de arriba (en pantallas grandes). */
export const sections = [
  { id: "acerca", label: "Acerca de mí", top: true },
  { id: "proyectos", label: "Proyectos", top: true },
  { id: "servicios", label: "Servicios", top: true },
  { id: "herramientas", label: "Herramientas", top: false },
  { id: "testimonios", label: "Testimonios", top: true },
  { id: "experiencia", label: "Experiencia", top: true },
  { id: "lado-b", label: "Lado B", top: false },
  { id: "contacto", label: "Contacto", top: true },
] as const;
