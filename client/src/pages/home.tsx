import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { HeroSection } from "@/components/hero-section";
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
        
        <section id="properties" className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Layout con sidebar a destra */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              
              {/* Colonna principale - Proprietà (2/3 della larghezza) */}
              <div className="lg:col-span-2">
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

                <PropertyGrid filters={hasFilters ? filters : undefined} maxColumns={2} />
              </div>
              
              {/* Sidebar destra - Servizi */}
              <div className="lg:col-span-1">
                <div className="sticky top-8 space-y-8">
                  
                  {/* Servizi Principali */}
                  <div className="bg-white rounded-2xl p-6 shadow-lg border">
                    <h3 className="text-2xl font-bold text-primary mb-4 text-center">
                      I Nostri Servizi
                    </h3>
                    <div className="space-y-4">
                      <div className="p-4 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-xl">
                        <h4 className="font-bold text-primary mb-2">🏠 Compravendita</h4>
                        <p className="text-sm text-gray-600">Appartamenti, ville, terreni e immobili commerciali</p>
                      </div>
                      <div className="p-4 bg-gradient-to-r from-secondary/10 to-accent/10 rounded-xl">
                        <h4 className="font-bold text-primary mb-2">📋 Perizie e Valutazioni</h4>
                        <p className="text-sm text-gray-600">Visure catastali, CRIF, A.P.E. e consulenze tecniche</p>
                      </div>
                      <div className="p-4 bg-gradient-to-r from-accent/10 to-primary/10 rounded-xl">
                        <h4 className="font-bold text-primary mb-2">⚖️ Servizi Legali</h4>
                        <p className="text-sm text-gray-600">Diritto immobiliare, sanatorie e successioni</p>
                      </div>
                      <div className="p-4 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-xl">
                        <h4 className="font-bold text-primary mb-2">💰 Servizi Finanziari</h4>
                        <p className="text-sm text-gray-600">Mutui agevolati e consulenza finanziaria</p>
                      </div>
                    </div>
                  </div>

                  {/* Situazioni Complesse */}
                  <div className="bg-gradient-to-br from-secondary to-secondary/80 rounded-2xl p-6 text-white shadow-lg">
                    <h3 className="text-xl font-bold mb-4 text-center">
                      🆘 Situazioni Complesse
                    </h3>
                    <div className="space-y-3">
                      <div className="bg-white/10 rounded-lg p-3">
                        <h4 className="font-semibold mb-1">Casa all'Asta</h4>
                        <p className="text-sm opacity-90">Ti aiutiamo a evitare l'asta e trovare soluzioni</p>
                      </div>
                      <div className="bg-white/10 rounded-lg p-3">
                        <h4 className="font-semibold mb-1">Problemi di Mutuo</h4>
                        <p className="text-sm opacity-90">Rinegoziazione e ristrutturazione del debito</p>
                      </div>
                      <div className="bg-white/10 rounded-lg p-3">
                        <h4 className="font-semibold mb-1">Eredità Complicate</h4>
                        <p className="text-sm opacity-90">Gestione successioni e divisioni ereditarie</p>
                      </div>
                    </div>
                  </div>

                  {/* Contatti Rapidi */}
                  <div className="bg-primary rounded-2xl p-6 text-white shadow-lg">
                    <h3 className="text-xl font-bold mb-4 text-center">
                      📞 Contatti Rapidi
                    </h3>
                    <div className="space-y-3 text-center">
                      <div>
                        <p className="font-semibold">Geometra Antonio Cannavò</p>
                        <p className="text-sm opacity-90">Via San Girolamo, 20 - Acireale</p>
                      </div>
                      <div className="bg-white/10 rounded-lg p-3">
                        <p className="font-bold text-lg">346 800 3234</p>
                        <p className="text-sm opacity-90">Chiamata diretta</p>
                      </div>
                      <div className="bg-white/10 rounded-lg p-3">
                        <p className="text-sm">agenzia2acireale@virgilio.it</p>
                        <p className="text-xs opacity-90">Email</p>
                      </div>
                    </div>
                  </div>
                  
                </div>
              </div>
              
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
