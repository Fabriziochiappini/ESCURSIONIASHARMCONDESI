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

  const travelUrl = travel.slug ? `/${travel.slug}` : `/travel/${travel.id}`;
  
  return (
    <Link href={travelUrl} className="block">
      <Card className="bg-white rounded-xl overflow-hidden cursor-pointer group border shadow-lg hover:shadow-xl transition-all duration-300 h-auto flex flex-col min-h-[420px]">
        <div className="relative h-52 sm:h-64 overflow-hidden flex-shrink-0">
          <div 
            className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110" 
            style={{ backgroundImage: `url('${travel.images[0] || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?ixlib=rb-4.0.3&auto=format&fit=crop&w=800'}')`}}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
          
          <div className="absolute top-4 left-4 flex flex-col gap-2">
            <Badge className={`${getTypeBadgeColor(travel.type)} text-white px-3 py-1 text-xs font-semibold rounded-full`}>
              {getTravelTypeIcon(travel.type)} {getTypeLabel(travel.type)}
            </Badge>
            {travel.travelType && (
              <Badge className="bg-slate-700 text-white px-3 py-1 text-xs font-medium rounded-full">
                {getCategoryIcon(travel.travelType)} {getTravelTypeLabel(travel.travelType)}
              </Badge>
            )}
          </div>
          
          <div className="absolute top-4 right-4">
            <Button variant="ghost" size="sm" className="bg-white/90 text-gray-800 hover:bg-white p-2 rounded-full transition-all duration-300">
              <Heart className="h-4 w-4" />
            </Button>
          </div>
          
          {travel.images.length > 1 && (
            <div className="absolute bottom-4 right-4">
              <div className="bg-black/70 text-white px-2 py-1 rounded-full text-xs flex items-center gap-1">
                <Plane className="h-3 w-3" />
                {travel.images.length}
              </div>
            </div>
          )}
          
          <div className="absolute bottom-4 left-4">
            <div className="text-white text-2xl font-bold drop-shadow-lg">
              {formatPrice(travel.price, travel.type, travel.priceType)}
            </div>
          </div>
        </div>
        
        <CardContent className="p-6 flex-grow flex flex-col justify-between">
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                {travel.title}
              </h3>
              <p className="text-sm text-gray-600 line-clamp-3 leading-relaxed">
                {travel.description}
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center text-gray-700">
                <MapPin className="h-4 w-4 mr-2 text-blue-500 flex-shrink-0" />
                <span className="truncate">{travel.destination}, {travel.country}</span>
              </div>
              
              <div className="flex items-center text-gray-700">
                <Clock className="h-4 w-4 mr-2 text-green-500 flex-shrink-0" />
                <span>{formatDuration(travel.duration)}</span>
              </div>
              
              <div className="flex items-center text-gray-700">
                <Users className="h-4 w-4 mr-2 text-purple-500 flex-shrink-0" />
                <span>Max {travel.maxParticipants} persone</span>
              </div>
              
              <div className="flex items-center text-gray-700">
                <Calendar className="h-4 w-4 mr-2 text-orange-500 flex-shrink-0" />
                <span>Età min {travel.minAge}+</span>
              </div>
            </div>
          </div>
          
          <div className="pt-4 mt-auto">
            <Button 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold py-2.5 transition-all duration-300"
            >
              Scopri il Viaggio
            </Button>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}