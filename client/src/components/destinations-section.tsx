import { MapPin } from "lucide-react";

const countries = [
  {
    name: "Francia",
    image: "https://images.unsplash.com/photo-1502602898536-47ad22581b52?ixlib=rb-4.0.3&auto=format&fit=crop&w=800",
    description: "Eleganza e cultura"
  },
  {
    name: "Giappone", 
    image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?ixlib=rb-4.0.3&auto=format&fit=crop&w=800",
    description: "Tradizione e modernità"
  },
  {
    name: "Stati Uniti",
    image: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800",
    description: "Terre infinite"
  },
  {
    name: "Emirati Arabi Uniti",
    image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800",
    description: "Lusso e innovazione"
  },
  {
    name: "Regno Unito",
    image: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?ixlib=rb-4.0.3&auto=format&fit=crop&w=800",
    description: "Storia e tradizioni"
  },
  {
    name: "Tailandia",
    image: "https://images.unsplash.com/photo-1563492065-4a71d2d37b82?ixlib=rb-4.0.3&auto=format&fit=crop&w=800",
    description: "Templi e nature"
  },
  {
    name: "Australia",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800",
    description: "Natura selvaggia"
  },
  {
    name: "Italia",
    image: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800",
    description: "Arte e storia"
  },
  {
    name: "Spagna", 
    image: "https://images.unsplash.com/photo-1539037116277-4db20889f2d4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800",
    description: "Passione mediterranea"
  },
  {
    name: "Turchia",
    image: "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?ixlib=rb-4.0.3&auto=format&fit=crop&w=800",
    description: "Crocevia di culture"
  },
  {
    name: "Marocco",
    image: "https://images.unsplash.com/photo-1539650116574-75c0c6d73a0e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800",
    description: "Magia del deserto"
  },
  {
    name: "Singapore", 
    image: "https://images.unsplash.com/photo-1565967511849-76a60a516170?ixlib=rb-4.0.3&auto=format&fit=crop&w=800",
    description: "Giardino moderno"
  },
  {
    name: "Brasile",
    image: "https://images.unsplash.com/photo-1483729558449-99ef09a8c325?ixlib=rb-4.0.3&auto=format&fit=crop&w=800",
    description: "Ritmi e colori"
  },
  {
    name: "Paesi Bassi",
    image: "https://images.unsplash.com/photo-1534351590666-13e3e96b5017?ixlib=rb-4.0.3&auto=format&fit=crop&w=800",
    description: "Canali e tulipani"
  },
  {
    name: "Repubblica Ceca",
    image: "https://images.unsplash.com/photo-1541849546-216549ae216f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800",
    description: "Architettura dorata"
  },
  {
    name: "Grecia",
    image: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=800",
    description: "Isole da sogno"
  }
];

export function DestinationsSection() {
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
          {countries.map((country, index) => (
            <div
              key={index} 
              className="group cursor-pointer overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 bg-white"
            >
              <div className="relative aspect-square overflow-hidden">
                <div 
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110" 
                  style={{ backgroundImage: `url('${country.image}')` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                
                <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                  <h3 className="font-bold text-lg mb-1">{country.name}</h3>
                  <p className="text-sm opacity-90">{country.description}</p>
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