import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertShowcaseSchema, type Showcase, type InsertShowcase } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Pencil, Plus, Trash2, Upload } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";

export default function ShowcasesAdmin() {
  const { toast } = useToast();
  const [editingShowcase, setEditingShowcase] = useState<Showcase | null>(null);
  const [showDialog, setShowDialog] = useState(false);

  // Fetch showcases
  const { data: showcases = [] } = useQuery<Showcase[]>({
    queryKey: ['/api/admin/showcases']
  });

  // Fetch countries for selection
  const { data: countries = [] } = useQuery<{name: string}[]>({
    queryKey: ['/api/countries-list']
  });

  // Create showcase mutation
  const createMutation = useMutation({
    mutationFn: (data: InsertShowcase) => apiRequest('/api/admin/showcases', 'POST', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/showcases'] });
      toast({ title: "Vetrina creata con successo!" });
      setShowDialog(false);
    },
    onError: () => {
      toast({ title: "Errore nella creazione della vetrina", variant: "destructive" });
    }
  });

  // Update showcase mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<InsertShowcase> }) =>
      apiRequest(`/api/admin/showcases/${id}`, 'PUT', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/showcases'] });
      toast({ title: "Vetrina aggiornata con successo!" });
      setShowDialog(false);
      setEditingShowcase(null);
    },
    onError: () => {
      toast({ title: "Errore nell'aggiornamento della vetrina", variant: "destructive" });
    }
  });

  // Delete showcase mutation
  const deleteMutation = useMutation({
    mutationFn: (id: number) => apiRequest(`/api/admin/showcases/${id}`, 'DELETE'),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/showcases'] });
      toast({ title: "Vetrina eliminata con successo!" });
    },
    onError: () => {
      toast({ title: "Errore nell'eliminazione della vetrina", variant: "destructive" });
    }
  });

  const form = useForm<InsertShowcase>({
    resolver: zodResolver(insertShowcaseSchema),
    defaultValues: {
      title: "",
      description: "",
      backgroundImage: "",
      category: "",
      country: undefined,
      isActive: true,
      sortOrder: 0
    }
  });

  const onSubmit = (data: InsertShowcase) => {
    if (editingShowcase) {
      updateMutation.mutate({ id: editingShowcase.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleEdit = (showcase: Showcase) => {
    setEditingShowcase(showcase);
    form.reset({
      title: showcase.title,
      description: showcase.description,
      backgroundImage: showcase.backgroundImage,
      category: showcase.category,
      country: showcase.country || undefined,
      isActive: showcase.isActive,
      sortOrder: showcase.sortOrder
    });
    setShowDialog(true);
  };

  const handleNew = () => {
    setEditingShowcase(null);
    form.reset({
      title: "",
      description: "",
      backgroundImage: "",
      category: "",
      country: undefined,
      isActive: true,
      sortOrder: 0
    });
    setShowDialog(true);
  };

  const predefinedCategories = [
    { value: "emirati_arabi", label: "Vetrina 1 - Emirati Arabi" },
    { value: "europa", label: "Vetrina 2 - Europa" },
    { value: "asia", label: "Vetrina 3 - Asia" },
    { value: "esotico", label: "Vetrina 4 - Esotico" }
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Gestione Vetrine</h1>
        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogTrigger asChild>
            <Button onClick={handleNew}>
              <Plus className="w-4 h-4 mr-2" />
              Nuova Vetrina
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingShowcase ? "Modifica Vetrina" : "Nuova Vetrina"}
              </DialogTitle>
            </DialogHeader>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Vetrina</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleziona vetrina" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {predefinedCategories.map((cat) => (
                            <SelectItem key={cat.value} value={cat.value}>
                              {cat.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Titolo</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Titolo della vetrina" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Descrizione</FormLabel>
                      <FormControl>
                        <Textarea {...field} placeholder="Descrizione della vetrina" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="country"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Paese (per filtrare i viaggi)</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleziona paese" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {countries.map((country) => (
                            <SelectItem key={country.name} value={country.name}>
                              {country.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="backgroundImage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>URL Immagine di Sfondo</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="https://images.unsplash.com/..." />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="sortOrder"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ordine di Visualizzazione</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          {...field} 
                          value={field.value || 0}
                          onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-end gap-2 pt-4">
                  <Button type="button" variant="outline" onClick={() => setShowDialog(false)}>
                    Annulla
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={createMutation.isPending || updateMutation.isPending}
                  >
                    {editingShowcase ? "Aggiorna" : "Crea"} Vetrina
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {showcases.map((showcase) => (
          <Card key={showcase.id} className="relative">
            <div 
              className="h-48 bg-cover bg-center rounded-t-lg"
              style={{ backgroundImage: `url(${showcase.backgroundImage})` }}
            />
            <CardHeader>
              <CardTitle className="text-lg">{showcase.title}</CardTitle>
              <p className="text-sm text-muted-foreground">
                {predefinedCategories.find(c => c.value === showcase.category)?.label}
              </p>
            </CardHeader>
            <CardContent>
              <p className="text-sm mb-2">{showcase.description}</p>
              <p className="text-xs text-muted-foreground mb-4">
                Paese: {showcase.country || "Non specificato"}
              </p>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleEdit(showcase)}
                >
                  <Pencil className="w-3 h-3 mr-1" />
                  Modifica
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => deleteMutation.mutate(showcase.id)}
                >
                  <Trash2 className="w-3 h-3 mr-1" />
                  Elimina
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {showcases.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">Nessuna vetrina configurata</p>
          <Button onClick={handleNew}>
            <Plus className="w-4 h-4 mr-2" />
            Crea la Prima Vetrina
          </Button>
        </div>
      )}
    </div>
  );
}