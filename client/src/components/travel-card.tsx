import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, Users, Share2, ShoppingCart } from "lucide-react";
import type { Travel } from "@shared/schema";
import { formatPrice } from "@/lib/types";
import { Link } from "wouter";
import { shareOnWhatsApp } from "@/lib/whatsapp";
import { useCart } from "@/contexts/cart-context";
import { useToast } from "@/hooks/use-toast";

interface TravelCardProps {
  travel: Travel;
  priority?: boolean;
  compact?: boolean;
}

export function TravelCard({ travel, priority = false, compact = false }: TravelCardProps) {
  const { addToCart } = useCart();
  const { toast } = useToast();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(travel, 1);
    toast({ 
      title: "Aggiunto al carrello!", 
      description: `${travel.title} è stato aggiunto al tuo carrello.` 
    });
  };

  const getBadgeLabel = (type: string) => {
    switch (type) {
      case "mare": return "MAR ROSSO";
      case "montagna": return "MONTAGNA";
      case "citta": return "CITTÀ";
      case "cultura": return "CULTURA";
      case "avventura": return "AVVENTURA";
      case "relax": return "RELAX";
      default: return "ESCURSIONE";
    }
  };

  // URL viaggio
  const travelUrl = `/travel/${travel.id}`;
  
  // Gestione sicura delle immagini con fallback
  const getImageUrl = () => {
    if (travel.images && travel.images.length > 0 && travel.images[0]) {
      const img = travel.images[0];
      if (img.startsWith('http://') || img.startsWith('https://')) {
        return img;
      }
      return img;
    }
    return 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?ixlib=rb-4.0.3&auto=format&fit=crop&w=800';
  };
  
  const firstImage = getImageUrl();
  
  if (compact) {
    return (
      <Link href={travelUrl} className="block h-full">
        <div className="relative h-56 sm:h-96 overflow-hidden group cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-500 rounded-lg">
          {/* Immagine di sfondo */}
          <div 
            className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
            style={{
              backgroundImage: `url('${firstImage}')`,
            }}
          />
          
          {/* Overlay scuro */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20"></div>
          
          {/* Badge tipo */}
          <div className="absolute top-2 left-2 z-10">
            <Badge className="bg-[#D4AF37]/90 backdrop-blur-sm text-white px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider shadow-lg border-0">
              {getBadgeLabel(travel.type)}
            </Badge>
          </div>

          {/* Contenuto in basso */}
          <div className="absolute bottom-0 left-0 right-0 z-10 p-3">
            <h3 className="text-sm font-medium text-white text-center leading-tight uppercase tracking-wide mb-2 line-clamp-2">
              {travel.title}
            </h3>
            
            {/* Info e prezzo */}
            <div className="flex items-center justify-between text-white/90 text-xs mb-2">
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                <span>{travel.duration}g</span>
              </div>
              <div className="text-[#D4AF37] font-semibold text-sm">
                {formatPrice(travel.price, travel.type, travel.priceType || undefined)}
              </div>
            </div>

            {/* Pulsante Scopri */}
            <Button 
              className="w-full bg-white/95 hover:bg-white text-gray-800 font-medium py-1.5 h-auto shadow-lg text-xs rounded-full border border-[#D4AF37]/50 uppercase tracking-wider"
              data-testid={`button-discover-${travel.id}`}
            >
              Scopri
            </Button>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link href={travelUrl} className="block h-full">
      <div className="relative h-96 overflow-hidden group cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-500">
        {/* Immagine di sfondo */}
        <div 
          className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
          style={{
            backgroundImage: `url('${firstImage}')`,
          }}
        />
        
        {/* Overlay scuro di base */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/40 group-hover:from-black/85 group-hover:via-black/70 group-hover:to-black/60 transition-all duration-500"></div>
        
        {/* Badge tipo in alto a sinistra */}
        <div className="absolute top-4 left-4 z-10">
          <Badge className="bg-[#D4AF37]/90 backdrop-blur-sm text-white px-3 py-1 text-xs font-medium uppercase tracking-wider shadow-lg border-0">
            {getBadgeLabel(travel.type)}
          </Badge>
        </div>

        {/* Pulsante condivisione in alto a destra - nascosto di default, visibile su hover */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            shareOnWhatsApp(travel, travelUrl);
          }}
          className="absolute top-4 right-4 z-10 w-10 h-10 bg-white/90 backdrop-blur-sm hover:bg-white rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          data-testid={`button-share-${travel.id}`}
          title="Condividi su WhatsApp"
        >
          <Share2 className="h-5 w-5 text-green-600" />
        </button>

        {/* Contenuto sempre visibile - Titolo centrato */}
        <div className="absolute inset-0 flex flex-col items-center justify-center z-10 p-6 group-hover:opacity-0 transition-opacity duration-300">
          <h3 className="text-3xl md:text-4xl font-normal text-white text-center tracking-wide uppercase drop-shadow-lg">
            {travel.title}
          </h3>
        </div>

        {/* Contenuto visibile su hover - Dettagli completi */}
        <div className="absolute inset-0 flex flex-col items-center justify-center z-10 p-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="text-center space-y-6 w-full max-w-md">
            <h3 className="text-2xl md:text-3xl font-normal text-white tracking-wide uppercase">
              {travel.title}
            </h3>
            
            {/* Info rapide */}
            <div className="flex items-center justify-center gap-6 text-white/90">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                <span className="text-sm font-light">{travel.duration} {travel.duration === 1 ? 'giorno' : 'giorni'}</span>
              </div>
              {travel.maxParticipants && (
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  <span className="text-sm font-light">Max {travel.maxParticipants}</span>
                </div>
              )}
            </div>

            {/* Prezzo */}
            <div className="text-center">
              <div className="text-sm text-white/80 font-light mb-1">A partire da</div>
              <div className="text-3xl font-light text-[#D4AF37]">
                {formatPrice(travel.price, travel.type, travel.priceType || undefined)}
              </div>
            </div>

            {/* Pulsanti azione */}
            <div className="flex gap-3 w-full">
              <Button 
                className="flex-1 bg-white/95 hover:bg-white text-gray-800 font-normal py-5 shadow-xl hover:shadow-2xl transition-all duration-300 text-sm rounded-full border-2 border-[#D4AF37]/50 uppercase tracking-wider"
                data-testid={`button-discover-${travel.id}`}
              >
                Scopri
              </Button>
              <Button 
                onClick={handleAddToCart}
                className="flex-1 bg-gradient-to-r from-[#D4AF37] to-[#E6C87F] hover:from-[#C9A961] hover:to-[#D4AF37] text-white font-normal py-5 shadow-xl hover:shadow-2xl transition-all duration-300 text-sm rounded-full uppercase tracking-wider"
                data-testid={`button-add-cart-${travel.id}`}
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                Carrello
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
