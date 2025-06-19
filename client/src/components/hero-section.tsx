import { PropertySearch } from "./property-search";

export function HeroSection() {
  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-black/30"></div>
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080')"
        }}
      />
      
      <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4">
        <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
          Trova la Casa dei Tuoi Sogni
          <span className="block text-3xl md:text-4xl font-normal mt-2 text-blue-200">
            ad Acireale
          </span>
        </h1>
        <p className="text-xl md:text-2xl mb-12 text-gray-200 max-w-2xl mx-auto">
          La tua agenzia immobiliare di fiducia per acquisti, affitti e case vacanza nella splendida Acireale e dintorni.
        </p>
        
        <PropertySearch />
      </div>
    </section>
  );
}
