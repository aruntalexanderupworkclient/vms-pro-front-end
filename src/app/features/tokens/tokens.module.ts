import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';

import { TokenListComponent } from './token-list/token-list.component';
import { TokenGenerateComponent } from './token-generate/token-generate.component';

const routes: Routes = [
  { path: '', component: TokenListComponent },
  { path: 'generate', component: TokenGenerateComponent }
];

@NgModule({
  declarations: [TokenListComponent, TokenGenerateComponent],
  imports: [
    SharedModule,
    RouterModule.forChild(routes)
  ]
})
export class TokensModule {}
