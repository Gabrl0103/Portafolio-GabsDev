import type { Metadata } from "next";
import Home from "@/components/e/Home";
import { site } from "@/data/site";

export const metadata: Metadata = {
  title: `${site.name} · Portfolio ${site.year}`,
  description:
    "Portfolio of Gabriel Guerrero, a Software Engineering student in Pasto, Colombia. Web, mobile and desktop apps built with Next.js, TypeScript and Tailwind CSS.",
  alternates: { languages: { es: "/", en: "/en" } },
  openGraph: {
    title: `${site.name} · Portfolio`,
    description: "I design and build web, mobile and desktop apps.",
    locale: "en_US",
    type: "website",
  },
};

export default function Page() {
  return <Home lang="en" />;
}
