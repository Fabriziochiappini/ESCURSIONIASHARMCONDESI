import { MapPin } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import type { Country } from "@shared/schema";

export function DestinationsSection() {
  const { data: countries = [], isLoading } = useQuery<Country[]>({
    queryKey: ['/api/countries-destinations']
  });

  if (isLoading) {
    return (
      <section className="py-20 bg-gradient-to-br from-slate-50 to-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium mb-6">
              <MapPin className="h-4 w-4 mr-2" />
              Destinazioni
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Destinazioni Popolari
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Scopri le destinazioni più belle del mondo. Dai city break europei alle avventure esotiche, 
              ogni viaggio è un'esperienza unica.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {Array.from({ length: 16 }).map((_, index) => (
              <div key={index} className="aspect-square bg-gray-200 animate-pulse"></div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (countries.length === 0) {
    return (
      <section className="py-20 bg-gradient-to-br from-slate-50 to-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium mb-6">
              <MapPin className="h-4 w-4 mr-2" />
              Destinazioni
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Destinazioni Popolari
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Le destinazioni saranno disponibili a breve. Contattaci per maggiori informazioni.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-gradient-to-br from-slate-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium mb-6">
            <MapPin className="h-4 w-4 mr-2" />
            Destinazioni
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Destinazioni Popolari
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Scopri le destinazioni più belle del mondo. Dai city break europei alle avventure esotiche, 
            ogni viaggio è un'esperienza unica.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {countries.map((country) => (
            <div
              key={country.id} 
              className="group cursor-pointer overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 bg-white"
            >
              <div className="relative aspect-square overflow-hidden">
                <div 
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110" 
                  style={{ backgroundImage: `url('${country.backgroundImage}')` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                
                <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                  <h3 className="font-bold text-lg mb-1">{country.title}</h3>
                  <p className="text-sm opacity-90 mb-1">{country.description}</p>
                  {country.travelCount > 0 && (
                    <p className="text-xs opacity-75">{country.travelCount} viaggi disponibili</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-16">
          <div className="inline-flex items-center px-6 py-3 bg-primary text-white rounded-full text-sm font-medium hover:bg-primary/90 transition-colors cursor-pointer">
            <MapPin className="h-4 w-4 mr-2" />
            Scopri Tutte le Destinazioni
          </div>
        </div>
      </div>
    </section>
  );
}