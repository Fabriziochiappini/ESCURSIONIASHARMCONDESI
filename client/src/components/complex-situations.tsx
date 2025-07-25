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
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-black text-gray-900 mb-6 uppercase tracking-wider">
            PROBLEMI IMMOBILIARI?<br/>
            <span className="text-red-700">RISOLVIAMO TUTTO</span>
          </h2>
          <p className="text-xl font-bold text-gray-700 uppercase tracking-wide">
            30 ANNI DI ESPERIENZA - RISULTATI GARANTITI
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {situations.map((situation, index) => {
            const IconComponent = situation.icon;
            return (
              <div
                key={index}
                className={`${situation.bgColor} border-l-8 ${situation.borderColor} shadow-2xl p-8 hover:shadow-3xl transition-shadow duration-200`}
              >
                <div className="mb-6">
                  <div className={`w-16 h-16 ${situation.iconColor} bg-gray-100 flex items-center justify-center mb-6`}>
                    <IconComponent className="w-9 h-9" strokeWidth={2.5} />
                  </div>
                  <h3 className="text-xl font-black mb-3 leading-tight text-gray-900 uppercase tracking-wide">
                    {situation.title}
                  </h3>
                  <p className="text-base font-bold text-gray-700 mb-6">
                    {situation.subtitle}
                  </p>
                </div>

                <div className="space-y-4 mb-8">
                  {situation.benefits.map((benefit, benefitIndex) => (
                    <div key={benefitIndex} className="flex items-start">
                      <div className={`w-3 h-3 ${situation.iconColor} mt-1 mr-4 flex-shrink-0`} style={{clipPath: 'polygon(0 0, 100% 50%, 0 100%)'}}>
                      </div>
                      <span className="text-sm font-semibold text-gray-800 leading-relaxed uppercase tracking-wide">{benefit}</span>
                    </div>
                  ))}
                </div>

                <div className="border-t-2 border-gray-200 pt-6">
                  <button className={`w-full ${situation.iconColor} bg-gray-900 text-white px-6 py-4 font-black text-sm uppercase tracking-widest hover:bg-gray-800 transition-colors border-2 border-gray-900`}>
                    CONTATTACI ORA
                  </button>
                </div>

                <div className="mt-4 text-center">
                  <p className="text-xs font-bold text-gray-600 uppercase tracking-wider">
                    GARANZIA TOTALE
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="text-center mt-16">
          <button className="bg-red-700 text-white px-12 py-5 font-black text-xl uppercase tracking-widest hover:bg-red-800 transition-colors shadow-2xl border-4 border-red-700">
            CONSULENZA GRATUITA IMMEDIATA
          </button>
          <p className="mt-4 text-sm font-bold text-gray-600 uppercase tracking-wider">
            CHIAMACI ADESSO - NON ASPETTARE
          </p>
        </div>
      </div>
    </section>
  );
}