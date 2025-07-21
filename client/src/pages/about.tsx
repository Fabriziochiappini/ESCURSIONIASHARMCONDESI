import { Building2, Users, Award, MapPin, Phone, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";

export default function About() {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      
      <main>
        {/* Hero Section */}
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-purple-900 via-blue-900 to-purple-900">
          {/* Background Effects */}
          <div className="absolute inset-0 glass-bg"></div>
          <div className="absolute top-20 left-20 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float"></div>
          <div className="absolute top-40 right-20 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float-delayed"></div>
          <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float"></div>
          
          <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-8 leading-tight">
              Chi <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">Siamo</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-200 mb-12 leading-relaxed">
              La tua agenzia immobiliare di fiducia ad Acireale e dintorni dal 1995
            </p>
          </div>
        </section>

        {/* Story Section */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-6">
                  La Nostra Storia
                </h2>
                <p className="text-lg text-gray-600 mb-6">
                  Fondata nel 1995, Immobiliare Acireale è diventata un punto di riferimento nel settore immobiliare della provincia di Catania. Con oltre 25 anni di esperienza, abbiamo aiutato migliaia di famiglie a trovare la casa dei loro sogni.
                </p>
                <p className="text-lg text-gray-600 mb-6">
                  La nostra passione per il territorio siciliano e la profonda conoscenza del mercato locale ci permettono di offrire servizi personalizzati e di alta qualità.
                </p>
                <div className="flex items-center space-x-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-600">25+</div>
                    <div className="text-sm text-gray-600">Anni di esperienza</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-600">2000+</div>
                    <div className="text-sm text-gray-600">Clienti soddisfatti</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-600">500+</div>
                    <div className="text-sm text-gray-600">Proprietà vendute</div>
                  </div>
                </div>
              </div>
              <div className="relative">
                <div className="aspect-square rounded-2xl overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800" 
                    alt="Ufficio Immobiliare Acireale"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                I Nostri Valori
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Principi che guidano ogni nostra azione nel servizio ai clienti
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="text-center glass-card hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="h-8 w-8 text-purple-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    Professionalità
                  </h3>
                  <p className="text-gray-600">
                    Competenza e serietà in ogni transazione, con un team di esperti costantemente aggiornato sulle normative del settore.
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center glass-card hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Award className="h-8 w-8 text-purple-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    Trasparenza
                  </h3>
                  <p className="text-gray-600">
                    Informazioni chiare e complete su ogni proprietà, con prezzi onesti e senza costi nascosti.
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center glass-card hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MapPin className="h-8 w-8 text-purple-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    Territorio
                  </h3>
                  <p className="text-gray-600">
                    Conoscenza approfondita di Acireale e dei comuni limitrofi, per consigli sempre mirati e preziosi.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Il Nostro Team
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Professionisti esperti al vostro servizio
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="text-center glass-card hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                <CardContent className="p-6">
                  <div className="w-24 h-24 rounded-full overflow-hidden mx-auto mb-4">
                    <img 
                      src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150" 
                      alt="Marco Siciliano"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Marco Siciliano
                  </h3>
                  <p className="text-purple-600 mb-2">Founder & CEO</p>
                  <p className="text-gray-600 text-sm mb-4">
                    Esperto del mercato immobiliare siciliano con oltre 25 anni di esperienza.
                  </p>
                  <div className="flex justify-center space-x-2">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-600">+39 333 123 4567</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="text-center glass-card hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                <CardContent className="p-6">
                  <div className="w-24 h-24 rounded-full overflow-hidden mx-auto mb-4">
                    <img 
                      src="https://images.unsplash.com/photo-1494790108755-2616b612b47c?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150" 
                      alt="Sofia Romano"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Sofia Romano
                  </h3>
                  <p className="text-purple-600 mb-2">Sales Manager</p>
                  <p className="text-gray-600 text-sm mb-4">
                    Specializzata in vendite e affitti residenziali nella provincia di Catania.
                  </p>
                  <div className="flex justify-center space-x-2">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-600">+39 333 987 6543</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="text-center glass-card hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                <CardContent className="p-6">
                  <div className="w-24 h-24 rounded-full overflow-hidden mx-auto mb-4">
                    <img 
                      src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150" 
                      alt="Giuseppe Greco"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Giuseppe Greco
                  </h3>
                  <p className="text-purple-600 mb-2">Vacation Rentals Expert</p>
                  <p className="text-gray-600 text-sm mb-4">
                    Esperto in case vacanza e investimenti immobiliari turistici.
                  </p>
                  <div className="flex justify-center space-x-2">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-600">+39 333 555 7890</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Contact CTA */}
        <section className="py-16 bg-gradient-to-r from-purple-600 to-blue-600 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold mb-4">
              Pronto a Trovare la Tua Casa Ideale?
            </h2>
            <p className="text-xl mb-8 text-purple-100">
              Contattaci oggi stesso per una consulenza gratuita
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                variant="secondary"
                className="bg-white text-purple-600 hover:bg-purple-50"
                asChild
              >
                <Link href="/proprieta">
                  Vedi Proprietà
                </Link>
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-purple-600"
                asChild
              >
                <a href="tel:+393331234567">
                  <Phone className="h-5 w-5 mr-2" />
                  Chiamaci Ora
                </a>
              </Button>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}