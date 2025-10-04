import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowRight, Camera } from "lucide-react";
import type { Gallery, GalleryImage } from "@shared/schema";

export function GalleriesSection() {
  const { data: galleries, isLoading } = useQuery<(Gallery & { images: GalleryImage[] })[]>({
    queryKey: ["/api/galleries"],
  });

  const convertImageUrl = (url: string) => {
    return url.replace('/public-objects/', '/api/images/');
  };

  // Prendi solo le ultime 3 gallerie
  const latestGalleries = galleries?.slice(0, 3) || [];

  if (isLoading || latestGalleries.length === 0) {
    return null;
  }

  return (
    <section className="py-20 bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 pattern-dots relative overflow-hidden">
      {/* Elementi decorativi */}
      <div className="absolute top-10 left-10 w-72 h-72 bg-purple-400/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-orange-400/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
      
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Camera className="h-12 w-12 text-purple-600" />
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold mb-4 text-gray-900">
            Le Nostre Gallerie
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Scopri le nostre avventure attraverso immagini autentiche
          </p>
        </div>

        {/* Grid Gallerie */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 mb-12 stagger-animation">
          {latestGalleries.map((gallery) => {
            const displayImages = gallery.images?.slice(0, 4) || [];
            const totalPhotos = gallery.images?.length || 0;
            
            return (
              <Link key={gallery.id} href="/galleria">
                <div
                  className="group cursor-pointer transform transition-all duration-300 hover:scale-105"
                  data-testid={`home-gallery-card-${gallery.id}`}
                >
                  {/* Stack Polaroid */}
                  <div className="relative h-80 mb-6">
                    {displayImages.length > 0 ? (
                      <div className="relative w-full h-full">
                        {displayImages.map((image, index) => {
                          const rotations = ['-rotate-6', 'rotate-3', '-rotate-3', 'rotate-6'];
                          const zIndexes = ['z-10', 'z-20', 'z-30', 'z-40'];
                          const offsets = [
                            'top-0 left-0',
                            'top-4 left-4',
                            'top-8 left-8',
                            'top-12 left-12'
                          ];
                          
                          return (
                            <div
                              key={image.id}
                              className={`absolute ${offsets[index]} ${zIndexes[index]} ${rotations[index]} 
                                transform transition-all duration-500 group-hover:rotate-0 
                                ${index === 0 ? 'group-hover:translate-x-0 group-hover:translate-y-0' : ''}
                                ${index === 1 ? 'group-hover:translate-x-2 group-hover:translate-y-2' : ''}
                                ${index === 2 ? 'group-hover:translate-x-4 group-hover:translate-y-4' : ''}
                                ${index === 3 ? 'group-hover:translate-x-6 group-hover:translate-y-6' : ''}
                              `}
                              style={{
                                width: 'calc(100% - 3rem)',
                                height: 'calc(100% - 3rem)'
                              }}
                            >
                              <div className="bg-white p-3 shadow-2xl rounded-sm h-full border-8 border-white">
                                <img
                                  src={convertImageUrl(image.imageUrl)}
                                  alt={`${gallery.title} - Foto ${index + 1}`}
                                  className="w-full h-full object-cover"
                                  loading="lazy"
                                  decoding="async"
                                  onError={(e) => {
                                    const target = e.currentTarget;
                                    target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="400"%3E%3Crect fill="%23e5e7eb" width="400" height="400"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%239ca3af" font-size="20"%3EFoto%3C/text%3E%3C/svg%3E';
                                  }}
                                />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg flex items-center justify-center">
                        <Camera className="h-20 w-20 text-gray-400" />
                      </div>
                    )}
                  </div>

                  {/* Info Galleria */}
                  <div className="text-center space-y-2">
                    <h3 className="text-2xl font-bold text-gray-900 group-hover:text-purple-600 transition-colors">
                      {gallery.title}
                    </h3>
                    {gallery.description && (
                      <p className="text-gray-600 line-clamp-2">
                        {gallery.description}
                      </p>
                    )}
                    <div className="flex items-center justify-center gap-4 text-sm text-gray-500">
                      <span className="font-medium">
                        📸 {totalPhotos} {totalPhotos === 1 ? 'foto' : 'foto'}
                      </span>
                      <span>•</span>
                      <span>
                        {new Date(gallery.createdAt).toLocaleDateString('it-IT')}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Pulsante Vedi Tutte */}
        <div className="text-center animate-fade-in">
          <Link href="/galleria">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold px-8 py-4 text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              Vedi Tutte le Gallerie
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
