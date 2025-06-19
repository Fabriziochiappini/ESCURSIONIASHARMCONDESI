import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from "lucide-react";
import { MUNICIPALITIES, PROPERTY_TYPES, PRICE_RANGES } from "@/lib/types";
import { useLocation } from "wouter";

export function PropertySearch() {
  const [, setLocation] = useLocation();
  const [filters, setFilters] = useState({
    type: "",
    municipality: "",
    maxPrice: ""
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
    <div className="bg-white rounded-2xl p-6 shadow-2xl max-w-4xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tipo di Contratto
          </label>
          <Select value={filters.type} onValueChange={(value) => setFilters(prev => ({ ...prev, type: value }))}>
            <SelectTrigger className="w-full">
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
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Zona
          </label>
          <Select value={filters.municipality} onValueChange={(value) => setFilters(prev => ({ ...prev, municipality: value }))}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Seleziona zona" />
            </SelectTrigger>
            <SelectContent>
              {MUNICIPALITIES.map((municipality) => (
                <SelectItem key={municipality} value={municipality}>
                  {municipality}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Prezzo Max
          </label>
          <Select value={filters.maxPrice} onValueChange={(value) => setFilters(prev => ({ ...prev, maxPrice: value }))}>
            <SelectTrigger className="w-full">
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
            className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold"
          >
            <Search className="mr-2 h-4 w-4" />
            Cerca
          </Button>
        </div>
      </div>
    </div>
  );
}
