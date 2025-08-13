import { Card } from "@/components/ui/card";
import { MapPin, Calendar, Users } from "lucide-react";
import type { Travel } from "@shared/schema";
import { formatPrice } from "@/lib/types";
import { Link } from "wouter";

interface PropertyCardProps {
  property: Travel;
}

export function PropertyCard({ property }: PropertyCardProps) {
  const propertyUrl = property.slug ? `/${property.slug}` : `/travel/${property.id}`;
  
  // Use real image from database, fallback to beautiful travel image
  const imageUrl = property.images && property.images.length > 0 
    ? property.images[0] 
    : 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?ixlib=rb-4.0.3&auto=format&fit=crop&w=800';
  
  return (
    <Link href={propertyUrl} className="block">
      <div className="overflow-hidden cursor-pointer group border-0 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02] bg-white">
        {/* Tall rectangular card like travel brochure */}
        <div className="relative aspect-[4/5] overflow-hidden">
          <div 
            className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110" 
            style={{ backgroundImage: `url('${imageUrl}')` }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
          
          {/* Top Left - Location and Duration like Smartbox */}
          <div className="absolute top-4 left-4 flex flex-col gap-1">
            <div className="flex items-center text-white text-xs font-bold">
              <MapPin className="h-3 w-3 mr-1" />
              <span>1 DESTINAZIONE</span>
            </div>
            <div className="flex items-center text-white text-xs">
              <Calendar className="h-3 w-3 mr-1" />
              <span>{property.duration || 7} GIORNI DI TRASPORTO</span>
            </div>
            <div className="flex items-center text-white text-xs">
              <Users className="h-3 w-3 mr-1" />
              <span>{(property.duration || 7) - 1} NOTTI</span>
            </div>
          </div>

          {/* Top Right - Badge like Smartbox */}
          {(property.type === "mare" || property.featured) && (
            <div className="absolute top-4 right-4">
              <div className="bg-blue-500 text-white px-3 py-1 text-xs font-bold uppercase tracking-wide">
                BEST OFFER
              </div>
            </div>
          )}

          {/* Title at top center */}
          <div className="absolute top-20 left-4 right-4">
            <h3 className="text-white text-3xl font-black leading-tight">
              {property.title}
            </h3>
          </div>

          {/* Bottom Right - Price like Smartbox */}
          <div className="absolute bottom-4 right-4 text-right">
            <div className="text-white">
              <div className="text-xs font-medium uppercase mb-1">Da</div>
              <div className="text-4xl font-black">
                {property.price}€
              </div>
              <div className="text-xs opacity-90">{property.maxParticipants || 2} € a persona</div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}