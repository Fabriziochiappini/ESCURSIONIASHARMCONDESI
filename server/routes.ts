import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
// Authentication removed per user request
import { searchFiltersSchema, insertPropertySchema, insertPropertyImageSchema } from "@shared/schema";
import { z } from "zod";
import { upload, uploadImageToStorage, deleteImageFile } from "./imageUpload";
import { ObjectStorageService } from "./objectStorage";
import { migrateExistingImages } from "./migrateImages";
import express from "express";

export async function registerRoutes(app: Express): Promise<Server> {
  // Admin routes - no authentication required per user request
  
  // Migration endpoint for existing images
  app.post("/api/admin/migrate-images", async (req, res) => {
    try {
      const migratedCount = await migrateExistingImages();
      res.json({ 
        success: true, 
        message: `Successfully migrated ${migratedCount} images to object storage` 
      });
    } catch (error) {
      console.error("Migration error:", error);
      res.status(500).json({ error: "Migration failed" });
    }
  });
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
  // Get all properties
  app.get("/api/properties", async (req, res) => {
    try {
      const properties = await storage.getAllProperties();
      res.json(properties);
    } catch (error) {
      res.status(500).json({ message: "Error fetching properties" });
    }
  });

  // Get unique municipalities from properties
  app.get("/api/municipalities", async (req, res) => {
    try {
      const municipalities = await storage.getUniqueMunicipalities();
      res.json(municipalities);
    } catch (error) {
      res.status(500).json({ message: "Error fetching municipalities" });
    }
  });

  // Get featured properties
  app.get("/api/properties/featured", async (req, res) => {
    try {
      const properties = await storage.getFeaturedProperties();
      res.json(properties);
    } catch (error) {
      res.status(500).json({ message: "Error fetching featured properties" });
    }
  });

  // Search properties
  app.get("/api/properties/search", async (req, res) => {
    try {
      const filters = searchFiltersSchema.parse(req.query);
      const properties = await storage.searchProperties(filters);
      res.json(properties);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid search parameters", errors: error.errors });
      } else {
        res.status(500).json({ message: "Error searching properties" });
      }
    }
  });

  // Get single property
  app.get("/api/properties/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid property ID" });
      }

      const property = await storage.getProperty(id);
      if (!property) {
        return res.status(404).json({ message: "Property not found" });
      }

      res.json(property);
    } catch (error) {
      res.status(500).json({ message: "Error fetching property" });
    }
  });

  // Admin Property Management - no auth required
  app.post("/api/admin/properties", async (req, res) => {
    try {
      const property = insertPropertySchema.parse(req.body);
      const newProperty = await storage.createProperty(property);
      res.json(newProperty);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid property data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Error creating property" });
      }
    }
  });

  app.put("/api/admin/properties/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updates = insertPropertySchema.partial().parse(req.body);
      const updatedProperty = await storage.updateProperty(id, updates);
      if (!updatedProperty) {
        return res.status(404).json({ message: "Property not found" });
      }
      res.json(updatedProperty);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid property data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Error updating property" });
      }
    }
  });

  app.delete("/api/admin/properties/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteProperty(id);
      if (!success) {
        return res.status(404).json({ message: "Property not found" });
      }
      res.json({ message: "Property deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Error deleting property" });
    }
  });





  // Update properties order - admin only
  app.put("/api/admin/properties/reorder", async (req, res) => {
    try {
      const { properties: propertiesToUpdate } = req.body;
      
      if (!Array.isArray(propertiesToUpdate)) {
        return res.status(400).json({ message: "Properties must be an array" });
      }

      // Validate the properties array
      for (const prop of propertiesToUpdate) {
        if (!prop.id || typeof prop.sortOrder !== 'number') {
          return res.status(400).json({ message: "Each property must have id and sortOrder" });
        }
      }

      const success = await storage.updatePropertyOrder(propertiesToUpdate);
      
      if (!success) {
        return res.status(500).json({ message: "Failed to update property order" });
      }

      res.json({ message: "Property order updated successfully" });
    } catch (error: any) {
      console.error('Error updating property order:', error.message);
      res.status(500).json({ message: `Error updating property order: ${error.message}` });
    }
  });

  // Property Image Management
  app.get("/api/properties/:id/images", async (req, res) => {
    try {
      const propertyId = parseInt(req.params.id);
      const images = await storage.getPropertyImages(propertyId);
      res.json(images);
    } catch (error) {
      res.status(500).json({ message: "Error fetching property images" });
    }
  });

  app.post("/api/admin/properties/:id/images", async (req, res) => {
    try {
      const propertyId = parseInt(req.params.id);
      const imageData = { ...req.body, propertyId };
      const newImage = await storage.addPropertyImage(imageData);
      res.json(newImage);
    } catch (error) {
      res.status(500).json({ message: "Error adding property image" });
    }
  });

  app.delete("/api/admin/properties/images/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deletePropertyImage(id);
      if (!success) {
        return res.status(404).json({ message: "Image not found" });
      }
      res.json({ message: "Image deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Error deleting image" });
    }
  });

  // Contact form submission
  app.post("/api/contact", async (req, res) => {
    try {
      const { name, email, phone, message, propertyId } = req.body;
      
      // In a real application, this would send an email or save to database
      console.log("Contact form submission:", { name, email, phone, message, propertyId });
      
      res.json({ message: "Messaggio inviato con successo!" });
    } catch (error) {
      res.status(500).json({ message: "Errore nell'invio del messaggio" });
    }
  });

  // Dynamic sitemap.xml
  app.get("/sitemap.xml", async (req, res) => {
    try {
      const baseUrl = "https://agenzia2acireale.com";
      const properties = await storage.getAllProperties();
      
      let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}/</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${baseUrl}/servizi</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${baseUrl}/contatti</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>${baseUrl}/properties</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>`;

      // Add each property to sitemap
      properties.forEach(property => {
        sitemap += `
  <url>
    <loc>${baseUrl}/property/${property.id}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
  </url>`;
      });

      sitemap += `
</urlset>`;

      res.set('Content-Type', 'text/xml');
      res.send(sitemap);
    } catch (error) {
      console.error("Error generating sitemap:", error);
      res.status(500).send("Error generating sitemap");
    }
  });

  // Serve legacy uploaded images (fallback to local uploads)
  app.use('/uploads', express.static('uploads'));

  // This endpoint is used to serve public assets from object storage.
  app.get("/public-objects/:filePath(*)", async (req, res) => {
    const filePath = req.params.filePath;
    const objectStorageService = new ObjectStorageService();
    try {
      const file = await objectStorageService.searchPublicObject(filePath);
      if (!file) {
        return res.status(404).json({ error: "File not found" });
      }
      objectStorageService.downloadObject(file, res, req);
    } catch (error) {
      console.error("Error searching for public object:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  });

  // Image upload endpoint for admin with increased capacity for real estate
  app.post('/api/admin/upload-images', async (req, res) => {
    upload.array('images', 30)(req, res, async (err) => {
      if (err) {
        console.error('Upload error:', err);
        return res.status(400).json({ error: err.message });
      }

      try {
        if (!req.files || !Array.isArray(req.files)) {
          return res.status(400).json({ error: 'Nessuna immagine caricata' });
        }

        console.log(`Processing ${req.files.length} images for upload...`);
        const imageUrls: string[] = [];
        
        // Process images in parallel batches for better performance
        const batchSize = 5;
        for (let i = 0; i < req.files.length; i += batchSize) {
          const batch = req.files.slice(i, i + batchSize);
          const batchPromises = batch.map(async (file, index) => {
            try {
              const actualIndex = i + index;
              console.log(`Uploading image ${actualIndex + 1}/${req.files!.length}: ${file.originalname}`);
              const { url } = await uploadImageToStorage(file as Express.Multer.File);
              return { url, index: actualIndex };
            } catch (error) {
              console.error(`Error uploading image ${file.originalname}:`, error);
              throw error;
            }
          });
          
          const batchResults = await Promise.all(batchPromises);
          batchResults.forEach(result => {
            imageUrls[result.index] = result.url;
          });
        }
        
        // Filter out any failed uploads and maintain order
        const successfulUrls: string[] = imageUrls.filter((url): url is string => Boolean(url));
        
        res.json({ 
          success: true, 
          imageUrls: successfulUrls,
          message: `${successfulUrls.length} immagini caricate con successo su ${req.files.length} totali` 
        });
      } catch (error) {
        console.error('Error processing uploaded images:', error);
        res.status(500).json({ error: 'Errore nel caricamento delle immagini' });
      }
    });
  });

  // Property images routes
  app.get("/api/properties/:id/images", async (req, res) => {
    try {
      const propertyId = parseInt(req.params.id);
      const images = await storage.getPropertyImages(propertyId);
      res.json(images);
    } catch (error) {
      console.error("Error fetching property images:", error);
      res.status(500).json({ message: "Error fetching property images" });
    }
  });

  app.post("/api/properties/:id/images", upload.array('images', 30), async (req, res) => {
    try {
      const propertyId = parseInt(req.params.id);
      const files = req.files as Express.Multer.File[];
      
      if (!files || files.length === 0) {
        return res.status(400).json({ message: "No files uploaded" });
      }

      const uploadedImages = [];
      
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const { url, filename } = await uploadImageToStorage(file);
        
        const imageData = {
          propertyId,
          filename,
          originalName: file.originalname,
          url,
          size: file.size,
          mimeType: file.mimetype,
          sortOrder: i,
          isMain: i === 0 // First image is main by default
        };
        
        const savedImage = await storage.addPropertyImage(imageData);
        uploadedImages.push(savedImage);
      }

      res.json(uploadedImages);
    } catch (error) {
      console.error("Error uploading images:", error);
      res.status(500).json({ message: "Error uploading images" });
    }
  });

  app.delete("/api/property-images/:id", async (req, res) => {
    try {
      const imageId = parseInt(req.params.id);
      
      // Get all images to find the one to delete (temporary workaround)
      const allImages = await storage.getPropertyImages(0);
      const imageToDelete = allImages.find(img => img.id === imageId);
      
      if (imageToDelete) {
        // Delete from object storage
        await deleteImageFile(imageToDelete.filename);
        
        // Delete from database
        const deleted = await storage.deletePropertyImage(imageId);
        
        if (deleted) {
          res.json({ message: "Image deleted successfully" });
        } else {
          res.status(404).json({ message: "Image not found" });
        }
      } else {
        res.status(404).json({ message: "Image not found" });
      }
    } catch (error) {
      console.error("Error deleting image:", error);
      res.status(500).json({ message: "Error deleting image" });
    }
  });

  app.put("/api/property-images/reorder", async (req, res) => {
    try {
      const { images } = req.body;
      const success = await storage.updatePropertyImageOrder(images);
      
      if (success) {
        res.json({ message: "Images reordered successfully" });
      } else {
        res.status(500).json({ message: "Error reordering images" });
      }
    } catch (error) {
      console.error("Error reordering images:", error);
      res.status(500).json({ message: "Error reordering images" });
    }
  });

  app.put("/api/properties/:propertyId/images/:imageId/main", async (req, res) => {
    try {
      const propertyId = parseInt(req.params.propertyId);
      const imageId = parseInt(req.params.imageId);
      
      const success = await storage.setMainPropertyImage(propertyId, imageId);
      
      if (success) {
        res.json({ message: "Main image set successfully" });
      } else {
        res.status(500).json({ message: "Error setting main image" });
      }
    } catch (error) {
      console.error("Error setting main image:", error);
      res.status(500).json({ message: "Error setting main image" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
