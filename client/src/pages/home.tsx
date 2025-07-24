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
                        <h4 className="font-bold text-primary mb-2">🏠 Compravendita Immobili</h4>
                        <p className="text-sm text-gray-600 mb-2">Appartamenti, ville, terreni e immobili commerciali</p>
                        <ul className="text-xs text-gray-500 space-y-1">
                          <li>• Valutazioni gratuite</li>
                          <li>• Marketing professionale</li>
                          <li>• Gestione contratti</li>
                        </ul>
                      </div>
                      <div className="p-4 bg-gradient-to-r from-secondary/10 to-accent/10 rounded-xl">
                        <h4 className="font-bold text-primary mb-2">📋 Perizie e Valutazioni</h4>
                        <p className="text-sm text-gray-600 mb-2">Consulenze tecniche specializzate</p>
                        <ul className="text-xs text-gray-500 space-y-1">
                          <li>• Visure catastali complete</li>
                          <li>• Verifiche CRIF</li>
                          <li>• Certificazioni A.P.E.</li>
                          <li>• Perizie giurate</li>
                        </ul>
                      </div>
                      <div className="p-4 bg-gradient-to-r from-accent/10 to-primary/10 rounded-xl">
                        <h4 className="font-bold text-primary mb-2">⚖️ Servizi Legali</h4>
                        <p className="text-sm text-gray-600 mb-2">Assistenza legale specializzata</p>
                        <ul className="text-xs text-gray-500 space-y-1">
                          <li>• Diritto immobiliare</li>
                          <li>• Sanatorie edilizie</li>
                          <li>• Successioni ereditarie</li>
                          <li>• Contrattualistica</li>
                        </ul>
                      </div>
                      <div className="p-4 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-xl">
                        <h4 className="font-bold text-primary mb-2">💰 Servizi Finanziari</h4>
                        <p className="text-sm text-gray-600 mb-2">Soluzioni di finanziamento</p>
                        <ul className="text-xs text-gray-500 space-y-1">
                          <li>• Mutui agevolati</li>
                          <li>• Surroga mutui</li>
                          <li>• Consulenza finanziaria</li>
                          <li>• Finanziamenti ristrutturazioni</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Servizi Tecnici Specializzati */}
                  <div className="bg-gradient-to-br from-accent/20 to-primary/20 rounded-2xl p-6 shadow-lg border">
                    <h3 className="text-xl font-bold text-primary mb-4 text-center">
                      🔧 Servizi Tecnici Evoluti
                    </h3>
                    <div className="space-y-3">
                      <div className="bg-white/70 rounded-lg p-3">
                        <h4 className="font-semibold text-primary mb-1">Ristrutturazioni Smart</h4>
                        <p className="text-xs text-gray-600">Progettazione e direzione lavori con tecnologie moderne</p>
                      </div>
                      <div className="bg-white/70 rounded-lg p-3">
                        <h4 className="font-semibold text-primary mb-1">Efficienza Energetica</h4>
                        <p className="text-xs text-gray-600">Diagnosi energetiche e interventi di riqualificazione</p>
                      </div>
                      <div className="bg-white/70 rounded-lg p-3">
                        <h4 className="font-semibold text-primary mb-1">Domotica e Automazione</h4>
                        <p className="text-xs text-gray-600">Sistemi intelligenti per la casa del futuro</p>
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
                        <h4 className="font-semibold mb-1">Casa all'Asta - Ti Aiutiamo</h4>
                        <p className="text-sm opacity-90 mb-2">La tua casa rischia di andare all'asta? Possiamo aiutarti.</p>
                        <ul className="text-xs opacity-80 space-y-1">
                          <li>• Valutazione situazione debitoria</li>
                          <li>• Strategie di vendita rapida</li>
                          <li>• Negoziazione con banche</li>
                          <li>• Soluzioni alternative all'asta</li>
                        </ul>
                      </div>
                      <div className="bg-white/10 rounded-lg p-3">
                        <h4 className="font-semibold mb-1">Problemi di Mutuo</h4>
                        <p className="text-sm opacity-90 mb-2">Difficoltà nel pagamento delle rate?</p>
                        <ul className="text-xs opacity-80 space-y-1">
                          <li>• Rinegoziazione del mutuo</li>
                          <li>• Ristrutturazione del debito</li>
                          <li>• Moratorie e sospensioni</li>
                          <li>• Surroga a condizioni migliori</li>
                        </ul>
                      </div>
                      <div className="bg-white/10 rounded-lg p-3">
                        <h4 className="font-semibold mb-1">Eredità Complicate</h4>
                        <p className="text-sm opacity-90 mb-2">Successioni difficili e divisioni problematiche</p>
                        <ul className="text-xs opacity-80 space-y-1">
                          <li>• Gestione pratiche successorie</li>
                          <li>• Divisioni ereditarie</li>
                          <li>• Vendita immobili ereditati</li>
                          <li>• Risoluzione conflitti familiari</li>
                        </ul>
                      </div>
                      <div className="bg-white/10 rounded-lg p-3">
                        <h4 className="font-semibold mb-1">Immobili Compromessi</h4>
                        <p className="text-sm opacity-90 mb-2">Situazioni particolari che richiedono expertise</p>
                        <ul className="text-xs opacity-80 space-y-1">
                          <li>• Immobili con vizi occulti</li>
                          <li>• Problemi urbanistici</li>
                          <li>• Contenziosi condominiali</li>
                          <li>• Recupero crediti immobiliari</li>
                        </ul>
                      </div>
                    </div>
                  </div>



                  {/* Servizi di Acquisizione */}
                  <div className="bg-gradient-to-br from-primary to-primary/80 rounded-2xl p-6 text-white shadow-lg">
                    <h3 className="text-xl font-bold mb-4 text-center">
                      🏡 Ti Aiutiamo ad Acquistare
                    </h3>
                    <div className="space-y-3">
                      <div className="bg-white/10 rounded-lg p-3">
                        <h4 className="font-semibold mb-1">Acquisto Senza Anticipi</h4>
                        <p className="text-sm opacity-90 mb-2">Percorsi facilitati per l'acquisto della casa</p>
                        <ul className="text-xs opacity-80 space-y-1">
                          <li>• Mutui 100% del valore</li>
                          <li>• Garanzie statali giovani</li>
                          <li>• Bonus prima casa</li>
                        </ul>
                      </div>
                      <div className="bg-white/10 rounded-lg p-3">
                        <h4 className="font-semibold mb-1">Supporto Completo</h4>
                        <p className="text-sm opacity-90 mb-2">Ti seguiamo in ogni fase dell'acquisto</p>
                        <ul className="text-xs opacity-80 space-y-1">
                          <li>• Ricerca immobile ideale</li>
                          <li>• Negoziazione prezzo</li>
                          <li>• Pratiche burocratiche</li>
                          <li>• Assistenza post-vendita</li>
                        </ul>
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
