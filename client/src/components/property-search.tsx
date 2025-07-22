import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from "lucide-react";
import { PROPERTY_TYPES, PRICE_RANGES } from "@/lib/types";
import { useLocation } from "wouter";

export function PropertySearch() {
  const [, setLocation] = useLocation();
  const [filters, setFilters] = useState({
    type: "",
    municipality: "",
    maxPrice: ""
  });

  // Fetch dynamic municipalities
  const { data: municipalities = [] } = useQuery<string[]>({
    queryKey: ['/api/municipalities']
  });

  const handleSearch = () => {
    const searchParams = new URLSearchParams();
    
    if (filters.type) searchParams.set("type", filters.type);
    if (filters.municipality) searchParams.set("municipality", filters.municipality);
    if (filters.maxPrice) searchParams.set("maxPrice", filters.maxPrice);
    
    const queryString = searchParams.toString();
    setLocation(`/?${queryString}#properties`);
  };

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-3">
            Tipo di Contratto
          </label>
          <Select value={filters.type} onValueChange={(value) => setFilters(prev => ({ ...prev, type: value }))}>
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
          <Select value={filters.municipality} onValueChange={(value) => setFilters(prev => ({ ...prev, municipality: value }))}>
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
          <Select value={filters.maxPrice} onValueChange={(value) => setFilters(prev => ({ ...prev, maxPrice: value }))}>
            <SelectTrigger className="w-full h-12 rounded-xl border-gray-200 bg-white/90 backdrop-blur-sm">
              <SelectValue placeholder="Prezzo massimo" />
            </SelectTrigger>
            <SelectContent>
              {PRICE_RANGES.map((price) => (
                <SelectItem key={price.value} value={price.value.toString()}>
                  {price.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
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
  );
}
