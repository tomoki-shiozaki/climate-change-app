import { QueryClient, QueryCache } from "@tanstack/react-query";
import { AxiosError } from "axios";

export const createQueryClient = (setError: (msg: string | null) => void) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
    queryCache: new QueryCache({
      onError: (error: unknown) => {
        if (error instanceof AxiosError) {
          const status = error.response?.status;
          if (status && status >= 500 && status < 600) {
            setError(`サーバーエラーが発生しました (${status})`);
          }
        }
      },
    }),
  });

  return queryClient;
};
