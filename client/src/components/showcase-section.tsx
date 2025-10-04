import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
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

interface ShowcaseSectionProps {
  category: string;
  className?: string;
}

export function ShowcaseSection({ category, className = "" }: ShowcaseSectionProps) {
  // Fetch showcase info only
  const { data: showcase, isLoading: showcaseLoading } = useQuery<Showcase>({
    queryKey: [`/api/showcases/category/${category}`],
    enabled: !!category,
  });

  if (showcaseLoading || !showcase || !showcase.isActive) {
    return null;
  }

  return (
    <section className={`relative h-[500px] overflow-hidden ${className}`}>
      {/* Background Image */}
      <div className="absolute inset-0 bg-gray-900">
        <img
          src={showcase.backgroundImage}
          alt={showcase.title}
          className="w-full h-full object-cover"
          loading="lazy"
          decoding="async"
        />
        <div className="absolute inset-0 bg-black/40"></div>
      </div>

      {/* Content Overlay */}
      <div className="relative z-10 h-full flex items-center justify-center">
        <div className="text-center max-w-4xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-wide">
              {showcase.title.toUpperCase()}
            </h2>
            <p className="text-xl md:text-2xl text-white/90 mb-8 leading-relaxed max-w-3xl mx-auto">
              {showcase.description}
            </p>
            <Link to="/viaggi">
              <Button
                size="lg"
                variant="outline"
                className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-gray-900 font-semibold px-8 py-4 text-lg transition-all duration-300"
              >
                Scopri le offerte
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}