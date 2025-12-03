import { MessageCircle, Facebook, Instagram } from "lucide-react";

export function SupportSection() {
  return (
    <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#E6C87F] via-[#D4AF37] to-[#E6C87F] bg-clip-text text-transparent mb-4 tracking-[0.15em] uppercase drop-shadow-2xl font-eagle-lake">
          Hai bisogno di supporto?
        </h2>
        <p className="text-xl text-white/90 mb-8 font-light">
          Contattaci subito
        </p>

        <div className="flex flex-row items-center justify-center gap-4">
          {/* WhatsApp */}
          <a
            href="https://wa.me/393444585177?text=Ciao! Vorrei informazioni sui vostri tour a Sharm El Sheikh"
            target="_blank"
            rel="noopener noreferrer"
            className="w-14 h-14 rounded-full bg-green-500 hover:bg-green-600 text-white flex items-center justify-center shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-110"
            aria-label="WhatsApp"
          >
            <MessageCircle className="h-7 w-7" />
          </a>

          {/* Facebook */}
          <a
            href="https://www.facebook.com/siviaggiacondesi/"
            target="_blank"
            rel="noopener noreferrer"
            className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white flex items-center justify-center shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-110"
            aria-label="Facebook"
          >
            <Facebook className="h-7 w-7" />
          </a>

          {/* Instagram */}
          <a
            href="https://www.instagram.com/siviaggiacondesi/"
            target="_blank"
            rel="noopener noreferrer"
            className="w-14 h-14 rounded-full bg-gradient-to-br from-pink-600 via-purple-600 to-orange-500 hover:from-pink-700 hover:via-purple-700 hover:to-orange-600 text-white flex items-center justify-center shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-110"
            aria-label="Instagram"
          >
            <Instagram className="h-7 w-7" />
          </a>
        </div>
      </div>
    </section>
  );
}
