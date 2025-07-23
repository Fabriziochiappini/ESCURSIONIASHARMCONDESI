import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  AlertTriangle, 
  FileText, 
  Users, 
  Home, 
  CreditCard, 
  Wrench,
  Phone,
  CheckCircle,
  ArrowRight,
  Shield,
  Calculator,
  Building
} from "lucide-react";

const services = [
  {
    title: "Casa all'asta? Ti aiutiamo",
    icon: <AlertTriangle className="h-6 w-6" />,
    color: "bg-red-50 border-red-200 text-red-800",
    iconColor: "text-red-600",
    description: "Soluzioni concrete per evitare la perdita della tua casa",
    content: [
      "Soluzioni di saldo e stralcio per ridurre significativamente il debito",
      "Intervento diretto sull'immobile pignorato",
      "Vendita a valore ridotto concordata con banche e creditori",
      "Recupero ottimizzato per ammortizzare la perdita"
    ],
    urgent: true
  },
  {
    title: "Debiti con Agenzia delle Entrate",
    icon: <FileText className="h-6 w-6" />,
    color: "bg-orange-50 border-orange-200 text-orange-800",
    iconColor: "text-orange-600",
    description: "Verifiche e soluzioni per ipoteche e debiti fiscali",
    content: [
      "Verifica legittimità delle ipoteche iscritte",
      "Rimozione legale di irregolarità sussistenti",
      "Piani di rateizzazione personalizzati",
      "Compatibilità con la tua situazione economica"
    ]
  },
  {
    title: "Divisione Ereditaria",
    icon: <Users className="h-6 w-6" />,
    color: "bg-blue-50 border-blue-200 text-blue-800",
    iconColor: "text-blue-600",
    description: "Risoluzione conflitti e accordi trasparenti tra eredi",
    content: [
      "Consulenza su procedure legali e rischi",
      "Perizie di stima professionali",
      "Divisione con compensazione economica equa",
      "Vendita con ripartizione del ricavato",
      "Assegnazione concordata tra le parti"
    ]
  },
  {
    title: "Casa con Ipoteca da Ristrutturare",
    icon: <Home className="h-6 w-6" />,
    color: "bg-green-50 border-green-200 text-green-800", 
    iconColor: "text-green-600",
    description: "Vendita garantita senza costi anticipati",
    content: [
      "Contratto trasparente con prezzo minimo garantito",
      "Nessun costo anticipato né post vendita",
      "Azzeramento completo di debiti e gravami",
      "Gestione completa delle problematiche strutturali e giuridiche"
    ]
  }
];

const purchaseServices = [
  {
    title: "Mutuo 100% Consap per Giovani",
    icon: <CreditCard className="h-5 w-5" />,
    description: "Sotto i 36 anni? Finanziamento fino al 100% del valore immobile",
    features: ["Nessun grande anticipo richiesto", "Supporto completo dalla verifica requisiti", "Istituti di credito convenzionati"]
  },
  {
    title: "Voucher Acquisto Casa",
    icon: <Shield className="h-5 w-5" />,
    description: "Pre-delibera di mutuo per cercare casa con certezza finanziaria",
    features: ["Documento ufficiale disponibilità finanziaria", "Tempi velocizzati", "Maggiore potere di trattativa"]
  }
];

const technicalServices = [
  {
    title: "Ristrutturazioni Complete",
    icon: <Wrench className="h-5 w-5" />,
    description: "Riqualificazione completa anche da situazioni critiche"
  },
  {
    title: "Redistribuzione Spazi",
    icon: <Calculator className="h-5 w-5" />,
    description: "Progetti funzionali e su misura per le tue esigenze"
  },
  {
    title: "Nuove Costruzioni",
    icon: <Building className="h-5 w-5" />,
    description: "Team dedicato per ogni fase: progettazione, autorizzazioni, cantieri"
  }
];

export function SpecializedServices() {
  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 via-white to-primary/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium mb-6">
            <Shield className="h-4 w-4 mr-2" />
            Servizi Specializzati
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-primary mb-6">
            Situazioni Complesse?
            <span className="block text-secondary mt-2">Abbiamo la Soluzione</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Ogni situazione immobiliare ha una soluzione. Il nostro team di esperti è specializzato 
            nel risolvere anche i casi più complessi con professionalità e trasparenza.
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-primary to-secondary mx-auto mt-8 rounded-full"></div>
        </div>

        {/* Main Services Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {services.map((service, index) => (
            <Card key={index} className={`group hover:shadow-xl transition-all duration-500 border-2 ${service.color} overflow-hidden`}>
              <CardHeader className="pb-4">
                <div className="flex items-start space-x-4">
                  <div className={`flex-shrink-0 w-12 h-12 rounded-lg bg-white/80 flex items-center justify-center ${service.iconColor} group-hover:scale-110 transition-transform duration-300`}>
                    {service.icon}
                  </div>
                  <div className="flex-grow">
                    <div className="flex items-center gap-3 mb-2">
                      <CardTitle className="text-lg font-bold">
                        {service.title}
                      </CardTitle>
                      {service.urgent && (
                        <Badge variant="destructive" className="text-xs">
                          Urgente
                        </Badge>
                      )}
                    </div>
                    <CardDescription className="font-medium">
                      {service.description}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="pt-0">
                <div className="space-y-3 mb-6">
                  {service.content.map((item, itemIndex) => (
                    <div key={itemIndex} className="flex items-start space-x-3">
                      <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-700 leading-relaxed">{item}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Purchase Support Section */}
        <div className="bg-gradient-to-r from-primary to-primary/90 rounded-3xl p-8 mb-16 text-primary-foreground">
          <div className="text-center mb-8">
            <h3 className="text-3xl font-bold mb-4">
              Ti Aiutiamo ad Acquistare Casa
            </h3>
            <p className="text-xl opacity-90">
              Senza anticipi e con supporto completo in ogni fase
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {purchaseServices.map((service, index) => (
              <Card key={index} className="bg-white/10 border-white/20 text-primary-foreground">
                <CardHeader className="pb-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
                      {service.icon}
                    </div>
                    <CardTitle className="text-lg">{service.title}</CardTitle>
                  </div>
                  <CardDescription className="text-primary-foreground/80 font-medium">
                    {service.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-2">
                    {service.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center space-x-2">
                        <CheckCircle className="h-3 w-3 text-accent flex-shrink-0" />
                        <span className="text-sm opacity-90">{feature}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Technical Services */}
        <div className="bg-white rounded-3xl p-8 shadow-lg border mb-16">
          <div className="text-center mb-8">
            <h3 className="text-3xl font-bold text-primary mb-4">
              Servizi Tecnici Evoluti
            </h3>
            <p className="text-xl text-gray-600">
              Pensati per dare nuova vita agli immobili
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {technicalServices.map((service, index) => (
              <div key={index} className="text-center group">
                <div className="w-16 h-16 rounded-xl bg-gradient-to-r from-primary to-secondary text-primary-foreground flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  {service.icon}
                </div>
                <h4 className="text-lg font-bold text-primary mb-2">{service.title}</h4>
                <p className="text-gray-600 text-sm leading-relaxed">{service.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Final */}
        <div className="text-center bg-gradient-to-br from-secondary to-secondary/80 rounded-3xl p-12 text-white">
          <Phone className="h-16 w-16 mx-auto mb-6 opacity-90" />
          <h3 className="text-3xl font-bold mb-4">
            Il Primo Passo è Parlarne
          </h3>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto leading-relaxed">
            Contattaci senza impegno: ascoltiamo la tua storia, analizziamo la situazione 
            e costruiamo la strategia più adatta a te — che sia salvare, vendere o ricominciare da capo.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-white text-secondary hover:bg-gray-100 font-semibold group"
            >
              <Phone className="h-5 w-5 mr-2 group-hover:animate-pulse" />
              346 800 3234
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="border-white/30 text-white hover:bg-white/10"
            >
              Scrivici una Email
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}