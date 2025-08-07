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
  
  // Support both old ID-based URLs and new slug-based URLs
  const propertyId = params.id ? parseInt(params.id as string) : null;
  const slug = params.id ? null : `${params.type}/${params.municipality}/${params.propertyType}`;

  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: ""
  });

  const { data: property, isLoading, error } = useQuery<Property>({
    queryKey: propertyId ? ['/api/properties/id', propertyId] : ['/api/properties/slug', slug],
    queryFn: async () => {
      const apiUrl = propertyId ? `/api/properties/id/${propertyId}` : `/api/properties/slug/${slug}`;
      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error('Property not found');
      }
      return response.json();
    },
    enabled: !!(propertyId || slug)
  });

  // Fetch property images from the new table
  const { data: propertyImages = [] } = useQuery({
    queryKey: ['/api/properties', property?.id, 'images'],
    queryFn: async () => {
      if (!property) return [];
      const response = await fetch(`/api/properties/${property.id}/images`);
      if (!response.ok) {
        console.log('Failed to fetch property images:', response.status);
        return [];
      }
      const images = await response.json();
      console.log('Fetched property images:', images);
      return images;
    },
    enabled: !!property
  });

  const contactMutation = useMutation({
    mutationFn: async (data: typeof contactForm) => {
      return apiRequest('POST', '/api/contact', {
        ...data,
        propertyId: property?.id
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

  // Don't check for invalid ID since we support slug-based URLs now

  if (isLoading) return <div>Caricamento...</div>;
  if (error) return <div>Errore nel caricamento della proprietà</div>;
  if (!property) return <div>Proprietà non trovata</div>;

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    "name": property.title,
    "description": property.description,
    "url": property.slug ? `https://agenzia2acireale.com/${property.slug}` : `https://agenzia2acireale.com/property/${property.id}`,
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
        title={property.metaTitle || `${property.title} - ${property.municipality} | AGENZIA 2 Acireale`}
        description={property.metaDescription || `${property.type === 'vendita' ? '🏠 Casa in vendita' : property.type === 'affitto' ? '🏠 Casa in affitto' : '🏖️ Casa vacanza'} a ${property.municipality}. ${property.bedrooms} camere, ${property.area}mq. Prezzo: €${Number(property.price).toLocaleString()}. ${property.description?.slice(0, 100)}...`}
        keywords={`${property.title}, casa ${property.type} ${property.municipality}, immobile ${property.municipality}, ${property.bedrooms} camere ${property.municipality}, AGENZIA 2 Acireale`}
        canonicalUrl={property.slug ? `https://agenzia2acireale.com/${property.slug}` : `https://agenzia2acireale.com/property/${property.id}`}
        ogImage={property.images?.[0] ? `https://agenzia2acireale.com${property.images[0]}` : undefined}
        type="article"
        structuredData={structuredData}
      />
      <Navigation />
      <main className="pt-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Back Button */}
          <Link href="/properties">
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
              {property.address && property.address.trim() !== "" && (
                <p className="text-gray-600 flex items-center">
                  <MapPin className="h-4 w-4 mr-2" />
                  {property.address}
                </p>
              )}
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

                  <Button
                    type="submit"
                    disabled={contactMutation.isPending}
                    className="w-full h-12 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <Send className="mr-2 h-5 w-5" />
                    {contactMutation.isPending ? 'Invio in corso...' : 'INVIA RICHIESTA'}
                  </Button>
                </form>

                <div className="mt-8 pt-6 border-t border-gray-200 text-center">
                  <p className="text-sm text-gray-500">
                    Disponibile Lun-Ven 9:00-19:00
                  </p>
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