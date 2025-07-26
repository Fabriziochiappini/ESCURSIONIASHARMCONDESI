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
    <section className="relative h-screen flex items-center justify-center overflow-hidden parallax">
      {/* Dynamic Background with Parallax */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-110 parallax"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&auto=format&fit=crop&w=3840&h=2160')"
        }}
      />
      
      {/* Modern Dark Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-primary/20 to-secondary/30"></div>
      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-accent/10 to-black/40"></div>
      
      {/* Floating Neon Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-20 w-96 h-96 bg-primary/30 rounded-full blur-3xl float animate-pulse neon-glow"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-secondary/25 rounded-full blur-3xl float animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-accent/20 rounded-full blur-3xl float" style={{animationDelay: '4s'}}></div>
      </div>
      
      <div className="relative z-10 text-center max-w-[1400px] mx-auto px-6 lg:px-12 animate-fade-in">
        {/* Modern Glass Container */}
        <div className="glass rounded-4xl p-12 lg:p-16 mb-16 mirror-reflection">
          <div className="mb-12">
            <h1 className="text-5xl lg:text-8xl font-bold mb-8 leading-tight neon-text">
              Trova la Casa dei Tuoi Sogni ad{' '}
              <span className="bg-gradient-to-r from-secondary to-accent bg-clip-text text-transparent">Acireale</span>
            </h1>
            <div className="w-32 h-2 gradient-primary mx-auto mb-12 rounded-full shadow-2xl"></div>
          </div>
          
          <p className="text-xl md:text-2xl mb-8 text-primary max-w-3xl mx-auto leading-relaxed font-light">
            Scopri le proprietà più esclusive di <strong className="text-secondary">Acireale</strong> e dintorni. 
            Con <strong className="text-secondary">AGENZIA 2 Servizi Immobiliari</strong>, la tua nuova vita inizia qui.
          </p>
        </div>
        
        {/* Modern Search Container */}
        <div className="glass rounded-3xl p-12 max-w-6xl mx-auto mb-16 animate-slide-up">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-end">
            <div className="lg:col-span-1">
              <label className="block text-lg font-bold text-foreground mb-4">
                Cerca Proprietà
              </label>
              <Input
                type="text"
                placeholder="Cerca per titolo..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full h-16 rounded-2xl glass-card text-foreground placeholder:text-foreground/60 text-lg"
              />
            </div>
            
            <div className="lg:col-span-1">
              <label className="block text-lg font-bold text-primary mb-4">
                Tipo di Contratto
              </label>
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger className="w-full h-16 rounded-2xl glass-card text-foreground text-lg">
                  <SelectValue placeholder="Seleziona tipo" />
                </SelectTrigger>
                <SelectContent className="glass-card">
                  {PROPERTY_TYPES.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="lg:col-span-1">
              <label className="block text-lg font-bold text-secondary mb-4">
                Zona
              </label>
              <Select value={selectedMunicipality} onValueChange={setSelectedMunicipality}>
                <SelectTrigger className="w-full h-16 rounded-2xl glass-card text-foreground text-lg">
                  <SelectValue placeholder="Seleziona zona" />
                </SelectTrigger>
                <SelectContent className="glass-card">
                  {municipalities.map((municipality) => (
                    <SelectItem key={municipality} value={municipality}>
                      {municipality}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="lg:col-span-1">
              <label className="block text-lg font-bold text-accent mb-4">
                Prezzo Max
              </label>
              <Input
                type="number"
                placeholder="€ Max"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="w-full h-16 rounded-2xl glass-card text-foreground placeholder:text-foreground/60 text-lg"
              />
            </div>
            
            <div className="lg:col-span-1">
              <Button 
                onClick={handleSearch}
                className="w-full h-16 gradient-primary text-white font-bold rounded-2xl shadow-2xl hover:scale-105 transition-all duration-300 neon-glow text-lg"
              >
                <Search className="mr-3 h-6 w-6" />
                Cerca Ora
              </Button>
            </div>
          </div>
        </div>
        
        {/* Modern Info Stats */}
        <div className="glass-card rounded-3xl p-8 max-w-5xl mx-auto animate-scale-in">
          <div className="flex flex-wrap justify-center items-center gap-8 text-lg font-semibold">
            <div className="flex items-center text-primary group hover:scale-105 transition-all duration-300">
              <div className="w-4 h-4 gradient-accent rounded-full mr-3 group-hover:animate-pulse"></div>
              20+ Proprietà Disponibili
            </div>
            <div className="flex items-center text-secondary group hover:scale-105 transition-all duration-300">
              <div className="w-4 h-4 gradient-secondary rounded-full mr-3 group-hover:animate-pulse"></div>
              Tour Virtuali 360°
            </div>
            <div className="flex items-center text-foreground group hover:scale-105 transition-all duration-300">
              <div className="w-4 h-4 gradient-primary rounded-full mr-3 group-hover:animate-pulse"></div>
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
