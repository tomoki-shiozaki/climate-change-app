import { useState, useCallback } from "react";
import type { ReactNode } from "react";
import { ErrorContext } from "./ErrorContext";
import type { ErrorContextType } from "./ErrorContext";

interface Props {
  children: ReactNode;
}

export const ErrorProvider = ({ children }: Props) => {
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => setError(null), []);

  const value: ErrorContextType = { error, setError, clearError };

  return (
    <ErrorContext.Provider value={value}>{children}</ErrorContext.Provider>
  );
};
