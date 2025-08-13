import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from "lucide-react";
import { TRAVEL_TYPES, TRAVEL_CATEGORIES, PRICE_RANGES, DURATION_RANGES } from "@/lib/types";
import { useLocation } from "wouter";

export function TravelSearch() {
  const [, setLocation] = useLocation();
  const [filters, setFilters] = useState({
    type: "",
    country: "",
    travelType: "",
    maxPrice: "",
    maxDuration: ""
  });

  // Fetch dynamic countries
  const { data: countries = [] } = useQuery<string[]>({
    queryKey: ['/api/countries']
  });

  const handleSearch = () => {
    const searchParams = new URLSearchParams();
    
    if (filters.type) searchParams.set("type", filters.type);
    if (filters.country) searchParams.set("country", filters.country);
    if (filters.travelType) searchParams.set("travelType", filters.travelType);
    if (filters.maxPrice) searchParams.set("maxPrice", filters.maxPrice);
    if (filters.maxDuration) searchParams.set("maxDuration", filters.maxDuration);
    
    const queryString = searchParams.toString();
    setLocation(`/viaggi${queryString ? `?${queryString}` : ''}`);
  };

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6 items-end">
        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-3">
            Tipo di Viaggio
          </label>
          <Select value={filters.type} onValueChange={(value) => setFilters(prev => ({ ...prev, type: value }))}>
            <SelectTrigger className="w-full h-12 rounded-xl border-gray-200 bg-white/90 backdrop-blur-sm">
              <SelectValue placeholder="Seleziona tipo" />
            </SelectTrigger>
            <SelectContent>
              {TRAVEL_TYPES.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-3">
            Destinazione
          </label>
          <Select value={filters.country} onValueChange={(value) => setFilters(prev => ({ ...prev, country: value }))}>
            <SelectTrigger className="w-full h-12 rounded-xl border-gray-200 bg-white/90 backdrop-blur-sm">
              <SelectValue placeholder="Seleziona paese" />
            </SelectTrigger>
            <SelectContent>
              {countries.filter(country => country && country.trim() !== "").map((country) => (
                <SelectItem key={country} value={country}>
                  {country}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-3">
            Categoria
          </label>
          <Select value={filters.travelType} onValueChange={(value) => setFilters(prev => ({ ...prev, travelType: value }))}>
            <SelectTrigger className="w-full h-12 rounded-xl border-gray-200 bg-white/90 backdrop-blur-sm">
              <SelectValue placeholder="Chi viaggia?" />
            </SelectTrigger>
            <SelectContent>
              {TRAVEL_CATEGORIES.map((category) => (
                <SelectItem key={category.value} value={category.value}>
                  {category.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-3">
            Budget Max
          </label>
          <Select value={filters.maxPrice} onValueChange={(value) => setFilters(prev => ({ ...prev, maxPrice: value }))}>
            <SelectTrigger className="w-full h-12 rounded-xl border-gray-200 bg-white/90 backdrop-blur-sm">
              <SelectValue placeholder="Budget" />
            </SelectTrigger>
            <SelectContent>
              {PRICE_RANGES.map((range) => (
                <SelectItem key={range.value} value={range.value.toString()}>
                  {range.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Button 
            onClick={handleSearch}
            className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold flex items-center justify-center gap-2 transition-all duration-300"
          >
            <Search className="h-5 w-5" />
            Cerca Viaggi
          </Button>
        </div>
      </div>
    </div>
  );
}