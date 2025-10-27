import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: (failureCount: any, error: any) => {
        return failureCount < 2;
      },
      onError: (error: any) => {
        console.error("💥 Mutation Error:", {
          code: error?.code,
          message: error?.message,
        });
      },
    },
  },
});
