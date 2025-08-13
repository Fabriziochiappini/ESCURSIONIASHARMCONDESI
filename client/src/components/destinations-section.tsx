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
    <section className="bg-slate-800 text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-800 via-slate-900 to-slate-800"></div>
      
      <div className="relative z-10 py-20">
        {/* Header */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-16">
          <h2 className="text-5xl font-bold mb-6">
            Destinazioni
          </h2>
          <p className="text-xl text-slate-300 max-w-4xl mx-auto leading-relaxed">
            Esotici safari, esclusivi itinerari e pacchetti per tour completi: non c'è limite alle nostre offerte di viaggio per farti scoprire le meraviglie del mondo.
          </p>
        </div>

        {/* Full Width Destinations Grid - 4x4 */}
        <div className="max-w-none px-0">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-0">
            {destinations.map((destination, index) => (
              <Link
                key={index}
                href={`/viaggi?country=${encodeURIComponent(destination.country)}`}
                className="group relative overflow-hidden aspect-[4/3] bg-gray-900 hover:z-10 transition-all duration-500"
              >
                {/* Background Image */}
                <div 
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                  style={{
                    backgroundImage: `url(${destination.image})`,
                  }}
                />
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20 group-hover:from-blue-900/80 group-hover:via-blue-800/40 group-hover:to-blue-700/20 transition-all duration-500" />
                
                {/* Border Effect */}
                <div className="absolute inset-0 border border-slate-700/30 group-hover:border-blue-400/60 transition-colors duration-300"></div>
                
                {/* Content */}
                <div className="absolute inset-0 flex items-end p-6">
                  <div className="w-full">
                    <h3 className="text-xl font-bold mb-2 text-white group-hover:text-blue-100 transition-all duration-300 transform group-hover:translate-y-[-4px]">
                      {destination.label}
                    </h3>
                    
                    {/* Icon indicator */}
                    <div className="flex items-center justify-between">
                      <div className="h-1 bg-blue-500 rounded-full transition-all duration-500 group-hover:w-16 w-8"></div>
                      <ChevronRight className="h-5 w-5 text-slate-400 group-hover:text-blue-300 transition-all duration-300 transform group-hover:translate-x-1" />
                    </div>
                  </div>
                </div>

                {/* Hover Effect Overlay */}
                <div className="absolute inset-0 bg-blue-600/0 group-hover:bg-blue-600/10 transition-all duration-500"></div>
              </Link>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mt-16">
          <Link
            href="/viaggi"
            className="inline-flex items-center px-10 py-4 bg-blue-600 text-white font-bold text-lg rounded-none hover:bg-blue-500 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl border-2 border-blue-600 hover:border-blue-400"
          >
            ESPLORA TUTTE LE DESTINAZIONI
            <ChevronRight className="h-6 w-6 ml-3" />
          </Link>
        </div>
      </div>
    </section>
  );
}