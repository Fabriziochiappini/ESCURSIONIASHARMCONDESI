import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, AlertCircle } from "lucide-react";
import { SiPaypal } from "react-icons/si";
import { apiRequest } from "@/lib/queryClient";

interface PayPalCheckoutProps {
  amount: number;
  onSuccess: () => void;
  onError: () => void;
  bookingId: number;
}

export function PayPalCheckout({ amount, onSuccess, onError, bookingId }: PayPalCheckoutProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [message, setMessage] = useState<string>("");

  const handlePayPalPayment = async () => {

    setIsProcessing(true);
    setMessage("");

    try {
      // Step 1: Create PayPal order
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
      
      // Step 2: Redirect to PayPal for approval
      const approvalUrl = orderResponse.links?.find(
        (link: any) => link.rel === "approve"
      )?.href;

      if (approvalUrl) {
        // Open PayPal in a new window
        const paypalWindow = window.open(
          approvalUrl,
          "paypal",
          "width=500,height=600,scrollbars=yes,resizable=yes"
        );

        if (!paypalWindow) {
          throw new Error("PopUp blocked. Please allow popups for PayPal payment.");
        }

        // Poll for window closure - user will close after approving
        const pollTimer = setInterval(async () => {
          if (paypalWindow.closed) {
            clearInterval(pollTimer);
            
            // Give PayPal a moment to process the approval
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Window closed by user - try to capture the payment
            try {
              const captureResponseData = await apiRequest("POST", `/paypal/order/${orderID}/capture`, {});
              const captureResponse = await captureResponseData.json();
              
              if (captureResponse.status === "COMPLETED") {
                setMessage("Pagamento PayPal completato con successo!");
                
                // Confirm payment on backend
                await fetch('/api/confirm-paypal-payment', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ orderID, bookingId })
                });
                console.log('✅ PayPal payment status updated in database');
                
                setIsProcessing(false);
                onSuccess();
              } else {
                setIsProcessing(false);
                setMessage("Pagamento PayPal annullato.");
                onError();
              }
            } catch (error) {
              console.error("PayPal capture error:", error);
              setIsProcessing(false);
              setMessage("Pagamento PayPal annullato o non completato.");
              onError();
            }
          }
        }, 500);

        // Set a timeout to stop polling after 10 minutes
        setTimeout(() => {
          clearInterval(pollTimer);
          if (!paypalWindow.closed) {
            paypalWindow.close();
          }
          if (isProcessing) {
            setIsProcessing(false);
            setMessage("Timeout del pagamento PayPal.");
            onError();
          }
        }, 600000); // 10 minutes

      } else {
        throw new Error("No PayPal approval URL received");
      }

    } catch (error: any) {
      console.error("PayPal payment error:", error);
      setMessage(error.message || "Errore durante il pagamento PayPal.");
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