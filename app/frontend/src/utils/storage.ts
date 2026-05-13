import { createClient } from "@metagptx/web-sdk";

const BUCKET_NAME = "site-images";

/**
 * Upload a file to object storage and return the object_key.
 * If the file is already a URL or data URI, returns it as-is (backward compatible).
 */
export async function uploadImage(
  file: File,
  folder: string = "banners"
): Promise<{ objectKey: string; url: string }> {
  const client = createClient();
  const timestamp = Date.now();
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
  const objectKey = `${folder}/${timestamp}-${safeName}`;

  // Use client.storage.upload which handles getUploadUrl + PUT automatically
  const result = await client.storage.upload({
    bucket_name: BUCKET_NAME,
    object_key: objectKey,
    file,
  });

  // For public buckets, construct the direct URL
  // The upload returns a result we can use
  const url = `storage://${BUCKET_NAME}/${objectKey}`;

  return { objectKey, url };
}

/**
 * Resolve a storage URL to a displayable HTTP URL.
 * Handles:
 * - storage://bucket/key -> fetches presigned download URL
 * - https://... -> returns as-is
 * - data:... -> returns as-is (base64)
 * - empty -> returns empty
 */
export async function resolveImageUrl(
  src: string
): Promise<string> {
  if (!src) return "";

  // Already a regular URL or data URI
  if (src.startsWith("http://") || src.startsWith("https://") || src.startsWith("data:")) {
    return src;
  }

  // Storage reference: storage://bucket/key
  if (src.startsWith("storage://")) {
    const path = src.replace("storage://", "");
    const [bucket, ...keyParts] = path.split("/");
    const objectKey = keyParts.join("/");

    try {
      const client = createClient();
      const result = await client.storage.getDownloadUrl({
        bucket_name: bucket,
        object_key: objectKey,
      });
      return result.data?.download_url || "";
    } catch {
      console.error("Failed to resolve storage URL:", src);
      return "";
    }
  }

  return src;
}

/**
 * Check if a source string is a storage reference
 */
export function isStorageRef(src: string): boolean {
  return src.startsWith("storage://");
}

export { BUCKET_NAME };

/**
 * Upload a PDF file to object storage and return the object_key.
 * If the file is already a URL or data URI, returns it as-is (backward compatible).
 */
export async function uploadPdf(
  file: File,
  folder: string = "documents"
): Promise<{ objectKey: string; url: string }> {
  const client = createClient();
  const timestamp = Date.now();
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
  const objectKey = `${folder}/${timestamp}-${safeName}`;

  // Use client.storage.upload which handles getUploadUrl + PUT automatically
  const result = await client.storage.upload({
    bucket_name: BUCKET_NAME,
    object_key: objectKey,
    file,
  });

  // For public buckets, construct the direct URL
  // The upload returns a result we can use
  const url = `storage://${BUCKET_NAME}/${objectKey}`;

  return { objectKey, url };
}

/**
 * Resolve a storage URL to a displayable HTTP URL for PDFs.
 * Same logic as resolveImageUrl - works for any file type.
 */
export async function resolvePdfUrl(
  src: string
): Promise<string> {
  if (!src) return "";

  // Already a regular URL or data URI
  if (src.startsWith("http://") || src.startsWith("https://") || src.startsWith("data:")) {
    return src;
  }

  // Storage reference: storage://bucket/key
  if (src.startsWith("storage://")) {
    const path = src.replace("storage://", "");
    const [bucket, ...keyParts] = path.split("/");
    const objectKey = keyParts.join("/");

    try {
      const client = createClient();
      const result = await client.storage.getDownloadUrl({
        bucket_name: bucket,
        object_key: objectKey,
      });
      return result.data?.download_url || "";
    } catch {
      console.error("Failed to resolve storage URL:", src);
      return "";
    }
  }

  return src;
}
