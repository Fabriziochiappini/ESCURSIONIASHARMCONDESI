import { Home, MapPin, Phone, Mail, Clock, Facebook, Instagram, Linkedin } from "lucide-react";

export function Footer() {
  return (
    <footer className="relative py-24 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/30 via-transparent to-secondary/30"></div>
      </div>
      
      <div className="relative z-10 max-w-[1920px] mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-2">
            <div className="text-3xl font-bold mb-6 flex items-center">
              <Home className="mr-4 h-8 w-8 text-primary" />
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                AGENZIA 2 Servizi Immobiliari
              </span>
            </div>
            <p className="text-foreground/90 mb-4 max-w-md text-lg">
              <span className="text-accent font-bold">Geometra Antonio Cannavò</span>
            </p>
            <p className="text-foreground/80 mb-8 max-w-md text-lg leading-relaxed">
              La tua agenzia immobiliare di fiducia ad Acireale. Esperienza, professionalità e competenza tecnica 
              per ogni esigenza immobiliare.
            </p>
            <div className="flex space-x-6">
              <a href="#" className="glass-card p-4 rounded-2xl text-primary hover:scale-110 transition-all duration-300 hover:text-primary">
                <Facebook className="h-8 w-8" />
              </a>
              <a href="#" className="glass-card p-4 rounded-2xl text-secondary hover:scale-110 transition-all duration-300 hover:text-secondary">
                <Instagram className="h-8 w-8" />
              </a>
              <a href="#" className="glass-card p-4 rounded-2xl text-accent hover:scale-110 transition-all duration-300 hover:text-accent">
                <Linkedin className="h-8 w-8" />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="font-bold mb-6 text-2xl text-primary">Servizi</h4>
            <ul className="space-y-4 text-foreground/80 text-lg">
              <li><a href="/servizi" className="hover:text-accent transition-colors hover:scale-105 inline-block">Perizie Immobiliari</a></li>
              <li><a href="/servizi" className="hover:text-accent transition-colors hover:scale-105 inline-block">Servizi Legali</a></li>
              <li><a href="/servizi" className="hover:text-accent transition-colors hover:scale-105 inline-block">Compravendita</a></li>
              <li><a href="/servizi" className="hover:text-accent transition-colors hover:scale-105 inline-block">Mutui Agevolati</a></li>
              <li><a href="/servizi" className="hover:text-accent transition-colors hover:scale-105 inline-block">A.P.E. Certificazioni</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold mb-6 text-2xl text-secondary">Contatti</h4>
            <ul className="space-y-4 text-foreground/80 text-lg">
              <li className="flex items-center hover:scale-105 transition-all duration-300">
                <MapPin className="mr-4 h-6 w-6 text-primary" />
                Via San Girolamo, 20 - 95024 ACIREALE (CT)
              </li>
              <li className="flex items-center hover:scale-105 transition-all duration-300">
                <Phone className="mr-4 h-6 w-6 text-secondary" />
                346 800 3234
              </li>
              <li className="flex items-center hover:scale-105 transition-all duration-300">
                <Mail className="mr-4 h-6 w-6 text-accent" />
                agenzia2acireale@virgilio.it
              </li>
              <li className="flex items-center hover:scale-105 transition-all duration-300">
                <Clock className="mr-4 h-6 w-6 text-primary" />
                Lun-Ven 9:00-19:00, Sab 9:00-13:00
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-foreground/20 mt-16 pt-12 text-center">
          <p className="text-foreground/60 text-lg">&copy; 2024 AGENZIA 2 Servizi Immobiliari - Geometra Antonio Cannavò. Tutti i diritti riservati.</p>
        </div>
      </div>
    </footer>
  );
}
