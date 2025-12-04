import { useState } from "react";
import { Star, Quote, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import useEmblaCarousel from "embla-carousel-react";

const reviews = [
  {
    id: 1,
    name: "Daniela Torelli",
    rating: 5,
    text: "Abbiamo fatto due escursioni a Sharm organizzate da Desi, e ci siamo trovati benissimo! Una ragazza precisa, disponibile e sempre presente per qualsiasi bisogno. Consigliatissima per chi vuole vivere Sharm in tranquillità e senza pensieri!",
    date: "Novembre 2024",
    avatar: "DT"
  },
  {
    id: 2,
    name: "Cinzia Grasso",
    rating: 5,
    text: "Sono stata a Sharm con i miei genitori e abbiamo scelto di prenotare tutto il pacchetto di escursioni con Desi ed è stato tutto perfetto. Siamo rimasti soddisfatti di tutto. Organizzazione impeccabile. Desi è una ragazza dolce, disponibile, premurosa e attenta a tutto. Mi ha trasmesso fiducia sin da subito. Le guide che ci hanno accompagnato sono state brave e professionali, persone veramente squisite e simpatiche. La consiglio a tutti 💯❤️",
    date: "Novembre 2024",
    avatar: "CG"
  },
  {
    id: 3,
    name: "Serena Santiprosperi",
    rating: 5,
    text: "Sono stata a Sharm con una mia amica e ho scelto il pacchetto escursioni con Desi. Ci siamo trovate benissimo, lei è stata chiara, attenta, disponibile e ci ha sempre fornito assistenza. Tutte le guide a cui ci ha affidato sono state brave e professionali. La consiglio assolutamente! 🥰",
    date: "Novembre 2024",
    avatar: "SS"
  },
  {
    id: 4,
    name: "Marco Bianchi",
    rating: 5,
    text: "Escursione al Cairo fantastica! Desi ha organizzato tutto nei minimi dettagli. Le piramidi, il museo egizio, tutto perfetto. Guide preparatissime e sempre disponibili. Esperienza indimenticabile!",
    date: "Ottobre 2024",
    avatar: "MB"
  },
  {
    id: 5,
    name: "Laura Ferri",
    rating: 5,
    text: "Safari nel deserto con quad e cena beduina sotto le stelle. Un'esperienza magica! Desi è stata disponibilissima, ha risposto a tutte le nostre domande e ci ha fatto sentire sicuri. Super consigliata!",
    date: "Ottobre 2024",
    avatar: "LF"
  },
  {
    id: 6,
    name: "Alessandro Costa",
    rating: 5,
    text: "Snorkeling a Ras Mohammed incredibile! I colori dei coralli e dei pesci sono indescrivibili. Organizzazione perfetta, pranzo incluso ottimo. Desi è una garanzia per le escursioni a Sharm!",
    date: "Settembre 2024",
    avatar: "AC"
  },
  {
    id: 7,
    name: "Giulia Romano",
    rating: 5,
    text: "Ho prenotato 3 escursioni con Desi e sono state tutte fantastiche. Prezzi onesti, nessuna sorpresa, guide professionali. La consiglio a chiunque vada a Sharm El Sheikh!",
    date: "Settembre 2024",
    avatar: "GR"
  },
  {
    id: 8,
    name: "Francesco Martini",
    rating: 5,
    text: "Isola di Tiran meravigliosa! Mare cristallino, pesci tropicali ovunque. Desi ha pensato a tutto, dal pick-up in hotel al pranzo sulla barca. Torneremo sicuramente!",
    date: "Agosto 2024",
    avatar: "FM"
  }
];

function ReviewCard({ review }: { review: typeof reviews[0] }) {
  return (
    <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-5 sm:p-6 border border-gray-100 relative group h-full flex flex-col">
      <div className="absolute top-4 right-4 opacity-10 group-hover:opacity-20 transition-opacity">
        <Quote className="w-10 h-10 text-[#D4AF37]" />
      </div>

      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#1e3a5f] to-[#2c3e50] flex items-center justify-center text-white font-bold text-sm shadow-md flex-shrink-0">
          {review.avatar}
        </div>
        <div className="min-w-0">
          <h4 className="font-semibold text-gray-900 truncate">{review.name}</h4>
          <div className="flex items-center gap-2">
            <div className="flex">
              {[...Array(review.rating)].map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 fill-[#D4AF37] text-[#D4AF37]" />
              ))}
            </div>
            <span className="text-xs text-gray-400">{review.date}</span>
          </div>
        </div>
      </div>

      <p className="text-gray-600 text-sm leading-relaxed flex-1 line-clamp-4">
        "{review.text}"
      </p>

      <div className="mt-4 pt-3 border-t border-gray-100 flex items-center gap-2">
        <svg className="w-4 h-4 text-[#1877F2]" fill="currentColor" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
        </svg>
        <span className="text-xs text-gray-400">Recensione Facebook</span>
      </div>
    </div>
  );
}

export function FacebookReviews() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ 
    loop: true,
    align: 'start',
    dragFree: false,
  });
  const [currentIndex, setCurrentIndex] = useState(0);

  const scrollPrev = () => {
    if (emblaApi) {
      emblaApi.scrollPrev();
      setCurrentIndex(emblaApi.selectedScrollSnap());
    }
  };

  const scrollNext = () => {
    if (emblaApi) {
      emblaApi.scrollNext();
      setCurrentIndex(emblaApi.selectedScrollSnap());
    }
  };

  const scrollTo = (index: number) => {
    if (emblaApi) {
      emblaApi.scrollTo(index);
      setCurrentIndex(index);
    }
  };

  const reviewPages = [];
  for (let i = 0; i < reviews.length; i += 4) {
    reviewPages.push(reviews.slice(i, i + 4));
  }

  return (
    <section className="py-16 sm:py-20 bg-gradient-to-br from-[#1e3a5f]/5 via-white to-[#A8CFEB]/10 relative overflow-hidden">
      <div className="absolute top-10 left-10 w-72 h-72 bg-[#D4AF37]/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-[#A8CFEB]/20 rounded-full blur-3xl"></div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-[#C9A961] via-[#D4AF37] to-[#C9A961] bg-clip-text text-transparent tracking-[0.1em] sm:tracking-[0.15em] uppercase drop-shadow-lg font-eagle-lake">
            Dicono di Noi
          </h2>
          <div className="w-48 h-[2px] bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent mx-auto mb-4"></div>
          <p className="text-base sm:text-lg text-gray-500 max-w-2xl mx-auto font-light">
            Le esperienze dei nostri clienti parlano per noi
          </p>
          <div className="flex items-center justify-center gap-2 mt-3">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-[#D4AF37] text-[#D4AF37]" />
              ))}
            </div>
            <span className="text-gray-600 font-medium">100% recensioni positive</span>
          </div>
        </div>

        {/* Carousel */}
        <div className="relative">
          {/* Frecce navigazione - desktop */}
          <button
            onClick={scrollPrev}
            className="hidden md:flex absolute -left-4 lg:-left-12 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white rounded-full shadow-lg items-center justify-center hover:bg-gray-50 transition-colors border border-gray-200"
          >
            <ChevronLeft className="w-6 h-6 text-gray-600" />
          </button>
          <button
            onClick={scrollNext}
            className="hidden md:flex absolute -right-4 lg:-right-12 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white rounded-full shadow-lg items-center justify-center hover:bg-gray-50 transition-colors border border-gray-200"
          >
            <ChevronRight className="w-6 h-6 text-gray-600" />
          </button>

          {/* Embla Carousel */}
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex touch-pan-y">
              {reviewPages.map((page, pageIndex) => (
                <div key={pageIndex} className="flex-none w-full min-w-0 px-1">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    {page.map((review) => (
                      <ReviewCard key={review.id} review={review} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Dots e frecce mobile */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <button
              onClick={scrollPrev}
              className="md:hidden w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center border border-gray-200"
            >
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </button>

            <div className="flex gap-2">
              {reviewPages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => scrollTo(index)}
                  className={`w-2.5 h-2.5 rounded-full transition-all ${
                    currentIndex === index 
                      ? 'bg-[#D4AF37] w-8' 
                      : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                />
              ))}
            </div>

            <button
              onClick={scrollNext}
              className="md:hidden w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center border border-gray-200"
            >
              <ChevronRight className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          {/* Hint swipe mobile */}
          <p className="text-center text-gray-400 text-sm mt-4 md:hidden">
            Scorri con il dito per vedere altre recensioni →
          </p>
        </div>

        {/* CTA Facebook */}
        <div className="text-center mt-12">
          <a 
            href="https://www.facebook.com/siviaggiacondesi/reviews"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 bg-[#1877F2] hover:bg-[#166FE5] text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full font-semibold text-base sm:text-lg transition-all shadow-lg hover:shadow-xl hover:scale-105"
          >
            <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
            Vedi tutte le recensioni
          </a>
        </div>
      </div>
    </section>
  );
}
