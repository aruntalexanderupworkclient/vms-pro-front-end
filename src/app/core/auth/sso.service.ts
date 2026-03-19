import { Injectable } from '@angular/core';

/**
 * SSO Service Stub
 * ─────────────────
 * This is a placeholder service. To enable real SSO:
 *   1. npm install angular-oauth2-oidc
 *   2. Add OAuthModule.forRoot() to AppModule imports
 *   3. Replace this stub with the real OAuthService integration
 *   4. Update environment.ssoConfig with your identity provider details
 */
@Injectable({ providedIn: 'root' })
export class SsoService {

  login(): void {
    alert('SSO is not configured yet.\n\nTo enable SSO, configure your Identity Provider in environment.ts and integrate angular-oauth2-oidc.');
  }

  logout(): void {
    // no-op until SSO is configured
  }

  get token(): string {
    return '';
  }

  get isAuthenticated(): boolean {
    return false;
  }
}
