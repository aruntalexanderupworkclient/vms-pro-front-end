import { Component, OnInit } from '@angular/core';
import { UserServiceProxy, User, UserStatus } from '../../../core/service-proxies';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.scss']
})
export class UserManagementComponent implements OnInit {
  users: User[] = [];
  filteredUsers: User[] = [];
  searchTerm = '';
  roleFilter = '';
  roles: string[] = ['Super Admin', 'Manager', 'Receptionist', 'Security'];

  // Slide-over state
  showPanel = false;
  editMode = false;
  currentUser: User = this.getEmptyUser();

  constructor(private userService: UserServiceProxy) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.userService.getAllUsers().subscribe(res => {
      this.users = res.data.items;
      this.applyFilters();
    }); 
  }

  applyFilters(): void {
    this.filteredUsers = this.users.filter(u => {
      const matchesSearch = !this.searchTerm ||
        u.fullName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchesRole = !this.roleFilter || u.roleName === this.roleFilter;
      return matchesSearch && matchesRole;
    });
  }

  openAddUser(): void {
    this.currentUser = this.getEmptyUser();
    this.editMode = false;
    this.showPanel = true;
  }

  openEditUser(user: User): void {
    this.currentUser = { ...user };
    this.editMode = true;
    this.showPanel = true;
  }

  closePanel(): void {
    this.showPanel = false;
  }

  saveUser(): void {
    if (this.editMode) {
      this.userService.updateUser(this.currentUser.id, this.currentUser).subscribe(() => {
        this.loadUsers();
        this.closePanel();
      });
    } else {
      this.userService.createUser(this.currentUser).subscribe(() => {
        this.loadUsers();
        this.closePanel();
      });
    }
  }

  deleteUser(user: User): void {
    if (confirm(`Delete user "${user.fullName}"?`)) {
      this.userService.deleteUser(user.id).subscribe(() => {
        this.loadUsers();
      });
    }
  }

  toggleStatus(user: User): void {
    user.status = user.status === UserStatus.Active ? UserStatus.Inactive : UserStatus.Active;
    this.userService.updateUser(user.id, user).subscribe();
  }

  getInitials(name: string): string {
    if (!name) return '?';
    const parts = name.trim().split(' ');
    return parts.length >= 2 ? (parts[0][0] + parts[1][0]).toUpperCase() : parts[0][0].toUpperCase();
  }

  getRoleBadgeClass(role: string | undefined): string {
    switch (role) {
      case 'Super Admin': return 'badge badge-blue';
      case 'Manager': return 'badge badge-purple';
      case 'Receptionist': return 'badge badge-green';
      case 'Security': return 'badge badge-amber';
      default: return 'badge';
    }
  }

  private getEmptyUser(): User {
    return {
      id: '',
      fullName: '',
      email: '',
      phone: '',
      roleId: '',
      roleName: 'Receptionist',
      status: UserStatus.Active,
      organisationId: undefined,
      organisationName: undefined,
      createdAt: new Date().toISOString()
    };
  }
}
