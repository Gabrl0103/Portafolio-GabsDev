/** Textos y opciones de la sección de contacto. */
export const contact = {
  title: "Construyamos tu próximo",
  titleAccent: "proyecto",
  subtitleCall: "Diseño y desarrollo web. Elige un día y una hora.",
  subtitleMessage: "Diseño y desarrollo web. Déjame una nota y te respondo por correo.",
};

/** Opciones de "¿Qué necesitas?" (se pueden elegir varias). */
export const services = ["Landing page", "Sitio de varias páginas", "Rediseño", "App web", "App móvil", "Otro"];

/** Opciones de "¿Para cuándo?" (se elige una). */
export const timelines = ["Lo antes posible", "En 1 mes", "En 2–3 meses", "Sin prisa"];

/**
 * Disponibilidad para llamadas, en hora de Colombia (America/Bogota).
 * days: 0 = domingo … 6 = sábado.
 */
export const availability = {
  days: [1, 2, 3, 4, 5],
  start: "14:00",
  end: "18:00",
  stepMinutes: 30,
  /** Cuántos meses hacia adelante se pueden ver. */
  monthsAhead: 2,
  /** Horas mínimas de anticipación para reservar. */
  minNoticeHours: 2,
};
