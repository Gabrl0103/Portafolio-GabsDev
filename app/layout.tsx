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
  themeColor: "#111111",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es" className={interTight.variable}>
      <body>{children}</body>
    </html>
  );
}
