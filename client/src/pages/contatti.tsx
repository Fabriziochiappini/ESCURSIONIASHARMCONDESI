import { MessageCircle, Phone, Mail, MapPin } from "lucide-react";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { SEOHead } from "@/components/seo-head";
import { Button } from "@/components/ui/button";
import { SocialButtons } from "@/components/social-buttons";

export default function Contatti() {
  return (
    <div className="min-h-screen bg-white">
      <SEOHead 
        title="Contatti Si viaggia con Desi | Tour Operator Sharm El Sheikh"
        description="Contatta Si viaggia con Desi per organizzare i tuoi tour a Sharm El Sheikh. Tel: +39 344 458 5177, Email: siviaggiacondesi@gmail.com"
        keywords="contatti tour operator, si viaggia con desi contatti, tour operator sharm el sheikh"
        canonicalUrl="https://unconventionaltour.it/contatti"
      />
      <Navigation />

      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-br from-white to-[#A8CFEB]/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-6xl font-light text-gray-600 mb-6 tracking-wide">
              Contattaci
            </h1>
            <div className="w-48 h-[2px] bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent mx-auto mb-6"></div>
            <p className="text-xl md:text-2xl text-gray-400 mb-8 max-w-3xl mx-auto font-light">
              Siamo qui per aiutarti a scoprire le meraviglie di Sharm El Sheikh
            </p>
          </div>
        </section>

        {/* Contatti Section */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Info Contatti */}
              <div>
                <h2 className="text-3xl font-light text-gray-600 mb-8 tracking-wide">
                  I Nostri Contatti
                </h2>
                
                <div className="space-y-6">
                  <div className="flex items-start space-x-4 p-6 bg-[#A8CFEB]/5 rounded-2xl hover:shadow-lg transition-all duration-300 border border-[#D4AF37]/20">
                    <div className="w-12 h-12 bg-[#A8CFEB]/20 rounded-full flex items-center justify-center flex-shrink-0">
                      <MapPin className="h-6 w-6 text-[#A8CFEB]" />
                    </div>
                    <div>
                      <h3 className="text-lg font-normal text-gray-600 mb-1">Indirizzo</h3>
                      <p className="text-gray-400 font-light">Via Roma, 123<br />20121 Milano (MI)</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4 p-6 bg-[#D4AF37]/5 rounded-2xl hover:shadow-lg transition-all duration-300 border border-[#D4AF37]/20">
                    <div className="w-12 h-12 bg-[#D4AF37]/20 rounded-full flex items-center justify-center flex-shrink-0">
                      <Phone className="h-6 w-6 text-[#D4AF37]" />
                    </div>
                    <div>
                      <h3 className="text-lg font-normal text-gray-600 mb-1">Telefono</h3>
                      <a href="tel:+393444585177" className="text-[#A8CFEB] hover:underline text-lg font-light">
                        +39 344 458 5177
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4 p-6 bg-[#A8CFEB]/5 rounded-2xl hover:shadow-lg transition-all duration-300 border border-[#D4AF37]/20">
                    <div className="w-12 h-12 bg-[#A8CFEB]/20 rounded-full flex items-center justify-center flex-shrink-0">
                      <Mail className="h-6 w-6 text-[#A8CFEB]" />
                    </div>
                    <div>
                      <h3 className="text-lg font-normal text-gray-600 mb-1">Email</h3>
                      <a href="mailto:siviaggiacondesi@gmail.com" className="text-[#A8CFEB] hover:underline block font-light">
                        siviaggiacondesi@gmail.com
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4 p-6 bg-green-50/50 rounded-2xl hover:shadow-lg transition-all duration-300 border border-green-200/30">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <MessageCircle className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-normal text-gray-600 mb-1">WhatsApp</h3>
                      <a 
                        href="https://wa.me/393444585177?text=Ciao! Vorrei informazioni sui vostri tour a Sharm El Sheikh"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-green-600 hover:underline font-light"
                      >
                        Scrivici su WhatsApp
                      </a>
                    </div>
                  </div>
                </div>

                {/* Pulsanti CTA */}
                <div className="mt-8 flex flex-col sm:flex-row gap-4">
                  <Button 
                    className="bg-gradient-to-r from-[#A8CFEB] to-[#C5E1F5] hover:from-[#95C4E6] hover:to-[#A8CFEB] text-white flex-1 font-light border border-[#D4AF37]/20"
                    asChild
                  >
                    <a href="tel:+393444585177">
                      <Phone className="h-4 w-4 mr-2" />
                      Chiama Ora
                    </a>
                  </Button>
                  <Button 
                    className="bg-green-500 hover:bg-green-600 text-white flex-1 font-light"
                    asChild
                  >
                    <a 
                      href="https://wa.me/393444585177?text=Ciao! Vorrei informazioni sui vostri tour a Sharm El Sheikh"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <MessageCircle className="h-4 w-4 mr-2" />
                      WhatsApp
                    </a>
                  </Button>
                </div>

                {/* Social Media */}
                <div className="mt-8 pt-8 border-t border-[#D4AF37]/20">
                  <h3 className="text-lg font-normal text-gray-600 mb-4 text-center tracking-wide">Seguici sui Social</h3>
                  <div className="flex justify-center">
                    <SocialButtons variant="large" />
                  </div>
                </div>
              </div>

              {/* Mappa */}
              <div className="relative">
                <div className="aspect-square rounded-2xl overflow-hidden shadow-2xl">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2970.0!2d9.19!3d45.46!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDXCsDI3JzM2LjAiTiA5wrAxMScyNC4wIkU!5e0!3m2!1sit!2sit!4v1234567890!5m2!1sit!2sit"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Mappa UNCONVENTIONAL TOUR - Via Roma 123, Milano"
                    className="rounded-2xl"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Orari Section */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">
              Orari di Apertura
            </h2>
            <div className="inline-block bg-white p-8 rounded-2xl shadow-lg">
              <div className="space-y-3 text-left">
                <div className="flex justify-between space-x-12">
                  <span className="font-semibold text-gray-900">Lunedì - Venerdì:</span>
                  <span className="text-gray-600">09:00 - 19:00</span>
                </div>
                <div className="flex justify-between space-x-12">
                  <span className="font-semibold text-gray-900">Sabato:</span>
                  <span className="text-gray-600">09:00 - 13:00</span>
                </div>
                <div className="flex justify-between space-x-12">
                  <span className="font-semibold text-gray-900">Domenica:</span>
                  <span className="text-gray-600">Chiuso</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Final */}
        <section className="py-16 bg-gradient-to-r from-[#A8CFEB] to-[#C5E1F5]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-light mb-4 text-white tracking-wide">
              Pronto a Partire?
            </h2>
            <p className="text-xl mb-8 text-white/90 font-light">
              Contattaci oggi stesso per prenotare il tuo tour perfetto
            </p>
            <Button 
              size="lg" 
              className="bg-white text-[#A8CFEB] hover:bg-white/90 font-light border border-[#D4AF37]/30 shadow-lg"
              asChild
            >
              <a href="/viaggi">
                Scopri i Nostri Tour
              </a>
            </Button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
