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
      
      {/* No overlay - let the beautiful beach show through */}
      
      <div className="relative z-10 text-center w-full px-0">
        {/* Full-width Hero Container without overlay */}
        <div className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Logo principale rimosso */}
            

            
            {/* Accent Line */}
            <div className="w-40 h-2 bg-blue-500 mx-auto mb-8"></div>
            
            {/* Description */}
            <p className="text-xl sm:text-2xl text-white max-w-4xl mx-auto leading-relaxed font-light mb-12 drop-shadow-xl">
              Dalla magia delle Maldive alle vette delle Dolomiti, dalle città d'arte europee ai safari africani. 
              Ogni viaggio è un'esperienza unica pensata per te.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}