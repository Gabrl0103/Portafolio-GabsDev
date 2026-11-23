import type { Metadata, Viewport } from "next";
import { JetBrains_Mono, Outfit } from "next/font/google";
import localFont from "next/font/local";
import { site } from "@/data/site";
import "./globals.css";

/** Etiquetas en mayúsculas */
const mono = JetBrains_Mono({ variable: "--font-jetbrains", subsets: ["latin"], weight: ["400", "500"] });
/** Letra principal (estilo rabanne): títulos, texto y menú */
const outfit = Outfit({ variable: "--font-outfit", subsets: ["latin"], weight: ["300", "400", "500", "600", "700", "800"] });
/**
 * Letra de los destacados (estilo VIDA): Fraunces negra con remates blandos (SOFT 100, WONK 1, opsz 144),
 * guardada ya fija en ese estilo para poder usarla también en el canvas del texto con grano.
 */
const vida = localFont({ src: "./fonts/vida.woff2", variable: "--font-vida", weight: "900", style: "normal", display: "swap" });

export const metadata: Metadata = {
  title: `${site.name} · Portafolio ${site.year}`,
  description:
    "Portafolio de Gabriel Guerrero, estudiante de Ingeniería de Software en Pasto. Apps web, móvil y de escritorio con Next.js, TypeScript y Tailwind CSS.",
  openGraph: {
    title: `${site.name} · Portafolio`,
    description: "Diseño y construyo apps web, móvil y de escritorio.",
    locale: "es_CO",
    type: "website",
  },
};

export const viewport: Viewport = {
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0F0D12" },
    { media: "(prefers-color-scheme: light)", color: "#E4CFB8" },
  ],
};

/** Fija el tema antes de pintar para evitar parpadeo. */
const themeScript = `(function(){var r=document.documentElement;r.classList.add('js');try{var t=localStorage.getItem('theme');if(t!=='light'&&t!=='dark')t=matchMedia('(prefers-color-scheme: light)').matches?'light':'dark';r.setAttribute('data-theme',t);}catch(e){r.setAttribute('data-theme','dark');}})();`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es" className={`${mono.variable} ${outfit.variable} ${vida.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
