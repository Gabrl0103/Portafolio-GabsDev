"use client";

import { useEffect, useState } from "react";

/** Hora actual de Pasto (America/Bogota). */
export default function Clock({ prefix = "Pasto · " }: { prefix?: string }) {
  const [time, setTime] = useState("00:00");

  useEffect(() => {
    const fmt = () =>
      new Date().toLocaleTimeString("es-CO", { hour: "2-digit", minute: "2-digit", hour12: false, timeZone: "America/Bogota" });
    const update = () => setTime(fmt());
    const first = setTimeout(update, 0);
    const id = setInterval(update, 20000);
    return () => {
      clearTimeout(first);
      clearInterval(id);
    };
  }, []);

  return (
    <span className="font-cine">
      {prefix}
      {time}
    </span>
  );
}
