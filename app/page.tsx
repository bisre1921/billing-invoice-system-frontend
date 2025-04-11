import About from "./components/About";
import Comapnies from "./components/Companies";
import Contact from "./components/Contact";
import Hero from "./components/Hero";

export default function Home() {
  return (
    <div>
      <section id="hero">
        <Hero />
      </section>
      <section id="about" className="pt-16 bg-neutral-100">
        <About />
      </section>
      <section id="companies" className="pt-16 bg-neutral-100">
        <Comapnies />
      </section>
      <section id="contact" className="pt-16 bg-neutral-100">
        <Contact />
      </section>
  </div>
  )
}