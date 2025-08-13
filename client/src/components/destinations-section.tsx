import { Link } from "wouter";
import { ChevronRight } from "lucide-react";

interface Destination {
  country: string;
  label: string;
  image: string;
  count?: number;
}

// Lista di 16 destinazioni popolari con immagini rappresentative
const destinations: Destination[] = [
  {
    country: "Stati Uniti",
    label: "Stati Uniti",
    image: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=400&h=300&fit=crop&crop=center"
  },
  {
    country: "Canada", 
    label: "Canada",
    image: "https://images.unsplash.com/photo-1503614472-8c93d56cd5b6?w=400&h=300&fit=crop&crop=center"
  },
  {
    country: "Australia",
    label: "Australia e Nuova Zelanda", 
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop&crop=center"
  },
  {
    country: "Giappone",
    label: "Oriente",
    image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=400&h=300&fit=crop&crop=center"
  },
  {
    country: "Messico",
    label: "Messico e Caraibi",
    image: "https://images.unsplash.com/photo-1518638150340-f706e86654de?w=400&h=300&fit=crop&crop=center" 
  },
  {
    country: "Sudafrica",
    label: "Africa",
    image: "https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=400&h=300&fit=crop&crop=center"
  },
  {
    country: "Uzbekistan",
    label: "Asia Centrale", 
    image: "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=400&h=300&fit=crop&crop=center"
  },
  {
    country: "Giordania",
    label: "Asia Meridionale",
    image: "https://images.unsplash.com/photo-1539650116574-75c0c6d73a10?w=400&h=300&fit=crop&crop=center"
  },
  {
    country: "Francia",
    label: "Francia",
    image: "https://images.unsplash.com/photo-1502602898536-47ad22581b52?w=400&h=300&fit=crop&crop=center"
  },
  {
    country: "Spagna", 
    label: "Spagna",
    image: "https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=400&h=300&fit=crop&crop=center"
  },
  {
    country: "Grecia",
    label: "Grecia",
    image: "https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=400&h=300&fit=crop&crop=center"
  },
  {
    country: "Italia",
    label: "Italia", 
    image: "https://images.unsplash.com/photo-1515542622106-78bda8ba0e5b?w=400&h=300&fit=crop&crop=center"
  },
  {
    country: "Norvegia",
    label: "Norvegia",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop&crop=center"
  },
  {
    country: "Islanda",
    label: "Islanda", 
    image: "https://images.unsplash.com/photo-1539066726280-8c49c7e96e2c?w=400&h=300&fit=crop&crop=center"
  },
  {
    country: "Thailandia",
    label: "Thailandia",
    image: "https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?w=400&h=300&fit=crop&crop=center"
  },
  {
    country: "Maldive",
    label: "Maldive",
    image: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=400&h=300&fit=crop&crop=center"
  }
];

export function DestinationsSection() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Destinazioni
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Esotici safari, esclusivi itinerari e pacchetti per tour completi: non c'è limite alle nostre offerte di viaggio per farti scoprire le meraviglie del mondo.
          </p>
        </div>

        {/* Destinations Grid - 4x4 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {destinations.map((destination, index) => (
            <Link
              key={index}
              href={`/viaggi?country=${encodeURIComponent(destination.country)}`}
              className="group relative overflow-hidden rounded-2xl aspect-[4/3] bg-gray-200 hover:transform hover:scale-105 transition-all duration-300"
            >
              {/* Background Image */}
              <div 
                className="absolute inset-0 bg-cover bg-center transition-transform duration-300 group-hover:scale-110"
                style={{
                  backgroundImage: `url(${destination.image})`,
                }}
              />
              
              {/* Overlay */}
              <div className="absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-30 transition-all duration-300" />
              
              {/* Content */}
              <div className="absolute inset-0 flex items-center justify-center p-4">
                <div className="text-center text-white">
                  <h3 className="text-lg md:text-xl font-bold mb-2 group-hover:text-yellow-300 transition-colors duration-300">
                    {destination.label}
                  </h3>
                  
                  {/* Subtle arrow indicator on hover */}
                  <ChevronRight className="h-5 w-5 mx-auto opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-yellow-300" />
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* View All Link */}
        <div className="text-center mt-12">
          <Link
            href="/viaggi"
            className="inline-flex items-center px-8 py-3 bg-blue-600 text-white font-semibold rounded-full hover:bg-blue-700 transition-colors duration-300"
          >
            Scopri Tutti i Viaggi
            <ChevronRight className="h-5 w-5 ml-2" />
          </Link>
        </div>
      </div>
    </section>
  );
}