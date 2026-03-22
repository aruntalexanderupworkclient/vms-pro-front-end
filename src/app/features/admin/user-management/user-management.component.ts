import { Component, OnInit } from '@angular/core';
import { UserServiceProxy, RoleServiceProxy, User, UserStatus, Role, CreateUserDto, UpdateUserDto } from '../../../core/service-proxies';

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
  // roles: string[] = ['Super Admin', 'Manager', 'Receptionist', 'Security'];
  roles: Role[] = [];

  // Slide-over state
  showPanel = false;
  editMode = false;
  currentUser: User = this.getEmptyUser();

  constructor(private userService: UserServiceProxy, private roleService: RoleServiceProxy) {}

  ngOnInit(): void {
    this.loadRoles();
    this.loadUsers();
  }

  loadRoles(): void {
    this.roleService.getAllRoles(1, 100).subscribe(res => {
      this.roles = res.data.items;
    });
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
      const updateDto = this.mapToUpdateUserDto(this.currentUser);
      this.userService.updateUser(this.currentUser.id, updateDto).subscribe(() => {
        this.loadUsers();
        this.closePanel();
      });
    } else {
      const createDto = this.mapToCreateUserDto(this.currentUser);
      this.userService.createUser(createDto).subscribe(() => {
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
    const updateDto = this.mapToUpdateUserDto(user);
    this.userService.updateUser(user.id, updateDto).subscribe();
  }

  getInitials(name: string): string {
    if (!name) return '?';
    const parts = name.trim().split(' ');
    return parts.length >= 2 ? (parts[0][0] + parts[1][0]).toUpperCase() : parts[0][0].toUpperCase();
  }

  getRoleBadgeClass(role: string | undefined): string {
    if (!role) return 'badge';
    const roleName = role.toLowerCase();
    if (roleName.includes('admin')) return 'badge badge-blue';
    if (roleName.includes('manager')) return 'badge badge-purple';
    if (roleName.includes('receptionist')) return 'badge badge-green';
    if (roleName.includes('security')) return 'badge badge-amber';
    return 'badge';
  }

  private getEmptyUser(): User {
    return {
      id: '',
      fullName: '',
      email: '',
      phone: '',
      password: 'Test@1234',
      roleId: '',
      roleName: 'Receptionist',
      status: UserStatus.Active,
      organisationId: undefined,
      organisationName: undefined,
      createdAt: new Date().toISOString()
    };
  }

  private mapToCreateUserDto(user: User): CreateUserDto {
    return {
      FullName: user.fullName,
      Email: user.email,
      Phone: user.phone,
      Password: user.password || '',
      RoleId: user.roleId,
      OrganisationId: user.organisationId || null
    };
  }

  private mapToUpdateUserDto(user: User): UpdateUserDto {
    return {
      FullName: user.fullName,
      Email: user.email,
      Phone: user.phone,
      RoleId: user.roleId,
      Status: user.status,
      OrganisationId: user.organisationId || null
    };
  }
}
