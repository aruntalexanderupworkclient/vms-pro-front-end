import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { UserServiceProxy, User, UserStatus } from '../service-proxies';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private http: HttpClient,
    private userService: UserServiceProxy,
    private router: Router
  ) {
    const stored = sessionStorage.getItem('vms_user');
    if (stored) {
      this.currentUserSubject.next(JSON.parse(stored));
    }
  }

  get currentUser(): User | null {
    return this.currentUserSubject.value;
  }

  get isLoggedIn(): boolean {
    let token = localStorage.getItem('token');
    return !!token;
  }

  /**
   * Unified method to set authentication session
   * Stores JWT token in localStorage and user details in sessionStorage
   * Called by all login methods: email, Google, demo, SSO
   */
  public setAuthSession(token: string, user: User): void {
    // Store JWT token for API Authorization header
    localStorage.setItem('token', token);
    
    // Store user object for session context
    sessionStorage.setItem('vms_user', JSON.stringify(user));
    
    // Update reactive BehaviorSubject for components
    this.currentUserSubject.next(user);
  }

  login(email: string, password: string): Observable<User | null> {
    return this.userService.getAllUsers().pipe(
      map(res => {
        const user = res.data.items.find(u => u.email === email);
        if (user) {
          // For demo purposes, use a mock token
          // In production, backend would return actual JWT
          const mockToken = 'demo-jwt-token-' + Date.now();
          this.setAuthSession(mockToken, user);
          return user;
        }
        return null;
      })
    );
  }

  /**
   * Login via real API with username/password credentials.
   * POST /api/auth/login → { token, user }
   */
  loginWithCredentials(credentials: { email: string; password: string }): Observable<{ token: string; user: User }> {
    return this.http.post<{ token: string; user: User }>(
      `${environment.apiUrl}/auth/login`,
      credentials
    ).pipe(
      tap(res => this.setAuthSession(res.token, res.user))
    );
  }

  /**
   * Login using Google OAuth credentials.
   * Expects a response from Google Sign-In with an ID token.
   * POST /api/auth/google-login → { token, user }
   * @param response 
   * @returns 
   */
  loginWithGoogleCredentials(response: any): Observable<{ token: string; user: User }> {
    const idToken = response.credential;

    return this.http.post<{ token: string; user: User }>(
      `${environment.apiUrl}/auth/google-login`,
      { idToken }
    ).pipe(
      tap(res => this.setAuthSession(res.token, res.user))
    );
  }

  loginAsDemo(): Observable<User> {
    const demoUser: User = {
      id: '00000000-0000-0000-0000-000000000001',
      fullName: 'Admin User',
      email: 'admin@vmspro.com',
      phone: '+1234567890',
      roleId: '00000000-0000-0000-0000-000000000001',
      roleName: 'Super Admin',
      // status: UserStatus.Active,
      organisationId: '00000000-0000-0000-0000-000000000001',
      organisationName: 'VMS Pro',
      createdAt: new Date().toISOString()
    };
    // Use demo token for demo login
    const demoToken = 'demo-jwt-token-' + Date.now();
    this.setAuthSession(demoToken, demoUser);
    return of(demoUser);
  }

  logout(): void {
    // Clear token
    localStorage.removeItem('token');
    
    // Clear user session
    sessionStorage.removeItem('vms_user');
    
    // Clear reactive state
    this.currentUserSubject.next(null);
    
    // Navigate to login
    this.router.navigate(['/login']);
  }

  getInitials(fullName: string): string {
    if (!fullName) return '?';
    const parts = fullName.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return parts[0][0].toUpperCase();
  }

  private setSession(user: User): void {
    sessionStorage.setItem('vms_user', JSON.stringify(user));
    this.currentUserSubject.next(user);
  }
}
