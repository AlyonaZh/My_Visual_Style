import { useEffect, useRef, useState, type RefObject } from "react";
import "./CopyButton.css";

interface CopyButtonProps {
  text: string;
  label: string; // aria-label: «Скопировать промт на английском»
  /** Элемент с текстом: если буфер обмена недоступен, выделяем его, чтобы человек скопировал сам. */
  fallbackTarget: RefObject<HTMLElement | null>;
}

const RESET_AFTER_MS = 2000;

export default function CopyButton({ text, label, fallbackTarget }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => setCopied(false), RESET_AFTER_MS);
    } catch {
      selectContents(fallbackTarget.current);
    }
  }

  return (
    <>
      <button type="button" className="copy-button" aria-label={label} title="Скопировать" onClick={copy}>
        {copied ? <CheckIcon /> : <CopyIcon />}
      </button>
      <span className="visually-hidden" role="status" aria-live="polite">
        {copied ? "Скопировано" : ""}
      </span>
    </>
  );
}

function selectContents(element: HTMLElement | null) {
  if (!element) return;
  const selection = window.getSelection();
  const range = document.createRange();
  range.selectNodeContents(element);
  selection?.removeAllRanges();
  selection?.addRange(range);
}

function CopyIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <rect x="6.25" y="6.25" width="9" height="9" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M11.75 3.75V3.25C11.75 2.42 11.08 1.75 10.25 1.75H4.25C3.42 1.75 2.75 2.42 2.75 3.25V9.25C2.75 10.08 3.42 10.75 4.25 10.75H4.75"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <path d="M3.5 9.5L7.25 13L14.5 5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
