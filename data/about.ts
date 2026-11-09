import type { SkillGroup } from "@/types";

/* ---------- Acerca de mí ---------- */

/** Bloque "Ahora mismo" */
export const now = [
  { label: "Construyendo", value: "Rumbo, Skillmap y Firemap" },
  { label: "Aprendiendo", value: "Landing pages UX/UI, IA en páginas web, SaaS y marketing digital" },
  { label: "Disponibilidad", value: "Abierto a prácticas y freelance para ganar experiencia" },
];

/** Para qué estoy disponible */
export const openTo = ["Prácticas", "Freelance", "Proyectos", "Colaboraciones"];

/** En números (datos reales; actualízalos cuando cambien) */
export const stats = [
  { value: "5.º", label: "semestre de Ingeniería" },
  { value: "6", label: "proyectos construidos" },
  { value: "B2", label: "nivel de inglés" },
];

/* ---------- Habilidades (sección adicional) ---------- */

/** Sin barras ni porcentajes: cada herramienta dice dónde o para qué la uso. */
export const skillGroups: SkillGroup[] = [
  {
    title: "Frontend",
    skills: [
      { name: "Next.js", icon: "nextjs", use: "Sitios con App Router, como este portafolio" },
      { name: "TypeScript", icon: "typescript", use: "Tipos en apps y APIs" },
      { name: "Tailwind CSS", icon: "tailwind", use: "Estilos y diseño responsive" },
      { name: "JavaScript, HTML y CSS", icon: "javascript", use: "Apps sin framework, como Skillmap" },
    ],
  },
  {
    title: "Backend y datos",
    skills: [
      { name: "Node.js y Express", icon: "nodejs", use: "APIs de Firemap y Sencia" },
      { name: "Python y FastAPI", icon: "fastapi", use: "Backend de Rumbo" },
      { name: "Java", icon: "java", use: "Backend de ServiciosYa" },
      { name: "PostgreSQL", icon: "postgresql", use: "Neon y PostGIS para datos geográficos" },
    ],
  },
  {
    title: "Móvil y wearables",
    skills: [
      { name: "Kotlin", icon: "kotlin", use: "App de Rumbo" },
      { name: "Compose para Wear OS", icon: "wearos", use: "Interfaces para reloj inteligente" },
      { name: "Ionic, Angular y Capacitor", icon: "ionic", use: "App Android de Firemap" },
    ],
  },
  {
    title: "Herramientas",
    skills: [
      { name: "Git y GitHub", icon: "git", use: "Control de versiones en equipo" },
      { name: "Render", icon: "render", use: "Despliegue de backends" },
      { name: "Vercel", icon: "vercel", use: "Despliegue de sitios" },
      { name: "Figma", icon: "figma", use: "Prototipos antes de programar" },
    ],
  },
  {
    title: "IA y automatización",
    skills: [
      { name: "IA en mis apps", icon: "ai", use: "Analizador de ofertas en Skillmap y asistente en Rumbo" },
      { name: "Gemini API", icon: "gemini", use: "Voz, intención y respuestas en Rumbo" },
      { name: "Automatización", icon: "automation", use: "Avisos por correo y monitoreo de servicios" },
    ],
  },
];
