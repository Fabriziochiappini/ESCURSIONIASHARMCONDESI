import { db } from "./db";
import { travels, showcases, countries, users } from "@shared/schema";

async function seed() {
  console.log("🌱 Seeding database...");

  try {
    // Create admin user first
    await db.insert(users).values({
      id: "admin-user-1",
      email: "admin@immobiliareacireale.it",
      firstName: "Admin",
      lastName: "Immobiliare",
      role: "admin",
      profileImageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150",
    }).onConflictDoUpdate({
      target: users.id,
      set: {
        role: "admin",
        updatedAt: new Date(),
      },
    });

    // DISABLED: Sample travels creation disabled per client request
    // Client is loading their own real travels and doesn't want demo data
    console.log("ℹ️  Sample travels creation is disabled - client will add their own travels");

    // NOTE: Blog posts functionality removed for travel agency
    /* Blog posts removed for travel agency
    const sampleBlogPosts = [
      {
        title: "Guida all'Acquisto di Casa ad Acireale: Tutto quello che Devi Sapere",
        slug: "guida-acquisto-casa-acireale",
        excerpt: "Una guida completa per acquistare casa ad Acireale, dalla scelta del quartiere alle pratiche burocratiche. Scopri i consigli degli esperti.",
        content: `# Guida all'Acquisto di Casa ad Acireale

Acquistare casa ad Acireale è un investimento che può offrire grandi soddisfazioni. Questa città siciliana, situata ai piedi dell'Etna e affacciata sul mare Ionio, rappresenta un perfetto equilibrio tra storia, cultura e qualità della vita.

## I Quartieri Migliori

### Centro Storico
Il centro storico di Acireale è ricco di palazzi barocchi e chiese storiche. Ideale per chi ama vivere immerso nella cultura siciliana.

### Zona Mare
La vicinanza alle spiagge di Aci Trezza e Aci Castello rende questa zona particolarmente appetibile per chi cerca una casa al mare.

## Considerazioni sul Mercato

Il mercato immobiliare di Acireale offre ottime opportunità sia per l'acquisto della prima casa che per investimenti. I prezzi sono ancora competitivi rispetto ad altre città siciliane di pari bellezza.

## Documentazione Necessaria

Per l'acquisto di un immobile ad Acireale è necessario:
- Visura catastale aggiornata
- Attestato di prestazione energetica (APE)
- Conformità urbanistica
- Certificati di abitabilità

La nostra agenzia ti supporta in ogni fase del processo di acquisto, dalla ricerca dell'immobile fino alla stipula del contratto.`,
        featuredImage: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=800",
        category: "Guide",
        tags: ["acireale", "acquisto", "casa", "guida", "immobiliare"],
        published: true,
        featured: true,
        authorId: "admin-user-1",
        readTime: 8,
        metaDescription: "Guida completa per acquistare casa ad Acireale: quartieri migliori, mercato immobiliare e documentazione necessaria.",
        metaKeywords: "acquisto casa Acireale, immobiliare Sicilia, guida acquisto",
        views: 245,
      },
      {
        title: "Mercato Immobiliare Siciliano: Tendenze 2025",
        slug: "mercato-immobiliare-sicilia-2025",
        excerpt: "Analisi approfondita delle tendenze del mercato immobiliare siciliano per il 2025. Prezzi, domanda e opportunità di investimento.",
        content: `# Mercato Immobiliare Siciliano: Tendenze 2025

Il mercato immobiliare siciliano sta attraversando una fase di forte crescita, sostenuta dall'aumento del turismo e dall'interesse crescente per la regione.

## Trend Principali

### Crescita dei Prezzi
I prezzi degli immobili in Sicilia hanno registrato un aumento medio del 12% nell'ultimo anno, con punte del 18% nelle zone costiere più rinomate.

### Domanda Internazionale
L'interesse degli acquirenti stranieri, in particolare tedeschi e francesi, continua a crescere, attratti dal clima, dalla cultura e dai prezzi ancora competitivi.

## Previsioni per il 2025

Gli esperti prevedono una stabilizzazione dei prezzi dopo la crescita degli ultimi anni, con opportunità interessanti per gli investitori.

### Zone in Crescita
- Costa ionica (Taormina, Acireale, Catania)
- Entroterra etneo (Randazzo, Castiglione di Sicilia)
- Trapani e provincia

## Consigli per gli Investitori

1. **Diversificare**: Non concentrare tutto su un'unica zona
2. **Valutare i servizi**: Privilegiare zone ben servite dai trasporti
3. **Considerare il turismo**: Le zone turistiche offrono maggiori opportunità di rendita

Il nostro team è a disposizione per analizzare insieme le migliori opportunità di investimento.`,
        featuredImage: "https://images.unsplash.com/photo-1554469384-e58fac16e23a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=800",
        category: "Mercato",
        tags: ["mercato", "sicilia", "investimenti", "2025", "prezzi"],
        published: true,
        featured: true,
        authorId: "admin-user-1",
        readTime: 6,
        metaDescription: "Analisi delle tendenze del mercato immobiliare siciliano per il 2025: prezzi, domanda e opportunità di investimento.",
        metaKeywords: "mercato immobiliare Sicilia, tendenze 2025, investimenti",
        views: 189,
      },
      {
        title: "Investire in Case Vacanza: Opportunità nella Riviera dei Ciclopi",
        slug: "investire-case-vacanza-riviera-ciclopi",
        excerpt: "La Riviera dei Ciclopi offre ottime opportunità per investimenti in case vacanza. Scopri i rendimenti e le strategie migliori.",
        content: `# Investire in Case Vacanza: Opportunità nella Riviera dei Ciclopi

La Riviera dei Ciclopi, che comprende Aci Castello, Aci Trezza e Acireale, rappresenta una delle destinazioni turistiche più affascinanti della Sicilia orientale.

## Perché Investire Qui

### Posizione Strategica
- A soli 15 km dall'aeroporto di Catania
- Collegata alle principali attrazioni siciliane
- Vista mozzafiato su Etna e mare

### Crescita del Turismo
Il turismo nella zona è in costante crescita, con un aumento del 25% delle presenze negli ultimi tre anni.

## Rendimenti Attesi

Le case vacanza nella Riviera dei Ciclopi possono generare rendimenti annui tra il 6% e il 10%, a seconda della posizione e del livello di finitura.

### Fattori che Influenzano il Rendimento
- Vicinanza al mare
- Presenza di piscina o giardino
- Qualità degli arredi
- Servizi offerti agli ospiti

## Strategie di Investimento

### Case Vista Mare
Le proprietà con vista mare sono le più richieste e garantiscono i rendimenti più alti.

### Ristrutturazioni
Acquistare immobili da ristrutturare può offrire ottime opportunità di guadagno.

## Gestione della Proprietà

La gestione di una casa vacanza richiede:
- Marketing online efficace
- Gestione prenotazioni professionale
- Manutenzione costante
- Assistenza agli ospiti

Il nostro team offre servizi completi di gestione per massimizzare il tuo investimento.`,
        featuredImage: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=800",
        category: "Investimenti",
        tags: ["investimenti", "case vacanza", "riviera ciclopi", "turismo", "rendimenti"],
        published: true,
        featured: false,
        authorId: "admin-user-1",
        readTime: 7,
        metaDescription: "Opportunità di investimento in case vacanza nella Riviera dei Ciclopi: rendimenti, strategie e gestione professionale.",
        metaKeywords: "investimenti case vacanza, Riviera Ciclopi, turismo Sicilia",
        views: 156,
      }
    ];

    /* Blog posts removed for travel agency
    for (const post of sampleBlogPosts) {
      await db.insert(blogPosts).values(post).onConflictDoNothing();
    }
    */

    console.log("✅ Database seeded successfully!");
    console.log("- Created admin user");
    console.log("- Sample travels creation disabled (user has real data)");
    console.log("- Blog posts functionality removed for travel agency");
    
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    throw error;
  }
}

export { seed };

// Auto-run when executed directly
seed()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });