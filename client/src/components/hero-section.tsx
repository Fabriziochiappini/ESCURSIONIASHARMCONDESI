import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ChevronDown, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLocation } from "wouter";

const PROPERTY_TYPES = [
  { value: "all", label: "Tutti i tipi" },
  { value: "vendita", label: "Vendita" },
  { value: "affitto", label: "Affitto" }, 
  { value: "casa_vacanza", label: "Casa Vacanza" }
];

export function HeroSection() {
  const [, setLocation] = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedMunicipality, setSelectedMunicipality] = useState("Tutti i comuni");
  const [maxPrice, setMaxPrice] = useState("");
  const [bedrooms, setBedrooms] = useState("all");

  // Fetch dynamic municipalities
  const { data: dynamicMunicipalities = [] } = useQuery<string[]>({
    queryKey: ['/api/municipalities']
  });

  // Combine with "Tutti i comuni" option
  const municipalities = ["Tutti i comuni", ...dynamicMunicipalities];

  const handleSearch = () => {
    const params = new URLSearchParams();
    
    if (searchTerm) params.set('search', searchTerm);
    if (selectedType !== "all") params.set('type', selectedType);
    if (selectedMunicipality !== "Tutti i comuni") params.set('municipality', selectedMunicipality);
    if (maxPrice) params.set('maxPrice', maxPrice);
    if (bedrooms !== "all") params.set('bedrooms', bedrooms);
    
    const queryString = params.toString();
    setLocation(`/proprieta${queryString ? `?${queryString}` : ''}`);
  };

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-110"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&auto=format&fit=crop&w=2400&h=1600')"
        }}
      />
      
      {/* Vivace Color Filter Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600/50 via-primary/40 to-secondary/30"></div>
      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-accent/10 to-primary/20"></div>
      
      {/* Vivace Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-20 w-72 h-72 bg-accent/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-secondary/15 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-primary/15 rounded-full blur-3xl animate-pulse"></div>
      </div>
      
      <div className="relative z-10 text-center text-primary-foreground max-w-6xl mx-auto px-4 animate-slide-up">
        {/* Contenitore trasparente per testi */}
        <div className="glass-card rounded-3xl p-8 mb-12 backdrop-blur-xl bg-white/25 border border-white/40 shadow-2xl">
          <div className="mb-8">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight text-primary">
              Trova la Casa dei Tuoi Sogni ad{' '}
              <span className="text-secondary">Acireale</span>
            </h1>
            <div className="w-24 h-1 bg-gradient-to-r from-primary to-secondary mx-auto mb-8 rounded-full"></div>
          </div>
          
          <p className="text-xl md:text-2xl mb-8 text-primary max-w-3xl mx-auto leading-relaxed font-light">
            Scopri le proprietà più esclusive di <strong className="text-secondary">Acireale</strong> e dintorni. 
            Con <strong className="text-secondary">AGENZIA 2 Servizi Immobiliari</strong>, la tua nuova vita inizia qui.
          </p>
        </div>
        
        {/* Contenitore trasparente per filtri */}
        <div className="glass-card rounded-3xl p-8 max-w-5xl mx-auto mb-12 backdrop-blur-xl bg-white/30 border-2 border-white/30 shadow-2xl">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 items-end">
            <div>
              <label className="block text-sm font-bold text-primary mb-3">
                Cerca Proprietà
              </label>
              <Input
                type="text"
                placeholder="Cerca per titolo..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full h-12 rounded-xl border-gray-200 bg-white/90 backdrop-blur-sm text-gray-900 placeholder:text-gray-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-bold text-primary mb-3">
                Tipo di Contratto
              </label>
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger className="w-full h-12 rounded-xl border-gray-200 bg-white/90 backdrop-blur-sm text-gray-900">
                  <SelectValue placeholder="Seleziona tipo" />
                </SelectTrigger>
                <SelectContent>
                  {PROPERTY_TYPES.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="block text-sm font-bold text-secondary mb-3">
                Zona
              </label>
              <Select value={selectedMunicipality} onValueChange={setSelectedMunicipality}>
                <SelectTrigger className="w-full h-12 rounded-xl border-gray-200 bg-white/90 backdrop-blur-sm text-gray-900">
                  <SelectValue placeholder="Seleziona zona" />
                </SelectTrigger>
                <SelectContent>
                  {municipalities.map((municipality) => (
                    <SelectItem key={municipality} value={municipality}>
                      {municipality}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="block text-sm font-bold text-secondary mb-3">
                Prezzo Max
              </label>
              <Input
                type="number"
                placeholder="€ Max"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="w-full h-12 rounded-xl border-gray-200 bg-white/90 backdrop-blur-sm text-gray-900 placeholder:text-gray-500"
              />
            </div>
            
            <div>
              <Button 
                onClick={handleSearch}
                className="w-full h-12 bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-primary-foreground font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                <Search className="mr-2 h-5 w-5" />
                Cerca Ora
              </Button>
            </div>
          </div>
        </div>
        
        {/* Contenitore trasparente per info */}
        <div className="glass-card rounded-2xl p-6 max-w-4xl mx-auto backdrop-blur-lg bg-white/25 border border-white/30 shadow-xl">
          <div className="flex justify-center items-center space-x-8 text-sm font-medium">
            <span className="flex items-center text-primary">
              <div className="w-2 h-2 bg-accent rounded-full mr-2"></div>
              20+ Proprietà Disponibili
            </span>
            <span className="flex items-center text-secondary">
              <div className="w-2 h-2 bg-secondary rounded-full mr-2"></div>
              Tour Virtuali 360°
            </span>
            <span className="flex items-center text-primary">
              <div className="w-2 h-2 bg-primary rounded-full mr-2"></div>
              <strong>Geometra Antonio Cannavò</strong>
            </span>
          </div>
        </div>
      </div>
      
      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
        <div className="w-6 h-10 border-2 border-primary/50 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-primary/70 rounded-full mt-2"></div>
        </div>
        <ChevronDown className="w-6 h-6 text-primary/70 mx-auto mt-2" />
      </div>
    </section>
  );
}
