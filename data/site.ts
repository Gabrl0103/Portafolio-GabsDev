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
  photo: "/images/avatar.svg",
  /** Foto de la sección Sobre mí (vertical 4:5). Cambia por tu foto, p. ej. "/images/gabs.jpg". */
  portrait: "/images/retrato.svg",
  year: 2026,
} as const;

/** Todas las secciones. `main` = visibles en la barra; el resto vive en el menú. */
export const navLinks = [
  { href: "#inicio", label: "Inicio", main: false },
  { href: "#sobre-mi", label: "Sobre mí", main: true },
  { href: "#proyectos", label: "Proyectos", main: true },
  { href: "#testimonios", label: "Testimonios", main: false },
  { href: "#experiencia", label: "Experiencia", main: true },
  { href: "#habilidades", label: "Habilidades", main: false },
  { href: "#lado-b", label: "Lado B", main: false },
  { href: "#contacto", label: "Contacto", main: true },
] as const;

export const tools = ["TypeScript", "Kotlin", "Python", "Node.js", "Next.js", "Tailwind CSS", "PostgreSQL", "Wear OS", "Git", "Vercel"];
