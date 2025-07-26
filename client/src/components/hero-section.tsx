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
      {/* Elegant Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&auto=format&fit=crop&w=2400&h=1600')"
        }}
      />
      
      {/* Elegant Overlay - più leggero come Michelangelo */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/80 via-white/60 to-white/40"></div>
      
      <div className="relative z-10 text-center max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 animate-fade-in">
        {/* Clean Modern Container */}
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-8 lg:p-12 mb-12 shadow-xl border">
          <div className="mb-8">
            <h1 className="text-4xl lg:text-6xl font-light mb-6 leading-tight text-gray-900">
              Trova la Casa dei Tuoi Sogni ad{' '}
              <span className="text-primary font-medium">Acireale</span>
            </h1>
            <div className="w-24 h-1 bg-primary mx-auto mb-8 rounded-full"></div>
          </div>
          
          <p className="text-xl mb-8 text-gray-700 max-w-3xl mx-auto leading-relaxed">
            Scopri le proprietà più esclusive di <strong className="text-primary">Acireale</strong> e dintorni. 
            Con <strong className="text-primary">AGENZIA 2 Servizi Immobiliari</strong>, la tua nuova vita inizia qui.
          </p>
        </div>
        
        {/* Clean Search Container */}
        <div className="bg-white rounded-2xl p-8 max-w-5xl mx-auto mb-12 shadow-lg border animate-slide-up">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-end">
            <div className="lg:col-span-1">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Cerca Proprietà
              </label>
              <Input
                type="text"
                placeholder="Cerca per titolo..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full h-12 rounded-lg border-gray-300 focus:border-primary focus:ring-primary"
              />
            </div>
            
            <div className="lg:col-span-1">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Tipo di Contratto
              </label>
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger className="w-full h-12 rounded-lg border-gray-300 focus:border-primary focus:ring-primary">
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
            
            <div className="lg:col-span-1">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Zona
              </label>
              <Select value={selectedMunicipality} onValueChange={setSelectedMunicipality}>
                <SelectTrigger className="w-full h-12 rounded-lg border-gray-300 focus:border-primary focus:ring-primary">
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
            
            <div className="lg:col-span-1">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Prezzo Max
              </label>
              <Input
                type="number"
                placeholder="€ Max"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="w-full h-12 rounded-lg border-gray-300 focus:border-primary focus:ring-primary"
              />
            </div>
            
            <div className="lg:col-span-1">
              <Button 
                onClick={handleSearch}
                className="w-full h-12 bg-primary hover:bg-primary/90 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Search className="mr-2 h-5 w-5" />
                Cerca Ora
              </Button>
            </div>
          </div>
        </div>
        
        {/* Clean Info Stats */}
        <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 max-w-4xl mx-auto animate-scale-in">
          <div className="flex flex-wrap justify-center items-center gap-8 text-sm font-medium text-gray-600">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-primary rounded-full mr-2"></div>
              20+ Proprietà Disponibili
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-secondary rounded-full mr-2"></div>
              Tour Virtuali 360°
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-accent rounded-full mr-2"></div>
              <strong>Geometra Antonio Cannavò</strong>
            </div>
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
