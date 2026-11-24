import type { Testimonial } from "@/types";

/**
 * Testimonios (mínimo 3, requisito). Los textos van tal como los escribió cada persona.
 * Cuando tengas el nombre de quien firma cada uno, cámbialo en `name`.
 */
export const testimonials: Testimonial[] = [
  {
    name: "Felipe Ocaña",
    role: "Neveo, frozen yogurt y açaí · Constancia laboral",
    quote:
      "Gabriel labora en Neveo en el área de atención al cliente y redes, demostrando buen desempeño de sus labores con responsabilidad, excelente trabajo en equipo, resolución de problemas y tolerancia.",
    highlight: "excelente trabajo en equipo",
    rating: 5,
  },
  {
    name: "Manuela G.",
    role: "Neveo, frozen yogurt y açaí · Marketing y redes",
    quote:
      "El trabajo de Gabriel es algo que me deja sin palabras, porque siempre es una persona que te colabora, te ayuda a innovar y te propone nuevas ideas. Lo recomiendo 100 %: en mis negocios ha hecho que me actualice y que sea más fácil llegar a mis clientes.",
    highlight: "Lo recomiendo 100 %",
    rating: 5,
  },
  {
    name: "Sencia",
    role: "Estudio de diseño interior · Cliente",
    quote:
      "Gabriel reemplazó nuestro briefing por WhatsApp con una aplicación que guarda cada solicitud, nos avisa por correo y nos deja exportarla en PDF. Entendió rápido lo que necesitábamos y lo entregó funcionando en poco tiempo.",
    highlight: "lo entregó funcionando en poco tiempo",
    rating: 5,
  },
];
