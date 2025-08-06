import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
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
  Image as ImageIcon
} from "lucide-react";
import type { Property, InsertProperty } from "@shared/schema";
import { isUnauthorizedError } from "@/lib/authUtils";


interface PropertyFormData extends Omit<InsertProperty, 'images' | 'features'> {
  features: string;
}

const initialFormData: PropertyFormData = {
  title: "",
  description: "",
  price: "0",
  type: "vendita",
  priceType: "total",
  location: "",
  municipality: "",
  address: "",
  bedrooms: 1,
  bathrooms: 1,
  area: 50,
  features: "",
  youtubeVideoId: "",
  agentName: "",
  agentPhone: "",
  agentEmail: "",
  agentImage: "",
  featured: false,
  available: true,
};

export function PropertyManager() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const [formData, setFormData] = useState<PropertyFormData>(initialFormData);

  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const [showImageManager, setShowImageManager] = useState(false);
  const [tempImages, setTempImages] = useState<string[]>([]);
  const { toast } = useToast();
  const queryClient = useQueryClient();

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
  };





  const openEditDialog = (property: Property) => {
    setEditingProperty(property);
    setFormData({
      ...property,
      features: Array.isArray(property.features) ? property.features.join('\n') : '',
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

  const moveImage = (fromIndex: number, toIndex: number) => {
    const newImages = [...tempImages];
    const [movedImage] = newImages.splice(fromIndex, 1);
    newImages.splice(toIndex, 0, movedImage);
    setTempImages(newImages);
    if (editingProperty) {
      setEditingProperty({ ...editingProperty, images: newImages });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // First upload images if any are selected with optimized batch processing
      let imageUrls: string[] = [];
      if (selectedFiles && selectedFiles.length > 0) {
        
        // Show progress toast for large uploads
        if (selectedFiles.length > 10) {
          toast({
            title: "Caricamento in corso...",
            description: `Caricamento di ${selectedFiles.length} immagini. Questo potrebbe richiedere alcuni minuti.`,
          });
        }

        const formDataImages = new FormData();
        Array.from(selectedFiles).forEach(file => {
          formDataImages.append('images', file);
        });

        // Extended timeout for large uploads with production optimization
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 600000); // 10 minutes for production
        
        let uploadResponse;
        try {
          uploadResponse = await fetch('/api/admin/upload-images', {
            method: 'POST',
            body: formDataImages,
            signal: controller.signal,
            // Add performance headers for production
            headers: {
              'Accept': 'application/json',
            }
          });
          
          clearTimeout(timeoutId);

          if (!uploadResponse.ok) {
            const errorText = await uploadResponse.text();
            throw new Error(`Errore nel caricamento delle immagini: ${errorText}`);
          }
        } catch (uploadError: any) {
          clearTimeout(timeoutId);
          if (uploadError.name === 'AbortError') {
            throw new Error('Timeout del caricamento immagini. Prova con meno immagini alla volta.');
          }
          throw uploadError;
        }

        const uploadResult = await uploadResponse.json();
        imageUrls = uploadResult.imageUrls || [];
        
        // Success feedback for large uploads
        if (selectedFiles.length > 10) {
          toast({
            title: "Caricamento completato!",
            description: `${imageUrls.length} immagini caricate con successo.`,
          });
        }
      }

      // Prepare property data
      const propertyData: InsertProperty = {
        ...formData,
        images: editingProperty && imageUrls.length === 0 
          ? tempImages // Use the managed image list
          : editingProperty && imageUrls.length > 0
            ? [...tempImages, ...imageUrls] // Add new images to managed list
            : imageUrls, // Use new uploaded images for new properties
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
            <Button onClick={resetForm}>
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
                <Input
                  id="images"
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => setSelectedFiles(e.target.files)}
                  className="cursor-pointer"
                />
                <p className="text-sm text-gray-500">
                  {editingProperty ? 'Seleziona nuove immagini da aggiungere (opzionale)' : 'Seleziona fino a 30 immagini per la proprietà'}
                  <br />
                  <span className="text-xs text-blue-600">
                    Ottimizzato per immobili: supporta fino a 30 foto senza rallentamenti
                  </span>
                </p>
                {editingProperty && tempImages && tempImages.length > 0 && (
                  <div className="mt-2">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm text-gray-600">Immagini attuali: {tempImages.length}</p>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setShowImageManager(true)}
                      >
                        Gestisci Ordine
                      </Button>
                    </div>
                    <div className="grid grid-cols-6 gap-2">
                      {tempImages.map((img, index) => (
                        <div key={index} className="relative group">
                          <img 
                            src={img} 
                            alt={`Immagine ${index + 1}`}
                            className="w-16 h-16 object-cover rounded border"
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
                
                <div className="space-y-2">
                  <Label htmlFor="agentName">Nome Agente</Label>
                  <Input
                    id="agentName"
                    value={formData.agentName}
                    onChange={(e) => setFormData(prev => ({ ...prev, agentName: e.target.value }))}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="agentPhone">Telefono Agente</Label>
                  <Input
                    id="agentPhone"
                    value={formData.agentPhone}
                    onChange={(e) => setFormData(prev => ({ ...prev, agentPhone: e.target.value }))}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="agentEmail">Email Agente</Label>
                  <Input
                    id="agentEmail"
                    type="email"
                    value={formData.agentEmail}
                    onChange={(e) => setFormData(prev => ({ ...prev, agentEmail: e.target.value }))}
                  />
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
                  className="min-w-[100px]"
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
              </DialogHeader>
              <div className="grid grid-cols-3 gap-4 max-h-96 overflow-y-auto">
                {tempImages.map((img, index) => (
                  <div key={index} className="relative group border rounded-lg p-2">
                    <img 
                      src={img} 
                      alt={`Immagine ${index + 1}`}
                      className="w-full h-32 object-cover rounded"
                    />
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-sm">Posizione {index + 1}</span>
                      <div className="flex gap-1">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => moveImage(index, Math.max(0, index - 1))}
                          disabled={index === 0}
                        >
                          ↑
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => moveImage(index, Math.min(tempImages.length - 1, index + 1))}
                          disabled={index === tempImages.length - 1}
                        >
                          ↓
                        </Button>
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          onClick={() => removeImage(index)}
                        >
                          ×
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
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
                    <a href={`/proprieta/${property.id}`} target="_blank">
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