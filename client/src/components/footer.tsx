import { Home, MapPin, Phone, Mail, Clock } from "lucide-react";
import { SocialButtons } from "@/components/social-buttons";

export function Footer() {
  return (
    <footer className="bg-gradient-to-br from-white to-[#A8CFEB]/5 border-t border-[#D4AF37]/20 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-2">
            <div className="text-2xl font-light mb-2 flex items-center text-gray-600 tracking-wide">
              <Home className="mr-2 h-6 w-6 text-[#A8CFEB]" />
              Si viaggia con Desi
            </div>
            <p className="text-gray-400 mb-4 text-sm font-light italic">
              Escursioni a Sharm
            </p>
            <p className="text-gray-500 mb-2 max-w-md font-light">
              <span className="text-gray-600 font-normal">Il Tuo Tour Operator</span>
            </p>
            <p className="text-gray-400 mb-6 max-w-md font-light leading-relaxed">
              Il tuo tour operator di fiducia specializzato in Sharm El Sheikh. Esperienza, professionalità e passione 
              per farti vivere esperienze indimenticabili nel Mar Rosso.
            </p>
            <SocialButtons variant="large" />
          </div>
          
          <div>
            <h4 className="font-normal mb-4 text-gray-600 tracking-wide">Escursioni</h4>
            <ul className="space-y-2 text-gray-400 font-light">
              <li><a href="/tour" className="hover:text-[#A8CFEB] transition-colors">Tour Mar Rosso</a></li>
              <li><a href="/tour" className="hover:text-[#A8CFEB] transition-colors">Safari nel Deserto</a></li>
              <li><a href="/tour" className="hover:text-[#A8CFEB] transition-colors">Snorkeling & Diving</a></li>
              <li><a href="/tour" className="hover:text-[#A8CFEB] transition-colors">Escursioni Culturali</a></li>
              <li><a href="/tour" className="hover:text-[#A8CFEB] transition-colors">Tour Personalizzati</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-normal mb-4 text-gray-600 tracking-wide">Contatti</h4>
            <ul className="space-y-2 text-gray-400 font-light">
              <li className="flex items-center">
                <MapPin className="mr-2 h-4 w-4 text-[#D4AF37]" />
                Via Venezia 7 C - 37050 Oppeano (VR)
              </li>
              <li className="flex items-center">
                <Phone className="mr-2 h-4 w-4 text-[#D4AF37]" />
                +39 344 458 5177
              </li>
              <li className="flex items-center">
                <Mail className="mr-2 h-4 w-4 text-[#D4AF37]" />
                richieste@viaggiacondesi.com
              </li>

              <li className="flex items-center">
                <Clock className="mr-2 h-4 w-4 text-[#D4AF37]" />
                Lun-Ven 9:00-19:00
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-[#D4AF37]/20 mt-12 pt-8 text-center text-gray-400">
          <div className="flex flex-col space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
              <div className="flex items-center gap-4">
                <img 
                  src="/logo.png" 
                  alt="Si Viaggia con Desi - Logo" 
                  className="h-16 w-auto"
                />
                <div className="text-sm font-light text-left">
                  <p className="font-normal text-gray-500 mb-1">Si viaggia con Desi - Escursioni a Sharm</p>
                  <p className="mb-1">Tour Operator Sharm El Sheikh</p>
                  <p>SHARM EL SHEIKH – Egitto</p>
                  <p>richieste@viaggiacondesi.com</p>
                  <p className="text-xs text-gray-400 mt-2 italic">Marchio registrato</p>
                </div>
              </div>
              <div className="flex space-x-4 text-sm font-light">
                <a href="/privacy" className="hover:text-[#A8CFEB] transition-colors">Privacy Policy</a>
                <span>•</span>
                <a href="/privacy#cookie" className="hover:text-[#A8CFEB] transition-colors">Cookie Policy</a>
                <span>•</span>
                <a href="/termini" className="hover:text-[#A8CFEB] transition-colors">Termini e Condizioni</a>
              </div>
            </div>
            <div className="flex justify-center items-center text-xs border-t border-[#D4AF37]/20 pt-4 font-light">
              <p>&copy; 2025 Si viaggia con Desi - Tour Operator. Tutti i diritti riservati.</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
