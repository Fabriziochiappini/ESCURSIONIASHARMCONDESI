import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Pencil, Trash2, ArrowLeft, Check, X } from "lucide-react";
import { Link } from "wouter";
import type { Addon } from "@shared/schema";

export default function AdminAddons() {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [editingAddon, setEditingAddon] = useState<Addon | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    isActive: true,
    sortOrder: 0,
  });

  const { data: addons = [], isLoading } = useQuery<Addon[]>({
    queryKey: ["/api/addons"],
  });

  const createMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      return apiRequest("POST", "/api/addons", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/addons"] });
      toast({ title: "Servizio creato con successo" });
      resetForm();
      setIsOpen(false);
    },
    onError: () => {
      toast({ title: "Errore nella creazione", variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: typeof formData }) => {
      return apiRequest("PUT", `/api/addons/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/addons"] });
      toast({ title: "Servizio aggiornato con successo" });
      resetForm();
      setIsOpen(false);
    },
    onError: () => {
      toast({ title: "Errore nell'aggiornamento", variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      return apiRequest("DELETE", `/api/addons/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/addons"] });
      toast({ title: "Servizio eliminato con successo" });
    },
    onError: () => {
      toast({ title: "Errore nell'eliminazione", variant: "destructive" });
    },
  });

  const toggleActiveMutation = useMutation({
    mutationFn: async ({ id, isActive }: { id: number; isActive: boolean }) => {
      return apiRequest("PUT", `/api/addons/${id}`, { isActive });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/addons"] });
    },
  });

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      price: "",
      isActive: true,
      sortOrder: 0,
    });
    setEditingAddon(null);
  };

  const handleEdit = (addon: Addon) => {
    setEditingAddon(addon);
    setFormData({
      name: addon.name,
      description: addon.description || "",
      price: addon.price,
      isActive: addon.isActive ?? true,
      sortOrder: addon.sortOrder ?? 0,
    });
    setIsOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingAddon) {
      updateMutation.mutate({ id: editingAddon.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleDelete = (id: number) => {
    if (confirm("Sei sicuro di voler eliminare questo servizio?")) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="pb-20">
        <div className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Link href="/admin">
                  <Button variant="ghost" size="sm">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Indietro
                  </Button>
                </Link>
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                    Gestione Servizi
                  </h1>
                  <p className="text-gray-600 mt-1 text-sm sm:text-base">
                    Crea e gestisci servizi extra da associare ai tour
                  </p>
                </div>
              </div>

              <Dialog open={isOpen} onOpenChange={(open) => {
                setIsOpen(open);
                if (!open) resetForm();
              }}>
                <DialogTrigger asChild>
                  <Button className="bg-amber-600 hover:bg-amber-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Nuovo Servizio
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>
                      {editingAddon ? "Modifica Servizio" : "Nuovo Servizio"}
                    </DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <Label htmlFor="name">Nome</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="es. Aggiungi cena"
                        required
                        data-testid="input-addon-name"
                      />
                    </div>

                    <div>
                      <Label htmlFor="description">Descrizione (opzionale)</Label>
                      <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        placeholder="Descrizione del servizio"
                        data-testid="input-addon-description"
                      />
                    </div>

                    <div>
                      <Label htmlFor="price">Prezzo (€)</Label>
                      <Input
                        id="price"
                        type="number"
                        step="0.01"
                        min="0"
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                        placeholder="25.00"
                        required
                        data-testid="input-addon-price"
                      />
                    </div>

                    <div>
                      <Label htmlFor="sortOrder">Ordine</Label>
                      <Input
                        id="sortOrder"
                        type="number"
                        value={formData.sortOrder}
                        onChange={(e) => setFormData({ ...formData, sortOrder: parseInt(e.target.value) || 0 })}
                        data-testid="input-addon-sortOrder"
                      />
                    </div>

                    <div className="flex items-center gap-2">
                      <Switch
                        id="isActive"
                        checked={formData.isActive}
                        onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                        data-testid="switch-addon-active"
                      />
                      <Label htmlFor="isActive">Attivo</Label>
                    </div>

                    <div className="flex gap-2 justify-end">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setIsOpen(false);
                          resetForm();
                        }}
                      >
                        Annulla
                      </Button>
                      <Button
                        type="submit"
                        className="bg-amber-600 hover:bg-amber-700"
                        disabled={createMutation.isPending || updateMutation.isPending}
                        data-testid="button-save-addon"
                      >
                        {createMutation.isPending || updateMutation.isPending
                          ? "Salvataggio..."
                          : editingAddon
                          ? "Aggiorna"
                          : "Crea"}
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card>
            <CardHeader>
              <CardTitle>Lista Servizi</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <p className="text-center py-8 text-gray-500">Caricamento...</p>
              ) : addons.length === 0 ? (
                <p className="text-center py-8 text-gray-500">
                  Nessun servizio creato. Crea il primo servizio cliccando "Nuovo Servizio".
                </p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead>Descrizione</TableHead>
                      <TableHead>Prezzo</TableHead>
                      <TableHead>Attivo</TableHead>
                      <TableHead>Ordine</TableHead>
                      <TableHead className="text-right">Azioni</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {addons.map((addon) => (
                      <TableRow key={addon.id} data-testid={`row-addon-${addon.id}`}>
                        <TableCell className="font-medium">{addon.name}</TableCell>
                        <TableCell className="max-w-[200px] truncate">
                          {addon.description || "-"}
                        </TableCell>
                        <TableCell className="font-semibold text-amber-700">
                          €{parseFloat(addon.price).toFixed(2)}
                        </TableCell>
                        <TableCell>
                          <Switch
                            checked={addon.isActive ?? true}
                            onCheckedChange={(checked) =>
                              toggleActiveMutation.mutate({ id: addon.id, isActive: checked })
                            }
                            data-testid={`switch-active-${addon.id}`}
                          />
                        </TableCell>
                        <TableCell>{addon.sortOrder ?? 0}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex gap-2 justify-end">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEdit(addon)}
                              data-testid={`button-edit-${addon.id}`}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(addon.id)}
                              className="text-red-600 hover:text-red-700"
                              data-testid={`button-delete-${addon.id}`}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Come funziona</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-gray-600">
              <p>1. <strong>Crea un servizio</strong> con nome e prezzo (es. "Aggiungi cena" €25)</p>
              <p>2. <strong>Associa i servizi ai tour</strong> dall'editor del singolo tour</p>
              <p>3. <strong>I clienti vedranno</strong> i servizi nella pagina dettaglio del tour</p>
              <p>4. <strong>Il prezzo del servizio</strong> si aggiunge automaticamente al totale nel carrello</p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
