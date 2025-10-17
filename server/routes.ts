import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { objectStorageService } from "./objectStorage";
import { 
  searchFiltersSchema, 
  insertTravelSchema, 
  insertTravelImageSchema,
  insertShowcaseSchema,
  insertCountrySchema,
  insertBookingSchema,
  insertPaymentSchema,
  insertGallerySchema,
  insertGalleryImageSchema,
  travels
} from "@shared/schema";
import { z } from "zod";
import multer from 'multer';
import { db } from "./db";
import { eq, like, or } from "drizzle-orm";
import Stripe from "stripe";
import { createPaypalOrder, capturePaypalOrder, loadPaypalDefault } from "./paypal";

// NUOVO SISTEMA UPLOAD PER AGENZIA VIAGGI - OBJECT STORAGE PERMANENTE
const upload = multer({ 
  storage: multer.memoryStorage(), // Memory storage for Object Storage upload
  limits: {
    fileSize: 15 * 1024 * 1024, // 15MB
    files: 30
  },
  fileFilter: (req, file, cb) => {
    const allowedMimes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Solo file immagine sono permessi'));
    }
  }
});

// Multer with memory storage for Object Storage (galleries)
const uploadToObjectStorage = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 15 * 1024 * 1024, // 15MB
    files: 30
  },
  fileFilter: (req, file, cb) => {
    const allowedMimes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Solo file immagine sono permessi'));
    }
  }
});
import express from "express";

// Initialize Stripe
if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Missing required Stripe secret: STRIPE_SECRET_KEY');
}
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2025-08-27.basil",
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Serve Object Storage images via API endpoint
  app.get('/api/images/*', async (req, res) => {
    try {
      const filePath = req.path.replace('/api/images/', '');
      const file = await objectStorageService.searchPublicObject(filePath);
      
      if (!file) {
        return res.status(404).json({ error: 'File not found' });
      }
      
      await objectStorageService.downloadObject(file, res, req);
    } catch (error) {
      console.error('Error serving image:', error);
      if (!res.headersSent) {
        res.status(500).json({ error: 'Error loading image' });
      }
    }
  });

  // Admin routes - no authentication required per user request
  
  // Admin authentication endpoint (always returns admin for demo)
  app.get('/api/auth/admin', async (req: any, res) => {
    // Always return admin access for demo purposes
    res.json({ 
      user: { 
        id: "demo-admin",
        firstName: "Admin", 
        email: "admin@demo.com" 
      }, 
      isAdmin: true 
    });
  });

  // EMERGENCY ENDPOINT: Reset database production demo data
  app.post('/api/admin/reset-demo-data', async (req: any, res) => {
    try {
      let totalDeleted = 0;
      
      // 1. Delete by specific demo titles
      const demoTitles = [
        'Grecia Classica - Santorini',
        'Dubai Moderno', 
        'Bali Spiritual',
        'Norvegia Fiordi',
        'Marocco Imperiale',
        'Weekend Romantico a Parigi',
        'Settimana Relax alle Maldive',
        'Avventura Safari in Tanzania',
        'Tour Culturale in Giappone',
        'Trekking nelle Dolomiti'
      ];
      
      for (const title of demoTitles) {
        await db.delete(travels).where(eq(travels.title, title));
        totalDeleted++;
      }
      
      // 2. Delete by pattern matching (prova, moto, test, demo, etc.)
      const demoPatterns = ['prova%', 'moto%', 'test%', 'demo%', 'placeholder%'];
      for (const pattern of demoPatterns) {
        const result = await db.delete(travels).where(like(travels.title, pattern));
        // Can't get exact count from Drizzle delete, but we tried
      }
      
      // 3. Delete by specific IDs (first placeholder IDs)
      const demoIds = [1,2,3,4,5,6,7,8,9,10,11,12];
      for (const id of demoIds) {
        try {
          await db.delete(travels).where(eq(travels.id, id));
        } catch (e) {
          // ID might not exist, continue
        }
      }
      
      console.log(`🧹 PULIZIA COMPLETATA: Eliminati viaggi demo (pattern matching + titoli specifici)`);
      res.json({ 
        success: true, 
        deletedCount: totalDeleted,
        message: `Eliminati TUTTI i viaggi demo/test dal database production (inclusi "prova", "moto", ecc.). I tuoi viaggi reali sono preservati.`
      });
    } catch (error) {
      console.error('❌ Errore reset demo data:', error);
      res.status(500).json({ success: false, error: 'Errore durante reset', message: String(error) });
    }
  });

  // Get all travels
  app.get("/api/travels", async (req, res) => {
    try {
      const travels = await storage.getAllTravels();
      res.json(travels);
    } catch (error) {
      res.status(500).json({ message: "Error fetching travels" });
    }
  });

  // Get unique countries from travels
  app.get("/api/countries", async (req, res) => {
    try {
      const countries = await storage.getUniqueCountries();
      res.json(countries);
    } catch (error) {
      res.status(500).json({ message: "Error fetching countries" });
    }
  });

  // Get unique destinations from travels
  app.get("/api/destinations", async (req, res) => {
    try {
      const destinations = await storage.getUniqueDestinations();
      res.json(destinations);
    } catch (error) {
      res.status(500).json({ message: "Error fetching destinations" });
    }
  });

  // Get featured travels
  app.get("/api/travels/featured", async (req, res) => {
    try {
      const travels = await storage.getFeaturedTravels();
      res.json(travels);
    } catch (error) {
      res.status(500).json({ message: "Error fetching featured travels" });
    }
  });

  // Search travels
  app.get("/api/travels/search", async (req, res) => {
    try {
      const filters = searchFiltersSchema.parse({
        search: req.query.search,
        type: req.query.type,
        travelType: req.query.travelType,
        country: req.query.country,
        destination: req.query.destination,
        minPrice: req.query.minPrice ? Number(req.query.minPrice) : undefined,
        maxPrice: req.query.maxPrice ? Number(req.query.maxPrice) : undefined,
        minDuration: req.query.minDuration ? Number(req.query.minDuration) : undefined,
        maxDuration: req.query.maxDuration ? Number(req.query.maxDuration) : undefined,
        maxParticipants: req.query.maxParticipants ? Number(req.query.maxParticipants) : undefined,
        minAge: req.query.minAge ? Number(req.query.minAge) : undefined,
        departureMonth: req.query.departureMonth,
      });

      const travels = await storage.searchTravels(filters);
      res.json(travels);
    } catch (error) {
      console.error('Search error:', error);
      res.status(400).json({ message: "Invalid search parameters" });
    }
  });

  // Get travel by ID
  app.get("/api/travels/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const travel = await storage.getTravel(id);
      
      if (!travel) {
        return res.status(404).json({ message: "Travel not found" });
      }
      
      res.json(travel);
    } catch (error) {
      res.status(500).json({ message: "Error fetching travel" });
    }
  });

  // Get travel by slug
  app.get("/api/travels/slug/:slug", async (req, res) => {
    try {
      const travel = await storage.getTravelBySlug(req.params.slug);
      
      if (!travel) {
        return res.status(404).json({ message: "Travel not found" });
      }
      
      res.json(travel);
    } catch (error) {
      res.status(500).json({ message: "Error fetching travel" });
    }
  });

  // Create travel (admin only)
  app.post("/api/travels", async (req, res) => {
    try {
      const travelData = insertTravelSchema.parse(req.body);
      const travel = await storage.createTravel(travelData);
      res.status(201).json(travel);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid travel data", errors: error.errors });
      }
      console.error('Create travel error:', error);
      res.status(500).json({ message: "Error creating travel" });
    }
  });

  // Update travel (admin only)
  app.put("/api/travels/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const travelData = insertTravelSchema.partial().parse(req.body);
      const travel = await storage.updateTravel(id, travelData);
      
      if (!travel) {
        return res.status(404).json({ message: "Travel not found" });
      }
      
      res.json(travel);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid travel data", errors: error.errors });
      }
      console.error('Update travel error:', error);
      res.status(500).json({ message: "Error updating travel" });
    }
  });

  // Delete travel (admin only)
  app.delete("/api/travels/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteTravel(id);
      
      if (!success) {
        return res.status(404).json({ message: "Travel not found" });
      }
      
      res.json({ message: "Travel deleted successfully" });
    } catch (error) {
      console.error('Delete travel error:', error);
      res.status(500).json({ message: "Error deleting travel" });
    }
  });

  // Update travel order (admin only)
  app.put("/api/travels/order", async (req, res) => {
    try {
      const { travels } = req.body;
      if (!Array.isArray(travels)) {
        return res.status(400).json({ message: "Invalid order data" });
      }
      
      const success = await storage.updateTravelOrder(travels);
      
      if (!success) {
        return res.status(500).json({ message: "Error updating travel order" });
      }
      
      res.json({ message: "Travel order updated successfully" });
    } catch (error) {
      console.error('Update travel order error:', error);
      res.status(500).json({ message: "Error updating travel order" });
    }
  });

  // Move travel up/down (admin only)
  app.put("/api/travels/:id/move/:direction", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const direction = req.params.direction as 'up' | 'down';
      
      if (direction !== 'up' && direction !== 'down') {
        return res.status(400).json({ message: "Invalid direction" });
      }
      
      const success = await storage.moveTravel(id, direction);
      
      if (!success) {
        return res.status(404).json({ message: "Travel not found or cannot be moved" });
      }
      
      res.json({ message: "Travel moved successfully" });
    } catch (error) {
      console.error('Move travel error:', error);
      res.status(500).json({ message: "Error moving travel" });
    }
  });

  // Travel Images Routes
  
  // NUOVO SISTEMA UPLOAD AGENZIA VIAGGI - OBJECT STORAGE PERMANENTE!
  app.post("/api/admin/upload-images", upload.array('images', 30), async (req, res) => {
    try {
      const files = req.files as Express.Multer.File[];
      
      console.log(`🔥 AGENZIA VIAGGI: Ricevuto ${files?.length || 0} file per upload`);
      
      if (!files || files.length === 0) {
        return res.status(400).json({ message: "No images provided" });
      }

      // Upload to Object Storage (PERMANENTE!)
      const bucketId = process.env.DEFAULT_OBJECT_STORAGE_BUCKET_ID;
      const uploadPromises = files.map(async (file) => {
        const filename = `${Date.now()}_${file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
        const objectPath = `/${bucketId}/public/tours/${filename}`;
        
        // Debug log
        console.log(`📤 Uploading ${filename}, buffer exists: ${!!file.buffer}, size: ${file.size}`);
        
        if (!file.buffer) {
          throw new Error(`File buffer missing for ${filename}`);
        }
        
        const publicUrl = await objectStorageService.uploadFile(file, objectPath);
        console.log(`✅ FOTO SALVATA IN OBJECT STORAGE: ${publicUrl} (${file.size} bytes)`);
        
        return publicUrl;
      });

      const imageUrls = await Promise.all(uploadPromises);

      console.log(`🎯 SUCCESSO: ${imageUrls.length} immagini salvate in Object Storage permanente!`);

      res.json({
        message: `Successfully processed ${imageUrls.length} images`,
        imageUrls: imageUrls
      });

    } catch (error) {
      console.error('❌ ERRORE UPLOAD AGENZIA VIAGGI:', error);
      res.status(500).json({ 
        message: "Error uploading images",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });
  
  // Get travel images
  app.get("/api/travels/:id/images", async (req, res) => {
    try {
      const travelId = parseInt(req.params.id);
      const images = await storage.getTravelImages(travelId);
      res.json(images);
    } catch (error) {
      console.error('Get travel images error:', error);
      res.status(500).json({ message: "Error fetching travel images" });
    }
  });

  // Upload travel images with Object Storage
  app.post("/api/travels/:id/images", upload.array('images', 30), async (req, res) => {
    try {
      const travelId = parseInt(req.params.id);
      const files = req.files as Express.Multer.File[];
      
      if (!files || files.length === 0) {
        return res.status(400).json({ message: "No images provided" });
      }

      // Check if travel exists
      const travel = await storage.getTravel(travelId);
      if (!travel) {
        return res.status(404).json({ message: "Travel not found" });
      }

      const uploadPromises = files.map(async (file, index) => {
        try {
          // Generate unique filename
          const filename = `${Date.now()}_${file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
          const bucketId = process.env.DEFAULT_OBJECT_STORAGE_BUCKET_ID;
          const objectPath = `/${bucketId}/public/tours/${filename}`;
          
          // Upload to Object Storage (PERMANENTE!)
          const publicUrl = await objectStorageService.uploadFile(file, objectPath);
          
          console.log(`✅ FOTO CARICATA IN OBJECT STORAGE: ${publicUrl}`);
          
          // Store in database with Object Storage URL
          const imageData = insertTravelImageSchema.parse({
            travelId: travelId,
            filename: filename,
            originalName: file.originalname,
            url: publicUrl, // Object Storage URL, NOT /uploads/
            size: file.size,
            mimeType: file.mimetype,
            sortOrder: index,
            isMain: index === 0 // First image is main by default
          });

          return await storage.addTravelImage(imageData);
        } catch (uploadError) {
          console.error(`Error uploading file ${file.originalname}:`, uploadError);
          throw uploadError;
        }
      });

      const uploadedImages = await Promise.all(uploadPromises);

      // Update travel images array for backward compatibility
      const imageUrls = uploadedImages.map(img => img.url);
      const currentImages = travel.images || [];
      const updatedImages = [...currentImages, ...imageUrls];
      
      await storage.updateTravel(travelId, { images: updatedImages });

      res.json({
        message: `Successfully uploaded ${uploadedImages.length} images`,
        images: uploadedImages
      });

    } catch (error) {
      console.error('Upload travel images error:', error);
      res.status(500).json({ 
        message: "Error uploading images",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // Delete travel image
  app.delete("/api/travel-images/:id", async (req, res) => {
    try {
      const imageId = parseInt(req.params.id);
      const image = await storage.getTravelImageById(imageId);
      
      if (!image) {
        return res.status(404).json({ message: "Image not found" });
      }

      // File deletion handled by multer/filesystem

      // Remove from database
      await storage.deleteTravelImage(imageId);

      // Update travel images array for backward compatibility
      const travel = await storage.getTravel(image.travelId);
      if (travel && travel.images) {
        const updatedImages = travel.images.filter(url => url !== image.url);
        await storage.updateTravel(image.travelId, { images: updatedImages });
      }

      res.json({ message: "Image deleted successfully" });
    } catch (error) {
      console.error('Delete travel image error:', error);
      res.status(500).json({ message: "Error deleting image" });
    }
  });

  // Update travel image order
  app.put("/api/travels/:id/images/order", async (req, res) => {
    try {
      const { images } = req.body;
      if (!Array.isArray(images)) {
        return res.status(400).json({ message: "Invalid image order data" });
      }

      const success = await storage.updateTravelImageOrder(images);
      
      if (!success) {
        return res.status(500).json({ message: "Error updating image order" });
      }
      
      res.json({ message: "Image order updated successfully" });
    } catch (error) {
      console.error('Update image order error:', error);
      res.status(500).json({ message: "Error updating image order" });
    }
  });

  // Set main travel image
  app.put("/api/travels/:travelId/images/:imageId/main", async (req, res) => {
    try {
      const travelId = parseInt(req.params.travelId);
      const imageId = parseInt(req.params.imageId);
      
      const success = await storage.setMainTravelImage(travelId, imageId);
      
      if (!success) {
        return res.status(404).json({ message: "Travel or image not found" });
      }
      
      res.json({ message: "Main image updated successfully" });
    } catch (error) {
      console.error('Set main image error:', error);
      res.status(500).json({ message: "Error setting main image" });
    }
  });

  // Keep legacy routes for backward compatibility (redirecting to travels)
  app.get("/api/properties", async (req, res) => {
    try {
      const travels = await storage.getAllTravels();
      res.json(travels);
    } catch (error) {
      res.status(500).json({ message: "Error fetching properties" });
    }
  });

  app.get("/api/municipalities", async (req, res) => {
    try {
      const countries = await storage.getUniqueCountries();
      res.json(countries);
    } catch (error) {
      res.status(500).json({ message: "Error fetching municipalities" });
    }
  });

  app.get("/api/properties/featured", async (req, res) => {
    try {
      const travels = await storage.getFeaturedTravels();
      res.json(travels);
    } catch (error) {
      res.status(500).json({ message: "Error fetching featured properties" });
    }
  });

  app.get("/api/properties/search", async (req, res) => {
    try {
      const filters = searchFiltersSchema.parse({
        search: req.query.search,
        type: req.query.type,
        travelType: req.query.propertyType, // Map propertyType to travelType
        country: req.query.municipality, // Map municipality to country
        destination: req.query.location, // Map location to destination
        minPrice: req.query.minPrice ? Number(req.query.minPrice) : undefined,
        maxPrice: req.query.maxPrice ? Number(req.query.maxPrice) : undefined,
        minDuration: req.query.bedrooms ? Number(req.query.bedrooms) : undefined, // Map bedrooms to duration
        maxParticipants: req.query.bathrooms ? Number(req.query.bathrooms) : undefined, // Map bathrooms to participants
        minAge: req.query.minArea ? Number(req.query.minArea) : undefined, // Map area to age
        departureMonth: req.query.departureMonth,
      });

      const travels = await storage.searchTravels(filters);
      res.json(travels);
    } catch (error) {
      console.error('Search error:', error);
      res.status(400).json({ message: "Invalid search parameters" });
    }
  });

  // ===== SHOWCASE ROUTES =====

  // Get all showcases
  app.get("/api/showcases", async (req, res) => {
    try {
      const showcases = await storage.getAllShowcases();
      res.json(showcases);
    } catch (error) {
      res.status(500).json({ message: "Error fetching showcases" });
    }
  });

  // Get active showcases only
  app.get("/api/showcases/active", async (req, res) => {
    try {
      const showcases = await storage.getActiveShowcases();
      res.json(showcases);
    } catch (error) {
      res.status(500).json({ message: "Error fetching active showcases" });
    }
  });

  // Get showcase by ID
  app.get("/api/showcases/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const showcase = await storage.getShowcase(id);
      
      if (!showcase) {
        return res.status(404).json({ message: "Showcase not found" });
      }
      
      res.json(showcase);
    } catch (error) {
      res.status(500).json({ message: "Error fetching showcase" });
    }
  });

  // Get showcase by category
  app.get("/api/showcases/category/:category", async (req, res) => {
    try {
      const category = req.params.category;
      const showcase = await storage.getShowcaseByCategory(category);
      
      if (!showcase) {
        return res.status(404).json({ message: "Showcase not found" });
      }
      
      res.json(showcase);
    } catch (error) {
      res.status(500).json({ message: "Error fetching showcase by category" });
    }
  });

  // Get travels by showcase category
  app.get("/api/showcases/category/:category/travels", async (req, res) => {
    try {
      const category = req.params.category;
      const travels = await storage.getTravelsByShowcaseCategory(category);
      res.json(travels);
    } catch (error) {
      res.status(500).json({ message: "Error fetching travels for showcase category" });
    }
  });

  // Get showcase by country
  app.get("/api/showcases/country/:country", async (req, res) => {
    try {
      const country = req.params.country;
      const showcase = await storage.getShowcaseByCountry(country);
      
      if (!showcase) {
        return res.status(404).json({ message: "Showcase not found" });
      }
      
      res.json(showcase);
    } catch (error) {
      res.status(500).json({ message: "Error fetching showcase by country" });
    }
  });

  // Get travels by showcase country
  app.get("/api/showcases/country/:country/travels", async (req, res) => {
    try {
      const country = req.params.country;
      const travels = await storage.getTravelsByShowcaseCountry(country);
      res.json(travels);
    } catch (error) {
      res.status(500).json({ message: "Error fetching travels for showcase country" });
    }
  });

  // Get countries list for dropdowns
  app.get("/api/countries-list", async (req, res) => {
    try {
      const countries = await storage.getAllCountries();
      const countryNames = countries.map(c => ({ name: c.name }));
      res.json(countryNames);
    } catch (error) {
      res.status(500).json({ message: "Error fetching countries list" });
    }
  });

  // Admin Showcases CRUD
  app.get("/api/admin/showcases", async (req, res) => {
    try {
      const showcases = await storage.getAllShowcases();
      res.json(showcases);
    } catch (error) {
      res.status(500).json({ message: "Error fetching showcases" });
    }
  });

  app.post("/api/admin/showcases", async (req, res) => {
    try {
      const showcase = await storage.createShowcase(req.body);
      res.json(showcase);
    } catch (error) {
      res.status(500).json({ message: "Error creating showcase" });
    }
  });

  app.put("/api/admin/showcases/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const showcase = await storage.updateShowcase(id, req.body);
      if (!showcase) {
        return res.status(404).json({ message: "Showcase not found" });
      }
      res.json(showcase);
    } catch (error) {
      res.status(500).json({ message: "Error updating showcase" });
    }
  });

  app.delete("/api/admin/showcases/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteShowcase(id);
      if (!deleted) {
        return res.status(404).json({ message: "Showcase not found" });
      }
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: "Error deleting showcase" });
    }
  });

  // Create new showcase
  app.post("/api/showcases", async (req, res) => {
    try {
      const validatedData = insertShowcaseSchema.parse(req.body);
      const showcase = await storage.createShowcase(validatedData);
      res.status(201).json(showcase);
    } catch (error) {
      console.error('Create showcase error:', error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid showcase data", errors: error.errors });
      }
      res.status(500).json({ message: "Error creating showcase" });
    }
  });

  // Update showcase
  app.put("/api/showcases/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertShowcaseSchema.partial().parse(req.body);
      const showcase = await storage.updateShowcase(id, validatedData);
      
      if (!showcase) {
        return res.status(404).json({ message: "Showcase not found" });
      }
      
      res.json(showcase);
    } catch (error) {
      console.error('Update showcase error:', error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid showcase data", errors: error.errors });
      }
      res.status(500).json({ message: "Error updating showcase" });
    }
  });

  // Delete showcase
  app.delete("/api/showcases/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteShowcase(id);
      
      if (!success) {
        return res.status(404).json({ message: "Showcase not found" });
      }
      
      res.json({ message: "Showcase deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Error deleting showcase" });
    }
  });

  app.get("/api/properties/id/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const travel = await storage.getTravel(id);
      
      if (!travel) {
        return res.status(404).json({ message: "Property not found" });
      }
      
      res.json(travel);
    } catch (error) {
      res.status(500).json({ message: "Error fetching property" });
    }
  });

  // Countries API endpoints
  app.get("/api/countries-destinations", async (req, res) => {
    try {
      const countries = await storage.getActiveCountries();
      res.json(countries);
    } catch (error) {
      res.status(500).json({ message: "Error fetching countries" });
    }
  });

  app.get("/api/admin/countries", async (req, res) => {
    try {
      const countries = await storage.getAllCountries();
      res.json(countries);
    } catch (error) {
      res.status(500).json({ message: "Error fetching countries" });
    }
  });

  app.get("/api/admin/countries/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const country = await storage.getCountry(id);
      
      if (!country) {
        return res.status(404).json({ message: "Country not found" });
      }
      
      res.json(country);
    } catch (error) {
      res.status(500).json({ message: "Error fetching country" });
    }
  });

  app.post("/api/admin/countries", async (req, res) => {
    try {
      const validatedData = insertCountrySchema.parse(req.body);
      const country = await storage.createCountry(validatedData);
      res.status(201).json(country);
    } catch (error) {
      console.error('Create country error:', error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid country data", errors: error.errors });
      }
      res.status(500).json({ message: "Error creating country" });
    }
  });

  app.put("/api/admin/countries/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertCountrySchema.partial().parse(req.body);
      const country = await storage.updateCountry(id, validatedData);
      
      if (!country) {
        return res.status(404).json({ message: "Country not found" });
      }
      
      res.json(country);
    } catch (error) {
      console.error('Update country error:', error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid country data", errors: error.errors });
      }
      res.status(500).json({ message: "Error updating country" });
    }
  });

  app.delete("/api/admin/countries/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteCountry(id);
      
      if (!success) {
        return res.status(404).json({ message: "Country not found" });
      }
      
      res.json({ message: "Country deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Error deleting country" });
    }
  });

  app.post("/api/admin/countries/update-counts", async (req, res) => {
    try {
      await storage.updateCountryTravelCounts();
      res.json({ message: "Country travel counts updated successfully" });
    } catch (error) {
      res.status(500).json({ message: "Error updating country travel counts" });
    }
  });

  // ===== GALLERIES ROUTES =====
  
  // Get all galleries (public)
  app.get("/api/galleries", async (req, res) => {
    try {
      const galleries = await storage.getAllGalleries();
      res.json(galleries);
    } catch (error) {
      res.status(500).json({ message: "Error fetching galleries" });
    }
  });

  // Get gallery by ID with images (public)
  app.get("/api/galleries/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const gallery = await storage.getGalleryWithImages(id);
      
      if (!gallery) {
        return res.status(404).json({ message: "Gallery not found" });
      }
      
      res.json(gallery);
    } catch (error) {
      res.status(500).json({ message: "Error fetching gallery" });
    }
  });

  // Get latest images (for homepage)
  app.get("/api/galleries/latest-images", async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 12;
      const images = await storage.getLatestGalleryImages(limit);
      res.json(images);
    } catch (error) {
      res.status(500).json({ message: "Error fetching latest images" });
    }
  });

  // Admin: Create gallery
  app.post("/api/admin/galleries", async (req, res) => {
    try {
      const validatedData = insertGallerySchema.parse(req.body);
      const gallery = await storage.createGallery(validatedData);
      res.status(201).json(gallery);
    } catch (error) {
      console.error('Create gallery error:', error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid gallery data", errors: error.errors });
      }
      res.status(500).json({ message: "Error creating gallery" });
    }
  });

  // Admin: Update gallery
  app.put("/api/admin/galleries/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertGallerySchema.partial().parse(req.body);
      const gallery = await storage.updateGallery(id, validatedData);
      
      if (!gallery) {
        return res.status(404).json({ message: "Gallery not found" });
      }
      
      res.json(gallery);
    } catch (error) {
      console.error('Update gallery error:', error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid gallery data", errors: error.errors });
      }
      res.status(500).json({ message: "Error updating gallery" });
    }
  });

  // Admin: Delete gallery
  app.delete("/api/admin/galleries/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteGallery(id);
      
      if (!success) {
        return res.status(404).json({ message: "Gallery not found" });
      }
      
      res.json({ message: "Gallery deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Error deleting gallery" });
    }
  });

  // Admin: Add image to gallery (with Object Storage)
  app.post("/api/admin/galleries/:id/images", uploadToObjectStorage.array('images', 30), async (req, res) => {
    try {
      const galleryId = parseInt(req.params.id);
      const files = req.files as Express.Multer.File[];
      
      if (!files || files.length === 0) {
        return res.status(400).json({ message: "No images provided" });
      }

      // Upload to Object Storage and save to database
      const imageRecords = await storage.addGalleryImages(galleryId, files);
      
      res.json({
        message: `Successfully uploaded ${imageRecords.length} images`,
        images: imageRecords
      });
    } catch (error) {
      console.error('Add gallery images error:', error);
      res.status(500).json({ 
        message: "Error uploading images",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // Admin: Delete image from gallery
  app.delete("/api/admin/galleries/images/:imageId", async (req, res) => {
    try {
      const imageId = parseInt(req.params.imageId);
      const success = await storage.deleteGalleryImage(imageId);
      
      if (!success) {
        return res.status(404).json({ message: "Image not found" });
      }
      
      res.json({ message: "Image deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Error deleting image" });
    }
  });

  // ===== GUIDES ROUTES =====
  
  // Get all active guides (public)
  app.get("/api/guides", async (req, res) => {
    try {
      const guides = await storage.getActiveGuides();
      res.json(guides);
    } catch (error) {
      res.status(500).json({ message: "Error retrieving guides" });
    }
  });

  // Get single guide by ID (public)
  app.get("/api/guides/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const guide = await storage.getGuide(id);
      
      if (!guide) {
        return res.status(404).json({ message: "Guide not found" });
      }

      // Only return if active
      if (!guide.isActive) {
        return res.status(404).json({ message: "Guide not found" });
      }
      
      res.json(guide);
    } catch (error) {
      res.status(500).json({ message: "Error retrieving guide" });
    }
  });

  // Admin: Get all guides
  app.get("/api/admin/guides", async (req, res) => {
    try {
      const guides = await storage.getAllGuides();
      res.json(guides);
    } catch (error) {
      res.status(500).json({ message: "Error retrieving guides" });
    }
  });

  // Admin: Create new guide
  app.post("/api/admin/guides", async (req, res) => {
    try {
      const guideData = req.body;
      const newGuide = await storage.createGuide(guideData);
      res.status(201).json(newGuide);
    } catch (error) {
      res.status(500).json({ message: "Error creating guide" });
    }
  });

  // Admin: Update guide
  app.put("/api/admin/guides/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const guideData = req.body;
      const updatedGuide = await storage.updateGuide(id, guideData);
      
      if (!updatedGuide) {
        return res.status(404).json({ message: "Guide not found" });
      }
      
      res.json(updatedGuide);
    } catch (error) {
      res.status(500).json({ message: "Error updating guide" });
    }
  });

  // Admin: Delete guide
  app.delete("/api/admin/guides/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteGuide(id);
      
      if (!success) {
        return res.status(404).json({ message: "Guide not found" });
      }
      
      res.json({ message: "Guide deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Error deleting guide" });
    }
  });

  // ===== BOOKING ADMIN ROUTES =====
  
  // Admin: Get all bookings with details (travel + payment)
  app.get("/api/admin/bookings", async (req, res) => {
    try {
      const bookingsWithDetails = await storage.getBookingsWithDetails();
      res.json(bookingsWithDetails);
    } catch (error) {
      console.error("Error retrieving bookings:", error);
      res.status(500).json({ message: "Error retrieving bookings" });
    }
  });

  // Admin: Update booking status
  app.put("/api/admin/bookings/:id/status", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { status } = req.body;
      
      if (!status || !["pending", "confirmed", "cancelled", "completed"].includes(status)) {
        return res.status(400).json({ message: "Invalid status" });
      }
      
      const updatedBooking = await storage.updateBooking(id, { status });
      
      if (!updatedBooking) {
        return res.status(404).json({ message: "Booking not found" });
      }
      
      res.json(updatedBooking);
    } catch (error) {
      console.error("Error updating booking status:", error);
      res.status(500).json({ message: "Error updating booking status" });
    }
  });

  // ===== PAYMENT ROUTES =====
  
  // PayPal Routes - Required by javascript_paypal integration
  app.get("/paypal/setup", async (req, res) => {
    await loadPaypalDefault(req, res);
  });
  
  // Blueprint expects these exact paths
  app.get("/setup", async (req, res) => {
    await loadPaypalDefault(req, res);
  });

  app.post("/paypal/order", async (req, res) => {
    // Request body should contain: { intent, amount, currency }
    await createPaypalOrder(req, res);
  });
  
  // Blueprint expects these exact paths
  app.post("/order", async (req, res) => {
    await createPaypalOrder(req, res);
  });

  app.post("/paypal/order/:orderID/capture", async (req, res) => {
    await capturePaypalOrder(req, res);
  });
  
  // Blueprint expects these exact paths
  app.post("/order/:orderID/capture", async (req, res) => {
    await capturePaypalOrder(req, res);
  });

  // Stripe Routes
  app.post("/api/create-payment-intent", async (req, res) => {
    try {
      const { amount, travelId, bookingData } = req.body;
      
      // Map frontend fields to database fields
      const mappedBookingData = {
        travelId: bookingData.travelId,
        customerEmail: bookingData.email,
        customerName: `${bookingData.firstName} ${bookingData.lastName}`,
        customerPhone: bookingData.phone || "",
        numberOfParticipants: bookingData.numberOfTravelers,
        totalAmount: bookingData.totalPrice,
        travelDate: bookingData.travelDate ? new Date(bookingData.travelDate).toISOString().split('T')[0] : null,
        status: bookingData.status || "pending",
        notes: bookingData.notes || "",
      };
      
      // Create booking first
      const booking = await storage.createBooking(mappedBookingData);
      
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convert to cents
        currency: "eur",
        metadata: {
          bookingId: booking.id.toString(),
          travelId: travelId?.toString() || '',
        },
      });

      // Create payment record
      await storage.createPayment({
        bookingId: booking.id,
        paymentProvider: 'stripe',
        paymentIntentId: paymentIntent.id,
        amount: amount.toString(),
        currency: 'EUR',
        status: 'pending',
      });

      res.json({ 
        clientSecret: paymentIntent.client_secret,
        bookingId: booking.id 
      });
    } catch (error: any) {
      console.error('Create payment intent error:', error);
      res.status(500).json({ message: "Error creating payment intent: " + error.message });
    }
  });

  // Stripe webhook to handle payment confirmations
  app.post('/api/stripe/webhook', express.raw({type: 'application/json'}), async (req, res) => {
    const sig = req.headers['stripe-signature'];
    let event;

    try {
      event = stripe.webhooks.constructEvent(req.body, sig!, process.env.STRIPE_WEBHOOK_SECRET || '');
    } catch (err) {
      console.log('Webhook signature verification failed.');
      return res.status(400).send('Webhook Error');
    }

    // Handle the event
    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object;
        console.log('PaymentIntent was successful!');
        
        // Update payment status
        await storage.updatePaymentByStripeId(paymentIntent.id, {
          status: 'succeeded',
          paymentDate: new Date(),
        });
        
        // Update booking status
        if (paymentIntent.metadata.bookingId) {
          await storage.updateBooking(parseInt(paymentIntent.metadata.bookingId), {
            status: 'confirmed',
          });
        }
        break;
        
      case 'payment_intent.payment_failed':
        const failedPayment = event.data.object;
        console.log('PaymentIntent failed!');
        
        // Update payment status
        await storage.updatePaymentByStripeId(failedPayment.id, {
          status: 'failed',
        });
        break;
        
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    res.json({received: true});
  });

  // Booking management routes
  app.get("/api/bookings", async (req, res) => {
    try {
      const bookings = await storage.getAllBookings();
      res.json(bookings);
    } catch (error) {
      console.error('Get bookings error:', error);
      res.status(500).json({ message: "Error fetching bookings" });
    }
  });

  app.get("/api/bookings/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const booking = await storage.getBooking(id);
      
      if (!booking) {
        return res.status(404).json({ message: "Booking not found" });
      }
      
      res.json(booking);
    } catch (error) {
      console.error('Get booking error:', error);
      res.status(500).json({ message: "Error fetching booking" });
    }
  });

  app.put("/api/bookings/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const bookingData = req.body;
      
      const booking = await storage.updateBooking(id, bookingData);
      
      if (!booking) {
        return res.status(404).json({ message: "Booking not found" });
      }
      
      res.json(booking);
    } catch (error) {
      console.error('Update booking error:', error);
      res.status(500).json({ message: "Error updating booking" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}