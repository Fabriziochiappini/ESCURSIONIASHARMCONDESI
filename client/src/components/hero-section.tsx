import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ChevronDown, Search, Filter, MapPin, Bed, Bath, Square, Euro, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import type { Property } from "@shared/schema";

const PROPERTY_TYPES = [
  { value: "all", label: "Tutti i tipi" },
  { value: "vendita", label: "Vendita" },
  { value: "affitto", label: "Affitto" }, 
  { value: "casa_vacanza", label: "Casa Vacanza" }
];

export function HeroSection() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedMunicipality, setSelectedMunicipality] = useState("Tutti i comuni");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [bedrooms, setBedrooms] = useState("all");

  // Fetch dynamic municipalities
  const { data: dynamicMunicipalities = [] } = useQuery<string[]>({
    queryKey: ['/api/municipalities']
  });

  // Combine with "Tutti i comuni" option
  const municipalities = ["Tutti i comuni", ...dynamicMunicipalities];

  const { data: properties = [], isLoading } = useQuery<Property[]>({
    queryKey: ['/api/properties/search', { 
      search: searchTerm,
      type: selectedType !== "all" ? selectedType : undefined,
      municipality: selectedMunicipality !== "Tutti i comuni" ? selectedMunicipality : undefined,
      minPrice: minPrice || undefined,
      maxPrice: maxPrice || undefined,
      bedrooms: bedrooms !== "all" ? bedrooms : undefined
    }],
    queryFn: async () => {
      const params = new URLSearchParams();
      
      if (searchTerm) params.set('search', searchTerm);
      if (selectedType !== "all") params.set('type', selectedType);
      if (selectedMunicipality !== "Tutti i comuni") params.set('municipality', selectedMunicipality);
      if (minPrice) params.set('minPrice', minPrice);
      if (maxPrice) params.set('maxPrice', maxPrice);
      if (bedrooms !== "all") params.set('bedrooms', bedrooms);
      
      const url = params.toString() ? `/api/properties/search?${params.toString()}` : '/api/properties';
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error('Failed to fetch properties');
      }
      
      return response.json();
    }
  });

  const formatPrice = (price: string, type: string, priceType: string | null) => {
    const numPrice = parseInt(price);
    if (type === "vendita") {
      return `€ ${numPrice.toLocaleString('it-IT')}`;
    } else if (type === "affitto") {
      return `€ ${numPrice}/mese`;
    } else {
      return `€ ${numPrice}/notte`;
    }
  };

  const getTypeLabel = (type: string) => {
    switch(type) {
      case "vendita": return "Vendita";
      case "affitto": return "Affitto";
      case "casa_vacanza": return "Casa Vacanza";
      default: return type;
    }
  };

  const getTypeBadgeColor = (type: string) => {
    switch(type) {
      case "vendita": return "bg-green-100 text-green-800";
      case "affitto": return "bg-blue-100 text-blue-800";
      case "casa_vacanza": return "bg-purple-100 text-purple-800";
      default: return "bg-gray-100 text-gray-800";
    }
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
        
        <div className="glass-card rounded-3xl p-8 max-w-6xl mx-auto mb-12">
          {/* Search and Filter Section */}
          <div className="bg-white rounded-2xl p-6 shadow-xl border border-gray-100">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 mb-6">
              <div className="lg:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Search className="inline w-4 h-4 mr-1" />
                  Cerca Proprietà
                </label>
                <Input
                  type="text"
                  placeholder="Cerca per titolo, descrizione..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Building2 className="inline w-4 h-4 mr-1" />
                  Tipo
                </label>
                <Select value={selectedType} onValueChange={setSelectedType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Tipo" />
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
                  <MapPin className="inline w-4 h-4 mr-1" />
                  Comune
                </label>
                <Select value={selectedMunicipality} onValueChange={setSelectedMunicipality}>
                  <SelectTrigger>
                    <SelectValue placeholder="Comune" />
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
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Euro className="inline w-4 h-4 mr-1" />
                  Prezzo Max
                </label>
                <Input
                  type="number"
                  placeholder="€ Max"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Bed className="inline w-4 h-4 mr-1" />
                  Stanze
                </label>
                <Select value={bedrooms} onValueChange={setBedrooms}>
                  <SelectTrigger>
                    <SelectValue placeholder="Stanze" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tutte</SelectItem>
                    <SelectItem value="1">1+</SelectItem>
                    <SelectItem value="2">2+</SelectItem>
                    <SelectItem value="3">3+</SelectItem>
                    <SelectItem value="4">4+</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Results Section */}
          {(searchTerm || selectedType !== "all" || selectedMunicipality !== "Tutti i comuni" || minPrice || maxPrice || bedrooms !== "all") && (
            <div className="mt-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900">
                  Risultati di Ricerca ({properties.length})
                </h3>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedType("all");
                    setSelectedMunicipality("Tutti i comuni");
                    setMinPrice("");
                    setMaxPrice("");
                    setBedrooms("all");
                  }}
                  className="text-gray-600"
                >
                  <Filter className="w-4 h-4 mr-2" />
                  Cancella Filtri
                </Button>
              </div>

              {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[...Array(6)].map((_, i) => (
                    <Card key={i} className="animate-pulse">
                      <div className="h-48 bg-gray-300 rounded-t-lg"></div>
                      <CardContent className="p-4">
                        <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                        <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : properties.length === 0 ? (
                <div className="text-center py-12">
                  <Building2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Nessuna proprietà trovata
                  </h3>
                  <p className="text-gray-600">
                    Prova a modificare i filtri di ricerca per trovare più proprietà.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {properties.map((property) => (
                    <Link key={property.id} href={`/proprieta/${property.id}`}>
                      <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer h-full">
                        <div className="relative h-48">
                          {property.images && property.images.length > 0 ? (
                            <img
                              src={property.images[0]}
                              alt={property.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                              <Building2 className="w-12 h-12 text-gray-400" />
                            </div>
                          )}
                          <div className="absolute top-2 left-2">
                            <Badge className={getTypeBadgeColor(property.type)}>
                              {getTypeLabel(property.type)}
                            </Badge>
                          </div>
                          {property.featured && (
                            <div className="absolute top-2 right-2">
                              <Badge className="bg-yellow-100 text-yellow-800">
                                In Evidenza
                              </Badge>
                            </div>
                          )}
                        </div>
                        
                        <CardContent className="p-4">
                          <h3 className="font-semibold text-lg mb-2 line-clamp-2">
                            {property.title}
                          </h3>
                          
                          <div className="flex items-center text-gray-600 mb-2">
                            <MapPin className="w-4 h-4 mr-1" />
                            <span className="text-sm">{property.municipality}</span>
                          </div>
                          
                          <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
                            <div className="flex items-center">
                              <Bed className="w-4 h-4 mr-1" />
                              <span>{property.bedrooms}</span>
                            </div>
                            <div className="flex items-center">
                              <Bath className="w-4 h-4 mr-1" />
                              <span>{property.bathrooms}</span>
                            </div>
                            <div className="flex items-center">
                              <Square className="w-4 h-4 mr-1" />
                              <span>{property.area}m²</span>
                            </div>
                          </div>
                          
                          <div className="text-xl font-bold text-purple-600">
                            {formatPrice(property.price, property.type, property.priceType)}
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}
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
