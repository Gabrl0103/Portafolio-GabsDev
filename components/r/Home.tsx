import AboutR from "@/components/r/AboutR";
import CardIntro from "@/components/r/CardIntro";
import ContactR from "@/components/r/ContactR";
import Cursor from "@/components/r/Cursor";
import ExperienceR from "@/components/r/ExperienceR";
import IntroScene from "@/components/r/IntroScene";
import Nav from "@/components/r/Nav";
import ProjectsR from "@/components/r/ProjectsR";
import RevealObserver from "@/components/r/RevealObserver";
import ServicesR from "@/components/r/ServicesR";
import TestimonialsR from "@/components/r/TestimonialsR";
import { LangProvider, type Lang } from "@/lib/i18n";

/** El portafolio completo, en español ("/") o en inglés ("/en"). */
export default function Home({ lang }: { lang: Lang }) {
  return (
    <LangProvider lang={lang}>
      <CardIntro />
      <Cursor />
      <RevealObserver />
      <Nav />
      <main>
        {/* Inicio y Acerca de mí: una sola escena fija al bajar */}
        <IntroScene />
        <div className="relative z-[2] bg-bg">
          <AboutR />
          <ProjectsR />
          <ServicesR />
          <TestimonialsR />
          <ExperienceR />
          <ContactR />
        </div>
      </main>
    </LangProvider>
  );
}
