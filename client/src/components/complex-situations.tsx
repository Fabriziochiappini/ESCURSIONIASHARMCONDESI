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
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Situazioni Complesse? Abbiamo la Soluzione
          </h2>
          <p className="text-xl text-gray-600">
            Il nostro team specializzato risolve le situazioni immobiliari più difficili
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {situations.map((situation, index) => {
            const IconComponent = situation.icon;
            return (
              <div
                key={index}
                className={`${situation.bgColor} ${situation.borderColor} border-2 rounded-lg p-6 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group`}
              >
                <div className="text-center mb-6">
                  <div className={`inline-flex items-center justify-center w-14 h-14 ${situation.iconColor} bg-gray-50 rounded-lg mb-4 group-hover:bg-gray-100 transition-colors`}>
                    <IconComponent className="w-7 h-7" />
                  </div>
                  <h3 className={`text-lg font-bold mb-2 leading-tight ${situation.titleColor}`}>
                    {situation.title}
                  </h3>
                  <p className={`text-sm ${situation.subtitleColor} mb-4`}>
                    {situation.subtitle}
                  </p>
                </div>

                <div className="space-y-3 mb-6">
                  {situation.benefits.map((benefit, benefitIndex) => (
                    <div key={benefitIndex} className="flex items-start text-sm text-gray-700">
                      <div className={`w-1.5 h-1.5 ${situation.iconColor} rounded-full mt-2 mr-3 flex-shrink-0`}></div>
                      <span className="leading-relaxed">{benefit}</span>
                    </div>
                  ))}
                </div>

                <div className="text-center">
                  <button className={`${situation.iconColor} border-2 ${situation.borderColor} px-6 py-2 rounded-md font-semibold text-sm hover:bg-gray-50 transition-colors`}>
                    Contattaci Ora
                  </button>
                </div>

                <div className="text-center mt-4">
                  <p className="text-xs text-gray-500 italic">
                    Accordo trasparente garantito
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="text-center mt-12">
          <button className="bg-primary text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-primary/90 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-1">
            Richiedi Consulenza Gratuita
          </button>
        </div>
      </div>
    </section>
  );
}