import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { UserServiceProxy, User, UserStatus } from '../service-proxies';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private userService: UserServiceProxy, private router: Router) {
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

  login(email: string, password: string): Observable<User | null> {
    return this.userService.getAllUsers().pipe(
      map(res => {
        const user = res.data.items.find(u => u.email === email);
        if (user) {
          this.setSession(user);
          return user;
        }
        return null;
      })
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
      status: UserStatus.Active,
      organisationId: '00000000-0000-0000-0000-000000000001',
      organisationName: 'VMS Pro',
      createdAt: new Date().toISOString()
    };
    this.setSession(demoUser);
    return of(demoUser);
  }

  logout(): void {
    sessionStorage.removeItem('vms_user');
    this.currentUserSubject.next(null);
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
