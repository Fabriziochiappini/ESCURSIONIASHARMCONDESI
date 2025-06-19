import { PropertySearch } from "./property-search";
import { ChevronDown } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Modern Background with Parallax Effect */}
      <div className="absolute inset-0 hero-gradient"></div>
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-110 animate-pulse"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2400&h=1600')"
        }}
      />
      
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-20 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-indigo-500/5 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>
      
      <div className="relative z-10 text-center text-white max-w-6xl mx-auto px-4 animate-slide-up">
        <div className="mb-8">
          <h1 className="text-6xl md:text-8xl font-extrabold mb-6 leading-tight bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent">
            Trova la Casa
            <span className="block text-5xl md:text-7xl font-light mt-2 bg-gradient-to-r from-purple-200 to-blue-200 bg-clip-text text-transparent">
              dei Tuoi Sogni
            </span>
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-purple-500 to-blue-500 mx-auto mb-8 rounded-full"></div>
        </div>
        
        <p className="text-xl md:text-2xl mb-16 text-gray-100 max-w-3xl mx-auto leading-relaxed font-light">
          Scopri le proprietà più esclusive di <strong>Acireale</strong> e dintorni. 
          La tua nuova vita inizia qui, nel cuore della Sicilia.
        </p>
        
        <div className="glass-card rounded-3xl p-8 max-w-5xl mx-auto mb-12">
          <PropertySearch />
        </div>
        
        <div className="flex justify-center items-center space-x-8 text-sm text-gray-300">
          <span className="flex items-center">
            <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
            20+ Proprietà Disponibili
          </span>
          <span className="flex items-center">
            <div className="w-2 h-2 bg-blue-400 rounded-full mr-2 animate-pulse"></div>
            Tour Virtuali 360°
          </span>
          <span className="flex items-center">
            <div className="w-2 h-2 bg-purple-400 rounded-full mr-2 animate-pulse"></div>
            Consulenza Gratuita
          </span>
        </div>
      </div>
      
      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white/70 rounded-full mt-2 animate-pulse"></div>
        </div>
        <ChevronDown className="w-6 h-6 text-white/70 mx-auto mt-2" />
      </div>
    </section>
  );
}
