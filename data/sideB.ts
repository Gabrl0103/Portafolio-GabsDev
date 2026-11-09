/** Lado B: lo personal, como la lista de canciones de un vinilo. `duration` es decorativa. */
export interface Track {
  title: string;
  duration: string;
  text: string;
}

export const tracks: Track[] = [
  {
    title: "Neveo",
    duration: "3:24",
    text: "Llevo el marketing y las redes de Neveo, una heladería y açaí en Pasto. Ahí aprendí a vender, a hablar con clientes y a contar una marca en Instagram y TikTok. Ayudamos a traer el açaí a la ciudad.",
  },
  {
    title: "Pasto",
    duration: "2:58",
    text: "Vivo y estudio en Pasto, Colombia. Me gusta lo tranquila que es, su clima y todo lo que todavía puede crecer. Quiero construir cosas que sirvan aquí primero.",
  },
  {
    title: "Lo que suena mientras programo",
    duration: "4:12",
    text: "House y rap, sobre todo: Drake, Kettama, Calvin Harris y Sade, entre muchos otros.",
  },
  {
    title: "Fuera de la pantalla",
    duration: "3:05",
    text: "El fútbol y el deporte, producir música, la ropa y los videojuegos.",
  },
  {
    title: "Lo que quiero aprender",
    duration: "3:41",
    text: "Orquestar agentes de IA que trabajen en paralelo y automatizar procesos completos de principio a fin.",
  },
];
