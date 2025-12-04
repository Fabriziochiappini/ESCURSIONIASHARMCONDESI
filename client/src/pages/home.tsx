import { useState } from "react";
import { HeroSection } from "@/components/hero-section";
import { PropertyGrid } from "@/components/property-grid";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { SEOHead } from "@/components/seo-head";
import { ShowcaseSection } from "@/components/showcase-section";
import { GalleriesSection } from "@/components/galleries-section";
import { SupportSection } from "@/components/support-section";
import { AnnouncementBar } from "@/components/announcement-bar";
import { FacebookReviews } from "@/components/facebook-reviews";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import type { Guide } from "@shared/schema";


export default function Home() {
  const [tourCategory, setTourCategory] = useState<"all" | "single" | "package">("all");
  
  const { data: guides = [] } = useQuery<Guide[]>({
    queryKey: ["/api/guides"],
  });

  return (
    <div className="min-h-screen bg-background">
      <SEOHead 
        title="Si Viaggia con Desi - Escursioni a Sharm El Sheikh | Tour Operator Mar Rosso"
        description="✈️ Scopri Sharm El Sheikh con Si Viaggia con Desi! Tour operator specializzato in escursioni, snorkeling, diving e safari nel deserto. Esperienze autentiche nel Mar Rosso."
        keywords="tour operator sharm el sheikh, escursioni mar rosso, snorkeling sharm, diving egitto, safari deserto, si viaggia con desy, tour sharm"
        canonicalUrl="https://siviaggiacondesy.com/"
      />
      <AnnouncementBar />
      <Navigation />
      <main className="relative lg:pt-[52px]">
        <HeroSection />

        {/* Sezione Tour */}
        <section id="travels" className="py-20 bg-gradient-to-br from-white via-[#A8CFEB]/5 to-white relative overflow-hidden">
          <div className="absolute top-20 right-20 w-80 h-80 bg-[#A8CFEB]/15 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 left-20 w-96 h-96 bg-[#D4AF37]/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
          <div className="relative z-10 max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16 animate-fade-in">
              <h2 className="text-4xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-[#C9A961] via-[#D4AF37] to-[#C9A961] bg-clip-text text-transparent tracking-[0.2em] uppercase drop-shadow-lg transform hover:scale-105 transition-transform duration-300 font-eagle-lake">
                Le Nostre Escursioni
              </h2>
              <div className="w-64 h-[2px] bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent mx-auto mb-6"></div>
              <p className="text-lg text-gray-500 max-w-3xl mx-auto leading-relaxed mb-8 font-light">
                Ti offriamo un'ampia scelta di destinazioni da visitare a Sharm El Sheikh.<br />
                Scegli quella che più ti piace e lasciati ispirare dalla meravigliosa barriera corallina del Mar Rosso.
              </p>
              
              {/* Tabs per filtrare */}
              <div className="flex justify-center gap-2 mb-12">
                <button
                  onClick={() => setTourCategory("all")}
                  className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                    tourCategory === "all"
                      ? "bg-gradient-to-r from-[#C9A961] to-[#D4AF37] text-white shadow-lg scale-105"
                      : "bg-white border-2 border-[#D4AF37]/30 text-gray-600 hover:border-[#D4AF37] hover:text-[#D4AF37]"
                  }`}
                >
                  🌟 Tutti
                </button>
                <button
                  onClick={() => setTourCategory("single")}
                  className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                    tourCategory === "single"
                      ? "bg-gradient-to-r from-[#C9A961] to-[#D4AF37] text-white shadow-lg scale-105"
                      : "bg-white border-2 border-[#D4AF37]/30 text-gray-600 hover:border-[#D4AF37] hover:text-[#D4AF37]"
                  }`}
                >
                  🎯 Escursioni Singole
                </button>
                <button
                  onClick={() => setTourCategory("package")}
                  className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                    tourCategory === "package"
                      ? "bg-gradient-to-r from-[#C9A961] to-[#D4AF37] text-white shadow-lg scale-105"
                      : "bg-white border-2 border-[#D4AF37]/30 text-gray-600 hover:border-[#D4AF37] hover:text-[#D4AF37]"
                  }`}
                >
                  📦 Pacchetti
                </button>
              </div>
            </div>

            <div className="animate-slide-up">
              <PropertyGrid showAll={true} tourCategory={tourCategory} />
            </div>
          </div>
        </section>

        {/* Sezione Chi Siamo */}
        <section className="py-20 bg-white relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Testo a sinistra */}
              <div>
                <div className="mb-6">
                  <h2 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-[#C9A961] via-[#D4AF37] to-[#C9A961] bg-clip-text text-transparent mb-3 tracking-[0.15em] uppercase drop-shadow-lg font-eagle-lake">
                    Chi Siamo
                  </h2>
                  <div className="w-32 h-[2px] bg-gradient-to-r from-[#D4AF37] to-transparent"></div>
                </div>
                <div className="space-y-4 text-gray-500 text-lg leading-relaxed font-light">
                  <p>
                    <strong className="text-[#D4AF37]">Si Viaggia con Desi</strong> è il tuo punto di riferimento per le escursioni 
                    a Sharm El Sheikh. Con anni di esperienza nel Mar Rosso, organizziamo tour indimenticabili tra 
                    spiagge cristalline, barriere coralline mozzafiato e avventure nel deserto egiziano.
                  </p>
                  <p>
                    Per noi viaggiare non è solo una vacanza, ma un'esperienza educativa e piacevole che ti porta 
                    a scoprire luoghi e culture affascinanti. Lavoriamo con guide locali esperte per garantirti 
                    escursioni autentiche e sicure a Sharm El Sheikh.
                  </p>
                </div>
              </div>

              {/* Immagine a destra */}
              <div className="relative">
                <div className="rounded-3xl overflow-hidden shadow-xl bg-gray-100 border border-[#D4AF37]/20">
                  <img 
                    src="/chi-siamo.png"
                    alt="Si Viaggia con Desi - Escursioni a Sharm El Sheikh"
                    loading="lazy"
                    decoding="async"
                    className="w-full h-[500px] object-cover"
                  />
                </div>
              </div>
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

        {/* Sezione Recensioni Facebook */}
        <FacebookReviews />

      </main>
      <SupportSection />
      <Footer />
    </div>
  );
}