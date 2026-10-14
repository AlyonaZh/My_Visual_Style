import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import { NOTE_MAX_LENGTH } from "../lib/storage";
import type { ProgressEntry, Rating } from "../types";
import "./RatingForm.css";

export const RATING_LABELS: Record<Rating, string> = {
  1: "Совсем не моё",
  2: "Скорее нет",
  3: "Нейтрально",
  4: "Скорее да",
  5: "Очень моё",
};

const RATINGS: Rating[] = [1, 2, 3, 4, 5];

interface RatingFormProps {
  entry: ProgressEntry | undefined;
  onSave: (rating: Rating, note: string) => void;
}

export default function RatingForm({ entry, onSave }: RatingFormProps) {
  const [editing, setEditing] = useState(!entry);
  const [rating, setRating] = useState<Rating | null>(entry?.rating ?? null);
  const [note, setNote] = useState(entry?.note ?? "");

  // Куда перевести фокус после смены режима: на результат после «Готово», на форму после «Изменить».
  const focusAfterSwitch = useRef(false);
  const resultRef = useRef<HTMLDivElement>(null);
  const fieldsetRef = useRef<HTMLFieldSetElement>(null);

  const id = useId();
  const noteId = `${id}-note`;
  const counterId = `${id}-counter`;

  useEffect(() => {
    if (!focusAfterSwitch.current) return;
    focusAfterSwitch.current = false;
    if (editing) {
      const fieldset = fieldsetRef.current;
      (fieldset?.querySelector<HTMLInputElement>("input:checked") ?? fieldset?.querySelector("input"))?.focus();
    } else {
      resultRef.current?.focus();
    }
  }, [editing]);

  function submit(event: FormEvent) {
    event.preventDefault();
    if (!rating) return;
    onSave(rating, note);
    focusAfterSwitch.current = true;
    setEditing(false);
  }

  function edit() {
    setRating(entry?.rating ?? null);
    setNote(entry?.note ?? "");
    focusAfterSwitch.current = true;
    setEditing(true);
  }

  if (entry && !editing) {
    return (
      <div className="rating-result" ref={resultRef} tabIndex={-1}>
        <p className="rating-result__score">
          {entry.rating} из 5 · {RATING_LABELS[entry.rating]}
        </p>
        {entry.note && <p className="rating-result__note">{entry.note}</p>}
        <button type="button" className="pill-button pill-button--outline" onClick={edit}>
          Изменить
        </button>
      </div>
    );
  }

  return (
    <form className="rating-form" onSubmit={submit}>
      <fieldset className="rating-form__fieldset" ref={fieldsetRef}>
        <legend className="rating-form__question">Насколько этот приём — твой?</legend>
        <div className="rating-form__options">
          {RATINGS.map((value) => (
            <label key={value} className={`rating-option${rating === value ? " is-selected" : ""}`}>
              <input
                type="radio"
                name={`${id}-rating`}
                value={value}
                checked={rating === value}
                onChange={() => setRating(value)}
                className="visually-hidden"
              />
              <span className="rating-option__number">{value}</span>
              <span className="rating-option__label">{RATING_LABELS[value]}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className="rating-form__note">
        <label htmlFor={noteId} className="rating-form__note-label">
          Заметка, необязательно
        </label>
        <textarea
          id={noteId}
          className="rating-form__textarea"
          value={note}
          maxLength={NOTE_MAX_LENGTH}
          onChange={(event) => setNote(event.target.value)}
          placeholder="Например: сдвиг каналов понравился, а нарезка полосками показалась слишком шумной"
          aria-describedby={counterId}
        />
        <p id={counterId} className="rating-form__counter">
          <span aria-hidden="true">
            {note.length} / {NOTE_MAX_LENGTH}
          </span>
          <span className="visually-hidden">
            {note.length} из {NOTE_MAX_LENGTH} символов
          </span>
        </p>
      </div>

      <button type="submit" className="pill-button" disabled={!rating}>
        Готово
      </button>
    </form>
  );
}
