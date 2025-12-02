import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { AnnouncementBar } from "@/components/announcement-bar";
import { SEOHead } from "@/components/seo-head";
import { useCart } from "@/contexts/cart-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { ShoppingCart, Trash2, Plus, Minus, CreditCard, ArrowLeft, ShoppingBag, Users } from "lucide-react";
import { formatPrice } from "@/lib/types";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY || "");

export default function Carrello() {
  const { items, removeFromCart, updateQuantity, updateParticipants, clearCart, getTotal, getItemCount } = useCart();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);

  const convertImageUrl = (url: string) => {
    if (!url) return "/placeholder-tour.jpg";
    return url.replace('/public-objects/', '/api/images/');
  };

  const checkoutMutation = useMutation({
    mutationFn: async () => {
      const cartData = items.map(item => ({
        travelId: item.travel.id,
        travelTitle: item.travel.title,
        quantity: item.quantity,
        participants: item.participants,
        price: Number(item.travel.price) * item.participants * item.quantity,
        selectedDate: item.selectedDate
      }));
      
      return apiRequest("POST", "/api/cart/checkout", {
        items: cartData,
        total: getTotal(),
        paymentType: "full"
      });
    },
    onSuccess: async (data: any) => {
      if (data.sessionId) {
        const stripe = await stripePromise;
        if (stripe) {
          const { error } = await stripe.redirectToCheckout({ sessionId: data.sessionId });
          if (error) {
            toast({ title: "Errore nel pagamento", description: error.message, variant: "destructive" });
          }
        }
      }
    },
    onError: () => {
      toast({ title: "Errore nel checkout", variant: "destructive" });
      setIsProcessing(false);
    }
  });

  const handleCheckout = () => {
    if (items.length === 0) {
      toast({ title: "Il carrello è vuoto", variant: "destructive" });
      return;
    }
    setIsProcessing(true);
    checkoutMutation.mutate();
  };

  return (
    <div className="min-h-screen bg-white">
      <SEOHead 
        title="Carrello - Si Viaggia con Desy | Escursioni Sharm El Sheikh"
        description="Il tuo carrello - Completa l'acquisto delle escursioni selezionate a Sharm El Sheikh"
        keywords="carrello, acquisto, escursioni sharm"
        canonicalUrl="https://siviaggiacondesy.it/carrello"
      />
      <AnnouncementBar />
      <Navigation />

      <main className="pt-20 lg:pt-[148px]">
        <section className="py-12 bg-gradient-to-r from-blue-600 to-purple-700 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center px-4 py-2 bg-white/20 text-white rounded-full text-sm font-medium mb-6">
              <ShoppingCart className="h-4 w-4 mr-2" />
              Il Tuo Carrello
            </div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#E6C87F] via-[#D4AF37] to-[#E6C87F] bg-clip-text text-transparent mb-4 tracking-[0.15em] uppercase drop-shadow-2xl font-eagle-lake">
              Carrello
            </h1>
            <p className="text-xl text-white/90">
              {getItemCount() === 0 ? "Il tuo carrello è vuoto" : `${getItemCount()} escursion${getItemCount() === 1 ? 'e' : 'i'} nel carrello`}
            </p>
          </div>
        </section>

        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {items.length === 0 ? (
              <div className="text-center py-16">
                <ShoppingBag className="w-24 h-24 mx-auto text-gray-300 mb-6" />
                <h2 className="text-2xl font-bold text-gray-700 mb-4">Il tuo carrello è vuoto</h2>
                <p className="text-gray-500 mb-8">Esplora le nostre escursioni e aggiungi quelle che ti interessano!</p>
                <Link href="/viaggi">
                  <Button className="bg-[#D4AF37] hover:bg-[#C9A961] text-white px-8 py-3">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Sfoglia le Escursioni
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-4">
                  {items.map((item) => (
                    <Card key={item.travel.id} className="overflow-hidden" data-testid={`cart-item-${item.travel.id}`}>
                      <CardContent className="p-4">
                        <div className="flex gap-4">
                          <div className="w-32 h-24 rounded-lg overflow-hidden flex-shrink-0">
                            <img
                              src={convertImageUrl(item.travel.images?.[0] || "")}
                              alt={item.travel.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between items-start">
                              <div>
                                <h3 className="font-bold text-lg text-gray-900">{item.travel.title}</h3>
                                <p className="text-sm text-gray-500">{item.travel.destination}</p>
                              </div>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => removeFromCart(item.travel.id)}
                                className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                data-testid={`remove-item-${item.travel.id}`}
                              >
                                <Trash2 className="h-5 w-5" />
                              </Button>
                            </div>
                            
                            <div className="mt-3 flex flex-wrap items-center gap-4">
                              <div className="flex items-center gap-2">
                                <span className="text-sm text-gray-600">Quantità:</span>
                                <div className="flex items-center border rounded-lg">
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8"
                                    onClick={() => updateQuantity(item.travel.id, item.quantity - 1)}
                                  >
                                    <Minus className="h-4 w-4" />
                                  </Button>
                                  <span className="px-3 font-medium">{item.quantity}</span>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8"
                                    onClick={() => updateQuantity(item.travel.id, item.quantity + 1)}
                                  >
                                    <Plus className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                              
                              <div className="flex items-center gap-2">
                                <Users className="h-4 w-4 text-gray-500" />
                                <span className="text-sm text-gray-600">Partecipanti:</span>
                                <div className="flex items-center border rounded-lg">
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8"
                                    onClick={() => updateParticipants(item.travel.id, item.participants - 1)}
                                  >
                                    <Minus className="h-4 w-4" />
                                  </Button>
                                  <span className="px-3 font-medium">{item.participants}</span>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8"
                                    onClick={() => updateParticipants(item.travel.id, item.participants + 1)}
                                  >
                                    <Plus className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                            </div>
                            
                            <div className="mt-3 flex justify-between items-center">
                              <span className="text-sm text-gray-500">
                                {formatPrice(Number(item.travel.price))} x {item.participants} pers. x {item.quantity}
                              </span>
                              <span className="text-lg font-bold text-[#D4AF37]">
                                {formatPrice(Number(item.travel.price) * item.participants * item.quantity)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  
                  <div className="flex justify-between items-center pt-4">
                    <Link href="/viaggi">
                      <Button variant="outline" className="gap-2">
                        <ArrowLeft className="w-4 h-4" />
                        Continua a esplorare
                      </Button>
                    </Link>
                    <Button
                      variant="ghost"
                      className="text-red-500 hover:text-red-700"
                      onClick={clearCart}
                      data-testid="clear-cart"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Svuota carrello
                    </Button>
                  </div>
                </div>

                <div className="lg:col-span-1">
                  <Card className="sticky top-32 border-2 border-[#D4AF37]/30">
                    <CardHeader className="bg-gradient-to-r from-[#D4AF37]/10 to-[#E6C87F]/10">
                      <CardTitle className="flex items-center gap-2">
                        <CreditCard className="h-5 w-5 text-[#D4AF37]" />
                        Riepilogo Ordine
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 space-y-4">
                      <div className="space-y-3">
                        {items.map((item) => (
                          <div key={item.travel.id} className="flex justify-between text-sm">
                            <span className="text-gray-600 truncate max-w-[180px]">
                              {item.travel.title} ({item.participants} pers. x {item.quantity})
                            </span>
                            <span className="font-medium">
                              {formatPrice(Number(item.travel.price) * item.participants * item.quantity)}
                            </span>
                          </div>
                        ))}
                      </div>
                      
                      <Separator />
                      
                      <div className="flex justify-between items-center text-lg font-bold">
                        <span>Totale</span>
                        <span className="text-[#D4AF37] text-2xl">{formatPrice(getTotal())}</span>
                      </div>
                      
                      <Button
                        className="w-full bg-gradient-to-r from-[#D4AF37] to-[#E6C87F] hover:from-[#C9A961] hover:to-[#D4AF37] text-white font-bold py-6 text-lg shadow-lg"
                        onClick={handleCheckout}
                        disabled={isProcessing || checkoutMutation.isPending}
                        data-testid="checkout-button"
                      >
                        {isProcessing || checkoutMutation.isPending ? (
                          <>
                            <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2" />
                            Elaborazione...
                          </>
                        ) : (
                          <>
                            <CreditCard className="w-5 h-5 mr-2" />
                            Acquista Ora
                          </>
                        )}
                      </Button>
                      
                      <p className="text-xs text-gray-500 text-center">
                        Pagamento sicuro con Stripe. I tuoi dati sono protetti.
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
