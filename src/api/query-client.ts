import { MutationCache, QueryCache, QueryClient } from '@tanstack/react-query';
import { mutationErrorHandler, queryErrorHandler } from './errorHandler';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: true,
      retry: 0,
    },
  },
  mutationCache: new MutationCache({
    onError: mutationErrorHandler,
  }),
  queryCache: new QueryCache({
    onError: queryErrorHandler,
  }),
});
