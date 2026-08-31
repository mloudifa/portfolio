import { promises as fs } from "node:fs";
import path from "node:path";
import { randomUUID } from "node:crypto";

const UPLOAD_ROOT = path.join(process.cwd(), "public", "uploads");

export const MAX_IMAGE_BYTES = 10 * 1024 * 1024; // 10 MB
export const MAX_VIDEO_BYTES = 100 * 1024 * 1024; // 100 MB

export interface UploadedFile {
  url: string;
  type: "image" | "video";
  name: string;
  size: number;
}

const IMAGE_MIMES = new Map<string, string>([
  ["image/png", "png"],
  ["image/jpeg", "jpg"],
  ["image/jpg", "jpg"],
  ["image/webp", "webp"],
  ["image/svg+xml", "svg"],
  ["image/gif", "gif"],
]);

const VIDEO_MIMES = new Map<string, string>([
  ["video/mp4", "mp4"],
  ["video/webm", "webm"],
]);

export class UploadError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "UploadError";
  }
}

/** Classify an uploaded file (MIME type + extension + size). */
export function validateUpload(
  file: File,
): { type: "image" | "video"; extension: string } {
  const mime = file.type.toLowerCase();
  const name = file.name.toLowerCase();
  const ext = name.includes(".") ? name.split(".").pop() ?? "" : "";

  let category: "image" | "video" | null = null;
  let extension = "";

  if (IMAGE_MIMES.has(mime)) {
    category = "image";
    extension = IMAGE_MIMES.get(mime)!;
  } else if (VIDEO_MIMES.has(mime)) {
    category = "video";
    extension = VIDEO_MIMES.get(mime)!;
  }

  // If the MIME type came through empty or generic, fall back to the extension.
  if (!category) {
    const imageExt = [...IMAGE_MIMES.values()].find((v) => v === ext);
    if (imageExt) {
      category = "image";
      extension = imageExt;
    } else if (ext === "mp4" || ext === "webm") {
      category = "video";
      extension = ext;
    }
  }

  if (!category) {
    throw new UploadError(
      `Unsupported file type "${mime || ext}". Allowed: PNG, JPG, JPEG, WEBP, SVG (images) and MP4, WEBM (video).`,
    );
  }

  const max = category === "image" ? MAX_IMAGE_BYTES : MAX_VIDEO_BYTES;
  if (file.size > max) {
    const limit = category === "image" ? "10 MB" : "100 MB";
    throw new UploadError(`File "${file.name}" exceeds the ${limit} limit.`);
  }

  return { type: category, extension };
}

/** Save an upload to public/uploads and return its public URL. */
export async function saveUpload(file: File): Promise<UploadedFile> {
  const { type, extension } = validateUpload(file);
  const filename = `${randomUUID()}.${extension}`;
  await fs.mkdir(UPLOAD_ROOT, { recursive: true });
  const buffer = Buffer.from(await file.arrayBuffer());
  await fs.writeFile(path.join(UPLOAD_ROOT, filename), buffer);
  return {
    url: `/uploads/${filename}`,
    type,
    name: file.name,
    size: file.size,
  };
}

/** Delete an upload by its public URL, guarding against path tricks. */
export async function removeUpload(url: string): Promise<void> {
  if (!url.startsWith("/uploads/")) return;
  const resolved = path.resolve(process.cwd(), "public", url.replace(/^\/+/, ""));
  const root = path.resolve(UPLOAD_ROOT);
  if (!resolved.startsWith(root + path.sep) && resolved !== root) return;
  try {
    await fs.unlink(resolved);
  } catch {
    // Probably already been removed — not worth erroring over.
  }
}
