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

import { ChipsCollectionChipsPage } from './chips-collection-chips';
import { ChipsCollectionChipsUpdatePage } from './chips-collection-chips-update';
import { ChipsCollectionChips, ChipsCollectionChipsService, ChipsCollectionChipsDetailPage } from '.';

@Injectable({ providedIn: 'root' })
export class ChipsCollectionChipsResolve implements Resolve<ChipsCollectionChips> {
  constructor(private service: ChipsCollectionChipsService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<ChipsCollectionChips> {
    const id = route.params.id ? route.params.id : null;
    if (id) {
      return this.service.find(id).pipe(
        filter((response: HttpResponse<ChipsCollectionChips>) => response.ok),
        map((chipsCollectionChips: HttpResponse<ChipsCollectionChips>) => chipsCollectionChips.body)
      );
    }
    return of(new ChipsCollectionChips());
  }
}

const routes: Routes = [
  {
    path: '',
    component: ChipsCollectionChipsPage,
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ChipsCollectionChipsUpdatePage,
    resolve: {
      data: ChipsCollectionChipsResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ChipsCollectionChipsDetailPage,
    resolve: {
      data: ChipsCollectionChipsResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ChipsCollectionChipsUpdatePage,
    resolve: {
      data: ChipsCollectionChipsResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  declarations: [ChipsCollectionChipsPage, ChipsCollectionChipsUpdatePage, ChipsCollectionChipsDetailPage],
  imports: [IonicModule, FormsModule, ReactiveFormsModule, CommonModule, TranslateModule, RouterModule.forChild(routes)],
})
export class ChipsCollectionChipsPageModule {}
