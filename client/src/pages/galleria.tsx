import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { SEOHead } from "@/components/seo-head";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { X, ZoomIn } from "lucide-react";
import type { Gallery, GalleryImage } from "@shared/schema";

export default function GalleriaPage() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);
  const [allImages, setAllImages] = useState<GalleryImage[]>([]);

  const { data: galleries, isLoading } = useQuery<(Gallery & { images: GalleryImage[] })[]>({
    queryKey: ["/api/galleries"],
  });

  const convertImageUrl = (url: string) => {
    return url.replace('/public-objects/', '/api/images/');
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <SEOHead 
        title="Galleria Foto - UNCONVENTIONAL TOUR | Le Nostre Avventure"
        description="Scopri le nostre gallerie fotografiche dei viaggi organizzati. Immagini autentiche delle destinazioni più belle del mondo."
        keywords="galleria foto viaggi, foto tour, immagini vacanze, unconventional tour gallery"
        canonicalUrl="https://unconventionaltour.it/galleria"
      />
      <Navigation />

      <main className="pt-20">
        <section className="py-20 bg-gradient-to-br from-blue-600 to-purple-600 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Galleria Fotografica
            </h1>
            <p className="text-xl md:text-2xl text-white mb-8 max-w-3xl mx-auto opacity-90">
              Scopri le nostre avventure attraverso immagini autentiche
            </p>
          </div>
        </section>

        <section className="py-20">
          <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8">
            {isLoading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {[...Array(12)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="bg-gray-200 aspect-square rounded-lg"></div>
                  </div>
                ))}
              </div>
            ) : galleries && galleries.length > 0 ? (
              <div className="space-y-16">
                {galleries.map((gallery) => (
                  <div key={gallery.id} className="space-y-6">
                    <div className="text-center space-y-2">
                      <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                        {gallery.title}
                      </h2>
                      {gallery.description && (
                        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                          {gallery.description}
                        </p>
                      )}
                      <p className="text-sm text-gray-400">
                        {new Date(gallery.createdAt).toLocaleDateString('it-IT', { 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </p>
                    </div>

                    {gallery.images && gallery.images.length > 0 ? (
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                        {gallery.images.map((image, index) => (
                          <div
                            key={image.id}
                            className="group relative aspect-square overflow-hidden rounded-lg shadow-md hover:shadow-2xl transition-all duration-300 cursor-pointer bg-gray-100"
                            onClick={() => openLightbox(image, gallery.images, index)}
                            data-testid={`gallery-image-${image.id}`}
                          >
                            <img
                              src={convertImageUrl(image.imageUrl)}
                              alt={`Foto ${index + 1} - ${gallery.title}`}
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

                    {galleries.indexOf(gallery) < galleries.length - 1 && (
                      <div className="border-b border-gray-200 pt-8"></div>
                    )}
                  </div>
                ))}
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

      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-[95vw] max-h-[95vh] p-0 bg-black border-0">
          <div className="relative w-full h-full flex items-center justify-center">
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 z-50 bg-white/10 hover:bg-white/20 text-white rounded-full p-2 transition-all"
              data-testid="close-lightbox"
            >
              <X className="h-6 w-6" />
            </button>

            {selectedImageIndex > 0 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  prevImage();
                }}
                className="absolute left-4 z-50 bg-white/10 hover:bg-white/20 text-white rounded-full p-3 transition-all"
                data-testid="prev-image"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            )}

            {selectedImage && (
              <img
                src={selectedImage}
                alt="Foto a schermo intero"
                className="max-w-full max-h-[95vh] object-contain"
              />
            )}

            {selectedImageIndex < allImages.length - 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  nextImage();
                }}
                className="absolute right-4 z-50 bg-white/10 hover:bg-white/20 text-white rounded-full p-3 transition-all"
                data-testid="next-image"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            )}

            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 text-white px-4 py-2 rounded-full text-sm">
              {selectedImageIndex + 1} / {allImages.length}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
}
