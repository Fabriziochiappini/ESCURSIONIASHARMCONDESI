import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, MapPin, Bed, Bath, Square, Images } from "lucide-react";
import type { Property } from "@shared/schema";
import { formatPrice } from "@/lib/types";
import { Link } from "wouter";

interface PropertyCardProps {
  property: Property;
}

export function PropertyCard({ property }: PropertyCardProps) {
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

  return (
    <Link href={`/property/${property.id}`} className="block">
      <Card className="bg-white rounded-xl overflow-hidden cursor-pointer group border shadow-lg hover:shadow-xl transition-all duration-300 h-auto flex flex-col">
        <div className="relative h-40 sm:h-56 overflow-hidden flex-shrink-0">
          <div 
            className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110" 
            style={{ backgroundImage: `url('${property.images[0]}')` }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
          
          <div className="absolute top-4 left-4">
            <Badge className={`${getTypeBadgeColor(property.type)} text-white px-3 py-1 text-xs font-semibold rounded-full`}>
              {getTypeLabel(property.type)}
            </Badge>
          </div>
          
          <div className="absolute top-4 right-4">
            <Button variant="ghost" size="sm" className="bg-white/90 text-gray-800 hover:bg-white p-2 rounded-full transition-all duration-300">
              <Heart className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="absolute bottom-4 left-4 right-4">
            <div className="flex justify-between items-end">
              <Badge variant="secondary" className="bg-black/60 text-white border-0">
                <Images className="h-3 w-3 mr-1" />
                {property.images.length} foto
              </Badge>
              <span className="text-lg sm:text-2xl font-bold text-white drop-shadow-lg">
                {formatPrice(property.price, property.type, property.priceType || undefined)}
              </span>
            </div>
          </div>
        </div>
        
        <CardContent className="p-3 sm:p-4">
          <h3 className="text-sm sm:text-base font-bold text-gray-900 mb-1 sm:mb-2 line-clamp-2 group-hover:text-primary transition-colors h-10 sm:h-12 flex items-start leading-tight">
            <span className="line-clamp-2">{property.title}</span>
          </h3>
          <p className="text-gray-600 flex items-center text-xs mb-2 sm:mb-3">
            <MapPin className="h-3 w-3 mr-1 text-primary flex-shrink-0" />
            <span className="truncate">{property.location}</span>
          </p>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1 sm:space-x-2 text-xs text-gray-600">
              <span className="flex items-center bg-gray-50 px-1.5 sm:px-2 py-1 rounded">
                <Bed className="h-3 w-3 mr-1 text-primary" />
                {property.bedrooms}
              </span>
              <span className="flex items-center bg-gray-50 px-1.5 sm:px-2 py-1 rounded">
                <Bath className="h-3 w-3 mr-1 text-secondary" />
                {property.bathrooms}
              </span>
              <span className="flex items-center bg-gray-50 px-1.5 sm:px-2 py-1 rounded">
                <Square className="h-3 w-3 mr-1 text-orange-500" />
                {property.area}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
