import { createContext } from "react";

export interface ErrorContextType {
  error: string | null;
  setError: (error: string | null) => void;
  clearError: () => void;
}

// Context作成（初期値はnullにしてカスタムフックで安全に扱う）
export const ErrorContext = createContext<ErrorContextType | null>(null);
