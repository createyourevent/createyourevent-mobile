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

import { WorksheetPage } from './worksheet';
import { WorksheetUpdatePage } from './worksheet-update';
import { Worksheet, WorksheetService, WorksheetDetailPage } from '.';

@Injectable({ providedIn: 'root' })
export class WorksheetResolve implements Resolve<Worksheet> {
  constructor(private service: WorksheetService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Worksheet> {
    const id = route.params.id ? route.params.id : null;
    if (id) {
      return this.service.find(id).pipe(
        filter((response: HttpResponse<Worksheet>) => response.ok),
        map((worksheet: HttpResponse<Worksheet>) => worksheet.body)
      );
    }
    return of(new Worksheet());
  }
}

const routes: Routes = [
  {
    path: '',
    component: WorksheetPage,
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: WorksheetUpdatePage,
    resolve: {
      data: WorksheetResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: WorksheetDetailPage,
    resolve: {
      data: WorksheetResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: WorksheetUpdatePage,
    resolve: {
      data: WorksheetResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  declarations: [WorksheetPage, WorksheetUpdatePage, WorksheetDetailPage],
  imports: [IonicModule, FormsModule, ReactiveFormsModule, CommonModule, TranslateModule, RouterModule.forChild(routes)],
})
export class WorksheetPageModule {}
