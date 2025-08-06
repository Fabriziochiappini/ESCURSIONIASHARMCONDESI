import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from "@/components/ui/dialog";
import { X, ChevronLeft, ChevronRight, Images, Maximize2 } from "lucide-react";

interface PhotoGalleryProps {
  images: string[];
  title: string;
}

export function PhotoGallery({ images, title }: PhotoGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const nextImage = () => {
    const next = (selectedImage + 1) % images.length;
    setSelectedImage(next);
  };

  const prevImage = () => {
    const prev = selectedImage === 0 ? images.length - 1 : selectedImage - 1;
    setSelectedImage(prev);
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

  // Componente immagine semplificato - NO lazy loading, NO flash, caricamento immediato
  const SimpleImage = ({ src, alt, className, onClick }: { 
    src: string; 
    alt: string; 
    className: string; 
    onClick?: () => void;
  }) => {
    return (
      <div 
        className={`${className} bg-gray-50 relative overflow-hidden group cursor-pointer`}
        onClick={onClick}
      >
        <img
          src={src}
          alt={alt}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="eager"
          decoding="sync"
        />
        
        {/* Overlay hover */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200" />
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <Button size="sm" className="bg-white/90 text-gray-900 hover:bg-white">
            <Maximize2 className="h-4 w-4" />
          </Button>
        </div>
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
      <div className="image-gallery rounded-3xl overflow-hidden">
        {images.length === 1 ? (
          // Single image layout
          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogTrigger asChild>
              <SimpleImage
                src={images[0]}
                alt={`${title} - Foto 1`}
                className="w-full h-96 rounded-3xl"
                onClick={() => { setSelectedImage(0); setIsModalOpen(true); }}
              />
            </DialogTrigger>
          </Dialog>
        ) : (
          // Grid layout for multiple images
          <div className="grid grid-cols-4 gap-4">
            {/* Main large image */}
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
              <DialogTrigger asChild>
                <SimpleImage
                  src={images[0]}
                  alt={`${title} - Foto principale`}
                  className="col-span-2 row-span-2 h-80 rounded-2xl"
                  onClick={() => { setSelectedImage(0); setIsModalOpen(true); }}
                />
              </DialogTrigger>
            </Dialog>

            {/* Thumbnail images */}
            {images.slice(1, 5).map((image, index) => (
              <Dialog key={index + 1} open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogTrigger asChild>
                  <SimpleImage
                    src={image}
                    alt={`${title} - Foto ${index + 2}`}
                    className="h-[9.5rem] rounded-xl"
                    onClick={() => { setSelectedImage(index + 1); setIsModalOpen(true); }}
                  />
                </DialogTrigger>
              </Dialog>
            ))}

            {/* Show more photos indicator */}
            {images.length > 5 && (
              <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogTrigger asChild>
                  <div 
                    className="h-[9.5rem] rounded-xl bg-gray-900/90 flex items-center justify-center cursor-pointer group hover:bg-gray-800/90 transition-colors"
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

      {/* Modal Dialog per visualizzazione ottimizzata */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-4xl w-[90vw] h-[80vh] p-0 bg-white border-0 rounded-2xl overflow-hidden">
          <DialogTitle className="sr-only">{title} - Galleria foto</DialogTitle>
          
          <div className="relative w-full h-full flex flex-col">
            {/* Header con controlli */}
            <div className="flex justify-between items-center p-4 bg-gray-50 border-b">
              <div className="flex items-center space-x-4">
                <h3 className="font-semibold text-gray-900">Galleria Foto</h3>
                <div className="text-sm text-gray-500">
                  {selectedImage + 1} di {images.length}
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                {/* Navigation arrows */}
                {images.length > 1 && (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={prevImage}
                      className="rounded-full"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={nextImage}
                      className="rounded-full"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </>
                )}
                
                {/* Close button */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-full"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Immagine principale - dimensione controllata */}
            <div className="flex-1 flex items-center justify-center p-6 bg-gray-50">
              <div className="relative max-w-full max-h-full">
                <img
                  src={images[selectedImage]}
                  alt={`${title} - Foto ${selectedImage + 1}`}
                  className="max-w-full max-h-[60vh] object-contain rounded-lg shadow-lg"
                  loading="eager"
                />
              </div>
            </div>

            {/* Thumbnails footer - solo se più di 1 immagine */}
            {images.length > 1 && (
              <div className="p-4 bg-white border-t">
                <div className="flex space-x-2 overflow-x-auto">
                  {images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                        index === selectedImage
                          ? 'border-primary ring-2 ring-primary/20'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <img
                        src={image}
                        alt={`Miniatura ${index + 1}`}
                        className="w-full h-full object-cover"
                        loading="eager"
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}