import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { SEOHead } from "@/components/seo-head";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CreditCard, Search, Calendar, Users, MapPin, CheckCircle, AlertCircle, Wallet } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { StripeCheckout } from "@/components/stripe-checkout";

interface OrderData {
  orderId: string;
  customerName: string;
  customerEmail: string;
  orderTotal: number;
  amountPaid: number;
  remainingBalance: number;
  status: string;
  bookingDate: string;
  items: Array<{
    id: number;
    travelTitle: string;
    travelDate: string;
    numberOfParticipants: number;
    amount: number;
  }>;
}

export default function VersaSaldo() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [orderCode, setOrderCode] = useState("");
  const [orderData, setOrderData] = useState<OrderData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [showPayment, setShowPayment] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    if (code) {
      setOrderCode(code);
      handleSearch(code);
    }
  }, []);

  const handleSearch = async (code?: string) => {
    const searchCode = code || orderCode;
    if (!searchCode.trim()) {
      setError("Inserisci il codice ordine");
      return;
    }

    setIsLoading(true);
    setError(null);
    setOrderData(null);

    try {
      const response = await fetch(`/api/order/lookup?code=${encodeURIComponent(searchCode.trim())}`);
      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Ordine non trovato");
        return;
      }

      if (data.remainingBalance <= 0) {
        setError("Questo ordine è già stato saldato completamente!");
        return;
      }

      setOrderData(data);
    } catch (err) {
      setError("Errore nella ricerca dell'ordine");
    } finally {
      setIsLoading(false);
    }
  };

  const createPaymentMutation = useMutation({
    mutationFn: async () => {
      if (!orderData) throw new Error("Nessun ordine selezionato");
      
      const response = await apiRequest("POST", "/api/saldo/checkout", {
        orderId: orderData.orderId,
        amount: orderData.remainingBalance,
      });
      return response;
    },
    onSuccess: (data: any) => {
      setClientSecret(data.clientSecret);
      setShowPayment(true);
    },
    onError: (error: any) => {
      toast({
        title: "Errore",
        description: error.message || "Errore nella creazione del pagamento",
        variant: "destructive",
      });
    },
  });

  const handlePaymentSuccess = async (paymentIntentId?: string) => {
    if (orderData && paymentIntentId) {
      try {
        await fetch('/api/saldo/confirm', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            orderId: orderData.orderId,
            paymentIntentId: paymentIntentId,
          }),
        });
        console.log('✅ Balance payment confirmed for order:', orderData.orderId);
      } catch (err) {
        console.error('Error confirming balance payment:', err);
      }
    }
    
    toast({
      title: "Pagamento completato!",
      description: "Il saldo è stato versato con successo. Riceverai una email di conferma.",
    });
    setShowPayment(false);
    setOrderData(null);
    setOrderCode("");
    setClientSecret(null);
  };

  const handlePaymentError = () => {
    toast({
      title: "Pagamento non riuscito",
      description: "Si è verificato un errore durante il pagamento. Riprova.",
      variant: "destructive",
    });
  };

  const formatDate = (date: string) => {
    if (!date) return "Da definire";
    return new Date(date).toLocaleDateString('it-IT', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <>
      <SEOHead
        title="Versa Saldo - Si viaggia con Desi"
        description="Completa il pagamento del tuo ordine versando il saldo rimanente."
      />
      <Navigation />
      
      <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12">
        <div className="container mx-auto px-4 max-w-2xl">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
              <Wallet className="w-8 h-8 text-blue-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Versa Saldo</h1>
            <p className="text-gray-600">Inserisci il codice ordine per completare il pagamento</p>
          </div>

          {!orderData && !showPayment && (
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Search className="w-5 h-5" />
                  Cerca il tuo ordine
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="orderCode">Codice Ordine</Label>
                    <Input
                      id="orderCode"
                      placeholder="Es: ORD-1234567890-ABC123"
                      value={orderCode}
                      onChange={(e) => setOrderCode(e.target.value.toUpperCase())}
                      className="font-mono"
                      data-testid="input-order-code"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Trovi il codice nell'email di conferma che hai ricevuto
                    </p>
                  </div>

                  {error && (
                    <div className="flex items-center gap-2 p-3 bg-red-50 text-red-700 rounded-lg">
                      <AlertCircle className="w-5 h-5" />
                      <span>{error}</span>
                    </div>
                  )}

                  <Button
                    onClick={() => handleSearch()}
                    disabled={isLoading || !orderCode.trim()}
                    className="w-full"
                    data-testid="button-search-order"
                  >
                    {isLoading ? (
                      <>
                        <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                        Ricerca in corso...
                      </>
                    ) : (
                      <>
                        <Search className="w-4 h-4 mr-2" />
                        Cerca Ordine
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {orderData && !showPayment && (
            <div className="space-y-6">
              <Card className="border-green-200 bg-green-50">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3 mb-4">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                    <span className="font-semibold text-green-800">Ordine trovato!</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Codice:</span>
                      <p className="font-mono font-bold">{orderData.orderId}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Cliente:</span>
                      <p className="font-semibold">{orderData.customerName}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="w-5 h-5" />
                    Tour nell'ordine
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {orderData.items.map((item, index) => (
                      <div key={item.id} className="p-3 bg-gray-50 rounded-lg">
                        <p className="font-semibold">{item.travelTitle}</p>
                        <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {formatDate(item.travelDate)}
                          </span>
                          <span className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            {item.numberOfParticipants} pers.
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2 border-orange-300 bg-orange-50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-orange-800">
                    <CreditCard className="w-5 h-5" />
                    Riepilogo Pagamento
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-700">Totale Ordine:</span>
                      <span className="font-semibold">€{orderData.orderTotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-700">Già Versato (Acconto):</span>
                      <span className="font-semibold text-green-600">€{orderData.amountPaid.toFixed(2)}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between items-center py-2 bg-orange-100 px-3 rounded-lg -mx-3">
                      <span className="font-bold text-orange-800 text-lg">Saldo da Versare:</span>
                      <span className="font-bold text-2xl text-orange-700">€{orderData.remainingBalance.toFixed(2)}</span>
                    </div>
                  </div>

                  <Button
                    onClick={() => createPaymentMutation.mutate()}
                    disabled={createPaymentMutation.isPending}
                    className="w-full mt-6 bg-orange-600 hover:bg-orange-700"
                    size="lg"
                    data-testid="button-pay-balance"
                  >
                    {createPaymentMutation.isPending ? (
                      <>
                        <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                        Preparazione pagamento...
                      </>
                    ) : (
                      <>
                        <CreditCard className="w-5 h-5 mr-2" />
                        Paga Saldo €{orderData.remainingBalance.toFixed(2)}
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>

              <Button
                variant="outline"
                onClick={() => {
                  setOrderData(null);
                  setOrderCode("");
                }}
                className="w-full"
              >
                Cerca un altro ordine
              </Button>
            </div>
          )}

          {showPayment && clientSecret && orderData && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Pagamento Saldo - €{orderData.remainingBalance.toFixed(2)}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>Ordine:</strong> {orderData.orderId}
                  </p>
                </div>
                <StripeCheckout
                  clientSecret={clientSecret}
                  onSuccess={handlePaymentSuccess}
                  onError={handlePaymentError}
                />
                <Button
                  variant="ghost"
                  onClick={() => {
                    setShowPayment(false);
                    setClientSecret(null);
                  }}
                  className="w-full mt-4"
                >
                  Annulla
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}
