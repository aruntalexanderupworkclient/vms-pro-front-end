import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { EmployeesComponent } from './employees.component';

const routes: Routes = [{ path: '', component: EmployeesComponent }];

@NgModule({
  declarations: [EmployeesComponent],
  imports: [SharedModule, RouterModule.forChild(routes)]
})
export class EmployeesModule {}
