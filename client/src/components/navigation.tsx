import { Link } from "wouter";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import logoUrl from "@assets/escursioni_a_sharm-removebg-preview_1760717653759.png";

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Desktop Navbar - Altezza ridotta */}
        <div className="hidden lg:flex lg:justify-between items-center h-24">
          {/* Logo a Sinistra */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center group">
              <img 
                src={logoUrl} 
                alt="Si Viaggia con Desy - Escursioni a Sharm" 
                className="h-20 w-auto group-hover:scale-105 transition-all duration-300"
              />
            </Link>
          </div>

          {/* Menu a Destra - Tutte le voci */}
          <div className="flex items-center space-x-6">
            <Link href="/" className="text-gray-700 hover:text-primary font-medium transition-all duration-300 relative group">
              Home
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link href="/viaggi" className="text-gray-700 hover:text-primary font-medium transition-all duration-300 relative group">
              Tour
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link href="/galleria" className="text-gray-700 hover:text-primary font-medium transition-all duration-300 relative group">
              Galleria
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link href="/servizi" className="text-gray-700 hover:text-primary font-medium transition-all duration-300 relative group">
              Servizi
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link href="/chi-siamo" className="text-gray-700 hover:text-primary font-medium transition-all duration-300 relative group">
              Chi Siamo
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link href="/contatti" className="text-gray-700 hover:text-primary font-medium transition-all duration-300 relative group">
              Contatti
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300"></span>
            </Link>
            {/* Pulsante Admin nascosto trasparente */}
            <Link 
              href="/admin" 
              className="w-12 h-12 rounded-lg bg-transparent hover:bg-gray-100 hover:shadow-md transition-all duration-300 flex items-center justify-center opacity-0 hover:opacity-100"
              title="Admin Panel"
            >
              <span className="text-xs font-bold text-gray-400 hover:text-gray-600">⚙️</span>
            </Link>
          </div>
        </div>

        {/* Mobile Navbar - Altezza ridotta */}
        <div className="lg:hidden flex justify-between items-center h-20">
          {/* Logo a Sinistra */}
          <Link href="/" className="flex items-center">
            <img 
              src={logoUrl} 
              alt="Si Viaggia con Desy - Escursioni a Sharm" 
              className="h-16 w-auto"
            />
          </Link>

          {/* Hamburger Menu a Destra */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 rounded-xl text-gray-700 hover:text-primary focus:outline-none transition-all duration-300"
          >
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Mobile menu */}
        {isOpen && (
          <div className="lg:hidden glass-card mt-4 rounded-3xl overflow-hidden animate-slide-up">
            <div className="p-6 space-y-4">
              <Link href="/" className="block px-4 py-3 text-foreground/90 hover:text-primary font-semibold text-lg hover:bg-white/5 rounded-xl transition-all duration-200">
                Home
              </Link>
              <Link href="/viaggi" className="block px-4 py-3 text-foreground/90 hover:text-primary font-semibold text-lg hover:bg-white/5 rounded-xl transition-all duration-200">
                Tour
              </Link>
              <Link href="/galleria" className="block px-4 py-3 text-foreground/90 hover:text-primary font-semibold text-lg hover:bg-white/5 rounded-xl transition-all duration-200">
                Galleria
              </Link>
              <Link href="/servizi" className="block px-4 py-3 text-foreground/90 hover:text-primary font-semibold text-lg hover:bg-white/5 rounded-xl transition-all duration-200">
                Servizi
              </Link>
              <Link href="/chi-siamo" className="block px-4 py-3 text-foreground/90 hover:text-primary font-semibold text-lg hover:bg-white/5 rounded-xl transition-all duration-200">
                Chi Siamo
              </Link>
              <Link href="/contatti" className="block px-4 py-3 text-foreground/90 hover:text-primary font-semibold text-lg hover:bg-white/5 rounded-xl transition-all duration-200">
                Contatti
              </Link>
              <a 
                href="tel:+390212345567" 
                className="block gradient-primary text-white px-6 py-4 rounded-2xl font-bold text-center text-lg mt-6"
              >
                ✈️ 02 1234567
              </a>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}