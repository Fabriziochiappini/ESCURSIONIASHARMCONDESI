import { Star, Quote } from "lucide-react";

const reviews = [
  {
    id: 1,
    name: "Maria Rossi",
    rating: 5,
    text: "Esperienza fantastica! Desy è stata bravissima nell'organizzare la nostra escursione a Ras Mohammed. Snorkeling indimenticabile, pesci coloratissimi e una guida super preparata. Consigliatissimo!",
    date: "Novembre 2024",
    avatar: "MR"
  },
  {
    id: 2,
    name: "Giuseppe Verdi",
    rating: 5,
    text: "Safari nel deserto spettacolare! Quad, cena beduina sotto le stelle e tramonto mozzafiato. Organizzazione impeccabile, prezzi onesti. Torneremo sicuramente!",
    date: "Ottobre 2024",
    avatar: "GV"
  },
  {
    id: 3,
    name: "Francesca B.",
    rating: 5,
    text: "Escursione all'Isola di Tiran perfetta! Desy ha pensato a tutto, dal trasporto al pranzo. Il mare era cristallino. La migliore agenzia di Sharm!",
    date: "Settembre 2024",
    avatar: "FB"
  },
  {
    id: 4,
    name: "Antonio M.",
    rating: 5,
    text: "Professionalità e gentilezza. Abbiamo fatto il tour del Cairo con loro e tutto è andato liscio. Guide esperte e organizzazione perfetta. Super consigliato!",
    date: "Agosto 2024",
    avatar: "AM"
  }
];

export function FacebookReviews() {
  return (
    <section className="py-20 bg-gradient-to-br from-[#1e3a5f]/5 via-white to-[#A8CFEB]/10 relative overflow-hidden">
      <div className="absolute top-10 left-10 w-72 h-72 bg-[#D4AF37]/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-[#A8CFEB]/20 rounded-full blur-3xl"></div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-[#C9A961] via-[#D4AF37] to-[#C9A961] bg-clip-text text-transparent tracking-[0.15em] uppercase drop-shadow-lg font-eagle-lake">
            Dicono di Noi
          </h2>
          <div className="w-48 h-[2px] bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent mx-auto mb-6"></div>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto font-light">
            Le esperienze dei nostri clienti parlano per noi
          </p>
        </div>

        {/* Griglia recensioni */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {reviews.map((review) => (
            <div 
              key={review.id}
              className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-100 relative group"
            >
              {/* Icona virgolette */}
              <div className="absolute top-4 right-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Quote className="w-12 h-12 text-[#D4AF37]" />
              </div>

              {/* Header con avatar e nome */}
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#1e3a5f] to-[#2c3e50] flex items-center justify-center text-white font-bold text-lg shadow-md">
                  {review.avatar}
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 text-lg">{review.name}</h4>
                  <div className="flex items-center gap-2">
                    <div className="flex">
                      {[...Array(review.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-[#D4AF37] text-[#D4AF37]" />
                      ))}
                    </div>
                    <span className="text-sm text-gray-400">{review.date}</span>
                  </div>
                </div>
              </div>

              {/* Testo recensione */}
              <p className="text-gray-600 leading-relaxed">
                "{review.text}"
              </p>

              {/* Badge Facebook */}
              <div className="mt-4 pt-4 border-t border-gray-100 flex items-center gap-2">
                <svg className="w-5 h-5 text-[#1877F2]" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                <span className="text-sm text-gray-400">Recensione Facebook</span>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Facebook */}
        <div className="text-center">
          <a 
            href="https://www.facebook.com/siviaggiacondesi/reviews"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 bg-[#1877F2] hover:bg-[#166FE5] text-white px-8 py-4 rounded-full font-semibold text-lg transition-all shadow-lg hover:shadow-xl hover:scale-105"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
            Vedi tutte le recensioni su Facebook
          </a>
          <p className="mt-4 text-gray-400 text-sm">
            Seguici su Facebook per restare aggiornato sulle nostre escursioni
          </p>
        </div>
      </div>
    </section>
  );
}
