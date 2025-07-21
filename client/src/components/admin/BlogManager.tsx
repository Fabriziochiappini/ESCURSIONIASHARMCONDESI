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
  Calendar,
  Clock,
  User,
  FileText as FileTextIcon
} from "lucide-react";
import type { BlogPost, InsertBlogPost } from "@shared/schema";
import { isUnauthorizedError } from "@/lib/authUtils";

interface BlogFormData extends Omit<InsertBlogPost, 'tags'> {
  tags: string;
}

const initialFormData: BlogFormData = {
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  featuredImage: "",
  category: "",
  tags: "",
  published: false,
  featured: false,
  authorId: "",
  readTime: 5,
  metaDescription: "",
  metaKeywords: "",
};

const categories = [
  "Mercato",
  "Investimenti", 
  "Guide",
  "Normative",
  "Tecnologia",
  "Sostenibilità",
  "News",
  "Consigli"
];

export function BlogManager() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [formData, setFormData] = useState<BlogFormData>(initialFormData);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: posts = [], isLoading } = useQuery<BlogPost[]>({
    queryKey: ['/api/admin/blog/posts'],
  });

  const createMutation = useMutation({
    mutationFn: async (data: InsertBlogPost) => {
      return await apiRequest('/api/admin/blog/posts', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/blog/posts'] });
      queryClient.invalidateQueries({ queryKey: ['/api/blog/posts'] });
      setIsDialogOpen(false);
      resetForm();
      toast({
        title: "Successo",
        description: "Articolo creato con successo",
      });
    },
    onError: (error) => {
      toast({
        title: "Errore",
        description: "Errore nella creazione dell'articolo",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<InsertBlogPost> }) => {
      return await apiRequest(`/api/admin/blog/posts/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/blog/posts'] });
      queryClient.invalidateQueries({ queryKey: ['/api/blog/posts'] });
      setIsDialogOpen(false);
      resetForm();
      toast({
        title: "Successo",
        description: "Articolo aggiornato con successo",
      });
    },
    onError: (error) => {
      toast({
        title: "Errore",
        description: "Errore nell'aggiornamento dell'articolo",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      return await apiRequest(`/api/admin/blog/posts/${id}`, {
        method: 'DELETE',
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/blog/posts'] });
      queryClient.invalidateQueries({ queryKey: ['/api/blog/posts'] });
      toast({
        title: "Successo",
        description: "Articolo eliminato con successo",
      });
    },
    onError: (error) => {
      toast({
        title: "Errore",
        description: "Errore nell'eliminazione dell'articolo",
        variant: "destructive",
      });
    },
  });

  const resetForm = () => {
    setFormData(initialFormData);
    setEditingPost(null);
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();
  };

  const openEditDialog = (post: BlogPost) => {
    setEditingPost(post);
    setFormData({
      ...post,
      tags: Array.isArray(post.tags) ? post.tags.join(', ') : '',
      authorId: post.authorId || '',
      metaDescription: post.metaDescription || '',
      metaKeywords: post.metaKeywords || '',
    });
    setIsDialogOpen(true);
  };

  const handleTitleChange = (title: string) => {
    setFormData(prev => ({
      ...prev,
      title,
      slug: prev.slug || generateSlug(title)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const postData: InsertBlogPost = {
      ...formData,
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
      slug: formData.slug || generateSlug(formData.title),
    };

    // Remove authorId from the data if editing (it shouldn't change)
    if (editingPost) {
      delete postData.authorId;
      updateMutation.mutate({ id: editingPost.id, data: postData });
    } else {
      createMutation.mutate(postData);
    }
  };

  const handleDelete = (id: number) => {
    if (confirm('Sei sicuro di voler eliminare questo articolo?')) {
      deleteMutation.mutate(id);
    }
  };

  const formatDate = (dateString: string | Date | null) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('it-IT', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Mercato": return "bg-blue-100 text-blue-800";
      case "Investimenti": return "bg-green-100 text-green-800";
      case "Guide": return "bg-purple-100 text-purple-800";
      case "Normative": return "bg-orange-100 text-orange-800";
      case "Tecnologia": return "bg-indigo-100 text-indigo-800";
      case "Sostenibilità": return "bg-emerald-100 text-emerald-800";
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
        <h2 className="text-2xl font-bold text-gray-900">Gestione Blog</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="h-4 w-4 mr-2" />
              Nuovo Articolo
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingPost ? 'Modifica Articolo' : 'Nuovo Articolo'}
              </DialogTitle>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Titolo *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="slug">Slug URL *</Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                  required
                  placeholder="url-friendly-title"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="excerpt">Riassunto *</Label>
                <Textarea
                  id="excerpt"
                  value={formData.excerpt}
                  onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
                  rows={3}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">Contenuto *</Label>
                <Textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                  rows={12}
                  required
                  placeholder="Scrivi qui il contenuto dell'articolo usando Markdown..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Categoria *</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(cat => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="readTime">Tempo di lettura (minuti)</Label>
                  <Input
                    id="readTime"
                    type="number"
                    min="1"
                    value={formData.readTime}
                    onChange={(e) => setFormData(prev => ({ ...prev, readTime: parseInt(e.target.value) }))}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="featuredImage">Immagine in evidenza (URL)</Label>
                <Input
                  id="featuredImage"
                  value={formData.featuredImage || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, featuredImage: e.target.value }))}
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tags">Tag (separati da virgola)</Label>
                <Input
                  id="tags"
                  value={formData.tags}
                  onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
                  placeholder="immobiliare, acireale, investimenti"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="metaDescription">Meta Description (SEO)</Label>
                <Textarea
                  id="metaDescription"
                  value={formData.metaDescription || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, metaDescription: e.target.value }))}
                  rows={2}
                  maxLength={160}
                  placeholder="Descrizione che apparirà nei risultati di ricerca (max 160 caratteri)"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="metaKeywords">Meta Keywords (SEO)</Label>
                <Input
                  id="metaKeywords"
                  value={formData.metaKeywords || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, metaKeywords: e.target.value }))}
                  placeholder="keyword1, keyword2, keyword3"
                />
              </div>

              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="published"
                    checked={formData.published}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, published: !!checked }))}
                  />
                  <Label htmlFor="published">Pubblicato</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="featured"
                    checked={formData.featured}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, featured: !!checked }))}
                  />
                  <Label htmlFor="featured">In evidenza</Label>
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Annulla
                </Button>
                <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                  {createMutation.isPending || updateMutation.isPending ? 'Salvando...' : 'Salva'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Posts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {posts.map((post) => (
          <Card key={post.id} className="group hover:shadow-lg transition-shadow">
            <div className="relative">
              {post.featuredImage && (
                <div className="aspect-video overflow-hidden rounded-t-lg">
                  <img 
                    src={post.featuredImage} 
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              )}
              
              <div className="absolute top-2 left-2 flex gap-2">
                <Badge className={getCategoryColor(post.category)}>
                  {post.category}
                </Badge>
                {post.featured && (
                  <Badge className="bg-yellow-500 text-yellow-900">
                    In evidenza
                  </Badge>
                )}
                {!post.published && (
                  <Badge variant="secondary">
                    Bozza
                  </Badge>
                )}
              </div>
            </div>
            
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-2">
                {post.title}
              </h3>
              
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                {post.excerpt}
              </p>
              
              <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    {formatDate(post.createdAt)}
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    {post.readTime} min
                  </div>
                  {post.views > 0 && (
                    <div className="flex items-center">
                      <Eye className="h-4 w-4 mr-1" />
                      {post.views}
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-500">
                  {post.published ? (
                    <span className="text-green-600 font-medium">Pubblicato</span>
                  ) : (
                    <span className="text-yellow-600 font-medium">Bozza</span>
                  )}
                </div>
                <div className="flex space-x-1">
                  <Button size="sm" variant="outline" asChild>
                    <a href={`/news/${post.slug}`} target="_blank">
                      <Eye className="h-4 w-4" />
                    </a>
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => openEditDialog(post)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => handleDelete(post.id)}
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

      {posts.length === 0 && (
        <div className="text-center py-12">
          <FileTextIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">Nessun articolo trovato. Inizia creandone uno nuovo!</p>
        </div>
      )}
    </div>
  );
}