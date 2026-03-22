import { Component, Output, EventEmitter } from '@angular/core';
import { AuthService } from '../../../core/auth/auth.service';
import { User } from '../../../core/service-proxies';

@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.scss']
})
export class TopbarComponent {
  @Output() toggleSidebar = new EventEmitter<void>();

  user: User | null = null;
  showDropdown = false;
  showProfile = false;

  constructor(private authService: AuthService) {
    this.authService.currentUser$.subscribe((u: User | null) => this.user = u);
  }

  get initials(): string {
    return this.user ? this.authService.getInitials(this.user.fullName) : '?';
  }

  get pageTitle(): string {
    const path = window.location.pathname;
    const segments = path.split('/').filter(s => s);
    if (segments.length === 0) return 'Dashboard';
    const last = segments[segments.length - 1];
    return last.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  }

  onToggleSidebar(): void {
    this.toggleSidebar.emit();
  }

  toggleDropdown(): void {
    this.showDropdown = !this.showDropdown;
  }

  logout(): void {
    this.authService.logout();
  }

  openProfile(): void {
    this.showProfile = true;
    this.showDropdown = false;
  }

  closeProfile(): void {
    this.showProfile = false;
  }
}
