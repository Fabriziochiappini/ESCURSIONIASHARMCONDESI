import { useQuery } from "@tanstack/react-query";
import { TravelCard } from "@/components/travel-card";
import type { Travel, SearchFilters } from "@shared/schema";

interface TravelGridProps {
  filters?: SearchFilters;
  maxColumns?: number;
  featured?: boolean;
}

export function TravelGrid({ filters, maxColumns = 4, featured = false }: TravelGridProps) {
  // Build query key and params
  const buildQueryParams = () => {
    if (featured) return "";
    if (!filters) return "";
    
    const params = new URLSearchParams();
    if (filters.type) params.set('type', filters.type);
    if (filters.country) params.set('country', filters.country);
    if (filters.travelType) params.set('travelType', filters.travelType);
    if (filters.maxPrice) params.set('maxPrice', filters.maxPrice.toString());
    if (filters.maxDuration) params.set('maxDuration', filters.maxDuration.toString());
    if (filters.search) params.set('search', filters.search);
    
    return params.toString();
  };

  const queryParams = buildQueryParams();
  const endpoint = featured ? '/api/travels/featured' : 
                   queryParams ? `/api/travels/search?${queryParams}` : 
                   '/api/travels';

  const { data: travels = [], isLoading, error } = useQuery<Travel[]>({
    queryKey: featured ? ['/api/travels/featured'] : 
              queryParams ? ['/api/travels/search', queryParams] :
              ['/api/travels']
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {Array.from({ length: maxColumns }).map((_, index) => (
          <div key={index} className="animate-pulse">
            <div className="bg-gray-200 rounded-xl h-64 mb-4"></div>
            <div className="bg-gray-200 h-4 rounded mb-2"></div>
            <div className="bg-gray-200 h-4 rounded w-2/3"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">Errore nel caricamento dei viaggi</p>
      </div>
    );
  }

  if (travels.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Nessun viaggio disponibile</p>
      </div>
    );
  }

  const gridColsClass = maxColumns === 3 ? 'lg:grid-cols-3' : 
                        maxColumns === 2 ? 'lg:grid-cols-2' : 
                        'lg:grid-cols-3 xl:grid-cols-4';

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 ${gridColsClass} gap-8`}>
      {travels.map((travel) => (
        <TravelCard key={travel.id} travel={travel} />
      ))}
    </div>
  );
}