import AboutR from "@/components/r/AboutR";
import CardIntro from "@/components/r/CardIntro";
import ContactR from "@/components/r/ContactR";
import Cursor from "@/components/r/Cursor";
import ExperienceR from "@/components/r/ExperienceR";
import Hero from "@/components/r/Hero";
import Nav from "@/components/r/Nav";
import ProjectsR from "@/components/r/ProjectsR";
import RevealObserver from "@/components/r/RevealObserver";
import ServicesR from "@/components/r/ServicesR";
import TestimonialsR from "@/components/r/TestimonialsR";
import ToolsR from "@/components/r/ToolsR";

export default function Home() {
  return (
    <>
      <CardIntro />
      <Cursor />
      <RevealObserver />
      <Nav />
      <main>
        <Hero />
        {/* Hoja que sube por encima del hero al bajar */}
        <div className="relative z-[2] rounded-t-[36px] bg-bg shadow-[0_-40px_80px_-20px_rgba(0,0,0,.45)] max-[900px]:rounded-t-[26px]">
          <AboutR />
          <ProjectsR />
          <ServicesR />
          <ToolsR />
          <TestimonialsR />
          <ExperienceR />
          <ContactR />
        </div>
      </main>
    </>
  );
}
