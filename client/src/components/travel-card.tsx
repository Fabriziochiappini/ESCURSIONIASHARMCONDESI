import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, MapPin, Calendar, Users, Plane, Clock } from "lucide-react";
import type { Travel } from "@shared/schema";
import { formatPrice, formatDuration, getTravelTypeIcon, getCategoryIcon } from "@/lib/types";
import { Link } from "wouter";

interface TravelCardProps {
  travel: Travel;
}

export function TravelCard({ travel }: TravelCardProps) {
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

  const getTravelTypeLabel = (travelType?: string): string => {
    if (!travelType) return '';
    
    switch(travelType) {
      case "singolo": return "Viaggio Singolo";
      case "coppia": return "Viaggio di Coppia";
      case "famiglia": return "Viaggio Famiglia";
      case "gruppo": return "Viaggio di Gruppo";
      default: return travelType;
    }
  };

  // Sempre usa /travel/id per evitare problemi con slug malformati
  const travelUrl = `/travel/${travel.id}`;
  
  return (
    <Link href={travelUrl} className="block">
      <Card className="overflow-hidden cursor-pointer group border-0 shadow-lg hover:shadow-2xl transition-all duration-500 h-full flex flex-col bg-white hover:scale-105 transform">
        {/* Smartbox-style card */}
        <div className="relative h-64 overflow-hidden flex-shrink-0">
          <div 
            className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110" 
            style={{ backgroundImage: `url('${travel.images[0] || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?ixlib=rb-4.0.3&auto=format&fit=crop&w=800'}')`}}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
          
          {/* Top Left - Location and Duration like Smartbox */}
          <div className="absolute top-4 left-4 flex flex-col gap-1">
            <div className="flex items-center text-white text-sm font-medium">
              <MapPin className="h-4 w-4 mr-1" />
              <span>{travel.destination || travel.country}</span>
            </div>
            <div className="flex items-center text-white text-sm">
              <Calendar className="h-4 w-4 mr-1" />
              <span>{formatDuration(travel.duration)}</span>
            </div>
            {travel.maxParticipants && (
              <div className="flex items-center text-white text-sm">
                <Users className="h-4 w-4 mr-1" />
                <span>{travel.maxParticipants} persone</span>
              </div>
            )}
          </div>

          {/* Top Right - Badge like Smartbox */}
          {(travel.type === "mare" || travel.featured) && (
            <div className="absolute top-4 right-4">
              <div className="bg-blue-500 text-white px-3 py-1 text-xs font-bold uppercase tracking-wide">
                BEST OFFER
              </div>
            </div>
          )}

          {/* Bottom Left - Title like Smartbox */}
          <div className="absolute bottom-4 left-4 right-4">
            <h3 className="text-white text-2xl font-black mb-2 leading-tight">
              {travel.title}
            </h3>
          </div>

          {/* Bottom Right - Price like Smartbox */}
          <div className="absolute bottom-4 right-4 text-right">
            <div className="bg-white/95 backdrop-blur-sm px-3 py-2 text-right">
              <div className="text-gray-600 text-xs font-medium uppercase">Da</div>
              <div className="text-2xl font-black text-slate-900">
                {formatPrice(travel.price, travel.type, travel.priceType || undefined)}
              </div>
              <div className="text-gray-600 text-xs">a persona</div>
            </div>
          </div>
        </div>
        
        {/* No content area - pure Smartbox style with all info on image */}
      </Card>
    </Link>
  );
}