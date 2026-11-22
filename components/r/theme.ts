/**
 * Cambia entre tema claro y oscuro y lo recuerda en este navegador.
 * El tema nuevo se expande en círculo desde el botón que se presionó (como en el diseño anterior).
 */
export function toggleTheme(e?: { currentTarget: EventTarget | null }) {
  const root = document.documentElement;
  const next = root.getAttribute("data-theme") === "light" ? "dark" : "light";
  const apply = () => {
    root.setAttribute("data-theme", next);
    try {
      localStorage.setItem("theme", next);
    } catch {}
  };
  const el = e?.currentTarget instanceof Element ? e.currentTarget : null;
  if (!el || matchMedia("(prefers-reduced-motion: reduce)").matches)
    return apply();

  const r = el.getBoundingClientRect();
  const x = r.left + r.width / 2;
  const y = r.top + r.height / 2;
  const rad = Math.hypot(
    Math.max(x, innerWidth - x),
    Math.max(y, innerHeight - y),
  );
  const clip = [
    `circle(0px at ${x}px ${y}px)`,
    `circle(${rad}px at ${x}px ${y}px)`,
  ];

  if (document.startViewTransition) {
    const vt = document.startViewTransition(apply);
    vt.ready
      .then(() =>
        root.animate(
          { clipPath: clip },
          {
            duration: 900,
            easing: "cubic-bezier(.65,0,.35,1)",
            pseudoElement: "::view-transition-new(root)",
          },
        ),
      )
      .catch(() => {});
    return;
  }
  // Navegadores sin View Transitions: una capa del color nuevo crece en círculo y luego se desvanece.
  const ov = document.createElement("div");
  ov.style.cssText = `position:fixed;inset:0;z-index:800;pointer-events:none;background:${next === "light" ? "#e4cfb8" : "#0d0e0f"}`;
  document.body.appendChild(ov);
  const a = ov.animate(
    { clipPath: clip },
    { duration: 700, easing: "cubic-bezier(.65,0,.35,1)", fill: "forwards" },
  );
  a.onfinish = () => {
    apply();
    ov.animate(
      { opacity: [1, 0] },
      { duration: 350, fill: "forwards" },
    ).onfinish = () => ov.remove();
  };
}

/** Lleva a una sección con desplazamiento suave (o al inicio). */
export function scrollToSection(id: string) {
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (id === "inicio")
    scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
  else
    document
      .getElementById(id)
      ?.scrollIntoView({ behavior: reduce ? "auto" : "smooth" });
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

/** Abre el detalle de un proyecto desde cualquier sección (lo escucha ProjectsR). */
export function openProject(id: string) {
  dispatchEvent(new CustomEvent("open-project", { detail: id }));
}

/** Diseños disponibles: el original y el alternativo "Atardecer" (solo desde el menú). */
export type Design = "original" | "atardecer";

export function currentDesign(): Design {
  return document.documentElement.getAttribute("data-design") === "atardecer"
    ? "atardecer"
    : "original";
}

/**
 * Cambia de diseño, lo recuerda y avisa a los componentes que dibujan en canvas.
 * El diseño nuevo se abre en círculo desde el centro de la pantalla (como el cambio de tema).
 */
export function setDesign(d: Design) {
  const root = document.documentElement;
  if (currentDesign() === d) return;
  const apply = () => {
    if (d === "atardecer") root.setAttribute("data-design", "atardecer");
    else root.removeAttribute("data-design");
    try {
      localStorage.setItem("design", d);
    } catch {}
    dispatchEvent(new CustomEvent("design-change", { detail: d }));
  };
  if (
    !document.startViewTransition ||
    matchMedia("(prefers-reduced-motion: reduce)").matches
  )
    return apply();
  const x = innerWidth / 2;
  const y = innerHeight / 2;
  const rad = Math.hypot(x, y);
  document
    .startViewTransition(apply)
    .ready.then(() =>
      root.animate(
        {
          clipPath: [
            `circle(0px at ${x}px ${y}px)`,
            `circle(${rad}px at ${x}px ${y}px)`,
          ],
        },
        {
          duration: 1000,
          easing: "cubic-bezier(.65,0,.35,1)",
          pseudoElement: "::view-transition-new(root)",
        },
      ),
    )
    .catch(() => {});
}
