import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Link } from "wouter";
import { TravelCard } from "./travel-card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { LayoutGrid, Rows3 } from "lucide-react";
import type { Travel, SearchFilters } from "@shared/schema";
import { useLocation } from "wouter";

interface PropertyGridProps {
  filters?: SearchFilters;
  showAll?: boolean;
  maxColumns?: number;
  tourCategory?: "all" | "single" | "package";
}

export function PropertyGrid({ filters, showAll = false, maxColumns = 3, tourCategory = "all" }: PropertyGridProps) {
  const [location] = useLocation();
  const [mobileGridView, setMobileGridView] = useState<'two-cols' | 'single'>('two-cols');

  const { data: allProperties, isLoading, error } = useQuery<Travel[]>({
    queryKey: filters ? ['/api/travels/search', filters] : ['/api/travels/featured'],
    queryFn: async () => {
      let url = filters ? '/api/travels/search' : '/api/travels/featured';

      if (filters) {
        const searchParams = new URLSearchParams();
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== '') {
            searchParams.set(key, value.toString());
          }
        });
        if (searchParams.toString()) {
          url += `?${searchParams.toString()}`;
        }
      }

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Failed to fetch properties');
      }
      return response.json();
    }
  });

  // Filter by tour category if specified
  const filteredByCategory = allProperties?.filter(p => {
    if (tourCategory === "all") return true;
    return p.tourCategory === tourCategory;
  });

  // Show 8 properties for homepage (2 rows of 4), show all if showAll is true or filters are applied  
  const properties = showAll || filters ? filteredByCategory : filteredByCategory?.slice(0, 8);

  if (isLoading) {
    const gridCols = maxColumns === 2 ? "grid-cols-2 md:grid-cols-2" : "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4";
    return (
      <div className={`grid ${gridCols} gap-4 md:gap-8`}>
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="glass-card rounded-3xl overflow-hidden animate-pulse">
            <Skeleton className="h-80 w-full" />
            <div className="space-y-4 p-8">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-6 w-1/2" />
              <div className="flex space-x-4">
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-6 w-24" />
              </div>
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-2/3" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 mb-4">Errore nel caricamento dei tour</p>
        <Button onClick={() => window.location.reload()}>
          Riprova
        </Button>
      </div>
    );
  }

  if (!properties || properties.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 text-lg mb-4">
          Nessun tour trovato con i filtri selezionati
        </p>
        <Button onClick={() => window.location.href = '/'}>
          Rimuovi filtri
        </Button>
      </div>
    );
  }

  const getMobileGridClass = () => {
    if (mobileGridView === 'two-cols') {
      return 'grid-cols-2';
    }
    return 'grid-cols-1';
  };

  return (
    <div className="space-y-6">
      {/* Switch visualizzazione - solo mobile */}
      <div className="flex justify-end sm:hidden">
        <div className="inline-flex items-center bg-white/80 backdrop-blur-sm rounded-full p-1 border border-[#D4AF37]/30 shadow-sm">
          <button
            onClick={() => setMobileGridView('two-cols')}
            className={`p-2 rounded-full transition-all duration-200 ${
              mobileGridView === 'two-cols' 
                ? 'bg-[#D4AF37] text-white shadow-md' 
                : 'text-gray-500 hover:text-[#D4AF37]'
            }`}
            aria-label="Griglia 2 colonne"
            data-testid="button-grid-two-cols"
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setMobileGridView('single')}
            className={`p-2 rounded-full transition-all duration-200 ${
              mobileGridView === 'single' 
                ? 'bg-[#D4AF37] text-white shadow-md' 
                : 'text-gray-500 hover:text-[#D4AF37]'
            }`}
            aria-label="Colonna singola"
            data-testid="button-grid-single"
          >
            <Rows3 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className={`grid ${getMobileGridClass()} sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8`}>
        {properties.map((property, index) => (
          <TravelCard 
            key={property.id} 
            travel={property} 
            priority={index < 4}
            compact={mobileGridView === 'two-cols'}
          />
        ))}
      </div>
    </div>
  );
}