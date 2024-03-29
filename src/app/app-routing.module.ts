import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', loadChildren: () => import('./pages/welcome/welcome.module').then((m) => m.WelcomePageModule) },
  { path: 'tabs', loadChildren: () => import('./pages/tabs/tabs.module').then((m) => m.TabsPageModule) },
  { path: 'login', loadChildren: () => import('./pages/login/login.module').then((m) => m.LoginPageModule) },
  { path: 'callback', loadChildren: () => import('./auth/auth-callback/auth-callback.module').then((m) => m.AuthCallbackPageModule) },
  { path: 'logout', loadChildren: () => import('./auth/end-session/end-session.module').then((m) => m.EndSessionPageModule) },
  { path: 'accessdenied', redirectTo: '', pathMatch: 'full' },
  {
    path: 'offlinescanner',
    loadChildren: () => import('./pages/offlinescanner/offlinescanner.module').then((m) => m.OfflineScannerPageModule),
  },
  {
    path: 'couponscanner',
    loadChildren: () => import('./pages/couponscanner/couponscanner.module').then( m => m.CouponscannerPageModule)
  },
];
@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
