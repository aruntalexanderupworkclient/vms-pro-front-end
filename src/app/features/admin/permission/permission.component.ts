import { Component, OnInit } from '@angular/core';
import { RoleServiceProxy } from '../../../core/service-proxies';
import { PermissionServiceProxy } from '../../../core/service-proxies';

@Component({
  selector: 'app-permission',
  templateUrl: './permission.component.html',
  styleUrls: ['./permission.component.scss']
})
export class PermissionComponent implements OnInit {
  permissions: any[] = [];
  roles: any[] = [];
  permissionModules: string[] = [];
  permissionActions: string[] = [];
  matrix: { [roleId: number]: { [key: string]: boolean } } = {};
  saving = false;

  constructor(
    private roleService: RoleServiceProxy,
    private permissionService: PermissionServiceProxy
  ) {}

  ngOnInit(): void {
    this.roleService.getAllRoles().subscribe(res => {
      this.roles = res.data.items;
    });

    this.permissionService.getAllPermissions().subscribe(res => {
      const perms = res.data.items;
      this.permissions = perms;
      this.permissionModules = [...new Set(perms.map(p => p.module))];
      this.permissionActions = [...new Set(perms.map(p => p.action))];

      // Build matrix: roles x permissions
      this.roles.forEach(role => {
        this.matrix[role.id] = {};
        perms.forEach(perm => {
          this.matrix[role.id][perm.key] = perm.roles.includes(role.name);
        });
      });
    });
  }

  getPermissionKey(module: string, action: string): string {
    const perm = this.permissions.find(p => p.module === module && p.action === action);
    return perm ? perm.key : '';
  }

  isChecked(roleId: number, key: string): boolean {
    return this.matrix[roleId]?.[key] || false;
  }

  togglePermission(roleId: number, key: string): void {
    if (!this.matrix[roleId]) this.matrix[roleId] = {};
    this.matrix[roleId][key] = !this.matrix[roleId][key];
  }

  save(): void {
    this.saving = true;
    // In a real app, send matrix to backend
    // For now, just simulate save
    setTimeout(() => {
      this.saving = false;
      alert('Permissions saved successfully!');
    }, 500);
  }
}
