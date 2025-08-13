import { useState } from "react";
import { useParams, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, MapPin, Clock, Users, Calendar, Phone, Mail, Heart, Share2, Star, Plane, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { PhotoGallery } from "@/components/PhotoGallery";
import type { Travel } from "@shared/schema";
import { formatPrice, formatDuration, getTravelTypeIcon, getCategoryIcon } from "@/lib/types";
import { Link } from "wouter";
import { SEOHead } from "@/components/seo-head";
import { sendWhatsAppMessage } from "@/lib/whatsapp";

export default function TravelDetail() {
  const params = useParams();
  const [, setLocation] = useLocation();
  const travelId = params.id;

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // Fetch single travel
  const { data: travel, isLoading, error } = useQuery<Travel>({
    queryKey: [`/api/travels/${travelId}`],
    enabled: !!travelId,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="pt-24">
          <div className="flex items-center justify-center min-h-[50vh]">
            <div className="animate-spin w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p>Caricamento viaggio...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !travel) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="pt-24">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold mb-4">Viaggio non trovato</h1>
            <Link href="/viaggi">
              <Button>Torna ai viaggi</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const handleWhatsAppContact = () => {
    const message = `Ciao! Sono interessato al viaggio "${travel.title}" (${travel.destination}). Potresti darmi più informazioni?`;
    sendWhatsAppMessage(travel.agentPhone || '+39 346 800 3234', message);
  };

  const handleEmailContact = () => {
    const subject = `Informazioni viaggio: ${travel.title}`;
    const body = `Ciao,\n\nSono interessato al viaggio "${travel.title}" a ${travel.destination}.\n\nPotresti darmi più dettagli?\n\nGrazie!`;
    window.location.href = `mailto:${travel.agentEmail || 'info@agenziaviaggi.it'}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  const getTypeBadgeColor = (type: string) => {
    switch (type) {
      case "mare": return "bg-blue-600";
      case "montagna": return "bg-green-600";
      case "citta": return "bg-purple-500";
      case "cultura": return "bg-orange-500";
      case "avventura": return "bg-red-500";
      case "relax": return "bg-teal-500";
      default: return "bg-gray-600";
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "mare": return "Mare";
      case "montagna": return "Montagna";
      case "citta": return "Città";
      case "cultura": return "Cultura";
      case "avventura": return "Avventura";
      case "relax": return "Relax";
      default: return type;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <SEOHead 
        title={travel.metaTitle || `${travel.title} - ${travel.destination} | Propato Travel`}
        description={travel.metaDescription || `${travel.description.substring(0, 160)}...`}
        keywords={`viaggio ${travel.destination}, ${travel.country}, ${getTypeLabel(travel.type)}, vacanza`}
        canonicalUrl={`https://propatotravel.com/travel/${travel.id}`}
      />
      <Navigation />
      
      <main className="pt-24">
        {/* Back Button */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Button
            variant="ghost"
            onClick={() => setLocation('/viaggi')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-4 w-4" />
            Torna ai viaggi
          </Button>
        </div>

        {/* Hero Section with Gallery */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Image Gallery */}
            <div className="space-y-4">
              <PhotoGallery images={travel.images} title={travel.title} />
            </div>

            {/* Travel Info */}
            <div className="space-y-6">
              {/* Badges */}
              <div className="flex flex-wrap gap-2">
                <Badge className={`${getTypeBadgeColor(travel.type)} text-white px-4 py-2`}>
                  {getTravelTypeIcon(travel.type)} {getTypeLabel(travel.type)}
                </Badge>
                {travel.travelType && (
                  <Badge variant="outline" className="px-4 py-2">
                    {getCategoryIcon(travel.travelType)} {travel.travelType}
                  </Badge>
                )}
                {travel.featured && (
                  <Badge className="bg-yellow-500 text-white px-4 py-2">
                    <Star className="h-3 w-3 mr-1" />
                    In Evidenza
                  </Badge>
                )}
              </div>

              {/* Title and Location */}
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  {travel.title}
                </h1>
                <div className="flex items-center text-xl text-gray-600 mb-2">
                  <MapPin className="h-5 w-5 mr-2" />
                  {travel.destination}, {travel.country}
                </div>
                {travel.region && (
                  <p className="text-gray-500">{travel.region}</p>
                )}
              </div>

              {/* Key Details */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <Clock className="h-6 w-6 mx-auto mb-2 text-blue-600" />
                  <p className="text-sm text-gray-600">Durata</p>
                  <p className="font-semibold">{formatDuration(travel.duration)}</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <Users className="h-6 w-6 mx-auto mb-2 text-green-600" />
                  <p className="text-sm text-gray-600">Partecipanti</p>
                  <p className="font-semibold">Max {travel.maxParticipants}</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <Calendar className="h-6 w-6 mx-auto mb-2 text-purple-600" />
                  <p className="text-sm text-gray-600">Età Minima</p>
                  <p className="font-semibold">{travel.minAge}+ anni</p>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <Plane className="h-6 w-6 mx-auto mb-2 text-blue-600" />
                  <p className="text-sm text-gray-600">Prezzo</p>
                  <p className="font-bold text-xl text-blue-600">
                    {formatPrice(travel.price, travel.type, travel.priceType)}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  onClick={handleWhatsAppContact}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3"
                >
                  <Phone className="h-5 w-5 mr-2" />
                  Contatta via WhatsApp
                </Button>
                <Button
                  onClick={handleEmailContact}
                  variant="outline"
                  className="flex-1 py-3"
                >
                  <Mail className="h-5 w-5 mr-2" />
                  Invia Email
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Description and Details */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              {/* Description */}
              <Card>
                <CardHeader>
                  <CardTitle>Descrizione del Viaggio</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                    {travel.description}
                  </p>
                </CardContent>
              </Card>

              {/* Features Included */}
              {travel.features && travel.features.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      Incluso nel Pacchetto
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {travel.features.map((feature, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600 mt-1 flex-shrink-0" />
                          <span className="text-gray-700">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Agent Contact Card */}
            <div>
              <Card className="sticky top-8">
                <CardHeader>
                  <CardTitle>Il tuo Consulente di Viaggio</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-2xl">👨‍💼</span>
                    </div>
                    <h3 className="font-semibold text-lg">
                      {travel.agentName || 'Consulente Viaggi'}
                    </h3>
                    <p className="text-gray-600 text-sm">Specialista {getTypeLabel(travel.type)}</p>
                  </div>

                  <Separator />

                  <div className="space-y-3">
                    <Button
                      onClick={handleWhatsAppContact}
                      className="w-full bg-green-600 hover:bg-green-700 text-white"
                    >
                      <Phone className="h-4 w-4 mr-2" />
                      WhatsApp
                    </Button>
                    <Button
                      onClick={handleEmailContact}
                      variant="outline"
                      className="w-full"
                    >
                      <Mail className="h-4 w-4 mr-2" />
                      Email
                    </Button>
                  </div>

                  <div className="text-xs text-gray-500 text-center">
                    Consulenza gratuita e senza impegno
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}