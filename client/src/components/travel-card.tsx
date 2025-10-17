import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, Star, Users, MapPin, Calendar, Share2 } from "lucide-react";
import type { Travel } from "@shared/schema";
import { formatPrice } from "@/lib/types";
import { Link } from "wouter";
import { shareOnWhatsApp } from "@/lib/whatsapp";

interface TravelCardProps {
  travel: Travel;
  priority?: boolean;
}

export function TravelCard({ travel, priority = false }: TravelCardProps) {
  const getBadgeLabel = (type: string) => {
    switch (type) {
      case "mare": return "MARE";
      case "montagna": return "MONTAGNA";
      case "citta": return "CITTÀ";
      case "cultura": return "CULTURA";
      case "avventura": return "AVVENTURA";
      case "relax": return "RELAX";
      default: return "TOUR";
    }
  };

  const getBadgeColor = (type: string) => {
    switch (type) {
      case "mare": return "bg-gradient-to-r from-blue-500 to-cyan-400";
      case "montagna": return "bg-gradient-to-r from-green-600 to-emerald-400";
      case "citta": return "bg-gradient-to-r from-purple-600 to-pink-500";
      case "cultura": return "bg-gradient-to-r from-orange-500 to-amber-400";
      case "avventura": return "bg-gradient-to-r from-red-600 to-orange-500";
      case "relax": return "bg-gradient-to-r from-teal-500 to-cyan-400";
      default: return "bg-gradient-to-r from-blue-500 to-cyan-400";
    }
  };

  // Rating come numero
  const rating = parseFloat(travel.rating || "0");
  const reviewsCount = travel.reviewsCount || 0;

  // URL viaggio
  const travelUrl = `/travel/${travel.id}`;
  
  // Gestione sicura delle immagini con fallback
  const getImageUrl = () => {
    if (travel.images && travel.images.length > 0 && travel.images[0]) {
      const img = travel.images[0];
      if (img.startsWith('http://') || img.startsWith('https://')) {
        return img;
      }
      return img;
    }
    return 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?ixlib=rb-4.0.3&auto=format&fit=crop&w=800';
  };
  
  const firstImage = getImageUrl();
  
  return (
    <Card className="overflow-hidden group border-2 border-gray-200 hover:border-blue-400 hover:shadow-2xl transition-all duration-500 h-full flex flex-col bg-white rounded-3xl relative transform hover:-translate-y-2">
        {/* Immagine con overlay gradient e badge */}
        <Link href={travelUrl} className="block">
          <div className="relative h-64 overflow-hidden flex-shrink-0 cursor-pointer bg-gray-200">
            {/* Immagine */}
            <img 
              src={firstImage}
              alt={travel.title}
              loading={priority ? "eager" : "lazy"}
              decoding="async"
              className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:brightness-110"
              onError={(e) => {
                e.currentTarget.src = 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?ixlib=rb-4.0.3&auto=format&fit=crop&w=800';
              }}
            />
            
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/20 group-hover:from-black/70 transition-all duration-500"></div>
            
            {/* Badge tipo in alto a sinistra */}
            <div className="absolute top-4 left-4 z-10">
              <Badge className={`${getBadgeColor(travel.type)} text-white px-4 py-2 text-xs font-bold uppercase tracking-widest shadow-lg border-0`}>
                {getBadgeLabel(travel.type)}
              </Badge>
            </div>

            {/* Pulsante condivisione in alto a destra */}
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                shareOnWhatsApp(travel, travelUrl);
              }}
              className="absolute top-4 right-4 z-10 w-10 h-10 bg-white/90 backdrop-blur-sm hover:bg-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-200 group/share"
              data-testid={`button-share-${travel.id}`}
              title="Condividi su WhatsApp"
            >
              <Share2 className="h-5 w-5 text-green-600 group-hover/share:scale-110 transition-transform" />
            </button>

            {/* Prezzo in basso a destra sull'immagine */}
            <div className="absolute bottom-4 right-4 z-10 bg-white rounded-2xl px-5 py-3 shadow-xl">
              <div className="text-xs text-gray-600 font-medium mb-0.5">Da</div>
              <div className="text-2xl font-bold text-blue-600">
                {formatPrice(travel.price, travel.type, travel.priceType || undefined)}
              </div>
            </div>
          </div>
        </Link>

        {/* Card Content */}
        <CardContent className="p-6 flex-1 flex flex-col">
          {/* Stelle e recensioni */}
          <div className="flex items-center gap-2 mb-3">
            <div className="flex items-center gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  className={`h-4 w-4 ${
                    i < Math.floor(rating) 
                      ? 'fill-amber-400 text-amber-400' 
                      : i < rating 
                        ? 'fill-amber-400/50 text-amber-400' 
                        : 'fill-gray-200 text-gray-200'
                  }`}
                />
              ))}
            </div>
            {reviewsCount > 0 && (
              <span className="text-xs text-gray-500 font-medium">
                ({reviewsCount})
              </span>
            )}
          </div>

          {/* Titolo */}
          <Link href={travelUrl}>
            <h3 className="text-xl font-bold text-gray-900 mb-3 hover:text-blue-600 transition-colors line-clamp-2 cursor-pointer leading-tight min-h-[3.5rem]">
              {travel.title}
            </h3>
          </Link>

          {/* Info Tour - Grid 2 colonne */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            {/* Durata */}
            <div className="flex items-center gap-2 bg-blue-50 rounded-xl p-3">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <Clock className="h-4 w-4 text-blue-600" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs text-gray-500 font-medium">Durata</div>
                <div className="text-sm font-bold text-gray-900 truncate">
                  {travel.duration} {travel.duration === 1 ? 'giorno' : 'giorni'}
                </div>
              </div>
            </div>

            {/* Partecipanti */}
            {travel.maxParticipants && (
              <div className="flex items-center gap-2 bg-green-50 rounded-xl p-3">
                <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <Users className="h-4 w-4 text-green-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs text-gray-500 font-medium">Max</div>
                  <div className="text-sm font-bold text-gray-900 truncate">
                    {travel.maxParticipants} pers.
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Descrizione breve */}
          <Link href={travelUrl}>
            <p className="text-gray-600 text-sm mb-5 line-clamp-2 flex-1 cursor-pointer leading-relaxed">
              {travel.description}
            </p>
          </Link>

          {/* Pulsante SCOPRI TOUR */}
          <Link href={travelUrl}>
            <Button 
              className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white font-bold py-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] text-base rounded-2xl"
              data-testid={`button-discover-${travel.id}`}
            >
              SCOPRI TOUR
            </Button>
          </Link>
        </CardContent>
      </Card>
  );
}
