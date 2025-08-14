import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { WhatsAppFloat } from "@/components/whatsapp-float";
import { ScrollToTop } from "@/components/scroll-to-top";
import { CookieBanner } from "@/components/cookie-banner";
import Home from "@/pages/home";
import About from "@/pages/about";
import Properties from "@/pages/properties";
import PropertyDetail from "@/pages/property-detail";
import Services from "@/pages/services";
import Privacy from "@/pages/privacy";
import Admin from "@/pages/admin";
import AdminCountries from "@/pages/admin/countries";
import AdminShowcases from "@/pages/admin/showcases";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/chi-siamo" component={About} />
      <Route path="/viaggi" component={Properties} />
      <Route path="/properties" component={Properties} />
      <Route path="/travel/:id" component={PropertyDetail} />
      <Route path="/property/:id" component={PropertyDetail} />
      <Route path="/:type/:country/:travelType" component={PropertyDetail} />
      <Route path="/:type/:municipality/:propertyType" component={PropertyDetail} />
      <Route path="/servizi" component={Services} />
      <Route path="/privacy" component={Privacy} />
      <Route path="/admin" component={Admin} />
      <Route path="/admin/countries" component={AdminCountries} />
      <Route path="/admin/showcases" component={AdminShowcases} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <ScrollToTop />
        <Toaster />
        <Router />
        <WhatsAppFloat />
        <CookieBanner />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;