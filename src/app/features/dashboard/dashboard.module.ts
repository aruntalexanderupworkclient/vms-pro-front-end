import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { ChartsModule } from 'ng2-charts';
import { DashboardComponent } from './dashboard.component';

const routes: Routes = [
  { path: '', component: DashboardComponent }
];

@NgModule({
  declarations: [DashboardComponent],
  imports: [
    SharedModule,
    ChartsModule,
    RouterModule.forChild(routes)
  ]
})
export class DashboardModule {}
