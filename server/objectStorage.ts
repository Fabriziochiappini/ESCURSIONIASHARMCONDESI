import { Response, Request } from "express";
import { randomUUID } from "crypto";
import fs from "fs";
import path from "path";

// Simplified ObjectStorageService for local VPS deployment
export class ObjectStorageService {
  private uploadsDir: string;

  constructor() {
    this.uploadsDir = path.join(process.cwd(), "uploads");
    // Ensure uploads directory exists
    if (!fs.existsSync(this.uploadsDir)) {
      fs.mkdirSync(this.uploadsDir, { recursive: true });
    }
  }

  // Search for a public object from the local uploads folder
  async searchPublicObject(filePath: string): Promise<string | null> {
    const fullPath = path.join(this.uploadsDir, filePath);
    
    if (fs.existsSync(fullPath) && fs.statSync(fullPath).isFile()) {
      return fullPath;
    }

    return null;
  }

  // Downloads an object (from local disk) to the response
  async downloadObject(fullPath: string, res: Response, req?: Request, cacheTtlSec: number = 86400) {
    try {
      if (!fs.existsSync(fullPath)) {
        return res.status(404).json({ error: "File not found" });
      }

      const stats = fs.statSync(fullPath);
      const ext = path.extname(fullPath).toLowerCase();
      
      const mimeTypes: Record<string, string> = {
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.png': 'image/png',
        '.gif': 'image/gif',
        '.webp': 'image/webp',
        '.pdf': 'application/pdf',
      };

      res.set({
        "Content-Type": mimeTypes[ext] || "application/octet-stream",
        "Content-Length": stats.size.toString(),
        "Cache-Control": `public, max-age=${cacheTtlSec}`,
        "Last-Modified": stats.mtime.toUTCString(),
        "X-Content-Type-Options": "nosniff",
        "Accept-Ranges": "bytes"
      });

      // Handle conditional requests
      if (req) {
        const ifModifiedSince = req.get('If-Modified-Since');
        if (ifModifiedSince && new Date(ifModifiedSince) >= stats.mtime) {
          return res.status(304).end();
        }
      }

      const stream = fs.createReadStream(fullPath);
      stream.on("error", (err) => {
        console.error("Stream error:", err);
        if (!res.headersSent) {
          res.status(500).json({ error: "Error streaming file" });
        }
      });

      stream.pipe(res);
    } catch (error) {
      console.error("Error downloading file:", error);
      if (!res.headersSent) {
        res.status(500).json({ error: "Error downloading file" });
      }
    }
  }

  // Upload a file to local storage
  async uploadFile(
    file: Express.Multer.File,
    relativeObjectPath: string
  ): Promise<string> {
    // relativeObjectPath might be like "/bucket/public/tours/filename"
    // We'll normalize it to a local path
    const parts = relativeObjectPath.split('/').filter(p => p.length > 0);
    // Usually the format is [bucket, 'public', 'category', 'filename'] or similar
    // We'll strip the bucket and 'public' parts to keep it clean
    let cleanPathParts = parts;
    if (parts[1] === 'public') {
      cleanPathParts = parts.slice(2);
    } else if (parts[0] === 'public') {
      cleanPathParts = parts.slice(1);
    }

    const localFilePath = path.join(this.uploadsDir, ...cleanPathParts);
    const localFileDir = path.dirname(localFilePath);

    if (!fs.existsSync(localFileDir)) {
      fs.mkdirSync(localFileDir, { recursive: true });
    }

    return new Promise((resolve, reject) => {
      fs.writeFile(localFilePath, file.buffer, (err) => {
        if (err) {
          console.error("Upload error:", err);
          return reject(err);
        }
        
        // Return URL served via backend
        const urlPath = cleanPathParts.join('/');
        const publicUrl = `/public-objects/${urlPath}`;
        console.log(`✅ LOCAL STORAGE URL: ${publicUrl}`);
        resolve(publicUrl);
      });
    });
  }

  // Delete a file from local storage
  async deleteFile(url: string): Promise<boolean> {
    try {
      const filePath = url.replace('/public-objects/', '');
      const fullPath = path.join(this.uploadsDir, filePath);
      
      if (fs.existsSync(fullPath)) {
        fs.unlinkSync(fullPath);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error deleting file:", error);
      return false;
    }
  }

  generateUniqueFilename(originalName: string): string {
    const extension = path.extname(originalName);
    return `${randomUUID()}${extension}`;
  }
}

export const objectStorageService = new ObjectStorageService();