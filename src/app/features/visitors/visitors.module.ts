import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';

import { VisitorListComponent } from './visitor-list/visitor-list.component';
import { VisitorRegistrationComponent } from './visitor-registration/visitor-registration.component';
import { PhotoCaptureComponent } from './photo-capture/photo-capture.component';

const routes: Routes = [
  { path: '', component: VisitorListComponent },
  { path: 'register', component: VisitorRegistrationComponent }
];

@NgModule({
  declarations: [
    VisitorListComponent,
    VisitorRegistrationComponent,
    PhotoCaptureComponent
  ],
  imports: [
    SharedModule,
    RouterModule.forChild(routes)
  ]
})
export class VisitorsModule {}
