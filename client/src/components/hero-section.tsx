import logoAgenziaUrl from "@assets/logo_agenzia_22-removebg-preview_1753804298069.png";

export function HeroSection() {
  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Elegant Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&auto=format&fit=crop&w=2400&h=1600')"
        }}
      />
      
      {/* Elegant Overlay - blu scuro più moderno */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900/85 via-slate-800/75 to-slate-700/65"></div>
      
      <div className="relative z-10 text-center max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 animate-fade-in">
        {/* Clean Modern Container */}
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-8 lg:p-12 shadow-xl border">
          {/* Logo sopra il titolo */}
          <div className="mb-8">
            <img 
              src={logoAgenziaUrl} 
              alt="AGENZIA 2 Servizi Immobiliari" 
              className="h-40 lg:h-48 w-auto mx-auto"
            />
          </div>
          
          <h1 className="text-4xl lg:text-6xl font-light mb-4 leading-tight text-slate-900">
            Trova la tua casa
          </h1>
          <div className="w-24 h-1 bg-primary mx-auto mb-6 rounded-full"></div>
          <p className="text-xl text-slate-700 leading-relaxed">
            Agenzia immobiliare Acireale e Catania
          </p>
        </div>
      </div>
    </section>
  );
}