import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from "lucide-react";
import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";

const PROPERTY_TYPES = [
  { value: "all", label: "Tutti i tipi" },
  { value: "vendita", label: "Vendita" },
  { value: "affitto", label: "Affitto" },
  { value: "casa_vacanza", label: "Casa Vacanza" }
];

export function PropertySearchFilter() {
  const [, setLocation] = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedMunicipality, setSelectedMunicipality] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const { data: municipalities = [] } = useQuery<string[]>({
    queryKey: ['/api/municipalities'],
  });

  const handleSearch = () => {
    const params = new URLSearchParams();
    
    if (searchTerm) params.set('search', searchTerm);
    if (selectedType && selectedType !== "all") params.set('type', selectedType);
    if (selectedMunicipality) params.set('municipality', selectedMunicipality);
    if (maxPrice) params.set('maxPrice', maxPrice);

    const queryString = params.toString();
    setLocation(`/properties${queryString ? `?${queryString}` : ''}`);
  };

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 max-w-5xl mx-auto mb-12 border border-white/20 animate-slide-up">
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-end">
        <div className="lg:col-span-1">
          <label className="block text-sm font-semibold text-white mb-3">
            Cerca Proprietà
          </label>
          <Input
            type="text"
            placeholder="Cerca per titolo..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full h-12 rounded-lg bg-white/90 border-white/30 focus:border-primary focus:ring-primary text-gray-900"
          />
        </div>
        
        <div className="lg:col-span-1">
          <label className="block text-sm font-semibold text-white mb-3">
            Tipo di Contratto
          </label>
          <Select value={selectedType} onValueChange={setSelectedType}>
            <SelectTrigger className="w-full h-12 rounded-lg bg-white/90 border-white/30 focus:border-primary focus:ring-primary text-gray-900">
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
          <label className="block text-sm font-semibold text-white mb-3">
            Zona
          </label>
          <Select value={selectedMunicipality} onValueChange={setSelectedMunicipality}>
            <SelectTrigger className="w-full h-12 rounded-lg bg-white/90 border-white/30 focus:border-primary focus:ring-primary text-gray-900">
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
          <label className="block text-sm font-semibold text-white mb-3">
            Prezzo Max
          </label>
          <Input
            type="number"
            placeholder="€ Max"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="w-full h-12 rounded-lg bg-white/90 border-white/30 focus:border-primary focus:ring-primary text-gray-900"
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
  );
}