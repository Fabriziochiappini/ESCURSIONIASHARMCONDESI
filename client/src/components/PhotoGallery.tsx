import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { X, ChevronLeft, ChevronRight, Images, Maximize2 } from "lucide-react";

interface PhotoGalleryProps {
  images: string[];
  title: string;
}

export function PhotoGallery({ images, title }: PhotoGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set([0]));
  const galleryRef = useRef<HTMLDivElement>(null);

  // Preload images for better UX
  const preloadImage = (index: number) => {
    if (!loadedImages.has(index) && images[index]) {
      const img = new Image();
      img.onload = () => {
        setLoadedImages(prev => new Set([...Array.from(prev), index]));
      };
      img.src = images[index];
    }
  };

  // Preload adjacent images when modal opens
  useEffect(() => {
    if (isModalOpen) {
      preloadImage(selectedImage - 1);
      preloadImage(selectedImage + 1);
    }
  }, [selectedImage, isModalOpen]);

  const nextImage = () => {
    const next = (selectedImage + 1) % images.length;
    setSelectedImage(next);
    preloadImage(next + 1); // Preload next
  };

  const prevImage = () => {
    const prev = selectedImage === 0 ? images.length - 1 : selectedImage - 1;
    setSelectedImage(prev);
    preloadImage(prev - 1); // Preload previous
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (!isModalOpen) return;
    if (e.key === 'ArrowRight') nextImage();
    if (e.key === 'ArrowLeft') prevImage();
    if (e.key === 'Escape') setIsModalOpen(false);
  };

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isModalOpen, selectedImage]);

  const LazyImage = ({ src, alt, className, onClick, index }: { 
    src: string; 
    alt: string; 
    className: string; 
    onClick?: () => void;
    index: number;
  }) => {
    const [isLoaded, setIsLoaded] = useState(loadedImages.has(index));
    const [isInView, setIsInView] = useState(false);
    const imgRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observer.disconnect();
          }
        },
        { threshold: 0.1 }
      );

      if (imgRef.current) {
        observer.observe(imgRef.current);
      }

      return () => observer.disconnect();
    }, []);

    useEffect(() => {
      if (isInView && !isLoaded) {
        preloadImage(index);
      }
    }, [isInView, isLoaded, index]);

    return (
      <div 
        ref={imgRef}
        className={`${className} bg-gray-100 relative overflow-hidden group cursor-pointer`}
        onClick={onClick}
        onMouseEnter={() => preloadImage(index)}
      >
        {isInView && (
          <>
            <div 
              className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
              style={{ 
                backgroundImage: `url('${src}')`,
                opacity: loadedImages.has(index) ? 1 : 0
              }}
            />
            {!loadedImages.has(index) && (
              <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
                <Images className="h-8 w-8 text-gray-400" />
              </div>
            )}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300" />
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <Button size="sm" className="bg-white/90 text-gray-900 hover:bg-white">
                <Maximize2 className="h-4 w-4" />
              </Button>
            </div>
          </>
        )}
      </div>
    );
  };

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
      {/* Main Gallery Grid */}
      <div ref={galleryRef} className="image-gallery rounded-3xl overflow-hidden">
        {images.length === 1 ? (
          // Single image layout
          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogTrigger asChild>
              <LazyImage
                src={images[0]}
                alt={`${title} - Foto 1`}
                className="w-full h-96 rounded-3xl"
                onClick={() => { setSelectedImage(0); setIsModalOpen(true); }}
                index={0}
              />
            </DialogTrigger>
          </Dialog>
        ) : (
          // Grid layout for multiple images
          <div className="grid grid-cols-4 gap-4">
            {/* Main large image */}
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
              <DialogTrigger asChild>
                <LazyImage
                  src={images[0]}
                  alt={`${title} - Foto principale`}
                  className="col-span-2 row-span-2 image-gallery-main rounded-2xl"
                  onClick={() => { setSelectedImage(0); setIsModalOpen(true); }}
                  index={0}
                />
              </DialogTrigger>
            </Dialog>

            {/* Thumbnail images */}
            {images.slice(1, 5).map((image, index) => (
              <Dialog key={index + 1} open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogTrigger asChild>
                  <LazyImage
                    src={image}
                    alt={`${title} - Foto ${index + 2}`}
                    className="image-gallery-thumb rounded-xl"
                    onClick={() => { setSelectedImage(index + 1); setIsModalOpen(true); }}
                    index={index + 1}
                  />
                </DialogTrigger>
              </Dialog>
            ))}

            {/* Show more photos indicator */}
            {images.length > 5 && (
              <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogTrigger asChild>
                  <div 
                    className="image-gallery-thumb rounded-xl bg-gray-900/90 flex items-center justify-center cursor-pointer group hover:bg-gray-800/90 transition-colors"
                    onClick={() => { setSelectedImage(5); setIsModalOpen(true); }}
                  >
                    <div className="text-white text-center">
                      <Images className="h-8 w-8 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                      <span className="text-sm font-semibold">+{images.length - 5}</span>
                      <p className="text-xs opacity-80">altre foto</p>
                    </div>
                  </div>
                </DialogTrigger>
              </Dialog>
            )}
          </div>
        )}
      </div>

      {/* Gallery Controls */}
      <div className="mt-6 flex justify-center space-x-4">
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <Button 
              variant="outline" 
              className="rounded-full hover:bg-primary hover:text-white transition-colors"
              onClick={() => setSelectedImage(0)}
            >
              <Images className="mr-2 h-4 w-4" />
              Tutte le {images.length} foto
            </Button>
          </DialogTrigger>
        </Dialog>
      </div>

      {/* Full Screen Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-7xl w-full h-[90vh] p-0 bg-black/95 border-0 rounded-lg">
          <div className="relative w-full h-full flex items-center justify-center">
            {/* Close button */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 z-50 bg-black/50 text-white hover:bg-black/70"
              onClick={() => setIsModalOpen(false)}
            >
              <X className="h-6 w-6" />
            </Button>

            {/* Navigation buttons */}
            {images.length > 1 && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute left-4 z-50 bg-black/50 text-white hover:bg-black/70"
                  onClick={prevImage}
                >
                  <ChevronLeft className="h-8 w-8" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-4 z-50 bg-black/50 text-white hover:bg-black/70"
                  onClick={nextImage}
                >
                  <ChevronRight className="h-8 w-8" />
                </Button>
              </>
            )}

            {/* Main image */}
            <div className="w-full h-full flex items-center justify-center p-8">
              <img
                src={images[selectedImage]}
                alt={`${title} - Foto ${selectedImage + 1}`}
                className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
                style={{ filter: 'drop-shadow(0 25px 50px rgba(0, 0, 0, 0.5))' }}
              />
            </div>

            {/* Image counter and info */}
            <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 bg-black/70 text-white px-6 py-3 rounded-full text-sm font-medium">
              {selectedImage + 1} di {images.length}
            </div>

            {/* Thumbnail strip */}
            {images.length > 1 && (
              <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 flex space-x-2 bg-black/50 p-3 rounded-lg max-w-md overflow-x-auto">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`w-16 h-12 bg-cover bg-center rounded border-2 transition-all flex-shrink-0 ${
                      index === selectedImage 
                        ? 'border-white shadow-lg scale-110' 
                        : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                    style={{ backgroundImage: `url('${image}')` }}
                  />
                ))}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}