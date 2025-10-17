import heroBackgroundUrl from "@assets/6345959_1759560311915.jpg";

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-slate-900">
      {/* Full-width Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('${heroBackgroundUrl}')`,
        }}
      />
      
      {/* Elementi decorativi animati */}
      <div className="absolute top-10 left-10 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-20 w-80 h-80 bg-orange-500/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1.5s'}}></div>
      
      <div className="relative z-10 text-center w-full px-0">
        {/* Full-width Hero Container without overlay */}
        <div className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Logo Grande Centro */}
            <div className="mb-4 flex justify-center">
              <img 
                src="/attached_assets/escursioni_a_sharm-removebg-preview_1760717653759.png" 
                alt="Si Viaggia con Desy - Escursioni a Sharm"
                loading="eager"
                decoding="async"
                className="w-64 h-64 md:w-80 md:h-80 object-contain drop-shadow-2xl animate-fade-in"
              />
            </div>
            
            {/* Accent Line */}
            <div className="w-40 h-2 bg-blue-500 mx-auto mb-6"></div>
            
            {/* Description con riquadro elegante */}
            <div className="max-w-4xl mx-auto mb-12">
              <div className="bg-gradient-to-r from-blue-600/80 via-blue-500/80 to-cyan-500/80 backdrop-blur-sm rounded-2xl p-8 border-2 border-white/30 shadow-2xl">
                <p className="text-xl sm:text-2xl text-white leading-relaxed font-medium">
                  Dal cristallino Mar Rosso alle dune del deserto, dalle barriere coralline alle antiche meraviglie d'Egitto. 
                  Scopri Sharm El Sheikh con le nostre escursioni indimenticabili.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}