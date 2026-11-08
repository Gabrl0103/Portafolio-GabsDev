import type { Metadata, Viewport } from "next";
import { Inter, Inter_Tight, JetBrains_Mono, Outfit } from "next/font/google";
import { site } from "@/data/site";
import "./globals.css";

/** Texto corrido */
const inter = Inter({ variable: "--font-inter", subsets: ["latin"], weight: ["400", "500"] });
/** Títulos */
const tight = Inter_Tight({ variable: "--font-tight", subsets: ["latin"], weight: ["400", "500", "600", "700"] });
/** Etiquetas en mayúsculas */
const mono = JetBrains_Mono({ variable: "--font-jetbrains", subsets: ["latin"], weight: ["400", "500"] });
/** Texto con grano ("Gabs" gigante y la intro) */
const outfit = Outfit({ variable: "--font-outfit", subsets: ["latin"], weight: "800" });

export const metadata: Metadata = {
  title: `${site.name} · Portafolio ${site.year}`,
  description:
    "Portafolio de Gabs, estudiante de Ingeniería de Software en Pasto. Apps web, móvil y de escritorio con Next.js, TypeScript y Tailwind CSS.",
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
    { media: "(prefers-color-scheme: dark)", color: "#0D0E0F" },
    { media: "(prefers-color-scheme: light)", color: "#F3F1EB" },
  ],
};

/** Fija el tema antes de pintar para evitar parpadeo. */
const themeScript = `(function(){var r=document.documentElement;r.classList.add('js');try{var t=localStorage.getItem('theme');if(t!=='light'&&t!=='dark')t=matchMedia('(prefers-color-scheme: light)').matches?'light':'dark';r.setAttribute('data-theme',t);}catch(e){r.setAttribute('data-theme','dark');}})();`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es" className={`${inter.variable} ${tight.variable} ${mono.variable} ${outfit.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
