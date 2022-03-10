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

import { Mp3Page } from './mp-3';
import { Mp3UpdatePage } from './mp-3-update';
import { Mp3, Mp3Service, Mp3DetailPage } from '.';

@Injectable({ providedIn: 'root' })
export class Mp3Resolve implements Resolve<Mp3> {
  constructor(private service: Mp3Service) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Mp3> {
    const id = route.params.id ? route.params.id : null;
    if (id) {
      return this.service.find(id).pipe(
        filter((response: HttpResponse<Mp3>) => response.ok),
        map((mp3: HttpResponse<Mp3>) => mp3.body)
      );
    }
    return of(new Mp3());
  }
}

const routes: Routes = [
  {
    path: '',
    component: Mp3Page,
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: Mp3UpdatePage,
    resolve: {
      data: Mp3Resolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: Mp3DetailPage,
    resolve: {
      data: Mp3Resolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: Mp3UpdatePage,
    resolve: {
      data: Mp3Resolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  declarations: [Mp3Page, Mp3UpdatePage, Mp3DetailPage],
  imports: [IonicModule, FormsModule, ReactiveFormsModule, CommonModule, TranslateModule, RouterModule.forChild(routes)],
})
export class Mp3PageModule {}
