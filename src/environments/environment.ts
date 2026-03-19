// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,

  // ─── API Mode Switch ───────────────────────────────────────────────
  // Set to true  → uses angular-in-memory-web-api (no backend needed)
  // Set to false → uses the real Web API at apiUrl
  useInMemoryApi: false,

  // Real API base URL (used when useInMemoryApi = false)
  apiUrl: 'https://localhost:44389/api',

  // Google Sign-In
  googleClientId: '169656025674-akam3hj6lsf9skmbhdkv3l63ugderojt.apps.googleusercontent.com',

  ssoConfig: {
    issuer: 'https://YOUR_SSO_PROVIDER',
    clientId: 'YOUR_CLIENT_ID',
    redirectUri: typeof window !== 'undefined' ? window.location.origin + '/dashboard' : '',
    scope: 'openid profile email'
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
