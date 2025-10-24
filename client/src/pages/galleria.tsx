import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { SEOHead } from "@/components/seo-head";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X, ZoomIn, ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";
import type { Gallery, GalleryImage } from "@shared/schema";

export default function GalleriaPage() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);
  const [selectedGallery, setSelectedGallery] = useState<(Gallery & { images: GalleryImage[] }) | null>(null);
  const [allImages, setAllImages] = useState<GalleryImage[]>([]);

  const { data: galleries, isLoading } = useQuery<(Gallery & { images: GalleryImage[] })[]>({
    queryKey: ["/api/galleries"],
  });

  const convertImageUrl = (url: string) => {
    return url.replace('/public-objects/', '/api/images/');
  };

  const openGallery = (gallery: Gallery & { images: GalleryImage[] }) => {
    setSelectedGallery(gallery);
  };

  const openLightbox = (image: GalleryImage, images: GalleryImage[], index: number) => {
    setAllImages(images);
    setSelectedImageIndex(index);
    setSelectedImage(convertImageUrl(image.imageUrl));
  };

  const nextImage = () => {
    if (selectedImageIndex < allImages.length - 1) {
      const nextIndex = selectedImageIndex + 1;
      setSelectedImageIndex(nextIndex);
      setSelectedImage(convertImageUrl(allImages[nextIndex].imageUrl));
    }
  };

  const prevImage = () => {
    if (selectedImageIndex > 0) {
      const prevIndex = selectedImageIndex - 1;
      setSelectedImageIndex(prevIndex);
      setSelectedImage(convertImageUrl(allImages[prevIndex].imageUrl));
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <SEOHead 
        title="Galleria Foto - Si Viaggia con Desy | Le Nostre Avventure"
        description="Scopri le nostre gallerie fotografiche dei tour organizzati. Immagini autentiche delle escursioni più belle di Sharm El Sheikh."
        keywords="galleria foto tour, foto escursioni, immagini tour sharm, si viaggia con desy gallery"
        canonicalUrl="https://siviaggiacondesy.it/galleria"
      />
      <Navigation />

      <main className="pt-20">
        <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-700 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-[#E6C87F] via-[#D4AF37] to-[#E6C87F] bg-clip-text text-transparent tracking-[0.15em] uppercase drop-shadow-2xl font-eagle-lake">
              Le nostre foto
            </h1>
            <div className="w-48 h-[2px] bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent mx-auto mb-6"></div>
            <p className="text-xl md:text-2xl text-white mb-8 max-w-3xl mx-auto font-light opacity-90">
              Scopri le nostre avventure attraverso immagini autentiche
            </p>
          </div>
        </section>

        <section className="py-20">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="bg-gray-200 aspect-square rounded-lg"></div>
                  </div>
                ))}
              </div>
            ) : galleries && galleries.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                {galleries.map((gallery) => {
                  const displayImages = gallery.images?.slice(0, 4) || [];
                  const totalPhotos = gallery.images?.length || 0;
                  
                  return (
                    <div
                      key={gallery.id}
                      className="group cursor-pointer"
                      onClick={() => openGallery(gallery)}
                      data-testid={`gallery-card-${gallery.id}`}
                    >
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
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-20 w-20 text-gray-400"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                              />
                            </svg>
                          </div>
                        )}
                      </div>

                      <div className="text-center space-y-2">
                        <h3 className="text-2xl font-bold bg-gradient-to-r from-[#C9A961] via-[#D4AF37] to-[#C9A961] bg-clip-text text-transparent tracking-wide group-hover:scale-105 transition-transform font-eagle-lake">
                          {gallery.title}
                        </h3>
                        {gallery.description && (
                          <p className="text-gray-400 line-clamp-2 font-light">
                            {gallery.description}
                          </p>
                        )}
                        <div className="flex items-center justify-center gap-4 text-sm text-gray-400 font-light">
                          <span className="font-normal">
                            📸 {totalPhotos} {totalPhotos === 1 ? 'foto' : 'foto'}
                          </span>
                          <span>•</span>
                          <span>
                            {new Date(gallery.createdAt).toLocaleDateString('it-IT')}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-20">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-24 w-24 text-gray-300 mx-auto mb-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <p className="text-xl text-gray-500">Nessuna galleria disponibile</p>
              </div>
            )}
          </div>
        </section>
      </main>

      <Dialog open={!!selectedGallery} onOpenChange={() => setSelectedGallery(null)}>
        <DialogContent className="max-w-[95vw] max-h-[95vh] overflow-y-auto bg-white border border-[#D4AF37]/20">
          {selectedGallery && (
            <div className="py-6">
              <button
                onClick={() => setSelectedGallery(null)}
                className="flex items-center gap-2 text-gray-500 hover:text-[#A8CFEB] mb-6 transition-colors font-light"
                data-testid="back-to-galleries"
              >
                <ArrowLeft className="h-5 w-5" />
                <span>Torna alle gallerie</span>
              </button>

              <div className="text-center mb-8">
                <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#C9A961] via-[#D4AF37] to-[#C9A961] bg-clip-text text-transparent mb-3 tracking-[0.1em] uppercase drop-shadow-lg font-eagle-lake">
                  {selectedGallery.title}
                </h2>
                {selectedGallery.description && (
                  <p className="text-lg text-gray-400 max-w-3xl mx-auto mb-2 font-light">
                    {selectedGallery.description}
                  </p>
                )}
                <p className="text-sm text-gray-400 font-light">
                  {selectedGallery.images?.length || 0} foto • {new Date(selectedGallery.createdAt).toLocaleDateString('it-IT', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </p>
              </div>

              {selectedGallery.images && selectedGallery.images.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {selectedGallery.images.map((image, index) => (
                    <div
                      key={image.id}
                      className="group relative aspect-square overflow-hidden rounded-lg shadow-md hover:shadow-2xl transition-all duration-300 cursor-pointer bg-gray-100"
                      onClick={() => openLightbox(image, selectedGallery.images, index)}
                      data-testid={`gallery-image-${image.id}`}
                    >
                      <img
                        src={convertImageUrl(image.imageUrl)}
                        alt={`Foto ${index + 1} - ${selectedGallery.title}`}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        loading="lazy"
                        onError={(e) => {
                          const target = e.currentTarget;
                          target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="400"%3E%3Crect fill="%23e5e7eb" width="400" height="400"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%239ca3af" font-size="20"%3EImmagine non disponibile%3C/text%3E%3C/svg%3E';
                        }}
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex items-center justify-center">
                        <ZoomIn className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 h-12 w-12" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-gray-50 rounded-xl">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-16 w-16 text-gray-300 mx-auto mb-3"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <p className="text-gray-500">Nessuna foto in questa galleria</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Lightbox fullscreen */}
      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-full w-full h-full max-h-screen p-0 bg-black/95 border-0">
          <DialogTitle className="sr-only">Galleria Foto - Visualizzazione a schermo intero</DialogTitle>
          <div className="relative w-full h-full flex items-center justify-center">
            {/* Close button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 z-50 bg-black/50 text-white hover:bg-black/70 rounded-full"
              data-testid="close-lightbox"
            >
              <X className="h-6 w-6" />
            </Button>

            {/* Immagine principale */}
            {selectedImage && (
              <div className="w-full h-full flex items-center justify-center p-4">
                <img
                  src={selectedImage}
                  alt={`Foto ${selectedImageIndex + 1}`}
                  className="max-w-full max-h-[85vh] w-auto h-auto object-contain"
                  style={{ margin: '0 auto' }}
                  loading="eager"
                />
              </div>
            )}

            {/* Navigation arrows */}
            {allImages.length > 1 && (
              <>
                {selectedImageIndex > 0 && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 z-50 bg-black/50 text-white hover:bg-black/70 rounded-full w-12 h-12"
                    data-testid="prev-image"
                  >
                    <ChevronLeft className="h-8 w-8" />
                  </Button>
                )}

                {selectedImageIndex < allImages.length - 1 && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 z-50 bg-black/50 text-white hover:bg-black/70 rounded-full w-12 h-12"
                    data-testid="next-image"
                  >
                    <ChevronRight className="h-8 w-8" />
                  </Button>
                )}
              </>
            )}

            {/* Image counter */}
            <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-50">
              <div className="bg-black/70 text-white px-5 py-2 rounded-full text-sm font-medium backdrop-blur-sm">
                {selectedImageIndex + 1} / {allImages.length}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
}
