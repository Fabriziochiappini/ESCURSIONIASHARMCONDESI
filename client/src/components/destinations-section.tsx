import { ChevronLeft, ChevronRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import type { Country } from "@shared/schema";

export function DestinationsSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const itemsPerPage = 6;

  const { data: countries = [], isLoading } = useQuery<Country[]>({
    queryKey: ['/api/countries-destinations']
  });

  const handlePrev = () => {
    setCurrentIndex(prev => Math.max(0, prev - itemsPerPage));
  };

  const handleNext = () => {
    setCurrentIndex(prev => Math.min(countries.length - itemsPerPage, prev + itemsPerPage));
  };

  const visibleCountries = countries.slice(currentIndex, currentIndex + itemsPerPage);
  const canGoPrev = currentIndex > 0;
  const canGoNext = currentIndex + itemsPerPage < countries.length;

  if (isLoading) {
    return (
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <p className="text-orange-500 text-sm font-medium mb-2">Popular Destination</p>
            <div className="flex items-center justify-between">
              <h2 className="text-4xl font-bold text-gray-900">
                Trendy Travel Locations
              </h2>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="aspect-square rounded-full bg-gray-200 animate-pulse"></div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (countries.length === 0) {
    return (
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <p className="text-orange-500 text-sm font-medium mb-2">Popular Destination</p>
            <h2 className="text-4xl font-bold text-gray-900">
              Trendy Travel Locations
            </h2>
          </div>
          <p className="text-gray-600 text-center">
            Le destinazioni saranno disponibili a breve. Contattaci per maggiori informazioni.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-gradient-to-b from-white via-blue-50/30 to-white pattern-dots relative overflow-hidden">
      <div className="absolute top-10 right-10 w-96 h-96 bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-full blur-3xl"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="mb-12">
          <p className="text-orange-500 text-sm font-medium mb-2">Popular Destination</p>
          <div className="flex items-center justify-between">
            <h2 className="text-4xl font-bold text-gray-900">
              Trendy Travel Locations
            </h2>
            
            {/* Navigation Arrows */}
            <div className="flex gap-3">
              <button
                onClick={handlePrev}
                disabled={!canGoPrev}
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                  canGoPrev 
                    ? 'bg-green-500 hover:bg-green-600 text-white' 
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
                data-testid="button-destinations-prev"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={handleNext}
                disabled={!canGoNext}
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                  canGoNext 
                    ? 'bg-green-500 hover:bg-green-600 text-white' 
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
                data-testid="button-destinations-next"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 stagger-animation">
          {visibleCountries.map((country) => (
            <div
              key={country.id} 
              className="group cursor-pointer text-center transform transition-all duration-300 hover:scale-110"
              data-testid={`destination-${country.id}`}
            >
              <div className="relative mb-4">
                <div className="aspect-square rounded-full overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 bg-gray-200">
                  <img 
                    src={country.backgroundImage}
                    alt={country.name}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
              </div>
              
              <h3 className="font-bold text-lg text-gray-900 mb-1">{country.name}</h3>
              <p className="text-sm text-gray-500">
                {country.travelCount} {country.travelCount === 1 ? 'Place' : 'Places'}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
