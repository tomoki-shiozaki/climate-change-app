import { AxiosError } from "axios";

export const shouldHandleGlobalError = (
  error: unknown
): error is AxiosError => {
  return (
    error instanceof AxiosError &&
    (!error.response ||
      (error.response.status >= 500 && error.response.status < 600))
  );
};
