import type { Project } from "@/types";
import { site } from "./site";

/**
 * Agregar un proyecto = agregar un objeto a este arreglo (el primero es el que se ve primero).
 * Los enlaces con href "" aparecen como "Pronto" hasta que pongas la dirección real.
 * Cuando tengas capturas, ponlas en /public/images y agrega `image: "/images/archivo.png"`.
 */
export const projects: Project[] = [
  {
    id: "skillmap",
    title: "Cenit Skillmap",
    short: "Cenit",
    summary:
      "Tu ruta de habilidades hacia el rol que quieres, según ofertas reales.",
    summaryMark: "según ofertas reales",
    description:
      "App de escritorio que funciona como un GPS de tu carrera: mapea las habilidades que ya tienes y las que quieres aprender, y con IA analiza ofertas laborales para medir qué tan compatible eres con el puesto. Mi proyecto universitario más ambicioso.",
    kind: "Proyecto universitario · Escritorio",
    tags: [
      "JavaScript",
      "HTML",
      "CSS",
      "Tailwind CSS",
      "Arquitectura hexagonal",
      "IA",
    ],
    art: "skillmap",
    image: "/proyectos/skillmap/cover.webp",
    format: "desktop",
    media: [
      {
        type: "video",
        src: "/proyectos/skillmap/demo.mp4",
        ratio: 1440 / 900,
        alt: "Demo de Cenit Skillmap: Mi Ruta, Mapa y Analizador",
        poster: "/proyectos/skillmap/ruta.webp",
      },
      {
        type: "image",
        src: "/proyectos/skillmap/mapa.webp",
        ratio: 2160 / 1350,
        alt: "Mapa de habilidades de Cenit agrupado por área",
      },
      {
        type: "image",
        src: "/proyectos/skillmap/analizador.webp",
        ratio: 2160 / 1350,
        alt: "Analizador de vacantes con 70 % de compatibilidad",
      },
      {
        type: "image",
        src: "/proyectos/skillmap/ruta.webp",
        ratio: 2160 / 1350,
        alt: "Mi Ruta: nivel de preparación hacia Frontend Senior",
      },
      {
        type: "image",
        src: "/proyectos/skillmap/objetivo.webp",
        ratio: 1440 / 900,
        alt: "Objetivo: elige el rol al que quieres llegar y tu nivel de preparación",
      },
      {
        type: "image",
        src: "/proyectos/skillmap/habilidades.webp",
        ratio: 1440 / 900,
        alt: "Habilidades: todo el catálogo con lo que dominas, lo que aprendes y lo que falta",
      },
    ],
    demo: {
      label: "Descargar para Windows",
      href: "https://github.com/Gabrl0103/SKILLMAP-BACKEND/releases/tag/v1.0-entrega",
    },
    primary: {
      label: "GitHub · Frontend",
      href: "https://github.com/Gabrl0103/SKILLMAP-FRONTEND",
    },
    secondary: {
      label: "GitHub · Backend",
      href: "https://github.com/Gabrl0103/SKILLMAP-BACKEND",
    },
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
    id: "rumbo",
    title: "Rumbo",
    short: "Rumbo",
    summary:
      "Navegación a pie por vibraciones en el reloj para personas ciegas.",
    summaryMark: "para personas ciegas",
    description:
      "App para smartwatch Wear OS que guía por vibraciones a personas ciegas o con baja visión mientras caminan. Dices el destino en voz alta y el reloj te lleva con patrones de vibración y guía hablada.",
    kind: "Proyecto académico · Wear OS",
    tags: [
      "Kotlin",
      "Jetpack Compose",
      "FastAPI",
      "PostgreSQL",
      "Gemini API",
      "Geoapify",
    ],
    art: "watch",
    image: "/proyectos/rumbo/cover.webp",
    media: [
      {
        type: "video",
        src: "/proyectos/rumbo/demo.mp4",
        ratio: 1,
        round: true,
        alt: "Rumbo funcionando en el emulador de Wear OS: destino, vibraciones, ruta y recálculo",
        poster: "/proyectos/rumbo/destino.webp",
      },
      {
        type: "image",
        src: "/proyectos/rumbo/destino.webp",
        ratio: 1,
        round: true,
        alt: "Destino confirmado: Parque infantil, a 269 m y 4 minutos a pie",
      },
      {
        type: "image",
        src: "/proyectos/rumbo/giro.webp",
        ratio: 1,
        round: true,
        alt: "Aviso de giro próximo: gire a la izquierda en 37 m",
      },
      {
        type: "image",
        src: "/proyectos/rumbo/mapa.webp",
        ratio: 1,
        round: true,
        alt: "Mapa GPS en ruta: la posición y el camino, con el próximo giro a 51 m",
      },
      {
        type: "image",
        src: "/proyectos/rumbo/asistente.webp",
        ratio: 1,
        round: true,
        alt: "Asistente con IA: a «¿cuánto falta para llegar?» responde «faltan unos 470 metros»",
      },
      {
        type: "image",
        src: "/proyectos/rumbo/llegada.webp",
        ratio: 1,
        round: true,
        alt: "Fin del recorrido: ¡Llegaste! a Parque infantil",
      },
    ],
    format: "watch",
    demo: {
      label: "Descargar APK (Wear OS)",
      href: "/descargas/rumbo.apk",
    },
    primary: {
      label: "GitHub",
      href: "https://github.com/Gabrl0103/smartwatch-app",
    },
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
    id: "asqua",
    title: "Asqua",
    short: "Asqua",
    summary: "Aventura en tercera persona con niveles generados por IA.",
    summaryMark: "generados por IA",
    description:
      "Videojuego de aventura y acción en tercera persona: Ilse recorre una plaza durante varias noches con un farol, devuelve la Esperanza a cada zona y se defiende de criaturas de sombra. Desde la quinta noche, los niveles los genera un sistema con IA que se adapta a cómo juegas.",
    kind: "Proyecto académico · Videojuego · En equipo",
    tags: [
      "Unity 6",
      "C#",
      "URP",
      "Cinemachine",
      "NavMesh",
      "IA",
      "Pruebas EditMode",
    ],
    art: "asqua",
    image: "/proyectos/asqua/cover.webp",
    format: "desktop",
    primary: {
      label: "GitHub",
      href: "https://github.com/miguelpantojag03/ASQUA",
    },
    secondary: { label: "Gameplay", href: "" },
    detail: {
      problema:
        "Un juego de noches con niveles escritos a mano se agota rápido y no responde a cómo juega cada persona. Además, dejar que una IA cree niveles sin control puede producir noches rotas o injustas.",
      solucion:
        "Un generador de niveles con IA que propone solo parámetros de la noche, no la geometría. Cada propuesta pasa por un validador y, si la IA no está disponible, un generador procedural toma su lugar. Se adapta al desempeño del jugador, y el panel «Ver ADN» muestra por qué cada noche es como es.",
      rol: "Parte de un equipo de 3 (con Miguel y Jairo). Hice el sistema de generación de niveles con IA y sus pruebas automáticas, y sumé funciones como finales, guardado, eventos por noche, la Cacería del Heraldo, el modo «Noches sin fin» y el enemigo Apagavelas. El mundo, los personajes, el combate y los diálogos son principalmente de Miguel.",
      resultado:
        "Las noches 1 a 4 están escritas a mano y desde la 5 se generan con el sistema de IA, con la lógica del generador cubierta por pruebas. El juego tiene varios finales según lo que hagas. Proyecto final de Diseño de Interfaces (HCI), en desarrollo.",
    },
  },
  {
    id: "atalaya",
    title: "Atalaya",
    short: "Atalaya",
    summary: "Riesgo de incendio forestal por municipio en Nariño.",
    summaryMark: "Riesgo de incendio forestal",
    description:
      "App Android que muestra el riesgo de incendios forestales por municipio en Nariño, Colombia. Es un indicador para informar y prevenir, no una predicción.",
    kind: "Proyecto académico · Android",
    tags: [
      "Ionic",
      "Angular",
      "Capacitor",
      "Express",
      "TypeScript",
      "PostgreSQL + PostGIS",
    ],
    art: "firemap",
    image: "/proyectos/atalaya/cover.webp",
    media: [
      {
        type: "video",
        src: "/proyectos/atalaya/demo.mp4",
        ratio: 1080 / 2198,
        alt: "Demo de Atalaya: inicio, detalle de Buesaco e historial",
        poster: "/proyectos/atalaya/inicio.webp",
      },
      {
        type: "image",
        src: "/proyectos/atalaya/inicio.webp",
        ratio: 1082 / 2202,
        alt: "Inicio: riesgo promedio de Nariño y zonas con mayor riesgo",
      },
      {
        type: "image",
        src: "/proyectos/atalaya/municipio.webp",
        ratio: 1082 / 2202,
        alt: "Mapa con el detalle de riesgo de Buesaco",
      },
      {
        type: "image",
        src: "/proyectos/atalaya/historial.webp",
        ratio: 1082 / 2202,
        alt: "Historial de incendios en Nariño desde 2019",
      },
      {
        type: "image",
        src: "/proyectos/atalaya/mapa.webp",
        ratio: 1080 / 2198,
        alt: "Mapa de Nariño con el riesgo de cada municipio y los niveles de riesgo",
      },
      {
        type: "image",
        src: "/proyectos/atalaya/factores.webp",
        ratio: 1080 / 2198,
        alt: "De qué depende el puntaje: clima seco, focos cercanos e historial de incendios",
      },
    ],
    format: "mobile",
    primary: {
      label: "GitHub",
      href: "https://github.com/Gabrl0103/Willay-Firemap",
    },
    secondary: { label: "Descargar APK", href: "/descargas/atalaya.apk" },
    detail: {
      problema:
        "La información sobre el riesgo de incendios forestales en Nariño está dispersa y no es fácil de consultar desde el celular.",
      solucion:
        "Una app que muestra un indicador de riesgo por municipio sobre un mapa, alimentada por una API propia con datos geoespaciales en PostgreSQL con PostGIS.",
      rol: "Creador: diseño, desarrollo de la app y de la API, y despliegue.",
      resultado:
        "App Android (APK) hecha con Ionic, Angular y Capacitor, con backend en Express 5 + TypeScript desplegado en Render y base de datos en Neon.",
    },
  },
  {
    id: "sencia",
    title: "Briefings Sencia",
    short: "Sencia",
    summary: "Briefings en línea para un estudio de diseño interior.",
    summaryMark: "Briefings en línea",
    description:
      "Aplicación web para un estudio de diseño interior que reemplazó el briefing que se enviaba por WhatsApp: formularios que guardan, avisan y ordenan cada solicitud en un panel privado.",
    kind: "Proyecto para cliente · Web",
    tags: [
      "JavaScript",
      "Node.js",
      "Express",
      "PostgreSQL",
      "PDFKit",
      "Resend",
    ],
    art: "sencia",
    format: "web",
    primary: { label: "Código", href: "", note: "Privado" },
    secondary: { label: "Sitio", href: "", note: "Privado del cliente" },
    // El sitio es privado: el video y las capturas muestran solo el formulario con datos de prueba, sin datos de clientes
    image: "/proyectos/sencia/cover.webp",
    media: [
      {
        type: "video",
        src: "/proyectos/sencia/demo.mp4",
        ratio: 800 / 964,
        alt: "Recorrido por el briefing comercial de Sencia, de los datos de contacto al envío",
        poster: "/proyectos/sencia/formulario.webp",
      },
      {
        type: "image",
        src: "/proyectos/sencia/formulario.webp",
        ratio: 800 / 964,
        alt: "Inicio del briefing comercial: datos de contacto y barra de progreso",
      },
      {
        type: "image",
        src: "/proyectos/sencia/operacion.webp",
        ratio: 800 / 964,
        alt: "Sección Operación: horario, personas, capacidad y zonas del espacio",
      },
      {
        type: "image",
        src: "/proyectos/sencia/tu-negocio.webp",
        ratio: 800 / 964,
        alt: "Secciones de estilo y fachada con opciones elegidas",
      },
      {
        type: "image",
        src: "/proyectos/sencia/cierre.webp",
        ratio: 800 / 964,
        alt: "Para cerrar y enviar el briefing a Sencia Estudio",
      },
      {
        type: "image",
        src: "/proyectos/sencia/gracias.webp",
        ratio: 800 / 964,
        alt: "Confirmación de envío del briefing",
      },
    ],
    detail: {
      problema:
        "El estudio recibía los briefings como mensajes de WhatsApp: información incompleta, difícil de buscar y fácil de perder.",
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
    summary: "Punto de venta para una heladería de frozen yogurt y açaí.",
    summaryMark: "Punto de venta",
    description:
      "Sistema de escritorio de punto de venta para Neveo, una heladería de frozen yogurt y açaí en Pasto: ventas, mesas, inventario, cierre de caja y un analizador de ventas en un solo lugar.",
    kind: "Proyecto para negocio · Escritorio",
    tags: ["JavaScript", "Java", "CSS", "HTML", "Python"],
    art: "neveo",
    image: "/proyectos/neveo-pos/cover.webp",
    media: [
      {
        type: "video",
        src: "/proyectos/neveo-pos/demo.mp4",
        ratio: 1440 / 900,
        alt: "Neveo POS funcionando: turno, mesas, pedido, cobro, reportes y análisis",
        poster: "/proyectos/neveo-pos/mesas.webp",
      },
      {
        type: "image",
        src: "/proyectos/neveo-pos/mesas.webp",
        ratio: 1440 / 900,
        alt: "Mesas: cuáles están ocupadas y cuánto debe cada una",
      },
      {
        type: "image",
        src: "/proyectos/neveo-pos/pedido.webp",
        ratio: 1440 / 900,
        alt: "Pedido de una mesa: catálogo por categorías y pedido actual",
      },
      {
        type: "image",
        src: "/proyectos/neveo-pos/cobro.webp",
        ratio: 1440 / 900,
        alt: "Cobro: método de pago, efectivo recibido y cambio",
      },
      {
        type: "image",
        src: "/proyectos/neveo-pos/turno.webp",
        ratio: 1440 / 900,
        alt: "Turno del día: ventas por método de pago y lo esperado en caja",
      },
      {
        type: "image",
        src: "/proyectos/neveo-pos/analisis.webp",
        ratio: 1440 / 900,
        alt: "Análisis de ventas: horas pico, lo más vendido e ideas de combos",
      },
    ],
    format: "desktop",
    primary: {
      label: "GitHub",
      href: "https://github.com/Gabrl0103/Servicios-Hosteleria-Neveo",
    },
    secondary: { label: "Instagram de Neveo", href: site.instagram },
    detail: {
      problema:
        "El negocio necesitaba llevar en orden las ventas, la caja, el inventario y las mesas. Hacerlo a mano tomaba tiempo al cerrar el día y el cuadre de caja era propenso a errores.",
      solucion:
        "Un sistema para registrar ventas, crear y atender mesas, modificar el catálogo, hacer el cierre de caja, consultar el historial de ventas y analizarlas para ver qué se vende más y cuándo.",
      rol: "Creador: diseño y desarrollo de todo el sistema, a partir de las necesidades del día a día del local.",
      resultado:
        "Menos tiempo cerrando caja, menos errores en el cuadre y más seguridad en el manejo del dinero y de la información del negocio.",
    },
  },
  {
    id: "serviciosya",
    title: "ServiciosYa",
    short: "ServiciosYa",
    summary: "Paga y analiza tus servicios públicos en un solo lugar.",
    summaryMark: "en un solo lugar",
    description:
      "Plataforma web para centralizar y pagar los servicios públicos del hogar (agua, energía, gas e internet). Lee las facturas con una foto y usa IA para analizar el consumo. Proyecto en equipo de cuarto semestre.",
    kind: "Proyecto académico · Web · En equipo",
    tags: [
      "Java",
      "Spring Boot",
      "PostgreSQL",
      "Redis",
      "React",
      "Tailwind CSS",
      "Stripe",
      "IA",
    ],
    art: "servicios",
    image: "/proyectos/serviciosya/cover.webp",
    media: [
      {
        type: "video",
        src: "/proyectos/serviciosya/demo.mp4",
        ratio: 1440 / 900,
        alt: "ServiciosYa funcionando: inicio, facturas, análisis con IA, autopago y notificaciones",
        poster: "/proyectos/serviciosya/inicio.webp",
      },
      {
        type: "image",
        src: "/proyectos/serviciosya/inicio.webp",
        ratio: 1440 / 900,
        alt: "Inicio: total a pagar del mes, próximos vencimientos e insights de IA",
      },
      {
        type: "image",
        src: "/proyectos/serviciosya/facturas.webp",
        ratio: 1440 / 900,
        alt: "Mis facturas: agua, energía, gas e internet con su estado",
      },
      {
        type: "image",
        src: "/proyectos/serviciosya/analisis.webp",
        ratio: 1440 / 900,
        alt: "Análisis con IA: predicción de la próxima factura y comparación con vecinos",
      },
      {
        type: "image",
        src: "/proyectos/serviciosya/notificaciones.webp",
        ratio: 1440 / 900,
        alt: "Notificaciones: vencimientos, consumo fuera de lo normal y pagos confirmados",
      },
      {
        type: "image",
        src: "/proyectos/serviciosya/autopago.webp",
        ratio: 1440 / 900,
        alt: "Autopago: reglas para pagar servicios automáticamente",
      },
    ],
    format: "web",
    primary: {
      label: "GitHub · Frontend",
      href: "https://github.com/juandabettt/servicios-frontend",
    },
    secondary: {
      label: "GitHub · Backend",
      href: "https://github.com/juandabettt/gestion-servicios-backend",
    },
    detail: {
      problema:
        "En un hogar colombiano las facturas de agua, energía, gas e internet llegan por separado, en papel y con fechas distintas: es fácil olvidar un pago y difícil saber si el consumo está subiendo.",
      solucion:
        "Una plataforma que digitaliza las facturas desde una foto, las reúne en un solo panel, permite pagarlas (pasarela simulada y Stripe), avisa antes de cada vencimiento y analiza el historial de consumo con IA para detectar anomalías y recomendar cómo ahorrar.",
      rol: "Parte del backend e implementación de la IA: lectura de facturas por foto (OCR) y análisis del consumo con recomendaciones.",
      resultado:
        "Backend en Java 17 con Spring Boot 3, PostgreSQL y Redis, desplegado en Railway, con un frontend en React, Vite y Tailwind conectado a la API. Trabajo en equipo con frontend y backend separados.",
    },
  },
];
