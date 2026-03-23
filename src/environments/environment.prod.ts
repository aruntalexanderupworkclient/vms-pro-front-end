export const environment = {
  production: true,
  useInMemoryApi: false,
  apiUrl: 'https://vms-api-efbacghgbvhhdsdb.southindia-01.azurewebsites.net',
  
  // Google Sign-In
  googleClientId: '169656025674-akam3hj6lsf9skmbhdkv3l63ugderojt.apps.googleusercontent.com',
  
  ssoConfig: {
    issuer: 'https://YOUR_SSO_PROVIDER',
    clientId: 'YOUR_CLIENT_ID',
    redirectUri: typeof window !== 'undefined' ? window.location.origin + '/dashboard' : '',
    scope: 'openid profile email'
  }
};
