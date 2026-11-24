/**
 * Datos personales. Cambia aquí tu información y se actualiza en todo el sitio.
 * Lo que está entre [corchetes] es un marcador pendiente.
 */
export const site = {
  name: "Gabriel",
  role: "Desarrollador Full Stack & IA",
  city: "Pasto, Colombia",
  university: "Universidad Cooperativa de Colombia",
  semester: "5.º semestre",
  /** Personal: no caduca como el institucional (gabriel.guerrerom@campusucc.edu.co). */
  email: "gabrielgum2006@gmail.com",
  /** Abre Gmail con un mensaje nuevo para ti (mailto depende de tener una app de correo configurada) */
  emailCompose:
    "https://mail.google.com/mail/?view=cm&fs=1&to=gabrielgum2006@gmail.com",
  /** Con indicativo y sin "+" ni espacios. */
  whatsapp: "573106349957",
  github: "https://github.com/Gabrl0103",
  /** Perfil de LinkedIn (vacío = no se muestra el ícono) */
  linkedin:
    "https://www.linkedin.com/in/gabriel-guerrero-martinez-429949380" as string,
  /** Instagram de Neveo: se muestra en el proyecto Neveo POS, no en tus redes personales. */
  instagram: "https://instagram.com/neveo_",
  cv: "/cv.pdf",
  /** Tu foto en Acerca de mí (vertical 4:5). Ponla en /public/images y escribe la ruta, p. ej. "/images/gabs.jpg". Vacío = marcador. */
  portrait: "/images/gabriel-estudio.webp",
  year: 2026,
} as const;

/** Secciones del rediseño, en orden. `top` = visibles en la barra de arriba (en pantallas grandes). */
export const sections = [
  { id: "acerca", label: "Acerca de mí", top: true },
  { id: "proyectos", label: "Proyectos", top: true },
  { id: "servicios", label: "Servicios", top: true },
  { id: "testimonios", label: "Testimonios", top: true },
  { id: "experiencia", label: "Experiencia", top: true },
  { id: "contacto", label: "Contacto", top: true },
] as const;
