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

export const navLinks = [
  { href: "#inicio", label: "Inicio" },
  { href: "#sobre-mi", label: "Sobre mí" },
  { href: "#proyectos", label: "Proyectos" },
  { href: "#testimonios", label: "Testimonios" },
  { href: "#experiencia", label: "Experiencia" },
  { href: "#habilidades", label: "Habilidades" },
  { href: "#contacto", label: "Contacto" },
] as const;

export const tools = ["Next.js", "TypeScript", "Tailwind CSS", "JavaScript", "Python", "Django", "Git", "Vercel"];
