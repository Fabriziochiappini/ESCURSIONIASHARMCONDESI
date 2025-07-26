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
    <section className="py-32 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/30 via-transparent to-secondary/30"></div>
      </div>
      
      <div className="relative z-10 max-w-[1920px] mx-auto px-6 lg:px-12">
        <div className="text-center mb-20 animate-fade-in">
          <h2 className="text-6xl lg:text-7xl font-black mb-8 uppercase tracking-wider neon-text">
            PROBLEMI IMMOBILIARI?<br/>
            <span className="bg-gradient-to-r from-secondary to-accent bg-clip-text text-transparent">RISOLVIAMO TUTTO</span>
          </h2>
          <p className="text-2xl font-bold text-foreground/80 uppercase tracking-wide max-w-4xl mx-auto">
            30 ANNI DI ESPERIENZA - RISULTATI GARANTITI
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8 animate-scale-in">
          {situations.map((situation, index) => {
            const IconComponent = situation.icon;
            const gradientClass = index === 0 ? 'gradient-primary' : 
                                 index === 1 ? 'gradient-secondary' : 
                                 index === 2 ? 'gradient-accent' : 'gradient-primary';
            
            return (
              <div
                key={index}
                className="glass-card rounded-3xl p-8 group hover:scale-105 transition-all duration-500 border-l-8 border-primary/50"
              >
                <div className="mb-8">
                  <div className={`w-20 h-20 ${gradientClass} rounded-2xl flex items-center justify-center mb-6 group-hover:rotate-12 transition-transform duration-300 shadow-2xl`}>
                    <IconComponent className="w-10 h-10 text-white" strokeWidth={2.5} />
                  </div>
                  <h3 className="text-2xl font-black mb-4 leading-tight text-foreground uppercase tracking-wide">
                    {situation.title}
                  </h3>
                  <p className="text-lg font-bold text-foreground/80 mb-6">
                    {situation.subtitle}
                  </p>
                </div>

                <div className="space-y-4 mb-8">
                  {situation.benefits.map((benefit, benefitIndex) => (
                    <div key={benefitIndex} className="flex items-start group/item">
                      <div className="w-3 h-3 bg-primary rounded-full mt-2 mr-4 flex-shrink-0 group-hover/item:animate-pulse"></div>
                      <span className="text-foreground/80 leading-relaxed font-semibold">{benefit}</span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-foreground/20 pt-6">
                  <button className="w-full gradient-primary text-white px-6 py-4 font-black text-sm uppercase tracking-widest hover:scale-105 transition-all duration-300 rounded-2xl shadow-2xl neon-glow">
                    CONTATTACI ORA
                  </button>
                </div>

                <div className="mt-6 text-center">
                  <p className="text-sm font-bold text-primary uppercase tracking-wider">
                    GARANZIA TOTALE
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="text-center mt-20 animate-fade-in">
          <button className="gradient-secondary text-white px-16 py-6 font-black text-2xl uppercase tracking-widest hover:scale-105 transition-all duration-300 shadow-2xl rounded-3xl neon-glow">
            CONSULENZA GRATUITA IMMEDIATA
          </button>
          <p className="mt-6 text-lg font-bold text-foreground/80 uppercase tracking-wider">
            CHIAMACI ADESSO - NON ASPETTARE
          </p>
        </div>
      </div>
    </section>
  );
}