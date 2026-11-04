import type { Project } from "@/types";
import { site } from "./site";

/**
 * Agregar un proyecto = agregar un objeto a este arreglo (el primero es el que se ve primero).
 * Los enlaces con href "" aparecen como "Pronto" hasta que pongas la dirección real.
 * Cuando tengas capturas, ponlas en /public/images y agrega `image: "/images/archivo.png"`.
 */
export const projects: Project[] = [
  {
    id: "rumbo",
    title: "Rumbo",
    short: "Rumbo",
    description:
      "App para smartwatch Wear OS que guía por vibraciones a personas ciegas o con baja visión mientras caminan. Dices el destino en voz alta y el reloj te lleva con patrones de vibración y guía hablada.",
    kind: "Proyecto académico · Wear OS",
    tags: ["Kotlin", "Jetpack Compose", "FastAPI", "PostgreSQL", "Gemini API", "Geoapify"],
    art: "watch",
    format: "watch",
    primary: { label: "GitHub", href: "https://github.com/Gabrl0103/smartwatch-app" },
    secondary: { label: "Ver demo", href: "" },
    detail: {
      problema:
        "Caminar por la ciudad sin ver implica depender de otra persona o de apps pensadas para mirar una pantalla. Rumbo busca dar autonomía con un dispositivo que ya va en la muñeca.",
      solucion:
        "El reloj calcula la ruta a pie y la traduce en vibraciones (izquierda, derecha, giro próximo, desvío y llegada), con guía hablada por etapas, avisos de escaleras, lugares favoritos y un asistente que responde «¿cuánto falta?». La navegación crítica se resuelve en el reloj con reglas locales, sin depender de la IA ni de la red.",
      rol: "Creador: diseño, arquitectura limpia en 4 capas, desarrollo del reloj y del backend, y pruebas con JUnit y pytest.",
      resultado:
        "Una app funcional para Wear OS 3+ con backend desplegado en Render, que combina GPS, voz e IA sin poner en riesgo la guía cuando falla la conexión.",
    },
  },
  {
    id: "skillmap",
    title: "Skillmap",
    short: "Skillmap",
    description:
      "App de escritorio que funciona como un GPS de tu carrera: mapea las habilidades que ya tienes y las que quieres aprender, y con IA analiza ofertas laborales para medir qué tan compatible eres con el puesto.",
    kind: "Proyecto personal · Escritorio",
    tags: ["JavaScript", "HTML", "CSS", "Tailwind CSS", "Arquitectura hexagonal", "IA"],
    art: "skillmap",
    format: "desktop",
    primary: { label: "GitHub · Frontend", href: "https://github.com/Gabrl0103/SKILLMAP-FRONTEND" },
    secondary: { label: "GitHub · Backend", href: "https://github.com/Gabrl0103/SKILLMAP-BACKEND" },
    detail: {
      problema:
        "Quien está formando su carrera no tiene una forma clara de ver qué sabe, qué le falta y qué tan cerca está de los trabajos que le interesan.",
      solucion:
        "Un mapa de habilidades aprendidas y por aprender, más un analizador con IA que compara tu perfil con ofertas laborales. Se distribuye como ejecutable (.exe) y funciona sin conexión.",
      rol: "Creador: diseño, desarrollo del frontend y del backend, y empaquetado de la app.",
      resultado:
        "Backend con arquitectura limpia y hexagonal, principios SOLID y patrones como Repository, Factory, Observer e inyección de dependencias. Frontend en JavaScript sin frameworks que funciona offline.",
    },
  },
  {
    id: "firemap",
    title: "Firemap",
    short: "Firemap",
    description:
      "App Android que muestra el riesgo de incendios forestales por municipio en Nariño, Colombia. Es un indicador para informar y prevenir, no una predicción.",
    kind: "Proyecto académico · Android",
    tags: ["Ionic", "Angular", "Capacitor", "Express", "TypeScript", "PostgreSQL + PostGIS"],
    art: "firemap",
    format: "mobile",
    primary: { label: "GitHub", href: "https://github.com/Gabrl0103/Willay-Firemap" },
    secondary: { label: "Descargar APK", href: "" },
    detail: {
      problema: "La información sobre el riesgo de incendios forestales en Nariño está dispersa y no es fácil de consultar desde el celular.",
      solucion:
        "Una app que muestra un indicador de riesgo por municipio sobre un mapa, alimentada por una API propia con datos geoespaciales en PostgreSQL con PostGIS.",
      rol: "Creador: diseño, desarrollo de la app y de la API, y despliegue.",
      resultado: "App Android (APK) hecha con Ionic, Angular y Capacitor, con backend en Express 5 + TypeScript desplegado en Render y base de datos en Neon.",
    },
  },
  {
    id: "sencia",
    title: "Briefings Sencia",
    short: "Sencia",
    description:
      "Aplicación web para un estudio de diseño interior que reemplazó el briefing que se enviaba por WhatsApp: formularios que guardan, avisan y ordenan cada solicitud en un panel privado.",
    kind: "Proyecto para cliente · Web",
    tags: ["JavaScript", "Node.js", "Express", "PostgreSQL", "PDFKit", "Resend"],
    art: "sencia",
    format: "web",
    primary: { label: "GitHub", href: "" },
    secondary: { label: "Ver sitio", href: "" },
    detail: {
      problema: "El estudio recibía los briefings como mensajes de WhatsApp: información incompleta, difícil de buscar y fácil de perder.",
      solucion:
        "Dos formularios (hogar y comercial) con barra de progreso, validación y autoguardado. Las respuestas llegan a un panel privado con pestañas, etiquetas de color, búsqueda, estados y exportación a PDF y CSV, y cada envío avisa por correo.",
      rol: "Diseño, desarrollo y despliegue de toda la aplicación.",
      resultado:
        "Funciona completa en planes gratuitos ($0 al mes), con seguridad cuidada: panel con enlace secreto, límite de envíos por IP, protección contra bots y XSS, claves en variables de entorno y autorización de datos personales (Ley 1581).",
    },
  },
  {
    id: "neveo-pos",
    title: "Neveo POS",
    short: "Neveo POS",
    description: "Sistema de punto de venta y contabilidad para Neveo, una heladería y açaí en Pasto.",
    kind: "Proyecto para negocio · Web",
    tags: ["[Tecnologías]"],
    art: "neveo",
    format: "web",
    primary: { label: "GitHub", href: "" },
    secondary: { label: "Instagram de Neveo", href: site.instagram },
    detail: {
      problema: "[Qué necesitaba el negocio: llevar ventas, caja, inventario…]",
      solucion: "[Qué hace el sistema.]",
      rol: "Creador: diseño y desarrollo.",
      resultado: "[Qué cambió en el negocio al usarlo.]",
    },
  },
  {
    id: "serviciosya",
    title: "ServiciosYa",
    short: "ServiciosYa",
    description: "Aplicación web para gestionar servicios, con frontend y backend separados. Proyecto en equipo de cuarto semestre.",
    kind: "Proyecto académico · Web",
    tags: ["Java", "JavaScript", "HTML"],
    art: "servicios",
    format: "web",
    primary: { label: "GitHub · Frontend", href: "https://github.com/juandabettt/servicios-frontend" },
    secondary: { label: "GitHub · Backend", href: "https://github.com/juandabettt/gestion-servicios-backend" },
    detail: {
      problema: "[Qué problema resuelve y para quién.]",
      solucion: "Una aplicación con frontend en JavaScript y HTML y un backend en Java para la gestión de servicios.",
      rol: "[Tu parte en el equipo.]",
      resultado: "[Qué lograron y qué aprendiste.]",
    },
  },
];
