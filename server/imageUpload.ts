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

// Generate responsive image sizes for different screen sizes
export const generateResponsiveImages = async (
  file: Express.Multer.File,
  basePath: string
): Promise<{
  urls: { size: string; url: string; width: number }[];
  mainUrl: string;
  filename: string;
}> => {
  const sizes = [
    { width: 400, suffix: 'sm' },   // Mobile
    { width: 800, suffix: 'md' },   // Tablet
    { width: 1200, suffix: 'lg' },  // Desktop
    { width: 2048, suffix: 'xl' },  // Full size
  ];
  
  const urls = [];
  const baseFilename = objectStorageService.generateUniqueFilename(file.originalname);
  
  for (const size of sizes) {
    const sizedBuffer = await sharp(file.buffer)
      .resize(size.width, size.width, { 
        fit: 'inside', 
        withoutEnlargement: true 
      })
      .webp({ quality: 82, effort: 4 })
      .toBuffer();
    
    const filename = baseFilename.replace(/\.[^.]+$/, `_${size.suffix}.webp`);
    const uploadPath = `${basePath}/${filename}`;
    const url = await objectStorageService.uploadFile(
      { ...file, buffer: sizedBuffer, size: sizedBuffer.length, mimetype: 'image/webp' } as Express.Multer.File,
      uploadPath
    );
    
    urls.push({ size: size.suffix, url, width: size.width });
  }
  
  return {
    urls,
    mainUrl: urls[urls.length - 1].url, // Full size as main
    filename: baseFilename
  };
};

// Helper function to compress and upload image to object storage
export const uploadImageToStorage = async (
  file: Express.Multer.File
): Promise<{ url: string; filename: string }> => {
  try {
    // Generate unique filename
    const filename = objectStorageService.generateUniqueFilename(file.originalname);
    
    // Compress image for web optimization (production performance)
    let processedBuffer = file.buffer;
    
    // Modern image optimization with WebP and responsive sizes
    if ((file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') && file.size > 512 * 1024) {
      console.log(`Optimizing image ${file.originalname} (${(file.size / 1024 / 1024).toFixed(2)}MB)`);
      
      // Generate WebP version for modern browsers (better compression)
      const webpBuffer = await sharp(file.buffer)
        .resize(2048, 2048, { 
          fit: 'inside', 
          withoutEnlargement: true 
        })
        .webp({ 
          quality: 82, 
          effort: 4 // Better compression
        })
        .toBuffer();
      
      // Generate JPEG fallback for compatibility
      const jpegBuffer = await sharp(file.buffer)
        .resize(2048, 2048, { 
          fit: 'inside', 
          withoutEnlargement: true 
        })
        .jpeg({ 
          quality: 85, 
          progressive: true,
          mozjpeg: true // Better compression
        })
        .toBuffer();
      
      // Use the smaller format
      if (webpBuffer.length < jpegBuffer.length * 0.9) {
        processedBuffer = webpBuffer;
        file.mimetype = 'image/webp';
        console.log(`WebP optimization: ${(file.size / 1024 / 1024).toFixed(2)}MB → ${(processedBuffer.length / 1024 / 1024).toFixed(2)}MB`);
      } else {
        processedBuffer = jpegBuffer;
        file.mimetype = 'image/jpeg';
        console.log(`JPEG optimization: ${(file.size / 1024 / 1024).toFixed(2)}MB → ${(processedBuffer.length / 1024 / 1024).toFixed(2)}MB`);
      }
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