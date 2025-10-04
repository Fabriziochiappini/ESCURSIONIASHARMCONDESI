import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Pencil, Trash2, Save, X, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { Country, InsertCountry } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";

interface CountryFormData {
  name: string;
  title: string;
  description: string;
  backgroundImage: string;
  isActive: boolean;
  sortOrder: number;
}

export default function AdminCountries() {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState<CountryFormData>({
    name: "",
    title: "",
    description: "",
    backgroundImage: "",
    isActive: true,
    sortOrder: 0,
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: countries = [], isLoading } = useQuery<Country[]>({
    queryKey: ['/api/admin/countries']
  });

  const createMutation = useMutation({
    mutationFn: (data: InsertCountry) => apiRequest('POST', '/api/admin/countries', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/countries'] });
      queryClient.invalidateQueries({ queryKey: ['/api/countries-destinations'] });
      setIsCreating(false);
      resetForm();
      toast({ title: "Paese creato con successo" });
    },
    onError: () => {
      toast({ title: "Errore nella creazione del paese", variant: "destructive" });
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<InsertCountry> }) => 
      apiRequest('PUT', `/api/admin/countries/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/countries'] });
      queryClient.invalidateQueries({ queryKey: ['/api/countries-destinations'] });
      setEditingId(null);
      resetForm();
      toast({ title: "Paese aggiornato con successo" });
    },
    onError: () => {
      toast({ title: "Errore nell'aggiornamento del paese", variant: "destructive" });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => apiRequest('DELETE', `/api/admin/countries/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/countries'] });
      queryClient.invalidateQueries({ queryKey: ['/api/countries-destinations'] });
      toast({ title: "Paese eliminato con successo" });
    },
    onError: () => {
      toast({ title: "Errore nell'eliminazione del paese", variant: "destructive" });
    }
  });

  const updateCountsMutation = useMutation({
    mutationFn: () => apiRequest('POST', '/api/admin/countries/update-counts'),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/countries'] });
      queryClient.invalidateQueries({ queryKey: ['/api/countries-destinations'] });
      toast({ title: "Contatori viaggi aggiornati con successo" });
    },
    onError: () => {
      toast({ title: "Errore nell'aggiornamento dei contatori", variant: "destructive" });
    }
  });

  const resetForm = () => {
    setFormData({
      name: "",
      title: "",
      description: "",
      backgroundImage: "",
      isActive: true,
      sortOrder: 0,
    });
  };

  const startEdit = (country: Country) => {
    setEditingId(country.id);
    setFormData({
      name: country.name,
      title: country.title,
      description: country.description,
      backgroundImage: country.backgroundImage,
      isActive: country.isActive ?? true,
      sortOrder: country.sortOrder ?? 0,
    });
  };

  const handleSubmit = () => {
    if (isCreating) {
      createMutation.mutate(formData);
    } else if (editingId) {
      updateMutation.mutate({ id: editingId, data: formData });
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setIsCreating(false);
    resetForm();
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Gestione Paesi</h1>
          <p className="text-muted-foreground">Gestisci le destinazioni nella sezione homepage</p>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={() => updateCountsMutation.mutate()}
            disabled={updateCountsMutation.isPending}
            variant="outline"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Aggiorna Contatori
          </Button>
          <Button onClick={() => setIsCreating(true)} disabled={isCreating || editingId !== null}>
            <Plus className="h-4 w-4 mr-2" />
            Nuovo Paese
          </Button>
        </div>
      </div>

      {/* Creation/Edit Form */}
      {(isCreating || editingId) && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>{isCreating ? 'Nuovo Paese' : 'Modifica Paese'}</CardTitle>
            <CardDescription>
              {isCreating ? 'Crea una nuova destinazione' : 'Modifica i dettagli della destinazione'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Nome Paese</label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Es: Italia"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Titolo</label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Es: Italia"
                />
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium">Descrizione</label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Es: Arte e storia italiana"
                rows={3}
              />
            </div>
            
            <div>
              <label className="text-sm font-medium">URL Immagine di Sfondo</label>
              <Input
                value={formData.backgroundImage}
                onChange={(e) => setFormData({ ...formData, backgroundImage: e.target.value })}
                placeholder="https://..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Ordine</label>
                <Input
                  type="number"
                  value={formData.sortOrder || 0}
                  onChange={(e) => setFormData({ ...formData, sortOrder: parseInt(e.target.value) || 0 })}
                />
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive || false}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                />
                <label htmlFor="isActive" className="text-sm font-medium">Attivo</label>
              </div>
            </div>

            <div className="flex gap-2">
              <Button 
                onClick={handleSubmit} 
                disabled={createMutation.isPending || updateMutation.isPending}
              >
                <Save className="h-4 w-4 mr-2" />
                Salva
              </Button>
              <Button variant="outline" onClick={cancelEdit}>
                <X className="h-4 w-4 mr-2" />
                Annulla
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Countries List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {countries.map((country) => (
          <Card key={country.id} className="overflow-hidden">
            <div 
              className="h-48 bg-cover bg-center relative"
              style={{ backgroundImage: `url(${country.backgroundImage})` }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              <div className="absolute bottom-4 left-4 text-white">
                <h3 className="font-bold text-lg">{country.title}</h3>
                <p className="text-sm opacity-90">{country.description}</p>
              </div>
              <div className="absolute top-4 right-4 flex gap-2">
                {country.isActive ? (
                  <Badge className="bg-green-500">Attivo</Badge>
                ) : (
                  <Badge variant="secondary">Inattivo</Badge>
                )}
                <Badge variant="outline" className="text-white border-white">
                  {country.travelCount} viaggi
                </Badge>
              </div>
            </div>
            
            <CardContent className="p-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-muted-foreground">Paese: {country.name}</p>
                  <p className="text-sm text-muted-foreground">Ordine: {country.sortOrder}</p>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => startEdit(country)}
                    disabled={editingId !== null || isCreating}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => deleteMutation.mutate(country.id)}
                    disabled={deleteMutation.isPending || editingId !== null || isCreating}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {countries.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground">Nessun paese configurato. Crea il primo paese per iniziare.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}