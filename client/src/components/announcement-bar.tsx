import { Mail, MessageCircle, Facebook, Instagram } from "lucide-react";

export function AnnouncementBar() {
  return (
    <div className="bg-gradient-to-r from-[#1e3a5f] to-[#2c3e50] text-white py-3 border-b border-[#D4AF37]/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Testo a sinistra */}
          <div className="text-sm md:text-base font-light tracking-wide">
            ✨ Divertimento assicurato con le nostre escursioni
          </div>

          {/* Contatti a destra */}
          <div className="flex items-center gap-3">
            {/* Email */}
            <a
              href="mailto:siviaggiacondesi@gmail.com"
              className="text-white/80 hover:text-white transition-colors text-sm flex items-center gap-1"
              title="Email"
            >
              <Mail className="h-4 w-4" />
              <span className="hidden md:inline">siviaggiacondesi@gmail.com</span>
            </a>

            {/* Separatore */}
            <div className="w-[1px] h-5 bg-white/20"></div>

            {/* WhatsApp */}
            <a
              href="https://wa.me/393444585177?text=Ciao! Vorrei informazioni sui vostri tour a Sharm El Sheikh"
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 rounded-full bg-green-500 hover:bg-green-600 flex items-center justify-center transition-all duration-300 transform hover:scale-110"
              title="WhatsApp"
            >
              <MessageCircle className="h-4 w-4 text-white" />
            </a>

            {/* Facebook */}
            <a
              href="#"
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 rounded-full bg-blue-600 hover:bg-blue-700 flex items-center justify-center transition-all duration-300 transform hover:scale-110"
              title="Facebook"
            >
              <Facebook className="h-4 w-4 text-white" />
            </a>

            {/* Instagram */}
            <a
              href="#"
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-500 via-purple-500 to-orange-400 hover:from-pink-600 hover:via-purple-600 hover:to-orange-500 flex items-center justify-center transition-all duration-300 transform hover:scale-110"
              title="Instagram"
            >
              <Instagram className="h-4 w-4 text-white" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
