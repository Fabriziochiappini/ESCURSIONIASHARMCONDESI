import { useState } from "react";
import { useLocation } from "wouter";
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Building2, Search, Filter, MapPin, Bed, Bath, Square, Euro } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import type { Travel as Property } from "@shared/schema";
import { SEOHead } from "@/components/seo-head";
import { PropertyCard } from "@/components/property-card";

// Municipalities now loaded dynamically from API

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

export default function Properties() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedMunicipality, setSelectedMunicipality] = useState("Tutte le destinazioni");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [bedrooms, setBedrooms] = useState("all");

  // Fetch dynamic municipalities
  const { data: dynamicMunicipalities = [] } = useQuery<string[]>({
    queryKey: ['/api/municipalities']
  });

  // Combine with "Tutte le destinazioni" option
  const municipalities = ["Tutte le destinazioni", ...dynamicMunicipalities];

  // Initialize filters from URL parameters
  const [location] = useLocation();

  // Set initial values from URL on component mount
  React.useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);

    const searchFromUrl = urlParams.get('search');
    const typeFromUrl = urlParams.get('type');
    const propertyTypeFromUrl = urlParams.get('propertyType');
    const municipalityFromUrl = urlParams.get('municipality');
    const maxPriceFromUrl = urlParams.get('maxPrice');
    const bedroomsFromUrl = urlParams.get('bedrooms');

    if (searchFromUrl) setSearchTerm(searchFromUrl);
    if (typeFromUrl) setSelectedType(typeFromUrl);
    if (propertyTypeFromUrl) setSelectedCategory(propertyTypeFromUrl);
    if (municipalityFromUrl) setSelectedMunicipality(municipalityFromUrl);
    if (maxPriceFromUrl) setMaxPrice(maxPriceFromUrl);
    if (bedroomsFromUrl) setBedrooms(bedroomsFromUrl);
  }, []);

  const { data: properties = [], isLoading } = useQuery<Property[]>({
    queryKey: ['/api/travels/search', { 
      search: searchTerm,
      type: selectedType !== "all" ? selectedType : undefined,
      propertyType: selectedCategory !== "all" ? selectedCategory : undefined,
      municipality: selectedMunicipality !== "Tutti i comuni" ? selectedMunicipality : undefined,
      minPrice: minPrice || undefined,
      maxPrice: maxPrice || undefined,
      bedrooms: bedrooms !== "all" ? bedrooms : undefined
    }],
    queryFn: async () => {
      const params = new URLSearchParams();

      if (searchTerm) params.set('search', searchTerm);
      if (selectedType !== "all") params.set('type', selectedType);
      if (selectedCategory !== "all") params.set('propertyType', selectedCategory);
      if (selectedMunicipality !== "Tutti i comuni") params.set('municipality', selectedMunicipality);
      if (minPrice) params.set('minPrice', minPrice);
      if (maxPrice) params.set('maxPrice', maxPrice);
      if (bedrooms !== "all") params.set('bedrooms', bedrooms);

      const url = params.toString() ? `/api/travels/search?${params.toString()}` : '/api/travels';
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error('Failed to fetch travels');
      }

      return response.json();
    }
  });

  const formatPrice = (price: string, type: string, priceType: string | null) => {
    const numPrice = parseInt(price);
    if (priceType === "per_persona") {
      return `€ ${numPrice.toLocaleString('it-IT')} p.p.`;
    } else if (priceType === "totale") {
      return `€ ${numPrice.toLocaleString('it-IT')} totale`;
    } else {
      return `€ ${numPrice.toLocaleString('it-IT')}`;
    }
  };

  const getTypeLabel = (type: string) => {
    switch(type) {
      case "mare": return "Mare";
      case "montagna": return "Montagna";
      case "citta": return "Città";
      case "avventura": return "Avventura";
      case "relax": return "Relax";
      case "cultura": return "Cultura";
      default: return type;
    }
  };

  const getTypeBadgeColor = (type: string) => {
    switch(type) {
      case "mare": return "bg-blue-100 text-blue-800";
      case "montagna": return "bg-green-100 text-green-800";
      case "citta": return "bg-purple-100 text-purple-800";
      case "avventura": return "bg-orange-100 text-orange-800";
      case "relax": return "bg-pink-100 text-pink-800";
      case "cultura": return "bg-yellow-100 text-yellow-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <SEOHead 
        title="Viaggi e Destinazioni | Propato Travel"
        description="✈️ Scopri tutti i viaggi disponibili: vacanze mare, montagna, città, avventura. Propato Travel - la tua scelta migliore per viaggiare."
        keywords="viaggi pacchetti, vacanze mare montagna, destinazioni mondo, agenzia viaggi propato travel"
        canonicalUrl="https://propatotravel.com/properties"
      />
      <Navigation />

      <main className="pt-28">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-br from-purple-600 to-blue-600 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Tutti i Nostri Viaggi
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto opacity-90">
              Esplora le destinazioni più belle del mondo con i nostri pacchetti personalizzati. 
              Trova il viaggio perfetto per te.
            </p>
          </div>
        </section>

        {/* Search and Filters */}
        <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="glass-card">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Filter className="h-5 w-5 text-purple-600" />
                <h3 className="text-lg font-semibold text-gray-900">Filtra Viaggi</h3>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Cerca destinazioni..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>

                <Select value={selectedType} onValueChange={setSelectedType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    {TRAVEL_TYPES.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    {TRAVEL_CATEGORIES.map((category) => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={selectedMunicipality} onValueChange={setSelectedMunicipality}>
                  <SelectTrigger>
                    <SelectValue placeholder="Destinazione" />
                  </SelectTrigger>
                  <SelectContent>
                    {municipalities.filter(municipality => municipality && municipality.trim() !== "").map((municipality) => (
                      <SelectItem key={municipality} value={municipality}>
                        {municipality}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Input
                  placeholder="Prezzo min €"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  type="number"
                />

                <Input
                  placeholder="Prezzo max €"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  type="number"
                />

                <Select value={bedrooms} onValueChange={setBedrooms}>
                  <SelectTrigger>
                    <SelectValue placeholder="Durata" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tutte</SelectItem>
                    <SelectItem value="1">Weekend (2-3 giorni)</SelectItem>
                    <SelectItem value="2">Settimana (4-7 giorni)</SelectItem>
                    <SelectItem value="3">Due settimane (8-14 giorni)</SelectItem>
                    <SelectItem value="4">Oltre 15 giorni</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

        {/* Travel Packages Grid */}
        <section className="py-20 bg-white">
        <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <div className="aspect-video bg-gray-200 dark:bg-gray-700 rounded-t-lg"></div>
                  <CardContent className="p-6">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3 mb-4"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : properties.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <Building2 className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Nessun viaggio trovato
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Prova a modificare i filtri di ricerca per trovare più risultati.
              </p>
              <Button onClick={() => {
                setSearchTerm("");
                setSelectedType("all");
                setSelectedMunicipality("Tutte le destinazioni");
                setMinPrice("");
                setMaxPrice("");
                setBedrooms("all");
              }}>
                Cancella Filtri
              </Button>
            </div>
          ) : (
            <>
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900">
                  {properties.length} Pacchetti Viaggio Trovati
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 md:gap-8">
                {properties.map((property) => (
                  <PropertyCard key={property.id} property={property} />
                ))}
              </div>
            </>
          )}
        </div>
      </section>
      </main>

      <Footer />
    </div>
  );
}