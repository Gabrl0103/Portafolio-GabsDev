import type { Testimonial } from "@/types";

/**
 * Testimonios (mínimo 3, requisito). Los textos van tal como los escribió cada persona.
 * Cuando tengas el nombre de quien firma cada uno, cámbialo en `name`.
 */
export const testimonials: Testimonial[] = [
  {
    name: "Neveo, heladería y açaí",
    role: "Constancia laboral · Pasto",
    quote:
      "Gabriel Alejandro Guerrero Martínez labora en Neveo en el área de atención al cliente y redes, demostrando buen desempeño de sus labores con responsabilidad, excelente trabajo en equipo, resolución de problemas y tolerancia.",
    rating: 5,
  },
  {
    name: "Cliente de marketing y redes",
    role: "Emprendimiento en Pasto",
    quote:
      "El trabajo de Alejo es algo que me deja sin palabras, porque siempre es una persona que te colabora, te ayuda a innovar y te propone nuevas ideas. Lo recomiendo 100 %: en mis negocios ha hecho que me actualice y que sea más fácil llegar a mis clientes.",
    rating: 5,
  },
  {
    // Borrador: confirmar con Sencia antes de publicar
    name: "Sencia",
    role: "Estudio de diseño interior · Cliente",
    quote:
      "Gabs reemplazó nuestro briefing por WhatsApp con una aplicación que guarda cada solicitud, nos avisa por correo y nos deja exportarla en PDF. Entendió rápido lo que necesitábamos y lo entregó funcionando en poco tiempo.",
    rating: 5,
  },
];
