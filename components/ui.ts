/** Clases de Tailwind reutilizables para botones y etiquetas. */

export const cx = (...c: (string | false | null | undefined)[]) => c.filter(Boolean).join(" ");

type Variant = "glass" | "primary";
type Size = "md" | "sm" | "icon";

const base =
  // `btn` solo sirve de gancho para el brillo del cursor y el sonido (components/fx/Effects.tsx).
  "btn relative inline-flex cursor-pointer items-center justify-center gap-2.5 overflow-hidden rounded-full border border-transparent font-medium tracking-[-.01em] text-fg " +
  "[transition:transform_.45s_cubic-bezier(.34,1.56,.64,1),background_.25s,box-shadow_.3s] hover:brightness-110 active:scale-[.97] active:duration-[120ms] [&_svg]:shrink-0 " +
  "after:pointer-events-none after:absolute after:inset-0 after:rounded-[inherit] after:opacity-0 after:transition-opacity after:duration-300 hover:after:opacity-100 " +
  "after:bg-[radial-gradient(120px_circle_at_var(--mx,50%)_var(--my,50%),rgba(255,255,255,.22),transparent_70%)]";

const variants: Record<Variant, string> = {
  glass: "glass-flat",
  primary: "bg-acc text-acc-ink",
};

const sizes: Record<Size, string> = {
  md: "min-h-[46px] px-6 text-[15px]",
  sm: "min-h-[38px] px-[17px] text-sm/[1.5]",
  icon: "size-[46px] min-h-[46px] p-0 text-[15px]",
};

export function button({ variant = "glass", size = "md" }: { variant?: Variant; size?: Size } = {}) {
  return cx(base, variants[variant], sizes[size]);
}

/** Etiqueta tipo píldora de vidrio. */
export const chip = "glass-flat inline-block rounded-full px-[13px] py-[7px] text-[13px] font-medium tracking-normal text-mut";

/** Contenedor centrado con márgenes seguros en celular. */
export const wrap = "mx-auto max-w-[1200px] pr-[max(16px,env(safe-area-inset-right,0px))] pl-[max(16px,env(safe-area-inset-left,0px))]";
