import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { Calendar, Clock, ArrowRight, TrendingUp } from "lucide-react";

const newsArticles = [
  {
    id: 1,
    title: "Mercato Immobiliare Acireale: Trend 2025",
    excerpt: "Analisi completa del mercato immobiliare di Acireale per il 2025. Prezzi in crescita del 8% rispetto al 2024 con particolare interesse per le zone centrali.",
    image: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
    category: "Mercato",
    date: "15 Gennaio 2025",
    readTime: "5 min",
    featured: true
  },
  {
    id: 2,
    title: "Nuove Opportunità di Investimento in Sicilia",
    excerpt: "La Sicilia si conferma meta ideale per investimenti immobiliari. Scopri le zone più promettenti e i rendimenti attesi per il 2025.",
    image: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
    category: "Investimenti",
    date: "12 Gennaio 2025",
    readTime: "7 min",
    featured: false
  },
  {
    id: 3,
    title: "Guida all'Acquisto della Prima Casa",
    excerpt: "Tutto quello che devi sapere per acquistare la tua prima casa: dai documenti necessari ai finanziamenti disponibili.",
    image: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
    category: "Guide",
    date: "8 Gennaio 2025",
    readTime: "10 min",
    featured: false
  },
  {
    id: 4,
    title: "Ristrutturazioni e Bonus Casa 2025",
    excerpt: "Aggiornamenti sui bonus casa e ristrutturazioni per il 2025. Come sfruttare al meglio gli incentivi statali disponibili.",
    image: "https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
    category: "Normative",
    date: "5 Gennaio 2025",
    readTime: "6 min",
    featured: false
  }
];

export function NewsSection() {
  const featuredArticle = newsArticles.find(article => article.featured);
  const otherArticles = newsArticles.filter(article => !article.featured);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Mercato": return "bg-blue-500";
      case "Investimenti": return "bg-green-500";
      case "Guide": return "bg-purple-500";
      case "Normative": return "bg-orange-500";
      default: return "bg-gray-500";
    }
  };

  return (
    <section id="news" className="py-20 bg-gradient-to-br from-purple-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            News & 
            <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent"> Insights</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Rimani aggiornato sulle ultime tendenze del mercato immobiliare, 
            normative e consigli per i tuoi investimenti immobiliari.
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-purple-500 to-blue-500 mx-auto mt-8 rounded-full"></div>
        </div>

        {/* Featured Article */}
        {featuredArticle && (
          <div className="mb-12">
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
                  <Link href={`/news/${featuredArticle.id}`}>
                    <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-xl">
                      Leggi l'Articolo
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </CardContent>
              </div>
            </Card>
          </div>
        )}

        {/* Other Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
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

        <div className="text-center">
          <Link href="/news">
            <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-xl px-8 py-3 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              Visualizza Tutte le News
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}