import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { AuthService } from '../../../core/auth/auth.service';

interface MenuItem {
  label: string;
  icon: string;
  route: string;
  section?: boolean;
  divider?: boolean;
  children?: MenuItem[];
  expanded?: boolean;
}

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  @Input() mode: 'expanded' | 'collapsed' | 'hidden' = 'expanded';
  @Output() modeChange = new EventEmitter<'expanded' | 'collapsed' | 'hidden'>();

  currentRoute = '';

  menuItems: MenuItem[] = [
    { label: 'Dashboard', icon: 'dashboard', route: '/dashboard' },
    { label: 'Visitors', icon: 'people', route: '/visitors' },
    { label: 'Tokens', icon: 'local_offer', route: '/tokens' },
    { label: 'Appointments', icon: 'event', route: '/appointments' },
    { label: 'Employees', icon: 'work', route: '/employees' },
    { label: 'Hosts', icon: 'business', route: '/hosts' },
    {
      label: 'MDM Data', icon: 'dataset', route: '', expanded: false,
      children: [
        { label: 'Visit Status', icon: '', route: '/mdm/VisitStatus' },
        { label: 'User Status', icon: '', route: '/mdm/UserStatus' },
        { label: 'Token Type', icon: '', route: '/mdm/TokenType' },
        { label: 'Organisation Type', icon: '', route: '/mdm/OrganisationType' }
      ]
    },
    { label: 'Admin', icon: '', route: '', section: true },
    { label: 'User Management', icon: 'manage_accounts', route: '/admin/users' },
    { label: 'Role Management', icon: 'shield', route: '/admin/roles' },
    { label: 'Permission', icon: 'lock', route: '/admin/permissions' },
    { label: '', icon: '', route: '', divider: true },
    { label: 'Reports', icon: 'bar_chart', route: '/reports' },
    { label: 'Settings', icon: 'settings', route: '/settings' }
  ];

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit(): void {
    this.currentRoute = this.router.url;
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.currentRoute = event.urlAfterRedirects || event.url;
    });

    const saved = localStorage.getItem('vms_sidebar_mode');
    if (saved) {
      this.mode = saved as any;
    }
  }

  isActive(route: string): boolean {
    if (!route) return false;
    return this.currentRoute.startsWith(route);
  }

  isParentActive(item: MenuItem): boolean {
    if (!item.children) return false;
    return item.children.some(child => this.currentRoute.startsWith(child.route));
  }

  toggleExpand(item: MenuItem): void {
    item.expanded = !item.expanded;
  }

  navigate(route: string): void {
    if (route) {
      this.router.navigate([route]);
    }
  }

  logout(): void {
    this.authService.logout();
  }

  toggleMode(): void {
    if (this.mode === 'expanded') {
      this.mode = 'collapsed';
    } else if (this.mode === 'collapsed') {
      this.mode = 'hidden';
    } else {
      this.mode = 'expanded';
    }
    localStorage.setItem('vms_sidebar_mode', this.mode);
    this.modeChange.emit(this.mode);
  }
}
