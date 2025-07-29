import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, Scale, Home, CreditCard, CheckCircle, MapPin, Phone, Mail, Clock } from "lucide-react";

const services = [
  {
    category: "Servizi di Perizia e Valutazione",
    icon: <FileText className="h-8 w-8 text-white" />,
    description: "Valutazioni professionali e perizie tecniche certificate",
    color: "bg-primary text-white",
    items: [
      "Perizia Immobile",
      "Visure catastali",
      "Visure ipotecarie", 
      "Visure CRIF",
      "A.P.E. (Attestato di Prestazione Energetica)"
    ]
  },
  {
    category: "Servizi Legali e Urbanistici",
    icon: <Scale className="h-8 w-8 text-white" />,
    description: "Supporto legale specializzato in diritto immobiliare",
    color: "bg-secondary text-white",
    items: [
      "Diritto civile immobiliare",
      "Sanatorie Urbanistiche",
      "Cancellazione ipoteche",
      "Estinzione Ipoteca con stralcio e saldo",
      "Successioni"
    ]
  },
  {
    category: "Compravendita Immobili",
    icon: <Home className="h-8 w-8 text-white" />,
    description: "Servizi completi per ogni tipologia di proprietà",
    color: "bg-accent text-white",
    items: [
      "Appartamenti",
      "Villini e Ville",
      "Casa singola con terreno",
      "Ruderi con Terreno",
      "Terreni"
    ]
  },
  {
    category: "Servizi Finanziari",
    icon: <CreditCard className="h-8 w-8 text-white" />,
    description: "Consulenza finanziaria e creditizia specializzata",
    color: "bg-primary text-white",
    items: [
      "Mutui Agevolati"
    ]
  }
];

const contactInfo = {
  name: "AGENZIA 2 Servizi Immobiliari",
  geometra: "Geometra: Antonio Cannavò",
  address: "Via San Girolamo, 20 - 95024 ACIREALE (CT)",
  phone: "346 800 3234",
  email: "agenzia2acireale@virgilio.it",
  email2: "antoniocannavo@msn.com"
};

export default function Services() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-white to-accent/5">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative py-20 px-4 bg-gradient-to-br from-primary to-primary/80">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-secondary/20"></div>
        <div className="relative max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center px-4 py-2 bg-white/20 text-white rounded-full text-sm font-medium mb-6">
            <Home className="h-4 w-4 mr-2 text-white" />
            Servizi Professionali Immobiliari
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            I Nostri Servizi
          </h1>
          <p className="text-xl text-white/90 max-w-3xl mx-auto mb-8">
            Soluzioni complete per ogni esigenza immobiliare ad Acireale. 
            Professionalità, esperienza e competenza al vostro servizio.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="group bg-white text-primary hover:bg-white/90">
              <Phone className="h-5 w-5 mr-2 group-hover:animate-pulse text-primary" />
              Chiamaci Ora
            </Button>
            <Button size="lg" className="bg-white/10 border-white/20 text-white hover:bg-white hover:text-primary">
              <Mail className="h-5 w-5 mr-2" />
              Contattaci
            </Button>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
              Servizi Specializzati
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Offriamo una gamma completa di servizi professionali per soddisfare ogni esigenza nel settore immobiliare
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {services.map((service, index) => (
              <Card key={index} className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg overflow-hidden">
                <CardHeader className="relative">
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-xl ${service.color} mb-4 shadow-lg`}>
                    {service.icon}
                  </div>
                  <CardTitle className="text-xl font-bold text-primary group-hover:text-secondary transition-colors">
                    {service.category}
                  </CardTitle>
                  <CardDescription className="text-gray-600">
                    {service.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {service.items.map((item, itemIndex) => (
                    <div key={itemIndex} className="flex items-center space-x-3">
                      <div className="flex-shrink-0">
                        <CheckCircle className="h-5 w-5 text-accent" />
                      </div>
                      <span className="text-gray-700 font-medium">{item}</span>
                    </div>
                  ))}
                  <div className="pt-4">
                    <Button className="w-full bg-primary hover:bg-secondary transition-colors text-white">
                      Richiedi Informazioni
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-gradient-to-br from-primary to-primary/90">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Hai Bisogno di Maggiori Informazioni?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Scopri di più sulla nostra agenzia, i nostri contatti e come raggiungerci
          </p>
          <Button 
            size="lg" 
            className="bg-white text-primary hover:bg-white/90 font-semibold px-8 py-3"
            onClick={() => window.location.href = '/chi-siamo'}
          >
            <MapPin className="h-5 w-5 mr-2" />
            Vai a Chi Siamo
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
}