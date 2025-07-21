import { 
  properties, 
  blogPosts, 
  propertyImages,
  users,
  type Property, 
  type InsertProperty, 
  type SearchFilters,
  type BlogPost,
  type InsertBlogPost,
  type PropertyImage,
  type InsertPropertyImage,
  type User,
  type UpsertUser
} from "@shared/schema";
import { eq, and, gte, lte, sql, desc, like, or } from "drizzle-orm";
import { db } from "./db";

export interface IStorage {
  // Property operations
  getAllProperties(): Promise<Property[]>;
  getProperty(id: number): Promise<Property | undefined>;
  getFeaturedProperties(): Promise<Property[]>;
  searchProperties(filters: SearchFilters): Promise<Property[]>;
  createProperty(property: InsertProperty): Promise<Property>;
  updateProperty(id: number, property: Partial<InsertProperty>): Promise<Property | undefined>;
  deleteProperty(id: number): Promise<boolean>;
  
  // Property images operations
  getPropertyImages(propertyId: number): Promise<PropertyImage[]>;
  getPropertyImageById(id: number): Promise<PropertyImage | undefined>;
  addPropertyImage(image: InsertPropertyImage): Promise<PropertyImage>;
  deletePropertyImage(id: number): Promise<boolean>;
  updatePropertyImageOrder(images: {id: number, sortOrder: number}[]): Promise<boolean>;
  setMainPropertyImage(propertyId: number, imageId: number): Promise<boolean>;
  
  // Blog operations
  getAllBlogPosts(published?: boolean): Promise<BlogPost[]>;
  getBlogPostById(id: number): Promise<BlogPost | undefined>;
  getBlogPostBySlug(slug: string): Promise<BlogPost | undefined>;
  getFeaturedBlogPosts(): Promise<BlogPost[]>;
  searchBlogPosts(query: string, category?: string): Promise<BlogPost[]>;
  createBlogPost(post: InsertBlogPost): Promise<BlogPost>;
  updateBlogPost(id: number, post: Partial<InsertBlogPost>): Promise<BlogPost | undefined>;
  deleteBlogPost(id: number): Promise<boolean>;
  incrementBlogPostViews(id: number): Promise<void>;
  
  // User operations (required for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  isUserAdmin(id: string): Promise<boolean>;
}

export class DatabaseStorage implements IStorage {
  // Property operations
  async getAllProperties(): Promise<Property[]> {
    const allProperties = await db.select().from(properties).orderBy(desc(properties.id));
    return allProperties;
  }

  async getProperty(id: number): Promise<Property | undefined> {
    const [property] = await db.select().from(properties).where(eq(properties.id, id));
    return property || undefined;
  }

  async getFeaturedProperties(): Promise<Property[]> {
    const featuredProperties = await db.select()
      .from(properties)
      .where(eq(properties.featured, true))
      .orderBy(desc(properties.id));
    return featuredProperties;
  }

  async searchProperties(filters: SearchFilters): Promise<Property[]> {
    let query = db.select().from(properties);
    const conditions = [];

    if (filters.type) {
      conditions.push(eq(properties.type, filters.type));
    }
    if (filters.municipality) {
      conditions.push(eq(properties.municipality, filters.municipality));
    }
    if (filters.maxPrice) {
      const priceStr = filters.maxPrice.toString();
      conditions.push(lte(properties.price, priceStr));
    }
    if (filters.minPrice) {
      const priceStr = filters.minPrice.toString();
      conditions.push(gte(properties.price, priceStr));
    }
    if (filters.bedrooms) {
      conditions.push(gte(properties.bedrooms, filters.bedrooms));
    }
    if (filters.bathrooms) {
      conditions.push(gte(properties.bathrooms, filters.bathrooms));
    }
    if (filters.minArea) {
      conditions.push(gte(properties.area, filters.minArea));
    }
    if (filters.maxArea) {
      conditions.push(lte(properties.area, filters.maxArea));
    }

    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    const results = await query.orderBy(desc(properties.id));
    return results;
  }

  async createProperty(property: InsertProperty): Promise<Property> {
    const [newProperty] = await db.insert(properties).values({
      ...property,
      priceType: property.priceType || null,
      available: property.available ?? true,
      featured: property.featured ?? false
    }).returning();
    return newProperty;
  }

  async updateProperty(id: number, property: Partial<InsertProperty>): Promise<Property | undefined> {
    const [updatedProperty] = await db
      .update(properties)
      .set(property)
      .where(eq(properties.id, id))
      .returning();
    return updatedProperty || undefined;
  }

  async deleteProperty(id: number): Promise<boolean> {
    const result = await db.delete(properties).where(eq(properties.id, id));
    return result.rowCount > 0;
  }

  // Property images operations
  async getPropertyImages(propertyId: number): Promise<PropertyImage[]> {
    const results = await db
      .select()
      .from(propertyImages)
      .where(eq(propertyImages.propertyId, propertyId))
      .orderBy(propertyImages.sortOrder);
    return results;
  }

  async addPropertyImage(image: InsertPropertyImage): Promise<PropertyImage> {
    const [newImage] = await db.insert(propertyImages).values(image).returning();
    return newImage;
  }

  async deletePropertyImage(id: number): Promise<boolean> {
    const result = await db.delete(propertyImages).where(eq(propertyImages.id, id));
    return result.rowCount > 0;
  }

  async updatePropertyImageOrder(images: {id: number, sortOrder: number}[]): Promise<boolean> {
    try {
      for (const image of images) {
        await db
          .update(propertyImages)
          .set({ sortOrder: image.sortOrder })
          .where(eq(propertyImages.id, image.id));
      }
      return true;
    } catch (error) {
      console.error('Error updating image order:', error);
      return false;
    }
  }

  async setMainPropertyImage(propertyId: number, imageId: number): Promise<boolean> {
    try {
      // First, set all images for this property to not main
      await db
        .update(propertyImages)
        .set({ isMain: false })
        .where(eq(propertyImages.propertyId, propertyId));
      
      // Then set the specified image as main
      await db
        .update(propertyImages)
        .set({ isMain: true })
        .where(eq(propertyImages.id, imageId));
      
      return true;
    } catch (error) {
      console.error('Error setting main image:', error);
      return false;
    }
  }

  // Property images operations
  async getPropertyImages(propertyId: number): Promise<PropertyImage[]> {
    const images = await db
      .select()
      .from(propertyImages)
      .where(eq(propertyImages.propertyId, propertyId))
      .orderBy(propertyImages.order);
    return images;
  }

  async addPropertyImage(image: InsertPropertyImage): Promise<PropertyImage> {
    const [newImage] = await db.insert(propertyImages).values(image).returning();
    return newImage;
  }

  async deletePropertyImage(id: number): Promise<boolean> {
    const result = await db.delete(propertyImages).where(eq(propertyImages.id, id));
    return result.rowCount > 0;
  }

  async updatePropertyImageOrder(id: number, order: number): Promise<boolean> {
    const result = await db
      .update(propertyImages)
      .set({ order })
      .where(eq(propertyImages.id, id));
    return result.rowCount > 0;
  }

  // Blog operations
  async getAllBlogPosts(published?: boolean): Promise<BlogPost[]> {
    let query = db.select().from(blogPosts);
    
    if (published !== undefined) {
      query = query.where(eq(blogPosts.published, published));
    }
    
    const posts = await query.orderBy(desc(blogPosts.createdAt));
    return posts;
  }

  async getBlogPostById(id: number): Promise<BlogPost | undefined> {
    const [post] = await db.select().from(blogPosts).where(eq(blogPosts.id, id));
    return post || undefined;
  }

  async getBlogPostBySlug(slug: string): Promise<BlogPost | undefined> {
    const [post] = await db.select().from(blogPosts).where(eq(blogPosts.slug, slug));
    return post || undefined;
  }

  async getFeaturedBlogPosts(): Promise<BlogPost[]> {
    const posts = await db
      .select()
      .from(blogPosts)
      .where(and(eq(blogPosts.featured, true), eq(blogPosts.published, true)))
      .orderBy(desc(blogPosts.createdAt));
    return posts;
  }

  async searchBlogPosts(query: string, category?: string): Promise<BlogPost[]> {
    let dbQuery = db.select().from(blogPosts);
    const conditions = [eq(blogPosts.published, true)];

    if (query) {
      conditions.push(
        or(
          like(blogPosts.title, `%${query}%`),
          like(blogPosts.excerpt, `%${query}%`),
          like(blogPosts.content, `%${query}%`)
        )
      );
    }

    if (category) {
      conditions.push(eq(blogPosts.category, category));
    }

    const posts = await dbQuery
      .where(and(...conditions))
      .orderBy(desc(blogPosts.createdAt));
    return posts;
  }

  async createBlogPost(post: InsertBlogPost): Promise<BlogPost> {
    const [newPost] = await db.insert(blogPosts).values(post).returning();
    return newPost;
  }

  async updateBlogPost(id: number, post: Partial<InsertBlogPost>): Promise<BlogPost | undefined> {
    const [updatedPost] = await db
      .update(blogPosts)
      .set({ ...post, updatedAt: new Date() })
      .where(eq(blogPosts.id, id))
      .returning();
    return updatedPost || undefined;
  }

  async deleteBlogPost(id: number): Promise<boolean> {
    const result = await db.delete(blogPosts).where(eq(blogPosts.id, id));
    return result.rowCount > 0;
  }

  async incrementBlogPostViews(id: number): Promise<void> {
    await db
      .update(blogPosts)
      .set({ views: sql`${blogPosts.views} + 1` })
      .where(eq(blogPosts.id, id));
  }

  // User operations (required for Replit Auth)
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  async isUserAdmin(id: string): Promise<boolean> {
    const [user] = await db.select({ role: users.role }).from(users).where(eq(users.id, id));
    return user?.role === "admin";
  }
}

export const storage = new DatabaseStorage();