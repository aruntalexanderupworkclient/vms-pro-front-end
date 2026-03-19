import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { OrgSelectComponent } from './org-select/org-select.component';

const loginRoutes: Routes = [
  { path: '', component: LoginComponent }
];

const orgSelectRoutes: Routes = [
  { path: '', component: OrgSelectComponent }
];

@NgModule({
  declarations: [LoginComponent],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(loginRoutes)
  ]
})
export class AuthModule {}

@NgModule({
  declarations: [OrgSelectComponent],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(orgSelectRoutes)
  ]
})
export class OrgSelectModule {}
