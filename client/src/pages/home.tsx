import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { HeroSection } from "@/components/hero-section";
import { PropertyGrid } from "@/components/property-grid";
import { ServicesSection } from "@/components/services-section";
import { SpecializedServices } from "@/components/specialized-services";
import { DestinationsSection } from "@/components/destinations-section";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { PropertySearchFilter } from "@/components/property-search-filter";
import type { SearchFilters } from "@shared/schema";
import { SEOHead } from "@/components/seo-head";
import { ShowcaseSection } from "@/components/showcase-section";

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

        <section id="travels" className="py-20 bg-white relative overflow-hidden">
          <div className="relative z-10 max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8">
            {/* Viaggi a tutta larghezza */}
            <div className="text-center mb-16 animate-fade-in">
              <h2 className="text-4xl lg:text-5xl font-light mb-4 text-gray-900">
                {hasFilters ? "Risultati Ricerca" : "Viaggi in Evidenza"}
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-12">
                {hasFilters 
                  ? "Viaggi che corrispondono ai tuoi criteri di ricerca"
                  : "Scopri le destinazioni più belle del mondo con i nostri pacchetti esclusivi"
                }
              </p>

              {/* Search Filter in Travel Section */}
              <PropertySearchFilter />
            </div>

            <div className="animate-slide-up">
              <PropertyGrid filters={hasFilters ? filters : undefined} showAll={false} />
            </div>
          </div>
        </section>

        {/* Sezioni Vetrina */}
        <ShowcaseSection category="emirati_arabi" />
        <ShowcaseSection category="europa" />
        <ShowcaseSection category="asia" />
        <ShowcaseSection category="esotico" />

        {/* Sezione Servizi */}
        <ServicesSection />
        
        {/* Sezione Servizi Specializzati */}
        <SpecializedServices />
        
        {/* Sezione Destinazioni */}
        <DestinationsSection />
      </main>
      <Footer />
    </div>
  );
}