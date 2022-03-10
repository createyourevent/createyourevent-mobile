import { Platform } from '@ionic/angular';
import { StorageBackend, Requestor } from '@openid/appauth';
import { AuthService, Browser, ConsoleLogObserver } from 'ionic-appauth';
import { environment } from 'src/environments/environment';
import { NgZone } from '@angular/core';
import { Plugins } from '@capacitor/core';

const { App } = Plugins;

export const authFactory = (platform: Platform, ngZone: NgZone, requestor: Requestor, browser: Browser, storage: StorageBackend) => {
  const authService = new AuthService(browser, storage, requestor);

  if (platform.is('mobile') && !platform.is('mobileweb')) {
    environment.oidcConfig.scopes += ' offline_access';
    environment.oidcConfig.redirect_url = 'appauth://callback';
    environment.oidcConfig.end_session_redirect_url = 'appauth://endsession';
    environment.oidcConfig.client_id = 'mobile_app';
  }
  authService.authConfig = environment.oidcConfig;

  if (platform.is('mobile') && !platform.is('mobileweb')) {
    /*
    App.addListener('appUrlOpen', (data: any) => {
      if (data.url !== undefined) {
        ngZone.run(() => {
          authService.authorizationCallback(data.url);
        });
      }
    });
    */
    (window as any).handleOpenURL = (callbackUrl) => {
      ngZone.runTask(() => {
        if (callbackUrl.indexOf(authService.authConfig.redirect_url) === 0) {
          authService.authorizationCallback(callbackUrl);
        } else {
          authService.endSessionCallback();
        }
      });
    };
  }

  authService.addActionObserver(new ConsoleLogObserver());
  return authService;
};
