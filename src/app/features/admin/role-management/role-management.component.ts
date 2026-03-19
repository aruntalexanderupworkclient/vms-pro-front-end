import { Component, OnInit } from '@angular/core';
import { RoleServiceProxy } from '../../../core/service-proxies';

@Component({
  selector: 'app-role-management',
  templateUrl: './role-management.component.html',
  styleUrls: ['./role-management.component.scss']
})
export class RoleManagementComponent implements OnInit {
  roles: any[] = [];
  showModal = false;
  editMode = false;
  currentRole: any = this.getEmptyRole();

  permissionModules = [
    { key: 'visitors', label: 'Visitor Management' },
    { key: 'employees', label: 'Employee Management' },
    { key: 'tokens', label: 'Token Management' },
    { key: 'admin', label: 'User Admin' },
    { key: 'reports', label: 'Reports' },
    { key: 'settings', label: 'Settings' }
  ];

  permissionActions = ['view', 'create', 'edit', 'delete'];

  constructor(private roleService: RoleServiceProxy) {}

  ngOnInit(): void {
    this.loadRoles();
  }

  loadRoles(): void {
    this.roleService.getAllRoles().subscribe(res => {
      this.roles = res.data.items;
    });
  }

  openAddRole(): void {
    this.currentRole = this.getEmptyRole();
    this.editMode = false;
    this.showModal = true;
  }

  openEditRole(role: any): void {
    this.currentRole = JSON.parse(JSON.stringify(role));
    this.editMode = true;
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
  }

  saveRole(): void {
    if (this.editMode) {
      this.roleService.updateRole(this.currentRole.id, this.currentRole).subscribe(() => {
        this.loadRoles();
        this.closeModal();
      });
    } else {
      const newId = Math.max(...this.roles.map(r => r.id), 0) + 1;
      this.currentRole.id = newId;
      this.roleService.createRole(this.currentRole).subscribe(() => {
        this.loadRoles();
        this.closeModal();
      });
    }
  }

  deleteRole(role: any): void {
    if (confirm(`Delete role "${role.name}"?`)) {
      this.roleService.deleteRole(role.id).subscribe(() => {
        this.loadRoles();
      });
    }
  }

  togglePermission(moduleKey: string, action: string): void {
    if (!this.currentRole.permissions[moduleKey]) {
      this.currentRole.permissions[moduleKey] = { view: false, create: false, edit: false, delete: false };
    }
    this.currentRole.permissions[moduleKey][action] = !this.currentRole.permissions[moduleKey][action];
  }

  getPermission(moduleKey: string, action: string): boolean {
    return this.currentRole.permissions?.[moduleKey]?.[action] || false;
  }

  private getEmptyRole(): any {
    const permissions: any = {};
    this.permissionModules?.forEach(m => {
      permissions[m.key] = { view: false, create: false, edit: false, delete: false };
    });
    return { id: 0, name: '', description: '', usersCount: 0, permissions };
  }
}
