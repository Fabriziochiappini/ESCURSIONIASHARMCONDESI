import { 
  travels, 
  travelImages,
  users,
  showcases,
  countries,
  type Travel, 
  type InsertTravel, 
  type SearchFilters,
  type TravelImage,
  type InsertTravelImage,
  type User,
  type UpsertUser,
  type Showcase,
  type InsertShowcase,
  type Country,
  type InsertCountry,
  generateTravelSlug,
  generateTravelMetaTitle,
  generateTravelMetaDescription
} from "@shared/schema";
import { eq, and, gte, lte, sql, desc, like, or, ilike } from "drizzle-orm";
import { db } from "./db";

export interface IStorage {
  // Travel operations
  getAllTravels(): Promise<Travel[]>;
  getTravel(id: number): Promise<Travel | undefined>;
  getTravelBySlug(slug: string): Promise<Travel | undefined>;
  getFeaturedTravels(): Promise<Travel[]>;
  searchTravels(filters: SearchFilters): Promise<Travel[]>;
  getUniqueCountries(): Promise<string[]>;
  getUniqueDestinations(): Promise<string[]>;
  createTravel(travel: InsertTravel): Promise<Travel>;
  updateTravel(id: number, travel: Partial<InsertTravel>): Promise<Travel | undefined>;
  deleteTravel(id: number): Promise<boolean>;
  updateTravelOrder(travels: {id: number, sortOrder: number}[]): Promise<boolean>;
  moveTravel(travelId: number, direction: 'up' | 'down'): Promise<boolean>;
  
  // Travel images operations
  getTravelImages(travelId: number): Promise<TravelImage[]>;
  getTravelImageById(id: number): Promise<TravelImage | undefined>;
  addTravelImage(image: InsertTravelImage): Promise<TravelImage>;
  deleteTravelImage(id: number): Promise<boolean>;
  updateTravelImageOrder(images: {id: number, sortOrder: number}[]): Promise<boolean>;
  setMainTravelImage(travelId: number, imageId: number): Promise<boolean>;
  
  // User operations (required for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  isUserAdmin(id: string): Promise<boolean>;
  
  // Showcase operations
  getAllShowcases(): Promise<Showcase[]>;
  getActiveShowcases(): Promise<Showcase[]>;
  getShowcase(id: number): Promise<Showcase | undefined>;
  getShowcaseByCategory(category: string): Promise<Showcase | undefined>;
  getShowcaseByCountry(country: string): Promise<Showcase | undefined>;
  createShowcase(showcase: InsertShowcase): Promise<Showcase>;
  updateShowcase(id: number, showcase: Partial<InsertShowcase>): Promise<Showcase | undefined>;
  deleteShowcase(id: number): Promise<boolean>;
  getTravelsByShowcaseCategory(category: string): Promise<Travel[]>;
  getTravelsByShowcaseCountry(country: string): Promise<Travel[]>;

  // Countries operations  
  getAllCountries(): Promise<Country[]>;
  getActiveCountries(): Promise<Country[]>;
  getCountriesWithTravels(): Promise<Country[]>;
  getCountriesForShowcases(): Promise<Country[]>;
  getCountry(id: number): Promise<Country | undefined>;
  getCountryByName(name: string): Promise<Country | undefined>;
  createCountry(country: InsertCountry): Promise<Country>;
  updateCountry(id: number, country: Partial<InsertCountry>): Promise<Country | undefined>;
  deleteCountry(id: number): Promise<boolean>;
  updateCountryTravelCounts(): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  // Travel operations
  async getAllTravels(): Promise<Travel[]> {
    const allTravels = await db.select().from(travels).orderBy(travels.sortOrder, travels.id);
    return allTravels;
  }

  async getTravel(id: number): Promise<Travel | undefined> {
    const [travel] = await db.select().from(travels).where(eq(travels.id, id));
    return travel || undefined;
  }

  async getTravelBySlug(slug: string): Promise<Travel | undefined> {
    const [travel] = await db.select().from(travels).where(eq(travels.slug, slug));
    return travel || undefined;
  }

  async getFeaturedTravels(): Promise<Travel[]> {
    const featuredTravels = await db
      .select()
      .from(travels)
      .where(eq(travels.featured, true))
      .orderBy(travels.sortOrder, travels.id);
    return featuredTravels;
  }

  async searchTravels(filters: SearchFilters): Promise<Travel[]> {
    const conditions = [];

    if (filters.search) {
      conditions.push(
        or(
          ilike(travels.title, `%${filters.search}%`),
          ilike(travels.description, `%${filters.search}%`),
          ilike(travels.destination, `%${filters.search}%`),
          ilike(travels.country, `%${filters.search}%`)
        )
      );
    }

    if (filters.type) {
      conditions.push(eq(travels.type, filters.type));
    }

    if (filters.travelType) {
      conditions.push(eq(travels.travelType, filters.travelType));
    }

    if (filters.country) {
      conditions.push(eq(travels.country, filters.country));
    }

    if (filters.destination) {
      conditions.push(eq(travels.destination, filters.destination));
    }

    if (filters.minPrice) {
      conditions.push(gte(travels.price, filters.minPrice.toString()));
    }

    if (filters.maxPrice) {
      conditions.push(lte(travels.price, filters.maxPrice.toString()));
    }

    if (filters.minDuration) {
      conditions.push(gte(travels.duration, filters.minDuration));
    }

    if (filters.maxDuration) {
      conditions.push(lte(travels.duration, filters.maxDuration));
    }

    if (filters.maxParticipants) {
      conditions.push(lte(travels.maxParticipants, filters.maxParticipants));
    }

    if (filters.minAge) {
      conditions.push(lte(travels.minAge, filters.minAge));
    }

    if (filters.departureMonth) {
      const year = new Date().getFullYear();
      const month = parseInt(filters.departureMonth);
      const startOfMonth = new Date(year, month - 1, 1);
      const endOfMonth = new Date(year, month, 0);
      
      conditions.push(
        and(
          gte(travels.departureDate, startOfMonth),
          lte(travels.departureDate, endOfMonth)
        )
      );
    }

    const query = db.select().from(travels).orderBy(travels.sortOrder, travels.id);

    if (conditions.length > 0) {
      query.where(and(...conditions));
    }

    return await query;
  }

  async getUniqueCountries(): Promise<string[]> {
    const result = await db
      .selectDistinct({ country: travels.country })
      .from(travels)
      .orderBy(travels.country);
    
    return result.map(row => row.country);
  }

  async getUniqueDestinations(): Promise<string[]> {
    const result = await db
      .selectDistinct({ destination: travels.destination })
      .from(travels)
      .orderBy(travels.destination);
    
    return result.map(row => row.destination);
  }

  async createTravel(travel: InsertTravel): Promise<Travel> {
    // Generate slug if not provided
    const travelData = travel as any; // Temporary fix during migration
    if (!travelData.slug) {
      const baseSlug = generateTravelSlug({
        type: travel.type,
        country: travel.country,
        travelType: travel.travelType,
        destination: travel.destination
      });
      
      // Check for uniqueness and add suffix if needed
      let slug = baseSlug;
      let counter = 1;
      while (await this.getTravelBySlug(slug)) {
        slug = `${baseSlug}-${counter}`;
        counter++;
      }
      travelData.slug = slug;
    }

    // Generate meta title if not provided
    if (!travel.metaTitle) {
      travel.metaTitle = generateTravelMetaTitle({
        type: travel.type,
        country: travel.country,
        travelType: travel.travelType,
        price: travel.price.toString(),
        destination: travel.destination
      });
    }

    // Generate meta description if not provided
    if (!travel.metaDescription) {
      travel.metaDescription = generateTravelMetaDescription({
        type: travel.type,
        country: travel.country,
        travelType: travel.travelType,
        duration: travel.duration,
        maxParticipants: travel.maxParticipants,
        minAge: travel.minAge,
        price: travel.price.toString(),
        destination: travel.destination
      });
    }

    const [newTravel] = await db.insert(travels).values(travelData).returning();
    return newTravel;
  }

  async updateTravel(id: number, travel: Partial<InsertTravel>): Promise<Travel | undefined> {
    // Regenerate meta fields if core fields changed
    if (travel.type || travel.country || travel.travelType || travel.price || travel.destination) {
      const existing = await this.getTravel(id);
      if (existing) {
        if (!travel.metaTitle) {
          travel.metaTitle = generateTravelMetaTitle({
            type: travel.type || existing.type,
            country: travel.country || existing.country,
            travelType: travel.travelType || existing.travelType,
            price: travel.price?.toString() || existing.price,
            destination: travel.destination || existing.destination
          });
        }
        
        if (!travel.metaDescription) {
          travel.metaDescription = generateTravelMetaDescription({
            type: travel.type || existing.type,
            country: travel.country || existing.country,
            travelType: travel.travelType || existing.travelType,
            duration: travel.duration || existing.duration,
            maxParticipants: travel.maxParticipants || existing.maxParticipants,
            minAge: travel.minAge || existing.minAge,
            price: travel.price?.toString() || existing.price,
            destination: travel.destination || existing.destination
          });
        }
      }
    }

    const [updatedTravel] = await db.update(travels).set(travel as any).where(eq(travels.id, id)).returning();
    return updatedTravel || undefined;
  }

  async deleteTravel(id: number): Promise<boolean> {
    const result = await db.delete(travels).where(eq(travels.id, id));
    return result.rowCount !== null && result.rowCount > 0;
  }

  async updateTravelOrder(travelList: {id: number, sortOrder: number}[]): Promise<boolean> {
    try {
      await Promise.all(
        travelList.map(travel =>
          db.update(travels).set({ sortOrder: travel.sortOrder }).where(eq(travels.id, travel.id))
        )
      );
      return true;
    } catch (error) {
      console.error('Error updating travel order:', error);
      return false;
    }
  }

  async moveTravel(travelId: number, direction: 'up' | 'down'): Promise<boolean> {
    try {
      const travel = await this.getTravel(travelId);
      if (!travel) return false;

      const currentOrder = travel.sortOrder || 0;
      const targetOrder = direction === 'up' ? currentOrder - 1 : currentOrder + 1;

      // Find the travel with the target order
      const [targetTravel] = await db
        .select()
        .from(travels)
        .where(eq(travels.sortOrder, targetOrder))
        .limit(1);

      if (!targetTravel) return false;

      // Swap the orders
      await Promise.all([
        db.update(travels).set({ sortOrder: targetOrder }).where(eq(travels.id, travelId)),
        db.update(travels).set({ sortOrder: currentOrder }).where(eq(travels.id, targetTravel.id))
      ]);

      return true;
    } catch (error) {
      console.error('Error moving travel:', error);
      return false;
    }
  }

  // Travel images operations
  async getTravelImages(travelId: number): Promise<TravelImage[]> {
    const images = await db
      .select()
      .from(travelImages)
      .where(eq(travelImages.travelId, travelId))
      .orderBy(travelImages.sortOrder, travelImages.id);
    return images;
  }

  async getTravelImageById(id: number): Promise<TravelImage | undefined> {
    const [image] = await db.select().from(travelImages).where(eq(travelImages.id, id));
    return image || undefined;
  }

  async addTravelImage(image: InsertTravelImage): Promise<TravelImage> {
    const [newImage] = await db.insert(travelImages).values(image).returning();
    return newImage;
  }

  async deleteTravelImage(id: number): Promise<boolean> {
    const result = await db.delete(travelImages).where(eq(travelImages.id, id));
    return result.rowCount !== null && result.rowCount > 0;
  }

  async updateTravelImageOrder(images: {id: number, sortOrder: number}[]): Promise<boolean> {
    try {
      await Promise.all(
        images.map(image =>
          db.update(travelImages).set({ sortOrder: image.sortOrder }).where(eq(travelImages.id, image.id))
        )
      );
      return true;
    } catch (error) {
      console.error('Error updating travel image order:', error);
      return false;
    }
  }

  async setMainTravelImage(travelId: number, imageId: number): Promise<boolean> {
    try {
      // First, set all images for this travel to not main
      await db
        .update(travelImages)
        .set({ isMain: false })
        .where(eq(travelImages.travelId, travelId));

      // Then set the specified image as main
      await db
        .update(travelImages)
        .set({ isMain: true })
        .where(eq(travelImages.id, imageId));

      return true;
    } catch (error) {
      console.error('Error setting main travel image:', error);
      return false;
    }
  }

  // User operations (required for Replit Auth)
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async upsertUser(user: UpsertUser): Promise<User> {
    const [upsertedUser] = await db
      .insert(users)
      .values(user)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          profileImageUrl: user.profileImageUrl,
          updatedAt: sql`NOW()`,
        },
      })
      .returning();
    
    return upsertedUser;
  }

  async isUserAdmin(id: string): Promise<boolean> {
    const user = await this.getUser(id);
    return user?.role === 'admin';
  }

  // Showcase operations
  async getAllShowcases(): Promise<Showcase[]> {
    const allShowcases = await db.select().from(showcases).orderBy(showcases.sortOrder, showcases.id);
    return allShowcases;
  }

  async getActiveShowcases(): Promise<Showcase[]> {
    const activeShowcases = await db
      .select()
      .from(showcases)
      .where(eq(showcases.isActive, true))
      .orderBy(showcases.sortOrder, showcases.id);
    return activeShowcases;
  }

  async getShowcase(id: number): Promise<Showcase | undefined> {
    const [showcase] = await db.select().from(showcases).where(eq(showcases.id, id));
    return showcase || undefined;
  }

  async getShowcaseByCategory(category: string): Promise<Showcase | undefined> {
    const [showcase] = await db.select().from(showcases).where(eq(showcases.category, category));
    return showcase || undefined;
  }

  async createShowcase(showcase: InsertShowcase): Promise<Showcase> {
    const [newShowcase] = await db.insert(showcases).values(showcase).returning();
    return newShowcase;
  }

  async updateShowcase(id: number, showcase: Partial<InsertShowcase>): Promise<Showcase | undefined> {
    const [updatedShowcase] = await db
      .update(showcases)
      .set(showcase)
      .where(eq(showcases.id, id))
      .returning();
    return updatedShowcase || undefined;
  }

  async deleteShowcase(id: number): Promise<boolean> {
    const result = await db.delete(showcases).where(eq(showcases.id, id));
    return result.rowCount > 0;
  }

  async getTravelsByShowcaseCategory(category: string): Promise<Travel[]> {
    const categoryTravels = await db
      .select()
      .from(travels)
      .where(eq(travels.showcaseCategory, category))
      .orderBy(travels.sortOrder, travels.id);
    return categoryTravels;
  }

  async getShowcaseByCountry(country: string): Promise<Showcase | undefined> {
    const [showcase] = await db.select().from(showcases).where(eq(showcases.country, country));
    return showcase || undefined;
  }

  async getTravelsByShowcaseCountry(country: string): Promise<Travel[]> {
    const countryTravels = await db
      .select()
      .from(travels)
      .where(eq(travels.showcaseCountry, country))
      .orderBy(travels.sortOrder, travels.id);
    return countryTravels;
  }

  // Countries operations
  async getAllCountries(): Promise<Country[]> {
    const allCountries = await db.select().from(countries).orderBy(countries.sortOrder, countries.id);
    return allCountries;
  }

  async getActiveCountries(): Promise<Country[]> {
    const activeCountries = await db
      .select()
      .from(countries)
      .where(eq(countries.isActive, true))
      .orderBy(countries.sortOrder, countries.id);
    return activeCountries;
  }

  async getCountry(id: number): Promise<Country | undefined> {
    const [country] = await db.select().from(countries).where(eq(countries.id, id));
    return country || undefined;
  }

  async getCountryByName(name: string): Promise<Country | undefined> {
    const [country] = await db.select().from(countries).where(eq(countries.name, name));
    return country || undefined;
  }

  async createCountry(country: InsertCountry): Promise<Country> {
    const [newCountry] = await db.insert(countries).values(country).returning();
    await this.updateCountryTravelCounts();
    return newCountry;
  }

  async updateCountry(id: number, country: Partial<InsertCountry>): Promise<Country | undefined> {
    const [updatedCountry] = await db
      .update(countries)
      .set(country)
      .where(eq(countries.id, id))
      .returning();
    await this.updateCountryTravelCounts();
    return updatedCountry || undefined;
  }

  async deleteCountry(id: number): Promise<boolean> {
    const result = await db.delete(countries).where(eq(countries.id, id));
    await this.updateCountryTravelCounts();
    return result.rowCount > 0;
  }

  async updateCountryTravelCounts(): Promise<void> {
    // Update travel counts for all countries
    const travelCounts = await db
      .select({
        country: travels.country,
        count: sql<number>`count(*)`.as('count')
      })
      .from(travels)
      .where(eq(travels.available, true))
      .groupBy(travels.country);

    // Reset all counts to 0 first
    await db.update(countries).set({ travelCount: 0 });

    // Update counts for countries that have travels
    for (const countData of travelCounts) {
      await db
        .update(countries)
        .set({ travelCount: countData.count })
        .where(eq(countries.name, countData.country));
    }
  }

  async getCountriesForShowcases(): Promise<Country[]> {
    // Get first 4 countries with travels for showcases
    const showcaseCountries = await db
      .select()
      .from(countries)
      .where(and(eq(countries.isActive, true), gt(countries.travelCount, 0)))
      .orderBy(countries.sortOrder, countries.id)
      .limit(4);
    return showcaseCountries;
  }
}

export const storage: IStorage = new DatabaseStorage();