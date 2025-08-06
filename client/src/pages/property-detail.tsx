import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "wouter";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { SEOHead } from "@/components/seo-head";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { PhotoGallery } from "@/components/PhotoGallery";
import type { Property } from "@shared/schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  ArrowLeft, MapPin, Bed, Bath, Square, Images, 
  CheckCircle, Phone, Mail, Heart, Send
} from "lucide-react";
import { formatPrice } from "@/lib/types";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { generateWhatsAppLink } from "@/lib/whatsapp";

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

  // Fetch property images from the new table
  const { data: propertyImages = [] } = useQuery({
    queryKey: ['/api/properties', propertyId, 'images'],
    queryFn: async () => {
      const response = await fetch(`/api/properties/${propertyId}/images`);
      if (!response.ok) {
        console.log('Failed to fetch property images:', response.status);
        return [];
      }
      const images = await response.json();
      console.log('Fetched property images:', images);
      return images;
    },
    enabled: !!propertyId
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

  if (isLoading) return <div>Caricamento...</div>;
  if (error) return <div>Errore nel caricamento della proprietà</div>;
  if (!property) return <div>Proprietà non trovata</div>;

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    "name": property.title,
    "description": property.description,
    "url": `https://agenzia2acireale.com/property/${property.id}`,
    "image": property.images?.[0] ? `https://agenzia2acireale.com${property.images[0]}` : undefined,
    "price": property.price,
    "priceCurrency": "EUR",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": property.municipality,
      "addressRegion": "Sicilia",
      "addressCountry": "IT"
    },
    "floorSize": {
      "@type": "QuantitativeValue",
      "value": property.area,
      "unitCode": "MTK"
    },
    "numberOfRooms": property.bedrooms,
    "numberOfBathroomsTotal": property.bathrooms,
    "offers": {
      "@type": "Offer",
      "price": property.price,
      "priceCurrency": "EUR",
      "availability": "https://schema.org/InStock",
      "seller": {
        "@type": "RealEstateAgent",
        "name": "AGENZIA 2 Servizi Immobiliari"
      }
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <SEOHead 
        title={`${property.title} - ${property.municipality} | AGENZIA 2 Acireale`}
        description={`${property.type === 'vendita' ? '🏠 Casa in vendita' : property.type === 'affitto' ? '🏠 Casa in affitto' : '🏖️ Casa vacanza'} a ${property.municipality}. ${property.bedrooms} camere, ${property.area}mq. Prezzo: €${Number(property.price).toLocaleString()}. ${property.description?.slice(0, 100)}...`}
        keywords={`${property.title}, casa ${property.type} ${property.municipality}, immobile ${property.municipality}, ${property.bedrooms} camere ${property.municipality}, AGENZIA 2 Acireale`}
        canonicalUrl={`https://agenzia2acireale.com/property/${property.id}`}
        ogImage={property.images?.[0] ? `https://agenzia2acireale.com${property.images[0]}` : undefined}
        type="article"
        structuredData={structuredData}
      />
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
                  {formatPrice(property.price, property.type, property.priceType || undefined)}
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
          <PhotoGallery 
            images={(() => {
              const newImages = propertyImages.length > 0 ? propertyImages.map((img: any) => img.url) : property.images;
              console.log('PhotoGallery images prop:', newImages);
              return newImages;
            })()} 
            title={property.title} 
          />

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
            <div className="space-y-8">
              {/* Video Section */}
              {property.youtubeVideoId && (
                <div className="glass-card rounded-3xl p-8">
                  <div className="flex items-center mb-6">
                    <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center mr-4">
                      <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900">Video Tour Esclusivo</h3>
                      <p className="text-gray-600">Scopri ogni dettaglio della proprietà</p>
                    </div>
                  </div>

                  <div className="aspect-video bg-gray-900 rounded-2xl overflow-hidden shadow-2xl">
                    <iframe 
                      className="w-full h-full"
                      src={`https://www.youtube.com/embed/${property.youtubeVideoId}?rel=0&showinfo=0`}
                      title="Video Tour Esclusivo"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>

                  <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                      Riprese aeree HD
                    </div>
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                      Tour degli interni
                    </div>
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
                      Vista del quartiere
                    </div>
                  </div>
                </div>
              )}

              {/* Modern Contact Form */}
              <div className="glass-card rounded-3xl p-8">
                <div className="mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Richiedi Informazioni</h3>
                  <p className="text-gray-600">Il nostro agente ti contatterà entro 24 ore</p>
                </div>

                <div className="flex items-center p-6 bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl mb-8">
                  {property.agentImage && (
                    <img 
                      src={property.agentImage}
                      alt={property.agentName}
                      className="w-20 h-20 rounded-full object-cover mr-6 ring-4 ring-white shadow-lg"
                    />
                  )}
                  <div>
                    <h4 className="text-xl font-bold text-gray-900">{property.agentName}</h4>
                    <p className="text-purple-600 font-semibold mb-2">Agente Immobiliare Senior</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <span className="flex items-center">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                        Online ora
                      </span>
                      <span>Risposta in 2h</span>
                    </div>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input
                      placeholder="Nome e Cognome"
                      value={contactForm.name}
                      onChange={(e) => setContactForm(prev => ({ ...prev, name: e.target.value }))}
                      className="h-12 rounded-xl border-gray-200"
                      required
                    />
                    <Input
                      type="tel"
                      placeholder="Telefono"
                      value={contactForm.phone}
                      onChange={(e) => setContactForm(prev => ({ ...prev, phone: e.target.value }))}
                      className="h-12 rounded-xl border-gray-200"
                    />
                  </div>

                  <Input
                    type="email"
                    placeholder="Indirizzo Email"
                    value={contactForm.email}
                    onChange={(e) => setContactForm(prev => ({ ...prev, email: e.target.value }))}
                    className="h-12 rounded-xl border-gray-200"
                    required
                  />

                  <Textarea
                    placeholder="Ciao! Sono interessato a questa proprietà. Potreste inviarmi maggiori informazioni?"
                    rows={4}
                    value={contactForm.message}
                    onChange={(e) => setContactForm(prev => ({ ...prev, message: e.target.value }))}
                    className="rounded-xl border-gray-200 resize-none"
                    required
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Button 
                      type="submit" 
                      className="h-12 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                      disabled={contactMutation.isPending}
                    >
                      {contactMutation.isPending ? (
                        <div className="flex items-center">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                          Invio in corso...
                        </div>
                      ) : (
                        <>
                          <Send className="mr-2 h-5 w-5" />
                          INVIA EMAIL
                        </>
                      )}
                    </Button>
                    
                    <Button
                      type="button"
                      onClick={() => window.open(generateWhatsAppLink(property), '_blank')}
                      className="h-12 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      <svg className="mr-2 h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.700"/>
                      </svg>
                      INVIA RICHIESTA
                    </Button>
                  </div>
                </form>

                <div className="mt-8 pt-6 border-t border-gray-200">
                  <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
                    <div className="flex items-center space-x-6">
                      <a 
                        href={`tel:${property.agentPhone}`} 
                        className="flex items-center bg-green-50 text-green-700 px-4 py-2 rounded-xl hover:bg-green-100 transition-colors"
                      >
                        <Phone className="h-4 w-4 mr-2" />
                        Chiama Ora
                      </a>
                      <a 
                        href={`mailto:${property.agentEmail}`} 
                        className="flex items-center bg-blue-50 text-blue-700 px-4 py-2 rounded-xl hover:bg-blue-100 transition-colors"
                      >
                        <Mail className="h-4 w-4 mr-2" />
                        Email
                      </a>
                    </div>
                    <p className="text-sm text-gray-500">
                      Disponibile Lun-Ven 9:00-19:00
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}