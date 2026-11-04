/**
 * Datos personales. Cambia aquí tu información y se actualiza en todo el sitio.
 * Lo que está entre [corchetes] es un marcador pendiente.
 */
export const site = {
  name: "Gabs",
  fullName: "[Tu nombre completo]",
  role: "Estudiante de Ingeniería de Software",
  city: "Pasto, Colombia",
  university: "Universidad Cooperativa de Colombia",
  semester: "5.º semestre",
  email: "[tu-correo@ejemplo.com]",
  whatsapp: "", // Ej: "573001234567" (opcional)
  github: "https://github.com/[tu-usuario]",
  linkedin: "https://linkedin.com/in/[tu-usuario]",
  instagram: "https://instagram.com/[neveo]",
  cv: "/cv.pdf",
  photo: "/images/avatar.svg",
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
  { href: "#contacto", label: "Contacto", main: true },
] as const;

export const tools = ["Next.js", "TypeScript", "Tailwind CSS", "JavaScript", "Python", "Django", "Git", "Vercel"];
