import { client } from '../axios';
import { createGetQueryHook } from '../helpers';

// export async function getAccountInfo() {
//   const response = await client.get('/subjects');
//   if (response.status === 200) {
//     return true;
//   }
//   return false;
// }

// Add a React Query hook to properly cache the account info request
export const useGetAccountInfo = createGetQueryHook({
  endpoint: '/subjects',
  rQueryParams: {
    queryKey: ['accountInfo'],
    // Handle retries to work with token refresh mechanism
    retry: 3,
    retryDelay: 1000,
  },
});
