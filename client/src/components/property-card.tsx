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
      <Card className="property-card bg-white rounded-3xl shadow-xl overflow-hidden cursor-pointer group border-0 h-[450px] flex flex-col hover:shadow-2xl transition-all duration-300">
        <div className="relative h-64 overflow-hidden flex-shrink-0">
          <div 
            className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110" 
            style={{ backgroundImage: `url('${property.images[0]}')` }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
          
          <div className="absolute top-4 left-4">
            <Badge className={`badge-${property.type.replace('_', '-')} px-3 py-1 text-xs font-semibold rounded-full`}>
              {getTypeLabel(property.type)}
            </Badge>
          </div>
          
          <div className="absolute top-4 right-4">
            <Button variant="ghost" size="sm" className="bg-white/20 backdrop-blur-sm text-white p-2 rounded-full hover:bg-white/30 border border-white/20">
              <Heart className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="absolute bottom-4 left-4 right-4">
            <div className="flex justify-between items-end">
              <Badge variant="secondary" className="bg-black/60 backdrop-blur-sm text-white border-0">
                <Images className="h-3 w-3 mr-1" />
                {property.images.length} foto
              </Badge>
              <span className="text-3xl font-bold text-white drop-shadow-lg">
                {formatPrice(property.price, property.type, property.priceType || undefined)}
              </span>
            </div>
          </div>
        </div>
        
        <CardContent className="p-6 flex flex-col flex-grow">
          <div className="mb-4">
            <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-purple-600 transition-colors min-h-[3.5rem]">
              {property.title}
            </h3>
            <p className="text-gray-600 flex items-center text-sm">
              <MapPin className="h-4 w-4 mr-2 text-purple-500 flex-shrink-0" />
              <span className="truncate">{property.location}</span>
            </p>
          </div>
          
          <div className="flex items-center justify-center mb-4">
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <span className="flex items-center bg-gray-100 px-3 py-2 rounded-lg">
                <Bed className="h-4 w-4 mr-1 text-purple-500" />
                {property.bedrooms}
              </span>
              <span className="flex items-center bg-gray-100 px-3 py-2 rounded-lg">
                <Bath className="h-4 w-4 mr-1 text-blue-500" />
                {property.bathrooms}
              </span>
              <span className="flex items-center bg-gray-100 px-3 py-2 rounded-lg">
                <Square className="h-4 w-4 mr-1 text-green-500" />
                {property.area} mq
              </span>
            </div>
          </div>
          
          <p className="text-gray-700 text-sm line-clamp-3 leading-relaxed flex-grow text-center">
            {property.description}
          </p>
        </CardContent>
      </Card>
    </Link>
  );
}
