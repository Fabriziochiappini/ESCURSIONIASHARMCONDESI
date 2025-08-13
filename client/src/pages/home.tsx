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
        {/* Complex Situations with Stats Banner as Title */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Stats Banner instead of text title */}
            <div className="text-center mb-16 animate-fade-in">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-0 max-w-4xl mx-auto mb-8">
                <div className="bg-slate-900 border border-slate-600 p-8 text-center">
                  <div className="text-4xl font-black text-blue-400 mb-2">50+</div>
                  <div className="text-slate-300 font-bold uppercase tracking-wide text-sm">Destinazioni</div>
                </div>
                <div className="bg-slate-900 border border-slate-600 p-8 text-center">
                  <div className="text-4xl font-black text-blue-400 mb-2">1K+</div>
                  <div className="text-slate-300 font-bold uppercase tracking-wide text-sm">Viaggiatori</div>
                </div>
                <div className="bg-slate-900 border border-slate-600 p-8 text-center">
                  <div className="text-4xl font-black text-blue-400 mb-2">15</div>
                  <div className="text-slate-300 font-bold uppercase tracking-wide text-sm">Anni</div>
                </div>
                <div className="bg-slate-900 border border-slate-600 p-8 text-center">
                  <div className="text-4xl font-black text-blue-400 mb-2">24/7</div>
                  <div className="text-slate-300 font-bold uppercase tracking-wide text-sm">Supporto</div>
                </div>
              </div>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Anni di esperienza nel settore viaggi per soluzioni immediate
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-scale-in items-stretch justify-items-center">
              {[
                {
                  icon: "Plane",
                  title: "Viaggio Last Minute?",
                  subtitle: "Organizziamo tutto in 24 ore",
                  benefits: [
                    "Prenotazioni immediate",
                    "Migliori tariffe last minute",
                    "Assistenza h24"
                  ]
                },
                {
                  icon: "Users",
                  title: "Gruppo Numeroso da Organizzare?",
                  subtitle: "Gestiamo viaggi di gruppo complessi",
                  benefits: [
                    "Tariffe speciali per gruppi",
                    "Coordinamento completo",
                    "Pagamenti dilazionati"
                  ]
                },
                {
                  icon: "MapPin",
                  title: "Destinazione Complicata?",
                  subtitle: "Esperti in viaggi difficili",
                  benefits: [
                    "Destinazioni remote",
                    "Visti e permessi speciali",
                    "Itinerari personalizzati"
                  ]
                },
                {
                  icon: "FileText",
                  title: "Documenti Scaduti?",
                  subtitle: "Assistenza urgente documenti",
                  benefits: [
                    "Passaporti urgenti",
                    "Visti in tempi record",
                    "Assistenza burocratica"
                  ]
                }
              ].map((situation, index) => {
                const iconColors = ['text-primary', 'text-secondary', 'text-orange-500', 'text-amber-500'];
                const iconColor = iconColors[index] || 'text-primary';
                
                return (
                  <div
                    key={index}
                    className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 hover:border-primary/30 group w-full h-full flex flex-col"
                  >
                    <div className="mb-6">
                      <div className="w-16 h-16 bg-gray-50 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                        <div className={`w-8 h-8 ${iconColor}`}>
                          {situation.icon === "Plane" && "✈️"}
                          {situation.icon === "Users" && "👥"}
                          {situation.icon === "MapPin" && "📍"}
                          {situation.icon === "FileText" && "📄"}
                        </div>
                      </div>
                      <h3 className="text-xl font-bold mb-3 leading-tight text-gray-900">
                        {situation.title}
                      </h3>
                      <p className="text-gray-600 mb-6">
                        {situation.subtitle}
                      </p>
                    </div>

                    <div className="space-y-3 mb-8 flex-grow">
                      {situation.benefits.map((benefit, benefitIndex) => (
                        <div key={benefitIndex} className="flex items-start">
                          <div className="w-2 h-2 rounded-full bg-primary mt-2 mr-3 flex-shrink-0"></div>
                          <span className="text-gray-700 text-sm">{benefit}</span>
                        </div>
                      ))}
                    </div>

                    <div className="mt-auto pt-6 border-t border-gray-100">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">Contattaci ora</span>
                        <a 
                          href="https://wa.me/393479123456" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="inline-flex items-center px-4 py-2 bg-green-500 text-white rounded-lg text-sm font-medium hover:bg-green-600 transition-colors"
                        >
                          WhatsApp
                        </a>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section id="travels" className="py-20 dark-section relative overflow-hidden">
          <div className="relative z-10 max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
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
              <PropertyGrid filters={hasFilters ? filters : undefined} maxColumns={4} />
            </div>
          </div>
        </section>

        {/* Sezione Servizi */}
        <section className="py-0 bg-slate-900">
          <div className="relative z-10 w-full">
            <div className="text-center py-20 bg-slate-900 text-white">
              <h2 className="text-5xl lg:text-6xl font-black mb-6 tracking-tight">
                I NOSTRI SERVIZI
              </h2>
              <div className="w-32 h-2 bg-blue-500 mx-auto mb-8"></div>
              <p className="text-2xl text-slate-300 max-w-4xl mx-auto leading-relaxed font-light">
                Esperienze di viaggio indimenticabili su misura per te
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-0 max-w-none">
              <div className="bg-slate-800 border border-slate-700 p-10 group hover:bg-slate-700 transition-all duration-500 flex flex-col h-full relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative z-10">
                  <div className="w-16 h-16 bg-blue-500 flex items-center justify-center mb-6 group-hover:bg-blue-400 transition-colors duration-300">
                    <span className="text-2xl">🏖️</span>
                  </div>
                  <h4 className="font-black text-white mb-4 text-2xl tracking-wide">VACANZE AL MARE</h4>
                  <p className="text-slate-400 mb-6 text-lg font-light">Spiagge paradisiache, resort esclusivi e relax totale</p>
                  <ul className="text-slate-300 space-y-3 flex-grow">
                    <li className="flex items-center font-medium">
                      <span className="w-3 h-3 bg-blue-500 mr-3 flex-shrink-0"></span>
                      Resort 4-5 stelle
                    </li>
                    <li className="flex items-center font-medium">
                      <span className="w-3 h-3 bg-blue-500 mr-3 flex-shrink-0"></span>
                      All inclusive
                    </li>
                  </ul>
                </div>
              </div>

              <div className="bg-slate-800 border border-slate-700 p-10 group hover:bg-slate-700 transition-all duration-500 flex flex-col h-full relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-green-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative z-10">
                  <div className="w-16 h-16 bg-green-500 flex items-center justify-center mb-6 group-hover:bg-green-400 transition-colors duration-300">
                    <span className="text-2xl">🏔️</span>
                  </div>
                  <h4 className="font-black text-white mb-4 text-2xl tracking-wide">MONTAGNA & NATURA</h4>
                  <p className="text-slate-400 mb-6 text-lg font-light">Trekking, rifugi e natura incontaminata</p>
                  <ul className="text-slate-300 space-y-3 flex-grow">
                    <li className="flex items-center font-medium">
                      <span className="w-3 h-3 bg-green-500 mr-3 flex-shrink-0"></span>
                      Trekking guidati
                    </li>
                    <li className="flex items-center font-medium">
                      <span className="w-3 h-3 bg-green-500 mr-3 flex-shrink-0"></span>
                      Rifugi e baite
                    </li>
                    <li className="flex items-center font-medium">
                      <span className="w-3 h-3 bg-green-500 mr-3 flex-shrink-0"></span>
                      Escursioni personalizzate
                    </li>
                  </ul>
                </div>
              </div>

              <div className="bg-slate-800 border border-slate-700 p-10 group hover:bg-slate-700 transition-all duration-500 flex flex-col h-full relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative z-10">
                  <div className="w-16 h-16 bg-purple-500 flex items-center justify-center mb-6 group-hover:bg-purple-400 transition-colors duration-300">
                    <span className="text-2xl">🏛️</span>
                  </div>
                  <h4 className="font-black text-white mb-4 text-2xl tracking-wide">CITY BREAK & CULTURA</h4>
                  <p className="text-slate-400 mb-6 text-lg font-light">Arte, storia e cultura delle grandi città</p>
                  <ul className="text-slate-300 space-y-3 flex-grow">
                    <li className="flex items-center font-medium">
                      <span className="w-3 h-3 bg-purple-500 mr-3 flex-shrink-0"></span>
                      Tour guidati
                    </li>
                    <li className="flex items-center font-medium">
                      <span className="w-3 h-3 bg-purple-500 mr-3 flex-shrink-0"></span>
                      Musei e monumenti
                    </li>
                    <li className="flex items-center font-medium">
                      <span className="w-3 h-3 bg-purple-500 mr-3 flex-shrink-0"></span>
                      Weekend culturali
                    </li>
                  </ul>
                </div>
              </div>

              <div className="bg-slate-800 border border-slate-700 p-10 group hover:bg-slate-700 transition-all duration-500 flex flex-col h-full relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-orange-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative z-10">
                  <div className="w-16 h-16 bg-orange-500 flex items-center justify-center mb-6 group-hover:bg-orange-400 transition-colors duration-300">
                    <span className="text-2xl">🎒</span>
                  </div>
                  <h4 className="font-black text-white mb-4 text-2xl tracking-wide">VIAGGI AVVENTURA</h4>
                  <p className="text-slate-400 mb-6 text-lg font-light">Safari, sport estremi e destinazioni esotiche</p>
                  <ul className="text-slate-300 space-y-3 flex-grow">
                    <li className="flex items-center font-medium">
                      <span className="w-3 h-3 bg-orange-500 mr-3 flex-shrink-0"></span>
                      Safari e natura
                    </li>
                    <li className="flex items-center font-medium">
                      <span className="w-3 h-3 bg-orange-500 mr-3 flex-shrink-0"></span>
                      Sport estremi
                    </li>
                    <li className="flex items-center font-medium">
                      <span className="w-3 h-3 bg-orange-500 mr-3 flex-shrink-0"></span>
                      Destinazioni esotiche
                    </li>
                  </ul>
                </div>
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