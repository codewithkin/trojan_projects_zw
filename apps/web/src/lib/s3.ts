import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

// S3 Client configuration
const s3Client = new S3Client({
  region: process.env.NEXT_PUBLIC_AWS_REGION || "us-west-2",
  credentials: {
    accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY || "",
  },
});

const BUCKET_NAME = process.env.NEXT_PUBLIC_S3_BUCKET_NAME || "trojan-projects-zw";

/**
 * Generate a unique filename for S3 upload
 */
function generateUniqueFileName(originalName: string): string {
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 8);
  const extension = originalName.split(".").pop() || "jpg";
  const sanitizedName = originalName
    .replace(/\.[^/.]+$/, "") // Remove extension
    .replace(/[^a-zA-Z0-9]/g, "-") // Replace special chars with dash
    .toLowerCase()
    .substring(0, 50); // Limit length
  
  return `services/${sanitizedName}-${timestamp}-${randomString}.${extension}`;
}

/**
 * Upload a file to S3 and return the public URL
 */
export async function uploadToS3(file: File): Promise<string> {
  const fileName = generateUniqueFileName(file.name);
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: fileName,
    Body: buffer,
    ContentType: file.type,
  });

  await s3Client.send(command);

  // Return the public URL
  const region = process.env.NEXT_PUBLIC_AWS_REGION || "us-west-2";
  return `https://${BUCKET_NAME}.s3.${region}.amazonaws.com/${fileName}`;
}

/**
 * Upload multiple files to S3
 */
export async function uploadMultipleToS3(files: File[]): Promise<string[]> {
  const uploadPromises = files.map((file) => uploadToS3(file));
  return Promise.all(uploadPromises);
}

export { s3Client, BUCKET_NAME };
