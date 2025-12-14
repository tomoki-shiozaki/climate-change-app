import { QueryClient, QueryCache } from "@tanstack/react-query";
import { shouldHandleGlobalError } from "@/lib/errors/shouldHandleGlobalError";
import { logError } from "@/lib/logger";

export const createQueryClient = (setError: (msg: string | null) => void) => {
  const queryClient = new QueryClient({
    // TanStack Query 全体の共通設定
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
    queryCache: new QueryCache({
      onError: (error) => {
        if (shouldHandleGlobalError(error)) {
          logError(error);
          setError(
            "サーバーとの通信に問題が発生しました。しばらくしてから再度お試しください。"
          );
        }
      },
    }),
  });

  return queryClient;
};
