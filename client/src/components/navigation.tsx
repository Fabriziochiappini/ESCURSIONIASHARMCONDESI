import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Home, Menu, X } from "lucide-react";
import { useState } from "react";

export function Navigation() {
  const [location] = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/#properties", label: "Proprietà" },
    { href: "/servizi", label: "Servizi" },
    { href: "/news", label: "News" },
    { href: "/chi-siamo", label: "Chi Siamo" },
    { href: "/contatti", label: "Contatti" }
  ];

  return (
    <nav className="fixed top-0 w-full glass-nav z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link href="/" className="flex items-center group">
            <div className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              <Home className="inline mr-3 h-7 w-7 text-purple-600 group-hover:scale-110 transition-transform" />
              Immobiliare Acireale
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link 
                key={link.href}
                href={link.href}
                className="relative text-gray-700 hover:text-purple-600 transition-colors font-medium group"
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-600 to-blue-600 group-hover:w-full transition-all duration-300"></span>
              </Link>
            ))}
            <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold px-6 py-2 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              Valuta la tua Casa
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-full hover:bg-purple-50"
            >
              {isMenuOpen ? <X className="h-6 w-6 text-purple-600" /> : <Menu className="h-6 w-6 text-purple-600" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-4 space-y-1 sm:px-3 glass-card rounded-b-2xl mx-4 mb-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block px-4 py-3 text-gray-700 hover:text-purple-600 hover:bg-purple-50 rounded-xl transition-all"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <div className="px-4 pt-4">
                <Button className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-3 rounded-xl">
                  Valuta la tua Casa
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
