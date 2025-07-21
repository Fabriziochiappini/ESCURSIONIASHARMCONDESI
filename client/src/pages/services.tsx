import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Home, 
  Calculator, 
  FileText, 
  Camera, 
  MapPin, 
  Users,
  TrendingUp,
  Shield,
  Clock,
  CheckCircle,
  Star,
  Phone,
  Mail
} from "lucide-react";

const services = [
  {
    icon: Home,
    title: "Vendita Immobili",
    description: "Supporto completo per la vendita della tua proprietà con valutazione gratuita e marketing mirato per massimizzare il valore della tua casa.",
    features: [
      "Valutazione gratuita professionale",
      "Marketing digitale avanzato",
      "Gestione documentale completa",
      "Fotografia professionale inclusa",
      "Assistenza fino al rogito"
    ],
    price: "Commissione dal 3%",
    popular: true
  },
  {
    icon: Calculator,
    title: "Affitti e Locazioni",
    description: "Gestione completa di affitti residenziali e commerciali con contratti sicuri, ricerca inquilini qualificati e amministrazione.",
    features: [
      "Ricerca inquilini affidabili",
      "Contratti legali conformi",
      "Gestione pagamenti automatica",
      "Manutenzione ordinaria",
      "Reportistica mensile"
    ],
    price: "Una mensilità",
    popular: false
  },
  {
    icon: Camera,
    title: "Fotografia Immobiliare",
    description: "Servizio fotografico professionale con riprese aeree, tour virtuali 360° e video promozionali per valorizzare al massimo la tua proprietà.",
    features: [
      "Foto professionali HD",
      "Riprese aeree con drone",
      "Tour virtuali 360°",
      "Video promozionali",
      "Editing professionale"
    ],
    price: "Da €299",
    popular: false
  },
  {
    icon: FileText,
    title: "Consulenza Legale",
    description: "Assistenza legale specializzata in diritto immobiliare per acquisti, vendite, locazioni e risoluzione di controversie.",
    features: [
      "Verifica documenti catastali",
      "Contrattualistica personalizzata",
      "Assistenza notarile",
      "Risoluzione controversie",
      "Consulenza fiscale"
    ],
    price: "Da €150/ora",
    popular: false
  },
  {
    icon: TrendingUp,
    title: "Investimenti Immobiliari",
    description: "Consulenza per investimenti immobiliari redditizi con analisi di mercato dettagliate e gestione del portfolio.",
    features: [
      "Analisi mercato completa",
      "ROI calculator avanzato",
      "Portfolio management",
      "Strategie fiscali",
      "Monitoraggio performance"
    ],
    price: "Consulenza gratuita",
    popular: true
  },
  {
    icon: Shield,
    title: "Assicurazioni Casa",
    description: "Polizze assicurative personalizzate per proteggere la tua proprietà, i contenuti e garantire assistenza in caso di sinistri.",
    features: [
      "Polizze casa complete",
      "Protezione contenuto",
      "Assistenza sinistri 24/7",
      "Copertura danni naturali",
      "Responsabilità civile"
    ],
    price: "Da €200/anno",
    popular: false
  }
];

const testimonials = [
  {
    name: "Marco Rossi",
    service: "Vendita Immobili",
    rating: 5,
    comment: "Servizio eccellente! Hanno venduto la mia casa in meno di 2 mesi al prezzo che desideravo."
  },
  {
    name: "Laura Bianchi",
    service: "Affitti e Locazioni",
    rating: 5,
    comment: "Gestione professionale dei miei affitti. Non devo preoccuparmi di nulla, pensano a tutto loro."
  },
  {
    name: "Giuseppe Verdi",
    service: "Investimenti",
    rating: 5,
    comment: "Grazie ai loro consigli ho fatto investimenti immobiliari molto redditizi. Consigliatissimi!"
  }
];

export default function Services() {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      
      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-br from-purple-600 to-blue-600 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              I Nostri Servizi
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto opacity-90">
              Soluzioni complete per ogni tua esigenza immobiliare. 
              Dalla vendita agli investimenti, siamo il tuo partner di fiducia.
            </p>
            <div className="flex justify-center items-center space-x-8 text-sm">
              <span className="flex items-center">
                <CheckCircle className="h-5 w-5 mr-2" />
                15+ Anni di Esperienza
              </span>
              <span className="flex items-center">
                <CheckCircle className="h-5 w-5 mr-2" />
                500+ Clienti Soddisfatti
              </span>
              <span className="flex items-center">
                <CheckCircle className="h-5 w-5 mr-2" />
                Assistenza 24/7
              </span>
            </div>
          </div>
        </section>

        {/* Services Grid */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map((service, index) => (
                <Card key={index} className={`service-card glass-card rounded-3xl p-8 hover:shadow-2xl transition-all duration-500 group border-0 ${service.popular ? 'ring-2 ring-purple-500' : ''}`}>
                  {service.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-purple-500 text-white px-4 py-1">
                        <Star className="h-3 w-3 mr-1" />
                        Più Richiesto
                      </Badge>
                    </div>
                  )}
                  
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
                          <CheckCircle className="w-4 h-4 text-green-500 mr-3 flex-shrink-0" />
                          {feature}
                        </div>
                      ))}
                    </div>

                    <div className="border-t border-gray-200 pt-6">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <span className="text-sm text-gray-500">A partire da</span>
                          <div className="text-2xl font-bold text-purple-600">{service.price}</div>
                        </div>
                      </div>
                      
                      <Button className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-xl transition-all duration-300 hover:scale-105">
                        Richiedi Preventivo
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Cosa Dicono i Nostri Clienti
              </h2>
              <p className="text-xl text-gray-600">
                La soddisfazione dei nostri clienti è la nostra priorità
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <Card key={index} className="glass-card rounded-3xl p-8 border-0">
                  <CardContent className="p-0">
                    <div className="flex items-center mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    <p className="text-gray-700 mb-6 italic">
                      "{testimonial.comment}"
                    </p>
                    <div>
                      <div className="font-semibold text-gray-900">{testimonial.name}</div>
                      <div className="text-sm text-purple-600">{testimonial.service}</div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-br from-purple-600 to-blue-600 text-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-4xl font-bold mb-6">
              Pronto a Iniziare?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Contattaci oggi per una consulenza gratuita e scopri come possiamo aiutarti 
              a raggiungere i tuoi obiettivi immobiliari.
            </p>
            <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6">
              <Button className="bg-white text-purple-600 hover:bg-gray-100 font-semibold px-8 py-3 rounded-xl">
                <Phone className="mr-2 h-5 w-5" />
                Chiamaci Ora
              </Button>
              <Button variant="outline" className="border-white text-white hover:bg-white/10 font-semibold px-8 py-3 rounded-xl">
                <Mail className="mr-2 h-5 w-5" />
                Invia Email
              </Button>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}