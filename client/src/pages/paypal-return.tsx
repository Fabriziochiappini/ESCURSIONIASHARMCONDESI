import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import { SiPaypal } from "react-icons/si";
import { Button } from "@/components/ui/button";

export default function PayPalReturn() {
  const [, setLocation] = useLocation();
  const [status, setStatus] = useState<'processing' | 'success' | 'error' | 'cancelled'>('processing');
  const [message, setMessage] = useState('Elaborazione pagamento in corso...');

  useEffect(() => {
    const processPayPalReturn = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get('token'); // PayPal order ID
      const payerId = urlParams.get('PayerID');
      
      console.log('🔄 PayPal return - URL params:', { token, payerId });

      // No token means popup flow or already processed
      if (!token) {
        console.log('⚠️ No token in URL - checking localStorage');
        const pendingDataStr = localStorage.getItem('paypal_pending');
        if (!pendingDataStr) {
          setStatus('success');
          setMessage('Pagamento completato! Puoi chiudere questa finestra.');
          setTimeout(() => window.close(), 2000);
          return;
        }
      }

      // No PayerID means user cancelled
      if (!payerId && token) {
        console.log('❌ No PayerID - payment cancelled');
        setStatus('cancelled');
        setMessage('Pagamento annullato. Torna al sito per riprovare.');
        localStorage.removeItem('paypal_pending');
        return;
      }

      // Complete payment using backend (database-based flow)
      if (token && payerId) {
        try {
          console.log('💳 Completing PayPal payment via backend:', token);
          
          const response = await fetch('/api/complete-paypal-return', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token })
          });
          
          const data = await response.json();
          console.log('📋 Backend response:', data);

          if (response.ok && data.success) {
            console.log('✅ Payment completed successfully!');
            localStorage.removeItem('paypal_pending');
            setStatus('success');
            setMessage('Pagamento completato con successo! Riceverai un\'email di conferma.');
          } else {
            console.log('❌ Payment failed:', data.message);
            setStatus('error');
            setMessage(data.message || 'Il pagamento non è stato completato. Riprova.');
            localStorage.removeItem('paypal_pending');
          }
        } catch (error: any) {
          console.error('❌ PayPal completion error:', error);
          setStatus('error');
          setMessage('Errore durante la conferma del pagamento. Contattaci per assistenza.');
          localStorage.removeItem('paypal_pending');
        }
        return;
      }

      // Fallback: try localStorage
      const pendingDataStr = localStorage.getItem('paypal_pending');
      if (pendingDataStr) {
        setStatus('success');
        setMessage('Pagamento in elaborazione. Se non ricevi conferma entro pochi minuti, contattaci.');
        localStorage.removeItem('paypal_pending');
      } else {
        setStatus('success');
        setMessage('Puoi chiudere questa finestra.');
        setTimeout(() => window.close(), 2000);
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
              onClick={() => setLocation('/viaggi')}
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
              onClick={() => setLocation('/viaggi')}
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
