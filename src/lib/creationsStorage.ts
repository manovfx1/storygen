export const CREATIONS_STORAGE_KEY = "storygen-creations";

export interface StoredImageCreation {
  id: string;
  type: "image";
  prompt: string;
  style: string;
  aspectRatio: string;
  imageUrl: string;
  createdAt: string;
}

export type StoredCreation = StoredImageCreation;

function isStoredImageCreation(item: unknown): item is StoredImageCreation {
  if (typeof item !== "object" || item === null) return false;

  const record = item as Record<string, unknown>;

  return (
    record.type === "image" &&
    typeof record.id === "string" &&
    typeof record.prompt === "string" &&
    typeof record.style === "string" &&
    typeof record.aspectRatio === "string" &&
    typeof record.imageUrl === "string" &&
    typeof record.createdAt === "string"
  );
}

export function loadCreations(): StoredCreation[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = localStorage.getItem(CREATIONS_STORAGE_KEY);
    if (!raw) return [];

    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    return parsed.filter(isStoredImageCreation);
  } catch {
    return [];
  }
}

export function saveImageCreation(
  creation: Omit<StoredImageCreation, "id" | "type" | "createdAt"> & {
    id?: string;
    createdAt?: string;
  }
): StoredImageCreation {
  const stored: StoredImageCreation = {
    id: creation.id ?? crypto.randomUUID(),
    type: "image",
    prompt: creation.prompt,
    style: creation.style,
    aspectRatio: creation.aspectRatio,
    imageUrl: creation.imageUrl,
    createdAt: creation.createdAt ?? new Date().toISOString(),
  };

  const existing = loadCreations();
  existing.unshift(stored);
  localStorage.setItem(CREATIONS_STORAGE_KEY, JSON.stringify(existing));

  return stored;
}

export function formatCreationDate(isoDate: string): string {
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) return isoDate;

  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
