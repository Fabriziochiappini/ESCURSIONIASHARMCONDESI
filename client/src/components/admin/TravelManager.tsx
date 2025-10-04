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
  Euro,
  Upload,
  Plane
} from "lucide-react";

import type { Travel, InsertTravel } from "@shared/schema";

// Travel Item Component
function TravelItem({ travel, onEdit, onDelete, onMoveUp, onMoveDown, isFirst, isLast }: {
  travel: Travel;
  onEdit: (travel: Travel) => void;
  onDelete: (id: number) => void;
  onMoveUp: (id: number) => void;
  onMoveDown: (id: number) => void;
  isFirst: boolean;
  isLast: boolean;
}) {
  const formatPrice = (price: string) => {
    const numPrice = parseInt(price);
    return `€ ${numPrice.toLocaleString('it-IT')}`;
  };

  const getTypeBadgeColor = (type: string) => {
    switch(type) {
      case "mare": return "bg-blue-100 text-blue-800";
      case "montagna": return "bg-green-100 text-green-800";
      case "citta": return "bg-gray-100 text-gray-800";
      case "avventura": return "bg-red-100 text-red-800";
      case "relax": return "bg-purple-100 text-purple-800";
      case "cultura": return "bg-yellow-100 text-yellow-800";
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
            onClick={() => onMoveUp(travel.id)}
            disabled={isFirst}
            className="h-6 w-6 p-0"
            title="Sposta su"
          >
            ↑
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onMoveDown(travel.id)}
            disabled={isLast}
            className="h-6 w-6 p-0"
            title="Sposta giù"
          >
            ↓
          </Button>
        </div>
        
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
          <div className="flex items-center gap-2 mt-1 text-xs text-gray-600">
            <MapPin className="w-3 h-3" />
            <span>{travel.destination} - {travel.country}</span>
          </div>
          <div className="flex items-center gap-2 mt-1">
            <Badge className={getTypeBadgeColor(travel.travelType || '')}>{travel.travelType}</Badge>
            <span className="text-sm font-semibold text-green-600">{formatPrice(travel.price)}</span>
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

interface TravelFormData {
  id?: number;
  slug: string;
  images: string[];
  country: string;
  title: string;
  description: string;
  price: string;
  travelType: string;
  priceType: string;
  destination: string;
  region: string;
  duration: string;
  maxParticipants: string;
  minAge: string;
  travelCategory: string;
  included: string;
  excluded: string;
  itinerary: string;
  agent: string;
  whatsappNumber: string;
  agentEmail: string;
  notes: string;
  isFeatured: boolean;
  isActive: boolean;
  youtubeId: string;
  showcaseCountry: string;
  rating: string;
  reviewsCount: string;
}

export default function TravelManager() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTravel, setEditingTravel] = useState<Travel | null>(null);
  const [showImageManager, setShowImageManager] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const [tempImages, setTempImages] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState("");
  
  const [formData, setFormData] = useState<TravelFormData>({
    slug: "",
    images: [],
    country: "",
    title: "",
    description: "",
    price: "",
    travelType: "",
    priceType: "per_person",
    destination: "",
    region: "",
    duration: "",
    maxParticipants: "",
    minAge: "",
    travelCategory: "",
    included: "",
    excluded: "",
    itinerary: "",
    agent: "",
    whatsappNumber: "",
    agentEmail: "",
    notes: "",
    isFeatured: false,
    isActive: true,
    youtubeId: "",
    showcaseCountry: "",
    rating: "0",
    reviewsCount: "0"
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: travels, isLoading } = useQuery({
    queryKey: ["/api/travels"]
  });

  // Create travel mutation
  const createTravelMutation = useMutation({
    mutationFn: (data: Partial<InsertTravel>) => 
      apiRequest("/api/travels", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/travels"] });
      resetForm();
      setIsDialogOpen(false);
      toast({
        title: "Pacchetto viaggio creato!",
        description: "Il nuovo pacchetto è stato aggiunto con successo.",
      });
    },
    onError: (error) => {
      toast({
        title: "Errore",
        description: "Errore nella creazione del pacchetto viaggio.",
        variant: "destructive",
      });
    },
  });

  // Update travel mutation
  const updateTravelMutation = useMutation({
    mutationFn: ({ id, ...data }: { id: number } & Partial<InsertTravel>) => 
      apiRequest(`/api/travels/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/travels"] });
      resetForm();
      setIsDialogOpen(false);
      toast({
        title: "Pacchetto viaggio aggiornato!",
        description: "Le modifiche sono state salvate con successo.",
      });
    },
    onError: (error) => {
      toast({
        title: "Errore salvataggio",
        description: "Errore nell'aggiornamento del pacchetto viaggio.",
        variant: "destructive",
      });
    },
  });

  // Delete travel mutation
  const deleteTravelMutation = useMutation({
    mutationFn: (id: number) => apiRequest(`/api/travels/${id}`, { method: "DELETE" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/travels"] });
      toast({
        title: "Pacchetto eliminato",
        description: "Il pacchetto viaggio è stato eliminato con successo.",
      });
    },
  });

  const resetForm = () => {
    setFormData({
      slug: "",
      images: [],
      country: "",
      title: "",
      description: "",
      price: "",
      travelType: "",
      priceType: "per_person",
      destination: "",
      region: "",
      duration: "",
      maxParticipants: "",
      minAge: "",
      travelCategory: "",
      included: "",
      excluded: "",
      itinerary: "",
      agent: "",
      whatsappNumber: "",
      agentEmail: "",
      notes: "",
      isFeatured: false,
      isActive: true,
      youtubeId: "",
      showcaseCountry: "",
      rating: "0",
      reviewsCount: "0"
    });
    setEditingTravel(null);
    setSelectedFiles(null);
    setTempImages([]);
    setShowImageManager(false);
    setIsUploading(false);
    setUploadProgress('');
  };

  // Client-side image compression
  const compressImage = async (file: File): Promise<File> => {
    if (file.size < 3 * 1024 * 1024) {
      return file;
    }

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

  // Upload images function
  const handleImageUpload = async (files: FileList) => {
    if (!files || files.length === 0) return;
    
    setIsUploading(true);
    setUploadProgress(`Ottimizzando ${files.length} immagini...`);
    
    try {
      const formDataImages = new FormData();
      const compressedFiles = [];
      
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
      
      setTempImages(prev => [...prev, ...imageUrls]);
      setUploadProgress(`${imageUrls.length} immagini caricate con successo!`);
      
      toast({
        title: "Foto ottimizzate e caricate!",
        description: `${imageUrls.length} nuove foto aggiunte e ottimizzate.`,
      });
      
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

  const handleEdit = (travel: Travel) => {
    setEditingTravel(travel);
    setFormData({
      id: travel.id,
      slug: travel.slug || "",
      images: travel.images || [],
      country: travel.country,
      title: travel.title,
      description: travel.description,
      price: travel.price,
      travelType: travel.type || "",
      priceType: travel.priceType || "per_person",
      destination: travel.destination,
      region: travel.region || "",
      duration: String(travel.duration || ""),
      maxParticipants: String(travel.maxParticipants || ""),
      minAge: String(travel.minAge || ""),
      travelCategory: travel.travelType || "",
      included: "", // Calculated from includedServices
      excluded: "", // Calculated from excludedServices
      itinerary: "", // Calculated from itinerary JSON
      agent: travel.agentName || "",
      whatsappNumber: travel.agentPhone || "",
      agentEmail: travel.agentEmail || "",
      notes: "",
      isFeatured: travel.featured || false,
      isActive: travel.available ?? true,
      youtubeId: travel.youtubeVideoId || "",
      showcaseCountry: travel.showcaseCountry || "",
      rating: travel.rating || "0",
      reviewsCount: String(travel.reviewsCount || 0)
    });
    setTempImages([]);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    if (confirm("Sei sicuro di voler eliminare questo pacchetto viaggio?")) {
      deleteTravelMutation.mutate(id);
    }
  };

  const handleSubmit = () => {
    // Combine original images with newly uploaded images
    const allImages = [...(formData.images || []), ...tempImages];
    
    // Map form data to Travel schema
    const travelData = {
      title: formData.title,
      description: formData.description,
      price: formData.price,
      type: formData.travelType, // form travelType -> db type
      travelType: formData.travelCategory, // form travelCategory -> db travelType
      priceType: formData.priceType,
      destination: formData.destination,
      country: formData.country,
      region: formData.region,
      duration: parseInt(formData.duration) || 0,
      maxParticipants: parseInt(formData.maxParticipants) || 0,
      minAge: parseInt(formData.minAge) || 0,
      images: allImages,
      features: [],
      youtubeVideoId: formData.youtubeId,
      featured: formData.isFeatured,
      available: formData.isActive,
      agentName: formData.agent,
      agentPhone: formData.whatsappNumber,
      agentEmail: formData.agentEmail,
      showcaseCountry: formData.showcaseCountry,
      rating: formData.rating,
      reviewsCount: parseInt(formData.reviewsCount) || 0
    };

    if (editingTravel) {
      updateTravelMutation.mutate({ id: editingTravel.id, ...travelData });
    } else {
      createTravelMutation.mutate(travelData);
    }
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
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm} className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Nuovo Pacchetto
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingTravel ? "Modifica Pacchetto Viaggio" : "Crea Nuovo Pacchetto Viaggio"}
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-6">
              {/* Informazioni di base */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">Titolo *</Label>
                  <Input 
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Es: Grecia Classica - Santorini e Mykonos"
                  />
                </div>
                <div>
                  <Label htmlFor="destination">Destinazione *</Label>
                  <Input 
                    id="destination"
                    value={formData.destination}
                    onChange={(e) => setFormData(prev => ({ ...prev, destination: e.target.value }))}
                    placeholder="Es: Santorini"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="country">Paese *</Label>
                  <Input 
                    id="country"
                    value={formData.country}
                    onChange={(e) => setFormData(prev => ({ ...prev, country: e.target.value }))}
                    placeholder="Es: Grecia"
                  />
                </div>
                <div>
                  <Label htmlFor="travelType">Tipo Viaggio *</Label>
                  <Select 
                    value={formData.travelType} 
                    onValueChange={(value) => setFormData(prev => ({ ...prev, travelType: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleziona tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mare">Mare</SelectItem>
                      <SelectItem value="montagna">Montagna</SelectItem>
                      <SelectItem value="citta">Città</SelectItem>
                      <SelectItem value="avventura">Avventura</SelectItem>
                      <SelectItem value="relax">Relax</SelectItem>
                      <SelectItem value="cultura">Cultura</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="travelCategory">Categoria Viaggiatori</Label>
                  <Select 
                    value={formData.travelCategory} 
                    onValueChange={(value) => setFormData(prev => ({ ...prev, travelCategory: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleziona categoria" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="singolo">Singolo</SelectItem>
                      <SelectItem value="coppia">Coppia</SelectItem>
                      <SelectItem value="famiglia">Famiglia</SelectItem>
                      <SelectItem value="gruppo">Gruppo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="description">Descrizione *</Label>
                <Textarea 
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                  placeholder="Descrizione dettagliata del pacchetto viaggio..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <Label htmlFor="price">Prezzo € *</Label>
                  <Input 
                    id="price"
                    value={formData.price}
                    onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                    placeholder="Es: 1200"
                  />
                </div>
                <div>
                  <Label htmlFor="duration">Durata</Label>
                  <Input 
                    id="duration"
                    value={formData.duration}
                    onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
                    placeholder="Es: 7 giorni"
                  />
                </div>
                <div>
                  <Label htmlFor="maxParticipants">Max Partecipanti</Label>
                  <Input 
                    id="maxParticipants"
                    value={formData.maxParticipants}
                    onChange={(e) => setFormData(prev => ({ ...prev, maxParticipants: e.target.value }))}
                    placeholder="Es: 20"
                  />
                </div>
                <div>
                  <Label htmlFor="minAge">Età Minima</Label>
                  <Input 
                    id="minAge"
                    value={formData.minAge}
                    onChange={(e) => setFormData(prev => ({ ...prev, minAge: e.target.value }))}
                    placeholder="Es: 18"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="rating">Rating (0-5)</Label>
                  <Input 
                    id="rating"
                    type="number"
                    step="0.1"
                    min="0"
                    max="5"
                    value={formData.rating}
                    onChange={(e) => setFormData(prev => ({ ...prev, rating: e.target.value }))}
                    placeholder="Es: 4.5"
                  />
                </div>
                <div>
                  <Label htmlFor="reviewsCount">Numero Recensioni</Label>
                  <Input 
                    id="reviewsCount"
                    type="number"
                    min="0"
                    value={formData.reviewsCount}
                    onChange={(e) => setFormData(prev => ({ ...prev, reviewsCount: e.target.value }))}
                    placeholder="Es: 24"
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
                    setSelectedFiles(e.target.files);
                    if (e.target.files) {
                      handleImageUpload(e.target.files);
                    }
                  }}
                  className="hidden"
                />

                {uploadProgress && (
                  <div className="text-sm text-blue-600 bg-blue-50 p-2 rounded">
                    {uploadProgress}
                  </div>
                )}

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
                  disabled={createTravelMutation.isPending || updateTravelMutation.isPending}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {editingTravel ? "Aggiorna Pacchetto" : "Crea Pacchetto"}
                </Button>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Annulla
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
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
              {travelsArray.map((travel, index) => (
                <TravelItem
                  key={travel.id}
                  travel={travel}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onMoveUp={() => {}}
                  onMoveDown={() => {}}
                  isFirst={index === 0}
                  isLast={index === travelsArray.length - 1}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}