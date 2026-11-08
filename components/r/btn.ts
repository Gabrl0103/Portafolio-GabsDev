/** Botones del rediseño (clases de Tailwind). */
const base =
  "inline-flex h-11 cursor-pointer items-center gap-2 rounded-full border px-5 font-disp text-[15px] font-medium transition-[background,color,border-color,translate] duration-300";

/** Contorno: se rellena al pasar el cursor */
export const btn = `${base} border-line bg-transparent text-fg hover:border-fg hover:bg-fg hover:text-bg`;
/** Relleno: pasa a naranja al pasar el cursor */
export const btnF = `${base} border-fg bg-fg text-bg hover:border-orange hover:bg-orange hover:text-white`;
/** Etiqueta de sección: "(01) Acerca de mí" */
export const lab = "mono flex items-center gap-3.5 text-mut [&_b]:font-medium [&_b]:text-fg";
