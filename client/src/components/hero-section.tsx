import logoAgenziaUrl from "@assets/logo_rosso-removebg-preview_1754493166038.png";
import beachBackgroundUrl from "@assets/b51hm1au1uy21_1755098522270.webp";

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-slate-900">
      {/* Full-width Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('${beachBackgroundUrl}')`,
        }}
      />
      
      {/* No overlay - let the beautiful beach show through */}
      
      <div className="relative z-10 text-center w-full px-0">
        {/* Full-width Hero Container with less opacity to show beach */}
        <div className="bg-slate-800/60 backdrop-blur-sm border-y border-slate-700/50 py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Logo principale rimosso */}
            
            {/* Main Title - Bold and Impactful */}
            <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white leading-none mb-8 tracking-tight">
              VIAGGIA
              <span className="block text-blue-400 mt-2">
                SENZA LIMITI
              </span>
            </h2>
            
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