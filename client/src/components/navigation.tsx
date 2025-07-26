import { Link } from "wouter";
import { Menu, X, ChevronDown, Home } from "lucide-react";
import { useState } from "react";

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass backdrop-blur-xl">
      <div className="max-w-[1920px] mx-auto px-6 lg:px-12">
        <div className="flex justify-between items-center h-24">
          <Link href="/" className="flex items-center space-x-4 group">
            <div className="relative">
              <Home className="h-16 w-16 text-primary group-hover:scale-110 transition-all duration-300 filter drop-shadow-lg" />
              <div className="absolute inset-0 rounded-full neon-glow opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            <div className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              AGENZIA 2
            </div>
          </Link>

          <div className="hidden lg:flex items-center space-x-12">
            <Link href="/" className="text-foreground/90 hover:text-primary font-semibold text-lg transition-all duration-300 hover:scale-105 relative group">
              Home
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-primary to-secondary group-hover:w-full transition-all duration-300"></span>
            </Link>
            <div className="relative group">
              <button className="text-foreground/90 hover:text-primary font-semibold text-lg transition-all duration-300 hover:scale-105 flex items-center space-x-2">
                <span>Proprietà</span>
                <ChevronDown className="h-4 w-4 group-hover:rotate-180 transition-transform duration-300" />
              </button>
              <div className="absolute top-full left-0 mt-2 w-64 glass-card rounded-2xl p-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                <Link href="/properties" className="block px-4 py-3 text-foreground/80 hover:text-primary hover:bg-white/5 rounded-xl transition-all duration-200">
                  Tutte le Proprietà
                </Link>
                <Link href="/properties?type=vendita" className="block px-4 py-3 text-foreground/80 hover:text-primary hover:bg-white/5 rounded-xl transition-all duration-200">
                  In Vendita
                </Link>
                <Link href="/properties?type=affitto" className="block px-4 py-3 text-foreground/80 hover:text-primary hover:bg-white/5 rounded-xl transition-all duration-200">
                  In Affitto
                </Link>
                <Link href="/properties?type=casa_vacanza" className="block px-4 py-3 text-foreground/80 hover:text-primary hover:bg-white/5 rounded-xl transition-all duration-200">
                  Case Vacanza
                </Link>
              </div>
            </div>
            <Link href="/chi-siamo" className="text-foreground/90 hover:text-primary font-semibold text-lg transition-all duration-300 hover:scale-105 relative group">
              Chi Siamo
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-primary to-secondary group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link href="/admin" className="text-foreground/90 hover:text-primary font-semibold text-lg transition-all duration-300 hover:scale-105 relative group">
              Admin
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-primary to-secondary group-hover:w-full transition-all duration-300"></span>
            </Link>
            <a 
              href="tel:+393468003234" 
              className="gradient-primary text-white px-8 py-4 rounded-2xl font-bold text-lg hover:scale-105 transition-all duration-300 neon-glow shadow-2xl"
            >
              📞 346 800 3234
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
              <Link href="/properties" className="block px-4 py-3 text-foreground/90 hover:text-primary font-semibold text-lg hover:bg-white/5 rounded-xl transition-all duration-200">
                Proprietà
              </Link>
              <Link href="/chi-siamo" className="block px-4 py-3 text-foreground/90 hover:text-primary font-semibold text-lg hover:bg-white/5 rounded-xl transition-all duration-200">
                Chi Siamo
              </Link>
              <Link href="/admin" className="block px-4 py-3 text-foreground/90 hover:text-primary font-semibold text-lg hover:bg-white/5 rounded-xl transition-all duration-200">
                Admin
              </Link>
              <a 
                href="tel:+393468003234" 
                className="block gradient-primary text-white px-6 py-4 rounded-2xl font-bold text-center text-lg mt-6"
              >
                📞 346 800 3234
              </a>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}