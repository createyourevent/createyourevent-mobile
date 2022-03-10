import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      {
        path: 'home',
        children: [
          {
            path: '',
            loadChildren: '../home/home.module#HomePageModule',
          },
        ],
      },
      {
        path: 'entities',
        children: [
          {
            path: '',
            loadChildren: '../entities/entities.module#EntitiesPageModule',
          },
        ],
      },
      {
        path: 'account',
        children: [
          {
            path: '',
            loadChildren: '../account/account.module#AccountPageModule',
          },
        ],
      },
      {
        path: 'events',
        children: [
          {
            path: '',
            loadChildren: '../events/events.module#EventsPageModule',
          },
        ],
      },
      {
        path: 'scanner',
        children: [
          {
            path: '',
            loadChildren: '../scanner/scanner.module#ScannerPageModule',
          },
        ],
      },
      {
        path: 'coupons',
        children: [
          {
            path: '',
            loadChildren: '../coupons/coupons.module#CouponsPageModule',
          },
        ],
      },
      {
        path: 'couponscanner',
        children: [
          {
            path: '',
            loadChildren: '../couponscanner/couponscanner.module#CouponscannerPageModule',
          },
        ],
      },
      {
        path: 'tickets',
        children: [
          {
            path: '',
            loadChildren: '../tickets/tickets.module#TicketsPageModule',
          },
        ],
      },
      {
        path: 'reservations',
        children: [
          {
            path: '',
            loadChildren: '../reservations/reservations.module#ReservationsPageModule',
          },
        ],
      },
      {
        path: '',
        redirectTo: '/tabs/home',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '',
    redirectTo: '/tabs/home',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabsPageRoutingModule {}
