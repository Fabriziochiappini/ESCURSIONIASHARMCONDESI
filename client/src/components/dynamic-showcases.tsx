import { useQuery } from "@tanstack/react-query";
import { ShowcaseSection } from "@/components/showcase-section";
import type { Country } from "@shared/schema";

export function DynamicShowcases() {
  // Fetch countries with travels for dynamic showcases
  const { data: countries = [], isLoading } = useQuery<Country[]>({
    queryKey: ['/api/countries-showcases']
  });

  if (isLoading) {
    return (
      <div className="py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded-md w-64 mx-auto mb-4"></div>
            <div className="h-4 bg-gray-200 rounded-md w-96 mx-auto"></div>
          </div>
        </div>
      </div>
    );
  }

  if (countries.length === 0) {
    return null;
  }

  // Get first 4 countries for showcases
  const showcaseCountries = countries.slice(0, 4);

  return (
    <>
      {showcaseCountries.map((country) => (
        <ShowcaseSection 
          key={country.id}
          category={country.name.toLowerCase().replace(/\s+/g, '_')}
        />
      ))}
    </>
  );
}