import { useState, useRef } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Upload, X, GripVertical, Star, StarOff, ImageIcon } from "lucide-react";
import type { PropertyImage } from "@shared/schema";

interface ImageManagerProps {
  propertyId: number;
}

export function ImageManager({ propertyId }: ImageManagerProps) {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch images for the property
  const { data: images = [], isLoading } = useQuery<PropertyImage[]>({
    queryKey: [`/api/travels/${propertyId}/images`],
    enabled: !!propertyId,
  });

  // Upload images mutation
  const uploadMutation = useMutation({
    mutationFn: async (files: FileList) => {
      const formData = new FormData();
      Array.from(files).forEach(file => {
        formData.append('images', file);
      });
      
      const response = await fetch(`/api/travels/${propertyId}/images`, {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error('Upload failed');
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/travels/${propertyId}/images`] });
      toast({
        title: "Successo",
        description: "Immagini caricate con successo",
      });
    },
    onError: () => {
      toast({
        title: "Errore",
        description: "Errore durante il caricamento delle immagini",
        variant: "destructive",
      });
    },
  });

  // Delete image mutation
  const deleteMutation = useMutation({
    mutationFn: async (imageId: number) => {
      const response = await fetch(`/api/property-images/${imageId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Delete failed');
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/travels/${propertyId}/images`] });
      toast({
        title: "Successo",
        description: "Immagine eliminata con successo",
      });
    },
    onError: () => {
      toast({
        title: "Errore",
        description: "Errore durante l'eliminazione dell'immagine",
        variant: "destructive",
      });
    },
  });

  // Reorder images mutation
  const reorderMutation = useMutation({
    mutationFn: async (reorderedImages: { id: number; sortOrder: number }[]) => {
      const response = await fetch('/api/property-images/reorder', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ images: reorderedImages }),
      });
      
      if (!response.ok) {
        throw new Error('Reorder failed');
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/travels/${propertyId}/images`] });
      toast({
        title: "Successo",
        description: "Ordine immagini aggiornato",
      });
    },
    onError: () => {
      toast({
        title: "Errore",
        description: "Errore durante il riordino delle immagini",
        variant: "destructive",
      });
    },
  });

  // Set main image mutation
  const setMainMutation = useMutation({
    mutationFn: async (imageId: number) => {
      const response = await fetch(`/api/travels/${propertyId}/images/${imageId}/main`, {
        method: 'PUT',
      });
      
      if (!response.ok) {
        throw new Error('Set main failed');
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/travels/${propertyId}/images`] });
      toast({
        title: "Successo",
        description: "Immagine principale impostata",
      });
    },
    onError: () => {
      toast({
        title: "Errore",
        description: "Errore durante l'impostazione dell'immagine principale",
        variant: "destructive",
      });
    },
  });

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      uploadMutation.mutate(files);
    }
  };

  const handleDeleteImage = (imageId: number) => {
    if (confirm("Sei sicuro di voler eliminare questa immagine?")) {
      deleteMutation.mutate(imageId);
    }
  };

  const handleSetMainImage = (imageId: number) => {
    setMainMutation.mutate(imageId);
  };

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
    setIsDragging(true);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    
    if (draggedIndex === null) return;
    
    const newImages = [...images];
    const draggedImage = newImages[draggedIndex];
    newImages.splice(draggedIndex, 1);
    newImages.splice(dropIndex, 0, draggedImage);
    
    // Update sort order
    const reorderedImages = newImages.map((image, index) => ({
      id: image.id,
      sortOrder: index,
    }));
    
    reorderMutation.mutate(reorderedImages);
    setDraggedIndex(null);
    setIsDragging(false);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-muted-foreground">Caricamento immagini...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-purple-700">
          Gestione Immagini ({images.length})
        </h3>
        <Button
          onClick={() => fileInputRef.current?.click()}
          disabled={uploadMutation.isPending}
          className="bg-purple-600 hover:bg-purple-700 text-white"
        >
          <Upload className="h-4 w-4 mr-2" />
          {uploadMutation.isPending ? "Caricamento..." : "Carica Immagini"}
        </Button>
        <Input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileUpload}
          className="hidden"
        />
      </div>

      {images.length === 0 ? (
        <Card className="border-dashed border-2 border-gray-300">
          <CardContent className="flex flex-col items-center justify-center p-12">
            <ImageIcon className="h-12 w-12 text-gray-400 mb-4" />
            <p className="text-gray-500 text-center">
              Nessuna immagine caricata per questa proprietà.
              <br />
              Clicca "Carica Immagini" per iniziare.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {images.map((image: PropertyImage, index: number) => (
            <Card
              key={image.id}
              className={`relative overflow-hidden transition-all duration-200 ${
                isDragging && draggedIndex === index
                  ? "opacity-50 scale-95"
                  : "hover:shadow-lg"
              }`}
              draggable
              onDragStart={() => handleDragStart(index)}
              onDragEnd={handleDragEnd}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, index)}
            >
              <CardContent className="p-0">
                <div className="relative aspect-video">
                  <img
                    src={image.url}
                    alt={image.originalName}
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Drag handle */}
                  <div className="absolute top-2 left-2 cursor-move bg-black/50 rounded p-1">
                    <GripVertical className="h-4 w-4 text-white" />
                  </div>

                  {/* Main image badge */}
                  {image.isMain && (
                    <Badge className="absolute top-2 right-2 bg-yellow-500 hover:bg-yellow-600">
                      <Star className="h-3 w-3 mr-1" />
                      Principale
                    </Badge>
                  )}

                  {/* Action buttons overlay */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-2">
                    {!image.isMain && (
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => handleSetMainImage(image.id)}
                        disabled={setMainMutation.isPending}
                      >
                        <Star className="h-4 w-4" />
                      </Button>
                    )}
                    
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDeleteImage(image.id)}
                      disabled={deleteMutation.isPending}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Image info */}
                <div className="p-3">
                  <p className="text-sm font-medium truncate" title={image.originalName}>
                    {image.originalName}
                  </p>
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>{(image.size / 1024).toFixed(0)} KB</span>
                    <span>#{index + 1}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {images.length > 0 && (
        <div className="text-sm text-muted-foreground bg-purple-50 p-4 rounded-lg">
          <p className="font-medium text-purple-700 mb-2">Istruzioni:</p>
          <ul className="space-y-1">
            <li>• Trascina le immagini per riordinarle</li>
            <li>• Clicca sulla stella per impostare l'immagine principale</li>
            <li>• Clicca sulla X per eliminare un'immagine</li>
            <li>• La prima immagine caricata diventa automaticamente principale</li>
          </ul>
        </div>
      )}
    </div>
  );
}