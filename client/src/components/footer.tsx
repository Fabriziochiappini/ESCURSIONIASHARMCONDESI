import { Home, MapPin, Phone, Mail, Clock, Facebook, Instagram, Linkedin } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-2">
            <div className="text-2xl font-bold mb-4 flex items-center text-white">
              <Home className="mr-2 h-6 w-6 text-primary" />
              AGENZIA 2 Servizi Immobiliari
            </div>
            <p className="text-gray-300 mb-2 max-w-md">
              <span className="text-primary font-medium">Geometra Antonio Cannavò</span>
            </p>
            <p className="text-gray-300 mb-6 max-w-md">
              La tua agenzia immobiliare di fiducia ad Acireale. Esperienza, professionalità e competenza tecnica 
              per ogni esigenza immobiliare.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-primary text-xl transition-colors bg-gray-800 p-3 rounded-lg">
                <Facebook className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-300 hover:text-primary text-xl transition-colors bg-gray-800 p-3 rounded-lg">
                <Instagram className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-300 hover:text-primary text-xl transition-colors bg-gray-800 p-3 rounded-lg">
                <Linkedin className="h-6 w-6" />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4 text-white">Servizi</h4>
            <ul className="space-y-2 text-gray-300">
              <li><a href="/servizi" className="hover:text-primary transition-colors">Perizie Immobiliari</a></li>
              <li><a href="/servizi" className="hover:text-primary transition-colors">Servizi Legali</a></li>
              <li><a href="/servizi" className="hover:text-primary transition-colors">Compravendita</a></li>
              <li><a href="/servizi" className="hover:text-primary transition-colors">Mutui Agevolati</a></li>
              <li><a href="/servizi" className="hover:text-primary transition-colors">A.P.E. Certificazioni</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4 text-white">Contatti</h4>
            <ul className="space-y-2 text-gray-300">
              <li className="flex items-center">
                <MapPin className="mr-2 h-4 w-4 text-primary" />
                Via San Girolamo, 20 - 95024 ACIREALE (CT)
              </li>
              <li className="flex items-center">
                <Phone className="mr-2 h-4 w-4 text-primary" />
                346 800 3234
              </li>
              <li className="flex items-center">
                <Mail className="mr-2 h-4 w-4 text-primary" />
                agenzia2acireale@virgilio.it
              </li>
              <li className="flex items-center">
                <Clock className="mr-2 h-4 w-4 text-primary" />
                Lun-Ven 9:00-19:00, Sab 9:00-13:00
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
          <p>&copy; 2024 AGENZIA 2 Servizi Immobiliari - Geometra Antonio Cannavò. Tutti i diritti riservati.</p>
        </div>
      </div>
    </footer>
  );
}
