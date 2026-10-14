import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import type { Progress, Rating } from "../types";
import { clearProgress, loadProgress, saveEntry, type StorageResult } from "./storage";

interface ProgressContextValue {
  progress: Progress;
  /** false — прогресс не переживёт перезагрузку (хранилище недоступно или данные битые). */
  persistent: boolean;
  /** Растёт при каждом «Начать заново», чтобы формы сбросились. */
  resetCount: number;
  save: (techniqueId: string, rating: Rating, note: string) => void;
  reset: () => void;
}

const ProgressContext = createContext<ProgressContextValue | null>(null);

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<StorageResult>(loadProgress);
  const [resetCount, setResetCount] = useState(0);

  const save = useCallback((techniqueId: string, rating: Rating, note: string) => {
    setState(saveEntry(techniqueId, rating, note));
  }, []);

  const reset = useCallback(() => {
    setState(clearProgress());
    setResetCount((count) => count + 1);
  }, []);

  const value = useMemo(
    () => ({ progress: state.progress, persistent: state.persistent, resetCount, save, reset }),
    [state, resetCount, save, reset],
  );

  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>;
}

export function useProgress(): ProgressContextValue {
  const value = useContext(ProgressContext);
  if (!value) throw new Error("useProgress должен вызываться внутри ProgressProvider");
  return value;
}
