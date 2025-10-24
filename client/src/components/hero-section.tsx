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
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { 
      loop: true,
      duration: 30
    }, 
    [Autoplay({ delay: 5000, stopOnInteraction: false })]
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
        <div className="flex h-full transition-opacity duration-1000">
          {heroImages.map((img, index) => (
            <div key={index} className="relative flex-[0_0_100%] min-w-0 h-full">
              <img
                src={img}
                alt={`Escursione ${index + 1}`}
                loading={index === 0 ? "eager" : "lazy"}
                className="w-full h-full object-cover transition-opacity duration-700"
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

      {/* Contenuto Sovrapposto - Posizionato in basso */}
      <div className="absolute bottom-16 left-0 right-0 z-10 text-center w-full px-4">
        <div className="max-w-7xl mx-auto">
          {/* Riquadro Piccolo e Discreto */}
          <div className="max-w-2xl mx-auto">
            <div className="bg-white/75 backdrop-blur-md rounded-2xl p-6 md:p-8 border border-[#D4AF37]/30 shadow-xl">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#C9A961] via-[#D4AF37] to-[#C9A961] bg-clip-text text-transparent mb-3 tracking-wide uppercase font-eagle-lake leading-tight">
                Si Viaggia con Desy
              </h1>
              <div className="w-32 h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent mx-auto mb-3"></div>
              <p className="text-lg sm:text-xl md:text-2xl text-gray-700 leading-relaxed font-light">
                Escursioni a Sharm El Sheikh
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
