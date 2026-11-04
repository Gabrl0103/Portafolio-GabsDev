/**
 * Lado B: lo personal, presentado como la lista de canciones de un vinilo.
 * Cada "canción" es un dato sobre ti. Lo que está entre [corchetes] es para que lo llenes.
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
    text: "Dirijo Neveo, una marca de helados y açaí pensada para gente joven en Pasto. Ahí aprendí a vender, a hablar con clientes y a diseñar para alguien que no es yo.",
  },
  {
    n: "B2",
    title: "Pasto",
    duration: "2:58",
    text: "Vivo y estudio en Pasto, Colombia. Me gusta construir cosas que sirvan aquí primero. [Añade algo que te guste de tu ciudad.]",
  },
  {
    n: "B3",
    title: "Lo que suena mientras programo",
    duration: "4:12",
    text: "[Artistas, géneros o una playlist que escuchas cuando programas.]",
  },
  {
    n: "B4",
    title: "Fuera de la pantalla",
    duration: "3:05",
    text: "[Un hobby o algo que haces cuando no estás frente al computador.]",
  },
  {
    n: "B5",
    title: "Lo que quiero aprender",
    duration: "3:41",
    text: "[La próxima tecnología, idioma o habilidad que quieres dominar.]",
  },
  {
    n: "B6",
    title: "2:22",
    duration: "2:22",
    text: "Si ves las 2:22 en el reloj, mira el fondo. Y si presionas la tecla 2 tres veces, también pasa algo.",
  },
];
