import { Home, MapPin, Phone, Mail, Clock, Facebook, Instagram, Linkedin } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-2">
            <div className="text-2xl font-bold mb-4 flex items-center">
              <Home className="mr-2 h-6 w-6" />
              Immobiliare Acireale
            </div>
            <p className="text-gray-300 mb-6 max-w-md">
              La tua agenzia immobiliare di fiducia ad Acireale. Esperienza, professionalità e dedizione 
              per aiutarti a trovare la casa dei tuoi sogni.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-white text-xl transition-colors">
                <Facebook className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-300 hover:text-white text-xl transition-colors">
                <Instagram className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-300 hover:text-white text-xl transition-colors">
                <Linkedin className="h-6 w-6" />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Servizi</h4>
            <ul className="space-y-2 text-gray-300">
              <li><a href="#" className="hover:text-white transition-colors">Vendite</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Affitti</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Case Vacanza</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Valutazioni</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Consulenze</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Contatti</h4>
            <ul className="space-y-2 text-gray-300">
              <li className="flex items-center">
                <MapPin className="mr-2 h-4 w-4" />
                Via Vittorio Emanuele 45, Acireale
              </li>
              <li className="flex items-center">
                <Phone className="mr-2 h-4 w-4" />
                +39 095 123 4567
              </li>
              <li className="flex items-center">
                <Mail className="mr-2 h-4 w-4" />
                info@immobiliareacireale.it
              </li>
              <li className="flex items-center">
                <Clock className="mr-2 h-4 w-4" />
                Lun-Ven 9:00-19:00
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
          <p>&copy; 2024 Immobiliare Acireale. Tutti i diritti riservati.</p>
        </div>
      </div>
    </footer>
  );
}
