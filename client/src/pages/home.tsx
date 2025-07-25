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
            {/* Layout con proprietà e sidebar */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              
              {/* Proprietà - 2/3 della larghezza */}
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
              
              {/* Sidebar destra - Galleria immagini */}
              <div className="lg:col-span-1">
                <div className="sticky top-8 space-y-8">
                  
                  {/* Galleria Progetti */}
                  <div className="bg-white rounded-2xl p-6 shadow-lg border">
                    <h3 className="text-2xl font-bold text-primary mb-6 text-center">
                      I Nostri Progetti
                    </h3>
                    <div className="space-y-4">
                      <div className="rounded-xl overflow-hidden shadow-md">
                        <img 
                          src="https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
                          alt="Progetto immobiliare moderno"
                          className="w-full h-48 object-cover hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <div className="rounded-xl overflow-hidden shadow-md">
                        <img 
                          src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
                          alt="Villa di lusso completata"
                          className="w-full h-48 object-cover hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <div className="rounded-xl overflow-hidden shadow-md">
                        <img 
                          src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
                          alt="Appartamento ristrutturato"
                          className="w-full h-48 object-cover hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <div className="rounded-xl overflow-hidden shadow-md">
                        <img 
                          src="https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
                          alt="Casa vacanza realizzata"
                          className="w-full h-48 object-cover hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    </div>
                  </div>

                  
                  {/* Servizi Principali */}
                  <div className="bg-white rounded-2xl p-6 shadow-lg border">
                    <h3 className="text-2xl font-bold text-primary mb-4 text-center">
                      I Nostri Servizi
                    </h3>
                    <div className="space-y-4">
                      <div className="p-5 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-xl">
                        <h4 className="font-bold text-primary mb-3 text-lg">🏠 Compravendita Immobili</h4>
                        <p className="text-base text-gray-600 mb-3">Appartamenti, ville, terreni e immobili commerciali</p>
                        <ul className="text-sm text-gray-600 space-y-2">
                          <li>• Valutazioni gratuite e marketing professionale</li>
                          <li>• Gestione completa contratti</li>
                        </ul>
                      </div>
                      <div className="p-5 bg-gradient-to-r from-secondary/10 to-accent/10 rounded-xl">
                        <h4 className="font-bold text-primary mb-3 text-lg">📋 Perizie e Valutazioni</h4>
                        <ul className="text-sm text-gray-600 space-y-2">
                          <li>• Visure catastali e verifiche CRIF</li>
                          <li>• Certificazioni A.P.E. e perizie</li>
                        </ul>
                      </div>
                      <div className="p-5 bg-gradient-to-r from-accent/10 to-primary/10 rounded-xl">
                        <h4 className="font-bold text-primary mb-3 text-lg">⚖️ Servizi Legali</h4>
                        <ul className="text-sm text-gray-600 space-y-2">
                          <li>• Diritto immobiliare e sanatorie</li>
                          <li>• Successioni e contrattualistica</li>
                        </ul>
                      </div>
                      <div className="p-5 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-xl">
                        <h4 className="font-bold text-primary mb-3 text-lg">💰 Servizi Finanziari</h4>
                        <ul className="text-sm text-gray-600 space-y-2">
                          <li>• Mutui agevolati e surroga</li>
                          <li>• Consulenza e finanziamenti</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Servizi Tecnici Specializzati */}
                  <div className="bg-accent rounded-2xl p-6 shadow-lg border text-gray-800">
                    <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">
                      🔧 Servizi Tecnici Evoluti
                    </h3>
                    <div className="space-y-4">
                      <div className="bg-white/70 rounded-lg p-4">
                        <h4 className="font-semibold text-gray-800 mb-2 text-base">Ristrutturazioni Smart</h4>
                        <p className="text-sm text-gray-600">Progettazione e direzione lavori moderni</p>
                      </div>
                      <div className="bg-white/70 rounded-lg p-4">
                        <h4 className="font-semibold text-gray-800 mb-2 text-base">Efficienza Energetica</h4>
                        <p className="text-sm text-gray-600">Diagnosi e riqualificazione energetica</p>
                      </div>
                      <div className="bg-white/70 rounded-lg p-4">
                        <h4 className="font-semibold text-gray-800 mb-2 text-base">Domotica e Automazione</h4>
                        <p className="text-sm text-gray-600">Sistemi intelligenti per la casa</p>
                      </div>
                    </div>
                  </div>

                  {/* Situazioni Complesse */}
                  <div className="bg-secondary rounded-2xl p-6 text-white shadow-lg">
                    <h3 className="text-xl font-bold mb-4 text-center">
                      🆘 Situazioni Complesse
                    </h3>
                    <div className="space-y-4">
                      <div className="bg-white/10 rounded-lg p-4">
                        <h4 className="font-semibold mb-2 text-base">Casa all'Asta - Ti Aiutiamo</h4>
                        <p className="text-sm mb-3">La tua casa rischia di andare all'asta? Possiamo aiutarti.</p>
                        <ul className="text-sm space-y-2">
                          <li>• Valutazione situazione e vendita rapida</li>
                          <li>• Negoziazione banche e soluzioni alternative</li>
                        </ul>
                      </div>
                      <div className="bg-white/10 rounded-lg p-4">
                        <h4 className="font-semibold mb-2 text-base">Problemi di Mutuo</h4>
                        <p className="text-sm mb-3">Difficoltà nel pagamento delle rate?</p>
                        <ul className="text-sm space-y-2">
                          <li>• Rinegoziazione e ristrutturazione debito</li>
                          <li>• Moratorie e surroga migliorative</li>
                        </ul>
                      </div>
                      <div className="bg-white/10 rounded-lg p-4">
                        <h4 className="font-semibold mb-2 text-base">Eredità Complicate</h4>
                        <p className="text-sm mb-3">Successioni difficili e divisioni problematiche</p>
                        <ul className="text-sm space-y-2">
                          <li>• Pratiche successorie e divisioni</li>
                          <li>• Vendita immobili e conflitti familiari</li>
                        </ul>
                      </div>
                      <div className="bg-white/10 rounded-lg p-4">
                        <h4 className="font-semibold mb-2 text-base">Immobili Compromessi</h4>
                        <p className="text-sm mb-3">Situazioni particolari che richiedono expertise</p>
                        <ul className="text-sm space-y-2">
                          <li>• Immobili con vizi e problemi urbanistici</li>
                          <li>• Contenziosi e recupero crediti</li>
                        </ul>
                      </div>
                    </div>
                  </div>



                  {/* Servizi di Acquisizione */}
                  <div className="bg-primary rounded-2xl p-6 text-white shadow-lg">
                    <h3 className="text-xl font-bold mb-4 text-center">
                      🏡 Ti Aiutiamo ad Acquistare
                    </h3>
                    <div className="space-y-4">
                      <div className="bg-white/10 rounded-lg p-4">
                        <h4 className="font-semibold mb-2 text-base">Acquisto Senza Anticipi</h4>
                        <p className="text-sm mb-3">Percorsi facilitati per l'acquisto della casa</p>
                        <ul className="text-sm space-y-2">
                          <li>• Mutui 100% e garanzie statali giovani</li>
                          <li>• Bonus prima casa e agevolazioni</li>
                        </ul>
                      </div>
                      <div className="bg-white/10 rounded-lg p-4">
                        <h4 className="font-semibold mb-2 text-base">Supporto Completo</h4>
                        <p className="text-sm mb-3">Ti seguiamo in ogni fase dell'acquisto</p>
                        <ul className="text-sm space-y-2">
                          <li>• Ricerca immobile e negoziazione prezzo</li>
                          <li>• Pratiche burocratiche e assistenza post-vendita</li>
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

        {/* Servizi Tecnici Evoluti */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-primary mb-4">
                Servizi Tecnici Evoluti
              </h2>
              <p className="text-xl text-gray-600">
                Pensati per dare nuova vita agli immobili
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center group">
                <div className="w-16 h-16 rounded-xl bg-blue-600 text-white flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 border-2 border-blue-500">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-primary mb-2">Ristrutturazioni Complete</h3>
                <p className="text-gray-600 text-sm leading-relaxed">Riqualificazione completa anche da situazioni critiche</p>
              </div>

              <div className="text-center group">
                <div className="w-16 h-16 rounded-xl bg-blue-600 text-white flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 border-2 border-blue-500">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-primary mb-2">Redistribuzione Spazi</h3>
                <p className="text-gray-600 text-sm leading-relaxed">Progetti funzionali e su misura per le tue esigenze</p>
              </div>

              <div className="text-center group">
                <div className="w-16 h-16 rounded-xl bg-blue-600 text-white flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 border-2 border-blue-500">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-primary mb-2">Nuove Costruzioni</h3>
                <p className="text-gray-600 text-sm leading-relaxed">Team dedicato per ogni fase: progettazione, autorizzazioni, cantieri</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Final */}
        <section className="py-20 bg-gradient-to-br from-secondary to-secondary/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="w-16 h-16 mx-auto mb-6 bg-white/20 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-white mb-4">
              Il Primo Passo è Parlarne
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto leading-relaxed">
              Contattaci senza impegno: ascoltiamo la tua storia, analizziamo la situazione 
              e costruiamo la strategia più adatta a te — che sia salvare, vendere o ricominciare da capo.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-xl border-2 border-blue-500 transition-all duration-300 hover:scale-105 group">
                <svg className="h-5 w-5 mr-2 inline group-hover:animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                346 800 3234
              </button>
              <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-xl border-2 border-blue-500 transition-all duration-300 hover:scale-105">
                Scrivici una Email
                <svg className="h-5 w-5 ml-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </button>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
}
