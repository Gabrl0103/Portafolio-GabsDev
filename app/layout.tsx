import type { Metadata, Viewport } from "next";
import { Inter_Tight } from "next/font/google";
import { site } from "@/data/site";
import "./globals.css";

/** Única familia del sitio */
const interTight = Inter_Tight({
  variable: "--font-inter-tight",
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: `${site.name} Guerrero · Portafolio ${site.year}`,
  description:
    "Portafolio de Gabriel Guerrero, estudiante de Ingeniería de Software en Pasto. Apps web, móvil y de escritorio con Next.js, TypeScript y Tailwind CSS.",
  alternates: { languages: { es: "/", en: "/en" } },
  openGraph: {
    title: `${site.name} Guerrero · Portafolio`,
    description:
      "Del diseño al código en producción: apps de escritorio, Android, Wear OS y web.",
    locale: "es_CO",
    type: "website",
  },
};

export const viewport: Viewport = {
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#111111" },
    { media: "(prefers-color-scheme: dark)", color: "#0b0b0b" },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es" className={interTight.variable} suppressHydrationWarning>
      <head>
        {/* Aplica el tema guardado antes de pintar, sin parpadeo */}
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var t=localStorage.getItem("theme");if(t==="dark"||t==="light")document.documentElement.dataset.theme=t}catch(e){}`,
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
