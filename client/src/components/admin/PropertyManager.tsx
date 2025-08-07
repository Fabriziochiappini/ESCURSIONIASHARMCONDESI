import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import imageCompression from 'browser-image-compression';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  MapPin,
  Bed,
  Bath,
  Square,
  Euro,
  Image as ImageIcon,
  GripVertical,
  Upload
} from "lucide-react";

// Drag and Drop imports
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { Property, InsertProperty } from "@shared/schema";

// Sortable Image Item Component
function SortableImageItem({ image, index, onRemove }: { 
  image: string; 
  index: number; 
  onRemove: (index: number) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: `image-${index}` });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`relative group border-2 rounded-lg p-2 bg-white ${
        isDragging ? 'border-blue-500 shadow-lg' : 'border-gray-200 hover:border-gray-300'
      }`}
    >
      <div className="flex items-center gap-2">
        <button
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing p-1 hover:bg-gray-100 rounded"
        >
          <GripVertical className="h-4 w-4 text-gray-400" />
        </button>
        
        <img 
          src={image} 
          alt={`Immagine ${index + 1}`}
          className="w-16 h-16 object-cover rounded flex-shrink-0"
        />
        
        <div className="flex-1 min-w-0">
          <span className="text-sm font-medium">Posizione {index + 1}</span>
          {index === 0 && (
            <div className="text-xs text-blue-600 font-medium">Foto principale</div>
          )}
        </div>
        
        <Button
          type="button"
          variant="destructive"
          size="sm"
          onClick={() => onRemove(index)}
          className="opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <Trash2 className="h-3 w-3" />
        </Button>
      </div>
    </div>
  );
}

import { isUnauthorizedError } from "@/lib/authUtils";


interface PropertyFormData extends Omit<InsertProperty, 'images' | 'features'> {
  features: string;
}

const initialFormData: PropertyFormData = {
  title: "",
  description: "",
  price: "0",
  type: "vendita",
  propertyType: undefined,
  priceType: "total",
  location: "",
  municipality: "",
  address: "",
  bedrooms: 1,
  bathrooms: 1,
  area: 50,
  features: "",
  youtubeVideoId: "",
  featured: false,
  available: true,
};

export default function PropertyManager() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const [formData, setFormData] = useState<PropertyFormData>(initialFormData);

  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const [showImageManager, setShowImageManager] = useState(false);
  const [tempImages, setTempImages] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<string>('');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Drag and drop sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const { data: properties = [], isLoading } = useQuery<Property[]>({
    queryKey: ['/api/properties'],
  });

  const createMutation = useMutation({
    mutationFn: async (data: InsertProperty) => {
      const response = await fetch('/api/admin/properties', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        throw new Error('Create failed');
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/properties'] });
      queryClient.invalidateQueries({ queryKey: ['/api/municipalities'] });
      setIsDialogOpen(false);
      resetForm();
      toast({
        title: "Successo",
        description: "Proprietà creata con successo",
      });
    },
    onError: (error) => {
      toast({
        title: "Errore",
        description: "Errore nella creazione della proprietà",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<InsertProperty> }) => {
      const response = await fetch(`/api/admin/properties/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        throw new Error('Update failed');
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/properties'] });
      queryClient.invalidateQueries({ queryKey: ['/api/municipalities'] });
      setIsDialogOpen(false);
      resetForm();
      toast({
        title: "Successo",
        description: "Proprietà aggiornata con successo",
      });
    },
    onError: (error) => {
      toast({
        title: "Errore",
        description: "Errore nell'aggiornamento della proprietà",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/admin/properties/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Delete failed');
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/properties'] });
      queryClient.invalidateQueries({ queryKey: ['/api/municipalities'] });
      toast({
        title: "Successo",
        description: "Proprietà eliminata con successo",
      });
    },
    onError: (error) => {
      toast({
        title: "Errore",
        description: "Errore nell'eliminazione della proprietà",
        variant: "destructive",
      });
    },
  });

  const resetForm = () => {
    setFormData(initialFormData);
    setEditingProperty(null);
    setSelectedFiles(null);
    setTempImages([]);
    setShowImageManager(false);
    setIsUploading(false);
    setUploadProgress('');
  };

  // Client-side image compression before upload - simplified for compatibility
  const compressImage = async (file: File): Promise<File> => {
    // Only compress very large files to avoid compatibility issues
    if (file.size < 3 * 1024 * 1024) { // Less than 3MB, skip compression
      return file;
    }

    const options = {
      maxSizeMB: 2, // Max 2MB after compression
      maxWidthOrHeight: 2048, // Max dimension
      useWebWorker: false, // Disable web worker for better compatibility
      initialQuality: 0.8 // Good quality vs size balance
    };

    try {
      const compressedFile = await imageCompression(file, options);
      console.log(`Compressed ${file.name}: ${(file.size / 1024 / 1024).toFixed(2)}MB → ${(compressedFile.size / 1024 / 1024).toFixed(2)}MB`);
      return compressedFile;
    } catch (error) {
      console.warn(`Compression failed for ${file.name}, using original:`, error);
      return file;
    }
  };

  // Function to upload images immediately when selected with client-side compression
  const handleImageUpload = async (files: FileList) => {
    if (!files || files.length === 0) return;
    
    setIsUploading(true);
    setUploadProgress(`Ottimizzando ${files.length} immagini...`);
    
    try {
      const formDataImages = new FormData();
      const compressedFiles = [];
      
      // Compress images on client-side first
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        setUploadProgress(`Ottimizzando immagine ${i + 1}/${files.length}...`);
        
        const compressedFile = await compressImage(file);
        compressedFiles.push(compressedFile);
        formDataImages.append('images', compressedFile);
      }

      setUploadProgress(`Caricamento di ${compressedFiles.length} immagini ottimizzate...`);

      const uploadResponse = await fetch('/api/admin/upload-images', {
        method: 'POST',
        body: formDataImages,
      });

      if (!uploadResponse.ok) {
        throw new Error('Errore nel caricamento');
      }

      const uploadResult = await uploadResponse.json();
      const imageUrls = uploadResult.imageUrls || [];
      
      // Add new images to tempImages immediately
      setTempImages(prev => [...prev, ...imageUrls]);
      
      setUploadProgress(`${imageUrls.length} immagini caricate con successo!`);
      
      toast({
        title: "Foto ottimizzate e caricate!",
        description: `${imageUrls.length} nuove foto aggiunte e ottimizzate. Puoi riordinarle e continuare ad aggiungerne altre.`,
      });
      
      // Clear file input
      setSelectedFiles(null);
      const fileInput = document.getElementById('images') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
      
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Errore caricamento",
        description: "Errore nel caricamento delle immagini. Riprova.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
      setTimeout(() => setUploadProgress(''), 3000);
    }
  };





  const openEditDialog = (property: Property) => {
    setEditingProperty(property);
    setFormData({
      ...property,
      features: Array.isArray(property.features) ? property.features.join('\n') : '',
      propertyType: property.propertyType || undefined,
    });
    setTempImages(property.images || []);
    setSelectedFiles(null);
    setIsDialogOpen(true);
  };

  const removeImage = (index: number) => {
    if (editingProperty) {
      const newImages = [...tempImages];
      newImages.splice(index, 1);
      setTempImages(newImages);
      setEditingProperty({ ...editingProperty, images: newImages });
    }
  };

  // Drag and drop handler
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      const oldIndex = tempImages.findIndex((_, index) => `image-${index}` === active.id);
      const newIndex = tempImages.findIndex((_, index) => `image-${index}` === over.id);
      
      if (oldIndex !== -1 && newIndex !== -1) {
        const newImages = arrayMove(tempImages, oldIndex, newIndex);
        setTempImages(newImages);
        if (editingProperty) {
          setEditingProperty({ ...editingProperty, images: newImages });
        }
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // If there are still unuploaded files, upload them first
      if (selectedFiles && selectedFiles.length > 0) {
        await handleImageUpload(selectedFiles);
        // Wait a moment for state to update
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      // Prepare property data using tempImages (which contains all managed photos)
      const propertyData: InsertProperty = {
        ...formData,
        images: tempImages, // Always use tempImages which contains all managed photos
        features: formData.features.split('\n').filter(feature => feature.trim()),
        price: formData.price.toString(),
      };

      if (editingProperty) {
        updateMutation.mutate({ id: editingProperty.id, data: propertyData });
      } else {
        createMutation.mutate(propertyData);
      }
    } catch (error) {
      toast({
        title: "Errore",
        description: error instanceof Error ? error.message : "Errore sconosciuto",
        variant: "destructive",
      });
    }
  };

  const handleDelete = (id: number) => {
    if (confirm('Sei sicuro di voler eliminare questa proprietà?')) {
      deleteMutation.mutate(id);
    }
  };

  const formatPrice = (price: string, type: string) => {
    const numPrice = parseInt(price);
    if (type === "vendita") {
      return `€ ${numPrice.toLocaleString('it-IT')}`;
    } else if (type === "affitto") {
      return `€ ${numPrice}/mese`;
    } else {
      return `€ ${numPrice}/notte`;
    }
  };

  const getTypeBadgeColor = (type: string) => {
    switch(type) {
      case "vendita": return "bg-green-100 text-green-800";
      case "affitto": return "bg-blue-100 text-blue-800";
      case "casa_vacanza": return "bg-purple-100 text-purple-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Gestione Proprietà</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm} className="bg-purple-600 text-white hover:bg-purple-700">
              <Plus className="h-4 w-4 mr-2" />
              Nuova Proprietà
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingProperty ? 'Modifica Proprietà' : 'Nuova Proprietà'}
              </DialogTitle>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Titolo *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="type">Tipo *</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, type: value as "vendita" | "affitto" | "casa_vacanza" }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="vendita">Vendita</SelectItem>
                      <SelectItem value="affitto">Affitto</SelectItem>
                      <SelectItem value="casa_vacanza">Casa Vacanza</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="propertyType">Categoria Proprietà</Label>
                  <Select
                    value={formData.propertyType || ""}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, propertyType: value || undefined }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleziona categoria" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="villa">Villa Singola</SelectItem>
                      <SelectItem value="appartamento">Appartamento</SelectItem>
                      <SelectItem value="villa_a_schiera">Villa a Schiera</SelectItem>
                      <SelectItem value="casa_singola_con_terreno">Casa Singola con Terreno</SelectItem>
                      <SelectItem value="rustici_e_terreni">Rustici e Terreni</SelectItem>
                      <SelectItem value="terreno_agricolo">Terreno Agricolo</SelectItem>
                      <SelectItem value="terreno_edificabile">Terreno Edificabile</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descrizione *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  rows={4}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Prezzo *</Label>
                  <Input
                    id="price"
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="bedrooms">Camere da letto</Label>
                  <Input
                    id="bedrooms"
                    type="number"
                    value={formData.bedrooms}
                    onChange={(e) => setFormData(prev => ({ ...prev, bedrooms: parseInt(e.target.value) }))}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="bathrooms">Bagni</Label>
                  <Input
                    id="bathrooms"
                    type="number"
                    value={formData.bathrooms}
                    onChange={(e) => setFormData(prev => ({ ...prev, bathrooms: parseInt(e.target.value) }))}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="location">Località</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="municipality">Comune</Label>
                  <Input
                    id="municipality"
                    value={formData.municipality}
                    onChange={(e) => setFormData(prev => ({ ...prev, municipality: e.target.value }))}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="area">Superficie (mq)</Label>
                  <Input
                    id="area"
                    type="number"
                    value={formData.area}
                    onChange={(e) => setFormData(prev => ({ ...prev, area: parseInt(e.target.value) }))}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Indirizzo completo</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="images">Immagini</Label>
                <div className="flex gap-2">
                  <Input
                    id="images"
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) => setSelectedFiles(e.target.files)}
                    className="cursor-pointer flex-1"
                    disabled={isUploading}
                  />
                  <Button
                    type="button"
                    onClick={() => selectedFiles && handleImageUpload(selectedFiles)}
                    disabled={!selectedFiles || isUploading}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    {isUploading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Caricando...
                      </>
                    ) : (
                      <>
                        <Upload className="h-4 w-4" />
                        Aggiungi Foto
                      </>
                    )}
                  </Button>
                </div>
                {uploadProgress && (
                  <p className="text-sm text-blue-600 font-medium">{uploadProgress}</p>
                )}
                <div className="text-sm text-gray-500">
                  <div className="space-y-1">
                    <p className="text-green-600 font-medium">
                      ✓ Carica le foto immediatamente senza chiudere la finestra
                    </p>
                    <p>
                      {editingProperty ? 
                        'Le foto esistenti saranno mantenute - aggiungi senza perdere quelle attuali' : 
                        'Seleziona e carica fino a 30 immagini per la proprietà'
                      }
                    </p>
                  </div>
                  <span className="text-xs text-blue-600 block mt-1">
                    Ottimizzato per immobili: supporta fino a 30 foto senza rallentamenti
                  </span>
                </div>
                {editingProperty && tempImages && tempImages.length > 0 && (
                  <div className="mt-2">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm text-gray-600">
                        Immagini attuali: <span className="font-medium text-blue-600">{tempImages.length}</span>
                        {tempImages.length > 0 && <span className="text-xs text-gray-500 ml-1">(La prima è quella principale)</span>}
                      </p>
                      <div className="space-x-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => setShowImageManager(true)}
                          className="flex items-center gap-1"
                        >
                          <GripVertical className="h-3 w-3" />
                          Riordina
                        </Button>
                      </div>
                    </div>
                    <div className="grid grid-cols-6 gap-2">
                      {tempImages.map((img, index) => (
                        <div key={index} className="relative group">
                          <img 
                            src={img} 
                            alt={`Immagine ${index + 1}`}
                            className="w-16 h-16 object-cover rounded border transition-all duration-300"
                            style={{
                              background: `linear-gradient(45deg, #f3f4f6, #e5e7eb)`,
                              backgroundSize: '8px 8px'
                            }}
                            loading="lazy"
                            decoding="async"
                          />
                          
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            className="absolute -top-2 -right-2 w-5 h-5 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => removeImage(index)}
                          >
                            ×
                          </Button>
                          <div className="absolute bottom-0 left-0 bg-black bg-opacity-50 text-white text-xs px-1 rounded-br">
                            {index + 1}
                            {index === 0 && <span className="text-yellow-400 ml-1">★</span>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="features">Caratteristiche (una per riga)</Label>
                <Textarea
                  id="features"
                  value={formData.features}
                  onChange={(e) => setFormData(prev => ({ ...prev, features: e.target.value }))}
                  rows={4}
                  placeholder="Piscina&#10;Giardino&#10;Posto auto"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="youtubeVideoId">Video YouTube</Label>
                  <Input
                    id="youtubeVideoId"
                    value={formData.youtubeVideoId || ''}
                    onChange={(e) => {
                      let value = e.target.value;
                      // Extract YouTube video ID from URL if pasted
                      const match = value.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
                      if (match) {
                        value = match[1];
                      }
                      setFormData(prev => ({ ...prev, youtubeVideoId: value }));
                    }}
                    placeholder="Incolla URL YouTube o solo ID: x8WntjPQtw4"
                  />
                  <p className="text-xs text-gray-500">
                    Puoi incollare l'URL completo YouTube o solo l'ID del video
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="featured"
                    checked={!!formData.featured}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, featured: !!checked }))}
                  />
                  <Label htmlFor="featured">In evidenza</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="available"
                    checked={!!formData.available}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, available: !!checked }))}
                  />
                  <Label htmlFor="available">Disponibile</Label>
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Annulla
                </Button>
                <Button 
                  type="submit" 
                  disabled={createMutation.isPending || updateMutation.isPending}
                  className="min-w-[100px] bg-purple-600 text-white hover:bg-purple-700"
                >
                  {createMutation.isPending || updateMutation.isPending ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Salvando...
                    </div>
                  ) : 'Salva'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        {/* Image Order Manager Modal */}
        {showImageManager && editingProperty && (
          <Dialog open={showImageManager} onOpenChange={setShowImageManager}>
            <DialogContent className="max-w-4xl">
              <DialogHeader>
                <DialogTitle>Gestisci Ordine Immagini</DialogTitle>
                <p className="text-sm text-gray-600">
                  Trascina le immagini per riordinarle. La prima immagine sarà quella principale.
                </p>
              </DialogHeader>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                <DndContext 
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={handleDragEnd}
                >
                  <SortableContext 
                    items={tempImages.map((_, index) => `image-${index}`)}
                    strategy={verticalListSortingStrategy}
                  >
                    {tempImages.map((img, index) => (
                      <SortableImageItem
                        key={`image-${index}`}
                        image={img}
                        index={index}
                        onRemove={removeImage}
                      />
                    ))}
                  </SortableContext>
                </DndContext>
              </div>
              <div className="flex justify-end">
                <Button onClick={() => setShowImageManager(false)}>
                  Fatto
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Properties Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {properties.map((property) => (
          <Card key={property.id} className="group hover:shadow-lg transition-shadow">
            <div className="relative aspect-video overflow-hidden rounded-t-lg">
              {property.images && property.images.length > 0 ? (
                <img 
                  src={property.images[0]} 
                  alt={property.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                  <ImageIcon className="h-12 w-12 text-gray-400" />
                </div>
              )}
              
              {property.featured && (
                <Badge className="absolute top-2 left-2 bg-yellow-500 text-yellow-900">
                  In evidenza
                </Badge>
              )}
              
              <Badge className={`absolute top-2 right-2 ${getTypeBadgeColor(property.type)}`}>
                {property.type === 'vendita' ? 'Vendita' : property.type === 'affitto' ? 'Affitto' : 'Casa Vacanza'}
              </Badge>
            </div>
            
            <CardContent className="p-4">
              <div className="flex items-center text-sm text-gray-600 mb-2">
                <MapPin className="h-4 w-4 mr-1" />
                {property.location}
              </div>
              
              <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                {property.title}
              </h3>
              
              <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center">
                    <Bed className="h-4 w-4 mr-1" />
                    {property.bedrooms}
                  </div>
                  <div className="flex items-center">
                    <Bath className="h-4 w-4 mr-1" />
                    {property.bathrooms}
                  </div>
                  <div className="flex items-center">
                    <Square className="h-4 w-4 mr-1" />
                    {property.area} mq
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="text-xl font-bold text-purple-600">
                  {formatPrice(property.price, property.type)}
                </div>
                <div className="flex space-x-1">
                  <Button size="sm" variant="outline" asChild>
                    <a href={`/property/${property.id}`} target="_blank" rel="noopener noreferrer">
                      <Eye className="h-4 w-4" />
                    </a>
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => openEditDialog(property)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => handleDelete(property.id)}
                    disabled={deleteMutation.isPending}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {properties.length === 0 && (
        <div className="text-center py-12">
          <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">Nessuna proprietà trovata. Inizia creandone una nuova!</p>
        </div>
      )}


    </div>
  );
}