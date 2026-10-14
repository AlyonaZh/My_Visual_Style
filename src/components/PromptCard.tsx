import { useRef } from "react";
import CopyButton from "./CopyButton";
import "./PromptCard.css";

interface PromptCardProps {
  language: string; // «English» / «Русский»
  copyLabel: string;
  text: string;
  lang: "en" | "ru";
}

export default function PromptCard({ language, copyLabel, text, lang }: PromptCardProps) {
  const textRef = useRef<HTMLParagraphElement>(null);

  return (
    <div className="prompt-card">
      <div className="prompt-card__head">
        <span className="prompt-card__language">{language}</span>
        <CopyButton text={text} label={copyLabel} fallbackTarget={textRef} />
      </div>
      <p ref={textRef} className="prompt-card__text" lang={lang}>
        {text}
      </p>
    </div>
  );
}
