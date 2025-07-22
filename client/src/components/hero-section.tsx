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
      {/* Modern Background with Parallax Effect */}
      <div className="absolute inset-0 hero-gradient"></div>
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-110 animate-pulse"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2400&h=1600')"
        }}
      />
      
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-20 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-indigo-500/5 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>
      
      <div className="relative z-10 text-center text-white max-w-6xl mx-auto px-4 animate-slide-up">
        <div className="mb-8">
          <h1 className="text-6xl md:text-8xl font-extrabold mb-6 leading-tight bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent">
            Trova la Casa
            <span className="block text-5xl md:text-7xl font-light mt-2 bg-gradient-to-r from-purple-200 to-blue-200 bg-clip-text text-transparent">
              dei Tuoi Sogni
            </span>
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-purple-500 to-blue-500 mx-auto mb-8 rounded-full"></div>
        </div>
        
        <p className="text-xl md:text-2xl mb-16 text-gray-100 max-w-3xl mx-auto leading-relaxed font-light">
          Scopri le proprietà più esclusive di <strong>Acireale</strong> e dintorni. 
          La tua nuova vita inizia qui, nel cuore della Sicilia.
        </p>
        
        <div className="glass-card rounded-3xl p-8 max-w-5xl mx-auto mb-12">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 items-end">
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-3">
                Cerca Proprietà
              </label>
              <Input
                type="text"
                placeholder="Cerca per titolo..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full h-12 rounded-xl border-gray-200 bg-white/90 backdrop-blur-sm"
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-3">
                Tipo di Contratto
              </label>
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger className="w-full h-12 rounded-xl border-gray-200 bg-white/90 backdrop-blur-sm">
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
              <label className="block text-sm font-semibold text-gray-800 mb-3">
                Zona
              </label>
              <Select value={selectedMunicipality} onValueChange={setSelectedMunicipality}>
                <SelectTrigger className="w-full h-12 rounded-xl border-gray-200 bg-white/90 backdrop-blur-sm">
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
              <label className="block text-sm font-semibold text-gray-800 mb-3">
                Prezzo Max
              </label>
              <Input
                type="number"
                placeholder="€ Max"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="w-full h-12 rounded-xl border-gray-200 bg-white/90 backdrop-blur-sm"
              />
            </div>
            
            <div>
              <Button 
                onClick={handleSearch}
                className="w-full h-12 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                <Search className="mr-2 h-5 w-5" />
                Cerca Ora
              </Button>
            </div>
          </div>
        </div>
        
        <div className="flex justify-center items-center space-x-8 text-sm text-gray-300">
          <span className="flex items-center">
            <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
            20+ Proprietà Disponibili
          </span>
          <span className="flex items-center">
            <div className="w-2 h-2 bg-blue-400 rounded-full mr-2 animate-pulse"></div>
            Tour Virtuali 360°
          </span>
          <span className="flex items-center">
            <div className="w-2 h-2 bg-purple-400 rounded-full mr-2 animate-pulse"></div>
            Consulenza Gratuita
          </span>
        </div>
      </div>
      
      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white/70 rounded-full mt-2 animate-pulse"></div>
        </div>
        <ChevronDown className="w-6 h-6 text-white/70 mx-auto mt-2" />
      </div>
    </section>
  );
}
