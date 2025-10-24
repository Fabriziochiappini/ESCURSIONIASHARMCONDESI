import { MessageCircle, Phone, Mail, MapPin, Clock, Award, Users, Shield, Home, Map, ThumbsUp } from "lucide-react";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { SEOHead } from "@/components/seo-head";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SupportSection } from "@/components/support-section";
import { CtaEscursioni } from "@/components/cta-escursioni";
import { Link } from "wouter";

export default function About() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-white to-accent/5">
      <SEOHead 
        title="Chi Siamo - Si Viaggia con Desy | Escursioni a Sharm El Sheikh"
        description="✈️ Scopri Si Viaggia con Desy, il tuo punto di riferimento per escursioni a Sharm El Sheikh. Tour operator specializzato in escursioni Mar Rosso. Tel: +39 344 458 5177"
        keywords="chi siamo, si viaggia con desy, tour operator sharm, escursioni sharm el sheikh"
        canonicalUrl="https://siviaggiacondesy.it/chi-siamo"
      />
      <Navigation />

      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-700 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center px-4 py-2 bg-white/20 text-white rounded-full text-sm font-medium mb-6">
              <Users className="h-4 w-4 mr-2 text-white" />
              Chi Siamo
            </div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#E6C87F] via-[#D4AF37] to-[#E6C87F] bg-clip-text text-transparent mb-6 tracking-[0.15em] uppercase drop-shadow-2xl font-eagle-lake">
              Si Viaggia con Desy
            </h1>
            <p className="text-xl md:text-2xl text-white mb-8 max-w-3xl mx-auto opacity-90">
              <strong>Escursioni a Sharm El Sheikh</strong> - Le migliori esperienze nel Mar Rosso. 
              Professionalità e passione per farti vivere avventure indimenticabili.
            </p>
          </div>
        </section>

        {/* Sezione Chi Siamo con Immagine */}
        <section className="py-20 bg-white relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[#A8CFEB]/5 to-white opacity-60"></div>
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
                    <strong className="text-[#D4AF37]">Si Viaggia con Desy</strong> è il tuo punto di riferimento per le escursioni 
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
                    alt="Si Viaggia con Desy - Escursioni a Sharm El Sheikh"
                    loading="lazy"
                    decoding="async"
                    className="w-full h-[500px] object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Perché Scegliere Noi Section */}
        <section className="py-20 bg-gradient-to-br from-[#F5F5DC]/30 via-white to-[#F5F5DC]/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-[#C9A961] via-[#D4AF37] to-[#C9A961] bg-clip-text text-transparent mb-6 tracking-[0.15em] uppercase drop-shadow-lg font-eagle-lake">
                Perché Scegliere Noi?
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Dal 2011 aiutiamo i nostri turisti a trascorrere delle vacanze indimenticabili nella bellissima Sharm El Sheikh. 
                Ecco 3 motivi per cui dovresti scegliere noi...
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {/* Sicurezza */}
              <div className="text-center">
                <div className="w-24 h-24 mx-auto mb-6 flex items-center justify-center">
                  <Shield className="w-20 h-20 text-[#D4AF37] stroke-[1.5]" />
                </div>
                <h3 className="text-2xl font-bold bg-gradient-to-r from-[#C9A961] via-[#D4AF37] to-[#C9A961] bg-clip-text text-transparent mb-4 tracking-wide uppercase font-eagle-lake">
                  Sicurezza
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Le nostre escursioni sono tutte coperte dall'assicurazione di viaggio. Con noi puoi viaggiare tranquillo.
                </p>
              </div>

              {/* Guida Italiana */}
              <div className="text-center">
                <div className="w-24 h-24 mx-auto mb-6 flex items-center justify-center">
                  <Map className="w-20 h-20 text-[#D4AF37] stroke-[1.5]" />
                </div>
                <h3 className="text-2xl font-bold bg-gradient-to-r from-[#C9A961] via-[#D4AF37] to-[#C9A961] bg-clip-text text-transparent mb-4 tracking-wide uppercase font-eagle-lake">
                  Guida Italiana
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Ti mettiamo a disposizione la nostra guida turistica italiana che ti farà scoprire i fantastici luoghi di Sharm El Sheikh.
                </p>
              </div>

              {/* Esperienza indimenticabile */}
              <div className="text-center">
                <div className="w-24 h-24 mx-auto mb-6 flex items-center justify-center">
                  <ThumbsUp className="w-20 h-20 text-[#D4AF37] stroke-[1.5]" />
                </div>
                <h3 className="text-2xl font-bold bg-gradient-to-r from-[#C9A961] via-[#D4AF37] to-[#C9A961] bg-clip-text text-transparent mb-4 tracking-wide uppercase font-eagle-lake">
                  Esperienza Indimenticabile
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Ti faremo ricordare a vita la vacanza che trascorrerai a Sharm che porterai per sempre nel cuore.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Story Section */}
        <section className="py-20 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#C9A961] via-[#D4AF37] to-[#C9A961] bg-clip-text text-transparent mb-8 tracking-[0.1em] uppercase font-eagle-lake">
              La Nostra Missione
            </h2>
            <p className="text-lg text-gray-600 mb-6 leading-relaxed">
              <strong className="text-[#D4AF37]">Si Viaggia con Desy</strong> è il tuo punto di riferimento per le escursioni a Sharm El Sheikh. Offriamo un servizio completo e professionale per escursioni, diving, snorkeling e safari nel deserto.
            </p>
            <p className="text-lg text-gray-600 leading-relaxed">
              La nostra passione per il Mar Rosso e la profonda conoscenza di Sharm El Sheikh ci permettono di offrire esperienze autentiche e indimenticabili.
            </p>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-[#C9A961] via-[#D4AF37] to-[#C9A961] bg-clip-text text-transparent mb-4 tracking-[0.1em] uppercase font-eagle-lake">
                I Nostri Valori
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Principi che guidano ogni nostra azione nel servizio ai clienti
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="text-center glass-card hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    Professionalità
                  </h3>
                  <p className="text-gray-600">
                    Competenza e serietà in ogni tour, con un team di esperti costantemente aggiornato sulle migliori escursioni di Sharm El Sheikh.
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center glass-card hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Award className="h-8 w-8 text-secondary" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    Trasparenza
                  </h3>
                  <p className="text-gray-600">
                    Informazioni chiare e complete su ogni tour, con prezzi onesti e senza costi nascosti.
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center glass-card hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MapPin className="h-8 w-8 text-accent" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    Territorio
                  </h3>
                  <p className="text-gray-600">
                    Conoscenza approfondita delle destinazioni più belle del mondo, per consigli sempre mirati e preziosi.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>

      <CtaEscursioni />
      <SupportSection />
      <Footer />
    </div>
  );
}