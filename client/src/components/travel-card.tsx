import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, Star } from "lucide-react";
import type { Travel } from "@shared/schema";
import { formatPrice } from "@/lib/types";
import { Link } from "wouter";

interface TravelCardProps {
  travel: Travel;
  priority?: boolean;
}

export function TravelCard({ travel, priority = false }: TravelCardProps) {
  const getBadgeLabel = (type: string) => {
    switch (type) {
      case "mare": return "BEACH";
      case "montagna": return "MOUNTAIN";
      case "citta": return "CITY";
      case "cultura": return "CULTURE";
      case "avventura": return "ADVENTURE";
      case "relax": return "RELAX";
      default: return "GUIDED";
    }
  };

  const getBadgeColor = (type: string) => {
    switch (type) {
      case "mare": return "bg-blue-500";
      case "montagna": return "bg-green-500";
      case "citta": return "bg-purple-500";
      case "cultura": return "bg-orange-500";
      case "avventura": return "bg-red-500";
      case "relax": return "bg-teal-500";
      default: return "bg-blue-500";
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
      // Se l'immagine inizia con http/https, usala direttamente
      if (img.startsWith('http://') || img.startsWith('https://')) {
        return img;
      }
      // Usa il path diretto (le immagini sono servite da /uploads/)
      return img;
    }
    return 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?ixlib=rb-4.0.3&auto=format&fit=crop&w=800';
  };
  
  const firstImage = getImageUrl();
  
  return (
    <Card className="overflow-hidden group border border-gray-200 hover:shadow-2xl card-hover h-full flex flex-col bg-white rounded-2xl relative">
        {/* Immagine con badge */}
        <Link href={travelUrl} className="block">
          <div className="relative h-56 overflow-hidden rounded-t-2xl flex-shrink-0 cursor-pointer bg-gray-200">
            <img 
              src={firstImage}
              alt={travel.title}
              loading={priority ? "eager" : "lazy"}
              decoding="async"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              onError={(e) => {
                // Fallback se l'immagine non carica
                e.currentTarget.src = 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?ixlib=rb-4.0.3&auto=format&fit=crop&w=800';
              }}
            />
            
            {/* Badge tipo in basso a sinistra sull'immagine */}
            <div className="absolute bottom-3 left-3">
              <Badge className={`${getBadgeColor(travel.type)} text-white px-3 py-1 text-xs font-bold uppercase tracking-wider`}>
                {getBadgeLabel(travel.type)}
              </Badge>
            </div>
          </div>
        </Link>

        {/* Card Content */}
        <CardContent className="p-5 flex-1 flex flex-col">
          {/* Stelle e recensioni */}
          <div className="flex items-center gap-2 mb-3">
            <div className="flex items-center gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  className={`h-5 w-5 ${
                    i < Math.floor(rating) 
                      ? 'fill-orange-400 text-orange-400' 
                      : i < rating 
                        ? 'fill-orange-400/50 text-orange-400' 
                        : 'fill-gray-200 text-gray-200'
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-gray-600">
              ({reviewsCount} Review{reviewsCount !== 1 ? 's' : ''})
            </span>
          </div>

          {/* Titolo */}
          <Link href={travelUrl}>
            <h3 className="text-xl font-bold text-[#1e3a8a] mb-3 hover:text-blue-600 transition-colors line-clamp-1 cursor-pointer">
              {travel.title}
            </h3>
          </Link>

          {/* Descrizione breve */}
          <Link href={travelUrl}>
            <p className="text-gray-600 text-sm mb-4 line-clamp-3 flex-1 cursor-pointer">
              {travel.description}
            </p>
          </Link>

          {/* Footer: Durata, Prezzo e Pulsante */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center text-gray-600 text-sm gap-1">
                <Clock className="h-4 w-4" />
                <span>{travel.duration} {travel.duration === 1 ? 'day' : 'days'} {travel.duration > 1 ? Math.floor(travel.duration / 2) : '0'} nights</span>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-[#3b82f6]">
                  {formatPrice(travel.price, travel.type, travel.priceType || undefined)}
                </div>
              </div>
            </div>

            {/* Pulsante SCOPRI TOUR */}
            <Link href={travelUrl}>
              <Button 
                className="w-full bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-700 hover:to-orange-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                data-testid={`button-discover-${travel.id}`}
              >
                SCOPRI TOUR
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
  );
}
