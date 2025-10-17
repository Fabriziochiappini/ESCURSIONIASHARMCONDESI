import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { TravelCard } from "./travel-card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import type { Travel, SearchFilters } from "@shared/schema";
import { useLocation } from "wouter";

interface PropertyGridProps {
  filters?: SearchFilters;
  showAll?: boolean;
  maxColumns?: number;
}

export function PropertyGrid({ filters, showAll = false, maxColumns = 3 }: PropertyGridProps) {
  const [location] = useLocation();

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

  // Show 8 properties for homepage (2 rows of 4), show all if showAll is true or filters are applied  
  const properties = showAll || filters ? allProperties : allProperties?.slice(0, 8);

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

  return (
    <div className="space-y-8">
      <div className={`grid ${maxColumns === 2 ? "grid-cols-2 md:grid-cols-2" : "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"} gap-6 md:gap-8`}>
        {properties.map((property, index) => (
          <TravelCard key={property.id} travel={property} priority={index < 4} />
        ))}
      </div>
    </div>
  );
}