import multer from 'multer';
import sharp from 'sharp';
import { ObjectStorageService } from './objectStorage';

// Configure multer to use memory storage instead of disk storage
const storage = multer.memoryStorage();

// File filter for images only
const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedMimes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Solo file immagine sono permessi (JPEG, PNG, GIF, WebP)'));
  }
};

// Configure multer with increased limits for real estate photos
export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 15 * 1024 * 1024, // 15MB limit per file
    files: 30, // Max 30 files at once for real estate properties
    parts: 50, // Increase parts limit
    fieldSize: 2 * 1024 * 1024 // 2MB field size
  }
});

// Initialize object storage service
const objectStorageService = new ObjectStorageService();

// Helper function to compress and upload image to object storage
export const uploadImageToStorage = async (
  file: Express.Multer.File
): Promise<{ url: string; filename: string }> => {
  try {
    // Generate unique filename
    const filename = objectStorageService.generateUniqueFilename(file.originalname);
    
    // Compress image for web optimization (production performance)
    let processedBuffer = file.buffer;
    
    // Only compress JPEG and PNG files larger than 1MB
    if ((file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') && file.size > 1024 * 1024) {
      console.log(`Compressing image ${file.originalname} (${(file.size / 1024 / 1024).toFixed(2)}MB)`);
      
      processedBuffer = await sharp(file.buffer)
        .resize(2048, 2048, { 
          fit: 'inside', 
          withoutEnlargement: true 
        })
        .jpeg({ 
          quality: 85, 
          progressive: true 
        })
        .toBuffer();
        
      console.log(`Compressed from ${(file.size / 1024 / 1024).toFixed(2)}MB to ${(processedBuffer.length / 1024 / 1024).toFixed(2)}MB`);
    }
    
    // Create modified file object with compressed buffer
    const processedFile: Express.Multer.File = {
      ...file,
      buffer: processedBuffer,
      size: processedBuffer.length,
      mimetype: file.mimetype === 'image/png' ? 'image/jpeg' : file.mimetype // Convert PNG to JPEG for better compression
    };
    
    const publicPaths = objectStorageService.getPublicObjectSearchPaths();
    const uploadPath = `${publicPaths[0]}/properties/${filename}`;
    
    const url = await objectStorageService.uploadFile(processedFile, uploadPath);
    return { url, filename };
  } catch (error) {
    console.error('Error processing/uploading image:', error);
    throw error;
  }
};

// Helper function to delete image from object storage
export const deleteImageFile = async (filename: string): Promise<boolean> => {
  try {
    const publicPaths = objectStorageService.getPublicObjectSearchPaths();
    const filePath = `${publicPaths[0]}/properties/${filename}`;
    return await objectStorageService.deleteFile(filePath);
  } catch (error) {
    console.error('Error deleting image file:', error);
    return false;
  }
};