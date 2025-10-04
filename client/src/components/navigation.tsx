import { Link } from "wouter";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import logoUrl from "@assets/ChatGPT_Image_4_ott_2025__08_38_54-removebg-preview_1759559972753.png";

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-40">
          {/* Menu Sinistra */}
          <div className="hidden lg:flex items-center space-x-6">
            <Link href="/" className="text-gray-700 hover:text-primary font-medium transition-all duration-300 relative group">
              Home
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link href="/viaggi" className="text-gray-700 hover:text-primary font-medium transition-all duration-300 relative group">
              Viaggi
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link href="/galleria" className="text-gray-700 hover:text-primary font-medium transition-all duration-300 relative group">
              Galleria
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300"></span>
            </Link>
          </div>

          {/* Logo Centrato */}
          <Link href="/" className="flex items-center group absolute left-1/2 transform -translate-x-1/2">
            <img 
              src={logoUrl} 
              alt="Unconventional Tour Logo" 
              className="h-36 w-auto group-hover:scale-105 transition-all duration-300"
            />
          </Link>

          {/* Menu Destra */}
          <div className="hidden lg:flex items-center space-x-6">
            <Link href="/servizi" className="text-gray-700 hover:text-primary font-medium transition-all duration-300 relative group">
              Servizi
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link href="/chi-siamo" className="text-gray-700 hover:text-primary font-medium transition-all duration-300 relative group">
              Chi Siamo
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300"></span>
            </Link>
            <div className="flex items-center space-x-2">
              <a 
                href="tel:+390212345567" 
                className="bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                ✈️ 02 1234567
              </a>
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

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-3 rounded-xl glass-card text-foreground hover:text-primary focus:outline-none transition-all duration-300"
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
                Viaggi
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