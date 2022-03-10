import { NgModule, Injectable } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule, Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { UserRouteAccessService } from '../../../services/auth/user-route-access.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { HttpResponse } from '@angular/common/http';
import { filter, map } from 'rxjs/operators';

import { BondPage } from './bond';
import { BondUpdatePage } from './bond-update';
import { Bond, BondService, BondDetailPage } from '.';

@Injectable({ providedIn: 'root' })
export class BondResolve implements Resolve<Bond> {
  constructor(private service: BondService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Bond> {
    const id = route.params.id ? route.params.id : null;
    if (id) {
      return this.service.find(id).pipe(
        filter((response: HttpResponse<Bond>) => response.ok),
        map((bond: HttpResponse<Bond>) => bond.body)
      );
    }
    return of(new Bond());
  }
}

const routes: Routes = [
  {
    path: '',
    component: BondPage,
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: BondUpdatePage,
    resolve: {
      data: BondResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: BondDetailPage,
    resolve: {
      data: BondResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: BondUpdatePage,
    resolve: {
      data: BondResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  declarations: [BondPage, BondUpdatePage, BondDetailPage],
  imports: [IonicModule, FormsModule, ReactiveFormsModule, CommonModule, TranslateModule, RouterModule.forChild(routes)],
})
export class BondPageModule {}
