import { useState } from "react";
import { useParams, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, MapPin, Clock, Users, Calendar, Phone, Mail, Heart, Share2, Star, Plane, CheckCircle, XCircle, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { PhotoGallery } from "@/components/PhotoGallery";
import { BookingModal } from "@/components/booking-modal";
import type { Travel } from "@shared/schema";
import { formatPrice, formatDuration, getTravelTypeIcon, getCategoryIcon } from "@/lib/types";
import { Link } from "wouter";
import { SEOHead } from "@/components/seo-head";
import { sendWhatsAppMessage, shareOnWhatsApp } from "@/lib/whatsapp";

export default function TravelDetail() {
  const params = useParams();
  const [, setLocation] = useLocation();
  const travelId = params.id;

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // Determina se è un ID numerico o uno slug
  const isNumericId = travelId && /^\d+$/.test(travelId);
  
  // Se abbiamo parametri di slug (type, country, travelType), costruisci lo slug
  const { type, country, travelType } = params;
  const slug = (type && country && travelType) ? `${type}/${country}/${travelType}` : travelId;
  
  // Costruisci l'URL corretto
  let finalQueryUrl: string;
  if (type && country && travelType) {
    // Slug da parametri URL come /mare/grecia/singolo
    const encodedSlug = encodeURIComponent(`${type}/${country}/${travelType}`);
    finalQueryUrl = `/api/travels/slug/${encodedSlug}`;
  } else if (isNumericId) {
    // ID numerico
    finalQueryUrl = `/api/travels/${travelId}`;
  } else if (travelId) {
    // Slug semplice
    const encodedSlug = encodeURIComponent(travelId);
    finalQueryUrl = `/api/travels/slug/${encodedSlug}`;
  } else {
    finalQueryUrl = '';
  }

  // Fetch single travel
  const { data: travel, isLoading, error } = useQuery<Travel>({
    queryKey: [finalQueryUrl],
    enabled: !!finalQueryUrl,
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
        title={travel.metaTitle || `${travel.title} - ${travel.destination} | UNCONVENTIONAL TOUR`}
        description={travel.metaDescription || `${travel.description.substring(0, 160)}...`}
        keywords={`viaggio ${travel.destination}, ${travel.country}, ${getTypeLabel(travel.type)}, vacanza`}
        canonicalUrl={`https://unconventionaltour.it/travel/${travel.id}`}
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
              <PhotoGallery images={travel.images || []} title={travel.title} />
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
                    €{parseFloat(travel.price).toLocaleString("it-IT", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <BookingModal travel={travel}>
                  <Button 
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3"
                    data-testid="button-book-now"
                  >
                    <CreditCard className="h-5 w-5 mr-2" />
                    Prenota ora
                  </Button>
                </BookingModal>
                {travel.depositAmount && parseFloat(travel.depositAmount) > 0 && (
                  <BookingModal travel={travel}>
                    <Button 
                      className="w-full bg-orange-600 hover:bg-orange-700 text-white py-3"
                      data-testid="button-deposit"
                    >
                      <CreditCard className="h-5 w-5 mr-2" />
                      Acconto (€{parseFloat(travel.depositAmount).toLocaleString("it-IT")})
                    </Button>
                  </BookingModal>
                )}
                <Button
                  onClick={handleWhatsAppContact}
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-3"
                  data-testid="button-whatsapp-contact"
                >
                  <Phone className="h-5 w-5 mr-2" />
                  Contatta via WhatsApp
                </Button>
                <Button
                  onClick={handleEmailContact}
                  variant="outline"
                  className="w-full py-3"
                  data-testid="button-email-contact"
                >
                  <Mail className="h-5 w-5 mr-2" />
                  Invia Email
                </Button>
                <Button
                  onClick={() => shareOnWhatsApp(travel, `/travel/${travel.id}`)}
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white py-3"
                  data-testid="button-share-whatsapp"
                >
                  <Share2 className="h-5 w-5 mr-2" />
                  Condividi Tour
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Description and Details */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="space-y-8">
            {/* Description */}
            <Card className="border-none shadow-lg">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100">
                <CardTitle className="text-2xl">Descrizione del Tour</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <p className="text-gray-700 text-lg leading-relaxed whitespace-pre-line">
                  {travel.description}
                </p>
              </CardContent>
            </Card>

            {/* Features Included */}
            {travel.features && travel.features.length > 0 && (
              <Card className="border-none shadow-lg">
                <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-100">
                  <CardTitle className="text-2xl flex items-center gap-2">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                    Cosa Include il Tour
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {travel.features.map((feature, index) => (
                      <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 hover:bg-green-50 transition-colors">
                        <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700 font-medium">{feature}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Call to Action Banner */}
            <Card className="border-none shadow-lg bg-gradient-to-r from-blue-600 to-blue-700 text-white">
              <CardContent className="py-8">
                <div className="text-center space-y-4">
                  <h3 className="text-2xl font-bold">Pronto a Partire?</h3>
                  <p className="text-blue-100 text-lg">Prenota ora o contattaci per maggiori informazioni</p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                    <BookingModal travel={travel}>
                      <Button 
                        size="lg"
                        className="bg-white text-blue-600 hover:bg-gray-100"
                        data-testid="button-book-cta"
                      >
                        <CreditCard className="h-5 w-5 mr-2" />
                        Prenota Ora
                      </Button>
                    </BookingModal>
                    <Button
                      size="lg"
                      onClick={handleWhatsAppContact}
                      className="bg-green-600 hover:bg-green-700"
                      data-testid="button-whatsapp-cta"
                    >
                      <Phone className="h-5 w-5 mr-2" />
                      Contattaci su WhatsApp
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}