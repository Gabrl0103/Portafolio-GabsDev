import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Marquee from "@/components/Marquee";
import About from "@/components/About";
import Projects from "@/components/Projects";
import Testimonials from "@/components/Testimonials";
import Experience from "@/components/Experience";
import Skills from "@/components/Skills";
import SideB from "@/components/SideB";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import Backdrop from "@/components/fx/Backdrop";
import Intro from "@/components/fx/Intro";
import Effects from "@/components/fx/Effects";

export default function Home() {
  return (
    <>
      <Backdrop />
      <Intro />
      <div className="page">
        <Navbar />
        <main>
          <Hero />
          <Marquee />
          <About />
          <Projects />
          <Testimonials />
          <Experience />
          <Skills />
          <SideB />
          <Contact />
        </main>
        <Footer />
      </div>
      <Effects />
    </>
  );
}
