import logoAgenziaUrl from "@assets/Immagine_2025-08-06_182718-removebg-preview_1754497683531.png";

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-32 pb-20 md:pt-0 md:pb-0">
      {/* Elegant Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1488646953014-85cb44e25828?ixlib=rb-4.0.3&auto=format&fit=crop&w=2400&h=1600')", // Aereo su sfondo azzurro
          backgroundAttachment: "scroll" // Evita problemi su mobile
        }}
      />
      
      {/* Travel Overlay - gradiente mare-sole */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/75 via-blue-600/65 to-orange-400/55"></div>
      
      <div className="relative z-10 text-center max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 animate-fade-in w-full">
        {/* Clean Modern Container */}
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 sm:p-8 lg:p-12 shadow-xl border max-w-4xl mx-auto">
          {/* Logo principale */}
          <div className="mb-3">
            <img 
              src={logoAgenziaUrl} 
              alt="Propato Travel - La tua Agenzia Viaggi" 
              className="h-28 sm:h-36 md:h-40 lg:h-48 w-auto mx-auto object-contain"
              style={{ 
                clipPath: 'inset(0 2px 0 0)',
                filter: 'drop-shadow(0 0 0 transparent)'
              }}
            />
          </div>
          
          {/* Sottotitolo al logo - più vicino al logo */}
          <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-light text-slate-700 leading-tight px-2">
            🌍 Scopri il mondo con noi! Viaggi indimenticabili per ogni destinazione ✈️
          </h1>
        </div>
      </div>
    </section>
  );
}