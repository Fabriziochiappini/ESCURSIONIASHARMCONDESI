import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, MapPin, Bed, Bath, Square, Images } from "lucide-react";
import type { Property } from "@shared/schema";
import { generateQuickInquiryMessage } from "@/lib/whatsapp";
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

  const getPropertyTypeLabel = (propertyType?: string): string => {
    if (!propertyType) return '';
    
    switch(propertyType) {
      case "villa": return "Villa";
      case "appartamento": return "Appartamento";
      case "villa_singola": return "Villa Singola";
      case "casa_singola_con_terreno": return "Casa Singola con Terreno";
      case "rustici_e_terreni": return "Rustici e Terreni";
      default: return propertyType;
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
          
          <div className="absolute top-4 right-4 flex gap-2">
            <Button variant="ghost" size="sm" className="bg-white/90 text-gray-800 hover:bg-white p-2 rounded-full transition-all duration-300">
              <Heart className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                const message = generateQuickInquiryMessage(property);
                window.open(`https://wa.me/3468003234?text=${encodeURIComponent(message)}`, '_blank');
              }}
              className="bg-green-500/90 text-white hover:bg-green-600 p-2 rounded-full transition-all duration-300"
              title="Contatta via WhatsApp"
            >
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.700"/>
              </svg>
            </Button>
          </div>
          
          <div className="absolute bottom-4 left-4 right-4">
            <div className="flex justify-between items-end">
              <Badge variant="secondary" className="bg-black/60 text-white border-0 hidden sm:flex">
                <Images className="h-3 w-3 mr-1" />
                {property.images.length} foto
              </Badge>
              <span className="text-lg sm:text-2xl font-bold text-white drop-shadow-lg ml-auto">
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
