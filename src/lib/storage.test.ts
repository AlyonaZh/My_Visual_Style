import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { clearProgress, loadProgress, saveEntry, STORAGE_KEY } from "./storage";

beforeEach(() => {
  localStorage.clear();
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe("пустое хранилище", () => {
  it("возвращает пустой прогресс, и сохранение работает", () => {
    expect(loadProgress()).toEqual({ progress: { version: 1, entries: {} }, persistent: true });
  });
});

describe("битый JSON", () => {
  it("возвращает пустой прогресс и сообщает, что прогресс не сохраняется", () => {
    localStorage.setItem(STORAGE_KEY, "{not json");
    expect(loadProgress()).toEqual({ progress: { version: 1, entries: {} }, persistent: false });
  });

  it("не принимает данные другой версии или формы", () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ version: 2, entries: {} }));
    expect(loadProgress().persistent).toBe(false);

    localStorage.setItem(STORAGE_KEY, JSON.stringify([1, 2, 3]));
    expect(loadProgress().persistent).toBe(false);
  });

  it("отбрасывает отдельные испорченные записи и оставляет целые", () => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        version: 1,
        entries: {
          glitch: { rating: 4, note: "", updatedAt: "2026-10-15T00:00:00.000Z" },
          broken: { rating: 9, note: "", updatedAt: "2026-10-15T00:00:00.000Z" },
        },
      }),
    );
    const { progress, persistent } = loadProgress();
    expect(persistent).toBe(true);
    expect(Object.keys(progress.entries)).toEqual(["glitch"]);
  });

  it("сохранение поверх битых данных их заменяет", () => {
    localStorage.setItem(STORAGE_KEY, "{not json");
    expect(saveEntry("glitch", 3, "").persistent).toBe(true);
    expect(loadProgress().progress.entries.glitch.rating).toBe(3);
  });
});

describe("недоступный localStorage", () => {
  it("сам доступ к localStorage бросает исключение", () => {
    vi.spyOn(window, "localStorage", "get").mockImplementation(() => {
      throw new DOMException("denied", "SecurityError");
    });

    expect(loadProgress()).toEqual({ progress: { version: 1, entries: {} }, persistent: false });

    const saved = saveEntry("glitch", 5, "заметка");
    expect(saved.persistent).toBe(false);
    expect(saved.progress.entries.glitch.rating).toBe(5);

    expect(clearProgress().persistent).toBe(false);
  });

  it("чтение и запись бросают исключение", () => {
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new Error("read failed");
    });
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new DOMException("quota", "QuotaExceededError");
    });

    expect(loadProgress().persistent).toBe(false);
    expect(saveEntry("glitch", 2, "").persistent).toBe(false);
  });
});

describe("сохранение и чтение записи", () => {
  it("запись читается обратно после сохранения", () => {
    const result = saveEntry("glitch", 4, "сдвиг каналов понравился");
    expect(result.persistent).toBe(true);

    const entry = loadProgress().progress.entries.glitch;
    expect(entry.rating).toBe(4);
    expect(entry.note).toBe("сдвиг каналов понравился");
    expect(new Date(entry.updatedAt).toISOString()).toBe(entry.updatedAt);
  });

  it("повторное сохранение заменяет запись и не трогает другие", () => {
    saveEntry("glitch", 2, "");
    saveEntry("collage", 5, "");
    saveEntry("glitch", 4, "передумала");

    const { entries } = loadProgress().progress;
    expect(entries.glitch.rating).toBe(4);
    expect(entries.glitch.note).toBe("передумала");
    expect(entries.collage.rating).toBe(5);
  });

  it("обрезает заметку до 500 символов", () => {
    saveEntry("glitch", 3, "а".repeat(600));
    expect(loadProgress().progress.entries.glitch.note).toHaveLength(500);
  });

  it("clearProgress стирает все оценки", () => {
    saveEntry("glitch", 3, "");
    expect(clearProgress()).toEqual({ progress: { version: 1, entries: {} }, persistent: true });
    expect(localStorage.getItem(STORAGE_KEY)).toBeNull();
  });
});
