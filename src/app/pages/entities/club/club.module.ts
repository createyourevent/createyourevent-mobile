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

import { ClubPage } from './club';
import { ClubUpdatePage } from './club-update';
import { Club, ClubService, ClubDetailPage } from '.';

@Injectable({ providedIn: 'root' })
export class ClubResolve implements Resolve<Club> {
  constructor(private service: ClubService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Club> {
    const id = route.params.id ? route.params.id : null;
    if (id) {
      return this.service.find(id).pipe(
        filter((response: HttpResponse<Club>) => response.ok),
        map((club: HttpResponse<Club>) => club.body)
      );
    }
    return of(new Club());
  }
}

const routes: Routes = [
  {
    path: '',
    component: ClubPage,
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ClubUpdatePage,
    resolve: {
      data: ClubResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ClubDetailPage,
    resolve: {
      data: ClubResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ClubUpdatePage,
    resolve: {
      data: ClubResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  declarations: [ClubPage, ClubUpdatePage, ClubDetailPage],
  imports: [IonicModule, FormsModule, ReactiveFormsModule, CommonModule, TranslateModule, RouterModule.forChild(routes)],
})
export class ClubPageModule {}
