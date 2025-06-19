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
          "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
        ],
        features: ["Terrazza 80 mq", "Vista Etna e mare", "Nuova costruzione", "Classe energetica A+"],
        youtubeVideoId: "5qap5aO4i9A",
        agentName: "Marco Siciliano",
        agentPhone: "+39 333 123 4567",
        agentEmail: "marco@immobiliareacireale.it",
        agentImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150",
        featured: false,
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
          "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
        ],
        features: ["Giardino privato", "Casa indipendente", "Zona tranquilla", "Mezzi pubblici vicini"],
        youtubeVideoId: "lTRiuFIWV54",
        agentName: "Sofia Romano",
        agentPhone: "+39 333 987 6543",
        agentEmail: "sofia@immobiliareacireale.it",
        agentImage: "https://images.unsplash.com/photo-1494790108755-2616b612b47c?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150",
        featured: false,
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
          "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
        ],
        features: ["Vigneto 2 ettari", "Piscina", "Dependance", "Villa rurale", "Vita di campagna"],
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
