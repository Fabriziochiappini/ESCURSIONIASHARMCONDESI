import { MessageCircle, Phone, Mail } from "lucide-react";
import { Navigation } from "@/components/navigation";
import { AnnouncementBar } from "@/components/announcement-bar";
import { Footer } from "@/components/footer";
import { SEOHead } from "@/components/seo-head";
import { Button } from "@/components/ui/button";
import { SocialButtons } from "@/components/social-buttons";
import { CtaEscursioni } from "@/components/cta-escursioni";

export default function Contatti() {
  return (
    <div className="min-h-screen bg-white">
      <SEOHead 
        title="Contatti Si Viaggia con Desi | Tour Operator Sharm El Sheikh"
        description="Contatta Si Viaggia con Desi per organizzare i tuoi tour a Sharm El Sheikh. Tel: +39 344 458 5177, Email: siviaggiacondesi@gmail.com"
        keywords="contatti tour operator, si viaggia con desy contatti, tour operator sharm el sheikh"
        canonicalUrl="https://siviaggiacondesy.it/contatti"
      />
      <AnnouncementBar />
      <Navigation />

      <main className="pt-20 lg:pt-[148px]">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-br from-[#2C3E50] via-[#1e3a5f] to-[#2C3E50] text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-[#E6C87F] via-[#D4AF37] to-[#E6C87F] bg-clip-text text-transparent tracking-[0.15em] uppercase drop-shadow-2xl font-eagle-lake">
              Contattaci
            </h1>
            <div className="w-48 h-[2px] bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent mx-auto mb-6"></div>
            <p className="text-xl md:text-2xl text-white mb-8 max-w-3xl mx-auto font-light opacity-90">
              Siamo qui per aiutarti a scoprire le meraviglie di Sharm El Sheikh
            </p>
          </div>
        </section>

        {/* Contatti Section */}
        <section className="py-20 bg-white">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Info Contatti */}
            <div>
              <h2 className="text-3xl font-bold mb-8 text-center bg-gradient-to-r from-[#C9A961] via-[#D4AF37] to-[#C9A961] bg-clip-text text-transparent tracking-[0.15em] uppercase drop-shadow-lg font-eagle-lake">
                I Nostri Contatti
              </h2>
              
              <div className="space-y-6">
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
          </div>
        </section>
      </main>

      <CtaEscursioni />
      <Footer />
    </div>
  );
}
