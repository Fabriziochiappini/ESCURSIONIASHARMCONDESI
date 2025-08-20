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
  Calendar,
  Users,
  Baby,
  Euro,
  Image as ImageIcon,
  Upload,
  Plane,
  ArrowUp,
  ArrowDown,
  GripVertical
} from "lucide-react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent
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

// Schema compatibile - manteniamo Property per compatibilità
import type { Property, InsertProperty, InsertTravel, Travel } from "@shared/schema";

// Sortable Image Item per drag & drop
function SortableImageItem({ image, index }: { image: string; index: number }) {
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
      className={`relative group bg-white border rounded-lg p-3 ${isDragging ? 'shadow-lg' : 'hover:shadow-md'} transition-shadow`}
      {...attributes}
    >
      <div className="flex items-center gap-3">
        <div {...listeners} className="cursor-grab hover:cursor-grabbing touch-none">
          <GripVertical className="h-5 w-5 text-gray-400" />
        </div>
        
        <img 
          src={image} 
          alt={`Immagine ${index + 1}`}
          className="w-16 h-16 object-cover rounded border"
        />
        
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-900">
            Immagine {index + 1}
            {index === 0 && <span className="text-yellow-500 ml-1">★ Principale</span>}
          </p>
          <p className="text-xs text-gray-500">Trascina per riordinare</p>
        </div>
      </div>
    </div>
  );
}

// Property Item (viaggi) con pulsanti Up/Down  
function PropertyItem({ property, onEdit, onDelete, onMoveUp, onMoveDown, isFirst, isLast }: {
  property: Property;
  onEdit: (property: Property) => void;
  onDelete: (id: number) => void;
  onMoveUp: (id: number) => void;
  onMoveDown: (id: number) => void;
  isFirst: boolean;
  isLast: boolean;
}) {
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

  return (
    <div className="bg-white border rounded-lg p-4 shadow hover:shadow-md">
      <div className="flex items-center gap-4">
        <div className="flex flex-col space-y-1">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onMoveUp(property.id)}
            disabled={isFirst}
            className="h-6 w-6 p-0"
            title="Sposta su"
          >
            ↑
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onMoveDown(property.id)}
            disabled={isLast}
            className="h-6 w-6 p-0"
            title="Sposta giù"
          >
            ↓
          </Button>
        </div>
        
        {property.images && property.images[0] && (
          <img 
            src={property.images[0]} 
            alt={property.title}
            className="w-16 h-16 object-cover rounded flex-shrink-0"
          />
        )}
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-semibold text-gray-900 truncate">{property.title}</h3>
              <p className="text-sm text-gray-500 flex items-center">
                <MapPin className="h-3 w-3 mr-1" />
                {property.destination}
              </p>
              <div className="flex items-center space-x-4 mt-1 text-sm text-gray-600">
                <span className="flex items-center">
                  <Calendar className="h-3 w-3 mr-1" />
                  {property.duration || 7}g
                </span>
                <span className="flex items-center">
                  <Users className="h-3 w-3 mr-1" />
                  {property.maxParticipants || 2}pax
                </span>
                <span className="flex items-center">
                  <Baby className="h-3 w-3 mr-1" />
                  {property.minAge || 0}+ anni
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Badge className={getTypeBadgeColor(property.type)}>
                {property.type}
              </Badge>
              <span className="font-bold text-blue-600">
                {formatPrice(property.price, property.type)}
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit(property)}
            className="h-8"
          >
            <Edit className="h-3 w-3" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDelete(property.id)}
            className="h-8 hover:bg-red-50 hover:border-red-300"
          >
            <Trash2 className="h-3 w-3 text-red-600" />
          </Button>
        </div>
      </div>
    </div>
  );
}

// Simple Image Item Component
function ImageItem({ image, index, onRemove }: { 
  image: string; 
  index: number; 
  onRemove: (index: number) => void;
}) {
  return (
    <div className="relative group border-2 rounded-lg p-2 bg-white border-gray-200 hover:border-gray-300">
      <div className="flex items-center gap-2">
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


interface PropertyFormData extends Omit<InsertProperty, 'images' | 'features' | 'address'> {
  features: string;
  showcaseCountry?: string;
}

const initialFormData: PropertyFormData = {
  title: "",
  description: "",
  price: "0",
  type: "mare",
  propertyType: undefined,
  priceType: "per_person",
  location: "",
  municipality: "",
  bedrooms: 1,
  bathrooms: 1,
  area: 50,
  features: "",
  youtubeVideoId: "",
  featured: false,
  available: true,
  showcaseCountry: "",
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

  // Drag & Drop sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );


  const { data: properties = [], isLoading } = useQuery<Property[]>({
    queryKey: ['/api/travels'],
  });

  // Simple reorder mutation for properties
  const movePropertyMutation = useMutation({
    mutationFn: async ({ propertyId, direction }: { propertyId: number, direction: 'up' | 'down' }) => {
      return apiRequest('PUT', `/api/travels/${propertyId}/move/${direction}`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/travels'] });
      toast({
        title: "Successo",
        description: "Ordine proprietà aggiornato con successo",
      });
    },
    onError: () => {
      toast({
        title: "Errore",
        description: "Errore nell'aggiornamento dell'ordine",
        variant: "destructive",
      });
    }
  });

  const createMutation = useMutation({
    mutationFn: async (data: InsertProperty) => {
      // For new packages, create first WITHOUT images
      const dataWithoutImages = { ...data };
      delete dataWithoutImages.images;
      
      const response = await fetch('/api/travels', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataWithoutImages),
      });
      
      if (!response.ok) {
        throw new Error('Create failed');
      }
      
      const newTravel = await response.json();
      
      // If there are images to upload, upload them now and update the travel
      if (data.images && data.images.length > 0) {
        const updateResponse = await fetch(`/api/travels/${newTravel.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ images: data.images }),
        });
        
        if (!updateResponse.ok) {
          console.error('Failed to update images after creation');
        }
      }
      
      return newTravel;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/travels'] });
      queryClient.invalidateQueries({ queryKey: ['/api/travels'] });
      setIsDialogOpen(false);
      resetForm();
      toast({
        title: "Successo",
        description: "Pacchetto viaggio creato con successo",
      });
    },
    onError: (error) => {
      toast({
        title: "Errore",
        description: "Errore nella creazione del pacchetto viaggio",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<InsertProperty> }) => {
      const response = await fetch(`/api/travels/${id}`, {
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
      queryClient.invalidateQueries({ queryKey: ['/api/travels'] });
      queryClient.invalidateQueries({ queryKey: ['/api/travels'] });
      setIsDialogOpen(false);
      resetForm();
      toast({
        title: "Successo",
        description: "Pacchetto viaggio aggiornato con successo",
      });
    },
    onError: (error) => {
      toast({
        title: "Errore",
        description: "Errore nell'aggiornamento del pacchetto viaggio",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/travels/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Delete failed');
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/travels'] });
      queryClient.invalidateQueries({ queryKey: ['/api/travels'] });
      toast({
        title: "Successo",
        description: "Pacchetto viaggio eliminato con successo",
      });
    },
    onError: (error) => {
      toast({
        title: "Errore",
        description: "Errore nell'eliminazione del pacchetto viaggio",
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
    
    // IMPORTANTE: Mappatura corretta dai campi database ai campi form
    const populatedFormData: PropertyFormData = {
      title: property.title || "",
      description: property.description || "", 
      price: property.price?.toString() || "0",
      type: property.type || "mare",
      propertyType: property.travelType || undefined, // DATABASE: travelType -> FORM: propertyType
      priceType: property.priceType || "per_person",
      location: property.destination || "", // DATABASE: destination -> FORM: location
      municipality: property.region || "", // DATABASE: region -> FORM: municipality
      address: "", // Campo non usato per viaggi - lasciato vuoto
      bedrooms: property.duration || 1, // DATABASE: duration -> FORM: bedrooms
      bathrooms: property.maxParticipants || 1, // DATABASE: maxParticipants -> FORM: bathrooms
      area: property.minAge || 50, // DATABASE: minAge -> FORM: area
      features: Array.isArray(property.features) ? property.features.join('\n') : (property.features || ''),
      youtubeVideoId: property.youtubeVideoId || "",
      featured: property.featured || false,
      available: property.available !== undefined ? property.available : true,
      showcaseCountry: property.country || "", // DATABASE: country -> FORM: showcaseCountry
    };
    
    setFormData(populatedFormData);
    setTempImages(property.images || []);
    setSelectedFiles(null);
    setIsDialogOpen(true);
    
    console.log('🔄 Form popolato per modifica:', populatedFormData);
  };

  // Drag end handler for image reordering
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const oldIndex = tempImages.findIndex((_, index) => `image-${index}` === active.id);
      const newIndex = tempImages.findIndex((_, index) => `image-${index}` === over?.id);

      const newImages = arrayMove(tempImages, oldIndex, newIndex);
      setTempImages(newImages);
      
      // IMPORTANTE: Aggiorna anche formData.images per mantenere l'ordine
      setFormData(prev => ({ ...prev, images: newImages }));

      toast({
        title: "Ordine aggiornato",
        description: `Immagine spostata dalla posizione ${oldIndex + 1} alla ${newIndex + 1}${newIndex === 0 ? ' (ora è principale)' : ''}`,
      });
    }
  };

  const removeImage = (index: number) => {
    const newImages = [...tempImages];
    newImages.splice(index, 1);
    setTempImages(newImages);
    
    // IMPORTANTE: Aggiorna anche formData.images per mantenere sincronizzazione
    setFormData(prev => ({ ...prev, images: newImages }));
    
    if (editingProperty) {
      setEditingProperty({ ...editingProperty, images: newImages });
    }
  };


  // Simple move handlers
  const handleMoveUp = (propertyId: number) => {
    movePropertyMutation.mutate({ propertyId, direction: 'up' });
  };

  const handleMoveDown = (propertyId: number) => {
    movePropertyMutation.mutate({ propertyId, direction: 'down' });
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

      // Prepare travel data - TUTTO LIBERO COME RICHIESTO - USA TEMPIMAGES per ordine aggiornato
      const travelData: InsertTravel = {
        title: formData.title || "Nuovo Pacchetto Viaggio",
        price: formData.price?.toString() || "0",
        type: formData.type || "mare",
        description: formData.description,
        travelType: formData.propertyType,
        priceType: formData.priceType,
        destination: formData.location,
        country: formData.showcaseCountry,
        region: formData.municipality,
        duration: formData.bedrooms,
        maxParticipants: formData.bathrooms,
        minAge: formData.area,
        images: tempImages,
        features: formData.features ? formData.features.split('\n').filter(f => f.trim()) : [],
        youtubeVideoId: formData.youtubeVideoId,
        featured: formData.featured,
        available: formData.available,
        showcaseCountry: formData.showcaseCountry,
      };
      


      if (editingProperty) {
        updateMutation.mutate({ id: editingProperty.id, data: travelData });
      } else {
        // For new travel packages, create with images included
        createMutation.mutate(travelData);
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
    if (confirm('Sei sicuro di voler eliminare questo pacchetto viaggio?')) {
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
        <h2 className="text-2xl font-bold text-gray-900">Gestione Pacchetti Viaggio</h2>
        <div className="text-sm text-gray-600">
          Usa le frecce ↑↓ accanto a ogni proprietà per riordinarle
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm} className="bg-purple-600 text-white hover:bg-purple-700">
              <Plus className="h-4 w-4 mr-2" />
              Nuovo Pacchetto Viaggio
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingProperty ? 'Modifica Pacchetto Viaggio' : 'Nuovo Pacchetto Viaggio'}
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
                      <SelectItem value="mare">Mare</SelectItem>
                      <SelectItem value="montagna">Montagna</SelectItem>
                      <SelectItem value="citta">Città</SelectItem>
                      <SelectItem value="cultura">Cultura</SelectItem>
                      <SelectItem value="avventura">Avventura</SelectItem>
                      <SelectItem value="relax">Relax</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="propertyType">Tipo Pacchetto</Label>
                  <Select
                    value={formData.propertyType || ""}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, propertyType: value || undefined }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleziona categoria" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="singolo">Viaggio Singolo</SelectItem>
                      <SelectItem value="coppia">Viaggio di Coppia</SelectItem>
                      <SelectItem value="famiglia">Viaggio Famiglia</SelectItem>
                      <SelectItem value="gruppo">Viaggio di Gruppo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="showcaseCountry">Paese per Vetrina</Label>
                  <Select
                    value={formData.showcaseCountry || ""}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, showcaseCountry: value || undefined }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleziona paese..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Francia">Francia</SelectItem>
                      <SelectItem value="Spagna">Spagna</SelectItem>
                      <SelectItem value="Grecia">Grecia</SelectItem>
                      <SelectItem value="Italia">Italia</SelectItem>
                      <SelectItem value="Croazia">Croazia</SelectItem>
                      <SelectItem value="Turchia">Turchia</SelectItem>
                      <SelectItem value="Emirati Arabi Uniti">Emirati Arabi Uniti</SelectItem>
                      <SelectItem value="Giappone">Giappone</SelectItem>
                      <SelectItem value="Thailandia">Thailandia</SelectItem>
                      <SelectItem value="Egitto">Egitto</SelectItem>
                      <SelectItem value="Stati Uniti">Stati Uniti</SelectItem>
                      <SelectItem value="Messico">Messico</SelectItem>
                      <SelectItem value="Brasile">Brasile</SelectItem>
                      <SelectItem value="Argentina">Argentina</SelectItem>
                      <SelectItem value="Marocco">Marocco</SelectItem>
                      <SelectItem value="Tunisia">Tunisia</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-gray-500">
                    Paese per apparire nella vetrina dinamica homepage
                  </p>
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
                  <Label htmlFor="bedrooms">Durata (giorni) *</Label>
                  <Input
                    id="bedrooms"
                    type="number"
                    value={formData.bedrooms}
                    onChange={(e) => setFormData(prev => ({ ...prev, bedrooms: parseInt(e.target.value) || 1 }))}
                    min="1"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="bathrooms">Max Partecipanti *</Label>
                  <Input
                    id="bathrooms"
                    type="number"
                    value={formData.bathrooms}
                    onChange={(e) => setFormData(prev => ({ ...prev, bathrooms: parseInt(e.target.value) || 1 }))}
                    min="1"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="location">Destinazione *</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                    placeholder="es. Santorini, Mykonos"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="municipality">Regione</Label>
                  <Input
                    id="municipality"
                    value={formData.municipality}
                    onChange={(e) => setFormData(prev => ({ ...prev, municipality: e.target.value }))}
                    placeholder="es. Isole Cicladi"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="area">Età Minima</Label>
                  <Input
                    id="area"
                    type="number"
                    value={formData.area}
                    onChange={(e) => setFormData(prev => ({ ...prev, area: parseInt(e.target.value) }))}
                  />
                </div>
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
                        'Seleziona e carica fino a 30 immagini per il pacchetto viaggio'
                      }
                    </p>
                  </div>
                  <span className="text-xs text-blue-600 block mt-1">
                    Ottimizzato per immobili: supporta fino a 30 foto senza rallentamenti
                  </span>
                </div>
                {tempImages && tempImages.length > 0 && (
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
                          <ImageIcon className="h-3 w-3" />
                          Gestisci
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
                  placeholder="Volo incluso&#10;Hotel 4 stelle&#10;Colazione inclusa&#10;Trasferimenti inclusi&#10;Guida turistica&#10;Assicurazione viaggio&#10;Wi-Fi gratuito&#10;Escursioni incluse"
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

        {/* Image Order Manager Modal con Drag & Drop */}
        {showImageManager && tempImages.length > 0 && (
          <Dialog open={showImageManager} onOpenChange={setShowImageManager}>
            <DialogContent className="max-w-4xl">
              <DialogHeader>
                <DialogTitle>Gestisci Ordine Immagini</DialogTitle>
                <p className="text-sm text-gray-600">
                  Trascina le immagini per riordinarle. La prima immagine sarà quella principale mostrata nelle card.
                </p>
              </DialogHeader>
              
              <DndContext 
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext 
                  items={tempImages.map((_, index) => `image-${index}`)}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {tempImages.map((img, index) => (
                      <SortableImageItem
                        key={`image-${index}`}
                        image={img}
                        index={index}
                      />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>

              <div className="flex justify-between items-center pt-4 border-t">
                <p className="text-sm text-gray-500">
                  {tempImages.length} {tempImages.length === 1 ? 'immagine' : 'immagini'} caricate
                </p>
                <div className="space-x-2">
                  <Button variant="outline" onClick={() => setTempImages([])}>
                    Rimuovi Tutte
                  </Button>
                  <Button onClick={() => setShowImageManager(false)}>
                    Fatto
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Properties List with Reorder */}
      <div className="space-y-4">
        {properties.map((property, index) => (
          <PropertyItem
            key={property.id}
            property={property}
            onEdit={openEditDialog}
            onDelete={handleDelete}
            onMoveUp={handleMoveUp}
            onMoveDown={handleMoveDown}
            isFirst={index === 0}
            isLast={index === properties.length - 1}
          />
        ))}
      </div>

      {properties.length === 0 && (
        <div className="text-center py-12">
          <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">Nessun pacchetto viaggio trovato. Inizia creandone uno nuovo!</p>
        </div>
      )}


    </div>
  );
}