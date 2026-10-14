export type Theme = "light" | "dark";

export const THEME_KEY = "my-visual-language:theme";

/** Выбор, который человек сделал сам. null — если ещё не выбирал или хранилище недоступно. */
export function getStoredTheme(): Theme | null {
  try {
    const value = localStorage.getItem(THEME_KEY);
    return value === "light" || value === "dark" ? value : null;
  } catch {
    return null;
  }
}

export function saveTheme(theme: Theme): void {
  try {
    localStorage.setItem(THEME_KEY, theme);
  } catch {
    // Хранилище недоступно: тема применится, но не запомнится.
  }
}

export function getSystemTheme(): Theme {
  return window.matchMedia?.("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

/** Тема, которая сейчас стоит на <html>. Её выставляет инлайн-скрипт в index.html до загрузки React. */
export function getCurrentTheme(): Theme {
  const value = document.documentElement.dataset.theme;
  return value === "light" || value === "dark" ? value : getStoredTheme() ?? getSystemTheme();
}

export function applyTheme(theme: Theme): void {
  document.documentElement.dataset.theme = theme;
}
