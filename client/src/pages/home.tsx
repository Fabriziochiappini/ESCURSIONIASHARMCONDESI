import React from "react";
import { HeroSection } from "@/components/hero-section";
import { PropertyGrid } from "@/components/property-grid";
import { DestinationsSection } from "@/components/destinations-section";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { SEOHead } from "@/components/seo-head";
import { ShowcaseSection } from "@/components/showcase-section";


export default function Home() {

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
                Viaggi in Evidenza
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-12">
                Scopri le destinazioni più belle del mondo con i nostri pacchetti esclusivi
              </p>
            </div>

            <div className="animate-slide-up">
              <PropertyGrid showAll={false} />
            </div>
          </div>
        </section>

        {/* Sezioni Vetrina */}
        <ShowcaseSection category="emirati_arabi" />
        <ShowcaseSection category="europa" />
        <ShowcaseSection category="asia" />
        <ShowcaseSection category="esotico" />

        {/* Sezione Destinazioni */}
        <DestinationsSection />

        {/* Sezione Blog */}
        <section className="py-20 bg-gradient-to-br from-blue-50 via-white to-purple-50 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-400/5 to-purple-400/5"></div>
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16 animate-fade-in">
              <h2 className="text-4xl lg:text-5xl font-light mb-4 text-gray-900">
                Ispirazioni di Viaggio
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Scopri consigli, storie e guide per rendere ogni viaggio indimenticabile
              </p>
            </div>

            <div className="max-w-4xl mx-auto space-y-12 animate-slide-up">
              {/* Blog Card 1 */}
              <div className="group cursor-pointer bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02]">
                <div className="flex flex-col lg:flex-row">
                  <div className="relative lg:w-1/2 h-64 lg:h-auto">
                    <div className="absolute inset-0 bg-gradient-to-br from-orange-400 to-pink-500"></div>
                    <div className="absolute inset-0 bg-black/20"></div>
                    <div className="absolute top-6 left-6">
                      <span className="px-4 py-2 bg-white/90 backdrop-blur-sm rounded-full text-sm font-semibold text-orange-600">
                        Guide di Viaggio
                      </span>
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                  <div className="lg:w-1/2 p-8 flex flex-col justify-center">
                    <p className="text-gray-500 text-sm mb-3">15 Gennaio 2025</p>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-primary transition-colors">
                      Le 10 Destinazioni più Belle del 2025
                    </h3>
                    <p className="text-gray-600 leading-relaxed mb-6">
                      Da Bali alle capitali europee, una selezione curata delle mete imperdibili per vivere esperienze uniche. Scopri paradisi tropicali incontaminati, città d'arte ricche di storia e destinazioni esotiche che trasformeranno il tuo modo di viaggiare.
                    </p>
                    <div className="flex items-center text-primary font-semibold group-hover:translate-x-2 transition-transform duration-300">
                      <span className="mr-2">Leggi l'articolo</span>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* Blog Card 2 */}
              <div className="group cursor-pointer bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02]">
                <div className="flex flex-col lg:flex-row-reverse">
                  <div className="relative lg:w-1/2 h-64 lg:h-auto">
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-400 to-blue-500"></div>
                    <div className="absolute inset-0 bg-black/20"></div>
                    <div className="absolute top-6 right-6">
                      <span className="px-4 py-2 bg-white/90 backdrop-blur-sm rounded-full text-sm font-semibold text-emerald-600">
                        Consigli di Viaggio
                      </span>
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                  <div className="lg:w-1/2 p-8 flex flex-col justify-center">
                    <p className="text-gray-500 text-sm mb-3">12 Gennaio 2025</p>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-primary transition-colors">
                      Come Preparare la Valigia Perfetta
                    </h3>
                    <p className="text-gray-600 leading-relaxed mb-6">
                      Trucchi e consigli per viaggiare leggeri senza rinunce. Dalla scelta del bagaglio giusto agli indispensabili da portare sempre con te, scopri come ottimizzare lo spazio e partire preparato per qualsiasi avventura.
                    </p>
                    <div className="flex items-center text-primary font-semibold group-hover:translate-x-2 transition-transform duration-300">
                      <span className="mr-2">Leggi l'articolo</span>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* Blog Card 3 */}
              <div className="group cursor-pointer bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02]">
                <div className="flex flex-col lg:flex-row">
                  <div className="relative lg:w-1/2 h-64 lg:h-auto">
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-400 to-indigo-500"></div>
                    <div className="absolute inset-0 bg-black/20"></div>
                    <div className="absolute top-6 left-6">
                      <span className="px-4 py-2 bg-white/90 backdrop-blur-sm rounded-full text-sm font-semibold text-purple-600">
                        Esperienze
                      </span>
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                  <div className="lg:w-1/2 p-8 flex flex-col justify-center">
                    <p className="text-gray-500 text-sm mb-3">10 Gennaio 2025</p>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-primary transition-colors">
                      Viaggi Gastronomici in Italia
                    </h3>
                    <p className="text-gray-600 leading-relaxed mb-6">
                      Un tour dei sapori autentici delle nostre regioni. Dalle trattorie storiche ai mercati locali, scopri i segreti della cucina italiana attraverso esperienze uniche che uniscono tradizione, cultura e gusto.
                    </p>
                    <div className="flex items-center text-primary font-semibold group-hover:translate-x-2 transition-transform duration-300">
                      <span className="mr-2">Leggi l'articolo</span>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* CTA del Blog */}
            <div className="text-center mt-16">
              <div className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-primary to-blue-600 text-white rounded-2xl font-semibold hover:shadow-xl transform hover:scale-105 transition-all duration-300 cursor-pointer">
                <span className="mr-2">Scopri Altri Articoli</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </div>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
}