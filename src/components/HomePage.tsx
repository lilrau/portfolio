import FluidBackground from "./fluid";
import NavBar from "./NavBar";
import SmoothScroll from "./SmoothScroll";
import GlassCursor from "./GlassCursor";
import Preloader from "./Preloader";
import Hero from "./sections/Hero";
import Work from "./sections/Work";
import Experience from "./sections/Experience";
import About from "./sections/About";
import Contact from "./sections/Contact";
import Footer from "./sections/Footer";
import type { Dictionary, Locale } from "../i18n";

export default function HomePage({ dict, locale }: { dict: Dictionary; locale: Locale }) {
  return (
    <>
      <a
        href="#about"
        className="sr-only z-[var(--z-preloader)] rounded-full bg-ink px-5 py-3 text-sm font-medium text-ink-inverse focus:not-sr-only focus:fixed focus:top-4 focus:left-4"
      >
        {dict.ui.skip}
      </a>
      <Preloader firstName={dict.hero.firstName} lastName={dict.hero.lastName} skipLabel={dict.ui.preloaderSkip} />
      <FluidBackground />
      <SmoothScroll />
      <GlassCursor />
      <NavBar dict={dict} locale={locale} />
      <main className="relative">
        <Hero copy={dict.hero} nextSectionId="about" />
        <About copy={dict.about} locale={locale} />
        <Experience copy={dict.experience} locale={locale} />
        <Work copy={dict.work} locale={locale} />
        <Contact copy={dict.contact} />
      </main>
      <Footer copy={dict.footer} />
    </>
  );
}
