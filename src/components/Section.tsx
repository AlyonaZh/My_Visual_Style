import type { ReactNode } from "react";
import "./Section.css";

interface SectionProps {
  label: ReactNode;
  children: ReactNode;
  /** «strong» — раздел, отделённый сверху толстой линией (оценка). */
  variant?: "default" | "strong";
}

/** Раздел в две колонки: слева подпись (3 колонки сетки), справа содержание (9). */
export default function Section({ label, children, variant = "default" }: SectionProps) {
  return (
    <section className={`section section--${variant}`}>
      <h2 className="section__label">{label}</h2>
      <div className="section__content">{children}</div>
    </section>
  );
}
