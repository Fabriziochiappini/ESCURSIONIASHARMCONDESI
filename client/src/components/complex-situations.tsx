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
      bgColor: "bg-gradient-to-br from-red-500 to-red-600",
      textColor: "text-white"
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
      bgColor: "bg-gradient-to-br from-blue-600 to-blue-700",
      textColor: "text-white"
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
      bgColor: "bg-gradient-to-br from-orange-500 to-orange-600",
      textColor: "text-white"
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
      bgColor: "bg-gradient-to-br from-yellow-500 to-yellow-600",
      textColor: "text-white"
    }
  ];

  return (
    <section className="py-16 bg-white">
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
                className={`${situation.bgColor} ${situation.textColor} rounded-2xl p-6 shadow-xl hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 cursor-pointer group`}
              >
                <div className="text-center mb-4">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-4 group-hover:bg-white/30 transition-colors">
                    <IconComponent className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold mb-2 leading-tight">
                    {situation.title}
                  </h3>
                  <p className="text-sm opacity-90 mb-4">
                    {situation.subtitle}
                  </p>
                </div>

                <div className="space-y-2 mb-6">
                  {situation.benefits.map((benefit, benefitIndex) => (
                    <div key={benefitIndex} className="flex items-center text-sm">
                      <div className="w-2 h-2 bg-white rounded-full mr-3 flex-shrink-0"></div>
                      <span>{benefit}</span>
                    </div>
                  ))}
                </div>

                <div className="text-center">
                  <button className="bg-white text-gray-900 px-6 py-2 rounded-full font-semibold text-sm hover:bg-gray-100 transition-colors shadow-md">
                    Contattaci Ora
                  </button>
                </div>

                <div className="text-center mt-3">
                  <p className="text-xs opacity-80">
                    Tutto con accordo trasparente
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