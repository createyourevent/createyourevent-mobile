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

import { OrganizationStarRatingPage } from './organization-star-rating';
import { OrganizationStarRatingUpdatePage } from './organization-star-rating-update';
import { OrganizationStarRating, OrganizationStarRatingService, OrganizationStarRatingDetailPage } from '.';

@Injectable({ providedIn: 'root' })
export class OrganizationStarRatingResolve implements Resolve<OrganizationStarRating> {
  constructor(private service: OrganizationStarRatingService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<OrganizationStarRating> {
    const id = route.params.id ? route.params.id : null;
    if (id) {
      return this.service.find(id).pipe(
        filter((response: HttpResponse<OrganizationStarRating>) => response.ok),
        map((organizationStarRating: HttpResponse<OrganizationStarRating>) => organizationStarRating.body)
      );
    }
    return of(new OrganizationStarRating());
  }
}

const routes: Routes = [
  {
    path: '',
    component: OrganizationStarRatingPage,
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: OrganizationStarRatingUpdatePage,
    resolve: {
      data: OrganizationStarRatingResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: OrganizationStarRatingDetailPage,
    resolve: {
      data: OrganizationStarRatingResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: OrganizationStarRatingUpdatePage,
    resolve: {
      data: OrganizationStarRatingResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  declarations: [OrganizationStarRatingPage, OrganizationStarRatingUpdatePage, OrganizationStarRatingDetailPage],
  imports: [IonicModule, FormsModule, ReactiveFormsModule, CommonModule, TranslateModule, RouterModule.forChild(routes)],
})
export class OrganizationStarRatingPageModule {}
