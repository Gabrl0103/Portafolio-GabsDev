import { site } from "@/data/site";

/** Si defines NEXT_PUBLIC_FORMSPREE_ID se envía por Formspree; si no, se abre la app de correo con el texto listo. */
export const FORMSPREE_ID = process.env.NEXT_PUBLIC_FORMSPREE_ID;

export async function sendMessage(subject: string, fields: Record<string, string>) {
  if (FORMSPREE_ID) {
    const res = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
      method: "POST",
      headers: { Accept: "application/json", "Content-Type": "application/json" },
      body: JSON.stringify({ _subject: subject, ...fields }),
    });
    if (!res.ok) throw new Error("No se pudo enviar");
    return "formspree" as const;
  }
  const body = Object.entries(fields)
    .filter(([, v]) => v)
    .map(([k, v]) => `${k}: ${v}`)
    .join("\n");
  window.location.href = `mailto:${site.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  return "mailto" as const;
}

export const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
