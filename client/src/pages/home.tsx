import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { HeroSection } from "@/components/hero-section";
import { ComplexSituations } from "@/components/complex-situations";
import { PropertyGrid } from "@/components/property-grid";
import { ServicesSection } from "@/components/services-section";
import { SpecializedServices } from "@/components/specialized-services";
import { DestinationsSection } from "@/components/destinations-section";

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
    if (type && ['mare', 'montagna', 'citta', 'avventura', 'relax', 'cultura'].includes(type)) {
      newFilters.type = type as any;
    }

    const country = searchParams.get('country');
    if (country) {
      newFilters.country = country;
    }

    const travelType = searchParams.get('travelType');
    if (travelType) {
      newFilters.travelType = travelType as any;
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
        title="Propato Travel - Agenzia Viaggi | Vacanze Mare, Montagna e City Break"
        description="✈️ Scopri il mondo con Propato Travel! Vacanze al mare, avventure in montagna, city break e viaggi culturali. Pacchetti personalizzati per ogni esigenza di viaggio."
        keywords="agenzia viaggi, vacanze mare, viaggi montagna, city break, pacchetti viaggio, Propato Travel, viaggi organizzati, turismo"
        canonicalUrl="https://propatotravel.com/"
      />
      <Navigation />
      <main className="relative">
        <HeroSection />
        <ComplexSituations />

        <section id="travels" className="py-20 dark-section relative overflow-hidden">
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Viaggi a tutta larghezza */}
            <div className="text-center mb-16 animate-fade-in">
              <h2 className="text-4xl lg:text-5xl font-light mb-4 text-white">
                {hasFilters ? "Risultati Ricerca" : "Viaggi in Evidenza"}
              </h2>
              <p className="text-xl text-white/80 max-w-3xl mx-auto leading-relaxed mb-12">
                {hasFilters 
                  ? "Viaggi che corrispondono ai tuoi criteri di ricerca"
                  : "Scopri le destinazioni più belle del mondo con i nostri pacchetti esclusivi"
                }
              </p>

              {/* Search Filter in Travel Section */}
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
                I Nostri Servizi di Viaggio
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Esperienze di viaggio indimenticabili su misura per te
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 animate-slide-up items-stretch">
              <div className="bg-white rounded-xl p-6 group hover:shadow-xl transition-all duration-300 flex flex-col h-full border">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors duration-300">
                  <span className="text-xl">🏖️</span>
                </div>
                <h4 className="font-bold text-primary mb-3 text-lg">Vacanze al Mare</h4>
                <p className="text-gray-600 mb-4 text-sm">Spiagge paradisiache, resort esclusivi e relax totale</p>
                <ul className="text-gray-600 space-y-2 flex-grow text-sm">
                  <li className="flex items-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary mr-2 flex-shrink-0"></span>
                    Resort 4-5 stelle
                  </li>
                  <li className="flex items-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary mr-2 flex-shrink-0"></span>
                    All inclusive
                  </li>
                </ul>
              </div>

              <div className="bg-white rounded-xl p-6 group hover:shadow-xl transition-all duration-300 flex flex-col h-full border">
                <div className="w-12 h-12 rounded-lg bg-secondary/10 flex items-center justify-center mb-4 group-hover:bg-secondary/20 transition-colors duration-300">
                  <span className="text-xl">🏔️</span>
                </div>
                <h4 className="font-bold text-secondary mb-3 text-lg">Montagna & Natura</h4>
                <ul className="text-gray-600 space-y-2 flex-grow text-sm">
                  <li className="flex items-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-secondary mr-2 flex-shrink-0"></span>
                    Trekking guidati
                  </li>
                  <li className="flex items-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-secondary mr-2 flex-shrink-0"></span>
                    Rifugi e baite
                  </li>
                  <li className="flex items-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-secondary mr-2 flex-shrink-0"></span>
                    Escursioni personalizzate
                  </li>
                </ul>
              </div>

              <div className="bg-white rounded-xl p-6 group hover:shadow-xl transition-all duration-300 flex flex-col h-full border">
                <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4 group-hover:bg-accent/20 transition-colors duration-300">
                  <span className="text-xl">🏛️</span>
                </div>
                <h4 className="font-bold text-accent mb-3 text-lg">City Break & Cultura</h4>
                <ul className="text-gray-600 space-y-2 flex-grow text-sm">
                  <li className="flex items-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent mr-2 flex-shrink-0"></span>
                    Tour guidati
                  </li>
                  <li className="flex items-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent mr-2 flex-shrink-0"></span>
                    Musei e monumenti
                  </li>
                  <li className="flex items-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent mr-2 flex-shrink-0"></span>
                    Weekend culturali
                  </li>
                </ul>
              </div>

              <div className="bg-white rounded-xl p-6 group hover:shadow-xl transition-all duration-300 flex flex-col h-full border">
                <div className="w-12 h-12 rounded-lg bg-growth/10 flex items-center justify-center mb-4 group-hover:bg-growth/20 transition-colors duration-300">
                  <span className="text-xl">🎒</span>
                </div>
                <h4 className="font-bold text-growth mb-3 text-lg">Viaggi Avventura</h4>
                <ul className="text-gray-600 space-y-2 flex-grow text-sm">
                  <li className="flex items-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-growth mr-2 flex-shrink-0"></span>
                    Safari e natura
                  </li>
                  <li className="flex items-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-growth mr-2 flex-shrink-0"></span>
                    Sport estremi
                  </li>
                  <li className="flex items-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-growth mr-2 flex-shrink-0"></span>
                    Destinazioni esotiche
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Destinations Section */}
        <DestinationsSection />

      </main>
      <Footer />
    </div>
  );
}