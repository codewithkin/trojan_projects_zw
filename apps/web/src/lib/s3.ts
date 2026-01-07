/**
 * Generate a unique filename for S3 upload
 * (kept for reference, actual generation happens on backend)
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
 * Upload a file to S3 via backend API (server-side upload)
 * This avoids CORS issues and keeps AWS credentials secure
 */
export async function uploadToS3(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("image", file);

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/upload/service-image`,
    {
      method: "POST",
      body: formData,
      credentials: "include",
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to upload image");
  }

  const data = await response.json();
  return data.url;
}

/**
 * Upload multiple files to S3 via backend API
 */
export async function uploadMultipleToS3(files: File[]): Promise<string[]> {
  const formData = new FormData();
  files.forEach((file) => formData.append("images", file));

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/upload/multiple`,
    {
      method: "POST",
      body: formData,
      credentials: "include",
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to upload files");
  }

  const data = await response.json();
  return data.files.map((f: { url: string }) => f.url);
}
