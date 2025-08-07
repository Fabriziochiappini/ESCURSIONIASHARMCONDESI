import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, MapPin, Calendar, Users, Baby, Images, Plane } from "lucide-react";
import type { Property } from "@shared/schema";
import { formatPrice } from "@/lib/types";
import { Link } from "wouter";

interface PropertyCardProps {
  property: Property;
}

export function PropertyCard({ property }: PropertyCardProps) {
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

  const getPropertyTypeLabel = (propertyType?: string): string => {
    if (!propertyType) return '';
    
    switch(propertyType) {
      case "singolo": return "Viaggio Singolo";
      case "coppia": return "Viaggio di Coppia";
      case "famiglia": return "Viaggio Famiglia";
      case "gruppo": return "Viaggio di Gruppo";
      default: return propertyType;
    }
  };

  const propertyUrl = property.slug ? `/${property.slug}` : `/property/${property.id}`;
  
  return (
    <Link href={propertyUrl} className="block">
      <Card className="bg-white rounded-xl overflow-hidden cursor-pointer group border shadow-lg hover:shadow-xl transition-all duration-300 h-auto flex flex-col min-h-[420px]">
        <div className="relative h-52 sm:h-64 overflow-hidden flex-shrink-0">
          <div 
            className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110" 
            style={{ backgroundImage: `url('${property.images[0]}')` }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
          
          <div className="absolute top-4 left-4 flex flex-col gap-2">
            <Badge className={`${getTypeBadgeColor(property.type)} text-white px-3 py-1 text-xs font-semibold rounded-full`}>
              {getTypeLabel(property.type)}
            </Badge>
            {property.propertyType && (
              <Badge className="bg-slate-700 text-white px-3 py-1 text-xs font-medium rounded-full">
                {getPropertyTypeLabel(property.propertyType)}
              </Badge>
            )}
          </div>
          
          <div className="absolute top-4 right-4">
            <Button variant="ghost" size="sm" className="bg-white/90 text-gray-800 hover:bg-white p-2 rounded-full transition-all duration-300">
              <Heart className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="absolute bottom-4 left-4 right-4">
            <div className="flex justify-between items-end">
              <Badge variant="secondary" className="bg-black/60 text-white border-0 hidden sm:flex">
                <Images className="h-3 w-3 mr-1" />
                {property.images.length} foto
              </Badge>
              <div className="text-right">
                <div className="text-lg sm:text-2xl font-bold text-white drop-shadow-lg">
                  {formatPrice(property.price, property.type, property.priceType || undefined)}
                </div>
                <div className="text-xs text-white/80 drop-shadow-sm">
                  per persona
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <CardContent className="p-4 sm:p-5 flex-1 flex flex-col">
          <div className="flex-1">
            <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-primary transition-colors leading-tight">
              {property.title}
            </h3>
            
            <div className="flex items-center mb-3">
              <MapPin className="h-4 w-4 mr-2 text-primary flex-shrink-0" />
              <span className="text-gray-600 text-sm font-medium">{property.municipality}</span>
              <Plane className="h-3 w-3 mx-2 text-gray-400" />
              <span className="text-gray-500 text-sm">{property.location}</span>
            </div>
            
            <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">
              {property.description}
            </p>
          </div>
          
          <div className="space-y-3">
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div className="flex items-center justify-center bg-blue-50 px-2 py-2 rounded-lg">
                <Calendar className="h-3 w-3 mr-1 text-blue-600" />
                <span className="text-blue-800 font-medium">{property.bedrooms}g</span>
              </div>
              <div className="flex items-center justify-center bg-green-50 px-2 py-2 rounded-lg">
                <Users className="h-3 w-3 mr-1 text-green-600" />
                <span className="text-green-800 font-medium">{property.bathrooms}pax</span>
              </div>
              <div className="flex items-center justify-center bg-orange-50 px-2 py-2 rounded-lg">
                <Baby className="h-3 w-3 mr-1 text-orange-600" />
                <span className="text-orange-800 font-medium">{property.area}+</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
