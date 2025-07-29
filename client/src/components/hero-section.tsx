import logoAgenziaUrl from "@assets/logo_agenzia_22-removebg-preview_1753804298069.png";

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-32 pb-20 md:pt-0 md:pb-0">
      {/* Elegant Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&auto=format&fit=crop&w=2400&h=1600')",
          backgroundAttachment: "scroll" // Evita problemi su mobile
        }}
      />
      
      {/* Elegant Overlay - blu scuro più moderno */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900/85 via-slate-800/75 to-slate-700/65"></div>
      
      <div className="relative z-10 text-center max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 animate-fade-in w-full">
        {/* Clean Modern Container */}
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 sm:p-8 lg:p-12 shadow-xl border max-w-4xl mx-auto">
          {/* Logo principale */}
          <div className="mb-3">
            <img 
              src={logoAgenziaUrl} 
              alt="AGENZIA 2 Servizi Immobiliari" 
              className="h-28 sm:h-36 md:h-40 lg:h-48 w-auto mx-auto object-contain"
            />
          </div>
          
          {/* Sottotitolo al logo - più vicino al logo */}
          <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-light text-slate-700 leading-tight px-2">
            Ti aiutiamo con le tue pratiche immobiliari!
          </h1>
        </div>
      </div>
    </section>
  );
}