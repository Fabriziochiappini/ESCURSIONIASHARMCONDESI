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
      <Card className="glass-card rounded-3xl overflow-hidden cursor-pointer group border-0 h-[500px] flex flex-col hover:scale-105 transition-all duration-500 mirror-reflection">
        <div className="relative h-80 overflow-hidden flex-shrink-0">
          <div 
            className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110" 
            style={{ backgroundImage: `url('${property.images[0]}')` }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
          
          <div className="absolute top-6 left-6">
            <Badge className={`badge-${property.type.replace('_', '-')} px-4 py-2 text-sm font-bold rounded-2xl shadow-2xl`}>
              {getTypeLabel(property.type)}
            </Badge>
          </div>
          
          <div className="absolute top-6 right-6">
            <Button variant="ghost" size="sm" className="glass-card text-white p-3 rounded-2xl hover:scale-110 border border-white/20 transition-all duration-300">
              <Heart className="h-5 w-5" />
            </Button>
          </div>
          
          <div className="absolute bottom-6 left-6 right-6">
            <div className="flex justify-between items-end">
              <Badge variant="secondary" className="glass text-white border-0 px-4 py-2 rounded-xl">
                <Images className="h-4 w-4 mr-2" />
                {property.images.length} foto
              </Badge>
              <span className="text-4xl font-bold text-white drop-shadow-2xl neon-text">
                {formatPrice(property.price, property.type, property.priceType || undefined)}
              </span>
            </div>
          </div>
        </div>
        
        <CardContent className="p-8 flex flex-col justify-between flex-grow">
          <div className="mb-6">
            <h3 className="text-2xl font-bold text-foreground mb-4 line-clamp-2 group-hover:text-primary transition-colors min-h-[4rem]">
              {property.title}
            </h3>
            <p className="text-foreground/80 flex items-center text-lg mb-6">
              <MapPin className="h-5 w-5 mr-3 text-primary flex-shrink-0" />
              <span className="truncate">{property.location}</span>
            </p>
          </div>
          
          <div className="flex items-center justify-center">
            <div className="flex items-center space-x-4 text-lg text-foreground/80">
              <span className="flex items-center glass-card px-4 py-3 rounded-2xl group-hover:scale-105 transition-all duration-300">
                <Bed className="h-6 w-6 mr-2 text-primary" />
                {property.bedrooms}
              </span>
              <span className="flex items-center glass-card px-4 py-3 rounded-2xl group-hover:scale-105 transition-all duration-300">
                <Bath className="h-6 w-6 mr-2 text-secondary" />
                {property.bathrooms}
              </span>
              <span className="flex items-center glass-card px-4 py-3 rounded-2xl group-hover:scale-105 transition-all duration-300">
                <Square className="h-6 w-6 mr-2 text-accent" />
                {property.area} mq
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
