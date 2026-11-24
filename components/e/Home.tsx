import { LangProvider, type Lang } from "@/lib/i18n";
import About from "./About";
import Contact from "./Contact";
import Experience from "./Experience";
import Header from "./Header";
import Hero from "./Hero";
import { Reveal } from "./parts";
import Projects from "./Projects";
import ScrollFx from "./ScrollFx";
import { CursorTrack } from "./Track";
import Services from "./Services";
import Testimonials from "./Testimonials";

/** El portafolio completo, en español ("/") o en inglés ("/en"). */
export default function Home({ lang }: { lang: Lang }) {
  return (
    <LangProvider lang={lang}>
      <Reveal />
      <ScrollFx />
      <CursorTrack />
      <Header />
      <main>
        <Hero />
        <About />
        <Projects />
        <Services />
        <Testimonials />
        <Experience />
        <Contact />
      </main>
    </LangProvider>
  );
}
