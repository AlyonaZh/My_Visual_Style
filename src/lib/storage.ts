import type { Progress, ProgressEntry, Rating } from "../types";

export const STORAGE_KEY = "my-visual-language:v1";
export const NOTE_MAX_LENGTH = 500;

export interface StorageResult {
  progress: Progress;
  /** false — хранилище недоступно или данные битые: прогресс не переживёт перезагрузку. */
  persistent: boolean;
}

export function emptyProgress(): Progress {
  return { version: 1, entries: {} };
}

/** Доступ к localStorage может бросить исключение (например, при запрете cookies), поэтому тоже в try. */
function getStorage(): Storage | null {
  try {
    return window.localStorage ?? null;
  } catch {
    return null;
  }
}

function isRating(value: unknown): value is Rating {
  return value === 1 || value === 2 || value === 3 || value === 4 || value === 5;
}

function isEntry(value: unknown): value is ProgressEntry {
  if (typeof value !== "object" || value === null) return false;
  const entry = value as Record<string, unknown>;
  return isRating(entry.rating) && typeof entry.note === "string" && typeof entry.updatedAt === "string";
}

/** Разбирает сохранённую строку. null — если данные битые. Отдельные испорченные записи отбрасываются. */
function parseProgress(raw: string): Progress | null {
  let data: unknown;
  try {
    data = JSON.parse(raw);
  } catch {
    return null;
  }
  if (typeof data !== "object" || data === null) return null;

  const { version, entries } = data as Record<string, unknown>;
  if (version !== 1 || typeof entries !== "object" || entries === null || Array.isArray(entries)) return null;

  const progress = emptyProgress();
  for (const [id, entry] of Object.entries(entries)) {
    if (isEntry(entry)) progress.entries[id] = entry;
  }
  return progress;
}

export function loadProgress(): StorageResult {
  const storage = getStorage();
  if (!storage) return { progress: emptyProgress(), persistent: false };

  try {
    const raw = storage.getItem(STORAGE_KEY);
    if (raw === null) return { progress: emptyProgress(), persistent: true };

    const progress = parseProgress(raw);
    return progress ? { progress, persistent: true } : { progress: emptyProgress(), persistent: false };
  } catch {
    return { progress: emptyProgress(), persistent: false };
  }
}

export function saveEntry(techniqueId: string, rating: Rating, note: string): StorageResult {
  const { progress: current } = loadProgress();
  const progress: Progress = {
    ...current,
    entries: {
      ...current.entries,
      [techniqueId]: {
        rating,
        note: note.trim().slice(0, NOTE_MAX_LENGTH),
        updatedAt: new Date().toISOString(),
      },
    },
  };

  const storage = getStorage();
  if (!storage) return { progress, persistent: false };

  try {
    storage.setItem(STORAGE_KEY, JSON.stringify(progress));
    return { progress, persistent: true };
  } catch {
    return { progress, persistent: false };
  }
}

export function clearProgress(): StorageResult {
  const storage = getStorage();
  if (!storage) return { progress: emptyProgress(), persistent: false };

  try {
    storage.removeItem(STORAGE_KEY);
    return { progress: emptyProgress(), persistent: true };
  } catch {
    return { progress: emptyProgress(), persistent: false };
  }
}
