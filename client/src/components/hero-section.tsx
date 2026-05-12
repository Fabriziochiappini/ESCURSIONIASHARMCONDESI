import { useState, useEffect, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import Fade from "embla-carousel-fade";

const heroImages = [
  "/hero-1.jpg",
  "/hero-2.jpg", 
  "/hero-3.webp",
  "/hero-5.jpg",
  "/hero-6.jpg"
];

export function HeroSection() {
  const [imagesLoaded, setImagesLoaded] = useState(false);
  
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { 
      loop: true,
      duration: 50,
      skipSnaps: false
    }, 
    [
      Fade(),
      Autoplay({ delay: 4000, stopOnInteraction: false })
    ]
  );

  const [selectedIndex, setSelectedIndex] = useState(0);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi, onSelect]);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Slider di Sfondo */}
      <div className="absolute inset-0 overflow-hidden" ref={emblaRef}>
        <div className="flex h-full">
          {heroImages.map((img, index) => (
            <div 
              key={index} 
              className="relative flex-[0_0_100%] min-w-0 h-full"
              style={{ flex: '0 0 100%' }}
            >
              <img
                src={img}
                alt={`Escursione ${index + 1}`}
                loading={index === 0 ? "eager" : "lazy"}
                fetchPriority={index === 0 ? "high" : "low"}
                decoding="async"
                className="w-full h-full object-cover will-change-transform"
                style={{ 
                  backfaceVisibility: 'hidden',
                  transform: 'translateZ(0)'
                }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Indicatori Slider */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 flex gap-2">
        {heroImages.map((_, index) => (
          <button
            key={index}
            onClick={() => emblaApi?.scrollTo(index)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === selectedIndex
                ? "bg-[#D4AF37] w-8"
                : "bg-white/50 hover:bg-white/80"
            }`}
            aria-label={`Vai alla slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Contenuto Sovrapposto - Posizionato al centro-alto */}
      <div className="absolute top-1/3 left-0 right-0 z-10 text-center w-full px-4 transform -translate-y-1/2 md:top-1/2 md:-translate-y-1/2">
        <div className="max-w-7xl mx-auto">
          {/* Riquadro Piccolo e Discreto */}
          <div className="max-w-2xl mx-auto">
            <div className="bg-white/75 backdrop-blur-md rounded-2xl p-6 md:p-8 border border-[#D4AF37]/30 shadow-xl">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold gold-title mb-3 tracking-wide uppercase font-eagle-lake leading-tight">
                La tua agenzia italiana di fiducia a Sharm El Sheikh
              </h1>
              <p className="text-sm sm:text-base md:text-lg text-gray-700 mb-3 font-light italic leading-relaxed">
                Selezioniamo con cura esperienze, escursioni e partner locali affidabili per farti vivere il meglio del Mar Rosso in totale tranquillità.
              </p>
              <div className="w-32 h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent mx-auto mb-3"></div>
              <a 
                href="https://siviaggiacondesi.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-base sm:text-lg md:text-xl text-[#1e3a5f] underline underline-offset-4 decoration-[#D4AF37] hover:text-[#D4AF37] transition-colors duration-300 font-medium"
                data-testid="link-siviaggiacondesi"
              >
                Siviaggiacondesi.com
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
