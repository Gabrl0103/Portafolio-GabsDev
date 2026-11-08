/** Cambia entre tema claro y oscuro y lo recuerda en este navegador. */
export function toggleTheme() {
  const root = document.documentElement;
  const next = root.getAttribute("data-theme") === "light" ? "dark" : "light";
  root.setAttribute("data-theme", next);
  try {
    localStorage.setItem("theme", next);
  } catch {}
}

/** Lleva a una sección con desplazamiento suave (o al inicio). */
export function scrollToSection(id: string) {
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (id === "inicio") scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
  else document.getElementById(id)?.scrollIntoView({ behavior: reduce ? "auto" : "smooth" });
}

/** Copia texto al portapapeles y avisa si funcionó. */
export async function copyText(t: string) {
  try {
    await navigator.clipboard.writeText(t);
    return true;
  } catch {
    return false;
  }
}
