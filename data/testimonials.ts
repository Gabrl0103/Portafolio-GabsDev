import type { Testimonial } from "@/types";

/** Mínimo 3 testimonios (requisito). Reemplaza los marcadores por opiniones reales. */
export const testimonials: Testimonial[] = [
  {
    name: "[Nombre del profesor/a]",
    role: "Profesor/a · Universidad Cooperativa de Colombia",
    quote: "[Testimonio: qué opina de tu trabajo, tu compromiso o tu forma de resolver problemas.]",
    rating: 5,
  },
  {
    name: "[Nombre del compañero/a]",
    role: "Compañero/a de proyecto",
    quote: "[Testimonio: cómo fue trabajar contigo en Skillmap, Firemap u otro proyecto.]",
    rating: 5,
  },
  {
    name: "[Nombre del cliente]",
    role: "Cliente de Neveo",
    quote: "[Testimonio: experiencia con la marca o con algo que construiste para ella.]",
    rating: 5,
  },
];
