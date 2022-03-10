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

import { ChipsCollectionPage } from './chips-collection';
import { ChipsCollectionUpdatePage } from './chips-collection-update';
import { ChipsCollection, ChipsCollectionService, ChipsCollectionDetailPage } from '.';

@Injectable({ providedIn: 'root' })
export class ChipsCollectionResolve implements Resolve<ChipsCollection> {
  constructor(private service: ChipsCollectionService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<ChipsCollection> {
    const id = route.params.id ? route.params.id : null;
    if (id) {
      return this.service.find(id).pipe(
        filter((response: HttpResponse<ChipsCollection>) => response.ok),
        map((chipsCollection: HttpResponse<ChipsCollection>) => chipsCollection.body)
      );
    }
    return of(new ChipsCollection());
  }
}

const routes: Routes = [
  {
    path: '',
    component: ChipsCollectionPage,
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ChipsCollectionUpdatePage,
    resolve: {
      data: ChipsCollectionResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ChipsCollectionDetailPage,
    resolve: {
      data: ChipsCollectionResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ChipsCollectionUpdatePage,
    resolve: {
      data: ChipsCollectionResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  declarations: [ChipsCollectionPage, ChipsCollectionUpdatePage, ChipsCollectionDetailPage],
  imports: [IonicModule, FormsModule, ReactiveFormsModule, CommonModule, TranslateModule, RouterModule.forChild(routes)],
})
export class ChipsCollectionPageModule {}
