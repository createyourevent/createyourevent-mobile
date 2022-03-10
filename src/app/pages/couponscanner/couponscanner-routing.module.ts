import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CouponscannerPage } from './couponscanner.page';

const routes: Routes = [
  {
    path: '',
    component: CouponscannerPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CouponscannerPageRoutingModule {}
