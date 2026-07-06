import { Header, Hero } from "./components/Hero";
import { Partners, Metrics, Tasks, Approach } from "./components/Sections1";
import { Services } from "./components/Services";
import { WhiteImport, FixBefore, DeliveryMethods, Formats, Enterprise } from "./components/Sections2";
import { Routes, Documents, CargoTypes, Process, Scenarios, Limits, SeoBlock } from "./components/Sections3";
import { Faq, Calculator, CTA, Footer } from "./components/Sections4";

export default function App() {
  return (
    <div
      className="min-h-screen w-full"
      style={{
        background: "#EEEBE4",
        color: "#0A1220",
        fontFamily: "'Manrope', 'Inter', system-ui, sans-serif",
      }}
    >
      <Header />
      <Hero />
      <Partners />
      <Metrics />
      <Tasks />
      <Approach />
      <Services />
      <WhiteImport />
      <FixBefore />
      <DeliveryMethods />
      <Formats />
      <Enterprise />
      <Routes />
      <Documents />
      <CargoTypes />
      <Process />
      <Scenarios />
      <Limits />
      <SeoBlock />
      <Faq />
      <Calculator />
      <CTA />
      <Footer />
    </div>
  );
}
