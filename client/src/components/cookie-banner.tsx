import { useState, useEffect } from "react";
import { Cookie } from "lucide-react";
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
      className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-lg animate-in slide-in-from-bottom duration-300"
      data-testid="cookie-banner"
    >
      <div className="max-w-7xl mx-auto px-4 py-3 sm:py-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
          {/* Icona e testo */}
          <div className="flex items-start gap-2 flex-1 min-w-0">
            <Cookie className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
              Utilizziamo cookie tecnici per garantire il corretto funzionamento del sito. 
              Per maggiori informazioni consulta la nostra{" "}
              <a 
                href="/privacy" 
                className="text-blue-600 hover:underline font-medium"
                data-testid="link-cookie-policy"
              >
                Privacy Policy
              </a>.
            </p>
          </div>

          {/* Pulsanti */}
          <div className="flex gap-2 w-full sm:w-auto flex-shrink-0">
            <Button
              onClick={acceptCookies}
              className="flex-1 sm:flex-none bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 sm:py-2 text-xs sm:text-sm h-8 sm:h-9 rounded-lg"
              data-testid="button-accept-cookies"
            >
              Accetta
            </Button>
            <Button
              onClick={declineCookies}
              variant="outline"
              className="flex-1 sm:flex-none px-4 py-1.5 sm:py-2 text-xs sm:text-sm h-8 sm:h-9 rounded-lg"
              data-testid="button-decline-cookies"
            >
              Rifiuta
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
