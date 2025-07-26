import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { HeroSection } from "@/components/hero-section";
import { ComplexSituations } from "@/components/complex-situations";
import { PropertyGrid } from "@/components/property-grid";
import { ServicesSection } from "@/components/services-section";
import { SpecializedServices } from "@/components/specialized-services";

import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
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
    <div className="min-h-screen bg-white">
      <Navigation />
      <main>
        <HeroSection />
        <ComplexSituations />
        
        <section id="properties" className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Proprietà a tutta larghezza */}
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                {hasFilters ? "Risultati Ricerca" : "Proprietà in Evidenza"}
              </h2>
              <p className="text-xl text-gray-600">
                {hasFilters 
                  ? "Proprietà che corrispondono ai tuoi criteri di ricerca"
                  : "Scopri le migliori proprietà disponibili ad Acireale e nei comuni limitrofi"
                }
              </p>
            </div>

            <PropertyGrid filters={hasFilters ? filters : undefined} maxColumns={3} />
          </div>
        </section>

        {/* Sezione Servizi */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                I Nostri Servizi
              </h2>
              <p className="text-xl text-gray-600">
                Soluzioni complete per ogni esigenza immobiliare
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="bg-white rounded-2xl p-6 shadow-lg border">
                <h4 className="font-bold text-primary mb-3 text-lg">🏠 Compravendita Immobili</h4>
                <p className="text-base text-gray-600 mb-3">Appartamenti, ville, terreni e immobili commerciali</p>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>• Valutazioni gratuite e marketing professionale</li>
                  <li>• Gestione completa contratti</li>
                </ul>
              </div>
              
              <div className="bg-white rounded-2xl p-6 shadow-lg border">
                <h4 className="font-bold text-primary mb-3 text-lg">📋 Perizie e Valutazioni</h4>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>• Visure catastali e verifiche CRIF</li>
                  <li>• Certificazioni A.P.E. e perizie</li>
                  <li>• Valutazioni immobiliari professionali</li>
                </ul>
              </div>
              
              <div className="bg-white rounded-2xl p-6 shadow-lg border">
                <h4 className="font-bold text-primary mb-3 text-lg">⚖️ Servizi Legali</h4>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>• Diritto immobiliare e sanatorie</li>
                  <li>• Successioni e contrattualistica</li>
                  <li>• Consulenza legale specializzata</li>
                </ul>
              </div>
              
              <div className="bg-white rounded-2xl p-6 shadow-lg border">
                <h4 className="font-bold text-primary mb-3 text-lg">💰 Servizi Finanziari</h4>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>• Mutui agevolati e surroga</li>
                  <li>• Consulenza e finanziamenti</li>
                  <li>• Pratiche bancarie complete</li>
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