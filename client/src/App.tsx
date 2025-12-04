import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { WhatsAppFloat } from "@/components/whatsapp-float";
import { ScrollToTop } from "@/components/scroll-to-top";
import { CookieBanner } from "@/components/cookie-banner";
import { CartProvider } from "@/contexts/cart-context";
import { useEffect } from "react";

// Prefetch dati principali per navigazione veloce
function usePrefetchData() {
  useEffect(() => {
    // Prefetch tour featured per homepage e pagina escursioni
    queryClient.prefetchQuery({
      queryKey: ['/api/travels/featured'],
      staleTime: 1000 * 60 * 5,
    });
    queryClient.prefetchQuery({
      queryKey: ['/api/travels/search', ''],
      staleTime: 1000 * 60 * 5,
    });
    queryClient.prefetchQuery({
      queryKey: ['/api/galleries'],
      staleTime: 1000 * 60 * 5,
    });
  }, []);
}
import Home from "@/pages/home";
import About from "@/pages/about";
import Properties from "@/pages/properties";
import Travels from "@/pages/travels";
import Galleria from "@/pages/galleria";
import Contatti from "@/pages/contatti";
import Carrello from "@/pages/carrello";
import PropertyDetail from "@/pages/property-detail";
import TravelDetail from "@/pages/travel-detail";
import GuideDetail from "@/pages/guide-detail";
import Services from "@/pages/services";
import Privacy from "@/pages/privacy";
import Admin from "@/pages/admin";
import AdminCountries from "@/pages/admin/countries";
import AdminShowcases from "@/pages/admin/showcases";
import AdminGalleries from "@/pages/admin/galleries";
import AdminGuides from "@/pages/admin/guides";
import AdminBookings from "@/pages/admin/bookings";
import AdminAddons from "@/pages/admin/addons";
import ResetDemo from "@/pages/reset-demo";
import PayPalReturn from "@/pages/paypal-return";
import Indicazioni from "@/pages/indicazioni";
import VersaSaldo from "@/pages/versa-saldo";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/chi-siamo" component={About} />
      <Route path="/viaggi" component={Travels} />
      <Route path="/galleria" component={Galleria} />
      <Route path="/contatti" component={Contatti} />
      <Route path="/carrello" component={Carrello} />
      <Route path="/properties" component={Properties} />
      <Route path="/travel/:id" component={TravelDetail} />
      <Route path="/guide/:id" component={GuideDetail} />
      <Route path="/property/:id" component={PropertyDetail} />
      <Route path="/:type/:country/:travelType" component={TravelDetail} />
      <Route path="/:type/:municipality/:propertyType" component={PropertyDetail} />
      <Route path="/servizi" component={Services} />
      <Route path="/indicazioni" component={Indicazioni} />
      <Route path="/privacy" component={Privacy} />
      <Route path="/admin" component={Admin} />
      <Route path="/admin/countries" component={AdminCountries} />
      <Route path="/admin/showcases" component={AdminShowcases} />
      <Route path="/admin/galleries" component={AdminGalleries} />
      <Route path="/admin/guides" component={AdminGuides} />
      <Route path="/admin/bookings" component={AdminBookings} />
      <Route path="/admin/addons" component={AdminAddons} />
      <Route path="/reset-demo" component={ResetDemo} />
      <Route path="/paypal-return" component={PayPalReturn} />
      <Route path="/versa-saldo" component={VersaSaldo} />
      <Route component={NotFound} />
    </Switch>
  );
}

function PrefetchProvider({ children }: { children: React.ReactNode }) {
  usePrefetchData();
  return <>{children}</>;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <CartProvider>
        <TooltipProvider>
          <PrefetchProvider>
            <ScrollToTop />
            <Toaster />
            <Router />
            <WhatsAppFloat />
            <CookieBanner />
          </PrefetchProvider>
        </TooltipProvider>
      </CartProvider>
    </QueryClientProvider>
  );
}

export default App;