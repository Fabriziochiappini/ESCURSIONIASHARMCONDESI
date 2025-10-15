import { useState, useEffect, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from "@/components/ui/dialog";
import { X, ChevronLeft, ChevronRight, Images, Maximize2 } from "lucide-react";
import useEmblaCarousel from 'embla-carousel-react';

interface PhotoGalleryProps {
  images: string[];
  title?: string;
}

export function PhotoGallery({ images, title }: PhotoGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [emblaRef, emblaApi] = useEmblaCarousel({ 
    loop: true,
    align: 'center',
    containScroll: 'trimSnaps'
  });
  const [emblaThumbsRef, emblaThumbsApi] = useEmblaCarousel({
    containScroll: 'keepSnaps',
    dragFree: true
  });

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedImage(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  const onThumbClick = useCallback((index: number) => {
    if (!emblaApi) return;
    emblaApi.scrollTo(index);
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on('select', onSelect);
    return () => {
      emblaApi.off('select', onSelect);
    };
  }, [emblaApi, onSelect]);

  const handleKeyDown = (e: KeyboardEvent) => {
    if (!isModalOpen) return;
    if (e.key === 'ArrowRight') scrollNext();
    if (e.key === 'ArrowLeft') scrollPrev();
    if (e.key === 'Escape') setIsModalOpen(false);
  };

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isModalOpen]);

  if (!images || images.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-100 rounded-3xl">
        <div className="text-center text-gray-500">
          <Images className="h-12 w-12 mx-auto mb-2" />
          <p>Nessuna immagine disponibile</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-12">
      {/* Carousel principale - Touch friendly */}
      <div className="overflow-hidden rounded-3xl mb-4" ref={emblaRef}>
        <div className="flex touch-pan-y">
          {images.map((image, index) => (
            <div
              key={index}
              className="flex-[0_0_100%] min-w-0 relative"
              style={{ height: '400px' }}
            >
              <div
                className="relative h-full bg-gray-100 cursor-pointer group"
                onClick={() => {
                  setSelectedImage(index);
                  setIsModalOpen(true);
                }}
              >
                <img
                  src={image}
                  alt={`${title} - Foto ${index + 1}`}
                  className="w-full h-full object-cover"
                  loading={index === 0 ? "eager" : "lazy"}
                />
                {/* Overlay hover */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200" />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <Button size="sm" className="bg-white/90 text-gray-900 hover:bg-white">
                    <Maximize2 className="h-4 w-4 mr-2" />
                    Ingrandisci
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Controlli carousel - Frecce e indicatore */}
      {images.length > 1 && (
        <div className="flex items-center justify-between mb-4">
          <Button
            variant="outline"
            size="icon"
            onClick={scrollPrev}
            className="rounded-full hover:bg-blue-50"
            data-testid="carousel-prev"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>

          <div className="text-sm text-gray-600 font-medium">
            {selectedImage + 1} / {images.length}
          </div>

          <Button
            variant="outline"
            size="icon"
            onClick={scrollNext}
            className="rounded-full hover:bg-blue-50"
            data-testid="carousel-next"
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
      )}

      {/* Thumbnails scorrevoli - Touch friendly */}
      {images.length > 1 && (
        <div className="overflow-hidden rounded-xl" ref={emblaThumbsRef}>
          <div className="flex gap-2 touch-pan-x">
            {images.map((image, index) => (
              <button
                key={index}
                onClick={() => onThumbClick(index)}
                className={`flex-[0_0_80px] min-w-0 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                  index === selectedImage
                    ? 'border-blue-600 scale-105'
                    : 'border-transparent hover:border-gray-300'
                }`}
                data-testid={`thumbnail-${index}`}
              >
                <img
                  src={image}
                  alt={`Thumbnail ${index + 1}`}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Pulsante visualizza tutte */}
      <div className="mt-6 flex justify-center">
        <Button
          variant="outline"
          className="rounded-full hover:bg-primary hover:text-white transition-colors"
          onClick={() => {
            setSelectedImage(0);
            setIsModalOpen(true);
          }}
        >
          <Images className="mr-2 h-4 w-4" />
          Visualizza tutte le {images.length} foto
        </Button>
      </div>

      {/* Modal Fullscreen con swipe */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-full w-full h-full max-h-screen p-0 bg-black/95 border-0">
          <DialogTitle className="sr-only">{title} - Galleria foto</DialogTitle>

          <div className="relative w-full h-full">
            {/* Close button */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 z-50 bg-black/50 text-white hover:bg-black/70 rounded-full"
              onClick={() => setIsModalOpen(false)}
            >
              <X className="h-6 w-6" />
            </Button>

            {/* Carousel fullscreen */}
            <div className="w-full h-full" ref={emblaRef}>
              <div className="flex h-full touch-pan-y">
                {images.map((image, index) => (
                  <div
                    key={index}
                    className="flex-[0_0_100%] min-w-0 flex items-center justify-center p-4 md:p-16"
                  >
                    <img
                      src={image}
                      alt={`${title} - Foto ${index + 1}`}
                      className="max-w-full max-h-full object-contain"
                      loading="eager"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Navigation arrows (nascosti su mobile) */}
            {images.length > 1 && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 z-50 bg-black/50 text-white hover:bg-black/70 rounded-full"
                  onClick={scrollPrev}
                >
                  <ChevronLeft className="h-8 w-8" />
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 z-50 bg-black/50 text-white hover:bg-black/70 rounded-full"
                  onClick={scrollNext}
                >
                  <ChevronRight className="h-8 w-8" />
                </Button>
              </>
            )}

            {/* Image counter */}
            <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-50">
              <div className="bg-black/70 text-white px-5 py-2 rounded-full text-sm font-medium backdrop-blur-sm">
                {selectedImage + 1} di {images.length}
              </div>
            </div>

            {/* Swipe hint for mobile */}
            <div className="md:hidden absolute bottom-20 left-1/2 transform -translate-x-1/2 z-50">
              <div className="text-white/60 text-xs animate-pulse">
                ← Scorri per navigare →
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
