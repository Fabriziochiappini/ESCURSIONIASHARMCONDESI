import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
// Authentication removed per user request
import { searchFiltersSchema, insertPropertySchema, insertBlogPostSchema, insertPropertyImageSchema } from "@shared/schema";
import { z } from "zod";
import { upload, getImageUrl, deleteImageFile } from "./imageUpload";
import express from "express";

export async function registerRoutes(app: Express): Promise<Server> {
  // Admin routes - no authentication required per user request
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

  // Blog Posts (Public)
  app.get("/api/blog/posts", async (req, res) => {
    try {
      const published = req.query.published !== 'false';
      const posts = await storage.getAllBlogPosts(published);
      res.json(posts);
    } catch (error) {
      res.status(500).json({ message: "Error fetching blog posts" });
    }
  });

  app.get("/api/blog/posts/featured", async (req, res) => {
    try {
      const posts = await storage.getFeaturedBlogPosts();
      res.json(posts);
    } catch (error) {
      res.status(500).json({ message: "Error fetching featured blog posts" });
    }
  });

  app.get("/api/blog/posts/search", async (req, res) => {
    try {
      const { q: query, category } = req.query;
      const posts = await storage.searchBlogPosts(query as string, category as string);
      res.json(posts);
    } catch (error) {
      res.status(500).json({ message: "Error searching blog posts" });
    }
  });

  app.get("/api/blog/posts/:slug", async (req, res) => {
    try {
      const { slug } = req.params;
      const post = await storage.getBlogPostBySlug(slug);
      if (!post) {
        return res.status(404).json({ message: "Blog post not found" });
      }
      
      // Increment views for published posts
      if (post.published) {
        await storage.incrementBlogPostViews(post.id);
      }
      
      res.json(post);
    } catch (error) {
      res.status(500).json({ message: "Error fetching blog post" });
    }
  });

  // Admin Blog Management - no auth required
  app.get("/api/admin/blog/posts", async (req, res) => {
    try {
      const posts = await storage.getAllBlogPosts(); // Get all posts including drafts
      res.json(posts);
    } catch (error) {
      res.status(500).json({ message: "Error fetching blog posts" });
    }
  });

  app.post("/api/admin/blog/posts", async (req: any, res) => {
    try {
      const postData = insertBlogPostSchema.parse({
        ...req.body,
        authorId: "demo-admin"
      });
      const newPost = await storage.createBlogPost(postData);
      res.json(newPost);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid blog post data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Error creating blog post" });
      }
    }
  });

  app.put("/api/admin/blog/posts/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updates = insertBlogPostSchema.partial().parse(req.body);
      const updatedPost = await storage.updateBlogPost(id, updates);
      if (!updatedPost) {
        return res.status(404).json({ message: "Blog post not found" });
      }
      res.json(updatedPost);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid blog post data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Error updating blog post" });
      }
    }
  });

  app.delete("/api/admin/blog/posts/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteBlogPost(id);
      if (!success) {
        return res.status(404).json({ message: "Blog post not found" });
      }
      res.json({ message: "Blog post deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Error deleting blog post" });
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

  // Serve uploaded images
  app.use('/uploads', express.static('uploads'));

  // Image upload endpoint for admin
  app.post('/api/admin/upload-images', async (req, res) => {
    upload.array('images', 20)(req, res, (err) => {
      if (err) {
        console.error('Upload error:', err);
        return res.status(400).json({ error: err.message });
      }

      try {
        if (!req.files || !Array.isArray(req.files)) {
          return res.status(400).json({ error: 'Nessuna immagine caricata' });
        }

        const imageUrls = req.files.map(file => `/uploads/properties/${file.filename}`);
        
        res.json({ 
          success: true, 
          imageUrls,
          message: `${imageUrls.length} immagini caricate con successo` 
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

  app.post("/api/properties/:id/images", upload.array('images', 20), async (req, res) => {
    try {
      const propertyId = parseInt(req.params.id);
      const files = req.files as Express.Multer.File[];
      
      if (!files || files.length === 0) {
        return res.status(400).json({ message: "No files uploaded" });
      }

      const uploadedImages = [];
      
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const imageData = {
          propertyId,
          filename: file.filename,
          originalName: file.originalname,
          url: getImageUrl(file.filename),
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
        // Delete from filesystem
        deleteImageFile(imageToDelete.filename);
        
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
