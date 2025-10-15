import { Home, MapPin, Phone, Mail, Clock, Facebook, Instagram, Linkedin } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-2">
            <div className="text-2xl font-bold mb-2 flex items-center text-white">
              <Home className="mr-2 h-6 w-6 text-primary" />
              Si viaggia con Desi
            </div>
            <p className="text-gray-400 mb-4 text-sm italic">
              Escursioni a Sharm
            </p>
            <p className="text-gray-300 mb-2 max-w-md">
              <span className="text-white font-medium">Il Tuo Tour Operator</span>
            </p>
            <p className="text-gray-300 mb-6 max-w-md">
              Il tuo tour operator di fiducia specializzato in Sharm El Sheikh. Esperienza, professionalità e passione 
              per farti vivere esperienze indimenticabili nel Mar Rosso.
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
              <li><a href="/servizi" className="hover:text-primary transition-colors">Consulenza Viaggi</a></li>
              <li><a href="/servizi" className="hover:text-primary transition-colors">Pacchetti Personalizzati</a></li>
              <li><a href="/servizi" className="hover:text-primary transition-colors">Prenotazioni</a></li>
              <li><a href="/servizi" className="hover:text-primary transition-colors">Assistenza Documenti</a></li>
              <li><a href="/servizi" className="hover:text-primary transition-colors">Assicurazioni Viaggio</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4 text-white">Contatti</h4>
            <ul className="space-y-2 text-gray-300">
              <li className="flex items-center">
                <MapPin className="mr-2 h-4 w-4 text-primary" />
                Via Roma, 123 - 20121 Milano (MI)
              </li>
              <li className="flex items-center">
                <Phone className="mr-2 h-4 w-4 text-primary" />
                +39 02 1234567
              </li>
              <li className="flex items-center">
                <Mail className="mr-2 h-4 w-4 text-primary" />
                info@unconventionaltour.it
              </li>
              <li className="flex items-center">
                <Mail className="mr-2 h-4 w-4 text-primary" />
                viaggi@unconventionaltour.it
              </li>

              <li className="flex items-center">
                <Clock className="mr-2 h-4 w-4 text-primary" />
                Lun-Ven 9:00-19:00
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
          <div className="flex flex-col space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-center space-y-2 sm:space-y-0">
              <div className="text-sm">
                <p className="font-medium text-gray-300 mb-1">Si viaggia con Desi - Escursioni a Sharm</p>
                <p className="mb-1">Tour Operator Sharm El Sheikh</p>
                <p>SHARM EL SHEIKH – Egitto</p>
                <p>info@siviaggiacondesi.com</p>
              </div>
              <div className="flex space-x-4 text-sm">
                <a href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</a>
                <span>•</span>
                <a href="/privacy#cookie" className="hover:text-primary transition-colors">Cookie Policy</a>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row justify-between items-center space-y-2 sm:space-y-0 text-xs border-t border-gray-800 pt-4">
              <p>&copy; 2025 Si viaggia con Desi - Tour Operator. Tutti i diritti riservati.</p>
              <p>
                Realizzato da{" "}
                <a 
                  href="https://webproitalia.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary hover:text-primary-dark transition-colors font-medium"
                >
                  WEBPROITALIA
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
