import { QueryClient, QueryCache } from "@tanstack/react-query";

export const createQueryClient = (setError: (msg: string | null) => void) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false, // 必要に応じて変更
      },
    },
    queryCache: new QueryCache({
      onError: (error: unknown) => {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError("不明なエラーが発生しました");
        }
      },
    }),
  });

  return queryClient;
};
