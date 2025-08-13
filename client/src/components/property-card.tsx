import { Card } from "@/components/ui/card";
import { MapPin, Calendar, Users } from "lucide-react";
import type { Property } from "@shared/schema";
import { formatPrice } from "@/lib/types";
import { Link } from "wouter";

interface PropertyCardProps {
  property: Property;
}

export function PropertyCard({ property }: PropertyCardProps) {
  const propertyUrl = property.slug ? `/${property.slug}` : `/property/${property.id}`;
  
  return (
    <Link href={propertyUrl} className="block">
      <Card className="overflow-hidden cursor-pointer group border-0 shadow-lg hover:shadow-2xl transition-all duration-500 h-full flex flex-col bg-white hover:scale-105 transform">
        {/* Smartbox-style card */}
        <div className="relative h-64 overflow-hidden flex-shrink-0">
          <div 
            className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110" 
            style={{ backgroundImage: `url('${property.images[0] || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?ixlib=rb-4.0.3&auto=format&fit=crop&w=800'}')` }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
          
          {/* Top Left - Location and Duration like Smartbox */}
          <div className="absolute top-4 left-4 flex flex-col gap-1">
            <div className="flex items-center text-white text-sm font-medium">
              <MapPin className="h-4 w-4 mr-1" />
              <span>1 DESTINAZIONE</span>
            </div>
            <div className="flex items-center text-white text-sm">
              <Calendar className="h-4 w-4 mr-1" />
              <span>7 GIORNI DI TRASPORTO</span>
            </div>
            <div className="flex items-center text-white text-sm">
              <Users className="h-4 w-4 mr-1" />
              <span>6 NOTTI</span>
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

          {/* Bottom Left - Title like Smartbox */}
          <div className="absolute bottom-4 left-4 right-20">
            <h3 className="text-white text-2xl font-black mb-2 leading-tight">
              {property.title}
            </h3>
          </div>

          {/* Bottom Right - Price like Smartbox */}
          <div className="absolute bottom-4 right-4 text-right">
            <div className="bg-white/95 backdrop-blur-sm px-3 py-2 text-right">
              <div className="text-gray-600 text-xs font-medium uppercase">Da</div>
              <div className="text-2xl font-black text-slate-900">
                {formatPrice(property.price)}
              </div>
              <div className="text-gray-600 text-xs">a persona</div>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
}