import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';

import { MdmDataComponent } from './mdm-data/mdm-data.component';
import { MdmDialogComponent } from './mdm-dialog/mdm-dialog.component';

const routes: Routes = [
  { path: ':type', component: MdmDataComponent }
];

@NgModule({
  declarations: [
    MdmDataComponent,
    MdmDialogComponent
  ],
  imports: [
    SharedModule,
    RouterModule.forChild(routes)
  ]
})
export class MdmModule {}
