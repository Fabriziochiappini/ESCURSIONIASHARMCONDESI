import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Edit, Trash2, Upload, Plane } from "lucide-react";
import type { Travel } from "@shared/schema";
import imageCompression from 'browser-image-compression';

function TravelItem({ travel, onEdit, onDelete }: {
  travel: Travel;
  onEdit: (travel: Travel) => void;
  onDelete: (id: number) => void;
}) {
  return (
    <div className="bg-white border rounded-lg p-4 shadow hover:shadow-md">
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
          {travel.images && travel.images.length > 0 ? (
            <img 
              src={travel.images[0]} 
              alt={travel.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Plane className="w-6 h-6 text-gray-400" />
            </div>
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-sm truncate">{travel.title}</h4>
          <div className="text-xs text-gray-600 mt-1">
            {travel.destination} - {travel.country}
          </div>
          <div className="text-sm font-semibold text-green-600">
            €{parseInt(travel.price).toLocaleString('it-IT')}
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => onEdit(travel)}>
            <Edit className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={() => onDelete(travel.id)}>
            <Trash2 className="w-4 h-4 text-red-500" />
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function WorkingTravelManager() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTravel, setEditingTravel] = useState<Travel | null>(null);
  const [tempImages, setTempImages] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    type: "",
    destination: "",
    country: "",
    region: "",
    duration: "",
    maxParticipants: "",
    minAge: "",
    images: [] as string[]
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: travels, isLoading } = useQuery({
    queryKey: ["/api/travels"]
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: any }) => {
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
      setIsDialogOpen(false);
      resetForm();
      toast({
        title: "Successo",
        description: "Pacchetto viaggio aggiornato con successo",
      });
    },
    onError: (error) => {
      console.error('Update error:', error);
      toast({
        title: "Errore",
        description: "Errore nell'aggiornamento del pacchetto viaggio",
        variant: "destructive",
      });
    },
  });

  // Delete mutation
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
    setFormData({
      title: "",
      description: "",
      price: "",
      type: "",
      destination: "",
      country: "",
      region: "",
      duration: "",
      maxParticipants: "",
      minAge: "",
      images: []
    });
    setEditingTravel(null);
    setTempImages([]);
    setIsUploading(false);
  };

  // Image compression
  const compressImage = async (file: File): Promise<File> => {
    if (file.size < 3 * 1024 * 1024) return file;

    const options = {
      maxSizeMB: 2,
      maxWidthOrHeight: 2048,
      useWebWorker: false,
      initialQuality: 0.8
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

  // Upload images
  const handleImageUpload = async (files: FileList) => {
    if (!files || files.length === 0) return;
    
    setIsUploading(true);
    
    try {
      const formDataImages = new FormData();
      
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const compressedFile = await compressImage(file);
        formDataImages.append('images', compressedFile);
      }

      const uploadResponse = await fetch('/api/admin/upload-images', {
        method: 'POST',
        body: formDataImages,
      });

      if (!uploadResponse.ok) {
        throw new Error('Errore nel caricamento');
      }

      const uploadResult = await uploadResponse.json();
      const imageUrls = uploadResult.imageUrls || [];
      
      setTempImages(prev => [...prev, ...imageUrls]);
      
      toast({
        title: "Foto caricate!",
        description: `${imageUrls.length} nuove foto aggiunte.`,
      });
      
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
    }
  };

  const handleEdit = (travel: Travel) => {
    setEditingTravel(travel);
    setFormData({
      title: travel.title,
      description: travel.description,
      price: travel.price,
      type: travel.type,
      destination: travel.destination,
      country: travel.country,
      region: travel.region || "",
      duration: travel.duration?.toString() || "",
      maxParticipants: travel.maxParticipants?.toString() || "",
      minAge: travel.minAge?.toString() || "",
      images: travel.images || []
    });
    setTempImages([]);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    if (confirm("Sei sicuro di voler eliminare questo pacchetto viaggio?")) {
      deleteMutation.mutate(id);
    }
  };

  const handleSubmit = () => {
    if (!editingTravel) return;
    
    const allImages = [...formData.images, ...tempImages];
    const finalData = {
      ...formData,
      images: allImages,
      duration: parseInt(formData.duration) || 0,
      maxParticipants: parseInt(formData.maxParticipants) || 0,
      minAge: parseInt(formData.minAge) || 0,
      features: [] // Required field
    };

    updateMutation.mutate({ id: editingTravel.id, data: finalData });
  };

  const travelsArray = Array.isArray(travels) ? travels : [];

  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center">Caricamento pacchetti viaggio...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Gestione Pacchetti Viaggio</h2>
          <p className="text-gray-600">Gestisci i pacchetti viaggio della tua agenzia</p>
        </div>
      </div>

      <Card>
        <CardContent className="pt-6">
          {travelsArray.length === 0 ? (
            <div className="text-center py-8">
              <Plane className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600">Nessun pacchetto viaggio</h3>
              <p className="text-gray-500">Inizia creando il tuo primo pacchetto viaggio</p>
            </div>
          ) : (
            <div className="space-y-3">
              {travelsArray.map((travel) => (
                <TravelItem
                  key={travel.id}
                  travel={travel}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Modifica Pacchetto Viaggio</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="title">Titolo</Label>
                <Input 
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="destination">Destinazione</Label>
                <Input 
                  id="destination"
                  value={formData.destination}
                  onChange={(e) => setFormData(prev => ({ ...prev, destination: e.target.value }))}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="description">Descrizione</Label>
              <Textarea 
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="country">Paese</Label>
                <Input 
                  id="country"
                  value={formData.country}
                  onChange={(e) => setFormData(prev => ({ ...prev, country: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="price">Prezzo €</Label>
                <Input 
                  id="price"
                  value={formData.price}
                  onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="duration">Durata (giorni)</Label>
                <Input 
                  id="duration"
                  value={formData.duration}
                  onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
                />
              </div>
            </div>

            {/* Image Upload Section */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Label>Immagini del Viaggio</Label>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => document.getElementById('images')?.click()}
                  disabled={isUploading}
                >
                  <Upload className="w-4 h-4 mr-2" />
                  {isUploading ? "Caricamento..." : "Carica Immagini"}
                </Button>
              </div>
              
              <input
                id="images"
                type="file"
                multiple
                accept="image/*"
                onChange={(e) => {
                  if (e.target.files) {
                    handleImageUpload(e.target.files);
                  }
                }}
                className="hidden"
              />

              {(formData.images.length > 0 || tempImages.length > 0) && (
                <div className="grid grid-cols-4 gap-2">
                  {[...formData.images, ...tempImages].map((url, index) => (
                    <div key={index} className="relative">
                      <img 
                        src={url} 
                        alt={`Immagine ${index + 1}`}
                        className="w-full h-20 object-cover rounded"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute top-1 right-1 h-6 w-6 p-0"
                        onClick={() => {
                          if (index < formData.images.length) {
                            const newImages = [...formData.images];
                            newImages.splice(index, 1);
                            setFormData(prev => ({ ...prev, images: newImages }));
                          } else {
                            const tempIndex = index - formData.images.length;
                            const newTempImages = [...tempImages];
                            newTempImages.splice(tempIndex, 1);
                            setTempImages(newTempImages);
                          }
                        }}
                      >
                        ×
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <Button 
                onClick={handleSubmit} 
                disabled={updateMutation.isPending}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Aggiorna Pacchetto
              </Button>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Annulla
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}