import { db } from "./db";
import { properties, type InsertProperty } from "@shared/schema";

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
    title: "Casa Vacanza Vista Etna",
    description: "Caratteristica casa tradizionale siciliana perfetta per vacanze, con vista spettacolare sull'Etna. Completamente ristrutturata mantenendo il fascino originale.",
    price: "120",
    type: "casa_vacanza",
    priceType: "nightly",
    location: "Aci Sant'Antonio",
    municipality: "Aci Sant'Antonio",
    address: "Via Etna 45, Aci Sant'Antonio",
    bedrooms: 3,
    bathrooms: 2,
    area: 120,
    images: [
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
      "https://images.unsplash.com/photo-1502005229762-cf1b2da2db52?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
    ],
    features: ["Vista Etna", "Tradizionale siciliana", "Giardino", "Parcheggio"],
    youtubeVideoId: "M7lc1UVf-VE",
    agentName: "Giuseppe Greco",
    agentPhone: "+39 333 555 7890",
    agentEmail: "giuseppe@immobiliareacireale.it",
    agentImage: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150",
    featured: true,
    available: true,
  },
  
  // Regular Properties
  {
    title: "Bilocale Moderno Aci Catena",
    description: "Grazioso bilocale di recente costruzione, ideale per coppia o single. Cucina a vista, camera matrimoniale e bagno moderno.",
    price: "125000",
    type: "vendita",
    priceType: "total",
    location: "Aci Catena Centro",
    municipality: "Aci Catena",
    address: "Via Centrale 78, Aci Catena",
    bedrooms: 1,
    bathrooms: 1,
    area: 55,
    images: [
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
    ],
    features: ["Nuova costruzione", "Cucina a vista", "Balcone"],
    youtubeVideoId: null,
    agentName: "Marco Siciliano",
    agentPhone: "+39 333 123 4567",
    agentEmail: "marco@immobiliareacireale.it",
    agentImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150",
    featured: false,
    available: true,
  },
  {
    title: "Trilocale in Affitto Acireale",
    description: "Spazioso trilocale arredato in zona residenziale tranquilla. Perfetto per famiglie, con due camere da letto e ampio soggiorno.",
    price: "750",
    type: "affitto",
    priceType: "monthly",
    location: "Acireale Zona Residenziale",
    municipality: "Acireale",
    address: "Via delle Rose 34, Acireale",
    bedrooms: 2,
    bathrooms: 1,
    area: 90,
    images: [
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
    ],
    features: ["Arredato", "Zona tranquilla", "Due camere", "Soggiorno ampio"],
    youtubeVideoId: null,
    agentName: "Sofia Romano",
    agentPhone: "+39 333 987 6543",
    agentEmail: "sofia@immobiliareacireale.it",
    agentImage: "https://images.unsplash.com/photo-1494790108755-2616b612b47c?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150",
    featured: false,
    available: true,
  }
];

async function seedDatabase() {
  try {
    console.log("Seeding database with sample properties...");
    
    for (const property of mockProperties) {
      await db.insert(properties).values(property);
    }
    
    console.log(`Successfully seeded ${mockProperties.length} properties`);
  } catch (error) {
    console.error("Error seeding database:", error);
  }
}

// Run the seed function if this file is executed directly
if (import.meta.main) {
  seedDatabase().then(() => {
    console.log("Database seeding completed");
    process.exit(0);
  }).catch((error) => {
    console.error("Database seeding failed:", error);
    process.exit(1);
  });
}

export { seedDatabase };