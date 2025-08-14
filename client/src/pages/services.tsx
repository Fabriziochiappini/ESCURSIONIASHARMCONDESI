import { Home, Phone, Mail, Clock, MessageCircle, Shield, Award, Users, Building } from "lucide-react";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { SEOHead } from "@/components/seo-head";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Scale, Home as HomeIcon, CreditCard, CheckCircle, MapPin, Phone as PhoneIcon, Mail as MailIcon, Clock as ClockIcon } from "lucide-react";

const services = [
  {
    category: "Consulenza e Preventivi",
    icon: <FileText className="h-8 w-8 text-white" />,
    description: "Consulenza professionale per organizzare il viaggio perfetto",
    color: "bg-primary text-white",
    items: [
      "Preventivi personalizzati",
      "Consulenza destinazioni",
      "Pianificazione itinerari", 
      "Consigli esperti",
      "Valutazione budget viaggio"
    ]
  },
  {
    category: "Documentazione e Assistenza",
    icon: <Scale className="h-8 w-8 text-white" />,
    description: "Supporto completo per documenti di viaggio e assistenza",
    color: "bg-secondary text-white",
    items: [
      "Assistenza visti e passaporti",
      "Documenti di viaggio",
      "Assistenza assicurazioni",
      "Support 24/7 durante il viaggio",
      "Gestione emergenze"
    ]
  },
  {
    category: "Pacchetti Viaggio",
    icon: <HomeIcon className="h-8 w-8 text-white" />,
    description: "Pacchetti completi per ogni tipo di esperienza",
    color: "bg-accent text-white",
    items: [
      "Vacanze al mare",
      "Avventure in montagna",
      "City break culturali",
      "Viaggi di gruppo",
      "Viaggi su misura"
    ]
  },
  {
    category: "Prenotazioni e Pagamenti",
    icon: <CreditCard className="h-8 w-8 text-white" />,
    description: "Gestione completa prenotazioni e soluzioni di pagamento",
    color: "bg-primary text-white",
    items: [
      "Prenotazioni hotel",
      "Biglietti aerei",
      "Noleggio auto",
      "Pagamenti dilazionati",
      "Garanzia miglior prezzo"
    ]
  }
];

const contactInfo = {
  name: "Propato Travel",
  role: "Agenzia Viaggi",
  address: "Via San Girolamo, 20 - 95024 ACIREALE (CT)",
  phone: "347 912 3456",
  email: "info@propatotravel.com",
  email2: "booking@propatotravel.com"
};

export default function Services() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-white to-accent/5">
      <SEOHead
        title="Propato Travel - Servizi di Viaggio Professionali"
        description="Scopri i nostri servizi di viaggio completi: consulenza personalizzata, pacchetti su misura, assistenza documentale e prenotazioni. Contattaci per organizzare il tuo viaggio perfetto."
        keywords="servizi viaggio, agenzia viaggi, pacchetti viaggio, consulenza viaggi, prenotazioni, propato travel"
        canonicalUrl="https://propatotravel.com/servizi"
      />
      <Navigation />

      {/* Hero Section */}
      <section className="relative py-20 px-4 bg-gradient-to-br from-primary to-primary/80">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-secondary/20"></div>
        <div className="relative max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center px-4 py-2 bg-white/20 text-white rounded-full text-sm font-medium mb-6">
            <HomeIcon className="h-4 w-4 mr-2 text-white" />
            Servizi di Viaggio Professionali
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            I Nostri Servizi
          </h1>
          <p className="text-xl text-white/90 max-w-3xl mx-auto mb-8">
            Soluzioni complete per ogni esigenza di viaggio. 
            Professionalità, esperienza e passione per farti vivere esperienze indimenticabili.
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
              Servizi Specializzati
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Offriamo una gamma completa di servizi professionali per soddisfare ogni esigenza di viaggio
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