import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { HostsComponent } from './hosts.component';

const routes: Routes = [{ path: '', component: HostsComponent }];

@NgModule({
  declarations: [HostsComponent],
  imports: [SharedModule, RouterModule.forChild(routes)]
})
export class HostsModule {}
