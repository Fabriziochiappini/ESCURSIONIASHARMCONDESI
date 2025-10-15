import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Plus, Trash2, BookOpen, Eye, EyeOff } from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { Guide } from "@shared/schema";

const guideSchema = z.object({
  title: z.string().min(1, "Titolo obbligatorio"),
  subtitle: z.string().min(1, "Sottotitolo obbligatorio"),
  description: z.string().min(1, "Descrizione obbligatoria"),
  category: z.string().min(1, "Categoria obbligatoria"),
  ctaText: z.string().min(1, "Testo pulsante obbligatorio"),
  imageUrl: z.string().min(1, "URL immagine obbligatorio"),
  gradient: z.string().min(1, "Gradiente obbligatorio"),
  tagColor: z.string().min(1, "Colore tag obbligatorio"),
  isActive: z.boolean().default(true),
});

type GuideFormData = z.infer<typeof guideSchema>;

const categoryLabels: Record<string, string> = {
  viaggio: "Viaggio",
  cultura: "Cultura",
  gastronomia: "Gastronomia",
  avventura: "Avventura",
  altro: "Altro",
};

const gradientOptions = [
  { value: "from-blue-500 to-purple-500", label: "Blu → Viola", preview: "bg-gradient-to-r from-blue-500 to-purple-500" },
  { value: "from-green-500 to-teal-500", label: "Verde → Teal", preview: "bg-gradient-to-r from-green-500 to-teal-500" },
  { value: "from-orange-500 to-red-500", label: "Arancione → Rosso", preview: "bg-gradient-to-r from-orange-500 to-red-500" },
  { value: "from-pink-500 to-rose-500", label: "Rosa → Rosa scuro", preview: "bg-gradient-to-r from-pink-500 to-rose-500" },
  { value: "from-indigo-500 to-blue-500", label: "Indaco → Blu", preview: "bg-gradient-to-r from-indigo-500 to-blue-500" },
  { value: "from-yellow-500 to-orange-500", label: "Giallo → Arancione", preview: "bg-gradient-to-r from-yellow-500 to-orange-500" },
];

export default function AdminGuides() {
  const { toast } = useToast();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingGuide, setEditingGuide] = useState<Guide | null>(null);

  const { data: guides = [], isLoading } = useQuery<Guide[]>({
    queryKey: ["/api/admin/guides"],
  });

  const createForm = useForm<GuideFormData>({
    resolver: zodResolver(guideSchema),
    defaultValues: { 
      title: "", 
      subtitle: "",
      description: "", 
      category: "DESTINAZIONI 2025",
      ctaText: "ACCEDI ALLA GUIDA →",
      imageUrl: "",
      gradient: "from-blue-600 to-purple-600",
      tagColor: "blue-600",
      isActive: true,
    },
  });

  const editForm = useForm<GuideFormData>({
    resolver: zodResolver(guideSchema),
  });

  const createMutation = useMutation({
    mutationFn: (data: GuideFormData) => apiRequest("POST", "/api/admin/guides", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/guides"] });
      queryClient.invalidateQueries({ queryKey: ["/api/guides"] });
      setIsCreateOpen(false);
      createForm.reset();
      toast({ title: "Guida creata con successo!" });
    },
    onError: () => {
      toast({ title: "Errore nella creazione della guida", variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: GuideFormData }) =>
      apiRequest("PUT", `/api/admin/guides/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/guides"] });
      queryClient.invalidateQueries({ queryKey: ["/api/guides"] });
      setEditingGuide(null);
      toast({ title: "Guida aggiornata con successo!" });
    },
    onError: () => {
      toast({ title: "Errore nell'aggiornamento della guida", variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => apiRequest("DELETE", `/api/admin/guides/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/guides"] });
      queryClient.invalidateQueries({ queryKey: ["/api/guides"] });
      toast({ title: "Guida eliminata con successo!" });
    },
    onError: () => {
      toast({ title: "Errore nell'eliminazione della guida", variant: "destructive" });
    },
  });

  const handleCreateSubmit = createForm.handleSubmit((data) => {
    createMutation.mutate(data);
  });

  const handleEditSubmit = editForm.handleSubmit((data) => {
    if (editingGuide) {
      updateMutation.mutate({ id: editingGuide.id, data });
    }
  });

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Caricamento...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <main className="pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900">Gestione Guide</h1>
            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
              <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700" data-testid="button-create-guide">
                  <Plus className="h-4 w-4 mr-2" />
                  Nuova Guida
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Crea Nuova Guida</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleCreateSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="title">Titolo</Label>
                    <Input {...createForm.register("title")} placeholder="Es: DESTINAZIONI 2025" data-testid="input-guide-title" />
                    {createForm.formState.errors.title && (
                      <p className="text-red-600 text-sm mt-1">{createForm.formState.errors.title.message}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="subtitle">Sottotitolo</Label>
                    <Input {...createForm.register("subtitle")} placeholder="Es: I Paesi Più Sicuri Dove Andare" data-testid="input-guide-subtitle" />
                    {createForm.formState.errors.subtitle && (
                      <p className="text-red-600 text-sm mt-1">{createForm.formState.errors.subtitle.message}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="description">Descrizione</Label>
                    <Textarea {...createForm.register("description")} placeholder="Descrizione completa della guida..." rows={4} data-testid="textarea-guide-description" />
                    {createForm.formState.errors.description && (
                      <p className="text-red-600 text-sm mt-1">{createForm.formState.errors.description.message}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="category">Categoria</Label>
                    <Input {...createForm.register("category")} placeholder="Es: DESTINAZIONI 2025" data-testid="input-guide-category" />
                    {createForm.formState.errors.category && (
                      <p className="text-red-600 text-sm mt-1">{createForm.formState.errors.category.message}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="imageUrl">URL Immagine</Label>
                    <Input {...createForm.register("imageUrl")} placeholder="Es: /api/images/..." data-testid="input-guide-image" />
                    {createForm.formState.errors.imageUrl && (
                      <p className="text-red-600 text-sm mt-1">{createForm.formState.errors.imageUrl.message}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="ctaText">Testo Pulsante</Label>
                    <Input {...createForm.register("ctaText")} placeholder="Es: ACCEDI ALLA GUIDA →" data-testid="input-guide-cta" />
                    {createForm.formState.errors.ctaText && (
                      <p className="text-red-600 text-sm mt-1">{createForm.formState.errors.ctaText.message}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="gradient">Colore Gradiente</Label>
                    <Controller
                      name="gradient"
                      control={createForm.control}
                      render={({ field }) => (
                        <div className="space-y-2">
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <SelectTrigger data-testid="select-guide-gradient">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {gradientOptions.map((option) => (
                                <SelectItem key={option.value} value={option.value}>
                                  <div className="flex items-center gap-2">
                                    <div className={`w-16 h-4 rounded ${option.preview}`} />
                                    <span>{option.label}</span>
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <div className={`w-full h-12 rounded bg-gradient-to-r ${field.value}`} />
                        </div>
                      )}
                    />
                  </div>
                  <div>
                    <Label htmlFor="tagColor">Colore Tag</Label>
                    <Input {...createForm.register("tagColor")} placeholder="Es: blue-600" data-testid="input-guide-tag-color" />
                    {createForm.formState.errors.tagColor && (
                      <p className="text-red-600 text-sm mt-1">{createForm.formState.errors.tagColor.message}</p>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <Controller
                      name="isActive"
                      control={createForm.control}
                      render={({ field }) => (
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          data-testid="switch-guide-active"
                        />
                      )}
                    />
                    <Label>Visibile sul sito</Label>
                  </div>
                  <Button type="submit" className="w-full" disabled={createMutation.isPending} data-testid="button-submit-guide">
                    {createMutation.isPending ? "Creazione..." : "Crea Guida"}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {guides.map((guide: Guide) => (
              <Card key={guide.id} className="overflow-hidden" data-testid={`card-guide-${guide.id}`}>
                <CardHeader className={`bg-gradient-to-r ${guide.gradient} text-white`}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-semibold bg-white/20 px-2 py-1 rounded">
                          {guide.category}
                        </span>
                        {guide.isActive ? (
                          <div className="flex items-center gap-1">
                            <Eye className="h-4 w-4" />
                            <span className="text-xs">Visibile</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1">
                            <EyeOff className="h-4 w-4" />
                            <span className="text-xs">Nascosta</span>
                          </div>
                        )}
                      </div>
                      <CardTitle className="text-xl">{guide.title}</CardTitle>
                      <p className="text-sm text-white/90 mt-1">{guide.subtitle}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-4 space-y-4">
                  <p className="text-sm text-gray-600 line-clamp-3">{guide.description}</p>
                  
                  <div className="text-sm">
                    <span className="font-semibold text-gray-700">CTA:</span>{" "}
                    <span className="text-gray-600">{guide.ctaText}</span>
                  </div>

                  <div className="flex gap-2">
                    <Dialog
                      open={editingGuide?.id === guide.id}
                      onOpenChange={(open) => {
                        if (!open) setEditingGuide(null);
                        else {
                          setEditingGuide(guide);
                          editForm.reset({
                            title: guide.title,
                            subtitle: guide.subtitle,
                            description: guide.description,
                            category: guide.category,
                            ctaText: guide.ctaText,
                            imageUrl: guide.imageUrl,
                            gradient: guide.gradient,
                            tagColor: guide.tagColor,
                            isActive: guide.isActive ?? true,
                          });
                        }
                      }}
                    >
                      <DialogTrigger asChild>
                        <Button size="sm" variant="outline" className="flex-1" data-testid={`button-edit-guide-${guide.id}`}>
                          Modifica
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>Modifica Guida</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleEditSubmit} className="space-y-4">
                          <div>
                            <Label htmlFor="edit-title">Titolo</Label>
                            <Input {...editForm.register("title")} />
                          </div>
                          <div>
                            <Label htmlFor="edit-subtitle">Sottotitolo</Label>
                            <Input {...editForm.register("subtitle")} />
                          </div>
                          <div>
                            <Label htmlFor="edit-description">Descrizione</Label>
                            <Textarea {...editForm.register("description")} rows={4} />
                          </div>
                          <div>
                            <Label htmlFor="edit-category">Categoria</Label>
                            <Input {...editForm.register("category")} />
                          </div>
                          <div>
                            <Label htmlFor="edit-imageUrl">URL Immagine</Label>
                            <Input {...editForm.register("imageUrl")} />
                          </div>
                          <div>
                            <Label htmlFor="edit-ctaText">Testo Pulsante</Label>
                            <Input {...editForm.register("ctaText")} />
                          </div>
                          <div>
                            <Label htmlFor="edit-gradient">Colore Gradiente</Label>
                            <Controller
                              name="gradient"
                              control={editForm.control}
                              render={({ field }) => (
                                <div className="space-y-2">
                                  <Select onValueChange={field.onChange} value={field.value}>
                                    <SelectTrigger>
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {gradientOptions.map((option) => (
                                        <SelectItem key={option.value} value={option.value}>
                                          <div className="flex items-center gap-2">
                                            <div className={`w-16 h-4 rounded ${option.preview}`} />
                                            <span>{option.label}</span>
                                          </div>
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                  <div className={`w-full h-12 rounded bg-gradient-to-r ${field.value}`} />
                                </div>
                              )}
                            />
                          </div>
                          <div>
                            <Label htmlFor="edit-tagColor">Colore Tag</Label>
                            <Input {...editForm.register("tagColor")} />
                          </div>
                          <div className="flex items-center space-x-2">
                            <Controller
                              name="isActive"
                              control={editForm.control}
                              render={({ field }) => (
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              )}
                            />
                            <Label>Visibile sul sito</Label>
                          </div>
                          <Button type="submit" className="w-full" disabled={updateMutation.isPending}>
                            {updateMutation.isPending ? "Salvataggio..." : "Salva Modifiche"}
                          </Button>
                        </form>
                      </DialogContent>
                    </Dialog>

                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => {
                        if (confirm("Sei sicuro di voler eliminare questa guida?")) {
                          deleteMutation.mutate(guide.id);
                        }
                      }}
                      data-testid={`button-delete-guide-${guide.id}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {guides.length === 0 && (
            <Card className="p-12 text-center">
              <BookOpen className="h-16 w-16 mx-auto text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">Nessuna guida presente</h3>
              <p className="text-gray-500 mb-4">Crea la tua prima guida per iniziare</p>
            </Card>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
