import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Clock, Star } from "lucide-react";
import type { Travel } from "@shared/schema";
import { formatPrice } from "@/lib/types";
import { Link } from "wouter";

interface TravelCardProps {
  travel: Travel;
}

export function TravelCard({ travel }: TravelCardProps) {
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
  const firstImage = travel.images && travel.images.length > 0 
    ? travel.images[0] 
    : 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?ixlib=rb-4.0.3&auto=format&fit=crop&w=800';
  
  return (
    <Link href={travelUrl} className="block">
      <Card className="overflow-hidden cursor-pointer group border border-gray-200 hover:shadow-xl transition-all duration-300 h-full flex flex-col bg-white">
        {/* Immagine */}
        <div className="relative h-56 overflow-hidden flex-shrink-0">
          <img 
            src={firstImage}
            alt={travel.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          
          {/* Badge tipo in alto a sinistra */}
          <div className="absolute top-3 left-3">
            <Badge className={`${getBadgeColor(travel.type)} text-white px-3 py-1 text-xs font-bold uppercase tracking-wider`}>
              {getBadgeLabel(travel.type)}
            </Badge>
          </div>
        </div>

        {/* Card Content */}
        <CardContent className="p-5 flex-1 flex flex-col">
          {/* Stelle e recensioni */}
          <div className="flex items-center gap-2 mb-3">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  className={`h-4 w-4 ${i < Math.floor(rating) ? 'fill-yellow-400 text-yellow-400' : i < rating ? 'fill-yellow-400/50 text-yellow-400' : 'fill-gray-200 text-gray-200'}`}
                />
              ))}
            </div>
            <span className="text-sm text-gray-600">
              ({reviewsCount} Review{reviewsCount !== 1 ? 's' : ''})
            </span>
          </div>

          {/* Titolo */}
          <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-primary transition-colors line-clamp-2">
            {travel.title}
          </h3>

          {/* Descrizione breve */}
          <p className="text-gray-600 text-sm mb-4 line-clamp-3 flex-1">
            {travel.description}
          </p>

          {/* Footer: Durata e Prezzo */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            <div className="flex items-center text-gray-600 text-sm">
              <Clock className="h-4 w-4 mr-1" />
              <span>{travel.duration} {travel.duration === 1 ? 'giorno' : 'giorni'}</span>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-blue-600">
                {formatPrice(travel.price, travel.type, travel.priceType || undefined)}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
