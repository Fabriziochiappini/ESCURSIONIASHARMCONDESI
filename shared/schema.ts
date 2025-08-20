import { 
  pgTable, 
  text, 
  serial, 
  integer, 
  boolean, 
  decimal, 
  json, 
  timestamp,
  varchar,
  index 
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const travels = pgTable("travels", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  type: text("type").notNull(), // "mare", "montagna", "citta", "avventura", "relax", "cultura"
  travelType: text("travel_type"), // "singolo", "coppia", "famiglia", "gruppo"
  priceType: text("price_type"), // "per_persona", "forfait", "giornaliero"
  destination: text("destination").notNull(), // destinazione principale
  country: text("country").notNull(), // paese
  region: text("region").notNull(), // regione
  duration: integer("duration").notNull(), // durata in giorni
  maxParticipants: integer("max_participants").notNull(), // max partecipanti
  minAge: integer("min_age").notNull(), // età minima
  images: json("images").$type<string[]>().notNull(),
  features: json("features").$type<string[]>().notNull(),
  youtubeVideoId: text("youtube_video_id"),
  featured: boolean("featured").default(false),
  available: boolean("available").default(true),
  sortOrder: integer("sort_order").default(0),
  slug: text("slug").unique(), // SEO-friendly URL slug
  metaTitle: text("meta_title"), // SEO meta title
  metaDescription: text("meta_description"), // SEO meta description
  departureDate: timestamp("departure_date"),
  returnDate: timestamp("return_date"),
  includedServices: json("included_services").$type<string[]>().default([]),
  excludedServices: json("excluded_services").$type<string[]>().default([]),
  itinerary: json("itinerary").$type<Array<{day: number, title: string, description: string, activities: string[]}>>().default([]),
  // Agent information
  agentName: text("agent_name"),
  agentPhone: text("agent_phone"),
  agentEmail: text("agent_email"),
  agentImage: text("agent_image"),
  showcaseCategory: text("showcase_category"), // Categoria vetrina per sezioni personalizzate
  showcaseCountry: text("showcase_country"), // Paese per vetrina dinamica
});

// Showcase sections (vetrine personalizzabili)
export const showcases = pgTable("showcases", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  backgroundImage: text("background_image").notNull(),
  category: text("category").notNull().unique(), // emirati_arabi, europa, asia, etc
  country: text("country"), // Paese associato per vetrine dinamiche
  isActive: boolean("is_active").default(true),
  sortOrder: integer("sort_order").default(0),
});

// Countries section (destinazioni personalizzabili)
export const countries = pgTable("countries", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(), // Nome del paese
  title: text("title").notNull(), // Titolo personalizzato per la sezione
  description: text("description").notNull(), // Descrizione personalizzata
  backgroundImage: text("background_image").notNull(), // Immagine di sfondo
  isActive: boolean("is_active").default(true),
  sortOrder: integer("sort_order").default(0),
  travelCount: integer("travel_count").default(0), // Numero di viaggi disponibili
});

export const insertTravelSchema = createInsertSchema(travels).omit({
  id: true,
  slug: true, // Auto-generated
}).partial({
  description: true,
  destination: true, 
  country: true,
  region: true,
  duration: true,
  maxParticipants: true,
  minAge: true,
  images: true,
  features: true
}).extend({
  // Make these fields have defaults if not provided
  description: z.string().optional(),
  destination: z.string().optional(),
  country: z.string().optional(), 
  region: z.string().optional(),
  duration: z.number().optional(),
  maxParticipants: z.number().optional(),
  minAge: z.number().optional(),
  images: z.array(z.string()).optional(),
  features: z.array(z.string()).optional()
});

export const insertShowcaseSchema = createInsertSchema(showcases).omit({
  id: true,
});

export const insertCountrySchema = createInsertSchema(countries).omit({
  id: true,
  travelCount: true, // Auto-calculated
});

export type InsertTravel = z.infer<typeof insertTravelSchema>;
export type Travel = typeof travels.$inferSelect;
export type InsertShowcase = z.infer<typeof insertShowcaseSchema>;
export type Showcase = typeof showcases.$inferSelect;
export type InsertCountry = z.infer<typeof insertCountrySchema>;
export type Country = typeof countries.$inferSelect;

// Search filters schema for travel packages
export const searchFiltersSchema = z.object({
  search: z.string().optional(),
  type: z.enum(["mare", "montagna", "citta", "avventura", "relax", "cultura"]).optional(),
  travelType: z.enum(["singolo", "coppia", "famiglia", "gruppo"]).optional(),
  country: z.string().optional(),
  destination: z.string().optional(),
  minPrice: z.number().optional(),
  maxPrice: z.number().optional(),
  minDuration: z.number().optional(),
  maxDuration: z.number().optional(),
  maxParticipants: z.number().optional(),
  minAge: z.number().optional(),
  departureMonth: z.string().optional(),
});

export type SearchFilters = z.infer<typeof searchFiltersSchema>;

// LEGACY COMPATIBILITY: Property alias for Travel
export type Property = Travel;
export const insertPropertySchema = insertTravelSchema;
export type InsertProperty = InsertTravel;

// Utility functions for slug generation
export function generateTravelSlug(travel: {
  type: string;
  country: string;
  travelType?: string | null;
  destination: string;
}): string {
  const typeMap: Record<string, string> = {
    mare: "mare",
    montagna: "montagna",
    citta: "citta",
    avventura: "avventura",
    relax: "relax",
    cultura: "cultura"
  };

  const travelTypeMap: Record<string, string> = {
    singolo: "singolo",
    coppia: "coppia", 
    famiglia: "famiglia",
    gruppo: "gruppo"
  };

  const slugifyText = (text: string): string => {
    return text
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "") // Remove accents
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  const typeSlug = typeMap[travel.type] || slugifyText(travel.type);
  const countrySlug = slugifyText(travel.country);
  const travelTypeSlug = travel.travelType ? 
    travelTypeMap[travel.travelType] || slugifyText(travel.travelType) : 
    "viaggio";

  return `${typeSlug}/${countrySlug}/${travelTypeSlug}`;
}

export function generateTravelMetaTitle(travel: {
  type: string;
  country: string;
  travelType?: string | null;
  price: string;
  destination: string;
}): string {
  const typeMap: Record<string, string> = {
    mare: "Viaggi al Mare",
    montagna: "Viaggi in Montagna",
    citta: "Viaggi Città",
    avventura: "Viaggi Avventura",
    relax: "Viaggi Relax",
    cultura: "Viaggi Culturali"
  };

  const travelTypeMap: Record<string, string> = {
    singolo: "Viaggi Singoli",
    coppia: "Viaggi di Coppia", 
    famiglia: "Viaggi per Famiglie",
    gruppo: "Viaggi di Gruppo"
  };

  const typeText = typeMap[travel.type] || travel.type;
  const travelTypeText = travel.travelType ? 
    travelTypeMap[travel.travelType] : "Viaggio";
  
  return `${travel.destination} ${travel.country} - ${typeText} da €${travel.price} | Agenzia Viaggi`;
}

export function generateTravelMetaDescription(travel: {
  type: string;
  country: string;
  travelType?: string | null;
  duration: number;
  maxParticipants: number;
  minAge: number;
  price: string;
  destination: string;
}): string {
  const typeMap: Record<string, string> = {
    mare: "al mare",
    montagna: "in montagna",
    citta: "culturale",
    avventura: "avventura",
    relax: "relax",
    cultura: "culturale"
  };

  const travelTypeMap: Record<string, string> = {
    singolo: "viaggio singolo",
    coppia: "viaggio di coppia", 
    famiglia: "viaggio per famiglie",
    gruppo: "viaggio di gruppo"
  };

  const typeText = typeMap[travel.type] || travel.type;
  const travelTypeText = travel.travelType ? 
    travelTypeMap[travel.travelType] : "viaggio";
  
  return `${travelTypeText.charAt(0).toUpperCase() + travelTypeText.slice(1)} ${typeText} a ${travel.destination}, ${travel.country}. ${travel.duration} giorni, max ${travel.maxParticipants} persone, età min ${travel.minAge} anni. Da €${travel.price}. Scopri itinerari e prenota ora.`;
}

// Session storage table.
// (IMPORTANT) This table is mandatory for Replit Auth, don't drop it.
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: json("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table.
// (IMPORTANT) This table is mandatory for Replit Auth, don't drop it.
export const users = pgTable("users", {
  id: varchar("id").primaryKey().notNull(),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  role: varchar("role").default("user"), // "admin", "user"
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;

// NOTE: Using property_images table from database instead of travel_images
// Image management handled through existing property_images structure