/** Une clases de Tailwind ignorando las vacías. */
export const cx = (...c: (string | false | null | undefined)[]) => c.filter(Boolean).join(" ");
