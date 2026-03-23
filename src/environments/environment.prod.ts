export const environment = {
  production: true,
  useInMemoryApi: false,
  apiUrl: 'https://vms-api-efbacghgbvhhdsdb.southindia-01.azurewebsites.net',
  ssoConfig: {
    issuer: 'https://YOUR_SSO_PROVIDER',
    clientId: 'YOUR_CLIENT_ID',
    redirectUri: typeof window !== 'undefined' ? window.location.origin + '/dashboard' : '',
    scope: 'openid profile email'
  }
};
