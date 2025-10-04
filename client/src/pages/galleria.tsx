import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { SEOHead } from "@/components/seo-head";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import type { Gallery, GalleryImage } from "@shared/schema";

export default function GalleriaPage() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedGallery, setSelectedGallery] = useState<number | null>(null);

  const { data: galleries, isLoading } = useQuery<Gallery[]>({
    queryKey: ["/api/galleries"],
  });

  const { data: galleryWithImages } = useQuery<Gallery & { images: GalleryImage[] }>({
    queryKey: ["/api/galleries", selectedGallery],
    enabled: !!selectedGallery,
  });

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
        {/* Hero Section */}
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

        {/* Galleries Grid */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="bg-gray-200 h-64 rounded-2xl mb-4"></div>
                    <div className="bg-gray-200 h-6 rounded mb-2"></div>
                    <div className="bg-gray-200 h-4 rounded w-3/4"></div>
                  </div>
                ))}
              </div>
            ) : galleries && galleries.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {galleries.map((gallery) => (
                  <div
                    key={gallery.id}
                    className="group cursor-pointer"
                    onClick={() => setSelectedGallery(gallery.id)}
                    data-testid={`gallery-card-${gallery.id}`}
                  >
                    <div className="relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 bg-white">
                      <div className="aspect-video bg-gradient-to-br from-blue-400 to-purple-400 flex items-center justify-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-16 w-16 text-white opacity-50"
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
                      <div className="p-6">
                        <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                          {gallery.title}
                        </h3>
                        <p className="text-gray-600 line-clamp-2">
                          {gallery.description}
                        </p>
                        <p className="text-sm text-gray-400 mt-2">
                          {new Date(gallery.createdAt).toLocaleDateString('it-IT')}
                        </p>
                      </div>
                    </div>
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

      {/* Gallery Modal */}
      <Dialog open={!!selectedGallery} onOpenChange={() => setSelectedGallery(null)}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          {galleryWithImages && (
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                {galleryWithImages.title}
              </h2>
              <p className="text-gray-600 mb-6">{galleryWithImages.description}</p>
              
              {galleryWithImages.images && galleryWithImages.images.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {galleryWithImages.images.map((image) => (
                    <div
                      key={image.id}
                      className="cursor-pointer group overflow-hidden rounded-lg"
                      onClick={() => setSelectedImage(image.imageUrl)}
                      data-testid={`gallery-image-${image.id}`}
                    >
                      <img
                        src={image.imageUrl}
                        alt="Foto galleria"
                        className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">Nessuna immagine in questa galleria</p>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Image Lightbox */}
      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-7xl p-0 bg-black">
          {selectedImage && (
            <img
              src={selectedImage}
              alt="Foto a schermo intero"
              className="w-full h-auto"
            />
          )}
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
}
