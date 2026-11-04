import type { Metadata, Viewport } from "next";
import { Inter, Courier_Prime } from "next/font/google";
import { site } from "@/data/site";
import "./globals.css";

const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });
const courier = Courier_Prime({ variable: "--font-courier", subsets: ["latin"], weight: ["400", "700"] });

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
    { media: "(prefers-color-scheme: dark)", color: "#0E0F0B" },
    { media: "(prefers-color-scheme: light)", color: "#E9E6DA" },
  ],
};

/** Fija el tema antes de pintar para evitar parpadeo. */
const themeScript = `(function(){var r=document.documentElement;r.classList.add('js');try{var t=localStorage.getItem('theme');if(t!=='light'&&t!=='dark')t=matchMedia('(prefers-color-scheme: light)').matches?'light':'dark';r.setAttribute('data-theme',t);}catch(e){r.setAttribute('data-theme','dark');}})();`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es" className={`${inter.variable} ${courier.variable} scroll-smooth`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
