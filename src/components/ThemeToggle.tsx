import { useEffect, useState } from "react";
import { applyTheme, getCurrentTheme, getStoredTheme, saveTheme, type Theme } from "../lib/theme";
import "./ThemeToggle.css";

const OPTIONS: { value: Theme; label: string }[] = [
  { value: "light", label: "Светлая" },
  { value: "dark", label: "Тёмная" },
];

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>(getCurrentTheme);

  // Пока человек сам не выбрал тему, следуем за настройками системы.
  useEffect(() => {
    const media = window.matchMedia?.("(prefers-color-scheme: dark)");
    if (!media) return;
    const onChange = (event: MediaQueryListEvent) => {
      if (getStoredTheme()) return;
      const next: Theme = event.matches ? "dark" : "light";
      applyTheme(next);
      setTheme(next);
    };
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  function choose(next: Theme) {
    applyTheme(next);
    saveTheme(next);
    setTheme(next);
  }

  return (
    <div className="theme-toggle" role="group" aria-label="Тема оформления">
      {OPTIONS.map((option) => (
        <button
          key={option.value}
          type="button"
          className="theme-toggle__button"
          aria-pressed={theme === option.value}
          onClick={() => choose(option.value)}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
