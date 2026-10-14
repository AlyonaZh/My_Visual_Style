import { useEffect, useRef, useState } from "react";
import { useProgress } from "../lib/progress";
import "./Footer.css";

export default function Footer() {
  const { persistent, reset } = useProgress();
  const [confirming, setConfirming] = useState(false);

  // После открытия подтверждения фокус на «Отмена», после закрытия — обратно на «Начать заново».
  const focusAfterSwitch = useRef(false);
  const restartRef = useRef<HTMLButtonElement>(null);
  const cancelRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!focusAfterSwitch.current) return;
    focusAfterSwitch.current = false;
    (confirming ? cancelRef : restartRef).current?.focus();
  }, [confirming]);

  function toggle(next: boolean) {
    focusAfterSwitch.current = true;
    setConfirming(next);
  }

  return (
    <footer className="container">
      <div className="footer">
        <p className="footer__note">
          {persistent ? "Прогресс хранится только в этом браузере" : "Прогресс не сохраняется в этом браузере"}
        </p>

        {confirming ? (
          <div className="footer__confirm" role="group" aria-label="Подтверждение">
            <span>Стереть все оценки?</span>
            <button
              type="button"
              className="footer__action footer__action--danger"
              onClick={() => {
                reset();
                toggle(false);
              }}
            >
              Стереть
            </button>
            <button type="button" className="footer__action" ref={cancelRef} onClick={() => toggle(false)}>
              Отмена
            </button>
          </div>
        ) : (
          <button type="button" className="footer__action" ref={restartRef} onClick={() => toggle(true)}>
            Начать заново
          </button>
        )}
      </div>
    </footer>
  );
}
