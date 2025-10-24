import { useState, useEffect, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import logoUrl from "@assets/si_viaggia_con_desy_logo-removebg-preview_1761318900270.png";
import img1 from "@assets/viaggiatrice-che-si-gode-un-viaggio-di-lusso-riva-al-mare_1761320594651.jpg";
import img2 from "@assets/vista-aerea-delle-dune-di-maspalomas-sull-isola-di-gran-canaria_1761320594651.jpg";
import img3 from "@assets/donna-che-viaggia-quad-dall-oceano_1761320594652.jpg";
import img4 from "@assets/spiaggia-vuota-con-ombrelloni-al-mattino_1761320594652.jpg";
import img5 from "@assets/bei-mare-ed-oceano-tropicali-della-spiaggia-con-l-albero-del-cocco-ed-ombrello-e-sedia-su-cielo-blu-e-sulla-nuvola-bianca_1761320594652.jpg";
import img6 from "@assets/ombrello-e-sedia-intorno-alla-piscina_1761320594653.jpg";
import img7 from "@assets/cammelli-che-camminano-dietro-l-altro-sulla-spiaggia-di-diani-kenya_1761320594654.jpg";
import img8 from "@assets/cosa-fare-sharm-el-sheikh_1761320594654.jpg";

const heroImages = [img1, img2, img3, img4, img5, img6, img7, img8];

export function HeroSection() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [
    Autoplay({ delay: 5000, stopOnInteraction: false })
  ]);

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
            <div key={index} className="relative flex-[0_0_100%] min-w-0 h-full">
              <img
                src={img}
                alt={`Escursione ${index + 1}`}
                loading={index === 0 ? "eager" : "lazy"}
                className="w-full h-full object-cover"
              />
              {/* Overlay scuro per leggibilità */}
              <div className="absolute inset-0 bg-black/30"></div>
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

      {/* Contenuto Sovrapposto */}
      <div className="relative z-10 text-center w-full px-0">
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
            
            {/* Description con riquadro elegante */}
            <div className="max-w-4xl mx-auto mb-12">
              <div className="bg-white/90 backdrop-blur-md rounded-3xl p-8 border border-[#D4AF37]/30 shadow-2xl">
                <p className="text-xl sm:text-2xl text-gray-700 leading-relaxed font-light tracking-wide">
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
