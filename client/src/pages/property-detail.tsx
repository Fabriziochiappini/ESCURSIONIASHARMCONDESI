import { useParams, Link } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { 
  ArrowLeft, MapPin, Bed, Bath, Square, Images, 
  CheckCircle, Phone, Mail, Heart
} from "lucide-react";
import type { Property } from "@shared/schema";
import { formatPrice } from "@/lib/types";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

export default function PropertyDetail() {
  const params = useParams();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const propertyId = parseInt(params.id as string);
  
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: ""
  });

  const { data: property, isLoading, error } = useQuery<Property>({
    queryKey: ['/api/properties', propertyId],
    queryFn: async () => {
      const response = await fetch(`/api/properties/${propertyId}`);
      if (!response.ok) {
        throw new Error('Property not found');
      }
      return response.json();
    }
  });

  const contactMutation = useMutation({
    mutationFn: async (data: typeof contactForm) => {
      return apiRequest('POST', '/api/contact', {
        ...data,
        propertyId
      });
    },
    onSuccess: () => {
      toast({
        title: "Messaggio inviato!",
        description: "Ti contatteremo presto per maggiori informazioni.",
      });
      setContactForm({ name: "", email: "", phone: "", message: "" });
    },
    onError: () => {
      toast({
        title: "Errore",
        description: "Si è verificato un errore nell'invio del messaggio.",
        variant: "destructive"
      });
    }
  });

  const getTypeBadgeColor = (type: string) => {
    switch (type) {
      case "vendita": return "bg-green-600";
      case "affitto": return "bg-blue-600";
      case "casa_vacanza": return "bg-orange-500";
      default: return "bg-gray-600";
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "vendita": return "Vendita";
      case "affitto": return "Affitto";
      case "casa_vacanza": return "Casa Vacanza";
      default: return type;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    contactMutation.mutate(contactForm);
  };

  if (isNaN(propertyId)) {
    return (
      <div className="min-h-screen bg-white">
        <Navigation />
        <div className="pt-20 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Proprietà non trovata</h1>
            <Link href="/">
              <Button>Torna alle proprietà</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <Navigation />
        <div className="pt-20">
          {/* Loading skeleton */}
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Skeleton className="h-8 w-32 mb-6" />
            <Skeleton className="h-10 w-3/4 mb-4" />
            <div className="grid grid-cols-2 gap-4 mb-8">
              <Skeleton className="col-span-2 h-96" />
              <Skeleton className="h-48" />
              <Skeleton className="h-48" />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-4">
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-32 w-full" />
              </div>
              <Skeleton className="h-64" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="min-h-screen bg-white">
        <Navigation />
        <div className="pt-20 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Proprietà non trovata</h1>
            <p className="text-gray-600 mb-6">La proprietà che stai cercando non esiste o non è più disponibile.</p>
            <Link href="/">
              <Button>Torna alle proprietà</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <main className="pt-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Back Button */}
          <Link href="/">
            <Button variant="ghost" className="mb-6">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Torna alle proprietà
            </Button>
          </Link>

          {/* Header */}
          <div className="flex justify-between items-start mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{property.title}</h1>
              <div className="flex items-center space-x-4 mb-4">
                <span className="text-3xl font-bold text-blue-600">
                  {formatPrice(property.price, property.type, property.priceType)}
                </span>
                <Badge className={`${getTypeBadgeColor(property.type)} text-white`}>
                  {getTypeLabel(property.type)}
                </Badge>
              </div>
              <p className="text-gray-600 flex items-center">
                <MapPin className="h-4 w-4 mr-2" />
                {property.address}
              </p>
            </div>
            <Button variant="ghost" size="sm" className="text-gray-600">
              <Heart className="h-5 w-5" />
            </Button>
          </div>

          {/* Photo Gallery */}
          <div className="mb-8">
            <div className="grid grid-cols-2 gap-4">
              <div 
                className="col-span-2 h-96 bg-cover bg-center rounded-xl"
                style={{ backgroundImage: `url('${property.images[0]}')` }}
              />
              {property.images.slice(1, 3).map((image, index) => (
                <div 
                  key={index}
                  className="h-48 bg-cover bg-center rounded-xl"
                  style={{ backgroundImage: `url('${image}')` }}
                />
              ))}
            </div>
            <div className="mt-4 text-center">
              <Button variant="outline">
                <Images className="mr-2 h-4 w-4" />
                Visualizza tutte le {property.images.length} foto
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Property Details */}
            <div>
              <div className="mb-6">
                <div className="flex items-center space-x-6 text-gray-600 mb-6">
                  <span className="flex items-center">
                    <Bed className="h-5 w-5 mr-2" />
                    {property.bedrooms} camere
                  </span>
                  <span className="flex items-center">
                    <Bath className="h-5 w-5 mr-2" />
                    {property.bathrooms} bagni
                  </span>
                  <span className="flex items-center">
                    <Square className="h-5 w-5 mr-2" />
                    {property.area} mq
                  </span>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-4">Descrizione</h3>
                <p className="text-gray-700 leading-relaxed">
                  {property.description}
                </p>
              </div>

              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-4">Caratteristiche</h3>
                <div className="grid grid-cols-2 gap-4">
                  {property.features.map((feature, index) => (
                    <div key={index} className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Video and Contact */}
            <div>
              {/* Video Section */}
              {property.youtubeVideoId && (
                <div className="mb-8">
                  <h3 className="text-xl font-semibold mb-4">Video Tour</h3>
                  <div className="aspect-video bg-gray-100 rounded-xl overflow-hidden">
                    <iframe 
                      className="w-full h-full"
                      src={`https://www.youtube.com/embed/${property.youtubeVideoId}`}
                      title="Video Tour"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                  <p className="text-sm text-gray-600 mt-2">
                    Tour virtuale della proprietà con riprese aeree e dettagli degli interni
                  </p>
                </div>
              )}

              {/* Contact Form */}
              <Card className="bg-gray-50">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-4">Contatta l'Agente</h3>
                  <div className="flex items-center mb-4">
                    {property.agentImage && (
                      <img 
                        src={property.agentImage}
                        alt={property.agentName}
                        className="w-16 h-16 rounded-full object-cover mr-4"
                      />
                    )}
                    <div>
                      <h4 className="font-semibold text-gray-900">{property.agentName}</h4>
                      <p className="text-gray-600">Agente Immobiliare Senior</p>
                    </div>
                  </div>
                  
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                      placeholder="Nome e Cognome"
                      value={contactForm.name}
                      onChange={(e) => setContactForm(prev => ({ ...prev, name: e.target.value }))}
                      required
                    />
                    <Input
                      type="email"
                      placeholder="Email"
                      value={contactForm.email}
                      onChange={(e) => setContactForm(prev => ({ ...prev, email: e.target.value }))}
                      required
                    />
                    <Input
                      type="tel"
                      placeholder="Telefono"
                      value={contactForm.phone}
                      onChange={(e) => setContactForm(prev => ({ ...prev, phone: e.target.value }))}
                    />
                    <Textarea
                      placeholder="Messaggio..."
                      rows={4}
                      value={contactForm.message}
                      onChange={(e) => setContactForm(prev => ({ ...prev, message: e.target.value }))}
                      required
                    />
                    <Button 
                      type="submit" 
                      className="w-full bg-blue-600 hover:bg-blue-700"
                      disabled={contactMutation.isPending}
                    >
                      {contactMutation.isPending ? "Invio..." : "Invia Richiesta"}
                    </Button>
                  </form>
                  
                  <div className="mt-4 flex items-center justify-center space-x-4 text-sm text-gray-600">
                    <a 
                      href={`tel:${property.agentPhone}`} 
                      className="flex items-center hover:text-blue-600 transition-colors"
                    >
                      <Phone className="h-4 w-4 mr-1" />
                      {property.agentPhone}
                    </a>
                    <a 
                      href={`mailto:${property.agentEmail}`} 
                      className="flex items-center hover:text-blue-600 transition-colors"
                    >
                      <Mail className="h-4 w-4 mr-1" />
                      Email
                    </a>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
