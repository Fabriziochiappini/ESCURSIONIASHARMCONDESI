import logoAgenziaUrl from "@assets/Immagine_2025-08-06_182718-removebg-preview_1754497683531.png";

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-slate-900">
      {/* Full-width Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2400&h=1600')",
        }}
      />
      
      {/* Strong Dark Overlay */}
      <div className="absolute inset-0 bg-slate-900/80"></div>
      
      <div className="relative z-10 text-center w-full px-0">
        {/* Full-width Hero Container */}
        <div className="bg-slate-800/90 backdrop-blur-md border-y border-slate-700 py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Logo principale */}
            <div className="mb-8">
              <img 
                src={logoAgenziaUrl} 
                alt="Propato Travel - La tua Agenzia Viaggi" 
                className="h-32 sm:h-40 md:h-48 lg:h-56 w-auto mx-auto object-contain filter brightness-0 invert"
              />
            </div>
            
            {/* Main Title - Bold and Impactful */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white leading-none mb-8 tracking-tight">
              VIAGGIA
              <span className="block text-blue-400 mt-2">
                SENZA LIMITI
              </span>
            </h1>
            
            {/* Accent Line */}
            <div className="w-40 h-2 bg-blue-500 mx-auto mb-8"></div>
            
            {/* Description */}
            <p className="text-xl sm:text-2xl text-slate-300 max-w-4xl mx-auto leading-relaxed font-light mb-12">
              Dalla magia delle Maldive alle vette delle Dolomiti, dalle città d'arte europee ai safari africani. 
              Ogni viaggio è un'esperienza unica pensata per te.
            </p>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-0 max-w-4xl mx-auto mb-12">
              <div className="bg-slate-700/50 border border-slate-600 p-8">
                <div className="text-4xl font-black text-blue-400 mb-2">50+</div>
                <div className="text-slate-300 font-bold uppercase tracking-wide text-sm">Destinazioni</div>
              </div>
              <div className="bg-slate-700/50 border border-slate-600 p-8">
                <div className="text-4xl font-black text-blue-400 mb-2">1K+</div>
                <div className="text-slate-300 font-bold uppercase tracking-wide text-sm">Viaggiatori</div>
              </div>
              <div className="bg-slate-700/50 border border-slate-600 p-8">
                <div className="text-4xl font-black text-blue-400 mb-2">15</div>
                <div className="text-slate-300 font-bold uppercase tracking-wide text-sm">Anni</div>
              </div>
              <div className="bg-slate-700/50 border border-slate-600 p-8">
                <div className="text-4xl font-black text-blue-400 mb-2">24/7</div>
                <div className="text-slate-300 font-bold uppercase tracking-wide text-sm">Supporto</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}