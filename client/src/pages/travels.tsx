import { useState } from "react";
import { useLocation } from "wouter";
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Plane, Search, Filter, MapPin, Clock, Users, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { Navigation } from "@/components/navigation";
import { AnnouncementBar } from "@/components/announcement-bar";
import { Footer } from "@/components/footer";
import { SupportSection } from "@/components/support-section";
import type { Travel } from "@shared/schema";
import { SEOHead } from "@/components/seo-head";
import { TravelCard } from "@/components/travel-card";
import { formatPrice, formatDuration, getTravelTypeIcon, getCategoryIcon } from "@/lib/types";

const TRAVEL_TYPES = [
  { value: "all", label: "Tutti i tipi" },
  { value: "mare", label: "Mare" },
  { value: "montagna", label: "Montagna" }, 
  { value: "citta", label: "Città" },
  { value: "avventura", label: "Avventura" },
  { value: "relax", label: "Relax" },
  { value: "cultura", label: "Cultura" }
];

const TRAVEL_CATEGORIES = [
  { value: "all", label: "Tutte le categorie" },
  { value: "singolo", label: "Singolo" },
  { value: "coppia", label: "Coppia" },
  { value: "famiglia", label: "Famiglia" },
  { value: "gruppo", label: "Gruppo" }
];

export default function Travels() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedCountry, setSelectedCountry] = useState("Tutti i paesi");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [maxDuration, setMaxDuration] = useState("all");

  // Fetch dynamic countries
  const { data: dynamicCountries = [] } = useQuery<string[]>({
    queryKey: ['/api/countries']
  });

  // Combine with "Tutti i paesi" option
  const countries = ["Tutti i paesi", ...dynamicCountries];

  // Initialize filters from URL parameters
  const [location] = useLocation();

  // Set initial values from URL on component mount
  React.useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);

    const searchFromUrl = urlParams.get('search');
    const typeFromUrl = urlParams.get('type');
    const travelTypeFromUrl = urlParams.get('travelType');
    const countryFromUrl = urlParams.get('country');
    const maxPriceFromUrl = urlParams.get('maxPrice');
    const maxDurationFromUrl = urlParams.get('maxDuration');

    if (searchFromUrl) setSearchTerm(searchFromUrl);
    if (typeFromUrl) setSelectedType(typeFromUrl);
    if (travelTypeFromUrl) setSelectedCategory(travelTypeFromUrl);
    if (countryFromUrl) setSelectedCountry(countryFromUrl);
    if (maxPriceFromUrl) setMaxPrice(maxPriceFromUrl);
    if (maxDurationFromUrl) setMaxDuration(maxDurationFromUrl);
  }, []);

  // Build query parameters for API call
  const buildQueryParams = () => {
    const params = new URLSearchParams();
    
    if (searchTerm.trim()) params.set('search', searchTerm.trim());
    if (selectedType !== 'all') params.set('type', selectedType);
    if (selectedCategory !== 'all') params.set('travelType', selectedCategory);
    if (selectedCountry !== 'Tutti i paesi') params.set('country', selectedCountry);
    if (minPrice) params.set('minPrice', minPrice);
    if (maxPrice) params.set('maxPrice', maxPrice);
    if (maxDuration !== 'all') params.set('maxDuration', maxDuration);
    
    return params.toString();
  };

  // Fetch travels with filters - SEMPRE usa /api/travels/search
  const { data: travels = [], isLoading, error } = useQuery<Travel[]>({
    queryKey: ['/api/travels/search', buildQueryParams()],
    queryFn: async () => {
      const queryParams = buildQueryParams();
      const url = `/api/travels/search${queryParams ? `?${queryParams}` : ''}`;
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch travels');
      return response.json();
    }
  });

  const handleSearch = () => {
    // Re-trigger the query by updating the search term state
    setSearchTerm(searchTerm);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedType("all");
    setSelectedCategory("all");
    setSelectedCountry("Tutti i paesi");
    setMinPrice("");
    setMaxPrice("");
    setMaxDuration("all");
  };

  const hasActiveFilters = searchTerm || selectedType !== "all" || selectedCategory !== "all" || 
                          selectedCountry !== "Tutti i paesi" || minPrice || maxPrice || maxDuration !== "all";

  return (
    <div className="min-h-screen bg-background">
      <SEOHead 
        title="Escursioni a Sharm - Scopri le Migliori Destinazioni | Si Viaggia con Desi"
        description="🌍 Scopri i nostri tour: mare, deserto, cultura, avventura, relax. Trova l'escursione perfetta a Sharm El Sheikh con Si Viaggia con Desi."
        keywords="tour, escursioni, destinazioni sharm, mare, deserto, cultura, avventura, pacchetti tour, si viaggia con desy"
        canonicalUrl="https://siviaggiacondesy.com/viaggi"
      />
      <AnnouncementBar />
      <Navigation />
      
      <main className="pt-20 lg:pt-[148px]">
        {/* Header Section */}
        <section className="bg-gradient-to-br from-[#2C3E50] via-[#1e3a5f] to-[#2C3E50] text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#E6C87F] via-[#D4AF37] to-[#E6C87F] bg-clip-text text-transparent mb-4 tracking-[0.15em] uppercase drop-shadow-2xl font-eagle-lake">
                Scegli la tua avventura a Sharm
              </h1>
              <p className="text-xl opacity-90 max-w-3xl mx-auto">
                Scopri le meraviglie del Mar Rosso e del deserto egiziano
              </p>
            </div>

            {/* Search and Filter Bar */}
            <div className="hidden bg-white/10 backdrop-blur-sm rounded-2xl p-6 mb-8">
              <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-7 gap-4">
                <div className="md:col-span-2">
                  <Input
                    type="text"
                    placeholder="Cerca destinazione o titolo..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="h-12 bg-white border-gray-200 placeholder:text-gray-600 text-gray-900"
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  />
                </div>

                <Select value={selectedType} onValueChange={setSelectedType}>
                  <SelectTrigger className="h-12 bg-white text-gray-900">
                    <SelectValue placeholder="Tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    {TRAVEL_TYPES.map(type => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="h-12 bg-white text-gray-900">
                    <SelectValue placeholder="Categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    {TRAVEL_CATEGORIES.map(category => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={selectedCountry} onValueChange={setSelectedCountry}>
                  <SelectTrigger className="h-12 bg-white text-gray-900">
                    <SelectValue placeholder="Paese" />
                  </SelectTrigger>
                  <SelectContent>
                    {countries.filter(country => country).map(country => (
                      <SelectItem key={country} value={country}>
                        {country}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Input
                  type="number"
                  placeholder="Budget max €"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="h-12 bg-white placeholder:text-gray-600 text-gray-900"
                />

                <div className="flex gap-2">
                  <Button 
                    onClick={handleSearch}
                    className="h-12 bg-blue-600 hover:bg-blue-700 flex-1"
                  >
                    <Search className="h-4 w-4 mr-2" />
                    Cerca Tour
                  </Button>
                </div>
              </div>

              {hasActiveFilters && (
                <div className="flex justify-between items-center mt-4 pt-4 border-t border-white/20">
                  <span className="text-white/80">
                    {travels.length} {travels.length === 1 ? 'tour trovato' : 'tour trovati'}
                  </span>
                  <Button
                    variant="ghost"
                    onClick={clearFilters}
                    className="text-white hover:bg-white/10"
                  >
                    <Filter className="h-4 w-4 mr-2" />
                    Pulisci filtri
                  </Button>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Results Section */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {isLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
                <p>Caricamento tour...</p>
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <p className="text-red-600">Errore nel caricamento dei tour</p>
              </div>
            ) : travels.length === 0 ? (
              <div className="text-center py-12">
                <Plane className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Nessun tour trovato
                </h3>
                <p className="text-gray-600 mb-4">
                  Prova a modificare i filtri di ricerca
                </p>
                <Button onClick={clearFilters} variant="outline">
                  Pulisci filtri
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {travels.map((travel) => (
                  <TravelCard key={travel.id} travel={travel} />
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

      <SupportSection />
      <Footer />
    </div>
  );
}