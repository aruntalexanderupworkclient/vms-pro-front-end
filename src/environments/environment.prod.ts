export const environment = {
  production: true,
  useInMemoryApi: false,
  apiUrl: 'https://api.vmspro.com',
  ssoConfig: {
    issuer: 'https://YOUR_SSO_PROVIDER',
    clientId: 'YOUR_CLIENT_ID',
    redirectUri: typeof window !== 'undefined' ? window.location.origin + '/dashboard' : '',
    scope: 'openid profile email'
  }
};
