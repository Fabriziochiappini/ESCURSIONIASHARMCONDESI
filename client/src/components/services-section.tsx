import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Scale, Home, CreditCard, ArrowRight, CheckCircle } from "lucide-react";
import { useLocation } from "wouter";

const services = [
  {
    category: "Perizie e Valutazioni",
    icon: <FileText className="h-12 w-12" />,
    description: "Valutazioni professionali e perizie tecniche certificate per ogni esigenza immobiliare",
    color: "bg-primary text-primary-foreground",
    items: ["Perizia Immobile", "Visure catastali", "Visure ipotecarie", "A.P.E."],
    popular: true
  },
  {
    category: "Servizi Legali", 
    icon: <Scale className="h-12 w-12" />,
    description: "Supporto legale specializzato in diritto immobiliare e pratiche urbanistiche",
    color: "bg-secondary text-secondary-foreground",
    items: ["Diritto civile immobiliare", "Sanatorie Urbanistiche", "Successioni"],
    popular: false
  },
  {
    category: "Compravendita Immobili",
    icon: <Home className="h-12 w-12" />,
    description: "Servizi completi per ogni tipologia di proprietà da appartamenti a terreni",
    color: "bg-accent text-accent-foreground",
    items: ["Appartamenti", "Villini e Ville", "Terreni", "Ruderi"],
    popular: false
  },
  {
    category: "Servizi Finanziari",
    icon: <CreditCard className="h-12 w-12" />,
    description: "Consulenza finanziaria e creditizia specializzata nel settore immobiliare",
    color: "bg-primary/80 text-primary-foreground",
    items: ["Mutui Agevolati"],
    popular: false
  }
];

export function ServicesSection() {
  const [, setLocation] = useLocation();

  return (
    <section id="servizi" className="py-20 bg-gradient-to-br from-primary/5 via-white to-accent/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 bg-accent text-accent-foreground rounded-full text-sm font-medium mb-6">
            <Home className="h-4 w-4 mr-2" />
            Servizi Professionali
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-primary mb-6">
            I Nostri Servizi Specializzati
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            <strong>AGENZIA 2 Servizi Immobiliari</strong> offre una gamma completa di servizi professionali 
            per soddisfare ogni esigenza nel settore immobiliare ad Acireale.
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-primary to-secondary mx-auto mt-8 rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {services.map((service, index) => (
            <Card key={index} className="group hover:shadow-xl transition-all duration-500 border-0 shadow-lg overflow-hidden h-full flex flex-col">
              <CardHeader className="relative pb-4 flex-shrink-0">
                <div className="flex items-start space-x-4">
                  <div className={`flex-shrink-0 w-16 h-16 rounded-xl ${service.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                    {service.icon}
                  </div>
                  <div className="flex-grow">
                    <CardTitle className="text-xl font-bold text-primary group-hover:text-secondary transition-colors mb-2">
                      {service.category}
                      {service.popular && (
                        <span className="ml-2 px-2 py-1 bg-accent text-accent-foreground text-xs rounded-full">
                          Popolare
                        </span>
                      )}
                    </CardTitle>
                    <CardDescription className="text-gray-600 leading-relaxed">
                      {service.description}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="pt-0 flex-grow flex flex-col">
                <div className="space-y-3 mb-6 flex-grow">
                  {service.items.map((item, itemIndex) => (
                    <div key={itemIndex} className="flex items-center space-x-3">
                      <CheckCircle className="h-4 w-4 text-accent flex-shrink-0" />
                      <span className="text-sm text-gray-700 font-medium">{item}</span>
                    </div>
                  ))}
                </div>
                
                <Button 
                  onClick={() => setLocation('/servizi')}
                  className="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-primary-foreground font-semibold transition-all duration-300 group-hover:scale-105 mt-auto"
                >
                  Scopri di Più
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center bg-gradient-to-br from-primary to-primary/80 rounded-3xl p-12 text-primary-foreground">
          <h3 className="text-3xl font-bold mb-4">
            Hai bisogno di una consulenza personalizzata?
          </h3>
          <p className="text-xl mb-8 opacity-90">
            <strong>Geometra Antonio Cannavò</strong> è a tua disposizione per ogni esigenza immobiliare
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              variant="secondary"
              className="group"
              onClick={() => setLocation('/servizi')}
            >
              <ArrowRight className="h-5 w-5 mr-2 group-hover:translate-x-1 transition-transform" />
              Tutti i Servizi
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="bg-white/10 border-white/20 text-white hover:bg-white hover:text-primary"
            >
              Contattaci Ora
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}