import { storage } from "./storage";
import { ObjectStorageService } from "./objectStorage";
import fs from 'fs';
import path from 'path';

const objectStorageService = new ObjectStorageService();

// Migrate existing images from local storage to object storage
export async function migrateExistingImages() {
  console.log("⚠️  MIGRATION DISABLED: Image migration disabled to prevent data conflicts during deploy");
  console.log("ℹ️  Images are uploaded directly via admin panel - no migration needed");
  return;
  
  /* DISABLED FOR DEPLOY SAFETY
  console.log("Starting image migration to object storage...");
  
  try {
    // Get all travels with images
    const properties = await storage.getAllTravels();
    let migratedCount = 0;
    
    for (const property of properties) {
      if (property.images && property.images.length > 0) {
        console.log(`Migrating images for property ${property.id}: ${property.title}`);
        
        for (let i = 0; i < property.images.length; i++) {
          const imagePath = property.images[i];
          const filename = path.basename(imagePath);
          const localPath = path.join(process.cwd(), 'uploads', 'properties', filename);
          
          try {
            // Check if local file exists
            if (fs.existsSync(localPath)) {
              // Read the file
              const fileBuffer = fs.readFileSync(localPath);
              const fileExtension = path.extname(filename);
              const mimeType = getMimeType(fileExtension);
              
              // Create a mock Multer file object
              const mockFile: Express.Multer.File = {
                fieldname: 'image',
                originalname: filename,
                encoding: '7bit',
                mimetype: mimeType,
                buffer: fileBuffer,
                size: fileBuffer.length,
                stream: null as any,
                destination: '',
                filename: '',
                path: ''
              };
              
              // Upload to object storage
              const publicPaths = objectStorageService.getPublicObjectSearchPaths();
              const uploadPath = `${publicPaths[0]}/travels/${filename}`;
              const newUrl = await objectStorageService.uploadFile(mockFile, uploadPath);
              
              // Add to property_images table
              const imageData = {
                propertyId: property.id,
                filename,
                originalName: filename,
                url: newUrl,
                size: fileBuffer.length,
                mimeType,
                sortOrder: i,
                isMain: i === 0
              };
              
              await storage.addPropertyImage(imageData);
              migratedCount++;
              
              console.log(`✓ Migrated: ${filename} -> ${newUrl}`);
            } else {
              console.log(`⚠ Local file not found: ${localPath}`);
            }
          } catch (error) {
            console.error(`✗ Error migrating ${filename}:`, error);
          }
        }
      }
    }
    
    console.log(`Migration completed! Migrated ${migratedCount} images.`);
    return migratedCount;
    
  } catch (error) {
    console.error("Migration failed:", error);
    throw error;
  }
}

function getMimeType(extension: string): string {
  const mimeTypes: Record<string, string> = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.gif': 'image/gif',
    '.webp': 'image/webp'
  };
  
  return mimeTypes[extension.toLowerCase()] || 'image/jpeg';
}