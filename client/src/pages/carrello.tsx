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
import { ShoppingCart, Trash2, Plus, Minus, CreditCard, ArrowLeft, ShoppingBag, Users, Wallet, ChevronDown, ChevronUp, FileText, Banknote, User, Mail, Phone } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { SiPaypal } from "react-icons/si";
import { StripeCheckout } from "@/components/stripe-checkout";
import { PayPalCheckout } from "@/components/paypal-checkout";

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
  const [paymentMethod, setPaymentMethod] = useState<"stripe" | "paypal">("stripe");
  const [showPayPalCheckout, setShowPayPalCheckout] = useState(false);
  const [paypalOrderId, setPaypalOrderId] = useState<string | null>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [showStripePayment, setShowStripePayment] = useState(false);
  const [showPayPalPayment, setShowPayPalPayment] = useState(false);
  
  const [customerData, setCustomerData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: ""
  });
  const [customerErrors, setCustomerErrors] = useState<Record<string, string>>({});

  const hasDepositOption = items.some(item => 
    (item.travel.depositAmount && Number(item.travel.depositAmount) > 0) ||
    (item.travel.depositPercentage && item.travel.depositPercentage > 0)
  );

  const getItemAddonsTotal = (item: typeof items[0]) => {
    if (!item.selectedAddons || item.selectedAddons.length === 0) return 0;
    return item.selectedAddons.reduce((t, sa) => t + Number(sa.addon.price) * item.participants, 0);
  };

  const calculateItemDeposit = (item: typeof items[0]) => {
    const travelPrice = Number(item.travel.price) * item.participants;
    const addonsPrice = getItemAddonsTotal(item);
    const fullPrice = travelPrice + addonsPrice;
    
    if (item.travel.depositPercentage && item.travel.depositPercentage > 0) {
      return (fullPrice * item.travel.depositPercentage) / 100;
    }
    if (item.travel.depositAmount && Number(item.travel.depositAmount) > 0) {
      return Number(item.travel.depositAmount) * item.participants + addonsPrice;
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
        const travelPrice = Number(item.travel.price) * item.participants;
        const addonsPrice = getItemAddonsTotal(item);
        const fullPrice = travelPrice + addonsPrice;
        const depositPrice = calculateItemDeposit(item);
        return {
          travelId: item.travel.id,
          travelTitle: item.travel.title,
          quantity: 1,
          participants: item.participants,
          participantNotes: item.participantNotes || "",
          price: paymentType === "deposit" ? depositPrice : fullPrice,
          fullPrice: fullPrice,
          selectedDate: item.selectedDate,
          selectedAddons: item.selectedAddons?.map(sa => ({
            addonId: sa.addon.id,
            addonName: sa.addon.name,
            addonPrice: sa.addon.price,
            quantity: sa.quantity
          })) || []
        };
      });
      
      const totalAmount = paymentType === "deposit" ? getDepositTotal() : getTotal();
      
      const response = await apiRequest("POST", "/api/cart/checkout", {
        items: cartData,
        total: totalAmount,
        paymentType: paymentType,
        customerData: {
          firstName: customerData.firstName,
          lastName: customerData.lastName,
          email: customerData.email,
          phone: customerData.phone
        }
      });
      
      return response.json();
    },
    onSuccess: (data: { clientSecret: string }) => {
      if (data.clientSecret) {
        setClientSecret(data.clientSecret);
        setShowStripePayment(true);
        setIsProcessing(false);
      }
    },
    onError: (error: any) => {
      console.error("Checkout error:", error);
      toast({ title: "Errore nel checkout", description: error.message || "Si è verificato un errore", variant: "destructive" });
      setIsProcessing(false);
    }
  });
  
  const handleStripePaymentSuccess = () => {
    toast({ 
      title: "Pagamento completato!", 
      description: "Grazie per il tuo acquisto. Riceverai una email di conferma." 
    });
    clearCart();
    setShowStripePayment(false);
    setClientSecret(null);
  };

  const handleStripePaymentError = () => {
    toast({ 
      title: "Errore nel pagamento", 
      description: "Si è verificato un errore durante il pagamento. Riprova.",
      variant: "destructive"
    });
  };

  const handlePayPalPaymentSuccess = () => {
    toast({ 
      title: "Pagamento completato!", 
      description: "Grazie per il tuo acquisto. Riceverai una email di conferma." 
    });
    clearCart();
    setShowPayPalPayment(false);
  };

  const handlePayPalPaymentError = () => {
    toast({ 
      title: "Errore nel pagamento", 
      description: "Si è verificato un errore durante il pagamento PayPal. Riprova.",
      variant: "destructive"
    });
  };

  const validateCustomerData = () => {
    const errors: Record<string, string> = {};
    
    if (!customerData.firstName.trim()) {
      errors.firstName = "Il nome è obbligatorio";
    }
    if (!customerData.lastName.trim()) {
      errors.lastName = "Il cognome è obbligatorio";
    }
    if (!customerData.email.trim()) {
      errors.email = "L'email è obbligatoria";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerData.email)) {
      errors.email = "Inserisci un'email valida";
    }
    if (!customerData.phone.trim()) {
      errors.phone = "Il telefono è obbligatorio";
    }
    
    setCustomerErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleCheckout = () => {
    if (items.length === 0) {
      toast({ title: "Il carrello è vuoto", variant: "destructive" });
      return;
    }
    
    if (!validateCustomerData()) {
      toast({ 
        title: "Dati mancanti", 
        description: "Compila tutti i campi obbligatori",
        variant: "destructive" 
      });
      return;
    }
    
    if (paymentMethod === "paypal") {
      setShowPayPalPayment(true);
    } else {
      setIsProcessing(true);
      checkoutMutation.mutate();
    }
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
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/viaggi">
                    <Button className="bg-[#D4AF37] hover:bg-[#C9A961] text-white px-8 py-3">
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Sfoglia le Escursioni
                    </Button>
                  </Link>
                  <Link href="/versa-saldo">
                    <Button variant="outline" className="border-orange-500 text-orange-600 hover:bg-orange-50 px-8 py-3" data-testid="button-pay-balance-cart">
                      <Wallet className="w-4 h-4 mr-2" />
                      Versa Saldo
                    </Button>
                  </Link>
                </div>
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
                            
                            {/* Servizi display */}
                            {item.selectedAddons && item.selectedAddons.length > 0 && (
                              <div className="mt-2 sm:mt-3 p-2 bg-amber-50 rounded-lg border border-amber-200">
                                <p className="text-xs font-semibold text-amber-800 mb-1">Servizi selezionati:</p>
                                <div className="space-y-1">
                                  {item.selectedAddons.map((sa) => (
                                    <div key={sa.addon.id} className="flex justify-between text-xs text-amber-700">
                                      <span>{sa.addon.name}</span>
                                      <span>+{formatCartPrice(Number(sa.addon.price) * item.participants)}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            <div className="mt-2 sm:mt-3 flex justify-between items-center">
                              <div className="text-xs sm:text-sm text-gray-500">
                                <div>{formatCartPrice(Number(item.travel.price))} x {item.participants} pers.</div>
                                {item.selectedAddons && item.selectedAddons.length > 0 && (
                                  <div className="text-amber-600">
                                    + {formatCartPrice(item.selectedAddons.reduce((t, sa) => t + Number(sa.addon.price) * item.participants, 0))} servizi
                                  </div>
                                )}
                              </div>
                              <span className="text-base sm:text-lg font-bold text-[#D4AF37]">
                                {formatCartPrice(
                                  Number(item.travel.price) * item.participants + 
                                  (item.selectedAddons?.reduce((t, sa) => t + Number(sa.addon.price) * item.participants, 0) || 0)
                                )}
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
                        {showPayPalPayment ? (
                          <SiPaypal className="h-5 w-5 text-blue-600" />
                        ) : (
                          <CreditCard className="h-5 w-5 text-[#D4AF37]" />
                        )}
                        {showStripePayment ? "Pagamento con Carta" : showPayPalPayment ? "Pagamento PayPal" : "Riepilogo Ordine"}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 space-y-4">
                      {showStripePayment && clientSecret ? (
                        <div className="space-y-4">
                          <div className="bg-green-50 p-4 rounded-lg border border-green-200 mb-4">
                            <h3 className="font-semibold text-green-800 mb-2">Riepilogo ordine</h3>
                            <div className="text-sm space-y-1">
                              {items.map((item) => (
                                <div key={item.travel.id} className="flex justify-between">
                                  <span className="truncate max-w-[180px]">{item.travel.title}</span>
                                  <span className="font-medium">{item.participants} pers.</span>
                                </div>
                              ))}
                              <div className="flex justify-between font-semibold pt-2 border-t border-green-300 mt-2">
                                <span>Totale da pagare:</span>
                                <span className="text-green-700">
                                  {formatCartPrice(paymentType === "deposit" ? getDepositTotal() : getTotal())}
                                </span>
                              </div>
                            </div>
                          </div>
                          
                          <StripeCheckout
                            clientSecret={clientSecret}
                            onSuccess={handleStripePaymentSuccess}
                            onError={handleStripePaymentError}
                          />
                          
                          <Button
                            variant="outline"
                            onClick={() => {
                              setShowStripePayment(false);
                              setClientSecret(null);
                            }}
                            className="w-full"
                          >
                            Torna al carrello
                          </Button>
                        </div>
                      ) : showPayPalPayment ? (
                        <div className="space-y-4">
                          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 mb-4">
                            <h3 className="font-semibold text-blue-800 mb-2">Riepilogo ordine</h3>
                            <div className="text-sm space-y-1">
                              {items.map((item) => (
                                <div key={item.travel.id} className="flex justify-between">
                                  <span className="truncate max-w-[180px]">{item.travel.title}</span>
                                  <span className="font-medium">{item.participants} pers.</span>
                                </div>
                              ))}
                              <div className="flex justify-between font-semibold pt-2 border-t border-blue-300 mt-2">
                                <span>Totale da pagare:</span>
                                <span className="text-blue-700">
                                  {formatCartPrice(paymentType === "deposit" ? getDepositTotal() : getTotal())}
                                </span>
                              </div>
                            </div>
                          </div>
                          
                          <PayPalCheckout
                            amount={paymentType === "deposit" ? getDepositTotal() : getTotal()}
                            onSuccess={handlePayPalPaymentSuccess}
                            onError={handlePayPalPaymentError}
                            bookingId={0}
                          />
                          
                          <Button
                            variant="outline"
                            onClick={() => setShowPayPalPayment(false)}
                            className="w-full"
                          >
                            Torna al carrello
                          </Button>
                        </div>
                      ) : (
                        <>
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

                      <div className="flex justify-between items-center text-lg font-bold">
                        <span>Totale Carrello</span>
                        <span className="text-[#D4AF37] text-2xl">
                          {formatCartPrice(getTotal())}
                        </span>
                      </div>

                      <Separator />

                      <div className="space-y-4">
                        <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                          <User className="h-4 w-4 text-[#D4AF37]" />
                          I Tuoi Dati
                        </h3>
                        
                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <Label htmlFor="firstName" className="text-xs text-gray-600">Nome *</Label>
                            <Input
                              id="firstName"
                              placeholder="Nome"
                              value={customerData.firstName}
                              onChange={(e) => setCustomerData(prev => ({ ...prev, firstName: e.target.value }))}
                              className={customerErrors.firstName ? "border-red-500" : ""}
                              data-testid="input-first-name"
                            />
                            {customerErrors.firstName && <p className="text-xs text-red-500">{customerErrors.firstName}</p>}
                          </div>
                          <div className="space-y-1">
                            <Label htmlFor="lastName" className="text-xs text-gray-600">Cognome *</Label>
                            <Input
                              id="lastName"
                              placeholder="Cognome"
                              value={customerData.lastName}
                              onChange={(e) => setCustomerData(prev => ({ ...prev, lastName: e.target.value }))}
                              className={customerErrors.lastName ? "border-red-500" : ""}
                              data-testid="input-last-name"
                            />
                            {customerErrors.lastName && <p className="text-xs text-red-500">{customerErrors.lastName}</p>}
                          </div>
                        </div>
                        
                        <div className="space-y-1">
                          <Label htmlFor="email" className="text-xs text-gray-600 flex items-center gap-1">
                            <Mail className="h-3 w-3" /> Email *
                          </Label>
                          <Input
                            id="email"
                            type="email"
                            placeholder="email@esempio.com"
                            value={customerData.email}
                            onChange={(e) => setCustomerData(prev => ({ ...prev, email: e.target.value }))}
                            className={customerErrors.email ? "border-red-500" : ""}
                            data-testid="input-email"
                          />
                          {customerErrors.email && <p className="text-xs text-red-500">{customerErrors.email}</p>}
                        </div>
                        
                        <div className="space-y-1">
                          <Label htmlFor="phone" className="text-xs text-gray-600 flex items-center gap-1">
                            <Phone className="h-3 w-3" /> Telefono *
                          </Label>
                          <Input
                            id="phone"
                            type="tel"
                            placeholder="+39 123 456 7890"
                            value={customerData.phone}
                            onChange={(e) => setCustomerData(prev => ({ ...prev, phone: e.target.value }))}
                            className={customerErrors.phone ? "border-red-500" : ""}
                            data-testid="input-phone"
                          />
                          {customerErrors.phone && <p className="text-xs text-red-500">{customerErrors.phone}</p>}
                        </div>
                      </div>

                      <Separator />

                      <div className="space-y-3">
                        <p className="text-sm font-medium text-gray-700">Metodo di pagamento:</p>
                        <RadioGroup
                          value={paymentMethod}
                          onValueChange={(value: "stripe" | "paypal") => setPaymentMethod(value)}
                          className="space-y-2"
                        >
                          <div className="flex items-center space-x-3 p-3 rounded-lg border border-gray-200 hover:border-[#D4AF37]/50 cursor-pointer transition-colors">
                            <RadioGroupItem value="stripe" id="stripe" className="text-[#D4AF37]" />
                            <Label htmlFor="stripe" className="flex-1 cursor-pointer flex items-center gap-2">
                              <CreditCard className="h-5 w-5 text-gray-600" />
                              <span className="font-medium">Carta di Credito</span>
                            </Label>
                          </div>
                          <div className="flex items-center space-x-3 p-3 rounded-lg border border-gray-200 hover:border-[#D4AF37]/50 cursor-pointer transition-colors">
                            <RadioGroupItem value="paypal" id="paypal" className="text-[#D4AF37]" />
                            <Label htmlFor="paypal" className="flex-1 cursor-pointer flex items-center gap-2">
                              <SiPaypal className="h-5 w-5 text-blue-600" />
                              <span className="font-medium">PayPal</span>
                            </Label>
                          </div>
                        </RadioGroup>
                      </div>

                      <Separator />
                      
                      <div className="space-y-3">
                        <Button
                          className={`w-full font-bold py-6 text-lg shadow-lg ${
                            paymentMethod === "paypal" 
                              ? "bg-blue-600 hover:bg-blue-700 text-white" 
                              : "bg-gradient-to-r from-[#D4AF37] to-[#E6C87F] hover:from-[#C9A961] hover:to-[#D4AF37] text-white"
                          }`}
                          onClick={() => {
                            setPaymentType("full");
                            handleCheckout();
                          }}
                          disabled={isProcessing || checkoutMutation.isPending}
                          data-testid="checkout-button-full"
                        >
                          {isProcessing || checkoutMutation.isPending ? (
                            <>
                              <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2" />
                              Elaborazione...
                            </>
                          ) : (
                            <>
                              {paymentMethod === "paypal" ? (
                                <SiPaypal className="w-5 h-5 mr-2" />
                              ) : (
                                <CreditCard className="w-5 h-5 mr-2" />
                              )}
                              Paga {formatCartPrice(getTotal())}
                            </>
                          )}
                        </Button>

                        {hasDepositOption && (
                          <Button
                            className="w-full font-bold py-6 text-lg shadow-lg bg-green-600 hover:bg-green-700 text-white"
                            onClick={() => {
                              setPaymentType("deposit");
                              handleCheckout();
                            }}
                            disabled={isProcessing || checkoutMutation.isPending}
                            data-testid="checkout-button-deposit"
                          >
                            {isProcessing || checkoutMutation.isPending ? (
                              <>
                                <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2" />
                                Elaborazione...
                              </>
                            ) : (
                              <>
                                <Wallet className="w-5 h-5 mr-2" />
                                Paga con Acconto {formatCartPrice(getDepositTotal())}
                              </>
                            )}
                          </Button>
                        )}

                        {hasDepositOption && (
                          <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-center">
                            <p className="text-sm text-green-800">
                              <strong>Saldo restante dopo l'acconto:</strong> {formatCartPrice(getTotal() - getDepositTotal())}
                            </p>
                          </div>
                        )}
                      </div>
                      
                        <p className="text-xs text-gray-500 text-center">
                          Pagamento sicuro e protetto.
                        </p>
                      </>
                    )}
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
