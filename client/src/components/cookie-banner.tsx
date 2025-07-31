import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { X, Settings, Shield, Info } from "lucide-react";
import { Link } from "wouter";

interface CookiePreferences {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
}

export function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>({
    necessary: true, // Always true, can't be disabled
    analytics: false,
    marketing: false
  });

  useEffect(() => {
    // Check if user has already made a choice
    const cookieConsent = localStorage.getItem('cookie-consent');
    if (!cookieConsent) {
      // Show banner after a short delay
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const saveCookiePreferences = (prefs: CookiePreferences) => {
    localStorage.setItem('cookie-consent', JSON.stringify({
      timestamp: new Date().toISOString(),
      preferences: prefs
    }));
    setIsVisible(false);
    
    // Here you would typically initialize analytics/marketing tools based on preferences
    if (prefs.analytics) {
      // Initialize analytics (e.g., Google Analytics)
      console.log('Analytics cookies enabled');
    }
    if (prefs.marketing) {
      // Initialize marketing tools
      console.log('Marketing cookies enabled');
    }
  };

  const acceptAll = () => {
    const allAccepted = {
      necessary: true,
      analytics: true,
      marketing: true
    };
    saveCookiePreferences(allAccepted);
  };

  const acceptNecessaryOnly = () => {
    saveCookiePreferences({
      necessary: true,
      analytics: false,
      marketing: false
    });
  };

  const saveCustomPreferences = () => {
    saveCookiePreferences(preferences);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4">
      <Card className="max-w-4xl mx-auto border shadow-2xl bg-white">
        <CardContent className="p-0">
          {!showSettings ? (
            // Simple Banner
            <div className="flex flex-col lg:flex-row items-center justify-between p-6 gap-4">
              <div className="flex items-start space-x-4 flex-1">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Shield className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Rispettiamo la Tua Privacy
                  </h3>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    Utilizziamo cookie tecnici necessari per il funzionamento del sito e, 
                    con il tuo consenso, cookie per migliorare l'esperienza di navigazione.
                  </p>
                  <Link href="/privacy" className="text-primary hover:underline text-sm font-medium">
                    Leggi la Privacy Policy completa
                  </Link>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3 lg:flex-shrink-0">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowSettings(true)}
                  className="border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Gestisci
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={acceptNecessaryOnly}
                  className="border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  Solo Necessari
                </Button>
                <Button
                  size="sm"
                  onClick={acceptAll}
                  className="bg-primary hover:bg-primary/90 text-white"
                >
                  Accetta Tutti
                </Button>
              </div>
            </div>
          ) : (
            // Detailed Settings
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Settings className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="font-semibold text-gray-900 text-lg">
                    Gestisci Preferenze Cookie
                  </h3>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowSettings(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-6">
                {/* Cookie Necessari */}
                <div className="flex items-start justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h4 className="font-medium text-gray-900">Cookie Necessari</h4>
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                        Sempre Attivi
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">
                      Essenziali per il funzionamento del sito. Non possono essere disabilitati.
                    </p>
                    <div className="mt-2 text-xs text-gray-500">
                      Include: sessioni di navigazione, preferenze di sicurezza
                    </div>
                  </div>
                  <Switch checked={true} disabled className="mt-1" />
                </div>

                {/* Cookie Analitici */}
                <div className="flex items-start justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 mb-2">Cookie Analitici</h4>
                    <p className="text-sm text-gray-600">
                      Ci aiutano a capire come utilizzi il sito per migliorare l'esperienza utente.
                    </p>
                    <div className="mt-2 text-xs text-gray-500">
                      Include: statistiche di utilizzo anonime, ottimizzazione pagine
                    </div>
                  </div>
                  <Switch
                    checked={preferences.analytics}
                    onCheckedChange={(checked) => 
                      setPreferences(prev => ({ ...prev, analytics: checked }))
                    }
                    className="mt-1"
                  />
                </div>

                {/* Cookie Marketing */}
                <div className="flex items-start justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 mb-2">Cookie di Marketing</h4>
                    <p className="text-sm text-gray-600">
                      Per mostrarti contenuti più pertinenti ai tuoi interessi immobiliari.
                    </p>
                    <div className="mt-2 text-xs text-gray-500">
                      Include: personalizzazione contenuti, proposte mirate
                    </div>
                  </div>
                  <Switch
                    checked={preferences.marketing}
                    onCheckedChange={(checked) => 
                      setPreferences(prev => ({ ...prev, marketing: checked }))
                    }
                    className="mt-1"
                  />
                </div>
              </div>

              <Separator className="my-6" />

              <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="flex items-center text-sm text-gray-600">
                  <Info className="h-4 w-4 mr-2" />
                  <span>Puoi modificare queste preferenze in qualsiasi momento</span>
                </div>
                
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={acceptNecessaryOnly}
                    className="border-gray-300 text-gray-700 hover:bg-gray-50"
                  >
                    Solo Necessari
                  </Button>
                  <Button
                    size="sm"
                    onClick={saveCustomPreferences}
                    className="bg-primary hover:bg-primary/90 text-white"
                  >
                    Salva Preferenze
                  </Button>
                </div>
              </div>

              <div className="mt-4 text-center">
                <Link href="/privacy" className="text-primary hover:underline text-sm">
                  Leggi la Privacy Policy completa
                </Link>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}