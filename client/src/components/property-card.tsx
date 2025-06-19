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
    <Card className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer">
      <Link href={`/property/${property.id}`}>
        <div className="relative h-64 bg-cover bg-center" 
             style={{ backgroundImage: `url('${property.images[0]}')` }}>
          <div className="absolute top-4 left-4">
            <Badge className={`${getTypeBadgeColor(property.type)} text-white`}>
              {getTypeLabel(property.type)}
            </Badge>
          </div>
          <div className="absolute top-4 right-4">
            <Button variant="ghost" size="sm" className="bg-white/80 text-gray-700 p-2 rounded-full hover:bg-white">
              <Heart className="h-4 w-4" />
            </Button>
          </div>
          <div className="absolute bottom-4 left-4">
            <Badge variant="secondary" className="bg-black/70 text-white">
              <Images className="h-3 w-3 mr-1" />
              {property.images.length} foto
            </Badge>
          </div>
        </div>
      </Link>
      
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-xl font-semibold text-gray-900 flex-1 mr-4">
            {property.title}
          </h3>
          <span className="text-2xl font-bold text-blue-600 whitespace-nowrap">
            {formatPrice(property.price, property.type, property.priceType)}
          </span>
        </div>
        
        <p className="text-gray-600 mb-4 flex items-center">
          <MapPin className="h-4 w-4 mr-1" />
          {property.location}
        </p>
        
        <div className="flex items-center space-x-4 text-sm text-gray-600 mb-4">
          <span className="flex items-center">
            <Bed className="h-4 w-4 mr-1" />
            {property.bedrooms} camere
          </span>
          <span className="flex items-center">
            <Bath className="h-4 w-4 mr-1" />
            {property.bathrooms} bagni
          </span>
          <span className="flex items-center">
            <Square className="h-4 w-4 mr-1" />
            {property.area} mq
          </span>
        </div>
        
        <p className="text-gray-700 text-sm line-clamp-2">
          {property.description}
        </p>
      </CardContent>
    </Card>
  );
}
