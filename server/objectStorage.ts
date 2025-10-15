import { Storage, File } from "@google-cloud/storage";
import { Response, Request } from "express";
import { randomUUID } from "crypto";

const REPLIT_SIDECAR_ENDPOINT = "http://127.0.0.1:1106";

// The object storage client is used to interact with the object storage service.
export const objectStorageClient = new Storage({
  credentials: {
    audience: "replit",
    subject_token_type: "access_token",
    token_url: `${REPLIT_SIDECAR_ENDPOINT}/token`,
    type: "external_account",
    credential_source: {
      url: `${REPLIT_SIDECAR_ENDPOINT}/credential`,
      format: {
        type: "json",
        subject_token_field_name: "access_token",
      },
    },
    universe_domain: "googleapis.com",
  },
  projectId: "",
});

export class ObjectNotFoundError extends Error {
  constructor() {
    super("Object not found");
    this.name = "ObjectNotFoundError";
    Object.setPrototypeOf(this, ObjectNotFoundError.prototype);
  }
}

// The object storage service is used to interact with the object storage service.
export class ObjectStorageService {
  constructor() {}

  // Gets the public object search paths.
  getPublicObjectSearchPaths(): Array<string> {
    const pathsStr = process.env.PUBLIC_OBJECT_SEARCH_PATHS || "";
    const paths = Array.from(
      new Set(
        pathsStr
          .split(",")
          .map((path) => path.trim())
          .filter((path) => path.length > 0)
      )
    );
    if (paths.length === 0) {
      throw new Error(
        "PUBLIC_OBJECT_SEARCH_PATHS not set. Create a bucket in 'Object Storage' " +
          "tool and set PUBLIC_OBJECT_SEARCH_PATHS env var (comma-separated paths)."
      );
    }
    return paths;
  }

  // Gets the private object directory.
  getPrivateObjectDir(): string {
    const dir = process.env.PRIVATE_OBJECT_DIR || "";
    if (!dir) {
      throw new Error(
        "PRIVATE_OBJECT_DIR not set. Create a bucket in 'Object Storage' " +
          "tool and set PRIVATE_OBJECT_DIR env var."
      );
    }
    return dir;
  }

  // Search for a public object from the search paths.
  async searchPublicObject(filePath: string): Promise<File | null> {
    for (const searchPath of this.getPublicObjectSearchPaths()) {
      const fullPath = `${searchPath}/${filePath}`;

      // Full path format: /<bucket_name>/<object_name>
      const { bucketName, objectName } = parseObjectPath(fullPath);
      const bucket = objectStorageClient.bucket(bucketName);
      const file = bucket.file(objectName);

      // Check if file exists
      const [exists] = await file.exists();
      if (exists) {
        return file;
      }
    }

    return null;
  }

  // Downloads an object to the response with optimized caching for production.
  async downloadObject(file: File, res: Response, req?: Request, cacheTtlSec: number = 86400) { // 24 hours default
    try {
      // Get file metadata
      const [metadata] = await file.getMetadata();
      
      // Set aggressive caching headers for production performance
      res.set({
        "Content-Type": metadata.contentType || "application/octet-stream",
        "Content-Length": metadata.size,
        "Cache-Control": `public, max-age=${cacheTtlSec}, immutable`, // Immutable for better caching
        "ETag": metadata.etag || `"${metadata.generation}"`,
        "Last-Modified": metadata.updated,
        "Expires": new Date(Date.now() + cacheTtlSec * 1000).toUTCString(),
        // Performance headers
        "X-Content-Type-Options": "nosniff",
        "Accept-Ranges": "bytes"
      });

      // Handle conditional requests for better performance
      if (req) {
        const ifNoneMatch = req.get('If-None-Match');
        const ifModifiedSince = req.get('If-Modified-Since');
        
        if (ifNoneMatch === res.get('ETag') || 
            (ifModifiedSince && metadata.updated && new Date(ifModifiedSince) >= new Date(metadata.updated))) {
          return res.status(304).end();
        }
      }

      // Stream the file to the response
      const stream = file.createReadStream();

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

  // Upload a file to object storage
  async uploadFile(
    file: Express.Multer.File,
    path: string
  ): Promise<string> {
    const { bucketName, objectName } = parseObjectPath(path);
    const bucket = objectStorageClient.bucket(bucketName);
    const objectFile = bucket.file(objectName);

    return new Promise((resolve, reject) => {
      const stream = objectFile.createWriteStream({
        metadata: {
          contentType: file.mimetype,
        },
      });

      stream.on("error", (err) => {
        console.error("Upload error:", err);
        reject(err);
      });

      stream.on("finish", async () => {
        // Make file publicly accessible
        await objectFile.makePublic();
        
        // Return direct GCS public URL (accessible anywhere!)
        const publicUrl = `https://storage.googleapis.com/${bucketName}/${objectName}`;
        console.log(`🌐 PUBLIC URL GENERATO: ${publicUrl}`);
        resolve(publicUrl);
      });

      stream.end(file.buffer);
    });
  }

  // Delete a file from object storage
  async deleteFile(path: string): Promise<boolean> {
    try {
      const { bucketName, objectName } = parseObjectPath(path);
      const bucket = objectStorageClient.bucket(bucketName);
      const file = bucket.file(objectName);
      
      await file.delete();
      return true;
    } catch (error) {
      console.error("Error deleting file:", error);
      return false;
    }
  }

  // Generate a unique filename for upload
  generateUniqueFilename(originalName: string): string {
    const extension = originalName.split('.').pop();
    return `${randomUUID()}.${extension}`;
  }
}

function parseObjectPath(path: string): {
  bucketName: string;
  objectName: string;
} {
  if (!path.startsWith("/")) {
    path = `/${path}`;
  }
  const pathParts = path.split("/");
  if (pathParts.length < 3) {
    throw new Error("Invalid path: must contain at least a bucket name");
  }

  const bucketName = pathParts[1];
  const objectName = pathParts.slice(2).join("/");

  return {
    bucketName,
    objectName,
  };
}

export const objectStorageService = new ObjectStorageService();