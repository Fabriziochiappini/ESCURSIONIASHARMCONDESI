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
});

export const insertPropertySchema = createInsertSchema(properties).omit({
  id: true,
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
