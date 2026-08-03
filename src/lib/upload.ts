export const MAX_UPLOAD_SIZE = 10 * 1024 * 1024;

const ALLOWED_EXTENSIONS: Record<string, string[]> = {
  image: ["jpg", "jpeg", "png", "gif", "webp", "avif", "svg"],
  audio: ["mp3", "wav", "ogg", "m4a"],
  video: ["mp4", "webm"],
  application: ["pdf", "zip"],
};

function extensionOf(name: string): string {
  const index = name.lastIndexOf(".");
  return index === -1 ? "" : name.slice(index + 1).toLowerCase();
}

export function sanitizeFilename(name: string): string {
  return name.replace(/[^a-zA-Z0-9._-]/g, "_");
}

export function validateUpload(file: {
  name: string;
  size: number;
  type: string;
}): string | null {
  if (!file.name || !file.type) return "Fichier invalide";
  if (file.size <= 0) return "Fichier vide";
  if (file.size > MAX_UPLOAD_SIZE) {
    return `Fichier trop volumineux (max ${MAX_UPLOAD_SIZE / (1024 * 1024)} Mo)`;
  }

  const category = file.type.split("/")[0] ?? "";
  const allowed = ALLOWED_EXTENSIONS[category] ?? [];
  if (!allowed.includes(extensionOf(file.name))) {
    return "Type de fichier non autorisé";
  }

  return null;
}
