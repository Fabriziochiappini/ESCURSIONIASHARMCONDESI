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
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                {hasFilters ? "Risultati Ricerca" : "Proprietà in Evidenza"}
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                {hasFilters 
                  ? "Proprietà che corrispondono ai tuoi criteri di ricerca"
                  : "Scopri le migliori proprietà disponibili ad Acireale e nei comuni limitrofi"
                }
              </p>
            </div>

            <PropertyGrid filters={hasFilters ? filters : undefined} />
          </div>
        </section>
        
        <ServicesSection />
        <SpecializedServices />
      </main>
      <Footer />
    </div>
  );
}
