import heroBackgroundUrl from "@assets/6345959_1759560311915.jpg";
import logoUrl from "@assets/si_viaggia_con_desy_logo-removebg-preview_1761318900270.png";

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-white">
      {/* Full-width Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30"
        style={{
          backgroundImage: `url('${heroBackgroundUrl}')`,
        }}
      />
      
      {/* Elementi decorativi soft pastello */}
      <div className="absolute top-10 left-10 w-72 h-72 bg-[#A8CFEB]/30 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-[#D4AF37]/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
      
      <div className="relative z-10 text-center w-full px-0">
        {/* Full-width Hero Container */}
        <div className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Logo Grande Centro */}
            <div className="mb-4 flex justify-center">
              <img 
                src={logoUrl} 
                alt="Si Viaggia con Desy - Escursioni a Sharm"
                loading="eager"
                decoding="async"
                className="w-64 h-64 md:w-80 md:h-80 object-contain drop-shadow-2xl animate-fade-in"
              />
            </div>
            
            {/* Accent Line Oro */}
            <div className="w-48 h-[2px] bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent mx-auto mb-8"></div>
            
            {/* Description con riquadro elegante pastello */}
            <div className="max-w-4xl mx-auto mb-12">
              <div className="bg-gradient-to-r from-[#A8CFEB]/60 via-white/80 to-[#A8CFEB]/60 backdrop-blur-md rounded-3xl p-8 border border-[#D4AF37]/30 shadow-xl">
                <p className="text-xl sm:text-2xl text-gray-600 leading-relaxed font-light tracking-wide">
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