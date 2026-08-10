import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";
import { Header, Hero } from "./components/Hero";
import { Metrics, Tasks } from "./components/Sections1";
import { Services } from "./components/Services";
import { DeliveryMethods, Formats } from "./components/Sections2";
import { Process, Scenarios } from "./components/Sections3";
import { Faq, Calculator, CTA, Footer } from "./components/Sections4";
import { BRAND } from "./components/shared";
import { LanguageProvider, useLanguage } from "./i18n";

function BackToTopButton() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 1800);

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <button
      type="button"
      aria-label="Наверх"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="fixed right-8 bottom-8 z-50 h-14 w-14 rounded-full hidden md:flex items-center justify-center transition-[opacity,transform] duration-200 ease-out"
      style={{
        background: BRAND,
        color: "#FFFFFF",
        boxShadow: "0 18px 50px rgba(10,18,32,0.25)",
        opacity: visible ? 1 : 0,
        pointerEvents: visible ? "auto" : "none",
        transform: visible ? "translateY(0)" : "translateY(12px)",
        border: `1px solid rgba(255,255,255,0.25)`,
      }}
    >
      <ArrowUp size={22} strokeWidth={2.2} />
    </button>
  );
}

function AppContent() {
  const { lang } = useLanguage();

  return (
    <div
      key={lang}
      data-i18n-root
      className="min-h-screen w-full"
      style={{
        background: "#EEEBE4",
        color: "#0A1220",
        fontFamily: "'Manrope', 'Inter', system-ui, sans-serif",
      }}
    >
      <Header />
      <Hero />
      <Metrics />
      <Formats />
      <Tasks />
      <Services />
      <DeliveryMethods />
      <Process />
      <Scenarios />
      <Calculator />
      <CTA />
      <Faq />
      <Footer />
      <BackToTopButton />
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
}
