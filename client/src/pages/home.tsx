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
        <section className="py-20 bg-white pattern-dots relative overflow-hidden">
          <div className="absolute inset-0 gradient-animated opacity-30"></div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Testo a sinistra */}
              <div>
                <div className="mb-4">
                  <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-2">
                    Chi Siamo
                  </h2>
                  <div className="w-24 h-1 bg-blue-500"></div>
                </div>
                <div className="space-y-4 text-gray-700 text-lg leading-relaxed">
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
                <div className="rounded-3xl overflow-hidden shadow-2xl bg-gray-200">
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

        <section id="travels" className="py-20 bg-gradient-to-br from-blue-50 via-white to-purple-50 relative overflow-hidden pattern-waves">
          <div className="absolute top-20 right-20 w-72 h-72 bg-blue-400/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 left-20 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
          <div className="relative z-10 max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8">
            {/* Viaggi a tutta larghezza */}
            <div className="text-center mb-16 animate-fade-in">
              <h2 className="text-4xl lg:text-5xl font-light mb-4 text-gray-900">
                Tour in Evidenza
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-12">
                Scopri le destinazioni più belle del mondo con i nostri tour esclusivi
              </p>
            </div>

            <div className="animate-slide-up">
              <PropertyGrid showAll={false} />
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