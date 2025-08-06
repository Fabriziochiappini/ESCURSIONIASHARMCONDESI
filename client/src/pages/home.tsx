import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { HeroSection } from "@/components/hero-section";
import { ComplexSituations } from "@/components/complex-situations";
import { PropertyGrid } from "@/components/property-grid";
import { ServicesSection } from "@/components/services-section";
import { SpecializedServices } from "@/components/specialized-services";

import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { PropertySearchFilter } from "@/components/property-search-filter";
import type { SearchFilters } from "@shared/schema";
import { SEOHead } from "@/components/seo-head";

export default function Home() {
  const [location] = useLocation();
  const [filters, setFilters] = useState<SearchFilters>({});

  useEffect(() => {
    // Parse URL search parameters
    const searchParams = new URLSearchParams(window.location.search);
    const newFilters: SearchFilters = {};

    const type = searchParams.get('type');
    if (type && (type === 'vendita' || type === 'affitto' || type === 'casa_vacanza')) {
      newFilters.type = type;
    }

    const municipality = searchParams.get('municipality');
    if (municipality) {
      newFilters.municipality = municipality;
    }

    const maxPrice = searchParams.get('maxPrice');
    if (maxPrice) {
      newFilters.maxPrice = parseInt(maxPrice);
    }

    setFilters(newFilters);
  }, [location]);

  const hasFilters = Object.keys(filters).some(key => filters[key as keyof SearchFilters] !== undefined);

  return (
    <div className="min-h-screen bg-background">
      <SEOHead 
        title="AGENZIA 2 Servizi Immobiliari - Acireale | Case in Vendita e Affitto"
        description="🏠 Trova la casa dei tuoi sogni ad Acireale! AGENZIA 2 offre vendita, affitto e case vacanza. Geometra Antonio Cannavò - 30 anni di esperienza nel settore immobiliare siciliano."
        keywords="agenzia immobiliare Acireale, case vendita Acireale, appartamenti affitto Acireale, case vacanza Sicilia, immobili Catania, geometra Antonio Cannavò"
        canonicalUrl="https://agenzia2acireale.com/"
      />
      <Navigation />
      <main className="relative">
        <HeroSection />
        <ComplexSituations />

        <section id="properties" className="py-20 dark-section relative overflow-hidden">
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Proprietà a tutta larghezza */}
            <div className="text-center mb-16 animate-fade-in">
              <h2 className="text-4xl lg:text-5xl font-light mb-4 text-white">
                {hasFilters ? "Risultati Ricerca" : "Proprietà in Evidenza"}
              </h2>
              <p className="text-xl text-white/80 max-w-3xl mx-auto leading-relaxed mb-12">
                {hasFilters 
                  ? "Proprietà che corrispondono ai tuoi criteri di ricerca"
                  : "Scopri le migliori proprietà disponibili a Catania e provincia"
                }
              </p>

              {/* Search Filter in Properties Section */}
              <PropertySearchFilter />
            </div>

            <div className="animate-slide-up">
              <PropertyGrid filters={hasFilters ? filters : undefined} maxColumns={3} />
            </div>
          </div>
        </section>

        {/* Sezione Servizi */}
        <section className="py-20 bg-gray-50">
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16 animate-fade-in">
              <h2 className="text-4xl lg:text-5xl font-light mb-6 text-gray-900">
                I Nostri Servizi
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Soluzioni complete per ogni esigenza immobiliare
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 animate-slide-up items-stretch">
              <div className="bg-white rounded-xl p-6 group hover:shadow-xl transition-all duration-300 flex flex-col h-full border">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors duration-300">
                  <span className="text-xl">🏠</span>
                </div>
                <h4 className="font-bold text-primary mb-3 text-lg">Compravendita Immobili</h4>
                <p className="text-gray-600 mb-4 text-sm">Appartamenti, ville, terreni e immobili commerciali</p>
                <ul className="text-gray-600 space-y-2 flex-grow text-sm">
                  <li className="flex items-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary mr-2 flex-shrink-0"></span>
                    Valutazioni gratuite
                  </li>
                  <li className="flex items-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary mr-2 flex-shrink-0"></span>
                    Gestione contratti
                  </li>
                </ul>
              </div>

              <div className="bg-white rounded-xl p-6 group hover:shadow-xl transition-all duration-300 flex flex-col h-full border">
                <div className="w-12 h-12 rounded-lg bg-secondary/10 flex items-center justify-center mb-4 group-hover:bg-secondary/20 transition-colors duration-300">
                  <span className="text-xl">📋</span>
                </div>
                <h4 className="font-bold text-secondary mb-3 text-lg">Perizie e Valutazioni</h4>
                <ul className="text-gray-600 space-y-2 flex-grow text-sm">
                  <li className="flex items-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-secondary mr-2 flex-shrink-0"></span>
                    Visure catastali
                  </li>
                  <li className="flex items-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-secondary mr-2 flex-shrink-0"></span>
                    Certificazioni A.P.E.
                  </li>
                  <li className="flex items-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-secondary mr-2 flex-shrink-0"></span>
                    Valutazioni professionali
                  </li>
                </ul>
              </div>

              <div className="bg-white rounded-xl p-6 group hover:shadow-xl transition-all duration-300 flex flex-col h-full border">
                <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4 group-hover:bg-accent/20 transition-colors duration-300">
                  <span className="text-xl">⚖️</span>
                </div>
                <h4 className="font-bold text-accent mb-3 text-lg">Servizi Legali</h4>
                <ul className="text-gray-600 space-y-2 flex-grow text-sm">
                  <li className="flex items-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent mr-2 flex-shrink-0"></span>
                    Diritto immobiliare
                  </li>
                  <li className="flex items-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent mr-2 flex-shrink-0"></span>
                    Successioni
                  </li>
                  <li className="flex items-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent mr-2 flex-shrink-0"></span>
                    Consulenza specializzata
                  </li>
                </ul>
              </div>

              <div className="bg-white rounded-xl p-6 group hover:shadow-xl transition-all duration-300 flex flex-col h-full border">
                <div className="w-12 h-12 rounded-lg bg-growth/10 flex items-center justify-center mb-4 group-hover:bg-growth/20 transition-colors duration-300">
                  <span className="text-xl">💰</span>
                </div>
                <h4 className="font-bold text-growth mb-3 text-lg">Servizi Finanziari</h4>
                <ul className="text-gray-600 space-y-2 flex-grow text-sm">
                  <li className="flex items-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-growth mr-2 flex-shrink-0"></span>
                    Mutui agevolati
                  </li>
                  <li className="flex items-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-growth mr-2 flex-shrink-0"></span>
                    Consulenza finanziaria
                  </li>
                  <li className="flex items-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-growth mr-2 flex-shrink-0"></span>
                    Pratiche bancarie
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
}