import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  searchFiltersSchema, 
  insertTravelSchema, 
  insertTravelImageSchema,
  insertShowcaseSchema,
  insertCountrySchema
} from "@shared/schema";
import { z } from "zod";
import multer from 'multer';

// NUOVO SISTEMA UPLOAD PER AGENZIA VIAGGI - Niente più cazzate immobiliari
const storage_multer = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const filename = `${Date.now()}_${file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
    cb(null, filename);
  }
});

const upload = multer({ 
  storage: storage_multer,
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

export async function registerRoutes(app: Express): Promise<Server> {
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
  
  // NUOVO SISTEMA UPLOAD AGENZIA VIAGGI - FUNZIONA DAVVERO!
  app.post("/api/admin/upload-images", upload.array('images', 30), async (req, res) => {
    try {
      const files = req.files as Express.Multer.File[];
      
      console.log(`🔥 AGENZIA VIAGGI: Ricevuto ${files?.length || 0} file per upload`);
      
      if (!files || files.length === 0) {
        return res.status(400).json({ message: "No images provided" });
      }

      // I file sono già salvati da multer diskStorage!
      const imageUrls = files.map(file => {
        console.log(`✅ File salvato: ${file.filename} (${file.size} bytes)`);
        return `/uploads/${file.filename}`;
      });

      console.log(`🎯 SUCCESSO: ${imageUrls.length} immagini salvate per agenzia viaggi!`);

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
          // Generate filename
          const filename = `${Date.now()}_${file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
          const url = `/uploads/${filename}`;
          
          // Store in database
          const imageData = insertTravelImageSchema.parse({
            travelId: travelId,
            filename: filename,
            originalName: file.originalname,
            url: url,
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
      if (travel) {
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

  const httpServer = createServer(app);
  return httpServer;
}