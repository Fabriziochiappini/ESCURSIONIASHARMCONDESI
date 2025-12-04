import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Footer } from "@/components/footer";
import { isAuthValid } from "@/lib/adminAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Plus, Trash2, Upload, Image as ImageIcon, ArrowLeft } from "lucide-react";
import { Link } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const gallerySchema = z.object({
  title: z.string().min(1, "Titolo obbligatorio"),
  description: z.string().optional(),
});

type GalleryFormData = z.infer<typeof gallerySchema>;

export default function AdminGalleries() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingGallery, setEditingGallery] = useState<any>(null);
  const [uploadingFor, setUploadingFor] = useState<number | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);

  useEffect(() => {
    if (!isAuthValid()) {
      setLocation("/admin");
    }
  }, [setLocation]);

  const { data: galleries = [], isLoading } = useQuery<any[]>({
    queryKey: ["/api/galleries"],
  });

  const createForm = useForm<GalleryFormData>({
    resolver: zodResolver(gallerySchema),
    defaultValues: { title: "", description: "" },
  });

  const editForm = useForm<GalleryFormData>({
    resolver: zodResolver(gallerySchema),
  });

  const createMutation = useMutation({
    mutationFn: (data: GalleryFormData) => apiRequest("POST", "/api/admin/galleries", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/galleries"] });
      setIsCreateOpen(false);
      createForm.reset();
      toast({ title: "Galleria creata con successo!" });
    },
    onError: () => {
      toast({ title: "Errore nella creazione della galleria", variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: GalleryFormData }) =>
      apiRequest("PUT", `/api/admin/galleries/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/galleries"] });
      setEditingGallery(null);
      toast({ title: "Galleria aggiornata con successo!" });
    },
    onError: () => {
      toast({ title: "Errore nell'aggiornamento della galleria", variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => apiRequest("DELETE", `/api/admin/galleries/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/galleries"] });
      toast({ title: "Galleria eliminata con successo!" });
    },
    onError: () => {
      toast({ title: "Errore nell'eliminazione della galleria", variant: "destructive" });
    },
  });

  const uploadMutation = useMutation({
    mutationFn: async ({ galleryId, files }: { galleryId: number; files: FileList }) => {
      const formData = new FormData();
      Array.from(files).forEach((file) => {
        formData.append("images", file);
      });

      const response = await fetch(`/api/admin/galleries/${galleryId}/images`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Upload failed");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/galleries"] });
      setUploadingFor(null);
      setSelectedFiles(null);
      toast({ title: "Immagini caricate con successo!" });
    },
    onError: () => {
      toast({ title: "Errore nel caricamento delle immagini", variant: "destructive" });
    },
  });

  const deleteImageMutation = useMutation({
    mutationFn: (imageId: number) => apiRequest("DELETE", `/api/admin/galleries/images/${imageId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/galleries"] });
      toast({ title: "Immagine eliminata con successo!" });
    },
    onError: () => {
      toast({ title: "Errore nell'eliminazione dell'immagine", variant: "destructive" });
    },
  });

  const handleCreateSubmit = createForm.handleSubmit((data) => {
    createMutation.mutate(data);
  });

  const handleEditSubmit = editForm.handleSubmit((data) => {
    if (editingGallery) {
      updateMutation.mutate({ id: editingGallery.id, data });
    }
  });

  const handleUpload = () => {
    if (uploadingFor && selectedFiles) {
      uploadMutation.mutate({ galleryId: uploadingFor, files: selectedFiles });
    }
  };

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Caricamento...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-4">
              <Link href="/admin">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Indietro
                </Button>
              </Link>
              <h1 className="text-4xl font-bold text-gray-900">Gestione Gallerie</h1>
            </div>
            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
              <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Nuova Galleria
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Crea Nuova Galleria</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleCreateSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="title">Titolo</Label>
                    <Input {...createForm.register("title")} placeholder="Es: Vacanze Estate 2025" />
                    {createForm.formState.errors.title && (
                      <p className="text-red-600 text-sm mt-1">{createForm.formState.errors.title.message}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="description">Descrizione</Label>
                    <Textarea {...createForm.register("description")} placeholder="Descrizione della galleria..." rows={3} />
                  </div>
                  <Button type="submit" className="w-full" disabled={createMutation.isPending}>
                    {createMutation.isPending ? "Creazione..." : "Crea Galleria"}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {galleries.map((gallery: any) => (
              <Card key={gallery.id} className="overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                  <CardTitle className="text-xl">{gallery.title}</CardTitle>
                  <p className="text-sm text-white/80">{gallery.description || "Nessuna descrizione"}</p>
                </CardHeader>
                <CardContent className="p-4 space-y-4">
                  {/* Contatore foto */}
                  <div className="text-sm text-gray-600 font-medium">
                    📸 {gallery.images?.length || 0} foto nella galleria
                  </div>

                  {/* Immagini della galleria */}
                  {gallery.images && gallery.images.length > 0 ? (
                    <div className="grid grid-cols-4 gap-2 max-h-60 overflow-y-auto border rounded p-2">
                      {gallery.images.map((img: any) => {
                        const imageUrl = img.imageUrl.replace('/public-objects/', '/api/images/');
                        return (
                        <div key={img.id} className="relative group">
                          <img
                            src={imageUrl}
                            alt={`Foto ${img.id}`}
                            className="w-full h-20 object-cover rounded border-2 border-gray-200"
                            onError={(e) => {
                              console.error('Errore caricamento immagine:', imageUrl);
                              e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect fill="%23ddd" width="100" height="100"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%23999"%3EErrore%3C/text%3E%3C/svg%3E';
                            }}
                          />
                          <button
                            onClick={() => {
                              if (confirm('Eliminare questa foto?')) {
                                deleteImageMutation.mutate(img.id);
                              }
                            }}
                            className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-bl opacity-0 group-hover:opacity-100 transition-opacity"
                            title="Elimina foto"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-8 bg-gray-50 rounded border-2 border-dashed">
                      <ImageIcon className="h-12 w-12 mx-auto text-gray-400 mb-2" />
                      <p className="text-gray-500">Nessuna foto caricata</p>
                    </div>
                  )}

                  {/* Upload nuove immagini */}
                  {uploadingFor === gallery.id ? (
                    <div className="space-y-2">
                      <Input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={(e) => setSelectedFiles(e.target.files)}
                        disabled={uploadMutation.isPending}
                      />
                      {selectedFiles && (
                        <p className="text-sm text-gray-600">
                          {selectedFiles.length} {selectedFiles.length === 1 ? 'foto selezionata' : 'foto selezionate'}
                        </p>
                      )}
                      {uploadMutation.isPending && (
                        <div className="bg-blue-50 border border-blue-200 rounded p-3">
                          <div className="flex items-center gap-2">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                            <span className="text-sm text-blue-700">Caricamento in corso... Attendere prego.</span>
                          </div>
                        </div>
                      )}
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={handleUpload}
                          disabled={!selectedFiles || uploadMutation.isPending}
                          className="flex-1 bg-blue-600 hover:bg-blue-700"
                        >
                          {uploadMutation.isPending ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                              Caricamento...
                            </>
                          ) : (
                            "Carica"
                          )}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setUploadingFor(null);
                            setSelectedFiles(null);
                          }}
                          disabled={uploadMutation.isPending}
                        >
                          Annulla
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <Button
                      size="sm"
                      variant="outline"
                      className="w-full"
                      onClick={() => setUploadingFor(gallery.id)}
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Aggiungi Foto ({gallery.images?.length || 0})
                    </Button>
                  )}

                  {/* Azioni */}
                  <div className="flex gap-2">
                    <Dialog
                      open={editingGallery?.id === gallery.id}
                      onOpenChange={(open) => {
                        if (!open) setEditingGallery(null);
                        else {
                          setEditingGallery(gallery);
                          editForm.reset({
                            title: gallery.title,
                            description: gallery.description || "",
                          });
                        }
                      }}
                    >
                      <DialogTrigger asChild>
                        <Button size="sm" variant="outline" className="flex-1">
                          Modifica
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Modifica Galleria</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleEditSubmit} className="space-y-4">
                          <div>
                            <Label htmlFor="edit-title">Titolo</Label>
                            <Input {...editForm.register("title")} />
                          </div>
                          <div>
                            <Label htmlFor="edit-description">Descrizione</Label>
                            <Textarea {...editForm.register("description")} rows={3} />
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
                        if (confirm("Sei sicuro di voler eliminare questa galleria?")) {
                          deleteMutation.mutate(gallery.id);
                        }
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {galleries.length === 0 && (
            <Card className="p-12 text-center">
              <ImageIcon className="h-16 w-16 mx-auto text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">Nessuna galleria presente</h3>
              <p className="text-gray-500 mb-4">Crea la tua prima galleria per iniziare</p>
            </Card>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
