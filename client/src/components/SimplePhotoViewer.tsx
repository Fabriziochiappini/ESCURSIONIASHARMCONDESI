import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

interface SimplePhotoViewerProps {
  images: string[];
  title?: string;
}

export function SimplePhotoViewer({ images, title }: SimplePhotoViewerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const openViewer = (index: number) => {
    setCurrentIndex(index);
    setIsOpen(true);
  };

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') goToPrevious();
    if (e.key === 'ArrowRight') goToNext();
    if (e.key === 'Escape') setIsOpen(false);
  };

  if (!images || images.length === 0) {
    return null;
  }

  return (
    <>
      {/* Griglia foto */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {images.map((image, index) => (
          <div
            key={index}
            onClick={() => openViewer(index)}
            className="relative aspect-square rounded-xl overflow-hidden cursor-pointer group bg-gray-100"
          >
            <img
              src={image}
              alt={`${title} - Foto ${index + 1}`}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              loading={index < 8 ? "eager" : "lazy"}
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300 flex items-center justify-center">
              <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-white text-sm font-semibold">
                Visualizza
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Viewer Fullscreen */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent 
          className="max-w-full w-full h-full max-h-screen p-0 bg-black border-0"
          onKeyDown={handleKeyDown}
        >
          <div className="relative w-full h-full flex items-center justify-center">
            {/* Pulsante chiudi */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 z-50 bg-black/50 text-white hover:bg-black/70 rounded-full"
              onClick={() => setIsOpen(false)}
            >
              <X className="h-6 w-6" />
            </Button>

            {/* Immagine centrata */}
            <div className="w-full h-full flex items-center justify-center p-4">
              <img
                src={images[currentIndex]}
                alt={`${title} - Foto ${currentIndex + 1}`}
                className="max-w-full max-h-full object-contain"
                style={{ width: 'auto', height: 'auto' }}
              />
            </div>

            {/* Frecce navigazione */}
            {images.length > 1 && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-50 bg-black/50 text-white hover:bg-black/70 rounded-full"
                  onClick={goToPrevious}
                >
                  <ChevronLeft className="h-6 w-6 sm:h-8 sm:w-8" />
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-50 bg-black/50 text-white hover:bg-black/70 rounded-full"
                  onClick={goToNext}
                >
                  <ChevronRight className="h-6 w-6 sm:h-8 sm:w-8" />
                </Button>
              </>
            )}

            {/* Contatore */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-50">
              <div className="bg-black/70 text-white px-5 py-2 rounded-full text-sm font-medium backdrop-blur-sm">
                {currentIndex + 1} di {images.length}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
