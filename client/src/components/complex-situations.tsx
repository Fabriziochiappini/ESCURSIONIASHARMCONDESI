import { Home, Users, Gavel, DollarSign } from "lucide-react";

export function ComplexSituations() {
  const situations = [
    {
      icon: Home,
      title: "Casa con Ipoteca da Ristrutturare?",
      subtitle: "Soluzione trasparente garantita",
      benefits: [
        "Nessun costo anticipato",
        "Prezzo minimo garantito",
        "Azzeramento debiti e gravami"
      ],
      bgColor: "bg-white",
      borderColor: "border-red-200",
      iconColor: "text-red-600",
      titleColor: "text-gray-900",
      subtitleColor: "text-gray-600"
    },
    {
      icon: Users,
      title: "Divisione Ereditaria Complicata?",
      subtitle: "Perizie e soluzioni concrete",
      benefits: [
        "Divisione con compensi equi",
        "Vendita con ripartizione",
        "Assegnazione concordata"
      ],
      bgColor: "bg-white",
      borderColor: "border-blue-200",
      iconColor: "text-blue-600",
      titleColor: "text-gray-900",
      subtitleColor: "text-gray-600"
    },
    {
      icon: Gavel,
      title: "Casa all'Asta? Ti Aiutiamo!",
      subtitle: "Team legale specializzato",
      benefits: [
        "Saldo e stralcio del debito",
        "Vendita a valore ridotto",
        "Recupero massimo possibile"
      ],
      bgColor: "bg-white",
      borderColor: "border-orange-200",
      iconColor: "text-orange-600",
      titleColor: "text-gray-900",
      subtitleColor: "text-gray-600"
    },
    {
      icon: DollarSign,
      title: "Debiti Agenzia Entrate?",
      subtitle: "Verifichiamo irregolarità",
      benefits: [
        "Controllo ipoteche illegali",
        "Rimozione gravami irregolari",
        "Piani rateizzati personalizzati"
      ],
      bgColor: "bg-white",
      borderColor: "border-yellow-200",
      iconColor: "text-yellow-600",
      titleColor: "text-gray-900",
      subtitleColor: "text-gray-600"
    }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl lg:text-5xl font-light mb-6 text-gray-900">
            PROBLEMI IMMOBILIARI?<br/>
            <span className="text-primary font-medium">CI SIAMO NOI!</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            30 anni di esperienza al tuo servizio per soluzioni concrete
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-scale-in items-stretch justify-items-center">
          {situations.map((situation, index) => {
            const IconComponent = situation.icon;
            const iconColors = ['text-primary', 'text-secondary', 'text-orange-500', 'text-amber-500'];
            const iconColor = iconColors[index] || 'text-primary';
            
            return (
              <div
                key={index}
                className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 hover:border-primary/30 group w-full h-full flex flex-col"
              >
                <div className="mb-6">
                  <div className="w-16 h-16 bg-gray-50 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <IconComponent className={`w-8 h-8 ${iconColor}`} strokeWidth={2} />
                  </div>
                  <h3 className="text-xl font-bold mb-3 leading-tight text-gray-900">
                    {situation.title}
                  </h3>
                  <p className="text-gray-600 mb-6">
                    {situation.subtitle}
                  </p>
                </div>

                <div className="space-y-3 mb-8 flex-grow">
                  {situation.benefits.map((benefit, benefitIndex) => (
                    <div key={benefitIndex} className="flex items-start">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span className="text-gray-700 leading-relaxed text-sm">{benefit}</span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-gray-200 pt-6">
                  <button className="w-full bg-primary hover:bg-primary/90 text-white px-6 py-3 font-semibold text-sm rounded-lg transition-all duration-300 shadow-md hover:shadow-lg">
                    CONTATTACI ORA
                  </button>
                </div>

                <div className="mt-4 text-center">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                    GARANZIA TOTALE
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="text-center mt-16 animate-fade-in">
          <button className="bg-growth hover:bg-growth/80 text-white px-12 py-4 font-bold text-lg rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl">
            CONSULENZA GRATUITA IMMEDIATA
          </button>
          <p className="mt-4 text-gray-600">
            Chiamaci adesso - non aspettare
          </p>
        </div>
      </div>
    </section>
  );
}