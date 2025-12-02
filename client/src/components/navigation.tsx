import { Link } from "wouter";
import { Menu, X, ShoppingCart } from "lucide-react";
import { useState } from "react";
import logoUrl from "@assets/si_viaggia_con_desy_logo-removebg-preview_1761318900270.png";
import { useCart } from "@/contexts/cart-context";

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const { getItemCount } = useCart();
  const itemCount = getItemCount();

  return (
    <nav className="fixed top-0 lg:top-[52px] left-0 right-0 z-50 bg-gradient-to-r from-[#1e3a5f]/80 to-[#2c3e50]/80 backdrop-blur-lg border-b border-[#D4AF37]/20 shadow-sm">
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
          <div className="flex items-center space-x-8">
            <Link href="/" className="text-white hover:text-[#D4AF37] font-medium text-lg tracking-wide transition-all duration-300 relative group">
              Home
              <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-[#D4AF37] group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link href="/chi-siamo" className="text-white hover:text-[#D4AF37] font-medium text-lg tracking-wide transition-all duration-300 relative group">
              Chi Siamo
              <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-[#D4AF37] group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link href="/viaggi" className="text-white hover:text-[#D4AF37] font-medium text-lg tracking-wide transition-all duration-300 relative group">
              Escursioni
              <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-[#D4AF37] group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link href="/galleria" className="text-white hover:text-[#D4AF37] font-medium text-lg tracking-wide transition-all duration-300 relative group">
              Galleria
              <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-[#D4AF37] group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link href="/contatti" className="text-white hover:text-[#D4AF37] font-medium text-lg tracking-wide transition-all duration-300 relative group">
              Contatti
              <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-[#D4AF37] group-hover:w-full transition-all duration-300"></span>
            </Link>
            {/* Carrello */}
            <Link href="/carrello" className="relative text-white hover:text-[#D4AF37] transition-all duration-300 p-2" data-testid="nav-cart">
              <ShoppingCart className="h-6 w-6" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#D4AF37] text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Link>
            {/* Pulsante Admin nascosto trasparente */}
            <Link 
              href="/admin" 
              className="w-12 h-12 rounded-lg bg-transparent hover:bg-white/10 hover:shadow-md transition-all duration-300 flex items-center justify-center opacity-0 hover:opacity-100"
              title="Admin Panel"
            >
              <span className="text-xs font-bold text-white/60 hover:text-white">⚙️</span>
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

          <div className="flex items-center gap-2">
            {/* Carrello Mobile */}
            <Link href="/carrello" className="relative text-white hover:text-[#D4AF37] transition-all duration-300 p-2" data-testid="nav-cart-mobile">
              <ShoppingCart className="h-6 w-6" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#D4AF37] text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Link>
            {/* Hamburger Menu */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-xl text-white hover:text-[#D4AF37] focus:outline-none transition-all duration-300"
            >
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isOpen && (
          <div className="lg:hidden bg-[#1e3a5f]/90 backdrop-blur-lg mt-4 rounded-3xl overflow-hidden animate-slide-up border border-[#D4AF37]/20 shadow-lg">
            <div className="p-6 space-y-4">
              <Link href="/" className="block px-4 py-3 text-white hover:text-[#D4AF37] font-medium text-lg hover:bg-white/10 rounded-xl transition-all duration-200">
                Home
              </Link>
              <Link href="/chi-siamo" className="block px-4 py-3 text-white hover:text-[#D4AF37] font-medium text-lg hover:bg-white/10 rounded-xl transition-all duration-200">
                Chi Siamo
              </Link>
              <Link href="/viaggi" className="block px-4 py-3 text-white hover:text-[#D4AF37] font-medium text-lg hover:bg-white/10 rounded-xl transition-all duration-200">
                Escursioni
              </Link>
              <Link href="/galleria" className="block px-4 py-3 text-white hover:text-[#D4AF37] font-medium text-lg hover:bg-white/10 rounded-xl transition-all duration-200">
                Galleria
              </Link>
              <Link href="/contatti" className="block px-4 py-3 text-white hover:text-[#D4AF37] font-medium text-lg hover:bg-white/10 rounded-xl transition-all duration-200">
                Contatti
              </Link>
              <a 
                href="https://wa.me/393444585177?text=Ciao! Vorrei informazioni sui vostri tour a Sharm El Sheikh"
                target="_blank"
                rel="noopener noreferrer"
                className="block bg-green-500 hover:bg-green-600 text-white px-6 py-4 rounded-2xl font-medium text-center text-lg mt-6 transition-colors shadow-md"
              >
                💬 Contatto su WhatsApp
              </a>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}