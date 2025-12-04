import { useState, useEffect } from "react";
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
import { ShoppingCart, Trash2, Plus, Minus, CreditCard, ArrowLeft, ShoppingBag, Users, Wallet, ChevronDown, ChevronUp, FileText } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY || "");

function formatCartPrice(price: number): string {
  return new Intl.NumberFormat('it-IT', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 2
  }).format(price);
}

export default function Carrello() {
  const { items, removeFromCart, updateQuantity, updateParticipants, updateParticipantNotes, clearCart, getTotal, getItemCount } = useCart();
  const [openNotes, setOpenNotes] = useState<Record<number, boolean>>({});
  const [location, setLocation] = useLocation();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentType, setPaymentType] = useState<"full" | "deposit">("full");

  const hasDepositOption = items.some(item => 
    (item.travel.depositAmount && Number(item.travel.depositAmount) > 0) ||
    (item.travel.depositPercentage && item.travel.depositPercentage > 0)
  );

  const calculateItemDeposit = (item: typeof items[0]) => {
    const fullPrice = Number(item.travel.price) * item.participants;
    if (item.travel.depositPercentage && item.travel.depositPercentage > 0) {
      return (fullPrice * item.travel.depositPercentage) / 100;
    }
    if (item.travel.depositAmount && Number(item.travel.depositAmount) > 0) {
      return Number(item.travel.depositAmount) * item.participants;
    }
    return fullPrice;
  };

  const getDepositTotal = () => {
    return items.reduce((total, item) => {
      return total + calculateItemDeposit(item);
    }, 0);
  };

  // Handle payment success/cancel from URL params
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('success') === 'true') {
      toast({ 
        title: "Pagamento completato!", 
        description: "Grazie per il tuo acquisto. Riceverai una email di conferma." 
      });
      clearCart();
      window.history.replaceState({}, '', '/carrello');
    } else if (params.get('canceled') === 'true') {
      toast({ 
        title: "Pagamento annullato", 
        description: "Il pagamento è stato annullato. Puoi riprovare quando vuoi.",
        variant: "destructive"
      });
      window.history.replaceState({}, '', '/carrello');
    }
  }, []);

  const convertImageUrl = (url: string) => {
    if (!url) return "/placeholder-tour.jpg";
    return url.replace('/public-objects/', '/api/images/');
  };

  const checkoutMutation = useMutation({
    mutationFn: async () => {
      const cartData = items.map(item => {
        const fullPrice = Number(item.travel.price) * item.participants;
        const depositPrice = calculateItemDeposit(item);
        return {
          travelId: item.travel.id,
          travelTitle: item.travel.title,
          quantity: 1,
          participants: item.participants,
          participantNotes: item.participantNotes || "",
          price: paymentType === "deposit" ? depositPrice : fullPrice,
          fullPrice: fullPrice,
          selectedDate: item.selectedDate
        };
      });
      
      const totalAmount = paymentType === "deposit" ? getDepositTotal() : getTotal();
      
      return apiRequest("POST", "/api/cart/checkout", {
        items: cartData,
        total: totalAmount,
        paymentType: paymentType
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
        title="Carrello - Si Viaggia con Desi | Escursioni Sharm El Sheikh"
        description="Il tuo carrello - Completa l'acquisto delle escursioni selezionate a Sharm El Sheikh"
        keywords="carrello, acquisto, escursioni sharm"
        canonicalUrl="https://siviaggiacondesy.it/carrello"
      />
      <AnnouncementBar />
      <Navigation />

      <main className="pt-20 lg:pt-[148px]">
        <section className="py-12 bg-gradient-to-br from-[#2C3E50] via-[#1e3a5f] to-[#2C3E50] text-white">
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
                      <CardContent className="p-3 sm:p-4">
                        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                          <div className="w-full sm:w-24 h-32 sm:h-20 rounded-lg overflow-hidden flex-shrink-0">
                            <img
                              src={convertImageUrl(item.travel.images?.[0] || "")}
                              alt={item.travel.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-start gap-2">
                              <div className="min-w-0 flex-1">
                                <h3 className="font-bold text-base sm:text-lg text-gray-900 truncate">{item.travel.title}</h3>
                                <p className="text-sm text-gray-500 truncate">{item.travel.destination}</p>
                              </div>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => removeFromCart(item.travel.id)}
                                className="text-red-500 hover:text-red-700 hover:bg-red-50 flex-shrink-0 h-8 w-8"
                                data-testid={`remove-item-${item.travel.id}`}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                            
                            <div className="mt-2 sm:mt-3 flex flex-wrap items-center gap-2 sm:gap-4">
                              <div className="flex items-center gap-1 sm:gap-2">
                                <Users className="h-4 w-4 text-gray-500 hidden sm:block" />
                                <span className="text-xs sm:text-sm text-gray-600">Partecipanti:</span>
                                <div className="flex items-center border rounded-lg">
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-7 w-7 sm:h-8 sm:w-8"
                                    onClick={() => item.participants > 1 && updateParticipants(item.travel.id, item.participants - 1)}
                                    disabled={item.participants <= 1}
                                  >
                                    <Minus className="h-3 w-3 sm:h-4 sm:w-4" />
                                  </Button>
                                  <span className="px-2 sm:px-3 font-medium text-sm sm:text-base">{item.participants}</span>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-7 w-7 sm:h-8 sm:w-8"
                                    onClick={() => updateParticipants(item.travel.id, item.participants + 1)}
                                  >
                                    <Plus className="h-3 w-3 sm:h-4 sm:w-4" />
                                  </Button>
                                </div>
                              </div>
                            </div>

                            <Collapsible 
                              open={openNotes[item.travel.id]} 
                              onOpenChange={(open) => setOpenNotes(prev => ({ ...prev, [item.travel.id]: open }))}
                              className="mt-2 sm:mt-3"
                            >
                              <CollapsibleTrigger asChild>
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className="text-[#D4AF37] hover:text-[#C9A961] hover:bg-[#D4AF37]/10 p-0 h-auto font-medium text-xs sm:text-sm"
                                  data-testid={`toggle-notes-${item.travel.id}`}
                                >
                                  <Plus className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                                  <span className="hidden sm:inline">Aggiungi i nomi dei partecipanti</span>
                                  <span className="sm:hidden">Nomi partecipanti</span>
                                  {openNotes[item.travel.id] ? (
                                    <ChevronUp className="h-3 w-3 sm:h-4 sm:w-4 ml-1" />
                                  ) : (
                                    <ChevronDown className="h-3 w-3 sm:h-4 sm:w-4 ml-1" />
                                  )}
                                </Button>
                              </CollapsibleTrigger>
                              <CollapsibleContent className="mt-2">
                                <div className="bg-gray-50 rounded-lg p-2 sm:p-3 border border-gray-200">
                                  <div className="flex items-center gap-2 mb-2">
                                    <FileText className="h-3 w-3 sm:h-4 sm:w-4 text-gray-500" />
                                    <span className="text-xs sm:text-sm font-medium text-gray-700">Note (facoltativo)</span>
                                  </div>
                                  <Textarea
                                    placeholder="Nomi e cognomi, uno per riga..."
                                    value={item.participantNotes || ""}
                                    onChange={(e) => updateParticipantNotes(item.travel.id, e.target.value)}
                                    className="min-h-[60px] sm:min-h-[80px] text-xs sm:text-sm resize-none"
                                    data-testid={`notes-input-${item.travel.id}`}
                                  />
                                  <p className="text-[10px] sm:text-xs text-gray-400 mt-1">
                                    Es: Mario Rossi, Anna Bianchi
                                  </p>
                                </div>
                              </CollapsibleContent>
                            </Collapsible>
                            
                            <div className="mt-2 sm:mt-3 flex justify-between items-center">
                              <span className="text-xs sm:text-sm text-gray-500">
                                {formatCartPrice(Number(item.travel.price))} x {item.participants} pers.
                              </span>
                              <span className="text-base sm:text-lg font-bold text-[#D4AF37]">
                                {formatCartPrice(Number(item.travel.price) * item.participants)}
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
                              {item.travel.title} ({item.participants} pers.)
                            </span>
                            <span className="font-medium">
                              {formatCartPrice(Number(item.travel.price) * item.participants)}
                            </span>
                          </div>
                        ))}
                      </div>
                      
                      <Separator />

                      {hasDepositOption && (
                        <div className="space-y-3">
                          <p className="text-sm font-medium text-gray-700">Opzione di pagamento:</p>
                          <RadioGroup
                            value={paymentType}
                            onValueChange={(value: "full" | "deposit") => setPaymentType(value)}
                            className="space-y-2"
                          >
                            <div className="flex items-center space-x-3 p-3 rounded-lg border border-gray-200 hover:border-[#D4AF37]/50 cursor-pointer transition-colors">
                              <RadioGroupItem value="full" id="full" className="text-[#D4AF37]" />
                              <Label htmlFor="full" className="flex-1 cursor-pointer">
                                <div className="flex justify-between items-center">
                                  <div>
                                    <p className="font-medium">Pagamento Completo</p>
                                    <p className="text-xs text-gray-500">Paga tutto subito</p>
                                  </div>
                                  <span className="font-bold text-[#D4AF37]">{formatCartPrice(getTotal())}</span>
                                </div>
                              </Label>
                            </div>
                            <div className="flex items-center space-x-3 p-3 rounded-lg border border-gray-200 hover:border-[#D4AF37]/50 cursor-pointer transition-colors">
                              <RadioGroupItem value="deposit" id="deposit" className="text-[#D4AF37]" />
                              <Label htmlFor="deposit" className="flex-1 cursor-pointer">
                                <div className="flex justify-between items-center">
                                  <div>
                                    <p className="font-medium">Acconto</p>
                                    <p className="text-xs text-gray-500">Saldo all'arrivo</p>
                                  </div>
                                  <span className="font-bold text-green-600">{formatCartPrice(getDepositTotal())}</span>
                                </div>
                              </Label>
                            </div>
                          </RadioGroup>
                          <Separator />
                        </div>
                      )}
                      
                      <div className="flex justify-between items-center text-lg font-bold">
                        <span>{paymentType === "deposit" ? "Da pagare ora" : "Totale"}</span>
                        <span className="text-[#D4AF37] text-2xl">
                          {formatCartPrice(paymentType === "deposit" ? getDepositTotal() : getTotal())}
                        </span>
                      </div>

                      {paymentType === "deposit" && (
                        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                          <p className="text-sm text-amber-800">
                            <strong>Saldo restante:</strong> {formatCartPrice(getTotal() - getDepositTotal())} da pagare all'arrivo
                          </p>
                        </div>
                      )}
                      
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
