import { Plane, Users, MapPin, FileText } from "lucide-react";

export function ComplexSituations() {
  const situations = [
    {
      icon: Plane,
      title: "Viaggio Last Minute?",
      subtitle: "Organizziamo tutto in 24 ore",
      benefits: [
        "Prenotazioni immediate",
        "Migliori tariffe last minute",
        "Assistenza h24"
      ],
      bgColor: "bg-white",
      borderColor: "border-red-200",
      iconColor: "text-red-600",
      titleColor: "text-gray-900",
      subtitleColor: "text-gray-600"
    },
    {
      icon: Users,
      title: "Gruppo Numeroso da Organizzare?",
      subtitle: "Gestiamo viaggi di gruppo complessi",
      benefits: [
        "Tariffe speciali per gruppi",
        "Coordinamento completo",
        "Pagamenti dilazionati"
      ],
      bgColor: "bg-white",
      borderColor: "border-blue-200",
      iconColor: "text-blue-600",
      titleColor: "text-gray-900",
      subtitleColor: "text-gray-600"
    },
    {
      icon: MapPin,
      title: "Destinazione Complicata?",
      subtitle: "Esperti in viaggi difficili",
      benefits: [
        "Destinazioni remote",
        "Visti e permessi speciali",
        "Itinerari personalizzati"
      ],
      bgColor: "bg-white",
      borderColor: "border-orange-200",
      iconColor: "text-orange-600",
      titleColor: "text-gray-900",
      subtitleColor: "text-gray-600"
    },
    {
      icon: FileText,
      title: "Documenti Scaduti?",
      subtitle: "Assistenza urgente documenti",
      benefits: [
        "Passaporti urgenti",
        "Visti in tempi record",
        "Assistenza burocratica"
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
            ESIGENZE DI VIAGGIO SPECIALI?<br/>
            <span className="text-primary font-medium">CI SIAMO NOI!</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Anni di esperienza nel settore viaggi per soluzioni immediate
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
            CONSULENZA VIAGGIO GRATUITA
          </button>
          <p className="mt-4 text-gray-600">
            Realizziamo il tuo viaggio dei sogni
          </p>
        </div>
      </div>
    </section>
  );
}