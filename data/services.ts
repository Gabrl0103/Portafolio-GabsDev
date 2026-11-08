/** Servicios: lo que puedes ofrecer, basado en los proyectos que ya construiste. */
export interface Service {
  title: string;
  /** Línea corta a la derecha del título */
  sub: string;
  text: string;
  items: string[];
}

export const services: Service[] = [
  {
    title: "Desarrollo web",
    sub: "Next.js · Node.js · PostgreSQL",
    text: "Sitios y aplicaciones web completas, del formulario al panel de administración, desplegadas y listas para usar.",
    items: ["Landing pages y portafolios", "Apps con base de datos", "Paneles con búsqueda y exportación"],
  },
  {
    title: "Apps móviles",
    sub: "Android · Ionic · Capacitor",
    text: "Apps Android con pantallas claras y una API propia detrás, como Firemap.",
    items: ["App Android (APK)", "API y base de datos", "Mapas y datos por ubicación"],
  },
  {
    title: "Wearables",
    sub: "Wear OS · Kotlin · Compose",
    text: "Apps para reloj inteligente pensadas para usarse sin mirar la pantalla, como Rumbo.",
    items: ["Interfaces para Wear OS", "Vibraciones y voz", "GPS y rutas a pie"],
  },
  {
    title: "Apps de escritorio",
    sub: "Herramientas del día a día",
    text: "Programas que resuelven una tarea concreta y funcionan sin conexión, como Skillmap.",
    items: ["Ejecutables para Windows", "Funcionan offline", "Arquitectura limpia"],
  },
  {
    title: "IA y automatización",
    sub: "Gemini · Correos · Monitoreo",
    text: "Integro modelos de IA en apps y automatizo procesos que hoy se hacen a mano, como los briefings de Sencia.",
    items: ["Asistentes con IA", "Avisos automáticos por correo", "Formularios que reemplazan chats"],
  },
  {
    title: "Marketing y redes",
    sub: "Experiencia con Neveo",
    text: "Contenido y redes para marcas locales, desde la experiencia llevando el Instagram y el TikTok de Neveo.",
    items: ["Instagram y TikTok", "Lanzamiento de productos", "Contenido para redes"],
  },
];
