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

export const properties = pgTable("properties", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  type: text("type").notNull(), // "vendita", "affitto", "casa_vacanza"
  propertyType: text("property_type"), // "villa", "appartamento", "villa_singola", "casa_singola_con_terreno", "rustici_e_terreni"
  priceType: text("price_type"), // "total", "monthly", "nightly"
  location: text("location").notNull(),
  municipality: text("municipality").notNull(),
  address: text("address").notNull(),
  bedrooms: integer("bedrooms").notNull(),
  bathrooms: integer("bathrooms").notNull(),
  area: integer("area").notNull(), // in square meters
  images: json("images").$type<string[]>().notNull(),
  features: json("features").$type<string[]>().notNull(),
  youtubeVideoId: text("youtube_video_id"),
  featured: boolean("featured").default(false),
  available: boolean("available").default(true),
  sortOrder: integer("sort_order").default(0),
  slug: text("slug").unique(), // SEO-friendly URL slug
  metaTitle: text("meta_title"), // SEO meta title
  metaDescription: text("meta_description"), // SEO meta description
});

export const insertPropertySchema = createInsertSchema(properties).omit({
  id: true,
  slug: true, // Auto-generated
});

export type InsertProperty = z.infer<typeof insertPropertySchema>;
export type Property = typeof properties.$inferSelect;



// Search filters schema
export const searchFiltersSchema = z.object({
  search: z.string().optional(),
  type: z.enum(["vendita", "affitto", "casa_vacanza"]).optional(),
  propertyType: z.enum(["villa", "appartamento", "villa_a_schiera", "casa_singola_con_terreno", "rustici_e_terreni", "terreno_agricolo", "terreno_edificabile"]).optional(),
  municipality: z.string().optional(),
  minPrice: z.number().optional(),
  maxPrice: z.number().optional(),
  bedrooms: z.number().optional(),
  bathrooms: z.number().optional(),
  minArea: z.number().optional(),
  maxArea: z.number().optional(),
});

export type SearchFilters = z.infer<typeof searchFiltersSchema>;

// Utility functions for slug generation
export function generatePropertySlug(property: {
  type: string;
  municipality: string;
  propertyType?: string | null;
  title: string;
}): string {
  const typeMap: Record<string, string> = {
    vendita: "casa",
    affitto: "affitto",
    casa_vacanza: "vacanza"
  };

  const propertyTypeMap: Record<string, string> = {
    villa: "villa",
    appartamento: "appartamento", 
    villa_a_schiera: "villa-schiera",
    casa_singola_con_terreno: "casa-terreno",
    rustici_e_terreni: "rustico",
    terreno_agricolo: "terreno-agricolo",
    terreno_edificabile: "terreno-edificabile"
  };

  const slugifyText = (text: string): string => {
    return text
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "") // Remove accents
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  const typeSlug = typeMap[property.type] || slugifyText(property.type);
  const municipalitySlug = slugifyText(property.municipality);
  const propertyTypeSlug = property.propertyType ? 
    propertyTypeMap[property.propertyType] || slugifyText(property.propertyType) : 
    "proprieta";

  return `${typeSlug}/${municipalitySlug}/${propertyTypeSlug}`;
}

export function generatePropertyMetaTitle(property: {
  type: string;
  municipality: string;
  propertyType?: string | null;
  price: string;
}): string {
  const typeMap: Record<string, string> = {
    vendita: "Casa in Vendita",
    affitto: "Casa in Affitto",
    casa_vacanza: "Casa Vacanza"
  };

  const propertyTypeMap: Record<string, string> = {
    villa: "Villa",
    appartamento: "Appartamento", 
    villa_a_schiera: "Villa a Schiera",
    casa_singola_con_terreno: "Casa con Terreno",
    rustici_e_terreni: "Rustico",
    terreno_agricolo: "Terreno Agricolo",
    terreno_edificabile: "Terreno Edificabile"
  };

  const typeText = typeMap[property.type] || property.type;
  const propertyTypeText = property.propertyType ? 
    propertyTypeMap[property.propertyType] : "Propriet\u00e0";
  
  return `${propertyTypeText} ${property.municipality} - ${typeText} \u20ac${property.price} | Agenzia Immobiliare`;
}

export function generatePropertyMetaDescription(property: {
  type: string;
  municipality: string;
  propertyType?: string | null;
  bedrooms: number;
  bathrooms: number;
  area: number;
  price: string;
}): string {
  const typeMap: Record<string, string> = {
    vendita: "vendita",
    affitto: "affitto",
    casa_vacanza: "casa vacanza"
  };

  const propertyTypeMap: Record<string, string> = {
    villa: "villa",
    appartamento: "appartamento", 
    villa_a_schiera: "villa a schiera",
    casa_singola_con_terreno: "casa con terreno",
    rustici_e_terreni: "rustico",
    terreno_agricolo: "terreno agricolo",
    terreno_edificabile: "terreno edificabile"
  };

  const typeText = typeMap[property.type] || property.type;
  const propertyTypeText = property.propertyType ? 
    propertyTypeMap[property.propertyType] : "propriet\u00e0";
  
  return `${propertyTypeText.charAt(0).toUpperCase() + propertyTypeText.slice(1)} in ${typeText} a ${property.municipality}. ${property.bedrooms} camere, ${property.bathrooms} bagni, ${property.area}mq. Prezzo \u20ac${property.price}. Contattaci per maggiori informazioni.`;
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

// Blog posts table
export const blogPosts = pgTable("blog_posts", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  excerpt: text("excerpt").notNull(),
  content: text("content").notNull(),
  featuredImage: text("featured_image"),
  category: text("category").notNull(),
  tags: json("tags").$type<string[]>().default([]),
  published: boolean("published").default(false),
  featured: boolean("featured").default(false),
  authorId: varchar("author_id").references(() => users.id),
  views: integer("views").default(0),
  readTime: integer("read_time").notNull(), // in minutes
  metaDescription: text("meta_description"),
  metaKeywords: text("meta_keywords"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertBlogPostSchema = createInsertSchema(blogPosts).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  views: true,
});

export type InsertBlogPost = z.infer<typeof insertBlogPostSchema>;
export type BlogPost = typeof blogPosts.$inferSelect;

// Property images table for better management
export const propertyImages = pgTable("property_images", {
  id: serial("id").primaryKey(),
  propertyId: integer("property_id").references(() => properties.id, { onDelete: "cascade" }).notNull(),
  filename: text("filename").notNull(),
  originalName: text("original_name").notNull(),
  url: text("url").notNull(),
  size: integer("size").notNull(),
  mimeType: text("mime_type").notNull(),
  sortOrder: integer("sort_order").default(0),
  isMain: boolean("is_main").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertPropertyImageSchema = createInsertSchema(propertyImages).omit({
  id: true,
  createdAt: true,
});

export type InsertPropertyImage = z.infer<typeof insertPropertyImageSchema>;
export type PropertyImage = typeof propertyImages.$inferSelect;
