import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { SEOHead } from "@/components/seo-head";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, BookOpen } from "lucide-react";
import { Link } from "wouter";
import type { Guide } from "@shared/schema";

export default function GuideDetail() {
  const params = useParams<{ id: string }>();
  const guideId = parseInt(params.id || "0");

  const { data: guide, isLoading, error } = useQuery<Guide>({
    queryKey: ["/api/guides", guideId],
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="pt-24 pb-12 flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Caricamento guida...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !guide) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="pt-24 pb-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <Card className="p-12 text-center">
              <BookOpen className="h-16 w-16 mx-auto text-gray-400 mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Guida non trovata</h2>
              <p className="text-gray-600 mb-6">La guida che stai cercando non esiste o è stata rimossa.</p>
              <Link href="/">
                <a className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold">
                  <ArrowLeft className="h-4 w-4" />
                  Torna alla Home
                </a>
              </Link>
            </Card>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <SEOHead 
        title={`${guide.title} - ${guide.subtitle} | UNCONVENTIONAL TOUR`}
        description={guide.description}
        keywords={`${guide.category}, guida viaggio, ${guide.title}, unconventional tour`}
      />
      <Navigation />
      
      <main className="pt-24 pb-12">
        {/* Hero Section con Gradiente */}
        <section className={`bg-gradient-to-r ${guide.gradient} py-20 relative overflow-hidden`}>
          <div className="absolute inset-0 opacity-20">
            <div className="absolute inset-0 bg-black"></div>
          </div>
          
          <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <Link href="/">
              <a className="inline-flex items-center gap-2 text-white/90 hover:text-white mb-8 transition-colors" data-testid="link-back-home">
                <ArrowLeft className="h-5 w-5" />
                Torna alla Home
              </a>
            </Link>

            <div className="mb-8">
              <span className={`inline-block px-6 py-3 bg-white text-${guide.tagColor} font-black text-sm uppercase tracking-wider`}>
                {guide.category}
              </span>
            </div>

            <h1 className="text-5xl lg:text-7xl font-black text-white mb-6 leading-tight" data-testid="text-guide-title">
              {guide.title}
            </h1>
            
            <p className="text-2xl lg:text-3xl text-white/90 font-bold mb-8" data-testid="text-guide-subtitle">
              {guide.subtitle}
            </p>
          </div>
        </section>

        {/* Immagine Hero */}
        {guide.imageUrl && (
          <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-20">
            <div className="rounded-2xl overflow-hidden shadow-2xl">
              <img 
                src={guide.imageUrl}
                alt={guide.subtitle}
                className="w-full h-[400px] lg:h-[500px] object-cover"
                onError={(e) => {
                  e.currentTarget.src = 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1200&h=600&fit=crop';
                }}
                data-testid="img-guide-hero"
              />
            </div>
          </section>
        )}

        {/* Contenuto della Guida */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
          <Card>
            <CardContent className="p-8 lg:p-12">
              <div className="prose prose-lg max-w-none">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">Contenuto della Guida</h2>
                <div className="text-gray-700 leading-relaxed whitespace-pre-wrap" data-testid="text-guide-description">
                  {guide.description}
                </div>
              </div>

              {/* CTA Bottom */}
              <div className="mt-12 pt-8 border-t border-gray-200">
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-8 text-center">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    Vuoi saperne di più?
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Contattaci per ricevere ulteriori informazioni personalizzate
                  </p>
                  <a 
                    href="https://wa.me/393427854491?text=Ciao! Vorrei informazioni sulla guida: {guide.title}"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block bg-green-500 text-white px-8 py-4 rounded-lg font-bold hover:bg-green-600 transition-colors"
                    data-testid="button-contact-whatsapp"
                  >
                    📱 Contattaci su WhatsApp
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* CTA Torna alle Guide */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
          <div className="text-center">
            <Link href="/">
              <a className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold text-lg" data-testid="link-back-guides">
                <ArrowLeft className="h-5 w-5" />
                Torna a tutte le guide
              </a>
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
