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
                  : "Scopri le migliori proprietà disponibili ad Acireale e nei comuni limitrofi"
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
            <div className="text-center mb-20 animate-fade-in">
              <h2 className="text-6xl lg:text-7xl font-bold mb-6 neon-text">
                I Nostri Servizi
              </h2>
              <p className="text-2xl text-foreground/80 max-w-4xl mx-auto leading-relaxed">
                Soluzioni complete per ogni esigenza immobiliare
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8 animate-scale-in">
              <div className="glass-card rounded-3xl p-8 group hover:scale-105 transition-all duration-500">
                <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center mb-6 group-hover:rotate-12 transition-transform duration-300">
                  <span className="text-2xl">🏠</span>
                </div>
                <h4 className="font-bold text-primary mb-4 text-2xl">Compravendita Immobili</h4>
                <p className="text-lg text-foreground/80 mb-4">Appartamenti, ville, terreni e immobili commerciali</p>
                <ul className="text-foreground/70 space-y-3">
                  <li className="flex items-center">
                    <span className="w-2 h-2 rounded-full bg-primary mr-3"></span>
                    Valutazioni gratuite e marketing professionale
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 rounded-full bg-primary mr-3"></span>
                    Gestione completa contratti
                  </li>
                </ul>
              </div>
              
              <div className="glass-card rounded-3xl p-8 group hover:scale-105 transition-all duration-500">
                <div className="w-16 h-16 rounded-2xl gradient-secondary flex items-center justify-center mb-6 group-hover:rotate-12 transition-transform duration-300">
                  <span className="text-2xl">📋</span>
                </div>
                <h4 className="font-bold text-secondary mb-4 text-2xl">Perizie e Valutazioni</h4>
                <ul className="text-foreground/70 space-y-3">
                  <li className="flex items-center">
                    <span className="w-2 h-2 rounded-full bg-secondary mr-3"></span>
                    Visure catastali e verifiche CRIF
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 rounded-full bg-secondary mr-3"></span>
                    Certificazioni A.P.E. e perizie
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 rounded-full bg-secondary mr-3"></span>
                    Valutazioni immobiliari professionali
                  </li>
                </ul>
              </div>
              
              <div className="glass-card rounded-3xl p-8 group hover:scale-105 transition-all duration-500">
                <div className="w-16 h-16 rounded-2xl gradient-accent flex items-center justify-center mb-6 group-hover:rotate-12 transition-transform duration-300">
                  <span className="text-2xl">⚖️</span>
                </div>
                <h4 className="font-bold text-accent mb-4 text-2xl">Servizi Legali</h4>
                <ul className="text-foreground/70 space-y-3">
                  <li className="flex items-center">
                    <span className="w-2 h-2 rounded-full bg-accent mr-3"></span>
                    Diritto immobiliare e sanatorie
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 rounded-full bg-accent mr-3"></span>
                    Successioni e contrattualistica
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 rounded-full bg-accent mr-3"></span>
                    Consulenza legale specializzata
                  </li>
                </ul>
              </div>
              
              <div className="glass-card rounded-3xl p-8 group hover:scale-105 transition-all duration-500">
                <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center mb-6 group-hover:rotate-12 transition-transform duration-300">
                  <span className="text-2xl">💰</span>
                </div>
                <h4 className="font-bold text-primary mb-4 text-2xl">Servizi Finanziari</h4>
                <ul className="text-foreground/70 space-y-3">
                  <li className="flex items-center">
                    <span className="w-2 h-2 rounded-full bg-primary mr-3"></span>
                    Mutui agevolati e surroga
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 rounded-full bg-primary mr-3"></span>
                    Consulenza e finanziamenti
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 rounded-full bg-primary mr-3"></span>
                    Pratiche bancarie complete
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