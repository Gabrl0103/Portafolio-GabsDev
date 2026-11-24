/**
 * Traducción al inglés de los datos del portafolio.
 * Solo van los textos: imágenes, enlaces y orden salen de los archivos en español.
 * Si agregas un proyecto, servicio, testimonio o experiencia, agrega aquí su texto en inglés
 * (si falta, se muestra el español).
 */

export const siteEn = {
  role: "Full Stack & AI Developer",
  semester: "5th semester",
};

export const sectionsEn: Record<string, string> = {
  acerca: "About me",
  proyectos: "Projects",
  servicios: "Services",
  testimonios: "Testimonials",
  experiencia: "Experience",
  contacto: "Contact",
};

export const aboutEn = {
  now: [
    { label: "Latest projects", value: "Cenit Skillmap, Rumbo and Atalaya" },
    {
      label: "Learning",
      value: "UX/UI landing pages, AI on the web, SaaS and digital marketing",
    },
    {
      label: "Availability",
      value: "Open to internships and freelance work to gain experience",
    },
  ],
  openTo: ["Internships", "Freelance", "Projects", "Collaborations"],
  stats: [
    { value: "5th", label: "semester of Engineering" },
    { value: "7", label: "projects built" },
    { value: "B2", label: "English level" },
  ],
};

type ProjectText = {
  summary?: string;
  summaryMark?: string;
  description: string;
  kind: string;
  tags?: string[];
  alts?: string[];
  demo?: { label: string; note?: string };
  primary?: { label: string; note?: string };
  secondary?: { label: string; note?: string };
  detail: {
    problema: string;
    solucion: string;
    rol: string;
    resultado: string;
  };
};

export const projectsEn: Record<string, ProjectText> = {
  skillmap: {
    summary:
      "Your skills path to the role you want, based on real job postings.",
    summaryMark: "based on real job postings",
    description:
      "A desktop app that works like a GPS for your career: it maps the skills you already have and the ones you want to learn, and uses AI to analyze job offers and measure how well you fit each role. My most ambitious university project.",
    kind: "University project · Desktop",
    tags: [
      "JavaScript",
      "HTML",
      "CSS",
      "Tailwind CSS",
      "Hexagonal architecture",
      "AI",
    ],
    alts: [
      "Cenit Skillmap demo: My Path, Map and Analyzer",
      "Cenit skills map grouped by area",
      "Job posting analyzer with skills compatibility",
      "My Path: readiness level and this week's priority gaps",
      "Goal: pick the role you want to reach and your readiness level",
      "Skills: the whole catalog with what you master, are learning and still need",
    ],
    demo: { label: "Download for Windows" },
    detail: {
      problema:
        "People shaping their careers have no clear way to see what they know, what they are missing and how close they are to the jobs they want.",
      solucion:
        "A map of learned and to-learn skills, plus an AI analyzer that compares your profile with job offers. It ships as an executable (.exe) and works offline.",
      rol: "Creator: design, frontend and backend development, and packaging the app.",
      resultado:
        "Backend with clean, hexagonal architecture, SOLID principles and patterns such as Repository, Factory, Observer and dependency injection. A framework-free JavaScript frontend that works offline.",
    },
  },
  rumbo: {
    summary: "Walking navigation through watch vibrations for blind people.",
    summaryMark: "for blind people",
    description:
      "A Wear OS smartwatch app that guides blind and low-vision people with vibrations while they walk. You say your destination out loud and the watch takes you there with vibration patterns and spoken guidance.",
    kind: "Academic project · Wear OS",
    alts: [
      "Rumbo running on the Wear OS emulator: destination, vibrations, route and rerouting",
      "Destination confirmed: Parque infantil, 269 m and 4 minutes away on foot",
      "Upcoming turn alert: turn left in 37 m",
      "GPS map on route: your position and the path, with the next turn in 51 m",
      "AI assistant: asked “how far is it?”, it answers “about 470 meters left”",
      "End of the route: You've arrived! at Parque infantil",
    ],
    demo: { label: "Download APK (Wear OS)" },
    detail: {
      problema:
        "Walking around the city without sight means relying on another person or on apps designed to look at a screen. Rumbo aims to give autonomy with a device people already wear on their wrist.",
      solucion:
        "The watch calculates the walking route and turns it into vibrations (left, right, upcoming turn, off route and arrival), with step-by-step spoken guidance, stair alerts, favorite places and an assistant that answers “how far is it?”. Critical navigation runs on the watch with local rules, without depending on AI or the network.",
      rol: "Creator: design, clean 4-layer architecture, watch and backend development, and testing with JUnit and pytest.",
      resultado:
        "A working app for Wear OS 3+ with a backend deployed on Render, combining GPS, voice and AI without putting guidance at risk when the connection drops.",
    },
  },
  asqua: {
    summary: "Third-person adventure with AI-generated levels.",
    summaryMark: "AI-generated levels",
    description:
      "A third-person action-adventure game: Ilse walks through a square over several nights with a lantern, brings Hope back to each area and defends herself from shadow creatures. From the fifth night on, levels are generated by an AI system that adapts to how you play.",
    kind: "Academic project · Video game · Team",
    tags: [
      "Unity 6",
      "C#",
      "URP",
      "Cinemachine",
      "NavMesh",
      "AI",
      "EditMode tests",
    ],
    detail: {
      problema:
        "A night-based game with handmade levels runs out quickly and doesn't respond to how each person plays. And letting an AI create levels unchecked can produce broken or unfair nights.",
      solucion:
        "An AI level generator that only proposes the night's parameters, not the geometry. Every proposal goes through a validator, and if the AI is unavailable a procedural generator takes its place. It adapts to the player's performance, and the “View DNA” panel shows why each night is the way it is.",
      rol: "Part of a team of 3 (with Miguel and Jairo). I built the AI level generation system and its automated tests, and added features such as endings, saving, nightly events, the Herald Hunt, the “Endless Nights” mode and the Candlesnuffer enemy. The world, characters, combat and dialogue are mainly Miguel's work.",
      resultado:
        "Nights 1 to 4 are handmade and from night 5 on they are generated by the AI system, with the generator logic covered by tests. The game has several endings depending on what you do. Final project for Interface Design (HCI), in progress.",
    },
  },
  atalaya: {
    summary: "Wildfire risk by municipality in Nariño.",
    summaryMark: "Wildfire risk",
    description:
      "An Android app that shows wildfire risk by municipality in Nariño, Colombia. It's an indicator to inform and prevent, not a prediction.",
    kind: "Academic project · Android",
    alts: [
      "Atalaya demo: home, Buesaco detail and history",
      "Home: average risk in Nariño and highest-risk areas",
      "Map with Buesaco's risk detail",
      "Wildfire history in Nariño since 2019",
      "Map of Nariño with each municipality's risk and the risk levels",
      "What the score depends on: dry weather, nearby hotspots and fire history",
    ],
    secondary: { label: "Download APK" },
    detail: {
      problema:
        "Information about wildfire risk in Nariño is scattered and hard to check from a phone.",
      solucion:
        "An app that shows a risk indicator per municipality on a map, powered by its own API with geospatial data in PostgreSQL with PostGIS.",
      rol: "Creator: design, app and API development, and deployment.",
      resultado:
        "An Android app (APK) built with Ionic, Angular and Capacitor, with an Express 5 + TypeScript backend deployed on Render and a Neon database.",
    },
  },
  sencia: {
    summary: "Online briefings for an interior design studio.",
    summaryMark: "Online briefings",
    description:
      "A web app for an interior design studio that replaced the briefing sent over WhatsApp: forms that save, notify and organize every request in a private dashboard.",
    kind: "Client project · Web",
    alts: [
      "Walkthrough of Sencia's commercial briefing, from contact details to submission",
      "Start of the commercial briefing: contact details and progress bar",
      "Operations section: hours, staff, capacity and areas of the space",
      "Style and facade sections with chosen options",
      "Wrapping up and sending the briefing to Sencia Estudio",
      "Briefing submission confirmation",
    ],
    primary: { label: "Code", note: "Private" },
    secondary: { label: "Website", note: "Client's private site" },
    detail: {
      problema:
        "The studio received briefings as WhatsApp messages: incomplete information, hard to search and easy to lose.",
      solucion:
        "Two forms (home and commercial) with a progress bar, validation and autosave. Answers arrive in a private dashboard with tabs, color labels, search, statuses and PDF and CSV export, and every submission sends an email notification.",
      rol: "Design, development and deployment of the whole application.",
      resultado:
        "It runs entirely on free plans ($0 a month), with careful security: a secret-link dashboard, per-IP submission limits, bot and XSS protection, keys in environment variables and personal data consent (Colombian Law 1581).",
    },
  },
  "neveo-pos": {
    summary: "Point of sale for a frozen yogurt and açaí shop.",
    summaryMark: "Point of sale",
    description:
      "A desktop point-of-sale system for Neveo, a frozen yogurt and açaí shop in Pasto: sales, tables, inventory, cash closing and a sales analyzer in one place.",
    kind: "Business project · Desktop",
    alts: [
      "Neveo POS running: shift, tables, order, payment, reports and analysis",
      "Tables: which are taken and how much each one owes",
      "A table's order: catalog by category and the current order",
      "Payment: method, cash received and change",
      "Today's shift: sales by payment method and expected cash",
      "Sales analysis: peak hours, best sellers and combo ideas",
    ],
    primary: { label: "GitHub" },
    secondary: { label: "Neveo on Instagram" },
    detail: {
      problema:
        "The business needed to keep sales, cash, inventory and tables in order. Doing it by hand took time at closing and balancing the register was error-prone.",
      solucion:
        "A system to record sales, open and serve tables, edit the catalog, close the register, check sales history and analyze it to see what sells most and when.",
      rol: "Creator: design and development of the whole system, based on the shop's day-to-day needs.",
      resultado:
        "Less time closing the register, fewer balancing errors and more security handling the money and the business's information.",
    },
  },
  serviciosya: {
    summary: "Pay and analyze your utilities in one place.",
    summaryMark: "in one place",
    description:
      "A web platform to centralize and pay household utilities (water, power, gas and internet). It reads bills from a photo and uses AI to analyze consumption. A fourth-semester team project.",
    kind: "Academic project · Web · Team",
    tags: [
      "Java",
      "Spring Boot",
      "PostgreSQL",
      "Redis",
      "React",
      "Tailwind CSS",
      "Stripe",
      "AI",
    ],
    alts: [
      "ServiciosYa running: home, bills, AI analysis, autopay and notifications",
      "Home: total due this month, upcoming due dates and AI insights",
      "My bills: water, power, gas and internet with their status",
      "AI analysis: next bill forecast and comparison with neighbors",
      "Notifications: due dates, unusual consumption and confirmed payments",
      "Autopay: rules to pay services automatically",
    ],
    detail: {
      problema:
        "In a Colombian household, water, power, gas and internet bills arrive separately, on paper and on different dates: it's easy to miss a payment and hard to tell if consumption is going up.",
      solucion:
        "A platform that digitizes bills from a photo, gathers them in one dashboard, lets you pay them (simulated gateway and Stripe), sends a reminder before each due date and analyzes consumption history with AI to detect anomalies and suggest how to save.",
      rol: "Part of the backend and the AI implementation: reading bills from photos (OCR) and analyzing consumption with recommendations.",
      resultado:
        "A Java 17 backend with Spring Boot 3, PostgreSQL and Redis, deployed on Railway, with a React, Vite and Tailwind frontend connected to the API. Team work with separate frontend and backend.",
    },
  },
};

export const servicesEn = [
  {
    title: "Web development",
    text: "Complete websites and web apps, from the form to the admin dashboard, deployed and ready to use.",
    items: [
      "Landing pages and portfolios",
      "Apps with a database",
      "Dashboards with search and export",
    ],
    tools: {
      "IA en apps": "AI in apps",
      Automatización: "Automation",
    } as Record<string, string>,
  },
  {
    title: "Mobile and wearable apps",
    text: "Android and smartwatch apps, with their own API behind them, like Atalaya and Rumbo.",
    items: ["Android app (APK)", "Wear OS interfaces", "Maps, GPS and voice"],
  },
  {
    title: "Desktop apps",
    text: "Programs that solve a specific task and work offline, like Cenit Skillmap.",
    items: ["Windows executables", "Work offline", "Clean architecture"],
  },
  {
    title: "AI and automation",
    text: "I integrate AI models into apps and automate processes that are done by hand today, like Sencia's briefings.",
    items: [
      "AI assistants",
      "Automatic email notifications",
      "Forms that replace chats",
    ],
  },
  {
    title: "Marketing and social media",
    text: "Content and social media for local brands, from my experience running Neveo's Instagram and TikTok.",
    items: ["Instagram and TikTok", "Product launches", "Social media content"],
  },
];

/** Los testimonios se traducen; el original en español queda en data/testimonials.ts. */
export const testimonialsEn = [
  {
    role: "Neveo, frozen yogurt & açaí · Employment reference",
    quote:
      "Gabriel works at Neveo in customer service and social media, performing his duties well with responsibility, excellent teamwork, problem solving and tolerance.",
    highlight: "excellent teamwork",
  },
  {
    role: "Neveo, frozen yogurt & açaí · Marketing and social media",
    quote:
      "Gabriel's work leaves me speechless, because he's always someone who helps you, pushes you to innovate and brings new ideas. I recommend him 100%: in my businesses he has helped me keep up to date and made it easier to reach my customers.",
    highlight: "I recommend him 100%",
  },
  {
    role: "Interior design studio · Client",
    quote:
      "Gabriel replaced our WhatsApp briefing with an app that saves every request, notifies us by email and lets us export it as a PDF. He quickly understood what we needed and delivered it working in a short time.",
    highlight: "delivered it working in a short time",
  },
];

export const experienceEn = [
  {
    title: "Marketing and social media",
    place: "Neveo, frozen yogurt & açaí · Pasto",
    description:
      "I run the brand's marketing and social media on Instagram and TikTok. I helped introduce açaí in Pasto and build a customer base that prefers the product. I also developed its point-of-sale and accounting system.",
  },
  {
    title: "Freelance web developer",
    place: "Sencia, interior design studio",
    description:
      "I designed, developed and deployed a briefing app with forms, a private dashboard, PDF and CSV export and email notifications, on free plans.",
  },
  {
    title: "Software Engineering",
    place: "Universidad Cooperativa de Colombia · Pasto",
    description:
      "Currently in my fifth semester. Academic projects such as Rumbo (Wear OS), Atalaya (Android) and ServiciosYa (web, team project).",
  },
  {
    title: "High school diploma",
    place: "Colegio Sagrado Corazón de Jesús Bethlemitas · Pasto",
    description: "Secondary education.",
  },
];

/** Meses abreviados de las fechas de experiencia */
export const monthsEn: Record<string, string> = {
  Ene: "Jan",
  Abr: "Apr",
  Ago: "Aug",
  Dic: "Dec",
  Hoy: "Present",
};
