import { useState, useEffect } from "react";
import {
  useStripe,
  useElements,
  PaymentElement,
  Elements
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreditCard, CheckCircle, AlertCircle } from "lucide-react";

// Load Stripe
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY!);

interface CheckoutFormProps {
  clientSecret: string;
  onSuccess: () => void;
  onError: () => void;
}

function CheckoutForm({ clientSecret, onSuccess, onError }: CheckoutFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [message, setMessage] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);
    setMessage("");

    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: window.location.origin,
        },
        redirect: "if_required",
      });

      if (error) {
        console.error("Payment error:", error);
        if (error.type === "card_error" || error.type === "validation_error") {
          setMessage(error.message || "Si è verificato un errore durante il pagamento.");
        } else {
          setMessage("Si è verificato un errore imprevisto.");
        }
        onError();
      } else if (paymentIntent && paymentIntent.status === "succeeded") {
        setMessage("Pagamento completato con successo!");
        
        // Confirm payment on backend to update status
        try {
          await fetch('/api/confirm-payment', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ paymentIntentId: paymentIntent.id })
          });
          console.log('✅ Payment status updated in database');
        } catch (confirmError) {
          console.error('Error confirming payment:', confirmError);
        }
        
        onSuccess();
      }
    } catch (err) {
      console.error("Payment processing error:", err);
      setMessage("Si è verificato un errore durante l'elaborazione del pagamento.");
      onError();
    }

    setIsProcessing(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-blue-600" />
            Dettagli della carta
          </CardTitle>
        </CardHeader>
        <CardContent>
          <PaymentElement 
            options={{
              layout: "tabs",
              paymentMethodOrder: ["card", "apple_pay", "google_pay"],
            }}
          />
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

      <Button
        type="submit"
        disabled={!stripe || !elements || isProcessing}
        className="w-full"
        data-testid="button-stripe-pay"
      >
        {isProcessing ? (
          <>
            <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2" />
            Elaborazione pagamento...
          </>
        ) : (
          <>
            <CreditCard className="h-4 w-4 mr-2" />
            Paga ora
          </>
        )}
      </Button>

      <div className="text-xs text-gray-500 text-center">
        I tuoi dati di pagamento sono protetti con crittografia SSL a 256-bit
      </div>
    </form>
  );
}

interface StripeCheckoutProps {
  clientSecret: string;
  onSuccess: () => void;
  onError: () => void;
}

export function StripeCheckout({ clientSecret, onSuccess, onError }: StripeCheckoutProps) {
  const appearance = {
    theme: 'stripe' as const,
    variables: {
      colorPrimary: '#2563eb',
      colorBackground: '#ffffff',
      colorText: '#1f2937',
      colorDanger: '#ef4444',
      fontFamily: 'system-ui, sans-serif',
      spacingUnit: '4px',
      borderRadius: '6px',
    },
  };

  const options = {
    clientSecret,
    appearance,
  };

  return (
    <Elements options={options} stripe={stripePromise}>
      <CheckoutForm
        clientSecret={clientSecret}
        onSuccess={onSuccess}
        onError={onError}
      />
    </Elements>
  );
}