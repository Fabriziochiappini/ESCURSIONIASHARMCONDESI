import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Home, 
  Calculator, 
  FileText, 
  Camera, 
  MapPin, 
  Users,
  TrendingUp,
  Shield,
  Clock
} from "lucide-react";

const services = [
  {
    icon: Home,
    title: "Vendita Immobili",
    description: "Supporto completo per la vendita della tua proprietà con valutazione gratuita e marketing mirato.",
    features: ["Valutazione gratuita", "Marketing professionale", "Gestione documentale"]
  },
  {
    icon: Calculator,
    title: "Affitti e Locazioni",
    description: "Gestione completa di affitti residenziali e commerciali con contratti sicuri e trasparenti.",
    features: ["Ricerca inquilini", "Contratti legali", "Gestione pagamenti"]
  },
  {
    icon: Camera,
    title: "Fotografia Immobiliare",
    description: "Servizio fotografico professionale con riprese aeree e tour virtuali per valorizzare la tua proprietà.",
    features: ["Foto professionali", "Riprese aeree", "Tour virtuali 360°"]
  },
  {
    icon: FileText,
    title: "Consulenza Legale",
    description: "Assistenza legale specializzata in diritto immobiliare per acquisti, vendite e locazioni.",
    features: ["Verifica documenti", "Contrattualistica", "Assistenza notarile"]
  },
  {
    icon: TrendingUp,
    title: "Investimenti Immobiliari",
    description: "Consulenza per investimenti immobiliari redditizi con analisi di mercato dettagliate.",
    features: ["Analisi mercato", "ROI calculator", "Portfolio management"]
  },
  {
    icon: Shield,
    title: "Assicurazioni Casa",
    description: "Polizze assicurative personalizzate per proteggere la tua proprietà e i tuoi beni.",
    features: ["Polizze casa", "Protezione contenuto", "Assistenza sinistri"]
  }
];

export function ServicesSection() {
  return (
    <section id="servizi" className="py-20 bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            I Nostri 
            <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent"> Servizi</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Offriamo una gamma completa di servizi immobiliari per soddisfare ogni tua esigenza, 
            dalla vendita all'acquisto, dagli affitti agli investimenti.
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-purple-500 to-blue-500 mx-auto mt-8 rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {services.map((service, index) => (
            <Card key={index} className="service-card glass-card rounded-3xl p-8 hover:shadow-2xl transition-all duration-500 group border-0">
              <CardContent className="p-0">
                <div className="mb-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <service.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-purple-600 transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed mb-6">
                    {service.description}
                  </p>
                </div>

                <div className="space-y-3 mb-6">
                  {service.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center text-sm text-gray-700">
                      <div className="w-2 h-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full mr-3"></div>
                      {feature}
                    </div>
                  ))}
                </div>

                <Button className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-xl transition-all duration-300 hover:scale-105">
                  Scopri di Più
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <div className="glass-card rounded-3xl p-8 max-w-4xl mx-auto">
            <div className="flex items-center justify-center mb-6">
              <Clock className="h-12 w-12 text-purple-600 mr-4" />
              <div>
                <h3 className="text-2xl font-bold text-gray-900">Assistenza 24/7</h3>
                <p className="text-gray-600">Il nostro team è sempre a tua disposizione</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-3xl font-bold text-purple-600 mb-2">500+</div>
                <div className="text-gray-600">Proprietà Vendute</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-blue-600 mb-2">15+</div>
                <div className="text-gray-600">Anni di Esperienza</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-green-600 mb-2">98%</div>
                <div className="text-gray-600">Clienti Soddisfatti</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}