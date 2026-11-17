import type { TechIconName } from "@/components/TechIcon";

/** Servicios: lo que puedes ofrecer, basado en los proyectos que ya construiste. */
export interface Service {
  title: string;
  text: string;
  items: string[];
  /** Con qué lo hago (logos en components/TechIcon.tsx) */
  tools: { name: string; icon: TechIconName }[];
}

export const services: Service[] = [
  {
    title: "Desarrollo web",
    text: "Sitios y aplicaciones web completas, del formulario al panel de administración, desplegadas y listas para usar.",
    items: [
      "Landing pages y portafolios",
      "Apps con base de datos",
      "Paneles con búsqueda y exportación",
    ],
    tools: [
      { name: "Next.js", icon: "nextjs" },
      { name: "TypeScript", icon: "typescript" },
      { name: "Tailwind CSS", icon: "tailwind" },
      { name: "Node.js", icon: "nodejs" },
      { name: "PostgreSQL", icon: "postgresql" },
      { name: "Vercel", icon: "vercel" },
    ],
  },
  {
    title: "Apps móviles",
    text: "Apps Android con pantallas claras y una API propia detrás, como Firemap.",
    items: [
      "App Android (APK)",
      "API y base de datos",
      "Mapas y datos por ubicación",
    ],
    tools: [
      { name: "Ionic", icon: "ionic" },
      { name: "Capacitor", icon: "capacitor" },
      { name: "Node.js", icon: "nodejs" },
      { name: "PostgreSQL + PostGIS", icon: "postgresql" },
      { name: "Render", icon: "render" },
    ],
  },
  {
    title: "Wearables",
    text: "Apps para reloj inteligente pensadas para usarse sin mirar la pantalla, como Rumbo.",
    items: [
      "Interfaces para Wear OS",
      "Vibraciones y voz",
      "GPS y rutas a pie",
    ],
    tools: [
      { name: "Kotlin", icon: "kotlin" },
      { name: "Wear OS", icon: "wearos" },
      { name: "FastAPI", icon: "fastapi" },
      { name: "Gemini API", icon: "gemini" },
    ],
  },
  {
    title: "Apps de escritorio",
    text: "Programas que resuelven una tarea concreta y funcionan sin conexión, como Skillmap.",
    items: [
      "Ejecutables para Windows",
      "Funcionan offline",
      "Arquitectura limpia",
    ],
    tools: [
      { name: "JavaScript", icon: "javascript" },
      { name: "Java", icon: "java" },
      { name: "Tailwind CSS", icon: "tailwind" },
    ],
  },
  {
    title: "IA y automatización",
    text: "Integro modelos de IA en apps y automatizo procesos que hoy se hacen a mano, como los briefings de Sencia.",
    items: [
      "Asistentes con IA",
      "Avisos automáticos por correo",
      "Formularios que reemplazan chats",
    ],
    tools: [
      { name: "IA en apps", icon: "ai" },
      { name: "Gemini API", icon: "gemini" },
      { name: "Automatización", icon: "automation" },
    ],
  },
  {
    title: "Marketing y redes",
    text: "Contenido y redes para marcas locales, desde la experiencia llevando el Instagram y el TikTok de Neveo.",
    items: [
      "Instagram y TikTok",
      "Lanzamiento de productos",
      "Contenido para redes",
    ],
    tools: [],
  },
];
