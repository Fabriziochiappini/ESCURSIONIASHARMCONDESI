
import { useEffect } from 'react';

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  canonicalUrl?: string;
  ogImage?: string;
  type?: 'website' | 'article';
  structuredData?: object;
}

export function SEOHead({
  title = "Si Viaggia con Desy - Escursioni a Sharm El Sheikh",
  description = "✈️ Si Viaggia con Desy - Il tuo tour operator di fiducia a Sharm El Sheikh. Escursioni Mar Rosso, safari deserto, diving, snorkeling. Esperienze uniche in Egitto.",
  keywords = "tour operator sharm, si viaggia con desy, escursioni mar rosso, safari deserto, diving sharm, tour personalizzati",
  canonicalUrl = "https://siviaggiacondesy.com/",
  ogImage = "/attached_assets/si_viaggia_con_desy_logo-removebg-preview_1761318900270_1764772501378.png",
  type = "website",
  structuredData
}: SEOHeadProps) {
  
  useEffect(() => {
    // Update title
    document.title = title;
    
    // Update meta tags
    updateMetaTag('description', description);
    updateMetaTag('keywords', keywords);
    updateMetaTag('robots', 'index, follow');
    
    // Update Open Graph tags
    updateMetaTag('og:title', title, 'property');
    updateMetaTag('og:description', description, 'property');
    updateMetaTag('og:url', canonicalUrl, 'property');
    updateMetaTag('og:image', ogImage, 'property');
    updateMetaTag('og:type', type, 'property');
    
    // Update Twitter tags
    updateMetaTag('twitter:title', title, 'property');
    updateMetaTag('twitter:description', description, 'property');
    updateMetaTag('twitter:url', canonicalUrl, 'property');
    updateMetaTag('twitter:image', ogImage, 'property');
    
    // Update canonical URL
    updateCanonicalUrl(canonicalUrl);
    
    // Update structured data if provided
    if (structuredData) {
      updateStructuredData(structuredData);
    }
  }, [title, description, keywords, canonicalUrl, ogImage, type, structuredData]);

  return null;
}

function updateMetaTag(name: string, content: string, type: 'name' | 'property' = 'name') {
  let meta = document.querySelector(`meta[${type}="${name}"]`);
  if (!meta) {
    meta = document.createElement('meta');
    meta.setAttribute(type, name);
    document.head.appendChild(meta);
  }
  meta.setAttribute('content', content);
}

function updateCanonicalUrl(url: string) {
  let canonical = document.querySelector('link[rel="canonical"]');
  if (!canonical) {
    canonical = document.createElement('link');
    canonical.setAttribute('rel', 'canonical');
    document.head.appendChild(canonical);
  }
  canonical.setAttribute('href', url);
}

function updateStructuredData(data: object) {
  let script = document.querySelector('script[type="application/ld+json"]#dynamic-structured-data');
  if (!script) {
    script = document.createElement('script');
    script.setAttribute('type', 'application/ld+json');
    script.setAttribute('id', 'dynamic-structured-data');
    document.head.appendChild(script);
  }
  script.textContent = JSON.stringify(data);
}
