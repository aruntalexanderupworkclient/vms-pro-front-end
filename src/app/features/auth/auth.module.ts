import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule } from '@angular/material/snack-bar';

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
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
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
