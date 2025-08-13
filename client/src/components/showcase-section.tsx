import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, MapPin, Calendar, Users } from "lucide-react";
import { Link } from "wouter";

interface Showcase {
  id: number;
  title: string;
  description: string;
  backgroundImage: string;
  category: string;
  isActive: boolean;
  sortOrder: number;
}

interface Travel {
  id: number;
  title: string;
  destination: string;
  country: string;
  price: string;
  duration: number;
  maxParticipants: number;
  images: string[];
  type: string;
  slug?: string;
}

interface ShowcaseSectionProps {
  category: string;
  className?: string;
}

export function ShowcaseSection({ category, className = "" }: ShowcaseSectionProps) {
  // Fetch showcase info
  const { data: showcase, isLoading: showcaseLoading } = useQuery<Showcase>({
    queryKey: ['/api/showcases/category', category],
    enabled: !!category,
  });

  // Fetch travels for this showcase category
  const { data: travels = [], isLoading: travelsLoading } = useQuery<Travel[]>({
    queryKey: ['/api/showcases', category, 'travels'],
    enabled: !!category,
  });

  if (showcaseLoading || !showcase || !showcase.isActive) {
    return null;
  }

  const isLoading = travelsLoading;
  const displayTravels = travels.slice(0, 6); // Massimo 6 viaggi per vetrina

  return (
    <section className={`relative py-20 overflow-hidden ${className}`}>
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={showcase.backgroundImage}
          alt={showcase.title}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-black/60"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-[1800px] mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-light text-white mb-6">
            {showcase.title}
          </h2>
          <p className="text-xl text-white/90 max-w-3xl mx-auto leading-relaxed">
            {showcase.description}
          </p>
        </motion.div>

        {/* Travel Cards */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white/10 backdrop-blur-md rounded-lg h-96 animate-pulse" />
            ))}
          </div>
        ) : displayTravels.length > 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {displayTravels.map((travel, index) => (
              <motion.div
                key={travel.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group relative bg-white/10 backdrop-blur-md rounded-lg overflow-hidden hover:bg-white/20 transition-all duration-300"
              >
                {/* Travel Image */}
                {travel.images && travel.images.length > 0 && (
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={travel.images[0]}
                      alt={travel.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                  </div>
                )}

                {/* Travel Info */}
                <div className="p-6">
                  <div className="flex items-center gap-1 text-white/80 text-sm mb-2">
                    <MapPin className="w-4 h-4" />
                    <span>{travel.destination}, {travel.country}</span>
                  </div>

                  <h3 className="text-xl font-semibold text-white mb-3 line-clamp-2">
                    {travel.title}
                  </h3>

                  <div className="flex items-center gap-4 text-white/80 text-sm mb-4">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>{travel.duration} giorni</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      <span>Max {travel.maxParticipants}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-white">
                      <span className="text-2xl font-bold">€{travel.price}</span>
                      <span className="text-sm text-white/80 ml-1">/ persona</span>
                    </div>

                    <Link href={travel.slug ? `/viaggi/${travel.slug}` : `/viaggi/${travel.id}`}>
                      <Button 
                        variant="secondary" 
                        size="sm"
                        className="bg-white/20 hover:bg-white/30 text-white border-white/30"
                      >
                        Dettagli
                        <ArrowRight className="w-4 h-4 ml-1" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="text-center text-white/80">
            <p className="text-lg">Nessun viaggio disponibile per questa destinazione.</p>
          </div>
        )}

        {/* Call to Action */}
        {displayTravels.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-center mt-12"
          >
            <Link href="/viaggi">
              <Button 
                size="lg"
                className="bg-white text-gray-900 hover:bg-white/90 px-8 py-3"
              >
                Vedi Tutti i Viaggi
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </motion.div>
        )}
      </div>
    </section>
  );
}