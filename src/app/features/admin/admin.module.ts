import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';

import { UserManagementComponent } from './user-management/user-management.component';
import { RoleManagementComponent } from './role-management/role-management.component';
import { PermissionComponent } from './permission/permission.component';
import { OrganisationComponent } from './organisation/organisation.component';
import { OrganisationDialogComponent } from './organisation/organisation-dialog.component';

const routes: Routes = [
  { path: 'users', component: UserManagementComponent },
  { path: 'roles', component: RoleManagementComponent },
  { path: 'permissions', component: PermissionComponent },
  { path: 'organisations', component: OrganisationComponent }
];

@NgModule({
  declarations: [
    UserManagementComponent,
    RoleManagementComponent,
    PermissionComponent,
    OrganisationComponent,
    OrganisationDialogComponent
  ],
  imports: [
    SharedModule,
    RouterModule.forChild(routes)
  ]
})
export class AdminModule {}
