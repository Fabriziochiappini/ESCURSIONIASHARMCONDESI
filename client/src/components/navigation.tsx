import { Link } from "wouter";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import logoAgenziaUrl from "@assets/logo_rosso-removebg-preview_1754493166038.png";

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-28">
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="relative">
              <div className="text-2xl font-black text-primary group-hover:scale-110 transition-all duration-300">
                PROPATO<span className="text-blue-500">TRAVEL</span>
              </div>
            </div>
          </Link>

          <div className="hidden lg:flex items-center space-x-8">
            <Link href="/" className="text-gray-700 hover:text-primary font-medium transition-all duration-300 relative group">
              Home
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link href="/viaggi" className="text-gray-700 hover:text-primary font-medium transition-all duration-300 relative group">
              Viaggi
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
            <Link href="/admin" className="text-gray-700 hover:text-primary font-medium transition-all duration-300 relative group">
              Admin
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300"></span>
            </Link>
            <a 
              href="tel:+393479123456" 
              className="bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              ✈️ 347 912 3456
            </a>
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
              <Link href="/servizi" className="block px-4 py-3 text-foreground/90 hover:text-primary font-semibold text-lg hover:bg-white/5 rounded-xl transition-all duration-200">
                Servizi
              </Link>
              <Link href="/chi-siamo" className="block px-4 py-3 text-foreground/90 hover:text-primary font-semibold text-lg hover:bg-white/5 rounded-xl transition-all duration-200">
                Chi Siamo
              </Link>
              <Link href="/admin" className="block px-4 py-3 text-foreground/90 hover:text-primary font-semibold text-lg hover:bg-white/5 rounded-xl transition-all duration-200">
                Admin
              </Link>
              <a 
                href="tel:+393479123456" 
                className="block gradient-primary text-white px-6 py-4 rounded-2xl font-bold text-center text-lg mt-6"
              >
                ✈️ 347 912 3456
              </a>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}