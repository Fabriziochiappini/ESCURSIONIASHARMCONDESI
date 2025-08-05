import multer from 'multer';
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

// Configure multer
export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
    files: 20 // Max 20 files at once
  }
});

// Initialize object storage service
const objectStorageService = new ObjectStorageService();

// Helper function to upload image to object storage
export const uploadImageToStorage = async (
  file: Express.Multer.File
): Promise<{ url: string; filename: string }> => {
  const filename = objectStorageService.generateUniqueFilename(file.originalname);
  const publicPaths = objectStorageService.getPublicObjectSearchPaths();
  const uploadPath = `${publicPaths[0]}/properties/${filename}`;
  
  const url = await objectStorageService.uploadFile(file, uploadPath);
  return { url, filename };
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