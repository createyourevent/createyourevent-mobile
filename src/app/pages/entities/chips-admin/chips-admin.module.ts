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

import { ChipsAdminPage } from './chips-admin';
import { ChipsAdminUpdatePage } from './chips-admin-update';
import { ChipsAdmin, ChipsAdminService, ChipsAdminDetailPage } from '.';

@Injectable({ providedIn: 'root' })
export class ChipsAdminResolve implements Resolve<ChipsAdmin> {
  constructor(private service: ChipsAdminService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<ChipsAdmin> {
    const id = route.params.id ? route.params.id : null;
    if (id) {
      return this.service.find(id).pipe(
        filter((response: HttpResponse<ChipsAdmin>) => response.ok),
        map((chipsAdmin: HttpResponse<ChipsAdmin>) => chipsAdmin.body)
      );
    }
    return of(new ChipsAdmin());
  }
}

const routes: Routes = [
  {
    path: '',
    component: ChipsAdminPage,
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ChipsAdminUpdatePage,
    resolve: {
      data: ChipsAdminResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ChipsAdminDetailPage,
    resolve: {
      data: ChipsAdminResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ChipsAdminUpdatePage,
    resolve: {
      data: ChipsAdminResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  declarations: [ChipsAdminPage, ChipsAdminUpdatePage, ChipsAdminDetailPage],
  imports: [IonicModule, FormsModule, ReactiveFormsModule, CommonModule, TranslateModule, RouterModule.forChild(routes)],
})
export class ChipsAdminPageModule {}
