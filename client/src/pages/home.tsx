import React from "react";
import { HeroSection } from "@/components/hero-section";
import { PropertyGrid } from "@/components/property-grid";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { SEOHead } from "@/components/seo-head";
import { ShowcaseSection } from "@/components/showcase-section";
import { GalleriesSection } from "@/components/galleries-section";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import type { Guide } from "@shared/schema";


export default function Home() {
  const { data: guides = [] } = useQuery<Guide[]>({
    queryKey: ["/api/guides"],
  });

  return (
    <div className="min-h-screen bg-background">
      <SEOHead 
        title="UNCONVENTIONAL TOUR - Tour Operator Sharm El Sheikh | Escursioni Mar Rosso"
        description="✈️ Scopri Sharm El Sheikh con UNCONVENTIONAL TOUR! Tour operator specializzato in escursioni, snorkeling, diving e safari nel deserto. Esperienze autentiche nel Mar Rosso."
        keywords="tour operator sharm el sheikh, escursioni mar rosso, snorkeling sharm, diving egitto, safari deserto, unconventional tour, tour sharm"
        canonicalUrl="https://unconventionaltour.it/"
      />
      <Navigation />
      <main className="relative">
        <HeroSection />

        {/* Sezione Chi Siamo */}
        <section className="py-20 bg-white relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[#A8CFEB]/5 to-white opacity-60"></div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Testo a sinistra */}
              <div>
                <div className="mb-6">
                  <h2 className="text-4xl lg:text-5xl font-light text-gray-600 mb-3 tracking-wide">
                    Chi Siamo
                  </h2>
                  <div className="w-32 h-[2px] bg-gradient-to-r from-[#D4AF37] to-transparent"></div>
                </div>
                <div className="space-y-4 text-gray-500 text-lg leading-relaxed font-light">
                  <p>
                    Siamo un tour operator locale specializzato in Sharm El Sheikh, con anni di esperienza 
                    nell'organizzazione di escursioni e attività nel Mar Rosso e nel deserto egiziano.
                  </p>
                  <p>
                    Concepiamo il turismo non come una semplice attività ricreativa, ma come un tour educativo 
                    e piacevole verso luoghi e culture affascinanti. Lavoriamo a stretto contatto con guide locali 
                    esperte per garantire esperienze autentiche e indimenticabili a Sharm El Sheikh.
                  </p>
                </div>
              </div>

              {/* Immagine a destra */}
              <div className="relative">
                <div className="rounded-3xl overflow-hidden shadow-xl bg-gray-100 border border-[#D4AF37]/20">
                  <img 
                    src="/chi-siamo.png"
                    alt="UNCONVENTIONAL TOUR - Il tuo tour inizia qui"
                    loading="lazy"
                    decoding="async"
                    className="w-full h-[500px] object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="travels" className="py-20 bg-gradient-to-br from-white via-[#A8CFEB]/5 to-white relative overflow-hidden">
          <div className="absolute top-20 right-20 w-80 h-80 bg-[#A8CFEB]/15 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 left-20 w-96 h-96 bg-[#D4AF37]/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
          <div className="relative z-10 max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8">
            {/* Viaggi a tutta larghezza */}
            <div className="text-center mb-16 animate-fade-in">
              <div className="text-lg lg:text-xl font-light text-[#A8CFEB] mb-2 tracking-widest uppercase">Escursioni</div>
              <h2 className="text-5xl lg:text-7xl font-light mb-4 text-gray-500 tracking-wide">
                A Sharm El Sheikh
              </h2>
              <div className="w-64 h-[2px] bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent mx-auto mb-8"></div>
              <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed mb-12 font-light">
                Scopri le meraviglie del Mar Rosso e del deserto egiziano
              </p>
            </div>

            <div className="animate-slide-up">
              <PropertyGrid showAll={true} />
            </div>
          </div>
        </section>

        {/* Sezioni Vetrina */}
        <ShowcaseSection category="emirati_arabi" />
        <ShowcaseSection category="europa" />
        <ShowcaseSection category="asia" />
        <ShowcaseSection category="esotico" />

        {/* Sezione Gallerie */}
        <GalleriesSection />

      </main>
      <Footer />
    </div>
  );
}