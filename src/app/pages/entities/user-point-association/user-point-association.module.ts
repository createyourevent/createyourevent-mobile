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

import { UserPointAssociationPage } from './user-point-association';
import { UserPointAssociationUpdatePage } from './user-point-association-update';
import { UserPointAssociation, UserPointAssociationService, UserPointAssociationDetailPage } from '.';

@Injectable({ providedIn: 'root' })
export class UserPointAssociationResolve implements Resolve<UserPointAssociation> {
  constructor(private service: UserPointAssociationService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<UserPointAssociation> {
    const id = route.params.id ? route.params.id : null;
    if (id) {
      return this.service.find(id).pipe(
        filter((response: HttpResponse<UserPointAssociation>) => response.ok),
        map((userPointAssociation: HttpResponse<UserPointAssociation>) => userPointAssociation.body)
      );
    }
    return of(new UserPointAssociation());
  }
}

const routes: Routes = [
  {
    path: '',
    component: UserPointAssociationPage,
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: UserPointAssociationUpdatePage,
    resolve: {
      data: UserPointAssociationResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: UserPointAssociationDetailPage,
    resolve: {
      data: UserPointAssociationResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: UserPointAssociationUpdatePage,
    resolve: {
      data: UserPointAssociationResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  declarations: [UserPointAssociationPage, UserPointAssociationUpdatePage, UserPointAssociationDetailPage],
  imports: [IonicModule, FormsModule, ReactiveFormsModule, CommonModule, TranslateModule, RouterModule.forChild(routes)],
})
export class UserPointAssociationPageModule {}
