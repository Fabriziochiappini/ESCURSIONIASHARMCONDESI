import { useState, useEffect } from "react";
import { X, Cookie } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookieConsent");
    if (!consent) {
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem("cookieConsent", "accepted");
    setIsVisible(false);
  };

  const declineCookies = () => {
    localStorage.setItem("cookieConsent", "declined");
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div 
      className="fixed bottom-6 left-6 right-6 md:left-auto md:right-6 md:max-w-md z-50 animate-in slide-in-from-bottom-5 duration-500"
      data-testid="cookie-banner"
    >
      <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 p-6 relative">
        <button
          onClick={declineCookies}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Chiudi"
          data-testid="button-close-cookie"
        >
          <X className="h-5 w-5" />
        </button>
        
        <div className="flex items-start space-x-4 mb-4">
          <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
            <Cookie className="h-6 w-6 text-blue-600" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-gray-900 text-lg mb-2">
              Cookie
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Utilizziamo cookie per migliorare la tua esperienza di navigazione. 
              Continuando, accetti la nostra{" "}
              <a 
                href="/privacy#cookie" 
                className="text-blue-600 hover:underline font-medium"
                data-testid="link-cookie-policy"
              >
                Cookie Policy
              </a>
              .
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            onClick={acceptCookies}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
            data-testid="button-accept-cookies"
          >
            Accetta
          </Button>
          <Button
            onClick={declineCookies}
            variant="outline"
            className="flex-1"
            data-testid="button-decline-cookies"
          >
            Rifiuta
          </Button>
        </div>
      </div>
    </div>
  );
}
