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
      
      {/* Elegant Overlay - più leggero come Michelangelo */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/80 via-white/60 to-white/40"></div>
      
      <div className="relative z-10 text-center max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 animate-fade-in">
        {/* Clean Modern Container */}
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-8 lg:p-12 mb-12 shadow-xl border">
          <div className="mb-8">
            <h1 className="text-4xl lg:text-6xl font-light mb-6 leading-tight text-gray-900">
              Trova la Casa dei Tuoi Sogni ad{' '}
              <span className="text-primary font-medium">Acireale</span>
            </h1>
            <div className="w-24 h-1 bg-primary mx-auto mb-8 rounded-full"></div>
          </div>
          
          <p className="text-xl mb-8 text-gray-700 max-w-3xl mx-auto leading-relaxed">
            Scopri le proprietà più esclusive di <strong className="text-primary">Acireale</strong> e dintorni. 
            Con <strong className="text-primary">AGENZIA 2 Servizi Immobiliari</strong>, la tua nuova vita inizia qui.
          </p>
        </div>
        
        {/* Clean Info Stats */}
        <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 max-w-4xl mx-auto animate-scale-in">
          <div className="flex flex-wrap justify-center items-center gap-8 text-sm font-medium text-gray-600">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-primary rounded-full mr-2"></div>
              20+ Proprietà Disponibili
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-secondary rounded-full mr-2"></div>
              Tour Virtuali 360°
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-accent rounded-full mr-2"></div>
              <strong>Geometra Antonio Cannavò</strong>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}