import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

// На GitHub Pages сайт живёт по адресу https://<user>.github.io/<repo>/,
// поэтому base должен совпадать с именем репозитория.
// Порядок: переменная BASE_PATH → имя репозитория из GITHUB_REPOSITORY (есть в GitHub Actions) → "/".
// BASE_PATH="/" — для своего домена. Репозиторий <user>.github.io публикуется в корень.
function resolveBase(): string {
  const explicit = process.env.BASE_PATH?.trim();
  if (explicit) {
    const name = explicit.replace(/^\/+|\/+$/g, "");
    return name ? `/${name}/` : "/";
  }

  const repo = process.env.GITHUB_REPOSITORY?.split("/")[1];
  if (!repo || repo.endsWith(".github.io")) return "/";
  return `/${repo}/`;
}

export default defineConfig({
  base: resolveBase(),
  plugins: [react()],
  test: {
    environment: "jsdom",
  },
});
