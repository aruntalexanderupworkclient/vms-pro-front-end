import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';

import { UserManagementComponent } from './user-management/user-management.component';
import { RoleManagementComponent } from './role-management/role-management.component';
import { PermissionComponent } from './permission/permission.component';

const routes: Routes = [
  { path: 'users', component: UserManagementComponent },
  { path: 'roles', component: RoleManagementComponent },
  { path: 'permissions', component: PermissionComponent }
];

@NgModule({
  declarations: [
    UserManagementComponent,
    RoleManagementComponent,
    PermissionComponent
  ],
  imports: [
    SharedModule,
    RouterModule.forChild(routes)
  ]
})
export class AdminModule {}
