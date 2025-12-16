import { useState, useCallback, useEffect } from "react";
import { useParams, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, MapPin, Clock, Users, Calendar, Heart, Star, Plane, CheckCircle, XCircle, ShoppingCart, Phone, Share2, ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { PhotoGallery } from "@/components/PhotoGallery";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import type { Travel, Addon } from "@shared/schema";
import { formatPrice, formatDuration, getTravelTypeIcon, getCategoryIcon } from "@/lib/types";
import { Link } from "wouter";
import { SEOHead } from "@/components/seo-head";
import { AnnouncementBar } from "@/components/announcement-bar";
import { shareOnWhatsApp } from "@/lib/whatsapp";
import { useCart, type SelectedAddon } from "@/contexts/cart-context";
import { useToast } from "@/hooks/use-toast";
import useEmblaCarousel from "embla-carousel-react";

export default function TravelDetail() {
  const params = useParams();
  const [, setLocation] = useLocation();
  const travelId = params.id;
  const { addToCart } = useCart();
  const { toast } = useToast();
  const [showCartDialog, setShowCartDialog] = useState(false);

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedAddons, setSelectedAddons] = useState<SelectedAddon[]>([]);

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

  // Fetch add-ons for this travel
  const { data: travelAddons = [] } = useQuery<Addon[]>({
    queryKey: ["/api/travels", travel?.id, "addons"],
    queryFn: async () => {
      if (!travel?.id) return [];
      const res = await fetch(`/api/travels/${travel.id}/addons`);
      if (!res.ok) return [];
      return res.json();
    },
    enabled: !!travel?.id,
  });

  // Fetch all tours for related section
  const { data: allTravels } = useQuery<Travel[]>({
    queryKey: ['/api/travels'],
  });

  // Embla carousel for related tours
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: 'start',
    slidesToScroll: 1,
    containScroll: 'trimSnaps',
  });

  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);
  }, [emblaApi, onSelect]);

  // Filter related tours (excluding current)
  const relatedTours = allTravels?.filter(t => 
    t.id !== travel?.id
  ).slice(0, 8) || [];

  const convertImageUrl = (url: string) => {
    if (!url) return "/placeholder-tour.jpg";
    return url.replace('/public-objects/', '/api/images/');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <AnnouncementBar />
        <Navigation />
        <main className="pt-20 lg:pt-[148px]">
          <div className="flex items-center justify-center min-h-[50vh]">
            <div className="animate-spin w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p>Caricamento tour...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !travel) {
    return (
      <div className="min-h-screen bg-background">
        <AnnouncementBar />
        <Navigation />
        <main className="pt-20 lg:pt-[148px]">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold mb-4">Tour non trovato</h1>
            <Link href="/viaggi">
              <Button>Torna ai tour</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

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

  const toggleAddon = (addon: Addon) => {
    setSelectedAddons(prev => {
      const existing = prev.find(sa => sa.addon.id === addon.id);
      if (existing) {
        return prev.filter(sa => sa.addon.id !== addon.id);
      }
      return [...prev, { addon, quantity: 1 }];
    });
  };

  const isAddonSelected = (addonId: number) => {
    return selectedAddons.some(sa => sa.addon.id === addonId);
  };

  const getSelectedAddonsTotal = () => {
    return selectedAddons.reduce((total, sa) => {
      return total + (Number(sa.addon.price) || 0) * sa.quantity;
    }, 0);
  };

  const handleAddToCart = () => {
    addToCart(travel, 1, undefined, selectedAddons.length > 0 ? selectedAddons : undefined);
    setShowCartDialog(true);
    toast({
      title: "Aggiunto al carrello!",
      description: selectedAddons.length > 0 
        ? `${travel.title} + ${selectedAddons.length} servizi`
        : travel.title
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <SEOHead 
        title={travel.metaTitle || `${travel.title} - ${travel.destination} | Si Viaggia con Desi`}
        description={travel.metaDescription || `${travel.description.substring(0, 160)}...`}
        keywords={`tour ${travel.destination}, ${travel.country}, ${getTypeLabel(travel.type)}, escursione, si viaggia con desy`}
        canonicalUrl={`https://siviaggiacondesy.com/travel/${travel.id}`}
      />
      <AnnouncementBar />
      <Navigation />
      
      <main className="pt-20 lg:pt-[148px]">
        {/* Back Button */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Button
            variant="ghost"
            onClick={() => setLocation('/viaggi')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-4 w-4" />
            Torna ai tour
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
                <h1 className="text-3xl md:text-4xl font-bold gold-title mb-4 tracking-wide uppercase drop-shadow-lg font-eagle-lake">
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

              {/* Servizi Extra Section */}
              {travelAddons.length > 0 && (
                <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-5 border border-amber-200">
                  <h3 className="text-lg font-bold text-amber-800 mb-4 flex items-center gap-2">
                    <Plus className="h-5 w-5" />
                    Servizi Extra
                  </h3>
                  <div className="space-y-3">
                    {travelAddons.map((addon) => (
                      <div 
                        key={addon.id}
                        className={`flex items-center justify-between p-4 rounded-lg cursor-pointer transition-all ${
                          isAddonSelected(addon.id) 
                            ? 'bg-amber-100 border-2 border-amber-400' 
                            : 'bg-white border border-gray-200 hover:border-amber-300'
                        }`}
                        onClick={() => toggleAddon(addon)}
                        data-testid={`addon-${addon.id}`}
                      >
                        <div className="flex items-center gap-3">
                          <Checkbox 
                            checked={isAddonSelected(addon.id)}
                            className="data-[state=checked]:bg-amber-600 data-[state=checked]:border-amber-600"
                          />
                          <div>
                            <p className="font-semibold text-gray-800">{addon.name}</p>
                            {addon.description && (
                              <p className="text-sm text-gray-500">{addon.description}</p>
                            )}
                          </div>
                        </div>
                        <span className="font-bold text-amber-700 text-lg">
                          +€{parseFloat(addon.price).toLocaleString("it-IT", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </span>
                      </div>
                    ))}
                  </div>
                  
                  {selectedAddons.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-amber-200">
                      <div className="flex justify-between items-center text-amber-800">
                        <span className="font-medium">Servizi selezionati:</span>
                        <span className="font-bold text-lg">
                          +€{getSelectedAddonsTotal().toLocaleString("it-IT", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-gray-900 mt-2 pt-2 border-t border-amber-200">
                        <span className="font-bold">Totale:</span>
                        <span className="font-bold text-xl text-blue-600">
                          €{(parseFloat(travel.price) + getSelectedAddonsTotal()).toLocaleString("it-IT", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Action Button */}
              <div className="flex justify-center">
                <Button 
                  onClick={handleAddToCart}
                  className="w-full max-w-md bg-gradient-to-r from-[#D4AF37] to-[#E6C87F] hover:from-[#C9A961] hover:to-[#D4AF37] text-white py-4 text-lg font-semibold shadow-lg"
                  data-testid="button-add-to-cart"
                >
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  Aggiungi al Carrello
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Description and Details */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="space-y-8">
            {/* Description + Info Pratiche Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Description - Takes 2 columns on desktop */}
              <Card className="border-none shadow-lg lg:col-span-2">
                <CardHeader className="bg-gradient-to-r from-[#1e3a5f] to-[#2c4a6f]">
                  <CardTitle className="text-2xl font-bold text-[#D4AF37] tracking-wide uppercase font-eagle-lake drop-shadow-md">Dettagli escursione</CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <p className="text-gray-700 text-lg leading-relaxed whitespace-pre-line">
                    {travel.description}
                  </p>
                </CardContent>
              </Card>

              {/* Info Pratiche Sidebar - Takes 1 column on desktop */}
              {travel.includedServices && travel.includedServices.length > 0 && (
                <Card className="border-none shadow-lg h-fit">
                  <CardHeader className="bg-gradient-to-r from-[#D4AF37] to-[#E6C87F]">
                    <CardTitle className="text-xl font-bold text-white tracking-wide uppercase font-eagle-lake drop-shadow-md">Info pratiche</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <ul className="space-y-3">
                      {travel.includedServices.map((info, index) => {
                        const parts = info.split(':');
                        const hasLabel = parts.length > 1;
                        const label = hasLabel ? parts[0].trim() : null;
                        const content = hasLabel ? parts.slice(1).join(':').trim() : info;
                        
                        return (
                          <li key={index} className="flex items-start gap-2 text-gray-700">
                            <span className="text-[#1e3a5f] mt-1">•</span>
                            <span>
                              {label && <strong className="text-[#1e3a5f]">{label}:</strong>} {content}
                            </span>
                          </li>
                        );
                      })}
                    </ul>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Features Included */}
            {travel.features && travel.features.length > 0 && (
              <Card className="border-none shadow-lg">
                <CardHeader className="bg-gradient-to-r from-emerald-600 to-teal-500">
                  <CardTitle className="text-2xl font-bold text-white tracking-wide uppercase flex items-center gap-2 font-eagle-lake drop-shadow-md">
                    <CheckCircle className="h-6 w-6 text-white" />
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
            <Card className="border border-[#D4AF37]/30 shadow-xl bg-gradient-to-r from-[#1e3a5f] to-[#2c5278]">
              <CardContent className="py-8">
                <div className="text-center space-y-6">
                  <h3 className="text-2xl font-bold text-[#D4AF37] tracking-[0.15em] uppercase drop-shadow-lg font-eagle-lake">Pronto a Partire?</h3>
                  
                  {/* Perché scegliere section */}
                  <div className="bg-white/95 rounded-xl p-6 text-left max-w-2xl mx-auto shadow-lg">
                    <h4 className="text-xl font-bold text-gray-900 mb-4">Perché scegliere Si Viaggia con Desi</h4>
                    <ul className="space-y-2 text-gray-800">
                      <li className="flex items-start gap-2">
                        <span className="text-gray-900 mt-1">•</span>
                        <span>Escursioni autentiche in <strong className="text-gray-900">piccoli gruppi</strong>, curate nei dettagli</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-gray-900 mt-1">•</span>
                        <span>Trasferimenti con bus climatizzati e assistenza continua</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-gray-900 mt-1">•</span>
                        <span>Guide qualificate e consigli pratici su <strong className="text-gray-900">cosa portare</strong></span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-gray-900 mt-1">•</span>
                        <span>Pacchetti combinati per vivere più esperienze a un prezzo unico</span>
                      </li>
                    </ul>
                  </div>

                  <p className="text-white/90 text-lg font-light">Aggiungi al carrello e completa il pagamento!</p>
                  <div className="flex justify-center pt-4">
                    <Button 
                      size="lg"
                      onClick={handleAddToCart}
                      className="bg-gradient-to-r from-[#D4AF37] to-[#E6C87F] text-white hover:from-[#C9A961] hover:to-[#D4AF37] font-semibold shadow-lg"
                      data-testid="button-add-cart-cta"
                    >
                      <ShoppingCart className="h-5 w-5 mr-2" />
                      Aggiungi al Carrello
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Related Tours Carousel */}
            {relatedTours.length > 0 && (
              <div className="py-8">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold gold-title tracking-[0.1em] uppercase drop-shadow-lg font-eagle-lake">
                    Altri Tour ed Escursioni
                  </h3>
                  <div className="hidden md:flex gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={scrollPrev}
                      disabled={!canScrollPrev}
                      className="rounded-full border-[#D4AF37]/50 hover:bg-[#D4AF37]/10 disabled:opacity-30"
                      data-testid="carousel-prev"
                    >
                      <ChevronLeft className="h-5 w-5 text-[#D4AF37]" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={scrollNext}
                      disabled={!canScrollNext}
                      className="rounded-full border-[#D4AF37]/50 hover:bg-[#D4AF37]/10 disabled:opacity-30"
                      data-testid="carousel-next"
                    >
                      <ChevronRight className="h-5 w-5 text-[#D4AF37]" />
                    </Button>
                  </div>
                </div>

                <div className="overflow-hidden" ref={emblaRef}>
                  <div className="flex gap-4 touch-pan-y">
                    {relatedTours.map((tour) => (
                      <Link 
                        key={tour.id} 
                        href={`/travel/${tour.id}`}
                        className="flex-none w-[280px] sm:w-[300px] md:w-[320px]"
                      >
                        <Card className="h-full overflow-hidden group cursor-pointer border border-gray-100 hover:border-[#D4AF37]/50 hover:shadow-xl transition-all duration-300">
                          <div className="relative aspect-[4/3] overflow-hidden">
                            <img
                              src={convertImageUrl(tour.images?.[0] || "")}
                              alt={tour.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                              loading="lazy"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                            <div className="absolute bottom-3 left-3 right-3">
                              <Badge className="bg-[#D4AF37] text-white text-xs mb-2">
                                {tour.type === "mare" ? "Mare" : 
                                 tour.type === "deserto" ? "Deserto" :
                                 tour.type === "citta" ? "Città" :
                                 tour.type === "avventura" ? "Avventura" :
                                 tour.type === "relax" ? "Relax" :
                                 tour.type === "cultura" ? "Cultura" : tour.type}
                              </Badge>
                            </div>
                          </div>
                          <CardContent className="p-4">
                            <h4 className="font-semibold text-gray-900 line-clamp-2 mb-2 group-hover:text-[#D4AF37] transition-colors">
                              {tour.title}
                            </h4>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-1 text-sm text-gray-500">
                                <MapPin className="h-3.5 w-3.5" />
                                <span className="truncate max-w-[120px]">{tour.destination}</span>
                              </div>
                              <span className="font-bold text-[#D4AF37]">
                                {formatPrice(tour.price, tour.type)}
                              </span>
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Mobile swipe indicator */}
                <p className="text-center text-sm text-gray-400 mt-4 md:hidden">
                  ← Scorri per vedere altri tour →
                </p>
              </div>
            )}

            {/* Contact & Share Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center py-8">
              <a
                href={`https://wa.me/393444585177?text=${encodeURIComponent(`Ciao! Sono interessato al tour "${travel.title}" (${travel.destination}). Potresti darmi più informazioni?`)}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button
                  size="lg"
                  className="bg-green-500 hover:bg-green-600 text-white px-8"
                  data-testid="button-whatsapp-contact"
                >
                  <Phone className="h-5 w-5 mr-2" />
                  Contatta via WhatsApp
                </Button>
              </a>
              <Button
                size="lg"
                onClick={() => shareOnWhatsApp(travel, `/travel/${travel.id}`)}
                className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white px-8"
                data-testid="button-share-tour"
              >
                <Share2 className="h-5 w-5 mr-2" />
                Condividi Tour
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />

      {/* Dialog dopo aggiunta al carrello */}
      <Dialog open={showCartDialog} onOpenChange={setShowCartDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-xl font-bold text-green-600 flex items-center justify-center gap-2">
              <CheckCircle className="h-6 w-6" />
              Aggiunto al Carrello!
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <p className="text-center text-gray-600">
              <strong>{travel.title}</strong> è stato aggiunto al tuo carrello.
            </p>
            <div className="flex flex-col gap-3">
              <Button
                onClick={() => {
                  setShowCartDialog(false);
                  setLocation('/carrello');
                }}
                className="w-full bg-gradient-to-r from-[#D4AF37] to-[#E6C87F] hover:from-[#C9A961] hover:to-[#D4AF37] text-white py-3"
                data-testid="button-go-to-cart"
              >
                <ShoppingCart className="h-5 w-5 mr-2" />
                Vai al Carrello e Completa il Pagamento
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowCartDialog(false)}
                className="w-full border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37]/10"
                data-testid="button-continue-shopping"
              >
                Continua ad Esplorare
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}