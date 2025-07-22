import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, Scale, Home, CreditCard, CheckCircle, MapPin, Phone, Mail, Clock } from "lucide-react";

const services = [
  {
    category: "Servizi di Perizia e Valutazione",
    icon: <FileText className="h-8 w-8" />,
    description: "Valutazioni professionali e perizie tecniche certificate",
    color: "bg-primary text-primary-foreground",
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
    icon: <Scale className="h-8 w-8" />,
    description: "Supporto legale specializzato in diritto immobiliare",
    color: "bg-secondary text-secondary-foreground",
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
    icon: <Home className="h-8 w-8" />,
    description: "Servizi completi per ogni tipologia di proprietà",
    color: "bg-accent text-accent-foreground",
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
    icon: <CreditCard className="h-8 w-8" />,
    description: "Consulenza finanziaria e creditizia specializzata",
    color: "bg-primary text-primary-foreground",
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
  pec: "antoniocannavoagenzia2serviziimmobiliari@pec.it"
};

export default function Services() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-white to-accent/5">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative py-20 px-4 bg-gradient-to-br from-primary to-primary/80">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-secondary/20"></div>
        <div className="relative max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center px-4 py-2 bg-accent text-accent-foreground rounded-full text-sm font-medium mb-6">
            <Home className="h-4 w-4 mr-2" />
            Servizi Professionali Immobiliari
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-primary-foreground mb-6">
            I Nostri Servizi
          </h1>
          <p className="text-xl text-primary-foreground/90 max-w-3xl mx-auto mb-8">
            Soluzioni complete per ogni esigenza immobiliare ad Acireale. 
            Professionalità, esperienza e competenza al vostro servizio.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" className="group">
              <Phone className="h-5 w-5 mr-2 group-hover:animate-pulse" />
              Chiamaci Ora
            </Button>
            <Button size="lg" variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white hover:text-primary">
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
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-xl ${service.color} mb-4`}>
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
                    <Button className="w-full bg-primary hover:bg-secondary transition-colors">
                      Richiedi Informazioni
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 px-4 bg-gradient-to-br from-primary to-primary/90">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
              Contattaci Oggi
            </h2>
            <p className="text-xl text-primary-foreground/90">
              Il nostro team è pronto ad assisterti per ogni tua esigenza immobiliare
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-primary-foreground flex items-center">
                  <MapPin className="h-6 w-6 mr-2 text-accent" />
                  {contactInfo.name}
                </CardTitle>
                <CardDescription className="text-primary-foreground/80">
                  {contactInfo.geometra}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 text-primary-foreground/90">
                <div className="flex items-center space-x-3">
                  <MapPin className="h-5 w-5 text-accent flex-shrink-0" />
                  <span>{contactInfo.address}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="h-5 w-5 text-accent flex-shrink-0" />
                  <span>{contactInfo.phone}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-accent flex-shrink-0" />
                  <span className="break-all">{contactInfo.email}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-accent flex-shrink-0" />
                  <span className="text-sm break-all">{contactInfo.pec}</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-primary-foreground flex items-center">
                  <Clock className="h-6 w-6 mr-2 text-accent" />
                  Orari di Apertura
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-primary-foreground/90">
                <div className="flex justify-between">
                  <span>Lunedì - Venerdì</span>
                  <span className="text-accent font-medium">9:00 - 19:00</span>
                </div>
                <div className="flex justify-between">
                  <span>Sabato</span>
                  <span className="text-accent font-medium">9:00 - 13:00</span>
                </div>
                <div className="flex justify-between">
                  <span>Domenica</span>
                  <span className="text-primary-foreground/60">Chiuso</span>
                </div>
                <div className="pt-4">
                  <Badge className="bg-accent text-accent-foreground">
                    Consulenze su appuntamento
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Google Maps */}
          <div className="mt-12">
            <Card className="overflow-hidden">
              <CardContent className="p-0">
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3049.7285661445895!2d15.163847076255!3d37.61088227981743!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1313fdc5b0f8b8c5%3A0x4f8b8c8c8c8c8c8c!2sVia%20San%20Girolamo%2C%2020%2C%2095024%20Acireale%20CT%2C%20Italy!5e0!3m2!1sen!2sus!4v1703234567890!5m2!1sen!2sus"
                  width="100%" 
                  height="400" 
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="AGENZIA 2 Servizi Immobiliari - Via San Girolamo 20, Acireale"
                ></iframe>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}