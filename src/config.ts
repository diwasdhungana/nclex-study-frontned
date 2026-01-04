export const app = {
  name: 'Nclex Study',

  // apiBaseUrl: 'https://dev-demo.all-attend.com/gracern-prod-api', //for production
  // apiBaseUrl: 'https://dev-demo.all-attend.com/gracern-api', //for development
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL,
  fakeBackend: false,
  redirectQueryParamName: 'r',
  accessTokenStoreKey: 'access_token',
  refreshTokenStoreKey: 'refresh_token',
};
