import { Home, Phone, Mail, Clock, MessageCircle, Shield, Award, Users, Building } from "lucide-react";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { SEOHead } from "@/components/seo-head";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Scale, Home as HomeIcon, CreditCard, CheckCircle, MapPin, Phone as PhoneIcon, Mail as MailIcon, Clock as ClockIcon } from "lucide-react";

const services = [
  {
    category: "Escursioni Mar Rosso",
    icon: <FileText className="h-8 w-8 text-white" />,
    description: "Tour ed escursioni nelle acque cristalline del Mar Rosso",
    color: "bg-primary text-white",
    items: [
      "Snorkeling tra le barriere coralline",
      "Diving per tutti i livelli",
      "Tour in barca con pranzo",
      "Ras Mohammed National Park", 
      "Isola di Tiran"
    ]
  },
  {
    category: "Safari nel Deserto",
    icon: <Scale className="h-8 w-8 text-white" />,
    description: "Avventure indimenticabili nelle dune del deserto",
    color: "bg-secondary text-white",
    items: [
      "Safari in quad o jeep",
      "Cena beduina sotto le stelle",
      "Giro in cammello",
      "Tour al tramonto nel deserto",
      "Visita villaggi beduini"
    ]
  },
  {
    category: "Tour Culturali",
    icon: <HomeIcon className="h-8 w-8 text-white" />,
    description: "Scopri le antiche meraviglie dell'Egitto",
    color: "bg-accent text-white",
    items: [
      "Escursione al Cairo e Piramidi",
      "Luxor e Valle dei Re",
      "Petra (Giordania)",
      "Monte Sinai e Monastero",
      "Tour storico di Sharm"
    ]
  },
  {
    category: "Servizi Premium",
    icon: <CreditCard className="h-8 w-8 text-white" />,
    description: "Organizzazione completa e assistenza dedicata",
    color: "bg-primary text-white",
    items: [
      "Pick-up da hotel incluso",
      "Guide esperte multilingue",
      "Tour privati personalizzati",
      "Pagamento online sicuro",
      "Assistenza 24/7"
    ]
  }
];

const contactInfo = {
  name: "Si Viaggia con Desy",
  role: "Tour Operator Sharm El Sheikh",
  address: "Sharm El Sheikh - Egitto",
  phone: "+39 344 458 5177",
  email: "siviaggiacondesi@gmail.com",
  email2: "siviaggiacondesi@gmail.com"
};

export default function Services() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-white to-accent/5">
      <SEOHead
        title="Si Viaggia con Desy - Servizi Escursioni Sharm El Sheikh"
        description="Scopri i nostri servizi: escursioni Mar Rosso, diving, snorkeling, safari nel deserto. Tour operator specializzato in Sharm El Sheikh. Contattaci per i tuoi tour!"
        keywords="servizi tour operator, tour sharm el sheikh, escursioni mar rosso, diving sharm, si viaggia con desy"
        canonicalUrl="https://siviaggiacondesy.com/servizi"
      />
      <Navigation />

      {/* Hero Section */}
      <section className="relative py-20 px-4 bg-gradient-to-br from-primary to-primary/80">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-secondary/20"></div>
        <div className="relative max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center px-4 py-2 bg-white/20 text-white rounded-full text-sm font-medium mb-6">
            <HomeIcon className="h-4 w-4 mr-2 text-white" />
            Tour ed Escursioni a Sharm El Sheikh
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            I Nostri Servizi
          </h1>
          <p className="text-xl text-white/90 max-w-3xl mx-auto mb-8">
            Esperienze indimenticabili tra Mar Rosso e deserto. 
            Tour organizzati, guide esperte e massima professionalità per le tue escursioni a Sharm.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="group bg-white text-primary hover:bg-white/90">
              <PhoneIcon className="h-5 w-5 mr-2 group-hover:animate-pulse text-primary" />
              Chiamaci Ora
            </Button>
            <Button size="lg" className="bg-white/10 border-white/20 text-white hover:bg-white hover:text-primary">
              <MailIcon className="h-5 w-5 mr-2" />
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
              Le Nostre Escursioni
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Scopri le meraviglie di Sharm El Sheikh con i nostri tour organizzati e guide esperte
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
            Scopri di più sul nostro tour operator, i nostri contatti e come raggiungerci
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