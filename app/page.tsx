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

export default function Home() {
  return (
    <>
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
    </>
  );
}
