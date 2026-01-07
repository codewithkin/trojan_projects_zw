import { Hono } from "hono";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { authMiddleware } from "../lib/auth/middleware";
import { hasAdminAccess } from "../config/admins";

// S3 Client configuration - uses backend environment variables only
const s3Client = new S3Client({
  region: process.env.AWS_REGION || "us-west-2",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
  },
});

const BUCKET_NAME = process.env.S3_BUCKET_NAME || "trojan-projects-zw";

/**
 * Generate a unique filename for S3 upload
 */
function generateUniqueFileName(originalName: string, folder: string = "uploads"): string {
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 8);
  const extension = originalName.split(".").pop() || "jpg";
  const sanitizedName = originalName
    .replace(/\.[^/.]+$/, "") // Remove extension
    .replace(/[^a-zA-Z0-9]/g, "-") // Replace special chars with dash
    .toLowerCase()
    .substring(0, 50); // Limit length

  return `${folder}/${sanitizedName}-${timestamp}-${randomString}.${extension}`;
}

const uploadRoute = new Hono()
  /**
   * POST /api/upload/service-image
   * Upload a service image (admin only)
   * 
   * Expects multipart form data with "image" field
   */
  .post("/service-image", authMiddleware, async (c) => {
    const user = c.get("user");

    if (!user || !hasAdminAccess(user)) {
      return c.json({ error: "Unauthorized - Admin only" }, 403);
    }

    try {
      const formData = await c.req.formData();
      const file = formData.get("image") as File | null;

      if (!file) {
        return c.json({ error: "No image file provided" }, 400);
      }

      // Validate file type
      const validTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
      if (!validTypes.includes(file.type)) {
        return c.json({ error: "Invalid file type. Only JPEG, PNG, WebP, and GIF are allowed" }, 400);
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        return c.json({ error: "File size too large. Maximum 5MB allowed" }, 400);
      }

      const fileName = generateUniqueFileName(file.name, "services");
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const command = new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: fileName,
        Body: buffer,
        ContentType: file.type,
        ACL: "public-read",
      });

      await s3Client.send(command);

      const region = process.env.AWS_REGION || "us-west-2";
      const url = `https://${BUCKET_NAME}.s3.${region}.amazonaws.com/${fileName}`;

      return c.json(
        {
          success: true,
          url,
          fileName,
        },
        201
      );
    } catch (error) {
      console.error("Error uploading service image:", error);
      return c.json({ error: "Failed to upload image" }, 500);
    }
  })

  /**
   * POST /api/upload/multiple
   * Upload multiple files (admin only)
   * 
   * Expects multipart form data with "images" field (multiple)
   */
  .post("/multiple", authMiddleware, async (c) => {
    const user = c.get("user");

    if (!user || !hasAdminAccess(user)) {
      return c.json({ error: "Unauthorized - Admin only" }, 403);
    }

    try {
      const formData = await c.req.formData();
      const files = formData.getAll("images") as File[];

      if (!files || files.length === 0) {
        return c.json({ error: "No files provided" }, 400);
      }

      const validTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
      const maxFileSize = 5 * 1024 * 1024; // 5MB

      // Validate all files
      for (const file of files) {
        if (!validTypes.includes(file.type)) {
          return c.json(
            { error: `Invalid file type: ${file.name}. Only JPEG, PNG, WebP, and GIF are allowed` },
            400
          );
        }
        if (file.size > maxFileSize) {
          return c.json(
            { error: `File ${file.name} is too large. Maximum 5MB allowed` },
            400
          );
        }
      }

      // Upload all files
      const uploadPromises = files.map(async (file) => {
        const fileName = generateUniqueFileName(file.name, "uploads");
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        const command = new PutObjectCommand({
          Bucket: BUCKET_NAME,
          Key: fileName,
          Body: buffer,
          ContentType: file.type,
          ACL: "public-read",
        });

        await s3Client.send(command);

        const region = process.env.AWS_REGION || "us-west-2";
        const url = `https://${BUCKET_NAME}.s3.${region}.amazonaws.com/${fileName}`;

        return { url, fileName, originalName: file.name };
      });

      const uploadedFiles = await Promise.all(uploadPromises);

      return c.json(
        {
          success: true,
          files: uploadedFiles,
          count: uploadedFiles.length,
        },
        201
      );
    } catch (error) {
      console.error("Error uploading multiple files:", error);
      return c.json({ error: "Failed to upload files" }, 500);
    }
  });

export default uploadRoute;
