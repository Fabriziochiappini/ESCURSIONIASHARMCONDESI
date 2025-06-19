import { properties, type Property, type InsertProperty, type SearchFilters } from "@shared/schema";

export interface IStorage {
  getAllProperties(): Promise<Property[]>;
  getProperty(id: number): Promise<Property | undefined>;
  searchProperties(filters: SearchFilters): Promise<Property[]>;
  getFeaturedProperties(): Promise<Property[]>;
  createProperty(property: InsertProperty): Promise<Property>;
}

export class MemStorage implements IStorage {
  private properties: Map<number, Property>;
  private currentId: number;

  constructor() {
    this.properties = new Map();
    this.currentId = 1;
    this.initializeData();
  }

  private initializeData() {
    const mockProperties: InsertProperty[] = [
      // Featured Properties
      {
        title: "Villa di Lusso con Vista Mare",
        description: "Splendida villa moderna completamente ristrutturata con vista panoramica sul mare e sull'Etna. La proprietà dispone di ampi spazi luminosi, cucina abitabile di design, quattro camere da letto spaziose e tre bagni eleganti. Il giardino privato di 200 mq include una piscina e una zona barbecue perfetta per il relax. Finiture di pregio, impianti moderni e classe energetica A. Posizione strategica a soli 5 minuti dal centro storico di Acireale e dalle principali spiagge.",
        price: "480000",
        type: "vendita",
        priceType: "total",
        location: "Acireale Centro",
        municipality: "Acireale",
        address: "Via Roma 123, Acireale",
        bedrooms: 4,
        bathrooms: 3,
        area: 180,
        images: [
          "https://images.unsplash.com/photo-1613490493576-7fde63acd811?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
          "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=800",
          "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
          "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400"
        ],
        features: ["Piscina privata", "Giardino 200 mq", "Vista mare", "Posto auto", "Aria condizionata", "Allarme"],
        youtubeVideoId: "dQw4w9WgXcQ",
        agentName: "Marco Siciliano",
        agentPhone: "+39 333 123 4567",
        agentEmail: "marco@immobiliareacireale.it",
        agentImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150",
        featured: true,
        available: true,
      },
      {
        title: "Appartamento Elegante Centro",
        description: "Moderno appartamento completamente arredato nel cuore di Aci Castello, a pochi passi dal castello normanno e dal mare. Ristrutturato con materiali di qualità e design contemporaneo.",
        price: "1200",
        type: "affitto",
        priceType: "monthly",
        location: "Aci Castello Centro",
        municipality: "Aci Castello",
        address: "Piazza del Castello 15, Aci Castello",
        bedrooms: 2,
        bathrooms: 2,
        area: 85,
        images: [
          "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
          "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
        ],
        features: ["Completamente arredato", "Castello normanno vicino", "Vista mare", "Balcone"],
        youtubeVideoId: "jNQXAC9IVRw",
        agentName: "Sofia Romano",
        agentPhone: "+39 333 987 6543",
        agentEmail: "sofia@immobiliareacireale.it",
        agentImage: "https://images.unsplash.com/photo-1494790108755-2616b612b47c?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150",
        featured: true,
        available: true,
      },
      {
        title: "Villa Tradizionale Siciliana",
        description: "Affascinante villa tradizionale con vista sull'Etna, giardino con alberi da frutto e terrazza panoramica. Ideale per vacanze indimenticabili in un ambiente autentico siciliano.",
        price: "150",
        type: "casa_vacanza",
        priceType: "nightly",
        location: "Zafferana Etnea",
        municipality: "Zafferana Etnea",
        address: "Via Etna 45, Zafferana Etnea",
        bedrooms: 3,
        bathrooms: 2,
        area: 120,
        images: [
          "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
          "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
        ],
        features: ["Vista Etna", "Giardino con alberi da frutto", "Terrazza panoramica", "Stile siciliano tradizionale"],
        youtubeVideoId: "Me-VhC9ieh0",
        agentName: "Giuseppe Catalano",
        agentPhone: "+39 333 456 7890",
        agentEmail: "giuseppe@immobiliareacireale.it",
        agentImage: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150",
        featured: true,
        available: true,
      },
      // Additional properties for larger catalog
      {
        title: "Attico con Terrazza Panoramica",
        description: "Spettacolare attico di nuova costruzione con terrazza panoramica di 80 mq, vista mozzafiato su Etna e mare. Massime prestazioni energetiche e design moderno.",
        price: "320000",
        type: "vendita",
        priceType: "total",
        location: "Santa Venerina",
        municipality: "Santa Venerina",
        address: "Via Panoramica 78, Santa Venerina",
        bedrooms: 3,
        bathrooms: 2,
        area: 140,
        images: [
          "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
          "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
        ],
        features: ["Terrazza 80 mq", "Vista Etna e mare", "Nuova costruzione", "Classe energetica A+"],
        youtubeVideoId: "5qap5aO4i9A",
        agentName: "Marco Siciliano",
        agentPhone: "+39 333 123 4567",
        agentEmail: "marco@immobiliareacireale.it",
        agentImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150",
        featured: true,
        available: true,
      },
      {
        title: "Casa Familiare con Giardino",
        description: "Accogliente casa indipendente con ampio giardino, ideale per famiglie. Zona tranquilla e ben servita dai mezzi pubblici.",
        price: "900",
        type: "affitto",
        priceType: "monthly",
        location: "Aci Catena",
        municipality: "Aci Catena",
        address: "Via delle Rose 32, Aci Catena",
        bedrooms: 3,
        bathrooms: 2,
        area: 110,
        images: [
          "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
          "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
        ],
        features: ["Giardino privato", "Casa indipendente", "Zona tranquilla", "Mezzi pubblici vicini"],
        youtubeVideoId: "lTRiuFIWV54",
        agentName: "Sofia Romano",
        agentPhone: "+39 333 987 6543",
        agentEmail: "sofia@immobiliareacireale.it",
        agentImage: "https://images.unsplash.com/photo-1494790108755-2616b612b47c?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150",
        featured: true,
        available: true,
      },
      {
        title: "Villa Rurale con Vigneto",
        description: "Magnifica villa rurale con vigneto di 2 ettari, piscina e dependance. Perfetta per chi ama la vita di campagna senza rinunciare ai comfort.",
        price: "650000",
        type: "vendita",
        priceType: "total",
        location: "Aci Sant'Antonio",
        municipality: "Aci Sant'Antonio",
        address: "Contrada Lavinaio, Aci Sant'Antonio",
        bedrooms: 5,
        bathrooms: 4,
        area: 300,
        images: [
          "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
          "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
        ],
        features: ["Vigneto 2 ettari", "Piscina", "Dependance", "Villa rurale", "Vita di campagna"],
        youtubeVideoId: "kJQP7kiw5Fk",
        agentName: "Giuseppe Catalano",
        agentPhone: "+39 333 456 7890",
        agentEmail: "giuseppe@immobiliareacireale.it",
        agentImage: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150",
        featured: true,
        available: true,
      },
      // Additional non-featured properties
      {
        title: "Loft Industriale Moderno",
        description: "Spazioso loft in ex stabilimento industriale convertito, con soffitti alti 4 metri, travi a vista e grandi vetrate. Perfetto per professionisti creativi.",
        price: "1500",
        type: "affitto",
        priceType: "monthly",
        location: "Acireale Centro",
        municipality: "Acireale",
        address: "Via Industriale 88, Acireale",
        bedrooms: 1,
        bathrooms: 2,
        area: 120,
        images: [
          "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
          "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
        ],
        features: ["Soffitti alti 4m", "Travi a vista", "Grandi vetrate", "Design industriale", "Open space"],
        youtubeVideoId: "dQw4w9WgXcQ",
        agentName: "Marco Siciliano",
        agentPhone: "+39 333 123 4567",
        agentEmail: "marco@immobiliareacireale.it",
        agentImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150",
        featured: false,
        available: true,
      },
      {
        title: "Penthouse con SPA Privata",
        description: "Esclusivo penthouse con SPA privata, sauna, jacuzzi e terrazza solarium. Design ultra-moderno con domotica avanzata e finiture luxury.",
        price: "850000",
        type: "vendita",
        priceType: "total",
        location: "Aci Castello",
        municipality: "Aci Castello",
        address: "Lungomare dei Ciclopi 12, Aci Castello",
        bedrooms: 3,
        bathrooms: 3,
        area: 200,
        images: [
          "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
          "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
        ],
        features: ["SPA privata", "Sauna", "Jacuzzi", "Domotica", "Terrazza solarium", "Finiture luxury"],
        youtubeVideoId: "jNQXAC9IVRw",
        agentName: "Sofia Romano",
        agentPhone: "+39 333 987 6543",
        agentEmail: "sofia@immobiliareacireale.it",
        agentImage: "https://images.unsplash.com/photo-1494790108755-2616b612b47c?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150",
        featured: false,
        available: true,
      },
      {
        title: "Villa Eco-Sostenibile",
        description: "Innovativa villa eco-sostenibile con pannelli solari, sistema geotermico e giardino verticale. Classe energetica A4, zero emissioni.",
        price: "420000",
        type: "vendita",
        priceType: "total",
        location: "Santa Venerina",
        municipality: "Santa Venerina",
        address: "Contrada Misericordia 45, Santa Venerina",
        bedrooms: 4,
        bathrooms: 3,
        area: 160,
        images: [
          "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
          "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
        ],
        features: ["Pannelli solari", "Sistema geotermico", "Giardino verticale", "Classe A4", "Zero emissioni"],
        youtubeVideoId: "Me-VhC9ieh0",
        agentName: "Giuseppe Catalano",
        agentPhone: "+39 333 456 7890",
        agentEmail: "giuseppe@immobiliareacireale.it",
        agentImage: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150",
        featured: false,
        available: true,
      },
      {
        title: "Casa Vacanza Vista Etna",
        description: "Accogliente casa vacanza con vista diretta sull'Etna, camino, giardino mediterraneo e pergolato per cene all'aperto. Ideale per famiglie.",
        price: "120",
        type: "casa_vacanza",
        priceType: "nightly",
        location: "Zafferana Etnea",
        municipality: "Zafferana Etnea",
        address: "Via Vulcano 78, Zafferana Etnea",
        bedrooms: 2,
        bathrooms: 1,
        area: 90,
        images: [
          "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
          "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
        ],
        features: ["Vista diretta Etna", "Camino", "Giardino mediterraneo", "Pergolato", "BBQ esterno"],
        youtubeVideoId: "5qap5aO4i9A",
        agentName: "Marco Siciliano",
        agentPhone: "+39 333 123 4567",
        agentEmail: "marco@immobiliareacireale.it",
        agentImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150",
        featured: false,
        available: true,
      },
      {
        title: "Appartamento Smart Home",
        description: "Appartamento di nuova generazione con sistema Smart Home completo, controllo vocale, illuminazione intelligente e sicurezza avanzata.",
        price: "1350",
        type: "affitto",
        priceType: "monthly",
        location: "Aci Catena",
        municipality: "Aci Catena",
        address: "Via Tecnologica 156, Aci Catena",
        bedrooms: 2,
        bathrooms: 2,
        area: 95,
        images: [
          "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
          "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
        ],
        features: ["Smart Home", "Controllo vocale", "Illuminazione intelligente", "Sicurezza avanzata", "Wi-Fi 6"],
        youtubeVideoId: "lTRiuFIWV54",
        agentName: "Sofia Romano",
        agentPhone: "+39 333 987 6543",
        agentEmail: "sofia@immobiliareacireale.it",
        agentImage: "https://images.unsplash.com/photo-1494790108755-2616b612b47c?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150",
        featured: false,
        available: true,
      },
      {
        title: "Villa con Cinema Privato",
        description: "Straordinaria villa con cinema privato 4K, sala giochi, palestra attrezzata e piscina infinity. Lusso e comfort senza compromessi.",
        price: "1200000",
        type: "vendita",
        priceType: "total",
        location: "Aci Sant'Antonio",
        municipality: "Aci Sant'Antonio",
        address: "Via Luxury Hills 23, Aci Sant'Antonio",
        bedrooms: 6,
        bathrooms: 5,
        area: 450,
        images: [
          "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
          "https://images.unsplash.com/photo-1613490493576-7fde63acd811?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
        ],
        features: ["Cinema privato 4K", "Sala giochi", "Palestra attrezzata", "Piscina infinity", "6 suite"],
        youtubeVideoId: "kJQP7kiw5Fk",
        agentName: "Giuseppe Catalano",
        agentPhone: "+39 333 456 7890",
        agentEmail: "giuseppe@immobiliareacireale.it",
        agentImage: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150",
        featured: false,
        available: true,
      },
      {
        title: "Monolocale Design Scandinavo",
        description: "Elegante monolocale arredato in stile scandinavo, materiali naturali, cucina a scomparsa e bagno con doccia walk-in. Perfetto per studenti o giovani professionisti.",
        price: "650",
        type: "affitto",
        priceType: "monthly",
        location: "Acireale Centro",
        municipality: "Acireale",
        address: "Via Hygge 44, Acireale",
        bedrooms: 1,
        bathrooms: 1,
        area: 45,
        images: [
          "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
          "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
        ],
        features: ["Design scandinavo", "Materiali naturali", "Cucina a scomparsa", "Doccia walk-in", "Completamente arredato"],
        youtubeVideoId: "dQw4w9WgXcQ",
        agentName: "Marco Siciliano",
        agentPhone: "+39 333 123 4567",
        agentEmail: "marco@immobiliareacireale.it",
        agentImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150",
        featured: false,
        available: true,
      },
      {
        title: "Resort Privato Vista Mare",
        description: "Esclusivo resort privato con 4 suite indipendenti, piscina olimpionica, campo da tennis e accesso diretto alla spiaggia privata.",
        price: "300",
        type: "casa_vacanza",
        priceType: "nightly",
        location: "Aci Castello",
        municipality: "Aci Castello",
        address: "Baia delle Sirene 1, Aci Castello",
        bedrooms: 8,
        bathrooms: 6,
        area: 600,
        images: [
          "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
          "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
        ],
        features: ["4 suite indipendenti", "Piscina olimpionica", "Campo da tennis", "Spiaggia privata", "Servizio concierge"],
        youtubeVideoId: "jNQXAC9IVRw",
        agentName: "Sofia Romano",
        agentPhone: "+39 333 987 6543",
        agentEmail: "sofia@immobiliareacireale.it",
        agentImage: "https://images.unsplash.com/photo-1494790108755-2616b612b47c?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150",
        featured: false,
        available: true,
      },
      {
        title: "Casa Storica Ristrutturata",
        description: "Affascinante casa storica del 1800 completamente ristrutturata mantenendo le caratteristiche originali: volta a botte, pavimenti in cotto, affreschi restaurati.",
        price: "280000",
        type: "vendita",
        priceType: "total",
        location: "Acireale Centro Storico",
        municipality: "Acireale",
        address: "Via Barocco 67, Acireale",
        bedrooms: 3,
        bathrooms: 2,
        area: 130,
        images: [
          "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
          "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
        ],
        features: ["Casa storica 1800", "Volta a botte", "Pavimenti in cotto", "Affreschi restaurati", "Centro storico"],
        youtubeVideoId: "Me-VhC9ieh0",
        agentName: "Giuseppe Catalano",
        agentPhone: "+39 333 456 7890",
        agentEmail: "giuseppe@immobiliareacireale.it",
        agentImage: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150",
        featured: false,
        available: true,
      },
      {
        title: "Trilocale con Terrazza Giardino",
        description: "Luminoso trilocale al primo piano con grande terrazza trasformata in giardino pensile, perfetto per chi ama gli spazi verdi in città.",
        price: "1100",
        type: "affitto",
        priceType: "monthly",
        location: "Santa Venerina",
        municipality: "Santa Venerina",
        address: "Via dei Giardini 89, Santa Venerina",
        bedrooms: 2,
        bathrooms: 1,
        area: 80,
        images: [
          "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
          "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
        ],
        features: ["Grande terrazza", "Giardino pensile", "Primo piano", "Luminoso", "Zona tranquilla"],
        youtubeVideoId: "5qap5aO4i9A",
        agentName: "Marco Siciliano",
        agentPhone: "+39 333 123 4567",
        agentEmail: "marco@immobiliareacireale.it",
        agentImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150",
        featured: false,
        available: true,
      },
      {
        title: "Villetta a Schiera Moderna",
        description: "Nuova villetta a schiera su due livelli con giardino privato, garage doppio e finiture contemporanee. Ideale per famiglie giovani.",
        price: "240000",
        type: "vendita",
        priceType: "total",
        location: "Zafferana Etnea",
        municipality: "Zafferana Etnea",
        address: "Residence Green Valley 12, Zafferana Etnea",
        bedrooms: 3,
        bathrooms: 2,
        area: 120,
        images: [
          "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
          "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
        ],
        features: ["Due livelli", "Giardino privato", "Garage doppio", "Finiture moderne", "Residence tranquillo"],
        youtubeVideoId: "lTRiuFIWV54",
        agentName: "Sofia Romano",
        agentPhone: "+39 333 987 6543",
        agentEmail: "sofia@immobiliareacireale.it",
        agentImage: "https://images.unsplash.com/photo-1494790108755-2616b612b47c?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150",
        featured: false,
        available: true,
      },
      {
        title: "Cottage con Orto Biologico",
        description: "Romantico cottage immerso nel verde con orto biologico di 500 mq, pozzo artesiano e energia rinnovabile al 100%. Vita sostenibile garantita.",
        price: "180",
        type: "casa_vacanza",
        priceType: "nightly",
        location: "Aci Sant'Antonio",
        municipality: "Aci Sant'Antonio",
        address: "Contrada Bio Valley 33, Aci Sant'Antonio",
        bedrooms: 2,
        bathrooms: 1,
        area: 70,
        images: [
          "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
          "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
        ],
        features: ["Orto biologico 500mq", "Pozzo artesiano", "Energia rinnovabile", "Immerso nel verde", "Vita sostenibile"],
        youtubeVideoId: "kJQP7kiw5Fk",
        agentName: "Giuseppe Catalano",
        agentPhone: "+39 333 456 7890",
        agentEmail: "giuseppe@immobiliareacireale.it",
        agentImage: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150",
        featured: false,
        available: true,
      }
    ];

    mockProperties.forEach(property => {
      this.createProperty(property);
    });
  }

  async getAllProperties(): Promise<Property[]> {
    return Array.from(this.properties.values());
  }

  async getProperty(id: number): Promise<Property | undefined> {
    return this.properties.get(id);
  }

  async searchProperties(filters: SearchFilters): Promise<Property[]> {
    let results = Array.from(this.properties.values()).filter(p => p.available);

    if (filters.type) {
      results = results.filter(p => p.type === filters.type);
    }

    if (filters.municipality) {
      results = results.filter(p => p.municipality === filters.municipality);
    }

    if (filters.minPrice) {
      results = results.filter(p => parseFloat(p.price) >= filters.minPrice!);
    }

    if (filters.maxPrice) {
      results = results.filter(p => parseFloat(p.price) <= filters.maxPrice!);
    }

    if (filters.bedrooms) {
      results = results.filter(p => p.bedrooms >= filters.bedrooms!);
    }

    if (filters.bathrooms) {
      results = results.filter(p => p.bathrooms >= filters.bathrooms!);
    }

    if (filters.minArea) {
      results = results.filter(p => p.area >= filters.minArea!);
    }

    if (filters.maxArea) {
      results = results.filter(p => p.area <= filters.maxArea!);
    }

    return results;
  }

  async getFeaturedProperties(): Promise<Property[]> {
    return Array.from(this.properties.values()).filter(p => p.featured && p.available);
  }

  async createProperty(insertProperty: InsertProperty): Promise<Property> {
    const id = this.currentId++;
    const property: Property = { ...insertProperty, id };
    this.properties.set(id, property);
    return property;
  }
}

export const storage = new MemStorage();
