import data from "../data/techniques.json";
import type { Axis, Technique } from "../types";

/** Сколько приёмов будет в курсе. Показывается в шапке, даже если в JSON их пока меньше. */
export const COURSE_LENGTH = 12;

export const AXIS_LABELS: Record<Axis, string> = {
  color: "Цвет",
  texture: "Фактура",
  form: "Форма",
  composition: "Композиция",
};

/** Все приёмы в порядке курса. */
export const techniques: Technique[] = [...(data as Technique[])].sort((a, b) => a.order - b.order);

export function getTechnique(id: string | undefined): Technique | undefined {
  return techniques.find((t) => t.id === id);
}

/** Путь к файлу из public/ с учётом base (на GitHub Pages сайт лежит не в корне домена). */
export function publicUrl(path: string): string {
  return import.meta.env.BASE_URL + path.replace(/^\//, "");
}
