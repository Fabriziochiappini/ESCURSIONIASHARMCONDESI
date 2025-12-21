import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, AlertCircle, Smartphone } from "lucide-react";
import { SiPaypal } from "react-icons/si";
import { apiRequest } from "@/lib/queryClient";

interface PayPalCheckoutProps {
  amount: number;
  onSuccess: () => void;
  onError: () => void;
  bookingId: number;
}

function isMobileDevice() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) 
    || window.innerWidth < 768;
}

export function PayPalCheckout({ amount, onSuccess, onError, bookingId }: PayPalCheckoutProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [message, setMessage] = useState<string>("");

  const handlePayPalPayment = async () => {
    setIsProcessing(true);
    setMessage("");

    try {
      const orderResponseData = await apiRequest("POST", "/paypal/order", {
        intent: "CAPTURE",
        amount: amount.toString(),
        currency: "EUR",
      });
      
      const orderResponse = await orderResponseData.json();

      if (!orderResponse.id) {
        throw new Error("Failed to create PayPal order");
      }

      const orderID = orderResponse.id;
      console.log('📦 PayPal order created:', orderID);
      
      const approvalUrl = orderResponse.links?.find(
        (link: any) => link.rel === "approve"
      )?.href;

      if (!approvalUrl) {
        throw new Error("No PayPal approval URL received");
      }

      // Link PayPal order to booking in database (for mobile redirect flow)
      await fetch('/api/link-paypal-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookingId, paypalOrderId: orderID })
      });
      console.log('🔗 PayPal order linked to booking in database');

      // Also save to localStorage as backup
      localStorage.setItem('paypal_pending', JSON.stringify({
        orderID,
        bookingId,
        amount,
        timestamp: Date.now()
      }));

      if (isMobileDevice()) {
        console.log('📱 Mobile detected - using redirect flow');
        window.location.href = approvalUrl;
        return;
      }

      console.log('🖥️ Desktop detected - using popup flow');
      const paypalWindow = window.open(
        approvalUrl,
        "paypal",
        "width=500,height=600,scrollbars=yes,resizable=yes"
      );

      if (!paypalWindow) {
        console.log('⚠️ Popup blocked - falling back to redirect');
        window.location.href = approvalUrl;
        return;
      }

      const pollTimer = setInterval(async () => {
        if (paypalWindow.closed) {
          clearInterval(pollTimer);
          
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          try {
            const captureResponseData = await apiRequest("POST", `/paypal/order/${orderID}/capture`, {});
            const captureResponse = await captureResponseData.json();
            
            if (captureResponse.status === "COMPLETED") {
              setMessage("Pagamento PayPal completato con successo!");
              
              await fetch('/api/confirm-paypal-payment', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ orderID, bookingId })
              });
              console.log('✅ PayPal payment confirmed');
              
              localStorage.removeItem('paypal_pending');
              
              setIsProcessing(false);
              onSuccess();
            } else {
              setIsProcessing(false);
              setMessage("Pagamento PayPal annullato.");
              localStorage.removeItem('paypal_pending');
              onError();
            }
          } catch (error) {
            console.error("PayPal capture error:", error);
            setIsProcessing(false);
            setMessage("Pagamento PayPal annullato o non completato.");
            localStorage.removeItem('paypal_pending');
            onError();
          }
        }
      }, 500);

      setTimeout(() => {
        clearInterval(pollTimer);
        if (!paypalWindow.closed) {
          paypalWindow.close();
        }
        if (isProcessing) {
          setIsProcessing(false);
          setMessage("Timeout del pagamento PayPal.");
          localStorage.removeItem('paypal_pending');
          onError();
        }
      }, 600000);

    } catch (error: any) {
      console.error("PayPal payment error:", error);
      setMessage(error.message || "Errore durante il pagamento PayPal.");
      localStorage.removeItem('paypal_pending');
      onError();
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <SiPaypal className="h-5 w-5 text-blue-600" />
            Pagamento PayPal
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6">
            <SiPaypal className="h-16 w-16 mx-auto text-blue-600 mb-4" />
            <p className="text-gray-600 mb-6">
              Sarai reindirizzato su PayPal per completare il pagamento di{" "}
              <span className="font-semibold">€ {amount.toLocaleString("it-IT")}</span>
            </p>
            
            {isMobileDevice() && (
              <div className="flex items-center justify-center gap-2 text-sm text-amber-600 mb-4 bg-amber-50 p-2 rounded-lg">
                <Smartphone className="h-4 w-4" />
                <span>Verrai reindirizzato a PayPal</span>
              </div>
            )}
            
            <Button
              onClick={handlePayPalPayment}
              disabled={isProcessing}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              data-testid="button-paypal-pay"
            >
              {isProcessing ? (
                <>
                  <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                  Elaborazione PayPal...
                </>
              ) : (
                <>
                  <SiPaypal className="h-4 w-4 mr-2" />
                  Paga con PayPal
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {message && (
        <div className={`p-3 rounded-lg flex items-center gap-2 ${
          message.includes("successo") 
            ? "bg-green-50 text-green-800 border border-green-200" 
            : "bg-red-50 text-red-800 border border-red-200"
        }`}>
          {message.includes("successo") ? (
            <CheckCircle className="h-4 w-4 flex-shrink-0" />
          ) : (
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
          )}
          <span className="text-sm">{message}</span>
        </div>
      )}

      <div className="text-xs text-gray-500 text-center">
        Pagamento sicuro protetto da PayPal
      </div>
    </div>
  );
}
