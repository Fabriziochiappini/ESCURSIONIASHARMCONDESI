import { pgTable, text, serial, integer, boolean, decimal, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const properties = pgTable("properties", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  type: text("type").notNull(), // "vendita", "affitto", "casa_vacanza"
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
  agentName: text("agent_name").notNull(),
  agentPhone: text("agent_phone").notNull(),
  agentEmail: text("agent_email").notNull(),
  agentImage: text("agent_image"),
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
  type: z.enum(["vendita", "affitto", "casa_vacanza"]).optional(),
  municipality: z.string().optional(),
  minPrice: z.number().optional(),
  maxPrice: z.number().optional(),
  bedrooms: z.number().optional(),
  bathrooms: z.number().optional(),
  minArea: z.number().optional(),
  maxArea: z.number().optional(),
});

export type SearchFilters = z.infer<typeof searchFiltersSchema>;
