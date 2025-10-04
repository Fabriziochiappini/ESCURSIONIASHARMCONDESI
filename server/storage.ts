import { 
  travels, 
  travelImages,
  users,
  showcases,
  countries,
  bookings,
  payments,
  galleries,
  galleryImages,
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
  type Booking,
  type InsertBooking,
  type Payment,
  type InsertPayment,
  type Gallery,
  type InsertGallery,
  type GalleryImage,
  type InsertGalleryImage,
  generateTravelSlug,
  generateTravelMetaTitle,
  generateTravelMetaDescription
} from "@shared/schema";
import { eq, and, gte, lte, sql, desc, like, or, ilike, gt } from "drizzle-orm";
import { db } from "./db";
import fs from 'fs';
import path from 'path';
import { ObjectStorageService } from "./objectStorage";

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

  // Booking operations
  getAllBookings(): Promise<Booking[]>;
  getBooking(id: number): Promise<Booking | undefined>;
  createBooking(booking: InsertBooking): Promise<Booking>;
  updateBooking(id: number, booking: Partial<InsertBooking>): Promise<Booking | undefined>;
  deleteBooking(id: number): Promise<boolean>;
  getBookingsByTravel(travelId: number): Promise<Booking[]>;

  // Payment operations
  getAllPayments(): Promise<Payment[]>;
  getPayment(id: number): Promise<Payment | undefined>;
  createPayment(payment: InsertPayment): Promise<Payment>;
  updatePayment(id: number, payment: Partial<InsertPayment>): Promise<Payment | undefined>;
  updatePaymentByStripeId(paymentIntentId: string, payment: Partial<InsertPayment>): Promise<Payment | undefined>;
  updatePaymentByPayPalId(paypalOrderId: string, payment: Partial<InsertPayment>): Promise<Payment | undefined>;
  deletePayment(id: number): Promise<boolean>;
  getPaymentsByBooking(bookingId: number): Promise<Payment[]>;

  // Gallery operations
  getAllGalleries(): Promise<Gallery[]>;
  getGallery(id: number): Promise<Gallery | undefined>;
  getGalleryWithImages(id: number): Promise<(Gallery & { images: GalleryImage[] }) | undefined>;
  getLatestGalleryImages(limit: number): Promise<(GalleryImage & { gallery: Gallery })[]>;
  createGallery(gallery: InsertGallery): Promise<Gallery>;
  updateGallery(id: number, gallery: Partial<InsertGallery>): Promise<Gallery | undefined>;
  deleteGallery(id: number): Promise<boolean>;
  addGalleryImages(galleryId: number, files: Express.Multer.File[]): Promise<GalleryImage[]>;
  deleteGalleryImage(imageId: number): Promise<boolean>;
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
    // RISPETTA L'ORDINAMENTO IMPOSTATO IN BACKEND: usa sortOrder
    const featuredTravels = await db
      .select()
      .from(travels)
      .where(eq(travels.available, true))
      .orderBy(travels.sortOrder, travels.id) // Rispetta l'ordinamento del backend
      .limit(10);

    console.log(`🎯 Mostro ${featuredTravels.length} viaggi in homepage con ordine backend`);
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
        type: travel.type || '',
        country: travel.country || '',
        travelType: travel.travelType,
        destination: travel.destination || ''
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
    if (!travel.metaTitle && travel.type && travel.country && travel.price && travel.destination) {
      travel.metaTitle = generateTravelMetaTitle({
        type: travel.type,
        country: travel.country,
        travelType: travel.travelType,
        price: travel.price.toString(),
        destination: travel.destination
      });
    }

    // Generate meta description if not provided  
    if (!travel.metaDescription && travel.type && travel.country && travel.duration && travel.maxParticipants && travel.minAge && travel.price && travel.destination) {
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
    try {
      // Prima recupera il viaggio per ottenere le immagini
      const travel = await this.getTravel(id);
      if (!travel) return false;

      console.log(`🗑️ Eliminazione viaggio ID ${id}: "${travel.title}"`);

      // Elimina le immagini dal database e dai file fisici
      const imagesList = await this.getTravelImages(id);
      console.log(`📸 Trovate ${imagesList.length} immagini da eliminare`);

      // Elimina i file fisici delle immagini
      for (const image of imagesList) {
        await this.deleteImageFile(image.url);
      }

      // Elimina anche le immagini nella proprietà images del viaggio
      if (travel.images && travel.images.length > 0) {
        console.log(`📸 Eliminazione ${travel.images.length} immagini dalla proprietà images`);
        for (const imageUrl of travel.images) {
          await this.deleteImageFile(imageUrl);
        }
      }

      // Elimina le immagini dal database
      await db.delete(travelImages).where(eq(travelImages.travelId, id));

      // Elimina il viaggio dal database
      const result = await db.delete(travels).where(eq(travels.id, id));
      
      console.log(`✅ Viaggio "${travel.title}" eliminato completamente`);
      return result.rowCount !== null && result.rowCount > 0;
    } catch (error) {
      console.error('Errore eliminazione viaggio:', error);
      return false;
    }
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
      // Prima riordina TUTTI i viaggi in sequenza corretta
      await this.reorderAllTravels();
      
      // Get all travels ordered by sortOrder - FRESH from DB dopo riordinamento
      const allTravels = await db
        .select()
        .from(travels)
        .orderBy(travels.sortOrder, travels.id);

      console.log(`🔄 moveTravel: ID=${travelId}, direction=${direction}, trovati ${allTravels.length} viaggi`);
      
      const currentIndex = allTravels.findIndex(t => t.id === travelId);
      if (currentIndex === -1) {
        console.log(`❌ Viaggio ${travelId} non trovato`);
        return false;
      }

      const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
      if (targetIndex < 0 || targetIndex >= allTravels.length) {
        console.log(`❌ Non posso muovere ${direction}: già ${direction === 'up' ? 'primo' : 'ultimo'}`);
        return false;
      }

      // Scambia gli elementi nell'array
      const currentTravel = allTravels[currentIndex];
      const targetTravel = allTravels[targetIndex];

      console.log(`🔄 Scambio: ${currentTravel.title} (pos ${currentIndex}) ↔ ${targetTravel.title} (pos ${targetIndex})`);

      // Scambia i sortOrder con una transazione atomica
      await db.transaction(async (tx) => {
        // Usa valori temporanei per evitare conflitti
        const tempOrder1 = -9999;
        const tempOrder2 = -9998;
        
        // Step 1: Metti entrambi su valori temporanei
        await tx.update(travels).set({ sortOrder: tempOrder1 }).where(eq(travels.id, currentTravel.id));
        await tx.update(travels).set({ sortOrder: tempOrder2 }).where(eq(travels.id, targetTravel.id));
        
        // Step 2: Scambia con i valori finali
        await tx.update(travels).set({ sortOrder: targetTravel.sortOrder }).where(eq(travels.id, currentTravel.id));
        await tx.update(travels).set({ sortOrder: currentTravel.sortOrder }).where(eq(travels.id, targetTravel.id));
      });

      console.log(`✅ Scambio completato con successo`);
      return true;
    } catch (error) {
      console.error('❌ Error moving travel:', error);
      return false;
    }
  }

  // Riordina TUTTI i viaggi in sequenza corretta senza duplicati
  async reorderAllTravels(): Promise<void> {
    const allTravels = await db
      .select()
      .from(travels)
      .orderBy(travels.sortOrder, travels.id);

    console.log(`🔧 Riordino ${allTravels.length} viaggi in sequenza corretta...`);
    
    // Aggiorna tutti i viaggi con sortOrder sequenziale
    for (let i = 0; i < allTravels.length; i++) {
      const newSortOrder = i + 1;
      if (allTravels[i].sortOrder !== newSortOrder) {
        await db
          .update(travels)
          .set({ sortOrder: newSortOrder })
          .where(eq(travels.id, allTravels[i].id));
      }
    }
    
    console.log(`✅ Riordinamento completato: sortOrder da 1 a ${allTravels.length}`);
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
    try {
      // Prima recupera l'immagine per ottenere l'URL
      const image = await this.getTravelImageById(id);
      if (!image) return false;

      console.log(`🗑️ Eliminazione immagine ID ${id}: ${image.url}`);

      // Elimina il file fisico
      await this.deleteImageFile(image.url);

      // Elimina dal database
      const result = await db.delete(travelImages).where(eq(travelImages.id, id));
      
      console.log(`✅ Immagine eliminata completamente`);
      return result.rowCount !== null && result.rowCount > 0;
    } catch (error) {
      console.error('Errore eliminazione immagine:', error);
      return false;
    }
  }

  // Utility per eliminare file fisici
  private async deleteImageFile(imageUrl: string): Promise<void> {
    try {
      if (!imageUrl || !imageUrl.startsWith('/uploads/')) {
        return; // Skip non-local images
      }

      // Converte URL in percorso file system
      const filePath = path.join(process.cwd(), imageUrl.substring(1)); // Rimuove il "/" iniziale
      
      // Controlla se il file esiste
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        console.log(`🗑️ File eliminato: ${filePath}`);
      } else {
        console.log(`⚠️ File non trovato: ${filePath}`);
      }
    } catch (error) {
      console.error('Errore eliminazione file:', error);
    }
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
    return result.rowCount !== null && result.rowCount > 0;
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
    return result.rowCount !== null && result.rowCount > 0;
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

  async getCountriesWithTravels(): Promise<Country[]> {
    const countriesWithTravels = await db
      .select()
      .from(countries)
      .where(gt(countries.travelCount, 0))
      .orderBy(countries.sortOrder, countries.id);
    return countriesWithTravels;
  }

  // Booking operations
  async getAllBookings(): Promise<Booking[]> {
    const allBookings = await db.select().from(bookings).orderBy(bookings.createdAt);
    return allBookings;
  }

  async getBooking(id: number): Promise<Booking | undefined> {
    const [booking] = await db.select().from(bookings).where(eq(bookings.id, id));
    return booking || undefined;
  }

  async createBooking(booking: InsertBooking): Promise<Booking> {
    const [newBooking] = await db.insert(bookings).values(booking).returning();
    return newBooking;
  }

  async updateBooking(id: number, booking: Partial<InsertBooking>): Promise<Booking | undefined> {
    const [updatedBooking] = await db.update(bookings).set(booking).where(eq(bookings.id, id)).returning();
    return updatedBooking || undefined;
  }

  async deleteBooking(id: number): Promise<boolean> {
    const result = await db.delete(bookings).where(eq(bookings.id, id));
    return result.rowCount !== null && result.rowCount > 0;
  }

  async getBookingsByTravel(travelId: number): Promise<Booking[]> {
    const travelBookings = await db
      .select()
      .from(bookings)
      .where(eq(bookings.travelId, travelId))
      .orderBy(bookings.createdAt);
    return travelBookings;
  }

  // Payment operations
  async getAllPayments(): Promise<Payment[]> {
    const allPayments = await db.select().from(payments).orderBy(payments.createdAt);
    return allPayments;
  }

  async getPayment(id: number): Promise<Payment | undefined> {
    const [payment] = await db.select().from(payments).where(eq(payments.id, id));
    return payment || undefined;
  }

  async createPayment(payment: InsertPayment): Promise<Payment> {
    const [newPayment] = await db.insert(payments).values(payment).returning();
    return newPayment;
  }

  async updatePayment(id: number, payment: Partial<InsertPayment>): Promise<Payment | undefined> {
    const [updatedPayment] = await db.update(payments).set(payment).where(eq(payments.id, id)).returning();
    return updatedPayment || undefined;
  }

  async updatePaymentByStripeId(paymentIntentId: string, payment: Partial<InsertPayment>): Promise<Payment | undefined> {
    const [updatedPayment] = await db.update(payments).set(payment).where(eq(payments.paymentIntentId, paymentIntentId)).returning();
    return updatedPayment || undefined;
  }

  async updatePaymentByPayPalId(paypalOrderId: string, payment: Partial<InsertPayment>): Promise<Payment | undefined> {
    const [updatedPayment] = await db.update(payments).set(payment).where(eq(payments.paypalOrderId, paypalOrderId)).returning();
    return updatedPayment || undefined;
  }

  async deletePayment(id: number): Promise<boolean> {
    const result = await db.delete(payments).where(eq(payments.id, id));
    return result.rowCount !== null && result.rowCount > 0;
  }

  async getPaymentsByBooking(bookingId: number): Promise<Payment[]> {
    const bookingPayments = await db
      .select()
      .from(payments)
      .where(eq(payments.bookingId, bookingId))
      .orderBy(payments.createdAt);
    return bookingPayments;
  }

  // Gallery operations
  async getAllGalleries(): Promise<Gallery[]> {
    const allGalleries = await db.select().from(galleries).orderBy(desc(galleries.createdAt));
    return allGalleries;
  }

  async getGallery(id: number): Promise<Gallery | undefined> {
    const [gallery] = await db.select().from(galleries).where(eq(galleries.id, id));
    return gallery || undefined;
  }

  async getGalleryWithImages(id: number): Promise<(Gallery & { images: GalleryImage[] }) | undefined> {
    const gallery = await this.getGallery(id);
    if (!gallery) return undefined;

    const images = await db
      .select()
      .from(galleryImages)
      .where(eq(galleryImages.galleryId, id))
      .orderBy(galleryImages.sortOrder, galleryImages.createdAt);

    return { ...gallery, images };
  }

  async getLatestGalleryImages(limit: number): Promise<(GalleryImage & { gallery: Gallery })[]> {
    const images = await db
      .select({
        id: galleryImages.id,
        galleryId: galleryImages.galleryId,
        imageUrl: galleryImages.imageUrl,
        createdAt: galleryImages.createdAt,
        sortOrder: galleryImages.sortOrder,
        galleryTitle: galleries.title,
        galleryDescription: galleries.description,
        galleryCreatedAt: galleries.createdAt,
        gallerySortOrder: galleries.sortOrder,
      })
      .from(galleryImages)
      .innerJoin(galleries, eq(galleryImages.galleryId, galleries.id))
      .orderBy(desc(galleryImages.createdAt))
      .limit(limit);

    return images.map(img => ({
      id: img.id,
      galleryId: img.galleryId,
      imageUrl: img.imageUrl,
      createdAt: img.createdAt,
      sortOrder: img.sortOrder,
      gallery: {
        id: img.galleryId,
        title: img.galleryTitle,
        description: img.galleryDescription,
        createdAt: img.galleryCreatedAt,
        sortOrder: img.gallerySortOrder,
      }
    }));
  }

  async createGallery(gallery: InsertGallery): Promise<Gallery> {
    const [newGallery] = await db.insert(galleries).values(gallery).returning();
    return newGallery;
  }

  async updateGallery(id: number, gallery: Partial<InsertGallery>): Promise<Gallery | undefined> {
    const [updatedGallery] = await db.update(galleries).set(gallery).where(eq(galleries.id, id)).returning();
    return updatedGallery || undefined;
  }

  async deleteGallery(id: number): Promise<boolean> {
    // Images will be cascade deleted by database constraint
    const result = await db.delete(galleries).where(eq(galleries.id, id));
    return result.rowCount !== null && result.rowCount > 0;
  }

  async addGalleryImages(galleryId: number, files: Express.Multer.File[]): Promise<GalleryImage[]> {
    const objectStorageService = new ObjectStorageService();
    const imageRecords: GalleryImage[] = [];

    // Get PUBLIC_OBJECT_SEARCH_PATHS to determine bucket
    const publicPaths = objectStorageService.getPublicObjectSearchPaths();
    const bucketPath = publicPaths[0]; // Use first public path

    for (const file of files) {
      // Generate unique filename
      const uniqueFilename = objectStorageService.generateUniqueFilename(file.originalname);
      
      // Upload to object storage
      const objectPath = `${bucketPath}/gallery-images/${uniqueFilename}`;
      const publicUrl = await objectStorageService.uploadFile(file, objectPath);

      // Save to database
      const [imageRecord] = await db.insert(galleryImages).values({
        galleryId,
        imageUrl: publicUrl,
      }).returning();

      imageRecords.push(imageRecord);
    }

    return imageRecords;
  }

  async deleteGalleryImage(imageId: number): Promise<boolean> {
    // Get image to delete from object storage
    const [image] = await db.select().from(galleryImages).where(eq(galleryImages.id, imageId));
    
    if (!image) return false;

    // Delete from object storage if URL starts with /public-objects/
    if (image.imageUrl.startsWith('/public-objects/')) {
      const objectStorageService = new ObjectStorageService();
      const publicPaths = objectStorageService.getPublicObjectSearchPaths();
      const bucketPath = publicPaths[0];
      
      // Extract filename from URL
      const filename = image.imageUrl.replace('/public-objects/', '');
      const objectPath = `${bucketPath}/public/${filename}`;
      
      await objectStorageService.deleteFile(objectPath);
    }

    // Delete from database
    const result = await db.delete(galleryImages).where(eq(galleryImages.id, imageId));
    return result.rowCount !== null && result.rowCount > 0;
  }
}

export const storage: IStorage = new DatabaseStorage();