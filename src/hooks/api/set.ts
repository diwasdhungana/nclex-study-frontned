import { createGetQueryHook } from '@/api/helpers';

export const useGetSets = createGetQueryHook({
  endpoint: '/archer/sets',
  // TODO: verify the following line is correct
  rQueryParams: { queryKey: ['sets'] },
});
