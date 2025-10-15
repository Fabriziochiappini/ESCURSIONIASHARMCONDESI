import React from "react";
import { HeroSection } from "@/components/hero-section";
import { PropertyGrid } from "@/components/property-grid";
import { DestinationsSection } from "@/components/destinations-section";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { SEOHead } from "@/components/seo-head";
import { ShowcaseSection } from "@/components/showcase-section";
import { GalleriesSection } from "@/components/galleries-section";


export default function Home() {

  return (
    <div className="min-h-screen bg-background">
      <SEOHead 
        title="UNCONVENTIONAL TOUR - Agenzia Viaggi | Vacanze Mare, Montagna e City Break"
        description="✈️ Scopri il mondo con UNCONVENTIONAL TOUR! Vacanze al mare, avventure in montagna, city break e viaggi culturali. Pacchetti personalizzati per ogni esigenza di viaggio."
        keywords="agenzia viaggi, vacanze mare, viaggi montagna, city break, pacchetti viaggio, unconventional tour, viaggi organizzati, turismo"
        canonicalUrl="https://unconventionaltour.it/"
      />
      <Navigation />
      <main className="relative">
        <HeroSection />

        {/* Sezione Chi Siamo */}
        <section className="py-20 bg-white pattern-dots relative overflow-hidden">
          <div className="absolute inset-0 gradient-animated opacity-30"></div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Testo a sinistra */}
              <div>
                <div className="mb-4">
                  <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-2">
                    Chi Siamo
                  </h2>
                  <div className="w-24 h-1 bg-blue-500"></div>
                </div>
                <div className="space-y-4 text-gray-700 text-lg leading-relaxed">
                  <p>
                    Siamo un'agenzia locale, ben consolidata, con oltre 40 anni di esperienza nel settore dei viaggi, 
                    con sede in Via Roma, 123 - Milano, Italia.
                  </p>
                  <p>
                    Concepiamo il turismo non come una semplice attività ricreativa, ma come un viaggio educativo 
                    e piacevole verso paesi e culture sconosciute. Mettiamo un forte accento sul portare sviluppo 
                    sostenibile a lungo termine nelle regioni che promuoviamo, lavorando a stretto contatto con i 
                    fornitori locali e utilizzando prodotti locali.
                  </p>
                </div>
              </div>

              {/* Immagine a destra */}
              <div className="relative">
                <div className="rounded-3xl overflow-hidden shadow-2xl bg-gray-200">
                  <img 
                    src="/chi-siamo.png"
                    alt="UNCONVENTIONAL TOUR - Il tuo viaggio inizia qui"
                    loading="lazy"
                    decoding="async"
                    className="w-full h-[500px] object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Sezione Destinazioni - PRIMA dei Viaggi */}
        <DestinationsSection />

        <section id="travels" className="py-20 bg-gradient-to-br from-blue-50 via-white to-purple-50 relative overflow-hidden pattern-waves">
          <div className="absolute top-20 right-20 w-72 h-72 bg-blue-400/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 left-20 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
          <div className="relative z-10 max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8">
            {/* Viaggi a tutta larghezza */}
            <div className="text-center mb-16 animate-fade-in">
              <h2 className="text-4xl lg:text-5xl font-light mb-4 text-gray-900">
                Tour in Evidenza
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-12">
                Scopri le destinazioni più belle del mondo con i nostri tour esclusivi
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

        {/* Sezione Gallerie */}
        <GalleriesSection />

        {/* Sezione Blog */}
        <section className="py-24 bg-gradient-to-r from-slate-900 via-gray-900 to-slate-800 relative overflow-hidden">

          
          <div className="relative z-10 max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-20 animate-fade-in">
              <h2 className="text-5xl lg:text-7xl font-black mb-6 text-white tracking-tight">
                GUIDE DEFINITIVE
              </h2>
              <p className="text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed font-medium">
                Informazioni concrete per decisioni sicure. Zero perdite di tempo.
              </p>
            </div>

            <div className="space-y-8 animate-slide-up">
              {/* Blog Card 1 */}
              <div className="group cursor-pointer bg-gradient-to-r from-red-600 to-orange-500 relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transform hover:scale-[1.02] transition-all duration-300">
                <div className="relative z-10 flex flex-col lg:flex-row min-h-[320px]">
                  <div className="lg:w-2/3 p-12 flex flex-col justify-center">
                    <div className="mb-6">
                      <span className="px-6 py-3 bg-white text-red-600 font-black text-sm uppercase tracking-wider">
                        DESTINAZIONI 2025
                      </span>
                    </div>
                    <h3 className="text-4xl lg:text-5xl font-black text-white mb-6 leading-tight">
                      LE 10 METE CHE CONTANO
                    </h3>
                    <p className="text-xl text-white/90 leading-relaxed mb-8 font-medium">
                      Analisi completa delle destinazioni top. Costi reali, periodi ottimali, cosa aspettarsi. Dati concreti per decidere subito.
                    </p>
                    <div className="flex items-center">
                      <div className="bg-white text-red-600 px-8 py-4 font-black uppercase tracking-wide group-hover:bg-yellow-400 group-hover:text-black transition-all duration-300">
                        ACCEDI ALLA GUIDA →
                      </div>
                    </div>
                  </div>
                  <div className="lg:w-1/3 relative min-h-[200px] lg:min-h-auto">
                    <img 
                      src="https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&h=600&fit=crop&crop=center"
                      alt="Destinazioni di viaggio 2025"
                      className="absolute inset-0 w-full h-full object-cover"
                    />

                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-8xl font-black text-white/30">01</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Blog Card 2 */}
              <div className="group cursor-pointer bg-gradient-to-r from-blue-600 to-purple-600 relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transform hover:scale-[1.02] transition-all duration-300">
                <div className="relative z-10 flex flex-col lg:flex-row-reverse min-h-[320px]">
                  <div className="lg:w-2/3 p-12 flex flex-col justify-center">
                    <div className="mb-6">
                      <span className="px-6 py-3 bg-white text-blue-600 font-black text-sm uppercase tracking-wider">
                        STRATEGIA BAGAGLIO
                      </span>
                    </div>
                    <h3 className="text-4xl lg:text-5xl font-black text-white mb-6 leading-tight">
                      VALIGIA DA PRO
                    </h3>
                    <p className="text-xl text-white/90 leading-relaxed mb-8 font-medium">
                      Sistema definitivo per preparare il bagaglio. Checklist verificata, peso ottimizzato, zero stress. Metodo testato su 1000+ viaggi.
                    </p>
                    <div className="flex items-center">
                      <div className="bg-white text-blue-600 px-8 py-4 font-black uppercase tracking-wide group-hover:bg-yellow-400 group-hover:text-black transition-all duration-300">
                        SCARICA CHECKLIST →
                      </div>
                    </div>
                  </div>
                  <div className="lg:w-1/3 relative min-h-[200px] lg:min-h-auto">
                    <img 
                      src="https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&h=600&fit=crop&crop=center"
                      alt="Preparazione valigia per viaggi"
                      className="absolute inset-0 w-full h-full object-cover"
                    />

                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-8xl font-black text-white/30">02</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Blog Card 3 */}
              <div className="group cursor-pointer bg-gradient-to-r from-green-600 to-emerald-500 relative overflow-hidden transform hover:scale-[1.01] transition-all duration-300">
                <div className="relative z-10 flex flex-col lg:flex-row min-h-[320px]">
                  <div className="lg:w-2/3 p-12 flex flex-col justify-center">
                    <div className="mb-6">
                      <span className="px-6 py-3 bg-white text-green-600 font-black text-sm uppercase tracking-wider">
                        FOOD TOUR ITALIA
                      </span>
                    </div>
                    <h3 className="text-4xl lg:text-5xl font-black text-white mb-6 leading-tight">
                      SAPORI AUTENTICI
                    </h3>
                    <p className="text-xl text-white/90 leading-relaxed mb-8 font-medium">
                      Mappatura completa dei migliori ristoranti italiani. Indirizzi verificati, piatti imperdibili, prezzi reali. La guida definitiva per mangiare da re.
                    </p>
                    <div className="flex items-center">
                      <div className="bg-white text-green-600 px-8 py-4 font-black uppercase tracking-wide group-hover:bg-yellow-400 group-hover:text-black transition-all duration-300">
                        ESPLORA MAPPA →
                      </div>
                    </div>
                  </div>
                  <div className="lg:w-1/3 relative min-h-[200px] lg:min-h-auto">
                    <img 
                      src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&h=600&fit=crop&crop=center"
                      alt="Cucina italiana autentica"
                      className="absolute inset-0 w-full h-full object-cover"
                    />

                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-8xl font-black text-white/30">03</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* CTA del Blog */}
            <div className="text-center mt-20">
              <div className="inline-block bg-yellow-400 text-black px-16 py-6 font-black text-2xl uppercase tracking-wider hover:bg-white transition-all duration-300 cursor-pointer transform hover:scale-105">
                ACCEDI A TUTTE LE GUIDE →
              </div>
              <p className="text-gray-400 mt-6 text-lg font-medium">
                Informazioni concrete. Decisioni rapide. Viaggi perfetti.
              </p>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
}