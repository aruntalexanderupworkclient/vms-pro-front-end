import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { AppointmentsComponent } from './appointments.component';

const routes: Routes = [
  { path: '', component: AppointmentsComponent }
];

@NgModule({
  declarations: [AppointmentsComponent],
  imports: [SharedModule, RouterModule.forChild(routes)]
})
export class AppointmentsModule {}
