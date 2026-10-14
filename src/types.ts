export type Axis = "color" | "texture" | "form" | "composition";

export interface Technique {
  id: string; // латиницей, kebab-case, используется в URL: "glitch"
  order: number; // порядковый номер в курсе
  title: string;
  axis: Axis; // основная ось, показывается меткой у заголовка
  summary: string; // главное описание, 1–2 предложения
  history: string; // откуда приём взялся, 1–3 предложения
  task: string;
  tips: string[]; // 2–4 коротких подсказки
  duration: string; // «15–30 мин»
  artists: { name: string; note: string }[];
  prompt: { en: string; ru: string };
  promptIntro: string; // текст над промтами
  promptNote: string; // текст под промтами
  image?: { src: string; alt: string; caption: string }; // src относительно public/
}

export type Rating = 1 | 2 | 3 | 4 | 5;

export interface ProgressEntry {
  rating: Rating;
  note: string; // может быть пустой, до 500 символов
  updatedAt: string; // ISO-дата
}

export interface Progress {
  version: 1;
  entries: Record<string, ProgressEntry>; // ключ — technique.id
}
