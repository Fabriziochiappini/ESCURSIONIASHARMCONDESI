import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Link } from "wouter";
import { 
  Calendar, 
  Clock, 
  ArrowRight, 
  TrendingUp, 
  Search,
  Filter,
  User,
  Eye
} from "lucide-react";
import { useState } from "react";

const newsArticles = [
  {
    id: 1,
    title: "Mercato Immobiliare Acireale: Trend 2025",
    excerpt: "Analisi completa del mercato immobiliare di Acireale per il 2025. Prezzi in crescita del 8% rispetto al 2024 con particolare interesse per le zone centrali e residenziali. Il mercato mostra una forte ripresa post-pandemia con investimenti in crescita.",
    image: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
    category: "Mercato",
    date: "15 Gennaio 2025",
    readTime: "5 min",
    author: "Marco Rossi",
    views: "1,234",
    featured: true
  },
  {
    id: 2,
    title: "Nuove Opportunità di Investimento in Sicilia",
    excerpt: "La Sicilia si conferma meta ideale per investimenti immobiliari. Scopri le zone più promettenti e i rendimenti attesi per il 2025. Focus su turismo sostenibile e case vacanze.",
    image: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
    category: "Investimenti",
    date: "12 Gennaio 2025",
    readTime: "7 min",
    author: "Laura Bianchi",
    views: "892",
    featured: false
  },
  {
    id: 3,
    title: "Guida all'Acquisto della Prima Casa",
    excerpt: "Tutto quello che devi sapere per acquistare la tua prima casa: dai documenti necessari ai finanziamenti disponibili. Consigli pratici per evitare errori comuni.",
    image: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
    category: "Guide",
    date: "8 Gennaio 2025",
    readTime: "10 min",
    author: "Giuseppe Verdi",
    views: "2,156",
    featured: false
  },
  {
    id: 4,
    title: "Ristrutturazioni e Bonus Casa 2025",
    excerpt: "Aggiornamenti sui bonus casa e ristrutturazioni per il 2025. Come sfruttare al meglio gli incentivi statali disponibili e le nuove opportunità di detrazione.",
    image: "https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
    category: "Normative",
    date: "5 Gennaio 2025",
    readTime: "6 min",
    author: "Anna Russo",
    views: "1,567",
    featured: false
  },
  {
    id: 5,
    title: "Smart Home: Il Futuro dell'Abitare",
    excerpt: "Come la tecnologia sta trasformando le nostre case. Dalle soluzioni domotiche ai sistemi di sicurezza avanzati: tutto quello che c'è da sapere sulle case intelligenti.",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
    category: "Tecnologia",
    date: "2 Gennaio 2025",
    readTime: "8 min",
    author: "Luca Ferrari",
    views: "745",
    featured: false
  },
  {
    id: 6,
    title: "Efficienza Energetica: Valorizza la Tua Casa",
    excerpt: "L'importanza dell'efficienza energetica nel mercato immobiliare moderno. Come gli interventi di riqualificazione possono aumentare il valore della tua proprietà.",
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
    category: "Sostenibilità",
    date: "30 Dicembre 2024",
    readTime: "6 min",
    author: "Sofia Greco",
    views: "934",
    featured: false
  }
];

const categories = ["Tutti", "Mercato", "Investimenti", "Guide", "Normative", "Tecnologia", "Sostenibilità"];

export default function News() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Tutti");

  const filteredArticles = newsArticles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "Tutti" || article.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const featuredArticle = newsArticles.find(article => article.featured);
  const otherArticles = filteredArticles.filter(article => !article.featured);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Mercato": return "bg-blue-500";
      case "Investimenti": return "bg-green-500";
      case "Guide": return "bg-purple-500";
      case "Normative": return "bg-orange-500";
      case "Tecnologia": return "bg-indigo-500";
      case "Sostenibilità": return "bg-emerald-500";
      default: return "bg-gray-500";
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      
      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-br from-purple-600 to-blue-600 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              News & Insights
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto opacity-90">
              Rimani sempre aggiornato sulle ultime tendenze del mercato immobiliare, 
              normative e consigli per i tuoi investimenti.
            </p>
          </div>
        </section>

        {/* Search and Filters */}
        <section className="py-12 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  placeholder="Cerca articoli..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 h-12 rounded-xl border-gray-200"
                />
              </div>
              
              <div className="flex flex-wrap gap-3">
                {categories.map((category) => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? "default" : "outline"}
                    onClick={() => setSelectedCategory(category)}
                    className={`rounded-full px-4 py-2 ${
                      selectedCategory === category 
                        ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white" 
                        : "hover:bg-purple-50 hover:border-purple-200"
                    }`}
                  >
                    {category}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Featured Article */}
        {featuredArticle && selectedCategory === "Tutti" && (
          <section className="py-12 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Articolo in Evidenza</h2>
                <div className="w-24 h-1 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full"></div>
              </div>
              
              <Card className="glass-card rounded-3xl overflow-hidden border-0 shadow-2xl">
                <div className="grid grid-cols-1 lg:grid-cols-2">
                  <div className="relative h-64 lg:h-auto">
                    <div 
                      className="absolute inset-0 bg-cover bg-center"
                      style={{ backgroundImage: `url('${featuredArticle.image}')` }}
                    />
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-red-500 text-white">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        In Evidenza
                      </Badge>
                    </div>
                  </div>
                  <CardContent className="p-8 lg:p-12">
                    <div className="flex items-center space-x-4 mb-4">
                      <Badge className={`${getCategoryColor(featuredArticle.category)} text-white`}>
                        {featuredArticle.category}
                      </Badge>
                      <div className="flex items-center text-sm text-gray-600">
                        <Calendar className="h-4 w-4 mr-1" />
                        {featuredArticle.date}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Clock className="h-4 w-4 mr-1" />
                        {featuredArticle.readTime}
                      </div>
                    </div>
                    <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">
                      {featuredArticle.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed mb-6">
                      {featuredArticle.excerpt}
                    </p>
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center">
                        <User className="h-4 w-4 text-gray-400 mr-2" />
                        <span className="text-sm text-gray-600">{featuredArticle.author}</span>
                      </div>
                      <div className="flex items-center">
                        <Eye className="h-4 w-4 text-gray-400 mr-2" />
                        <span className="text-sm text-gray-600">{featuredArticle.views} visualizzazioni</span>
                      </div>
                    </div>
                    <Link href={`/news/${featuredArticle.id}`}>
                      <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-xl">
                        Leggi l'Articolo Completo
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </CardContent>
                </div>
              </Card>
            </div>
          </section>
        )}

        {/* Articles Grid */}
        <section className="py-12 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                {selectedCategory === "Tutti" ? "Tutti gli Articoli" : `Categoria: ${selectedCategory}`}
              </h2>
              <p className="text-gray-600">
                {filteredArticles.length} articoli trovati
              </p>
            </div>

            {filteredArticles.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {otherArticles.map((article) => (
                  <Card key={article.id} className="news-card glass-card rounded-3xl overflow-hidden border-0 group hover:shadow-xl transition-all duration-500">
                    <div className="relative h-48 overflow-hidden">
                      <div 
                        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                        style={{ backgroundImage: `url('${article.image}')` }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                      <div className="absolute top-4 left-4">
                        <Badge className={`${getCategoryColor(article.category)} text-white`}>
                          {article.category}
                        </Badge>
                      </div>
                    </div>
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-4 mb-3 text-sm text-gray-600">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          {article.date}
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          {article.readTime}
                        </div>
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-purple-600 transition-colors line-clamp-2">
                        {article.title}
                      </h3>
                      <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3">
                        {article.excerpt}
                      </p>
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center">
                          <User className="h-4 w-4 text-gray-400 mr-1" />
                          <span className="text-sm text-gray-600">{article.author}</span>
                        </div>
                        <div className="flex items-center">
                          <Eye className="h-4 w-4 text-gray-400 mr-1" />
                          <span className="text-sm text-gray-600">{article.views}</span>
                        </div>
                      </div>
                      <Link href={`/news/${article.id}`}>
                        <Button variant="outline" className="w-full rounded-xl group-hover:bg-purple-50 group-hover:border-purple-200">
                          Leggi di Più
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Search className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Nessun articolo trovato</h3>
                <p className="text-gray-600 mb-6">Prova a modificare i termini di ricerca o la categoria</p>
                <Button 
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedCategory("Tutti");
                  }}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-xl"
                >
                  Mostra Tutti gli Articoli
                </Button>
              </div>
            )}
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}