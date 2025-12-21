import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import { SiPaypal } from "react-icons/si";
import { Button } from "@/components/ui/button";
import { apiRequest } from "@/lib/queryClient";

export default function PayPalReturn() {
  const [, setLocation] = useLocation();
  const [status, setStatus] = useState<'processing' | 'success' | 'error' | 'cancelled'>('processing');
  const [message, setMessage] = useState('Elaborazione pagamento in corso...');

  useEffect(() => {
    const processPayPalReturn = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get('token');
      const payerId = urlParams.get('PayerID');
      
      console.log('🔄 PayPal return - URL params:', { token, payerId });

      const pendingDataStr = localStorage.getItem('paypal_pending');
      console.log('📦 PayPal pending data from localStorage:', pendingDataStr);

      if (!pendingDataStr) {
        console.log('⚠️ No pending PayPal data - popup flow or already processed');
        setStatus('success');
        setMessage('Pagamento completato! Puoi chiudere questa finestra.');
        setTimeout(() => window.close(), 2000);
        return;
      }

      const pendingData = JSON.parse(pendingDataStr);
      const { orderID, bookingId } = pendingData;

      if (!payerId) {
        console.log('❌ No PayerID - payment cancelled');
        setStatus('cancelled');
        setMessage('Pagamento annullato. Torna al sito per riprovare.');
        localStorage.removeItem('paypal_pending');
        return;
      }

      try {
        console.log('💳 Capturing PayPal order:', orderID);
        const captureResponse = await apiRequest("POST", `/paypal/order/${orderID}/capture`, {});
        const captureData = await captureResponse.json();
        
        console.log('📋 Capture response:', captureData);

        if (captureData.status === "COMPLETED") {
          console.log('✅ Payment captured - confirming booking');
          
          await fetch('/api/confirm-paypal-payment', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ orderID, bookingId })
          });
          
          console.log('✅ Booking confirmed!');
          localStorage.removeItem('paypal_pending');
          
          setStatus('success');
          setMessage('Pagamento completato con successo! Riceverai un\'email di conferma.');
        } else {
          console.log('❌ Payment not completed:', captureData.status);
          setStatus('error');
          setMessage('Il pagamento non è stato completato. Riprova.');
          localStorage.removeItem('paypal_pending');
        }
      } catch (error: any) {
        console.error('❌ PayPal capture error:', error);
        setStatus('error');
        setMessage('Errore durante la conferma del pagamento. Contattaci per assistenza.');
        localStorage.removeItem('paypal_pending');
      }
    };

    processPayPalReturn();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
        <SiPaypal className="h-12 w-12 mx-auto text-blue-600 mb-6" />
        
        {status === 'processing' && (
          <>
            <Loader2 className="h-16 w-16 mx-auto text-blue-600 animate-spin mb-4" />
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              Elaborazione in corso...
            </h2>
            <p className="text-gray-600">{message}</p>
          </>
        )}

        {status === 'success' && (
          <>
            <CheckCircle className="h-16 w-16 mx-auto text-green-500 mb-4" />
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              Pagamento Completato!
            </h2>
            <p className="text-gray-600 mb-6">{message}</p>
            <Button 
              onClick={() => setLocation('/')}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Torna alla Home
            </Button>
          </>
        )}

        {status === 'error' && (
          <>
            <XCircle className="h-16 w-16 mx-auto text-red-500 mb-4" />
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              Errore nel Pagamento
            </h2>
            <p className="text-gray-600 mb-6">{message}</p>
            <Button 
              onClick={() => setLocation('/tour')}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Torna alle Escursioni
            </Button>
          </>
        )}

        {status === 'cancelled' && (
          <>
            <XCircle className="h-16 w-16 mx-auto text-amber-500 mb-4" />
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              Pagamento Annullato
            </h2>
            <p className="text-gray-600 mb-6">{message}</p>
            <Button 
              onClick={() => setLocation('/tour')}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Torna alle Escursioni
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
