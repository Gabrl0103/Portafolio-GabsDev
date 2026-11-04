/**
 * Lado B: lo personal, presentado como la lista de canciones de un vinilo.
 * Cada "canción" es un dato sobre ti.
 * `duration` es decorativa (formato m:ss) y marca cuánto "suena" cada una.
 */
export interface Track {
  n: string;
  title: string;
  duration: string;
  text: string;
}

export const sideB = {
  title: "Lo que no sale en el *código*",
  sub: "Mi lado B: lo que hago, escucho y pienso cuando no estoy programando.",
};

export const tracks: Track[] = [
  {
    n: "B1",
    title: "Neveo",
    duration: "3:24",
    text: "Llevo el marketing y las redes de Neveo, una heladería y açaí en Pasto. Ahí aprendí a vender, a hablar con clientes y a contar una marca en Instagram y TikTok. Ayudamos a traer el açaí a la ciudad.",
  },
  {
    n: "B2",
    title: "Pasto",
    duration: "2:58",
    text: "Vivo y estudio en Pasto, Colombia. Me gusta lo tranquila que es, su clima y todo lo que todavía puede crecer. Quiero construir cosas que sirvan aquí primero.",
  },
  {
    n: "B3",
    title: "Lo que suena mientras programo",
    duration: "4:12",
    text: "House y rap, sobre todo: Drake, Kettama, Calvin Harris y Sade, entre muchos otros.",
  },
  {
    n: "B4",
    title: "Fuera de la pantalla",
    duration: "3:05",
    text: "El fútbol y el deporte, producir música, la ropa y los videojuegos.",
  },
  {
    n: "B5",
    title: "Lo que quiero aprender",
    duration: "3:41",
    text: "Orquestar agentes de IA que trabajen en paralelo y automatizar procesos completos de principio a fin.",
  },
  {
    n: "B6",
    title: "2:22",
    duration: "2:22",
    text: "Si ves las 2:22 en el reloj, mira el fondo. Y si presionas la tecla 2 tres veces, también pasa algo.",
  },
];
