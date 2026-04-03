import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/auth/auth.guard';
import { LayoutComponent } from './layout/layout.component';
import { AccessDeniedComponent } from './features/access-denied/access-denied.component';

const routes: Routes = [
  // Public routes (no layout shell)
  {
    path: 'select-org',
    loadChildren: () => import('./features/auth/auth.module').then(m => m.OrgSelectModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./features/auth/auth.module').then(m => m.AuthModule)
  },

  // Authenticated routes (with layout shell)
  {
    path: '',
    component: LayoutComponent,
    canActivate: [AuthGuard],
    children: [
      { path: 'dashboard', loadChildren: () => import('./features/dashboard/dashboard.module').then(m => m.DashboardModule) },
      { path: 'visitors', loadChildren: () => import('./features/visitors/visitors.module').then(m => m.VisitorsModule) },
      { path: 'tokens', loadChildren: () => import('./features/tokens/tokens.module').then(m => m.TokensModule) },
      { path: 'appointments', loadChildren: () => import('./features/appointments/appointments.module').then(m => m.AppointmentsModule) },
      { path: 'employees', loadChildren: () => import('./features/employees/employees.module').then(m => m.EmployeesModule) },
      { path: 'hosts', loadChildren: () => import('./features/hosts/hosts.module').then(m => m.HostsModule) },
      { path: 'admin', loadChildren: () => import('./features/admin/admin.module').then(m => m.AdminModule) },
      { path: 'reports', loadChildren: () => import('./features/reports/reports.module').then(m => m.ReportsModule) },
      { path: 'settings', loadChildren: () => import('./features/settings/settings.module').then(m => m.SettingsModule) },
      { path: 'mdm', loadChildren: () => import('./features/mdm/mdm.module').then(m => m.MdmModule) },
      { path: '403', component: AccessDeniedComponent },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },

  // Default redirect
  { path: '', redirectTo: 'select-org', pathMatch: 'full' },
  { path: '**', redirectTo: 'select-org' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
